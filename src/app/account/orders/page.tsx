import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate, parseJsonArray } from "@/lib/utils";
import { StatusBadge } from "@/components/ui";
import { platformDef } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders & Downloads" };

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/orders");

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Orders & <span className="text-gradient">Downloads</span>
      </h1>
      <p className="mt-2 text-fog-2">
        Every purchase unlocks instant downloads with a commercial license.
      </p>

      {orders.length === 0 ? (
        <div className="glass mt-8 rounded-2xl py-16 text-center">
          <span className="text-4xl opacity-40">📦</span>
          <p className="mt-4 text-fog-2">You haven't ordered anything yet.</p>
          <Link href="/products" className="btn-primary mt-5 inline-flex">Browse products</Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-5">
          {orders.map((order) => (
            <div key={order.id} className="gradient-ring glass overflow-hidden rounded-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-fog-2">{order.orderNumber}</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-fog-2">{formatDate(order.createdAt)}</span>
                  <span className="font-display font-bold">{formatPrice(order.total)}</span>
                </div>
              </div>
              <ul className="divide-y divide-white/5">
                {order.items.map((item) => {
                  const platforms = parseJsonArray(item.product.platforms);
                  return (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center gap-4 px-6 py-4"
                    >
                      <Image
                        src={item.product.image}
                        alt={item.name}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="block truncate text-sm font-semibold transition hover:text-purple-brand"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-fog-2">
                          {formatPrice(item.price)} · {item.product.fileSize}
                          {item.downloads > 0 && ` · downloaded ${item.downloads}×`}
                        </p>
                      </div>
                      {order.status === "PAID" ? (
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          <Link
                            href={`/account/requests/new?product=${item.product.slug}`}
                            title="Request extra features or changes to this product"
                            className="inline-flex items-center gap-1.5 rounded-full border border-pink-brand/40 bg-pink-brand/10 px-3.5 py-1.5 text-xs font-semibold text-pink-300 transition-all hover:border-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white"
                          >
                            🔧 Customize
                          </Link>
                          {platforms.map((slug) => {
                            const platform = platformDef(slug);
                            if (!platform) return null;
                            return (
                              <a
                                key={slug}
                                href={`/api/download/${item.downloadToken}?platform=${slug}`}
                                title={platform.hint}
                                className="inline-flex items-center gap-1.5 rounded-full border border-purple-brand/40 bg-purple-brand/10 px-3.5 py-1.5 text-xs font-semibold text-purple-300 transition-all hover:border-transparent hover:bg-gradient-brand hover:text-white"
                                download
                              >
                                <span>{platform.icon}</span> {platform.label}
                                <span className="opacity-70">⬇</span>
                              </a>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-xs text-fog-2">Awaiting payment</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
