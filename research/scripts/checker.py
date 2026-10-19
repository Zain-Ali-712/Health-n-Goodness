"""Preview cutouts on a mid-grey background: checker.py out.jpg files..."""
import sys, os
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]; t = 360
sheet = Image.new("RGB", (len(files) * t, t + 20), (150, 160, 150)); d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGBA"); im.thumbnail((t - 10, t - 10))
    sheet.paste(im, (i * t + (t - im.width) // 2, (t - im.height) // 2), im); d.text((i * t + 4, t + 4), os.path.basename(f), fill="black")
sheet.save(out, quality=85)
