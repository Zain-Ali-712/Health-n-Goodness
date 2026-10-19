"""Split the official Mighty Charger poster (IG DbD5MOitqk0) into cup + ingredient layers.
Every layer keeps the poster's coordinate frame position so the site can reassemble it exactly."""
import os, json
os.environ["U2NET_HOME"] = r"D:\Tools\u2net\models\isnet-general-use"
from rembg import remove, new_session
from PIL import Image, ImageDraw, ImageFilter
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
src = Image.open(os.path.join(R, "img/ig/DbD5MOitqk0-0.jpg")).convert("RGB"); W, H = src.size
mask = remove(src, session=new_session("isnet-general-use"), only_mask=True, post_process_mask=True).convert("L")
d = ImageDraw.Draw(mask)
d.rectangle((380, 80, 975, 398), fill=0)   # "MIGHTY CHARGER" title
d.rectangle((30, 30, 240, 220), fill=0)    # small HnG corner logo
cup = Image.new("L", (W, H), 0); dc = ImageDraw.Draw(cup)
dc.polygon([(424, 468), (921, 468), (926, 612), (890, 612), (836, 1626), (504, 1626), (455, 612), (419, 612)], fill=255)
dc.rectangle((796, 400, 842, 476), fill=255)  # straw tip
cup = cup.filter(ImageFilter.GaussianBlur(1.2))
body = Image.new("L", (W, H), 0); ImageDraw.Draw(body).polygon([(466, 618), (880, 618), (832, 1560), (508, 1560)], fill=255)
def poly(pts=None, ell=None):
    m = Image.new("L", (W, H), 0); dm = ImageDraw.Draw(m)
    dm.polygon(pts, fill=255) if pts else dm.ellipse(ell, fill=255)
    return m.filter(ImageFilter.GaussianBlur(1))
pine = poly([(830, 885), (1060, 872), (1150, 800), (1250, 738), (1345, 722), (1350, 1010), (1235, 1300), (1220, 1612), (815, 1612), (835, 1000)])
from PIL import ImageChops
shapes = {
  "carrot": poly([(105, 285), (315, 285), (335, 440), (464, 690), (464, 742), (335, 742), (105, 505)]),
  "lemon": poly([(300, 742), (472, 742), (488, 1000), (492, 1150), (440, 1186), (250, 1186), (178, 1030), (198, 860)]),
  "apple": poly([(155, 1192), (342, 1188), (352, 1138), (378, 1138), (388, 1192), (508, 1200), (512, 1612), (155, 1612)]),
  "orange": ImageChops.subtract(poly(ell=(838, 470, 1230, 870)), pine),
  "pineapple": pine,
}
out = os.path.join(R, "cutouts", "mighty"); os.makedirs(out, exist_ok=True)
meta = {"frame": [W, H], "layers": {}}
def save(name, alpha):
    rgba = src.copy(); rgba.putalpha(alpha); bb = alpha.point(lambda a: 255 if a > 10 else 0).getbbox()
    rgba.crop(bb).save(os.path.join(out, f"{name}.png")); meta["layers"][name] = list(bb); print(name, bb)
save("cup", ImageChops.multiply(cup, ImageChops.lighter(mask, body)))
notcup = ImageChops.invert(cup)
for n, m in shapes.items():
    save(n, ImageChops.multiply(ImageChops.multiply(m, mask), notcup))
json.dump(meta, open(os.path.join(out, "meta.json"), "w"), indent=1)
