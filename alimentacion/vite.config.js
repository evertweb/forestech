import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { dirname } from 'path'; // Necesitamos importar 'path' de Node.js
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Le decimos a Vite que la base de la URL para los assets es /alimentacion/
  // Esto es CRUCIAL para que Firebase encuentre tus archivos CSS y JS.
  base: '/alimentacion/',

  // 🚀 Cache optimizations para builds incrementales
  cacheDir: 'node_modules/.vite', // Cache de Vite persistente
  optimizeDeps: {
    // Pre-bundle dependencies para builds más rápidos
    include: ['react', 'react-dom', 'react-router-dom'],
    // Cache persistente de dependencies
    force: false, // Solo re-build dependencies si cambian
  },

  build: {
    // Le decimos a Vite que la carpeta de salida para 'npm run build' está
    // un nivel arriba (../) y luego dentro de public/alimentacion.
    outDir: path.resolve(__dirname, '../public/alimentacion'),

    // Le decimos que limpie esa carpeta antes de cada build para no dejar archivos viejos.
    emptyOutDir: true,

    // 🚀 Optimizaciones de build
    target: 'esnext',
    minify: 'esbuild', // Más rápido que terser
    sourcemap: false, // Sin sourcemaps en producción
    reportCompressedSize: false, // Skip compression reporting para builds más rápidos
    rollupOptions: {
      // Cache para builds incrementales
      cache: {
        buildDependencies: {
          config: ['vite.config.js'],
        },
      },
      output: {
        // Chunks estables para mejor cache
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['html2canvas', 'dompurify'],
        },
      },
    },
  },
});
