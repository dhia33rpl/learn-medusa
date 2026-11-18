"use client"
import { RadioGroup } from "@headlessui/react"
import { getPaymentInfo, isStripeLike } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripePaymentContainer,
} from "@modules/checkout/components/payment-container"
import { clx } from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: { id: string }[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeLike(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards && ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])?.length > 0 && cart?.total === 0
  )

  const paymentReady =
    (activeSession && (cart?.shipping_methods?.length ?? 0) !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputPaymentDetails =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputPaymentDetails) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const isSubmitDisabled =
    (isStripeLike(selectedPaymentMethod) && !paymentComplete) ||
    (!selectedPaymentMethod && !paidByGiftcard) ||
    isLoading

  return (
    <div className="border-b border-[#e9e6df] pb-8">
      <div className="mb-6 flex flex-row items-center justify-between">
        <h2
          className={clx(
            "flex flex-row items-center gap-x-2 font-serif text-2xl font-light md:text-3xl",
            {
              "pointer-events-none select-none opacity-50":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && (
            <CheckCircleSolid className="text-[#a18d72]" />
          )}
        </h2>
        {!isOpen && paymentReady && (
          <button
            onClick={handleEdit}
            className="text-[10px] uppercase tracking-[3px] text-[#a18d72] underline underline-offset-4 transition hover:text-[#24231f]"
            data-testid="edit-payment-button"
          >
            Edit
          </button>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeLike(paymentMethod.id) ? (
                      <StripePaymentContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        setError={setError}
                        setPaymentComplete={setPaymentComplete}
                      />
                    ) : (
                      <PaymentContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {paidByGiftcard && (
            <div className="flex w-full flex-col gap-y-1 small:w-1/3">
              <p className="mb-1 text-[10px] uppercase tracking-[3px] text-[#a18d72]">
                Payment method
              </p>
              <p
                className="text-sm leading-6 text-[#77746d]"
                data-testid="payment-method-summary"
              >
                Gift card
              </p>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="mt-6 w-full border border-[#292821] bg-[#292821] px-6 py-4 text-[10px] uppercase tracking-[3px] text-white transition hover:bg-transparent hover:text-[#292821] disabled:cursor-not-allowed disabled:opacity-50 small:w-auto"
            data-testid="submit-payment-button"
          >
            {isLoading
              ? "Saving..."
              : !activeSession && isStripeLike(selectedPaymentMethod)
              ? "Enter payment details"
              : "Continue to review"}
          </button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex w-full flex-col gap-y-6 small:flex-row small:items-start small:gap-x-6">
              <div className="flex w-full flex-col gap-y-1 small:w-1/3">
                <p className="mb-1 text-[10px] uppercase tracking-[3px] text-[#a18d72]">
                  Payment method
                </p>
                <p
                  className="text-sm leading-6 text-[#77746d]"
                  data-testid="payment-method-summary"
                >
                  {getPaymentInfo(activeSession?.provider_id)?.title ||
                    activeSession?.provider_id}
                </p>
              </div>
              <div className="flex w-full flex-col gap-y-1 small:w-1/3">
                <p className="mb-1 text-[10px] uppercase tracking-[3px] text-[#a18d72]">
                  Payment details
                </p>
                <div
                  className="flex items-center gap-2 text-sm text-[#77746d]"
                  data-testid="payment-details-summary"
                >
                  <div className="flex h-7 w-fit items-center border border-[#e9e6df] p-2">
                    {getPaymentInfo(selectedPaymentMethod)?.icon || (
                      <CreditCard />
                    )}
                  </div>
                  <span>Another step will appear</span>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex w-full flex-col gap-y-1 small:w-1/3">
              <p className="mb-1 text-[10px] uppercase tracking-[3px] text-[#a18d72]">
                Payment method
              </p>
              <p
                className="text-sm leading-6 text-[#77746d]"
                data-testid="payment-method-summary"
              >
                Gift card
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Payment