/**
 * NHIỆM VỤ GIẢI MÃ — chọn "dạng sạch" của từng cụm (3–4 lựa chọn)
 * + 3 câu hiểu nghĩa MCQ gắn manh mối với vụ án (SPEC §1.3).
 */
import { useI18n } from "../../lib/i18n";
import type { Clip, Cluster } from "../../types/content";
import { useClipPlayer } from "../player/ClipPlayer";
import { progressStore } from "../progress/store";
import { useGame } from "../game/GameProvider";
import {
  Eyebrow,
  McqChoices,
  SectionCard,
  SentenceStepper,
} from "./LoopChrome";
import { spanWithMargin } from "./DissectStage";

export type ClusterAnswer = {
  choice: number;
  attempts: number;
  correct: boolean;
};

export function DecodeStage({
  clip,
  sentenceIndex,
  onSentenceIndex,
  answers,
  onAnswerCluster,
  comprehension,
  onAnswerComprehension,
  onToRelisten,
  onJumpClusters,
}: {
  clip: Clip;
  sentenceIndex: number;
  onSentenceIndex: (i: number) => void;
  answers: Record<string, ClusterAnswer>;
  onAnswerCluster: (cluster: Cluster, choice: number) => void;
  comprehension: Record<number, number>;
  onAnswerComprehension: (index: number, choice: number) => void;
  onToRelisten: () => void;
  onJumpClusters: () => void;
}) {
  const { t, lang } = useI18n();
  const { api } = useClipPlayer();
  const { notify } = useGame();
  const sentence = clip.sentences[sentenceIndex];
  const clipDurationMs = clip.durationSec * 1000;

  if (!sentence) return null;

  const totalClusters = clip.sentences.reduce(
    (n, s) => n + s.clusters.length,
    0,
  );
  const solved = Object.values(answers).filter((a) => a.correct).length;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <Eyebrow>{t("loop.decode.eyebrow")}</Eyebrow>
        <p className="text-sm leading-relaxed text-[var(--color-smoke)]">
          {t("loop.decode.hint")}
        </p>
        {solved < totalClusters ? (
          <p className="text-xs text-[var(--color-smoke)]">
            {t("loop.decode.remaining", { n: totalClusters - solved })}
          </p>
        ) : null}
      </header>

      <SentenceStepper
        index={sentenceIndex}
        total={clip.sentences.length}
        onPrev={() => onSentenceIndex(Math.max(0, sentenceIndex - 1))}
        onNext={() =>
          onSentenceIndex(Math.min(clip.sentences.length - 1, sentenceIndex + 1))
        }
        onPlay={() => {
          api.playSpan(sentence.startMs, sentence.endMs, { loop: false });
          progressStore.recordEvent({ type: "replay", clipId: clip.id });
          notify({ kind: "replay", clipId: clip.id });
        }}
      />

      {sentence.clusters.length === 0 ? (
        <SectionCard>
          <p className="text-sm text-[var(--color-smoke)]">
            {t("loop.dissect.noClusters")}
          </p>
          <button
            type="button"
            onClick={onJumpClusters}
            className="btn-ghost mt-3 min-h-11 rounded-sm px-4 py-2.5 text-sm"
          >
            {t("loop.nav.jumpClusters")}
          </button>
        </SectionCard>
      ) : (
        sentence.clusters.map((cluster) => {
          const answer = answers[cluster.id];
          return (
            <SectionCard key={cluster.id}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[color-mix(in_srgb,var(--color-amber)_40%,transparent)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--color-amber)]">
                  {t(`cat.${cluster.category}` as Parameters<typeof t>[0])}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const [a, b] = spanWithMargin(cluster, clipDurationMs);
                    api.playSpan(a, b);
                    progressStore.recordEvent({
                      type: "seek",
                      clipId: clip.id,
                      clusterId: cluster.id,
                      category: cluster.category,
                    });
                    notify({
                      kind: "seek",
                      clipId: clip.id,
                      clusterId: cluster.id,
                      category: cluster.category,
                    });
                  }}
                  className="btn-ghost min-h-11 rounded-sm px-3 py-2 text-xs"
                >
                  ▶ {t("loop.decode.hear")}
                </button>
              </div>

              <p className="mb-3 text-sm font-semibold text-[var(--color-chalk)]">
                {t("loop.decode.prompt")}
              </p>

              <McqChoices
                choices={cluster.cleanForms}
                value={answer?.choice ?? null}
                correctIndex={cluster.answerIndex}
                reveal={answer?.correct === true}
                disabled={answer?.correct === true}
                onPick={(choice) => {
                  if (answer?.correct) return;
                  onAnswerCluster(cluster, choice);
                }}
              />

              {answer ? (
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    answer.correct ? "text-[var(--color-amber)]" : "text-[var(--color-neon-soft)]"
                  }`}
                >
                  {answer.correct ? t("loop.decode.correct") : t("loop.decode.wrong")}
                </p>
              ) : null}

              {answer?.correct && cluster.note ? (
                <p className="mt-3 rounded-sm border-l-2 border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_8%,transparent)] px-3 py-2 text-sm leading-relaxed text-[var(--color-smoke)]">
                  <span className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-[var(--color-amber)]">
                    {t("loop.decode.note")}
                  </span>
                  {cluster.note[lang]}
                </p>
              ) : null}
            </SectionCard>
          );
        })
      )}

      <SectionCard title={t("loop.decode.report")} tone="paper">
        <p className="mb-4 text-xs leading-relaxed text-[var(--color-smoke)]">
          {t("loop.decode.reportHint")}
        </p>
        <div className="flex flex-col gap-5">
          {clip.comprehension.map((q, i) => (
            <div key={`${i}-${q.prompt.en}`}>
              <p className="mb-2 text-sm font-semibold leading-relaxed text-[var(--color-chalk)]">
                {q.prompt[lang]}
              </p>
              <McqChoices
                choices={q.choices.map((c) => c[lang])}
                value={comprehension[i] ?? null}
                correctIndex={q.answerIndex}
                reveal={comprehension[i] !== undefined}
                onPick={(choice) => {
                  if (comprehension[i] === undefined) {
                    onAnswerComprehension(i, choice);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <button
        type="button"
        onClick={onToRelisten}
        className="btn-amber min-h-11 w-full rounded-sm px-5 py-3 text-sm"
      >
        {t("loop.decode.toRelisten")} →
      </button>
    </div>
  );
}
