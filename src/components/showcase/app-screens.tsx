"use client";

/**
 * Per-product phone screens. Each app product gets its own 3-screen
 * walkthrough; unknown slugs fall back to the finance demo.
 */

import { motion } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } };
const pop = { initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 } };

/* ═══════════════ SYNC — fintech (default) ═══════════════ */

function FinanceOnboarding({ name }: { name: string }) {
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
        Your money, beautifully organized in one place.
      </motion.p>
      <motion.div {...fadeUp} transition={{ delay: 0.55 }} className="mt-6 w-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 py-2.5 text-center text-[11px] font-bold text-white">
        Get started →
      </motion.div>
    </div>
  );
}

function FinanceHome() {
  return (
    <div className="flex h-full flex-col bg-[#0b0b11] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] text-fog-2">Good morning</p>
          <p className="text-xs font-bold">Alex Morgan</p>
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-[10px] font-bold text-white">A</span>
      </div>
      <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 p-3.5 shadow-lg">
        <p className="text-[9px] text-white/70">Total balance</p>
        <p className="text-xl font-extrabold text-white">$12,480.50</p>
        <p className="mt-0.5 text-[9px] font-semibold text-emerald-200">▲ +$820 this month</p>
      </motion.div>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {["Send", "Request", "Cards", "More"].map((action, i) => (
          <motion.div key={action} {...fadeUp} transition={{ delay: 0.3 + i * 0.07 }} className="flex flex-col items-center gap-1 rounded-xl border border-white/6 bg-white/[0.03] py-2">
            <span className="text-[11px]">{["↗", "↙", "💳", "⋯"][i]}</span>
            <span className="text-[8px] text-fog-2">{action}</span>
          </motion.div>
        ))}
      </div>
      <p className="mb-1.5 mt-3 text-[9px] font-bold text-fog-2">RECENT ACTIVITY</p>
      <div className="space-y-1.5">
        {[["🛒", "Design assets", "-$49.00"], ["💼", "Client payment", "+$1,200"], ["☕", "Coffee & Co", "-$6.40"]].map(([icon, label, amount], i) => (
          <motion.div key={label} {...fadeUp} transition={{ delay: 0.55 + i * 0.1 }} className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] px-2.5 py-2">
            <span className="text-xs">{icon}</span>
            <span className="flex-1 text-[10px] font-medium">{label}</span>
            <span className={`text-[10px] font-bold ${amount.startsWith("+") ? "text-emerald-400" : ""}`}>{amount}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FinanceStats() {
  const bars = [45, 72, 58, 88, 64, 92, 78];
  return (
    <div className="flex h-full flex-col bg-[#0b0b11] p-4">
      <p className="text-xs font-bold">Your activity</p>
      <p className="text-[9px] text-fog-2">Weekly overview</p>
      <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="mt-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3">
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
      </motion.div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[["🔥", "12 day", "streak"], ["⚡", "94%", "completion"]].map(([icon, big, small]) => (
          <motion.div key={big} {...fadeUp} transition={{ delay: 0.5 }} className="rounded-2xl border border-white/6 bg-white/[0.03] p-3 text-center">
            <span className="text-sm">{icon}</span>
            <p className="text-sm font-extrabold">{big}</p>
            <p className="text-[8px] text-fog-2">{small}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ HEALTHKIT — fitness ═══════════════ */

function Ring({ r, color, pct, delay }: { r: number; color: string; pct: number; delay: number }) {
  const c = 2 * Math.PI * r;
  return (
    <>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
      <motion.circle
        cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - pct) }}
        transition={{ duration: 1.4, ease: "easeOut", delay }}
        transform="rotate(-90 60 60)"
      />
    </>
  );
}

function HealthActivity() {
  return (
    <div className="flex h-full flex-col bg-[#0b0b11] p-4">
      <p className="text-xs font-bold">Today</p>
      <p className="text-[9px] text-fog-2">Thursday, Jul 9</p>
      <div className="flex justify-center py-2">
        <svg viewBox="0 0 120 120" className="h-32 w-32">
          <Ring r={50} color="#34d399" pct={0.85} delay={0.2} />
          <Ring r={38} color="#22d3ee" pct={0.62} delay={0.35} />
          <Ring r={26} color="#f472b6" pct={0.91} delay={0.5} />
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-1.5 text-center">
        {[["Move", "512", "kcal", "text-emerald-400"], ["Steps", "8,4k", "of 10k", "text-cyan-300"], ["Stand", "11", "hours", "text-pink-300"]].map(([label, big, small, tone], i) => (
          <motion.div key={label} {...fadeUp} transition={{ delay: 0.6 + i * 0.1 }} className="rounded-xl border border-white/6 bg-white/[0.03] py-2">
            <p className="text-[8px] text-fog-2">{label}</p>
            <p className={`text-sm font-extrabold ${tone}`}>{big}</p>
            <p className="text-[7px] text-fog-2">{small}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function HealthWorkout() {
  const sets = [
    ["Goblet squat", "3 × 12", true],
    ["Push-ups", "3 × 15", true],
    ["Plank hold", "3 × 60s", false],
    ["Kettlebell swing", "3 × 20", false],
  ] as const;
  return (
    <div className="flex h-full flex-col bg-[#0b0b11] p-4">
      <p className="text-xs font-bold">Full-body strength</p>
      <p className="text-[9px] text-fog-2">Week 4 · Day 2</p>
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="mt-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3">
        <p className="text-[8px] text-white/70">REST TIMER</p>
        <div className="flex items-center justify-between">
          <p className="font-mono text-xl font-extrabold text-white">00:42</p>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-bold text-white">Skip</span>
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-white/20">
          <motion.div initial={{ width: "100%" }} animate={{ width: "30%" }} transition={{ duration: 4 }} className="h-full rounded-full bg-white" />
        </div>
      </motion.div>
      <div className="mt-2.5 space-y-1.5">
        {sets.map(([name, reps, done], i) => (
          <motion.div key={name} {...fadeUp} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] px-2.5 py-2">
            <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold ${done ? "bg-emerald-400/20 text-emerald-400" : "border border-white/15 text-fog-2"}`}>
              {done ? "✓" : i + 1}
            </span>
            <span className={`flex-1 text-[10px] font-medium ${done ? "text-fog-2 line-through" : ""}`}>{name}</span>
            <span className="text-[9px] text-fog-2">{reps}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function HealthSleep() {
  const bars = [72, 85, 60, 90, 78, 95, 82];
  return (
    <div className="flex h-full flex-col bg-[#0b0b11] p-4">
      <p className="text-xs font-bold">Sleep & recovery</p>
      <p className="text-[9px] text-fog-2">Last 7 nights</p>
      <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="mt-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3">
        <p className="mb-1 text-lg font-extrabold">7h 42m <span className="text-[9px] font-semibold text-emerald-400">▲ +18m avg</span></p>
        <div className="flex h-20 items-end gap-1.5">
          {bars.map((bar, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${bar}%` }}
              transition={{ delay: 0.25 + i * 0.08, type: "spring", damping: 15 }}
              className="flex-1 rounded-t-[3px] bg-gradient-to-t from-indigo-500 to-violet-400"
            />
          ))}
        </div>
      </motion.div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[["💤", "92", "sleep score"], ["❤️", "54", "resting bpm"]].map(([icon, big, small], i) => (
          <motion.div key={small} {...pop} transition={{ delay: 0.6 + i * 0.1 }} className="rounded-2xl border border-white/6 bg-white/[0.03] p-3 text-center">
            <span className="text-sm">{icon}</span>
            <p className="text-sm font-extrabold">{big}</p>
            <p className="text-[8px] text-fog-2">{small}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ WANDER — travel ═══════════════ */

function TravelExplore() {
  const spots = [
    ["Kyoto, Japan", "$1,240", "from-rose-500 to-orange-500"],
    ["Lofoten, Norway", "$980", "from-cyan-500 to-blue-600"],
    ["Oaxaca, Mexico", "$760", "from-amber-500 to-pink-500"],
  ];
  return (
    <div className="flex h-full flex-col bg-[#0b0b11] p-4">
      <p className="text-xs font-bold">Where to next?</p>
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="mt-2 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[9px] text-fog-2">
        🔍 Try “northern lights”…
      </motion.div>
      <div className="mt-2.5 flex-1 space-y-2">
        {spots.map(([name, price, g], i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.13, type: "spring", damping: 18 }}
            className="relative h-[72px] overflow-hidden rounded-2xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${g} opacity-80`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold text-white">{name}</p>
                <p className="text-[8px] text-white/70">★ 4.9 · 7 days</p>
              </div>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur">{price}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TravelTrip() {
  const days = [
    ["Day 1", "Arrive · Gion evening walk", "🏮"],
    ["Day 2", "Fushimi Inari sunrise hike", "⛩️"],
    ["Day 3", "Arashiyama bamboo + onsen", "🎋"],
    ["Day 4", "Day trip to Nara", "🦌"],
  ];
  return (
    <div className="flex h-full flex-col bg-[#0b0b11] p-4">
      <p className="text-xs font-bold">Kyoto in bloom</p>
      <p className="text-[9px] text-fog-2">Apr 2 – 9 · 2 travelers</p>
      <div className="relative mt-3 flex-1">
        <div className="absolute bottom-1 left-[9px] top-1 w-px bg-white/10" />
        <div className="space-y-2.5">
          {days.map(([day, plan, icon], i) => (
            <motion.div key={day} {...fadeUp} transition={{ delay: 0.2 + i * 0.12 }} className="flex items-center gap-2.5">
              <span className="z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-rose-400/50 bg-[#0b0b11] text-[9px]">{icon}</span>
              <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.03] px-2.5 py-1.5">
                <p className="text-[8px] font-bold text-rose-300">{day}</p>
                <p className="text-[9px] font-medium">{plan}</p>
              </div>
              <span className="cursor-grab text-[10px] text-fog-2/50">⠿</span>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.span {...pop} transition={{ delay: 0.8 }} className="mt-2 block rounded-full bg-gradient-to-r from-rose-500 to-orange-500 py-2 text-center text-[10px] font-bold text-white">
        + Add activity
      </motion.span>
    </div>
  );
}

function TravelBooking() {
  return (
    <div className="flex h-full flex-col justify-center bg-[#0b0b11] p-4">
      <motion.div {...fadeUp} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-base font-extrabold">SFO</p>
            <p className="text-[8px] text-fog-2">08:40</p>
          </div>
          <div className="flex flex-1 flex-col items-center px-2">
            <p className="text-[7px] text-fog-2">11h 05m · direct</p>
            <div className="relative my-1 h-px w-full bg-white/15">
              <motion.span
                initial={{ left: "0%" }}
                animate={{ left: "88%" }}
                transition={{ duration: 2.4, delay: 0.4, ease: "easeInOut" }}
                className="absolute -top-1.5 text-[9px]"
              >
                ✈️
              </motion.span>
            </div>
            <p className="text-[7px] text-fog-2">Boeing 787</p>
          </div>
          <div className="text-center">
            <p className="text-base font-extrabold">KIX</p>
            <p className="text-[8px] text-fog-2">13:45<span className="align-super text-[6px]">+1</span></p>
          </div>
        </div>
      </motion.div>
      <motion.div {...fadeUp} transition={{ delay: 0.25 }} className="mt-2 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
        <div className="flex justify-between text-[9px]"><span className="text-fog-2">Flights × 2</span><span className="font-semibold">$1,860</span></div>
        <div className="flex justify-between text-[9px]"><span className="text-fog-2">Ryokan · 7 nights</span><span className="font-semibold">$1,540</span></div>
        <div className="mt-1.5 flex justify-between border-t border-white/8 pt-1.5 text-[10px] font-bold">
          <span>Total</span><span className="text-rose-300">$3,400</span>
        </div>
      </motion.div>
      <motion.span
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mt-3 block rounded-full bg-gradient-to-r from-rose-500 to-orange-500 py-2.5 text-center text-[10px] font-bold text-white"
      >
        Confirm & book trip
      </motion.span>
    </div>
  );
}

/* ═══════════════ TASKLY — productivity ═══════════════ */

function TasklyTasks() {
  const tasks = [
    ["Ship landing page", "Today", true],
    ["Review brand deck", "Today", true],
    ["Write launch email", "Today", false],
    ["Prep investor update", "Tomorrow", false],
  ] as const;
  return (
    <div className="flex h-full flex-col bg-[#0b0b11] p-4">
      <p className="text-xs font-bold">Today</p>
      <p className="text-[9px] text-fog-2">4 tasks · 2 done</p>
      <div className="mt-1.5 h-1.5 rounded-full bg-white/8">
        <motion.div initial={{ width: 0 }} animate={{ width: "50%" }} transition={{ delay: 0.3, duration: 0.8 }} className="h-full rounded-full bg-gradient-brand" />
      </div>
      <div className="mt-3 space-y-1.5">
        {tasks.map(([task, when, done], i) => (
          <motion.div key={task} {...fadeUp} transition={{ delay: 0.25 + i * 0.11 }} className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] px-2.5 py-2">
            <motion.span
              initial={done ? { scale: 0 } : {}}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.11, type: "spring", damping: 10 }}
              className={`flex h-4 w-4 items-center justify-center rounded-md text-[8px] font-bold ${done ? "bg-gradient-brand text-white" : "border border-white/20"}`}
            >
              {done ? "✓" : ""}
            </motion.span>
            <span className={`flex-1 text-[10px] font-medium ${done ? "text-fog-2 line-through" : ""}`}>{task}</span>
            <span className="text-[8px] text-fog-2">{when}</span>
          </motion.div>
        ))}
      </div>
      <motion.span {...pop} transition={{ delay: 0.8 }} className="mt-auto block rounded-full bg-gradient-brand py-2 text-center text-[10px] font-bold text-white">
        + New task
      </motion.span>
    </div>
  );
}

function TasklyFocus() {
  const c = 2 * Math.PI * 46;
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#0b0b11] p-4">
      <p className="text-[9px] font-bold uppercase tracking-widest text-violet-300">Focus session</p>
      <div className="relative my-3">
        <svg viewBox="0 0 110 110" className="h-36 w-36">
          <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
          <motion.circle
            cx="55" cy="55" r="46" fill="none" stroke="#a855f7" strokeWidth="7" strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c * 0.0 }}
            animate={{ strokeDashoffset: c * 0.4 }}
            transition={{ duration: 5, ease: "linear" }}
            transform="rotate(-90 55 55)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-2xl font-extrabold">17:32</p>
          <p className="text-[8px] text-fog-2">deep work · pomodoro 2/4</p>
        </div>
      </div>
      <p className="text-[10px] font-semibold">✍️ Write launch email</p>
      <div className="mt-3 flex gap-2">
        <span className="rounded-full border border-white/15 px-4 py-1.5 text-[9px] font-semibold text-fog-2">Skip</span>
        <span className="rounded-full bg-gradient-brand px-4 py-1.5 text-[9px] font-bold text-white">⏸ Pause</span>
      </div>
    </div>
  );
}

function TasklyHabits() {
  return (
    <div className="flex h-full flex-col bg-[#0b0b11] p-4">
      <p className="text-xs font-bold">Habit streaks</p>
      <p className="text-[9px] text-fog-2">June</p>
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="mt-3 rounded-2xl border border-white/6 bg-white/[0.03] p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold">🧘 Morning meditation</span>
          <span className="text-[9px] font-bold text-amber-300">🔥 21 days</span>
        </div>
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const level = [0.15, 0.4, 0.7, 1][Math.floor(((i * 7) % 11) / 3)];
            return (
              <motion.span
                key={i}
                {...pop}
                transition={{ delay: 0.2 + i * 0.02 }}
                className="aspect-square rounded-[3px]"
                style={{ background: `rgba(168, 85, 247, ${level})` }}
              />
            );
          })}
        </div>
      </motion.div>
      <div className="mt-2.5 space-y-1.5">
        {[["📖 Read 20 pages", "14 days", 0.8], ["🏃 Morning run", "6 days", 0.45]].map(([habit, streak, pct], i) => (
          <motion.div key={habit as string} {...fadeUp} transition={{ delay: 0.5 + i * 0.12 }} className="rounded-xl border border-white/5 bg-white/[0.02] px-2.5 py-2">
            <div className="flex justify-between text-[9px]">
              <span className="font-medium">{habit}</span>
              <span className="text-amber-300">🔥 {streak}</span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-white/8">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(pct as number) * 100}%` }} transition={{ delay: 0.7, duration: 0.7 }} className="h-full rounded-full bg-gradient-brand" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ Registry ═══════════════ */

export type AppShowcaseDef = {
  labels: string[];
  screens: (name: string) => React.ReactElement[];
};

const APP_REGISTRY: Record<string, AppShowcaseDef> = {
  "sync-finance-app": {
    labels: ["Onboarding", "Home", "Stats"],
    screens: (name) => [
      <FinanceOnboarding key="a" name={name} />,
      <FinanceHome key="b" />,
      <FinanceStats key="c" />,
    ],
  },
  "healthkit-app-design": {
    labels: ["Activity", "Workout", "Sleep"],
    screens: () => [<HealthActivity key="a" />, <HealthWorkout key="b" />, <HealthSleep key="c" />],
  },
  "wander-travel-app": {
    labels: ["Explore", "Trip", "Booking"],
    screens: () => [<TravelExplore key="a" />, <TravelTrip key="b" />, <TravelBooking key="c" />],
  },
  "taskly-productivity-app": {
    labels: ["Tasks", "Focus", "Habits"],
    screens: () => [<TasklyTasks key="a" />, <TasklyFocus key="b" />, <TasklyHabits key="c" />],
  },
};

/** Per-product screen set for phone-frame products (app category). */
export function getAppShowcase(slug: string): AppShowcaseDef {
  return APP_REGISTRY[slug] ?? APP_REGISTRY["sync-finance-app"];
}
