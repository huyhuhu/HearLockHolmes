/**
 * ToastHost — popup XP / thành tựu / lên cấp / phá vụ.
 * Mọi popup đều animate (anim-toast / anim-panel / anim-stamp).
 */
import { useGame, type GameToast } from "./GameProvider";
import { BadgeIcon } from "../../components/svg/BadgeIcons";
import type { BadgeGlyph } from "./achievements";
import { useI18n } from "../../lib/i18n";

function ToastCard({ toast, onDismiss }: { toast: GameToast; onDismiss: () => void }) {
  const { lang } = useI18n();
  const isLevel = toast.kind === "level";
  const isAchievement = toast.kind === "achievement";
  return (
    <div
      className={`anim-toast pointer-events-auto w-[min(21rem,calc(100vw-2rem))] rounded-sm border px-4 py-3 shadow-2xl backdrop-blur-sm ${
        isLevel
          ? "border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_18%,var(--color-ink))] anim-glow"
          : isAchievement
            ? "border-[color-mix(in_srgb,var(--color-amber)_55%,transparent)] bg-[color-mix(in_srgb,var(--color-ink)_92%,transparent)]"
            : "border-[color-mix(in_srgb,var(--color-chalk)_22%,transparent)] bg-[color-mix(in_srgb,var(--color-ink)_92%,transparent)]"
      }`}
    >
      <div className="flex items-start gap-3">
        {toast.glyph ? (
          <span
            className={`mt-0.5 shrink-0 ${
              isLevel || isAchievement ? "text-[var(--color-amber)]" : "text-[var(--color-smoke)]"
            }`}
          >
            <BadgeIcon glyph={toast.glyph as BadgeGlyph} className="h-7 w-7" />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm tracking-wide text-[var(--color-chalk)]">
            {toast.title}
          </p>
          {toast.sub ? (
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-smoke)]">
              {lang === "vi" ? toast.sub : toast.sub}
            </p>
          ) : null}
          {typeof toast.amount === "number" && toast.amount > 0 ? (
            <p className="mt-1 font-brand text-xs tracking-[0.2em] text-[var(--color-amber)]">
              +{toast.amount} XP
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="close"
          className="min-h-8 min-w-8 rounded-sm text-[var(--color-smoke)] transition-colors hover:text-[var(--color-chalk)]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function LevelUpModal() {
  const { levelUp, clearLevelUp } = useGame();
  const { t } = useI18n();
  if (!levelUp) return null;
  return (
    <div
      className="anim-overlay fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="anim-panel relative w-full max-w-md rounded-sm border border-[var(--color-amber)] bg-[var(--color-ink)] px-8 py-10 text-center shadow-2xl">
        <p className="font-brand text-[11px] tracking-[0.42em] text-[var(--color-smoke)]">
          DETECTIVE LEVEL
        </p>
        <div className="anim-stamp mx-auto mt-5 flex h-28 w-28 items-center justify-center rounded-full border-2 border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_16%,transparent)]">
          <span className="neon-text font-brand text-5xl">{levelUp.to}</span>
        </div>
        <h2 className="mt-6 font-display text-2xl tracking-wide text-[var(--color-chalk)]">
          {t("game.levelUp")}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-smoke)]">
          {t("game.levelUpSub", { from: levelUp.from, to: levelUp.to })}
        </p>
        <button
          type="button"
          onClick={clearLevelUp}
          className="btn-amber mt-8 min-h-11 rounded-sm px-6 py-3 text-sm"
        >
          {t("game.levelUpClose")}
        </button>
      </div>
    </div>
  );
}

export function ToastHost() {
  const { toasts, dismissToast } = useGame();
  return (
    <>
      <div className="pointer-events-none fixed bottom-24 right-4 z-[80] flex flex-col items-end gap-2">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </div>
      <LevelUpModal />
    </>
  );
}
