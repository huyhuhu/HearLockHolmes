import { useI18n } from "../lib/i18n";

export function ProfilePage() {
  const { t } = useI18n();
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <p className="font-brand text-xs tracking-[0.4em] text-[var(--color-smoke)]">
        DETECTIVE RECORD — GĐ5/6
      </p>
      <h1 className="neon-text mt-3 font-display text-4xl tracking-wide">
        {t("nav.profile")}
      </h1>
      <p className="mt-5 max-w-lg text-[var(--color-smoke)]">
        {t("home.caseFilesSoonSub")}
      </p>
    </main>
  );
}
