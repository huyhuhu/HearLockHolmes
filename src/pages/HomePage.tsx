import { Link } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { getSeedClip, seedCases } from "../data/seed";

export function HomePage() {
  const { t, lang } = useI18n();

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
          <Link
            to="/clip/clip-ltt-01"
            className="btn-amber rounded-sm px-5 py-2.5 text-sm"
          >
            {t("home.start")}
          </Link>
          <Link to="/daily" className="btn-ghost rounded-sm px-5 py-2.5 text-sm">
            {t("home.caseFiles")}
          </Link>
          <Link to="/login" className="btn-ghost rounded-sm px-5 py-2.5 text-sm">
            {t("auth.login")}
          </Link>
        </div>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-smoke)]">
          {t("home.startSub")}
        </p>
      </section>

      <section className="mt-6">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)]" />
          <h2 className="font-brand text-sm tracking-[0.3em] text-[var(--color-amber)]">
            CASE BOARD
          </h2>
          <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)]" />
        </div>

        <div className="mt-10 space-y-10">
          {seedCases.map((c) => (
            <div key={c.id} className="polaroid mx-auto w-full max-w-2xl p-5 pb-8">
              <p className="font-brand text-xs tracking-[0.25em] text-black/50">
                {c.type === "boss"
                  ? "BOSS"
                  : `CASE · L${c.level}`}
              </p>
              <h3 className="mt-2 font-display text-lg text-black/85">
                {lang === "vi" ? c.titleVi : c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-black/60">
                {lang === "vi" ? c.synopsisVi : c.synopsis}
              </p>
              <ul className="mt-4 space-y-2">
                {c.clipIds.map((id) => {
                  const clip = getSeedClip(id);
                  if (!clip) return null;
                  return (
                    <li key={id}>
                      <Link
                        to={`/clip/${id}`}
                        className="inline-flex items-center gap-2 rounded-sm border border-black/15 px-3 py-2 text-sm text-black/80 transition-colors hover:border-black/40 hover:bg-black/5"
                      >
                        <span className="font-brand text-xs tracking-[0.15em] text-black/50">
                          L{clip.level}
                        </span>
                        {clip.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {getSeedClip("clip-afjm-01") && (
            <div className="polaroid mx-auto w-full max-w-2xl p-5 pb-8">
              <p className="font-brand text-xs tracking-[0.25em] text-black/50">
                DRILL
              </p>
              <h3 className="mt-2 font-display text-lg text-black/85">
                {lang === "vi"
                  ? "Clip lẻ — luyện tập & kỳ sát hạch"
                  : "Standalone — practice & exam drill"}
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/clip/clip-afjm-01"
                    className="inline-flex items-center gap-2 rounded-sm border border-black/15 px-3 py-2 text-sm text-black/80 transition-colors hover:border-black/40 hover:bg-black/5"
                  >
                    <span className="font-brand text-xs tracking-[0.15em] text-black/50">
                      L4
                    </span>
                    {getSeedClip("clip-afjm-01")?.title}
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
