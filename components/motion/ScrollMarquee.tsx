"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * A strip that drifts with the page: scrolling down runs it right, scrolling up runs it left,
 * and scroll speed adds momentum. Horizontal wheel/trackpad gestures and dragging move it too.
 * Children are rendered twice so the loop is seamless.
 */
export function ScrollMarquee({ label, className, children, speed = 28 }: { label: string; className?: string; children: React.ReactNode; speed?: number }) {
  const reduce = useReducedMotionSafe();
  const [paused, setPaused] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const direction = useRef(1);
  const width = useRef(0);
  const inView = useInView(wrap, { margin: "100px 0px" });

  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [5, 0, 5], { clamp: false });

  useEffect(() => {
    const measure = () => (width.current = (track.current?.scrollWidth ?? 0) / 2);
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, []);

  const wrapX = (v: number) => {
    const w = width.current || 1;
    return -(((-v % w) + w) % w);
  };

  useAnimationFrame((_, delta) => {
    if (reduce || paused || !inView) return;
    const v = velocity.get();
    if (v > 1) direction.current = 1;
    else if (v < -1) direction.current = -1;
    const step = direction.current * speed * (delta / 1000) * (1 + Math.abs(boost.get()));
    x.set(wrapX(x.get() + step));
  });

  // Horizontal wheel / trackpad over the strip scrolls it directly.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      x.set(wrapX(x.get() - e.deltaX));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [x]);

  return (
    <div role="region" aria-label={label} className={cn("relative", className)}>
      <div ref={wrap} className="cursor-grab overflow-hidden active:cursor-grabbing">
        <motion.div
          ref={track}
          style={{ x }}
          className="flex w-max touch-pan-y"
          onPan={(_, info) => x.set(wrapX(x.get() + info.delta.x))}
        >
          {children}
          <div aria-hidden className="contents">
            {children}
          </div>
        </motion.div>
      </div>
      {!reduce && (
        <div className="container-x mt-5 flex justify-end">
          <button type="button" onClick={() => setPaused((p) => !p)} className="btn btn-ghost min-h-10 px-4 text-sm" aria-pressed={paused}>
            {paused ? <PlayIcon className="size-4" aria-hidden /> : <PauseIcon className="size-4" aria-hidden />}
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      )}
    </div>
  );
}
