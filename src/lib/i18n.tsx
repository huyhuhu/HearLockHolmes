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
    "home.caseFilesSoon": "Hồ sơ vụ án đang được lập…",
    "home.caseFilesSoonSub":
      "Vụ đầu tiên sẽ xuất hiện tại đây sau khi kho tư liệu được thu thập.",
    "lang.label": "Ngôn ngữ",
    "theme.toLight": "Chuyển ban ngày",
    "theme.toDark": "Chuyển đêm",
    "login.title": "Vào phòng làm việc",
    "login.sub": "Đăng nhập để hồ sơ thám tử của bạn được lưu lại.",
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
    "lang.label": "Language",
    "theme.toLight": "Switch to day",
    "theme.toDark": "Switch to night",
    "login.title": "Enter the office",
    "login.sub": "Sign in so your detective record is kept.",
  },
} as const;

export type MsgKey = keyof (typeof dict)["vi"];

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: MsgKey) => string;
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
    (key: MsgKey) => dict[lang][key] ?? dict.vi[key] ?? key,
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
