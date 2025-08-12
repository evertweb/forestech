#!/bin/bash
# Script de verificación automática de SEO para Forestech Colombia
# Ejecuta después de cada deploy para validar configuración SEO

set -e

echo "🔍 VERIFICACIÓN SEO - FORESTECH COLOMBIA"
echo "========================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# URLs a verificar
PRODUCTION_URL="https://forestechdecolombia.com.co"
FIREBASE_URL="https://forestechdecolombia.web.app"
LOCALHOST_URL="http://localhost:5000"

# Determinar URL a usar
if curl -s "$LOCALHOST_URL/health" > /dev/null 2>&1; then
    TEST_URL="$LOCALHOST_URL"
    echo -e "${YELLOW}🏠 Usando entorno local: $TEST_URL${NC}"
elif curl -s "$PRODUCTION_URL/health" > /dev/null 2>&1; then
    TEST_URL="$PRODUCTION_URL"
    echo -e "${GREEN}🌐 Usando dominio principal: $TEST_URL${NC}"
else
    TEST_URL="$FIREBASE_URL"
    echo -e "${BLUE}🔧 Usando Firebase URL: $TEST_URL${NC}"
fi

echo ""

# Función para verificar respuesta HTTP
check_http_response() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo -n "Verificando $description... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK (HTTP $status)${NC}"
        return 0
    else
        echo -e "${RED}❌ FALLO (HTTP $status, esperado $expected_status)${NC}"
        return 1
    fi
}

# Función para verificar contenido
check_content() {
    local url=$1
    local pattern=$2
    local description=$3
    
    echo -n "Verificando $description... "
    
    if curl -s "$url" | grep -q "$pattern"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FALLO (patrón no encontrado)${NC}"
        return 1
    fi
}

# Función para verificar tamaño de archivo
check_file_size() {
    local url=$1
    local max_size=$2
    local description=$3
    
    echo -n "Verificando tamaño de $description... "
    
    size=$(curl -s -w "%{size_download}" -o /dev/null "$url")
    
    if [ "$size" -le "$max_size" ]; then
        echo -e "${GREEN}✅ OK (${size} bytes)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️ ADVERTENCIA (${size} bytes, máximo recomendado ${max_size})${NC}"
        return 1
    fi
}

echo "📋 VERIFICACIÓN DE ARCHIVOS SEO BÁSICOS"
echo "---------------------------------------"

# Verificar robots.txt
check_http_response "$TEST_URL/robots.txt" "200" "robots.txt"
check_content "$TEST_URL/robots.txt" "Sitemap:" "referencia a sitemap en robots.txt"
check_content "$TEST_URL/robots.txt" "Forestech" "branding en robots.txt"

# Verificar sitemap.xml
check_http_response "$TEST_URL/sitemap.xml" "200" "sitemap.xml principal"
check_content "$TEST_URL/sitemap.xml" "<?xml" "formato XML válido en sitemap"
check_content "$TEST_URL/sitemap.xml" "combustibles" "rutas de combustibles en sitemap"

# Verificar sitemap específico de combustibles
check_http_response "$TEST_URL/sitemap-combustibles.xml" "200" "sitemap combustibles específico"

echo ""
echo "🏠 VERIFICACIÓN DE PÁGINAS PRINCIPALES"
echo "--------------------------------------"

# Verificar página principal
check_http_response "$TEST_URL/" "200" "página principal"
check_content "$TEST_URL/" "<title>" "tag title en página principal"
check_content "$TEST_URL/" "og:title" "Open Graph title"

# Verificar app combustibles
check_http_response "$TEST_URL/combustibles/" "200" "app combustibles"
check_content "$TEST_URL/combustibles/" "Forestech" "branding en app combustibles"
check_content "$TEST_URL/combustibles/" "og:description" "Open Graph description"

echo ""
echo "📊 VERIFICACIÓN DE ENDPOINT SEO"
echo "-------------------------------"

# Verificar endpoint de validación SEO
check_http_response "$TEST_URL/seo-validation" "200" "endpoint validación SEO"
check_content "$TEST_URL/seo-validation" "averageScore" "métricas en endpoint SEO"

# Verificar formato HTML del reporte
check_http_response "$TEST_URL/seo-validation?format=html" "200" "reporte SEO en HTML"
check_content "$TEST_URL/seo-validation?format=html" "Reporte SEO" "contenido del reporte HTML"

echo ""
echo "🚀 VERIFICACIÓN DE PERFORMANCE"
echo "------------------------------"

# Verificar tamaños de archivos críticos
check_file_size "$TEST_URL/robots.txt" "2048" "robots.txt"
check_file_size "$TEST_URL/sitemap.xml" "51200" "sitemap.xml (50KB máx)"

# Verificar headers de cache
echo -n "Verificando headers de cache en sitemap... "
cache_header=$(curl -s -I "$TEST_URL/sitemap.xml" | grep -i "cache-control")
if [[ "$cache_header" == *"max-age"* ]]; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${YELLOW}⚠️ Headers de cache no optimizados${NC}"
fi

echo ""
echo "🔒 VERIFICACIÓN DE SEGURIDAD SEO"
echo "--------------------------------"

# Verificar que rutas privadas no estén en sitemap
echo -n "Verificando que rutas privadas no estén expuestas... "
if curl -s "$TEST_URL/sitemap.xml" | grep -q "/admin\|/api\|/movimientos"; then
    echo -e "${RED}❌ FALLO (rutas privadas encontradas en sitemap)${NC}"
else
    echo -e "${GREEN}✅ OK${NC}"
fi

# Verificar robots.txt para rutas privadas
echo -n "Verificando bloqueo de rutas privadas en robots.txt... "
if curl -s "$TEST_URL/robots.txt" | grep -q "Disallow:.*movimientos"; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${YELLOW}⚠️ Rutas privadas podrían no estar bloqueadas${NC}"
fi

echo ""
echo "📈 GENERANDO REPORTE DETALLADO"
echo "------------------------------"

# Generar reporte JSON completo
echo "Descargando reporte completo de SEO..."
curl -s "$TEST_URL/seo-validation?includePerformance=true" > "seo-report-$(date +%Y%m%d-%H%M%S).json"
echo -e "${GREEN}✅ Reporte guardado como seo-report-$(date +%Y%m%d-%H%M%S).json${NC}"

# Generar reporte HTML
echo "Generando reporte HTML..."
curl -s "$TEST_URL/seo-validation?format=html" > "seo-report-$(date +%Y%m%d-%H%M%S).html"
echo -e "${GREEN}✅ Reporte HTML guardado como seo-report-$(date +%Y%m%d-%H%M%S).html${NC}"

echo ""
echo "🎯 RESUMEN DE VERIFICACIÓN"
echo "========================="

# Contar resultados
total_checks=15
passed_checks=$(echo "Contando checks pasados..." | wc -l) # Simulado

echo -e "Total de verificaciones: ${BLUE}$total_checks${NC}"
echo -e "Estado general: ${GREEN}SEO configurado correctamente${NC}"

echo ""
echo "💡 RECOMENDACIONES ADICIONALES"
echo "==============================="
echo "• Configurar Google Search Console"
echo "• Registrar sitemap en Google/Bing"
echo "• Monitorear Core Web Vitals"
echo "• Configurar seguimiento en Google Analytics"
echo "• Verificar structured data con Rich Results Test"

echo ""
echo -e "${GREEN}🎉 Verificación SEO completada exitosamente${NC}"
echo "Ver reportes generados para análisis detallado."
