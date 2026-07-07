"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/store-provider";
import { Spinner } from "@/components/ui";
import { CATEGORIES, PRODUCT_BADGES, PLATFORMS } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const PRESET_IMAGES = [
  "/images/product-web-design.png",
  "/images/product-app-design.png",
  "/images/product-ui-kit.png",
  "/images/product-blender-character.png",
  "/images/hero-banner.png",
];

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
  formats: [],
  features: [],
  tags: [],
  platforms: ["nextjs", "react"],
  polyCount: null,
  rigType: null,
  blenderVersion: null,
  renderer: null,
  fileSize: "120 MB",
  featured: false,
  published: true,
};

export function ProductForm({ initial }: { initial?: ProductFormValues }) {
  const router = useRouter();
  const { toast } = useStore();
  const [values, setValues] = useState<ProductFormValues>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const is3D = values.category === "blender-3d" || values.category === "3d-model";
  const editing = Boolean(initial?.id);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    toast("✅", editing ? "Product updated" : "Product created");
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="grid max-w-5xl gap-8 xl:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-2 block text-sm font-semibold">Product name</label>
          <input
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            required
            minLength={3}
            placeholder="e.g. Nebula Dashboard Pro"
            className="field"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => set("category", cat.slug)}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-xs font-semibold transition-all",
                  values.category === cat.slug
                    ? "border-purple-brand/60 bg-purple-brand/15 text-fog"
                    : "border-white/10 text-fog-2 hover:border-white/25"
                )}
              >
                {cat.icon} {cat.short}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold">Price (USD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.price / 100}
              onChange={(e) => set("price", Math.round(parseFloat(e.target.value || "0") * 100))}
              required
              className="field"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Old price <span className="font-normal text-fog-2">opt.</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.oldPrice != null ? values.oldPrice / 100 : ""}
              onChange={(e) =>
                set("oldPrice", e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null)
              }
              className="field"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Package size</label>
            <input
              value={values.fileSize}
              onChange={(e) => set("fileSize", e.target.value)}
              placeholder="240 MB"
              className="field"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Short description <span className="font-normal text-fog-2">(card text, 10–300 chars)</span>
          </label>
          <textarea
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            required
            minLength={10}
            maxLength={300}
            rows={2}
            className="field resize-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Long description <span className="font-normal text-fog-2">(product page)</span>
          </label>
          <textarea
            value={values.longDescription}
            onChange={(e) => set("longDescription", e.target.value)}
            rows={5}
            className="field resize-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Downloadable code packages{" "}
            <span className="font-normal text-fog-2">(what buyers can download)</span>
          </label>
          <div className="flex flex-wrap gap-2">
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
                  title={platform.hint}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all",
                    selected
                      ? "border-purple-brand/60 bg-purple-brand/15 text-fog"
                      : "border-white/10 text-fog-2 hover:border-white/25"
                  )}
                >
                  <span>{platform.icon}</span> {platform.label}
                  {selected && <span className="text-purple-brand">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <ListEditor
          label="File formats"
          placeholder="blend, fbx, figma…"
          values={values.formats}
          onChange={(v) => set("formats", v)}
        />
        <ListEditor
          label="Feature bullets"
          placeholder="e.g. 50+ components"
          values={values.features}
          onChange={(v) => set("features", v)}
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
            <div>
              <label className="mb-2 block text-sm font-semibold">Poly count</label>
              <input
                value={values.polyCount ?? ""}
                onChange={(e) => set("polyCount", e.target.value || null)}
                placeholder="52K"
                className="field"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Rig type</label>
              <input
                value={values.rigType ?? ""}
                onChange={(e) => set("rigType", e.target.value || null)}
                placeholder="Full Body + Facial"
                className="field"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Blender version</label>
              <input
                value={values.blenderVersion ?? ""}
                onChange={(e) => set("blenderVersion", e.target.value || null)}
                placeholder="3.6+"
                className="field"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Renderer</label>
              <input
                value={values.renderer ?? ""}
                onChange={(e) => set("renderer", e.target.value || null)}
                placeholder="Cycles / EEVEE"
                className="field"
              />
            </div>
          </div>
        )}
      </div>

      {/* Side column */}
      <div className="flex h-fit flex-col gap-5">
        <div className="glass rounded-2xl p-5">
          <label className="mb-3 block text-sm font-semibold">Cover image</label>
          <div className="gradient-ring mb-3 overflow-hidden rounded-xl">
            <Image
              src={values.image}
              alt="Cover preview"
              width={360}
              height={270}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_IMAGES.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => set("image", img)}
                className={cn(
                  "overflow-hidden rounded-lg border-2 transition",
                  values.image === img ? "border-purple-brand" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image src={img} alt="" width={80} height={60} className="aspect-[4/3] w-full object-cover" />
              </button>
            ))}
          </div>
          <input
            value={values.image}
            onChange={(e) => set("image", e.target.value)}
            placeholder="or paste an image URL / path"
            className="field mt-3 !py-2 text-xs"
          />
        </div>

        <div className="glass rounded-2xl p-5">
          <label className="mb-3 block text-sm font-semibold">Badge</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => set("badge", null)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                values.badge === null
                  ? "border-purple-brand/60 bg-purple-brand/15"
                  : "border-white/10 text-fog-2"
              )}
            >
              None
            </button>
            {PRODUCT_BADGES.map((badge) => (
              <button
                key={badge}
                type="button"
                onClick={() => set("badge", badge)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  values.badge === badge
                    ? "border-purple-brand/60 bg-purple-brand/15"
                    : "border-white/10 text-fog-2"
                )}
              >
                {badge}
              </button>
            ))}
          </div>
        </div>

        <div className="glass flex flex-col gap-3 rounded-2xl p-5">
          <label className="flex cursor-pointer items-center justify-between text-sm font-semibold">
            ★ Featured on homepage
            <input
              type="checkbox"
              checked={values.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 accent-purple-500"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between text-sm font-semibold">
            🌐 Published (visible in store)
            <input
              type="checkbox"
              checked={values.published}
              onChange={(e) => set("published", e.target.checked)}
              className="h-4 w-4 accent-purple-500"
            />
          </label>
        </div>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        <button type="submit" disabled={saving} className="btn-primary !py-3">
          {saving && <Spinner />}
          {editing ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
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
