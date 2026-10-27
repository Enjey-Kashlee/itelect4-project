import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // <-- NEW

export default defineConfig({
  plugins: [react(), tailwindcss()], // <-- tailwindcss() is NEW
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    env: { VITE_API_URL: "http://localhost:4000" },
    restoreMocks: true,
  },
});
