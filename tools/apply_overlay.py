#!/usr/bin/env python3
"""Áp overlay annotate lên scaffold clip.json → clip hoàn chỉnh (GĐ4/SOP).

  tools/apply_overlay.py <clip.json> <overlay.json> [--write]

Overlay shape xem doc/CONTENT-SOP.md §4. Tóm tắt:
{
  "caseId": "...",
  "gistQuestion": {prompt:{vi,en}, choices:[{vi,en}×4], answerIndex},
  "comprehension": [3 × MultipleChoice],
  "sentences": [
    { "parts": [["sent-01", 0, 24]] | ["@m", [{w,s,e}]],
      "text": "dạng NGHE THẬT",
      "wordFixes": {"0": "GTA"},            # optional — sửa words[].w theo index
      "replace": {"Wunsch": "Wuntch"},      # optional — thay chuỗi trên mọi words[].w
      "clusters": [
        {"words": [12, 13], "category": "reduced",
         "cleanForms": ["...", "...", "..."], "answerIndex": 0,
         "note": {"vi": "...", "en": "..."}}
      ] }
  ]
}
Cluster span suy tự word index [i0..i1] (tính theo thứ tự words của câu sau gộp).
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def sanitize(words: list[dict]) -> list[dict]:
    """Ép words tăng dần, không chồng lấn (whisper đôi khi cho timestamp lệch)."""
    prev_e = -1
    for w in words:
        if w["s"] < prev_e:
            w["s"] = prev_e
        if w["e"] <= w["s"]:
            w["e"] = w["s"] + 10
        prev_e = w["e"]
    return words


def build_words(orig: dict, parts: list, fixes=None, replaces=None) -> list[dict]:
    ws: list[dict] = []
    for part in parts:
        sid, a, b = part[0], part[1], part[2]
        if sid == "@m":
            ws.extend(dict(w) for w in a)
        else:
            if sid not in orig:
                sys.exit(f"LỖI: thiếu {sid} trong scaffold")
            ws.extend(dict(w) for w in orig[sid]["words"][a:b])
    if fixes:
        for i, txt in fixes.items():
            ws[int(i)]["w"] = txt
    if replaces:
        for old, new in replaces.items():
            for w in ws:
                w["w"] = w["w"].replace(old, new)
    return sanitize(ws)


def main() -> None:
    ap = argparse.ArgumentParser(description="Apply annotation overlay to a clip scaffold.")
    ap.add_argument("clip_json", type=Path)
    ap.add_argument("overlay_json", type=Path)
    ap.add_argument("--write", action="store_true", help="ghi đè clip.json (mặc định: in stdout)")
    args = ap.parse_args()

    clip = json.loads(args.clip_json.read_text(encoding="utf-8"))
    ov = json.loads(args.overlay_json.read_text(encoding="utf-8"))
    orig = {s["id"]: s for s in clip["sentences"]}

    sentences: list[dict] = []
    clu_n = 0
    for idx, spec in enumerate(ov["sentences"], start=1):
        ws = build_words(orig, spec["parts"], spec.get("wordFixes"), spec.get("replace"))
        clusters: list[dict] = []
        for c in spec.get("clusters", []):
            clu_n += 1
            i0, i1 = c["words"]
            item = {
                "id": f"clu-{clu_n:02d}",
                "category": c["category"],
                "span": [ws[i0]["s"], ws[i1]["e"]],
                "cleanForms": c["cleanForms"],
                "answerIndex": c["answerIndex"],
            }
            if c.get("note"):
                item["note"] = c["note"]
            clusters.append(item)
        sentences.append(
            {
                "id": f"sent-{idx:02d}",
                "text": spec["text"],
                "startMs": ws[0]["s"],
                "endMs": ws[-1]["e"],
                "words": ws,
                "clusters": clusters,
            }
        )

    for key in ("caseId", "gistQuestion", "comprehension"):
        if key in ov:
            clip[key] = ov[key]
    clip["sentences"] = sentences

    out = json.dumps(clip, ensure_ascii=False, indent=2) + "\n"
    if args.write:
        args.clip_json.write_text(out, encoding="utf-8")
        n = sum(len(s["clusters"]) for s in sentences)
        print(f"✓ {clip['id']}: {len(sentences)} câu, {n} cụm → {args.clip_json}")
    else:
        print(out)


if __name__ == "__main__":
    main()
