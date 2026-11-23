/**
 * Tạo thám tử (GĐ5) — tên + 1/6 chân dung SVG + archetype + motto flavor.
 * Wizard 3 bước, mỗi bước có hiệu ứng chuyển (anim-fade-up).
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../lib/i18n";
import {
  AVATAR_META,
  DetectiveAvatar,
} from "../../components/svg/DetectiveAvatars";
import type { AvatarId, DetectiveDoc } from "../../types/game";
import { useGame } from "./GameProvider";

export function OnboardWizard({ redirectTo }: { redirectTo?: string }) {
  const { t, lang } = useI18n();
  const { createDetective } = useGame();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState<AvatarId | null>(null);
  const [archetypeId, setArchetypeId] = useState<AvatarId | null>(null);
  const [motto, setMotto] = useState("");

  const canNext = useMemo(() => {
    if (step === 0) return name.trim().length >= 2;
    if (step === 1) return avatarId !== null;
    return archetypeId !== null;
  }, [step, name, avatarId, archetypeId]);

  const submit = () => {
    if (!avatarId || !archetypeId) return;
    const meta = AVATAR_META.find((m) => m.id === archetypeId);
    const doc: DetectiveDoc = {
      name: name.trim(),
      avatarId,
      archetype: archetypeId,
      motto: motto.trim() || (meta ? meta.motto[lang] : ""),
      createdAt: Date.now(),
    };
    createDetective(doc);
    navigate(redirectTo ?? "/profile", { replace: true });
  };

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-10">
      <p className="font-brand text-[11px] tracking-[0.42em] text-[var(--color-smoke)]">
        DOSSIER — STEP {step + 1}/3
      </p>
      <h1 className="neon-text mt-3 font-display text-3xl tracking-wide md:text-4xl">
        {t("onboard.title")}
      </h1>
      <p className="mt-3 max-w-xl text-[var(--color-smoke)]">{t("onboard.sub")}</p>

      {/* progress rail */}
      <div className="mt-6 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-1 items-center gap-2">
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                i <= step
                  ? "bg-[var(--color-amber)] shadow-[0_0_10px_color-mix(in_srgb,var(--color-amber)_60%,transparent)]"
                  : "bg-[color-mix(in_srgb,var(--color-chalk)_16%,transparent)]"
              }`}
            />
          </div>
        ))}
      </div>

      {step === 0 ? (
        <section key="s0" className="anim-fade-up mt-10">
          <h2 className="font-display text-xl tracking-wide text-[var(--color-chalk)]">
            {t("onboard.nameTitle")}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-smoke)]">{t("onboard.nameHint")}</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={28}
            placeholder={t("onboard.namePlaceholder")}
            className="mt-5 w-full rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_25%,transparent)] bg-[var(--color-ink)] px-4 py-4 text-lg text-[var(--color-chalk)] outline-none transition-colors placeholder:text-[var(--color-smoke)] focus:border-[var(--color-amber)]"
          />
        </section>
      ) : null}

      {step === 1 ? (
        <section key="s1" className="anim-fade-up mt-10">
          <h2 className="font-display text-xl tracking-wide text-[var(--color-chalk)]">
            {t("onboard.avatarTitle")}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-smoke)]">{t("onboard.avatarHint")}</p>
          <div className="stagger mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {AVATAR_META.map((meta) => {
              const selected = avatarId === meta.id;
              return (
                <button
                  key={meta.id}
                  type="button"
                  onClick={() => {
                    setAvatarId(meta.id);
                    if (!archetypeId) setArchetypeId(meta.id);
                  }}
                  className={`group rounded-sm border p-2 text-left transition-all duration-200 ${
                    selected
                      ? "border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_12%,transparent)] shadow-[0_0_22px_color-mix(in_srgb,var(--color-amber)_35%,transparent)]"
                      : "border-[color-mix(in_srgb,var(--color-chalk)_18%,transparent)] hover:border-[color-mix(in_srgb,var(--color-amber)_60%,transparent)] hover:-translate-y-0.5"
                  }`}
                >
                  <DetectiveAvatar id={meta.id} />
                  <p className="mt-2 px-1 text-sm font-medium text-[var(--color-chalk)]">
                    {lang === "vi" ? meta.title.vi : meta.title.en}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section key="s2" className="anim-fade-up mt-10">
          <h2 className="font-display text-xl tracking-wide text-[var(--color-chalk)]">
            {t("onboard.archTitle")}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-smoke)]">{t("onboard.archHint")}</p>
          <div className="stagger mt-6 grid gap-3">
            {AVATAR_META.map((meta) => {
              const selected = archetypeId === meta.id;
              return (
                <button
                  key={meta.id}
                  type="button"
                  onClick={() => setArchetypeId(meta.id)}
                  className={`flex items-center gap-4 rounded-sm border px-4 py-3 text-left transition-all duration-200 ${
                    selected
                      ? "border-[var(--color-amber)] bg-[color-mix(in_srgb,var(--color-amber)_12%,transparent)]"
                      : "border-[color-mix(in_srgb,var(--color-chalk)_18%,transparent)] hover:border-[color-mix(in_srgb,var(--color-amber)_55%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-chalk)_5%,transparent)]"
                  }`}
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[color-mix(in_srgb,var(--color-amber)_40%,transparent)]">
                    <DetectiveAvatar id={meta.id} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-chalk)]">
                      {lang === "vi" ? meta.title.vi : meta.title.en}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-smoke)]">
                      {lang === "vi" ? meta.flavor.vi : meta.flavor.en}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <label className="mt-8 block">
            <span className="font-brand text-[10px] tracking-[0.3em] text-[var(--color-smoke)]">
              {t("onboard.motto")}
            </span>
            <input
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              maxLength={90}
              placeholder={t("onboard.mottoPlaceholder")}
              className="mt-2 w-full rounded-sm border border-[color-mix(in_srgb,var(--color-chalk)_25%,transparent)] bg-[var(--color-ink)] px-4 py-3 text-sm text-[var(--color-chalk)] outline-none transition-colors placeholder:text-[var(--color-smoke)] focus:border-[var(--color-amber)]"
            />
          </label>
        </section>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="btn-ghost min-h-11 rounded-sm px-5 py-3 text-sm"
          >
            {t("onboard.back")}
          </button>
        ) : null}
        {step < 2 ? (
          <button
            type="button"
            disabled={!canNext}
            onClick={() => canNext && setStep((s) => s + 1)}
            className="btn-amber min-h-11 rounded-sm px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("onboard.next")}
          </button>
        ) : (
          <button
            type="button"
            disabled={!canNext}
            onClick={submit}
            className="btn-amber min-h-11 rounded-sm px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("onboard.finish")}
          </button>
        )}
      </div>
    </main>
  );
}
