import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { I18nProvider } from "./lib/i18n";
import { ThemeProvider } from "./lib/theme";
import { AuthProvider } from "./features/auth/AuthProvider";
import { TopBar } from "./components/layout/TopBar";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { DailyPage } from "./pages/DailyPage";
import { ProfilePage } from "./pages/ProfilePage";

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="relative z-10 min-h-screen">
              <TopBar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/daily" element={<DailyPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
