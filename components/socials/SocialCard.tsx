import Image from "next/image";
import { HeartIcon, InstagramLogoIcon, PlayIcon } from "@phosphor-icons/react/dist/ssr";
import type { SocialPost } from "@/lib/socials-data";
import { cn } from "@/lib/utils";

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Karachi" });

/** One Instagram post: cover image, caption over a soft scrim, links to the post. */
export function SocialCard({ post, className, sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" }: { post: SocialPost; className?: string; sizes?: string }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noreferrer"
      className={cn("group relative block overflow-hidden rounded-[1.75rem] bg-muted", className)}
      aria-label={`${post.type === "reel" ? "Reel" : "Post"} on Instagram: ${post.caption || "Health n Goodness"}`}
    >
      <Image
        src={post.image}
        alt=""
        width={post.w}
        height={post.h}
        sizes={sizes}
        loading="lazy"
        className="h-auto w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent p-4 pt-16 text-surface">
        <p className="line-clamp-3 text-sm leading-snug">{post.caption}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-surface/80">
          <InstagramLogoIcon className="size-4" aria-hidden />
          <time dateTime={post.date}>{fmt.format(new Date(post.date))}</time>
          {post.likes > 0 && (
            <span className="inline-flex items-center gap-1">
              <HeartIcon className="size-3.5" aria-hidden /> {post.likes}
            </span>
          )}
        </div>
      </div>
      {post.type === "reel" && (
        <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-surface/85 text-ink backdrop-blur" aria-hidden>
          <PlayIcon className="size-4" weight="fill" />
        </span>
      )}
    </a>
  );
}
