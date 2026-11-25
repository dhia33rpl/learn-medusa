import { notFound } from "next/navigation"
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  const children = category.category_children ?? []

  return (
    <div className="bg-[#faf9f6] text-[#24231f]">
      <div
        className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16"
        data-testid="category-container"
      >
        {/* Judul halaman */}
        <div className="mb-10 text-center md:mb-14">
          {parents.length > 0 ? (
            <p className="mb-3 flex flex-wrap items-center justify-center gap-x-2 text-[10px] uppercase tracking-[4px] text-[#a18d72]">
              {parents
                .slice()
                .reverse()
                .map((parent) => (
                  <span key={parent.id} className="flex items-center gap-x-2">
                    <LocalizedClientLink
                      className="transition hover:text-[#24231f]"
                      href={`/categories/${parent.handle}`}
                      data-testid="sort-by-link"
                    >
                      {parent.name}
                    </LocalizedClientLink>
                    <span>/</span>
                  </span>
                ))}
            </p>
          ) : (
            <p className="mb-3 text-[10px] tracking-[4px] text-[#a18d72]">
              TEMUKAN GAYAMU
            </p>
          )}

          <h1
            className="font-serif text-3xl font-light md:text-5xl"
            data-testid="category-page-title"
          >
            {category.name}
          </h1>

          {category.description && (
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#77746d]">
              {category.description}
            </p>
          )}

          {children.length > 0 && (
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {children.map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink
                    href={`/categories/${c.handle}`}
                    className="inline-block border border-[#292821] px-6 py-3 text-[10px] uppercase tracking-[3px] transition hover:bg-[#292821] hover:text-white"
                  >
                    {c.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Filter + produk */}
        <div className="flex flex-col small:flex-row small:items-start">
          <RefinementList
            sortBy={sort}
            data-testid="sort-by-container"
            hideOptionsPicker
          />
          <div className="w-full">
            <Suspense
              fallback={
                <SkeletonProductGrid
                  numberOfProducts={category.products?.length ?? 8}
                />
              }
            >
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                categoryId={category.id}
                countryCode={countryCode}
                optionValueIds={optionValueIds}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
