import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../../lib/i18n";
import { useTheme } from "../../lib/theme";
import { useAuth } from "../../features/auth/AuthProvider";

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

        <nav className="order-last flex w-full items-center gap-5 sm:order-none sm:ml-auto sm:w-auto">
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

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden max-w-32 truncate text-xs text-[var(--color-smoke)] md:block">
                {user.displayName ?? user.email ?? t("auth.signedInAs")}
              </span>
              <button
                type="button"
                onClick={() => void signOutUser()}
                className="btn-ghost min-h-11 min-w-11 rounded-sm px-3 py-1.5 text-xs"
              >
                {t("auth.logout")}
              </button>
            </div>
          ) : isFirebaseConfigured ? (
            <Link
              to="/login"
              className="btn-amber flex min-h-11 items-center rounded-sm px-3 py-1.5 text-xs"
            >
              {t("auth.login")}
            </Link>
          ) : (
            <span className="hidden text-xs text-[var(--color-smoke)] lg:block">
              {t("auth.anonymous")}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
