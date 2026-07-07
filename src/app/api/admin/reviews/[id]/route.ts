import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handle, json } from "@/lib/api";

export const DELETE = handle(
  async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = await ctx.params;

    const review = await db.review.findUnique({ where: { id } });
    if (!review) return json({ error: "Review not found" }, 404);

    await db.review.delete({ where: { id } });

    const agg = await db.review.aggregate({
      where: { productId: review.productId },
      _avg: { rating: true },
      _count: true,
    });
    await db.product.update({
      where: { id: review.productId },
      data: {
        rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
        reviewCount: agg._count,
      },
    });
    return json({ ok: true });
  }
);
