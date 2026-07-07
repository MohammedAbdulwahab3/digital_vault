import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";

export const GET = handle(async () => {
  const user = await requireUser();
  const items = await db.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });
  return json({
    items: items.map((i) => ({
      productId: i.productId,
      slug: i.product.slug,
      name: i.product.name,
      price: i.product.price,
      image: i.product.image,
      category: i.product.category,
    })),
  });
});

export const POST = handle(async (req: Request) => {
  const user = await requireUser();
  const { productId } = z.object({ productId: z.string() }).parse(await req.json());

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product || !product.published) return json({ error: "Product not found" }, 404);

  await db.cartItem.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    create: { userId: user.id, productId },
    update: {},
  });
  return json({ ok: true });
});

export const DELETE = handle(async (req: Request) => {
  const user = await requireUser();
  const productId = new URL(req.url).searchParams.get("productId");
  if (!productId) return json({ error: "productId required" }, 400);

  await db.cartItem.deleteMany({ where: { userId: user.id, productId } });
  return json({ ok: true });
});
