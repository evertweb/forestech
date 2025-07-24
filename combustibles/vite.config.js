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
    emptyOutDir: true,
    // 🚀 Build optimization for GitHub Actions
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries (React ecosystem)
          vendor: ['react', 'react-dom'],
          // UI components and icons
          ui: ['react-aria-components', 'lucide-react'],
          // Charts and data visualization
          charts: ['chart.js', 'react-chartjs-2'],
          // Firebase and utilities
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          // Utils and smaller libraries
          utils: ['classnames', 'date-fns']
        }
      }
    },
    // Performance optimizations
    target: 'esnext',
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    // Build speed optimizations
    sourcemap: false, // Disable sourcemaps for production builds
    // Reduce bundle size
    reportCompressedSize: false,
    // Optimize CSS
    cssCodeSplit: true
  },
  server: {
    port: 5174 // Puerto diferente al de alimentación (5173)
  }
});
