import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const coreAlias = fileURLToPath(new URL("../template/src", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@closeloop/core": coreAlias },
  },
  server: { port: 5173 },
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
});
