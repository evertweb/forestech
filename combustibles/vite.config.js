import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/combustibles/',
  build: {
    outDir: '../public/combustibles',
    emptyOutDir: true
  },
  server: {
    port: 5174 // Puerto diferente al de alimentación (5173)
  }
})
