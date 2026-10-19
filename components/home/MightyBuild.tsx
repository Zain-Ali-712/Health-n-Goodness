"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRightIcon, PlusIcon } from "@phosphor-icons/react";
import { MIGHTY_BOX, MIGHTY_ORDER, layerSize, layerStyle, type MightyLayer } from "@/components/brand/MightyStack";
import { StudioBackdrop } from "@/components/brand/StudioBackdrop";
import { Splash } from "@/components/motion/Splash";
import { AddButton } from "@/components/cart/AddButton";
import { MENU, mustGetItem, priceLabel } from "@/lib/menu";
import { useStore } from "@/lib/store";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { dims } from "@/lib/img";
import { cn } from "@/lib/utils";

const mighty = mustGetItem("mighty-charger-detox");
const detox = MENU.find((c) => c.id === "detox")!;
const detoxFrom = Math.min(...detox.items.map((i) => i.price));

type Part = Exclude<MightyLayer, "cup">;
// Where each fruit flies in from (vw, vh, deg).
const FROM: Record<Part, [number, number, number]> = {
  carrot: [-6, -55, -38],
  orange: [24, -30, 48],
  lemon: [4, -70, -28],
  apple: [-4, 55, 22],
  pineapple: [26, 30, -24],
};

// Callouts in the style of HnG's own posters: white hand-drawn arrows, short claims.
// Benefits are from the brand's Mighty Charger caption (IG DS7Qrq6k4U_). Coordinates are % of the stage.
const NOTES: { part: Part; text: string; side: "l" | "r"; y: number; path: string; head: [number, number, number] }[] = [
  { part: "carrot", text: "Beta-carotene for skin and eyes", side: "l", y: 4, path: "M -3 10 Q 3 2 9 11", head: [9, 11, 40] },
  { part: "lemon", text: "Helps flush out toxins", side: "l", y: 40, path: "M -3 45 Q 1 39 6 46", head: [6, 46, 50] },
  { part: "apple", text: "Fibre from apple and carrot", side: "l", y: 76, path: "M -3 82 Q 3 91 9 85", head: [9, 85, -30] },
  { part: "orange", text: "Vitamin C for immunity", side: "r", y: 12, path: "M 103 17 Q 98 9 92 19", head: [92, 19, 140] },
  { part: "pineapple", text: "Bromelain for better digestion", side: "r", y: 56, path: "M 103 61 Q 99 67 95 58", head: [95, 58, 210] },
];
const BENEFITS = ["Natural energy", "Immunity support", "Better digestion", "Hydration", "Skin and eye health", "Detox"];

const LINEUP = [
  { id: "the-red-retreat-detox", src: "/img/detox/redretreat.webp", alt: "Red Retreat Detox with beetroot, orange, ginger, carrot, celery and apple", side: -1 },
  { id: "the-green-clean-detox", src: "/img/detox/greenclean.webp", alt: "Green Clean Detox with cucumber and ginger", side: 1 },
] as const;

type Phase = "intro" | "mighty" | "line";

export function MightyBuild() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress: q } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [phase, setPhase] = useState<Phase>("intro");
  const [splashed, setSplashed] = useState(false);
  useMotionValueEvent(q, "change", (v) => {
    const next: Phase = v < 0.34 ? "intro" : v < 0.66 ? "mighty" : "line";
    if (next !== phase) setPhase(next);
    const s = v > 0.3 && v < 0.66;
    if (s !== splashed) setSplashed(s);
  });

  const cupY = useTransform(q, [0.18, 0.32], ["45%", "0%"]);
  const cupO = useTransform(q, [0.18, 0.28], [0, 1]);
  const notesO = useTransform(q, [0.36, 0.42, 0.6, 0.66], [0, 1, 1, 0]);
  const draw = useTransform(q, [0.36, 0.48], [0, 1]);
  // Lineup: the Mighty Charger steps back and its siblings arrive from the sides.
  const stageScale = useTransform(q, [0.64, 0.76], [1, 0.74]);
  const stageY = useTransform(q, [0.64, 0.76], ["0%", "-6%"]);

  const panel = reduce ? "mighty" : phase;

  return (
    <section ref={ref} aria-labelledby="mighty-title" className="relative" style={{ height: reduce ? "auto" : "420svh" }}>
      <div key={reduce ? "still" : "motion"} className={cn("top-0 h-[100svh] min-h-[44rem] overflow-hidden", reduce ? "relative" : "sticky")}>
        <StudioBackdrop b={{ top: "#ffc3ae", bottom: "#ef6a4b", glow: "rgb(255 236 226 / 0.85)", floor: "#ffd2c2", bokeh: "rgb(255 240 232 / 0.7)" }} />

        <div className="container-x relative grid h-full grid-rows-[1fr_auto] gap-4 pt-24 pb-6 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:pt-20 lg:pb-10">
          {/* Stage */}
          <div className="relative row-start-1 grid place-items-center lg:col-span-8 lg:col-start-5">
            <motion.div
              className="relative h-[min(52svh,560px)] max-w-[70vw] lg:h-[min(66svh,620px)]"
              style={{ aspectRatio: `${MIGHTY_BOX.w}/${MIGHTY_BOX.h}`, ...(reduce ? {} : { scale: stageScale, y: stageY }) }}
            >
              {MIGHTY_ORDER.map((id) =>
                id === "cup" ? (
                  <motion.div key={id} className="absolute" style={{ ...layerStyle(id), ...(reduce ? {} : { y: cupY, opacity: cupO }), zIndex: 1 }}>
                    <Image src="/img/mighty/cup.webp" alt="Mighty Charger Detox in an HnG cup" {...layerSize(id)} sizes="(min-width: 768px) 260px, 40vw" className="size-full object-contain drop-shadow-[0_30px_30px_rgb(120_40_20/0.3)]" />
                  </motion.div>
                ) : (
                  <Fruit key={id} id={id} q={q} reduce={reduce} />
                ),
              )}

              {/* Poster-style callouts (tablet and up) */}
              <motion.div className="pointer-events-none absolute inset-0 z-[3] hidden md:block" style={{ opacity: reduce ? 1 : notesO }} aria-hidden={!reduce}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
                  {NOTES.map((n) => (
                    <g key={n.part} fill="none" stroke="#4a1508" strokeWidth={2.2} strokeLinecap="round" vectorEffect="non-scaling-stroke">
                      <motion.path d={n.path} vectorEffect="non-scaling-stroke" style={{ pathLength: reduce ? 1 : draw }} />
                      <motion.path
                        d={`M ${n.head[0]} ${n.head[1]} l ${Math.cos(((n.head[2] + 150) * Math.PI) / 180) * 2.6} ${Math.sin(((n.head[2] + 150) * Math.PI) / 180) * 2.6} M ${n.head[0]} ${n.head[1]} l ${Math.cos(((n.head[2] - 150) * Math.PI) / 180) * 2.6} ${Math.sin(((n.head[2] - 150) * Math.PI) / 180) * 2.6}`}
                        vectorEffect="non-scaling-stroke"
                        style={{ opacity: reduce ? 1 : draw }}
                      />
                    </g>
                  ))}
                </svg>
                {NOTES.map((n) => (
                  <p
                    key={n.part}
                    className={cn(
                      "absolute w-[9.5rem] font-display text-[1.05rem] leading-tight font-semibold text-[#4a1508]",
                      n.side === "l" ? "right-[104%] text-right" : "left-[104%]",
                    )}
                    style={{ top: `${n.y}%` }}
                  >
                    {n.text}
                  </p>
                ))}
              </motion.div>

              {!reduce && <AnimatePresence>{splashed && <Splash key="s" color="#f26b4f" className="top-[28%] left-[52%]" />}</AnimatePresence>}
            </motion.div>

            {/* The rest of the detox line slides in beside it */}
            {LINEUP.map((l) => (
              <LineupCup key={l.id} cup={l} q={q} reduce={reduce} />
            ))}
          </div>

          {/* Side panel: changes with the story */}
          <div className="relative z-10 row-start-2 lg:col-span-4 lg:col-start-1 lg:row-start-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={panel}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="text-[#4a1508]"
              >
                {panel === "intro" && (
                  <>
                    <h2 id="mighty-title" className="display text-[clamp(2.4rem,5.2vw,4.5rem)]">
                      Five fruits.
                      <br />
                      One <span className="italic">Mighty</span> glass.
                    </h2>
                    <p className="mt-4 max-w-[34ch] text-[#4a1508]/80">Apple, orange, lemon, pineapple and carrot, pressed together into one bright detox.</p>
                  </>
                )}
                {panel === "mighty" && (
                  <div className="rounded-[1.75rem] bg-white/70 p-6 shadow-[0_20px_50px_-24px_rgb(120_30_10/0.45)] backdrop-blur-md md:p-7">
                    <p className="text-sm text-[#4a1508]/70">Refresh. Recharge. Nourish.</p>
                    <h3 className={cn("display mt-1 text-[clamp(2rem,3.6vw,3rem)] text-ink", reduce && "sr-only")} id={reduce ? "mighty-title" : undefined}>
                      {mighty.name}
                    </h3>
                    <p className="mt-2 text-ink-soft">{mighty.description}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="What it does, in HnG's words">
                      {BENEFITS.map((b) => (
                        <li key={b} className="rounded-full bg-[#fde3d8] px-3 py-1 text-xs text-ink">
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <span className="font-display text-2xl font-medium text-ink tabular-nums">{priceLabel(mighty)}</span>
                      <AddButton id={mighty.id} name={mighty.name} label="Add to order" />
                    </div>
                  </div>
                )}
                {panel === "line" && (
                  <>
                    <h3 className="display text-[clamp(2.2rem,4.6vw,4rem)]">The detox line</h3>
                    <p className="mt-4 max-w-[36ch] text-[#4a1508]/80">
                      {detox.items.length} cold blends, each with a job to do, from {priceLabel({ price: detoxFrom, from: true }).replace("from ", "")}. Hearty Heart, Bright Sight, Gut Care and more.
                    </p>
                    <Link href="/menu#cat-detox" className="btn btn-ink mt-6">
                      See every detox <ArrowRightIcon className="size-4" aria-hidden />
                    </Link>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Fruit({ id, q, reduce }: { id: Part; q: MotionValue<number>; reduce: boolean }) {
  const [fx, fy, fr] = FROM[id];
  const x = useTransform(q, [0.02, 0.3], [`${fx}vw`, "0vw"]);
  const y = useTransform(q, [0.02, 0.3], [`${fy}vh`, "0vh"]);
  const rotate = useTransform(q, [0.02, 0.3], [fr, 0]);
  return (
    <motion.div className="absolute" style={{ ...layerStyle(id), ...(reduce ? {} : { x, y, rotate }), zIndex: id === "carrot" || id === "orange" ? 0 : 2 }}>
      <Image src={`/img/mighty/${id}.webp`} alt="" {...layerSize(id)} sizes="(min-width: 768px) 260px, 30vw" className="size-full object-contain drop-shadow-[0_20px_20px_rgb(120_40_20/0.25)]" />
    </motion.div>
  );
}

function LineupCup({ cup, q, reduce }: { cup: (typeof LINEUP)[number]; q: MotionValue<number>; reduce: boolean }) {
  const item = mustGetItem(cup.id);
  const { add } = useStore();
  const x = useTransform(q, [0.66, 0.8], [`${cup.side * 90}%`, `${cup.side * 27}%`]);
  const opacity = useTransform(q, [0.66, 0.74], [0, 1]);
  const rotate = useTransform(q, [0.66, 0.8], [cup.side * 14, cup.side * 3]);
  if (reduce) return null;
  return (
    <motion.div className="absolute inset-0 z-[2] hidden place-items-center md:grid" style={{ x, opacity }}>
      <motion.figure className="flex h-[min(50svh,500px)] flex-col items-center" style={{ rotate }}>
        <Image src={cup.src} alt={cup.alt} {...dims(cup.src)} sizes="(min-width: 768px) 22vw, 30vw" className="h-[85%] w-auto object-contain drop-shadow-[0_26px_26px_rgb(120_40_20/0.3)]" />
        <figcaption className="mt-3 flex items-center gap-2 rounded-full bg-white/75 py-1 pr-1 pl-3 text-ink backdrop-blur">
          <span className="text-xs leading-tight">
            <span className="block font-medium">{item.name.replace(" Detox", "")}</span>
            <span className="text-ink-soft tabular-nums">{priceLabel(item)}</span>
          </span>
          <button type="button" onClick={() => add(item.id)} className="grid size-7 place-items-center rounded-full bg-ink text-surface" aria-label={`Add ${item.name} to cart`}>
            <PlusIcon className="size-3.5" aria-hidden />
          </button>
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}
