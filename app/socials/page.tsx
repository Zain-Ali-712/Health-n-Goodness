import type { Metadata } from "next";
import { FacebookLogoIcon, InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { SocialCard } from "@/components/socials/SocialCard";
import { Reveal } from "@/components/motion/Reveal";
import { POSTS } from "@/lib/socials-data";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Socials",
  description: "Posts and reels from Health n Goodness on Instagram: seasonal juices, behind the bar and new pours.",
};

/** Three staggered columns, like a feed laid out on a table. */
export default function SocialsPage() {
  const cols = [0, 1, 2].map((c) => POSTS.filter((_, i) => i % 3 === c));
  return (
    <>
      <PageHero
        title="Socials"
        intro={<p>New pours, seasonal fruit and life behind the bar. Follow along for what is fresh this week.</p>}
        backdrop={{ top: "#ffc3ae", bottom: "#ef6a4b", glow: "rgb(255 236 226 / 0.9)", floor: "#ffd2c2", bokeh: "rgb(255 240 232 / 0.7)" }}
        ink="#4a1508"
        cups={[
          { src: "/img/hero/lychee.webp", alt: "", h: 92, x: 0, rot: -4 },
          { src: "/img/hero/falsa.webp", alt: "", h: 96, x: 48, z: 3, rot: 4 },
        ]}
      >
        <div className="mt-7 flex gap-3">
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="btn btn-ink">
            <InstagramLogoIcon className="size-5" aria-hidden /> {SITE.instagramHandle}
          </a>
          <a href={SITE.facebook} target="_blank" rel="noreferrer" className="icon-btn size-12 bg-white/55 backdrop-blur" aria-label="Health n Goodness on Facebook">
            <FacebookLogoIcon className="size-5" aria-hidden />
          </a>
        </div>
      </PageHero>

      <section aria-label="Latest Instagram posts" className="container-x pt-14">
        {/* One column on phones, three staggered columns from tablet up */}
        <ul className="grid gap-4 sm:hidden">
          {POSTS.map((p) => (
            <li key={p.id}>
              <SocialCard post={p} sizes="92vw" />
            </li>
          ))}
        </ul>
        <div className="hidden gap-4 sm:grid sm:grid-cols-3 lg:gap-6">
          {cols.map((col, c) => (
            <ul key={c} className={c === 1 ? "space-y-4 pt-24 lg:space-y-6" : c === 2 ? "space-y-4 pt-10 lg:space-y-6" : "space-y-4 lg:space-y-6"}>
              {col.map((p, i) => (
                <Reveal as="li" key={p.id} delay={(i % 2) * 0.05}>
                  <SocialCard post={p} sizes="(min-width: 1024px) 30vw, 32vw" />
                </Reveal>
              ))}
            </ul>
          ))}
        </div>
      </section>
    </>
  );
}
