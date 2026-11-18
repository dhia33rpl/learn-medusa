import React, { Suspense } from "react"

import VariantImageGallery from "@modules/products/components/image-gallery/variant-image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="bg-[#faf9f6] text-[#24231f]">
      <div
        className="relative mx-auto flex max-w-[1400px] flex-col gap-y-10 px-5 py-8 md:px-10 small:flex-row small:items-start small:gap-x-10 small:py-14"
        data-testid="product-container"
      >
        {/* Kiri: info + tab */}
        <div className="flex w-full flex-col gap-y-6 small:sticky small:top-28 small:max-w-[300px]">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>

        {/* Tengah: galeri */}
        <div className="relative block w-full">
          <VariantImageGallery product={product} />
        </div>

        {/* Kanan: pilih variant + add to cart */}
        <div className="flex w-full flex-col gap-y-12 small:sticky small:top-28 small:max-w-[300px]">
          <ProductOnboardingCta />
          <ProductActions product={product} region={region} />
        </div>
      </div>

      {/* Produk terkait */}
      <div
        className="mx-auto max-w-[1400px] border-t border-[#e9e6df] px-5 py-16 md:px-10 small:py-24"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
