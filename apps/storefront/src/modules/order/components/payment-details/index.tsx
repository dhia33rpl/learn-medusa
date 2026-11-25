import { Container, Heading, Text } from "@modules/common/components/ui"

import { getPaymentInfo, isStripeLike } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

type PaymentChoice = "transfer" | "qris" | "cod"

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]

  const paymentChoice = order.metadata?.payment_choice as
    | PaymentChoice
    | undefined

  const isPaid =
    order.payment_status === "captured" ||
    order.metadata?.payment_proof_status === "approved"

  const paymentInfo = payment ? getPaymentInfo(payment.provider_id) : undefined

  const paymentMethod =
    paymentChoice === "transfer"
      ? "Transfer Bank"
      : paymentChoice === "qris"
      ? "QRIS"
      : paymentChoice === "cod"
      ? "COD (Bayar di Tempat)"
      : paymentInfo?.title || payment?.provider_id || "-"

  const getPaymentDescription = () => {
    if (paymentChoice === "transfer") {
      return isPaid
        ? "Pembayaran transfer telah dikonfirmasi."
        : "Menunggu konfirmasi pembayaran transfer."
    }

    if (paymentChoice === "qris") {
      return isPaid
        ? "Pembayaran QRIS telah dikonfirmasi."
        : "Menunggu konfirmasi pembayaran QRIS."
    }

    if (paymentChoice === "cod") {
      return "Pembayaran dilakukan kepada kurir saat pesanan diterima."
    }

    return null
  }

  const paymentDescription = getPaymentDescription()

  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        Payment
      </Heading>

      {payment && (
        <div className="flex items-start gap-x-1 w-full">
          <div className="flex flex-col w-1/3">
            <Text className="txt-medium-plus text-ui-fg-base mb-1">
              Payment method
            </Text>

            <Text
              className="txt-medium text-ui-fg-subtle"
              data-testid="payment-method"
            >
              {paymentMethod}
            </Text>
          </div>

          <div className="flex flex-col w-2/3">
            <Text className="txt-medium-plus text-ui-fg-base mb-1">
              Payment details
            </Text>

            <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
              <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                {paymentInfo?.icon}
              </Container>

              <Text data-testid="payment-amount">
                {paymentDescription ||
                  (isStripeLike(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} paid at ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleString()}`)}
              </Text>
            </div>
          </div>
        </div>
      )}

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails

