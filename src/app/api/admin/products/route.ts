import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { handle, json } from "@/lib/api";
import { slugify } from "@/lib/utils";
import { productSchema, toProductData } from "@/lib/product-schema";

export const POST = handle(async (req: Request) => {
  await requireAdmin();
  const data = productSchema.parse(await req.json());

  let slug = slugify(data.name);
  const clash = await db.product.findUnique({ where: { slug } });
  if (clash) slug = `${slug}-${Date.now().toString(36)}`;

  const product = await db.product.create({
    data: { ...toProductData(data), slug },
  });
  return json({ product }, 201);
});
