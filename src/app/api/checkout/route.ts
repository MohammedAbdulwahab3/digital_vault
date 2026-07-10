import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handle, json } from "@/lib/api";
import { orderNumber } from "@/lib/utils";
import { stripeEnabled, getStripe, appUrl } from "@/lib/stripe";
import { chapaEnabled, chapaInitialize } from "@/lib/chapa";
import { applyCoupon, CouponError } from "@/lib/orders";

const schema = z.object({
  couponCode: z.string().max(40).optional(),
});

/**
 * Creates a PENDING order from the user's server-side cart.
 * With Stripe configured → returns a Stripe Checkout URL.
 * Without → returns { demo: true } and the client drives the demo gateway.
 */
export const POST = handle(async (req: Request) => {
  const user = await requireUser();
  const body = schema.parse(await req.json().catch(() => ({})));

  const cartItems = await db.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });
  if (cartItems.length === 0) return json({ error: "Your cart is empty" }, 400);

  // Skip products already owned (paid orders)
  const owned = await db.orderItem.findMany({
    where: {
      order: { userId: user.id, status: "PAID" },
      productId: { in: cartItems.map((c) => c.productId) },
    },
    select: { productId: true },
  });
  const ownedIds = new Set(owned.map((o) => o.productId));
  const purchasable = cartItems.filter((c) => !ownedIds.has(c.productId));
  if (purchasable.length === 0) {
    return json({ error: "You already own everything in your cart" }, 400);
  }

  const subtotal = purchasable.reduce((sum, c) => sum + c.product.price, 0);

  let discount = 0;
  let couponCode: string | null = null;
  try {
    ({ discount, couponCode } = await applyCoupon(body.couponCode, subtotal));
  } catch (err) {
    if (err instanceof CouponError) return json({ error: err.message }, 400);
    throw err;
  }
  const total = Math.max(subtotal - discount, 0);

  const order = await db.order.create({
    data: {
      orderNumber: orderNumber(),
      userId: user.id,
      status: "PENDING",
      subtotal,
      discount,
      couponCode,
      total,
      paymentMethod: chapaEnabled() ? "chapa" : stripeEnabled() ? "stripe" : "demo",
      items: {
        create: purchasable.map((c) => ({
          productId: c.productId,
          name: c.product.name,
          price: c.product.price,
        })),
      },
    },
  });

  if (couponCode) {
    await db.coupon.update({
      where: { code: couponCode },
      data: { uses: { increment: 1 } },
    });
  }

  if (chapaEnabled()) {
    // Ethiopian gateway: Telebirr, CBE Birr, M-Pesa and cards, charged in ETB
    const { checkoutUrl } = await chapaInitialize({
      amountUsdCents: total,
      email: user.email,
      firstName: user.name.split(" ")[0] ?? "Customer",
      txRef: order.id,
      returnUrl: `${appUrl()}/checkout/success?order=${order.id}`,
      title: "PixelVault",
    });
    await db.order.update({
      where: { id: order.id },
      data: { paymentRef: order.id },
    });
    return json({ url: checkoutUrl, orderId: order.id });
  }

  if (stripeEnabled()) {
    const stripe = getStripe();
    // Distribute the discount proportionally by charging the discounted total
    // as a single line when a coupon is applied; otherwise use real line items.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      line_items:
        discount > 0
          ? [
              {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: `PixelVault order ${order.orderNumber}`,
                    description: purchasable.map((c) => c.product.name).join(", "),
                  },
                  unit_amount: total,
                },
                quantity: 1,
              },
            ]
          : purchasable.map((c) => ({
              price_data: {
                currency: "usd",
                product_data: {
                  name: c.product.name,
                  description: c.product.description.slice(0, 200),
                },
                unit_amount: c.product.price,
              },
              quantity: 1,
            })),
      metadata: { orderId: order.id },
      success_url: `${appUrl()}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl()}/checkout?canceled=1`,
    });
    await db.order.update({
      where: { id: order.id },
      data: { paymentRef: session.id },
    });
    return json({ url: session.url, orderId: order.id });
  }

  return json({ demo: true, orderId: order.id, total });
});
