"""Cut product shots out of official IG posters. Usage: cutout.py name src top_frac [left right bottom fracs]"""
import os, sys
os.environ["U2NET_HOME"] = r"D:\Tools\u2net\models\isnet-general-use"
from rembg import remove, new_session
from PIL import Image
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
sess = new_session("isnet-general-use")
jobs = [l.split() for l in open(os.path.join(R, "scripts", "cutouts.txt")) if l.strip() and not l.startswith("#")]
for name, src, top, *rest in jobs:
    im = Image.open(os.path.join(R, "img", src)).convert("RGB"); w, h = im.size
    l, r, b = (list(map(float, rest)) + [0, 1, 1])[:3] if rest else (0, 1, 1)
    box = (int(l * w), int(float(top) * h), int(r * w), int(b * h))
    crop = im.crop(box)
    out = remove(crop, session=sess, post_process_mask=True)
    bb = out.getchannel("A").point(lambda a: 255 if a > 12 else 0).getbbox()
    if bb: out = out.crop(bb)
    out.save(os.path.join(R, "cutouts", f"{name}.png")); print(name, out.size)
