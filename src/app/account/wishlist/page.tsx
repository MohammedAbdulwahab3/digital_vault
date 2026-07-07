import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ProductCard, type ProductCardData } from "@/components/product-card";

export const dynamic = "force-dynamic";
export const metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/wishlist");

  const items = await db.wishlistItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  const products: ProductCardData[] = items
    .filter((i) => i.product.published)
    .map(({ product: p }) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price,
      oldPrice: p.oldPrice,
      description: p.description,
      image: p.image,
      badge: p.badge,
      formats: p.formats,
      polyCount: p.polyCount,
      rigType: p.rigType,
      rating: p.rating,
      reviewCount: p.reviewCount,
      salesCount: p.salesCount,
    }));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Your <span className="text-gradient-warm">wishlist</span>
      </h1>
      <p className="mt-2 text-fog-2">Assets you're keeping an eye on.</p>

      {products.length === 0 ? (
        <div className="glass mt-8 rounded-2xl py-16 text-center">
          <span className="text-4xl opacity-40">🤍</span>
          <p className="mt-4 text-fog-2">Nothing wishlisted yet — tap the heart on any product.</p>
          <Link href="/products" className="btn-primary mt-5 inline-flex">Explore products</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
