import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handle, json } from "@/lib/api";
import { ORDER_STATUSES } from "@/lib/catalog";
import { fulfillOrder } from "@/lib/orders";

export const PATCH = handle(
  async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = await ctx.params;
    const { status } = z
      .object({ status: z.enum(ORDER_STATUSES) })
      .parse(await req.json());

    const order = await db.order.findUnique({ where: { id } });
    if (!order) return json({ error: "Order not found" }, 404);

    if (status === "PAID") {
      await fulfillOrder(id, order.paymentRef ?? undefined);
    } else {
      await db.order.update({ where: { id }, data: { status } });
    }
    return json({ ok: true });
  }
);
