import Link from "next/link";
import { db } from "@/lib/db";
import { Hero } from "@/components/home/hero";
import { TrendingGrid } from "@/components/home/trending";
import { Reveal, SectionHeader, RatingStars } from "@/components/ui";
import { Footer } from "@/components/footer";
import { CATEGORIES } from "@/lib/catalog";
import type { ProductCardData } from "@/components/product-card";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: "⚡", title: "Instant Downloads", body: "Files unlock the moment payment clears. No waiting, no emails — start creating right away." },
  { icon: "🛡️", title: "Commercial License", body: "Every product ships with a commercial license. Use it freely in client and personal projects." },
  { icon: "🎨", title: "Curated Quality", body: "Every product is hand-reviewed by our team for premium quality and usability standards." },
  { icon: "🔄", title: "Free Updates", body: "Lifetime updates on every purchase. Your library stays current with the latest versions." },
  { icon: "💬", title: "Custom Requests", body: "Need something bespoke? Submit a brief, get a quote, and chat with creators right in your dashboard." },
  { icon: "💰", title: "Money-Back Guarantee", body: "Not satisfied? Full refund within 30 days — no questions asked." },
];

const MARQUEE_ITEMS = [
  ".blend", "Figma", ".fbx", "React", ".gltf", "Tailwind", "Lottie",
  "4K PBR", "Rigged", ".obj", "Storybook", "Rive", "SVG", "Design Tokens",
];

export default async function HomePage() {
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
          eyebrow="Browse"
          title={<>Find your next <span className="text-gradient">asset</span></>}
          subtitle="Seven curated categories, one consistent quality bar."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.06}>
              <Link
                href={`/products?category=${cat.slug}`}
                className="gradient-ring glass group flex h-full flex-col items-center gap-2 rounded-2xl px-4 py-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_-12px_rgba(124,58,237,0.45)]"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient} text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  {cat.icon}
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
            eyebrow="Marketplace"
            title={<>Trending <span className="text-gradient">products</span></>}
            subtitle="Curated collection of our best-selling digital designs"
          />
          <TrendingGrid products={cardData} />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeader
          eyebrow="Why PixelVault"
          title={<>Built for <span className="text-gradient-warm">serious creators</span></>}
          subtitle="The premium marketplace trusted by designers worldwide"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
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
              eyebrow="Reviews"
              title={<>Loved by <span className="text-gradient">creators</span></>}
              subtitle="Verified purchase reviews from the community"
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
                        <p className="text-xs text-fog-2">on {review.product.name}</p>
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
            Ready to create something <span className="shimmer-text">amazing?</span>
          </h2>
          <p className="mt-4 text-lg text-fog-2">
            Join 8,500+ creators. Browse the catalog or commission bespoke work
            from our design team.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-primary !px-8 !py-3 !text-base">
              Create free account
            </Link>
            <Link href="/products" className="btn-outline !px-8 !py-3 !text-base">
              Browse products
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
