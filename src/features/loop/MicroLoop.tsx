/**
 * Micro-loop — trái tim game (SPEC §1).
 * NGHE MÙ → cổng gist gate → MỔ XẺ → GIẢI MÃ → NGHE LẠI.
 *
 * Luật: KHÔNG hiện chữ trước khi qua gist gate.
 * Mọi trạng thái đến từ dữ liệu học thật + sự kiện thật (không hardcode thắng).
 */
import { useMemo, useState } from "react";
import { useI18n } from "../../lib/i18n";
import type { Clip, Cluster, Sentence } from "../../types/content";
import { progressStore } from "../progress/store";
import {
  ClipPlayerProvider,
  useClipPlayerController,
} from "../player/ClipPlayer";
import { PlayerPanel } from "../player/PlayerPanel";
import { StageRail, type Stage } from "./LoopChrome";
import { BlindStage } from "./BlindStage";
import { DissectStage } from "./DissectStage";
import { DecodeStage, type ClusterAnswer } from "./DecodeStage";
import { RelistenStage } from "./RelistenStage";

function nextClusterIndex(sentences: Sentence[], from: number): number {
  for (let i = from + 1; i < sentences.length; i += 1) {
    if (sentences[i].clusters.length > 0) return i;
  }
  for (let i = 0; i <= from && i < sentences.length; i += 1) {
    if (sentences[i].clusters.length > 0) return i;
  }
  return from;
}

export function MicroLoop({ clip }: { clip: Clip }) {
  const { t } = useI18n();
  const clipDurationMs = Math.round(clip.durationSec * 1000);

  const controller = useClipPlayerController({
    videoId: clip.videoId,
    startOffsetMs: clip.startOffsetMs,
    clipDurationMs,
  });

  const [stage, setStage] = useState<Stage>("blind");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [activeClusterId, setActiveClusterId] = useState<string | null>(null);
  const [gistChoice, setGistChoice] = useState<number | null>(null);
  const [gistRevealed, setGistRevealed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, ClusterAnswer>>({});
  const [comprehension, setComprehension] = useState<Record<number, number>>({});
  const [fuzzy, setFuzzy] = useState<Record<string, boolean>>({});
  const [filedClusterIds, setFiledClusterIds] = useState<string[]>(() =>
    progressStore.getClues(clip.id).map((c) => c.clusterId),
  );

  const jumpClusters = () => {
    setActiveClusterId(null);
    setSentenceIndex((i) => nextClusterIndex(clip.sentences, i));
  };

  const answerGist = (choice: number) => {
    setGistChoice(choice);
    setGistRevealed(true);
    const hit = choice === clip.gistQuestion.answerIndex;
    if (hit) progressStore.upsertProgress(clip.id, { gistPassed: true });
  };

  const answerCluster = (cluster: Cluster, choice: number) => {
    const prev = answers[cluster.id];
    const correct = choice === cluster.answerIndex;
    setAnswers((current) => ({
      ...current,
      [cluster.id]: {
        choice,
        attempts: (current[cluster.id]?.attempts ?? 0) + 1,
        correct: current[cluster.id]?.correct || correct,
      },
    }));
    progressStore.recordEvent({
      type: correct ? "decode_hit" : "decode_miss",
      clipId: clip.id,
      clusterId: cluster.id,
      category: cluster.category,
    });
    if (correct && !prev?.correct) {
      progressStore.upsertProgress(clip.id, {
        decodedClusters: [cluster.id],
      });
    }
  };

  const answerComprehension = (index: number, choice: number) => {
    setComprehension((current) => ({ ...current, [index]: choice }));
    const answered = { ...comprehension, [index]: choice };
    const total = clip.comprehension.length;
    const hits = clip.comprehension.filter(
      (q, i) => answered[i] === q.answerIndex,
    ).length;
    progressStore.upsertProgress(clip.id, {
      comprehensionScore: total > 0 ? hits / total : 0,
    });
  };

  const toggleFuzzy = (sentenceId: string) => {
    const next = !(fuzzy[sentenceId] === true);
    setFuzzy((current) => ({ ...current, [sentenceId]: next }));
    if (next) {
      progressStore.recordEvent({ type: "self_fuzzy", clipId: clip.id });
    }
  };

  const fileClues = (clusters: Cluster[]) => {
    const at = Date.now();
    clusters.forEach((cluster) => {
      const answer = answers[cluster.id];
      progressStore.saveClue({
        clipId: clip.id,
        clusterId: cluster.id,
        decodedAt: at,
        attempts: answer?.attempts ?? 0,
        correct: answer?.correct ?? false,
      });
    });
    setFiledClusterIds((current) => [
      ...new Set([...current, ...clusters.map((c) => c.id)]),
    ]);
  };

  const finish = () => {
    const current = progressStore.getProgress(clip.id);
    progressStore.upsertProgress(clip.id, {
      completedAt: Date.now(),
      listens: current.listens + 1,
    });
    setStage("done");
  };

  const restart = () => {
    setStage("blind");
    setSentenceIndex(0);
    setActiveClusterId(null);
    controller.api.clearLoop();
    controller.api.seekMs(0);
    controller.api.pause();
  };

  const decodedCount = useMemo(
    () => Object.values(answers).filter((a) => a.correct).length,
    [answers],
  );

  return (
    <ClipPlayerProvider controller={controller}>
      <div className="flex flex-col gap-5">
        <StageRail stage={stage} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start">
          <PlayerPanel sentences={clip.sentences} durationMs={clipDurationMs} />

          <div className="flex min-w-0 flex-col gap-4">
            {stage === "blind" ? (
              <BlindStage
                clip={clip}
                sentenceIndex={sentenceIndex}
                onSentenceIndex={setSentenceIndex}
                gistChoice={gistChoice}
                gistRevealed={gistRevealed}
                onAnswerGist={answerGist}
                onEnterLab={() => setStage("dissect")}
              />
            ) : null}

            {stage === "dissect" ? (
              <DissectStage
                clip={clip}
                sentenceIndex={sentenceIndex}
                onSentenceIndex={setSentenceIndex}
                activeClusterId={activeClusterId}
                onActiveCluster={setActiveClusterId}
                onToDecode={() => setStage("decode")}
                onToRelisten={() => setStage("relisten")}
                onJumpClusters={jumpClusters}
              />
            ) : null}

            {stage === "decode" ? (
              <DecodeStage
                clip={clip}
                sentenceIndex={sentenceIndex}
                onSentenceIndex={setSentenceIndex}
                answers={answers}
                onAnswerCluster={answerCluster}
                comprehension={comprehension}
                onAnswerComprehension={answerComprehension}
                onToRelisten={() => setStage("relisten")}
                onJumpClusters={jumpClusters}
              />
            ) : null}

            {stage === "relisten" ? (
              <RelistenStage
                clip={clip}
                sentenceIndex={sentenceIndex}
                onSentenceIndex={setSentenceIndex}
                answers={answers}
                fuzzy={fuzzy}
                onToggleFuzzy={toggleFuzzy}
                filedClusterIds={filedClusterIds}
                onFileClues={fileClues}
                onFinish={finish}
                onJumpClusters={jumpClusters}
              />
            ) : null}

            {stage === "done" ? (
              <section className="flex flex-col gap-4 rounded-sm border border-[color-mix(in_srgb,var(--color-amber)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-amber)_10%,transparent)] px-5 py-6">
                <p className="font-brand text-[11px] tracking-[0.32em] text-[var(--color-amber)]">
                  CASE NOTES
                </p>
                <h2 className="font-display text-2xl tracking-wide text-[var(--color-chalk)]">
                  {t("loop.done.title")}
                </h2>
                <p className="text-sm leading-relaxed text-[var(--color-smoke)]">
                  {t("loop.done.sub")}
                </p>
                <dl className="flex flex-wrap gap-3">
                  <div className="min-w-32 flex-1 rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_16%,transparent)] px-3 py-3">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-smoke)]">
                      {t("loop.done.decoded")}
                    </dt>
                    <dd className="font-brand text-2xl text-[var(--color-amber)]">
                      {decodedCount}
                    </dd>
                  </div>
                  <div className="min-w-32 flex-1 rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_16%,transparent)] px-3 py-3">
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-smoke)]">
                      {t("loop.done.clues")}
                    </dt>
                    <dd className="font-brand text-2xl text-[var(--color-amber)]">
                      {filedClusterIds.length}
                    </dd>
                  </div>
                </dl>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={restart}
                    className="btn-amber min-h-11 rounded-sm px-5 py-3 text-sm"
                  >
                    {t("loop.done.again")}
                  </button>
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </ClipPlayerProvider>
  );
}
