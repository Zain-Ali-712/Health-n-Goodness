"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { StudioBackdrop, type Backdrop } from "@/components/brand/StudioBackdrop";
import { CitrusWheel } from "@/components/brand/Decor";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { dims } from "@/lib/img";
import { cn } from "@/lib/utils";

export type Stat = { value: string; label: string };
export type Cup = { src: string; alt: string; h: number; x: number; rot?: number; z?: number };

const GREEN: Backdrop = { top: "#d7e6cc", bottom: "#a9c78f", glow: "rgb(250 252 240 / 0.9)", floor: "#eef3e4", rays: true, bokeh: "rgb(255 255 240 / 0.7)" };

/** Shared hero for inner pages: studio backdrop, title, stats and a few cut-out drinks. */
export function PageHero({
  title,
  intro,
  stats,
  cups = [],
  backdrop = GREEN,
  ink = "#1d3a1a",
  children,
}: {
  title: React.ReactNode;
  intro: React.ReactNode;
  stats?: Stat[];
  cups?: Cup[];
  backdrop?: Backdrop;
  ink?: string;
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotionSafe();
  return (
    <header className="relative isolate overflow-hidden pt-32 pb-14 md:pt-36 md:pb-20" style={{ color: ink }}>
      <StudioBackdrop b={backdrop} className="-z-20" />
      <CitrusWheel className="-right-24 -bottom-32 -z-10 w-[24rem] opacity-25" rind={ink} flesh="#ffffff" spin={120} />
      <div className="container-x grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="display text-[clamp(3rem,8vw,7rem)]"
          >
            {title}
          </motion.h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-[46ch] text-lg opacity-85"
          >
            {intro}
          </motion.div>
          {stats && (
            <dl className="mt-8 grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[1.25rem] bg-white/55 px-4 py-3 backdrop-blur-md"
                >
                  <dt className="text-xs opacity-75">{s.label}</dt>
                  <dd className="font-display text-2xl font-medium tracking-[-0.03em] tabular-nums">{s.value}</dd>
                </motion.div>
              ))}
            </dl>
          )}
          {children}
        </div>

        {cups.length > 0 && (
          <div className="relative hidden h-[min(66svh,600px)] lg:col-span-6 lg:block" aria-hidden={cups.every((c) => !c.alt)}>
            {cups.map((c, i) => (
              <motion.div
                key={c.src}
                className="absolute bottom-0"
                style={{ left: `${c.x}%`, height: `${c.h}%`, zIndex: c.z ?? i, rotate: c.rot ?? 0 }}
                initial={reduce ? false : { opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.15 + i * 0.1 }}
              >
                <motion.div
                  className="h-full"
                  animate={reduce ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image src={c.src} alt={c.alt} {...dims(c.src)} priority={i === 0} sizes="20vw" className={cn("h-full w-auto max-w-none object-contain drop-shadow-[0_30px_30px_rgb(0_0_0/0.2)]")} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
