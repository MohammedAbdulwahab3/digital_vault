"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLang } from "@/components/language-provider";

export function AccountNav() {
  const pathname = usePathname();
  const { t } = useLang();
  const LINKS = [
    { href: "/account", label: t.account.overview, icon: "📊" },
    { href: "/account/orders", label: t.account.orders, icon: "📦" },
    { href: "/account/requests", label: t.account.requests, icon: "💬" },
    { href: "/account/wishlist", label: t.account.wishlist, icon: "❤️" },
  ];
  return (
    <aside>
      <nav className="glass flex flex-row gap-1 overflow-x-auto rounded-2xl p-2 lg:sticky lg:top-24 lg:flex-col">
        {LINKS.map((link) => {
          const active =
            link.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-brand text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)]"
                  : "text-fog-2 hover:bg-white/5 hover:text-fog"
              )}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
