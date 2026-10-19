"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { dims } from "@/lib/img";
import { cn } from "@/lib/utils";

/** A citrus slice drawn in CSS (segments + pith + rind). It turns slowly as the section scrolls. */
export function CitrusWheel({
  className,
  rind = "#007943",
  flesh = "#dcead6",
  spin = 90,
}: {
  className?: string;
  rind?: string;
  flesh?: string;
  spin?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, spin]);
  return (
    <motion.div ref={ref} aria-hidden style={reduce ? undefined : { rotate }} className={cn("pointer-events-none absolute aspect-square rounded-full", className)}>
      <div className="absolute inset-0 rounded-full" style={{ background: rind }} />
      <div className="absolute inset-[4%] rounded-full" style={{ background: "color-mix(in oklab, white 82%, " + flesh + ")" }} />
      <div
        className="absolute inset-[8%] rounded-full"
        style={{
          background: `repeating-conic-gradient(from 0deg, ${flesh} 0deg 26deg, color-mix(in oklab, white 75%, ${flesh}) 26deg 30deg)`,
          maskImage: "radial-gradient(circle, transparent 0 9%, black 10% 100%)",
        }}
      />
    </motion.div>
  );
}

/** Soft dot grid, faded toward the edges. */
export function DotGrid({ className, color = "rgb(0 121 67 / 0.16)" }: { className?: string; color?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `radial-gradient(${color} 1.2px, transparent 1.6px)`,
        backgroundSize: "22px 22px",
        maskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent)",
      }}
    />
  );
}

/** A real fruit cut-out (from HnG's posters) that drifts against the scroll. */
export function DriftFruit({ src, className, speed = 80, rotate = 20 }: { src: string; className?: string; speed?: number; rotate?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const r = useTransform(scrollYProgress, [0, 1], [-rotate, rotate]);
  return (
    <motion.div ref={ref} aria-hidden style={reduce ? undefined : { y, rotate: r }} className={cn("pointer-events-none absolute", className)}>
      <Image src={src} alt="" {...dims(src)} sizes="200px" loading="lazy" className="h-auto w-full drop-shadow-[0_20px_24px_rgb(17_41_28/0.18)]" />
    </motion.div>
  );
}
