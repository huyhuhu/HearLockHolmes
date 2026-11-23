#!/usr/bin/env python3
"""Đo độ lệch timestamp của pipeline so với audio (GĐ2).

Cách đo (không cần nghe):
  1. Cấu trúc: words đơn điệu, sentence bọc words, cluster nằm trong câu.
  2. Biên từ ↔ biên chuyển tiếp năng lượng (silence↔speech): mỗi biên từ (start/end)
     so với cạnh vùng im lặng/nói gần nhất trong ±400ms — lệch càng nhỏ thì timestamp
     càng khớp audio. Biên nằm giữa lời nói liên tục không có cạnh tham chiếu →
     không đo được (báo riêng, không tính vào thống kê).
  3. Tương phản năng lượng trong/ngoài từ: từ phát âm bình thường có năng lượng
     trong [s,e] cao hơn vùng đệm ngoài; từ bị nuốt thường thấp — đó là nơi
     timestamp hay trôi nhất.

Dùng:
  tools/check_timestamps.py <clip.json> <audio.wav> [--json] [--tolerance-ms 300]
"""

from __future__ import annotations

import argparse
import json
import sys
import wave
from pathlib import Path

import numpy as np

FRAME_MS = 10
EDGE_WINDOW_MS = 400
PAD_MS = 300


def load_wav_mono(path: Path) -> tuple[np.ndarray, int]:
    with wave.open(str(path), "rb") as w:
        rate = w.getframerate()
        if w.getnchannels() != 1 or w.getsampwidth() != 2:
            sys.exit("LỖI: audio.wav phải là mono 16-bit (pipeline xuất đúng dạng này).")
        frames = w.readframes(w.getnframes())
    return np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0, rate


def rms_envelope(x: np.ndarray, rate: int) -> np.ndarray:
    """RMS theo frame FRAME_MS, làm mượt 3 frame."""
    hop = rate * FRAME_MS // 1000
    n = len(x) // hop
    env = np.empty(n, dtype=np.float32)
    for i in range(n):
        seg = x[i * hop : (i + 1) * hop]
        env[i] = float(np.sqrt(np.mean(seg * seg))) if len(seg) else 0.0
    if n >= 3:
        env = np.convolve(env, np.ones(3) / 3, mode="same")
    return env


def speech_edges(env: np.ndarray) -> list[tuple[float, str]]:
    """Cạnh chuyển tiếp silence↔speech (ms, 'rise'|'fall') theo ngưỡng 12% năng lượng p90."""
    if len(env) == 0:
        return []
    thresh = max(float(np.percentile(env, 90)) * 0.12, 1e-5)
    voiced = env > thresh
    edges: list[tuple[float, str]] = []
    for i in range(1, len(voiced)):
        if not voiced[i - 1] and voiced[i]:
            edges.append((i * FRAME_MS, "rise"))
        elif voiced[i - 1] and not voiced[i]:
            edges.append((i * FRAME_MS, "fall"))
    return edges


def nearest_edge(edges: list[tuple[float, str]], t_ms: float, window_ms: int = EDGE_WINDOW_MS):
    """Cạnh gần t_ms nhất trong ±window. Trả về (t_ms, kind, lệch_ms) hoặc None."""
    best = None
    for et, kind in edges:
        d = abs(et - t_ms)
        if d <= window_ms and (best is None or d < best[2]):
            best = (et, kind, d)
    return best


def boundary_deviations(words: list[dict], edges: list[tuple[float, str]]) -> tuple[list[dict], int]:
    """→ (rows đo được, số biên không có cạnh tham chiếu)."""
    rows: list[dict] = []
    unmeasured = 0
    for w in words:
        for edge_name, t in (("s", w["s"]), ("e", w["e"])):
            hit = nearest_edge(edges, t)
            if hit is None:
                unmeasured += 1
                continue
            et, kind, dev = hit
            rows.append({"w": w["w"], "sentId": w["sentId"], "edge": edge_name, "t": t, "refEdge": et, "refKind": kind, "dev": dev})
    return rows, unmeasured


def word_contrast(w: dict, env: np.ndarray) -> float:
    """Năng lượng TB trong từ / năng lượng TB vùng đệm ngoài.
    > 1: trong từ to hơn ngoài — biên có vẻ đúng chỗ. Rất thấp: từ bị nuốt."""

    def mean_env(a: int, b: int) -> float:
        lo = max(0, a // FRAME_MS)
        hi = min(len(env), max(lo + 1, b // FRAME_MS))
        return float(np.mean(env[lo:hi]))

    inner = mean_env(w["s"], w["e"])
    pads = [p for p in (mean_env(w["s"] - PAD_MS, w["s"]), mean_env(w["e"], w["e"] + PAD_MS)) if p > 1e-6]
    outer = sum(pads) / len(pads) if pads else 0.0
    if outer < 1e-6:
        return float("inf") if inner > 1e-6 else 1.0
    return inner / outer


def pct(vals: list[float], q: float) -> float:
    return float(np.percentile(np.array(vals, dtype=np.float64), q)) if vals else 0.0


def main() -> None:
    ap = argparse.ArgumentParser(description="Đo độ lệch timestamp so với audio.")
    ap.add_argument("clip_json", type=Path)
    ap.add_argument("audio_wav", type=Path)
    ap.add_argument("--tolerance-ms", type=float, default=300.0, help="Ngưỡng đạt (mặc định 300ms)")
    ap.add_argument("--json", action="store_true", help="Xuất report dạng JSON")
    args = ap.parse_args()

    clip = json.loads(args.clip_json.read_text(encoding="utf-8"))
    x, rate = load_wav_mono(args.audio_wav)
    env = rms_envelope(x, rate)
    edges = speech_edges(env)
    clip_ms = len(x) / rate * 1000

    all_words: list[dict] = []
    struct_issues: list[str] = []
    for sent in clip.get("sentences", []):
        ws = sent.get("words", [])
        if not ws:
            struct_issues.append(f"{sent.get('id')}: câu không có words")
            continue
        if sent["startMs"] != ws[0]["s"] or sent["endMs"] != ws[-1]["e"]:
            struct_issues.append(f"{sent['id']}: startMs/endMs không khớp word đầu/cuối")
        prev_e = None
        for w in ws:
            if w["s"] >= w["e"]:
                struct_issues.append(f"{sent['id']}: word '{w['w']}' s>=e")
            if prev_e is not None and w["s"] < prev_e:
                struct_issues.append(f"{sent['id']}: word '{w['w']}' chồng lấn word trước")
            if w["e"] > clip_ms + 50:
                struct_issues.append(f"{sent['id']}: word '{w['w']}' vượt quá độ dài audio")
            prev_e = w["e"]
            all_words.append({**w, "sentId": sent["id"]})

    devs, unmeasured = boundary_deviations(all_words, edges)
    dev_vals = [d["dev"] for d in devs]
    n_bounds = len(all_words) * 2
    over = [d for d in devs if d["dev"] > args.tolerance_ms]

    # biên câu ↔ cạnh năng lượng (câu thường bắt đầu/sau khoảng nghỉ)
    sent_edge_rows = []
    for sent in clip.get("sentences", []):
        for edge_name, t in (("start", sent["startMs"]), ("end", sent["endMs"])):
            hit = nearest_edge(edges, t)
            if hit:
                sent_edge_rows.append({"sentId": sent["id"], "edge": edge_name, "dev": hit[2]})

    per_sent: dict[str, dict] = {}
    for sent in clip.get("sentences", []):
        rows = [d for d in devs if d["sentId"] == sent["id"]]
        vals = [d["dev"] for d in rows]
        per_sent[sent["id"]] = {
            "text": sent["text"][:60],
            "median": round(pct(vals, 50), 1),
            "p90": round(pct(vals, 90), 1),
            "max": round(max(vals), 1) if vals else 0.0,
            "over": sum(1 for v in vals if v > args.tolerance_ms),
            "n": len(vals),
        }

    contrasts = [(w, word_contrast(w, env)) for w in all_words]
    low_contrast = [(w, c) for w, c in contrasts if c < 1.2]

    cluster_rows = []
    for sent in clip.get("sentences", []):
        for cl in sent.get("clusters", []):
            a, b = cl["span"]
            hit_a, hit_b = nearest_edge(edges, a), nearest_edge(edges, b)
            lo, hi = max(0, a // FRAME_MS), min(len(env), max(a // FRAME_MS + 1, b // FRAME_MS))
            inner = float(np.mean(env[lo:hi])) if hi > lo else 0.0
            clip_mean = float(np.mean(env)) if len(env) else 0.0
            cluster_rows.append(
                {
                    "id": cl["id"],
                    "category": cl.get("category", "?"),
                    "span": [a, b],
                    "edgeDevMs": {
                        "start": round(hit_a[2], 1) if hit_a else None,
                        "end": round(hit_b[2], 1) if hit_b else None,
                    },
                    "innerEnergyVsClip": round(inner / clip_mean, 3) if clip_mean > 1e-9 else None,
                    "note": cl.get("note", ""),
                }
            )

    report = {
        "clipId": clip.get("id"),
        "audioMs": round(clip_ms),
        "words": len(all_words),
        "sentences": len(clip.get("sentences", [])),
        "structuralIssues": struct_issues,
        "boundaryDevMs": {
            "measured": len(devs),
            "unmeasured": unmeasured,
            "coveragePct": round(100 * len(devs) / n_bounds, 1) if n_bounds else 0.0,
            "median": round(pct(dev_vals, 50), 1),
            "p90": round(pct(dev_vals, 90), 1),
            "p95": round(pct(dev_vals, 95), 1),
            "max": round(max(dev_vals), 1) if dev_vals else 0.0,
            "overTolerance": len(over),
            "overTolerancePct": round(100 * len(over) / len(dev_vals), 1) if dev_vals else 0.0,
        },
        "sentenceEdgeDevMs": {
            "n": len(sent_edge_rows),
            "median": round(pct([r["dev"] for r in sent_edge_rows], 50), 1),
            "max": round(max((r["dev"] for r in sent_edge_rows), default=0.0), 1),
        },
        "perSentence": per_sent,
        "lowContrastWords": [
            {"w": w["w"], "s": w["s"], "e": w["e"], "contrast": round(c, 2), "sentId": w["sentId"]}
            for w, c in low_contrast[:20]
        ],
        "clusters": cluster_rows,
    }

    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return

    bd = report["boundaryDevMs"]
    se = report["sentenceEdgeDevMs"]
    print(f"=== Timestamp check — {report['clipId']} ===")
    print(f"audio {report['audioMs'] / 1000:.1f}s · {report['words']} từ · {report['sentences']} câu · {len(edges)} cạnh năng lượng")
    print(f"cấu trúc sai: {len(struct_issues)}")
    for s in struct_issues:
        print(f"  ! {s}")
    print(
        f"Lệch biên từ ↔ cạnh silence/speech: median {bd['median']}ms · p90 {bd['p90']}ms · "
        f"p95 {bd['p95']}ms · max {bd['max']}ms"
    )
    print(f"  đo được {bd['measured']}/{n_bounds} biên ({bd['coveragePct']}%) · {bd['unmeasured']} biên trong lời nói liên tục (không có cạnh tham chiếu)")
    print(f"  lệch > {args.tolerance_ms:.0f}ms: {bd['overTolerance']} ({bd['overTolerancePct']}% số đo được)")
    print(f"Lệch biên câu ↔ cạnh: median {se['median']}ms · max {se['max']}ms ({se['n']} biên)")
    print("\n-- Theo câu --")
    for sid, r in per_sent.items():
        flag = " ⚠" if r["over"] else ""
        print(f"{sid}: median {r['median']}ms · p90 {r['p90']}ms · max {r['max']}ms · >300ms: {r['over']}/{r['n']}{flag}  «{r['text']}»")
    if report["lowContrastWords"]:
        print(f"\n-- Từ năng lượng thấp (điểm nghi ngờ bị nuốt, {len(report['lowContrastWords'])} từ) --")
        for r in report["lowContrastWords"][:10]:
            print(f"  '{r['w']}' {r['s']}-{r['e']}ms · contrast {r['contrast']} · {r['sentId']}")
    if cluster_rows:
        print("\n-- Cụm annotate --")
        for c in cluster_rows:
            e = c["edgeDevMs"]
            print(
                f"  {c['id']} [{c['category']}] span {c['span']} · lệch biên {e['start']}/{e['end']}ms · "
                f"năng lượng trong/cả clip {c['innerEnergyVsClip']}"
            )
            if c["note"]:
                print(f"      {c['note']}")


if __name__ == "__main__":
    main()
