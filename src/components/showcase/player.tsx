"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Video-player-style scene sequencer: auto-advances through `count` scenes,
 * exposing play/pause, per-scene progress and direct seeking.
 */
export function useScenePlayer(count: number, durationMs = 6000) {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0..1 within current scene
  const raf = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    startRef.current = performance.now() - progress * durationMs;
    const tick = (now: number) => {
      const p = (now - startRef.current) / durationMs;
      if (p >= 1) {
        setScene((s) => (s + 1) % count);
        setProgress(0);
        startRef.current = now;
      } else {
        setProgress(p);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, scene, count, durationMs]);

  const goTo = useCallback((index: number) => {
    setScene(index);
    setProgress(0);
    startRef.current = performance.now();
  }, []);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  return { scene, playing, progress, togglePlay, goTo };
}

export function PlayerBar({
  labels,
  scene,
  playing,
  progress,
  togglePlay,
  goTo,
  onFullscreen,
}: {
  labels: string[];
  scene: number;
  playing: boolean;
  progress: number;
  togglePlay: () => void;
  goTo: (index: number) => void;
  onFullscreen?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 border-t border-white/8 bg-ink/85 px-4 py-2.5 backdrop-blur">
      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause preview" : "Play preview"}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-xs text-white shadow-[0_2px_12px_rgba(124,58,237,0.5)] transition hover:scale-110"
      >
        {playing ? (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
            <rect width="3.2" height="12" rx="1" />
            <rect x="6.8" width="3.2" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="11" height="12" viewBox="0 0 11 12" fill="currentColor">
            <path d="M0 1.2C0 .3 1 -.2 1.8.3l8.4 4.8c.8.4.8 1.5 0 2L1.8 11.7C1 12.2 0 11.7 0 10.8V1.2z" />
          </svg>
        )}
      </button>

      <div className="flex flex-1 items-center gap-1.5">
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => goTo(i)}
            className="group flex min-w-0 flex-1 flex-col gap-1"
            aria-label={`Scene: ${label}`}
          >
            <span
              className={cn(
                "truncate text-left text-[10px] font-semibold uppercase tracking-wider transition",
                i === scene ? "text-fog" : "text-fog-2/60 group-hover:text-fog-2"
              )}
            >
              {label}
            </span>
            <span className="h-1 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full rounded-full bg-gradient-brand transition-[width] duration-100"
                style={{
                  width: i < scene ? "100%" : i === scene ? `${progress * 100}%` : "0%",
                }}
              />
            </span>
          </button>
        ))}
      </div>

      {onFullscreen && (
        <button
          onClick={onFullscreen}
          aria-label="Fullscreen"
          className="shrink-0 rounded-lg p-1.5 text-fog-2 transition hover:bg-white/10 hover:text-fog"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      )}
    </div>
  );
}

/** Live badge shown on every showcase. */
export function LiveBadge({ text }: { text: string }) {
  return (
    <span className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-ink/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-fog backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {text}
    </span>
  );
}
