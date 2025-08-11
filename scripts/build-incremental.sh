#!/bin/bash
# scripts/build-incremental.sh
# Build incremental inteligente - solo construye las apps que han cambiado

set -e

echo "🔍 Analizando cambios desde el último deploy..."

# Obtener el último commit que se deployó (usando tag o archivo de tracking)
LAST_DEPLOY_COMMIT=$(git tag -l "deploy-*" --sort=-version:refname | head -n 1 | xargs -I {} git rev-list -n 1 {})

if [ -z "$LAST_DEPLOY_COMMIT" ]; then
    echo "⚠️ No se encontró deploy anterior, construyendo todo..."
    npm run build:all
    exit 0
fi

echo "📋 Último deploy: $LAST_DEPLOY_COMMIT"
echo "📋 Commit actual: $(git rev-parse HEAD)"

# Verificar cambios en cada app
ALIMENTACION_CHANGED=false
COMBUSTIBLES_CHANGED=false
SHARED_CHANGED=false

# Verificar cambios en alimentacion/
if git diff --name-only $LAST_DEPLOY_COMMIT..HEAD | grep -E "^alimentacion/|^shared/" > /dev/null; then
    ALIMENTACION_CHANGED=true
fi

# Verificar cambios en combustibles/
if git diff --name-only $LAST_DEPLOY_COMMIT..HEAD | grep -E "^combustibles/|^shared/" > /dev/null; then
    COMBUSTIBLES_CHANGED=true
fi

# Si shared/ cambió, rebuild ambas apps
if git diff --name-only $LAST_DEPLOY_COMMIT..HEAD | grep "^shared/" > /dev/null; then
    SHARED_CHANGED=true
    ALIMENTACION_CHANGED=true
    COMBUSTIBLES_CHANGED=true
    echo "🔄 Cambios en shared/ detectados - rebuilding ambas apps"
fi

# Build selectivo
if [ "$ALIMENTACION_CHANGED" = true ]; then
    echo "🔨 Construyendo alimentacion (cambios detectados)..."
    npm run build:alimentacion
else
    echo "✅ Alimentacion sin cambios - skipping build"
fi

if [ "$COMBUSTIBLES_CHANGED" = true ]; then
    echo "🔨 Construyendo combustibles (cambios detectados)..."
    npm run build:combustibles
else
    echo "✅ Combustibles sin cambios - skipping build"
fi

if [ "$ALIMENTACION_CHANGED" = false ] && [ "$COMBUSTIBLES_CHANGED" = false ]; then
    echo "🎉 No hay cambios de código - no se requiere build"
    exit 0
fi

echo "✅ Build incremental completado"
