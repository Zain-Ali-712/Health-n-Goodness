"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Branch } from "@/lib/branches";

/** Lahore map with numbered HnG pins. Flies to the active branch; pins are clickable. */
export default function BranchMap({ branches, active, onSelect }: { branches: Branch[]; active: number; onSelect: (i: number) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const onSelectRef = useRef(onSelect);
  const activeRef = useRef(active);

  useEffect(() => {
    onSelectRef.current = onSelect;
    activeRef.current = active;
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current || map.current) return;
      const m = L.map(el.current, { zoomControl: false, scrollWheelZoom: false });
      L.control.zoom({ position: "topright" }).addTo(m);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(m);
      markers.current = branches.map((b, i) =>
        L.marker([b.lat, b.lng], {
          icon: L.divIcon({ className: "", html: `<div class="hng-pin"><span>${i + 1}</span></div>`, iconSize: [30, 30], iconAnchor: [15, 30] }),
          title: `Health n Goodness ${b.name}`,
          alt: `Health n Goodness ${b.name}`,
          keyboard: false,
        })
          .on("click", () => onSelectRef.current(i))
          .addTo(m),
      );
      m.fitBounds(L.latLngBounds(branches.map((b) => [b.lat, b.lng])), { padding: [60, 60] });
      markers.current[activeRef.current]?.getElement()?.querySelector(".hng-pin")?.classList.add("is-active");
      map.current = m;
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, [branches]);

  useEffect(() => {
    markers.current.forEach((mk, i) => mk.getElement()?.querySelector(".hng-pin")?.classList.toggle("is-active", i === active));
    const m = map.current;
    if (!m) return;
    const b = branches[active];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    m.flyTo([b.lat, b.lng], 14, { duration: reduce ? 0 : 1.2 });
  }, [active, branches]);

  return <div ref={el} className="hng-map size-full" role="region" aria-label="Map of Health n Goodness branches in Lahore" />;
}
