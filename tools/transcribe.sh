#!/usr/bin/env bash
# HearLock Holmes — transcript pipeline (GĐ2).
# yt-dlp → ffmpeg → faster-whisper → JSON scaffold (shape Clip).
#
# Cách dùng:
#   tools/transcribe.sh <youtube-url> [--start GIÂY] [--end GIÂY] [--id CLIP_ID]
#                       [--level 1-5] [--category tech|game|film|series|stream]
#                       [--title TIÊU_ĐỀ] [--model small|medium|...] [--lang en]
#
# Ví dụ:
#   tools/transcribe.sh "https://www.youtube.com/watch?v=abc123" --start 30 --end 90 --level 1
#
# Output: tools/out/<clipId>/<clipId>.clip.json (scaffold) + .meta.json + audio.wav
# Yêu cầu: python3, ffmpeg (trong PATH hoặc ~/.local/bin). Xem tools/annotate-format.md.

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV="$DIR/.venv"
PY="$VENV/bin/python"

# ffmpeg: PATH hoặc bản static trong ~/.local/bin
export PATH="${HOME}/.local/bin:${PATH}"
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "LỖI: thiếu ffmpeg. Cài bản static (không cần root):" >&2
  echo "  https://johnvansickle.com/ffmpeg/ → giải nén, copy ffmpeg + ffprobe vào ~/.local/bin/" >&2
  exit 1
fi

# Bootstrap venv tools (chỉ lần đầu)
if [ ! -x "$PY" ]; then
  echo "[transcribe] tạo venv tại $VENV ..."
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install --quiet --upgrade pip
  "$VENV/bin/pip" install --quiet faster-whisper yt-dlp
fi

exec "$PY" "$DIR/transcribe.py" "$@"
