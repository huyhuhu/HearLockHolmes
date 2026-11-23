/**
 * Case Board (GĐ5) — danh sách vụ nhỏ + boss, trạng thái manh mối,
 * boss khóa đến khi phá vụ nhỏ (hiệu ứng khóa rung khi click).
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../lib/i18n";
import type { CaseFile, Clip } from "../../types/content";
import type { CaseStatus } from "./caseStatus";
import { clusterCount } from "./caseStatus";

function CaseCard({
  caseFile,
  status,
  clipsById,
  index,
}: {
  caseFile: CaseFile;
  status: CaseStatus;
  clipsById: Map<string, Clip>;
  index: number;
}) {
  const { lang, t } = useI18n();
  const [shake, setShake] = useState(false);
  const isBoss = caseFile.type === "boss";

  return (
    <article
      style={{ animationDelay: `${80 + index * 90}ms` }}
      className={`anim-fade-up polaroid clue-pin relative w-full max-w-2xl p-5 pb-8 ${
        status.locked ? "locked" : ""
      }`}
    >
      {status.cracked ? (
        <div className="anim-stamp pointer-events-none absolute -right-2 top-6 z-10 select-none rounded-sm border-2 border-[var(--color-neon)] px-3 py-1 font-brand text-sm tracking-[0.25em] text-[var(--color-neon)] opacity-90">
          {isBoss ? "BOSS DOWN" : "CASE CLOSED"}
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <p className="font-brand text-xs tracking-[0.25em] text-black/50">
          {isBoss ? "BOSS" : `CASE · L${caseFile.level}`}
        </p>
        <p className="font-brand text-[10px] tracking-[0.2em] text-black/45">
          {Math.round(status.progress * 100)}%
        </p>
      </div>

      <h3 className="mt-2 font-display text-lg text-black/85">
        {lang === "vi" ? caseFile.titleVi : caseFile.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-black/60">
        {lang === "vi" ? caseFile.synopsisVi : caseFile.synopsis}
      </p>

      {/* tiến độ phá án */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="anim-bar h-full rounded-full bg-[var(--color-amber-deep)]"
          style={{ width: `${Math.round(status.progress * 100)}%` }}
        />
      </div>

      <ul className="mt-5 space-y-2">
        {caseFile.clipIds.map((id) => {
          const clip = clipsById.get(id);
          const st = status.clips.find((c) => c.clipId === id);
          if (!clip) return null;
          const total = clusterCount(clip);
          return (
            <li key={id}>
              <Link
                to={`/clip/${id}`}
                className="group flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 rounded-sm border border-black/15 px-3 py-2.5 text-sm text-black/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-black/40 hover:bg-black/5 hover:shadow-md"
              >
                <span className="font-brand text-xs tracking-[0.15em] text-black/50">
                  L{clip.level}
                </span>
                <span className="min-w-0 flex-1 truncate">{clip.title}</span>
                <span className="flex items-center gap-1.5">
                  {/* đèn trạng thái từng clip */}
                  <span
                    className={`h-2 w-2 rounded-full ${
                      st?.complete
                        ? "bg-emerald-600"
                        : (st?.comprehensionScore ?? 0) >= 0.7
                          ? "bg-[var(--color-amber-deep)]"
                          : "bg-black/25"
                    }`}
                    title="comprehension"
                  />
                  <span className="font-brand text-[10px] tracking-[0.15em] text-black/45">
                    {st ? st.decoded : 0}/{total}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {status.locked ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setShake(true);
            window.setTimeout(() => setShake(false), 420);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setShake(true);
              window.setTimeout(() => setShake(false), 420);
            }
          }}
          className={`mt-5 rounded-sm border border-dashed border-black/30 bg-black/5 px-4 py-3 text-center text-sm text-black/60 ${
            shake ? "anim-shake" : ""
          }`}
        >
          🔒 {t("case.locked")}
        </div>
      ) : null}

      {status.cracked ? (
        <p className="mt-4 text-xs italic text-black/55">
          {isBoss ? t("case.bossCracked") : t("case.smallCracked")}
        </p>
      ) : (
        <p className="mt-4 text-xs text-black/55">
          {isBoss ? t("case.bossNeed") : t("case.smallNeed")}
        </p>
      )}
    </article>
  );
}

export function CaseBoard({
  cases,
  clips,
  caseStatuses,
}: {
  cases: CaseFile[];
  clips: Clip[];
  caseStatuses: Map<string, CaseStatus>;
}) {
  const { lang, t } = useI18n();
  const clipsById = new Map(clips.map((c) => [c.id, c]));

  return (
    <section>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)]" />
        <h2 className="font-brand text-sm tracking-[0.3em] text-[var(--color-amber)]">
          CASE BOARD
        </h2>
        <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)]" />
      </div>

      <div className="stagger mt-10 flex flex-col items-center gap-10">
        {cases.map((c, i) => {
          const status = caseStatuses.get(c.id);
          if (!status) return null;
          return (
            <CaseCard
              key={c.id}
              caseFile={c}
              status={status}
              clipsById={clipsById}
              index={i}
            />
          );
        })}
      </div>

      {clips.some((c) => c.id === "clip-afjm-01") ? (
        <div className="anim-fade-up mx-auto mt-10 w-full max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)]" />
            <h2 className="font-brand text-sm tracking-[0.3em] text-[var(--color-smoke)]">
              DRILL — {t("case.drill")}
            </h2>
            <div className="h-px flex-1 bg-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)]" />
          </div>
          <div className="polaroid mt-8 w-full p-5 pb-8">
            <p className="font-brand text-xs tracking-[0.25em] text-black/50">L4 · DRILL</p>
            <h3 className="mt-2 font-display text-lg text-black/85">
              {lang === "vi"
                ? "Clip lẻ — luyện tập & kỳ sát hạch"
                : "Standalone — practice & exam drill"}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/clip/clip-afjm-01"
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-black/15 px-3 py-2.5 text-sm text-black/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-black/40 hover:bg-black/5"
                >
                  <span className="font-brand text-xs tracking-[0.15em] text-black/50">L4</span>
                  {clipsById.get("clip-afjm-01")?.title}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}
