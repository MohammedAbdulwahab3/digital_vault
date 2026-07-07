"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/components/store-provider";
import { Spinner } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, PRODUCT_BADGES, PLATFORMS } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/utils";

const PRESET_IMAGES = [
  "/images/product-web-design.png",
  "/images/product-app-design.png",
  "/images/product-ui-kit.png",
  "/images/product-blender-character.png",
  "/images/hero-banner.png",
];

/** Smart defaults applied when the admin picks a category. */
const CATEGORY_DEFAULTS: Record<
  string,
  {
    image: string;
    fileSize: string;
    platforms: string[];
    formats: string[];
    features: string[];
    threeD?: { polyCount: string; rigType: string; blenderVersion: string; renderer: string };
  }
> = {
  web: {
    image: "/images/product-web-design.png",
    fileSize: "150 MB",
    platforms: ["nextjs", "react", "flutter"],
    formats: ["figma", "nextjs", "react", "tailwind"],
    features: ["Responsive layouts", "Dark & light themes", "Design tokens", "Clean TypeScript source"],
  },
  app: {
    image: "/images/product-app-design.png",
    fileSize: "100 MB",
    platforms: ["flutter", "nextjs", "react"],
    formats: ["figma", "flutter"],
    features: ["30+ screens", "Material 3 theming", "Interactive prototype flows", "Flutter source included"],
  },
  "ui-kit": {
    image: "/images/product-ui-kit.png",
    fileSize: "220 MB",
    platforms: ["nextjs", "react", "flutter"],
    formats: ["figma", "react", "storybook"],
    features: ["Components with variants", "Two-layer design tokens", "Usage documentation"],
  },
  "blender-3d": {
    image: "/images/product-blender-character.png",
    fileSize: "800 MB",
    platforms: ["blender"],
    formats: ["blend", "fbx", "obj", "gltf"],
    features: ["Full body rig", "4K PBR textures", "Game-engine export presets"],
    threeD: { polyCount: "40K", rigType: "Full Body", blenderVersion: "3.6+", renderer: "Cycles / EEVEE" },
  },
};

const DESCRIPTION_STUBS: Record<string, (name: string) => { short: string; long: string }> = {
  web: (name) => ({
    short: `Modern web template with responsive layouts, dark/light themes and production-ready code.`,
    long: `${name} is a production-grade web template built for teams that ship fast. Every screen is responsive down to 320px, themed through a single token file, and delivered as clean TypeScript source in Next.js and React editions. Includes auth-ready page structures, reusable components and written setup docs.`,
  }),
  app: (name) => ({
    short: `Mobile app UI kit with polished screens, Material 3 theming and Flutter source code.`,
    long: `${name} covers the core journeys of a modern mobile app with pixel-perfect screens in light and dark variants. Ships with a complete Flutter implementation (Material 3), interactive prototype flows, and a design token set that recolors the whole app from one file.`,
  }),
  "ui-kit": (name) => ({
    short: `Component library and design system with variants, tokens and documentation.`,
    long: `${name} is a complete design system: components with true variants and properties, a two-layer token architecture (primitive + semantic), composed example screens and written usage docs for every component family. The code export mirrors the design structure 1:1.`,
  }),
  "blender-3d": (name) => ({
    short: `Rigged Blender character with PBR textures, animations and game-engine export presets.`,
    long: `${name} is a production-ready character for films, games and cinematics. Includes a full FK/IK rig, PBR texture sets, baked animation clips and clean quad topology. Export presets for Unity, Unreal and Godot are included, plus a lit turntable scene ready to render.`,
  }),
};

export type ProductFormValues = {
  id?: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number | null;
  description: string;
  longDescription: string;
  image: string;
  badge: string | null;
  formats: string[];
  features: string[];
  tags: string[];
  platforms: string[];
  polyCount: string | null;
  rigType: string | null;
  blenderVersion: string | null;
  renderer: string | null;
  fileSize: string;
  featured: boolean;
  published: boolean;
};

const EMPTY: ProductFormValues = {
  name: "",
  category: "web",
  price: 2900,
  oldPrice: null,
  description: "",
  longDescription: "",
  image: PRESET_IMAGES[0],
  badge: null,
  formats: [...CATEGORY_DEFAULTS.web.formats],
  features: [...CATEGORY_DEFAULTS.web.features],
  tags: [],
  platforms: [...CATEGORY_DEFAULTS.web.platforms],
  polyCount: null,
  rigType: null,
  blenderVersion: null,
  renderer: null,
  fileSize: CATEGORY_DEFAULTS.web.fileSize,
  featured: false,
  published: true,
};

const STEPS = [
  { title: "Basics", icon: "✏️", hint: "Name & story" },
  { title: "Pricing", icon: "💰", hint: "Price & packages" },
  { title: "Media", icon: "🎨", hint: "Image & details" },
  { title: "Publish", icon: "🚀", hint: "Review & go live" },
];

export function ProductForm({ initial }: { initial?: ProductFormValues }) {
  const router = useRouter();
  const { toast } = useStore();
  const [values, setValues] = useState<ProductFormValues>(initial ?? EMPTY);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editing = Boolean(initial?.id);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const is3D = values.category === "blender-3d";

  const pickCategory = (slug: string) => {
    if (slug === values.category) return;
    const defaults = CATEGORY_DEFAULTS[slug];
    setValues((v) => ({
      ...v,
      category: slug,
      // Smart defaults — everything stays editable in later steps
      image: editing ? v.image : defaults.image,
      fileSize: defaults.fileSize,
      platforms: [...defaults.platforms],
      formats: [...defaults.formats],
      features: editing ? v.features : [...defaults.features],
      polyCount: defaults.threeD?.polyCount ?? null,
      rigType: defaults.threeD?.rigType ?? null,
      blenderVersion: defaults.threeD?.blenderVersion ?? null,
      renderer: defaults.threeD?.renderer ?? null,
    }));
    if (!editing) toast("✨", "Smart defaults applied — tweak anything you like");
  };

  const writeForMe = () => {
    if (!values.name.trim()) {
      toast("ℹ️", "Give the product a name first");
      return;
    }
    const stub = DESCRIPTION_STUBS[values.category](values.name.trim());
    setValues((v) => ({
      ...v,
      description: v.description || stub.short,
      longDescription: v.longDescription || stub.long,
    }));
    toast("✍️", "Draft written — edit it to make it yours");
  };

  const stepError = (index: number): string | null => {
    if (index === 0) {
      if (values.name.trim().length < 3) return "Product name needs at least 3 characters";
      if (values.description.trim().length < 10) return "Short description needs at least 10 characters";
    }
    if (index === 1) {
      if (values.price <= 0) return "Set a price above $0";
      if (values.platforms.length === 0) return "Pick at least one download package";
    }
    if (index === 2) {
      if (!values.image) return "Pick a cover image";
    }
    return null;
  };

  const next = () => {
    const problem = stepError(step);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const jumpTo = (target: number) => {
    // Allow jumping backward freely; forward only through valid steps
    if (target <= step) {
      setStep(target);
      setError(null);
      return;
    }
    for (let i = step; i < target; i++) {
      const problem = stepError(i);
      if (problem) {
        setStep(i);
        setError(problem);
        return;
      }
    }
    setError(null);
    setStep(target);
  };

  const submit = async () => {
    setError(null);
    setSaving(true);
    const res = await fetch(
      editing ? `/api/admin/products/${initial!.id}` : "/api/admin/products",
      {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }
    );
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Save failed");
      return;
    }
    toast("🎉", editing ? "Product updated" : `${values.name} is ${values.published ? "live" : "saved as draft"}!`);
    router.push("/admin/products");
    router.refresh();
  };

  const previewProduct = useMemo(
    () => ({
      id: initial?.id ?? "preview",
      slug: "preview",
      name: values.name || "Your product name",
      category: values.category,
      price: values.price,
      oldPrice: values.oldPrice,
      description: values.description || "Your short description appears here…",
      image: values.image,
      badge: values.badge,
      formats: JSON.stringify(values.formats),
      polyCount: values.polyCount,
      rigType: values.rigType,
      rating: 0,
      reviewCount: 0,
      salesCount: 0,
    }),
    [values, initial?.id]
  );

  const discount =
    values.oldPrice && values.oldPrice > values.price
      ? Math.round((1 - values.price / values.oldPrice) * 100)
      : 0;

  return (
    <div className="grid max-w-6xl gap-10 xl:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        {/* Stepper */}
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              onClick={() => jumpTo(i)}
              className={cn(
                "group flex flex-1 flex-col gap-1.5 text-left",
                i > step && "opacity-60"
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all",
                    i < step
                      ? "bg-emerald-500/20 text-emerald-400"
                      : i === step
                        ? "bg-gradient-brand text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]"
                        : "bg-white/5 text-fog-2"
                  )}
                >
                  {i < step ? "✓" : s.icon}
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className={cn("block text-xs font-bold", i === step ? "text-fog" : "text-fog-2")}>
                    {s.title}
                  </span>
                  <span className="block truncate text-[10px] text-fog-2/70">{s.hint}</span>
                </span>
              </span>
              <span
                className={cn(
                  "h-1 rounded-full transition-all",
                  i <= step ? "bg-gradient-brand" : "bg-white/8"
                )}
              />
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-6"
          >
            {/* ── STEP 1: Basics ── */}
            {step === 0 && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    What are you selling?
                  </label>
                  <input
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Nebula Dashboard Pro"
                    autoFocus
                    className="field !py-3.5 !text-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Category</label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => pickCategory(cat.slug)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all",
                          values.category === cat.slug
                            ? "border-purple-brand/60 bg-purple-brand/15 shadow-[0_4px_24px_rgba(124,58,237,0.25)]"
                            : "border-white/10 bg-white/[0.02] hover:border-white/25"
                        )}
                      >
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient} text-xl`}
                        >
                          {cat.icon}
                        </span>
                        <span className="text-xs font-bold leading-tight">{cat.label}</span>
                        <span className="text-[10px] leading-snug text-fog-2">{cat.blurb}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-fog-2">
                    ✨ Picking a category pre-fills formats, features, packages and file size —
                    all editable later.
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold">
                      Short description{" "}
                      <span className="font-normal text-fog-2">(shown on cards)</span>
                    </label>
                    <button
                      type="button"
                      onClick={writeForMe}
                      className="rounded-full border border-purple-brand/40 bg-purple-brand/10 px-3 py-1 text-[11px] font-semibold text-purple-300 transition hover:bg-purple-brand/20"
                    >
                      ✨ Write it for me
                    </button>
                  </div>
                  <textarea
                    value={values.description}
                    onChange={(e) => set("description", e.target.value)}
                    maxLength={300}
                    rows={2}
                    placeholder="One or two punchy sentences…"
                    className="field resize-none"
                  />
                  <p className="mt-1 text-right text-[10px] text-fog-2">
                    {values.description.length}/300
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Full story <span className="font-normal text-fog-2">(product page)</span>
                  </label>
                  <textarea
                    value={values.longDescription}
                    onChange={(e) => set("longDescription", e.target.value)}
                    rows={5}
                    placeholder="What's included, who it's for, what makes it special…"
                    className="field resize-none"
                  />
                </div>
              </>
            )}

            {/* ── STEP 2: Pricing & packages ── */}
            {step === 1 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="gradient-ring glass rounded-2xl p-5">
                    <label className="mb-2 block text-sm font-semibold">Price</label>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-2xl font-bold text-fog-2">$</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={values.price / 100 || ""}
                        onChange={(e) =>
                          set("price", Math.round(parseFloat(e.target.value || "0") * 100))
                        }
                        className="field !py-3 !text-2xl font-bold"
                      />
                    </div>
                  </div>
                  <div className="glass rounded-2xl p-5">
                    <label className="mb-2 block text-sm font-semibold">
                      Compare-at price <span className="font-normal text-fog-2">optional</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-2xl font-bold text-fog-2">$</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={values.oldPrice != null ? values.oldPrice / 100 : ""}
                        onChange={(e) =>
                          set(
                            "oldPrice",
                            e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null
                          )
                        }
                        placeholder="—"
                        className="field !py-3 !text-2xl font-bold"
                      />
                    </div>
                    {discount > 0 && (
                      <p className="mt-2 text-xs font-semibold text-emerald-400">
                        Shows as “Save {discount}%” on the store
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Download packages{" "}
                    <span className="font-normal text-fog-2">(what buyers receive)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {PLATFORMS.map((platform) => {
                      const selected = values.platforms.includes(platform.slug);
                      return (
                        <button
                          key={platform.slug}
                          type="button"
                          onClick={() =>
                            set(
                              "platforms",
                              selected
                                ? values.platforms.filter((p) => p !== platform.slug)
                                : [...values.platforms, platform.slug]
                            )
                          }
                          className={cn(
                            "flex flex-col items-center gap-1.5 rounded-2xl border p-4 transition-all",
                            selected
                              ? "border-purple-brand/60 bg-purple-brand/15"
                              : "border-white/10 bg-white/[0.02] hover:border-white/25"
                          )}
                        >
                          <span className="text-xl">{platform.icon}</span>
                          <span className="text-xs font-bold">{platform.label}</span>
                          <span className="text-center text-[9px] leading-snug text-fog-2">
                            {platform.hint}
                          </span>
                          <span
                            className={cn(
                              "mt-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                              selected ? "bg-gradient-brand text-white" : "bg-white/8 text-fog-2"
                            )}
                          >
                            {selected ? "✓" : "+"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">Package size</label>
                    <input
                      value={values.fileSize}
                      onChange={(e) => set("fileSize", e.target.value)}
                      placeholder="240 MB"
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold">Badge</label>
                    <div className="flex flex-wrap gap-1.5">
                      <BadgePill active={values.badge === null} onClick={() => set("badge", null)}>
                        None
                      </BadgePill>
                      {PRODUCT_BADGES.map((badge) => (
                        <BadgePill
                          key={badge}
                          active={values.badge === badge}
                          onClick={() => set("badge", badge)}
                        >
                          {badge}
                        </BadgePill>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 3: Media & details ── */}
            {step === 2 && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-semibold">Cover image</label>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img}
                        type="button"
                        onClick={() => set("image", img)}
                        className={cn(
                          "relative overflow-hidden rounded-xl border-2 transition-all",
                          values.image === img
                            ? "border-purple-brand shadow-[0_4px_20px_rgba(124,58,237,0.4)]"
                            : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <Image
                          src={img}
                          alt=""
                          width={120}
                          height={90}
                          className="aspect-[4/3] w-full object-cover"
                        />
                        {values.image === img && (
                          <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-brand text-[10px] font-bold text-white">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <input
                    value={values.image}
                    onChange={(e) => set("image", e.target.value)}
                    placeholder="…or paste an image URL / path"
                    className="field mt-3 !py-2 text-xs"
                  />
                </div>

                <ListEditor
                  label="Feature bullets"
                  placeholder="e.g. 50+ components"
                  values={values.features}
                  onChange={(v) => set("features", v)}
                />
                <ListEditor
                  label="File formats"
                  placeholder="blend, fbx, figma…"
                  values={values.formats}
                  onChange={(v) => set("formats", v)}
                />
                <ListEditor
                  label="Search tags"
                  placeholder="dashboard, saas…"
                  values={values.tags}
                  onChange={(v) => set("tags", v)}
                />

                {is3D && (
                  <div className="gradient-ring glass grid gap-4 rounded-2xl p-5 sm:grid-cols-2">
                    <p className="col-span-full text-xs font-bold uppercase tracking-widest text-orange-300">
                      🔶 3D specifications
                    </p>
                    <SpecInput label="Poly count" value={values.polyCount} onChange={(v) => set("polyCount", v)} placeholder="52K" />
                    <SpecInput label="Rig type" value={values.rigType} onChange={(v) => set("rigType", v)} placeholder="Full Body + Facial" />
                    <SpecInput label="Blender version" value={values.blenderVersion} onChange={(v) => set("blenderVersion", v)} placeholder="3.6+" />
                    <SpecInput label="Renderer" value={values.renderer} onChange={(v) => set("renderer", v)} placeholder="Cycles / EEVEE" />
                  </div>
                )}
              </>
            )}

            {/* ── STEP 4: Review & publish ── */}
            {step === 3 && (
              <>
                <div className="glass rounded-2xl p-6">
                  <h3 className="mb-4 font-display font-bold">Ready to publish?</h3>
                  <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                    <SummaryRow label="Name" value={values.name} />
                    <SummaryRow
                      label="Category"
                      value={CATEGORIES.find((c) => c.slug === values.category)?.label ?? values.category}
                    />
                    <SummaryRow
                      label="Price"
                      value={
                        formatPrice(values.price) +
                        (values.oldPrice ? ` (was ${formatPrice(values.oldPrice)})` : "")
                      }
                    />
                    <SummaryRow
                      label="Packages"
                      value={values.platforms
                        .map((p) => PLATFORMS.find((x) => x.slug === p)?.label ?? p)
                        .join(", ")}
                    />
                    <SummaryRow label="Features" value={`${values.features.length} bullets`} />
                    <SummaryRow label="Badge" value={values.badge ?? "None"} />
                  </dl>
                </div>

                <div className="glass flex flex-col gap-3 rounded-2xl p-6">
                  <ToggleRow
                    label="⭐ Feature on homepage"
                    hint="Shows in the top row of Trending"
                    checked={values.featured}
                    onChange={(v) => set("featured", v)}
                  />
                  <ToggleRow
                    label="🌐 Publish to store"
                    hint="Off = saved as a hidden draft"
                    checked={values.published}
                    onChange={(v) => set("published", v)}
                  />
                </div>

                {/* Mobile preview (sidebar hidden on small screens) */}
                <div className="pointer-events-none mx-auto w-full max-w-xs xl:hidden">
                  <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-widest text-fog-2">
                    Store preview
                  </p>
                  <ProductCard product={previewProduct} />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={cn("btn-outline", step === 0 && "invisible")}
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary !px-8">
              Continue →
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={saving} className="btn-primary !px-8 !py-3">
              {saving && <Spinner />}
              {editing ? "Save changes" : values.published ? "🚀 Publish product" : "Save draft"}
            </button>
          )}
        </div>
      </div>

      {/* ── Live preview sidebar ── */}
      <aside className="hidden xl:block">
        <div className="sticky top-24">
          <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-fog-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-purple-brand opacity-60" />
              <span className="h-2 w-2 rounded-full bg-purple-brand" />
            </span>
            Live store preview
          </p>
          <div className="pointer-events-none">
            <ProductCard product={previewProduct} />
          </div>
          <p className="mt-3 text-center text-[10px] leading-relaxed text-fog-2">
            This is exactly how the card will look in the catalog.
          </p>
        </div>
      </aside>
    </div>
  );
}

function BadgePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active ? "border-purple-brand/60 bg-purple-brand/15" : "border-white/10 text-fog-2"
      )}
    >
      {children}
    </button>
  );
}

function SpecInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        placeholder={placeholder}
        className="field"
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 py-1.5">
      <dt className="text-fog-2">{label}</dt>
      <dd className="truncate text-right font-semibold">{value || "—"}</dd>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 text-left"
    >
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-fog-2">{hint}</span>
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-gradient-brand" : "bg-white/10"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[22px]" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}

function ListEditor({
  label,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const items = input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => !values.includes(s));
    if (items.length) onChange([...values, ...items]);
    setInput("");
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="field flex-1"
        />
        <button type="button" onClick={add} className="btn-outline !px-4">
          Add
        </button>
      </div>
      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                className="text-fog-2 transition hover:text-red-400"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
