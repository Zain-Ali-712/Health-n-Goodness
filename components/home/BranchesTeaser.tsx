"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRightIcon, ArrowUpRightIcon, PhoneIcon } from "@phosphor-icons/react";
import { OpenBadge } from "@/components/locations/OpenBadge";
import { DotGrid } from "@/components/brand/Decor";
import { BRANCHES, hoursSummary } from "@/lib/branches";
import { telHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const BranchMap = dynamic(() => import("@/components/locations/BranchMap"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-muted" aria-hidden />,
});

/** Map on one side, branches on the other: hover, focus or tap a branch to fly the map there. */
export function BranchesTeaser() {
  const [active, setActive] = useState(0);
  return (
    <section aria-labelledby="branches-title" className="relative isolate overflow-hidden bg-surface py-24 md:py-32">
      <DotGrid className="-z-10" />
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="branches-title" className="display text-[clamp(2.4rem,5vw,4.25rem)]">
            Four bars across Lahore
          </h2>
          <Link href="/locations" className="btn btn-ghost">
            All hours and directions <ArrowRightIcon className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <div className="relative h-[22rem] overflow-hidden rounded-[2rem] shadow-soft lg:col-span-7 lg:h-[34rem]">
            <BranchMap branches={BRANCHES} active={active} onSelect={setActive} />
          </div>

          <ul className="grid content-start gap-2 lg:col-span-5">
            {BRANCHES.map((b, i) => {
              const on = active === i;
              return (
                <li key={b.id} onMouseEnter={() => setActive(i)}>
                  <div className={cn("rounded-[1.5rem] transition-colors duration-300", on ? "bg-ink text-surface" : "bg-ground hover:bg-green-soft/60")}>
                    <button type="button" onClick={() => setActive(i)} onFocus={() => setActive(i)} aria-expanded={on} className="flex w-full items-center gap-4 p-5 text-left">
                      <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold", on ? "bg-green text-surface" : "bg-surface text-ink")}>{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[1.6rem] leading-none font-medium tracking-[-0.03em]">{b.name}</span>
                        <span className={cn("mt-1 block text-sm", on ? "text-surface/70" : "text-muted-ink")}>{b.area}</span>
                      </span>
                      <OpenBadge branch={b} className={on ? "bg-surface/15 text-surface" : undefined} />
                      <ArrowRightIcon className={cn("size-5 shrink-0 transition-transform duration-300", on ? "rotate-90 text-green-soft" : "-rotate-45")} aria-hidden />
                    </button>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pl-[4.75rem] text-sm">
                            <p className="text-surface/75">{b.address}</p>
                            <ul className="mt-2 space-y-0.5 text-surface/90">
                              {hoursSummary(b).map((h) => (
                                <li key={h.days} className="tabular-nums">
                                  <span className="text-surface/60">{h.days}:</span> {h.time}
                                </li>
                              ))}
                            </ul>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <a href={telHref(b.phone)} className="btn min-h-10 bg-surface px-4 text-sm text-ink hover:bg-green-soft">
                                <PhoneIcon className="size-4" aria-hidden /> {b.phone}
                              </a>
                              <a href={b.mapsUrl} target="_blank" rel="noreferrer" className="btn min-h-10 border border-surface/30 px-4 text-sm text-surface hover:bg-surface/10">
                                Directions <ArrowUpRightIcon className="size-4" aria-hidden />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
