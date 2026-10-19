"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ArrowUpRightIcon, InstagramLogoIcon, FacebookLogoIcon } from "@phosphor-icons/react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/brand/Logo";
import { useStore } from "@/lib/store";
import { SITE, telHref } from "@/lib/site";
import { NAV } from "./nav";

/** Side panel navigation (mobile and tablet), opened from the "Menu" side button. */
export function SideNav() {
  const { navOpen, setNavOpen } = useStore();
  const pathname = usePathname();

  return (
    <Sheet open={navOpen} onOpenChange={setNavOpen}>
      <SheetContent side="left" className="w-full max-w-none gap-0 border-r-0 bg-surface p-0 sm:max-w-md" data-lenis-prevent>
        <div className="flex h-[4.5rem] items-center px-6">
          <Logo />
        </div>
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">Pages on the Health n Goodness site</SheetDescription>
        <nav aria-label="Site" className="flex-1 overflow-y-auto px-6 pt-6">
          <ul className="space-y-1">
            {NAV.map((n, i) => (
              <motion.li
                key={n.href}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 + i * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={n.href}
                  onClick={() => setNavOpen(false)}
                  aria-current={pathname === n.href ? "page" : undefined}
                  className="group flex items-baseline justify-between py-2 font-display text-[2.6rem] leading-[1.05] font-medium tracking-[-0.04em] text-ink aria-[current=page]:text-green"
                >
                  {n.label}
                  <ArrowUpRightIcon className="size-6 -translate-x-2 text-green opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
        <div className="space-y-4 border-t border-line px-6 py-6 text-sm text-ink-soft">
          <p>
            Order line{" "}
            <a href={telHref(SITE.uan)} className="font-medium text-ink link-underline">
              {SITE.uanLabel}
            </a>
          </p>
          <div className="flex gap-2">
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="icon-btn border border-line" aria-label="Instagram">
              <InstagramLogoIcon className="size-5" aria-hidden />
            </a>
            <a href={SITE.facebook} target="_blank" rel="noreferrer" className="icon-btn border border-line" aria-label="Facebook">
              <FacebookLogoIcon className="size-5" aria-hidden />
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
