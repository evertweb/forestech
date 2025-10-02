#!/bin/bash
# scripts/performance-budget-check.sh
# Verificación automática de performance budgets desde performance-budget.json

set -e

echo "📊 Iniciando verificación de Performance Budget..."

# Verificar que existe jq
if ! command -v jq &> /dev/null; then
    echo "❌ jq no está instalado. Instálalo con: sudo apt-get install jq"
    exit 1
fi

# Cargar budgets desde JSON
BUDGET_FILE="performance-budget.json"
if [ ! -f "$BUDGET_FILE" ]; then
    echo "❌ Archivo $BUDGET_FILE no encontrado"
    exit 1
fi

# Parsear límites desde JSON (convertir de kb a KB)
BUNDLE_SIZE_LIMIT_KB=$(jq -r '.apps.combustibles.total.maxSize' "$BUDGET_FILE" | sed 's/kb//')
CHUNK_VENDOR_LIMIT_KB=$(jq -r '.apps.combustibles.chunks.vendor.maxSize' "$BUDGET_FILE" | sed 's/kb//')

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Budget cargado: Total max ${BUNDLE_SIZE_LIMIT_KB}KB${NC}"

# Función para verificar tamaño de archivos
check_bundle_size() {
    echo "🔍 Verificando tamaño de bundles..."
    
    if [ ! -d "public/combustibles" ]; then
        echo -e "${RED}❌ Directorio public/combustibles no encontrado${NC}"
        exit 1
    fi
    
    # Verificar tamaño total del bundle
    TOTAL_SIZE_KB=$(du -sk public/combustibles | cut -f1)
    echo "📦 Tamaño total bundle: ${TOTAL_SIZE_KB}KB"
    
    if [ "$TOTAL_SIZE_KB" -gt "$BUNDLE_SIZE_LIMIT_KB" ]; then
        echo -e "${RED}❌ Bundle size excedido: ${TOTAL_SIZE_KB}KB > ${BUNDLE_SIZE_LIMIT_KB}KB${NC}"
        echo -e "${YELLOW}💡 Sugerencias:${NC}"
        echo "  • Implementar code splitting"
        echo "  • Optimizar imágenes"
        echo "  • Remover dependencias no utilizadas"
        echo "  • Usar dynamic imports para rutas"
        return 1
    else
        echo -e "${GREEN}✅ Bundle size OK: ${TOTAL_SIZE_KB}KB <= ${BUNDLE_SIZE_LIMIT_KB}KB${NC}"
    fi
}

# Función para verificar chunks individuales
check_chunk_sizes() {
    echo "🔍 Verificando tamaño de chunks individuales..."
    
    # Buscar archivos JS/CSS grandes
    find public/combustibles -name "*.js" -o -name "*.css" | while read file; do
        SIZE_KB=$(du -k "$file" | cut -f1)
        FILENAME=$(basename "$file")
        
        if [ "$SIZE_KB" -gt "$CHUNK_SIZE_LIMIT_KB" ]; then
            echo -e "${RED}❌ Chunk grande: $FILENAME (${SIZE_KB}KB > ${CHUNK_SIZE_LIMIT_KB}KB)${NC}"
            echo -e "${YELLOW}💡 Considera dividir este chunk o lazy loading${NC}"
        else
            echo -e "${GREEN}✅ $FILENAME: ${SIZE_KB}KB${NC}"
        fi
    done
}

# Función para verificar imágenes
check_image_sizes() {
    echo "🔍 Verificando tamaño de imágenes..."
    
    find public/combustibles -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.svg" | while read file; do
        SIZE_KB=$(du -k "$file" | cut -f1)
        FILENAME=$(basename "$file")
        
        if [ "$SIZE_KB" -gt "$IMAGE_SIZE_LIMIT_KB" ]; then
            echo -e "${RED}❌ Imagen grande: $FILENAME (${SIZE_KB}KB > ${IMAGE_SIZE_LIMIT_KB}KB)${NC}"
            echo -e "${YELLOW}💡 Optimiza esta imagen o usa formatos modernos (WebP)${NC}"
        else
            echo -e "${GREEN}✅ $FILENAME: ${SIZE_KB}KB${NC}"
        fi
    done
}

# Función para analizar estructura de archivos
analyze_file_structure() {
    echo "🔍 Analizando estructura de archivos..."
    
    TOTAL_FILES=$(find public/combustibles -type f | wc -l)
    JS_FILES=$(find public/combustibles -name "*.js" | wc -l)
    CSS_FILES=$(find public/combustibles -name "*.css" | wc -l)
    IMAGE_FILES=$(find public/combustibles -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.svg" | wc -l)
    
    echo "📊 Estadísticas de archivos:"
    echo "  • Total archivos: $TOTAL_FILES"
    echo "  • Archivos JS: $JS_FILES"
    echo "  • Archivos CSS: $CSS_FILES"
    echo "  • Imágenes: $IMAGE_FILES"
    
    if [ "$TOTAL_FILES" -gt "$TOTAL_REQUESTS_LIMIT" ]; then
        echo -e "${YELLOW}⚠️ Muchos archivos ($TOTAL_FILES > $TOTAL_REQUESTS_LIMIT)${NC}"
        echo -e "${YELLOW}💡 Considera bundling o concatenación${NC}"
    fi
}

# Función para generar reporte detallado
generate_report() {
    echo "📝 Generando reporte detallado..."
    
    REPORT_FILE="performance-budget-report.md"
    
    cat > "$REPORT_FILE" << EOF
# 📊 Performance Budget Report

**Fecha**: $(date)
**Commit**: $(git rev-parse --short HEAD)
**Branch**: $(git branch --show-current)

## 📦 Bundle Analysis

| Métrica | Valor | Límite | Status |
|---------|-------|--------|--------|
| Bundle Total | ${TOTAL_SIZE_KB}KB | ${BUNDLE_SIZE_LIMIT_KB}KB | $([ "$TOTAL_SIZE_KB" -le "$BUNDLE_SIZE_LIMIT_KB" ] && echo "✅ PASS" || echo "❌ FAIL") |
| Total Archivos | $TOTAL_FILES | $TOTAL_REQUESTS_LIMIT | $([ "$TOTAL_FILES" -le "$TOTAL_REQUESTS_LIMIT" ] && echo "✅ PASS" || echo "⚠️ WARN") |

## 🎯 Recomendaciones

EOF

    if [ "$TOTAL_SIZE_KB" -gt "$BUNDLE_SIZE_LIMIT_KB" ]; then
        cat >> "$REPORT_FILE" << EOF
### 🚨 Bundle Size Excedido

- **Problema**: Bundle total de ${TOTAL_SIZE_KB}KB excede límite de ${BUNDLE_SIZE_LIMIT_KB}KB
- **Impacto**: Carga inicial más lenta, especialmente en conexiones móviles
- **Soluciones**:
  - Implementar lazy loading para rutas no críticas
  - Analizar dependencias con \`npm run analyze\`
  - Optimizar imágenes y assets
  - Usar tree shaking más agresivo

EOF
    fi
    
    echo "📄 Reporte guardado en: $REPORT_FILE"
}

# Ejecutar todas las verificaciones
main() {
    echo "🚀 Performance Budget Check v1.0"
    echo "======================================="
    
    local overall_status=0
    
    check_bundle_size || overall_status=1
    echo ""
    
    check_chunk_sizes
    echo ""
    
    check_image_sizes
    echo ""
    
    analyze_file_structure
    echo ""
    
    generate_report
    echo ""
    
    if [ $overall_status -eq 0 ]; then
        echo -e "${GREEN}🎉 Performance Budget: PASSED${NC}"
        echo -e "${GREEN}✅ Todos los límites están dentro del budget${NC}"
    else
        echo -e "${RED}❌ Performance Budget: FAILED${NC}"
        echo -e "${RED}🚨 Algunos límites fueron excedidos${NC}"
        echo ""
        echo -e "${YELLOW}🔧 Para optimizar el bundle:${NC}"
        echo "  npm run analyze        # Analizar dependencias"
        echo "  npm run build:analyze  # Bundle analyzer"
        echo "  npm run optimize       # Optimización automática"
    fi
    
    exit $overall_status
}

# Ejecutar script principal
main "$@"
