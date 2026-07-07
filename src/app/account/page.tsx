import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Account" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const [orders, itemCount, requests, wishlistCount] = await Promise.all([
    db.order.findMany({
      where: { userId: user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.orderItem.count({ where: { order: { userId: user.id, status: "PAID" } } }),
    db.customRequest.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
    db.wishlistItem.count({ where: { userId: user.id } }),
  ]);

  const totalSpent = orders
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Products owned", value: String(itemCount), icon: "🗃️" },
    { label: "Total invested", value: formatPrice(totalSpent), icon: "💎" },
    { label: "Open requests", value: String(requests.filter((r) => !["COMPLETED", "DECLINED"].includes(r.status)).length), icon: "💬" },
    { label: "Wishlisted", value: String(wishlistCount), icon: "❤️" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Hey, <span className="text-gradient">{user.name.split(" ")[0]}</span> 👋
      </h1>
      <p className="mt-2 text-fog-2">Here's what's happening in your vault.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="gradient-ring glass rounded-2xl p-5">
            <span className="text-2xl">{stat.icon}</span>
            <p className="mt-3 font-display text-2xl font-bold">{stat.value}</p>
            <p className="mt-0.5 text-xs text-fog-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Recent orders</h2>
          <Link href="/account/orders" className="text-sm text-purple-brand hover:underline">
            View all →
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="glass rounded-2xl py-12 text-center">
            <p className="text-fog-2">No orders yet.</p>
            <Link href="/products" className="btn-primary mt-4 inline-flex">Browse products</Link>
          </div>
        ) : (
          <div className="glass overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-mono text-xs">{order.orderNumber}</td>
                      <td>{order.items.map((i) => i.name).join(", ")}</td>
                      <td className="font-semibold">{formatPrice(order.total)}</td>
                      <td><StatusBadge status={order.status} /></td>
                      <td className="text-fog-2">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Custom requests</h2>
          <Link href="/account/requests/new" className="text-sm text-purple-brand hover:underline">
            + New request
          </Link>
        </div>
        {requests.length === 0 ? (
          <div className="glass rounded-2xl py-10 text-center">
            <p className="text-fog-2">
              Need something bespoke? Commission our design team.
            </p>
            <Link href="/account/requests/new" className="btn-outline mt-4 inline-flex">
              Submit a request
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map((req) => (
              <Link
                key={req.id}
                href={`/account/requests/${req.id}`}
                className="glass flex items-center justify-between gap-4 rounded-2xl p-5 transition hover:border-purple-brand/40"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{req.title}</p>
                  <p className="mt-0.5 text-xs text-fog-2">
                    Updated {formatDate(req.updatedAt)}
                    {req.quoteAmount != null && ` · Quote: ${formatPrice(req.quoteAmount)}`}
                  </p>
                </div>
                <StatusBadge status={req.status} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
