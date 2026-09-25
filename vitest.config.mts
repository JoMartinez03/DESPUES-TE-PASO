import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    setupFiles: ["tests/setup/database.ts"],
    testTimeout: 20_000,
    hookTimeout: 30_000,
    fileParallelism: process.env.TEST_DATABASE_URL ? false : true,
  },
})
