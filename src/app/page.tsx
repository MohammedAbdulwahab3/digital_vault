import Link from "next/link";
import { db } from "@/lib/db";
import { Hero } from "@/components/home/hero";
import { TrendingGrid } from "@/components/home/trending";
import { Reveal, SectionHeader, RatingStars } from "@/components/ui";
import { Footer } from "@/components/footer";
import { getServerDict } from "@/lib/locale-server";
import type { ProductCardData } from "@/components/product-card";

export const dynamic = "force-dynamic";

const MARQUEE_ITEMS = [
  "Next.js", ".blend", "Figma", "Flutter", ".fbx", "React", ".gltf",
  "Tailwind", "Dart", "4K PBR", "Rigged", "TypeScript", "Material 3", "Design Tokens",
];

export default async function HomePage() {
  const { locale, t } = await getServerDict();
  const [products, productCount, testimonials] = await Promise.all([
    db.product.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { salesCount: "desc" }],
      take: 24,
    }),
    db.product.count({ where: { published: true } }),
    db.review.findMany({
      where: { rating: 5 },
      include: { user: { select: { name: true } }, product: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const cardData: ProductCardData[] = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: locale === "am" && p.nameAm ? p.nameAm : p.name,
    category: p.category,
    price: p.price,
    oldPrice: p.oldPrice,
    description: locale === "am" && p.descriptionAm ? p.descriptionAm : p.description,
    image: p.image,
    badge: p.badge,
    formats: p.formats,
    polyCount: p.polyCount,
    rigType: p.rigType,
    rating: p.rating,
    reviewCount: p.reviewCount,
    salesCount: p.salesCount,
  }));

  const categoryEntries = Object.entries(t.categories);
  const CATEGORY_GRADIENTS: Record<string, string> = {
    web: "from-violet-500 to-fuchsia-500",
    app: "from-cyan-500 to-blue-500",
    "ui-kit": "from-pink-500 to-rose-500",
    "blender-3d": "from-orange-500 to-amber-500",
  };
  const CATEGORY_ICONS: Record<string, string> = {
    web: "🌐",
    app: "📱",
    "ui-kit": "🎨",
    "blender-3d": "🧑‍🎨",
  };

  return (
    <>
      <Hero productCount={productCount} />

      {/* Format marquee */}
      <div className="relative overflow-hidden border-y border-white/5 bg-ink-2/60 py-4">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-12 font-mono text-sm text-fog-2/70">
              {item} <span className="text-purple-brand/60">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-24" id="categories">
        <SectionHeader
          eyebrow={t.home.browseEyebrow}
          title={<>{t.home.browseTitlePre}<span className="text-gradient">{t.home.browseTitleSpan}</span></>}
          subtitle={t.home.browseSubtitle}
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categoryEntries.map(([slug, cat], i) => (
            <Reveal key={slug} delay={i * 0.06}>
              <Link
                href={`/products?category=${slug}`}
                className="gradient-ring glass group flex h-full flex-col items-center gap-2 rounded-2xl px-4 py-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_-12px_rgba(124,58,237,0.45)]"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${CATEGORY_GRADIENTS[slug]} text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  {CATEGORY_ICONS[slug]}
                </span>
                <span className="mt-1 text-sm font-bold leading-tight">{cat.label}</span>
                <span className="text-[11px] leading-snug text-fog-2">{cat.blurb}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trending products */}
      <section className="border-y border-white/5 bg-ink-2/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow={t.home.trendingEyebrow}
            title={<>{t.home.trendingTitlePre}<span className="text-gradient">{t.home.trendingTitleSpan}</span></>}
            subtitle={t.home.trendingSubtitle}
          />
          <TrendingGrid products={cardData} />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeader
          eyebrow={t.home.whyEyebrow}
          title={<>{t.home.whyTitlePre}<span className="text-gradient-warm">{t.home.whyTitleSpan}</span></>}
          subtitle={t.home.whySubtitle}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.home.features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.07}>
              <div className="gradient-ring glass group h-full rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1">
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-2xl shadow-[0_8px_24px_rgba(124,58,237,0.35)] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  {f.icon}
                </span>
                <h3 className="font-display text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog-2">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials from real reviews */}
      {testimonials.length > 0 && (
        <section className="border-y border-white/5 bg-ink-2/40 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader
              eyebrow={t.home.reviewsEyebrow}
              title={<>{t.home.reviewsTitlePre}<span className="text-gradient">{t.home.reviewsTitleSpan}</span></>}
              subtitle={t.home.reviewsSubtitle}
            />
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((review, i) => (
                <Reveal key={review.id} delay={i * 0.08}>
                  <figure className="gradient-ring glass flex h-full flex-col rounded-2xl p-7">
                    <RatingStars rating={review.rating} />
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-fog">
                      “{review.body}”
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-white">
                        {review.user.name.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{review.user.name}</p>
                        <p className="text-xs text-fog-2">
                          {t.home.reviewOn} {review.product.name}
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden py-28">
        <div className="orb left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-violet-brand/15" />
        <Reveal className="relative mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {t.home.ctaTitlePre}<span className="shimmer-text">{t.home.ctaTitleSpan}</span>
          </h2>
          <p className="mt-4 text-lg text-fog-2">{t.home.ctaSubtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-primary !px-8 !py-3 !text-base">
              {t.home.ctaRegister}
            </Link>
            <Link href="/products" className="btn-outline !px-8 !py-3 !text-base">
              {t.home.ctaBrowse}
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
