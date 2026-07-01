import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Repo name for GitHub Pages: https://<user>.github.io/<repo>/
// Override via VITE_BASE (e.g. "/") if you later add a custom domain.
const PROD_BASE = process.env.VITE_BASE || "/portofolio-website/";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? PROD_BASE : "/",
  server: {
    port: 5173,
  },
}));
