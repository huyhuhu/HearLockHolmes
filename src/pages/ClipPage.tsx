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
      <main className="mx-auto max-w-lg px-4 py-16">
        <div className="polaroid anim-pop mx-auto max-w-md p-6 pb-10 text-center">
          <p className="font-brand text-[10px] tracking-[0.28em] text-black/50">
            404 — EVIDENCE MISSING
          </p>
          <div className="mx-auto mt-5 flex h-24 w-24 items-center justify-center rounded-sm border-2 border-dashed border-black/25 bg-black/5">
            <span className="font-brand text-2xl text-black/25">∅</span>
          </div>
          <h1 className="mt-5 font-display text-xl tracking-wide text-black/85">
            {t("clip.notFound")}
          </h1>
          <Link
            to="/"
            className="btn-amber mt-6 inline-flex min-h-11 rounded-sm px-5 py-2.5 text-sm"
          >
            {t("clip.backHome")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 lg:pb-20">
      <header className="mb-6 flex flex-col gap-2">
        <p className="font-brand-i18n text-[11px] tracking-[0.32em] text-[var(--color-smoke)]">
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
