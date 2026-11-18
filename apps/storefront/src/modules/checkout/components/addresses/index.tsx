"use client"
import { setAddresses } from "@lib/data/cart"
import useToggleState from "@lib/hooks/use-toggle-state"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"

const ContinueButton = () => {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full border border-[#292821] bg-[#292821] px-6 py-4 text-[10px] uppercase tracking-[3px] text-white transition hover:bg-transparent hover:text-[#292821] disabled:cursor-not-allowed disabled:opacity-50 small:w-auto"
      data-testid="submit-address-button"
    >
      {pending ? "Saving..." : "Continue to delivery"}
    </button>
  )
}

const SummaryBlock = ({
  title,
  testId,
  children,
}: {
  title: string
  testId: string
  children: React.ReactNode
}) => (
  <div
    className="flex w-full flex-col gap-y-1 small:w-1/3"
    data-testid={testId}
  >
    <p className="mb-1 text-[10px] uppercase tracking-[3px] text-[#a18d72]">
      {title}
    </p>
    <div className="flex flex-col text-sm leading-6 text-[#77746d]">
      {children}
    </div>
  </div>
)

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="border-b border-[#e9e6df] pb-8">
      <div className="mb-6 flex flex-row items-center justify-between">
        <h2 className="flex flex-row items-center gap-x-2 font-serif text-2xl font-light md:text-3xl">
          Shipping Address
          {!isOpen && <CheckCircleSolid className="text-[#a18d72]" />}
        </h2>
        {!isOpen && cart?.shipping_address && (
          <button
            onClick={handleEdit}
            className="text-[10px] uppercase tracking-[3px] text-[#a18d72] underline underline-offset-4 transition hover:text-[#24231f]"
            data-testid="edit-address-button"
          >
            Edit
          </button>
        )}
      </div>

      {isOpen ? (
        <form action={formAction}>
          <div>
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <h2 className="pb-6 pt-8 font-serif text-2xl font-light md:text-3xl">
                  Billing address
                </h2>

                <BillingAddress cart={cart} />
              </div>
            )}
            <ContinueButton />
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          {cart && cart.shipping_address ? (
            <div className="flex flex-col gap-y-6 small:flex-row small:items-start small:gap-x-6">
              <SummaryBlock
                title="Shipping Address"
                testId="shipping-address-summary"
              >
                <span>
                  {cart.shipping_address.first_name}{" "}
                  {cart.shipping_address.last_name}
                </span>
                <span>
                  {cart.shipping_address.address_1}{" "}
                  {cart.shipping_address.address_2}
                </span>
                <span>
                  {cart.shipping_address.postal_code},{" "}
                  {cart.shipping_address.city}
                </span>
                <span>{cart.shipping_address.country_code?.toUpperCase()}</span>
              </SummaryBlock>

              <SummaryBlock title="Contact" testId="shipping-contact-summary">
                <span>{cart.shipping_address.phone}</span>
                <span>{cart.email}</span>
              </SummaryBlock>

              <SummaryBlock
                title="Billing Address"
                testId="billing-address-summary"
              >
                {sameAsBilling ? (
                  <span>Billing and delivery address are the same.</span>
                ) : (
                  <>
                    <span>
                      {cart.billing_address?.first_name}{" "}
                      {cart.billing_address?.last_name}
                    </span>
                    <span>
                      {cart.billing_address?.address_1}{" "}
                      {cart.billing_address?.address_2}
                    </span>
                    <span>
                      {cart.billing_address?.postal_code},{" "}
                      {cart.billing_address?.city}
                    </span>
                    <span>
                      {cart.billing_address?.country_code?.toUpperCase()}
                    </span>
                  </>
                )}
              </SummaryBlock>
            </div>
          ) : (
            <div>
              <Spinner />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Addresses
