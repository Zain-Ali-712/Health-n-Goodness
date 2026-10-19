"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ArrowUpRightIcon, PhoneIcon, StarIcon } from "@phosphor-icons/react";
import { OpenBadge } from "./OpenBadge";
import { BRANCHES, hoursSummary, PREFERRED_BRANCH_KEY } from "@/lib/branches";
import { telHref } from "@/lib/site";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const BranchMap = dynamic(() => import("./BranchMap"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-muted" aria-hidden />,
});

export function LocationsView() {
  const [active, setActive] = useState(0);
  const { setCartOpen } = useStore();

  return (
    <div className="container-x grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <ol className="grid gap-3">
        {BRANCHES.map((b, i) => (
          <li key={b.id}>
            <article
              className={cn(
                "rounded-[1.75rem] p-6 transition-colors",
                active === i ? "bg-surface shadow-soft" : "bg-surface/50 hover:bg-surface",
              )}
            >
              <button type="button" onClick={() => setActive(i)} className="w-full text-left" aria-pressed={active === i}>
                <span className="flex flex-wrap items-center gap-3">
                  <span className="grid size-7 place-items-center rounded-full bg-ink text-xs font-semibold text-surface" aria-hidden>
                    {i + 1}
                  </span>
                  <span className="font-display text-[1.9rem] leading-none font-medium tracking-[-0.035em]">{b.name}</span>
                  <OpenBadge branch={b} />
                </span>
                <span className="mt-2 block text-sm text-muted-ink">{b.address}</span>
              </button>

              <dl className="mt-4 grid gap-1 text-sm">
                {hoursSummary(b).map((h) => (
                  <div key={h.days} className="flex gap-3">
                    <dt className="w-24 shrink-0 text-muted-ink">{h.days}</dt>
                    <dd className="tabular-nums">{h.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-ink">
                <StarIcon weight="fill" className="size-3.5 text-green" aria-hidden />
                {b.rating} on Google from {b.reviews} reviews
                {b.note && <span>. {b.note}</span>}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <a href={telHref(b.phone)} className="btn btn-ghost min-h-11 px-4 text-sm tabular-nums">
                  <PhoneIcon className="size-4" aria-hidden /> {b.phone}
                </a>
                <a href={b.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-ghost min-h-11 px-4 text-sm">
                  Directions <ArrowUpRightIcon className="size-4" aria-hidden />
                </a>
                <button
                  type="button"
                  className="btn btn-primary min-h-11 px-4 text-sm"
                  onClick={() => {
                    try {
                      sessionStorage.setItem(PREFERRED_BRANCH_KEY, b.id);
                    } catch {}
                    setCartOpen(true);
                  }}
                >
                  Order from here
                </button>
              </div>
            </article>
          </li>
        ))}
      </ol>

      <div className="h-[60vh] overflow-hidden rounded-[2rem] lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)]">
        <BranchMap branches={BRANCHES} active={active} onSelect={setActive} />
      </div>
    </div>
  );
}
