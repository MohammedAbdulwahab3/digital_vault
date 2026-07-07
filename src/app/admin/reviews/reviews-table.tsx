"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/components/store-provider";
import { RatingStars } from "@/components/ui";
import { formatDate } from "@/lib/utils";

type Row = {
  id: string;
  rating: number;
  title: string;
  body: string;
  userName: string;
  productName: string;
  productSlug: string;
  createdAt: string;
};

export function ReviewsTable({ reviews }: { reviews: Row[] }) {
  const router = useRouter();
  const { toast } = useStore();
  const [busy, setBusy] = useState<string | null>(null);

  const remove = async (review: Row) => {
    if (!confirm(`Delete ${review.userName}'s review of "${review.productName}"?`)) return;
    setBusy(review.id);
    const res = await fetch(`/api/admin/reviews/${review.id}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) {
      toast("🗑️", "Review deleted, rating recalculated");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast("⚠️", data.error ?? "Delete failed");
    }
  };

  return (
    <div className="mt-8 grid gap-4 xl:grid-cols-2">
      {reviews.map((review) => (
        <article key={review.id} className="glass rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <RatingStars rating={review.rating} />
              {review.title && <h3 className="mt-2 text-sm font-bold">{review.title}</h3>}
              <p className="mt-1 line-clamp-3 text-sm text-fog-2">{review.body}</p>
              <p className="mt-3 text-xs text-fog-2">
                <span className="text-fog">{review.userName}</span> on{" "}
                <Link
                  href={`/products/${review.productSlug}`}
                  target="_blank"
                  className="text-purple-brand hover:underline"
                >
                  {review.productName}
                </Link>{" "}
                · {formatDate(review.createdAt)}
              </p>
            </div>
            <button
              onClick={() => remove(review)}
              disabled={busy === review.id}
              className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:border-red-500/50 disabled:opacity-40"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
