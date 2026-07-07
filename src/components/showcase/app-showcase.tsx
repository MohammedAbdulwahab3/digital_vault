"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScenePlayer, PlayerBar, LiveBadge } from "./player";

const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } };

function ScreenOnboarding({ name }: { name: string }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-cyan-600/30 via-[#0b0b11] to-[#0b0b11] px-6 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12, delay: 0.15 }}
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-violet-500 text-2xl shadow-[0_10px_40px_rgba(6,182,212,0.5)]"
      >
        ✦
      </motion.div>
      <motion.h3 {...fadeUp} transition={{ delay: 0.3 }} className="text-lg font-bold leading-tight">
        Welcome to<br />{name}
      </motion.h3>
      <motion.p {...fadeUp} transition={{ delay: 0.42 }} className="mt-2 text-[10px] leading-relaxed text-fog-2">
        Everything you need, beautifully organized in one place.
      </motion.p>
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.55 }}
        className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 py-2.5 text-center text-[11px] font-bold text-white"
      >
        Get started →
      </motion.div>
      <motion.div {...fadeUp} transition={{ delay: 0.65 }} className="mt-2.5 text-[9px] text-fog-2">
        Already a member? <span className="text-cyan-300">Sign in</span>
      </motion.div>
    </div>
  );
}

function ScreenHome() {
  return (
    <div className="flex h-full flex-col bg-[#0b0b11] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] text-fog-2">Good morning</p>
          <p className="text-xs font-bold">Alex Morgan</p>
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-[10px] font-bold text-white">A</span>
      </div>
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.15 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 p-3.5 shadow-lg"
      >
        <p className="text-[9px] text-white/70">Total balance</p>
        <p className="text-xl font-extrabold text-white">$12,480.50</p>
        <p className="mt-0.5 text-[9px] font-semibold text-emerald-200">▲ +$820 this month</p>
        <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
      </motion.div>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {["Send", "Request", "Cards", "More"].map((action, i) => (
          <motion.div
            key={action}
            {...fadeUp}
            transition={{ delay: 0.3 + i * 0.07 }}
            className="flex flex-col items-center gap-1 rounded-xl border border-white/6 bg-white/[0.03] py-2"
          >
            <span className="text-[11px]">{["↗", "↙", "💳", "⋯"][i]}</span>
            <span className="text-[8px] text-fog-2">{action}</span>
          </motion.div>
        ))}
      </div>
      <p className="mb-1.5 mt-3 text-[9px] font-bold text-fog-2">RECENT ACTIVITY</p>
      <div className="space-y-1.5">
        {[
          ["🛒", "Design assets", "-$49.00"],
          ["💼", "Client payment", "+$1,200"],
          ["☕", "Coffee & Co", "-$6.40"],
        ].map(([icon, label, amount], i) => (
          <motion.div
            key={label}
            {...fadeUp}
            transition={{ delay: 0.55 + i * 0.1 }}
            className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] px-2.5 py-2"
          >
            <span className="text-xs">{icon}</span>
            <span className="flex-1 text-[10px] font-medium">{label}</span>
            <span className={`text-[10px] font-bold ${amount.startsWith("+") ? "text-emerald-400" : ""}`}>
              {amount}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ScreenStats() {
  const bars = [45, 72, 58, 88, 64, 92, 78];
  return (
    <div className="flex h-full flex-col bg-[#0b0b11] p-4">
      <p className="text-xs font-bold">Your activity</p>
      <p className="text-[9px] text-fog-2">Weekly overview</p>
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.15 }}
        className="mt-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3"
      >
        <div className="flex h-24 items-end gap-1.5">
          {bars.map((bar, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${bar}%` }}
              transition={{ delay: 0.25 + i * 0.08, type: "spring", damping: 15 }}
              className={`flex-1 rounded-t-[3px] ${i === 5 ? "bg-gradient-to-t from-cyan-500 to-violet-400" : "bg-white/12"}`}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[8px] text-fog-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <span key={i}>{day}</span>
          ))}
        </div>
      </motion.div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ["🔥", "12 day", "streak"],
          ["⚡", "94%", "completion"],
        ].map(([icon, big, small], i) => (
          <motion.div
            key={big}
            {...fadeUp}
            transition={{ delay: 0.5 + i * 0.12 }}
            className="rounded-2xl border border-white/6 bg-white/[0.03] p-3 text-center"
          >
            <span className="text-sm">{icon}</span>
            <p className="text-sm font-extrabold">{big}</p>
            <p className="text-[8px] text-fog-2">{small}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const LABELS = ["Onboarding", "Home", "Stats"];

export function AppShowcase({ name }: { name: string }) {
  const player = useScenePlayer(3, 5500);
  const frameRef = useRef<HTMLDivElement>(null);
  const screens = [
    <ScreenOnboarding key="onboarding" name={name} />,
    <ScreenHome key="home" />,
    <ScreenStats key="stats" />,
  ];

  return (
    <div ref={frameRef} className="gradient-ring flex flex-col overflow-hidden rounded-3xl bg-ink-2">
      <div className="relative flex justify-center bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.12),transparent_60%)] py-8">
        <LiveBadge text="Live app preview" />
        {/* Phone frame */}
        <div className="relative w-[220px] overflow-hidden rounded-[32px] border-[6px] border-ink-3 bg-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
          <div className="absolute left-1/2 top-1.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-ink-3" />
          <div className="h-[430px] pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={player.scene}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {screens[player.scene]}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Bottom nav */}
          <div className="flex justify-around border-t border-white/6 bg-ink-2/90 py-2">
            {["⌂", "▦", "◔", "☰"].map((icon, i) => (
              <span key={i} className={`text-xs ${i === Math.min(player.scene, 3) ? "text-cyan-brand" : "text-fog-2/50"}`}>
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>
      <PlayerBar
        labels={LABELS}
        {...player}
        onFullscreen={() => frameRef.current?.requestFullscreen?.()}
      />
    </div>
  );
}
