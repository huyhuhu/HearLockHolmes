/**
 * Ánh xạ snapshot local ↔ document Firestore theo đúng schema SPEC §5:
 *
 *   users/{uid}                    → detective + counters
 *   users/{uid}/events/{id}        → LearnEvent
 *   users/{uid}/clues/{clueId}     → ClueDoc
 *   users/{uid}/progress/{clipId}  → ClipProgress
 *   users/{uid}/xpGrants/{key}     → XpGrant
 *   users/{uid}/achievements/{id}  → AchievementDoc
 *   users/{uid}/daily/{yyyy-mm-dd} → DailyMissionsSnapshot
 *   users/{uid}/exams/{rank}       → ExamRecord
 *
 * Mỗi doc chứa đủ trường để dựng lại snapshot khi kéo về (không suy diễn
 * từ id). `diffDocMaps` so trạng thái đã đẩy (mirror) với trạng thái hiện
 * tại để chỉ ghi những doc thật sự thay đổi — chống ghi trùng & nhẹ mạng.
 */
import type {
  ClueDoc,
  ClipProgress,
  ExamRecord,
  LearnEvent,
} from "../../types/user";
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
import { emptyProgressSnapshot } from "../progress/store";
import { emptyGameSnapshot } from "../game/store";
import {
  clueKey,
  eventKey,
  mergeGameSnapshot,
  mergeProgressSnapshot,
} from "./merge";

export type DocMap = Map<string, Record<string, unknown>>;

/** Firestore doc-id không được chứa `/` — thay thế an toàn, tất định. */
function safeId(id: string): string {
  return id.replace(/\//g, "__");
}

/** So sánh ổn định bất chấp thứ tự khóa (dùng cho diff). */
function stable(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stable(obj[k])}`)
    .join(",")}}`;
}

// ———————————————————————————————————————————————— Progress side

export function progressToDocs(snap: LocalSnapshot): {
  events: DocMap;
  clues: DocMap;
  progress: DocMap;
} {
  const events: DocMap = new Map();
  for (const e of snap.events ?? []) events.set(safeId(eventKey(e)), { ...e });
  const clues: DocMap = new Map();
  for (const c of snap.clues ?? []) clues.set(safeId(clueKey(c)), { ...c });
  const progress: DocMap = new Map();
  for (const [clipId, p] of Object.entries(snap.progress ?? {})) {
    progress.set(safeId(clipId), { clipId, ...p });
  }
  return { events, clues, progress };
}

export function docsToProgress(docs: {
  events: DocMap;
  clues: DocMap;
  progress: DocMap;
}): LocalSnapshot {
  const events = [...docs.events.values()].map((d) => d as unknown as LearnEvent);
  const clues = [...docs.clues.values()].map((d) => d as unknown as ClueDoc);
  const progress: Record<string, ClipProgress> = {};
  for (const d of docs.progress.values()) {
    const rec = d as unknown as ClipProgress & { clipId: string };
    if (rec.clipId) progress[rec.clipId] = rec;
  }
  return { events, clues, progress };
}

// ———————————————————————————————————————————————— Game side

export function gameToDocs(snap: GameSnapshot): {
  root: DocMap;
  xpGrants: DocMap;
  achievements: DocMap;
  daily: DocMap;
  exams: DocMap;
} {
  const root: DocMap = new Map();
  root.set("__root__", {
    detective: snap.detective ?? null,
    counters: snap.counters,
  });
  const xpGrants: DocMap = new Map();
  for (const g of snap.xpGrants ?? []) xpGrants.set(safeId(g.key), { ...g });
  const achievements: DocMap = new Map();
  for (const a of snap.achievements ?? []) achievements.set(safeId(a.id), { ...a });
  const daily: DocMap = new Map();
  for (const [date, s] of Object.entries(snap.daily ?? {}))
    daily.set(safeId(date), { date, ...s });
  const exams: DocMap = new Map();
  for (const [rank, rec] of Object.entries(snap.exams ?? {})) {
    if (rec) exams.set(safeId(rank), { rank, ...rec });
  }
  return { root, xpGrants, achievements, daily, exams };
}

export function docsToGame(docs: {
  root: DocMap;
  xpGrants: DocMap;
  achievements: DocMap;
  daily: DocMap;
  exams: DocMap;
}): GameSnapshot {
  const root = docs.root.get("__root__") as
    | { detective?: DetectiveDoc | null; counters?: GameCounters }
    | undefined;
  const xpGrants = [...docs.xpGrants.values()].map((d) => d as unknown as XpGrant);
  const achievements = [...docs.achievements.values()].map(
    (d) => d as unknown as AchievementDoc,
  );
  const daily: Record<string, DailyMissionsSnapshot> = {};
  for (const d of docs.daily.values()) {
    const rec = d as unknown as DailyMissionsSnapshot & { date: string };
    if (rec.date) daily[rec.date] = rec;
  }
  const exams: ExamMap = {};
  for (const d of docs.exams.values()) {
    const rec = d as unknown as ExamRecord & { rank: keyof ExamMap };
    if (rec.rank) exams[rec.rank] = { passedAt: rec.passedAt, score: rec.score };
  }
  return {
    detective: root?.detective ?? null,
    xpGrants,
    achievements,
    daily,
    exams,
    counters: root?.counters ?? { gistFirstTry: 0, firstTryDecodes: 0, casesCracked: [] },
  };
}

// ———————————————————————————————————————————————— Diff

/** Doc cần ghi thêm/đổi so với mirror (bỏ qua vì không có thao tác xoá). */
export function diffDocMaps(
  current: DocMap,
  mirror: DocMap,
): Array<[string, Record<string, unknown>]> {
  const out: Array<[string, Record<string, unknown>]> = [];
  for (const [id, data] of current) {
    const m = mirror.get(id);
    if (!m || stable(m) !== stable(data)) out.push([id, data]);
  }
  return out;
}

// ———————————————————————————————————————————————— Merge theo doc (khi ghi)

export type DocKind =
  | "event"
  | "clue"
  | "progress"
  | "xpGrant"
  | "achievement"
  | "daily"
  | "exam"
  | "root";

/**
 * Hợp nhất doc local với doc remote hiện có trên cloud (dùng trong transaction
 * khi ghi) để giá trị trên cloud chỉ đi "lên" theo lưới CRDT — không bao giờ
 * thoái lui khi hai thiết bị ghi cùng doc. Tái dùng đúng toán tử merge đã có.
 */
export function mergeDocData(
  kind: DocKind,
  remote: Record<string, unknown> | null | undefined,
  local: Record<string, unknown>,
): Record<string, unknown> {
  if (remote == null) return local;
  switch (kind) {
    // Append-only, idempotent theo key — ghi đè là an toàn.
    case "event":
    case "xpGrant":
    case "achievement":
      return local;

    case "clue": {
      const r = remote as unknown as ClueDoc;
      const l = local as unknown as ClueDoc;
      const merged = mergeProgressSnapshot(
        { ...emptyProgressSnapshot(), clues: [r] },
        { ...emptyProgressSnapshot(), clues: [l] },
      ).clues[0];
      return { ...(merged as unknown as Record<string, unknown>) };
    }

    case "progress": {
      const r = remote as unknown as ClipProgress & { clipId: string };
      const l = local as unknown as ClipProgress & { clipId: string };
      const clipId = l.clipId ?? r.clipId;
      const merged = mergeProgressSnapshot(
        { ...emptyProgressSnapshot(), progress: { [clipId]: r } },
        { ...emptyProgressSnapshot(), progress: { [clipId]: l } },
      ).progress[clipId];
      return { clipId, ...(merged as unknown as Record<string, unknown>) };
    }

    case "daily": {
      const r = remote as unknown as DailyMissionsSnapshot & { date: string };
      const l = local as unknown as DailyMissionsSnapshot & { date: string };
      const date = l.date ?? r.date;
      const merged = mergeGameSnapshot(
        { ...emptyGameSnapshot(), daily: { [date]: r } },
        { ...emptyGameSnapshot(), daily: { [date]: l } },
      ).daily[date];
      return { date, ...(merged as unknown as Record<string, unknown>) };
    }

    case "exam": {
      const r = remote as unknown as ExamRecord & { rank: keyof ExamMap };
      const l = local as unknown as ExamRecord & { rank: keyof ExamMap };
      const rank = l.rank ?? r.rank;
      const merged = mergeGameSnapshot(
        { ...emptyGameSnapshot(), exams: { [rank]: r } },
        { ...emptyGameSnapshot(), exams: { [rank]: l } },
      ).exams[rank];
      return { rank, ...(merged as unknown as Record<string, unknown>) };
    }

    case "root": {
      const r = remote as unknown as {
        detective?: DetectiveDoc | null;
        counters?: GameCounters;
      };
      const l = local as unknown as {
        detective?: DetectiveDoc | null;
        counters?: GameCounters;
      };
      const merged = mergeGameSnapshot(
        {
          ...emptyGameSnapshot(),
          detective: r.detective ?? null,
          counters: r.counters ?? emptyGameSnapshot().counters,
        },
        {
          ...emptyGameSnapshot(),
          detective: l.detective ?? null,
          counters: l.counters ?? emptyGameSnapshot().counters,
        },
      );
      return {
        detective: merged.detective,
        counters: merged.counters,
      } as unknown as Record<string, unknown>;
    }
  }
}
