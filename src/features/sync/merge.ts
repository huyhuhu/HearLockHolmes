/**
 * Toán tử hợp nhất (merge) cho dữ liệu học & game — dạng CRDT state-based.
 *
 * Mọi phép merge đều **giao hoán · kết hợp · lũy đẳng**: hai thiết bị ghi
 * độc lập, khi kéo hai bản về rồi hợp nhất thì hội tụ về cùng một trạng thái,
 * không mất mát và không đếm trùng (XP/achievement cấp theo key idempotent).
 *
 * Dùng cho: gộp dữ liệu "Khách lạ" vào tài khoản, và hợp nhất local ↔ Firestore.
 */
import type { ClueDoc, ClipProgress, LearnEvent } from "../../types/user";
import type {
  AchievementDoc,
  DailyMissionsSnapshot,
  DetectiveDoc,
  ExamMap,
  GameCounters,
  GameSnapshot,
  XpGrant,
} from "../../types/game";
import type { LocalSnapshot } from "../progress/store";

export const MAX_EVENTS = 400;
export const MAX_GRANTS = 800;

/** Khóa định danh một event — ưu tiên id, fallback tổ hợp trường. */
export function eventKey(e: LearnEvent): string {
  return e.id ?? `${e.type}::${e.clipId}::${e.clusterId ?? ""}::${e.at}`;
}

/** Khóa định danh một manh mối — ghi đè theo clip + cluster. */
export function clueKey(c: ClueDoc): string {
  return `${c.clipId}::${c.clusterId}`;
}

function mergeEvents(a: LearnEvent[], b: LearnEvent[]): LearnEvent[] {
  const map = new Map<string, LearnEvent>();
  for (const e of [...a, ...b]) {
    const key = eventKey(e);
    if (!map.has(key)) map.set(key, e);
  }
  return [...map.values()]
    .sort((x, y) => y.at - x.at || eventKey(x).localeCompare(eventKey(y)))
    .slice(0, MAX_EVENTS);
}

function mergeClues(a: ClueDoc[], b: ClueDoc[]): ClueDoc[] {
  const map = new Map<string, ClueDoc>();
  for (const c of [...a, ...b]) {
    const key = clueKey(c);
    const cur = map.get(key);
    // Last-write-wins theo decodedAt — giữ bản ghi gần nhất.
    if (!cur || c.decodedAt >= cur.decodedAt) map.set(key, c);
  }
  return [...map.values()].sort(
    (x, y) => y.decodedAt - x.decodedAt || clueKey(x).localeCompare(clueKey(y)),
  );
}

function mergeClipProgress(a: ClipProgress, b: ClipProgress): ClipProgress {
  const decodedClusters = Array.from(
    new Set([...(a.decodedClusters ?? []), ...(b.decodedClusters ?? [])]),
  ).sort();
  // completedAt = thời điểm hoàn thành sớm nhất (null = chưa xong).
  const completedAt =
    a.completedAt == null
      ? b.completedAt
      : b.completedAt == null
        ? a.completedAt
        : Math.min(a.completedAt, b.completedAt);
  return {
    listens: Math.max(a.listens ?? 0, b.listens ?? 0),
    gistPassed: Boolean(a.gistPassed || b.gistPassed),
    comprehensionScore: Math.max(a.comprehensionScore ?? 0, b.comprehensionScore ?? 0),
    decodedClusters,
    completedAt,
  };
}

export function mergeProgressSnapshot(
  a: LocalSnapshot,
  b: LocalSnapshot,
): LocalSnapshot {
  const progress: Record<string, ClipProgress> = { ...a.progress };
  for (const [clipId, p] of Object.entries(b.progress ?? {})) {
    const cur = progress[clipId];
    progress[clipId] = cur ? mergeClipProgress(cur, p) : p;
  }
  return {
    events: mergeEvents(a.events ?? [], b.events ?? []),
    clues: mergeClues(a.clues ?? [], b.clues ?? []),
    progress,
  };
}

function mergeGrants(a: XpGrant[], b: XpGrant[]): XpGrant[] {
  const map = new Map<string, XpGrant>();
  for (const g of [...a, ...b]) {
    // Idempotent theo key — chỉ tính XP một lần cho mỗi key.
    if (!map.has(g.key)) map.set(g.key, g);
  }
  return [...map.values()]
    .sort((x, y) => y.at - x.at || x.key.localeCompare(y.key))
    .slice(0, MAX_GRANTS);
}

function mergeAchievements(a: AchievementDoc[], b: AchievementDoc[]): AchievementDoc[] {
  const map = new Map<string, AchievementDoc>();
  for (const d of [...a, ...b]) {
    const cur = map.get(d.id);
    if (!cur || d.unlockedAt < cur.unlockedAt) map.set(d.id, d);
  }
  return [...map.values()].sort(
    (x, y) => y.unlockedAt - x.unlockedAt || x.id.localeCompare(y.id),
  );
}

function mergeDetective(
  a: DetectiveDoc | null,
  b: DetectiveDoc | null,
): DetectiveDoc | null {
  if (!a) return b;
  if (!b) return a;
  // Hồ sơ thám tử lập một lần — giữ bản tạo sớm nhất.
  return a.createdAt <= b.createdAt ? a : b;
}

function mergeDaily(
  a: Record<string, DailyMissionsSnapshot>,
  b: Record<string, DailyMissionsSnapshot>,
): Record<string, DailyMissionsSnapshot> {
  const out: Record<string, DailyMissionsSnapshot> = { ...a };
  for (const [date, snap] of Object.entries(b ?? {})) {
    const cur = out[date];
    if (!cur?.missions?.length) {
      out[date] = snap;
      continue;
    }
    const byId = new Map(cur.missions.map((m) => [m.id, m]));
    for (const m of snap.missions ?? []) {
      const c = byId.get(m.id);
      if (!c) {
        byId.set(m.id, m);
      } else {
        byId.set(m.id, {
          id: m.id,
          type: m.type,
          target: m.target,
          rewardXp: m.rewardXp,
          done: Math.max(c.done ?? 0, m.done ?? 0),
          claimed: Boolean(c.claimed || m.claimed),
        });
      }
    }
    out[date] = { missions: [...byId.values()].sort((x, y) => x.id.localeCompare(y.id)) };
  }
  return out;
}

function mergeExams(a: ExamMap, b: ExamMap): ExamMap {
  const out: ExamMap = { ...a };
  for (const [rank, rec] of Object.entries(b ?? {})) {
    if (!rec) continue;
    const key = rank as keyof ExamMap;
    const cur = out[key];
    if (
      !cur ||
      rec.score > cur.score ||
      (rec.score === cur.score && rec.passedAt < cur.passedAt)
    ) {
      out[key] = rec;
    }
  }
  return out;
}

function mergeCounters(a: GameCounters, b: GameCounters): GameCounters {
  return {
    gistFirstTry: Math.max(a?.gistFirstTry ?? 0, b?.gistFirstTry ?? 0),
    firstTryDecodes: Math.max(a?.firstTryDecodes ?? 0, b?.firstTryDecodes ?? 0),
    casesCracked: Array.from(
      new Set([...(a?.casesCracked ?? []), ...(b?.casesCracked ?? [])]),
    ).sort(),
  };
}

export function mergeGameSnapshot(a: GameSnapshot, b: GameSnapshot): GameSnapshot {
  return {
    detective: mergeDetective(a.detective ?? null, b.detective ?? null),
    xpGrants: mergeGrants(a.xpGrants ?? [], b.xpGrants ?? []),
    achievements: mergeAchievements(a.achievements ?? [], b.achievements ?? []),
    daily: mergeDaily(a.daily ?? {}, b.daily ?? {}),
    exams: mergeExams(a.exams ?? {}, b.exams ?? {}),
    counters: mergeCounters(a.counters, b.counters),
  };
}
