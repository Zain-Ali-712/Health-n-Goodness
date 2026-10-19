"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { Field } from "@/components/forms/Field";
import { QtyStepper } from "./CartDrawer";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { BRANCHES, PREFERRED_BRANCH_KEY } from "@/lib/branches";
import { PHONE_FIELD } from "@/lib/forms";
import { formatPrice } from "@/lib/menu";
import { telHref } from "@/lib/site";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Placed = { ref: string; name: string; total: number; mode: "delivery" | "pickup"; branch: (typeof BRANCHES)[number] };

export function CheckoutView() {
  const { lines, subtotal, setQty, clear, ready, user, setAuthOpen } = useStore();
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [branch, setBranch] = useState(BRANCHES[0].id);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // When someone signs in mid-checkout, fill only the fields they left empty.
  useEffect(() => {
    const f = formRef.current;
    if (!f || !user) return;
    for (const [name, v] of [["name", user.name], ["phone", user.phone]] as const) {
      const el = f.elements.namedItem(name) as HTMLInputElement | null;
      if (el && !el.value && v) el.value = v;
    }
  }, [user]);

  useEffect(() => {
    try {
      const pref = sessionStorage.getItem(PREFERRED_BRANCH_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore the branch picked on /locations
      if (pref && BRANCHES.some((b) => b.id === pref)) setBranch(pref);
    } catch {}
  }, []);

  if (placed) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl rounded-[2rem] bg-surface p-8 text-center md:p-12" role="status">
        <CheckCircleIcon className="mx-auto size-14 text-green" weight="fill" aria-hidden />
        <h1 className="display mt-5 text-5xl">Order placed</h1>
        <p className="mt-3 text-ink-soft">
          Thanks, {placed.name}. Order <span className="font-medium text-ink">{placed.ref}</span> for {formatPrice(placed.total)} is with{" "}
          {placed.branch.name} for {placed.mode}.
        </p>
        <p className="mt-2 text-sm text-muted-ink">
          Demo checkout, so nothing was sent. To order for real, call {placed.branch.name} on{" "}
          <a href={telHref(placed.branch.phone)} className="text-ink link-underline">
            {placed.branch.phone}
          </a>
          .
        </p>
        <Link href="/menu" className="btn btn-primary mt-8">
          Back to the menu
        </Link>
      </motion.div>
    );
  }

  if (ready && lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-[2rem] bg-surface p-10 text-center">
        <h1 className="display text-5xl">Your cart is empty</h1>
        <p className="mt-3 text-ink-soft">Pick a juice, shake or detox first.</p>
        <Link href="/menu" className="btn btn-primary mt-8">
          Browse the menu
        </Link>
      </div>
    );
  }

  const b = BRANCHES.find((x) => x.id === branch)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
      <form
        ref={formRef}
        className="grid gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const ref = `HNG-${Date.now().toString(36).slice(-5).toUpperCase()}`;
          setPlaced({ ref, name: String(fd.get("name")).trim().split(" ")[0], total: subtotal, mode, branch: b });
          clear();
          scrollToTarget(0, 0);
        }}
      >
        <div>
          <h1 className="display text-[clamp(2.8rem,6vw,4.5rem)]">Checkout</h1>
          {!user && (
            <p className="mt-3 text-sm text-ink-soft">
              Have an account?{" "}
              <button type="button" onClick={() => setAuthOpen("signin")} className="font-medium text-green link-underline">
                Sign in
              </button>{" "}
              to fill in your details.
            </p>
          )}
        </div>

        <fieldset className="grid gap-3">
          <legend className="mb-3 text-sm font-medium">How would you like it?</legend>
          <div className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
            {(["delivery", "pickup"] as const).map((m) => (
              <label
                key={m}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center justify-center rounded-full text-sm font-medium capitalize transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-green",
                  mode === m ? "bg-surface text-ink shadow-soft" : "text-ink-soft",
                )}
              >
                <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
                {m}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field grid gap-1.5">
          <label htmlFor="branch" className="text-sm font-medium">
            {mode === "delivery" ? "Deliver from" : "Pick up at"}
          </label>
          <select id="branch" name="branch" value={branch} onChange={(e) => setBranch(e.target.value)}>
            {BRANCHES.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}, {x.area}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Full name" autoComplete="name" required minLength={2} defaultValue={user?.name} error="Please enter your name." />
          <Field name="phone" label="Mobile number" required defaultValue={user?.phone} {...PHONE_FIELD} />
          {mode === "delivery" && (
            <Field name="address" label="Delivery address" autoComplete="street-address" required minLength={8} className="sm:col-span-2" hint="House, street, block and area" error="Please add your full address." />
          )}
        </div>
        <div className="field grid gap-1.5">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes for the bar (optional)
          </label>
          <textarea id="notes" name="notes" rows={3} placeholder="Less ice, no sugar, extra honey…" />
        </div>

        <p className="rounded-[1.25rem] bg-green-soft px-4 py-3 text-sm text-green-deep">Payment is cash on {mode === "delivery" ? "delivery" : "pickup"}. This is a demo, so no order is sent.</p>

        <button type="submit" className="btn btn-primary w-full sm:w-auto sm:justify-self-start" disabled={!ready || lines.length === 0}>
          Place order, {formatPrice(subtotal)}
        </button>
      </form>

      <aside aria-label="Order summary" className="rounded-[2rem] bg-surface p-6 lg:sticky lg:top-28">
        <h2 className="font-display text-2xl font-medium tracking-[-0.03em]">Your order</h2>
        <ul className="mt-4 divide-y divide-line">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.li key={l.id} layout exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 py-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-[0.9rem] bg-muted">
                  {l.item.image && <Image src={l.item.image} alt="" fill sizes="56px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{l.item.name}</p>
                  <QtyStepper qty={l.qty} onChange={(q) => setQty(l.id, q)} label={l.item.name} />
                </div>
                <span className="text-sm font-medium tabular-nums">{formatPrice(l.qty * l.item.price)}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
          <span className="text-ink-soft">Subtotal</span>
          <span className="font-display text-2xl font-medium tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-1 text-xs text-muted-ink">Delivery fee and taxes are confirmed by the branch.</p>
      </aside>
    </div>
  );
}
