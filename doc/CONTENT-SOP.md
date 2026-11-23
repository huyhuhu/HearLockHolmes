# CONTENT SOP — Quy trình tạo data clip/case (model rẻ chạy được)

Tài liệu vận hành cho việc **nạp thêm clip/case** vào HearLock Holmes (GĐ4 trở đi, và các web project tương tự).
Mục tiêu: model đắt chỉ phán đoán hẹp · model rẻ điền form · validator là cổng chất lượng duy nhất · người duyệt 2 gate.

Nguồn sự thật: [`doc/SPEC.md`](./SPEC.md) · format annotate: [`tools/annotate-format.md`](../tools/annotate-format.md)

---

## 0. Nguyên tắc

1. **Mọi việc cơ khí đều script hoá** (`tools/transcribe.sh`, `tools/apply_overlay.py`, `tools/validate_clip.py`) — model không gõ JSON dài tay, chỉ sinh *overlay* rồi script áp vào scaffold.
2. **Model rẻ chỉ điền form có schema** (§4) — sai là validator trả lại, subagent tự sửa và chạy lại. Không tin model rẻ "làm đúng một lần".
3. **Nghe audio đúng 1 lần/clip**, bởi model có tai; không nhúng audio vào context của bước khác.
4. **2 gate người**: (1) duyệt danh sách nguồn trước khi transcribe, (2) spot-check 1 clip/đợt sau khi assemble.

## 1. Phân công & model gợi ý

| Việc | Ai làm | Ghi chú |
|---|---|---|
| Duyệt danh sách nguồn | **Người** | Gate 1 — bắt buộc, không skip |
| Chọn cửa sổ 30–90s | Script (whisper `tiny`) + model lớn chốt | Không đưa audio vào context |
| Sửa heard-form (nghe 1 pass/clip) | Model có tai (pro/tầm trung) | Rất hẹp: 30–90s → danh sách `sent_id → text` |
| Annotate form + draft case | **Model rẻ (flash)**, song song N clip | `actor spawn --model <flash>` subagent `general` |
| Lắp ráp + validate + build | Script | ~0 token |
| Spot-check | **Người** | Gate 2 |

Model trên máy hiện tại — flash: `mimo-v2.6-flash`, `mimo-flash`, `deepseek-v4.1-flash`, `glm-5.3-flash`, `qwen3.8-flash`; có tai: `mimo-v2.6-pro` và tương đương.
Spawn: `actor` → `{"action":"spawn","subagent_type":"general","model":"mimo-v2.6-flash", ...}` (đính `task_id` nếu có task).

## 2. Gate 1 — Chốt nguồn

- Bậc thang SPEC §6: **1** tech (lời rõ, vừa) · **2** series (đối thoại tự nhiên) · **3** gaming (nhanh, slang) · **4** phim (đối thoại dày) · **5** stream (nhiễu, nói chồng — **boss cuối**).
- Mỗi nguồn trình user: `URL · videoId (11 ký tự) · kênh · thời lượng · bậc · lý do · cửa sổ dự kiến`.
- **Chưa được transcribe trước khi user duyệt.** Thay nguồn = chạy lại từ đầu nguồn đó.

## 3. Bước scaffold (script, ~0 token)

```bash
tools/transcribe.sh "<youtube-url>" --start <s> --end <e> --id <clip-id> \
    --level <1-5> --category tech|game|film|series|stream --title "<tiêu đề>"
# → tools/out/<clipId>/<clipId>.clip.json (+ .meta.json + audio.wav — KHÔNG commit audio)
```

**Chưa biết video nói gì → map lời thoại bằng whisper `tiny` trước** (rẻ, không nhúng audio vào model):

```bash
export PATH="$HOME/.local/bin:$PATH"
# tải audio về wav 16k mono rồi:
tools/.venv/bin/python - <<'EOF'
import subprocess, numpy as np
from faster_whisper import WhisperModel
raw = subprocess.run(['ffmpeg','-loglevel','error','-i','<wav>','-f','s16le','-ar','16000','-ac','1','-'],
                     capture_output=True).stdout
audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
m = WhisperModel('tiny', device='cpu', compute_type='int8')
for s in m.transcribe(audio, language='en', vad_filter=True)[0]:
    print(f"{s.start:7.1f}-{s.end:7.1f}  {s.text.strip()}")
EOF
```

> **Bẫy đã gặp:** `model.transcribe('<path>')` vỡ với PyAV (`metadata_errors`) — **phải** decode bằng ffmpeg → numpy rồi truyền mảng.

**Quy tắc cửa sổ:** 30–90s (SPEC §1) · không dính sponsor/intro/outro · chọn đoạn lời thoại dày, 2–3 hiện tượng âm/câu · sau khi gộp câu còn **8–12 câu** là đẹp (nhiều quá thì chọn đoạn ngắn hơn).

## 4. Bước heard-form (model có tai — 1 pass/clip)

Input: `audio.wav` của clip + scaffold. Output: `sent_id → text nghe thật` (+ ghi chú câu ghép/tách).

- `text` = **dạng nghe thật**: `"Whaddya wanna do tonight?"`, `"sorta"`, `"dunno"`, `"witchu"`.
- `words[].w` = chính tả transcript; **chỉ sửa lỗi chắc chắn** (tên riêng, từ nghe nhầm: `Code Ray→Code Red`, `Lysia→Lucia`, `mall→mole`, `Wunsch→Wuntch`).
- Câu cắt dở đầu/cuối cửa sổ: đánh dấu `…`; drop mảnh thừa vô nghĩa (vd `"It is."`).
- Câu whisper ghép sai/short quá: gộp/tách theo ranh giới word-timestamp (overlay `parts` lo phần này).

## 5. Bước annotate (model rẻ — sinh overlay JSON)

### 5.1 Input cấp cho subagent (phải tự chứa, không dựa context chat)

1. `tools/out/<clipId>/<clipId>.clip.json` (scaffold — đã có words + timestamp)
2. Text heard-form (bước 4)
3. [`tools/annotate-format.md`](../tools/annotate-format.md) — bảng 5 loại âm + quy tắc span/cleanForms/note
4. 2 clip vàng đối chiếu: `src/data/seed/clipTed01.ts`, `src/data/seed/gd4Seed.ts`
5. Schema overlay dưới đây + prompt template §5.4

### 5.2 Overlay schema

```jsonc
{
  "caseId": "case-gta-leak",                  // hoặc "case-drill-01" nếu clip lẻ
  "gistQuestion": {
    "prompt": { "vi": "…", "en": "…" },        // hỏi chủ đề/đối tượng, KHÔNG hỏi chi tiết
    "choices": [ { "vi": "…", "en": "…" }, ×4 ],  // đúng 4, distractor hợp lý
    "answerIndex": 0                            // rải đều vị trí đáp án qua các câu hỏi
  },
  "comprehension": [ /* đúng 3 × MultipleChoice — gắn manh mối với vụ án */ ],
  "sentences": [
    {
      "parts": [["sent-01", 0, 24], ["sent-02", 0, 3]],  // gộp/tách theo word-index [start, end)
      // hoặc từ tự tạo: ["@m", [{"w": "him.", "s": 19010, "e": 19300}]]
      "text": "dạng NGHE THẬT của câu",
      "wordFixes": { "0": "GTA" },             // optional
      "replace": { "Wunsch": "Wuntch" },        // optional — thay mọi words[].w
      "clusters": [                             // 1–3 cụm/câu (validator bắt 1–3; chừa câu ngắn 1 cụm)
        {
          "words": [12, 13],                    // span suy từ word index [i0..i1] của câu sau gộp
          "category": "reduced|liaison|elision|linking|assimilation",
          "cleanForms": ["dạng đúng", "distractor gần", "distractor gần", "distractor gần"],
          "answerIndex": 0,
          "note": { "vi": "1 câu giải thích CƠ CHẾ âm", "en": "…" }
        }
      ]
    }
  ]
}
```

### 5.3 Quy tắc chất lượng (validator + người đều chấm theo đây)

- **cleanForms**: đúng 1 đáp án; distractor gần — sai 1 âm tiết / sai thì / sai 1 từ khoá; không "tất cả trên đều đúng"; luôn tiếng Anh.
- **note**: 1 câu, giải thích *vì sao nghe không ra* (cơ chế âm), **không phải bản dịch**; song ngữ `{vi,en}`.
- **Comprehension**: đúng 3 câu × 4 lựa chọn; `answerIndex` rải đều (không phải luôn = 0).
- **Gist**: hỏi chủ đề/đối tượng của đoạn; 4 lựa chọn; 1 đáp án rõ.

### 5.4 Prompt template cho subagent flash

```text
Bạn là annotator ngôn ngữ cho app học nghe tiếng Anh. Nhiệm vụ: sinh file overlay JSON
từ scaffold clip + text nghe thật, theo schema trong doc/CONTENT-SOP.md §5.2 và quy tắc
trong tools/annotate-format.md. Đối chiếu phong cách 2 clip vàng (clipTed01, gd4Seed).

Đầu vào: <đường dẫn scaffold>, <heard-form>, <đường dẫn 2 clip vàng>.
Đầu ra: ghi tools/out/_tmp/overlay_<clipId>.json rồi chạy:
  tools/.venv/bin/python tools/apply_overlay.py <scaffold> tools/out/_tmp/overlay_<clipId>.json --write
  tools/.venv/bin/python tools/validate_clip.py <scaffold>
Nếu validator báo lỗi: SỬA overlay và chạy lại cho tới khi pass. Báo lại: số câu, số cụm, số MCQ.
```

## 6. Bước lắp ráp (script)

```bash
# 1. overlay → clip hoàn chỉnh + validate [final] (bắt: 1–3 cụm/câu, 3 comprehension, 4 lựa chọn, caseId)
tools/.venv/bin/python tools/apply_overlay.py tools/out/<id>/<id>.clip.json tools/out/_tmp/overlay_<id>.json --write
tools/.venv/bin/python tools/validate_clip.py tools/out/<id>/<id>.clip.json

# 2. sinh seed TS (đọc 5 clip JSON + cases → src/data/seed/gd4Seed.ts, satisfies SeedData)
#    mẫu: xem generator trong GĐ4 — hoặc copy gd4Seed.ts rồi thay mảng clips/cases.
# 3. nối src/data/seed/index.ts (seedClips + seedCases) + link từ HomePage nếu cần
npm run build
```

**Case file** (model rẻ soạn nháp, người duyệt Gate 2): `id, title, titleVi, level, type: 'small'|'boss', clipIds[], synopsis, synopsisVi`.
Ngưỡng phá án (SPEC §3, tính từ `ClipProgress`, unlock ở Case Board — GĐ5):
vụ nhỏ = hiểu ≥70% **mỗi clip** + giải mã ≥1 cụm/clip · boss = hiểu ≥70% **và** giải mã ≥60% cụm.

## 7. Gate 2 — QC người (5 phút/đợt)

- [ ] Nghe 1 clip/đợt (ưu tiên clip khó nhất) — heard-form có tự nhiên không, note có đúng cơ chế âm không
- [ ] Bấm 1 loop trọn trên UI: nghe mù → gist gate → mổ xẻ → giải mã (cleanForms distractor có "gần" không)
- [ ] Toggle VI/EN — câu hỏi đổi theo lang
- [ ] `validate_clip.py` pass toàn bộ + `npm run build` pass

## 8. Bẫy đã gặp (đừng lặp)

| Bẫy | Cách tránh |
|---|---|
| PyAV vỡ khi `model.transcribe(path)` | ffmpeg → numpy → truyền mảng (§3) |
| `pkill -f "x"` tự giết shell chứa lệnh đó | Dùng PID hoặc pattern không tự khớp |
| Cửa sổ lọt mất câu then chốt | Map whisper tiny trước, chọn cửa sổ quanh câu đó |
| Whisper hallucinate/ghép sai (vd "because of" ↔ "He caused a") | Heard-form pass bắt buộc; so audio |
| Timestamp words chồng lấn | `apply_overlay.py` đã tự sanitize |
| Commit audio / `.env.local` | `tools/out/**/audio.wav` + `.env.local` nằm ngoài git |
| Gom nhiều GĐ vào 1 commit | Commit theo đơn vị logic ("commit từ từ") |
