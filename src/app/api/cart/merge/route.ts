import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";

const schema = z.object({
  cartProductIds: z.array(z.string()).max(100).default([]),
  wishlistProductIds: z.array(z.string()).max(200).default([]),
});

export const POST = handle(async (req: Request) => {
  const user = await requireUser();
  const body = schema.parse(await req.json());

  const validIds = new Set(
    (
      await db.product.findMany({
        where: {
          id: { in: [...body.cartProductIds, ...body.wishlistProductIds] },
          published: true,
        },
        select: { id: true },
      })
    ).map((p) => p.id)
  );

  for (const productId of body.cartProductIds) {
    if (!validIds.has(productId)) continue;
    await db.cartItem.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      create: { userId: user.id, productId },
      update: {},
    });
  }
  for (const productId of body.wishlistProductIds) {
    if (!validIds.has(productId)) continue;
    await db.wishlistItem.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      create: { userId: user.id, productId },
      update: {},
    });
  }
  return json({ ok: true });
});
