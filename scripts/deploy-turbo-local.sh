#!/bin/bash
# scripts/deploy-turbo-local.sh
# Deploy local ultra-optimizado que replica la lógica de GitHub Actions

set -e

echo "🚀 FORESTECH TURBO DEPLOY LOCAL"
echo "================================"

# Configuración
CACHE_DIR=".cache-deploy"
LAST_BUILD_HASH_FILE="$CACHE_DIR/last-build-hash"

# Crear directorio de cache si no existe
mkdir -p "$CACHE_DIR"

# Función para calcular hash de archivos relevantes
calculate_build_hash() {
    find alimentacion combustibles shared -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.css" \) \
        -not -path "*/node_modules/*" \
        -not -path "*/dist/*" \
        -exec sha1sum {} \; | sha1sum | cut -d' ' -f1
}

# Calcular hash actual
CURRENT_HASH=$(calculate_build_hash)
echo "🔍 Hash actual del código: $CURRENT_HASH"

# Verificar si necesitamos rebuild
NEEDS_BUILD=true
if [ -f "$LAST_BUILD_HASH_FILE" ]; then
    LAST_HASH=$(cat "$LAST_BUILD_HASH_FILE")
    if [ "$CURRENT_HASH" = "$LAST_HASH" ]; then
        NEEDS_BUILD=false
        echo "✅ Código sin cambios desde último build - usando cache"
    else
        echo "🔄 Cambios detectados desde último build"
    fi
else
    echo "⚠️ Primer build - construyendo todo"
fi

# Verificar qué apps necesitan rebuild específico
BUILD_ALIMENTACION=false
BUILD_COMBUSTIBLES=false

if [ "$NEEDS_BUILD" = true ] || [ "$1" = "--force" ]; then
    echo "🔍 Analizando cambios específicos por app..."

    # Si es primer build o forzado, build todo
    if [ ! -f "$LAST_BUILD_HASH_FILE" ] || [ "$1" = "--force" ]; then
        BUILD_ALIMENTACION=true
        BUILD_COMBUSTIBLES=true
    else
        # Verificar cambios desde último commit
        if git diff --name-only HEAD~1 2>/dev/null | grep -E "^(alimentacion/|shared/)" > /dev/null; then
            BUILD_ALIMENTACION=true
        fi

        if git diff --name-only HEAD~1 2>/dev/null | grep -E "^(combustibles/|shared/)" > /dev/null; then
            BUILD_COMBUSTIBLES=true
        fi

        # Si shared cambió, rebuild ambas
        if git diff --name-only HEAD~1 2>/dev/null | grep "^shared/" > /dev/null; then
            BUILD_ALIMENTACION=true
            BUILD_COMBUSTIBLES=true
            echo "🔄 Cambios en shared/ - rebuilding ambas apps"
        fi
    fi
fi

echo "📊 Plan de build:"
echo "  🍽️ Alimentacion: $BUILD_ALIMENTACION"
echo "  ⛽ Combustibles: $BUILD_COMBUSTIBLES"

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo "📦 Instalando dependencias..."
    npm ci --prefer-offline --no-audit --no-fund
else
    echo "✅ Dependencias ya instaladas"
fi

# Build paralelo condicional
BUILD_PIDS=()

if [ "$BUILD_ALIMENTACION" = true ]; then
    echo "🍽️ Iniciando build de Alimentacion..."
    (
        echo "🔨 Building alimentacion..."
        npm run build:alimentacion
        echo "✅ Alimentacion build completed"
    ) &
    BUILD_PIDS+=($!)
fi

if [ "$BUILD_COMBUSTIBLES" = true ]; then
    echo "⛽ Iniciando build de Combustibles..."
    (
        echo "🔨 Building combustibles..."
        npm run build:combustibles
        echo "✅ Combustibles build completed"
    ) &
    BUILD_PIDS+=($!)
fi

# Esperar builds paralelos
if [ ${#BUILD_PIDS[@]} -gt 0 ]; then
    echo "⏳ Esperando builds paralelos..."
    for pid in "${BUILD_PIDS[@]}"; do
        wait $pid
    done
    echo "🎉 Todos los builds completados"

    # Guardar hash del build exitoso
    echo "$CURRENT_HASH" > "$LAST_BUILD_HASH_FILE"
else
    echo "🎯 No hay builds necesarios - usando cache"
fi

# Verificar outputs
echo "📁 Verificando outputs de build..."
if [ -d "public/alimentacion" ]; then
    echo "✅ Alimentacion: $(du -sh public/alimentacion/ | cut -f1)"
else
    echo "⚠️ Alimentacion build no encontrado"
fi

if [ -d "public/combustibles" ]; then
    echo "✅ Combustibles: $(du -sh public/combustibles/ | cut -f1)"
else
    echo "⚠️ Combustibles build no encontrado"
fi

# Deploy a Firebase
echo "🚀 Deployando a Firebase..."
START_TIME=$(date +%s)

# Solo hosting para máxima velocidad
firebase deploy --only hosting

END_TIME=$(date +%s)
DEPLOY_TIME=$((END_TIME - START_TIME))

echo "🎉 Deploy completado en ${DEPLOY_TIME}s"
echo "📊 Estadísticas:"
echo "  ⏱️ Tiempo total de deploy: ${DEPLOY_TIME}s"
echo "  🗄️ Cache utilizado: $([ "$NEEDS_BUILD" = false ] && echo "SÍ" || echo "NO")"
echo "  🔨 Apps rebuildeadas: $([ "$BUILD_ALIMENTACION" = true ] && echo -n "alimentacion "; [ "$BUILD_COMBUSTIBLES" = true ] && echo -n "combustibles")"

# Mostrar URLs
echo "🌐 URLs activas:"
echo "  🍽️ Alimentacion: https://forestechdecolombia.web.app/alimentacion/"
echo "  ⛽ Combustibles: https://forestechdecolombia.web.app/combustibles/"
