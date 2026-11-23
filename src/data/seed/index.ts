/**
 * Kho seed local — dev offline được, không phụ thuộc Firebase (GĐ1).
 * Khi có Firestore, `clips/{clipId}` sẽ thay lookup này (SPEC §5).
 */
import type { CaseFile, Clip } from "../../types/content";
import { fixtureSeed } from "./fixtureClip";
import { clipTed01 } from "./clipTed01";
import { gd4Seed } from "./gd4Seed";

export const seedClips: Clip[] = [
  ...gd4Seed.clips,
  clipTed01,
  ...fixtureSeed.clips,
];

export const seedCases: CaseFile[] = [
  ...gd4Seed.cases,
  ...fixtureSeed.cases,
];

export function getSeedClip(clipId: string): Clip | undefined {
  return seedClips.find((c) => c.id === clipId);
}
