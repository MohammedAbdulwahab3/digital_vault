export type CategoryDef = {
  slug: string;
  label: string;
  short: string;
  icon: string;
  blurb: string;
  gradient: string;
};

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "web",
    label: "Web Templates",
    short: "Web",
    icon: "🌐",
    blurb: "Dashboards, landing pages & full sites",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    slug: "app",
    label: "App Templates",
    short: "App",
    icon: "📱",
    blurb: "Flutter & React mobile app kits",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    slug: "ui-kit",
    label: "UI Kits",
    short: "UI Kit",
    icon: "🎨",
    blurb: "Design systems & component libraries",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    slug: "blender-3d",
    label: "Blender Characters",
    short: "Blender 3D",
    icon: "🧑‍🎨",
    blurb: "Rigged & animated Blender characters",
    gradient: "from-orange-500 to-amber-500",
  },
];

export function categoryLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.short ?? slug;
}

export function categoryDef(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Downloadable code packages a product can ship as. */
export type PlatformDef = {
  slug: string;
  label: string;
  icon: string;
  hint: string;
};

export const PLATFORMS: PlatformDef[] = [
  { slug: "nextjs", label: "Next.js", icon: "▲", hint: "App Router · TypeScript · Tailwind" },
  { slug: "react", label: "React", icon: "⚛", hint: "Vite · TypeScript SPA" },
  { slug: "flutter", label: "Flutter", icon: "🐦", hint: "Material 3 · iOS & Android" },
  { slug: "blender", label: "Blender", icon: "🔶", hint: "Procedural .py builder + guide" },
];

export function platformDef(slug: string) {
  return PLATFORMS.find((p) => p.slug === slug);
}

export const REQUEST_STATUSES = [
  "PENDING",
  "REVIEWING",
  "QUOTED",
  "ACCEPTED",
  "IN_PROGRESS",
  "DELIVERED",
  "DECLINED",
  "COMPLETED",
] as const;

export const ORDER_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;

export const PRODUCT_BADGES = [
  "Best Seller",
  "Popular",
  "New",
  "Premium",
  "Staff Pick",
  "Limited",
] as const;
