/**
 * Level curve & rank (SPEC §3 — Game layer).
 *
 * Level 1→∞: cấp L→L+1 cần `100 + 40×(L−1)` XP (L2=100 · L3=+140 · L4=+180…).
 * 1 clip giải mã trọn ≈ 250–350 XP → lên 1–2 cấp/bài học (nhịp phản hồi nhanh).
 * Rank vẫn 3 bậc theo SPEC + kỳ sát hạch: trainee → veteran (≥1500) → legend (≥4000).
 */
import type { Rank } from "../../types/user";

export const XP = {
  decodeHit: 15,
  clipComprehension: 30,
  caseSmall: 80,
  caseBoss: 200,
  dailyMin: 10,
  dailyMax: 20,
  examPass: 50,
  achievementMin: 10,
  achievementMax: 30,
} as const;

export const RANK_XP: Record<Exclude<Rank, "trainee">, number> = {
  veteran: 1500,
  legend: 4000,
};

/** XP cần cho bước level→level+1 */
export function xpForStep(level: number): number {
  return 100 + 40 * Math.max(0, level - 1);
}

/** Tổng XP để đạt level (level 1 = 0) */
export function cumulativeXpForLevel(level: number): number {
  if (level <= 1) return 0;
  const n = level - 1;
  return 100 * n + (40 * n * (n - 1)) / 2;
}

export type LevelState = {
  level: number;
  /** XP đã đổ vào cấp hiện tại */
  intoLevel: number;
  /** XP cần để qua cấp kế */
  needForNext: number;
  /** 0..1 */
  progress: number;
  totalXp: number;
};

export function levelFromXp(totalXp: number): LevelState {
  let level = 1;
  while (cumulativeXpForLevel(level + 1) <= totalXp && level < 999) {
    level += 1;
  }
  const base = cumulativeXpForLevel(level);
  const needForNext = xpForStep(level);
  const intoLevel = Math.max(0, totalXp - base);
  return {
    level,
    intoLevel,
    needForNext,
    progress: needForNext > 0 ? Math.min(1, intoLevel / needForNext) : 0,
    totalXp,
  };
}

export function rankFromXp(totalXp: number): Rank {
  if (totalXp >= RANK_XP.legend) return "legend";
  if (totalXp >= RANK_XP.veteran) return "veteran";
  return "trainee";
}

/** Rank tiếp theo + ngưỡng XP — null nếu đã max */
export function nextRank(rank: Rank): { rank: Rank; threshold: number } | null {
  if (rank === "trainee") return { rank: "veteran", threshold: RANK_XP.veteran };
  if (rank === "veteran") return { rank: "legend", threshold: RANK_XP.legend };
  return null;
}

/** Rank mà kỳ sát hạch nhắm tới (exam = phong hàm bậc kế) */
export function examTargetRank(current: Rank): Exclude<Rank, "trainee"> | null {
  if (current === "trainee") return "veteran";
  if (current === "veteran") return "legend";
  return null;
}

/** Đủ điều kiện dự sát hạch: XP đạt ngưỡng VÀ chưa giữ rank kế */
export function canTakeExam(totalXp: number, held: Rank): boolean {
  const target = examTargetRank(held);
  if (!target) return false;
  return totalXp >= RANK_XP[target];
}
