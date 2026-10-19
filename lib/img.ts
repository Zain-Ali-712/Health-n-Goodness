import { IMG } from "./image-sizes";

/** Intrinsic width/height of an exported image, for next/image. */
export function dims(src: string) {
  const s = IMG[src];
  if (!s) throw new Error(`No size recorded for ${src}. Re-run research/scripts/build_assets.py`);
  return { width: s[0], height: s[1] };
}
