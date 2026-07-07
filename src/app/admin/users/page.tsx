import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { UsersTable } from "./users-table";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Users" };

export default async function AdminUsersPage() {
  const me = await getCurrentUser();
  const users = await db.user.findMany({
    include: {
      _count: { select: { orders: true, requests: true } },
      orders: { where: { status: "PAID" }, select: { total: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Users</h1>
      <p className="mt-2 text-fog-2">{users.length} registered accounts.</p>
      <UsersTable
        meId={me!.id}
        users={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatarHue: u.avatarHue,
          orders: u._count.orders,
          requests: u._count.requests,
          spent: u.orders.reduce((sum, o) => sum + o.total, 0),
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
