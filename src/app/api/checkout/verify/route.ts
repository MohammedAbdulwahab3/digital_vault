import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";
import { stripeEnabled, getStripe } from "@/lib/stripe";
import { fulfillOrder } from "@/lib/orders";

/**
 * Fallback payment confirmation for local dev where the Stripe webhook can't
 * reach us: the success page calls this with the checkout session id.
 */
export const GET = handle(async (req: Request) => {
  const user = await requireUser();
  const url = new URL(req.url);
  const orderId = url.searchParams.get("order");
  const sessionId = url.searchParams.get("session_id");
  if (!orderId) return json({ error: "order required" }, 400);

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order || order.userId !== user.id) return json({ error: "Order not found" }, 404);

  if (order.status === "PAID") return json({ status: "PAID" });

  if (order.paymentMethod === "stripe" && stripeEnabled() && sessionId) {
    if (order.paymentRef && order.paymentRef !== sessionId) {
      return json({ error: "Session mismatch" }, 400);
    }
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.metadata?.orderId === order.id && session.payment_status === "paid") {
      await fulfillOrder(order.id, sessionId);
      return json({ status: "PAID" });
    }
  }

  return json({ status: order.status });
});
