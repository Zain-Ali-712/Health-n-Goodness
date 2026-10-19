import { MENU } from "./menu-data";
import type { MenuItem } from "./menu-types";

export { MENU };
export type { MenuItem, MenuCategory } from "./menu-types";

const BY_ID = new Map<string, MenuItem & { category: string }>(
  MENU.flatMap((c) => c.items.map((i) => [i.id, { ...i, category: c.title }] as const)),
);

export const getItem = (id: string) => BY_ID.get(id);

export function mustGetItem(id: string) {
  const item = BY_ID.get(id);
  if (!item) throw new Error(`Unknown menu item: ${id}`);
  return item;
}

const pkr = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });
export const formatPrice = (n: number) => `Rs ${pkr.format(n)}`;
export const priceLabel = (i: Pick<MenuItem, "price" | "from">) => `${i.from ? "from " : ""}${formatPrice(i.price)}`;

export const POPULAR = MENU.flatMap((c) => c.items.filter((i) => i.popular));
export const ITEM_COUNT = BY_ID.size;
