#!/bin/bash
# scripts/clean-for-deploy.sh
# Limpiar archivos innecesarios antes del deploy para máxima velocidad

echo "🧹 Limpiando archivos para deploy optimizado..."

# Remover archivos de desarrollo del public/
find public/ -name "*.map" -delete 2>/dev/null || true
find public/ -name "*.md" -delete 2>/dev/null || true
find public/ -name "package.json" -delete 2>/dev/null || true

# Optimizar imágenes si está disponible
if command -v optipng >/dev/null 2>&1; then
    echo "🖼️ Optimizando imágenes PNG..."
    find public/ -name "*.png" -exec optipng -quiet {} \; 2>/dev/null || true
fi

# Comprimir archivos estáticos grandes
if command -v gzip >/dev/null 2>&1; then
    echo "📦 Pre-comprimiendo archivos grandes..."
    find public/ -name "*.js" -size +10k -exec gzip -k9 {} \; 2>/dev/null || true
    find public/ -name "*.css" -size +5k -exec gzip -k9 {} \; 2>/dev/null || true
fi

echo "✅ Limpieza completada"
