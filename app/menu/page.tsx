import type { Metadata } from "next";
import { MenuBoard } from "@/components/menu/MenuBoard";
import { PageHero } from "@/components/layout/PageHero";
import { ITEM_COUNT, MENU, formatPrice } from "@/lib/menu";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Menu",
  description: "Juices, detox blends, shakes, protein shakes, smoothies and healthy eats from Health n Goodness, Lahore.",
};

const cheapestDrink = Math.min(...MENU.filter((c) => c.id !== "add-ons").flatMap((c) => c.items.map((i) => i.price)));

export default function MenuPage() {
  return (
    <>
      <PageHero
        title="The menu"
        intro={
          <p>
            Juices, detox blends, shakes and healthy plates, made to order. Prices are from HnG on{" "}
            <a href={SITE.foodpanda} target="_blank" rel="noreferrer" className="font-medium link-underline">
              Foodpanda
            </a>
            , Model Town. Prices marked &ldquo;from&rdquo; are for the regular size.
          </p>
        }
        stats={[
          { value: String(ITEM_COUNT), label: "On the menu" },
          { value: String(MENU.length), label: "Categories" },
          { value: formatPrice(cheapestDrink), label: "Drinks from" },
          { value: "4", label: "Branches" },
        ]}
        cups={[
          { src: "/img/hero/falsa.webp", alt: "", h: 92, x: 0, rot: -6 },
          { src: "/img/hero/mango3.webp", alt: "", h: 100, x: 22, z: 3 },
          { src: "/img/hero/lychee.webp", alt: "", h: 90, x: 60, rot: 5 },
        ]}
      />
      <MenuBoard />
    </>
  );
}
