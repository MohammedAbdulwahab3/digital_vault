"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/components/store-provider";
import { useLang } from "@/components/language-provider";
import { Spinner } from "@/components/ui";
import { formatMoney } from "@/lib/utils";

type Coupon = { code: string; percentOff: number };
type PayMethod = "card" | "telebirr";

export function CheckoutView() {
  const { cart, toast, clearCartLocal, authReady } = useStore();
  const { locale, t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  // Demo gateway state
  const [demoOrderId, setDemoOrderId] = useState<string | null>(null);
  const [demoTotal, setDemoTotal] = useState(0);
  const [method, setMethod] = useState<PayMethod>(locale === "am" ? "telebirr" : "card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const discount = coupon ? Math.round((subtotal * coupon.percentOff) / 100) : 0;
  const total = subtotal - discount;

  const applyCoupon = async () => {
    setCouponError(null);
    if (!couponInput.trim()) return;
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponInput.trim() }),
    });
    const data = await res.json();
    if (res.ok && data.valid) {
      setCoupon({ code: data.code, percentOff: data.percentOff });
      toast("🎟️", `${data.code} — ${data.percentOff}% ${t.checkout.couponApplied}`);
    } else {
      setCoupon(null);
      setCouponError(data.error ?? "Invalid coupon");
    }
  };

  const placeOrder = async () => {
    setPlacing(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponCode: coupon?.code }),
    });
    const data = await res.json().catch(() => ({}));
    setPlacing(false);

    if (!res.ok) {
      toast("⚠️", data.error ?? "Checkout failed");
      return;
    }
    if (data.url) {
      // Hosted checkout (Stripe or Chapa)
      window.location.href = data.url;
      return;
    }
    // Built-in demo gateway
    setDemoOrderId(data.orderId);
    setDemoTotal(data.total);
  };

  const payDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoOrderId) return;
    setPaying(true);
    setPayError(null);
    const payload =
      method === "telebirr"
        ? { orderId: demoOrderId, method, phone }
        : { orderId: demoOrderId, method, cardName, cardNumber, expiry, cvc };
    const res = await fetch("/api/checkout/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setPaying(false);
    if (res.ok) {
      clearCartLocal();
      router.push(`/checkout/success?order=${demoOrderId}`);
    } else {
      setPayError(data.error ?? "Payment failed");
    }
  };

  if (!authReady) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (cart.length === 0 && !demoOrderId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-5xl opacity-40">🛒</span>
        <h1 className="font-display text-2xl font-bold">{t.checkout.emptyTitle}</h1>
        <p className="text-fog-2">{t.checkout.emptySub}</p>
        <Link href="/products" className="btn-primary mt-2">{t.cart.browse}</Link>
      </div>
    );
  }

  // ── Demo payment screen ──
  if (demoOrderId) {
    return (
      <div className="relative mx-auto flex min-h-[calc(100vh-61px)] max-w-lg items-center px-6 py-16">
        <div className="orb -right-40 top-20 h-[400px] w-[400px] bg-cyan-brand/10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-ring glass relative w-full rounded-3xl p-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold">{t.checkout.payment}</h1>
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-bold text-amber-300">
              {t.checkout.demoGateway}
            </span>
          </div>

          {/* Method tabs */}
          <div className="mb-6 grid grid-cols-2 gap-2">
            <button
              onClick={() => setMethod("card")}
              className={`rounded-xl border px-4 py-3 text-sm font-bold transition-all ${
                method === "card"
                  ? "border-purple-brand/60 bg-purple-brand/15"
                  : "border-white/10 bg-white/[0.03] text-fog-2 hover:border-white/25"
              }`}
            >
              {t.checkout.payCard}
            </button>
            <button
              onClick={() => setMethod("telebirr")}
              className={`rounded-xl border px-4 py-3 text-sm font-bold transition-all ${
                method === "telebirr"
                  ? "border-emerald-400/60 bg-emerald-400/10"
                  : "border-white/10 bg-white/[0.03] text-fog-2 hover:border-white/25"
              }`}
            >
              {t.checkout.payTelebirr}
            </button>
          </div>

          {method === "card" ? (
            <>
              {/* Card visual */}
              <div className="relative mb-6 h-44 overflow-hidden rounded-2xl bg-gradient-brand p-5 shadow-[0_20px_50px_-15px_rgba(124,58,237,0.6)]">
                <div className="noise absolute inset-0" />
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-white/90">⬡ PixelVault</span>
                    <span className="text-2xl">💳</span>
                  </div>
                  <p className="font-mono text-lg tracking-[0.15em] text-white">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </p>
                  <div className="flex justify-between font-mono text-xs text-white/80">
                    <span>{cardName.toUpperCase() || t.checkout.cardHolder}</span>
                    <span>{expiry || "MM/YY"}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={payDemo} className="flex flex-col gap-3">
                <input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder={t.checkout.cardName}
                  required
                  className="field"
                />
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  required
                  className="field font-mono"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    required
                    className="field font-mono"
                  />
                  <input
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="CVC"
                    required
                    className="field font-mono"
                  />
                </div>

                {payError && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                    {payError}
                  </p>
                )}

                <button type="submit" disabled={paying} className="btn-primary mt-2 !py-3">
                  {paying ? (
                    <>
                      <Spinner /> {t.checkout.processing}
                    </>
                  ) : (
                    <>{t.checkout.pay} {formatMoney(demoTotal, locale)}</>
                  )}
                </button>
                <p className="text-center text-xs text-fog-2">
                  {t.checkout.testCardNote}{" "}
                  <span className="font-mono text-fog">4242 4242 4242 4242</span>{" "}
                  {t.checkout.testCardTail}
                </p>
              </form>
            </>
          ) : (
            <>
              {/* Telebirr visual */}
              <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-5 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.5)]">
                <div className="noise absolute inset-0" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="font-display text-xl font-bold text-white">telebirr</p>
                    <p className="mt-1 text-xs text-white/80">Ethio Telecom Mobile Money</p>
                  </div>
                  <span className="text-4xl">📱</span>
                </div>
                <p className="relative mt-4 font-mono text-2xl font-bold text-white">
                  {formatMoney(demoTotal, "am")}
                </p>
                <p className="relative text-xs text-white/70">
                  ≈ {formatMoney(demoTotal, "en")}
                </p>
              </div>

              <form onSubmit={payDemo} className="flex flex-col gap-3">
                <label className="text-sm font-semibold">{t.checkout.telebirrPhone}</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09XX XXX XXX"
                  required
                  inputMode="tel"
                  className="field font-mono"
                />

                {payError && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                    {payError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={paying}
                  className="btn-primary mt-2 !bg-none !bg-emerald-500 !py-3 hover:!shadow-[0_10px_30px_rgba(16,185,129,0.45)]"
                >
                  {paying ? (
                    <>
                      <Spinner /> {t.checkout.processing}
                    </>
                  ) : (
                    <>📱 {t.checkout.telebirrConfirm} — {formatMoney(demoTotal, "am")}</>
                  )}
                </button>
                <p className="text-center text-xs leading-relaxed text-fog-2">
                  {t.checkout.telebirrNote}
                </p>
              </form>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  // ── Order review screen ──
  return (
    <div className="relative mx-auto max-w-5xl px-6 py-14">
      <div className="orb -left-40 top-20 h-[400px] w-[400px] bg-violet-brand/10" />
      <h1 className="relative font-display text-3xl font-bold tracking-tight">
        {t.checkout.title}
      </h1>
      {canceled && (
        <p className="relative mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm text-amber-300">
          {t.checkout.canceled}
        </p>
      )}

      <div className="relative mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-3">
          {cart.map((item) => (
            <div key={item.productId} className="glass flex items-center gap-4 rounded-2xl p-4">
              <Image
                src={item.image}
                alt={item.name}
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{item.name}</p>
                <p className="text-xs text-fog-2">{t.cart.digitalNote}</p>
              </div>
              <span className="font-display font-bold">{formatMoney(item.price, locale)}</span>
            </div>
          ))}
        </div>

        <div className="gradient-ring glass h-fit rounded-2xl p-6">
          <h2 className="font-display text-lg font-bold">{t.checkout.summary}</h2>

          <div className="mt-4 flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder={t.checkout.couponPlaceholder}
              className="field flex-1 !py-2 text-sm uppercase"
            />
            <button onClick={applyCoupon} className="btn-outline !px-4 !py-2 text-sm">
              {t.checkout.apply}
            </button>
          </div>
          {couponError && <p className="mt-2 text-xs text-red-400">{couponError}</p>}
          {coupon && (
            <p className="mt-2 text-xs text-emerald-400">
              ✓ {coupon.code} — {coupon.percentOff}% {t.checkout.couponApplied}
            </p>
          )}

          <dl className="mt-5 flex flex-col gap-2 border-t border-white/5 pt-4 text-sm">
            <div className="flex justify-between text-fog-2">
              <dt>{t.checkout.subtotal} ({cart.length})</dt>
              <dd>{formatMoney(subtotal, locale)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <dt>{t.checkout.discount}</dt>
                <dd>−{formatMoney(discount, locale)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-white/5 pt-3 text-base font-bold">
              <dt>{t.checkout.total}</dt>
              <dd className="text-gradient font-display text-xl">
                {formatMoney(total, locale)}
              </dd>
            </div>
            {locale === "am" && (
              <p className="text-right text-[11px] text-fog-2">
                ≈ {formatMoney(total, "en")} · {t.checkout.vatNote}
              </p>
            )}
          </dl>

          <button onClick={placeOrder} disabled={placing} className="btn-primary mt-6 w-full !py-3">
            {placing ? (
              <>
                <Spinner /> {t.checkout.preparing}
              </>
            ) : (
              <>{t.checkout.continuePay}</>
            )}
          </button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-fog-2">
            {t.checkout.secureNote}
          </p>
        </div>
      </div>
    </div>
  );
}
