/**
 * Dữ liệu người dùng (user) — map 1–1 với `users/{uid}/...` theo doc/SPEC.md §5.
 * Rule: user chỉ đọc/ghi được nhánh của chính mình.
 */

import type { SoundCategory } from "./content";

export type Rank = "trainee" | "veteran" | "legend";

export interface UserDoc {
  displayName: string;
  email: string;
  avatarId: string;
  archetype: string;
  rank: Rank;
  xp: number;
  lang: "vi" | "en";
  theme: "dark" | "light";
  createdAt: number;
}

/** users/{uid}/clues/{clueId} — manh mối đã ghi vào sổ tay */
export interface ClueDoc {
  clipId: string;
  clusterId: string;
  decodedAt: number;
  attempts: number;
  correct: boolean;
}

/** users/{uid}/progress/{clipId} */
export interface ClipProgress {
  listens: number;
  gistPassed: boolean;
  /** 0..1 */
  comprehensionScore: number;
  decodedClusters: string[];
  completedAt: number | null;
}

export type LearnEventType =
  | "replay"
  | "seek"
  | "decode_hit"
  | "decode_miss"
  | "self_fuzzy";

/** users/{uid}/events/{id} — nhiên liệu cho hồ sơ năng lực */
export interface LearnEvent {
  type: LearnEventType;
  clipId: string;
  clusterId?: string;
  category?: SoundCategory;
  at: number;
}

export interface DailyMission {
  id: string;
  type: "listen_clips" | "decode_clusters" | "replay_sentences";
  target: number;
  done: number;
  rewardXp: number;
}

/** users/{uid}/daily/{yyyy-mm-dd} */
export interface DailyLog {
  missions: DailyMission[];
}

/** users/{uid}/exams/{rank} — kỳ sát hạch thăng cấp */
export interface ExamRecord {
  passedAt: number;
  /** 0..1 */
  score: number;
}
