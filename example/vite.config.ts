import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-dynamic-form-builder": path.resolve(__dirname, "../src"),
    },
  },
  server: {
    port: 2025,
    open: true,
    host: "localhost", // Explicitly set to localhost
    strictPort: true, // Don't try other ports if 2025 is taken
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [...configDefaults.exclude],
  },
});
