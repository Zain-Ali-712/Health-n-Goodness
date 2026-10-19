import type { Metadata } from "next";
import { LocationsView } from "@/components/locations/LocationsView";
import { PageHero } from "@/components/layout/PageHero";
import { BRANCHES } from "@/lib/branches";

export const metadata: Metadata = {
  title: "Locations",
  description: "Health n Goodness branches in Model Town, Gulberg, DHA Phase 1 and DHA Phase 2, Lahore. Hours, phone numbers and directions.",
};

const best = Math.max(...BRANCHES.map((b) => b.rating));

export default function LocationsPage() {
  return (
    <>
      <PageHero
        title="Find a bar"
        intro={<p>Four branches across Lahore, open late every night. Hours are from each branch&apos;s Google listing, so call ahead on holidays.</p>}
        stats={[
          { value: String(BRANCHES.length), label: "Branches" },
          { value: "9 AM", label: "Earliest open" },
          { value: "4 AM", label: "Latest close" },
          { value: `${best}`, label: "Top Google rating" },
        ]}
        backdrop={{ top: "#d4eef9", bottom: "#7cbfe2", glow: "rgb(255 255 255 / 0.9)", floor: "#eef7fc", rays: true, bokeh: "rgb(255 255 255 / 0.8)" }}
        ink="#0d3a57"
        cups={[
          { src: "/img/detox/greenclean.webp", alt: "", h: 92, x: 2, rot: -5 },
          { src: "/img/hero/musami-limes.webp", alt: "", h: 84, x: 36, z: 3 },
        ]}
      />
      <div className="pt-12">
        <LocationsView />
      </div>
    </>
  );
}
