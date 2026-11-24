#!/usr/bin/env bash
# tools/dev.sh — Chạy HearLockHolmes local để test bằng MỘT lệnh.
#
#   tools/dev.sh          Dev server + Firebase Emulator (Auth + Firestore).
#                         Đăng nhập Google GIẢ LẬP — không cần tài khoản Google thật.
#   tools/dev.sh --real   Dev server với Firebase THẬT (cần .env.local đầy đủ).
#
# Emulator (chế độ mặc định):
#   App            http://localhost:5173
#   Auth           127.0.0.1:9099   ·  Firestore   127.0.0.1:8080
#   Đăng nhập thử: /login → "Đăng nhập Google" → popup hiện "Add new account"
#                  → nhập email bất kỳ → "Sign in with Google.com".
#
# Dừng bằng Ctrl+C (tắt cả emulator + dev server).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

MODE="emu"
if [[ "${1:-}" == "--real" ]]; then
  MODE="real"
fi

# Project id phải khớp .env.local (emulator phục vụ đúng project ta khai báo).
PROJECT_ID="$(grep -E '^VITE_FIREBASE_PROJECT_ID=' .env.local 2>/dev/null | cut -d= -f2- | tr -d '[:space:]' || true)"
PROJECT_ID="${PROJECT_ID:-hearlockholmes}"

port_open() {
  (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null || return 1
  exec 3>&- 3<&-
  return 0
}

PIDS=()
cleanup() {
  for p in "${PIDS[@]:-}"; do
    kill "$p" 2>/dev/null || true
  done
}
trap cleanup INT TERM EXIT

# —— Java: dùng java sẵn có, hoặc JRE 21 portable ~/.cache/jre21 (tự tải, không cần sudo) ——
ensure_java() {
  if command -v java >/dev/null 2>&1; then
    return 0
  fi
  local jre_root="${HOME}/.cache/jre21"
  local jre_bin
  jre_bin="$(find "$jre_root" -maxdepth 4 -type f -path '*/bin/java' 2>/dev/null | head -1 || true)"
  if [[ -z "$jre_bin" ]]; then
    echo "→ Chưa có Java — tải JRE 21 portable về ${jre_root} (một lần, ~50 MB)..."
    mkdir -p "$jre_root"
    curl -sL "https://api.adoptium.net/v3/binary/latest/21/ga/linux/x64/jre/hotspot/normal/eclipse" \
      -o "${jre_root}/jre.tar.gz"
    tar -xzf "${jre_root}/jre.tar.gz" -C "$jre_root"
    rm -f "${jre_root}/jre.tar.gz"
    jre_bin="$(find "$jre_root" -maxdepth 4 -type f -path '*/bin/java' | head -1)"
  fi
  export JAVA_HOME="$(dirname "$(dirname "$jre_bin")")"
  export PATH="${JAVA_HOME}/bin:${PATH}"
}

if [[ "$MODE" == "real" ]]; then
  echo "═══ HearLockHolmes · Firebase THẬT ═══"
  echo "App: http://localhost:5173 — đăng nhập bằng Google thật"
  npm run dev
  exit 0
fi

echo "═══ HearLockHolmes · Firebase EMULATOR (không cần Google thật) ═══"

# —— Emulator: tái dùng nếu đang chạy, khởi động nếu chưa ——
if port_open 8080 && port_open 9099; then
  echo "→ Emulator đã chạy sẵn (Firestore :8080 · Auth :9099) — dùng lại."
elif port_open 8080 || port_open 9099; then
  echo "✗ Emulator đang chạy MỘT PHẦN (port 8080/9099 bị chiếm)." >&2
  echo "  Hãy tắt rồi chạy lại:  pkill -f emulators:start" >&2
  exit 1
else
  ensure_java
  echo "→ Khởi động Firebase Emulator (Auth :9099 · Firestore :8080 · project ${PROJECT_ID})..."
  npx -y firebase-tools@latest emulators:start \
    --project "$PROJECT_ID" --only auth,firestore &
  PIDS+=($!)
  echo -n "   Chờ emulator sẵn sàng"
  for _ in $(seq 1 60); do
    if port_open 8080 && port_open 9099; then
      echo " — OK"
      break
    fi
    echo -n "."
    sleep 1
  done
  if ! port_open 8080 || ! port_open 9099; then
    echo ""
    echo "✗ Emulator chưa lên sau 60s — xem log ở cửa sổ trên." >&2
    exit 1
  fi
fi

echo ""
echo "App:        http://localhost:5173"
echo "Đăng nhập:  /login → \"Đăng nhập Google\" → popup → \"Add new account\""
echo "            → email bất kỳ (vd test@example.com) → \"Sign in with Google.com\""
echo "Đa thiết bị: mở cửa sổ trình duyệt THỨ HAI (hoặc máy khác) cùng đăng nhập email đó"
echo "             để thấy tiến độ đồng bộ real-time."
echo "Dừng:       Ctrl+C"
echo ""

VITE_FIREBASE_EMULATOR=1 npm run dev &
PIDS+=($!)
wait