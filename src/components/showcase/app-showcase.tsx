"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScenePlayer, PlayerBar, LiveBadge } from "./player";
import { getAppShowcase } from "./app-screens";

export function AppShowcase({ slug, name }: { slug: string; name: string }) {
  const { labels, screens } = getAppShowcase(slug);
  const rendered = screens(name);
  const player = useScenePlayer(rendered.length, 5500);
  const frameRef = useRef<HTMLDivElement>(null);

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
                {rendered[player.scene]}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Bottom nav */}
          <div className="flex justify-around border-t border-white/6 bg-ink-2/90 py-2">
            {["⌂", "▦", "◔", "☰"].map((icon, i) => (
              <span
                key={i}
                className={`text-xs ${i === Math.min(player.scene, 3) ? "text-cyan-brand" : "text-fog-2/50"}`}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>
      <PlayerBar
        labels={labels}
        {...player}
        onFullscreen={() => frameRef.current?.requestFullscreen?.()}
      />
    </div>
  );
}
