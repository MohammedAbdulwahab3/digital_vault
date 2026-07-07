import { z } from "zod";
import { CATEGORIES } from "./catalog";

export const productSchema = z.object({
  name: z.string().min(3).max(120),
  category: z.string().refine((c) => CATEGORIES.some((cat) => cat.slug === c)),
  price: z.number().int().min(0),
  oldPrice: z.number().int().min(0).nullable().optional(),
  description: z.string().min(10).max(300),
  longDescription: z.string().max(5000).default(""),
  image: z.string().min(1),
  badge: z.string().max(30).nullable().optional(),
  formats: z.array(z.string().max(20)).max(10).default([]),
  features: z.array(z.string().max(120)).max(12).default([]),
  tags: z.array(z.string().max(30)).max(10).default([]),
  polyCount: z.string().max(30).nullable().optional(),
  rigType: z.string().max(50).nullable().optional(),
  blenderVersion: z.string().max(20).nullable().optional(),
  renderer: z.string().max(50).nullable().optional(),
  fileSize: z.string().max(20).default("120 MB"),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export function toProductData(data: z.infer<typeof productSchema>) {
  return {
    ...data,
    oldPrice: data.oldPrice ?? null,
    badge: data.badge || null,
    polyCount: data.polyCount || null,
    rigType: data.rigType || null,
    blenderVersion: data.blenderVersion || null,
    renderer: data.renderer || null,
    formats: JSON.stringify(data.formats),
    features: JSON.stringify(data.features),
    tags: JSON.stringify(data.tags),
  };
}
