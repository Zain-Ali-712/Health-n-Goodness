"""Download official images: IG post covers + carousel children, Foodpanda product photos, logos."""
import json, os, re, sys, urllib.request, concurrent.futures as cf
sys.stdout.reconfigure(encoding="utf-8")
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
RAW = os.path.join(R, "raw"); OUT = os.path.join(R, "img")
for d in ("ig", "fp", "brand"): os.makedirs(os.path.join(OUT, d), exist_ok=True)
jobs = []
posts = json.load(open(os.path.join(RAW, "ig-posts-media.json"), encoding="utf8"))["items"]
owners = {}
for p in posts:
    sc = p["shortCode"]; owners[sc] = p.get("ownerUsername")
    jobs.append((f"ig/{sc}-0.jpg", p["displayUrl"]))
    for i, u in enumerate(p.get("images") or [], 1):
        if u != p["displayUrl"]: jobs.append((f"ig/{sc}-{i}.jpg", u))
json.dump(owners, open(os.path.join(OUT, "ig", "_owners.json"), "w"), indent=1)
fp = json.load(open(os.path.join(RAW, "foodpanda-menu.json"), encoding="utf8"))
slug = lambda s: re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
for c in fp["cats"]:
    for it in c["items"]:
        if it["img"]: jobs.append((f"fp/{slug(it['name'])}.jpg", it["img"]))
jobs.append(("brand/fp-logo.jpg", fp["vendor"]["logo"]))
jobs.append(("brand/fp-listing.jpg", fp["vendor"]["listing"]))
def get(job):
    rel, url = job; dst = os.path.join(OUT, rel)
    if os.path.exists(dst) and os.path.getsize(dst) > 0: return rel, 0, None
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=40) as r: data = r.read()
        open(dst, "wb").write(data); return rel, len(data), None
    except Exception as e: return rel, 0, str(e)[:80]
ok = fail = 0
with cf.ThreadPoolExecutor(12) as ex:
    for rel, n, err in ex.map(get, jobs):
        if err: fail += 1; print("FAIL", rel, err)
        else: ok += 1
print("ok", ok, "fail", fail)
