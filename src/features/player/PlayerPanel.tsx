/**
 * Băng máy phát: khung video YouTube + sóng âm + điều khiển.
 *
 * Công thái học (SPEC §4 + rule dự án):
 * - Ít nút, mỗi hàng 2–3 control; label tự giải thích (bỏ chữ "TỐC ĐỘ").
 * - Bỏ đánh dấu A thủ công — A–B tự chạy khi chạm cụm, không cần thêm nút.
 * - Thanh điều khiển nổi đáy trên mobile: dừng/tiếp luôn trong tầm ngón cái.
 */
import { useMemo, type ReactNode } from "react";
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
      className="relative mt-3 h-12 overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_16%,transparent)] bg-[color-mix(in_srgb,var(--color-void)_70%,transparent)] px-2"
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

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-px bg-[var(--color-neon-soft)]"
        style={{ left: `${Math.min(100, Math.max(0, progress * 100))}%` }}
      />

      <button
        type="button"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          api.seekMs(((e.clientX - rect.left) / rect.width) * durationMs);
        }}
        className="absolute inset-0 h-full w-full"
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
  tone = "ghost",
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: ReactNode;
  wide?: boolean;
  tone?: "ghost" | "amber";
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-11 items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-xs disabled:opacity-40 ${
        tone === "amber" ? "btn-amber" : "btn-ghost"
      } ${wide ? "flex-1" : ""} ${
        active
          ? "border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_18%,transparent)] text-[var(--color-amber)]"
          : ""
      }`}
    >
      {children}
    </button>
  );
}

/** Nút phát/dừng — dùng chung cho deck và thanh đáy */
function PlayButton({ wide }: { wide?: boolean }) {
  const { t } = useI18n();
  const { api, view } = useClipPlayer();
  return (
    <DeckButton onClick={() => api.toggle()} active={view.playing} wide={wide} tone="amber">
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
  );
}

function ReplayButton({ wide }: { wide?: boolean }) {
  const { t } = useI18n();
  const { api, view } = useClipPlayer();
  return (
    <DeckButton
      onClick={() => {
        if (view.loop) api.playSpan(view.loop.startMs, view.loop.endMs);
        else {
          api.seekMs(0);
          api.play();
        }
      }}
      wide={wide}
    >
      <span aria-hidden>⟲</span> {t("player.replay")}
    </DeckButton>
  );
}

function ClearLoopButton() {
  const { t } = useI18n();
  const { api, view } = useClipPlayer();
  if (!view.loop) return null;
  return <DeckButton onClick={() => api.clearLoop()}>{t("player.abClear")}</DeckButton>;
}

export function PlayerPanel({
  sentences,
  durationMs,
}: {
  sentences: Sentence[];
  durationMs: number;
}) {
  const { view, api, containerRef } = useClipPlayer();

  return (
    <>
      <section className="lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_18%,transparent)] bg-[var(--color-ink-2)] shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            <div ref={containerRef} className="absolute inset-0" />
            {view.status !== "ready" ? (
              <PlayerStatusOverlay />
            ) : null}
          </div>

          <div className="px-3 pb-3 pt-1">
            <Waveform sentences={sentences} durationMs={durationMs} />

            {/* máy băng — gọn: 2 nút chính, tốc độ là 1 cụm chip */}
            <div className="mt-3 flex items-center gap-2">
              <PlayButton wide />
              <ReplayButton wide />
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              {RATES.map((r: Rate) => (
                <DeckButton
                  key={r}
                  onClick={() => api.setRate(r)}
                  active={view.rate === r}
                  title={`${r}×`}
                >
                  {r}×
                </DeckButton>
              ))}
              <div className="ml-auto flex items-center gap-2">
                {view.loop ? (
                  <>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-amber)]">
                      A–B
                    </span>
                    <ClearLoopButton />
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* thanh điều khiển nổi đáy — mobile/tablet, trong tầm ngón cái */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[color-mix(in_srgb,var(--color-chalk)_16%,transparent)] bg-[color-mix(in_srgb,var(--color-ink)_94%,transparent)] px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <PlayButton wide />
          <ReplayButton />
          <ClearLoopButton />
        </div>
      </div>
    </>
  );
}

function PlayerStatusOverlay() {
  const { t } = useI18n();
  const { view } = useClipPlayer();
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-sm text-[var(--color-smoke)]">
      {view.status === "loading" ? t("player.loading") : t("player.error")}
    </div>
  );
}
