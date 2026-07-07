import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handle, json } from "@/lib/api";
import { productSchema, toProductData } from "@/lib/product-schema";

export const PATCH = handle(
  async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = await ctx.params;
    const data = productSchema.parse(await req.json());

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return json({ error: "Product not found" }, 404);

    const product = await db.product.update({
      where: { id },
      data: toProductData(data),
    });
    return json({ product });
  }
);

export const DELETE = handle(
  async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = await ctx.params;

    const sold = await db.orderItem.count({ where: { productId: id } });
    if (sold > 0) {
      // Keep purchase history intact — unpublish instead of hard delete
      await db.product.update({ where: { id }, data: { published: false } });
      return json({ unpublished: true });
    }
    await db.product.delete({ where: { id } });
    return json({ deleted: true });
  }
);
