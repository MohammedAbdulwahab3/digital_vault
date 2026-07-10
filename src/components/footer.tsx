"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "./store-provider";
import { useLang } from "./language-provider";

export function Footer() {
  const { toast } = useStore();
  const { t } = useLang();
  const [email, setEmail] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      toast("🎉", t.toasts.subscribed);
      setEmail("");
    } else {
      const data = await res.json().catch(() => ({}));
      toast("⚠️", data.error ?? "Subscription failed");
    }
  };

  return (
    <footer className="border-t border-white/5 bg-ink-2/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <span className="font-display text-xl font-bold text-gradient">⬡ PixelVault</span>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-fog-2">{t.footer.tagline}</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t.footer.products}</h4>
          <ul className="flex flex-col gap-2 text-sm text-fog-2">
            <li><Link className="transition hover:text-fog" href="/products?category=web">{t.categories.web.label}</Link></li>
            <li><Link className="transition hover:text-fog" href="/products?category=app">{t.categories.app.label}</Link></li>
            <li><Link className="transition hover:text-fog" href="/products?category=blender-3d">{t.categories["blender-3d"].label}</Link></li>
            <li><Link className="transition hover:text-fog" href="/products?category=ui-kit">{t.categories["ui-kit"].label}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t.footer.marketplace}</h4>
          <ul className="flex flex-col gap-2 text-sm text-fog-2">
            <li><Link className="transition hover:text-fog" href="/products">{t.footer.allProducts}</Link></li>
            <li><Link className="transition hover:text-fog" href="/requests">{t.footer.requestWork}</Link></li>
            <li><Link className="transition hover:text-fog" href="/account/orders">{t.footer.myDownloads}</Link></li>
            <li><Link className="transition hover:text-fog" href="/register">{t.footer.becomeMember}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t.footer.stayLoop}</h4>
          <p className="mb-3 text-sm text-fog-2">{t.footer.stayLoopSub}</p>
          <form onSubmit={subscribe} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.footer.emailPlaceholder}
              className="field flex-1 !rounded-full"
            />
            <button className="btn-primary !px-5" type="submit">{t.footer.join}</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-fog-2 sm:flex-row">
          <span>{t.footer.rights}</span>
          <div className="flex gap-4 text-base">
            <a href="#" aria-label="Twitter" className="transition hover:text-fog">𝕏</a>
            <a href="#" aria-label="GitHub" className="transition hover:text-fog">⊕</a>
            <a href="#" aria-label="Dribbble" className="transition hover:text-fog">◉</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
