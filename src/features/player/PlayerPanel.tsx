/**
 * Băng máy phát: khung video YouTube + sóng âm + điều khiển kiểu máy băng từ.
 * Nút ≥ 40px, không hover-only — học trên điện thoại (SPEC §4).
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useI18n } from "../../lib/i18n";
import type { Sentence } from "../../types/content";
import {
  RATES,
  useClipPlayer,
  usePlayerTimeMs,
  type Rate,
} from "./ClipPlayer";
import { buildWaveformBins } from "./waveform";

function Waveform({
  sentences,
  durationMs,
}: {
  sentences: Sentence[];
  durationMs: number;
}) {
  const { t } = useI18n();
  const { view, api } = useClipPlayer();
  const timeMs = usePlayerTimeMs();
  const bins = useMemo(
    () => buildWaveformBins(sentences, durationMs),
    [sentences, durationMs],
  );

  const progress = durationMs > 0 ? timeMs / durationMs : 0;
  const loopStart = view.loop ? view.loop.startMs / durationMs : null;
  const loopEnd = view.loop ? view.loop.endMs / durationMs : null;

  return (
    <div
      aria-label={t("player.waveform")}
      className="relative mt-3 h-14 overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_16%,transparent)] bg-[color-mix(in_srgb,var(--color-void)_70%,transparent)] px-2"
    >
      <div className="flex h-full items-end gap-[2px]">
        {bins.map((height, i) => {
          const at = (i + 0.5) / bins.length;
          const played = at <= progress;
          const inLoop =
            loopStart !== null && loopEnd !== null && at >= loopStart && at <= loopEnd;
          return (
            <span
              key={i}
              className={`flex-1 rounded-t-[1px] transition-[height,background-color] duration-150 ${
                played
                  ? "bg-[var(--color-amber)]"
                  : inLoop
                    ? "bg-[color-mix(in_srgb,var(--color-amber)_45%,transparent)]"
                    : "bg-[color-mix(in_srgb,var(--color-smoke)_38%,transparent)]"
              } ${view.playing && played ? "animate-wave" : ""}`}
              style={{
                height: `${Math.round(height * 100)}%`,
                animationDelay: `${i * 24}ms`,
              }}
            />
          );
        })}
      </div>

      {/* con trỏ băng */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-px bg-[var(--color-neon-soft)]"
        style={{ left: `${Math.min(100, Math.max(0, progress * 100))}%` }}
      />

      <button
        type="button"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          api.seekMs(ratio * durationMs);
        }}
        className="absolute inset-0 h-full w-full cursor-pointer"
        aria-label={t("player.waveform")}
      />
    </div>
  );
}

function DeckButton({
  onClick,
  active,
  disabled,
  title,
  children,
  wide,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`btn-ghost flex min-h-11 items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-xs disabled:opacity-40 ${
        wide ? "flex-1" : ""
      } ${
        active
          ? "border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_18%,transparent)] text-[var(--color-amber)]"
          : ""
      }`}
    >
      {children}
    </button>
  );
}

export function PlayerPanel({
  sentences,
  durationMs,
}: {
  sentences: Sentence[];
  durationMs: number;
}) {
  const { t } = useI18n();
  const { containerRef, api, view, getTimeMs } = useClipPlayer();
  const [markAMs, setMarkAMs] = useState<number | null>(null);

  // đang có vòng A–B thì dấu A thủ công không còn ý nghĩa
  useEffect(() => {
    if (view.loop) setMarkAMs(null);
  }, [view.loop]);

  return (
    <section className="lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_18%,transparent)] bg-[var(--color-ink-2)] shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
        <div className="relative aspect-video w-full bg-black">
          <div ref={containerRef} className="absolute inset-0" />
          {view.status !== "ready" ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-sm text-[var(--color-smoke)]">
              {view.status === "loading" ? t("player.loading") : t("player.error")}
            </div>
          ) : null}
        </div>

        <div className="px-3 pb-3 pt-1">
          <Waveform sentences={sentences} durationMs={durationMs} />

          {/* máy băng từ — 2 hàng trên phone, vừa ngón cái */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <DeckButton onClick={() => api.toggle()} active={view.playing} wide>
              {view.playing ? (
                <>
                  <span aria-hidden>❚❚</span> {t("player.pause")}
                </>
              ) : (
                <>
                  <span aria-hidden>▶</span> {t("player.play")}
                </>
              )}
            </DeckButton>

            <DeckButton
              onClick={() => {
                if (view.loop) api.playSpan(view.loop.startMs, view.loop.endMs);
                else {
                  api.seekMs(0);
                  api.play();
                }
              }}
              wide
            >
              <span aria-hidden>⟲</span> {t("player.replay")}
            </DeckButton>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-smoke)]">
              {t("player.rate")}
            </span>
            {RATES.map((r: Rate) => (
              <DeckButton
                key={r}
                onClick={() => api.setRate(r)}
                active={view.rate === r}
                title={`${t("player.rate")} ${r}×`}
              >
                {r}×
              </DeckButton>
            ))}

            <div className="ml-auto flex items-center gap-2">
              {view.loop ? (
                <>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-amber)]">
                    {t("player.abActive")}
                  </span>
                  <DeckButton onClick={() => api.clearLoop()}>
                    {t("player.abClear")}
                  </DeckButton>
                </>
              ) : (
                <DeckButton
                  onClick={() => {
                    const now = getTimeMs();
                    if (markAMs === null) {
                      setMarkAMs(now);
                      return;
                    }
                    if (now > markAMs + 200) {
                      api.playSpan(markAMs, now);
                    }
                    setMarkAMs(null);
                  }}
                  active={markAMs !== null}
                  title={t("player.abMark")}
                >
                  {markAMs === null ? t("player.abSetA") : t("player.abSetB")}
                </DeckButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
