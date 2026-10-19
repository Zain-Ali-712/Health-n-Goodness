import Image from "next/image";
import { dims } from "@/lib/img";
import { ScrollMarquee } from "@/components/motion/ScrollMarquee";
import { DotGrid } from "@/components/brand/Decor";

// Seasonal juices HnG has posted on Instagram in 2026. Not on the Foodpanda menu, so no prices here.
const SEASON = [
  { src: "/img/posters/white-pomegranate.webp", name: "White Pomegranate", tint: "#efe3dc" },
  { src: "/img/posters/cherry.webp", name: "Cherry", tint: "#f9d3d3" },
  { src: "/img/posters/mango.webp", name: "Mango", tint: "#cfe8f6" },
  { src: "/img/posters/falsa.webp", name: "Falsa", tint: "#c4efeb" },
  { src: "/img/posters/peach.webp", name: "Peach", tint: "#f6d6cb" },
  { src: "/img/posters/watermelon.webp", name: "Watermelon", tint: "#fbd0cf" },
  { src: "/img/posters/lychee.webp", name: "Lychee", tint: "#f8cfc4" },
  { src: "/img/posters/mosambi.webp", name: "Mosambi", tint: "#ecefc9" },
];

export function SeasonalStrip() {
  return (
    <section aria-labelledby="season-title" className="relative isolate overflow-hidden bg-[linear-gradient(180deg,var(--ground),#e9f0e2_55%,var(--ground))] py-24 md:py-28">
      <DotGrid className="-z-10" />
      <div className="container-x max-w-3xl text-center">
        <h2 id="season-title" className="display text-[clamp(2.2rem,4.6vw,3.75rem)]">
          Whatever the season is pouring
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-ink-soft">
          Falsa in the heat, anaar in the autumn, musami all winter. Seasonal juices change through the year, so ask your branch what is fresh today.
        </p>
      </div>
      <ScrollMarquee label="Seasonal juice posters from Instagram" className="mt-12">
        {SEASON.map((s) => (
          <figure key={s.name} className="w-[min(72vw,330px)] shrink-0 px-2">
            <div className="rounded-[1.5rem] p-2" style={{ backgroundColor: s.tint }}>
              <Image src={s.src} alt={`${s.name} juice, HnG poster`} {...dims(s.src)} sizes="330px" loading="lazy" draggable={false} className="aspect-[4/5] h-auto w-full rounded-[1.1rem] object-cover select-none" />
            </div>
            <figcaption className="mt-3 px-1 text-sm font-medium">{s.name}</figcaption>
          </figure>
        ))}
      </ScrollMarquee>
    </section>
  );
}
