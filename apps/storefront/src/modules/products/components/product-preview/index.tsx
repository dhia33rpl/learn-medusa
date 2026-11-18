import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured: _isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const image = product.thumbnail ?? product.images?.[0]?.url
  const tag = product.tags?.[0]?.value

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
    >
      <div data-testid="product-wrapper">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#eeeae3]">
          {image ? (
            <img
              src={image}
              alt={product.title ?? "Product"}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] tracking-[3px] text-[#a18d72]">
              VELORA
            </div>
          )}

          {tag && (
            <span className="absolute left-3 top-3 bg-[#faf9f6] px-3 py-2 text-[8px] uppercase tracking-[2px]">
              {tag}
            </span>
          )}
        </div>

        <div className="pt-4">
          {product.subtitle && (
            <p className="text-[9px] uppercase tracking-[2px] text-[#a18d72]">
              {product.subtitle}
            </p>
          )}
          <h3
            className="mt-2 text-xs font-medium text-[#24231f] md:text-sm"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          <div className="mt-2 flex items-center gap-x-2 text-xs text-[#77746d]">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
