
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
  plugins: [
    react(),
    visualizer({
      // Plugin para analizar el tamaño del bundle
      filename: 'stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  base: '/',

  // 🔧 PROXY PARA FIREBASE WEB AUTHN API - CORREGIDO PARA BASE PATH
  server: {
    port: 5174, // Puerto diferente al de alimentación (5173)
    host: process.env.CODESPACE_NAME ? '0.0.0.0' : undefined, // Bind to all interfaces in Codespaces
    proxy: {
      // Proxy único para Firebase Web Authn API
      '^/firebase-web-authn-api': {
        target: 'https://us-east1-liquidacionapp-62962.cloudfunctions.net',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/firebase-web-authn-api/, '/ext-firebase-web-authn-api'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔗 Proxying Web Authn request:', req.url);
          });
          proxy.on('error', (err, req, res) => {
            console.error('❌ Proxy error:', err);
          });
        }
      }
    }
  },

  // 🚀 Cache optimizations para builds incrementales
  cacheDir: 'node_modules/.vite', // Cache de Vite persistente
  optimizeDeps: {
    // Pre-bundle dependencies para builds más rápidos
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage',
    ],
    // Cache persistente de dependencies
    force: false, // Solo re-build dependencies si cambian
  },
  // Configuración de pruebas con Vitest (integración/UI)
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.jsx',
    globals: true,
    css: true,
    exclude: ['tests-e2e/**', 'node_modules/**', 'dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
    },
  },
  build: {
    outDir: '../public/combustibles',
    emptyOutDir: true,
    // 🚀 Build cache para builds incrementales
    rollupOptions: {
      treeshake: 'recommended', // Tree-shaking agresivo para LCP
      // Configuración de external para evitar bundling de módulos faltantes
      external: (id) => {
        // No externalizar nada en producción para evitar errores de carga
        return false;
      },
      output: {
        // Chunk estable para mejor cache del navegador
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // 🚀 SPRINT 4 - DAY 2: Optimized chunk splitting strategy
        manualChunks: (id) => {
          // React core + React-DOM + Scheduler (DEBEN estar juntos)
          // React-DOM depende de react/jsx-runtime y scheduler
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          
          // React Router (crítico para routing)
          if (id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/react-router/') ||
              id.includes('node_modules/@remix-run/router/')) {
            return 'vendor-router';
          }
          
          // Framer Motion (separado para lazy loading)
          if (id.includes('node_modules/framer-motion/')) {
            return 'vendor-motion';
          }
          
          // Zustand (state management - separado para mejor cache)
          if (id.includes('node_modules/zustand/')) {
            return 'vendor-zustand';
          }
          
          // Firebase App (core - crítico)
          if (id.includes('firebase/app') || id.includes('@firebase/app')) {
            return 'vendor-firebase-core';
          }
          
          // Firebase Auth (separado - lazy load posible)
          if (id.includes('firebase/auth') || id.includes('@firebase/auth')) {
            return 'vendor-firebase-auth';
          }
          
          // Firebase Firestore + Storage (separado - lazy load posible)
          if (id.includes('firebase/firestore') || 
              id.includes('firebase/storage') ||
              id.includes('@firebase/firestore') ||
              id.includes('@firebase/storage')) {
            return 'vendor-firebase-db';
          }
          
          // Zustand stores (aplicación - mejor cache)
          if (id.includes('/src/stores/')) {
            return 'app-stores';
          }
          
          // Componentes de servicios (aplicación)
          if (id.includes('/src/services/')) {
            return 'app-services';
          }
          
          // Otros node_modules (vendor misc)
          if (id.includes('node_modules/')) {
            return 'vendor-other';
          }
        },
      },
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
    cssCodeSplit: true,
  },
  };
});
