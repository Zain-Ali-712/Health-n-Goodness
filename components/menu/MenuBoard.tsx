"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PlusIcon } from "@phosphor-icons/react";
import { AddButton } from "@/components/cart/AddButton";
import { CitrusWheel, DotGrid } from "@/components/brand/Decor";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { MENU, priceLabel, formatPrice, type MenuCategory, type MenuItem } from "@/lib/menu";
import { useStore } from "@/lib/store";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { dims } from "@/lib/img";
import { cn } from "@/lib/utils";

// A deeper partner for each category tint, for the citrus pattern and accents.
const DEEP: Record<string, string> = {
  juices: "#e2a33a",
  detox: "#6f9a3b",
  shakes: "#b98a62",
  protein: "#8f7a5c",
  smoothies: "#d27b86",
  eats: "#5f8f4a",
  "add-ons": "#b59a54",
};

export function MenuBoard() {
  const [activeCat, setActiveCat] = useState(MENU[0].id);
  const barRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveCat(e.target.id.replace("cat-", ""));
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    MENU.forEach((c) => {
      const el = document.getElementById(`cat-${c.id}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const bar = barRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-cat="${activeCat}"]`);
    // Scroll only the bar sideways; scrollIntoView would also move the page and fight Lenis.
    if (bar && chip) bar.scrollTo({ left: chip.offsetLeft - (bar.clientWidth - chip.offsetWidth) / 2, behavior: "smooth" });
  }, [activeCat]);

  return (
    <>
      <nav aria-label="Menu categories" className="sticky top-[4.5rem] z-[var(--z-content)] bg-ground/85 py-3 backdrop-blur-md">
        <div className="container-x">
          <ul ref={barRef} className="flex gap-1 overflow-x-auto rounded-full bg-surface p-1 shadow-soft [scrollbar-width:none]">
            {MENU.map((c) => (
              <li key={c.id} className="shrink-0">
                <a
                  href={`#cat-${c.id}`}
                  data-cat={c.id}
                  aria-current={activeCat === c.id ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(`cat-${c.id}`);
                    if (el) scrollToTarget(el, 0); // Lenis already applies scroll-margin-top
                    history.replaceState(null, "", `#cat-${c.id}`);
                  }}
                  className="relative inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm text-ink-soft transition-colors hover:text-ink aria-[current=true]:text-surface"
                >
                  {activeCat === c.id && (
                    <motion.span layoutId="cat-pill" className="absolute inset-0 -z-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                  )}
                  <span className="relative">{c.title}</span>
                  <span className="relative text-xs tabular-nums opacity-60">{c.items.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {MENU.map((c) => (
        <Category key={c.id} cat={c} />
      ))}
    </>
  );
}

function Category({ cat }: { cat: MenuCategory }) {
  const [active, setActive] = useState<MenuItem>(cat.items[0]);
  const listRef = useRef<HTMLOListElement>(null);
  const from = Math.min(...cat.items.map((i) => i.price));

  // Scrolling a row through the middle of the screen selects it, like hovering does.
  useEffect(() => {
    const rows = listRef.current?.querySelectorAll<HTMLElement>("[data-item]");
    if (!rows) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const hit = cat.items.find((i) => i.id === (e.target as HTMLElement).dataset.item);
          if (hit) setActive(hit);
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [cat.items]);

  return (
    <section id={`cat-${cat.id}`} aria-labelledby={`h-${cat.id}`} className="scroll-mt-36 py-14 md:py-20">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <header className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-5">
            <div>
              <h2 id={`h-${cat.id}`} className="display text-[clamp(2.4rem,5vw,4.25rem)]">
                {cat.title}
              </h2>
              {cat.note && <p className="mt-2 max-w-[46ch] text-ink-soft">{cat.note}</p>}
            </div>
            <p className="text-sm text-muted-ink tabular-nums">
              {cat.items.length} items, from {formatPrice(from)}
            </p>
          </header>

          <ol ref={listRef}>
            {cat.items.map((item) => (
              <Row key={item.id} item={item} active={active.id === item.id} tint={cat.tint} onPick={() => setActive(item)} />
            ))}
          </ol>
        </div>

        <div className="hidden lg:col-span-5 lg:block">
          <Stage cat={cat} item={active} />
        </div>
      </div>
    </section>
  );
}

function Row({ item, active, tint, onPick }: { item: MenuItem; active: boolean; tint: string; onPick: () => void }) {
  return (
    <li
      data-item={item.id}
      onMouseEnter={onPick}
      onFocus={onPick}
      className="relative border-b border-line"
    >
      <span
        aria-hidden
        className={cn("absolute inset-y-2 -left-3 w-1 rounded-full bg-green transition-opacity duration-300", active ? "opacity-100" : "opacity-0")}
      />
      <div className="flex items-center gap-4 py-5 transition-[padding] duration-300 lg:data-[on=true]:pl-2" data-on={active}>
        <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl lg:hidden" style={{ backgroundColor: tint }}>
          {item.image && <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className={cn("font-display text-[1.2rem] leading-tight font-medium tracking-[-0.02em] transition-colors md:text-[1.35rem]", active && "text-green-deep")}>
              {item.name}
            </h3>
            <span aria-hidden className="mb-1 hidden h-px min-w-6 flex-1 border-b-2 border-dotted border-ink/25 sm:block" />
            <span className="shrink-0 text-sm font-medium tabular-nums">{priceLabel(item)}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            {item.popular && <span className="rounded-full bg-green-soft px-2 py-0.5 text-[0.7rem] font-medium text-green-deep">Most ordered</span>}
            {item.description && <p className="line-clamp-2 max-w-[56ch] text-sm text-muted-ink">{item.description}</p>}
          </div>
        </div>
        <AddButton id={item.id} name={item.name} compact />
      </div>
    </li>
  );
}

/** The sticky stage: the drink in focus, framed in an arch on the category's colour. */
function Stage({ cat, item }: { cat: MenuCategory; item: MenuItem }) {
  const reduce = useReducedMotionSafe();
  const { add } = useStore();
  const deep = DEEP[cat.id] ?? "#007943";
  return (
    <div className="sticky top-36">
      <div className="relative isolate overflow-hidden rounded-[2.25rem] px-5 pt-8 pb-7" style={{ backgroundColor: cat.tint }}>
        <DotGrid className="-z-10" color={`color-mix(in oklab, ${deep} 35%, transparent)`} />
        <CitrusWheel className="-right-16 -bottom-16 -z-10 w-64 opacity-40" rind={deep} flesh={`color-mix(in oklab, ${deep} 30%, white)`} spin={180} />
        <p aria-hidden className="pointer-events-none absolute -top-3 left-6 -z-10 font-display text-[7.5rem] leading-none font-extrabold tracking-[-0.06em] text-white/60">
          {cat.title.split(" ")[0]}
        </p>

        <div className="relative mx-auto aspect-[4/5] w-[min(100%,27rem)] overflow-hidden rounded-t-full rounded-b-[1.5rem] bg-white/50 shadow-[0_30px_60px_-30px_rgb(17_41_28/0.45)] ring-8 ring-white/50">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={item.id}
              className="absolute inset-0"
              initial={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)", scale: 1.12 }}
              animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)", scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {item.image && <Image src={item.image} alt={item.name} {...dims(item.image)} sizes="440px" className="size-full object-cover" />}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="font-display text-[1.9rem] leading-tight font-medium tracking-[-0.03em]">{item.name}</p>
            {item.description && <p className="mx-auto mt-2 line-clamp-3 max-w-[36ch] text-sm text-ink-soft">{item.description}</p>}
            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="rounded-full bg-white/70 px-4 py-2 font-medium tabular-nums">{priceLabel(item)}</span>
              <button type="button" onClick={() => add(item.id)} className="btn btn-ink min-h-10 px-4 text-sm">
                <PlusIcon className="size-4" aria-hidden /> Add to order
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
