"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "🗃️" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/requests", label: "Requests", icon: "💬" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/reviews", label: "Reviews", icon: "⭐" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <aside>
      <div className="glass rounded-2xl p-2 lg:sticky lg:top-24">
        <p className="px-4 pb-2 pt-3 text-[11px] font-bold uppercase tracking-widest text-purple-brand">
          ⚡ Admin
        </p>
        <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
          {LINKS.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
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
      </div>
    </aside>
  );
}
