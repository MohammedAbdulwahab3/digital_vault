"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/store-provider";
import { Spinner } from "@/components/ui";
import { CATEGORIES } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function NewRequestForm() {
  const router = useRouter();
  const { toast } = useStore();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("web");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
        New <span className="text-gradient-warm">custom request</span>
      </h1>
      <p className="mt-2 text-fog-2">
        The more detail you give, the faster (and sharper) the quote.
      </p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
        <div>
          <label className="mb-2 block text-sm font-semibold">Project title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Custom mascot character for our dev tool"
            required
            minLength={5}
            maxLength={120}
            className="field"
          />
        </div>

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

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Describe your vision{" "}
            <span className="font-normal text-fog-2">(min 30 characters)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you building? Style references, technical requirements, deliverable formats, anything that helps us scope it…"
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
