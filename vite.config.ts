import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub Pages host app tại /HearLockHolmes/; dev local vẫn ở /
  base: process.env.GITHUB_ACTIONS ? "/HearLockHolmes/" : "/",
  plugins: [react(), tailwindcss()],
});
