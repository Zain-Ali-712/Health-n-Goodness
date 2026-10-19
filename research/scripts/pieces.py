"""Cut single fruit pieces out of the official product cutouts (for foreground depth layers)."""
import os
from PIL import Image, ImageDraw, ImageChops, ImageFilter
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
C = os.path.join(R, "cutouts"); OUT = os.path.join(C, "pieces"); os.makedirs(OUT, exist_ok=True)
def cut(name, src, ell=None, poly=None, rects=(), minus=()):
    im = Image.open(os.path.join(C, src)).convert("RGBA"); m = Image.new("L", im.size, 0); d = ImageDraw.Draw(m)
    if ell: d.ellipse(ell, fill=255)
    if poly: d.polygon(poly, fill=255)
    for r in rects: d.rectangle(r, fill=255)
    for r in minus: d.rectangle(r, fill=0)
    a = ImageChops.multiply(im.getchannel("A"), m.filter(ImageFilter.GaussianBlur(1.5))); im.putalpha(a)
    bb = a.point(lambda v: 255 if v > 10 else 0).getbbox(); im.crop(bb).save(os.path.join(OUT, f"{name}.png")); print(name, bb)
cut("lime-half", "mosmabi-hand.png", ell=(764, 758, 1125, 1081))
cut("lime-half-2", "mosmabi-hand.png", ell=(14, 518, 336, 910))
cut("musami-half", "musami-limes.png", ell=(629, 522, 927, 782))
cut("orange-half", "orange.png", ell=(146, 647, 500, 977))
cut("white-pom", "white-pom.png", ell=(6, 384, 304, 682), rects=[(100, 330, 200, 400)])
cut("pom-open", "pomegranate.png", poly=[(560, 640), (700, 620), (955, 740), (950, 862), (700, 866), (565, 662)])
cut("pom-arils", "pomegranate.png", poly=[(90, 690), (230, 668), (360, 700), (360, 850), (100, 850)])
