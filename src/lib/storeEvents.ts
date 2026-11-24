/**
 * Bus sự kiện thay đổi dữ liệu học/game — cầu nối giữa các kho local và:
 *   • UI (refresh khi có thay đổi từ thiết bị khác đẩy về)
 *   • sync engine (lên lịch đẩy dữ liệu lên Firestore)
 *
 * Callback được bắn qua `queueMicrotask` để không bao giờ gọi setState
 * đồng bộ trong lúc React đang render (ví dụ `gameStore.getDaily()` có
 * side-effect ghi khi render).
 */
type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeStoreChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyStoreChange(): void {
  if (listeners.size === 0) return;
  queueMicrotask(() => {
    for (const listener of [...listeners]) {
      try {
        listener();
      } catch {
        /* một listener lỗi không được chặn các listener khác */
      }
    }
  });
}
