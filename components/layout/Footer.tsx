import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { BRANCHES } from "@/lib/branches";
import { SITE, telHref } from "@/lib/site";
import { NAV } from "./nav";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-surface/80">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:py-20">
        <div className="max-w-sm">
          <div className="inline-flex rounded-full bg-surface px-4 py-2.5">
            <Logo />
          </div>
          <p className="mt-6 font-display text-3xl leading-tight font-medium tracking-[-0.03em] text-surface">{SITE.tagline}</p>
          <p className="mt-3 text-sm">{SITE.intro} Four branches across Lahore.</p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-surface">Branches</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {BRANCHES.map((b) => (
              <li key={b.id}>
                <span className="text-surface">{b.name}</span>
                <span className="text-surface/60">, {b.area}</span>
                <br />
                <a href={telHref(b.phone)} className="link-underline tabular-nums">
                  {b.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid content-start gap-8 sm:grid-cols-2 md:grid-cols-1">
          <div>
            <h2 className="text-sm font-medium text-surface">Explore</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-underline">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-medium text-surface">Get in touch</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={telHref(SITE.uan)} className="link-underline">
                  {SITE.uanLabel}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="link-underline break-all">
                  {SITE.email}
                </a>
              </li>
              <li className="flex gap-4 pt-1">
                <a href={SITE.instagram} target="_blank" rel="noreferrer" className="link-underline">
                  Instagram
                </a>
                <a href={SITE.facebook} target="_blank" rel="noreferrer" className="link-underline">
                  Facebook
                </a>
                <a href={SITE.foodpanda} target="_blank" rel="noreferrer" className="link-underline">
                  Foodpanda
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-surface/10 py-6 text-xs text-surface/55 sm:flex-row sm:justify-between">
        <p>Menu and prices from Health n Goodness on Foodpanda, Model Town. Prices may change in store.</p>
        <p>Design concept for Health n Goodness, Lahore.</p>
      </div>
    </footer>
  );
}
