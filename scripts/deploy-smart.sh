#!/bin/bash
# scripts/deploy-smart.sh
# Deploy inteligente - solo deploya los servicios que cambiaron

set -e

echo "🚀 Iniciando deploy inteligente..."

# Build incremental
./scripts/build-incremental.sh

# Obtener cambios desde último deploy
LAST_DEPLOY_COMMIT=$(git tag -l "deploy-*" --sort=-version:refname | head -n 1 | xargs -I {} git rev-list -n 1 {} 2>/dev/null || echo "")

if [ -z "$LAST_DEPLOY_COMMIT" ]; then
    echo "⚠️ Primer deploy - deployando todo..."
    firebase deploy
else
    # Verificar qué servicios necesitan deploy
    DEPLOY_HOSTING=false
    DEPLOY_FUNCTIONS=false
    DEPLOY_FIRESTORE=false
    DEPLOY_STORAGE=false

    # Verificar cambios que requieren deploy de hosting (apps React)
    if git diff --name-only $LAST_DEPLOY_COMMIT..HEAD | grep -E "^(alimentacion|combustibles|shared)/" > /dev/null; then
        DEPLOY_HOSTING=true
    fi

    # Verificar cambios en functions
    if git diff --name-only $LAST_DEPLOY_COMMIT..HEAD | grep "^functions/" > /dev/null; then
        DEPLOY_FUNCTIONS=true
    fi

    # Verificar cambios en reglas de Firestore
    if git diff --name-only $LAST_DEPLOY_COMMIT..HEAD | grep -E "firestore\.(rules|indexes\.json)" > /dev/null; then
        DEPLOY_FIRESTORE=true
    fi

    # Verificar cambios en reglas de Storage
    if git diff --name-only $LAST_DEPLOY_COMMIT..HEAD | grep "storage.rules" > /dev/null; then
        DEPLOY_STORAGE=true
    fi

    # Construir comando de deploy selectivo
    DEPLOY_CMD="firebase deploy"
    TARGETS=""

    if [ "$DEPLOY_HOSTING" = true ]; then
        TARGETS="$TARGETS hosting"
        echo "📦 Deploy hosting (apps React) requerido"
    fi

    if [ "$DEPLOY_FUNCTIONS" = true ]; then
        TARGETS="$TARGETS functions"
        echo "⚡ Deploy functions requerido"
    fi

    if [ "$DEPLOY_FIRESTORE" = true ]; then
        TARGETS="$TARGETS firestore"
        echo "🗄️ Deploy firestore requerido"
    fi

    if [ "$DEPLOY_STORAGE" = true ]; then
        TARGETS="$TARGETS storage"
        echo "📁 Deploy storage requerido"
    fi

    if [ -z "$TARGETS" ]; then
        echo "🎉 No hay cambios que requieran deploy"
        exit 0
    fi

    # Ejecutar deploy selectivo
    DEPLOY_CMD="$DEPLOY_CMD --only$(echo $TARGETS | tr ' ' ',')"
    echo "🚀 Ejecutando: $DEPLOY_CMD"
    eval $DEPLOY_CMD
fi

# Crear tag del deploy exitoso
DEPLOY_TAG="deploy-$(date +%Y%m%d-%H%M%S)"
git tag $DEPLOY_TAG
echo "✅ Deploy completado - tag: $DEPLOY_TAG"

echo "🎯 Para revertir este deploy: git checkout $DEPLOY_TAG"
