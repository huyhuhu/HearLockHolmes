/**
 * GameProvider — trung tâm game layer (GĐ5).
 * Nhận GameEvent từ micro-loop/UI → cộng XP idempotent, tick nhiệm vụ ngày,
 * đánh giá thành tựu & phá vụ, bắn toast/level-up, gửi lời trợ thủ Wren.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CaseFile, Clip, SoundCategory } from "../../types/content";
import type { Rank } from "../../types/user";
import type {
  AchievementDoc,
  DailyMissionsSnapshot,
  DetectiveDoc,
  ExamMap,
  GameEventInput,
  GameSnapshot,
} from "../../types/game";
import { progressStore } from "../progress/store";
import {
  ACHIEVEMENTS,
  type AchievementDef,
  type GameStats,
} from "./achievements";
import { gameStore } from "./store";
import { todayKey } from "./daily";
import { canTakeExam, examTargetRank, levelFromXp, nextRank, rankFromXp, XP } from "./levels";
import { evaluateAllCases, type CaseStatus } from "./caseStatus";

export type ToastKind = "xp" | "achievement" | "level" | "info" | "case";

export interface GameToast {
  id: string;
  kind: ToastKind;
  title: string;
  sub?: string;
  glyph?: string;
  amount?: number;
}

export interface CompanionMsg {
  id: string;
  vi: string;
  en: string;
}

export interface LevelUpInfo {
  from: number;
  to: number;
}

type GameValue = {
  snapshot: GameSnapshot;
  detective: DetectiveDoc | null;
  totalXp: number;
  level: number;
  levelProgress: number;
  intoLevel: number;
  needForNext: number;
  rank: Rank;
  nextRankInfo: { rank: Rank; threshold: number } | null;
  examReady: boolean;
  examTarget: Exclude<Rank, "trainee"> | null;
  exams: ExamMap;
  achievements: AchievementDoc[];
  daily: DailyMissionsSnapshot;
  toasts: GameToast[];
  levelUp: LevelUpInfo | null;
  companion: CompanionMsg | null;
  createDetective: (d: DetectiveDoc) => void;
  notify: (e: GameEventInput) => void;
  passExam: (rank: Rank, score: number) => void;
  say: (msg: CompanionMsg) => void;
  dismissCompanion: () => void;
  clearLevelUp: () => void;
  dismissToast: (id: string) => void;
  /** Case statuses thật — dùng cho Case Board */
  caseStatuses: Map<string, CaseStatus>;
  refresh: () => void;
};

const GameContext = createContext<GameValue | null>(null);

let toastSeq = 0;
const uid = () => `t${(toastSeq += 1)}-${Date.now()}`;

export function GameProvider({
  children,
  cases,
  clips,
}: {
  children: ReactNode;
  cases: CaseFile[];
  clips: Clip[];
}) {
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() => gameStore.getSnapshot());
  const [daily, setDaily] = useState<DailyMissionsSnapshot>(() => gameStore.getDaily());
  const [toasts, setToasts] = useState<GameToast[]>([]);
  const [levelUp, setLevelUp] = useState<LevelUpInfo | null>(null);
  const [companion, setCompanion] = useState<CompanionMsg | null>(null);
  const [, setVersion] = useState(0);
  const prevLevelRef = useRef(1);

  const refresh = useCallback(() => {
    setSnapshot(gameStore.getSnapshot());
    setDaily(gameStore.getDaily());
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    prevLevelRef.current = levelFromXp(gameStore.totalXp()).level;
  }, []);

  const pushToast = useCallback((toast: Omit<GameToast, "id">) => {
    const id = uid();
    setToasts((cur) => [...cur, { ...toast, id }].slice(-4));
    window.setTimeout(() => {
      setToasts((cur) => cur.filter((t) => t.id !== id));
    }, 5200);
  }, []);

  const say = useCallback((msg: CompanionMsg) => {
    setCompanion(msg);
  }, []);

  /** Tính stats từ progressStore + counters — nhiên liệu cho thành tựu */
  const computeStats = useCallback((): GameStats => {
    const counters = gameStore.getCounters();
    const allProgress = progressStore.getAllProgress();
    const events = progressStore.getEvents();
    const { activeDays, allDoneDays } = gameStore.dailyDayCounts();
    const totals = levelFromXp(gameStore.totalXp());

    let clustersDecoded = 0;
    let perfectComprehension = 0;
    let cleanSweepClips = 0;
    const decodedByCategory: Record<SoundCategory, number> = {
      liaison: 0,
      reduced: 0,
      elision: 0,
      linking: 0,
      assimilation: 0,
    };
    const decodedSet = new Set<string>();
    for (const p of Object.values(allProgress)) {
      clustersDecoded += p.decodedClusters.length;
      if (p.comprehensionScore >= 1) perfectComprehension += 1;
      for (const cid of p.decodedClusters) decodedSet.add(cid);
    }
    for (const e of events) {
      if (e.type === "decode_hit" && e.clusterId && e.category) {
        decodedByCategory[e.category] += 1;
      }
    }
    // clean sweep: clip có ≥1 cụm và decodedClusters ≥ tổng cụm
    const clipById = new Map(clips.map((c) => [c.id, c]));
    for (const [clipId, p] of Object.entries(allProgress)) {
      const clip = clipById.get(clipId);
      if (!clip) continue;
      const total = clip.sentences.reduce((n, s) => n + s.clusters.length, 0);
      if (total > 0 && p.decodedClusters.length >= total) cleanSweepClips += 1;
    }

    const casesStatus = evaluateAllCases(cases, clips);
    let smallCasesCracked = 0;
    let bossCasesCracked = 0;
    for (const s of casesStatus.values()) {
      if (s.cracked && s.type === "small") smallCasesCracked += 1;
      if (s.cracked && s.type === "boss") bossCasesCracked += 1;
    }

    return {
      level: totals.level,
      rank: rankFromXp(totals.totalXp),
      totalXp: totals.totalXp,
      clustersDecoded,
      decodeMisses: events.filter((e) => e.type === "decode_miss").length,
      cluesFiled: progressStore.getClues().length,
      clipsCompleted: Object.values(allProgress).filter((p) => p.completedAt).length,
      gistFirstTry: counters.gistFirstTry,
      perfectComprehension,
      cleanSweepClips,
      firstTryDecodes: counters.firstTryDecodes,
      decodedByCategory,
      replayCount: events.filter((e) => e.type === "replay").length,
      seekCount: events.filter((e) => e.type === "seek").length,
      dailyAllDoneDays: allDoneDays,
      dailyActiveDays: activeDays,
      casesCracked: counters.casesCracked,
      smallCasesCracked,
      bossCasesCracked,
      examsPassed: Object.keys(gameStore.getExams()).length,
    };
  }, [cases, clips]);

  /** Mở khóa thành tựu khớp event — kèm XP + toast */
  const evaluateAchievements = useCallback(
    (kind: GameEventInput["kind"]) => {
      const unlocked: AchievementDef[] = [];
      for (const def of ACHIEVEMENTS) {
        if (!def.on.includes(kind)) continue;
        if (gameStore.getAchievements().some((a) => a.id === def.id)) continue;
        if (!def.check(computeStats())) continue;
        const doc = gameStore.unlockAchievement(def.id);
        if (doc) {
          gameStore.grantXp(`ach:${def.id}`, "achievement", def.xp);
          unlocked.push(def);
        }
      }
      for (const def of unlocked) {
        pushToast({
          kind: "achievement",
          title: def.title.vi,
          sub: def.desc.vi,
          glyph: def.glyph,
          amount: def.xp,
        });
      }
      return unlocked;
    },
    [computeStats, pushToast],
  );

  /** Kiểm tra vụ án vừa phá — +XP lần đầu */
  const checkCases = useCallback(() => {
    const statuses = evaluateAllCases(cases, clips);
    for (const s of statuses.values()) {
      if (!s.cracked) continue;
      const first = gameStore.markCaseCracked(s.caseId);
      if (!first) continue;
      const isBoss = s.type === "boss";
      gameStore.grantXp(
        `case:${s.caseId}`,
        isBoss ? "case_boss" : "case_small",
        isBoss ? XP.caseBoss : XP.caseSmall,
      );
      pushToast({
        kind: "case",
        title: isBoss ? "PHÁ VỤ ÁN LỚN" : "PHÁ VỤ NHỎ",
        sub: s.caseId,
        glyph: isBoss ? "crown" : "shield",
        amount: isBoss ? XP.caseBoss : XP.caseSmall,
      });
    }
    return statuses;
  }, [cases, clips, pushToast]);

  const notify = useCallback(
    (e: GameEventInput) => {
      const today = todayKey();
      // —— nhiệm vụ ngày (ngày local, không double-tick) ——
      if (e.kind === "gist_pass") {
        const snap = gameStore.tickDaily("listen", 1, today);
        const m = snap.missions.find((x) => x.id === "listen");
        if (m && m.done >= m.target && !m.claimed) {
          gameStore.claimDaily("listen", today);
          gameStore.grantXp(`daily:${today}:listen`, "daily_mission", m.rewardXp);
          pushToast({ kind: "xp", title: "Nhiệm vụ ngày", sub: "Lắng nghe lời khai", amount: m.rewardXp, glyph: "calendar" });
        }
      }
      if (e.kind === "decode_hit") {
        const snap = gameStore.tickDaily("decode", 1, today);
        const m = snap.missions.find((x) => x.id === "decode");
        if (m && m.done >= m.target && !m.claimed) {
          gameStore.claimDaily("decode", today);
          gameStore.grantXp(`daily:${today}:decode`, "daily_mission", m.rewardXp);
          pushToast({ kind: "xp", title: "Nhiệm vụ ngày", sub: "Giải mã đoạn nối âm", amount: m.rewardXp, glyph: "calendar" });
        }
      }
      if (e.kind === "replay") {
        const snap = gameStore.tickDaily("replay", 1, today);
        const m = snap.missions.find((x) => x.id === "replay");
        if (m && m.done >= m.target && !m.claimed) {
          gameStore.claimDaily("replay", today);
          gameStore.grantXp(`daily:${today}:replay`, "daily_mission", m.rewardXp);
          pushToast({ kind: "xp", title: "Nhiệm vụ ngày", sub: "Nghe lại lời khai", amount: m.rewardXp, glyph: "calendar" });
        }
      }

      // —— counters ——
      if (e.kind === "gist_pass" && e.firstTry) gameStore.bumpCounter("gistFirstTry");
      if (e.kind === "decode_hit" && e.firstTry) gameStore.bumpCounter("firstTryDecodes");

      // —— XP hành vi học thật (idempotent — chỉ lần đầu) ——
      if (e.kind === "decode_hit" && e.clipId && e.clusterId) {
        const amount = gameStore.grantXp(
          `decode:${e.clipId}:${e.clusterId}`,
          "decode_hit",
          XP.decodeHit,
        );
        if (amount > 0) {
          pushToast({ kind: "xp", title: "Giải mã trúng", amount, glyph: "fingerprint" });
        }
      }
      if (e.kind === "comprehension_scored" && e.clipId && (e.value ?? 0) >= 0.7) {
        const amount = gameStore.grantXp(
          `comprehension:${e.clipId}`,
          "clip_comprehension",
          XP.clipComprehension,
        );
        if (amount > 0) {
          pushToast({ kind: "xp", title: "Hiểu nghĩa ≥70%", amount, glyph: "medal" });
        }
      }
      if (e.kind === "exam_passed") {
        gameStore.grantXp(`exam:${e.value ?? Date.now()}`, "exam_pass", XP.examPass);
      }

      // —— thành tựu & vụ án (XP thành tựu có thể đẩy level) ——
      evaluateAchievements(e.kind);
      checkCases();

      // —— level-up (so trước/sau, tính cả XP thành tựu) ——
      const beforeLevel = prevLevelRef.current;
      const afterLevel = levelFromXp(gameStore.totalXp()).level;
      if (afterLevel > beforeLevel) {
        prevLevelRef.current = afterLevel;
        evaluateAchievements("level_up");
        const finalLevel = levelFromXp(gameStore.totalXp()).level;
        prevLevelRef.current = finalLevel;
        setLevelUp({ from: beforeLevel, to: finalLevel });
        pushToast({
          kind: "level",
          title: `LÊN CẤP ${finalLevel}`,
          sub: "Hồ sơ thám tử dày thêm",
          glyph: "star",
        });
      } else {
        prevLevelRef.current = afterLevel;
      }

      // —— lời trợ thủ theo ngữ cảnh ——
      if (e.kind === "decode_miss") {
        say({
          id: uid(),
          vi: "Trượt rồi — nghe lại đoạn ±1s, tập trung vào phụ âm đầu cụm.",
          en: "Missed — replay that span ±1s and focus on the first consonant.",
        });
      } else if (e.kind === "gist_pass") {
        say({
          id: uid(),
          vi: "Hiện trường đã mở khoá. Vào phòng thí nghiệm mổ xẻ từng cụm nhé, Thám tử.",
          en: "Scene unlocked. Head to the lab and dissect the clusters, Detective.",
        });
      }

      refresh();
    },
    [evaluateAchievements, checkCases, pushToast, refresh, say],
  );

  const createDetective = useCallback(
    (d: DetectiveDoc) => {
      gameStore.saveDetective(d);
      pushToast({
        kind: "info",
        title: "Hồ sơ đã lập",
        sub: `${d.name} — chúc điều tra vui vẻ`,
        glyph: "mask",
      });
      say({
        id: uid(),
        vi: `Chào ${d.name}. Wren đây — trợ thủ của thám tử. Có gì không nghe ra, gọi tôi.`,
        en: `Welcome, ${d.name}. Wren here — your sidekick. If something slips past your ear, call me.`,
      });
      evaluateAchievements("detective_created");
      refresh();
    },
    [evaluateAchievements, pushToast, refresh, say],
  );

  const passExam = useCallback(
    (rank: Rank, score: number) => {
      gameStore.saveExam(rank, score);
      notify({ kind: "exam_passed", value: rank === "legend" ? 2 : 1 });
      say({
        id: uid(),
        vi: "Đỗ sát hạch rồi! Hàm mới, vụ mới. Tôi tự hào về thám tử đấy.",
        en: "Exam passed! New rank, new cases. Proud of you, Detective.",
      });
    },
    [notify, say],
  );

  const totalXp = gameStore.totalXp();
  const lvl = levelFromXp(totalXp);
  const rank = rankFromXp(totalXp);
  const examTarget = examTargetRank(rank);
  const examReady = canTakeExam(totalXp, rank);

  const value = useMemo<GameValue>(
    () => ({
      snapshot,
      detective: snapshot.detective,
      totalXp,
      level: lvl.level,
      levelProgress: lvl.progress,
      intoLevel: lvl.intoLevel,
      needForNext: lvl.needForNext,
      rank,
      nextRankInfo: nextRank(rank),
      examReady,
      examTarget,
      exams: gameStore.getExams(),
      achievements: snapshot.achievements,
      daily,
      toasts,
      levelUp,
      companion,
      createDetective,
      notify,
      passExam,
      say,
      dismissCompanion: () => setCompanion(null),
      clearLevelUp: () => setLevelUp(null),
      dismissToast: (id: string) =>
        setToasts((cur) => cur.filter((t) => t.id !== id)),
      caseStatuses: evaluateAllCases(cases, clips),
      refresh,
    }),
    [
      snapshot,
      totalXp,
      lvl,
      rank,
      examReady,
      examTarget,
      daily,
      toasts,
      levelUp,
      companion,
      createDetective,
      notify,
      passExam,
      say,
      cases,
      clips,
      refresh,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
