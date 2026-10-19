"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckIcon } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";

/** Small confirmation after "Add", with a shortcut to the cart. Announced politely. */
export function AddedToast() {
  const { lastAdded, setCartOpen } = useStore();
  const [shown, setShown] = useState<typeof lastAdded>(null);

  useEffect(() => {
    if (!lastAdded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirror the latest add into a timed toast
    setShown(lastAdded);
    const t = setTimeout(() => setShown(null), 2600);
    return () => clearTimeout(t);
  }, [lastAdded]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[var(--z-overlay)] flex justify-center px-4">
      <AnimatePresence>
        {shown && (
          <motion.div
            key={shown.at}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink py-2 pr-2 pl-4 text-sm text-surface shadow-lift"
          >
            <CheckIcon className="size-4 text-green-soft" aria-hidden />
            <span>
              <span className="font-medium">{shown.name}</span> added
            </span>
            <button type="button" onClick={() => setCartOpen(true)} className="rounded-full bg-surface px-3.5 py-1.5 font-medium text-ink">
              View cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
