import { db } from "./db";

/**
 * Marks an order PAID (idempotent), increments product sales counters and
 * clears the buyer's cart of the purchased products.
 */
export async function fulfillOrder(orderId: string, paymentRef?: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) throw new Error(`Order ${orderId} not found`);
  if (order.status === "PAID") return order;

  const updated = await db.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      paidAt: new Date(),
      ...(paymentRef ? { paymentRef } : {}),
    },
    include: { items: true },
  });

  for (const item of order.items) {
    await db.product.update({
      where: { id: item.productId },
      data: { salesCount: { increment: 1 } },
    });
  }

  await db.cartItem.deleteMany({
    where: {
      userId: order.userId,
      productId: { in: order.items.map((i) => i.productId) },
    },
  });

  return updated;
}

/** Coupon lookup + validation; returns discount in cents for a subtotal. */
export async function applyCoupon(code: string | undefined, subtotal: number) {
  if (!code) return { discount: 0, couponCode: null as string | null };
  const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (!coupon || !coupon.active || coupon.uses >= coupon.maxUses) {
    throw new CouponError("Invalid or expired coupon code");
  }
  return {
    discount: Math.round((subtotal * coupon.percentOff) / 100),
    couponCode: coupon.code,
  };
}

export class CouponError extends Error {}
