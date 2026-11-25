"use client"

import { useState } from "react"
import { uploadPaymentProof } from "@lib/data/payment-proof"

type Props = {
  orderId: string
  proofUrl?: string
  proofStatus?: string
}

export default function PaymentProofUpload({
  orderId,
  proofUrl,
  proofStatus,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setLoading(true)
    setMessage(null)

    const result = await uploadPaymentProof(orderId, new FormData(form))

    setMessage(
      result.ok ? "Bukti berhasil diunggah." : result.message || "Upload gagal"
    )
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-y-3 border-t border-[#e9e6df] pt-4">
      <p className="text-[10px] uppercase tracking-[3px] text-[#a18d72]">
        Bukti transfer
      </p>

      {proofUrl && (
        <div className="flex flex-col gap-2 text-sm">
          <span className="text-[#77746d]">
            Status:{" "}
            {proofStatus === "approved"
              ? "Disetujui"
              : "Menunggu verifikasi admin"}
          </span>
          <a
            href={proofUrl}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Lihat bukti yang diunggah
          </a>
        </div>
      )}

      {proofStatus !== "approved" && (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-fit bg-[#292821] px-6 py-3 text-xs uppercase tracking-[3px] text-white disabled:opacity-50"
          >
            {loading
              ? "Mengunggah..."
              : proofUrl
                ? "Ganti bukti"
                : "Upload bukti"}
          </button>
        </form>
      )}

      {message && <p className="text-xs text-[#77746d]">{message}</p>}
    </div>
  )
}