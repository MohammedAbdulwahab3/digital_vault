"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "./store-provider";

export function Footer() {
  const { toast } = useStore();
  const [email, setEmail] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      toast("🎉", "Subscribed! Welcome to the vault.");
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
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-fog-2">
            The premium marketplace for digital designers. Discover, create, and
            sell beautiful digital products.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Products</h4>
          <ul className="flex flex-col gap-2 text-sm text-fog-2">
            <li><Link className="transition hover:text-fog" href="/products?category=web">Web Templates</Link></li>
            <li><Link className="transition hover:text-fog" href="/products?category=app">App Templates</Link></li>
            <li><Link className="transition hover:text-fog" href="/products?category=blender-3d">Blender Characters</Link></li>
            <li><Link className="transition hover:text-fog" href="/products?category=ui-kit">UI Kits</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Marketplace</h4>
          <ul className="flex flex-col gap-2 text-sm text-fog-2">
            <li><Link className="transition hover:text-fog" href="/products">All Products</Link></li>
            <li><Link className="transition hover:text-fog" href="/requests">Request Custom Work</Link></li>
            <li><Link className="transition hover:text-fog" href="/account/orders">My Downloads</Link></li>
            <li><Link className="transition hover:text-fog" href="/register">Become a Member</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Stay in the loop</h4>
          <p className="mb-3 text-sm text-fog-2">
            Exclusive drops and creator deals, monthly. No spam.
          </p>
          <form onSubmit={subscribe} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              className="field flex-1 !rounded-full"
            />
            <button className="btn-primary !px-5" type="submit">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-fog-2 sm:flex-row">
          <span>© 2026 PixelVault. All rights reserved.</span>
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
