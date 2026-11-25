import { cookies as nextCookies } from "next/headers"

import { isManual } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import PaymentProofUpload from "@modules/order/components/payment-proof-upload"
import { HttpTypes } from "@medusajs/types"

type PaymentChoice = "transfer" | "cod"
type BankChoice = "bca" | "bri" | "bni" | "mandiri"

// GANTI semua nomor rekening dan nama pemilik di bawah dengan data asli.
const BANK_ACCOUNTS: Record<
  BankChoice,
  {
    name: string
    accountNumber: string
    accountHolder: string
  }
> = {
  bca: {
    name: "BCA",
    accountNumber: "1234567890",
    accountHolder: "Nama Pemilik BCA",
  },
  bri: {
    name: "BRI",
    accountNumber: "0987654321012",
    accountHolder: "Nama Pemilik BRI",
  },
  bni: {
    name: "BNI",
    accountNumber: "1122334455",
    accountHolder: "Nama Pemilik BNI",
  },
  mandiri: {
    name: "Mandiri",
    accountNumber: "1230009876543",
    accountHolder: "Nama Pemilik Mandiri",
  },
}

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

const getPaymentChoice = (value: unknown): PaymentChoice => {
  if (value === "cod") {
    return "cod"
  }

  return "transfer"
}

const getBankChoice = (value: unknown): BankChoice => {
  if (
    value === "bca" ||
    value === "bri" ||
    value === "bni" ||
    value === "mandiri"
  ) {
    return value
  }

  return "bca"
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  const providerId = order.payment_collections?.[0]?.payments?.[0]?.provider_id

  // Kotak pembayaran tampil jika provider manual, belum terbaca,
  // atau order punya pilihan pembayaran (transfer/cod) di metadata.
  const showManualPayment =
    !providerId || isManual(providerId) || !!order.metadata?.payment_choice

  const choice = getPaymentChoice(order.metadata?.payment_choice)

  const selectedBank = getBankChoice(order.metadata?.payment_bank)

  const bankAccount = BANK_ACCOUNTS[selectedBank]

  const totalToPay = convertToLocale({
    amount: order.total,
    currency_code: order.currency_code,
  })

  const isPaid =
    order.payment_status === "captured" ||
    order.metadata?.payment_proof_status === "approved"

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#faf9f6] py-10 text-[#24231f]">
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center gap-y-10 px-5 md:px-10">
        {isOnboarding && <OnboardingCta orderId={order.id} />}

        <div
          className="flex h-full w-full max-w-4xl flex-col gap-4 border border-[#e9e6df] bg-white p-6 md:p-10"
          data-testid="order-complete-container"
        >
          <div className="mb-4 flex flex-col gap-y-3">
            <p className="text-[10px] tracking-[4px] text-[#a18d72]">
              PESANAN DIKONFIRMASI
            </p>

            <h1 className="font-serif text-3xl font-light md:text-4xl">
              Terima kasih!
            </h1>

            <p className="text-sm text-[#77746d]">Pesananmu berhasil dibuat.</p>
          </div>

          {showManualPayment && (
            <div
              className="flex flex-col gap-y-4 border border-[#292821] p-6"
              data-testid="manual-payment-instructions"
            >
              <p className="text-[10px] uppercase tracking-[3px] text-[#a18d72]">
                Cara pembayaran:{" "}
                {choice === "transfer"
                  ? "Transfer Bank"
                  : "COD (Bayar di Tempat)"}
              </p>

              <div className="flex flex-col gap-y-1 text-sm leading-7">
                <span className="text-[#77746d]">Total yang harus dibayar</span>

                <span className="text-xl font-semibold">{totalToPay}</span>
              </div>

              {choice === "transfer" && (
                <>
                  <div className="grid grid-cols-1 gap-4 text-sm small:grid-cols-3">
                    <div className="flex flex-col">
                      <span className="text-[#77746d]">Bank</span>
                      <span className="font-medium">{bankAccount.name}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[#77746d]">Nomor rekening</span>
                      <span className="font-medium">
                        {bankAccount.accountNumber}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[#77746d]">Atas nama</span>
                      <span className="font-medium">
                        {bankAccount.accountHolder}
                      </span>
                    </div>
                  </div>

                  {!isPaid && (
                    <p className="text-xs leading-6 text-[#77746d]">
                      Mohon cantumkan nomor pesanan{" "}
                      <span className="font-medium text-[#24231f]">
                        #{order.display_id}
                      </span>{" "}
                      pada catatan transfer, lalu unggah bukti pembayaran di
                      bawah ini. Pesananmu akan diproses setelah pembayaran kami
                      konfirmasi.
                    </p>
                  )}

                  {isPaid ? (
                    <p className="border-t border-[#e9e6df] pt-4 text-sm font-medium text-[#24231f]">
                      Pembayaran sudah dikonfirmasi. Terima kasih!
                    </p>
                  ) : (
                    <PaymentProofUpload
                      orderId={order.id}
                      proofUrl={
                        order.metadata?.payment_proof_url as string | undefined
                      }
                      proofStatus={
                        order.metadata?.payment_proof_status as
                          | string
                          | undefined
                      }
                    />
                  )}
                </>
              )}

              {choice === "cod" && (
                <p className="text-xs leading-6 text-[#77746d]">
                  Siapkan uang tunai sebesar total di atas. Pembayaran dilakukan
                  langsung kepada kurir saat pesanan{" "}
                  <span className="font-medium text-[#24231f]">
                    #{order.display_id}
                  </span>{" "}
                  tiba. Tidak ada pembayaran yang perlu dilakukan sekarang.
                </p>
              )}
            </div>
          )}

          <OrderDetails order={order} />

          <h2 className="font-serif text-2xl font-light md:text-3xl">
            Ringkasan
          </h2>

          <Items order={order} />

          <CartTotals totals={order} />

          <ShippingDetails order={order} />

          <PaymentDetails order={order} />

          <Help />
        </div>
      </div>
    </div>
  )
}
