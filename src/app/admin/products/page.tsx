import Link from "next/link";
import { db } from "@/lib/db";
import { ProductsTable } from "./products-table";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Products" };

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      price: true,
      image: true,
      rating: true,
      salesCount: true,
      featured: true,
      published: true,
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-2 text-fog-2">{products.length} products in the catalog.</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">+ New product</Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
