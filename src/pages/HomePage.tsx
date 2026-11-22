import { Link } from "react-router-dom";
import { useI18n } from "../lib/i18n";

export function HomePage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20">
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_srgb,var(--color-amber)_16%,transparent),transparent_70%)]" />

        <p className="font-brand text-xs tracking-[0.45em] text-[var(--color-smoke)]">
          221B NOIR STREET — LISTENING DIVISION
        </p>

        <h1 className="neon-text mt-4 font-brand text-5xl leading-tight tracking-wide md:text-7xl">
          {t("home.headline")}
        </h1>

        <p className="mt-5 max-w-xl text-lg text-[var(--color-smoke)]">
          {t("home.sub")}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/daily" className="btn-amber rounded-sm px-5 py-2.5 text-sm">
            {t("home.caseFiles")}
          </Link>
          <Link to="/login" className="btn-ghost rounded-sm px-5 py-2.5 text-sm">
            {t("auth.login")}
          </Link>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)]" />
          <h2 className="font-brand text-sm tracking-[0.3em] text-[var(--color-amber)]">
            CASE BOARD
          </h2>
          <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)]" />
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="polaroid mx-auto w-full max-w-xs p-4 pb-8">
              <div className="flex h-40 items-center justify-center border border-dashed border-black/25 bg-black/5">
                <span className="font-brand text-xs tracking-[0.2em] text-black/45">
                  EVIDENCE {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 font-display text-sm text-black/80">
                {t("home.caseFilesSoon")}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-black/55">
                {t("home.caseFilesSoonSub")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
