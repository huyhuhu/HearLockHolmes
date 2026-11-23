import { Link, useParams } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { getSeedClip } from "../data/seed";
import { MicroLoop } from "../features/loop/MicroLoop";

export function ClipPage() {
  const { t } = useI18n();
  const { clipId } = useParams<{ clipId: string }>();
  const clip = clipId ? getSeedClip(clipId) : undefined;

  if (!clip) {
    return (
      <main className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <p className="font-brand text-xs tracking-[0.4em] text-[var(--color-smoke)]">
          404 — EVIDENCE MISSING
        </p>
        <h1 className="neon-text font-display text-3xl tracking-wide">
          {t("clip.notFound")}
        </h1>
        <Link to="/" className="btn-amber rounded-sm px-5 py-2.5 text-sm">
          {t("clip.backHome")}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 lg:pb-20">
      <header className="mb-6 flex flex-col gap-2">
        <p className="font-brand text-[11px] tracking-[0.32em] text-[var(--color-smoke)]">
          {t("clip.eyebrow")} — LEVEL {clip.level}
        </p>
        <h1 className="font-display text-2xl leading-snug tracking-wide text-[var(--color-chalk)] md:text-3xl">
          {clip.title}
        </h1>
        <p className="text-sm text-[var(--color-smoke)]">
          {clip.durationSec}s · {clip.category}
        </p>
      </header>

      <MicroLoop clip={clip} />
    </main>
  );
}
