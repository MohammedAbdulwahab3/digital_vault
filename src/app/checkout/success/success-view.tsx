"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/components/store-provider";
import { useLang } from "@/components/language-provider";
import { Spinner } from "@/components/ui";

export function SuccessView() {
  const searchParams = useSearchParams();
  const { clearCartLocal, refreshUser } = useStore();
  const { t } = useLang();
  const orderId = searchParams.get("order");
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"checking" | "paid" | "pending">("checking");

  useEffect(() => {
    if (!orderId) return;
    const verify = async () => {
      const params = new URLSearchParams({ order: orderId });
      if (sessionId) params.set("session_id", sessionId);
      const res = await fetch(`/api/checkout/verify?${params}`);
      const data = await res.json().catch(() => ({}));
      if (data.status === "PAID") {
        setStatus("paid");
        clearCartLocal();
        refreshUser();
      } else {
        setStatus("pending");
      }
    };
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, sessionId]);

  if (status === "checking") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Spinner className="h-8 w-8" />
        <p className="text-fog-2">{t.checkout.confirming}</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-61px)] items-center justify-center overflow-hidden px-6">
      <div className="orb left-1/2 top-1/3 h-[500px] w-[600px] -translate-x-1/2 bg-emerald-500/10" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 18 }}
        className="gradient-ring glass relative max-w-lg rounded-3xl p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 12 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-4xl"
        >
          {status === "paid" ? "🎉" : "⏳"}
        </motion.div>
        <h1 className="mt-6 font-display text-3xl font-bold">
          {status === "paid" ? (
            <>{t.checkout.successTitlePre}<span className="text-gradient">{t.checkout.successTitleSpan}</span></>
          ) : (
            t.checkout.successProcessing
          )}
        </h1>
        <p className="mt-3 leading-relaxed text-fog-2">
          {status === "paid" ? t.checkout.successBody : t.checkout.successPendingBody}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/account/orders" className="btn-primary">
            {t.checkout.goDownloads}
          </Link>
          <Link href="/products" className="btn-outline">
            {t.checkout.keepBrowsing}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
