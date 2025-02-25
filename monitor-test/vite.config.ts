import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true // 允许外部访问
  },
  resolve: {
    alias: {
      '@monitor/browser': resolve(__dirname, '../packages/browser/src/index.ts')
    }
  }
}) 