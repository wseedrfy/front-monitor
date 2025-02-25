import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MonitorSDK',
      fileName: 'monitor-sdk'
    },
    rollupOptions: {
      external: ['react', 'vue'],
      output: {
        globals: {
          react: 'React',
          vue: 'Vue'
        }
      }
    }
  }
}) 