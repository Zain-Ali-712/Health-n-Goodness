# Health n Goodness: Research (scraped 2026-10-18)

Every fact on the site traces back to one of these official sources. Raw scrapes are in `raw/`, images in `img/`.

| Key | Source | Method | Result |
|---|---|---|---|
| FP | foodpanda.pk/restaurant/fjnu/healthngoodness-model-town | Rendered DOM in the built-in browser (the API is PerimeterX-blocked) | 57 items, 9 categories, prices, descriptions, 57 product photos, logo, rating 5.0 (821) |
| IG | instagram.com/healthngoodnesshngg | Apify `instagram-profile-scraper` + `instagram-scraper` (150 posts, 147 own) | Bio, 4 branches with phones, campaigns, 169 images |
| FB | facebook.com/healthngoodness | Apify `facebook-pages-scraper` | Category, email, page since 16 Dec 2015, website, phone |
| GM | Google Maps place `0x3919041228c76e59:0x6ed9f18d02e4ea7c` + branch searches | Apify `compass/crawler-google-places` (local gosom scraper needs Docker, not installed) | All 4 branches: address, coords, hours, ratings |

## Brand
- Name: **Health n Goodness**, written `Health"n"Goodness` on cups, posters and Foodpanda. Short form **HnG** (IG captions: "the HnG way", "HnG bar").
- Logo: italic green **H** and **G** with a yellow **n** (FB profile PNG, 200 px; IG 320 px). Bevelled raster only, no vector. Green `#007943`.
- Cup print: `Health"n"Goodness · FRESH JUICES SHAKES 'N' DETOX`; newer green cup: `Health 'n' Goodness · Freshness. Purity. For Life.` (IG DeJxSgeNlZT).
- IG bio: "Organic • Fresh • Healthy · Juices | Shakes | Smoothies | Detox · Delivery & Takeaway · 4 Branches across Lahore".
- FB intro: "Fresh Juices, Shakes, Smoothies and Detox." Category: Smoothie & Juice Bar. Page created 16 Dec 2015.
- Voice: light and meme-y on reels, clean on product posts ("Squeeze the day", "Freshly Pressed. Natural Goodness", "Fresh. Cold. Real.", "Where goodness meet health").
- UAN on posters: **03-111-104-HNG (464)**. Email: healthngoodnesshng@gmail.com. Website listed on FB: healthngoodness.com.

## Photography (what the site mirrors)
Product posters: the HnG cup centred, its fruit around the base, on a soft single-colour backdrop that matches the fruit.
| Poster | Backdrop sampled | Fruit |
|---|---|---|
| White n Red Pomegranate (DdMNGvqnFWY) | warm blush `#eedfd8` / `#c7b4a9` | white + red pomegranate, arils |
| Squeeze the Day, Musami (Dd6SR4Sj1fG) | sage `#8ea972`, cream floor `#ede5dc` | limes / musami halves |
| Sip the Season, Orange (DQg-FBxDaIA) | orange `#ee8722`, cream floor `#fffcf7` | oranges |
| Refresh. Recharge. Mosambi (DeJxSgeNlZT) | pale citrus `#f3ebc9` | lime halves, leaves |
| Mighty Charger (DbD5MOitqk0) | coral `#fe9b84` → `#ef6342` | apple, orange, lemon, pineapple, carrot |
| Green Clean (Dau1znbjQ1t) | leaf green `#bce156` | mint, kiwi, celery, spinach, lemon, cucumber, ginger |

## Branches (IG captions, Oct 2026, cross-checked with Google Maps)
| Branch | Address (GM) | Phone (IG, latest) | Hours (GM) | Rating (GM) |
|---|---|---|---|---|
| Model Town | Shop 169-C, Bank Square Market, Model Town | 0311 1104464 | Mon–Sat 11 AM–1:30 AM, Sun 12 PM–1:30 AM | 4.1 (31) |
| Gulberg | MM Alam Rd, Block B3, Gulberg III (FB: Shop 58-B, Hussain Chowk) | 0323 4883307 | Daily 2 PM–4 AM | 4.3 (128) |
| DHA Phase 1 | Street 147, Sector H, DHA Phase 1 | 0343 4868963 | Mon 9 AM–12:30 AM, Tue–Wed 9 AM–12 AM, Thu–Sun 9 AM–1 AM | 3.9 (25) |
| DHA Phase 2 | Civic Commercial Area, Sector T (Lalik Chowk), DHA Phase 2 | 0344 8444959 | Daily 3 PM–3 AM | 4.3 (171) |

Excluded: a DHA Phase 4 listing (Google says permanently closed) and a Muslim Town "H,n,G" listing (not in any official post).

## Offers & services (IG)
- Bottled juices: 1 litre bottles (DVq1MXmDEXW); "Grab any 3 bottles and save Rs. 200" (DVyjrJ0DLgz).
- The 6 Pack: 6 bottles, 3 flavours, greeting card, gift wrapped, from Rs. 1,300 (DW_zSK8jMrg, DW6MiAQDUO2).
- Live Juice Bar for events: WhatsApp 0300-1899900 / 0332-4324375 (DYrbIJ2jY5f).
- Fruit baskets (Eid / Ramadan): Regular & Premium, 5 kg and 7 kg, Model Town only (DYpE8qFjd3C).
- Seasonal juices on IG but **not on Foodpanda**: White Pomegranate, Jamun, Cherry, Lychee, Watermelon, Grape, Plum smoothie, Zesty Kiwi, Berry Citrus, Triple Fusion, Mint Orange, Leetchi iced tea.

## Menu
Foodpanda Model Town, 18 Oct 2026. `raw/foodpanda-menu.json`. "from" means size options exist; Foodpanda was running a 10% deal on detox and protein items, so the site shows the regular price.

## Image rights
Only images posted by @healthngoodnesshngg (147 posts) or uploaded by the brand to Foodpanda. Three collab posts by @maryum.creates are excluded. Cutouts were made from official posters with rembg (ISNet); nothing is AI-generated.
