import { HeroCarousel } from "@/components/home/HeroCarousel";
import { MightyBuild } from "@/components/home/MightyBuild";
import { MostOrdered } from "@/components/home/MostOrdered";
import { SeasonalStrip } from "@/components/home/SeasonalStrip";
import { GiftingBento } from "@/components/home/GiftingBento";
import { BranchesTeaser } from "@/components/home/BranchesTeaser";
import { SocialsTeaser } from "@/components/home/SocialsTeaser";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <MightyBuild />
      <MostOrdered />
      <SeasonalStrip />
      <GiftingBento />
      <BranchesTeaser />
      <SocialsTeaser />
    </>
  );
}
