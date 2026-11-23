import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { I18nProvider } from "./lib/i18n";
import { ThemeProvider } from "./lib/theme";
import { AuthProvider } from "./features/auth/AuthProvider";
import { GameProvider } from "./features/game/GameProvider";
import { ToastHost } from "./features/game/ToastHost";
import { Companion } from "./features/game/Companion";
import { TopBar } from "./components/layout/TopBar";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { DailyPage } from "./pages/DailyPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ClipPage } from "./pages/ClipPage";
import { OnboardPage } from "./pages/OnboardPage";
import { ExamPage } from "./pages/ExamPage";
import { seedCases, seedClips } from "./data/seed";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/clip/:clipId" element={<ClipPage />} />
        <Route path="/onboard" element={<OnboardPage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <GameProvider cases={seedCases} clips={seedClips}>
            <BrowserRouter>
              <div className="relative z-10 min-h-screen">
                <TopBar />
                <AnimatedRoutes />
                <ToastHost />
                <Companion />
              </div>
            </BrowserRouter>
          </GameProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
