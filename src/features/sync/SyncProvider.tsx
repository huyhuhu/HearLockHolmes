/**
 * SyncProvider — nối auth với sync engine.
 *
 * • Khi user đăng nhập: startSync(uid) — gộp dữ liệu Khách, kéo/đẩy Firestore,
 *   bật listener real-time đa thiết bị.
 * • Khi đăng xuất / Firebase chưa cấu hình: về chế độ Khách (localStorage thuần).
 *
 * Expose `status` để UI hiển thị chip trạng thái đồng bộ (TopBar).
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../auth/AuthProvider";
import {
  getSyncStatus,
  startSync,
  subscribeSyncStatus,
  type SyncStatus,
} from "./syncEngine";

type SyncValue = {
  status: SyncStatus;
  /** Đang có tài khoản + đồng bộ hoạt động */
  isSyncing: boolean;
};

const SyncContext = createContext<SyncValue>({ status: "idle", isSyncing: false });

export function SyncProvider({ children }: { children: ReactNode }) {
  const { user, ready, isFirebaseConfigured } = useAuth();
  const [status, setStatus] = useState<SyncStatus>(getSyncStatus);

  useEffect(() => {
    return subscribeSyncStatus(setStatus);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !ready) return;
    if (!user) {
      // Không có tài khoản — vẫn đảm bảo scope về chế độ Khách.
      setStatus(getSyncStatus());
      return;
    }
    const stop = startSync(user.uid);
    return stop;
  }, [user, ready, isFirebaseConfigured]);

  const value = useMemo<SyncValue>(
    () => ({ status, isSyncing: Boolean(user) && status !== "idle" }),
    [status, user],
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync(): SyncValue {
  return useContext(SyncContext);
}