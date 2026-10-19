"use client";

import { motion } from "motion/react";

/**
 * A procedural juice splash: droplets thrown out of the glass under gravity plus a
 * crown ring at the base. Drawn with CSS gradients, no imagery. Re-key it to replay.
 */
const DROPS = Array.from({ length: 16 }, (_, i) => {
  // Deterministic pseudo-random spread so server and client agree.
  const r = (n: number) => {
    const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const angle = -Math.PI / 2 + (r(1) - 0.5) * Math.PI * 1.25; // mostly upward fan
  const dist = 120 + r(2) * 220;
  const size = Math.round(7 + r(3) * 20);
  return {
    dx: Math.round(Math.cos(angle) * dist),
    dy: Math.round(Math.sin(angle) * dist),
    size,
    h: Math.round(size * (1 + r(5) * 0.35)),
    delay: Math.round(r(4) * 120) / 1000,
  };
});

export function Splash({ color, className = "" }: { color: string; className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden>
      <motion.span
        className="absolute top-0 left-0 block h-10 w-64 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2"
        style={{ borderColor: color }}
        initial={{ scale: 0.15, opacity: 0.9 }}
        animate={{ scale: 1.6, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
      {DROPS.map((d, i) => (
        <motion.span
          key={i}
          className="absolute top-0 left-0 block rounded-full"
          style={{
            width: d.size,
            height: d.h,
            marginLeft: -Math.round(d.size / 2),
            marginTop: -Math.round(d.h / 2),
            background: `radial-gradient(circle at 32% 28%, rgb(255 255 255 / 0.95) 0 14%, transparent 26%), radial-gradient(circle at 50% 55%, ${color} 0 62%, color-mix(in oklab, ${color} 70%, #000) 100%)`,
            boxShadow: `0 6px 14px -6px color-mix(in oklab, ${color} 60%, #000)`,
          }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{
            x: [0, d.dx * 0.7, d.dx],
            y: [0, d.dy, d.dy + 260], // rise, then fall
            scale: [0, 1, 0.7],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 1.35, delay: d.delay, times: [0, 0.38, 1], ease: ["easeOut", "easeIn"] }}
        />
      ))}
    </div>
  );
}
