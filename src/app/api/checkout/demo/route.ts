import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";
import { fulfillOrder } from "@/lib/orders";

const schema = z.object({
  orderId: z.string(),
  cardNumber: z.string(),
  expiry: z.string().regex(/^\d{2}\s?\/\s?\d{2}$/, "Use MM/YY format"),
  cvc: z.string().regex(/^\d{3,4}$/, "Invalid CVC"),
  cardName: z.string().min(2),
});

/**
 * Demo payment gateway — simulates a card charge so the full purchase flow
 * works without Stripe keys. Accepts the classic test card 4242 4242 4242 4242
 * (any other number is declined, like a real gateway would).
 */
export const POST = handle(async (req: Request) => {
  const user = await requireUser();
  const body = schema.parse(await req.json());

  const order = await db.order.findUnique({ where: { id: body.orderId } });
  if (!order || order.userId !== user.id) return json({ error: "Order not found" }, 404);
  if (order.status === "PAID") return json({ ok: true, orderId: order.id });
  if (order.paymentMethod !== "demo") {
    return json({ error: "This order uses Stripe checkout" }, 400);
  }

  const digits = body.cardNumber.replace(/\s+/g, "");
  if (digits !== "4242424242424242") {
    await db.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    return json(
      { error: "Card declined — use test card 4242 4242 4242 4242" },
      402
    );
  }

  // Simulate processing latency for realism
  await new Promise((r) => setTimeout(r, 900));

  await fulfillOrder(order.id, `demo_${Date.now().toString(36)}`);
  return json({ ok: true, orderId: order.id });
});
