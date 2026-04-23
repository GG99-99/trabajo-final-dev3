import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: resolve(__dirname, '../..'), // read root .env
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
