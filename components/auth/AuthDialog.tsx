"use client";

import { useState } from "react";
import { Field } from "@/components/forms/Field";
import { SignOutIcon } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useStore, type User } from "@/lib/store";
import { PHONE_FIELD } from "@/lib/forms";
import { cn } from "@/lib/utils";

/**
 * Dummy auth. Accounts live in localStorage only; passwords are kept as a SHA-256
 * digest so the demo never stores plain text. Nothing leaves the browser.
 */
const ACCOUNTS_KEY = "hng-accounts";
type Account = User & { hash: string };

async function digest(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function accounts(): Account[] {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function AuthDialog() {
  const { authOpen, setAuthOpen, user, signIn, signOut } = useStore();
  const mode = authOpen || "signin";
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email")).trim().toLowerCase();
    const password = String(fd.get("password"));
    setBusy(true);
    setMessage(null);
    const hash = await digest(`${email}:${password}`);
    const list = accounts();
    const existing = list.find((a) => a.email === email);
    if (mode === "signup") {
      if (existing) {
        setMessage("That email already has an account. Sign in instead.");
      } else {
        const account: Account = { name: String(fd.get("name")).trim(), email, phone: String(fd.get("phone") || ""), hash };
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...list, account]));
        signIn({ name: account.name, email, phone: account.phone });
        setAuthOpen(false);
      }
    } else if (!existing || existing.hash !== hash) {
      setMessage("Email or password doesn’t match. Try again or create an account.");
    } else {
      signIn({ name: existing.name, email, phone: existing.phone });
      setAuthOpen(false);
    }
    setBusy(false);
  }

  return (
    <Dialog
      open={!!authOpen}
      onOpenChange={(o) => {
        setAuthOpen(o ? mode : false);
        setMessage(null);
      }}
    >
      <DialogContent className="max-h-[92dvh] gap-0 overflow-y-auto rounded-[1.75rem] border-0 bg-surface p-0 ring-0 sm:max-w-md" data-lenis-prevent>
        <div className="px-6 pt-7 pb-2">
          <DialogTitle className="font-display text-[2.1rem] leading-none font-medium tracking-[-0.035em]">
            {user ? "Your account" : mode === "signup" ? "Create an account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription className="mt-2 text-muted-ink">
            {user ? "Signed in on this device." : "Save your details for faster checkout."}
          </DialogDescription>
        </div>

        {user ? (
          <div className="grid gap-4 p-6">
            <div className="flex items-center gap-3 rounded-[1.25rem] bg-ground p-4">
              <span className="grid size-12 place-items-center rounded-full bg-green text-lg font-semibold text-surface" aria-hidden>
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="font-medium">{user.name}</p>
                <p className="truncate text-sm text-muted-ink">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                signOut();
                setAuthOpen(false);
              }}
            >
              <SignOutIcon className="size-5" aria-hidden /> Sign out
            </button>
          </div>
        ) : (
          <div className="p-6 pt-4">
            <div role="tablist" aria-label="Account" className="mb-5 grid grid-cols-2 rounded-full bg-ground p-1">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  role="tab"
                  type="button"
                  aria-selected={mode === m}
                  onClick={() => {
                    setAuthOpen(m);
                    setMessage(null);
                  }}
                  className={cn(
                    "min-h-10 rounded-full text-sm font-medium transition-colors",
                    mode === m ? "bg-surface text-ink shadow-soft" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {m === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>
            <form key={mode} onSubmit={onSubmit} className="grid gap-4">
              {mode === "signup" && <Field name="name" label="Full name" autoComplete="name" required minLength={2} error="Please enter your name." />}
              <Field name="email" type="email" label="Email" autoComplete="email" required error="Enter a valid email, like you@example.com." />
              {mode === "signup" && <Field name="phone" label="Mobile number" required {...PHONE_FIELD} />}
              <Field
                name="password"
                type="password"
                label="Password"
                hint={mode === "signup" ? "At least 6 characters" : undefined}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
                minLength={6}
                error="Password needs at least 6 characters."
              />
              {message && (
                <p role="alert" className="rounded-[14px] bg-[#fdf1ef] px-3 py-2 text-sm text-destructive">
                  {message}
                </p>
              )}
              <button type="submit" className="btn btn-primary mt-1 w-full" disabled={busy}>
                {mode === "signup" ? "Create account" : "Sign in"}
              </button>
              <p className="text-center text-xs text-muted-ink">Demo account, stored only in this browser.</p>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
