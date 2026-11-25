"use server"

import { revalidatePath } from "next/cache"
import { getAuthHeaders } from "./cookies"

const BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

export async function uploadPaymentProof(
  orderId: string,
  formData: FormData
): Promise<{ ok: boolean; message?: string }> {
  const headers = {
    ...(await getAuthHeaders()),
    "x-publishable-api-key":
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
  }

  try {
    const res = await fetch(
      `${BACKEND_URL}/store/orders/${orderId}/payment-proof`,
      { method: "POST", headers, body: formData }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error("[payment-proof]", res.status, text)

      let message = ""
      try {
        message = JSON.parse(text).message
      } catch {}

      return {
        ok: false,
        message: `Error ${res.status}: ${message || text.slice(0, 120)}`,
      }
    }

    revalidatePath(`/[countryCode]/order/${orderId}/confirmed`, "page")
    return { ok: true }
  } catch (e: any) {
    console.error("[payment-proof] fetch gagal", e)
    return { ok: false, message: `Tidak bisa terhubung: ${e.message}` }
  }
}
