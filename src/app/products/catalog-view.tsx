"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { motion } from "framer-motion";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { CATEGORIES } from "@/lib/catalog";
import { useLang } from "@/components/language-provider";
import { cn } from "@/lib/utils";

const PRICE_CAPS = [25, 50, 75, 100];

export function CatalogView({
  products,
  activeCategory,
  activeSort,
  query,
  maxPrice,
}: {
  products: ProductCardData[];
  activeCategory: string;
  activeSort: string;
  query: string;
  maxPrice?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLang();

  const SORTS = [
    { value: "popular", label: t.catalog.sortPopular },
    { value: "newest", label: t.catalog.sortNewest },
    { value: "rating", label: t.catalog.sortRating },
    { value: "price-asc", label: t.catalog.sortPriceAsc },
    { value: "price-desc", label: t.catalog.sortPriceDesc },
  ];

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) params.delete(key);
      else params.set(key, value);
      router.push(`/products?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-12">
      <div className="orb -right-40 -top-20 h-[420px] w-[420px] bg-violet-brand/10" />

      <header className="relative mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          {query ? (
            <>{t.catalog.resultsFor} “<span className="text-gradient">{query}</span>”</>
          ) : (
            <>{t.catalog.explorePre}<span className="text-gradient">{t.catalog.exploreSpan}</span></>
          )}
        </h1>
        <p className="mt-2 text-fog-2">
          {products.length} {products.length === 1 ? t.catalog.product : t.catalog.products}
          {activeCategory !== "all" &&
            ` ${t.catalog.inCategory} ${t.categories[activeCategory]?.label ?? activeCategory}`}
        </p>
      </header>

      {/* Filter bar */}
      <div className="relative mb-10 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setParam("category", null)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              activeCategory === "all"
                ? "bg-gradient-brand text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)]"
                : "glass text-fog-2 hover:text-fog"
            )}
          >
            {t.catalog.all}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setParam("category", cat.slug)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                activeCategory === cat.slug
                  ? "bg-gradient-brand text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)]"
                  : "glass text-fog-2 hover:text-fog"
              )}
            >
              {cat.icon} {t.categories[cat.slug]?.short ?? cat.short}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={activeSort}
            onChange={(e) => setParam("sort", e.target.value)}
            className="field w-auto !rounded-full !py-2 text-sm"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-fog-2">{t.catalog.maxPrice}</span>
            {PRICE_CAPS.map((cap) => (
              <button
                key={cap}
                onClick={() => setParam("max", maxPrice === cap ? null : String(cap))}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                  maxPrice === cap
                    ? "border-transparent bg-cyan-brand/20 text-cyan-brand"
                    : "border-white/10 text-fog-2 hover:text-fog"
                )}
              >
                ${cap}
              </button>
            ))}
          </div>

          {(query || activeCategory !== "all" || maxPrice) && (
            <button
              onClick={() => router.push("/products")}
              className="text-xs text-fog-2 underline underline-offset-4 transition hover:text-fog"
            >
              {t.catalog.clearFilters}
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="glass rounded-3xl py-24 text-center">
          <p className="text-4xl">🔭</p>
          <p className="mt-4 font-display text-xl font-bold">{t.catalog.nothingFound}</p>
          <p className="mt-2 text-sm text-fog-2">
            {t.catalog.nothingFoundSub}
          </p>
          <a href="/requests" className="btn-primary mt-6 inline-flex">
            {t.catalog.requestCustom}
          </a>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
