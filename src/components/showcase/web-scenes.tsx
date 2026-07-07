"use client";

/**
 * Per-product demo scenes rendered inside the browser-chrome frame.
 * Each product slug gets its own 3-scene "video"; unknown slugs fall back
 * to the generic dashboard demo.
 */

import { motion } from "framer-motion";

export const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

const pop = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
};

/* ═══════════════ NEXA PRO — SaaS dashboard (default) ═══════════════ */

const SERIES = [32, 45, 38, 52, 48, 61, 55, 67, 62, 78, 71, 84, 92, 88, 104, 98, 112, 118, 114, 126, 132, 128, 146];
const STATS = [
  { label: "Revenue", value: "$48.2K", delta: "+12.4%" },
  { label: "Users", value: "3,842", delta: "+8.1%" },
  { label: "Orders", value: "1,207", delta: "+5.6%" },
  { label: "Conversion", value: "4.7%", delta: "+0.4%" },
];
const ROWS = [
  ["#4821", "Alex Chen", "$129.00", "paid"],
  ["#4820", "Sarah Miller", "$59.00", "paid"],
  ["#4819", "James Park", "$249.00", "pending"],
];

export function SceneDashOverview() {
  return (
    <div className="flex h-full">
      <div className="hidden w-32 shrink-0 flex-col gap-1 border-r border-white/6 p-3 sm:flex">
        <div className="mb-2 h-3 w-16 rounded bg-gradient-brand" />
        {["Overview", "Analytics", "Customers", "Orders", "Settings"].map((item, i) => (
          <motion.div
            key={item}
            {...fadeUp}
            transition={{ delay: 0.1 + i * 0.06 }}
            className={`rounded-md px-2 py-1.5 text-[10px] font-medium ${i === 0 ? "bg-gradient-brand text-white" : "text-fog-2"}`}
          >
            {item}
          </motion.div>
        ))}
      </div>
      <div className="flex-1 space-y-3 overflow-hidden p-4">
        <div className="grid grid-cols-4 gap-2">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              {...fadeUp}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="rounded-lg border border-white/6 bg-white/[0.03] p-2.5"
            >
              <p className="text-[9px] text-fog-2">{stat.label}</p>
              <p className="text-sm font-bold">{stat.value}</p>
              <p className="text-[9px] font-semibold text-emerald-400">▲ {stat.delta}</p>
            </motion.div>
          ))}
        </div>
        <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="rounded-lg border border-white/6 bg-white/[0.03] p-3">
          <p className="mb-2 text-[9px] text-fog-2">Revenue — last 30 days</p>
          <svg viewBox="0 0 400 90" className="w-full">
            <defs>
              <linearGradient id="nexa-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const max = Math.max(...SERIES);
              const pts = SERIES.map((v, i) => `${(i / (SERIES.length - 1)) * 400},${88 - (v / max) * 80}`);
              return (
                <>
                  <motion.polyline
                    points={pts.join(" ")}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.6, ease: "easeOut", delay: 0.5 }}
                  />
                  <motion.polygon
                    points={`0,90 ${pts.join(" ")} 400,90`}
                    fill="url(#nexa-fill)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                  />
                </>
              );
            })()}
          </svg>
        </motion.div>
        <div className="space-y-1">
          {ROWS.map((row, i) => (
            <motion.div
              key={row[0]}
              {...fadeUp}
              transition={{ delay: 0.7 + i * 0.12 }}
              className="flex items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-3 py-1.5 text-[10px]"
            >
              <span className="font-mono text-fog-2">{row[0]}</span>
              <span>{row[1]}</span>
              <span className="font-semibold">{row[2]}</span>
              <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${row[3] === "paid" ? "bg-emerald-400/15 text-emerald-400" : "bg-amber-400/15 text-amber-300"}`}>
                {row[3]}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SceneDashAnalytics() {
  const bars = [64, 82, 45, 91, 58, 73, 38];
  return (
    <div className="grid h-full grid-cols-2 gap-3 p-4">
      <motion.div {...fadeUp} className="rounded-lg border border-white/6 bg-white/[0.03] p-3">
        <p className="mb-3 text-[9px] text-fog-2">Weekly sessions</p>
        <div className="flex h-[75%] items-end gap-2">
          {bars.map((bar, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${bar}%` }}
              transition={{ delay: 0.15 + i * 0.08, type: "spring", damping: 14 }}
              className="flex-1 rounded-t-[4px] bg-gradient-to-t from-violet-brand to-purple-brand"
            />
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-[8px] text-fog-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <span key={i}>{day}</span>
          ))}
        </div>
      </motion.div>
      <div className="flex flex-col gap-3">
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="flex flex-1 items-center gap-4 rounded-lg border border-white/6 bg-white/[0.03] p-3"
        >
          <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0">
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
            <motion.circle
              cx="40" cy="40" r="32" fill="none"
              stroke="#06b6d4" strokeWidth="9" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 32}
              initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 32 * 0.28 }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
              transform="rotate(-90 40 40)"
            />
            <text x="40" y="45" textAnchor="middle" fill="#f0f0f5" fontSize="14" fontWeight="800">72%</text>
          </svg>
          <div>
            <p className="text-[10px] font-bold">Goal completion</p>
            <p className="text-[9px] leading-relaxed text-fog-2">Quarterly revenue target tracking ahead of schedule</p>
          </div>
        </motion.div>
        <motion.div {...fadeUp} transition={{ delay: 0.35 }} className="rounded-lg border border-white/6 bg-white/[0.03] p-3">
          <p className="mb-2 text-[9px] text-fog-2">Top regions</p>
          {[["United States", 46], ["Germany", 27], ["Japan", 17]].map(([label, val], i) => (
            <div key={label} className="mb-1.5">
              <div className="mb-0.5 flex justify-between text-[9px]">
                <span>{label}</span>
                <span className="text-fog-2">{val}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/8">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.7 }}
                  className="h-full rounded-full bg-cyan-brand"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function SceneDashKanban() {
  const cols: { title: string; cards: { text: string; tone: string }[] }[] = [
    { title: "Backlog", cards: [{ text: "Dark mode tokens", tone: "bg-violet-400/20 text-violet-300" }, { text: "Export to CSV", tone: "bg-cyan-400/20 text-cyan-300" }] },
    { title: "In progress", cards: [{ text: "Billing settings", tone: "bg-amber-400/20 text-amber-300" }, { text: "Chart tooltips", tone: "bg-pink-400/20 text-pink-300" }] },
    { title: "Done", cards: [{ text: "Auth flow", tone: "bg-emerald-400/20 text-emerald-300" }, { text: "Stat cards", tone: "bg-emerald-400/20 text-emerald-300" }] },
  ];
  return (
    <div className="grid h-full grid-cols-3 gap-3 p-4">
      {cols.map((col, ci) => (
        <motion.div key={col.title} {...fadeUp} transition={{ delay: ci * 0.12 }} className="rounded-lg border border-white/6 bg-white/[0.02] p-2.5">
          <p className="mb-2 flex items-center justify-between text-[10px] font-bold">
            {col.title}
            <span className="rounded-full bg-white/8 px-1.5 text-[8px] text-fog-2">{col.cards.length}</span>
          </p>
          <div className="space-y-2">
            {col.cards.map((card, i) => (
              <motion.div
                key={card.text}
                initial={{ opacity: 0, x: -14, rotate: -2 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ delay: 0.3 + ci * 0.15 + i * 0.12, type: "spring", damping: 16 }}
                className="cursor-grab rounded-md border border-white/8 bg-ink-3 p-2 shadow-lg transition hover:border-purple-brand/40"
              >
                <span className={`inline-block rounded px-1.5 py-0.5 text-[8px] font-bold ${card.tone}`}>{card.text}</span>
                <div className="mt-1.5 h-1 w-3/4 rounded bg-white/8" />
                <div className="mt-1 h-1 w-1/2 rounded bg-white/8" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════ AURORA — SaaS landing page ═══════════════ */

function SceneAuroraHero() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center">
      <div className="orb -right-16 -top-20 h-56 w-56 bg-violet-brand/25" />
      <div className="orb -bottom-24 -left-10 h-48 w-48 bg-cyan-brand/15" />
      <motion.span {...pop} className="mb-3 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-[9px] font-semibold text-violet-300">
        ✨ Now with AI workflows
      </motion.span>
      <motion.h3 {...fadeUp} transition={{ delay: 0.15 }} className="font-display text-2xl font-extrabold leading-tight">
        Ship your product<br />
        <span className="text-gradient">10× faster</span>
      </motion.h3>
      <motion.p {...fadeUp} transition={{ delay: 0.3 }} className="mt-2 max-w-[260px] text-[10px] leading-relaxed text-fog-2">
        The all-in-one platform your team already knows how to use. Free for 14 days.
      </motion.p>
      <motion.div {...fadeUp} transition={{ delay: 0.45 }} className="mt-4 flex gap-2">
        <span className="rounded-full bg-gradient-brand px-4 py-1.5 text-[10px] font-bold text-white">Start free →</span>
        <span className="rounded-full border border-white/15 px-4 py-1.5 text-[10px] font-semibold text-fog-2">Book a demo</span>
      </motion.div>
      <motion.div {...fadeUp} transition={{ delay: 0.65 }} className="mt-5 flex items-center gap-3 text-[8px] text-fog-2">
        {["ACME", "Globex", "Initech", "Umbra"].map((brand) => (
          <span key={brand} className="font-display font-bold tracking-widest opacity-60">{brand}</span>
        ))}
      </motion.div>
    </div>
  );
}

function SceneAuroraFeatures() {
  const feats = [
    ["⚡", "Instant deploys"],
    ["🔒", "SOC 2 ready"],
    ["📊", "Live analytics"],
    ["🤝", "Team spaces"],
    ["🔌", "40+ integrations"],
    ["🌍", "Edge network"],
  ];
  return (
    <div className="flex h-full flex-col justify-center p-5">
      <motion.p {...fadeUp} className="mb-1 text-center text-[9px] font-bold uppercase tracking-widest text-violet-300">Why Aurora</motion.p>
      <motion.h4 {...fadeUp} transition={{ delay: 0.1 }} className="mb-4 text-center font-display text-sm font-extrabold">
        Everything you need to launch
      </motion.h4>
      <div className="grid grid-cols-3 gap-2.5">
        {feats.map(([icon, label], i) => (
          <motion.div
            key={label}
            {...pop}
            transition={{ delay: 0.2 + i * 0.09, type: "spring", damping: 15 }}
            className="rounded-lg border border-white/6 bg-white/[0.03] p-3 text-center"
          >
            <span className="text-base">{icon}</span>
            <p className="mt-1 text-[9px] font-bold">{label}</p>
            <div className="mx-auto mt-1.5 h-1 w-3/4 rounded bg-white/8" />
            <div className="mx-auto mt-1 h-1 w-1/2 rounded bg-white/8" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SceneAuroraPricing() {
  const tiers = [
    { name: "Starter", price: "$0", hot: false },
    { name: "Pro", price: "$29", hot: true },
    { name: "Scale", price: "$99", hot: false },
  ];
  return (
    <div className="flex h-full items-center justify-center gap-3 p-5">
      {tiers.map((tier, i) => (
        <motion.div
          key={tier.name}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: tier.hot ? -8 : 0 }}
          transition={{ delay: 0.15 + i * 0.12, type: "spring", damping: 16 }}
          className={`w-28 rounded-xl border p-3 text-center ${
            tier.hot
              ? "border-violet-400/50 bg-violet-400/10 shadow-[0_10px_40px_rgba(124,58,237,0.35)]"
              : "border-white/8 bg-white/[0.03]"
          }`}
        >
          {tier.hot && (
            <span className="mb-1 inline-block rounded-full bg-gradient-brand px-2 py-0.5 text-[7px] font-bold text-white">
              MOST POPULAR
            </span>
          )}
          <p className="text-[10px] font-bold">{tier.name}</p>
          <p className="font-display text-xl font-extrabold">{tier.price}<span className="text-[8px] font-normal text-fog-2">/mo</span></p>
          <div className="mt-2 space-y-1">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex items-center gap-1 text-[8px] text-fog-2">
                <span className="text-emerald-400">✓</span>
                <div className="h-1 flex-1 rounded bg-white/8" />
              </div>
            ))}
          </div>
          <span className={`mt-2 block rounded-full py-1 text-[8px] font-bold ${tier.hot ? "bg-gradient-brand text-white" : "border border-white/15 text-fog-2"}`}>
            Choose {tier.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════ ATLAS — agency portfolio ═══════════════ */

function SceneAtlasHero() {
  return (
    <div className="relative flex h-full flex-col justify-center overflow-hidden px-7">
      <motion.p {...fadeUp} className="text-[9px] font-bold uppercase tracking-[0.3em] text-pink-300">
        Atlas® Studio — est. 2019
      </motion.p>
      {["WE BUILD", "BOLD DIGITAL", "EXPERIENCES"].map((line, i) => (
        <motion.h3
          key={line}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={`font-display text-[26px] font-extrabold leading-[1.05] tracking-tight ${i === 1 ? "text-gradient-warm" : ""}`}
        >
          {line}
        </motion.h3>
      ))}
      <motion.div {...fadeUp} transition={{ delay: 0.7 }} className="mt-3 flex items-center gap-3 text-[9px] text-fog-2">
        <span className="rounded-full border border-white/15 px-3 py-1 font-semibold">↓ Selected work</span>
        <span>Webby ×3 · Awwwards ×5</span>
      </motion.div>
      <div className="absolute -right-6 bottom-0 top-0 my-auto h-40 w-28 overflow-hidden rounded-l-2xl">
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, type: "spring", damping: 18 }}
          className="h-full w-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 opacity-80"
        />
      </div>
    </div>
  );
}

function SceneAtlasWork() {
  const projects = [
    { name: "Meridian Bank", tag: "Brand + Web", g: "from-cyan-500 to-blue-600" },
    { name: "Kilo Fitness", tag: "Product design", g: "from-pink-500 to-rose-600" },
    { name: "Nocturne AI", tag: "Web experience", g: "from-violet-500 to-indigo-600" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 p-5">
      <motion.p {...fadeUp} className="text-[9px] font-bold uppercase tracking-widest text-fog-2">
        Selected work — 2024/26
      </motion.p>
      {projects.map((project, i) => (
        <motion.div
          key={project.name}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="group flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] p-2.5"
        >
          <div className={`h-12 w-20 shrink-0 rounded-lg bg-gradient-to-br ${project.g} opacity-85`} />
          <div className="flex-1">
            <p className="font-display text-xs font-extrabold">{project.name}</p>
            <p className="text-[9px] text-fog-2">{project.tag}</p>
          </div>
          <span className="text-sm text-fog-2 transition group-hover:translate-x-1">→</span>
        </motion.div>
      ))}
    </div>
  );
}

function SceneAtlasStudio() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-5">
      <motion.p {...fadeUp} className="font-display text-sm font-extrabold">
        A senior team of 14, zero account managers
      </motion.p>
      <div className="flex">
        {[330, 20, 160, 210, 280, 60, 110].map((hue, i) => (
          <motion.span
            key={i}
            {...pop}
            transition={{ delay: 0.15 + i * 0.08, type: "spring", damping: 12 }}
            className="-ml-1.5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0b0b11] text-[10px] font-bold text-white first:ml-0"
            style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 70% 40%))` }}
          >
            {String.fromCharCode(65 + i)}
          </motion.span>
        ))}
      </div>
      <div className="flex gap-6">
        {[["48", "projects shipped"], ["9", "industry awards"], ["100%", "senior team"]].map(([big, small], i) => (
          <motion.div key={small} {...fadeUp} transition={{ delay: 0.5 + i * 0.1 }} className="text-center">
            <p className="font-display text-lg font-extrabold text-gradient-warm">{big}</p>
            <p className="text-[8px] text-fog-2">{small}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ VERTEX — e-commerce storefront ═══════════════ */

const SHOP_ITEMS = [
  { name: "Aero Sneaker", price: "$120", g: "from-cyan-500 to-blue-600" },
  { name: "Loop Hoodie", price: "$85", g: "from-violet-500 to-purple-600" },
  { name: "Halo Cap", price: "$32", g: "from-pink-500 to-rose-600" },
  { name: "Flux Jacket", price: "$210", g: "from-amber-500 to-orange-600" },
  { name: "Core Tee", price: "$38", g: "from-emerald-500 to-teal-600" },
  { name: "Nova Bag", price: "$96", g: "from-indigo-500 to-violet-600" },
];

function SceneVertexShop() {
  return (
    <div className="flex h-full flex-col p-4">
      <motion.div {...fadeUp} className="mb-3 flex items-center justify-between">
        <span className="font-display text-xs font-extrabold">VERTEX/SHOP</span>
        <div className="flex items-center gap-2 text-[9px] text-fog-2">
          <span className="rounded-full border border-white/10 px-2 py-0.5">New in</span>
          <span className="rounded-full border border-white/10 px-2 py-0.5">Sale</span>
          <span className="relative">🛒<span className="absolute -right-1.5 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-gradient-brand text-[7px] font-bold text-white">2</span></span>
        </div>
      </motion.div>
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        {SHOP_ITEMS.map((item, i) => (
          <motion.div key={item.name} {...pop} transition={{ delay: 0.15 + i * 0.07, type: "spring", damping: 15 }} className="flex flex-col overflow-hidden rounded-lg border border-white/6 bg-white/[0.02]">
            <div className={`flex-1 bg-gradient-to-br ${item.g} opacity-80`} />
            <div className="flex items-center justify-between p-1.5">
              <span className="text-[8px] font-semibold">{item.name}</span>
              <span className="text-[8px] font-bold text-cyan-300">{item.price}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SceneVertexCart() {
  return (
    <div className="relative h-full overflow-hidden p-4">
      <div className="grid h-full grid-cols-3 gap-2.5 opacity-30 blur-[1px]">
        {SHOP_ITEMS.slice(0, 6).map((item) => (
          <div key={item.name} className="flex flex-col overflow-hidden rounded-lg border border-white/6">
            <div className={`flex-1 bg-gradient-to-br ${item.g}`} />
          </div>
        ))}
      </div>
      <motion.div
        initial={{ x: "110%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 22, delay: 0.2 }}
        className="absolute bottom-3 right-3 top-3 flex w-44 flex-col rounded-xl border border-white/10 bg-ink-2/95 p-3 shadow-2xl backdrop-blur"
      >
        <p className="mb-2 text-[10px] font-bold">Your cart · 2 items</p>
        {[SHOP_ITEMS[0], SHOP_ITEMS[1]].map((item, i) => (
          <motion.div key={item.name} {...fadeUp} transition={{ delay: 0.45 + i * 0.12 }} className="mb-1.5 flex items-center gap-2 rounded-lg bg-white/[0.04] p-1.5">
            <div className={`h-7 w-7 rounded-md bg-gradient-to-br ${item.g}`} />
            <span className="flex-1 text-[8px] font-semibold">{item.name}</span>
            <span className="text-[8px] font-bold">{item.price}</span>
          </motion.div>
        ))}
        <div className="mt-auto border-t border-white/8 pt-2">
          <div className="mb-1.5 flex justify-between text-[9px]">
            <span className="text-fog-2">Total</span>
            <span className="font-display font-extrabold text-gradient">$205</span>
          </div>
          <motion.span {...pop} transition={{ delay: 0.8 }} className="block rounded-full bg-gradient-brand py-1.5 text-center text-[9px] font-bold text-white">
            Checkout →
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}

function SceneVertexCheckout() {
  return (
    <div className="flex h-full items-center justify-center p-5">
      <div className="w-64">
        <motion.div {...fadeUp} className="mb-3 flex items-center justify-center gap-1.5 text-[8px] font-semibold">
          {["Cart", "Details", "Payment"].map((step, i) => (
            <span key={step} className="flex items-center gap-1.5">
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[7px] font-bold ${i <= 2 ? "bg-gradient-brand text-white" : "bg-white/10 text-fog-2"}`}>
                {i < 2 ? "✓" : "3"}
              </span>
              <span className={i === 2 ? "text-fog" : "text-fog-2"}>{step}</span>
              {i < 2 && <span className="h-px w-4 bg-white/15" />}
            </span>
          ))}
        </motion.div>
        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
          <div className="mb-2 rounded-lg bg-gradient-brand p-2.5">
            <p className="text-[7px] text-white/70">CARD NUMBER</p>
            <p className="font-mono text-[10px] tracking-widest text-white">4242 4242 4242 4242</p>
          </div>
          <div className="mb-2 grid grid-cols-2 gap-1.5">
            <div className="rounded-md border border-white/10 p-1.5"><p className="text-[7px] text-fog-2">MM/YY</p><p className="font-mono text-[9px]">12/28</p></div>
            <div className="rounded-md border border-white/10 p-1.5"><p className="text-[7px] text-fog-2">CVC</p><p className="font-mono text-[9px]">•••</p></div>
          </div>
          <motion.span
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="block rounded-full bg-gradient-brand py-1.5 text-center text-[9px] font-bold text-white"
          >
            Pay $205.00
          </motion.span>
          <p className="mt-1.5 text-center text-[7px] text-fog-2">🔒 256-bit encrypted · Stripe-ready</p>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════ QUANTUM / PRISM — UI kits ═══════════════ */

function SceneKitComponents() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      <motion.p {...fadeUp} className="text-[9px] font-bold uppercase tracking-widest text-pink-300">
        500+ components · live sample
      </motion.p>
      <div className="grid grid-cols-2 gap-3">
        <motion.div {...pop} transition={{ delay: 0.15 }} className="flex flex-wrap items-center gap-2 rounded-xl border border-white/6 bg-white/[0.03] p-3">
          <span className="rounded-full bg-gradient-brand px-3 py-1 text-[9px] font-bold text-white">Primary</span>
          <span className="rounded-full border border-white/15 px-3 py-1 text-[9px] font-semibold">Secondary</span>
          <span className="rounded-full border border-red-400/40 bg-red-400/10 px-3 py-1 text-[9px] font-semibold text-red-300">Danger</span>
        </motion.div>
        <motion.div {...pop} transition={{ delay: 0.25 }} className="flex items-center justify-around rounded-xl border border-white/6 bg-white/[0.03] p-3">
          <motion.span
            className="relative h-5 w-9 rounded-full bg-gradient-brand"
            animate={{ opacity: [1, 1, 0.4, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <motion.span
              className="absolute top-0.5 h-4 w-4 rounded-full bg-white"
              animate={{ left: [18, 18, 2, 2, 18] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          </motion.span>
          <span className="flex h-5 w-5 items-center justify-center rounded-md border border-purple-brand bg-purple-brand/30 text-[9px] text-white">✓</span>
          <span className="h-5 w-5 rounded-full border-2 border-purple-brand bg-purple-brand/20" />
        </motion.div>
        <motion.div {...pop} transition={{ delay: 0.35 }} className="rounded-xl border border-white/6 bg-white/[0.03] p-3">
          <div className="rounded-lg border border-purple-brand/50 bg-white/[0.04] px-2.5 py-1.5 text-[9px] text-fog-2">
            you@studio.com<motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>|</motion.span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/10">
            <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} transition={{ delay: 0.6, duration: 1 }} className="h-full rounded-full bg-gradient-brand" />
          </div>
        </motion.div>
        <motion.div {...pop} transition={{ delay: 0.45 }} className="flex items-center gap-2 rounded-xl border border-white/6 bg-white/[0.03] p-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-[10px] font-bold text-white">M</span>
          <div>
            <div className="h-1.5 w-16 rounded bg-white/15" />
            <div className="mt-1 h-1 w-10 rounded bg-white/8" />
          </div>
          <span className="ml-auto rounded-full bg-emerald-400/15 px-2 py-0.5 text-[8px] font-bold text-emerald-400">PRO</span>
        </motion.div>
      </div>
    </div>
  );
}

function SceneKitTokens() {
  const ramp = ["#f5f3ff", "#ddd6fe", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#4c1d95"];
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-5">
      <div>
        <motion.p {...fadeUp} className="mb-2 text-[9px] font-bold uppercase tracking-widest text-fog-2">
          Color tokens — violet ramp
        </motion.p>
        <div className="flex gap-1.5">
          {ramp.map((color, i) => (
            <motion.div key={color} {...pop} transition={{ delay: 0.1 + i * 0.07, type: "spring" }} className="flex-1">
              <div className="h-10 rounded-lg" style={{ background: color }} />
              <p className="mt-1 text-center font-mono text-[7px] text-fog-2">{100 * (i + 1)}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="rounded-xl border border-white/6 bg-white/[0.03] p-3">
          <p className="mb-2 text-[8px] font-bold text-fog-2">RADIUS SCALE</p>
          <div className="flex items-end gap-2">
            {[2, 6, 10, 16, 999].map((radius, i) => (
              <div key={i} className="h-8 flex-1 border border-purple-brand/50 bg-purple-brand/15" style={{ borderRadius: radius }} />
            ))}
          </div>
        </motion.div>
        <motion.div {...fadeUp} transition={{ delay: 0.6 }} className="rounded-xl border border-white/6 bg-white/[0.03] p-3">
          <p className="mb-2 text-[8px] font-bold text-fog-2">SPACING · 4PT GRID</p>
          <div className="flex items-end gap-1">
            {[4, 8, 12, 16, 24, 32].map((space) => (
              <div key={space} className="rounded-sm bg-cyan-brand/60" style={{ width: 10, height: space }} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SceneKitType() {
  const scale = [
    ["Display", "text-2xl font-extrabold"],
    ["Headline", "text-lg font-bold"],
    ["Title", "text-sm font-bold"],
    ["Body", "text-xs"],
    ["Caption", "text-[9px] text-fog-2"],
  ];
  return (
    <div className="flex h-full flex-col justify-center p-6">
      <motion.p {...fadeUp} className="mb-3 text-[9px] font-bold uppercase tracking-widest text-fog-2">
        Type scale — Inter / Space Grotesk
      </motion.p>
      {scale.map(([name, cls], i) => (
        <motion.div
          key={name}
          {...fadeUp}
          transition={{ delay: 0.15 + i * 0.1 }}
          className="flex items-baseline justify-between border-b border-white/5 py-1.5"
        >
          <span className={`font-display ${cls}`}>The quick brown fox</span>
          <span className="font-mono text-[8px] text-fog-2">{name}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════ Registry ═══════════════ */

export type WebShowcaseDef = {
  labels: string[];
  scenes: (() => React.ReactElement)[];
};

const WEB_REGISTRY: Record<string, WebShowcaseDef> = {
  "nexa-pro-dashboard": {
    labels: ["Overview", "Analytics", "Kanban"],
    scenes: [SceneDashOverview, SceneDashAnalytics, SceneDashKanban],
  },
  "aurora-landing-page": {
    labels: ["Hero", "Features", "Pricing"],
    scenes: [SceneAuroraHero, SceneAuroraFeatures, SceneAuroraPricing],
  },
  "atlas-agency-site": {
    labels: ["Hero", "Work", "Studio"],
    scenes: [SceneAtlasHero, SceneAtlasWork, SceneAtlasStudio],
  },
  "vertex-commerce-kit": {
    labels: ["Shop", "Cart", "Checkout"],
    scenes: [SceneVertexShop, SceneVertexCart, SceneVertexCheckout],
  },
  "quantum-ui-kit": {
    labels: ["Components", "Tokens", "Type"],
    scenes: [SceneKitComponents, SceneKitTokens, SceneKitType],
  },
  "prism-mobile-kit": {
    labels: ["Components", "Tokens", "Type"],
    scenes: [SceneKitComponents, SceneKitTokens, SceneKitType],
  },
};

const WEB_DEFAULT: WebShowcaseDef = WEB_REGISTRY["nexa-pro-dashboard"];

/** Per-product scene set for browser-frame products (web / ui-kit). */
export function getWebShowcase(slug: string): WebShowcaseDef {
  return WEB_REGISTRY[slug] ?? WEB_DEFAULT;
}
