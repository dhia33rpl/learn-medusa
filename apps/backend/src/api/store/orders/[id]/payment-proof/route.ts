import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const { id } = req.params;
  const file = (req as any).file as
    { originalname: string; mimetype: string; buffer: Buffer } | undefined;

  if (!file) {
    return res.status(400).json({ message: "File wajib diunggah" });
  }

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return res
      .status(400)
      .json({ message: "Format harus JPG, PNG, atau WEBP" });
  }

  const query = req.scope.resolve("query");
  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: ["id", "customer_id", "metadata"],
    filters: { id },
  });

  // hanya pemilik order yang boleh upload
  if (!order || order.customer_id !== req.auth_context.actor_id) {
    return res.status(404).json({ message: "Order tidak ditemukan" });
  }

  const { result } = await uploadFilesWorkflow(req.scope).run({
    input: {
      files: [
        {
          filename: file.originalname,
          mimeType: file.mimetype,
          content: file.buffer.toString("binary"),
          access: "public",
        },
      ],
    },
  });

  const orderService = req.scope.resolve(Modules.ORDER);
  await orderService.updateOrders(id, {
    metadata: {
      ...(order.metadata || {}),
      payment_proof_url: result[0].url,
      payment_proof_status: "pending",
    },
  });

  return res.json({ url: result[0].url, status: "pending" });
}
