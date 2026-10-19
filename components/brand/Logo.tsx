import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The official HnG mark (from the brand's Facebook profile PNG, made transparent)
 * next to the name set as it appears on cups: Health "n" Goodness.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image src="/img/brand/logo.webp" alt="" width={480} height={441} className="h-9 w-auto" priority />
      {!compact && (
        <span translate="no" aria-hidden className="font-display text-[1.05rem] leading-none font-semibold tracking-[-0.02em] text-ink">
          Health <span className="text-green">n</span> Goodness
        </span>
      )}
      <span className="sr-only">Health n Goodness</span>
    </span>
  );
}
