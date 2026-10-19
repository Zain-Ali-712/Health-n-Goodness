"""Copy curated official assets into public/img as WebP and generate lib/menu-data.ts + lib/socials-data.ts.

Sources: Foodpanda Model Town scrape (raw/foodpanda-menu.json), Instagram posts (raw/ig-posts-meta.json),
and cutouts made from official IG posters (cutouts/). Run: python -I scripts/build_assets.py
"""
import json, os, re, sys
from PIL import Image
sys.stdout.reconfigure(encoding="utf-8")
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
APP = os.path.normpath(os.path.join(R, ".."))
PUB = os.path.join(APP, "public", "img")
sizes = {}

def out(rel, src, max_side=1600, q=82):
    dst = os.path.join(PUB, rel); os.makedirs(os.path.dirname(dst), exist_ok=True)
    im = Image.open(os.path.join(R, src))
    im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    im.save(dst, "WEBP", quality=q, method=6)
    sizes["/img/" + rel] = list(im.size)
    return im.size

slug = lambda s: re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

# --- brand + hero ---------------------------------------------------------
out("brand/logo.webp", "cutouts/logo-hng.png", max_side=480, q=92)
for n in ("musami-limes", "pomegranate", "orange", "mosmabi-hand", "white-pom", "musami-dome", "falsa", "mango3", "lychee", "jamun"):
    out(f"hero/{n}.webp", f"cutouts/{n}.png", max_side=1200, q=86)
for f in os.listdir(os.path.join(R, "cutouts", "pieces")):
    out(f"pieces/{f[:-4]}.webp", f"cutouts/pieces/{f}", max_side=600, q=86)

for n in ("redretreat", "greenclean"):
    out(f"detox/{n}.webp", f"cutouts/{n}.png", max_side=1000, q=86)

# Mighty Charger layers keep the poster frame so they reassemble exactly.
mm = json.load(open(os.path.join(R, "cutouts", "mighty", "meta.json")))
for n in mm["layers"]:
    out(f"mighty/{n}.webp", f"cutouts/mighty/{n}.png", max_side=1300, q=86)

# Full posters (IG) used as photography on the site.
POSTERS = {
    "squeeze-the-day": "Dd6SR4Sj1fG", "white-red-pomegranate": "DdMNGvqnFWY", "white-pomegranate": "DcD5o1Lm04g",
    "sip-the-season": "DQg-FBxDaIA", "mosambi": "DeJxSgeNlZT", "mango": "DYEi75AjTS9", "cherry": "DYj7Ww6DQNH",
    "peach": "DYUibknjGqd", "watermelon": "DXPKRzbjE4Q", "falsa": "DXbflhzjbSm", "mighty-charger": "DbD5MOitqk0",
    "green-clean": "Dau1znbjQ1t", "red-retreat": "Da5OlTvD77j", "six-pack": "DW_zSK8jMrg", "bottles": "DVyjrJ0DLgz",
    "liter": "DVq1MXmDEXW", "juice-bar": "DYrbIJ2jY5f", "basket": "DYpE8qFjd3C", "team": "DXGwiyyjY_u",
    "labour": "DXy_dlGDckS", "bar": "DXOigj4DRlN", "busy": "DdJTwudxvH_", "clean-prep": "DTfATG0DfUH", "lychee": "DZFbRKBjcb7", "storefront": "DWTp7B1De10",
}
for name, sc in POSTERS.items():
    out(f"posters/{name}.webp", f"img/ig/{sc}-0.jpg", max_side=1100, q=80)

# --- menu (Foodpanda) ----------------------------------------------------
fp = json.load(open(os.path.join(R, "raw", "foodpanda-menu.json"), encoding="utf8"))
price_of = lambda s: int(re.findall(r"Rs\. ([\d,]+)", s)[0].replace(",", "")) if s else 0

# Official names, with obvious casing/typos tidied. Original kept in `fpName`.
RENAME = {"BULK-UP SHAKE": "Bulk-Up Shake", "COFFEE DATE SHAKE": "Coffee Date Shake", "PEACH ICE-TEA": "Peach Ice Tea",
          "Fruit Cocktell juice": "Fruit Cocktail Juice", "Musami (Fresh)": "Fresh Musami", "Pomegranate Juice (Red)": "Red Pomegranate Juice",
          "Special Lemonade with Ginger & Mint Juice": "Ginger Mint Lemonade", "Special Lemonade with Soda": "Lemonade with Soda",
          "Plain Lemonade Juice": "Plain Lemonade", "Kiwi Lemonade Juice": "Kiwi Lemonade", "Strawberry Lemonade Juice": "Strawberry Lemonade"}
# Descriptions that are filler or contradict the item are dropped rather than rewritten.
DROP_DESC = {"Pineapple Juice", "PEACH ICE-TEA", "Sucral", "Slimming Detox"}
FILLER = {"Simple yet yummilicious!", "Sweet drink to lighten up your mood.", "A nutritious drink that is perfect for people of all ages.",
          "Quick, on-the-go and fuss free."}
GROUPS = [  # (id, title, source categories, backdrop from the matching IG posters)
    ("juices", "Juices", ["Juices", "Ramzan Special"], "#f6e3b4"),
    ("detox", "Detox", ["Special Detox", "Detox Line"], "#dbe8c4"),
    ("shakes", "Shakes", ["Shakes"], "#f1e4d6"),
    ("protein", "Protein Shakes", ["Protein Shakes"], "#e9e1d4"),
    ("smoothies", "Smoothies with Honey", ["Smoothie with Honey"], "#f4dcdc"),
    ("eats", "Healthy Eats", ["Healthy Eats"], "#e4ecd9"),
    ("add-ons", "Add-ons", ["Sides"], "#efe8d6"),
]
NOTES = {"protein": "Made from 100% natural ingredients, high in protein, low in carbs and fat.",
         "smoothies": "Blended with honey.", "detox": "Cold-pressed blends, each with a job to do."}
bycat = {c["title"]: c for c in fp["cats"]}
cats = []
for gid, title, srcs, tint in GROUPS:
    items = []
    for s in srcs:
        for it in bycat[s]["items"]:
            sid = slug(it["name"]); name = RENAME.get(it["name"], it["name"])
            base = price_of(it["before"]) if it["before"] else price_of(it["price"])
            desc = None if it["name"] in DROP_DESC or (it["desc"] or "") in FILLER else (it["desc"] or "").strip() or None
            if desc and desc.lower().startswith(it["name"].lower()):
                desc = desc[len(it["name"]):].strip() or None
            img = out(f"menu/{sid}.webp", f"img/fp/{sid}.jpg", max_side=1100, q=80) and f"/img/menu/{sid}.webp"
            items.append({"id": sid, "name": name, "fpName": it["name"], "price": base, "from": it["price"].startswith("from"),
                          "description": desc, "image": img, "popular": it["name"] in fp["popular"]})
    cats.append({"id": gid, "title": title, "note": NOTES.get(gid), "tint": tint, "items": items})

ts = ["// Generated by research/scripts/build_assets.py from the Foodpanda Model Town scrape (18 Oct 2026). Do not edit by hand.",
      'import type { MenuCategory } from "./menu-types";', "",
      "export const MENU: MenuCategory[] = " + json.dumps(cats, ensure_ascii=False, indent=2) + ";", ""]
open(os.path.join(APP, "lib", "menu-data.ts"), "w", encoding="utf8").write("\n".join(ts))

# --- socials (Instagram) ---------------------------------------------------
meta = {p["shortCode"]: p for p in json.load(open(os.path.join(R, "raw", "ig-posts-meta.json"), encoding="utf8"))["items"]}
PICK = ["DdMNGvqnFWY", "DSw-GOljTcE", "Dd6SR4Sj1fG", "DXbflhzjbSm", "DQMz1a5DJtI", "DYj7Ww6DQNH", "DW6MiAQDUO2", "Da2pSuazQPd",
        "DYEi75AjTS9", "DbD5MOitqk0", "DcbB9TJuIzL", "DXPKRzbjE4Q", "DYrbIJ2jY5f", "DeJxSgeNlZT", "DaVaPTTMDeu", "DYUibknjGqd",
        "Da5OlTvD77j", "DWimDOwk3bV", "DVyjrJ0DLgz", "DQg-FBxDaIA", "DYpE8qFjd3C", "Dau1znbjQ1t", "DZFbRKBjcb7", "DcD5o1Lm04g"]
posts = []
for sc in PICK:
    p = meta[sc]
    cap = re.split(r"\n\s*(Order now|Order Now|Order or|Find out|\.\n|📍)", p["caption"] or "")[0].strip()
    cap = re.sub(r"\s*\n\s*", " ", cap).strip(" .")
    w, h = out(f"ig/{sc}.webp", f"img/ig/{sc}-0.jpg", max_side=900, q=78)
    posts.append({"id": sc, "url": f"https://www.instagram.com/p/{sc}/", "type": "reel" if p["type"] == "Video" else "post",
                  "caption": cap[:160], "likes": max(p.get("likesCount") or 0, 0), "date": p["timestamp"][:10],
                  "image": f"/img/ig/{sc}.webp", "w": w, "h": h})
ts = ["// Generated by research/scripts/build_assets.py from @healthngoodnesshngg (scraped 18 Oct 2026). Do not edit by hand.",
      "export type SocialPost = { id: string; url: string; type: \"reel\" | \"post\"; caption: string; likes: number; date: string; image: string; w: number; h: number };", "",
      "export const POSTS: SocialPost[] = " + json.dumps(posts, ensure_ascii=False, indent=2) + ";", ""]
open(os.path.join(APP, "lib", "socials-data.ts"), "w", encoding="utf8").write("\n".join(ts))

# --- sizes + mighty frame ------------------------------------------------------
ts = ["// Generated by research/scripts/build_assets.py. Intrinsic sizes of every exported image.",
      "export const IMG: Record<string, [number, number]> = " + json.dumps(sizes, indent=1) + ";", "",
      "/** Mighty Charger layers: bounding boxes inside the original 1350x1688 IG poster (DbD5MOitqk0). */",
      "export const MIGHTY = " + json.dumps(mm) + " as const;", ""]
open(os.path.join(APP, "lib", "image-sizes.ts"), "w", encoding="utf8").write("\n".join(ts))
print("images", len(sizes), "items", sum(len(c["items"]) for c in cats), "posts", len(posts))
