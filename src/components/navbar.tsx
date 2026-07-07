"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "./store-provider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Explore" },
  { href: "/requests", label: "Custom Requests" },
];

export function Navbar() {
  const { user, cart, setCartOpen, logout } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/products?q=${encodeURIComponent(query.trim())}` : "/products");
  };

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-[100] border-b transition-all duration-300",
        scrolled
          ? "border-white/10 bg-ink/95 backdrop-blur-2xl"
          : "border-white/5 bg-ink/70 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          <span className="text-gradient">⬡ PixelVault</span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "group relative text-sm font-medium transition-colors",
                  pathname === link.href ? "text-fog" : "text-fog-2 hover:text-fog"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-gradient-brand transition-all duration-300",
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <form
            onSubmit={submitSearch}
            className="glass hidden items-center gap-2 rounded-full px-4 py-2 md:flex"
          >
            <span className="text-xs text-fog-2">🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search designs…"
              className="w-36 bg-transparent text-sm outline-none placeholder:text-fog-2/60 lg:w-44"
            />
          </form>

          <button
            onClick={() => setCartOpen(true)}
            className="relative rounded-full p-2 text-xl transition hover:bg-white/5"
            aria-label="Open cart"
          >
            🛒
            {cart.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-purple-brand text-[10px] font-bold text-white">
                {cart.length}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition hover:border-purple-brand/50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-[90px] truncate text-sm font-medium sm:block">
                  {user.name.split(" ")[0]}
                </span>
              </button>
              {menuOpen && (
                <div className="glass-strong absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl py-2 shadow-2xl">
                  <div className="border-b border-white/5 px-4 py-2">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-fog-2">{user.email}</p>
                  </div>
                  {user.role === "ADMIN" && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-purple-brand transition hover:bg-white/5">
                      ⚡ Admin Dashboard
                    </Link>
                  )}
                  <Link href="/account" className="block px-4 py-2 text-sm transition hover:bg-white/5">
                    Overview
                  </Link>
                  <Link href="/account/orders" className="block px-4 py-2 text-sm transition hover:bg-white/5">
                    Orders & Downloads
                  </Link>
                  <Link href="/account/requests" className="block px-4 py-2 text-sm transition hover:bg-white/5">
                    My Requests
                  </Link>
                  <Link href="/account/wishlist" className="block px-4 py-2 text-sm transition hover:bg-white/5">
                    Wishlist
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-400 transition hover:bg-white/5"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary hidden !py-2 sm:inline-flex">
              Sign In
            </Link>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-fog-2 transition hover:bg-white/5 lg:hidden"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-ink/95 px-6 py-4 backdrop-blur-2xl lg:hidden">
          <form onSubmit={submitSearch} className="glass mb-3 flex items-center gap-2 rounded-full px-4 py-2 md:hidden">
            <span className="text-xs text-fog-2">🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search designs…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-fog-2/60"
            />
          </form>
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-fog-2 transition hover:bg-white/5 hover:text-fog"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!user && (
              <li>
                <Link href="/login" className="block rounded-lg px-3 py-2 text-sm font-medium text-purple-brand">
                  Sign In →
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
