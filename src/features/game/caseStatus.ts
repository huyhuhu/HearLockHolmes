/**
 * Trạng thái vụ án — tính từ ClipProgress thật (không hardcode thắng, SPEC §3).
 *
 * Vụ nhỏ: mỗi clip hiểu nghĩa ≥70% + giải mã ≥1 cụm.
 * Boss: hiểu nghĩa ≥70% + giải mã ≥60% số cụm annotate.
 * Boss bị khóa đến khi phá xong vụ nhỏ (mở khóa có hiệu ứng).
 */
import type { CaseFile, Clip } from "../../types/content";
import type { ClipProgress } from "../../types/user";
import { progressStore } from "../progress/store";

export type ClipCaseStatus = {
  clipId: string;
  comprehensionScore: number;
  decoded: number;
  totalClusters: number;
  gistPassed: boolean;
  complete: boolean;
};

export type CaseStatus = {
  caseId: string;
  type: "small" | "boss";
  locked: boolean;
  cracked: boolean;
  clips: ClipCaseStatus[];
  /** 0..1 — tiến độ phá án */
  progress: number;
};

export function clusterCount(clip: Clip): number {
  return clip.sentences.reduce((n, s) => n + s.clusters.length, 0);
}

function clipStatus(clip: Clip, type: "small" | "boss"): ClipCaseStatus {
  const p: ClipProgress = progressStore.getProgress(clip.id);
  const totalClusters = clusterCount(clip);
  const decoded = p.decodedClusters.length;
  const needDecoded =
    type === "boss" ? Math.ceil(totalClusters * 0.6) : Math.min(1, totalClusters);
  const complete =
    p.comprehensionScore >= 0.7 &&
    (totalClusters === 0 ? true : decoded >= needDecoded);
  return {
    clipId: clip.id,
    comprehensionScore: p.comprehensionScore,
    decoded,
    totalClusters,
    gistPassed: p.gistPassed,
    complete,
  };
}

export function evaluateCase(
  caseFile: CaseFile,
  clipsById: Map<string, Clip>,
  smallCaseCracked: boolean,
): CaseStatus {
  const clips: ClipCaseStatus[] = caseFile.clipIds
    .map((id) => clipsById.get(id))
    .filter((c): c is Clip => Boolean(c))
    .map((c) => clipStatus(c, caseFile.type));
  const cracked = clips.length > 0 && clips.every((c) => c.complete);
  const progress =
    clips.length === 0
      ? 0
      : clips.reduce((sum, c) => {
          const total = Math.max(1, c.totalClusters);
          const dec = Math.min(1, c.decoded / total);
          const comp = Math.min(1, c.comprehensionScore / 0.7);
          return sum + Math.min(1, (dec + comp) / 2);
        }, 0) / clips.length;
  return {
    caseId: caseFile.id,
    type: caseFile.type,
    locked: caseFile.type === "boss" && !smallCaseCracked,
    cracked,
    clips,
    progress: Math.round(progress * 100) / 100,
  };
}

/** Đánh giá tất cả case — dùng cho Case Board + XP "phá vụ" */
export function evaluateAllCases(cases: CaseFile[], clips: Clip[]): Map<string, CaseStatus> {
  const clipsById = new Map(clips.map((c) => [c.id, c]));
  const statuses = cases.map((c) =>
    evaluateCase(c, clipsById, false),
  );
  const smallCracked = statuses.some((s) => s.type === "small" && s.cracked);
  const out = new Map<string, CaseStatus>();
  cases.forEach((c) => {
    out.set(c.id, evaluateCase(c, clipsById, smallCracked));
  });
  return out;
}
