import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "vi" | "en";

const dict = {
  vi: {
    tagline: "Mọi âm thanh đều để lại manh mối.",
    "nav.cases": "Sổ vụ án",
    "nav.daily": "Nhiệm vụ ngày",
    "nav.profile": "Hồ sơ",
    "nav.cases.short": "Vụ án",
    "nav.daily.short": "Nhiệm vụ",
    "nav.profile.short": "Hồ sơ",
    "auth.login": "Đăng nhập Google",
    "auth.logout": "Đăng xuất",
    "auth.notConfigured":
      "Firebase chưa cấu hình — copy .env.example thành .env.local và điền config để bật đăng nhập.",
    "auth.signedInAs": "Thám tử",
    "auth.anonymous": "Khách lạ (chưa đăng nhập)",
    "home.headline": "HEARLOCK HOLMES",
    "home.sub": "Nghe hiểu tiếng bản xứ tốc độ thật — chính là phá án.",
    "home.caseFiles": "Mở Sổ vụ án",
    "home.caseFilesSoon":
      "Hồ sơ vụ án đang được lập…",
    "home.caseFilesSoonSub":
      "Vụ đầu tiên sẽ xuất hiện tại đây sau khi kho tư liệu được thu thập.",
    "home.start": "Bắt đầu điều tra",
    "home.startSub": "Đi một câu thoại trọn vòng: nghe mù → mổ xẻ → giải mã → nghe lại.",
    "lang.label": "Ngôn ngữ",
    "theme.toLight": "Chuyển ban ngày",
    "theme.toDark": "Chuyển đêm",
    "login.title": "Vào phòng làm việc",
    "login.sub": "Đăng nhập để hồ sơ thám tử của bạn được lưu lại.",

    "clip.eyebrow": "HỒ SƠ BẰNG CHỨNG",
    "clip.notFound": "Không tìm thấy clip này.",
    "clip.backHome": "Về trang chủ",

    "loop.stage.blind": "Hiện trường",
    "loop.stage.dissect": "Phòng thí nghiệm",
    "loop.stage.decode": "Giải mã",
    "loop.stage.relisten": "Ghi hồ sơ",
    "loop.stage.done": "Đã xong",

    "loop.blind.eyebrow": "NGHE MÙ — KHÔNG CHỮ",
    "loop.blind.hint":
      "Nghe ở tốc độ thật. Chưa có transcript — chỉ có âm thanh.",
    "loop.blind.gate": "CÂU HỎI HIỆN TRƯỜNG",
    "loop.blind.gateHint":
      "Trả lời để mở khóa Phòng thí nghiệm. Đúng hay sai đều mở khóa — chỉ là hương vị.",
    "loop.blind.hit": "Đoán trúng.",
    "loop.blind.miss": "Trượt — nhưng hiện trường đã mở khóa.",
    "loop.blind.enter": "Vào Phòng thí nghiệm",

    "loop.dissect.eyebrow": "MỔ XẺ — CHẠM CỤM ĐỂ NGHE ĐOẠN ĐÓ",
    "loop.dissect.hint":
      "Cụm bị nuốt/nối được đánh dấu. Chạm để nghe đúng đoạn đó ±1s.",
    "loop.dissect.playSentence": "Nghe cả câu",
    "loop.dissect.clusterHint": "Nghe đoạn này ±1s",
    "loop.dissect.noClusters":
      "Câu này không có cụm bị nuốt — không có gì phải giải mã.",
    "loop.dissect.toDecode": "Giải mã cụm này",
    "loop.dissect.toRelisten": "Sang nghe lại",

    "loop.decode.eyebrow": "NHIỆM VỤ GIẢI MÃ — CHỌN DẠNG SẠCH",
    "loop.decode.hint":
      "Bạn nghe ra gì? Chọn dạng sạch của cụm âm trong 3–4 lựa chọn.",
    "loop.decode.prompt": "Dạng sạch của cụm này là gì?",
    "loop.decode.correct": "Trúng — đây là dạng sạch.",
    "loop.decode.wrong": "Chưa phải. Nghe lại đoạn đó rồi chọn lại.",
    "loop.decode.note": "Vì sao nghe không ra",
    "loop.decode.hear": "Nghe đoạn đó",
    "loop.decode.report": "BẢN TƯỜNG TRÌNH",
    "loop.decode.reportHint":
      "3 câu hiểu nghĩa — gắn manh mối với ngữ cảnh vụ án.",
    "loop.decode.next": "Câu sau",
    "loop.decode.toRelisten": "Nghe lại & ghi hồ sơ",
    "loop.decode.remaining": "Còn {n} cụm chưa giải mã xong.",

    "loop.relisten.eyebrow": "NGHE LẠI — GHI VÀO SỔ TAY",
    "loop.relisten.hint":
      "Nghe lại sau khi đã hiểu vì sao nghe không ra. Rồi ghi manh mối.",
    "loop.relisten.clear": "Nghe rõ rồi",
    "loop.relisten.fuzzy": "Vẫn còn mơ",
    "loop.relisten.save": "Ghi manh mối vào sổ tay",
    "loop.relisten.saved": "Đã ghi {n} manh mối vào sổ tay.",
    "loop.relisten.finish": "Đóng hồ sơ",
    "loop.relisten.noClusters": "Câu này không có manh mối để ghi.",

    "loop.nav.prev": "Câu trước",
    "loop.nav.next": "Câu sau",
    "loop.nav.sentence": "Câu {i}/{n}",
    "loop.nav.jumpClusters": "Nhảy tới câu có cụm",

    "loop.done.title": "Hồ sơ đã đóng",
    "loop.done.sub":
      "Manh mối đã ghi vào sổ tay. Sự thật nằm trong âm thanh.",
    "loop.done.clues": "Manh mối đã ghi",
    "loop.done.decoded": "Cụm đã giải mã",
    "loop.done.again": "Điều tra lại",
    "loop.done.home": "Về Sổ vụ án",

    "player.play": "Phát",
    "player.pause": "Tạm dừng",
    "player.replay": "Nghe lại",
    "player.hide": "Ẩn điều khiển",
    "player.show": "Hiện điều khiển",
    "player.rate": "Tốc độ",
    "player.abClear": "Bỏ vòng",
    "player.loading": "Đang nạp máy băng…",
    "player.error": "Không nạp được video YouTube. Kiểm tra mạng rồi thử lại.",
    "player.waveform": "Băng tần âm thanh",

    "cat.liaison": "Nối âm",
    "cat.reduced": "Nuốt/gọn",
    "cat.elision": "Bỏ âm",
    "cat.linking": "Nối phụ âm–nguyên âm",
    "cat.assimilation": "Đồng hóa",
  },
  en: {
    tagline: "Every sound leaves a clue.",
    "nav.cases": "Case Files",
    "nav.daily": "Daily Investigation",
    "nav.profile": "Detective Profile",
    "nav.cases.short": "Cases",
    "nav.daily.short": "Daily",
    "nav.profile.short": "Profile",
    "auth.login": "Sign in with Google",
    "auth.logout": "Sign out",
    "auth.notConfigured":
      "Firebase is not configured — copy .env.example to .env.local and fill in the config to enable sign-in.",
    "auth.signedInAs": "Detective",
    "auth.anonymous": "Stranger (not signed in)",
    "home.headline": "HEARLOCK HOLMES",
    "home.sub": "Understanding real-speed native speech is the investigation.",
    "home.caseFiles": "Open Case Files",
    "home.caseFilesSoon": "Case board is being prepared…",
    "home.caseFilesSoonSub":
      "The first case will appear here once the evidence archive is collected.",
    "home.start": "Start the investigation",
    "home.startSub":
      "Walk one line through the whole loop: blind listen → dissect → decode → relisten.",
    "lang.label": "Language",
    "theme.toLight": "Switch to day",
    "theme.toDark": "Switch to night",
    "login.title": "Enter the office",
    "login.sub": "Sign in so your detective record is kept.",

    "clip.eyebrow": "EVIDENCE FILE",
    "clip.notFound": "No such clip.",
    "clip.backHome": "Back home",

    "loop.stage.blind": "Crime scene",
    "loop.stage.dissect": "The lab",
    "loop.stage.decode": "Decode",
    "loop.stage.relisten": "File the clue",
    "loop.stage.done": "Done",

    "loop.blind.eyebrow": "BLIND LISTEN — NO TEXT",
    "loop.blind.hint":
      "Listen at real speed. No transcript yet — only the sound.",
    "loop.blind.gate": "FIELD QUESTION",
    "loop.blind.gateHint":
      "Answer to unlock the lab. Right or wrong, the lab opens — this is just flavor.",
    "loop.blind.hit": "Called it.",
    "loop.blind.miss": "Missed — but the scene is unlocked.",
    "loop.blind.enter": "Enter the lab",

    "loop.dissect.eyebrow": "DISSECT — TAP A CLUSTER TO HEAR IT",
    "loop.dissect.hint":
      "Swallowed / linked clusters are marked. Tap one to hear exactly that span ±1s.",
    "loop.dissect.playSentence": "Play the whole line",
    "loop.dissect.clusterHint": "Hear this span ±1s",
    "loop.dissect.noClusters":
      "No swallowed cluster in this line — nothing to decode.",
    "loop.dissect.toDecode": "Decode these clusters",
    "loop.dissect.toRelisten": "To relisten",

    "loop.decode.eyebrow": "DECODE — PICK THE CLEAN FORM",
    "loop.decode.hint":
      "What did you actually hear? Pick the clean form from 3–4 options.",
    "loop.decode.prompt": "What is the clean form of this cluster?",
    "loop.decode.correct": "Hit — that is the clean form.",
    "loop.decode.wrong": "Not yet. Hear that span again, then pick again.",
    "loop.decode.note": "Why it slipped",
    "loop.decode.hear": "Hear the span",
    "loop.decode.report": "THE REPORT",
    "loop.decode.reportHint":
      "3 comprehension questions — tie the clues to the case.",
    "loop.decode.next": "Next line",
    "loop.decode.toRelisten": "Relisten & file",
    "loop.decode.remaining": "{n} clusters still undecoded.",

    "loop.relisten.eyebrow": "RELISTEN — WRITE IT DOWN",
    "loop.relisten.hint":
      "Hear it again now that you know why it slipped. Then file the clue.",
    "loop.relisten.clear": "Loud and clear",
    "loop.relisten.fuzzy": "Still fuzzy",
    "loop.relisten.save": "File the clue",
    "loop.relisten.saved": "Filed {n} clues in the notebook.",
    "loop.relisten.finish": "Close the file",
    "loop.relisten.noClusters": "No clue to file on this line.",

    "loop.nav.prev": "Previous",
    "loop.nav.next": "Next",
    "loop.nav.sentence": "Line {i}/{n}",
    "loop.nav.jumpClusters": "Jump to a line with clusters",

    "loop.done.title": "File closed",
    "loop.done.sub": "Clues are in the notebook. The truth lives in the sound.",
    "loop.done.clues": "Clues filed",
    "loop.done.decoded": "Clusters decoded",
    "loop.done.again": "Reopen the case",
    "loop.done.home": "Back to case files",

    "player.play": "Play",
    "player.pause": "Pause",
    "player.replay": "Replay",
    "player.hide": "Hide controls",
    "player.show": "Show controls",
    "player.rate": "Speed",
    "player.abSetA": "Set A",
    "player.abSetB": "Set B",
    "player.abClear": "Clear",
    "player.loading": "Loading the deck…",
    "player.error": "YouTube video could not load. Check your connection.",
    "player.waveform": "Waveform",

    "cat.liaison": "Liaison",
    "cat.reduced": "Reduced speech",
    "cat.elision": "Elision",
    "cat.linking": "Linking",
    "cat.assimilation": "Assimilation",
  },
} as const;

export type MsgKey = keyof (typeof dict)["vi"];

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: MsgKey, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = "hearlock.lang";

function readInitialLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "en" || saved === "vi" ? saved : "vi";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readInitialLang);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "vi" ? "en" : "vi"));
  }, []);

  const t = useCallback(
    (key: MsgKey, params?: Record<string, string | number>) => {
      const template = dict[lang][key] ?? dict.vi[key] ?? key;
      if (!params) return template;
      return template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in params ? String(params[name]) : match,
      );
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t }),
    [lang, toggleLang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
