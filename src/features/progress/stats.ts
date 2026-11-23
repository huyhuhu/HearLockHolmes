/**
 * Hồ sơ năng lực — tổng hợp event thành "% mất dấu theo loại âm" + "gợi án tiếp theo".
 * Rule đơn giản, không AI (SPEC §3):
 *   mất dấu = 3×decode_miss + 2×self_fuzzy + seek + replay
 *   bắt lại = 3×decode_hit
 *   % mất dấu = mất / (mất + bắt lại); null khi chưa có dữ liệu.
 * Gợi án: chọn clip chưa xong, nặng đúng loại âm yếu nhất (nhiều cụm loại đó × % mất dấu).
 */
import type { SoundCategory, Clip } from "../../types/content";
import type { LearnEvent, ClipProgress } from "../../types/user";

export const SOUND_CATEGORIES: SoundCategory[] = [
  "liaison",
  "reduced",
  "elision",
  "linking",
  "assimilation",
];

export type CategoryStat = {
  category: SoundCategory;
  hits: number;
  misses: number;
  seeks: number;
  replays: number;
  fuzzies: number;
  /** 0..1 — null khi chưa có tín hiệu nào */
  lossPct: number | null;
};

export type SoundStats = Record<SoundCategory, CategoryStat>;

function emptyStat(category: SoundCategory): CategoryStat {
  return {
    category,
    hits: 0,
    misses: 0,
    seeks: 0,
    replays: 0,
    fuzzies: 0,
    lossPct: null,
  };
}

/** Event có thể chạm 1 loại (category) hoặc nhiều loại (categories) */
function eventCategories(e: LearnEvent): SoundCategory[] {
  if (e.category) return [e.category];
  return e.categories ?? [];
}

export function computeSoundStats(events: LearnEvent[]): SoundStats {
  const stats = Object.fromEntries(
    SOUND_CATEGORIES.map((c) => [c, emptyStat(c)]),
  ) as SoundStats;

  for (const e of events) {
    const cats = eventCategories(e);
    for (const cat of cats) {
      const s = stats[cat];
      if (!s) continue;
      if (e.type === "decode_hit") s.hits += 1;
      else if (e.type === "decode_miss") s.misses += 1;
      else if (e.type === "seek") s.seeks += 1;
      else if (e.type === "replay") s.replays += 1;
      else if (e.type === "self_fuzzy") s.fuzzies += 1;
    }
  }

  for (const cat of SOUND_CATEGORIES) {
    const s = stats[cat];
    const loss = s.misses * 3 + s.fuzzies * 2 + s.seeks + s.replays;
    const gain = s.hits * 3;
    s.lossPct = loss + gain > 0 ? loss / (loss + gain) : null;
  }
  return stats;
}

export type NextSuggestion = {
  clipId: string;
  /** loại âm yếu đang nhắm tới (null = gợi ý theo bậc thang) */
  weakCategory: SoundCategory | null;
  /** clip đã đi hết — gợi ý luyện lại */
  redo: boolean;
};

function clipClusterCount(clip: Clip): number {
  return clip.sentences.reduce((n, s) => n + s.clusters.length, 0);
}

function clipCompletion(clip: Clip, progress: ClipProgress | undefined): number {
  const total = clipClusterCount(clip);
  const decoded = progress?.decodedClusters.length ?? 0;
  const decPart = total > 0 ? Math.min(1, decoded / total) : 1;
  const compPart = Math.min(1, (progress?.comprehensionScore ?? 0) / 0.7);
  return Math.min(1, (decPart + compPart) / 2);
}

/**
 * Gợi án tiếp theo — chọn clip chưa hoàn tất, nặng đúng loại âm yếu.
 * Chưa có dữ liệu → clip bậc thấp nhất chưa bắt đầu (bậc thang L1→L5).
 */
export function suggestNextClip(
  events: LearnEvent[],
  clips: Clip[],
  allProgress: Record<string, ClipProgress>,
): NextSuggestion | null {
  if (clips.length === 0) return null;
  const stats = computeSoundStats(events);

  // loại âm yếu = % mất dấu cao nhất trong loại đã có tín hiệu
  const withData = SOUND_CATEGORIES.filter((c) => stats[c].lossPct !== null).sort(
    (a, b) => (stats[b].lossPct ?? 0) - (stats[a].lossPct ?? 0),
  );
  const weak = withData[0] ?? null;

  const completionOf = (clip: Clip) =>
    clipCompletion(clip, allProgress[clip.id]);

  // chưa đủ dữ liệu → đi theo bậc thang L1→L5, ưu tiên clip chưa bắt đầu
  if (!weak) {
    const sorted = [...clips].sort((a, b) => {
      const diff = completionOf(a) - completionOf(b);
      return diff !== 0 ? diff : a.level - b.level;
    });
    const best = sorted[0];
    return {
      clipId: best.id,
      weakCategory: null,
      redo: completionOf(best) >= 1,
    };
  }

  const scored = clips.map((clip) => {
    const completion = completionOf(clip);
    let density = 0;
    for (const s of clip.sentences) {
      for (const cl of s.clusters) {
        if (cl.category === weak) {
          // nặng đúng loại yếu: mỗi cụm cộng theo mức mất dấu hiện tại
          density += 1 + (stats[cl.category].lossPct ?? 0);
        }
      }
    }
    return { clip, completion, density };
  });

  // ưu tiên clip chưa hoàn tất; trong đó nặng loại âm yếu nhất; tie-break bậc thấp
  scored.sort((a, b) => {
    const aDone = a.completion >= 1 ? 1 : 0;
    const bDone = b.completion >= 1 ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;
    if (b.density !== a.density) return b.density - a.density;
    if (a.completion !== b.completion) return a.completion - b.completion;
    return a.clip.level - b.clip.level;
  });

  const best = scored[0];
  return {
    clipId: best.clip.id,
    weakCategory: weak,
    redo: best.completion >= 1,
  };
}
