import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui";
import { categoryDef } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Custom Requests" };

export default async function MyRequestsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/requests");

  const requests = await db.customRequest.findMany({
    where: { userId: user.id },
    include: { _count: { select: { messages: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Custom <span className="text-gradient">requests</span>
          </h1>
          <p className="mt-2 text-fog-2">Track quotes and chat with your creators.</p>
        </div>
        <Link href="/account/requests/new" className="btn-primary">+ New request</Link>
      </div>

      {requests.length === 0 ? (
        <div className="glass mt-8 rounded-2xl py-16 text-center">
          <span className="text-4xl opacity-40">💬</span>
          <p className="mt-4 text-fog-2">No requests yet — commission something unique.</p>
          <Link href="/account/requests/new" className="btn-primary mt-5 inline-flex">
            Start a request
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {requests.map((req) => {
            const cat = categoryDef(req.category);
            return (
              <Link
                key={req.id}
                href={`/account/requests/${req.id}`}
                className="gradient-ring glass group flex items-center gap-5 rounded-2xl p-5 transition-all hover:-translate-y-0.5"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cat?.gradient ?? "from-violet-500 to-purple-500"} text-xl`}>
                  {cat?.icon ?? "🎨"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-bold transition group-hover:text-purple-brand">
                    {req.title}
                  </p>
                  <p className="mt-1 text-xs text-fog-2">
                    {cat?.label ?? req.category} · {req._count.messages} messages ·
                    updated {formatDate(req.updatedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <StatusBadge status={req.status} />
                  {req.quoteAmount != null && (
                    <span className="text-xs font-semibold text-cyan-brand">
                      Quote: {formatPrice(req.quoteAmount)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
