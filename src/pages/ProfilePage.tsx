/**
 * Hồ sơ thám tử — chân dung, rank/level/XP, hồ sơ năng lực 5 loại âm,
 * gợi án tiếp theo, thành tựu, kỳ sát hạch.
 */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { useGame } from "../features/game/GameProvider";
import {
  AVATAR_META,
  DetectiveAvatar,
} from "../components/svg/DetectiveAvatars";
import { BadgeIcon } from "../components/svg/BadgeIcons";
import { ACHIEVEMENTS } from "../features/game/achievements";
import { RANK_XP } from "../features/game/levels";
import { progressStore } from "../features/progress/store";
import {
  computeSoundStats,
  suggestNextClip,
  SOUND_CATEGORIES,
} from "../features/progress/stats";
import { seedClips } from "../data/seed";

export function ProfilePage() {
  const { t, lang } = useI18n();
  const {
    detective,
    level,
    intoLevel,
    needForNext,
    levelProgress,
    totalXp,
    rank,
    nextRankInfo,
    examReady,
    examTarget,
    exams,
    achievements,
  } = useGame();

  const unlockedIds = new Set(achievements.map((a) => a.id));
  const clues = progressStore.getClues().length;
  const events = progressStore.getEvents().length;

  const soundProfile = useMemo(() => {
    const evts = progressStore.getEvents();
    const stats = computeSoundStats(evts);
    const suggestion = suggestNextClip(
      evts,
      seedClips,
      progressStore.getAllProgress(),
    );
    return { stats, suggestion };
  }, [events]);

  if (!detective) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <div className="polaroid clue-pin anim-pop mx-auto max-w-md p-6 pb-10 text-center">
          <p className="font-brand text-[10px] tracking-[0.28em] text-black/50">
            CASE FILE — NO SUBJECT
          </p>
          <div className="mx-auto mt-5 flex h-28 w-28 items-center justify-center rounded-sm border-2 border-dashed border-black/25 bg-black/5">
            <span className="font-brand text-3xl text-black/25">?</span>
          </div>
          <h1 className="mt-5 font-display text-xl tracking-wide text-black/85">
            {t("profile.noDetective")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-black/60">
            {t("profile.noDetectiveSub")}
          </p>
          <Link
            to="/onboard"
            className="btn-amber mt-6 inline-flex min-h-11 rounded-sm px-6 py-3 text-sm"
          >
            {t("home.createDetective")}
          </Link>
          <p className="mt-6 font-brand text-[10px] tracking-[0.22em] text-black/40">
            221B NOIR STREET — LISTENING DIVISION
          </p>
        </div>
      </main>
    );
  }

  const archMeta = AVATAR_META.find((m) => m.id === detective.archetype);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10">
      <p className="anim-fade-up font-brand text-xs tracking-[0.4em] text-[var(--color-smoke)]">
        DETECTIVE RECORD
      </p>
      <h1 className="anim-fade-up neon-text mt-3 font-display text-3xl tracking-wide md:text-4xl">
        {detective.name}
      </h1>

      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        {/* thẻ hồ sơ */}
        <aside className="anim-pop rounded-sm border border-[color-mix(in_srgb,var(--color-amber)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-ink)_85%,transparent)] p-5">
          <div className="mx-auto w-40 overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--color-amber)_45%,transparent)]">
            <DetectiveAvatar id={detective.avatarId} />
          </div>
          <p className="mt-4 text-center font-display text-lg text-[var(--color-chalk)]">
            {detective.name}
          </p>
          <p className="mt-1 text-center text-sm text-[var(--color-smoke)]">
            {archMeta ? (lang === "vi" ? archMeta.title.vi : archMeta.title.en) : detective.archetype}
          </p>
          <p className="mt-3 text-center text-xs italic leading-relaxed text-[var(--color-smoke)]">
            “{detective.motto}”
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)] px-3 py-3">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-smoke)]">
                {t("profile.rank")}
              </dt>
              <dd className="mt-1 font-display text-sm text-[var(--color-amber)]">
                {t(`rank.${rank}` as never)}
              </dd>
            </div>
            <div className="rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)] px-3 py-3">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-smoke)]">
                {t("profile.level")}
              </dt>
              <dd className="mt-1 font-brand text-xl text-[var(--color-amber)]">{level}</dd>
            </div>
            <div className="rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)] px-3 py-3">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-smoke)]">
                {t("profile.clues")}
              </dt>
              <dd className="mt-1 font-brand text-xl text-[var(--color-chalk)]">{clues}</dd>
            </div>
            <div className="rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)] px-3 py-3">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-smoke)]">
                {t("profile.events")}
              </dt>
              <dd className="mt-1 font-brand text-xl text-[var(--color-chalk)]">{events}</dd>
            </div>
          </dl>
        </aside>

        <div className="flex flex-col gap-6">
          {/* XP */}
          <section className="anim-fade-up rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_16%,transparent)] bg-[color-mix(in_srgb,var(--color-ink)_75%,transparent)] px-5 py-5">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 className="font-brand text-[11px] tracking-[0.32em] text-[var(--color-amber)]">
                EXPERIENCE
              </h2>
              <p className="font-brand-i18n text-sm text-[var(--color-chalk)]">
                {totalXp} XP · {t("profile.intoLevel", { into: intoLevel, need: needForNext })}
              </p>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-chalk)_12%,transparent)]">
              <div
                className="anim-bar h-full rounded-full bg-gradient-to-r from-[var(--color-amber-deep)] to-[var(--color-amber)] shadow-[0_0_14px_color-mix(in_srgb,var(--color-amber)_45%,transparent)]"
                style={{ width: `${Math.round(levelProgress * 100)}%` }}
              />
            </div>
            {nextRankInfo ? (
              <p className="mt-3 text-xs text-[var(--color-smoke)]">
                {t("profile.nextRank", {
                  rank: t(`rank.${nextRankInfo.rank}` as never),
                  threshold: nextRankInfo.threshold,
                })}
              </p>
            ) : (
              <p className="mt-3 text-xs text-[var(--color-smoke)]">{t("profile.maxRank")}</p>
            )}
          </section>

          {/* kỳ sát hạch */}
          <section className="anim-fade-up rounded-sm border border-[color-mix(in_srgb,var(--color-neon)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-neon)_8%,transparent)] px-5 py-5">
            <h2 className="font-brand-i18n text-[11px] tracking-[0.32em] text-[var(--color-neon-soft)]">
              {t("exam.title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-smoke)]">
              {examTarget
                ? examReady
                  ? t("exam.ready", { rank: t(`rank.${examTarget}` as never) })
                  : t("exam.locked", {
                      rank: t(`rank.${examTarget}` as never),
                      threshold: RANK_XP[examTarget as "veteran" | "legend"],
                    })
                : t("exam.maxed")}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                to="/exam"
                className={`min-h-11 rounded-sm px-5 py-2.5 text-sm ${
                  examReady ? "btn-amber" : "btn-ghost opacity-50"
                }`}
              >
                {t("exam.enter")}
              </Link>
              {Object.keys(exams).map((r) => (
                <span
                  key={r}
                  className="anim-pop font-brand-i18n rounded-sm border border-[var(--color-amber)] px-3 py-1.5 text-[10px] tracking-[0.22em] text-[var(--color-amber)]"
                >
                  ✓ {t(`rank.${r}` as never)}
                </span>
              ))}
            </div>
          </section>

          {/* hồ sơ năng lực — 5 loại âm + gợi án tiếp theo */}
          <section className="anim-fade-up rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_16%,transparent)] bg-[color-mix(in_srgb,var(--color-ink)_75%,transparent)] px-5 py-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-brand-i18n text-[11px] tracking-[0.32em] text-[var(--color-amber)]">
                {t("profile.skills")}
              </h2>
              <p className="text-[10px] tracking-[0.14em] text-[var(--color-smoke)]">
                {t("profile.loss")} %
              </p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-smoke)]">
              {t("profile.skillsHint")}
            </p>

            <ul className="mt-4 flex flex-col gap-3">
              {SOUND_CATEGORIES.map((cat) => {
                const s = soundProfile.stats[cat];
                const pct = s.lossPct;
                const isWeak =
                  soundProfile.suggestion?.weakCategory === cat &&
                  pct !== null;
                const signals =
                  s.misses + s.fuzzies + s.seeks + s.replays;
                return (
                  <li key={cat} className="flex items-center gap-3">
                    <span
                      className={`w-32 shrink-0 text-xs leading-snug ${
                        isWeak
                          ? "font-semibold text-[var(--color-neon-soft)]"
                          : "text-[var(--color-chalk)]"
                      }`}
                    >
                      {t(`cat.${cat}` as never)}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-chalk)_12%,transparent)]">
                      {pct !== null ? (
                        <div
                          className={`anim-bar h-full rounded-full ${
                            isWeak
                              ? "bg-[var(--color-neon)] shadow-[0_0_10px_color-mix(in_srgb,var(--color-neon)_50%,transparent)]"
                              : "bg-[var(--color-amber)]"
                          }`}
                          style={{ width: `${Math.round(pct * 100)}%` }}
                        />
                      ) : null}
                    </div>
                    <span
                      className={`w-24 shrink-0 text-right font-brand-i18n text-xs ${
                        pct === null
                          ? "text-[var(--color-smoke)]"
                          : isWeak
                            ? "text-[var(--color-neon-soft)]"
                            : "text-[var(--color-amber)]"
                      }`}
                    >
                      {pct === null
                        ? t("profile.noSignal")
                        : `${Math.round(pct * 100)}%`}
                    </span>
                    <span className="hidden w-20 shrink-0 text-right text-[10px] text-[var(--color-smoke)] sm:block">
                      {t("profile.signalCount", { n: signals })}
                    </span>
                  </li>
                );
              })}
            </ul>

            {soundProfile.suggestion ? (
              <div className="polaroid clue-pin mt-6 p-4 pb-6">
                <p className="font-brand-i18n text-[10px] tracking-[0.28em] text-black/50">
                  {t("profile.suggest")}
                </p>
                <p className="mt-1.5 font-display text-base text-black/85">
                  {seedClips.find((c) => c.id === soundProfile.suggestion!.clipId)
                    ?.title ?? soundProfile.suggestion.clipId}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-black/60">
                  {soundProfile.suggestion.redo
                    ? t("profile.suggestRedo")
                    : soundProfile.suggestion.weakCategory
                      ? t("profile.suggestWeak", {
                          cat: t(
                            `cat.${soundProfile.suggestion.weakCategory}` as never,
                          ),
                        })
                      : t("profile.suggestFresh")}
                </p>
                <Link
                  to={`/clip/${soundProfile.suggestion.clipId}`}
                  className="btn-amber mt-3 inline-flex min-h-11 items-center rounded-sm px-4 py-2 text-xs"
                >
                  {t("profile.suggestGo")}
                </Link>
              </div>
            ) : null}
          </section>

          {/* thành tựu */}
          <section className="anim-fade-up">
            <div className="flex items-center gap-3">
              <h2 className="font-brand-i18n text-[11px] tracking-[0.32em] text-[var(--color-amber)]">
                {t("profile.achievements")} — {unlockedIds.size}/{ACHIEVEMENTS.length}
              </h2>
              <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)]" />
            </div>
            <div className="stagger mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {ACHIEVEMENTS.map((def) => {
                const unlocked = unlockedIds.has(def.id);
                return (
                  <div
                    key={def.id}
                    title={lang === "vi" ? def.desc.vi : def.desc.en}
                    className={`rounded-sm border px-3 py-3 transition-all duration-200 ${
                      unlocked
                        ? "anim-pop border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_12%,transparent)] text-[var(--color-amber)] shadow-[0_0_16px_color-mix(in_srgb,var(--color-amber)_22%,transparent)]"
                        : "border-[color-mix(in_srgb,var(--color-chalk)_12%,transparent)] text-[var(--color-smoke)] opacity-55"
                    }`}
                  >
                    <BadgeIcon glyph={def.glyph} className="h-7 w-7" />
                    <p className="mt-2 text-xs font-medium leading-snug text-[var(--color-chalk)]">
                      {lang === "vi" ? def.title.vi : def.title.en}
                    </p>
                    <p className="mt-0.5 text-[10px] tracking-[0.12em] text-[var(--color-smoke)]">
                      +{def.xp} XP
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
