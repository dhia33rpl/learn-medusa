"use client"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-2">
        <p className="text-[10px] tracking-[4px] text-[#a18d72]">ORDER</p>
        <h2 className="font-serif text-2xl font-light">Summary</h2>
      </div>

      <DiscountCode cart={cart} />

      <div className="border-t border-[#e9e6df] pt-5">
        <CartTotals totals={cart} />
      </div>

      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
        className="block w-full border border-[#292821] bg-[#292821] px-6 py-4 text-center text-[10px] uppercase tracking-[3px] text-white transition hover:bg-transparent hover:text-[#292821]"
      >
        Go to checkout
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
