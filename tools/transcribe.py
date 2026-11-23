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
FRAME_MS = 10

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
    p.add_argument("--model", default="medium", help="Whisper model: medium (mặc định, timestamp chuẩn) / small (nhanh) / large-v3")
    p.add_argument("--device", default="cpu", choices=("cpu", "cuda", "auto"), help="Nơi chạy model (mặc định cpu)")
    p.add_argument("--compute-type", default=None, help="ctranslate2 compute_type (mặc định int8 trên cpu)")
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


def download_audio(url: str, work_dir: Path) -> Path:
    """Tải full audio (bestaudio) → trả về file nguồn trong work_dir.
    Cắt đoạn làm sau bằng ffmpeg (yt-dlp --download-sections bị bỏ qua khi gọi
    Python API, và đường cắt --force-keyframes-at-cuts của nó crash ffmpeg static)."""
    import yt_dlp

    opts: dict = {
        "format": "bestaudio/best",
        "outtmpl": str(work_dir / "source.%(ext)s"),
        "noplaylist": True,
        "quiet": True,
        "no_warnings": True,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])

    sources = [f for f in work_dir.glob("source.*") if f.suffix != ".json"]
    if not sources:
        sys.exit("LỖI: yt-dlp không tải được audio.")
    return sources[0]


def to_wav(ffmpeg: str, src: Path, dst: Path, start: float | None, end: float | None) -> None:
    """Cắt đoạn [start, end] + chuẩn hóa về wav 16kHz mono s16 trong 1 lần ffmpeg.
    -ss/-to trước -i: seek chính xác tới mẫu khi có re-encode."""
    cmd = [ffmpeg, "-y"]
    if start is not None:
        cmd += ["-ss", str(start)]
    if end is not None:
        cmd += ["-to", str(end)]
    cmd += ["-i", str(src), "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(dst)]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        sys.exit(f"LỖI: ffmpeg convert thất bại:\n{proc.stderr[-2000:]}")


def wav_duration_ms(wav: Path) -> int:
    import wave

    with wave.open(str(wav), "rb") as w:
        return round(w.getnframes() / w.getframerate() * 1000)


MIN_WORD_MS = 30


def read_wav_float32(wav: Path):
    """Đọc wav 16k mono s16le → float32 ndarray.
    Truyền thẳng ndarray vào whisper để không qua PyAV (faster-whisper 1.2.x
    gọi av.open(metadata_errors=...) — kwarg này hỏng với PyAV ≥19)."""
    import wave

    import numpy as np

    with wave.open(str(wav), "rb") as w:
        if w.getframerate() != 16000 or w.getnchannels() != 1 or w.getsampwidth() != 2:
            sys.exit("LỖI: audio.wav phải là 16kHz mono 16-bit (pipeline tự xuất đúng dạng này).")
        frames = w.readframes(w.getnframes())
    return np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0


def speech_bounds(x, rate: int) -> tuple[int, int]:
    """(sample đầu, sample cuối) của vùng lời thoại — dùng Silero VAD của
    faster-whisper (kháng room-tone tốt hơn ngưỡng năng lượng thủ công)."""
    from faster_whisper.vad import VadOptions, get_speech_timestamps

    segs = get_speech_timestamps(
        x,
        VadOptions(threshold=0.5, min_silence_duration_ms=500, speech_pad_ms=50),
        sampling_rate=rate,
    )
    if not segs:
        return 0, len(x)
    return segs[0]["start"], segs[-1]["end"]


def transcribe_words(
    wav: Path, model_name: str, lang: str, device: str, compute_type: str | None
) -> tuple[list[dict], list[dict], object, dict]:
    """faster-whisper → (words, raw_segments, info, trim_info).
    Cắt im lặng đầu/cuối trước khi nhận dạng: whisper hay neo từ đầu tiên vào mép
    file — dính vào khoảng nghỉ thì timestamp đầu câu lệch tới ±500ms."""
    import numpy as np

    from faster_whisper import WhisperModel

    x = read_wav_float32(wav)
    rate = 16000
    a, b = speech_bounds(x, rate)
    margin = int(rate * 0.1)  # giữ 100ms ngữ cảnh
    lead_ms = round(a / rate * 1000)
    trail_ms = round((len(x) - b) / rate * 1000)
    if lead_ms > 300 or trail_ms > 300:
        a2, b2 = max(0, a - margin), min(len(x), b + margin)
        offset_ms = round(a2 / rate * 1000)
        audio = np.ascontiguousarray(x[a2:b2])
        trim_info = {"leadTrimMs": offset_ms, "trailTrimMs": round((len(x) - b2) / rate * 1000)}
    else:
        offset_ms = 0
        audio = x
        trim_info = {"leadTrimMs": 0, "trailTrimMs": 0}

    ct = compute_type or ("int8" if device == "cpu" else "auto")
    print(f"[transcribe] nạp model whisper '{model_name}' ({device}/{ct}) — lần đầu sẽ tải về...", flush=True)
    model = WhisperModel(model_name, device=device, compute_type=ct)
    print("[transcribe] đang nhận dạng...", flush=True)
    segments, info = model.transcribe(
        audio,
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
            words.append(
                {
                    "w": token,
                    "s": round(w.start * 1000) + offset_ms,
                    "e": round(w.end * 1000) + offset_ms,
                }
            )
            seg_words.append(
                {
                    "w": token,
                    "s": round(w.start * 1000) + offset_ms,
                    "e": round(w.end * 1000) + offset_ms,
                    "p": round(w.probability, 3),
                }
            )
        raw_segments.append(
            {
                "startMs": round(seg.start * 1000) + offset_ms,
                "endMs": round(seg.end * 1000) + offset_ms,
                "text": seg.text.strip(),
                "words": seg_words,
                "noSpeechProb": round(seg.no_speech_prob, 3),
                "avgLogprob": round(seg.avg_logprob, 3),
            }
        )
    fix_degenerate_words(words)
    for seg in raw_segments:
        fix_degenerate_words(seg["words"])
    return words, raw_segments, info, trim_info


def fix_degenerate_words(words: list[dict]) -> None:
    """Whisper thỉnh thoảng cho từ zero-length (s == e) — kéo về tối thiểu MIN_WORD_MS."""
    for i, w in enumerate(words):
        if w["e"] - w["s"] >= MIN_WORD_MS:
            continue
        prev_end = words[i - 1]["e"] if i > 0 else 0
        new_s = w["e"] - MIN_WORD_MS
        w["s"] = max(new_s, prev_end)
        if w["e"] - w["s"] < MIN_WORD_MS:
            w["e"] = w["s"] + MIN_WORD_MS


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
    src = download_audio(args.url, work_dir)
    to_wav(ffmpeg, src, wav_path, args.start, end)
    if src != wav_path:
        src.unlink(missing_ok=True)

    duration_ms = wav_duration_ms(wav_path)
    print(f"[transcribe] audio: {duration_ms / 1000:.1f}s → nhận dạng với faster-whisper")

    words, raw_segments, wh_info, trim_info = transcribe_words(
        wav_path, args.model, args.lang, args.device, args.compute_type
    )
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
        "gistQuestion": {"prompt": {"vi": "", "en": ""}, "choices": [], "answerIndex": 0},
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
        "trim": trim_info,
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
