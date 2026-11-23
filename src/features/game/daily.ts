/**
 * Nhiệm vụ ngày (Daily Investigation) — 3 chiếc/ngày, KHÔNG streak, không phạt nghỉ.
 * Sinh deterministic theo ngày (yyyy-mm-dd) — reload không đổi nhiệm vụ.
 */
import type { DailyMissionsSnapshot } from "../../types/game";

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** 3 nhiệm vụ/ngày — target dao động nhẹ theo ngày, reward 10–20 XP (SPEC §3) */
export function missionsForDate(dateKey: string): DailyMissionsSnapshot {
  const h = hashString(dateKey);
  const listenTarget = 1 + (h % 2); // 1–2 lời khai
  const decodeTarget = 3 + (h % 3); // 3–5 cụm
  const replayTarget = 2 + (h % 3); // 2–4 lần nghe lại
  return {
    missions: [
      {
        id: "listen",
        type: "listen_clips",
        target: listenTarget,
        done: 0,
        rewardXp: 10 + (h % 3) * 2,
        claimed: false,
      },
      {
        id: "decode",
        type: "decode_clusters",
        target: decodeTarget,
        done: 0,
        rewardXp: 15 + (h % 2) * 5,
        claimed: false,
      },
      {
        id: "replay",
        type: "replay_sentences",
        target: replayTarget,
        done: 0,
        rewardXp: 10 + ((h >> 3) % 3) * 2,
        claimed: false,
      },
    ],
  };
}

export type DailyProgress = {
  dateKey: string;
  missions: DailyMissionsSnapshot["missions"];
  allDone: boolean;
  doneCount: number;
};
