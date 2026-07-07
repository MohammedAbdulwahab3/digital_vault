"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "./store-provider";
import { TiltCard, RatingStars, FormatTag } from "./ui";
import { formatPrice, parseJsonArray, cn } from "@/lib/utils";
import { categoryLabel } from "@/lib/catalog";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number | null;
  description: string;
  image: string;
  badge: string | null;
  formats: string;
  polyCount: string | null;
  rigType: string | null;
  rating: number;
  reviewCount: number;
  salesCount: number;
};

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-gradient-to-r from-amber-500 to-orange-500",
  Popular: "bg-gradient-to-r from-cyan-500 to-blue-500",
  New: "bg-gradient-to-r from-emerald-500 to-teal-500",
  Premium: "bg-gradient-to-r from-violet-600 to-fuchsia-500",
  "Staff Pick": "bg-gradient-to-r from-pink-500 to-rose-500",
  Limited: "bg-gradient-to-r from-red-500 to-orange-500",
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const formats = parseJsonArray(product.formats);
  const wishlisted = wishlist.includes(product.id);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <TiltCard className="h-full">
      <div className="gradient-ring glass group flex h-full flex-col overflow-hidden rounded-[16px] transition-shadow duration-300 hover:shadow-[0_20px_60px_-15px_rgba(124,58,237,0.4)]">
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-[4/3] overflow-hidden"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-60" />

          {/* Interactive-preview hint */}
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex items-center gap-2 rounded-full bg-ink/80 py-2 pl-2.5 pr-4 text-xs font-bold backdrop-blur">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-brand text-[9px] text-white">
                ▶
              </span>
              {product.category === "blender-3d" ? "3D preview" : "Live preview"}
            </span>
          </span>

          {product.badge && (
            <span
              className={cn(
                "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg",
                BADGE_STYLES[product.badge] ?? "bg-gradient-brand"
              )}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute left-3 top-11 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-bold text-emerald-400 backdrop-blur">
              -{discount}%
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            aria-label="Toggle wishlist"
            className={cn(
              "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-all",
              wishlisted
                ? "bg-pink-brand/90 text-white"
                : "bg-ink/60 text-fog-2 opacity-0 hover:text-pink-brand group-hover:opacity-100"
            )}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {product.polyCount && (
            <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-ink/75 px-2.5 py-1 text-[10px] font-semibold text-orange-300 backdrop-blur">
              <span className="text-orange-400">◆</span> {product.polyCount}
              {product.rigType && (
                <>
                  <span className="text-fog-2">·</span>
                  <span className="text-cyan-300">⚙ Rigged</span>
                </>
              )}
            </span>
          )}
        </Link>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-purple-brand">
              {categoryLabel(product.category)}
            </span>
            <span className="flex items-center gap-1 text-fog-2">
              <RatingStars rating={product.rating} />
              <span className="ml-0.5">
                {product.rating > 0 ? product.rating.toFixed(1) : "—"}
              </span>
            </span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="font-display text-[15px] font-bold leading-snug transition-colors hover:text-purple-brand"
          >
            {product.name}
          </Link>

          {formats.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {formats.slice(0, 4).map((f) => (
                <FormatTag key={f} format={f} size="xs" />
              ))}
            </div>
          )}

          <p className="line-clamp-2 text-xs leading-relaxed text-fog-2">
            {product.description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="font-display text-lg font-bold">
              {formatPrice(product.price)}
              {product.oldPrice && (
                <span className="ml-2 text-xs font-normal text-fog-2 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </span>
            <button
              onClick={() =>
                addToCart({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                })
              }
              className="rounded-full border border-purple-brand/40 bg-purple-brand/10 px-3.5 py-1.5 text-xs font-semibold text-purple-300 transition-all hover:border-transparent hover:bg-gradient-brand hover:text-white hover:shadow-[0_4px_20px_rgba(124,58,237,0.5)]"
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
