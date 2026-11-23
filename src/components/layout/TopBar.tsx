import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../../lib/i18n";
import { useTheme } from "../../lib/theme";
import { useAuth } from "../../features/auth/AuthProvider";
import { useGame } from "../../features/game/GameProvider";

function ToggleButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="btn-ghost min-h-11 min-w-11 rounded-sm px-3 py-1.5 text-xs"
    >
      {children}
    </button>
  );
}

export function TopBar() {
  const { t, lang, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, isFirebaseConfigured, signOutUser } = useAuth();
  const { level, totalXp, levelProgress, detective, rank } = useGame();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex min-h-11 items-center text-sm font-medium tracking-wide whitespace-nowrap transition-colors ${
      isActive
        ? "text-[var(--color-amber)] underline decoration-dotted underline-offset-4"
        : "text-[var(--color-smoke)] hover:text-[var(--color-chalk)]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--color-chalk)_12%,transparent)] bg-[color-mix(in_srgb,var(--color-ink)_88%,transparent)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link to="/" className="group inline-flex min-h-11 shrink-0 flex-col justify-center">
          <div className="neon-text font-brand text-lg leading-none tracking-widest">
            HEARLOCK
          </div>
          <div className="font-brand text-[10px] leading-none tracking-[0.35em] text-[var(--color-smoke)] group-hover:text-[var(--color-amber)]">
            HOLMES
          </div>
        </Link>

        <div className="hidden text-[10px] uppercase tracking-[0.25em] text-[var(--color-smoke)] lg:block">
          {t("tagline")}
        </div>

        {/* chip level/XP — nhịp phản hồi nhanh (GĐ5) */}
        <Link
          to="/profile"
          className="ml-auto hidden min-h-11 items-center gap-2 rounded-sm border border-[color-mix(in_srgb,var(--color-amber)_35%,transparent)] px-3 py-1.5 transition-colors hover:border-[var(--color-amber)] sm:flex"
          title={t("home.levelChip", { level, xp: totalXp })}
        >
          <span className="font-brand text-[11px] tracking-[0.22em] text-[var(--color-amber)]">
            LV {level}
          </span>
          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-chalk)_16%,transparent)]">
            <span
              className="anim-bar block h-full rounded-full bg-[var(--color-amber)]"
              style={{ width: `${Math.round(levelProgress * 100)}%` }}
            />
          </span>
          <span className="hidden font-brand text-[10px] tracking-[0.18em] text-[var(--color-smoke)] md:block">
            {totalXp} XP
          </span>
        </Link>

        <nav className="order-last flex w-full items-center gap-5 sm:order-none sm:ml-4 sm:w-auto">
          <NavLink to="/" className={navLinkClass} end>
            <span className="sm:hidden">{t("nav.cases.short")}</span>
            <span className="hidden sm:inline">{t("nav.cases")}</span>
          </NavLink>
          <NavLink to="/daily" className={navLinkClass}>
            <span className="sm:hidden">{t("nav.daily.short")}</span>
            <span className="hidden sm:inline">{t("nav.daily")}</span>
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            <span className="sm:hidden">{t("nav.profile.short")}</span>
            <span className="hidden sm:inline">{t("nav.profile")}</span>
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <ToggleButton onClick={toggleLang} title={t("lang.label")}>
            {lang === "vi" ? "VI" : "EN"}
          </ToggleButton>
          <ToggleButton
            onClick={toggleTheme}
            title={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
          >
            {theme === "dark" ? "☾" : "☀"}
          </ToggleButton>

          {detective ? (
            <span className="hidden max-w-36 truncate text-xs text-[var(--color-amber)] md:block">
              {detective.name} · {t(`rank.${rank}` as never)}
            </span>
          ) : user ? (
            <span className="hidden max-w-32 truncate text-xs text-[var(--color-smoke)] md:block">
              {user.displayName ?? user.email ?? t("auth.signedInAs")}
            </span>
          ) : null}
          {user ? (
            <button
              type="button"
              onClick={() => void signOutUser()}
              className="btn-ghost min-h-11 min-w-11 rounded-sm px-3 py-1.5 text-xs"
            >
              {t("auth.logout")}
            </button>
          ) : isFirebaseConfigured ? (
            <Link
              to="/login"
              className="btn-amber flex min-h-11 items-center rounded-sm px-3 py-1.5 text-xs"
            >
              {t("auth.login")}
            </Link>
          ) : !detective && !user ? (
            <span className="hidden text-xs text-[var(--color-smoke)] lg:block">
              {t("auth.anonymous")}
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}
