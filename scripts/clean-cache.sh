#!/bin/bash
# scripts/clean-cache.sh
# Limpia todos los caches para un build completamente limpio

echo "🧹 Limpiando caches de build..."

# Limpiar cache de Vite
echo "🗑️ Limpiando cache de Vite..."
rm -rf combustibles/node_modules/.vite/
rm -rf alimentacion/node_modules/.vite/
rm -rf node_modules/.vite/

# Limpiar outputs de build
echo "🗑️ Limpiando outputs de build..."
rm -rf public/combustibles/
rm -rf public/alimentacion/

# Limpiar cache de npm
echo "🗑️ Limpiando cache de npm..."
npm cache clean --force

echo "✅ Cache limpiado - próximo build será completamente limpio"
