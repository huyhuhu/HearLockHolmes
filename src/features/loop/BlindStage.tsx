/**
 * Màn NGHE MÙ (Hiện trường) — KHÔNG chữ, chỉ player + câu hỏi hiện trường.
 * Qua cổng gist gate mới mở được Phòng thí nghiệm (SPEC §1).
 * Đúng/sai đều mở khóa — hiện "đoán trúng / trượt" làm hương vị.
 */
import { useI18n } from "../../lib/i18n";
import type { Clip } from "../../types/content";
import { useClipPlayer } from "../player/ClipPlayer";
import { Eyebrow, McqChoices, SectionCard, SentenceStepper } from "./LoopChrome";

export function BlindStage({
  clip,
  sentenceIndex,
  onSentenceIndex,
  gistChoice,
  gistRevealed,
  onAnswerGist,
  onEnterLab,
}: {
  clip: Clip;
  sentenceIndex: number;
  onSentenceIndex: (i: number) => void;
  gistChoice: number | null;
  gistRevealed: boolean;
  onAnswerGist: (choice: number) => void;
  onEnterLab: () => void;
}) {
  const { t, lang } = useI18n();
  const { api } = useClipPlayer();
  const sentence = clip.sentences[sentenceIndex];

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <Eyebrow>{t("loop.blind.eyebrow")}</Eyebrow>
        <p className="text-sm leading-relaxed text-[var(--color-smoke)]">
          {t("loop.blind.hint")}
        </p>
      </header>

      <SentenceStepper
        index={sentenceIndex}
        total={clip.sentences.length}
        onPrev={() => onSentenceIndex(Math.max(0, sentenceIndex - 1))}
        onNext={() =>
          onSentenceIndex(Math.min(clip.sentences.length - 1, sentenceIndex + 1))
        }
        onPlay={() => {
          if (!sentence) return;
          // phát 1 lần rồi dừng — không lặp làm phiền
          api.playSpan(sentence.startMs, sentence.endMs, { loop: false });
        }}
      />

      <SectionCard title={t("loop.blind.gate")} tone="paper">
        <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-[var(--color-smoke)]">
          {t("loop.blind.gateHint")}
        </p>
        <p className="mb-4 text-base font-semibold leading-relaxed text-[var(--color-chalk)]">
          {clip.gistQuestion.prompt[lang]}
        </p>

        <McqChoices
          choices={clip.gistQuestion.choices.map((c) => c[lang])}
          value={gistChoice}
          correctIndex={clip.gistQuestion.answerIndex}
          reveal={gistRevealed}
          onPick={(i) => {
            if (!gistRevealed) onAnswerGist(i);
          }}
          disabled={gistRevealed}
        />

        {gistRevealed ? (
          <div className="mt-4 flex flex-col gap-3">
            <p
              className={`text-sm leading-relaxed ${
                gistChoice === clip.gistQuestion.answerIndex
                  ? "text-[var(--color-amber)]"
                  : "text-[var(--color-neon-soft)]"
              }`}
            >
              {gistChoice === clip.gistQuestion.answerIndex
                ? t("loop.blind.hit")
                : t("loop.blind.miss")}
            </p>
            <button
              type="button"
              onClick={onEnterLab}
              className="btn-amber min-h-11 w-full rounded-sm px-5 py-3 text-sm"
            >
              {t("loop.blind.enter")} →
            </button>
          </div>
        ) : null}
      </SectionCard>
    </div>
  );
}
