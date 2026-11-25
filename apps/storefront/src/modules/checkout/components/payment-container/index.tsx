import { Radio as RadioGroupOption } from "@headlessui/react"
import { clx } from "@modules/common/components/ui"
import React, { useContext } from "react"

import Radio from "@modules/common/components/radio"

import { getPaymentInfo, isManual } from "@lib/constants"
import { getPaymentErrorMessage } from "@lib/util/payment-error"
import SkeletonCardDetails from "@modules/skeletons/components/skeleton-card-details"
import { PaymentElement } from "@stripe/react-stripe-js"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  children?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  disabled = false,
  children,
}) => {
  const paymentInfo = getPaymentInfo(paymentProviderId)
  const manual = isManual(paymentProviderId)
  const selected = selectedPaymentOptionId === paymentProviderId

  const title = manual
    ? "Bank Transfer"
    : paymentInfo?.title || paymentProviderId

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "mb-2 flex cursor-pointer flex-col gap-y-2 border px-6 py-4 text-sm transition",
        {
          "border-[#292821] bg-white": selected,
          "border-[#d8d4cc] hover:border-[#292821]": !selected && !disabled,
          "cursor-not-allowed opacity-50": disabled,
        }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Radio checked={selected} />
          <span className="text-[#24231f]">{title}</span>
        </div>
        <span className="justify-self-end text-[#24231f]">
          {paymentInfo?.icon}
        </span>
      </div>

      {manual && selected && (
        <p className="pl-8 text-xs leading-6 text-[#77746d]">
          Lakukan pembayaran setelah menempatkan pesanan Anda. Detail rekening
          bank akan ditampilkan pada halaman konfirmasi.
        </p>
      )}

      {children}
    </RadioGroupOption>
  )
}

export default PaymentContainer

export const StripePaymentContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  disabled = false,
  setError,
  setPaymentComplete,
}: Omit<PaymentContainerProps, "children"> & {
  setError: (error: string | null) => void
  setPaymentComplete: (complete: boolean) => void
}) => {
  const stripeReady = useContext(StripeContext)

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <div className="my-4 transition-all duration-150 ease-in-out">
            <p className="mb-1 text-[10px] uppercase tracking-[3px] text-[#a18d72]">
              Masukan detail pembayaran anda
            </p>
            <PaymentElement
              options={{ layout: "accordion" }}
              onChange={(e) => {
                setError(null)
                setPaymentComplete(e.complete)
              }}
              // Without a handler Stripe.js reports a failed mount as an
              // unhandled "payment Element loaderror" and the option renders
              // blank with no explanation. Surface it in the checkout's own
              // error slot instead.
              onLoadError={(e) => {
                setPaymentComplete(false)
                setError(
                  getPaymentErrorMessage(e.error) ??
                    "Could not load the payment methods."
                )
              }}
            />
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}
