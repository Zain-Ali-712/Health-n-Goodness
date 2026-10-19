"""Contact sheet: python sheet.py out.jpg cols thumb file1 file2 ..."""
import sys, os
from PIL import Image, ImageDraw
out, cols, t = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); files = sys.argv[4:]
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * t, rows * (t + 18)), "white"); d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    try: im = Image.open(f).convert("RGB")
    except Exception: continue
    im.thumbnail((t, t)); x, y = (i % cols) * t, (i // cols) * (t + 18)
    sheet.paste(im, (x + (t - im.width) // 2, y)); d.text((x + 3, y + t + 2), os.path.basename(f)[:28], fill="black")
sheet.save(out, quality=82)
