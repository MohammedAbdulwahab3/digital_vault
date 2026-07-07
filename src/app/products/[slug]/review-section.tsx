"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RatingStars, Reveal, Spinner } from "@/components/ui";
import { useStore } from "@/components/store-provider";
import { formatDate, cn } from "@/lib/utils";

type ReviewData = {
  id: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  userName: string;
  avatarHue: number;
};

export function ReviewSection({
  productId,
  reviews,
  canReview,
  isLoggedIn,
  ownReview,
}: {
  productId: string;
  reviews: ReviewData[];
  canReview: boolean;
  isLoggedIn: boolean;
  ownReview: { rating: number; title: string; body: string } | null;
}) {
  const router = useRouter();
  const { toast } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(ownReview?.rating ?? 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(ownReview?.title ?? "");
  const [body, setBody] = useState(ownReview?.body ?? "");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, title, body }),
    });
    setSubmitting(false);
    if (res.ok) {
      toast("⭐", ownReview ? "Review updated!" : "Review published!");
      setShowForm(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast("⚠️", data.error ?? "Could not submit review");
    }
  };

  return (
    <section className="relative mt-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">
          Reviews{" "}
          <span className="text-base font-normal text-fog-2">({reviews.length})</span>
        </h2>
        {canReview ? (
          <button onClick={() => setShowForm((v) => !v)} className="btn-outline !py-2 text-sm">
            {ownReview ? "Edit your review" : "Write a review"}
          </button>
        ) : isLoggedIn ? (
          <span className="text-xs text-fog-2">Only verified buyers can review</span>
        ) : (
          <Link href="/login" className="text-xs text-purple-brand hover:underline">
            Sign in to review
          </Link>
        )}
      </div>

      {showForm && (
        <form onSubmit={submit} className="gradient-ring glass mb-8 max-w-2xl rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-fog-2">Your rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={cn(
                  "text-xl transition-transform hover:scale-125",
                  star <= (hoverRating || rating) ? "text-amber-400" : "text-white/20"
                )}
              >
                ★
              </button>
            ))}
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review headline (optional)"
            maxLength={80}
            className="field mb-3"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share how this product worked for your project… (min 10 characters)"
            required
            minLength={10}
            rows={4}
            className="field mb-4 resize-none"
          />
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting && <Spinner />}
            {ownReview ? "Update review" : "Publish review"}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="glass rounded-2xl py-12 text-center text-sm text-fog-2">
          No reviews yet — be the first to share your experience.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review, i) => (
            <Reveal key={review.id} delay={Math.min(i * 0.05, 0.3)}>
              <article className="glass h-full rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, hsl(${review.avatarHue} 70% 50%), hsl(${(review.avatarHue + 40) % 360} 70% 40%))`,
                      }}
                    >
                      {review.userName.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{review.userName}</p>
                      <p className="text-[11px] text-fog-2">
                        ✓ Verified purchase · {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <RatingStars rating={review.rating} />
                </div>
                {review.title && <h3 className="mt-4 text-sm font-bold">{review.title}</h3>}
                <p className="mt-1.5 text-sm leading-relaxed text-fog-2">{review.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
