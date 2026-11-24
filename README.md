# HEARLOCK HOLMES

> **"Every sound leaves a clue."** — Game luyện nghe tiếng Anh thể loại thám tử noir:
> nghe hiểu tiếng bản xứ tốc độ thật **chính là phá án**.

Đi một câu thoại trọn vòng **nghe mù → mổ xẻ → giải mã → ghi hồ sơ** trên clip 30–90 giây,
xử lý đúng thứ người học TOEIC ~750 sợ nhất: nối âm, nuốt âm, nói nhanh. Phá vụ án = nghe ra.

**Công nghệ:** Vite + React + TypeScript · Tailwind v4 (design tokens custom — noir) ·
Firebase Auth + Firestore (local-first, đồng bộ đa thiết bị) · YouTube IFrame (không host video).

📖 [`doc/SPEC.md`](doc/SPEC.md) — nguồn sự thật · [`doc/DEV-PLAN.md`](doc/DEV-PLAN.md) — kế hoạch &
trạng thái · [`doc/CONTENT-SOP.md`](doc/CONTENT-SOP.md) — quy trình nạp clip mới

---

## Chạy local

```bash
npm install
tools/dev.sh          # dev server + Firebase Emulator — KHÔNG cần tài khoản Google
```

Xong. App ở **http://localhost:5173**. Dừng bằng **Ctrl+C**.

`tools/dev.sh` tự lo: kiểm tra Java (tự tải JRE 21 portable nếu thiếu) → bật
Auth `127.0.0.1:9099` + Firestore `127.0.0.1:8080` (tái dùng nếu đang chạy) → chạy dev server
với `VITE_FIREBASE_EMULATOR=1`.

Các biến thể:

```bash
tools/dev.sh --real   # Firebase THẬT (cần .env.local đầy đủ — xem bên dưới)
npm run dev           # dev server thường, không emulator
npm run build         # tsc + vite → dist/
```

### Đăng nhập khi dùng Emulator (giả lập Google)

1. Mở `/login` → bấm **Đăng nhập Google** → popup "Auth Emulator" hiện ra.
2. **Add new account** → nhập email bất kỳ (vd `test@example.com`) → **Sign in with Google.com**.
3. Học vài câu rồi mở **cửa sổ trình duyệt thứ hai** (hoặc máy khác) đăng nhập cùng email —
   tiến độ sẽ **tự đồng bộ real-time** giữa 2 "thiết bị".

Chưa đăng nhập vẫn học được bình thường ở chế độ **Khách lạ** (localStorage).

## Firebase thật (production)

1. [Firebase Console](https://console.firebase.google.com/) → **Add project** (vd `hearlockholmes`).
2. **Build → Authentication → Sign-in method → Google → Enable**.
3. **Authentication → Settings → Authorized domains** — đảm bảo có `localhost`.
4. **Project settings → Your apps → Web (`</>`)** — đăng ký app, copy config.
5. Copy `.env.example` thành `.env.local`, dán config vào 6 biến `VITE_FIREBASE_*`.
6. **Build → Firestore Database → Create database** — Production mode, region gần bạn
   (project đang chạy dùng `asia-northeast1` Tokyo).
7. Tab **Rules** → dán nội dung [`firestore.rules`](firestore.rules) → **Publish**
   (owner-only `users/{uid}`; `cases/clips` public-read).
8. `tools/dev.sh --real` — nút **Đăng nhập Google** hoạt động bằng tài khoản thật.

⚠️ Không commit `.env.local` (đã có trong `.gitignore`).

## Đồng bộ đa thiết bị (local-first)

- Học trước, ghi **localStorage** trước — mạng yếu không bao giờ chặn việc học.
- Đăng nhập lần đầu: dữ liệu "Khách lạ" được **gộp vào tài khoản** (idempotent, không mất tiến độ).
- Hai thiết bị cùng tài khoản thấy tiến độ của nhau **real-time** (`onSnapshot`), hợp nhất bằng
  **CRDT merge** (`src/features/sync/merge.ts` — giao hoán · kết hợp · lũy đẳng): không mất dữ
  liệu, không đếm trùng XP/thành tựu. Offline giữ "pending", tự đẩy khi có mạng.

## Deploy

- **GitHub Pages**: workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) tự build
  với base `/HearLockHolmes/` khi push.

## Kiểm thử / QA

- **E2E emulator** (đăng nhập giả lập → gộp Guest → đẩy/lấy Firestore → 2 thiết bị thấy tiến độ
  của nhau) + **golden path** + **responsive 375/768/1280px**: 20 screenshot bằng chứng đã QA
  (không commit vào repo — xem lại trong git history commit `67c66ff`) — chi tiết trong
  [`doc/DEV-PLAN.md`](doc/DEV-PLAN.md) GĐ7.
- Nạp clip/case mới: theo [`doc/CONTENT-SOP.md`](doc/CONTENT-SOP.md);
  `tools/validate_clip.py` là cổng chất lượng.

## Cấu trúc

```
src/
  features/loop/       micro-loop: nghe mù → mổ xẻ → giải mã → nghe lại
  features/game/       thám tử, XP/level, thành tựu, Case Board, nhiệm vụ ngày, Wren
  features/progress/   event học + hồ sơ năng lực 5 loại âm
  features/sync/       đồng bộ Firestore: CRDT merge · push/pull · onSnapshot
  features/auth/       Firebase Auth (Google) + chế độ Khách lạ
  data/seed/           clip L1–L5 + vụ án (vụ nhỏ + boss)
tools/                 transcribe · annotate · validate_clip · dev.sh
doc/                   SPEC · DEV-PLAN · CONTENT-SOP
```

## Ràng buộc xuyên suốt

- **Mobile-first**: mọi màn hình dùng được ở viewport **375px** (mục tiêu: trình duyệt Via trên
  Android) — touch target ≥ 40px, không hover-only.
- Không host video/audio YouTube — chỉ embed + transcript.
- Game layer **không hardcode thắng** — mọi trạng thái tính từ dữ liệu học thật.
- Thẩm mỹ noir: xem ràng buộc chi tiết tại [`doc/SPEC.md`](doc/SPEC.md) §4.
