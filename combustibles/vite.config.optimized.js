import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'stats.html',
      open: false, // No abrir automáticamente
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  base: '/combustibles/',
  cacheDir: 'node_modules/.vite',
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    force: false,
  },
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
    rollupOptions: {
      treeshake: 'recommended',
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          // Estrategia agresiva para chunks pequeños
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('firebase/app')) {
              return 'firebase-core';
            }
            if (id.includes('firebase/auth')) {
              return 'firebase-auth';
            }
            if (id.includes('firebase/firestore') || id.includes('firebase/storage')) {
              return 'firebase-db';
            }
            if (id.includes('chart.js') || id.includes('react-chartjs')) {
              return 'charts';
            }
            // Resto de node_modules en chunk vendor
            return 'vendor-other';
          }

          // Separar rutas principales en chunks independientes
          if (id.includes('src/components/Admin/AdminMain')) {
            return 'admin';
          }
          if (id.includes('src/components/Reports/ReportsMain')) {
            return 'reports';
          }
          if (id.includes('src/components/Movements/MovementsMain')) {
            return 'movements';
          }
          if (id.includes('src/components/Vehicles/VehiclesMain')) {
            return 'vehicles';
          }
          if (id.includes('src/components/Inventory/InventoryMain')) {
            return 'inventory';
          }
          if (id.includes('src/components/Products/ProductsMain')) {
            return 'products';
          }
          if (id.includes('src/components/Suppliers/SuppliersMain')) {
            return 'suppliers';
          }
          if (id.includes('src/components/Maintenance/MaintenanceMain')) {
            return 'maintenance';
          }
        },
      },
    },
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 200, // Más estricto - 200KB
    sourcemap: false,
    reportCompressedSize: false,
    cssCodeSplit: true,
    cssMinify: 'esbuild',
  },
  server: {
    port: 5174,
  },
});
