"""Poster cut-outs where the cup is translucent: matte the poster, blank the text, then union with a cup polygon."""
import os
os.environ["U2NET_HOME"] = r"D:\Tools\u2net\models\isnet-general-use"
from rembg import remove, new_session
from PIL import Image, ImageDraw, ImageChops, ImageFilter
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sess = new_session("isnet-general-use")
JOBS = {
  # name: (src, crop, text rects to blank, cup polygon) in poster pixels
  "falsa": ("ig/DXtg1nuDQwt-0.jpg", (340, 268, 1080, 1312),
            [(0, 560, 575, 960), (0, 1120, 380, 1215)],
            [(582, 300), (1038, 300), (1040, 392), (1006, 392), (976, 1252), (650, 1252), (614, 392), (580, 392)]),
  "redretreat": ("ig/Da5OlTvD77j-0.jpg", (120, 395, 900, 1275),
            [(0, 360, 420, 470), (540, 330, 1080, 440), (800, 720, 1080, 945), (0, 930, 300, 1015), (175, 1015, 305, 1095)],
            [(360, 488), (702, 488), (704, 566), (682, 566), (642, 1258), (420, 1258), (386, 566), (358, 566)]),
}
for name, (src, crop, blanks, poly) in JOBS.items():
    im = Image.open(os.path.join(R, "img", src)).convert("RGB"); W, H = im.size
    m = remove(im, session=sess, only_mask=True, post_process_mask=True).convert("L")
    d = ImageDraw.Draw(m)
    for r in blanks: d.rectangle(r, fill=0)
    cup = Image.new("L", (W, H), 0); ImageDraw.Draw(cup).polygon(poly, fill=255)
    a = ImageChops.lighter(m, cup.filter(ImageFilter.GaussianBlur(1.2)))
    out = im.copy(); out.putalpha(a); out = out.crop(crop)
    bb = out.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox(); out = out.crop(bb)
    out.save(os.path.join(R, "cutouts", f"{name}.png")); print(name, out.size)
