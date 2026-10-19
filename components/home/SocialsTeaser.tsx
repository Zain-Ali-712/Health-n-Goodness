import Link from "next/link";
import { SocialCard } from "@/components/socials/SocialCard";
import { Reveal } from "@/components/motion/Reveal";
import { POSTS } from "@/lib/socials-data";
import { SITE } from "@/lib/site";
import { CitrusWheel, DriftFruit } from "@/components/brand/Decor";

const PICKS = ["DSw-GOljTcE", "DdMNGvqnFWY", "DXbflhzjbSm", "DQMz1a5DJtI"];

export function SocialsTeaser() {
  const posts = PICKS.map((id) => POSTS.find((p) => p.id === id)!).filter(Boolean);
  return (
    <section aria-labelledby="social-title" className="relative isolate overflow-hidden bg-[radial-gradient(60%_50%_at_85%_10%,#f9d9cf,transparent_70%),radial-gradient(50%_45%_at_5%_90%,#d6ecd0,transparent_70%)] py-24 md:py-32">
      <CitrusWheel className="top-10 -left-24 -z-10 w-72 opacity-25" rind="#ef6a4b" flesh="#ffd2c2" />
      <DriftFruit src="/img/pieces/pom-open.webp" className="top-16 right-[6%] hidden w-40 md:block" />
      <DriftFruit src="/img/pieces/lime-half-2.webp" className="bottom-10 left-[4%] hidden w-24 md:block" speed={120} />
      <div className="container-x">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="social-title" className="display text-[clamp(2.4rem,5vw,4.25rem)]">
            Fresh on the feed
          </h2>
          <p className="mt-3 text-ink-soft">New pours, staff reels and the occasional meme from {SITE.instagramHandle}.</p>
        </div>
        <Link href="/socials" className="btn btn-ghost">
          All socials
        </Link>
      </div>
      <ul className="mt-12 grid grid-cols-2 items-start gap-3 md:grid-cols-4 md:gap-4">
        {posts.map((p, i) => (
          <Reveal as="li" key={p.id} delay={i * 0.06} className={i % 2 ? "md:mt-16" : ""}>
            <SocialCard post={p} sizes="(min-width: 768px) 22vw, 45vw" />
          </Reveal>
        ))}
      </ul>
      </div>
    </section>
  );
}
