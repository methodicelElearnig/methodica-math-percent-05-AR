"""Turn a producer-supplied character clip into a unit-ready companion clip.

Four steps, in order:

1. Whiten ONLY the background — border-seeded flood fill, the same rule the
   still pipeline uses (percent-05/tools/whiten_clip_bg.py): a pixel joins the
   background when it is near-achromatic AND light AND connected to the frame
   edge. Never key on saturation; the monsters are the chromatic part.
2. Drop specks — the render's contact shadow survives step 1 in pieces (its
   core is near-black, so it is dark rather than light). Anything that is not
   one of the big foreground blobs is background too.
3. Crop to the union bounding box of every frame, plus a margin. The clips
   arrive 1280x720 with the character floating in a lot of empty white, which
   is why the earlier ones needed a hand-tuned width override in CSS.
4. Re-encode at the source fps, no audio.

Usage: prep_character_clip.py <src.mp4|gif> <out.mp4> [--spread N] [--luma N]
"""
import argparse, pathlib, shutil, subprocess, sys, tempfile
import numpy as np
from PIL import Image
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--spread", type=int, default=22)   # max RGB spread to read as grey
ap.add_argument("--luma",   type=int, default=120)  # min brightness to read as light
ap.add_argument("--speck",  type=float, default=0.15)  # % of frame a blob must fill to survive
ap.add_argument("--margin", type=float, default=0.04)  # crop padding, share of bbox
ap.add_argument("--long",   type=int, default=800)
ap.add_argument("--keep-bg", action="store_true",
                help="frame the clip but DO NOT touch its pixels — for a source whose\n                      background is already clean (producer 05.10, screen 38). The mask\n                      is still computed, but only to find the crop box.")  # longest output side
a = ap.parse_args()

work = pathlib.Path(tempfile.mkdtemp(prefix="clip-"))
raw = work / "raw"; raw.mkdir()

fps = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                      "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", a.src],
                     capture_output=True, text=True).stdout.strip() or "24/1"
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", a.src, str(raw / "%05d.png")], check=True)
frames = sorted(raw.glob("*.png"))
print(f"{len(frames)} frames @ {fps}")

clean = work / "clean"; clean.mkdir()
x0 = y0 = 10**9; x1 = y1 = -1

for i, f in enumerate(frames):
    px = np.asarray(Image.open(f).convert("RGB")).astype(np.int16)
    h, w, _ = px.shape
    cand = ((px.max(2) - px.min(2)) <= a.spread) & (px.mean(2) >= a.luma)
    lab, _ = ndimage.label(cand)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    edge.discard(0)
    bg = np.isin(lab, list(edge))

    # 2 — whatever is left over in small islands is shadow, not monster.
    flab, fn = ndimage.label(~bg, structure=np.ones((3, 3)))
    if fn:
        sizes = ndimage.sum(np.ones_like(flab), flab, range(1, fn + 1))
        keep = [j + 1 for j, s in enumerate(sizes) if s >= h * w * a.speck / 100]
        bg |= ~np.isin(flab, keep)

    if a.keep_bg:
        # the mask above is used ONLY for the crop box; the frame is copied as-is
        Image.fromarray(px.astype(np.uint8)).save(clean / f.name)
    else:
        soft = ndimage.binary_dilation(bg) & ~bg       # feather the fur edge
        out = px.copy()
        out[bg] = 255
        out[soft] = (out[soft] * 0.45 + 255 * 0.55).astype(np.int16)
        Image.fromarray(out.astype(np.uint8)).save(clean / f.name)

    ys, xs = np.nonzero(~bg)
    if len(xs):
        x0 = min(x0, xs.min()); x1 = max(x1, xs.max())
        y0 = min(y0, ys.min()); y1 = max(y1, ys.max())
    if i % 40 == 0:
        print("  frame", i, "bg px", int(bg.sum()))

bw, bh = x1 - x0 + 1, y1 - y0 + 1
pad = int(max(bw, bh) * a.margin)
x0 = max(0, x0 - pad); y0 = max(0, y0 - pad)
x1 = min(w - 1, x1 + pad); y1 = min(h - 1, y1 + pad)
cw, ch = (x1 - x0 + 1) & ~1, (y1 - y0 + 1) & ~1
print(f"content bbox {bw}x{bh} -> crop {cw}x{ch} at ({x0},{y0}) of {w}x{ch and h}")

scale = min(1.0, a.long / max(cw, ch))
ow, oh = int(cw * scale) & ~1, int(ch * scale) & ~1
subprocess.run(["ffmpeg", "-y", "-v", "error", "-framerate", fps,
                "-i", str(clean / "%05d.png"),
                "-vf", f"crop={cw}:{ch}:{x0}:{y0},scale={ow}:{oh}:flags=lanczos",
                "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20",
                "-movflags", "+faststart", a.out], check=True)
shutil.rmtree(work, ignore_errors=True)
print("wrote", a.out, f"{ow}x{oh}")
