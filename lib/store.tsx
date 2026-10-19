"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getItem } from "./menu";

export type CartItem = NonNullable<ReturnType<typeof getItem>>;

/** A cart line is one menu item at its regular size. */
export type Line = { id: string; qty: number };
export type User = { name: string; email: string; phone?: string };
type AuthMode = false | "signin" | "signup";

type Store = {
  lines: (Line & { item: CartItem })[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  qtyOf: (id: string) => number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  authOpen: AuthMode;
  setAuthOpen: (v: AuthMode) => void;
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
  lastAdded: { name: string; at: number } | null;
};

const StoreContext = createContext<Store | null>(null);

const CART_KEY = "hng-cart"; // sessionStorage: the cart lives for the tab session
const USER_KEY = "hng-user"; // localStorage: the demo account survives reloads
const MAX_QTY = 20;

function read<T>(storage: () => Storage, key: string, fallback: T): T {
  try {
    const raw = storage().getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(storage: () => Storage, key: string, value: unknown) {
  try {
    if (value === null) storage().removeItem(key);
    else storage().setItem(key, JSON.stringify(value));
  } catch {}
}

const session = () => window.sessionStorage;
const local = () => window.localStorage;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<Line[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState<AuthMode>(false);
  const [ready, setReady] = useState(false);
  const [lastAdded, setLastAdded] = useState<Store["lastAdded"]>(null);

  useEffect(() => {
    // Browser storage only exists after hydration; read it once on mount and drop stale items.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
    setRaw(read<Line[]>(session, CART_KEY, []).filter((l) => getItem(l.id) && l.qty > 0).map((l) => ({ ...l, qty: Math.min(MAX_QTY, l.qty) })));
    setUser(read<User | null>(local, USER_KEY, null));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) write(session, CART_KEY, raw);
  }, [raw, ready]);

  const add = useCallback(
    (id: string, qty = 1) => {
      // Already at the cap: nothing changes, so don't confirm an add that didn't happen.
      if ((raw.find((l) => l.id === id)?.qty ?? 0) >= MAX_QTY) return;
      setRaw((prev) => {
        const hit = prev.find((l) => l.id === id);
        if (hit) return prev.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
        return [...prev, { id, qty: Math.min(MAX_QTY, Math.max(1, qty)) }];
      });
      const item = getItem(id);
      if (item) setLastAdded({ name: item.name, at: Date.now() });
    },
    [raw],
  );

  const setQty = useCallback((id: string, qty: number) => {
    setRaw((prev) => (qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))));
  }, []);

  const clear = useCallback(() => setRaw([]), []);

  const signIn = useCallback((u: User) => {
    setUser(u);
    write(local, USER_KEY, u);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    write(local, USER_KEY, null);
  }, []);

  const value = useMemo<Store>(() => {
    const lines = raw.flatMap((l) => {
      const item = getItem(l.id);
      return item ? [{ ...l, item }] : [];
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.item.price, 0),
      ready,
      add,
      setQty,
      clear,
      qtyOf: (id: string) => lines.find((l) => l.id === id)?.qty ?? 0,
      cartOpen,
      setCartOpen,
      navOpen,
      setNavOpen,
      authOpen,
      setAuthOpen,
      user,
      signIn,
      signOut,
      lastAdded,
    };
  }, [raw, ready, add, setQty, clear, cartOpen, navOpen, authOpen, user, signIn, signOut, lastAdded]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
