"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ProductCard, type ProductCardData } from "../product-card";
import { useLang } from "../language-provider";
import { CATEGORIES } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function TrendingGrid({ products }: { products: ProductCardData[] }) {
  const [filter, setFilter] = useState("all");
  const { t } = useLang();

  const FILTERS = [
    { slug: "all", label: t.home.all },
    ...CATEGORIES.map((c) => ({
      slug: c.slug,
      label: t.categories[c.slug]?.short ?? c.short,
    })),
  ];

  const visible =
    filter === "all"
      ? products.slice(0, 8)
      : products.filter((p) => p.category === filter);

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.slug}
            onClick={() => setFilter(f.slug)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              filter === f.slug
                ? "bg-gradient-brand text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)]"
                : "glass text-fog-2 hover:text-fog"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="py-16 text-center text-fog-2">{t.home.noProducts}</p>
      )}

      <div className="mt-12 text-center">
        <Link href="/products" className="btn-outline">
          {t.home.viewCatalog}
        </Link>
      </div>
    </div>
  );
}
