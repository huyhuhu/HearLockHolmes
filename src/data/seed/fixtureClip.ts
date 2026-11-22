import type { Clip, SeedData } from "../../types/content";

/**
 * Clip mẫu cho GĐ1 — kiểm tra shape của types.
 * Pipeline (GĐ2) sẽ xuất JSON đúng shape này; nội dung thật đến từ GĐ4.
 */
const fixtureClip = {
  id: "clip-fixture-01",
  caseId: "case-fixture",
  videoId: "dQw4w9WgXcQ",
  youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  title: "Fixture — phone call (reduced speech)",
  durationSec: 45,
  level: 3,
  category: "series",
  gistQuestion: {
    prompt: "Hai người đang bàn về chuyện gì?",
    choices: [
      "Kế hoạch tối nay",
      "Giá vé máy bay",
      "Bài tập về nhà",
      "Cuộc họp sáng mai",
    ],
    answerIndex: 0,
  },
  comprehension: [
    {
      prompt: "Người nói muốn làm gì tối nay?",
      choices: ["Đi ăn ngoài", "Ở nhà xem phim", "Đi xem phim", "Làm việc"],
      answerIndex: 2,
    },
    {
      prompt: "Đáp lại như thế nào?",
      choices: ["Từ chối", "Đồng ý ngay", "Hỏi lại giờ", "Cúp máy"],
      answerIndex: 1,
    },
    {
      prompt: "Âm nào bị nuốt nhiều nhất trong câu này?",
      choices: [
        "Cụm 'what do you want to'",
        "Từ 'tonight'",
        "Từ 'movie'",
        "Từ 'sounds'",
      ],
      answerIndex: 0,
    },
  ],
  sentences: [
    {
      id: "sent-01",
      text: "Whaddya wanna do tonight?",
      startMs: 1200,
      endMs: 2900,
      words: [
        { w: "Whaddya", s: 1200, e: 1680 },
        { w: "wanna", s: 1680, e: 1980 },
        { w: "do", s: 1980, e: 2120 },
        { w: "tonight?", s: 2120, e: 2900 },
      ],
      clusters: [
        {
          id: "clu-01",
          category: "reduced",
          span: [1200, 1680],
          cleanForms: [
            "What do you want to do tonight?",
            "What did you want to do tonight?",
            "What are you going to do tonight?",
            "Where do you want to go tonight?",
          ],
          answerIndex: 0,
          note: "'What do you' → /wʌdjə/ — nuốt /t/, gộp thành 'whaddya'.",
        },
        {
          id: "clu-02",
          category: "reduced",
          span: [1680, 1980],
          cleanForms: [
            "want to",
            "wanted",
            "going to",
            "have to",
          ],
          answerIndex: 0,
          note: "'want to' → 'wanna' — mất /t/, gộp 2 từ thành 1.",
        },
      ],
    },
    {
      id: "sent-02",
      text: "I dunno, maybe catch a movie?",
      startMs: 3400,
      endMs: 5600,
      words: [
        { w: "I", s: 3400, e: 3520 },
        { w: "dunno", s: 3520, e: 4100 },
        { w: "maybe", s: 4100, e: 4560 },
        { w: "catch", s: 4560, e: 4900 },
        { w: "a", s: 4900, e: 4980 },
        { w: "movie?", s: 4980, e: 5600 },
      ],
      clusters: [
        {
          id: "clu-03",
          category: "reduced",
          span: [3520, 4100],
          cleanForms: [
            "I don't know",
            "I do know",
            "I didn't know",
            "I don't care",
          ],
          answerIndex: 0,
          note: "'don't know' → 'dunno' /dəˈnoʊ/ — /t/ + /k/ bay mất.",
        },
        {
          id: "clu-04",
          category: "linking",
          span: [4560, 4980],
          cleanForms: [
            "catch a",
            "catch the",
            "catching a",
            "catch her",
          ],
          answerIndex: 0,
          note: "'catch a' — /tʃ/ nối thẳng vào /ə/, nghe như một từ 'catcha'.",
        },
      ],
    },
  ],
} satisfies Clip;

export const fixtureSeed: SeedData = {
  cases: [
    {
      id: "case-fixture",
      title: "The Night Call",
      titleVi: "Cuộc gọi đêm",
      level: 3,
      type: "small",
      clipIds: ["clip-fixture-01"],
      synopsis: "A short phone call — two speakers, heavy reduced speech.",
      synopsisVi: "Một cuộc gọi ngắn — hai người nói, reduced speech dày đặc.",
    },
  ],
  clips: [fixtureClip],
};
