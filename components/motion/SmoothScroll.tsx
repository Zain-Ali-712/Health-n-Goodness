"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/** Scroll to an element (or y position) through Lenis when it is running. */
export function scrollToTarget(target: HTMLElement | number, offset = -88) {
  if (lenis) lenis.scrollTo(target, { offset, duration: 1.2 });
  else if (typeof target === "number") window.scrollTo({ top: target });
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset });
}

/** Lenis smooth scroll (same setup as Doubleshot / Seven Sides). Off under reduced motion. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let raf = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
