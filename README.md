# Health n Goodness: website pitch

Frontend concept for **Health n Goodness (HnG)**, a juice bar with four branches in Lahore. Built with Next.js 16 (App Router, Cache Components), Tailwind CSS 4, shadcn/ui (Radix), Motion, Lenis and Leaflet.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Pages
| Route | What's there |
|---|---|
| `/` | Pinned hero (Musami, Pomegranate, Mighty Charger), with backdrops taken from each official poster, depth-layered fruit, procedural juice splashes, a giant name behind each glass and a side rail. Then "Five fruits. One Mighty glass." (the ingredients fly in and assemble into the drink), most ordered, the seasonal poster strip, gifting bento, branches and a socials teaser |
| `/menu` | 57 items in 7 categories. Each category has a scrolling list on the left and a sticky photo on the right that swaps on hover, focus or scroll. Scroll-spy category bar |
| `/socials` | 24 official Instagram posts and reels in staggered columns (after fixchocolatier.com/socials) |
| `/about` | Storefront, team and bar photos, the brand's own promises, numbers |
| `/locations` | Leaflet map plus 4 branch cards: live open status (Asia/Karachi), weekly hours, call, directions, order from here |
| `/contact` | Order line, Live Juice Bar bookings, email, demo contact form |
| `/checkout` | Delivery or pickup, branch picker, validated details, demo order confirmation |

Cart: add and change quantity, kept in `sessionStorage`. Sign in and sign up: modal, demo accounts in `localStorage` (passwords stored as SHA-256 digests). All motion respects `prefers-reduced-motion`.

## Data & assets (official only)
- Menu and prices: HnG on Foodpanda, Model Town (`research/raw/foodpanda-menu.json`, scraped from the rendered page).
- Branches: latest Instagram captions plus each branch's Google Maps listing (`lib/branches.ts`).
- Photos: posts by @healthngoodnesshngg and the brand's Foodpanda uploads. Product cut-outs (`public/img/hero`, `pieces`, `mighty`) were cut from official posters with rembg. No AI-generated imagery.
- Splashes and droplets are drawn in code (`components/motion/Splash.tsx`).

Regenerate assets and data: `python -I research/scripts/build_assets.py` (needs Pillow). Research notes are in `research/research.md`; open questions are in `research/gaps.md`.
