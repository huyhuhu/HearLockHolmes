/**
 * Màn MỔ XẺ (Phòng thí nghiệm) — transcript từng câu, highlight 2–3 cụm.
 * Click cụm → play đúng đoạn ±1s (seek + A–B loop).
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

/** "nghe đoạn đó" = [span − 1s, span + 1s] — SPEC §1 / annotate-format §3 */
export function spanWithMargin(
  cluster: Cluster,
  clipDurationMs: number,
): [number, number] {
  const start = Math.max(0, cluster.span[0] - 1000);
  const end = Math.min(clipDurationMs, cluster.span[1] + 1000);
  return [start, Math.max(start + 200, end)];
}

export function DissectStage({
  clip,
  sentenceIndex,
  onSentenceIndex,
  activeClusterId,
  onActiveCluster,
  onToDecode,
  onToRelisten,
  onJumpClusters,
}: {
  clip: Clip;
  sentenceIndex: number;
  onSentenceIndex: (i: number) => void;
  activeClusterId: string | null;
  onActiveCluster: (id: string | null) => void;
  onToDecode: () => void;
  onToRelisten: () => void;
  onJumpClusters: () => void;
}) {
  const { t } = useI18n();
  const { api } = useClipPlayer();
  const sentence = clip.sentences[sentenceIndex];
  const clipDurationMs = clip.durationSec * 1000;

  if (!sentence) return null;

  const playCluster = (cluster: Cluster) => {
    const [a, b] = spanWithMargin(cluster, clipDurationMs);
    onActiveCluster(cluster.id);
    api.playSpan(a, b);
    progressStore.recordEvent({
      type: "seek",
      clipId: clip.id,
      clusterId: cluster.id,
      category: cluster.category,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <Eyebrow>{t("loop.dissect.eyebrow")}</Eyebrow>
        <p className="text-sm leading-relaxed text-[var(--color-smoke)]">
          {t("loop.dissect.hint")}
        </p>
      </header>

      <SentenceStepper
        index={sentenceIndex}
        total={clip.sentences.length}
        onPrev={() => {
          onActiveCluster(null);
          onSentenceIndex(Math.max(0, sentenceIndex - 1));
        }}
        onNext={() => {
          onActiveCluster(null);
          onSentenceIndex(Math.min(clip.sentences.length - 1, sentenceIndex + 1));
        }}
        onPlay={() => {
          onActiveCluster(null);
          api.playSpan(sentence.startMs, sentence.endMs, { loop: false });
          progressStore.recordEvent({ type: "replay", clipId: clip.id });
        }}
      />

      <SectionCard>
        <ClusterTranscript
          sentence={sentence}
          activeClusterId={activeClusterId}
          onClusterTap={playCluster}
        />
      </SectionCard>

      <div className="flex flex-wrap gap-2">
        {sentence.clusters.length > 0 ? (
          <button
            type="button"
            onClick={onToDecode}
            className="btn-amber min-h-11 flex-1 rounded-sm px-5 py-3 text-sm"
          >
            {t("loop.dissect.toDecode")} →
          </button>
        ) : (
          <>
            <p className="w-full text-sm text-[var(--color-smoke)]">
              {t("loop.dissect.noClusters")}
            </p>
            <button
              type="button"
              onClick={onJumpClusters}
              className="btn-ghost min-h-11 rounded-sm px-4 py-3 text-sm"
            >
              {t("loop.nav.jumpClusters")}
            </button>
            <button
              type="button"
              onClick={onToRelisten}
              className="btn-amber min-h-11 flex-1 rounded-sm px-5 py-3 text-sm"
            >
              {t("loop.dissect.toRelisten")} →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
