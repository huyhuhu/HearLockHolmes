/**
 * Nhiệm vụ ngày (Daily Investigation) — 3 chiếc/ngày, không streak.
 */
import { Link } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { useGame } from "../features/game/GameProvider";
import { BadgeIcon } from "../components/svg/BadgeIcons";

const GLYPH = {
  listen_clips: "ear",
  decode_clusters: "fingerprint",
  replay_sentences: "clock",
} as const;

const LABEL: Record<string, { vi: string; en: string }> = {
  listen_clips: {
    vi: "Lắng nghe lời khai",
    en: "Listen to testimonies",
  },
  decode_clusters: {
    vi: "Giải mã đoạn nối âm",
    en: "Decode swallowed clusters",
  },
  replay_sentences: {
    vi: "Nghe lại lời khai",
    en: "Relisten to statements",
  },
};

export function DailyPage() {
  const { t, lang } = useI18n();
  const { daily, detective } = useGame();
  const doneCount = daily.missions.filter((m) => m.done >= m.target).length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="anim-fade-up font-brand text-xs tracking-[0.4em] text-[var(--color-smoke)]">
        DAILY INVESTIGATION
      </p>
      <h1 className="anim-fade-up neon-text mt-3 font-display text-3xl tracking-wide md:text-4xl">
        {t("nav.daily")}
      </h1>
      <p className="anim-fade-up mt-4 max-w-xl text-[var(--color-smoke)]">
        {detective
          ? t("daily.sub", { name: detective.name })
          : t("daily.subAnon")}
      </p>

      <div className="anim-fade-up mt-6 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-chalk)_12%,transparent)]">
          <div
            className="anim-bar h-full rounded-full bg-[var(--color-amber)] shadow-[0_0_12px_color-mix(in_srgb,var(--color-amber)_55%,transparent)]"
            style={{ width: `${Math.round((doneCount / daily.missions.length) * 100)}%` }}
          />
        </div>
        <span className="font-brand text-sm tracking-[0.2em] text-[var(--color-amber)]">
          {doneCount}/{daily.missions.length}
        </span>
      </div>

      <div className="stagger mt-8 flex flex-col gap-4">
        {daily.missions.map((m) => {
          const done = m.done >= m.target;
          const label = LABEL[m.type][lang];
          return (
            <article
              key={m.id}
              className={`rounded-sm border px-5 py-5 transition-all duration-300 ${
                done
                  ? "anim-pop border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_12%,transparent)] shadow-[0_0_24px_color-mix(in_srgb,var(--color-amber)_25%,transparent)]"
                  : "border-[color-mix(in_srgb,var(--color-chalk)_18%,transparent)] bg-[color-mix(in_srgb,var(--color-ink)_75%,transparent)] hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--color-amber)_55%,transparent)]"
              }`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`mt-0.5 shrink-0 ${done ? "text-[var(--color-amber)]" : "text-[var(--color-smoke)]"}`}
                >
                  <BadgeIcon glyph={GLYPH[m.type]} className="h-8 w-8" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-display text-lg tracking-wide text-[var(--color-chalk)]">
                      {label}
                    </h2>
                    <span
                      className={`font-brand text-xs tracking-[0.22em] ${
                        done ? "text-[var(--color-amber)]" : "text-[var(--color-smoke)]"
                      }`}
                    >
                      +{m.rewardXp} XP
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-smoke)]">
                    {t("daily.progress", { done: m.done, target: m.target })}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-chalk)_12%,transparent)]">
                    <div
                      className={`anim-bar h-full rounded-full ${done ? "bg-[var(--color-amber)]" : "bg-[color-mix(in_srgb,var(--color-amber)_65%,transparent)]"}`}
                      style={{ width: `${Math.min(100, (m.done / m.target) * 100)}%` }}
                    />
                  </div>
                  {done ? (
                    <p className="mt-2 text-xs italic text-[var(--color-amber)]">
                      {t("daily.done")}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {doneCount === daily.missions.length ? (
        <div className="anim-stamp mt-10 rounded-sm border border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_10%,transparent)] px-6 py-6 text-center">
          <p className="font-brand-i18n text-sm tracking-[0.3em] text-[var(--color-amber)]">
            {t("daily.allDone")}
          </p>
          <p className="mt-2 text-sm text-[var(--color-smoke)]">{t("daily.allDoneSub")}</p>
        </div>
      ) : (
        <div className="mt-10 text-center">
          <Link to="/clip/clip-ltt-01" className="btn-amber inline-flex min-h-11 rounded-sm px-6 py-3 text-sm">
            {t("daily.goListen")}
          </Link>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-[var(--color-smoke)]">
        {t("daily.noStreak")}
      </p>
    </main>
  );
}
