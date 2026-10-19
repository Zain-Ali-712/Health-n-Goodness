"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { ListIcon, ShoppingBagIcon, UserIcon } from "@phosphor-icons/react";
import { Logo } from "@/components/brand/Logo";
import { SideNav } from "@/components/layout/SideNav";
import { useStore } from "@/lib/store";
import { NAV } from "./nav";
import { cn } from "@/lib/utils";

export function Header() {
  const { count, setCartOpen, setAuthOpen, setNavOpen, user, ready } = useStore();
  const pathname = usePathname();
  const { scrollY } = useScroll();
  // The bar is clear over the hero and frosts once the page moves.
  const alpha = useTransform(scrollY, [0, 120], [0, 0.82]);
  const line = useTransform(scrollY, [0, 120], [0, 0.1]);
  const background = useMotionTemplate`rgb(251 252 248 / ${alpha})`;
  const borderColor = useMotionTemplate`rgb(17 41 28 / ${line})`;

  return (
    <>
      <motion.header
        style={{ background, borderColor }}
        className="fixed inset-x-0 top-0 z-[var(--z-header)] border-b backdrop-blur-md"
      >
        <div className="container-x relative flex h-[4.5rem] items-center gap-2">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            className="btn -ml-3 min-h-11 gap-2 px-3 hover:bg-ink/5 lg:hidden"
            aria-label="Open navigation"
          >
            <ListIcon className="size-5" aria-hidden />
            <span className="hidden sm:inline">Menu</span>
          </button>

          <Link href="/" className="rounded-full lg:mr-6" aria-label="Health n Goodness, home">
            <Logo compact={false} className="[&>span:nth-of-type(1)]:max-[400px]:hidden" />
          </Link>

          <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <ul className="flex items-center gap-1">
              {NAV.slice(1).map((n) => {
                const active = pathname === n.href;
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-full px-3.5 py-2 text-[0.92rem] transition-colors hover:bg-ink/5",
                        active ? "text-ink" : "text-ink-soft",
                      )}
                    >
                      <span className={cn(active && "border-b border-green pb-0.5")}>{n.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              className="icon-btn"
              onClick={() => setAuthOpen("signin")}
              aria-label={user ? `Account: ${user.name}` : "Sign in"}
            >
              {user ? (
                <span className="grid size-8 place-items-center rounded-full bg-green text-sm font-semibold text-surface" aria-hidden>
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <UserIcon className="size-[1.35rem]" aria-hidden />
              )}
            </button>
            <button
              type="button"
              className="icon-btn relative"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
            >
              <ShoppingBagIcon className="size-[1.35rem]" aria-hidden />
              {ready && count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="absolute top-1 right-0.5 grid min-w-5 place-items-center rounded-full bg-green px-1 text-[0.7rem] leading-5 font-semibold text-surface tabular-nums"
                  aria-hidden
                >
                  {count}
                </motion.span>
              )}
            </button>
            <Link href="/menu" className="btn btn-primary ml-2 hidden sm:inline-flex">
              Order now
            </Link>
          </div>
        </div>
      </motion.header>
      <SideNav />
    </>
  );
}
