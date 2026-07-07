"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScenePlayer, PlayerBar, LiveBadge } from "./player";
import { getWebShowcase } from "./web-scenes";

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

export function DashboardShowcase({ slug, name }: { slug: string; name: string }) {
  const { labels, scenes } = getWebShowcase(slug);
  const player = useScenePlayer(scenes.length, 6500);
  const frameRef = useRef<HTMLDivElement>(null);
  const Scene = scenes[player.scene];

  return (
    <div ref={frameRef} className="gradient-ring flex flex-col overflow-hidden rounded-3xl bg-ink-2">
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
        labels={labels}
        {...player}
        onFullscreen={() => frameRef.current?.requestFullscreen?.()}
      />
    </div>
  );
}
