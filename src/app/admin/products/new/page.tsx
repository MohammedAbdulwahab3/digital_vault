import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Admin · New Product" };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold tracking-tight">
        New <span className="text-gradient">product</span>
      </h1>
      <ProductForm />
    </div>
  );
}
