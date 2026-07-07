import { db } from "@/lib/db";
import { OrdersTable } from "./orders-table";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Orders" };

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Orders</h1>
      <p className="mt-2 text-fog-2">{orders.length} orders across the store.</p>
      <OrdersTable
        orders={orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customer: o.user.name,
          email: o.user.email,
          items: o.items.map((i) => i.name),
          total: o.total,
          discount: o.discount,
          couponCode: o.couponCode,
          status: o.status,
          paymentMethod: o.paymentMethod,
          createdAt: o.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
