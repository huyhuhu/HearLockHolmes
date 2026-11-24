/**
 * Kho game local (localStorage) — "ghi local trước, Firestore sau" (SPEC §5).
 *
 * Map khi có auth:
 *   detective  → users/{uid}
 *   xpGrants   → users/{uid}/xpGrants   (idempotent — chỉ tính XP lần đầu)
 *   achievements → users/{uid}/achievements
 *   daily      → users/{uid}/daily/{yyyy-mm-dd}
 *   exams      → users/{uid}/exams/{rank}
 */
import type { Rank } from "../../types/user";
import type {
  AchievementDoc,
  DailyMissionsSnapshot,
  DetectiveDoc,
  ExamMap,
  GameCounters,
  GameSnapshot,
  XpGrant,
  XpSource,
} from "../../types/game";
import { missionsForDate, todayKey } from "./daily";
import { notifyStoreChange } from "../../lib/storeEvents";
import { scopedKey } from "../../lib/sync/storageScope";

const STORAGE_KEY = "hearlock.game.v1";

const EMPTY_COUNTERS: GameCounters = {
  gistFirstTry: 0,
  firstTryDecodes: 0,
  casesCracked: [],
};

export function emptyGameSnapshot(): GameSnapshot {
  return {
    detective: null,
    xpGrants: [],
    achievements: [],
    daily: {},
    exams: {},
    counters: { ...EMPTY_COUNTERS, casesCracked: [] },
  };
}

/** Đọc snapshot tại một key tường minh (dùng cho migration/sync engine). */
export function readGameAt(key: string): GameSnapshot {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return emptyGameSnapshot();
    const p = JSON.parse(raw) as Partial<GameSnapshot>;
    return {
      detective: p.detective ?? null,
      xpGrants: Array.isArray(p.xpGrants) ? p.xpGrants : [],
      achievements: Array.isArray(p.achievements) ? p.achievements : [],
      daily: p.daily && typeof p.daily === "object" ? p.daily : {},
      exams: p.exams && typeof p.exams === "object" ? p.exams : {},
      counters: {
        gistFirstTry: p.counters?.gistFirstTry ?? 0,
        firstTryDecodes: p.counters?.firstTryDecodes ?? 0,
        casesCracked: Array.isArray(p.counters?.casesCracked)
          ? p.counters.casesCracked
          : [],
      },
    };
  } catch {
    return emptyGameSnapshot();
  }
}

/** Ghi snapshot tại một key tường minh (không phát sự kiện). */
export function writeGameAt(key: string, snap: GameSnapshot): void {
  try {
    localStorage.setItem(key, JSON.stringify(snap));
  } catch {
    /* hết dung lượng — không chặn việc học */
  }
}

export function gameKey(): string {
  return scopedKey(STORAGE_KEY);
}

function read(): GameSnapshot {
  return readGameAt(gameKey());
}

function write(next: GameSnapshot): void {
  writeGameAt(gameKey(), next);
  notifyStoreChange();
}

export const gameStore = {
  getSnapshot(): GameSnapshot {
    return read();
  },

  /** Ghi đè snapshot đã hợp nhất từ remote — phát sự kiện để UI refresh */
  applySnapshot(snap: GameSnapshot): void {
    write(snap);
  },

  saveDetective(d: DetectiveDoc): void {
    write({ ...read(), detective: d });
  },

  /** Cộng XP idempotent — trả về amount đã cộng (0 nếu đã có key) */
  grantXp(key: string, source: XpSource, amount: number): number {
    const snap = read();
    if (snap.xpGrants.some((g) => g.key === key)) return 0;
    const grant: XpGrant = { key, source, amount, at: Date.now() };
    write({ ...snap, xpGrants: [grant, ...snap.xpGrants].slice(0, 800) });
    return amount;
  },

  totalXp(): number {
    return read().xpGrants.reduce((sum, g) => sum + g.amount, 0);
  },

  unlockAchievement(id: string): AchievementDoc | null {
    const snap = read();
    if (snap.achievements.some((a) => a.id === id)) return null;
    const doc: AchievementDoc = { id, unlockedAt: Date.now() };
    write({ ...snap, achievements: [doc, ...snap.achievements] });
    return doc;
  },

  getAchievements(): AchievementDoc[] {
    return read().achievements;
  },

  /** Lấy missions hôm nay (tạo mới nếu sang ngày khác) */
  getDaily(dateKey: string = todayKey()): DailyMissionsSnapshot {
    const snap = read();
    const existing = snap.daily[dateKey];
    if (existing?.missions?.length) return existing;
    const fresh = missionsForDate(dateKey);
    write({ ...snap, daily: { ...snap.daily, [dateKey]: fresh } });
    return fresh;
  },

  /** Tăng done cho mission (clamp theo target) — trả về snapshot mới */
  tickDaily(
    missionId: string,
    amount = 1,
    dateKey: string = todayKey(),
  ): DailyMissionsSnapshot {
    const snap = read();
    const current = snap.daily[dateKey]?.missions?.length
      ? snap.daily[dateKey]
      : missionsForDate(dateKey);
    const missions = current.missions.map((m) =>
      m.id === missionId
        ? { ...m, done: Math.min(m.target, m.done + amount) }
        : m,
    );
    const next: DailyMissionsSnapshot = { missions };
    write({ ...snap, daily: { ...snap.daily, [dateKey]: next } });
    return next;
  },

  claimDaily(missionId: string, dateKey: string = todayKey()): DailyMissionsSnapshot {
    const snap = read();
    const current = snap.daily[dateKey]?.missions?.length
      ? snap.daily[dateKey]
      : missionsForDate(dateKey);
    const missions = current.missions.map((m) =>
      m.id === missionId ? { ...m, claimed: true } : m,
    );
    const next: DailyMissionsSnapshot = { missions };
    write({ ...snap, daily: { ...snap.daily, [dateKey]: next } });
    return next;
  },

  saveExam(rank: Rank, score: number): void {
    const snap = read();
    write({
      ...snap,
      exams: { ...snap.exams, [rank]: { passedAt: Date.now(), score } },
    });
  },

  bumpCounter(name: "gistFirstTry" | "firstTryDecodes", amount = 1): void {
    const snap = read();
    write({
      ...snap,
      counters: {
        ...snap.counters,
        [name]: snap.counters[name] + amount,
      },
    });
  },

  /** Đánh dấu case đã phá — trả về true nếu đây là lần đầu */
  markCaseCracked(caseId: string): boolean {
    const snap = read();
    if (snap.counters.casesCracked.includes(caseId)) return false;
    write({
      ...snap,
      counters: {
        ...snap.counters,
        casesCracked: [...snap.counters.casesCracked, caseId],
      },
    });
    return true;
  },

  getCounters(): GameCounters {
    return read().counters;
  },

  getExams(): ExamMap {
    return read().exams;
  },

  /** Số ngày khác nhau đã làm nhiệm vụ ngày / làm trọn 3/3 */
  dailyDayCounts(): { activeDays: number; allDoneDays: number } {
    const days = Object.values(read().daily);
    const active = days.filter((d) =>
      d.missions?.some((m) => m.done > 0),
    ).length;
    const allDone = days.filter(
      (d) => d.missions?.length && d.missions.every((m) => m.done >= m.target),
    ).length;
    return { activeDays: active, allDoneDays: allDone };
  },
};
