#!/usr/bin/env python3
"""Regenerate js/dev-notes.js from the extracted spec.

The DEV bar shows each screen the pptx's own production note ("הנחיות הפקה")
so QA can judge a screen — above all whether the companion is doing what the
script asks — against what the deck actually specified. Run after a new
spec extraction; the file is dev-only and never loaded by index.html.
"""
import pathlib, re, json

root = pathlib.Path(__file__).resolve().parent.parent
out = {}
for f in sorted((root / "spec/screens").glob("slide-*.md")):
    n = int(f.stem.split("-")[1])
    m = re.search(r"## הנחיות הפקה[^\n]*\n(.*?)(?=\n## |\Z)", f.read_text(), re.S)
    if not m:
        continue
    lines = [l[2:].strip() for l in m.group(1).strip().split("\n") if l.startswith("- ")]
    lines = [l for l in lines
             if not l.startswith("שם המסך בפיגמה") and not l.startswith("תבנית בפיגמה")]
    if lines:
        out[n] = lines

(root / "js/dev-notes.js").write_text(
    '/* AUTO-GENERATED from spec/screens/slide-NNN.md — the pptx\'s own\n'
    '   "הנחיות הפקה" (slide notes), keyed by DECK SLIDE number.\n'
    '   Loaded ONLY by index_dev.html, never by the shipped index.html.\n'
    '   Regenerate with tools/gen-dev-notes.py after a new spec extraction. */\n'
    "const SLIDE_NOTES = " + json.dumps(out, ensure_ascii=False, indent=2) + ";\n")
print(f"wrote js/dev-notes.js — {len(out)} slides")
