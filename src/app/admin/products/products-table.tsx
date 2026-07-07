"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/utils";
import { categoryLabel } from "@/lib/catalog";

type Row = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  salesCount: number;
  featured: boolean;
  published: boolean;
};

export function ProductsTable({ products }: { products: Row[] }) {
  const router = useRouter();
  const { toast } = useStore();
  const [busy, setBusy] = useState<string | null>(null);

  const remove = async (product: Row) => {
    if (!confirm(`Delete "${product.name}"? Products with sales are unpublished instead.`)) return;
    setBusy(product.id);
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (res.ok) {
      toast(data.unpublished ? "📦" : "🗑️", data.unpublished ? "Product unpublished (has sales)" : "Product deleted");
      router.refresh();
    } else {
      toast("⚠️", data.error ?? "Delete failed");
    }
  };

  return (
    <div className="glass mt-8 overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Sales</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={!p.published ? "opacity-50" : ""}>
                <td>
                  <div className="flex items-center gap-3">
                    <Image
                      src={p.image}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="block max-w-[220px] truncate font-semibold transition hover:text-purple-brand"
                      >
                        {p.name}
                      </Link>
                      {p.featured && <span className="text-[10px] text-amber-400">★ Featured</span>}
                    </div>
                  </div>
                </td>
                <td className="text-fog-2">{categoryLabel(p.category)}</td>
                <td className="font-semibold">{formatPrice(p.price)}</td>
                <td className="text-fog-2">{p.rating > 0 ? `★ ${p.rating.toFixed(1)}` : "—"}</td>
                <td className="text-fog-2">{p.salesCount.toLocaleString()}</td>
                <td>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      p.published
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-white/5 text-fog-2"
                    }`}
                  >
                    {p.published ? "Live" : "Draft"}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold transition hover:border-purple-brand/50 hover:text-purple-brand"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => remove(p)}
                      disabled={busy === p.id}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:border-red-500/50 disabled:opacity-40"
                    >
                      Delete
                    </button>
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
