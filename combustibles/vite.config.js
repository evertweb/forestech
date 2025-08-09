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
    // 🚀 Build optimization for GitHub Actions + LCP crítico
    rollupOptions: {
      treeshake: 'recommended', // Tree-shaking agresivo para LCP
      output: {
        manualChunks: {
          // Vendor libraries (React ecosystem)  
          vendor: ['react', 'react-dom'],
          // UI components and icons
          ui: ['react-aria-components', 'lucide-react', '@untitledui/icons'],
          // Charts and data visualization
          charts: ['chart.js', 'react-chartjs-2'],
          // Firebase core (crítico para LCP - separar auth/firestore)
          'firebase-core': ['firebase/app'],
          'firebase-auth': ['firebase/auth'],
          'firebase-db': ['firebase/firestore', 'firebase/storage'],
          // Utils and smaller libraries (only installed ones)
          utils: ['clsx', 'tailwind-merge', 'xlsx']
        }
      }
    },
    // Performance optimizations
    target: 'esnext',
    minify: 'esbuild', // Use esbuild instead of terser (faster and no extra dependency)
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
