/**
 * Băng máy phát: khung video YouTube + sóng âm + điều khiển.
 *
 * Công thái học (SPEC §4 + rule dự án):
 * - Ít nút, mỗi hàng 2–3 control; label tự giải thích (bỏ chữ "TỐC ĐỘ").
 * - Bỏ đánh dấu A thủ công — A–B tự chạy khi chạm cụm, không cần thêm nút.
 * - Nút tròn nổi trên mobile: dừng/tiếp trong tầm ngón cái, ẩn được.
 */
import { useMemo, useState, type ReactNode } from "react";
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
      className={`btn-ghost flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-xs disabled:opacity-40 ${
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

/** Nút phát/dừng — dùng chung cho deck và nút tròn nổi */
function PlayButton({ wide }: { wide?: boolean }) {
  const { t } = useI18n();
  const { api, view } = useClipPlayer();
  return (
    <DeckButton onClick={() => api.toggle()} active={view.playing} wide={wide}>
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

      {/* nút tròn nổi — mobile/tablet, trong tầm ngón cái, ẩn được */}
      <FloatingDeck />
    </>
  );
}

/**
 * Nút tròn nổi thay cho thanh đáy: chỉ một điểm chạm phát/dừng,
 * không giành chỗ, không thêm khối màu đặc. Bấm mũi tên để ẩn hẳn.
 */
function FloatingDeck() {
  const { t } = useI18n();
  const { api, view } = useClipPlayer();
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("player.show")}
        title={t("player.show")}
        className="fixed bottom-4 right-0 z-40 flex h-14 w-10 items-center justify-start rounded-l-full border border-r-0 border-[color-mix(in_srgb,var(--color-amber)_35%,transparent)] bg-[var(--color-ink-2)] pl-1.5 text-[var(--color-amber)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] lg:hidden"
      >
        <span aria-hidden className="text-sm">
          ‹
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-end gap-2 lg:hidden">
      {view.loop ? (
        <RoundControl
          onClick={() => api.clearLoop()}
          label={t("player.abClear")}
          title={t("player.abClear")}
        >
          <span aria-hidden className="text-xs">
            ✕
          </span>
        </RoundControl>
      ) : null}

      <RoundControl
        big
        onClick={() => api.toggle()}
        label={view.playing ? t("player.pause") : t("player.play")}
        active={view.playing}
      >
        <span aria-hidden>{view.playing ? "❚❚" : "▶"}</span>
      </RoundControl>

      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label={t("player.hide")}
        title={t("player.hide")}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-chalk)_22%,transparent)] bg-[var(--color-ink-2)] text-xs text-[var(--color-smoke)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all hover:border-[color-mix(in_srgb,var(--color-amber)_50%,transparent)] hover:text-[var(--color-amber)] active:scale-95"
      >
        <span aria-hidden>⌄</span>
      </button>
    </div>
  );
}

function RoundControl({
  onClick,
  label,
  title,
  active,
  big,
  children,
}: {
  onClick: () => void;
  label: string;
  title?: string;
  active?: boolean;
  big?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={title ?? label}
      className={`flex items-center justify-center rounded-full border shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-transform ${
        big ? "h-14 w-14 text-base" : "h-10 w-10 text-xs"
      } ${
        active
          ? "border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_18%,transparent)] text-[var(--color-amber)]"
          : "border-[color-mix(in_srgb,var(--color-amber)_35%,transparent)] bg-[var(--color-ink-2)] text-[var(--color-amber)]"
      }`}
    >
      {children}
    </button>
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
