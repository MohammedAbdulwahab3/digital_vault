import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Footer } from "@/components/footer";
import { Reveal, RatingStars, FormatTag } from "@/components/ui";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { ProductShowcase } from "@/components/showcase";
import { ProductActions } from "./product-actions";
import { ReviewSection } from "./review-section";
import { formatPrice, parseJsonArray, formatDate } from "@/lib/utils";
import { categoryDef, categoryLabel, platformDef } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSession();

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      reviews: {
        include: { user: { select: { name: true, avatarHue: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!product || !product.published) notFound();

  const [related, purchased, ownReview] = await Promise.all([
    db.product.findMany({
      where: { category: product.category, published: true, id: { not: product.id } },
      orderBy: { salesCount: "desc" },
      take: 4,
    }),
    session
      ? db.orderItem.findFirst({
          where: {
            productId: product.id,
            order: { userId: session.sub, status: "PAID" },
          },
        })
      : null,
    session
      ? db.review.findUnique({
          where: { userId_productId: { userId: session.sub, productId: product.id } },
        })
      : null,
  ]);

  const formats = parseJsonArray(product.formats);
  const features = parseJsonArray(product.features);
  const platforms = parseJsonArray(product.platforms);
  const isBlender = product.category === "blender-3d" || product.category === "3d-model";
  const cat = categoryDef(product.category);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const relatedCards: ProductCardData[] = related.map((p) => ({
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
    <>
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-10">
        <div className="orb -left-40 top-40 h-[500px] w-[500px] bg-violet-brand/10" />

        {/* Breadcrumb */}
        <nav className="relative mb-8 flex items-center gap-2 text-sm text-fog-2">
          <Link href="/" className="transition hover:text-fog">Home</Link>
          <span>/</span>
          <Link href="/products" className="transition hover:text-fog">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="transition hover:text-fog">
            {categoryLabel(product.category)}
          </Link>
          <span>/</span>
          <span className="text-fog">{product.name}</span>
        </nav>

        <div className="relative grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          {/* ── Interactive showcase ── */}
          <Reveal>
            <ProductShowcase
              product={{
                slug: product.slug,
                name: product.name,
                category: product.category,
                image: product.image,
                polyCount: product.polyCount,
                rigType: product.rigType,
              }}
            />

            {/* Feature list */}
            {features.length > 0 && (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {features.map((f) => (
                  <div key={f} className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs text-emerald-400">✓</span>
                    {f}
                  </div>
                ))}
              </div>
            )}
          </Reveal>

          {/* ── Info ── */}
          <Reveal delay={0.1}>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                isBlender
                  ? "border-orange-400/30 bg-orange-400/10 text-orange-300"
                  : "border-purple-brand/30 bg-purple-brand/10 text-purple-brand"
              }`}
            >
              {cat?.icon} {categoryLabel(product.category)}
            </span>

            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-fog-2">
              <RatingStars rating={product.rating} />
              <span>
                <strong className="text-fog">{product.rating > 0 ? product.rating.toFixed(1) : "New"}</strong>
                {product.reviewCount > 0 && ` · ${product.reviewCount} reviews`}
              </span>
              <span className="text-fog-2/50">•</span>
              <span>{product.salesCount.toLocaleString()} sales</span>
            </div>

            <p className="mt-5 leading-relaxed text-fog-2">{product.description}</p>

            {platforms.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-fog-2">
                  Ready-to-run code packages
                </p>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((slug) => {
                    const platform = platformDef(slug);
                    if (!platform) return null;
                    return (
                      <span
                        key={slug}
                        title={platform.hint}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold"
                      >
                        <span className="text-purple-brand">{platform.icon}</span>
                        {platform.label}
                        <span className="hidden text-[10px] font-normal text-fog-2 sm:inline">
                          · {platform.hint}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {formats.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-fog-2">
                  File formats
                </p>
                <div className="flex flex-wrap gap-2">
                  {formats.map((f) => (
                    <FormatTag key={f} format={f} />
                  ))}
                </div>
              </div>
            )}

            {/* Spec grid */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {product.polyCount && (
                <div className="glass rounded-xl p-3.5">
                  <p className="text-[11px] uppercase tracking-widest text-fog-2">Poly count</p>
                  <p className="mt-1 text-sm font-bold text-orange-300">{product.polyCount}</p>
                </div>
              )}
              {product.rigType && (
                <div className="glass rounded-xl p-3.5">
                  <p className="text-[11px] uppercase tracking-widest text-fog-2">Rig</p>
                  <p className="mt-1 text-sm font-bold">{product.rigType}</p>
                </div>
              )}
              {product.blenderVersion && (
                <div className="glass rounded-xl p-3.5">
                  <p className="text-[11px] uppercase tracking-widest text-fog-2">Blender</p>
                  <p className="mt-1 text-sm font-bold text-orange-300">{product.blenderVersion}</p>
                </div>
              )}
              {product.renderer && (
                <div className="glass rounded-xl p-3.5">
                  <p className="text-[11px] uppercase tracking-widest text-fog-2">Renderer</p>
                  <p className="mt-1 text-sm font-bold">{product.renderer}</p>
                </div>
              )}
              <div className="glass rounded-xl p-3.5">
                <p className="text-[11px] uppercase tracking-widest text-fog-2">Package size</p>
                <p className="mt-1 text-sm font-bold">{product.fileSize}</p>
              </div>
              <div className="glass rounded-xl p-3.5">
                <p className="text-[11px] uppercase tracking-widest text-fog-2">Released</p>
                <p className="mt-1 text-sm font-bold">{formatDate(product.createdAt)}</p>
              </div>
            </div>

            {/* Price + actions */}
            <div className="gradient-ring glass mt-8 rounded-2xl p-6">
              <div className="flex items-end gap-3">
                <span className="font-display text-4xl font-bold text-gradient">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="pb-1 text-lg text-fog-2 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                    <span className="mb-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-400">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              <ProductActions
                product={{
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                }}
                owned={Boolean(purchased)}
              />

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-fog-2">
                <span>⚡ Instant download</span>
                <span>🛡️ Commercial license</span>
                <span>🔄 Lifetime updates</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Long description */}
        {product.longDescription && (
          <Reveal className="relative mt-16 max-w-3xl">
            <h2 className="font-display text-2xl font-bold">About this product</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-fog-2">
              {product.longDescription}
            </p>
          </Reveal>
        )}

        {/* Reviews */}
        <ReviewSection
          productId={product.id}
          reviews={product.reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            title: r.title,
            body: r.body,
            createdAt: r.createdAt.toISOString(),
            userName: r.user.name,
            avatarHue: r.user.avatarHue,
          }))}
          canReview={Boolean(purchased)}
          isLoggedIn={Boolean(session)}
          ownReview={
            ownReview
              ? { rating: ownReview.rating, title: ownReview.title, body: ownReview.body }
              : null
          }
        />

        {/* Related */}
        {relatedCards.length > 0 && (
          <section className="relative mt-20">
            <h2 className="mb-8 font-display text-2xl font-bold">
              More {categoryLabel(product.category)} assets
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCards.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}
