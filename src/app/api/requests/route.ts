import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";
import { CATEGORIES } from "@/lib/catalog";

const schema = z.object({
  title: z.string().min(5).max(120),
  category: z.string().refine((c) => CATEGORIES.some((cat) => cat.slug === c), {
    message: "Unknown category",
  }),
  description: z.string().min(30).max(5000),
  budget: z.number().int().min(0).max(100_000_000).nullable().optional(),
  deadline: z.string().datetime().nullable().optional(),
  // Optional: request customization of an existing product
  productId: z.string().nullable().optional(),
});

/** Submit a custom design request, optionally attached to a product. */
export const POST = handle(async (req: Request) => {
  const user = await requireUser();
  const data = schema.parse(await req.json());

  let productId: string | null = null;
  let category = data.category;
  if (data.productId) {
    const product = await db.product.findUnique({ where: { id: data.productId } });
    if (!product) return json({ error: "Product not found" }, 404);
    productId = product.id;
    category = product.category;
  }

  const request = await db.customRequest.create({
    data: {
      userId: user.id,
      productId,
      title: data.title,
      category,
      description: data.description,
      budget: data.budget ?? null,
      deadline: data.deadline ? new Date(data.deadline) : null,
    },
  });

  return json({ id: request.id }, 201);
});
