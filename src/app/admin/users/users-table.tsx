"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/components/store-provider";
import { formatPrice, formatDate, cn } from "@/lib/utils";

type Row = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarHue: number;
  orders: number;
  requests: number;
  spent: number;
  createdAt: string;
};

export function UsersTable({ users, meId }: { users: Row[]; meId: string }) {
  const router = useRouter();
  const { toast } = useStore();
  const [busy, setBusy] = useState<string | null>(null);

  const toggleRole = async (user: Row) => {
    const role = user.role === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Change ${user.name}'s role to ${role}?`)) return;
    setBusy(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setBusy(null);
    if (res.ok) {
      toast("✅", `${user.name} is now ${role}`);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast("⚠️", data.error ?? "Update failed");
    }
  };

  return (
    <div className="glass mt-8 overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Orders</th>
              <th>Spent</th>
              <th>Requests</th>
              <th>Joined</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, hsl(${user.avatarHue} 70% 50%), hsl(${(user.avatarHue + 40) % 360} 70% 40%))`,
                      }}
                    >
                      {user.name.charAt(0)}
                    </span>
                    <div>
                      <p className="font-semibold">
                        {user.name}
                        {user.id === meId && <span className="ml-1.5 text-[10px] text-fog-2">(you)</span>}
                      </p>
                      <p className="text-xs text-fog-2">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                      user.role === "ADMIN"
                        ? "bg-purple-brand/15 text-purple-brand"
                        : "bg-white/5 text-fog-2"
                    )}
                  >
                    {user.role === "ADMIN" ? "⚡ ADMIN" : "USER"}
                  </span>
                </td>
                <td className="text-fog-2">{user.orders}</td>
                <td className="font-semibold">{formatPrice(user.spent)}</td>
                <td className="text-fog-2">{user.requests}</td>
                <td className="text-fog-2">{formatDate(user.createdAt)}</td>
                <td>
                  <div className="flex justify-end">
                    {user.id !== meId && (
                      <button
                        onClick={() => toggleRole(user)}
                        disabled={busy === user.id}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold transition hover:border-purple-brand/50 hover:text-purple-brand disabled:opacity-40"
                      >
                        {user.role === "ADMIN" ? "Demote to user" : "Promote to admin"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
