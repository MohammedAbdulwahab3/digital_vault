import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui";
import { categoryDef } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Requests" };

export default async function AdminRequestsPage() {
  const requests = await db.customRequest.findMany({
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const open = requests.filter((r) => ["PENDING", "REVIEWING"].includes(r.status));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Custom requests</h1>
      <p className="mt-2 text-fog-2">
        {requests.length} total · <span className="text-amber-400">{open.length} awaiting review</span>
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {requests.map((req) => {
          const cat = categoryDef(req.category);
          return (
            <Link
              key={req.id}
              href={`/admin/requests/${req.id}`}
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
                  {req.user.name} · {req._count.messages} messages · updated {formatDate(req.updatedAt)}
                  {req.budget != null && <> · budget {formatPrice(req.budget)}</>}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <StatusBadge status={req.status} />
                {req.quoteAmount != null && (
                  <span className="text-xs font-semibold text-cyan-brand">
                    Quoted {formatPrice(req.quoteAmount)}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
