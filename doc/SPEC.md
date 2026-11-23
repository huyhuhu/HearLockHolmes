# HEARLOCK HOLMES — SPEC

> Nguồn sự thật của dự án. Thay đổi quyết định = sửa file này trước, code sau.
> Tagline: **"Every sound leaves a clue."**

Game luyện nghe tiếng Anh thể loại thám tử noir: nghe hiểu tiếng bản xứ tốc độ thật **chính là phá án**. Người học TOEIC ~750, quen audio làm sạch — cần công cụ xử lý âm thanh thật (nối âm, nuốt âm, nói nhanh), không phải thêm bài TOEIC.

---

## 1. Vòng lặp học (trái tim game)

Micro-loop **5–15 giây** trên từng câu thoại:

1. **NGHE MÙ (Hiện trường)** — nghe câu ở tốc độ thật, không chữ. Qua **cổng "câu hỏi hiện trường"** (1 gist MCQ, ví dụ "Nghi phạm đang nói về ai?") mới mở được Phòng thí nghiệm. Đúng/sai đều mở khóa; hiện "đoán trúng / trượt" làm hương vị.
2. **MỔ XẺ (Phòng thí nghiệm)** — transcript tương tác, highlight **2–3 cụm âm bị nuốt/nối** mỗi câu (nhiều quá thành nhiễu). Click cụm → nghe lại đúng đoạn đó (seek ±1s).
3. **GIẢI MÃ** — mỗi cụm có nhiệm vụ **chọn "dạng sạch"** trong 3–4 lựa chọn gần nhau (nghe `whaddya wanna…` → chọn *What do you want to…* vs distractor). Cộng 3 câu hiểu nghĩa MCQ gắn manh mối với ngữ cảnh vụ án.
4. **NGHE LẠI (Ghi vào hồ sơ)** — nghe lại sau khi đã hiểu vì sao nghe không ra; manh mối được ghi vào sổ tay (SRS nhắc lại — **backlog**).

Quy tắc: clip ngắn **30–90 giây**; timestamp cấp độ **TỪ** (word-level) để highlight khớp audio.

## 2. Quyết định kiến trúc

| Hạng mục | Quyết định |
|---|---|
| Audio | **YouTube IFrame seek** — web không host audio/video. Click cụm → seek tới word-timestamp ±1s; A–B loop + playbackRate (0.75/1.0/1.25) tự dựng bằng seek + timer. Backlog: import audio local cho snippet chính xác hơn |
| Transcript | **yt-dlp + faster-whisper local** (word timestamps) → agent sửa + **annotate curated** 2–3 cụm/câu. Không AI đoán già đoán non. Miễn phí, dữ liệu ở lại máy |
| Stack | **Vite + React + TypeScript**. Tailwind chỉ làm công cụ layout; **design tokens custom hoàn toàn** |
| Database | **Firestore**. Content hệ thống (`cases/clips`) tách bạch dữ liệu người dùng (`users/{uid}/...`) |
| Xác minh mổ xẻ | **Chọn dạng sạch** của câu (3–4 lựa chọn gần nhau) + 3 câu hiểu nghĩa MCQ |
| UI language | **Song ngữ VI/EN**, toggle nhanh trên top bar. Audio/transcript luôn tiếng Anh |
| Theme | Toggle sáng/tối trên top bar. Mặc định **noir đêm** (chàm đen + hổ phách); sáng = **"ban ngày tại văn phòng"** (giấy ngả vàng, mực đen) — không phải light theme mặc định |
| Avatar | **6 chân dung noir** (imagegen, sinh 1 lần) + archetype (cựu cảnh sát / phóng viên điều tra / chuyên gia giám định âm thanh / thám tử tư / hacker mũ xám / nhà báo) |
| Firebase | Scaffold đọc config từ `.env.local`. MVP chạy **local**; Firebase Hosting khi nào muốn. README có các bước bật Google Sign-in |
| Seed content | Agent research & seed 5 clip L1→L5 theo bậc thang; **user duyệt danh sách nguồn trước khi chốt** |

## 3. Gameplay & kinh tế (mặc định, sửa được)

### Vụ án (Case Files)
- **Vụ nhỏ** = 3 clip manh mối liên hoàn cùng chủ đề. Phá án = hiểu nghĩa **≥70% mỗi clip** + giải mã **≥1 cụm/clip**.
- **Boss (Vụ án lớn)** = 1 đoạn **full speed, không phụ đề** (đối chất / phiên tòa / stream). Phá án = hiểu nghĩa **≥70%** VÀ giải mã **≥60% cụm** annotate.
- Thử lại thoải mái; **chỉ lần đầu** tính XP/rank.

### XP (từ hành vi học thật — không click ảo)
| Hành vi | XP |
|---|---|
| Giải mã đúng cụm âm (lần đầu) | +15 |
| Hiểu nghĩa clip ≥70% | +30 |
| Phá vụ nhỏ | +80 |
| Phá boss | +200 |
| Nhiệm vụ ngày | +10–20 |

### Rank — thăng theo nghe THẬT
`Thám tử tập sự` → `Thám tử kỳ cựu` (≥1500 XP) → `Thám tử lừng danh` (≥4000 XP).
Mỗi lần lên rank phải qua **kỳ sát hạch**: 1 đoạn full speed không phụ đề, đạt ngưỡng mới phong hàm.

### Nhiệm vụ ngày (Daily Investigation)
3 chiếc/ngày (vd: "lắng nghe 3 lời khai", "giải mã 5 đoạn nối âm"). **Không streak, không phạt nghỉ** — chỉ là nhật ký điều tra.

### Hồ sơ năng lực (cá nhân hóa — thống kê đơn giản, không AI đoán)
5 loại âm: **liaison** (nối) · **reduced speech** (nuốt/gọn) · **elision** (bỏ âm) · **linking** (nối phụ âm–nguyên âm) · **assimilation** (đồng hóa).
Nguồn dữ liệu: số lần replay, tua lại, chọn sai dạng sạch, tự chấm "vẫn còn mơ". Hiện "% mất dấu theo loại âm" + nút **"Gợi án tiếp theo"** (chọn clip nặng đúng loại âm yếu).

## 4. Thẩm mỹ (ràng buộc cứng)

Film noir hiện đại: nền **đen/chàm tối**, đèn **hổ phách** hoặc **đỏ neon le lói**, mưa + **film grain**, font **máy chữ** (Special Elite) cho hồ sơ vụ án, ảnh **polaroid** ghim manh mối lên bảng điều tra, **waveform animated** là bằng chứng sống của UI. Logo stylize kiểu **neon sign / biển văn phòng thám tử**.

- Font: **Be Vietnam Pro** (UI + display — dấu tiếng Việt thẳng hàng, thiết kế riêng cho VN) + **Special Elite** *chỉ* cho logo/nhãn brand tiếng Anh (typewriter, không có subset vietnamese — cấm dùng cho chữ Việt).
- **Cấm**: gradient tím, hero 3 cột, font Inter, "mặc định AI", bảng thành tích rực rỡ.
- "Sống động" = nhịp game lôi cuốn, không phải trang trí ồn ào.

### Responsive (điện thoại & máy tính bảng — hạng nhất, không phải "thêm sau")

Người học dùng **điện thoại và tablet** hằng ngày — mọi màn hình phải dùng được ở **viewport 375px**:

- **Môi trường đích: trình duyệt Via trên Android (Android WebView)** — tránh API mới chưa có trong WebView; ưu tiên CSS transforms/transitions, touch target ≥ 40px, không hover-only, không autoplay âm thanh. Kiểm tra thêm Chrome Android + desktop Firefox.
- Top bar: 2 hàng trên phone (logo + toggle ở hàng trên, nav hàng dưới); touch target **≥ 40px**.
- Micro-loop: nút điều khiển băng (play/pause, A–B, tốc độ, replay) xếp vừa **ngón cái** — không hover-only; bảng chọn "dạng sạch" và MCQ **full-width** trên phone.
- Transcript (mổ xẻ): cụm highlight đủ lớn để tap; không cuộn ngang.
- Tablet coi như phone cỡ lớn (1–2 cột), không tận dụng hover.

Mọi GĐ có UI đều phải kiểm tra ở **375px / 768px / desktop** trước khi đánh dấu xong.

## 5. Data model (Firestore)

```
# SYSTEM CONTENT — public read, admin write
cases/{caseId}   { title, titleVi, level, type: 'small'|'boss', clipIds[], synopsis }
clips/{clipId}   { caseId, videoId, youtubeUrl, startOffsetMs, title, durationSec, level, category,
                   gistQuestion { prompt, choices[4], answerIndex },
                   comprehension[{ question, choices[4], answerIndex }],
                   sentences[{ id, text, startMs, endMs,
                     words[{ w, s, e }],
                     clusters[{ id, category, span[startMs,endMs],
                                cleanForms[3–4], answerIndex }] }] }

# USER DATA — owner-only read/write
users/{uid}                { displayName, email, avatarId, archetype, rank, xp, lang, theme, createdAt }
users/{uid}/clues/{clueId} { clipId, clusterId, decodedAt, attempts, correct }
users/{uid}/progress/{id}  { listens, gistPassed, comprehensionScore, decodedClusters[], completedAt }
users/{uid}/events/{id}    { type: replay|seek|decode_hit|decode_miss|self_fuzzy, clipId, clusterId?, category?, at }
users/{uid}/daily/{date}   { missions[{ id, type, target, done, rewardXp }] }
users/{uid}/exams/{rank}   { passedAt, score }
```

Toạ độ thời gian: `startMs/endMs`, `words[].s/e`, `span` là **ms tính từ đầu clip** (đoạn 30–90s đã cắt);
`startOffsetMs` = vị trí clip trong video gốc (0 nếu clip = cả video). Player YouTube seek tới
`startOffsetMs + t`. Pipeline (`tools/transcribe.sh`) sinh đúng toạ độ này.

## 6. Nội dung — kho tư liệu điều tra

Web **không host video** (bản quyền) — chỉ link YouTube + transcript tương tác. Ưu tiên series đối thoại dày (sitcom, drama, crime) hơn phim hành động; chủ đề "con trai thích": game, tech, phim.

**Bậc thang độ khó:**
1. Tech review (MKBHD, Linus…) — lời rõ, tốc độ vừa
2. Series có phụ đề — lời thoại tự nhiên
3. Gaming review/commentary — tốc độ nhanh, slang
4. Phim đối thoại dày — nuốt âm, cảm xúc
5. Stream live — nhiễu, nói chồng (**boss cuối**)

**Seed MVP**: 5 clip (mỗi cấp 1 clip) → gom thành **1 vụ nhỏ (3 clip)** + **1 boss**. Agent research, user duyệt nguồn trước.

## 7. Phạm vi

### MVP (đang làm)
- [ ] A. Đăng nhập Google qua Firebase
- [ ] B. Vòng lặp học: nghe mù → mổ xẻ → giải mã cụm → nghe lại
- [ ] C. Game layer tối thiểu: thám tử + rank/XP + vụ nhỏ + nhiệm vụ ngày + 1 boss
- [ ] D. Cá nhân hóa gợi ý từ hành vi mổ xẻ

### Backlog (có tên — chưa làm)
Shadowing (giả giọng, so waveform) · SRS nhắc lại · vụ án nhiều lớp/bí ẩn · bảng điều tra manh mối · thành tích/sưu tầm · multiplayer so tài · mở rộng đọc/viết/nói · import audio local · gap-fill dictation · Firebase Hosting.

## 8. Quy trình content (chống sai lệch)

1. Agent research link YouTube theo bậc thang → **user duyệt list nguồn**.
2. Pipeline local: `yt-dlp` (audio) → `faster-whisper --word_timestamps True` → JSON scaffold.
3. Agent sửa transcript (đúng dạng nghe thật, vd `whaddya`) + annotate 2–3 cụm/câu (category + cleanForms + distractor).
4. Gắn clip vào vụ án → seed vào Firestore (hoặc JSON seed lúc chưa có Firebase).
5. Gameplay chỉ được điều khiển bởi dữ liệu học thật này — không hardcode "thắng".
