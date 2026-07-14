import { defineConfig } from 'vitest/config'
import path from 'node:path'
export default defineConfig({
  test: { environment: 'jsdom', globals: true, include: ['tests/unit/**/*.test.{ts,tsx}', 'tests/integration/**/*.test.{ts,tsx}'], setupFiles: ['./tests/setup.ts'] },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
})
