import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="mx-auto flex flex-col gap-y-4 lg:max-w-[500px]">
        {product.collection ? (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-[10px] uppercase tracking-[4px] text-[#a18d72] transition hover:text-[#24231f]"
          >
            {product.collection.title}
          </LocalizedClientLink>
        ) : (
          product.subtitle && (
            <p className="text-[10px] uppercase tracking-[4px] text-[#a18d72]">
              {product.subtitle}
            </p>
          )
        )}

        <h1
          className="font-serif text-3xl font-light leading-tight text-[#24231f] md:text-4xl"
          data-testid="product-title"
        >
          {product.title}
        </h1>

        <p
          className="whitespace-pre-line text-sm leading-7 text-[#77746d]"
          data-testid="product-description"
        >
          {product.description}
        </p>
      </div>
    </div>
  )
}

export default ProductInfo
