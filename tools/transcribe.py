#!/usr/bin/env python3
"""HearLock Holmes — transcript pipeline (GĐ2).

yt-dlp (audio) → ffmpeg (wav 16k mono) → faster-whisper (word timestamps)
→ JSON scaffold đúng shape `Clip` (xem src/types/content.ts).

Thời gian trong `sentences[].words` / `startMs` là **clip-relative** (ms tính từ
đầu đoạn clip). Vị trí đoạn clip trong video gốc nằm ở `startOffsetMs` —
player YouTube seek tới `startOffsetMs + t`. Chi tiết: tools/annotate-format.md.

Dùng qua tools/transcribe.sh (tự tạo venv nếu thiếu).
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

CATEGORIES = ("tech", "game", "film", "series", "stream")

# Tách câu: quá ngắn thì gộp, quá dài thì cắt, ngắt theo chấm/câu và khoảng nghỉ
MAX_SENT_MS = 12_000
MIN_SENT_MS = 1_200
GAP_SPLIT_MS = 800

SENT_END_RE = re.compile(r"[.!?…][\"'’”)\]]?$")

TOOLS_DIR = Path(__file__).resolve().parent
DEFAULT_OUT = TOOLS_DIR / "out"


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        prog="transcribe",
        description="Sinh transcript word-timestamps (JSON scaffold) từ video YouTube.",
    )
    p.add_argument("url", help="YouTube URL (yt-dlp hỗ trợ site khác cũng được)")
    p.add_argument("--id", dest="clip_id", help="Clip id (mặc định: clip-<videoId>[-<start>])")
    p.add_argument("--start", type=float, default=None, help="Giây bắt đầu đoạn cắt trong video")
    p.add_argument("--end", type=float, default=None, help="Giây kết thúc đoạn cắt (mặc định: hết video)")
    p.add_argument("--level", type=int, choices=range(1, 6), default=1, help="Bậc khó 1–5 (mặc định 1)")
    p.add_argument("--category", choices=CATEGORIES, default="tech", help="Nhóm nguồn clip")
    p.add_argument("--title", default=None, help="Tiêu đề clip (mặc định: tiêu đề video)")
    p.add_argument("--model", default="small", help="Whisper model: small/medium/large-v3... (mặc định small)")
    p.add_argument("--lang", default="en", help="Ngôn ngữ audio (mặc định en)")
    p.add_argument("--out-dir", type=Path, default=DEFAULT_OUT, help=f"Thư mục output (mặc định {DEFAULT_OUT})")
    return p.parse_args()


def extract_video_id(url: str) -> str | None:
    for pat in (
        r"(?:youtube\.com/watch\?(?:[^#]*&)?v=)([A-Za-z0-9_-]{11})",
        r"(?:youtu\.be/)([A-Za-z0-9_-]{11})",
        r"(?:youtube\.com/(?:shorts|embed|live)/)([A-Za-z0-9_-]{11})",
    ):
        m = re.search(pat, url)
        if m:
            return m.group(1)
    return None


def fmt_section_ts(sec: float) -> str:
    """'90.5' → '0:01:30.500' — dạng yt-dlp --download-sections nhận chắc chắn."""
    h = int(sec // 3600)
    m = int((sec % 3600) // 60)
    s = sec % 60
    return f"{h}:{m:02d}:{s:06.3f}"


def find_ffmpeg() -> str:
    exe = shutil.which("ffmpeg")
    if not exe:
        sys.exit(
            "LỖI: không tìm thấy ffmpeg.\n"
            "Cài bản static (không cần root): https://johnvansickle.com/ffmpeg/\n"
            "  tar -xJf ffmpeg-release-amd64-static.tar.xz\n"
            "  cp ffmpeg-*-static/{ffmpeg,ffprobe} ~/.local/bin/\n"
            "Hoặc: sudo apt install ffmpeg"
        )
    return exe


def probe_video(url: str) -> dict:
    import yt_dlp

    with yt_dlp.YoutubeDL({"quiet": True, "no_warnings": True, "noplaylist": True}) as ydl:
        return ydl.extract_info(url, download=False)


def download_audio(url: str, work_dir: Path, start: float | None, end: float | None) -> Path:
    """Tải audio (đoạn nếu có --start/--end) → trả về file audio nguồn trong work_dir."""
    import yt_dlp

    opts: dict = {
        "format": "bestaudio/best",
        "outtmpl": str(work_dir / "source.%(ext)s"),
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
        "force_keyframes_at_cuts": True,
    }
    if start is not None:
        end_ts = fmt_section_ts(end) if end is not None else "inf"
        opts["download_sections"] = [f"*{fmt_section_ts(start)}-{end_ts}"]

    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])

    sources = [f for f in work_dir.glob("source.*") if f.suffix != ".json"]
    if not sources:
        sys.exit("LỖI: yt-dlp không tải được audio.")
    return sources[0]


def to_wav(ffmpeg: str, src: Path, dst: Path) -> None:
    """Chuẩn hóa về wav 16kHz mono s16 — input mặc định của whisper."""
    proc = subprocess.run(
        [ffmpeg, "-y", "-i", str(src), "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(dst)],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        sys.exit(f"LỖI: ffmpeg convert thất bại:\n{proc.stderr[-2000:]}")


def wav_duration_ms(wav: Path) -> int:
    import wave

    with wave.open(str(wav), "rb") as w:
        return round(w.getnframes() / w.getframerate() * 1000)


def transcribe_words(wav: Path, model_name: str, lang: str) -> tuple[list[dict], list[dict], object]:
    """faster-whisper → (words, raw_segments, info)."""
    from faster_whisper import WhisperModel

    print(f"[transcribe] nạp model whisper '{model_name}' (lần đầu sẽ tải về)...", flush=True)
    model = WhisperModel(model_name, device="auto", compute_type="auto")
    print("[transcribe] đang nhận dạng...", flush=True)
    segments, info = model.transcribe(
        str(wav),
        language=lang,
        beam_size=5,
        word_timestamps=True,
        vad_filter=True,
        condition_on_previous_text=False,
    )

    words: list[dict] = []
    raw_segments: list[dict] = []
    for seg in segments:
        seg_words = []
        for w in seg.words or []:
            token = w.word.strip()
            if not token:
                continue
            words.append({"w": token, "s": round(w.start * 1000), "e": round(w.end * 1000)})
            seg_words.append({"w": token, "s": round(w.start * 1000), "e": round(w.end * 1000), "p": round(w.probability, 3)})
        raw_segments.append(
            {
                "startMs": round(seg.start * 1000),
                "endMs": round(seg.end * 1000),
                "text": seg.text.strip(),
                "words": seg_words,
                "noSpeechProb": round(seg.no_speech_prob, 3),
                "avgLogprob": round(seg.avg_logprob, 3),
            }
        )
    return words, raw_segments, info


def words_to_text(word_texts: list[str]) -> str:
    t = " ".join(x.strip() for x in word_texts)
    t = re.sub(r"\s+([,.;:!?…%’'\")\]])", r"\1", t)
    return t.strip()


def build_sentences(words: list[dict]) -> list[dict]:
    """Gom word thành câu: ngắt theo .!? + khoảng nghỉ, giữ câu trong [MIN, MAX] ms."""
    sentences: list[dict] = []
    cur: list[dict] = []

    def flush() -> None:
        if not cur:
            return
        n = len(sentences) + 1
        sentences.append(
            {
                "id": f"sent-{n:02d}",
                "text": words_to_text([w["w"] for w in cur]),
                "startMs": cur[0]["s"],
                "endMs": cur[-1]["e"],
                "words": [{"w": w["w"], "s": w["s"], "e": w["e"]} for w in cur],
                "clusters": [],
            }
        )
        cur.clear()

    for i, wd in enumerate(words):
        if cur and (wd["s"] - cur[-1]["e"]) > GAP_SPLIT_MS:
            flush()
        cur.append(wd)
        dur = cur[-1]["e"] - cur[0]["s"]
        next_gap = (words[i + 1]["s"] - wd["e"]) if i + 1 < len(words) else None
        at_end = i + 1 == len(words)
        if (
            (SENT_END_RE.search(wd["w"]) and dur >= MIN_SENT_MS)
            or dur >= MAX_SENT_MS
            or at_end
            or (next_gap is not None and next_gap > GAP_SPLIT_MS)
        ):
            flush()
    return sentences


def main() -> None:
    args = parse_args()
    ffmpeg = find_ffmpeg()

    print(f"[transcribe] probe video: {args.url}")
    info = probe_video(args.url)
    video_id = info.get("id") or extract_video_id(args.url) or "unknown"
    video_title = info.get("title") or ""

    start = args.start if args.start is not None else 0.0
    end = args.end
    if end is not None and end <= start:
        sys.exit("LỖI: --end phải lớn hơn --start.")

    clip_id = args.clip_id or (
        f"clip-{video_id}" if args.start is None else f"clip-{video_id}-{int(start)}"
    )
    title = args.title or video_title or clip_id

    work_dir = args.out_dir / clip_id
    work_dir.mkdir(parents=True, exist_ok=True)
    wav_path = work_dir / "audio.wav"

    print(f"[transcribe] tải audio → {work_dir}/")
    src = download_audio(args.url, work_dir, args.start if args.start else None, end)
    to_wav(ffmpeg, src, wav_path)
    if src != wav_path:
        src.unlink(missing_ok=True)

    duration_ms = wav_duration_ms(wav_path)
    print(f"[transcribe] audio: {duration_ms / 1000:.1f}s → nhận dạng với faster-whisper")

    words, raw_segments, wh_info = transcribe_words(wav_path, args.model, args.lang)
    if not words:
        sys.exit("LỖI: không nhận dạng được lời thoại nào (audio im lặng?).")

    sentences = build_sentences(words)
    print(f"[transcribe] {len(words)} từ · {len(sentences)} câu")

    canonical_url = f"https://www.youtube.com/watch?v={video_id}"
    start_offset_ms = round(start * 1000)
    if start_offset_ms > 0:
        canonical_url += f"&t={int(start)}s"

    clip = {
        "id": clip_id,
        "caseId": "",
        "videoId": video_id,
        "youtubeUrl": canonical_url,
        "startOffsetMs": start_offset_ms,
        "title": title,
        "durationSec": round(duration_ms / 1000, 2),
        "level": args.level,
        "category": args.category,
        # 2 phần dưới điền lúc annotate — xem tools/annotate-format.md
        "gistQuestion": {"prompt": "", "choices": [], "answerIndex": 0},
        "comprehension": [],
        "sentences": sentences,
    }

    meta = {
        "tool": "hearlock-transcribe",
        "version": 1,
        "sourceUrl": args.url,
        "videoTitle": video_title,
        "sectionStartMs": start_offset_ms,
        "sectionEndMs": (round(end * 1000) if end is not None else start_offset_ms + duration_ms),
        "model": args.model,
        "language": args.lang,
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "whisper": {
            "language": getattr(wh_info, "language", args.lang),
            "languageProbability": round(getattr(wh_info, "language_probability", 0.0), 3),
            "durationAfterVadMs": round(getattr(wh_info, "duration_after_vad", 0.0) * 1000),
        },
        "rawSegments": raw_segments,
    }

    clip_path = work_dir / f"{clip_id}.clip.json"
    meta_path = work_dir / f"{clip_id}.meta.json"
    clip_path.write_text(json.dumps(clip, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"[transcribe] xong → {clip_path}")
    print(f"[transcribe] meta → {meta_path}")
    print("[transcribe] bước tiếp theo: annotate cụm âm theo tools/annotate-format.md")


if __name__ == "__main__":
    main()
