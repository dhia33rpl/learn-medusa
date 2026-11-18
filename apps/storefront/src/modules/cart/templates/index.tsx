import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="bg-[#faf9f6] text-[#24231f]">
      <div
        className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16"
        data-testid="cart-container"
      >
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 gap-y-10 small:grid-cols-[1fr_360px] small:gap-x-12">
            <div className="flex flex-col gap-y-6">
              {!customer && (
                <div className="border-b border-[#e9e6df] pb-6">
                  <SignInPrompt />
                </div>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="sticky top-28 flex flex-col gap-y-8">
                {cart && cart.region && (
                  <div className="border border-[#e9e6df] bg-white p-6">
                    <Summary cart={cart} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate