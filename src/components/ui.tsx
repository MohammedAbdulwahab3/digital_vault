"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Scroll-into-view reveal with optional stagger delay. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Mouse-tracking 3D tilt wrapper with a glare highlight. */
export function TiltCard({
  children,
  className,
  maxTilt = 7,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const inner = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = inner.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.transform = `rotateY(${(px - 0.5) * 2 * maxTilt}deg) rotateX(${(0.5 - py) * 2 * maxTilt}deg)`;
    el.style.setProperty("--glare-x", `${px * 100}%`);
    el.style.setProperty("--glare-y", `${py * 100}%`);
  };

  const onLeave = () => {
    if (inner.current) inner.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div className={cn("tilt-stage", className)} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={inner} className="tilt-card relative h-full rounded-[16px]">
        {children}
        <div className="tilt-glare" />
      </div>
    </div>
  );
}

export function RatingStars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-amber-400", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" className={i <= Math.round(rating) ? "" : "opacity-25"}>
          <path
            fill="currentColor"
            d="M12 2l2.9 6.26 6.85.7-5.13 4.61 1.44 6.73L12 16.9 5.94 20.3l1.44-6.73L2.25 8.96l6.85-.7L12 2z"
          />
        </svg>
      ))}
    </span>
  );
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  REVIEWING: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  QUOTED: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  ACCEPTED: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  IN_PROGRESS: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  DELIVERED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  DECLINED: "bg-red-500/15 text-red-400 border-red-500/30",
  PAID: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  FAILED: "bg-red-500/15 text-red-400 border-red-500/30",
  REFUNDED: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        STATUS_STYLES[status] ?? "bg-white/5 text-fog-2 border-white/10"
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

const FORMAT_COLORS: Record<string, string> = {
  blend: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  fbx: "text-cyan-300 border-cyan-400/30 bg-cyan-400/10",
  obj: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  gltf: "text-purple-300 border-purple-400/30 bg-purple-400/10",
  figma: "text-pink-300 border-pink-400/30 bg-pink-400/10",
  react: "text-cyan-300 border-cyan-400/30 bg-cyan-400/10",
  nextjs: "text-fog border-white/25 bg-white/10",
  html: "text-orange-300 border-orange-400/30 bg-orange-400/10",
  tailwind: "text-sky-300 border-sky-400/30 bg-sky-400/10",
  sketch: "text-amber-300 border-amber-400/30 bg-amber-400/10",
  lottie: "text-teal-300 border-teal-400/30 bg-teal-400/10",
  rive: "text-rose-300 border-rose-400/30 bg-rose-400/10",
  storybook: "text-fuchsia-300 border-fuchsia-400/30 bg-fuchsia-400/10",
  svg: "text-yellow-300 border-yellow-400/30 bg-yellow-400/10",
};

export function FormatTag({ format, size = "sm" }: { format: string; size?: "xs" | "sm" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border font-mono font-semibold",
        size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
        FORMAT_COLORS[format] ?? "text-fog-2 border-white/15 bg-white/5"
      )}
    >
      .{format}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full border border-purple-brand/30 bg-purple-brand/10 px-4 py-1 text-xs font-semibold tracking-wide text-purple-brand">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-fog-2">{subtitle}</p>}
    </Reveal>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white",
        className
      )}
    />
  );
}
