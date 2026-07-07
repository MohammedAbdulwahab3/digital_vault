"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScenePlayer, PlayerBar, LiveBadge } from "./player";

const SERIES = [32, 45, 38, 52, 48, 61, 55, 67, 62, 78, 71, 84, 92, 88, 104, 98, 112, 118, 114, 126, 132, 128, 146];
const STATS = [
  { label: "Revenue", value: "$48.2K", delta: "+12.4%" },
  { label: "Users", value: "3,842", delta: "+8.1%" },
  { label: "Orders", value: "1,207", delta: "+5.6%" },
  { label: "Conversion", value: "4.7%", delta: "+0.4%" },
];
const BARS = [64, 82, 45, 91, 58, 73, 38];
const KANBAN: { title: string; cards: { text: string; tone: string }[] }[] = [
  { title: "Backlog", cards: [{ text: "Dark mode tokens", tone: "bg-violet-400/20 text-violet-300" }, { text: "Export to CSV", tone: "bg-cyan-400/20 text-cyan-300" }] },
  { title: "In progress", cards: [{ text: "Billing settings", tone: "bg-amber-400/20 text-amber-300" }, { text: "Chart tooltips", tone: "bg-pink-400/20 text-pink-300" }] },
  { title: "Done", cards: [{ text: "Auth flow", tone: "bg-emerald-400/20 text-emerald-300" }, { text: "Stat cards", tone: "bg-emerald-400/20 text-emerald-300" }] },
];
const ROWS = [
  ["#4821", "Alex Chen", "$129.00", "paid"],
  ["#4820", "Sarah Miller", "$59.00", "paid"],
  ["#4819", "James Park", "$249.00", "pending"],
];

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

function ChromeFrame({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-white/8 bg-ink-3/80 px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </span>
        <span className="mx-auto flex items-center gap-1.5 rounded-md bg-white/5 px-4 py-1 text-[10px] text-fog-2">
          🔒 {name.toLowerCase().replace(/\s+/g, "")}.app
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden bg-[#0b0b11]">{children}</div>
    </div>
  );
}

function SceneOverview() {
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
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="rounded-lg border border-white/6 bg-white/[0.03] p-3"
        >
          <p className="mb-2 text-[9px] text-fog-2">Revenue — last 30 days</p>
          <svg viewBox="0 0 400 90" className="w-full">
            <defs>
              <linearGradient id="dash-fill" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#dash-fill)"
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

function SceneAnalytics() {
  return (
    <div className="grid h-full grid-cols-2 gap-3 p-4">
      <motion.div {...fadeUp} className="rounded-lg border border-white/6 bg-white/[0.03] p-3">
        <p className="mb-3 text-[9px] text-fog-2">Weekly sessions</p>
        <div className="flex h-[75%] items-end gap-2">
          {BARS.map((bar, i) => (
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
            <text x="40" y="45" textAnchor="middle" fill="#f0f0f5" fontSize="14" fontWeight="800">
              72%
            </text>
          </svg>
          <div>
            <p className="text-[10px] font-bold">Goal completion</p>
            <p className="text-[9px] leading-relaxed text-fog-2">Quarterly revenue target tracking ahead of schedule</p>
          </div>
        </motion.div>
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.35 }}
          className="rounded-lg border border-white/6 bg-white/[0.03] p-3"
        >
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

function SceneKanban() {
  return (
    <div className="grid h-full grid-cols-3 gap-3 p-4">
      {KANBAN.map((col, ci) => (
        <motion.div
          key={col.title}
          {...fadeUp}
          transition={{ delay: ci * 0.12 }}
          className="rounded-lg border border-white/6 bg-white/[0.02] p-2.5"
        >
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
                className="cursor-grab rounded-md border border-white/8 bg-ink-3 p-2 shadow-lg transition hover:border-purple-brand/40 active:cursor-grabbing"
              >
                <span className={`inline-block rounded px-1.5 py-0.5 text-[8px] font-bold ${card.tone}`}>
                  {card.text}
                </span>
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

const SCENES = [SceneOverview, SceneAnalytics, SceneKanban];
const LABELS = ["Overview", "Analytics", "Kanban"];

export function DashboardShowcase({ name }: { name: string }) {
  const player = useScenePlayer(SCENES.length, 6500);
  const frameRef = useRef<HTMLDivElement>(null);
  const Scene = SCENES[player.scene];

  return (
    <div
      ref={frameRef}
      className="gradient-ring flex flex-col overflow-hidden rounded-3xl bg-ink-2"
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/10]">
        <LiveBadge text="Live interactive preview" />
        <ChromeFrame name={name}>
          <AnimatePresence mode="wait">
            <motion.div
              key={player.scene}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.35 }}
              className="h-full"
            >
              <Scene />
            </motion.div>
          </AnimatePresence>
        </ChromeFrame>
      </div>
      <PlayerBar
        labels={LABELS}
        {...player}
        onFullscreen={() => frameRef.current?.requestFullscreen?.()}
      />
    </div>
  );
}
