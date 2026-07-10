import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";
import { fulfillOrder } from "@/lib/orders";

const cardSchema = z.object({
  orderId: z.string(),
  method: z.literal("card").default("card"),
  cardNumber: z.string(),
  expiry: z.string().regex(/^\d{2}\s?\/\s?\d{2}$/, "Use MM/YY format"),
  cvc: z.string().regex(/^\d{3,4}$/, "Invalid CVC"),
  cardName: z.string().min(2),
});

const telebirrSchema = z.object({
  orderId: z.string(),
  method: z.literal("telebirr"),
  phone: z.string(),
});

const schema = z.union([telebirrSchema, cardSchema]);

/**
 * Demo payment gateway — simulates the charge so the full purchase flow works
 * without Stripe/Chapa keys.
 *  - card: accepts the classic test card 4242 4242 4242 4242
 *  - telebirr: accepts any valid Ethiopian mobile number (09…/07…/+2519…/+2517…)
 */
export const POST = handle(async (req: Request) => {
  const user = await requireUser();
  const body = schema.parse(await req.json());

  const order = await db.order.findUnique({ where: { id: body.orderId } });
  if (!order || order.userId !== user.id) return json({ error: "Order not found" }, 404);
  if (order.status === "PAID") return json({ ok: true, orderId: order.id });
  if (order.paymentMethod !== "demo") {
    return json({ error: "This order uses a hosted checkout" }, 400);
  }

  if (body.method === "telebirr") {
    const digits = body.phone.replace(/[\s-]/g, "");
    const valid = /^(\+?251|0)?(9|7)\d{8}$/.test(digits);
    if (!valid) {
      return json(
        { error: "Enter a valid Ethiopian mobile number, e.g. 0911 234 567" },
        402
      );
    }
    await new Promise((r) => setTimeout(r, 900));
    await fulfillOrder(order.id, `telebirr_demo_${Date.now().toString(36)}`);
    await db.order.update({
      where: { id: order.id },
      data: { paymentMethod: "telebirr" },
    });
    return json({ ok: true, orderId: order.id });
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
