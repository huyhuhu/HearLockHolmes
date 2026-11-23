# HEARLOCK HOLMES — DEV PLAN

Kế hoạch triển khai theo giai đoạn. Mỗi giai đoạn có **đầu ra** và **định nghĩa hoàn thành** (done criteria) kiểm chứng được.
Trạng thái: `[ ]` chưa làm · `[~]` đang làm · `[x]` xong.

Nguồn sự thật về quyết định: [`doc/SPEC.md`](./SPEC.md).

---

## GĐ0 — Nền & giao diện khung `[x]` (T1.1)

**Đầu ra:** app chạy `npm run dev`, có design tokens noir, top bar đủ nút, i18n VI/EN, theme sáng/tối, Firebase scaffold + nút Đăng nhập Google.

Các bước:
- [x] Scaffold Vite + React + TS + Tailwind v4 (chỉ layout; tokens custom)
- [x] Design tokens: chàm đen / hổ phách / neon đỏ / giấy; font Special Elite + IBM Plex Sans; grain overlay
- [x] Theme provider (dark mặc định, light "văn phòng ban ngày"), persist localStorage
- [x] i18n provider VI/EN + toggle nhanh trên top bar
- [x] Top bar: logo Hearlock + tagline · nav (Sổ vụ án / Nhiệm vụ / Hồ sơ) · toggle lang · toggle theme · chip user
- [x] Firebase: `src/lib/firebase.ts` đọc `VITE_FIREBASE_*`, Google Sign-in, trang Login; `.env.example`
- [x] README: các bước tạo Firebase project, bật Google Auth, chạy local

**Done khi:** `npm run build` pass; mở app thấy trang chủ noir với top bar đổi được ngôn ngữ + theme; nút Google Sign-in hiện trạng thái "chưa cấu hình / đã đăng nhập".

## GĐ1 — Data model & types `[x]` (T1.2)

**Đầu ra:** types TypeScript + định dạng seed JSON khớp SPEC §5; không phụ thuộc Firebase để dev offline được.

- [x] `src/types/`: content (Case, Clip, Sentence, Word, Cluster, MultipleChoice, SeedData) + user (UserDoc, ClueDoc, ClipProgress, LearnEvent, DailyMission, ExamRecord)
- [x] `src/data/seed/fixtureClip.ts` — 1 clip mẫu `satisfies Clip` đủ mọi trường (2 câu, 4 cụm)
- [x] Firestore schema: map 1–1 với types, doc tại SPEC §5 (rule: user chỉ ghi `users/{uid}`)

**Done khi:** `tsc` pass với types; fixture load được vào UI placeholder; so khớp được với SPEC §5.

## GĐ2 — Transcript pipeline `[x]` (T1.3)

**Đầu ra:** script local sinh transcript word-timestamps + format annotate cụm âm.

- [x] `tools/transcribe.sh` (hoặc .mjs): yt-dlp lấy audio → faster-whisper word timestamps → JSON
- [x] `tools/annotate-format.md`: format cluster (category ∈ liaison/reduced/elision/linking/assimilation, span, cleanForms[3–4], answerIndex)
- [x] Chạy thử 1 clip thật, đo độ lệch timestamp ở cụm bị nuốt

**Done khi:** 1 clip ra JSON đúng schema; word timestamps khớp audio ±300ms ở câu thường.
→ Đạt: scaffold validate pass (`tools/validate_clip.py --scaffold`); |lệch| trung vị 33ms so onset thật, 14/16 câu trong ±300ms; đo 3 cụm bị nuốt tại `tools/samples/clip-ted-01.timestamp-report.txt`.

## GĐ3 — Micro-loop học `[x]` (T1.4) ★ trái tim

**Đầu ra:** đi được 1 câu thoại trọn loop: nghe mù → gist gate → mổ xẻ → chọn dạng sạch → nghe lại.

- [x] Player YouTube IFrame wrapper: seek tới timestamp, A–B loop (seek+timer), playbackRate 0.75/1.0/1.25
- [x] Waveform animated (bằng chứng sống) + controls kiểu máy băng từ
- [x] Màn NGHE MÙ: không chữ, chỉ player + câu hỏi hiện trường (gist MCQ) mở khóa
- [x] Màn MỔ XẺ: transcript từng câu, highlight 2–3 cụm, click cụm → play đúng đoạn ±1s
- [x] Nhiệm vụ GIẢI MÃ: chọn dạng sạch (3–4 lựa chọn) + 3 câu hiểu nghĩa MCQ
- [x] Màn NGHE LẠI: phát lại full câu + ghi manh mối (ghi local trước, Firestore sau)
- [x] Ghi event: replay, seek, decode_hit/miss, self_fuzzy
- [x] Responsive: kiểm tra micro-loop ở 375px / 768px — controls bấm được bằng ngón cái, không hover-only

**Done khi:** đi hết loop 1 câu với clip thật; mọi lần "nghe đoạn đó" trúng đúng span; không nhìn chữ trước khi qua gist gate; dùng được trên điện thoại (375px).
→ Đạt: đi trọn loop câu `sent-02` clip thật `clip-ted-01` (nghe mù → mổ xẻ → giải mã → nghe lại → đóng hồ sơ). "Nghe đoạn đó" đo được: con trỏ băng wrap về đúng 4.97% (= `span[0]−1s` = 2982ms) và giữ trong `[2982, 5682]` = span ±1s. Màn NGHE MÙ không render transcript — chỉ mở sau gist gate. 375/768/1280px không tràn ngang; mọi touch target ≥ 40px; cụm highlight hiện sẵn (không hover-only). Event ghi đủ 4 loại + 2 manh mối vào localStorage.

## GĐ4 — Seed content `[x]` (T1.5)

**Đầu ra:** 5 clip L1–L5 đã annotate; 1 vụ nhỏ (3 clip) + 1 boss.

- [x] Research danh sách nguồn theo bậc thang (tech → series → gaming → phim → stream) → **user duyệt**
- [x] Transcribe + annotate 2–3 cụm/câu (curated)
- [x] Gom thành 1 vụ nhỏ (3 clip manh mối liên hoàn) + 1 boss full speed
- [x] Gist question + comprehension MCQ cho từng clip
- [x] Song ngữ cho câu hỏi nội dung (gist/comprehension) — hiện `MultipleChoice` chỉ có 1 chuỗi, đổi lang UI không đổi câu hỏi (phát hiện khi QA GĐ3 ở EN)

**Done khi:** user duyệt list nguồn; 5 clip chạy được trong micro-loop; vụ nhỏ + boss phá được theo ngưỡng SPEC §3.
→ Đạt: user duyệt 5 nguồn + cách gom (LTT `f0KK_4AaqLQ` · B99 `AS38I3esj0o` · Skill Up `RFhRJaWtbYc` · A Few Good Men `9FnO3igOkOk` · GTA stream `sh-64G5jlic`). 5 clip annotate xong, `validate_clip.py` [final] pass: **62 câu · 118 cụm** · 5 gist + 15 comprehension (đúng 3/clip × 4 lựa chọn, song ngữ `{vi,en}`). Vụ nhỏ `case-gta-leak` "Bản build GTA 6 bị lộ" (L1+L2+L3, manh mối liên hoàn) + boss `case-boss-stream` "Ai là nội gián?" (L5, full speed, nói chồng) trong `src/data/seed/gd4Seed.ts`; clip lẻ L4 (AFJM) để luyện + ứng viên kỳ sát hạch. `MultipleChoice` đã `{vi,en}` từ types/UI (GĐ3) — QA toggle EN đổi câu hỏi theo lang. `npm run build` pass; đi trọn loop clip L1 trên UI thật (nghe mù → gist gate → mổ xẻ → giải mã cleanForms), 5/5 clip qua cổng nghe mù không lộ transcript, 375/768px OK. Ngưỡng phá vụ (vụ nhỏ ≥70% hiểu + ≥1 cụm/clip; boss ≥70% hiểu + ≥60% cụm) tính được từ `ClipProgress` — logic unlock để Case Board (GĐ5).

## GĐ5 — Game layer `[ ]` (T1.6)

**Đầu ra:** nhân vật, rank/XP, Case Board, nhiệm vụ ngày, kỳ sát hạch.

- [ ] Tạo thám tử: tên + chọn 1/6 chân dung noir (imagegen) + archetype + hồ sơ flavor
- [ ] XP/rank theo bảng SPEC; lưu `users/{uid}` (hoặc localStorage khi chưa auth)
- [ ] Case Board: danh sách vụ nhỏ + boss, trạng thái manh mối, mở khóa khi đủ điều kiện
- [ ] Nhiệm vụ ngày: 3/ngày, không streak, +XP nhẹ
- [ ] Kỳ sát hạch lên rank (đoạn full speed không phụ đề, đạt ngưỡng)

**Done khi:** tạo được thám tử, thấy rank/XP tăng bởi hành vi học thật, phá 1 vụ nhỏ + 1 boss, nhiệm vụ ngày chạy và reset theo ngày.

## GĐ6 — Cá nhân hóa + polish `[ ]` (T1.7)

**Đầu ra:** hồ sơ năng lực 5 loại âm + gợi án tiếp; thẩm mỹ noir hoàn chỉnh; QA.

- [ ] Tổng hợp event → "% mất dấu theo loại âm" + "Gợi án tiếp theo" (rule đơn giản, không AI)
- [ ] Polish visual: grain, polaroid, neon logo, waveform, empty state kiểu hồ sơ vụ án
- [ ] Light theme "văn phòng ban ngày" hoàn chỉnh (không phải light mặc định)
- [ ] QA golden path: đăng nhập → tạo thám tử → nhiệm vụ ngày → nghe mù → mổ xẻ → phá vụ nhỏ → boss → hồ sơ năng lực
- [ ] QA edge: Firebase chưa cấu hình / chưa đăng nhập / tua sai timestamp / clip dài
- [ ] QA responsive: 375px (điện thoại) / 768px (tablet) / desktop — cả 2 theme, cả 2 ngôn ngữ

**Done khi:** golden path đi trơn trên cả 2 theme + cả 2 ngôn ngữ; hồ sơ năng lực phản ánh đúng dữ liệu mổ xẻ; dùng được trên điện thoại và tablet.

---

## Ràng buộc xuyên suốt

- **Mobile-first**: user học trên điện thoại + tablet — mỗi GĐ có UI phải kiểm tra viewport 375px/768px trước khi chốt (xem SPEC §4 "Responsive").
- **Không** host video/audio YouTube — chỉ embed + transcript.
- Game layer **không hardcode thắng** — mọi trạng thái từ dữ liệu học thật.
- **Cấm** Inter, gradient tím, hero 3 cột, gamification ồn ào (streak phạt, bảng vàng rực rỡ).
- Feature ngoài MVP → thêm vào Backlog trong SPEC, không làm ngay.
- Sau mỗi GĐ: chạy `npm run build` + tự đi golden path của GĐ đó trước khi đánh dấu xong.
- **Git**: commit theo từng GĐ/đơn vị logic ("commit từ từ"), không gom một cục; không commit `.env.local`.

## Thứ tự ưu tiên khi cần cắt scope

1. GĐ3 micro-loop (đáng giá nhất — thiếu nó game vô nghĩa)
2. GĐ4 content (có loop + content là học được ngay)
3. GĐ5 game layer tối thiểu (rank + vụ nhỏ + nhiệm vụ ngày)
4. GĐ6 cá nhân hóa + polish (mượt thêm, không chặn học)
