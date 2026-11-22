# HEARLOCK HOLMES

Game luyện nghe tiếng Anh thể loại thám tử noir — nghe hiểu tiếng bản xứ tốc độ thật chính là phá án.
Spec & kế hoạch: [`doc/SPEC.md`](doc/SPEC.md) · [`doc/DEV-PLAN.md`](doc/DEV-PLAN.md)

## Chạy local

```bash
npm install
npm run dev
```

## Firebase (bật đăng nhập Google)

1. Vào [Firebase Console](https://console.firebase.google.com/) → **Add project** (tên tùy, ví dụ `hearlock-holmes`).
2. **Build → Authentication → Get started → Sign-in method → Google → Enable**.
3. **Authentication → Settings → Authorized domains** — đảm bảo có `localhost`.
4. **Project settings → Your apps → Web app (`</>`)** — đăng ký app, copy các giá trị config.
5. Copy `.env.example` thành `.env.local`, dán config vào:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

6. Khởi động lại `npm run dev`. Nút **Đăng nhập Google** sẽ hoạt động.

Chưa cấu hình Firebase thì app vẫn chạy được ở chế độ local (không lưu hồ sơ lên cloud).
