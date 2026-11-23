/**
 * Kho seed local — dev offline được, không phụ thuộc Firebase (GĐ1).
 * Khi có Firestore, `clips/{clipId}` sẽ thay lookup này (SPEC §5).
 */
import type { Clip } from "../../types/content";
import { fixtureSeed } from "./fixtureClip";
import { clipTed01 } from "./clipTed01";

export const seedClips: Clip[] = [
  clipTed01,
  ...fixtureSeed.clips,
];

export function getSeedClip(clipId: string): Clip | undefined {
  return seedClips.find((c) => c.id === clipId);
}
