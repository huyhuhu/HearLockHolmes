/**
 * Màn NGHE LẠI (Ghi vào hồ sơ) — phát lại full câu sau khi đã hiểu,
 * tự chấm "vẫn còn mơ", ghi manh mối vào sổ tay (local trước, Firestore sau).
 */
import { useI18n } from "../../lib/i18n";
import type { Clip, Cluster } from "../../types/content";
import { useClipPlayer } from "../player/ClipPlayer";
import { progressStore } from "../progress/store";
import {
  ClusterTranscript,
  Eyebrow,
  SectionCard,
  SentenceStepper,
} from "./LoopChrome";
import type { ClusterAnswer } from "./DecodeStage";

export function RelistenStage({
  clip,
  sentenceIndex,
  onSentenceIndex,
  answers,
  fuzzy,
  onToggleFuzzy,
  filedClusterIds,
  onFileClues,
  onFinish,
  onJumpClusters,
}: {
  clip: Clip;
  sentenceIndex: number;
  onSentenceIndex: (i: number) => void;
  answers: Record<string, ClusterAnswer>;
  fuzzy: Record<string, boolean>;
  onToggleFuzzy: (sentenceId: string) => void;
  filedClusterIds: string[];
  onFileClues: (clusters: Cluster[]) => void;
  onFinish: () => void;
  onJumpClusters: () => void;
}) {
  const { t } = useI18n();
  const { api } = useClipPlayer();
  const sentence = clip.sentences[sentenceIndex];

  if (!sentence) return null;

  const isFuzzy = fuzzy[sentence.id] === true;
  const pending = sentence.clusters.filter((c) => !filedClusterIds.includes(c.id));

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <Eyebrow>{t("loop.relisten.eyebrow")}</Eyebrow>
        <p className="text-sm leading-relaxed text-[var(--color-smoke)]">
          {t("loop.relisten.hint")}
        </p>
      </header>

      <SentenceStepper
        index={sentenceIndex}
        total={clip.sentences.length}
        onPrev={() => onSentenceIndex(Math.max(0, sentenceIndex - 1))}
        onNext={() =>
          onSentenceIndex(Math.min(clip.sentences.length - 1, sentenceIndex + 1))
        }
        extra={
          <button
            type="button"
            onClick={onJumpClusters}
            className="btn-ghost min-h-11 rounded-sm px-3 py-2 text-xs"
          >
            {t("loop.nav.jumpClusters")}
          </button>
        }
      />

      <SectionCard>
        <ClusterTranscript
          sentence={sentence}
          onClusterTap={(cluster) => {
            const clipDurationMs = clip.durationSec * 1000;
            const start = Math.max(0, cluster.span[0] - 1000);
            const end = Math.min(clipDurationMs, cluster.span[1] + 1000);
            api.playSpan(start, Math.max(start + 200, end));
            progressStore.recordEvent({
              type: "seek",
              clipId: clip.id,
              clusterId: cluster.id,
              category: cluster.category,
            });
          }}
          onSentenceTap={() => {
            api.playSpan(sentence.startMs, sentence.endMs);
            progressStore.recordEvent({ type: "replay", clipId: clip.id });
          }}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              api.playSpan(sentence.startMs, sentence.endMs);
              progressStore.recordEvent({ type: "replay", clipId: clip.id });
            }}
            className="btn-amber min-h-11 flex-1 rounded-sm px-4 py-2.5 text-xs"
          >
            ▶ {t("loop.relisten.playSentence")}
          </button>

          <button
            type="button"
            onClick={() => onToggleFuzzy(sentence.id)}
            className={`min-h-11 flex-1 rounded-sm border px-4 py-2.5 text-xs transition-colors ${
              isFuzzy
                ? "border-[var(--color-neon)] bg-[color-mix(in_srgb,var(--color-neon)_16%,transparent)] text-[var(--color-chalk)]"
                : "border-[color-mix(in_srgb,var(--color-chalk)_24%,transparent)] text-[var(--color-chalk)]"
            }`}
          >
            {isFuzzy ? `✓ ${t("loop.relisten.fuzzy")}` : t("loop.relisten.fuzzy")}
          </button>
        </div>
      </SectionCard>

      <SectionCard title={t("loop.relisten.save")} tone="paper">
        {sentence.clusters.length === 0 ? (
          <p className="text-sm text-[var(--color-smoke)]">
            {t("loop.relisten.noClusters")}
          </p>
        ) : (
          <>
            <ul className="mb-4 flex flex-col gap-2">
              {sentence.clusters.map((cluster) => {
                const filed = filedClusterIds.includes(cluster.id);
                const answer = answers[cluster.id];
                return (
                  <li
                    key={cluster.id}
                    className="flex min-h-11 items-center gap-3 rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)] px-3 py-2.5 text-sm"
                  >
                    <span
                      aria-hidden
                      className={`font-brand text-xs ${
                        filed ? "text-[var(--color-amber)]" : "text-[var(--color-smoke)]"
                      }`}
                    >
                      {filed ? "📌" : "·"}
                    </span>
                    <span className="flex-1 leading-relaxed text-[var(--color-chalk)]">
                      {cluster.note ?? cluster.cleanForms[cluster.answerIndex]}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-smoke)]">
                      {t(`cat.${cluster.category}` as Parameters<typeof t>[0])}
                      {answer?.correct ? " ✓" : ""}
                    </span>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              disabled={pending.length === 0}
              onClick={() => onFileClues(sentence.clusters)}
              className="btn-amber min-h-11 w-full rounded-sm px-5 py-3 text-sm disabled:opacity-45"
            >
              {t("loop.relisten.save")}
            </button>

            {pending.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--color-amber)]">
                {t("loop.relisten.saved", { n: sentence.clusters.length })}
              </p>
            ) : null}
          </>
        )}
      </SectionCard>

      <button
        type="button"
        onClick={onFinish}
        className="btn-ghost min-h-11 w-full rounded-sm px-5 py-3 text-sm"
      >
        {t("loop.relisten.finish")}
      </button>
    </div>
  );
}
