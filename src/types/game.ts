/**
 * Game layer (GĐ5) — hồ sơ thám tử, XP/level, thành tựu, nhiệm vụ ngày, sát hạch.
 * Map vào `users/{uid}/...` SPEC §5 khi có Firestore; dev local bằng localStorage.
 */

import type { SoundCategory } from "./content";
import type { Rank } from "./user";

export type AvatarId =
  | "avatar-cop"
  | "avatar-journalist"
  | "avatar-audio"
  | "avatar-pi"
  | "avatar-hacker"
  | "avatar-reporter";

export type ArchetypeId = AvatarId;

export interface DetectiveDoc {
  name: string;
  avatarId: AvatarId;
  archetype: ArchetypeId;
  /** 1 câu flavor do người học tự chọn hoặc sinh theo archetype */
  motto: string;
  createdAt: number;
}

export type XpSource =
  | "decode_hit"
  | "clip_comprehension"
  | "case_small"
  | "case_boss"
  | "daily_mission"
  | "achievement"
  | "exam_pass";

/** users/{uid}/xpGrants — chỉ cộng XP lần đầu theo key idempotent */
export interface XpGrant {
  /** ví dụ `decode:clip-ltt-01:clu-01` — grant trùng key = bỏ qua */
  key: string;
  source: XpSource;
  amount: number;
  at: number;
}

export interface AchievementDoc {
  id: string;
  unlockedAt: number;
}

/** users/{uid}/exams/{rank} */
export type ExamMap = Partial<Record<Rank, { passedAt: number; score: number }>>;

export interface GameSnapshot {
  detective: DetectiveDoc | null;
  xpGrants: XpGrant[];
  achievements: AchievementDoc[];
  /** yyyy-mm-dd → missions (đã cộng done) */
  daily: Record<string, DailyMissionsSnapshot>;
  exams: ExamMap;
  /** đếm sự kiện không suy ra được từ progressStore */
  counters: GameCounters;
}

export interface GameCounters {
  gistFirstTry: number;
  firstTryDecodes: number;
  /** id case đã phá — "chỉ lần đầu tính XP" */
  casesCracked: string[];
}

export interface DailyMissionsSnapshot {
  missions: {
    id: string;
    type: "listen_clips" | "decode_clusters" | "replay_sentences";
    target: number;
    done: number;
    rewardXp: number;
    claimed: boolean;
  }[];
}

/** Sự kiện game do UI bắn lên — GameProvider xử lý XP + thành tựu + nhiệm vụ ngày */
export type GameEventKind =
  | "detective_created"
  | "gist_pass"
  | "gist_miss"
  | "decode_hit"
  | "decode_miss"
  | "replay"
  | "seek"
  | "self_fuzzy"
  | "clue_filed"
  | "clip_completed"
  | "comprehension_scored"
  | "case_cracked"
  | "daily_completed"
  | "exam_passed"
  | "level_up";

export interface GameEventInput {
  kind: GameEventKind;
  clipId?: string;
  clusterId?: string;
  category?: SoundCategory;
  caseId?: string;
  caseType?: "small" | "boss";
  value?: number;
  firstTry?: boolean;
}
