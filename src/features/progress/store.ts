/**
 * Kho dữ liệu học local (localStorage) — "ghi local trước, Firestore sau".
 *
 * Map 1–1 với `users/{uid}/...` trong SPEC §5:
 *   events  → users/{uid}/events/{id}
 *   clues   → users/{uid}/clues/{clueId}
 *   progress→ users/{uid}/progress/{clipId}
 *
 * Khi có Firebase, sync engine (`src/features/sync/`) đẩy các bản ghi này
 * lên Firestore và kéo thay đổi từ thiết bị khác về — API người gọi giữ nguyên.
 * Key localStorage gắn theo tài khoản (scopedKey) để đa tài khoản không dính nhau.
 */
import type { SoundCategory } from "../../types/content";
import type {
  ClueDoc,
  ClipProgress,
  LearnEvent,
  LearnEventType,
} from "../../types/user";
import { notifyStoreChange } from "../../lib/storeEvents";
import { scopedKey } from "../../lib/sync/storageScope";

const STORAGE_KEY = "hearlock.local.v1";
const MAX_EVENTS = 400;

export type LocalSnapshot = {
  events: LearnEvent[];
  clues: ClueDoc[];
  progress: Record<string, ClipProgress>;
};

export function emptyProgressSnapshot(): LocalSnapshot {
  return { events: [], clues: [], progress: {} };
}

/** Đọc snapshot tại một key tường minh (dùng cho migration/sync engine). */
export function readProgressAt(key: string): LocalSnapshot {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return emptyProgressSnapshot();
    const parsed = JSON.parse(raw) as Partial<LocalSnapshot>;
    return {
      events: Array.isArray(parsed.events) ? parsed.events : [],
      clues: Array.isArray(parsed.clues) ? parsed.clues : [],
      progress: parsed.progress && typeof parsed.progress === "object" ? parsed.progress : {},
    };
  } catch {
    return emptyProgressSnapshot();
  }
}

/** Ghi snapshot tại một key tường minh (không phát sự kiện). */
export function writeProgressAt(key: string, snap: LocalSnapshot): void {
  try {
    localStorage.setItem(key, JSON.stringify(snap));
  } catch {
    /* hết dung lượng — bỏ qua, không chặn việc học */
  }
}

export function progressKey(): string {
  return scopedKey(STORAGE_KEY);
}

function read(): LocalSnapshot {
  return readProgressAt(progressKey());
}

function write(next: LocalSnapshot): void {
  writeProgressAt(progressKey(), next);
  notifyStoreChange();
}

const EMPTY_PROGRESS: ClipProgress = {
  listens: 0,
  gistPassed: false,
  comprehensionScore: 0,
  decodedClusters: [],
  completedAt: null,
};

export type EventInput = {
  type: LearnEventType;
  clipId: string;
  clusterId?: string;
  category?: SoundCategory;
  categories?: SoundCategory[];
};

export const progressStore = {
  /** Nhiên liệu cho hồ sơ năng lực (SPEC §3) */
  recordEvent(input: EventInput): void {
    const snap = read();
    const at = Date.now();
    const event: LearnEvent = {
      id: `ev-${at}-${Math.random().toString(36).slice(2, 8)}`,
      type: input.type,
      clipId: input.clipId,
      at,
      ...(input.clusterId ? { clusterId: input.clusterId } : {}),
      ...(input.category ? { category: input.category } : {}),
      ...(input.categories && input.categories.length > 0
        ? { categories: input.categories }
        : {}),
    };
    const events = [event, ...snap.events].slice(0, MAX_EVENTS);
    write({ ...snap, events });
  },

  /** Ghi manh mối vào sổ tay — ghi đè theo clipId + clusterId */
  saveClue(clue: ClueDoc): void {
    const snap = read();
    const clues = [
      clue,
      ...snap.clues.filter(
        (c) => !(c.clipId === clue.clipId && c.clusterId === clue.clusterId),
      ),
    ];
    write({ ...snap, clues });
  },

  getClues(clipId?: string): ClueDoc[] {
    const snap = read();
    return clipId ? snap.clues.filter((c) => c.clipId === clipId) : snap.clues;
  },

  getEvents(clipId?: string): LearnEvent[] {
    const snap = read();
    return clipId ? snap.events.filter((e) => e.clipId === clipId) : snap.events;
  },

  getProgress(clipId: string): ClipProgress {
    const snap = read();
    return snap.progress[clipId] ?? { ...EMPTY_PROGRESS, decodedClusters: [] };
  },

  /** Toàn bộ tiến độ — cho game layer tính stats/thành tựu */
  getAllProgress(): Record<string, ClipProgress> {
    return read().progress;
  },

  upsertProgress(clipId: string, patch: Partial<ClipProgress>): ClipProgress {
    const snap = read();
    const current = snap.progress[clipId] ?? { ...EMPTY_PROGRESS, decodedClusters: [] };
    const merged: ClipProgress = {
      ...current,
      ...patch,
      decodedClusters: Array.from(
        new Set([...current.decodedClusters, ...(patch.decodedClusters ?? [])]),
      ),
    };
    write({ ...snap, progress: { ...snap.progress, [clipId]: merged } });
    return merged;
  },

  /** Toàn bộ snapshot hiện tại (cho sync engine) */
  getSnapshot(): LocalSnapshot {
    return read();
  },

  /** Ghi đè snapshot đã hợp nhất từ remote — phát sự kiện để UI refresh */
  applySnapshot(snap: LocalSnapshot): void {
    write(snap);
  },
};
