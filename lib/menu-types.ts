export type MenuItem = {
  id: string;
  /** Display name. Casing and obvious typos tidied from Foodpanda. */
  name: string;
  /** Name exactly as listed on Foodpanda. */
  fpName: string;
  /** Regular price in PKR (Foodpanda, before any app-only deal). */
  price: number;
  /** Foodpanda shows "from": larger sizes exist. */
  from: boolean;
  description: string | null;
  image: string | null;
  popular: boolean;
};

export type MenuCategory = {
  id: string;
  title: string;
  note?: string | null;
  /** Soft backdrop sampled from the matching official product posters. */
  tint: string;
  items: MenuItem[];
};
