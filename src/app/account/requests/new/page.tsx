import { db } from "@/lib/db";
import { NewRequestForm } from "./new-request-form";

export const metadata = { title: "New Custom Request" };

export default async function NewRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productSlug } = await searchParams;

  const product = productSlug
    ? await db.product.findUnique({
        where: { slug: productSlug },
        select: { id: true, slug: true, name: true, image: true, category: true },
      })
    : null;

  return <NewRequestForm product={product} />;
}
