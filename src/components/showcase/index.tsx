"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { DashboardShowcase } from "./dashboard-showcase";
import { AppShowcase } from "./app-showcase";
import { cn } from "@/lib/utils";

// three.js only loads on pages that actually show a 3D product
const BlenderShowcase = dynamic(
  () => import("./blender-showcase").then((m) => m.BlenderShowcase),
  {
    ssr: false,
    loading: () => (
      <div className="gradient-ring flex aspect-[4/3] items-center justify-center rounded-3xl bg-ink-2 sm:aspect-[16/10]">
        <span className="animate-pulse text-sm text-fog-2">Loading 3D viewer…</span>
      </div>
    ),
  }
);

export type ShowcaseProduct = {
  slug: string;
  name: string;
  category: string;
  image: string;
  polyCount: string | null;
  rigType: string | null;
};

export function ProductShowcase({ product }: { product: ShowcaseProduct }) {
  const [tab, setTab] = useState<"preview" | "cover">("preview");
  const is3D = product.category === "blender-3d";

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>
          {is3D ? "🧊 Interactive 3D" : "▶ Interactive preview"}
        </TabButton>
        <TabButton active={tab === "cover"} onClick={() => setTab("cover")}>
          🖼 Cover art
        </TabButton>
      </div>

      {tab === "cover" ? (
        <div className="gradient-ring group relative overflow-hidden rounded-3xl">
          <Image
            src={product.image}
            alt={product.name}
            width={860}
            height={645}
            priority
            className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        </div>
      ) : is3D ? (
        <BlenderShowcase
          slug={product.slug}
          polyCount={product.polyCount}
          rigType={product.rigType}
        />
      ) : product.category === "app" ? (
        <AppShowcase name={product.name} />
      ) : (
        <DashboardShowcase name={product.name} />
      )}
    </div>
  );
}

function TabButton({
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
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
        active
          ? "bg-gradient-brand text-white shadow-[0_4px_16px_rgba(124,58,237,0.4)]"
          : "glass text-fog-2 hover:text-fog"
      )}
    >
      {children}
    </button>
  );
}
