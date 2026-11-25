import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-10 md:py-14">
      <div className="mb-10 text-center md:mb-12">
        <p className="mb-3 text-[10px] tracking-[4px] text-[#a18d72]">
          PEMBAYARAN & PENGIRIMAN
        </p>
        <h1 className="font-serif text-3xl font-light md:text-5xl">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 gap-y-10 small:grid-cols-[1fr_416px] small:gap-x-12">
        <PaymentWrapper cart={cart}>
          <CheckoutForm cart={cart} customer={customer} />
        </PaymentWrapper>
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  )
}