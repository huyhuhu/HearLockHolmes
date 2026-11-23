/**
 * Wren — quạ trợ thủ (role-play companion). SVG animate nhẹ (nhấp nháy, nghiêng đầu).
 */

export function WrenArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className ?? "h-full w-full"}
      role="img"
      aria-label="Wren"
    >
      <defs>
        <radialGradient id="wrenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-amber)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-amber)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#wrenGlow)" />
      {/* thân */}
      <ellipse cx="60" cy="74" rx="26" ry="30" fill="var(--color-ink-2)" stroke="var(--color-amber)" strokeOpacity="0.55" strokeWidth="2" />
      {/* cánh */}
      <path
        d="M36 70 C24 78 22 96 34 102 C42 96 44 82 42 72 Z"
        fill="var(--color-ink-3)"
        stroke="var(--color-amber)"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      {/* đuôi */}
      <path d="M78 92 L102 110 L94 96 L106 100 L82 84 Z" fill="var(--color-ink-3)" stroke="var(--color-amber)" strokeOpacity="0.4" strokeWidth="1.5" />
      {/* đầu */}
      <circle cx="60" cy="42" r="20" fill="var(--color-ink-2)" stroke="var(--color-amber)" strokeOpacity="0.55" strokeWidth="2" />
      {/* fedora tí hon */}
      <path d="M38 34 C42 20 78 20 82 34 L76 37 C70 28 50 28 44 37 Z" fill="var(--color-void)" stroke="var(--color-amber)" strokeOpacity="0.6" strokeWidth="1.5" />
      <path d="M32 37 C44 30 76 30 88 37 L86 42 C72 36 48 36 34 42 Z" fill="var(--color-ink-2)" stroke="var(--color-amber)" strokeOpacity="0.5" strokeWidth="1.5" />
      {/* mỏ */}
      <path d="M78 44 L98 48 L78 54 Z" fill="var(--color-amber)" opacity="0.9" />
      {/* mắt */}
      <g className="anim-wren-eye">
        <circle cx="66" cy="44" r="5" fill="var(--color-amber)" />
        <circle cx="67.5" cy="43" r="1.8" fill="var(--color-void)" />
      </g>
      {/* chân */}
      <g stroke="var(--color-amber)" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round">
        <line x1="52" y1="102" x2="48" y2="114" />
        <line x1="66" y1="102" x2="70" y2="114" />
      </g>
      {/* sổ tay mini */}
      <rect x="84" y="66" width="18" height="14" rx="2" fill="var(--color-paper)" opacity="0.9" transform="rotate(12 93 73)" />
      <line x1="88" y1="71" x2="98" y2="73" stroke="var(--color-ink)" strokeWidth="1.2" opacity="0.5" transform="rotate(12 93 73)" />
      <line x1="88" y1="75" x2="96" y2="77" stroke="var(--color-ink)" strokeWidth="1.2" opacity="0.5" transform="rotate(12 93 73)" />
    </svg>
  );
}
