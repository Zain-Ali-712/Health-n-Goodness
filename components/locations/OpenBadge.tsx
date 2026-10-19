"use client";

import { useEffect, useState } from "react";
import { formatTime, openState, type Branch, type OpenState } from "@/lib/branches";
import { cn } from "@/lib/utils";

/** Live "Open till / Opens at" using Lahore time. Renders after mount to avoid hydration drift. */
export function OpenBadge({ branch, className }: { branch: Branch; className?: string }) {
  const [state, setState] = useState<OpenState | null>(null);
  useEffect(() => {
    const tick = () => setState(openState(branch));
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, [branch]);

  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs font-medium",
        !state ? "invisible" : state.open ? "bg-green-soft text-green-deep" : "bg-muted text-ink-soft",
        className,
      )}
    >
      {state && (
        <>
          <span className={cn("size-1.5 rounded-full", state.open ? "bg-green" : "bg-ink-soft")} aria-hidden />
          {state.open ? `Open till ${formatTime(state.until)}` : `Opens ${formatTime(state.opensAt)}`}
        </>
      )}
    </span>
  );
}
