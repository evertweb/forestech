import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { dirname } from 'path' // Necesitamos importar 'path' de Node.js
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Le decimos a Vite que la base de la URL para los assets es /alimentacion/
  // Esto es CRUCIAL para que Firebase encuentre tus archivos CSS y JS.
  base: '/alimentacion/',

  build: {
    // Le decimos a Vite que la carpeta de salida para 'npm run build' está
    // un nivel arriba (../) y luego dentro de public/alimentacion.
    outDir: path.resolve(__dirname, '../public/alimentacion'),

    // Le decimos que limpie esa carpeta antes de cada build para no dejar archivos viejos.
    emptyOutDir: true,
  }
})