/**
 * Bộ glyph huy hiệu thành tựu — SVG 24×24, stroke = currentColor.
 */
import type { BadgeGlyph } from "../../features/game/achievements";

const paths: Record<BadgeGlyph, React.ReactNode> = {
  star: (
    <path d="M12 2.5l2.7 6.2 6.8.6-5.1 4.5 1.5 6.7L12 16.8 6.1 20.5l1.5-6.7L2.5 9.3l6.8-.6z" />
  ),
  ear: (
    <path d="M8 20c0-3-2-4-2-8a6 6 0 1112 0c0 2.5-1.2 3.6-2.5 4.6-1 .8-1.5 1.5-1.5 2.9M9 9.5a3 3 0 015.4-1.8" />
  ),
  wave: (
    <path d="M3 12h2m2-5v10m4-13v16m4-12v8m4-6v4m2-2h2" />
  ),
  fingerprint: (
    <path d="M6 11a6 6 0 0112 0v2m-9 0v-2a3 3 0 016 0v2m-6 2v-2m3 4v-4m3 2c0 2-.5 3.5-1 5m3-5c0 1.5-.2 3-.6 4.5M4 9a8 8 0 0114-4.7" />
  ),
  zoom: (
    <path d="M10.5 4a6.5 6.5 0 105.2 10.4L20 18.7 18.7 20l-4.3-4.3A6.5 6.5 0 0010.5 4zm0 2.5a4 4 0 110 8 4 4 0 010-8z" />
  ),
  stamp: (
    <path d="M9 3h6v4l2 2v4h-3l1 6H9l1-6H7V9l2-2zM5 20h14M7 22h10" />
  ),
  shield: (
    <path d="M12 2.5l8 3v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10v-6zM8.5 12l2.5 2.5 4.5-5" />
  ),
  clock: (
    <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 4v5l3.5 2.5" />
  ),
  calendar: (
    <path d="M4 6h16v15H4zM4 10h16M8 3v4m8-4v4M8 14h3m2 0h3m-8 4h3" />
  ),
  brain: (
    <path d="M9 4a3 3 0 00-3 3 3 3 0 00-1 5.8V16a3 3 0 003 3h1.5M15 4a3 3 0 013 3 3 3 0 011 5.8V16a3 3 0 01-3 3h-1.5M12 3v18M9 9.5h2m2 2h2" />
  ),
  bolt: (
    <path d="M13 2L5 13h5l-1 9 8-11h-5z" />
  ),
  book: (
    <path d="M4 4h7a3 3 0 013 3v13a3 3 0 00-3-2H4zM20 4h-4a2 2 0 00-2 2v14a2 2 0 012-2h4z" />
  ),
  key: (
    <path d="M14 7a4 4 0 11-2 7.5L9 17.7 7 19.8 4 20l.8-2.6 2.7-2.7 2.7-2.7A4 4 0 0114 7zm1.5 1.2h.01" />
  ),
  crown: (
    <path d="M4 18h16l1-11-5 4-4-6-4 6-5-4zM5 21h14" />
  ),
  medal: (
    <path d="M8 2h8l-1.5 6H9.5zM12 8a5 5 0 110 10 5 5 0 010-10zm0 2.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM9 20l-1 2h8l-1-2" />
  ),
  mask: (
    <path d="M4 6h16v5a8 8 0 01-5.2 7.5L12 20l-2.8-1.5A8 8 0 014 11zM8 10h2m4 0h2" />
  ),
};

export function BadgeIcon({
  glyph,
  className,
}: {
  glyph: BadgeGlyph;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? "h-6 w-6"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[glyph]}
    </svg>
  );
}
