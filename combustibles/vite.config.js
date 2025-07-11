import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ // Plugin para analizar el tamaño del bundle
      filename: 'stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  base: '/combustibles/',
  build: {
    outDir: '../public/combustibles',
    emptyOutDir: true
  },
  server: {
    port: 5174 // Puerto diferente al de alimentación (5173)
  }
});
