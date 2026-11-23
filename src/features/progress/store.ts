/**
 * Kho dữ liệu học local (localStorage) — "ghi local trước, Firestore sau".
 *
 * Map 1–1 với `users/{uid}/...` trong SPEC §5:
 *   events  → users/{uid}/events/{id}
 *   clues   → users/{uid}/clues/{clueId}
 *   progress→ users/{uid}/progress/{clipId}
 *
 * Khi có Firebase, thay các hàm này bằng Firestore mà không đổi người gọi.
 */
import type { SoundCategory } from "../../types/content";
import type {
  ClueDoc,
  ClipProgress,
  LearnEvent,
  LearnEventType,
} from "../../types/user";

const STORAGE_KEY = "hearlock.local.v1";
const MAX_EVENTS = 400;

export type LocalSnapshot = {
  events: LearnEvent[];
  clues: ClueDoc[];
  progress: Record<string, ClipProgress>;
};

const EMPTY: LocalSnapshot = { events: [], clues: [], progress: {} };

function read(): LocalSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY, events: [], clues: [], progress: {} };
    const parsed = JSON.parse(raw) as Partial<LocalSnapshot>;
    return {
      events: Array.isArray(parsed.events) ? parsed.events : [],
      clues: Array.isArray(parsed.clues) ? parsed.clues : [],
      progress: parsed.progress && typeof parsed.progress === "object" ? parsed.progress : {},
    };
  } catch {
    return { events: [], clues: [], progress: {} };
  }
}

function write(next: LocalSnapshot): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* hết dung lượng — bỏ qua, không chặn việc học */
  }
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
    const event: LearnEvent = {
      type: input.type,
      clipId: input.clipId,
      at: Date.now(),
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
};
