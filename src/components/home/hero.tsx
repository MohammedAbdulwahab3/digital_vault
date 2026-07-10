"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/language-provider";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

export function Hero({ productCount }: { productCount: number }) {
  const { t } = useLang();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { damping: 25, stiffness: 120 });
  const sy = useSpring(my, { damping: 25, stiffness: 120 });
  const imgX = useTransform(sx, [0, 1], [14, -14]);
  const imgY = useTransform(sy, [0, 1], [10, -10]);
  const cardX = useTransform(sx, [0, 1], [-22, 22]);
  const cardY = useTransform(sy, [0, 1], [-14, 14]);

  return (
    <section
      className="noise relative flex min-h-[calc(100vh-61px)] items-center overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - rect.left) / rect.width);
        my.set((e.clientY - rect.top) / rect.height);
      }}
    >
      {/* Aurora backdrop */}
      <div className="orb -right-40 -top-64 h-[800px] w-[800px] animate-pulse-slow bg-violet-brand/20" />
      <div className="orb -bottom-52 -left-32 h-[600px] w-[600px] animate-pulse-slow bg-cyan-brand/10 [animation-delay:2s]" />
      <div className="orb left-1/3 top-1/4 h-[300px] w-[300px] bg-pink-brand/10" />
      {/* Grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-brand/30 bg-violet-brand/15 px-4 py-1.5 text-sm font-medium text-purple-brand"
          >
            {t.hero.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl"
          >
            {t.hero.titlePre}<span className="text-gradient">{t.hero.titleSpan}</span>
            {t.hero.titlePost}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-fog-2"
          >
            {t.hero.subtitle}
            <Link href="/requests" className="text-purple-brand underline-offset-4 hover:underline">
              {t.hero.subtitleLink}
            </Link>
            .
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link href="/products" className="btn-primary !px-8 !py-3 !text-base">
              {t.hero.exploreBtn}
            </Link>
            <Link href="/requests" className="btn-outline !px-8 !py-3 !text-base">
              {t.hero.requestBtn}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-12 flex gap-10"
          >
            <div>
              <p className="font-display text-3xl font-bold text-gradient">
                <Counter to={productCount} suffix="+" />
              </p>
              <p className="mt-1 text-sm text-fog-2">{t.hero.statProducts}</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-gradient">
                <Counter to={10} suffix="K" />
              </p>
              <p className="mt-1 text-sm text-fog-2">{t.hero.statCreators}</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-gradient">
                <Counter to={99} suffix=".9%" />
              </p>
              <p className="mt-1 text-sm text-fog-2">{t.hero.statSatisfaction}</p>
            </div>
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="relative hidden lg:block"
        >
          <motion.div style={{ x: imgX, y: imgY }} className="gradient-ring relative overflow-hidden rounded-3xl">
            <Image
              src="/images/hero-banner.png"
              alt="Digital design showcase"
              width={640}
              height={520}
              priority
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/50 via-transparent to-transparent" />
          </motion.div>

          {/* Floating chips */}
          <motion.div
            style={{ x: cardX, y: cardY }}
            className="glass-strong absolute -left-10 top-10 animate-float rounded-2xl px-4 py-3 shadow-2xl"
          >
            <p className="text-xs text-fog-2">{t.hero.chipBlender}</p>
            <p className="text-sm font-bold">
              🧑‍🎨 {t.hero.chipRigged} <span className="text-orange-400">· 52K</span>
            </p>
          </motion.div>
          <motion.div
            style={{ x: cardX, y: cardY }}
            className="glass-strong absolute -right-6 bottom-24 animate-float rounded-2xl px-4 py-3 shadow-2xl [animation-delay:1.6s]"
          >
            <p className="text-xs text-fog-2">{t.hero.chipDelivery}</p>
            <p className="text-sm font-bold">{t.hero.chipDownload}</p>
          </motion.div>
          <motion.div
            style={{ x: cardX, y: cardY }}
            className="glass-strong absolute -bottom-6 left-16 animate-float rounded-2xl px-4 py-3 shadow-2xl [animation-delay:0.8s]"
          >
            <p className="text-sm font-bold">
              ★★★★★ <span className="font-normal text-fog-2">{t.hero.chipRating}</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
