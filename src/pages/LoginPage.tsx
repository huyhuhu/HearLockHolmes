import { useState } from "react";
import { useI18n } from "../lib/i18n";
import { useAuth } from "../features/auth/AuthProvider";

export function LoginPage() {
  const { t } = useI18n();
  const { isFirebaseConfigured, signInWithGoogle, user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-xs tracking-[0.4em] text-[var(--color-smoke)]">
        AUTHORIZATION REQUIRED
      </p>
      <h1 className="neon-text mt-4 font-display text-4xl tracking-wide">
        {t("login.title")}
      </h1>
      <p className="mt-4 text-[var(--color-smoke)]">{t("login.sub")}</p>

      <div className="mt-10 w-full">
        {!isFirebaseConfigured ? (
          <p className="rounded-sm border border-[color-mix(in_srgb,var(--color-neon)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-neon)_10%,transparent)] px-4 py-4 text-sm leading-relaxed text-[var(--color-chalk)]">
            {t("auth.notConfigured")}
          </p>
        ) : user ? (
          <p className="rounded-sm border border-[color-mix(in_srgb,var(--color-amber)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-amber)_10%,transparent)] px-4 py-4 text-sm">
            {t("auth.signedInAs")}: {user.displayName ?? user.email}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => {
              setError(null);
              signInWithGoogle().catch((err: unknown) => {
                setError(err instanceof Error ? err.message : String(err));
              });
            }}
            className="btn-amber w-full rounded-sm px-6 py-3 text-base"
          >
            {t("auth.login")}
          </button>
        )}

        {error ? (
          <p className="mt-4 text-sm text-[var(--color-neon-soft)]">{error}</p>
        ) : null}
      </div>
    </main>
  );
}
