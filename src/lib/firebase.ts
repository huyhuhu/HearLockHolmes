import { initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as
    | string
    | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as
    | string
    | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

/**
 * Chế độ emulator (QA E2E — không cần tài khoản Google thật):
 * đặt `VITE_FIREBASE_EMULATOR=1` khi chạy dev trỏ vào Firebase Emulator
 * (Auth :9099 + Firestore :8080). Không đặt biến này thì app chạy với
 * Firebase thật như bình thường.
 */
export const isEmulator =
  import.meta.env.VITE_FIREBASE_EMULATOR === "1" && isFirebaseConfigured;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  if (isEmulator) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }
}

export function getFirebaseAuth(): Auth | null {
  return auth;
}

export function getFirestoreDb(): Firestore | null {
  return db;
}
