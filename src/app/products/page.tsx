import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Footer } from "@/components/footer";
import { CatalogView } from "./catalog-view";
import type { ProductCardData } from "@/components/product-card";

export const dynamic = "force-dynamic";

export const metadata = { title: "Explore Products" };

type Search = {
  q?: string;
  category?: string;
  sort?: string;
  max?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const q = params.q?.trim();
  const category = params.category;
  const sort = params.sort ?? "popular";
  const max = params.max ? parseInt(params.max, 10) : undefined;

  const where: Prisma.ProductWhereInput = {
    published: true,
    ...(category ? { category } : {}),
    ...(max ? { price: { lte: max * 100 } } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { tags: { contains: q.toLowerCase() } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "rating"
          ? { rating: "desc" }
          : sort === "newest"
            ? { createdAt: "desc" }
            : { salesCount: "desc" };

  const products = await db.product.findMany({ where, orderBy });

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
      <CatalogView
        products={cardData}
        activeCategory={category ?? "all"}
        activeSort={sort}
        query={q ?? ""}
        maxPrice={max}
      />
      <Footer />
    </>
  );
}
