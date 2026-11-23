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
import { TopBar } from "./components/layout/TopBar";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { DailyPage } from "./pages/DailyPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ClipPage } from "./pages/ClipPage";

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
          <BrowserRouter>
            <div className="relative z-10 min-h-screen">
              <TopBar />
              <AnimatedRoutes />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
