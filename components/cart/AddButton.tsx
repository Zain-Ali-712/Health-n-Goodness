"use client";

import { motion } from "motion/react";
import { PlusIcon } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";
import { QtyStepper } from "./CartDrawer";
import { cn } from "@/lib/utils";

/**
 * Add-to-cart that turns into a quantity stepper once the item is in the cart.
 * `compact` renders a round icon button for dense cards.
 */
export function AddButton({
  id,
  name,
  className,
  label = "Add",
  compact = false,
}: {
  id: string;
  name: string;
  className?: string;
  label?: string;
  compact?: boolean;
}) {
  const { add, qtyOf, setQty, ready } = useStore();
  const qty = ready ? qtyOf(id) : 0;

  if (qty > 0) return <QtyStepper qty={qty} onChange={(q) => setQty(id, q)} label={name} compact={compact} />;

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={() => add(id)}
      className={cn(
        compact
          ? "grid size-10 shrink-0 place-items-center rounded-full bg-green text-surface transition-colors hover:bg-green-deep"
          : "btn btn-primary min-h-10 px-4 text-sm",
        className,
      )}
      aria-label={`Add ${name} to cart`}
    >
      <PlusIcon className="size-4" aria-hidden />
      {!compact && label}
    </motion.button>
  );
}
