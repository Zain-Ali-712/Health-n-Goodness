import Image from "next/image";
import { MIGHTY } from "@/lib/image-sizes";
import { cn } from "@/lib/utils";

/**
 * The official Mighty Charger poster (IG DbD5MOitqk0) rebuilt from its cut-out layers.
 * Boxes are in poster pixels; this crops the frame to the drink + fruit.
 */
export const MIGHTY_BOX = { x: 124, y: 299, w: 1226, h: 1326 };
export const MIGHTY_ORDER = ["carrot", "orange", "cup", "lemon", "apple", "pineapple"] as const;
export type MightyLayer = (typeof MIGHTY_ORDER)[number];

export function layerStyle(id: MightyLayer): React.CSSProperties {
  const [x0, y0, x1, y1] = MIGHTY.layers[id];
  return {
    left: `${((x0 - MIGHTY_BOX.x) / MIGHTY_BOX.w) * 100}%`,
    top: `${((y0 - MIGHTY_BOX.y) / MIGHTY_BOX.h) * 100}%`,
    width: `${((x1 - x0) / MIGHTY_BOX.w) * 100}%`,
    height: `${((y1 - y0) / MIGHTY_BOX.h) * 100}%`,
  };
}

export function layerSize(id: MightyLayer) {
  const [x0, y0, x1, y1] = MIGHTY.layers[id];
  return { width: x1 - x0, height: y1 - y0 };
}

export function MightyStack({ className, sizes = "40vw", priority = false }: { className?: string; sizes?: string; priority?: boolean }) {
  return (
    <div className={cn("relative", className)} style={{ aspectRatio: `${MIGHTY_BOX.w}/${MIGHTY_BOX.h}` }}>
      {MIGHTY_ORDER.map((id) => (
        <Image
          key={id}
          src={`/img/mighty/${id}.webp`}
          alt={id === "cup" ? "Mighty Charger Detox in an HnG cup with orange, apple, carrot, lemon and pineapple" : ""}
          {...layerSize(id)}
          sizes={sizes}
          priority={priority}
          className="absolute max-w-none object-contain"
          style={layerStyle(id)}
        />
      ))}
    </div>
  );
}
