/**
 * Content hệ thống (system) — map 1–1 với Firestore `cases/{caseId}` & `clips/{clipId}`
 * theo doc/SPEC.md §5. Public read, admin write.
 */

export type SoundCategory =
  | "liaison"
  | "reduced"
  | "elision"
  | "linking"
  | "assimilation";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type ClipCategory = "tech" | "game" | "film" | "series" | "stream";

export interface Word {
  /** dạng chính tả trong transcript */
  w: string;
  /** start — ms tính từ đầu clip */
  s: number;
  /** end — ms */
  e: number;
}

export interface Cluster {
  id: string;
  category: SoundCategory;
  /** [startMs, endMs] của cụm bị nuốt/nối trong clip */
  span: [number, number];
  /** 3–4 lựa chọn "dạng sạch" — chọn đúng 1 */
  cleanForms: string[];
  answerIndex: number;
  /** vì sao nghe không ra (1 câu, cho người học) */
  note?: string;
}

export interface Sentence {
  id: string;
  /** dạng NGHE THẬT (vd: "Whaddya wanna do tonight?") */
  text: string;
  startMs: number;
  endMs: number;
  words: Word[];
  /** 2–3 cụm cần chú ý — nhiều quá thành nhiễu */
  clusters: Cluster[];
}

export interface MultipleChoice {
  prompt: string;
  choices: string[];
  answerIndex: number;
}

export interface Clip {
  id: string;
  caseId: string;
  videoId: string;
  youtubeUrl: string;
  /** vị trí clip trong video gốc (ms) — 0 nếu clip = cả video. Player seek tới startOffsetMs + t */
  startOffsetMs: number;
  title: string;
  durationSec: number;
  level: DifficultyLevel;
  category: ClipCategory;
  /** cổng "nghe mù" — mở khóa Phòng thí nghiệm */
  gistQuestion: MultipleChoice;
  /** 3 câu hiểu nghĩa — gắn manh mối với vụ án */
  comprehension: MultipleChoice[];
  sentences: Sentence[];
}

export interface CaseFile {
  id: string;
  title: string;
  titleVi: string;
  level: DifficultyLevel;
  type: "small" | "boss";
  clipIds: string[];
  synopsis: string;
  synopsisVi: string;
}

export interface SeedData {
  cases: CaseFile[];
  clips: Clip[];
}
