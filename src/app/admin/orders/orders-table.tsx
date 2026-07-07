"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/components/store-provider";
import { StatusBadge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/catalog";

type Row = {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  items: string[];
  total: number;
  discount: number;
  couponCode: string | null;
  status: string;
  paymentMethod: string;
  createdAt: string;
};

export function OrdersTable({ orders }: { orders: Row[] }) {
  const router = useRouter();
  const { toast } = useStore();
  const [busy, setBusy] = useState<string | null>(null);

  const setStatus = async (id: string, status: string) => {
    setBusy(id);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    if (res.ok) {
      toast("✅", `Order → ${status}`);
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
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="font-mono text-xs">{order.orderNumber}</td>
                <td>
                  <p className="font-semibold">{order.customer}</p>
                  <p className="text-xs text-fog-2">{order.email}</p>
                </td>
                <td className="max-w-[240px]">
                  <p className="truncate text-fog-2" title={order.items.join(", ")}>
                    {order.items.join(", ")}
                  </p>
                </td>
                <td>
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  {order.couponCode && (
                    <p className="text-[10px] text-emerald-400">
                      {order.couponCode} (−{formatPrice(order.discount)})
                    </p>
                  )}
                </td>
                <td>
                  <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase text-fog-2">
                    {order.paymentMethod}
                  </span>
                </td>
                <td className="text-fog-2">{formatDate(order.createdAt)}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.status} />
                    <select
                      value={order.status}
                      disabled={busy === order.id}
                      onChange={(e) => setStatus(order.id, e.target.value)}
                      className="field w-auto !rounded-lg !px-2 !py-1 text-xs"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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
