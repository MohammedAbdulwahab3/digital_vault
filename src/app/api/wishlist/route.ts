import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";

export const GET = handle(async () => {
  const user = await requireUser();
  const items = await db.wishlistItem.findMany({
    where: { userId: user.id },
    select: { productId: true },
  });
  return json({ productIds: items.map((i) => i.productId) });
});

/** Toggles a product in the wishlist. */
export const POST = handle(async (req: Request) => {
  const user = await requireUser();
  const { productId } = z.object({ productId: z.string() }).parse(await req.json());

  const existing = await db.wishlistItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });
  if (existing) {
    await db.wishlistItem.delete({ where: { id: existing.id } });
    return json({ wishlisted: false });
  }
  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) return json({ error: "Product not found" }, 404);

  await db.wishlistItem.create({ data: { userId: user.id, productId } });
  return json({ wishlisted: true });
});
