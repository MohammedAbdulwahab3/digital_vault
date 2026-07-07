import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseJsonArray } from "@/lib/utils";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Edit Product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold tracking-tight">
        Edit <span className="text-gradient">{product.name}</span>
      </h1>
      <ProductForm
        initial={{
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          oldPrice: product.oldPrice,
          description: product.description,
          longDescription: product.longDescription,
          image: product.image,
          badge: product.badge,
          formats: parseJsonArray(product.formats),
          features: parseJsonArray(product.features),
          tags: parseJsonArray(product.tags),
          platforms: parseJsonArray(product.platforms),
          polyCount: product.polyCount,
          rigType: product.rigType,
          blenderVersion: product.blenderVersion,
          renderer: product.renderer,
          fileSize: product.fileSize,
          featured: product.featured,
          published: product.published,
        }}
      />
    </div>
  );
}
