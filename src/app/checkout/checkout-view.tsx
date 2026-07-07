"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/components/store-provider";
import { Spinner } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

type Coupon = { code: string; percentOff: number };

export function CheckoutView() {
  const { cart, toast, clearCartLocal, authReady } = useStore();
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
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
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
      toast("🎟️", `Coupon applied — ${data.percentOff}% off`);
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
      // Stripe checkout
      window.location.href = data.url;
      return;
    }
    // Demo gateway
    setDemoOrderId(data.orderId);
    setDemoTotal(data.total);
  };

  const payDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoOrderId) return;
    setPaying(true);
    setPayError(null);
    const res = await fetch("/api/checkout/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: demoOrderId, cardName, cardNumber, expiry, cvc }),
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
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="text-fog-2">Add some products before checking out.</p>
        <Link href="/products" className="btn-primary mt-2">Browse products</Link>
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
            <h1 className="font-display text-2xl font-bold">Payment</h1>
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-bold text-amber-300">
              DEMO GATEWAY
            </span>
          </div>

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
                <span>{cardName.toUpperCase() || "CARD HOLDER"}</span>
                <span>{expiry || "MM/YY"}</span>
              </div>
            </div>
          </div>

          <form onSubmit={payDemo} className="flex flex-col gap-3">
            <input
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Name on card"
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
                  <Spinner /> Processing…
                </>
              ) : (
                <>Pay {formatPrice(demoTotal)}</>
              )}
            </button>
            <p className="text-center text-xs text-fog-2">
              Test card: <span className="font-mono text-fog">4242 4242 4242 4242</span> — any
              future expiry, any CVC. Configure Stripe keys for real payments.
            </p>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Order review screen ──
  return (
    <div className="relative mx-auto max-w-5xl px-6 py-14">
      <div className="orb -left-40 top-20 h-[400px] w-[400px] bg-violet-brand/10" />
      <h1 className="relative font-display text-3xl font-bold tracking-tight">
        Checkout
      </h1>
      {canceled && (
        <p className="relative mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm text-amber-300">
          Payment canceled — your cart is untouched.
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
                <p className="text-xs text-fog-2">Digital download · Commercial license</p>
              </div>
              <span className="font-display font-bold">{formatPrice(item.price)}</span>
            </div>
          ))}
        </div>

        <div className="gradient-ring glass h-fit rounded-2xl p-6">
          <h2 className="font-display text-lg font-bold">Order summary</h2>

          <div className="mt-4 flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon code (try WELCOME10)"
              className="field flex-1 !py-2 text-sm uppercase"
            />
            <button onClick={applyCoupon} className="btn-outline !px-4 !py-2 text-sm">
              Apply
            </button>
          </div>
          {couponError && <p className="mt-2 text-xs text-red-400">{couponError}</p>}
          {coupon && (
            <p className="mt-2 text-xs text-emerald-400">
              ✓ {coupon.code} — {coupon.percentOff}% off applied
            </p>
          )}

          <dl className="mt-5 flex flex-col gap-2 border-t border-white/5 pt-4 text-sm">
            <div className="flex justify-between text-fog-2">
              <dt>Subtotal ({cart.length} items)</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <dt>Discount</dt>
                <dd>−{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-white/5 pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd className="text-gradient font-display text-xl">{formatPrice(total)}</dd>
            </div>
          </dl>

          <button onClick={placeOrder} disabled={placing} className="btn-primary mt-6 w-full !py-3">
            {placing ? (
              <>
                <Spinner /> Preparing order…
              </>
            ) : (
              <>Continue to payment →</>
            )}
          </button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-fog-2">
            🔒 Secure payment · Instant delivery · 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}
