import { cn } from "@/lib/utils";

/**
 * A studio backdrop modelled on HnG's own product posters: a colour sweep, a soft
 * spotlight behind the glass, light rays, a floor the cup stands on and drifting
 * bokeh. Pure CSS, so it is crisp at any size and costs no image bytes.
 */
export type Backdrop = {
  top: string;
  bottom: string;
  glow: string;
  floor: string;
  rays?: boolean;
  bokeh: string;
};

const BOKEH = [
  { x: 12, y: 18, s: 120, d: 0 },
  { x: 82, y: 12, s: 180, d: -4 },
  { x: 70, y: 62, s: 90, d: -8 },
  { x: 22, y: 70, s: 150, d: -2 },
  { x: 48, y: 8, s: 70, d: -6 },
  { x: 92, y: 44, s: 60, d: -10 },
];

export function StudioBackdrop({ b, className }: { b: Backdrop; className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${b.top} 0%, ${b.bottom} 100%)` }} />
      {b.rays && (
        <div
          className="absolute inset-0 opacity-50 mix-blend-soft-light"
          style={{
            background: `repeating-conic-gradient(from 180deg at 50% -10%, rgb(255 255 255 / 0.55) 0deg 4deg, transparent 4deg 13deg)`,
            maskImage: "radial-gradient(80% 70% at 50% 0%, black, transparent 75%)",
          }}
        />
      )}
      <div className="absolute inset-0" style={{ background: `radial-gradient(42% 46% at 50% 44%, ${b.glow} 0%, transparent 72%)` }} />
      {/* Floor: the surface the cup stands on, with a soft horizon line */}
      <div
        className="absolute inset-x-0 bottom-0 h-[30%]"
        style={{ background: `radial-gradient(70% 90% at 50% 100%, ${b.floor} 0%, color-mix(in oklab, ${b.floor} 70%, transparent) 45%, transparent 75%)` }}
      />
      {BOKEH.map((o, i) => (
        <span
          key={i}
          className="bokeh absolute rounded-full"
          style={{
            left: `${o.x}%`,
            top: `${o.y}%`,
            width: o.s,
            height: o.s,
            animationDelay: `${o.d}s`,
            background: `radial-gradient(circle at 35% 35%, ${b.bokeh}, transparent 70%)`,
          }}
        />
      ))}
      {/* Fine condensation speckle, like the dewy glass shots */}
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgb(255 255 255 / 0.9) 0 1px, transparent 1.6px), radial-gradient(circle at 70% 80%, rgb(255 255 255 / 0.8) 0 1.2px, transparent 2px)",
          backgroundSize: "38px 41px, 57px 53px",
        }}
      />
    </div>
  );
}
