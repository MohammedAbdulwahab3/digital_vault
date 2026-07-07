import { handle, json } from "@/lib/api";
import { stripeEnabled, getStripe } from "@/lib/stripe";
import { fulfillOrder } from "@/lib/orders";

export const POST = handle(async (req: Request) => {
  if (!stripeEnabled()) return json({ error: "Stripe not configured" }, 501);

  const stripe = getStripe();
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const payload = await req.text();

  let event;
  if (secret && signature) {
    try {
      event = await stripe.webhooks.constructEventAsync(payload, signature, secret);
    } catch {
      return json({ error: "Invalid signature" }, 400);
    }
  } else {
    // No webhook secret configured (local testing) — trust the payload shape.
    event = JSON.parse(payload);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { orderId?: string }; id: string };
    if (session.metadata?.orderId) {
      await fulfillOrder(session.metadata.orderId, session.id);
    }
  }

  return json({ received: true });
});
