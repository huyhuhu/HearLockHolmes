/**
 * Khối UI dùng chung cho micro-loop: thanh bước, MCQ full-width,
 * bộ chuyển câu, transcript có cụm bấm được.
 * Quy tắc (SPEC §4): touch target ≥ 40px, không hover-only, không cuộn ngang.
 */
import type { ReactNode } from "react";
import { useI18n, type MsgKey } from "../../lib/i18n";
import type { Cluster, Sentence } from "../../types/content";

export type Stage = "blind" | "dissect" | "decode" | "relisten" | "done";

const STAGE_ORDER: Stage[] = ["blind", "dissect", "decode", "relisten"];

const STAGE_LABEL: Record<Stage, MsgKey> = {
  blind: "loop.stage.blind",
  dissect: "loop.stage.dissect",
  decode: "loop.stage.decode",
  relisten: "loop.stage.relisten",
  done: "loop.stage.done",
};

export function StageRail({ stage }: { stage: Stage }) {
  const { t } = useI18n();
  const current = STAGE_ORDER.indexOf(stage);

  return (
    <ol className="flex flex-wrap items-stretch gap-2">
      {STAGE_ORDER.map((key, i) => {
        const done = current > i || stage === "done";
        const active = stage === key;
        return (
          <li
            key={key}
            className={`flex min-h-11 flex-1 basis-32 items-center gap-2 rounded-sm border px-3 py-2 text-xs tracking-wide ${
              active
                ? "border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_16%,transparent)] text-[var(--color-amber)]"
                : done
                  ? "border-[color-mix(in_srgb,var(--color-amber)_35%,transparent)] text-[var(--color-chalk)]"
                  : "border-[color-mix(in_srgb,var(--color-chalk)_16%,transparent)] text-[var(--color-smoke)]"
            }`}
          >
            <span aria-hidden className="font-brand opacity-80">
              {done && !active ? "✓" : String(i + 1).padStart(2, "0")}
            </span>
            <span className="truncate">{t(STAGE_LABEL[key])}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-brand text-[11px] tracking-[0.32em] text-[var(--color-amber)]">
      {children}
    </p>
  );
}

export function SectionCard({
  title,
  children,
  tone = "ink",
}: {
  title?: ReactNode;
  children: ReactNode;
  tone?: "ink" | "paper";
}) {
  return (
    <section
      className={`rounded-sm border px-4 py-4 ${
        tone === "paper"
          ? "border-[color-mix(in_srgb,var(--color-amber)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-paper)_10%,transparent)]"
          : "border-[color-mix(in_srgb,var(--color-chalk)_16%,transparent)] bg-[var(--color-ink-2)]"
      }`}
    >
      {title ? (
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-[var(--color-chalk)]">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

export function McqChoices({
  choices,
  value,
  onPick,
  correctIndex,
  reveal,
  disabled,
}: {
  choices: string[];
  value: number | null;
  onPick: (index: number) => void;
  correctIndex?: number;
  reveal?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {choices.map((choice, i) => {
        const picked = value === i;
        const showCorrect = reveal && correctIndex === i;
        const showWrong = reveal && picked && correctIndex !== i;
        return (
          <button
            key={`${i}-${choice}`}
            type="button"
            disabled={disabled}
            onClick={() => onPick(i)}
            className={`flex min-h-11 w-full items-start gap-3 rounded-sm border px-4 py-3 text-left text-sm leading-relaxed transition-colors disabled:opacity-55 ${
              showCorrect
                ? "border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_20%,transparent)] text-[var(--color-chalk)]"
                : showWrong
                  ? "border-[var(--color-neon)] bg-[color-mix(in_srgb,var(--color-neon)_14%,transparent)] text-[var(--color-chalk)]"
                  : picked
                    ? "border-[var(--color-amber)] text-[var(--color-chalk)]"
                    : "border-[color-mix(in_srgb,var(--color-chalk)_20%,transparent)] text-[var(--color-chalk)]"
            }`}
          >
            <span
              aria-hidden
              className={`font-brand text-xs leading-6 tracking-[0.12em] ${
                showCorrect ? "text-[var(--color-amber)]" : "text-[var(--color-smoke)]"
              }`}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span className="flex-1">{choice}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SentenceStepper({
  index,
  total,
  onPrev,
  onNext,
  extra,
}: {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  extra?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={index <= 0}
        className="btn-ghost min-h-11 min-w-11 rounded-sm px-3 py-2 text-sm disabled:opacity-40"
        aria-label={t("loop.nav.prev")}
      >
        ‹
      </button>
      <span className="min-h-11 flex-1 rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_14%,transparent)] px-3 py-2.5 text-center text-xs tracking-[0.14em] text-[var(--color-smoke)]">
        {t("loop.nav.sentence", { i: index + 1, n: total })}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={index >= total - 1}
        className="btn-ghost min-h-11 min-w-11 rounded-sm px-3 py-2 text-sm disabled:opacity-40"
        aria-label={t("loop.nav.next")}
      >
        ›
      </button>
      {extra}
    </div>
  );
}

type Segment =
  | { kind: "word"; text: string; key: string }
  | { kind: "cluster"; cluster: Cluster; text: string; key: string };

function segmentSentence(sentence: Sentence): Segment[] {
  const clusters = [...sentence.clusters].sort((a, b) => a.span[0] - b.span[0]);
  const segments: Segment[] = [];
  const words = sentence.words;
  let i = 0;

  while (i < words.length) {
    const word = words[i];
    const cluster = clusters.find(
      (c) => word.s >= c.span[0] && word.e <= c.span[1],
    );
    if (cluster) {
      const parts: string[] = [];
      while (i < words.length && words[i].s >= cluster.span[0] && words[i].e <= cluster.span[1]) {
        parts.push(words[i].w);
        i += 1;
      }
      segments.push({
        kind: "cluster",
        cluster,
        text: parts.join(" "),
        key: cluster.id,
      });
    } else {
      segments.push({ kind: "word", text: word.w, key: `${word.s}-${word.e}` });
      i += 1;
    }
  }
  return segments;
}

export function ClusterTranscript({
  sentence,
  activeClusterId,
  onClusterTap,
  onSentenceTap,
}: {
  sentence: Sentence;
  activeClusterId?: string | null;
  onClusterTap: (cluster: Cluster) => void;
  onSentenceTap?: () => void;
}) {
  const { t } = useI18n();
  const segments = segmentSentence(sentence);

  return (
    <div>
      <p className="text-lg leading-[2.1] text-[var(--color-chalk)]">
        {segments.map((seg) =>
          seg.kind === "word" ? (
            <span key={seg.key}>{seg.text} </span>
          ) : (
            <button
              key={seg.key}
              type="button"
              onClick={() => onClusterTap(seg.cluster)}
              className={`mx-0.5 inline-flex min-h-11 items-center gap-1.5 rounded-sm border-b-2 px-2 py-2 align-middle text-left text-lg leading-tight transition-colors ${
                activeClusterId === seg.cluster.id
                  ? "border-b-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_22%,transparent)] text-[var(--color-amber)]"
                  : "border-b-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_12%,transparent)] text-[var(--color-chalk)]"
              }`}
              title={t("loop.dissect.clusterHint")}
            >
              <span aria-hidden className="text-xs opacity-80">
                ▶
              </span>
              <span>{seg.text}</span>
            </button>
          ),
        )}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {onSentenceTap ? (
          <button
            type="button"
            onClick={onSentenceTap}
            className="btn-ghost min-h-11 rounded-sm px-4 py-2 text-xs"
          >
            ▶ {t("loop.dissect.playSentence")}
          </button>
        ) : null}
        <div className="flex flex-wrap gap-1.5">
          {sentence.clusters.map((c) => (
            <span
              key={c.id}
              className="rounded-full border border-[color-mix(in_srgb,var(--color-amber)_40%,transparent)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--color-amber)]"
            >
              {t(`cat.${c.category}` as MsgKey)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
