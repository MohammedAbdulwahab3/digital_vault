import { db } from "@/lib/db";
import { ReviewsTable } from "./reviews-table";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Reviews" };

export default async function AdminReviewsPage() {
  const reviews = await db.review.findMany({
    include: {
      user: { select: { name: true } },
      product: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Reviews</h1>
      <p className="mt-2 text-fog-2">{reviews.length} verified-purchase reviews.</p>
      <ReviewsTable
        reviews={reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          title: r.title,
          body: r.body,
          userName: r.user.name,
          productName: r.product.name,
          productSlug: r.product.slug,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
