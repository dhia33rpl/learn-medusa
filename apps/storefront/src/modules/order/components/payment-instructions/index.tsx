import type { ReactNode } from "react"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"

type PaymentChoice = "transfer" | "qris" | "cod"

const toChoice = (value: unknown): PaymentChoice => {
  if (value === "qris" || value === "cod" || value === "transfer") {
    return value
  }

  return "transfer"
}

const Label = ({ children }: { children: ReactNode }) => (
  <p className="text-[10px] uppercase tracking-[3px] text-[#a18d72]">
    {children}
  </p>
)

const PaymentInstructions = ({ order }: { order: HttpTypes.StoreOrder }) => {
  const choice = toChoice(order.metadata?.payment_choice)

  const total = convertToLocale({
    amount: order.total,
    currency_code: order.currency_code,
  })

  return (
    <div
      className="border border-[#292821] p-8"
      data-testid="payment-instructions"
    >
      {choice === "transfer" && (
        <>
          <Label>Cara pembayaran: Transfer Bank</Label>

          <p className="mt-6 text-[#77746d]">Total yang harus dibayar</p>

          <p className="mb-6 text-2xl">{total}</p>

          <div className="grid gap-6 small:grid-cols-3">
            <div>
              <p className="text-[#77746d]">Bank</p>
              <p className="font-medium">NAMA BANK</p>
            </div>

            <div>
              <p className="text-[#77746d]">Nomor rekening</p>
              <p className="font-medium">0000000000</p>
            </div>

            <div>
              <p className="text-[#77746d]">Atas nama</p>
              <p className="font-medium">NAMA PEMILIK REKENING</p>
            </div>
          </div>

          <p className="mt-6 text-xs leading-6 text-[#77746d]">
            Mohon cantumkan nomor pesanan <b>#{order.display_id}</b> pada
            catatan transfer, lalu kirim bukti pembayaran ke Layanan Pelanggan.
            Pesananmu akan diproses setelah pembayaran kami konfirmasi.
          </p>
        </>
      )}

      {choice === "qris" && (
        <>
          <Label>Cara pembayaran: QRIS</Label>

          <p className="mt-6 text-[#77746d]">Total yang harus dibayar</p>

          <p className="mb-6 text-2xl">{total}</p>

          <img
            src="/qris.png"
            alt="Kode QRIS toko"
            className="mb-6 h-64 w-64 border border-[#e9e6df] object-contain"
          />

          <p className="text-xs leading-6 text-[#77746d]">
            Pindai kode QRIS di atas dengan aplikasi bank atau e-wallet, lalu
            bayar sesuai total. Cantumkan nomor pesanan{" "}
            <b>#{order.display_id}</b> bila ada kolom catatan, dan kirim bukti
            pembayaran ke Layanan Pelanggan. Pesananmu akan diproses setelah
            pembayaran kami konfirmasi.
          </p>
        </>
      )}

      {choice === "cod" && (
        <>
          <Label>Cara pembayaran: COD (Bayar di Tempat)</Label>

          <p className="mt-6 text-[#77746d]">Total yang dibayar ke kurir</p>

          <p className="mb-6 text-2xl">{total}</p>

          <p className="text-xs leading-6 text-[#77746d]">
            Siapkan uang tunai sesuai total saat pesanan{" "}
            <b>#{order.display_id}</b> tiba. Tidak ada pembayaran di muka.
          </p>
        </>
      )}
    </div>
  )
}

export default PaymentInstructions
