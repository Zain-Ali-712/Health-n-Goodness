"""Second round of cut-outs. Each job: name, src, crop box (fractions), list of rects (fractions of the crop) to blank before matting."""
import os, json
os.environ["U2NET_HOME"] = r"D:\Tools\u2net\models\isnet-general-use"
from rembg import remove, new_session
from PIL import Image, ImageDraw
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sess = new_session("isnet-general-use")
JOBS = [
  ("falsa", "ig/DXtg1nuDQwt-0.jpg", (0.26, 0.22, 1.0, 0.93), [(0, 0, 0.32, 0.7)]),
  ("mango3", "ig/DX9iVZSNa2k-0.jpg", (0.0, 0.27, 1.0, 0.93), []),
  ("jamun", "ig/DaFjbRetAmx-0.jpg", (0.08, 0.28, 1.0, 0.94), [(0, 0.12, 0.26, 0.6), (0.62, 0.0, 1.0, 0.38)]),
  ("whitered", "ig/DdoQD4HEQSK-0.jpg", (0.0, 0.0, 1.0, 1.0), []),
  ("lychee", "ig/DZFbRKBjcb7-0.jpg", (0.0, 0.25, 1.0, 0.95), []),
  ("redretreat", "ig/Da5OlTvD77j-0.jpg", (0.0, 0.25, 1.0, 1.0), []),
  ("greenclean", "ig/Dau1znbjQ1t-2.jpg", (0.0, 0.18, 0.72, 1.0), []),
]
only = os.environ.get("ONLY")
for name, src, box, blanks in JOBS:
    if only and name not in only.split(","): continue
    im = Image.open(os.path.join(R, "img", src)).convert("RGB"); w, h = im.size
    crop = im.crop((int(box[0]*w), int(box[1]*h), int(box[2]*w), int(box[3]*h)))
    m = remove(crop, session=sess, only_mask=True, post_process_mask=True).convert("L")
    d = ImageDraw.Draw(m); cw, ch = crop.size
    for (a, b, c, e) in blanks: d.rectangle((a*cw, b*ch, c*cw, e*ch), fill=0)
    out = crop.copy(); out.putalpha(m)
    bb = m.point(lambda v: 255 if v > 12 else 0).getbbox(); out = out.crop(bb)
    out.save(os.path.join(R, "cutouts", f"{name}.png")); print(name, out.size)
