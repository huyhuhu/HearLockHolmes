/**
 * Trợ thủ Wren — đồng hành role-play (SPEC §3 "Trợ thủ Wren").
 * FAB góc dưới phải → bubble gợi mẹo theo ngữ cảnh + lời hệ thống vừa bắn tới.
 */
import { useEffect, useState } from "react";
import { useI18n } from "../../lib/i18n";
import { WrenArt } from "../../components/svg/WrenArt";
import { useGame } from "./GameProvider";

const IDLE_TIPS: { vi: string; en: string }[] = [
  {
    vi: "Thám tử, hôm nay ta nghe 1–2 lời khai là đủ. Tai trước, mắt sau.",
    en: "Detective, one or two testimonies today is enough. Ears first, eyes later.",
  },
  {
    vi: "Gặp cụm bị nuốt? Bấm nghe đoạn ±1s, so với dạng sạch rồi mới chọn.",
    en: "A swallowed cluster? Replay ±1s, compare with the clean form, then pick.",
  },
  {
    vi: "Nhiệm vụ ngày không tính chuỗi — nghỉ một ngày cũng không sao.",
    en: "Dailies don't do streaks — a day off costs you nothing.",
  },
  {
    vi: "Nghe mù là trung tâm vụ án. Không nhìn transcript trước khi qua cổng.",
    en: "Blind listen is the heart of the case. No transcript before the gate.",
  },
  {
    vi: "Xong 1 clip là hồ sơ dày thêm. Muốn lên hạng thì qua kỳ sát hạch.",
    en: "One clip and the file grows. Rank-ups go through the exam.",
  },
];

export function Companion() {
  const { t, lang } = useI18n();
  const { companion, say, dismissCompanion, daily } = useGame();
  const [open, setOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % IDLE_TIPS.length);
    }, 12000);
    return () => window.clearInterval(id);
  }, [open]);

  const bubbleText = companion
    ? lang === "vi"
      ? companion.vi
      : companion.en
    : IDLE_TIPS[tipIndex][lang];

  const doneCount = daily.missions.filter((m) => m.done >= m.target).length;

  return (
    <div className="fixed bottom-4 left-4 z-[70] flex flex-col items-start gap-2">
      {open ? (
        <div className="anim-bubble w-[min(20rem,calc(100vw-2rem))] rounded-sm border border-[color-mix(in_srgb,var(--color-amber)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-ink)_94%,transparent)] p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="anim-wren h-14 w-14 shrink-0">
              <WrenArt />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-brand text-[10px] tracking-[0.3em] text-[var(--color-amber)]">
                WREN — SIDEKICK
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-chalk)]">
                {bubbleText}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="text-[11px] text-[var(--color-smoke)]">
              {t("companion.daily", { done: doneCount, total: daily.missions.length })}
            </p>
            <div className="flex gap-2">
              {companion ? (
                <button
                  type="button"
                  onClick={dismissCompanion}
                  className="btn-ghost min-h-10 rounded-sm px-3 py-1.5 text-xs"
                >
                  {t("companion.gotIt")}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setTipIndex((i) => (i + 1) % IDLE_TIPS.length);
                  say({ id: `tip-${Date.now()}`, vi: IDLE_TIPS[(tipIndex + 1) % IDLE_TIPS.length].vi, en: IDLE_TIPS[(tipIndex + 1) % IDLE_TIPS.length].en });
                }}
                className="btn-ghost min-h-10 rounded-sm px-3 py-1.5 text-xs"
              >
                {t("companion.next")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("companion.open")}
        className={`group relative flex h-14 w-14 items-center justify-center rounded-full border bg-[var(--color-ink-2)] shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all hover:scale-105 active:scale-95 ${
          companion
            ? "anim-glow border-[var(--color-amber)]"
            : "border-[color-mix(in_srgb,var(--color-amber)_35%,transparent)] hover:border-[var(--color-amber)]"
        }`}
      >
        <span className="anim-wren block h-10 w-10">
          <WrenArt />
        </span>
        {!open && companion ? (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border border-[var(--color-ink-2)] bg-[var(--color-neon-soft)] shadow-lg" />
        ) : null}
      </button>
    </div>
  );
}
