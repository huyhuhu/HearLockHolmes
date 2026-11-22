import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "../../lib/firebase";

type AuthValue = {
  user: User | null;
  ready: boolean;
  isFirebaseConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!isFirebaseConfigured);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setReady(true);
    });
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      ready,
      isFirebaseConfigured,
      async signInWithGoogle() {
        const auth = getFirebaseAuth();
        if (!auth) throw new Error("Firebase is not configured");
        await signInWithPopup(auth, new GoogleAuthProvider());
      },
      async signOutUser() {
        const auth = getFirebaseAuth();
        if (!auth) return;
        await signOut(auth);
      },
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
