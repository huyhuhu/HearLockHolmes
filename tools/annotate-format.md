# Annotate format — cụm âm (GĐ2)

Tài liệu làm việc cho bước **annotate** sau khi chạy transcript pipeline.
Nguồn sự thật về quyết định: [`doc/SPEC.md`](../doc/SPEC.md) · types: [`src/types/content.ts`](../src/types/content.ts).

---

## 1. Pipeline — sinh scaffold

```bash
tools/transcribe.sh "<youtube-url>" --start 30 --end 90 --level 1 --category tech \
    --id clip-mkbhd-01 --title "Pixel review — camera"
```

| Cờ | Ý nghĩa |
|---|---|
| `--start` / `--end` | Giây bắt đầu/kết thúc đoạn clip trong video (clip 30–90s theo SPEC §1) |
| `--level` | Bậc khó 1–5 theo bậc thang SPEC §6 |
| `--category` | `tech` \| `game` \| `film` \| `series` \| `stream` |
| `--id` | Clip id (mặc định `clip-<videoId>[-<start>]`) |
| `--model` | Whisper model — `small` (mặc định, nhanh) hoặc `medium` (chính xác hơn) |

**Output** (`tools/out/<clipId>/` — gitignore, không commit audio):

```
<clipId>.clip.json   scaffold — shape Clip, words đã có timestamp, phần annotate còn trống
<clipId>.meta.json   thông tin pipeline (model, section, rawSegments để đối chiếu)
audio.wav            16kHz mono — cho tools/check_timestamps.py, KHÔNG commit (bản quyền)
```

## 2. Hệ toạ độ — clip-relative + `startOffsetMs`

- `sentences[].startMs/endMs`, `words[].s/e`, `cluster.span` = **ms tính từ đầu clip** (đoạn đã cắt).
- `startOffsetMs` = vị trí clip trong video gốc (0 nếu clip là cả video).
- Player YouTube seek tới `startOffsetMs + t` (GĐ3). `youtubeUrl` cũng mang `&t=<start>s` để mở lại đúng chỗ.

## 3. Format cụm âm (`clusters` trong mỗi câu)

Mỗi câu annotate **2–3 cụm** (nhiều quá thành nhiễu — SPEC §1). Mỗi cụm:

```jsonc
{
  "id": "clu-01",                    // duy nhất trong clip: clu-01, clu-02, ...
  "category": "reduced",             // 5 loại — xem bảng dưới
  "span": [1200, 1680],              // [startMs, endMs] clip-relative — bọc trọn cụm bị nuốt/nối
  "cleanForms": [                    // 3–4 lựa chọn "dạng sạch" — chọn đúng 1
    "What do you want to do tonight?",
    "What did you want to do tonight?",
    "What are you going to do tonight?",
    "Where do you want to go tonight?"
  ],
  "answerIndex": 0,                  // index của dạng sạch đúng trong cleanForms
  "note": "'What do you' → /wʌdjə/ — nuốt /t/, gộp thành 'whaddya'."  // 1 câu, cho người học
}
```

### 5 loại âm (`category`)

| category | Hiện tượng | Ví dụ đã nghe → dạng sạch |
|---|---|---|
| `reduced` | Nuốt/gọn — âm tiết mất đi, gộp từ | `whaddya` → *what do you* · `dunno` → *don't know* · `gonna` → *going to* |
| `liaison` | Nối — phụ âm cuối chạm nguyên âm đầu | `catch a` /tʃə/ nghe như một từ |
| `linking` | Nối phụ âm–nguyên âm giữa các từ | `turn‿off` /nɒ/ dính nhau |
| `elision` | Bỏ âm — âm vị biến mất hẳn | `last time` /lɑːs taɪm/ mất /t/ |
| `assimilation` | Đồng hoá — âm này nuốt theo âm kia | `don't you` /ˈdoʊntʃuː/ → "doncha" |

### Quy tắc span

- `span` nằm trong `[startMs, endMs]` của câu chứa nó (validator sẽ bắt lỗi).
- Bọc **trọn** vùng âm bị biến đổi — không rộng hơn quá 1 từ, không chỉ 1 phụ âm.
- Click "nghe đoạn đó" sẽ phát `[span[0]-1s, span[1]+1s]` (GĐ3) — span phải trúng đúng vùng cần nghe.
- Cụm bị nuốt thường **thấp năng lượng** — dùng `tools/check_timestamps.py` để xem biên span lệch bao nhiêu so với đáy năng lượng.

### Quy tắc cleanForms

- Đúng **1** đáp án (`answerIndex`); distractor **gần** dạng đúng — sai 1 âm tiết / sai thì / sai 1 từ khoá, không thảm hoạ.
- Không dùng "tất cả trên đều đúng" hay lựa chọn vô lý quá dễ loại.
- `note` 1 câu giải thích **vì sao nghe không ra** (cơ chế âm) — không phải bản dịch.

## 4. Quy trình annotate (scaffold → clip hoàn chỉnh)

1. **Sửa transcript về dạng nghe thật** — whisper cho ra chính tả chuẩn; người nghe nghe `whaddya wanna`. Sửa `text` của câu + `words[].w` cho khớp **nghe thật** (SPEC §8.3). Giữ nguyên timestamp.
2. **Chọn 2–3 cụm/câu** — ưu tiên reduced/nuốt, nơi timestamp hay trôi nhất. Điền `category`, `span`, `cleanForms`, `answerIndex`, `note`.
3. **Gist question** — 1 MCQ "câu hỏi hiện trường" mở khoá Phòng thí nghiệm: hỏi **chủ đề/đối tượng**, không hỏi chi tiết nghe mới ra.
4. **Comprehension** — đúng **3** MCQ hiểu nghĩa, gắn manh mối với ngữ cảnh vụ án (SPEC §1.3).
5. **Validate**:

```bash
tools/.venv/bin/python tools/validate_clip.py tools/out/<clipId>/<clipId>.clip.json
# mới annotate xong một phần, kiểm tra scaffold:
tools/.venv/bin/python tools/validate_clip.py tools/out/<clipId>/<clipId>.clip.json --scaffold
```

6. **Đo timestamp** (đặc biệt ở cụm bị nuốt):

```bash
tools/.venv/bin/python tools/check_timestamps.py \
    tools/out/<clipId>/<clipId>.clip.json tools/out/<clipId>/audio.wav
```

Đạt: biên từ ở câu thường median ≤ 300ms (done criteria GĐ2). Biên của cụm bị nuốt được báo riêng để quyết định có cần sửa span tay không.

7. Gắn `caseId`, copy vào seed data (GĐ4). **Không commit `audio.wav`.**

## 5. Từ scaffold sang Firestore

`clip.json` hoàn chỉnh map 1–1 với `clips/{clipId}` (SPEC §5). `meta.json` chỉ là phụ liệu pipeline — không seed lên Firestore.
