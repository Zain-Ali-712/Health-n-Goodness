import Image from "next/image";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/motion/Reveal";
import { CitrusWheel } from "@/components/brand/Decor";
import { SITE, telHref, waHref } from "@/lib/site";
import { dims } from "@/lib/img";

// Four offers from HnG's Instagram (6 Pack, litre bottles, Live Juice Bar, fruit baskets).
const OFFERS = [
  {
    src: "/img/posters/six-pack.webp",
    alt: "The 6 Pack gift box with six juice bottles and a greeting card",
    title: "The 6 Pack",
    text: "Six bottles, three flavours and a greeting card, wrapped to give.",
    meta: "From Rs 1,300",
    tint: "#efd9bd",
    href: telHref(SITE.uan),
    cta: "Order a pack",
  },
  {
    src: "/img/posters/liter.webp",
    alt: "One-litre bottle of fresh HnG juice",
    title: "A litre of goodness",
    text: "Your favourite juice, bottled fresh. Any three bottles save Rs 200.",
    meta: "Made fresh daily",
    tint: "#e4e9cf",
    href: "/menu#cat-juices",
    cta: "Pick a flavour",
  },
  {
    src: "/img/posters/juice-bar.webp",
    alt: "Illustrated HnG Live Juice Bar stall for events",
    title: "Live Juice Bar",
    text: "An HnG bar at your wedding, office or rooftop, pouring on the spot.",
    meta: "Book on WhatsApp",
    tint: "#cfe8f6",
    href: waHref(SITE.bookings[0]),
    cta: "Book the bar",
  },
  {
    src: "/img/posters/basket.webp",
    alt: "HnG fruit basket with fresh fruit and juice bottles",
    title: "Fruit baskets",
    text: "Regular or Premium, 5 kg or 7 kg, for Eid and corporate gifting.",
    meta: "From Model Town",
    tint: "#ebe3cf",
    href: telHref(SITE.uan),
    cta: "Call to order",
  },
];

export function GiftingBento() {
  return (
    <section aria-labelledby="gift-title" className="relative isolate overflow-hidden bg-[#e3eedc] py-24 md:py-28">
      <CitrusWheel className="-bottom-40 -left-32 -z-10 w-[30rem] opacity-30" rind="#0a5232" flesh="#c9dfc2" />
      <CitrusWheel className="-top-20 right-[8%] -z-10 hidden w-56 opacity-25 md:block" rind="#f5a623" flesh="#fde7b8" spin={-140} />
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="gift-title" className="display max-w-[15ch] text-[clamp(2.2rem,4.4vw,3.75rem)]">
            For the fridge, the party and the people you love
          </h2>
          <p className="max-w-[34ch] text-ink-soft">Bottles, gift packs, event bars and fruit baskets, straight from the HnG kitchen.</p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OFFERS.map((o, i) => (
            <Reveal as="li" key={o.title} delay={i * 0.06}>
              <a
                href={o.href}
                target={o.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex h-full flex-col rounded-[1.75rem] bg-surface p-2.5 shadow-[0_1px_0_rgb(17_41_28/0.05)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="overflow-hidden rounded-[1.3rem]" style={{ backgroundColor: o.tint }}>
                  <Image src={o.src} alt={o.alt} {...dims(o.src)} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw" loading="lazy" className="aspect-[5/4] h-auto w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]" />
                </div>
                <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2">
                  <p className="text-xs text-green">{o.meta}</p>
                  <h3 className="mt-1 font-display text-xl font-medium tracking-[-0.02em]">{o.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-soft">{o.text}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium">
                    {o.cta}
                    <ArrowUpRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
