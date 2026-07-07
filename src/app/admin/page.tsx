import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui";
import { RevenueChart, CategoryBarChart } from "@/components/admin/charts";
import { CATEGORIES } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const since = new Date(Date.now() - 29 * 86400000);
  since.setHours(0, 0, 0, 0);

  const [paidOrders, pendingRequests, userCount, productCount, recentOrders, products] =
    await Promise.all([
      db.order.findMany({
        where: { status: "PAID" },
        select: { total: true, paidAt: true, createdAt: true },
      }),
      db.customRequest.count({ where: { status: { in: ["PENDING", "REVIEWING"] } } }),
      db.user.count(),
      db.product.count(),
      db.order.findMany({
        include: { user: { select: { name: true } }, items: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      db.product.findMany({
        where: { published: true },
        select: { name: true, category: true, salesCount: true, price: true },
      }),
    ]);

  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const revenue30 = paidOrders
    .filter((o) => (o.paidAt ?? o.createdAt) >= since)
    .reduce((sum, o) => sum + o.total, 0);

  // Daily revenue series, last 30 days
  const days: { label: string; value: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86400000);
    day.setHours(0, 0, 0, 0);
    const next = new Date(day.getTime() + 86400000);
    const value = paidOrders
      .filter((o) => {
        const t = o.paidAt ?? o.createdAt;
        return t >= day && t < next;
      })
      .reduce((sum, o) => sum + o.total, 0);
    days.push({
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value,
    });
  }

  // Sales by category (estimated revenue = salesCount × price)
  const byCategory = CATEGORIES.map((cat) => {
    const inCat = products.filter((p) => p.category === cat.slug);
    const sales = inCat.reduce((sum, p) => sum + p.salesCount, 0);
    return { label: cat.label, value: sales, display: `${sales.toLocaleString()} sales` };
  })
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);

  const topProducts = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);

  const stats = [
    { label: "Total revenue", value: formatPrice(totalRevenue), icon: "💎", accent: true },
    { label: "Revenue (30d)", value: formatPrice(revenue30), icon: "📈" },
    { label: "Orders", value: String(paidOrders.length), icon: "📦" },
    { label: "Customers", value: String(userCount), icon: "👥" },
    { label: "Products", value: String(productCount), icon: "🗃️" },
    { label: "Requests to review", value: String(pendingRequests), icon: "💬" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Store <span className="text-gradient">overview</span>
      </h1>
      <p className="mt-2 text-fog-2">Live snapshot of PixelVault's performance.</p>

      {/* Stat tiles */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`glass rounded-2xl p-4 ${stat.accent ? "gradient-ring" : ""}`}
          >
            <span className="text-xl">{stat.icon}</span>
            <p className="mt-2 truncate font-display text-xl font-bold">{stat.value}</p>
            <p className="mt-0.5 text-[11px] text-fog-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display font-bold">Daily revenue — last 30 days</h2>
          <div className="mt-2">
            <RevenueChart points={days} />
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display font-bold">Sales by category</h2>
          <div className="mt-4">
            <CategoryBarChart bars={byCategory} unit="Sales" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.5fr]">
        {/* Top products */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display font-bold">Top products</h2>
          <ol className="mt-4 flex flex-col gap-3">
            {topProducts.map((p, i) => (
              <li key={p.name} className="flex items-center gap-3 text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 font-display text-xs font-bold text-fog-2">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate">{p.name}</span>
                <span className="shrink-0 text-xs text-fog-2">
                  {p.salesCount.toLocaleString()} sales
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Recent orders */}
        <div className="glass overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between px-6 pb-2 pt-6">
            <h2 className="font-display font-bold">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-purple-brand hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-xs">{order.orderNumber}</td>
                    <td>{order.user.name}</td>
                    <td className="font-semibold">{formatPrice(order.total)}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td className="text-fog-2">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
