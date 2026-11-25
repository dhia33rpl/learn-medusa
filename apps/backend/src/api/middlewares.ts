import { defineMiddlewares, authenticate } from "@medusajs/framework/http";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default defineMiddlewares({
  routes: [
    {
      method: ["POST"],
      matcher: "/store/orders/:id/payment-proof",
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        upload.single("file") as any,
      ],
    },
  ],
});


