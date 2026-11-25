import { retrieveOrder, retrievePaymentInfo } from "@lib/data/orders"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}
export const metadata: Metadata = {
  title: "Pesanan Dikonfirmasi",
  description: "Pembelianmu berhasil",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params

  const [order, paymentInfo] = await Promise.all([
    retrieveOrder(params.id).catch(() => null),
    retrievePaymentInfo(params.id),
  ])

  if (!order) {
    return notFound()
  }

  // Gabungkan data pembayaran ke order supaya template bisa membacanya.
  const orderWithPayment = {
    ...order,
    metadata: { ...(order.metadata ?? {}), ...paymentInfo },
  }

  return <OrderCompletedTemplate order={orderWithPayment} />
}