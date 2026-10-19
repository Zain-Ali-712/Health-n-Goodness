import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { AddButton } from "@/components/cart/AddButton";
import { Reveal } from "@/components/motion/Reveal";
import { CitrusWheel, DotGrid } from "@/components/brand/Decor";
import { MENU, POPULAR, priceLabel } from "@/lib/menu";
import { cn } from "@/lib/utils";

const tintOf = (id: string) => MENU.find((c) => c.items.some((i) => i.id === id))?.tint ?? "#e7ece2";

/** The six items Foodpanda marks as most ordered at Model Town: one feature card, then smaller ones. */
export function MostOrdered() {
  return (
    <section aria-labelledby="popular-title" className="relative isolate overflow-hidden py-24 md:py-28">
      <DotGrid />
      <CitrusWheel className="-top-24 -right-28 -z-10 w-[26rem] opacity-[0.22]" spin={120} />
      <div className="container-x max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="popular-title" className="display text-[clamp(2.2rem,4.4vw,3.75rem)]">
              Lahore&apos;s favourites
            </h2>
            <p className="mt-3 max-w-[40ch] text-ink-soft">The six drinks and plates ordered most from our Model Town bar on Foodpanda.</p>
          </div>
          <Link href="/menu" className="btn btn-ghost">
            Full menu <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {POPULAR.map((p, i) => (
            <Reveal
              as="li"
              key={p.id}
              delay={(i % 3) * 0.06}
              className={cn(
                "group flex overflow-hidden rounded-[1.5rem] bg-surface p-2 ring-1 ring-line/70 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-soft",
                i === 0 ? "flex-col gap-3 sm:col-span-2 sm:flex-row lg:col-span-3 lg:row-span-2" : i < 3 ? "items-center gap-3 lg:col-span-3" : "flex-col lg:col-span-2",
              )}
            >
              <div
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-[1.1rem]",
                  i === 0 ? "aspect-square w-full sm:aspect-auto sm:w-1/2 sm:self-stretch" : i < 3 ? "size-28" : "aspect-[16/10] w-full",
                )}
                style={{ backgroundColor: tintOf(p.id) }}
              >
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes={i === 0 ? "(min-width: 1024px) 34vw, 90vw" : i < 3 ? "112px" : "(min-width: 1024px) 22vw, 45vw"}
                    className="object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                )}
              </div>
              <div className={cn("flex min-w-0 flex-1 gap-3", i === 0 ? "flex-col justify-center p-3 sm:p-5" : "items-center", i >= 3 ? "px-2 pt-3 pb-1" : i > 0 && "pr-2")}>
                <div className="min-w-0 flex-1">
                  {i === 0 && <p className="mb-2 inline-block rounded-full bg-green-soft px-2.5 py-1 text-xs font-medium text-green-deep">Most ordered</p>}
                  <h3 className={cn("font-display font-medium tracking-[-0.02em]", i === 0 ? "text-[1.9rem] leading-tight" : "truncate text-lg")}>{p.name}</h3>
                  {p.description && <p className={cn("text-muted-ink", i === 0 ? "mt-2 line-clamp-3 text-sm" : "line-clamp-1 text-xs")}>{p.description}</p>}
                  <p className="mt-1 text-sm font-medium tabular-nums">{priceLabel(p)}</p>
                </div>
                <AddButton id={p.id} name={p.name} compact />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
