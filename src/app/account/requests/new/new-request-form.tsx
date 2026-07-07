"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/store-provider";
import { Spinner } from "@/components/ui";
import { CATEGORIES, categoryLabel } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type LinkedProduct = {
  id: string;
  slug: string;
  name: string;
  image: string;
  category: string;
};

const CUSTOMIZATION_IDEAS = [
  "Add new screens / pages",
  "Rebrand to my colors & logo",
  "Add a feature",
  "RTL / translation support",
  "Integrate with my API",
  "Extra animations",
];

export function NewRequestForm({ product }: { product: LinkedProduct | null }) {
  const router = useRouter();
  const { toast } = useStore();
  const [title, setTitle] = useState(product ? `Customize ${product.name}: ` : "");
  const [category, setCategory] = useState(product?.category ?? "web");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const addIdea = (idea: string) => {
    setDescription((d) => (d ? `${d}\n• ${idea}: ` : `• ${idea}: `));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category,
        description,
        budget: budget ? Math.round(parseFloat(budget) * 100) : null,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        productId: product?.id ?? null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Could not submit request");
      return;
    }
    toast("🚀", "Request submitted — we'll quote it within 24h");
    router.push(`/account/requests/${data.id}`);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        {product ? (
          <>Request <span className="text-gradient-warm">customization</span></>
        ) : (
          <>New <span className="text-gradient-warm">custom request</span></>
        )}
      </h1>
      <p className="mt-2 text-fog-2">
        {product
          ? "Tell us what to change, add or extend — our team quotes within 24h."
          : "The more detail you give, the faster (and sharper) the quote."}
      </p>

      {product && (
        <div className="gradient-ring glass mt-6 flex items-center gap-4 rounded-2xl p-4">
          <Image
            src={product.image}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-purple-brand">
              🔧 Customizing
            </p>
            <p className="truncate font-display font-bold">{product.name}</p>
            <p className="text-xs text-fog-2">{categoryLabel(product.category)}</p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="shrink-0 text-xs text-fog-2 transition hover:text-fog"
          >
            View →
          </Link>
        </div>
      )}

      <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            {product ? "What should we call this request?" : "Project title"}
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              product
                ? `e.g. Customize ${product.name}: add dark mode + my brand`
                : "e.g. Custom mascot character for our dev tool"
            }
            required
            minLength={5}
            maxLength={120}
            className="field"
          />
        </div>

        {!product && (
          <div>
            <label className="mb-2 block text-sm font-semibold">Category</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setCategory(cat.slug)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-xs font-semibold transition-all",
                    category === cat.slug
                      ? "border-purple-brand/60 bg-purple-brand/15 text-fog"
                      : "border-white/10 bg-white/[0.03] text-fog-2 hover:border-white/25"
                  )}
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.short}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold">
            {product ? "What do you need changed or added?" : "Describe your vision"}{" "}
            <span className="font-normal text-fog-2">(min 30 characters)</span>
          </label>
          {product && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {CUSTOMIZATION_IDEAS.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => addIdea(idea)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-fog-2 transition hover:border-purple-brand/50 hover:text-fog"
                >
                  + {idea}
                </button>
              ))}
            </div>
          )}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              product
                ? "List the features, changes or additions you need. Include brand colors, references, target platforms…"
                : "What are you building? Style references, technical requirements, deliverable formats, anything that helps us scope it…"
            }
            required
            minLength={30}
            rows={6}
            className="field resize-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Budget (USD) <span className="font-normal text-fog-2">optional</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 1200"
              className="field"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Deadline <span className="font-normal text-fog-2">optional</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="field"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary !py-3">
          {submitting && <Spinner />}
          Submit request 🚀
        </button>
      </form>
    </div>
  );
}
