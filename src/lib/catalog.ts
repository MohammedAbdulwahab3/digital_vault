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
    blurb: "Landing pages, dashboards & full sites",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    slug: "app",
    label: "App Templates",
    short: "App",
    icon: "📱",
    blurb: "Mobile UI kits & app screen packs",
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
  {
    slug: "3d-model",
    label: "3D Models",
    short: "3D Model",
    icon: "🧊",
    blurb: "Props, environments & hard-surface kits",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    slug: "animation",
    label: "Animations",
    short: "Animation",
    icon: "🎬",
    blurb: "Motion packs, loops & Lottie files",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    slug: "illustration",
    label: "Illustrations",
    short: "Illustration",
    icon: "✍️",
    blurb: "Character art & illustration systems",
    gradient: "from-amber-500 to-pink-500",
  },
];

export function categoryLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.short ?? slug;
}

export function categoryDef(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
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
