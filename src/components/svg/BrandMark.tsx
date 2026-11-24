/**
 * BrandMark — logo mark Hearlock Holmes: kính lúp sóng âm kiểu biển neon.
 * Vòng kính lúp hổ phách + sóng âm đỏ neon trong ống kính ("mọi âm thanh đều
 * để lại manh mối"). Dùng CSS vars nên tự theo theme; glow qua .neon-mark
 * (tắt khi light theme — biển neon nghỉ ban ngày).
 */

export function BrandMark({
  className,
  title = "Hearlock Holmes",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className ?? "h-8 w-8"}
      role="img"
      aria-label={title}
    >
      {/* kính lúp: ống kính + tay cầm + chấm đèn biển */}
      <g className="neon-mark" fill="none" stroke="var(--color-amber)">
        <circle cx="26" cy="26" r="16" strokeWidth="4" />
        <path d="M37.5 37.5 L52 52" strokeWidth="5.5" strokeLinecap="round" />
      </g>
      <circle className="neon-mark" cx="47" cy="10" r="3" fill="var(--color-amber)" />

      {/* sóng âm trong ống kính — bằng chứng sống */}
      <g
        className="neon-mark-red"
        stroke="var(--color-neon-soft)"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M15 22 V30" />
        <path d="M20.5 17 V35" />
        <path d="M26 12.5 V39.5" />
        <path d="M31.5 17.5 V34.5" />
        <path d="M37 22.5 V29.5" />
      </g>
    </svg>
  );
}