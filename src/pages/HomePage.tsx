/**
 * Trang chủ — "bàn làm việc của thám tử": chào theo role-play + Case Board.
 */
import { Link } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { seedCases, seedClips } from "../data/seed";
import { useGame } from "../features/game/GameProvider";
import { CaseBoard } from "../features/game/CaseBoard";
import { DetectiveAvatar } from "../components/svg/DetectiveAvatars";
import { WrenArt } from "../components/svg/WrenArt";
import { RANK_XP } from "../features/game/levels";

export function HomePage() {
  const { t } = useI18n();
  const { detective, level, totalXp, rank, daily, caseStatuses, examReady } = useGame();

  const todayDone = daily.missions.filter((m) => m.done >= m.target).length;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20">
      <section className="relative py-12 md:py-20">
        <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_srgb,var(--color-amber)_16%,transparent),transparent_70%)]" />

        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="font-brand text-xs tracking-[0.45em] text-[var(--color-smoke)]">
              221B NOIR STREET — LISTENING DIVISION
            </p>
            <h1 className="neon-text mt-4 font-brand text-4xl leading-tight tracking-wide md:text-6xl">
              {detective
                ? t("home.hello", { name: detective.name })
                : t("home.headline")}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-[var(--color-smoke)]">
              {detective ? t("home.subDetective") : t("home.sub")}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {!detective ? (
                <Link to="/onboard" className="btn-amber rounded-sm px-5 py-2.5 text-sm">
                  {t("home.createDetective")}
                </Link>
              ) : (
                <Link to="/clip/clip-ltt-01" className="btn-amber rounded-sm px-5 py-2.5 text-sm">
                  {t("home.start")}
                </Link>
              )}
              <Link to="/daily" className="btn-ghost rounded-sm px-5 py-2.5 text-sm">
                {t("home.daily", { done: todayDone, total: daily.missions.length })}
              </Link>
              <Link to="/profile" className="btn-ghost rounded-sm px-5 py-2.5 text-sm">
                {t("home.caseFiles")}
              </Link>
              {examReady ? (
                <Link to="/exam" className="btn-ghost rounded-sm border-[var(--color-neon)] px-5 py-2.5 text-sm text-[var(--color-neon-soft)]">
                  {t("home.examReady")}
                </Link>
              ) : null}
            </div>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-smoke)]">
              {t("home.startSub")}
            </p>
          </div>

          {/* thẻ thám tử + Wren */}
          <div className="anim-pop flex w-full max-w-sm shrink-0 items-center gap-4 rounded-sm border border-[color-mix(in_srgb,var(--color-amber)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-ink)_80%,transparent)] p-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--color-amber)_45%,transparent)]">
              {detective ? (
                <DetectiveAvatar id={detective.avatarId} />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--color-void)]">
                  <WrenArt className="h-16 w-16" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-brand text-[10px] tracking-[0.3em] text-[var(--color-amber)]">
                {t("home.rankChip", { rank: t(`rank.${rank}` as never) })}
              </p>
              <p className="mt-1 truncate font-display text-lg text-[var(--color-chalk)]">
                {detective ? detective.name : t("home.noDetective")}
              </p>
              <p className="text-xs text-[var(--color-smoke)]">
                {t("home.levelChip", { level, xp: totalXp })}
              </p>
              {detective ? (
                <p className="mt-1 truncate text-[11px] italic text-[var(--color-smoke)]">
                  “{detective.motto}”
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <CaseBoard cases={seedCases} clips={seedClips} caseStatuses={caseStatuses} />

      <p className="anim-fade-up mx-auto mt-16 max-w-2xl text-center text-xs leading-relaxed text-[var(--color-smoke)]">
        {t("home.rankHint", { next: RANK_XP.veteran })}
      </p>
    </main>
  );
}
