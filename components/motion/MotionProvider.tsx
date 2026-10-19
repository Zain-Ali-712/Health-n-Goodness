"use client";

import { MotionConfig } from "motion/react";

/** Motion follows the OS setting: transforms are skipped for people who prefer reduced motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
