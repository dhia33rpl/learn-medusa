import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import { HttpTypes } from "@medusajs/types"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <div className="sticky top-8 flex flex-col-reverse gap-y-8 py-8 small:flex-col small:py-0">
      <div className="flex w-full flex-col border border-[#e9e6df] bg-white p-6">
        <div className="mb-5 flex flex-col gap-y-2">
          <p className="text-[10px] tracking-[4px] text-[#a18d72]">ORDER</p>
          <h2 className="font-serif text-2xl font-light">In your bag</h2>
        </div>

        <div className="border-t border-[#e9e6df] pt-5">
          <CartTotals totals={cart} />
        </div>

        <div className="mt-6 border-t border-[#e9e6df] pt-2">
          <ItemsPreviewTemplate cart={cart} />
        </div>

        <div className="mt-6 border-t border-[#e9e6df] pt-4">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary