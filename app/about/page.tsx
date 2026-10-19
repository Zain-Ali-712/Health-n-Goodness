import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { BRANCHES } from "@/lib/branches";
import { ITEM_COUNT } from "@/lib/menu";
import { SITE } from "@/lib/site";
import { dims } from "@/lib/img";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "About",
  description: "Health n Goodness is a Lahore juice bar: fresh juices, shakes, smoothies and detox, made from real fruit at four branches.",
};

// Promises printed on HnG's own bottle and juice posters (IG DVq1MXmDEXW, DTfATG0DfUH).
const PROMISES = [
  { title: "Real fruits only", text: "Juices start as whole fruit at the bar and are freshly squeezed for your glass." },
  { title: "Made fresh daily", text: "The litre bottles are made fresh every day from real fruit, ready to share." },
  { title: "No preservatives", text: "Nothing is added to make a bottle last longer, so it tastes like the fruit it came from." },
  { title: "Clean from prep to pour", text: "Everything is kept clean, always, from cutting the fruit to the final pour." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Real fruit. Pressed fresh."
        intro={
          <p>
            {SITE.name} is a juice bar from Lahore. {SITE.bio} Fresh juices, shakes, smoothies and detox at {BRANCHES.length} branches, with delivery and takeaway from each.
          </p>
        }
        stats={[
          { value: String(BRANCHES.length), label: "Branches" },
          { value: String(ITEM_COUNT), label: "On the menu" },
          { value: "4 AM", label: "Latest close" },
          { value: "2015", label: "On Facebook since" },
        ]}
        backdrop={{ top: "#f3e6de", bottom: "#d7bfb2", glow: "rgb(255 250 246 / 0.95)", floor: "#f6ede7", bokeh: "rgb(255 255 255 / 0.7)" }}
        ink="#3f261d"
        cups={[
          { src: "/img/hero/pomegranate.webp", alt: "", h: 82, x: 0 },
          { src: "/img/hero/jamun.webp", alt: "", h: 100, x: 50, z: 3, rot: 4 },
        ]}
      />

      <section aria-label="The team at the bar" className="container-x mt-14 grid gap-4 md:grid-cols-12">
        <Reveal className="overflow-hidden rounded-[2rem] md:col-span-7">
          <Image src="/img/posters/storefront.webp" alt="The Health n Goodness storefront with its green HnG sign" {...dims("/img/posters/storefront.webp")} sizes="(min-width: 768px) 58vw, 100vw" priority className="h-[min(78vh,720px)] w-full object-cover object-top" />
        </Reveal>
        <div className="grid gap-4 md:col-span-5">
          <Reveal delay={0.08} className="overflow-hidden rounded-[2rem]">
            <Image src="/img/posters/team.webp" alt="Three HnG team members in uniform outside a branch" {...dims("/img/posters/team.webp")} sizes="(min-width: 768px) 40vw, 100vw" className="h-[min(38vh,350px)] w-full object-cover object-[50%_30%]" />
          </Reveal>
          <Reveal delay={0.14} className="overflow-hidden rounded-[2rem]">
            <Image src="/img/posters/bar.webp" alt="HnG staff pouring juices behind the bar under the menu boards" {...dims("/img/posters/bar.webp")} sizes="(min-width: 768px) 40vw, 100vw" className="h-[min(38vh,350px)] w-full object-cover object-[50%_60%]" />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="promise-title" className="container-x py-24 md:py-32">
        <h2 id="promise-title" className="display max-w-[18ch] text-[clamp(2.4rem,5vw,4.25rem)]">
          What we put on the label, and what we leave off
        </h2>
        <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {PROMISES.map((p, i) => (
            <Reveal as="li" key={p.title} delay={(i % 2) * 0.06} className="border-t border-ink pt-6">
              <h3 className="font-display text-2xl font-medium tracking-[-0.03em]">{p.title}</h3>
              <p className="mt-2 max-w-[40ch] text-ink-soft">{p.text}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      <section aria-labelledby="numbers-title" className="bg-ink py-20 text-surface md:py-28">
        <div className="container-x">
          <h2 id="numbers-title" className="sr-only">
            In numbers
          </h2>
          <dl className="grid gap-10 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-surface/65">Branches in Lahore</dt>
              <dd className="mt-2 font-display text-7xl font-medium tracking-[-0.05em]">{BRANCHES.length}</dd>
            </div>
            <div>
              <dt className="text-sm text-surface/65">Drinks and plates on the menu</dt>
              <dd className="mt-2 font-display text-7xl font-medium tracking-[-0.05em]">{ITEM_COUNT}</dd>
            </div>
            <div>
              <dt className="text-sm text-surface/65">Latest closing time, Gulberg</dt>
              <dd className="mt-2 font-display text-7xl font-medium tracking-[-0.05em]">4 AM</dd>
            </div>
          </dl>
          <p className="mt-14 max-w-[52ch] text-surface/75">
            Behind every glass is hard work and heart. Come and say hello at any branch, or order from the bar on{" "}
            <Link href="/menu" className="text-surface link-underline">
              the menu
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
