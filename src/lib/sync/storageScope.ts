/**
 * Phạm vi lưu trữ local — phân tách dữ liệu theo tài khoản ngay trên localStorage.
 *
 * • Khách (chưa đăng nhập): key gốc `hearlock.local.v1` / `hearlock.game.v1`.
 * • Có tài khoản: key gốc + hậu tố uid → `hearlock.local.v1::<uid>` …
 *
 * Nhờ vậy nhiều tài khoản dùng chung một trình duyệt không dính dữ liệu của
 * nhau, và dữ liệu "Khách lạ" vẫn hoạt động khi Firebase chưa cấu hình.
 */

let activeUid: string | null = null;

export function getActiveUid(): string | null {
  return activeUid;
}

/** Đổi tài khoản đang hoạt động. Truyền `null` để về chế độ Khách. */
export function setActiveUid(uid: string | null): void {
  activeUid = uid;
}

/** Key localStorage cho một kho, gắn theo tài khoản đang hoạt động. */
export function scopedKey(base: string): string {
  return activeUid ? `${base}::${activeUid}` : base;
}
