/**
 * Thành tựu (GĐ5) — ~35 huy hiệu SVG noir, unlock theo dữ liệu học thật.
 * Mỗi thành tựu +10–30 XP, key idempotent `ach:{id}` (chỉ tính 1 lần).
 */
import type { SoundCategory } from "../../types/content";
import type { Rank } from "../../types/user";
import type { GameEventKind } from "../../types/game";
import { XP } from "./levels";

export type BadgeGlyph =
  | "star"
  | "ear"
  | "wave"
  | "fingerprint"
  | "zoom"
  | "stamp"
  | "shield"
  | "clock"
  | "calendar"
  | "brain"
  | "bolt"
  | "book"
  | "key"
  | "crown"
  | "medal"
  | "mask";

export interface AchievementDef {
  id: string;
  glyph: BadgeGlyph;
  xp: number;
  title: { vi: string; en: string };
  desc: { vi: string; en: string };
  /** Đánh giá từ stats — chỉ chạy khi event liên quan đến nhánh này */
  check: (s: GameStats) => boolean;
  /** Chạy check khi có các event này (tiết kiệm) */
  on: GameEventKind[];
}

/** Thống kê suy ra từ progressStore + gameStore */
export interface GameStats {
  level: number;
  rank: Rank;
  totalXp: number;
  clustersDecoded: number;
  decodeMisses: number;
  cluesFiled: number;
  clipsCompleted: number;
  gistFirstTry: number;
  perfectComprehension: number;
  cleanSweepClips: number;
  firstTryDecodes: number;
  decodedByCategory: Record<SoundCategory, number>;
  replayCount: number;
  seekCount: number;
  dailyAllDoneDays: number;
  dailyActiveDays: number;
  casesCracked: string[];
  smallCasesCracked: number;
  bossCasesCracked: number;
  examsPassed: number;
}

export const EMPTY_STATS: GameStats = {
  level: 1,
  rank: "trainee",
  totalXp: 0,
  clustersDecoded: 0,
  decodeMisses: 0,
  cluesFiled: 0,
  clipsCompleted: 0,
  gistFirstTry: 0,
  perfectComprehension: 0,
  cleanSweepClips: 0,
  firstTryDecodes: 0,
  decodedByCategory: {
    liaison: 0,
    reduced: 0,
    elision: 0,
    linking: 0,
    assimilation: 0,
  },
  replayCount: 0,
  seekCount: 0,
  dailyAllDoneDays: 0,
  dailyActiveDays: 0,
  casesCracked: [],
  smallCasesCracked: 0,
  bossCasesCracked: 0,
  examsPassed: 0,
};

const A = (
  id: string,
  glyph: BadgeGlyph,
  xp: number,
  vi: [string, string],
  en: [string, string],
  on: GameEventKind[],
  check: (s: GameStats) => boolean,
): AchievementDef => ({
  id,
  glyph,
  xp: Math.min(XP.achievementMax, Math.max(XP.achievementMin, xp)),
  title: { vi: vi[0], en: en[0] },
  desc: { vi: vi[1], en: en[1] },
  on,
  check,
});

export const ACHIEVEMENTS: AchievementDef[] = [
  // —— Nhập môn ——
  A("ach-debut", "star", 20, ["Nhập môn", "Lập hồ sơ thám tử đầu tiên."], ["Debut", "Create your detective file."], ["detective_created"], () => true),
  A("ach-first-listen", "ear", 10, ["Hiện trường đầu tiên", "Qua cổng câu hỏi hiện trường lần đầu."], ["First scene", "Pass the field question gate once."], ["gist_pass"], (s) => s.gistFirstTry >= 1),
  A("ach-first-decode", "fingerprint", 10, ["Dấu vân tay", "Giải mã đúng cụm âm đầu tiên."], ["First print", "Decode your first cluster."], ["decode_hit"], (s) => s.clustersDecoded >= 1),
  A("ach-first-clue", "key", 10, ["Manh mối đầu tiên", "Ghi manh mối đầu tiên vào sổ tay."], ["First clue", "File your first clue."], ["clue_filed"], (s) => s.cluesFiled >= 1),
  A("ach-first-file", "stamp", 15, ["Đóng hồ sơ đầu tiên", "Hoàn thành điều tra 1 clip."], ["First file closed", "Finish investigating one clip."], ["clip_completed"], (s) => s.clipsCompleted >= 1),
  A("ach-first-daily", "calendar", 10, ["Nhật ký điều tra", "Hoàn thành nhiệm vụ ngày đầu tiên."], ["Case journal", "Complete your first daily mission."], ["daily_completed"], (s) => s.dailyActiveDays >= 1),

  // —— Sản lượng ——
  A("ach-decode-5", "fingerprint", 10, ["Bàn tay nhanh", "Giải mã 5 cụm âm."], ["Steady hands", "Decode 5 clusters."], ["decode_hit"], (s) => s.clustersDecoded >= 5),
  A("ach-decode-25", "fingerprint", 20, ["Thám tử mổ xẻ", "Giải mã 25 cụm âm."], ["Dissection pro", "Decode 25 clusters."], ["decode_hit"], (s) => s.clustersDecoded >= 25),
  A("ach-decode-50", "wave", 25, ["Tai thép", "Giải mã 50 cụm âm."], ["Iron ear", "Decode 50 clusters."], ["decode_hit"], (s) => s.clustersDecoded >= 50),
  A("ach-decode-100", "wave", 30, ["Bậc thầy âm thanh", "Giải mã 100 cụm âm."], ["Sound master", "Decode 100 clusters."], ["decode_hit"], (s) => s.clustersDecoded >= 100),
  A("ach-clips-3", "book", 15, ["Ba lời khai", "Hoàn thành điều tra 3 clip."], ["Three testimonies", "Finish 3 clips."], ["clip_completed"], (s) => s.clipsCompleted >= 3),
  A("ach-clips-5", "book", 20, ["Kho hồ sơ", "Hoàn thành điều tra 5 clip."], ["Case archive", "Finish 5 clips."], ["clip_completed"], (s) => s.clipsCompleted >= 5),
  A("ach-clips-10", "book", 30, ["Bách khoa hiện trường", "Hoàn thành điều tra 10 clip."], ["Scene encyclopedia", "Finish 10 clips."], ["clip_completed"], (s) => s.clipsCompleted >= 10),
  A("ach-clues-10", "key", 15, ["Sổ tay dày", "Ghi 10 manh mối."], ["Thick notebook", "File 10 clues."], ["clue_filed"], (s) => s.cluesFiled >= 10),
  A("ach-clues-30", "key", 25, ["Kho manh mối", "Ghi 30 manh mối."], ["Clue vault", "File 30 clues."], ["clue_filed"], (s) => s.cluesFiled >= 30),

  // —— Bá chủ 5 loại âm ——
  A("ach-cat-liaison", "wave", 20, ["Chuyên gia nối âm", "Giải mã 5 cụm liaison."], ["Liaison specialist", "Decode 5 liaison clusters."], ["decode_hit"], (s) => s.decodedByCategory.liaison >= 5),
  A("ach-cat-reduced", "ear", 20, ["Thính giác gọn", "Giải mã 5 cụm reduced speech."], ["Reduced-speech ear", "Decode 5 reduced-speech clusters."], ["decode_hit"], (s) => s.decodedByCategory.reduced >= 5),
  A("ach-cat-elision", "zoom", 20, ["Bắt âm biến mất", "Giải mã 5 cụm elision."], ["Catch the vanish", "Decode 5 elision clusters."], ["decode_hit"], (s) => s.decodedByCategory.elision >= 5),
  A("ach-cat-linking", "bolt", 20, ["Nối liền mạch", "Giải mã 5 cụm linking."], ["Smooth linker", "Decode 5 linking clusters."], ["decode_hit"], (s) => s.decodedByCategory.linking >= 5),
  A("ach-cat-assimilation", "brain", 20, ["Đồng hoá học", "Giải mã 5 cụm assimilation."], ["Assimilation scholar", "Decode 5 assimilation clusters."], ["decode_hit"], (s) => s.decodedByCategory.assimilation >= 5),

  // —— Kỹ năng ——
  A("ach-sharp-ear", "ear", 20, ["Tai nghe trúng phóc", "Đoán trúng gist ngay lần đầu 3 lần."], ["Called it thrice", "Nail the field question first try 3 times."], ["gist_pass"], (s) => s.gistFirstTry >= 3),
  A("ach-perfect-report", "medal", 20, ["Bản tường trình hoàn hảo", "Đạt 100% hiểu nghĩa ở 1 clip."], ["Perfect report", "Score 100% comprehension on a clip."], ["comprehension_scored"], (s) => s.perfectComprehension >= 1),
  A("ach-clean-sweep", "stamp", 25, ["Quét sạch hiện trường", "Giải mã trọn cụm âm trong 1 clip."], ["Clean sweep", "Decode every cluster in one clip."], ["clip_completed"], (s) => s.cleanSweepClips >= 1),
  A("ach-first-try-5", "bolt", 15, ["Chốt nhanh", "Giải mã đúng ngay lần chọn đầu 5 cụm."], ["Quick draw", "Decode 5 clusters on the first attempt."], ["decode_hit"], (s) => s.firstTryDecodes >= 5),
  A("ach-decode-miss-10", "zoom", 10, ["Không bỏ cuộc", "Trượt 10 lần vẫn tiếp tục giải mã."], ["Persistence", "Miss 10 times and keep decoding."], ["decode_miss"], (s) => s.decodeMisses >= 10),

  // —— Vụ án & sát hạch ——
  A("ach-case-small", "shield", 25, ["Phá vụ nhỏ", "Phá được 1 vụ nhỏ."], ["Small case cracked", "Crack a small case."], ["case_cracked"], (s) => s.smallCasesCracked >= 1),
  A("ach-case-boss", "crown", 30, ["Kẻ diệt boss", "Phá được 1 vụ boss."], ["Boss down", "Crack a boss case."], ["case_cracked"], (s) => s.bossCasesCracked >= 1),
  A("ach-exam-veteran", "medal", 25, ["Kỳ cựu", "Đỗ kỳ sát hạch Thám tử kỳ cựu."], ["Veteran", "Pass the Veteran exam."], ["exam_passed"], (s) => s.examsPassed >= 1),
  A("ach-exam-legend", "crown", 30, ["Lừng danh", "Đỗ kỳ sát hạch Thám tử lừng danh."], ["Legend", "Pass the Legend exam."], ["exam_passed"], (s) => s.examsPassed >= 2),

  // —— Level & nhật ký ——
  A("ach-level-5", "star", 15, ["Cấp 5", "Đạt cấp điều tra 5."], ["Level 5", "Reach detective level 5."], ["level_up"], (s) => s.level >= 5),
  A("ach-level-10", "star", 20, ["Cấp 10", "Đạt cấp điều tra 10."], ["Level 10", "Reach detective level 10."], ["level_up"], (s) => s.level >= 10),
  A("ach-level-20", "star", 25, ["Cấp 20", "Đạt cấp điều tra 20."], ["Level 20", "Reach detective level 20."], ["level_up"], (s) => s.level >= 20),
  A("ach-level-30", "star", 30, ["Cấp 30", "Đạt cấp điều tra 30."], ["Level 30", "Reach detective level 30."], ["level_up"], (s) => s.level >= 30),
  A("ach-daily-3", "calendar", 20, ["Trọn ngày", "Hoàn thành cả 3 nhiệm vụ ngày trong 1 ngày."], ["Full day", "Finish all 3 daily missions in one day."], ["daily_completed"], (s) => s.dailyAllDoneDays >= 1),
  A("ach-daily-days-3", "calendar", 25, ["Đều tay", "Làm nhiệm vụ ngày trong 3 ngày khác nhau (không tính chuỗi)."], ["Steady rhythm", "Do dailies on 3 different days (no streak)."], ["daily_completed"], (s) => s.dailyActiveDays >= 3),
  A("ach-replay-10", "clock", 10, ["Nghe đi nghe lại", "Bấm nghe lại 10 lần."], ["Again, again", "Hit replay 10 times."], ["replay"], (s) => s.replayCount >= 10),
  A("ach-timemachine", "clock", 10, ["Máy tua thời gian", "Tua audio 10 lần."], ["Time machine", "Seek the audio 10 times."], ["seek"], (s) => s.seekCount >= 10),
];

export function achievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
