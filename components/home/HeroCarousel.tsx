"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRightIcon, CaretLeftIcon, CaretRightIcon, PlusIcon } from "@phosphor-icons/react";
import { StudioBackdrop, type Backdrop } from "@/components/brand/StudioBackdrop";
import { MightyStack } from "@/components/brand/MightyStack";
import { Splash } from "@/components/motion/Splash";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { getItem, priceLabel } from "@/lib/menu";
import { useStore } from "@/lib/store";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { dims } from "@/lib/img";
import { cn } from "@/lib/utils";

type Piece = { src: string; x: number; y: number; w: number; depth: number; rot: number };
type Drink = {
  id: string;
  /** Foodpanda item for the cart; null for seasonal drinks that are only on Instagram. */
  itemId: string | null;
  word: string;
  ink: string;
  juice: string;
  image?: string;
  alt: string;
  scale?: number;
  bg: Backdrop;
  pieces: Piece[];
};

// Each backdrop is matched to the drink's own Instagram poster (see research/research.md).
const DRINKS: Drink[] = [
  {
    id: "musami",
    itemId: "musami-fresh",
    word: "Musami",
    ink: "#26401a",
    juice: "#d8d24f",
    image: "/img/hero/musami-limes.webp",
    alt: "Fresh Musami juice in an HnG cup between halved sweet limes",
    scale: 0.92,
    bg: { top: "#b9cc94", bottom: "#93ad6c", glow: "rgb(250 248 220 / 0.85)", floor: "#f1ead6", rays: true, bokeh: "rgb(255 255 230 / 0.7)" },
    pieces: [
      { src: "/img/pieces/lime-half.webp", x: 76, y: 2, w: 15, depth: 0.7, rot: 28 },
      { src: "/img/pieces/musami-half.webp", x: 4, y: 12, w: 14, depth: 1.4, rot: -22 },
    ],
  },
  {
    id: "falsa",
    itemId: "fresh-falsa-juice",
    word: "Falsa",
    ink: "#0d4a46",
    juice: "#7a2b55",
    image: "/img/hero/falsa.webp",
    alt: "Fresh Falsa juice in an HnG cup on a pile of falsa berries",
    bg: { top: "#7fdcd5", bottom: "#2db3ab", glow: "rgb(220 250 247 / 0.9)", floor: "#a6ece6", rays: true, bokeh: "rgb(235 255 252 / 0.7)" },
    pieces: [
      { src: "/img/pieces/falsa-berry.webp", x: 10, y: 10, w: 8, depth: 1.5, rot: 0 },
      { src: "/img/pieces/falsa-berry-2.webp", x: 84, y: 22, w: 6, depth: 0.8, rot: 0 },
    ],
  },
  {
    id: "lychee",
    itemId: null,
    word: "Lychee",
    ink: "#5e1410",
    juice: "#e2483a",
    image: "/img/hero/lychee.webp",
    alt: "Lychee juice in an HnG cup with a red juice splash and fresh lychees",
    bg: { top: "#f6a38f", bottom: "#d9473a", glow: "rgb(255 226 214 / 0.85)", floor: "#f7b8a5", bokeh: "rgb(255 236 228 / 0.75)" },
    pieces: [],
  },
  {
    id: "pomegranate",
    itemId: "pomegranate-juice-red",
    word: "Anaar",
    ink: "#4f2f26",
    juice: "#b3263f",
    image: "/img/hero/pomegranate.webp",
    alt: "White and red pomegranate juice in an HnG cup beside whole and opened pomegranates",
    scale: 0.92,
    bg: { top: "#efe3dc", bottom: "#cdb5a8", glow: "rgb(255 250 246 / 0.95)", floor: "#f5ece6", bokeh: "rgb(255 255 255 / 0.65)" },
    pieces: [{ src: "/img/pieces/pom-arils.webp", x: 4, y: 6, w: 15, depth: 1.2, rot: -12 }],
  },
  {
    id: "mango",
    itemId: "mango-juice",
    word: "Mango",
    ink: "#0d3a57",
    juice: "#f5a623",
    image: "/img/hero/mango3.webp",
    alt: "Three HnG cups of mango juice with a mango splash and diced mango",
    bg: { top: "#d7eefa", bottom: "#4ea4d6", glow: "rgb(255 255 255 / 0.9)", floor: "#eef7fc", rays: true, bokeh: "rgb(255 255 255 / 0.8)" },
    pieces: [],
  },
  {
    id: "mighty",
    itemId: "mighty-charger-detox",
    word: "Charge",
    ink: "#5e1e0f",
    juice: "#f26b4f",
    alt: "Mighty Charger Detox in an HnG cup with orange, apple, carrot, lemon and pineapple",
    scale: 0.94,
    bg: { top: "#ffc3ae", bottom: "#ef6a4b", glow: "rgb(255 236 226 / 0.9)", floor: "#ffd2c2", bokeh: "rgb(255 240 232 / 0.7)" },
    pieces: [{ src: "/img/pieces/orange-half.webp", x: 2, y: 6, w: 15, depth: 1.3, rot: -18 }],
  },
];

const N = DRINKS.length;
const HOLD = 0.32; // share of each step spent resting on a drink

/** Scroll progress to a drink position that rests on each drink, then glides to the next. */
function positionStops() {
  const input: number[] = [];
  const output: number[] = [];
  DRINKS.forEach((_, i) => {
    const c = i / (N - 1);
    const hw = HOLD / 2 / (N - 1);
    input.push(Math.max(0, c - hw), Math.min(1, c + hw));
    output.push(i, i);
  });
  return { input, output };
}
const STOPS = positionStops();

export function HeroCarousel() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const t = useTransform(scrollYProgress, STOPS.input, STOPS.output);
  const [active, setActive] = useState(0);
  useMotionValueEvent(t, "change", (v) => {
    const i = Math.round(v);
    if (i !== active) setActive(i);
  });

  // Heading colour follows the drink in view.
  const ink = useTransform(t, DRINKS.map((_, i) => i), DRINKS.map((d) => d.ink));

  // Pointer parallax for the fruit (mouse only).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const k = Math.max(0, Math.min(N - 1, i));
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToTarget(top + (k / (N - 1)) * (el.offsetHeight - window.innerHeight), 0);
  };

  const drink = DRINKS[active];

  return (
    <section
      ref={ref}
      aria-label="Featured drinks"
      className="relative"
      style={{ height: `${100 + 62 * (N - 1)}svh` }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <div key={reduce ? "still" : "motion"} className="sticky top-0 h-[100svh] overflow-hidden">
        {DRINKS.map((d, i) => (
          <BackdropLayer key={d.id} d={d} i={i} t={t} />
        ))}

        {/* The drink's name, white and set behind the glass like the posters */}
        <div className="pointer-events-none absolute inset-x-0 top-[31%] select-none md:top-[9%] md:left-[8vw]" aria-hidden>
          {DRINKS.map((d, i) => (
            <BigWord key={d.id} d={d} i={i} t={t} reduce={reduce} />
          ))}
        </div>

        {/* Carousel track: the drink in focus sits centre, neighbours wait at the sides */}
        <div className="absolute inset-0 flex items-end justify-center pb-[20svh] md:items-center md:pt-16 md:pb-0 md:pl-[16vw]">
          <div className="relative h-[min(52svh,108vw)] w-[min(52svh,108vw)] md:h-[min(70svh,660px)] md:w-[min(70svh,660px)]">
            {DRINKS.map((d, i) => (
              <DrinkSlide key={d.id} d={d} i={i} t={t} sx={sx} sy={sy} reduce={reduce} onPick={() => goTo(i)} />
            ))}
            {!reduce && (
              <AnimatePresence>
                <Splash key={drink.id} color={drink.juice} className="top-[30%] left-1/2" />
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Headline: stays put, takes the colour of the drink in view */}
        <motion.div
          style={{ color: ink }}
          className="container-x absolute inset-x-0 top-24 z-[var(--z-content)] md:top-auto md:bottom-12 lg:bottom-14"
        >
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="display text-[clamp(2.6rem,6vw,5.25rem)]"
          >
            Squeeze
            <br className="hidden md:block" /> the day.
          </motion.h1>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 max-w-[30ch] md:mt-4"
          >
            <p className="text-[0.95rem] opacity-80 md:text-base">Juices, shakes, smoothies and detox, made fresh at four branches across Lahore.</p>
            <div className="mt-5 hidden gap-2.5 md:flex">
              <Link href="/menu" className="btn btn-ink">
                Order now <ArrowRightIcon className="size-4" aria-hidden />
              </Link>
              <Link href="/locations" className="btn border border-current/25 bg-white/35 backdrop-blur hover:bg-white/60">
                Find a branch
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Small product label, bottom right, follows the drink in view */}
        <div className="absolute right-4 bottom-5 z-[var(--z-content)] md:right-[clamp(1rem,3vw,3rem)] md:bottom-12 lg:bottom-14">
          <DrinkLabel drink={drink} />
        </div>

        {/* Prev / next and position */}
        <div className="absolute bottom-[5.25rem] left-1/2 z-[var(--z-content)] flex -translate-x-1/2 items-center gap-1.5 md:bottom-auto md:left-auto md:right-[clamp(1rem,3vw,3rem)] md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:flex-col">
          <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} className="icon-btn size-10 bg-white/45 backdrop-blur disabled:opacity-35" aria-label="Previous drink">
            <CaretLeftIcon className="size-4 md:rotate-90" aria-hidden />
          </button>
          <ol className="flex gap-1.5 md:flex-col" aria-label="Drinks">
            {DRINKS.map((d, i) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show ${d.word}`}
                  aria-current={active === i ? "true" : undefined}
                  className="grid size-6 place-items-center"
                >
                  <span className={cn("block rounded-full bg-ink/35 transition-all duration-300", active === i ? "h-2 w-5 bg-ink md:h-5 md:w-2" : "size-2")} />
                </button>
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => goTo(active + 1)} disabled={active === N - 1} className="icon-btn size-10 bg-white/45 backdrop-blur disabled:opacity-35" aria-label="Next drink">
            <CaretRightIcon className="size-4 md:rotate-90" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

function BackdropLayer({ d, i, t }: { d: Drink; i: number; t: MotionValue<number> }) {
  const opacity = useTransform(t, (v) => Math.max(0, 1 - Math.abs(v - i)));
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <StudioBackdrop b={d.bg} />
    </motion.div>
  );
}

function BigWord({ d, i, t, reduce }: { d: Drink; i: number; t: MotionValue<number>; reduce: boolean }) {
  const opacity = useTransform(t, (v) => Math.max(0, 1 - Math.abs(v - i) * 1.8));
  const x = useTransform(t, (v) => `${(i - v) * 18}vw`);
  return (
    <motion.p
      style={{ opacity, x: reduce ? 0 : x }}
      className="absolute inset-x-0 text-center font-display text-[clamp(4rem,12.5vw,11.5rem)] leading-none font-extrabold tracking-[-0.055em] text-white/85 [text-shadow:0_20px_60px_rgb(0_0_0/0.08)]"
    >
      {d.word}
    </motion.p>
  );
}

function DrinkSlide({
  d,
  i,
  t,
  sx,
  sy,
  reduce,
  onPick,
}: {
  d: Drink;
  i: number;
  t: MotionValue<number>;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  reduce: boolean;
  onPick: () => void;
}) {
  // Distance from the centre slot drives position, size and fade.
  const dist = useTransform(t, (v) => i - v);
  const x = useTransform(dist, (v) => `calc(${v} * max(34vw, min(80vw, 30rem)))`);
  const y = useTransform(dist, (v) => `${Math.min(Math.abs(v), 1.5) * 9}%`);
  const scale = useTransform(dist, (v) => (d.scale ?? 1) * (1 - Math.min(Math.abs(v), 1.5) * 0.42));
  const rotate = useTransform(dist, (v) => v * 6);
  const opacity = useTransform(dist, (v) => (v < 0 ? Math.max(0, 1 + v * 1.35) : Math.max(0, 1 - Math.max(0, v - 0.6) * 0.75)));
  const zIndex = useTransform(dist, (v) => 10 - Math.round(Math.abs(v) * 2));
  const brightness = useTransform(dist, (v) => 1 - Math.min(Math.abs(v), 1) * 0.08);
  const filter = useMotionTemplate`brightness(${brightness})`;
  const still = useTransform(dist, (v) => (Math.abs(v) < 0.5 ? 1 : 0));

  return (
    <motion.div
      className="absolute inset-0"
      style={reduce ? { opacity: still, zIndex } : { x, y, scale, rotate, opacity, zIndex, filter }}
    >
      <motion.div
        className="absolute inset-0"
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
      >
        <button type="button" onClick={onPick} tabIndex={-1} aria-hidden className="absolute inset-0 cursor-pointer" />
        {d.image ? (
          <Image
            src={d.image}
            alt={d.alt}
            {...dims(d.image)}
            priority={i < 2}
            fetchPriority={i === 0 ? "high" : undefined}
            sizes="(min-width: 768px) 46vw, 90vw"
            className="pointer-events-none absolute inset-0 size-full object-contain drop-shadow-[0_36px_34px_rgb(0_0_0/0.22)]"
          />
        ) : (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <MightyStack className="h-full drop-shadow-[0_36px_34px_rgb(0_0_0/0.22)]" sizes="(min-width: 768px) 36vw, 80vw" />
          </div>
        )}
      </motion.div>
      {d.pieces.map((p, k) => (
        <FloatPiece key={k} p={p} dist={dist} sx={sx} sy={sy} reduce={reduce} />
      ))}
    </motion.div>
  );
}

function FloatPiece({ p, dist, sx, sy, reduce }: { p: Piece; dist: MotionValue<number>; sx: MotionValue<number>; sy: MotionValue<number>; reduce: boolean }) {
  // Fruit only shows around the drink in focus and drifts against the scroll.
  const opacity = useTransform(dist, (v) => Math.max(0, 1 - Math.abs(v) * 2.2));
  const x = useTransform([sx, dist], ([a, v]: number[]) => a * 36 * p.depth + v * 120 * p.depth);
  const y = useTransform(sy, (a) => a * 28 * p.depth);
  const rotate = useTransform(dist, (v) => p.rot + v * 40 * p.depth);
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, opacity, x: reduce ? 0 : x, y: reduce ? 0 : y, rotate: reduce ? p.rot : rotate }}
    >
      <Image src={p.src} alt="" {...dims(p.src)} sizes="12vw" className="h-auto w-full drop-shadow-[0_20px_20px_rgb(0_0_0/0.2)]" />
    </motion.div>
  );
}

function DrinkLabel({ drink }: { drink: Drink }) {
  const { add, qtyOf, ready } = useStore();
  const item = drink.itemId ? getItem(drink.itemId) : null;
  const inCart = item && ready ? qtyOf(item.id) : 0;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={drink.id}
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 rounded-full bg-white/75 py-1.5 pr-1.5 pl-4 text-ink shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] backdrop-blur-md"
      >
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-medium">{item?.name ?? `${drink.word} juice`}</p>
          <p className="text-xs text-ink-soft tabular-nums">{item ? priceLabel(item) : "Seasonal, in store"}</p>
        </div>
        {item ? (
          <button
            type="button"
            onClick={() => add(item.id)}
            className="relative grid size-9 shrink-0 place-items-center rounded-full bg-ink text-surface transition-colors hover:bg-green-deep"
            aria-label={`Add ${item.name} to cart`}
          >
            <PlusIcon className="size-4" aria-hidden />
            {inCart > 0 && (
              <span className="absolute -top-1 -right-1 grid min-w-4 place-items-center rounded-full bg-green px-1 text-[0.65rem] leading-4 font-semibold text-surface">{inCart}</span>
            )}
          </button>
        ) : (
          <Link href="/locations" className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-surface" aria-label="Find a branch for seasonal juices">
            <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
