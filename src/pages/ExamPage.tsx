/**
 * Kỳ sát hạch lên rank (GĐ5) — đoạn full speed KHÔNG phụ đề, không transcript.
 * Đạt ngưỡng hiểu nghĩa (≥70%) → phong hàm bậc kế + lưu ExamRecord.
 */
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { useGame } from "../features/game/GameProvider";
import { getSeedClip } from "../data/seed";
import type { Clip, MultipleChoice } from "../types/content";
import type { Rank } from "../types/user";

const EXAM_CLIPS: Record<Exclude<Rank, "trainee">, string> = {
  veteran: "clip-afjm-01",
  legend: "clip-gtalive-01",
};

type Phase = "intro" | "listen" | "quiz" | "result";

function QuestionCard({
  q,
  index,
  choice,
  onChoice,
  revealed,
}: {
  q: MultipleChoice;
  index: number;
  choice: number | null;
  onChoice: (i: number) => void;
  revealed: boolean;
}) {
  const { lang } = useI18n();  return (
    <div className="rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_16%,transparent)] bg-[color-mix(in_srgb,var(--color-ink)_75%,transparent)] px-5 py-5">
      <p className="font-brand text-[10px] tracking-[0.3em] text-[var(--color-smoke)]">
        QUESTION {index + 1}
      </p>
      <p className="mt-2 text-base leading-relaxed text-[var(--color-chalk)]">
        {lang === "vi" ? q.prompt.vi : q.prompt.en}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {q.choices.map((c, i) => {
          const picked = choice === i;
          const correct = revealed && i === q.answerIndex;
          const wrong = revealed && picked && i !== q.answerIndex;
          return (
            <button
              key={i}
              type="button"
              disabled={revealed}
              onClick={() => onChoice(i)}
              className={`min-h-11 rounded-sm border px-4 py-3 text-left text-sm transition-all duration-200 ${
                correct
                  ? "border-emerald-500 bg-emerald-500/15 text-[var(--color-chalk)]"
                  : wrong
                    ? "border-[var(--color-neon)] bg-[var(--color-neon)]/10 text-[var(--color-chalk)]"
                    : picked
                      ? "border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_12%,transparent)] text-[var(--color-chalk)]"
                      : "border-[color-mix(in_srgb,var(--color-chalk)_18%,transparent)] text-[var(--color-smoke)] hover:border-[color-mix(in_srgb,var(--color-amber)_55%,transparent)] hover:text-[var(--color-chalk)]"
              }`}
            >
              <span className="font-brand text-[10px] tracking-[0.25em] text-[var(--color-amber)]">
                {String.fromCharCode(65 + i)}
              </span>{" "}
              {lang === "vi" ? c.vi : c.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ExamPage() {
  const { t } = useI18n();
  const { detective, examReady, examTarget, passExam, totalXp } = useGame();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("intro");
  const [choices, setChoices] = useState<Record<number, number>>({});

  const target = examTarget;
  const clip: Clip | undefined = useMemo(
    () => (target ? getSeedClip(EXAM_CLIPS[target]) : undefined),
    [target],
  );

  const score = useMemo(() => {
    if (!clip) return 0;
    const hits = clip.comprehension.filter((q, i) => choices[i] === q.answerIndex).length;
    return clip.comprehension.length ? hits / clip.comprehension.length : 0;
  }, [clip, choices]);

  const passed = score >= 0.7;

  if (!detective) {
    return (
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="anim-fade-up font-brand text-xs tracking-[0.4em] text-[var(--color-smoke)]">
          EXAM — NO DOSSIER
        </p>
        <h1 className="anim-fade-up neon-text mt-3 font-display text-3xl tracking-wide">
          {t("profile.noDetective")}
        </h1>
        <Link to="/onboard" className="btn-amber anim-fade-up mt-8 inline-flex min-h-11 rounded-sm px-6 py-3 text-sm">
          {t("home.createDetective")}
        </Link>
      </main>
    );
  }

  if (!target || !clip) {
    return (
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="anim-fade-up font-brand text-xs tracking-[0.4em] text-[var(--color-smoke)]">
          EXAM — MAX RANK
        </p>
        <h1 className="anim-fade-up neon-text mt-3 font-display text-3xl tracking-wide">
          {t("exam.maxed")}
        </h1>
        <Link to="/profile" className="btn-ghost anim-fade-up mt-8 inline-flex min-h-11 rounded-sm px-6 py-3 text-sm">
          {t("clip.backHome")}
        </Link>
      </main>
    );
  }

  const startQuiz = () => setPhase("quiz");
  const submit = () => {
    setPhase("result");
    if (passed) passExam(target, score);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-10">
      <p className="anim-fade-up font-brand text-xs tracking-[0.4em] text-[var(--color-neon-soft)]">
        RANK EXAM — FULL SPEED, NO SUBTITLES
      </p>
      <h1 className="anim-fade-up neon-text-red mt-3 font-display text-3xl tracking-wide md:text-4xl">
        {t("exam.title")}
      </h1>

      {phase === "intro" ? (
        <section className="anim-fade-up mt-8 rounded-sm border border-[color-mix(in_srgb,var(--color-neon)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-neon)_8%,transparent)] px-6 py-6">
          <h2 className="font-display text-xl tracking-wide text-[var(--color-chalk)]">
            {t("exam.introTitle", { rank: t(`rank.${target}` as never) })}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-smoke)]">
            {t("exam.introSub", { totalXp })}
          </p>
          <ul className="mt-4 list-inside list-disc space-y-1.5 text-sm text-[var(--color-smoke)]">
            <li>{t("exam.rule1")}</li>
            <li>{t("exam.rule2")}</li>
            <li>{t("exam.rule3")}</li>
          </ul>
          {examReady ? (
            <button
              type="button"
              onClick={() => setPhase("listen")}
              className="btn-amber mt-6 min-h-11 rounded-sm px-6 py-3 text-sm"
            >
              {t("exam.start")}
            </button>
          ) : (
            <>
              <p className="mt-4 text-sm text-[var(--color-neon-soft)]">
                {t("exam.locked", {
                  rank: t(`rank.${target}` as never),
                  threshold: target === "veteran" ? 1500 : 4000,
                })}
              </p>
              <button
                type="button"
                disabled
                className="btn-ghost mt-4 min-h-11 rounded-sm px-6 py-3 text-sm opacity-40"
              >
                {t("exam.start")}
              </button>
            </>
          )}
        </section>
      ) : null}

      {phase === "listen" ? (
        <section className="anim-fade-up mt-8">
          <div className="overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_20%,transparent)] bg-black">
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${clip.videoId}?start=${Math.floor(
                  clip.startOffsetMs / 1000,
                )}&rel=0&modestbranding=1`}
                title={clip.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-smoke)]">
            {t("exam.listenHint")}
          </p>
          <button
            type="button"
            onClick={startQuiz}
            className="btn-amber mt-6 min-h-11 rounded-sm px-6 py-3 text-sm"
          >
            {t("exam.toQuiz")}
          </button>
        </section>
      ) : null}

      {phase === "quiz" || phase === "result" ? (
        <section className="mt-8 flex flex-col gap-4">
          {clip.comprehension.map((q, i) => (
            <QuestionCard
              key={i}
              q={q}
              index={i}
              choice={choices[i] ?? null}
              onChoice={(ci) => setChoices((c) => ({ ...c, [i]: ci }))}
              revealed={phase === "result"}
            />
          ))}
          {phase === "quiz" ? (
            <button
              type="button"
              onClick={submit}
              disabled={Object.keys(choices).length < clip.comprehension.length}
              className="btn-amber mt-2 min-h-11 rounded-sm px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("exam.submit")}
            </button>
          ) : null}
        </section>
      ) : null}

      {phase === "result" ? (
        <section
          className={`anim-stamp mt-10 rounded-sm border px-6 py-8 text-center ${
            passed
              ? "border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_12%,transparent)]"
              : "border-[color-mix(in_srgb,var(--color-neon)_55%,transparent)] bg-[color-mix(in_srgb,var(--color-neon)_8%,transparent)]"
          }`}
        >
          <p className="font-brand text-[11px] tracking-[0.4em] text-[var(--color-smoke)]">
            RESULT
          </p>
          <p className="neon-text mt-3 font-brand text-5xl">
            {Math.round(score * 100)}%
          </p>
          <h2 className="mt-4 font-display text-2xl tracking-wide text-[var(--color-chalk)]">
            {passed ? t("exam.passed", { rank: t(`rank.${target}` as never) }) : t("exam.failed")}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-smoke)]">
            {passed ? t("exam.passedSub") : t("exam.failedSub")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {passed ? (
              <Link to="/profile" className="btn-amber min-h-11 rounded-sm px-6 py-3 text-sm">
                {t("exam.seeRank")}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setPhase("intro");
                  setChoices({});
                }}
                className="btn-amber min-h-11 rounded-sm px-6 py-3 text-sm"
              >
                {t("exam.retry")}
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-ghost min-h-11 rounded-sm px-6 py-3 text-sm"
            >
              {t("clip.backHome")}
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
