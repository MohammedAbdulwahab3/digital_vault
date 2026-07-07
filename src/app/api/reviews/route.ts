import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";

const schema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(80).default(""),
  body: z.string().min(10).max(2000),
});

/** Verified-purchase reviews: only buyers of a product may review it. */
export const POST = handle(async (req: Request) => {
  const user = await requireUser();
  const data = schema.parse(await req.json());

  const purchased = await db.orderItem.findFirst({
    where: {
      productId: data.productId,
      order: { userId: user.id, status: "PAID" },
    },
  });
  if (!purchased) {
    return json({ error: "Only verified buyers can review this product" }, 403);
  }

  await db.review.upsert({
    where: { userId_productId: { userId: user.id, productId: data.productId } },
    create: { userId: user.id, ...data },
    update: { rating: data.rating, title: data.title, body: data.body },
  });

  // Recompute the product's rating rollup
  const agg = await db.review.aggregate({
    where: { productId: data.productId },
    _avg: { rating: true },
    _count: true,
  });
  await db.product.update({
    where: { id: data.productId },
    data: {
      rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      reviewCount: agg._count,
    },
  });

  return json({ ok: true }, 201);
});
