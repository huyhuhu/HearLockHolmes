/**
 * Sync engine — "ghi local trước, Firestore sau", đồng bộ đa thiết bị.
 *
 * • Đăng nhập: gộp dữ liệu "Khách lạ" vào tài khoản → kéo remote → đẩy phần
 *   local-only → đăng ký listener real-time để nhận thay đổi từ thiết bị khác.
 * • Lúc học: mọi ghi vào kho local phát sự kiện → engine lên lịch đẩy (debounce).
 * • Offline: dữ liệu vẫn nằm localStorage; flush thất bại giữ nguyên "pending"
 *   và tự thử lại khi có mạng. Không bao giờ chặn việc học.
 *
 * Chống ghi trùng bằng "mirror": trạng thái đã đẩy/kéo gần nhất. Diff(local,
 * mirror) = phần cần ghi mới. Nhờ merge CRDT (merge.ts) mọi thao tác lũy đẳng
 * nên đẩy lại/thêm lần nữa đều an toàn.
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  runTransaction,
  writeBatch,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type Firestore,
  type QuerySnapshot,
} from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebase";
import { notifyStoreChange, subscribeStoreChange } from "../../lib/storeEvents";
import { setActiveUid } from "../../lib/sync/storageScope";
import {
  emptyProgressSnapshot,
  progressKey,
  readProgressAt,
  writeProgressAt,
  type LocalSnapshot,
} from "../progress/store";
import {
  emptyGameSnapshot,
  gameKey,
  readGameAt,
  writeGameAt,
} from "../game/store";
import type { GameSnapshot } from "../../types/game";
import { mergeGameSnapshot, mergeProgressSnapshot } from "./merge";
import {
  diffDocMaps,
  docsToGame,
  docsToProgress,
  gameToDocs,
  mergeDocData,
  progressToDocs,
  type DocKind,
  type DocMap,
} from "./firestoreMap";

export type SyncStatus = "idle" | "syncing" | "synced" | "offline" | "error";

const SUBCOLLECTIONS = [
  "events",
  "clues",
  "progress",
  "xpGrants",
  "achievements",
  "daily",
  "exams",
] as const;
type SubName = (typeof SUBCOLLECTIONS)[number];

let currentUid: string | null = null;
let mirrorProgress: LocalSnapshot = emptyProgressSnapshot();
let mirrorGame: GameSnapshot = emptyGameSnapshot();
let status: SyncStatus = "idle";
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushing = false;
let rerunAfterFlush = false;
let remoteDirty = false;
let remoteTimer: ReturnType<typeof setTimeout> | null = null;

const statusListeners = new Set<(s: SyncStatus) => void>();
const unsubscribes: Array<() => void> = [];

/** Cache doc từ remote — mỗi collection một DocMap. */
let remoteDocs: Record<SubName | "root", DocMap> = makeRemoteDocs();

function makeRemoteDocs(): Record<SubName | "root", DocMap> {
  return {
    root: new Map(),
    events: new Map(),
    clues: new Map(),
    progress: new Map(),
    xpGrants: new Map(),
    achievements: new Map(),
    daily: new Map(),
    exams: new Map(),
  };
}

function setStatus(next: SyncStatus): void {
  if (status === next) return;
  status = next;
  for (const listener of [...statusListeners]) {
    try {
      listener(next);
    } catch {
      /* bỏ qua lỗi listener */
    }
  }
}

export function getSyncStatus(): SyncStatus {
  return status;
}

export function subscribeSyncStatus(listener: (s: SyncStatus) => void): () => void {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
}

function colToMap(snap: QuerySnapshot<DocumentData>): DocMap {
  const map: DocMap = new Map();
  for (const d of snap.docs) map.set(d.id, d.data() as Record<string, unknown>);
  return map;
}

/**
 * Hợp nhất trạng thái remote vào local + mirror.
 * - mirror "nuốt" remote để không đẩy ngược lại những gì đã có trên cloud.
 * - local = merge(local, remote) — lũy đẳng nên an toàn lặp lại.
 */
function recomputeFromRemote(): void {
  const remoteProgress = docsToProgress({
    events: remoteDocs.events,
    clues: remoteDocs.clues,
    progress: remoteDocs.progress,
  });
  const remoteGame = docsToGame({
    root: remoteDocs.root,
    xpGrants: remoteDocs.xpGrants,
    achievements: remoteDocs.achievements,
    daily: remoteDocs.daily,
    exams: remoteDocs.exams,
  });

  mirrorProgress = mergeProgressSnapshot(mirrorProgress, remoteProgress);
  mirrorGame = mergeGameSnapshot(mirrorGame, remoteGame);

  const mergedProgress = mergeProgressSnapshot(
    readProgressAt(progressKey()),
    remoteProgress,
  );
  writeProgressAt(progressKey(), mergedProgress);

  const mergedGame = mergeGameSnapshot(readGameAt(gameKey()), remoteGame);
  writeGameAt(gameKey(), mergedGame);

  // Báo UI refresh + lên lịch đẩy phần local-only (idempotent, mirror đã nuốt remote).
  notifyStoreChange();
}

function refsFor(db: Firestore, uid: string) {
  return {
    root: doc(db, "users", uid) as DocumentReference<DocumentData>,
    subs: {
      events: collection(db, "users", uid, "events"),
      clues: collection(db, "users", uid, "clues"),
      progress: collection(db, "users", uid, "progress"),
      xpGrants: collection(db, "users", uid, "xpGrants"),
      achievements: collection(db, "users", uid, "achievements"),
      daily: collection(db, "users", uid, "daily"),
      exams: collection(db, "users", uid, "exams"),
    } as Record<SubName, CollectionReference<DocumentData>>,
  };
}

async function pullRemoteOnce(): Promise<void> {
  const db = getFirestoreDb();
  const uid = currentUid;
  if (!db || !uid) return;
  try {
    const refs = refsFor(db, uid);
    const snaps = await Promise.all([
      getDoc(refs.root),
      ...SUBCOLLECTIONS.map((n) => getDocs(refs.subs[n])),
    ]);
    const rootSnap = snaps[0];
    if (rootSnap.exists()) {
      remoteDocs.root.set("__root__", rootSnap.data() as Record<string, unknown>);
    }
    SUBCOLLECTIONS.forEach((n, i) => {
      remoteDocs[n] = colToMap(snaps[i + 1] as QuerySnapshot<DocumentData>);
    });
    recomputeFromRemote();
    setStatus("synced");
  } catch {
    setStatus(navigator.onLine ? "error" : "offline");
  }
}

function schedulePush(): void {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, 1500);
}

async function flush(): Promise<void> {
  const uid = currentUid;
  const db = getFirestoreDb();
  if (!uid || !db) return;
  if (flushing) {
    rerunAfterFlush = true;
    return;
  }
  flushing = true;
  setStatus("syncing");
  try {
    // Chụp trạng thái tại thời điểm bắt đầu — chỉ đẩy đúng phần này.
    const startProgress = readProgressAt(progressKey());
    const startGame = readGameAt(gameKey());
    const curP = progressToDocs(startProgress);
    const curG = gameToDocs(startGame);
    const mirP = progressToDocs(mirrorProgress);
    const mirG = gameToDocs(mirrorGame);
    const refs = refsFor(db, uid);

    type Op = {
      kind: DocKind;
      ref: DocumentReference<DocumentData>;
      data: Record<string, unknown>;
    };
    const ops: Op[] = [];
    for (const [, data] of diffDocMaps(curG.root, mirG.root))
      ops.push({ kind: "root", ref: refs.root, data });
    for (const [id, data] of diffDocMaps(curP.events, mirP.events))
      ops.push({ kind: "event", ref: doc(refs.subs.events, id), data });
    for (const [id, data] of diffDocMaps(curP.clues, mirP.clues))
      ops.push({ kind: "clue", ref: doc(refs.subs.clues, id), data });
    for (const [id, data] of diffDocMaps(curP.progress, mirP.progress))
      ops.push({ kind: "progress", ref: doc(refs.subs.progress, id), data });
    for (const [id, data] of diffDocMaps(curG.xpGrants, mirG.xpGrants))
      ops.push({ kind: "xpGrant", ref: doc(refs.subs.xpGrants, id), data });
    for (const [id, data] of diffDocMaps(curG.achievements, mirG.achievements))
      ops.push({ kind: "achievement", ref: doc(refs.subs.achievements, id), data });
    for (const [id, data] of diffDocMaps(curG.daily, mirG.daily))
      ops.push({ kind: "daily", ref: doc(refs.subs.daily, id), data });
    for (const [id, data] of diffDocMaps(curG.exams, mirG.exams))
      ops.push({ kind: "exam", ref: doc(refs.subs.exams, id), data });

    if (ops.length > 0) {
      // Append-only, idempotent theo key — ghi theo lô cho nhanh.
      const appendKinds: DocKind[] = ["event", "xpGrant", "achievement"];
      const batchOps = ops.filter((o) => appendKinds.includes(o.kind));
      const txOps = ops.filter((o) => !appendKinds.includes(o.kind));

      for (let i = 0; i < batchOps.length; i += 400) {
        const batch = writeBatch(db);
        for (const e of batchOps.slice(i, i + 400)) batch.set(e.ref, e.data);
        await batch.commit();
      }

      // Doc tranh chấp (nhiều thiết bị có thể cùng ghi) — merge với giá trị
      // remote hiện có trong transaction để cloud không bao giờ thoái lui.
      await Promise.all(
        txOps.map((o) =>
          runTransaction(db, async (tx) => {
            const snap = await tx.get(o.ref);
            const merged = mergeDocData(
              o.kind,
              snap.exists() ? (snap.data() as Record<string, unknown>) : null,
              o.data,
            );
            tx.set(o.ref, merged);
          }),
        ),
      );

      mirrorProgress = startProgress;
      mirrorGame = startGame;
    }
    setStatus("synced");
  } catch {
    // Giữ nguyên "pending" (mirror chưa cập nhật) — sẽ đẩy lại khi có mạng.
    setStatus(navigator.onLine ? "error" : "offline");
  } finally {
    flushing = false;
    if (rerunAfterFlush) {
      rerunAfterFlush = false;
      schedulePush();
    }
  }
}

function scheduleRemoteRecompute(): void {
  remoteDirty = true;
  if (remoteTimer) return;
  remoteTimer = setTimeout(() => {
    remoteTimer = null;
    if (remoteDirty) {
      remoteDirty = false;
      recomputeFromRemote();
    }
  }, 50);
}

function attachListeners(uid: string): void {
  const db = getFirestoreDb();
  if (!db) return;
  const refs = refsFor(db, uid);
  for (const name of SUBCOLLECTIONS) {
    unsubscribes.push(
      onSnapshot(
        refs.subs[name],
        (snap) => {
          remoteDocs[name] = colToMap(snap);
          scheduleRemoteRecompute();
        },
        () => setStatus(navigator.onLine ? "error" : "offline"),
      ),
    );
  }
  unsubscribes.push(
    onSnapshot(
      refs.root,
      (snap) => {
        if (snap.exists()) {
          remoteDocs.root.set("__root__", snap.data() as Record<string, unknown>);
        }
        scheduleRemoteRecompute();
      },
      () => setStatus(navigator.onLine ? "error" : "offline"),
    ),
  );
}

function onOnline(): void {
  schedulePush();
}
function onVisibility(): void {
  if (document.visibilityState === "hidden") schedulePush();
}

function stopSync(silent = false): void {
  for (const off of unsubscribes.splice(0)) {
    try {
      off();
    } catch {
      /* bỏ qua */
    }
  }
  window.removeEventListener("online", onOnline);
  document.removeEventListener("visibilitychange", onVisibility);
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (remoteTimer) {
    clearTimeout(remoteTimer);
    remoteTimer = null;
  }
  currentUid = null;
  setActiveUid(null);
  remoteDocs = makeRemoteDocs();
  mirrorProgress = emptyProgressSnapshot();
  mirrorGame = emptyGameSnapshot();
  setStatus("idle");
  if (!silent) notifyStoreChange(); // UI quay lại chế độ Khách
}

export function startSync(uid: string): () => void {
  const db = getFirestoreDb();
  if (!db) {
    setActiveUid(null);
    setStatus("idle");
    return () => {};
  }
  stopSync(true);

  // Đọc "scratchpad" Khách (scope đang là null) trước khi chuyển sang tài khoản.
  const guestProgressKey = progressKey();
  const guestGameKey = gameKey();
  const guestProgress = readProgressAt(guestProgressKey);
  const guestGame = readGameAt(guestGameKey);

  currentUid = uid;
  setActiveUid(uid);

  // Gộp dữ liệu Khách vào tài khoản (idempotent — không mất tiến độ đã học).
  const accountProgress = mergeProgressSnapshot(
    readProgressAt(progressKey()),
    guestProgress,
  );
  writeProgressAt(progressKey(), accountProgress);
  const accountGame = mergeGameSnapshot(readGameAt(gameKey()), guestGame);
  writeGameAt(gameKey(), accountGame);
  // Dữ liệu đã thuộc sở hữu tài khoản — xoá scratchpad Khách.
  writeProgressAt(guestProgressKey, emptyProgressSnapshot());
  writeGameAt(guestGameKey, emptyGameSnapshot());

  setStatus("syncing");
  notifyStoreChange(); // UI đọc lại theo scope tài khoản

  unsubscribes.push(subscribeStoreChange(schedulePush));
  window.addEventListener("online", onOnline);
  document.addEventListener("visibilitychange", onVisibility);

  // Kéo remote lần đầu (merge CRDT), rồi bật listener real-time + đẩy phần local-only.
  void pullRemoteOnce().finally(() => {
    if (currentUid !== uid) return;
    attachListeners(uid);
    schedulePush();
  });

  return () => stopSync(false);
}
