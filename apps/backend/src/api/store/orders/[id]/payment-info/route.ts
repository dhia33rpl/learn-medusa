import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Hanya key yang diizinkan yang dikirim ke storefront.
const ALLOWED_KEYS = [
  "payment_choice",
  "payment_bank",
  "payment_proof_url",
  "payment_proof_status",
]

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params

  const query = req.scope.resolve("query")
  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: ["id", "metadata"],
    filters: { id },
  })

  if (!order) {
    return res.status(404).json({ message: "Order tidak ditemukan" })
  }

  const metadata = (order.metadata ?? {}) as Record<string, unknown>

  const result: Record<string, unknown> = {}
  for (const key of ALLOWED_KEYS) {
    if (metadata[key] !== undefined && metadata[key] !== null) {
      result[key] = metadata[key]
    }
  }

  return res.json({ metadata: result })
}