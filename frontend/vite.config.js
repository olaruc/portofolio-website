import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Site is served from the custom domain cristianediting.com at the root.
// If you ever go back to https://<user>.github.io/<repo>/, set VITE_BASE
// or change this to "/portofolio-website/".
const PROD_BASE = process.env.VITE_BASE || "/";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? PROD_BASE : "/",
  server: {
    port: 5173,
  },
}));
