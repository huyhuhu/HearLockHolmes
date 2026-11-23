#!/usr/bin/env python3
"""Kiểm tra clip JSON đúng shape `Clip` (src/types/content.ts) trước khi seed.

  tools/validate_clip.py <clip.json> [--scaffold]

--scaffold: nới lỏng các phần điền lúc annotate (gist/comprehension/clusters/caseId)
— dùng để kiểm tra output của pipeline trước khi annotate.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

CATEGORIES = {"liaison", "reduced", "elision", "linking", "assimilation"}
CLIP_CATEGORIES = {"tech", "game", "film", "series", "stream"}


def check(cond: bool, errors: list[str], msg: str) -> None:
    if not cond:
        errors.append(msg)


def validate_clip(clip: dict, scaffold: bool) -> list[str]:
    e: list[str] = []

    check(isinstance(clip.get("id"), str) and clip["id"], e, "id: thiếu hoặc rỗng")
    if scaffold:
        check(isinstance(clip.get("caseId"), str), e, "caseId: phải là string (điền sau)")
    else:
        check(isinstance(clip.get("caseId"), str) and clip["caseId"], e, "caseId: thiếu — gán vụ án trước khi seed")
    check(isinstance(clip.get("videoId"), str) and len(clip["videoId"]) == 11, e, "videoId: thiếu hoặc không phải 11 ký tự")
    url = clip.get("youtubeUrl", "")
    check(isinstance(url, str) and url.startswith("https://www.youtube.com/watch?v="), e, "youtubeUrl: phải là link youtube.com/watch?v=...")
    check(isinstance(clip.get("startOffsetMs"), int) and clip["startOffsetMs"] >= 0, e, "startOffsetMs: phải là số nguyên ≥ 0 (0 nếu clip = cả video)")
    check(isinstance(clip.get("title"), str) and clip["title"], e, "title: thiếu")
    dur = clip.get("durationSec")
    check(isinstance(dur, (int, float)) and dur > 0, e, "durationSec: phải > 0")
    check(clip.get("level") in (1, 2, 3, 4, 5), e, "level: phải ∈ 1..5")
    check(clip.get("category") in CLIP_CATEGORIES, e, f"category: phải ∈ {sorted(CLIP_CATEGORIES)}")

    # gistQuestion — cổng nghe mù
    gq = clip.get("gistQuestion")
    check(isinstance(gq, dict), e, "gistQuestion: thiếu")
    if isinstance(gq, dict):
        if scaffold and not gq.get("choices"):
            pass  # scaffold chưa điền
        else:
            check(isinstance(gq.get("prompt"), str) and gq["prompt"], e, "gistQuestion.prompt: thiếu")
            choices = gq.get("choices")
            check(isinstance(choices, list) and len(choices) == 4, e, "gistQuestion.choices: cần đúng 4 lựa chọn")
            check(
                isinstance(gq.get("answerIndex"), int) and choices and 0 <= gq["answerIndex"] < len(choices),
                e,
                "gistQuestion.answerIndex: ngoài khoảng choices",
            )

    # comprehension — 3 câu hiểu nghĩa
    comp = clip.get("comprehension")
    check(isinstance(comp, list), e, "comprehension: phải là mảng")
    if isinstance(comp, list):
        if not scaffold:
            check(len(comp) == 3, e, f"comprehension: cần đúng 3 câu (đang {len(comp)})")
        for i, q in enumerate(comp):
            if not isinstance(q, dict):
                e.append(f"comprehension[{i}]: phải là object")
                continue
            choices = q.get("choices")
            check(isinstance(q.get("prompt"), str) and q["prompt"], e, f"comprehension[{i}].prompt: thiếu")
            check(isinstance(choices, list) and len(choices) == 4, e, f"comprehension[{i}].choices: cần đúng 4 lựa chọn")
            check(
                isinstance(q.get("answerIndex"), int) and choices and 0 <= q["answerIndex"] < len(choices),
                e,
                f"comprehension[{i}].answerIndex: ngoài khoảng choices",
            )

    sentences = clip.get("sentences")
    check(isinstance(sentences, list) and len(sentences) > 0, e, "sentences: rỗng")
    if not isinstance(sentences, list):
        return e

    seen_ids: set[str] = set()
    prev_end = -1
    for i, sent in enumerate(sentences):
        sid = sent.get("id", f"#{i}")
        check(isinstance(sent.get("id"), str) and sent["id"], e, f"sentences[{i}].id: thiếu")
        check(sent.get("id") not in seen_ids, e, f"sentences[{i}].id '{sid}': trùng")
        seen_ids.add(sent.get("id", ""))
        check(isinstance(sent.get("text"), str) and sent["text"], e, f"{sid}.text: thiếu")

        s, en = sent.get("startMs"), sent.get("endMs")
        check(isinstance(s, int) and isinstance(en, int) and s < en, e, f"{sid}: startMs/endMs không hợp lệ")
        check(isinstance(s, int) and s >= prev_end, e, f"{sid}: chồng lấn câu trước")
        if isinstance(en, int):
            prev_end = en

        words = sent.get("words")
        check(isinstance(words, list) and len(words) > 0, e, f"{sid}.words: rỗng")
        if not isinstance(words, list) or not words:
            continue
        check(words[0]["s"] == s and words[-1]["e"] == en, e, f"{sid}: startMs/endMs phải khớp word đầu/cuối")
        pw_end = -1
        for j, w in enumerate(words):
            check(isinstance(w.get("w"), str) and w["w"].strip(), e, f"{sid}.words[{j}].w: rỗng")
            ws, we = w.get("s"), w.get("e")
            check(isinstance(ws, int) and isinstance(we, int) and ws < we, e, f"{sid}.words[{j}]: s/e không hợp lệ")
            check(isinstance(ws, int) and ws >= pw_end, e, f"{sid}.words[{j}] '{w.get('w')}': chồng lấn / sai thứ tự")
            if isinstance(we, int):
                pw_end = we

        clusters = sent.get("clusters")
        check(isinstance(clusters, list), e, f"{sid}.clusters: phải là mảng")
        if not isinstance(clusters, list):
            continue
        if scaffold and not clusters:
            continue
        check(1 <= len(clusters) <= 3, e, f"{sid}.clusters: cần 1–3 cụm/câu (đang {len(clusters)}) — nhiều quá thành nhiễu")
        for j, cl in enumerate(clusters):
            cid = cl.get("id", f"#{j}")
            check(isinstance(cl.get("id"), str) and cl["id"], e, f"{sid}.clusters[{j}].id: thiếu")
            check(cl.get("category") in CATEGORIES, e, f"{sid}.clusters[{j}] ({cid}): category phải ∈ {sorted(CATEGORIES)}")
            span = cl.get("span")
            ok_span = (
                isinstance(span, list)
                and len(span) == 2
                and isinstance(span[0], int)
                and isinstance(span[1], int)
                and span[0] < span[1]
            )
            check(ok_span, e, f"{sid}.clusters[{j}] ({cid}): span phải là [startMs, endMs] tăng dần")
            if ok_span:
                check(s <= span[0] and span[1] <= en, e, f"{sid}.clusters[{j}] ({cid}): span phải nằm trong [{s}, {en}] của câu")
            forms = cl.get("cleanForms")
            check(isinstance(forms, list) and 3 <= len(forms) <= 4, e, f"{sid}.clusters[{j}] ({cid}): cleanForms cần 3–4 lựa chọn")
            check(
                isinstance(cl.get("answerIndex"), int) and forms and 0 <= cl["answerIndex"] < len(forms),
                e,
                f"{sid}.clusters[{j}] ({cid}): answerIndex ngoài khoảng cleanForms",
            )
            check(isinstance(cl.get("note", ""), str), e, f"{sid}.clusters[{j}] ({cid}): note phải là string")

    return e


def main() -> None:
    ap = argparse.ArgumentParser(description="Validate clip JSON theo shape Clip.")
    ap.add_argument("clip_json", type=Path)
    ap.add_argument("--scaffold", action="store_true", help="Chế độ scaffold (trước khi annotate)")
    args = ap.parse_args()

    try:
        clip = json.loads(args.clip_json.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as ex:
        sys.exit(f"LỖI: không đọc được {args.clip_json}: {ex}")

    errors = validate_clip(clip, scaffold=args.scaffold)
    mode = "scaffold" if args.scaffold else "final"
    if errors:
        print(f"✗ {args.clip_json.name} [{mode}] — {len(errors)} lỗi:")
        for msg in errors:
            print(f"  - {msg}")
        sys.exit(1)
    n_clusters = sum(len(s.get("clusters", [])) for s in clip.get("sentences", []))
    print(f"✓ {args.clip_json.name} [{mode}] — hợp lệ ({len(clip['sentences'])} câu, {n_clusters} cụm)")


if __name__ == "__main__":
    main()
