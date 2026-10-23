import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      // Allow server-only modules to be imported in Vitest without throwing.
      // The real server-only guard runs at Next.js build time; mocking it here
      // is safe because tests never run in a browser context.
      "server-only": path.resolve(import.meta.dirname, "./tests/__mocks__/server-only.ts"),
    },
  },
});
