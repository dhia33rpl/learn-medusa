import { Suspense } from "react"


import PaginatedProducts from "./paginated-products"
import StoreSort from "../../../app/[countryCode]/(main)/store/components/store-sort"

type SortValue = "created_at" | "price_asc" | "price_desc"

const StoreTemplate = ({
  countryCode,
  page,
  sortBy,
}: {
  countryCode: string
  page: number
  sortBy: SortValue
}) => {
  return (
    <div className="bg-[#faf9f6] text-[#24231f]">
      <div
        className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16"
        data-testid="category-container"
      >
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-[10px] tracking-[4px] text-[#a18d72]">
            DIKURASI UNTUK ANDA
          </p>
          <h1
            className="font-serif text-3xl font-light md:text-5xl"
            data-testid="store-page-title"
          >
            Semua Produk
          </h1>
        </div>

        <div className="flex flex-col small:flex-row small:items-start">
          <StoreSort sortBy={sortBy} />

          <div className="w-full min-w-0">
            <Suspense
              fallback={
                <p className="text-sm text-[#77746d]">Memuat produk...</p>
              }
            >
              <PaginatedProducts
                sortBy={sortBy}
                page={page}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate