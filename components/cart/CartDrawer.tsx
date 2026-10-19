"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { MinusIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/menu";
import { cn } from "@/lib/utils";

export function QtyStepper({ qty, onChange, label, compact = false }: { qty: number; onChange: (q: number) => void; label: string; compact?: boolean }) {
  return (
    <div className={cn("inline-flex shrink-0 items-center rounded-full border border-line bg-surface", compact && "flex-col")} role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        className="grid size-9 place-items-center rounded-full hover:bg-ink/5"
        aria-label={qty === 1 ? `Remove ${label}` : `One less ${label}`}
      >
        {qty === 1 ? <TrashIcon className="size-4" aria-hidden /> : <MinusIcon className="size-4" aria-hidden />}
      </button>
      <output className="min-w-6 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {qty}
      </output>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        disabled={qty >= 20}
        className="grid size-9 place-items-center rounded-full hover:bg-ink/5 disabled:opacity-40"
        aria-label={`One more ${label}`}
      >
        <PlusIcon className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export function CartDrawer() {
  const { lines, subtotal, count, setQty, cartOpen, setCartOpen } = useStore();

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="w-full max-w-none gap-0 border-l-0 bg-ground p-0 sm:max-w-md" data-lenis-prevent>
        <div className="flex items-baseline gap-3 px-6 pt-6 pb-4 pr-14">
          <SheetTitle className="font-display text-3xl font-medium tracking-[-0.03em]">Your order</SheetTitle>
          <span className="text-sm text-muted-ink tabular-nums">
            {count} {count === 1 ? "item" : "items"}
          </span>
        </div>
        <SheetDescription className="sr-only">Items in your Health n Goodness cart</SheetDescription>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6 pb-24">
            <p className="font-display text-4xl leading-[1.05] font-medium tracking-[-0.035em]">Nothing in your glass yet.</p>
            <p className="max-w-[32ch] text-muted-ink">Start with a Fresh Musami or one of the ten detox blends.</p>
            <Link href="/menu" onClick={() => setCartOpen(false)} className="btn btn-primary mt-2">
              Browse the menu
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
              <AnimatePresence initial={false}>
                {lines.map((l) => (
                  <motion.li
                    key={l.id}
                    layout
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40, transition: { duration: 0.18 } }}
                    className="flex gap-3 rounded-[1.25rem] bg-surface p-3"
                  >
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-[0.9rem] bg-muted">
                      {l.item.image && <Image src={l.item.image} alt="" fill sizes="64px" className="object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="leading-snug font-medium">{l.item.name}</p>
                        <span className="text-sm font-medium tabular-nums">{formatPrice(l.qty * l.item.price)}</span>
                      </div>
                      <p className="text-xs text-muted-ink">{l.item.from ? "Regular size" : l.item.category}</p>
                      <div className="mt-2">
                        <QtyStepper qty={l.qty} onChange={(q) => setQty(l.id, q)} label={l.item.name} />
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <div className="border-t border-line bg-surface px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-ink-soft">Subtotal</span>
                <span className="font-display text-2xl font-medium tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-ink">Delivery fee and taxes are confirmed by the branch.</p>
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="btn btn-primary mt-4 w-full">
                Checkout
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
