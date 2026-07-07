"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "./store-provider";
import { StatusBadge, Spinner } from "./ui";
import { formatPrice, formatDateTime, formatDate, cn } from "@/lib/utils";
import { categoryDef, REQUEST_STATUSES } from "@/lib/catalog";

export type ThreadMessage = {
  id: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string; role: string };
};

export type ThreadRequest = {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: number | null;
  deadline: string | null;
  status: string;
  quoteAmount: number | null;
  quoteNote: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
  product: { slug: string; name: string; image: string } | null;
};

export function RequestThread({
  request,
  messages: initialMessages,
  viewerId,
  isAdmin,
}: {
  request: ThreadRequest;
  messages: ThreadMessage[];
  viewerId: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const { toast } = useStore();
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [acting, setActing] = useState(false);

  // Admin quote form
  const [quoteAmount, setQuoteAmount] = useState(
    request.quoteAmount != null ? String(request.quoteAmount / 100) : ""
  );
  const [quoteNote, setQuoteNote] = useState(request.quoteNote ?? "");

  const cat = categoryDef(request.category);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setSending(true);
    const res = await fetch(`/api/requests/${request.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    if (res.ok) {
      setMessages((prev) => [
        ...prev,
        { ...data.message, createdAt: new Date().toISOString() },
      ]);
      setDraft("");
    } else {
      toast("⚠️", data.error ?? "Message failed to send");
    }
  };

  const patch = async (body: Record<string, unknown>, success: string) => {
    setActing(true);
    const res = await fetch(`/api/requests/${request.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setActing(false);
    if (res.ok) {
      toast("✅", success);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast("⚠️", data.error ?? "Update failed");
    }
  };

  const sendQuote = () =>
    patch(
      {
        quoteAmount: quoteAmount ? Math.round(parseFloat(quoteAmount) * 100) : null,
        quoteNote: quoteNote || null,
        status: "QUOTED",
      },
      "Quote sent to the customer"
    );

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
      {/* ── Thread ── */}
      <div className="min-w-0">
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${cat?.gradient ?? "from-violet-500 to-purple-500"} text-lg`}>
              {cat?.icon ?? "🎨"}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl font-bold leading-tight">{request.title}</h1>
              <p className="mt-0.5 text-xs text-fog-2">
                {cat?.label ?? request.category} · opened {formatDate(request.createdAt)}
                {isAdmin && <> · by <span className="text-fog">{request.user.name}</span></>}
              </p>
            </div>
            <StatusBadge status={request.status} />
          </div>
        </div>

        {/* Linked product */}
        {request.product && (
          <a
            href={`/products/${request.product.slug}`}
            className="glass mb-4 flex items-center gap-3 rounded-2xl p-3 transition hover:border-purple-brand/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={request.product.image}
              alt=""
              className="h-12 w-12 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-purple-brand">
                🔧 Customization of purchased product
              </p>
              <p className="truncate text-sm font-bold">{request.product.name}</p>
            </div>
            <span className="shrink-0 text-xs text-fog-2">View product →</span>
          </a>
        )}

        {/* Brief */}
        <div className="glass mb-6 rounded-2xl p-5">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-fog-2">
            The brief
          </p>
          <p className="whitespace-pre-line text-sm leading-relaxed">{request.description}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-fog-2">
            {request.budget != null && (
              <span>💰 Budget: <strong className="text-fog">{formatPrice(request.budget)}</strong></span>
            )}
            {request.deadline && (
              <span>📅 Deadline: <strong className="text-fog">{formatDate(request.deadline)}</strong></span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-4">
          {messages.length === 0 && (
            <p className="glass rounded-2xl py-10 text-center text-sm text-fog-2">
              No messages yet — say hello 👋
            </p>
          )}
          {messages.map((msg) => {
            const mine = msg.sender.id === viewerId;
            const fromAdmin = msg.sender.role === "ADMIN";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex", mine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3",
                    mine
                      ? "rounded-br-md bg-gradient-brand text-white"
                      : "glass rounded-bl-md"
                  )}
                >
                  <p className={cn("mb-1 text-[11px] font-semibold", mine ? "text-white/80" : "text-fog-2")}>
                    {fromAdmin ? "⚡ " : ""}{msg.sender.name}
                    {fromAdmin && !mine ? " · PixelVault Team" : ""}
                  </p>
                  <p className="whitespace-pre-line text-sm leading-relaxed">{msg.body}</p>
                  <p className={cn("mt-1.5 text-right text-[10px]", mine ? "text-white/60" : "text-fog-2/70")}>
                    {formatDateTime(msg.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Composer */}
        <form onSubmit={send} className="mt-6 flex gap-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a message…"
            className="field flex-1 !rounded-full"
          />
          <button type="submit" disabled={sending || !draft.trim()} className="btn-primary !px-6">
            {sending ? <Spinner /> : "Send"}
          </button>
        </form>
      </div>

      {/* ── Side panel ── */}
      <aside className="flex h-fit flex-col gap-5 xl:sticky xl:top-24">
        {/* Quote card */}
        {request.quoteAmount != null && (
          <div className="gradient-ring glass rounded-2xl p-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-fog-2">
              {request.status === "QUOTED" ? "Quote awaiting response" : "Agreed quote"}
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-gradient">
              {formatPrice(request.quoteAmount)}
            </p>
            {request.quoteNote && (
              <p className="mt-3 text-sm leading-relaxed text-fog-2">{request.quoteNote}</p>
            )}
            {!isAdmin && request.status === "QUOTED" && (
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => patch({ action: "accept_quote" }, "Quote accepted — work begins!")}
                  disabled={acting}
                  className="btn-primary flex-1 !py-2 text-sm"
                >
                  Accept quote
                </button>
                <button
                  onClick={() => patch({ action: "decline_quote" }, "Quote declined")}
                  disabled={acting}
                  className="btn-outline flex-1 !py-2 text-sm"
                >
                  Decline
                </button>
              </div>
            )}
            {!isAdmin && request.status === "DELIVERED" && (
              <button
                onClick={() => patch({ action: "mark_completed" }, "Marked as completed — enjoy!")}
                disabled={acting}
                className="btn-primary mt-5 w-full !py-2 text-sm"
              >
                ✓ Confirm delivery & complete
              </button>
            )}
          </div>
        )}

        {!isAdmin && request.quoteAmount == null && (
          <div className="glass rounded-2xl p-6 text-sm text-fog-2">
            ⏳ Our team is reviewing your brief. Expect a quote here within 24 hours.
          </div>
        )}

        {/* Admin controls */}
        {isAdmin && (
          <div className="gradient-ring glass rounded-2xl p-6">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-purple-brand">
              ⚡ Admin controls
            </p>

            <label className="mb-1.5 block text-xs font-semibold">Status</label>
            <select
              value={request.status}
              onChange={(e) => patch({ status: e.target.value }, `Status → ${e.target.value}`)}
              className="field mb-4 !py-2 text-sm"
            >
              {REQUEST_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </select>

            <label className="mb-1.5 block text-xs font-semibold">Quote amount (USD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
              placeholder="1450"
              className="field mb-3 !py-2 text-sm"
            />
            <label className="mb-1.5 block text-xs font-semibold">Quote note</label>
            <textarea
              value={quoteNote}
              onChange={(e) => setQuoteNote(e.target.value)}
              rows={3}
              placeholder="What's included, revision rounds, timeline…"
              className="field mb-4 resize-none text-sm"
            />
            <button
              onClick={sendQuote}
              disabled={acting || !quoteAmount}
              className="btn-primary w-full !py-2 text-sm"
            >
              {acting ? <Spinner /> : "Send / update quote"}
            </button>
          </div>
        )}

        {/* Meta */}
        <div className="glass rounded-2xl p-6 text-sm">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-fog-2">
            Details
          </p>
          <dl className="flex flex-col gap-2 text-fog-2">
            <div className="flex justify-between">
              <dt>Requested by</dt>
              <dd className="text-fog">{request.user.name}</dd>
            </div>
            {isAdmin && (
              <div className="flex justify-between gap-3">
                <dt>Email</dt>
                <dd className="truncate text-fog">{request.user.email}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>Opened</dt>
              <dd className="text-fog">{formatDate(request.createdAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Messages</dt>
              <dd className="text-fog">{messages.length}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}
