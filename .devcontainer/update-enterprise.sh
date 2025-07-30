#!/bin/bash

# 🔄 Update Enterprise - Actualización incremental para Codespaces
set -e

echo "🔄 Actualizando entorno enterprise..."

WORKSPACE_DIR="/workspaces/forestech"
cd "$WORKSPACE_DIR"

# 🔍 Verificar cambios en package.json
echo "🔍 Verificando cambios en dependencias..."

update_if_needed() {
    local app_dir="$1"
    local app_name="$2"
    
    if [ -d "$app_dir" ] && [ -f "$app_dir/package.json" ]; then
        # Verificar si package.json es más reciente que node_modules
        if [ "$app_dir/package.json" -nt "$app_dir/node_modules" ] || [ ! -d "$app_dir/node_modules" ]; then
            echo "📦 Actualizando $app_name..."
            cd "$app_dir"
            npm ci --prefer-offline --no-audit --progress=false
            echo "✅ $app_name actualizado"
            cd ..
            return 0
        else
            echo "✅ $app_name: dependencias actualizadas"
            return 1
        fi
    fi
}

# Actualizar apps si es necesario
UPDATED_COMBUSTIBLES=false
UPDATED_ALIMENTACION=false

if update_if_needed "combustibles" "Combustibles"; then
    UPDATED_COMBUSTIBLES=true
fi

if update_if_needed "alimentacion" "Alimentación"; then
    UPDATED_ALIMENTACION=true
fi

# 🌍 Actualizar herramientas globales si han pasado más de 7 días
GLOBAL_UPDATE_FILE=".devcontainer/.last-global-update"
CURRENT_DATE=$(date +%s)
WEEK_SECONDS=604800  # 7 días en segundos

if [ -f "$GLOBAL_UPDATE_FILE" ]; then
    LAST_UPDATE=$(cat "$GLOBAL_UPDATE_FILE")
    TIME_DIFF=$((CURRENT_DATE - LAST_UPDATE))
    
    if [ $TIME_DIFF -gt $WEEK_SECONDS ]; then
        echo "🌍 Actualizando herramientas globales (>7 días)..."
        npm update -g firebase-tools @anthropic-ai/claude-code @google/gemini-cli --prefer-offline
        echo "$CURRENT_DATE" > "$GLOBAL_UPDATE_FILE"
        echo "✅ Herramientas globales actualizadas"
    else
        echo "✅ Herramientas globales: actualizadas hace $(((TIME_DIFF / 86400))) días"
    fi
else
    echo "$CURRENT_DATE" > "$GLOBAL_UPDATE_FILE"
fi

# 🔄 Limpiar caches si se actualizó algo
if [ "$UPDATED_COMBUSTIBLES" = true ] || [ "$UPDATED_ALIMENTACION" = true ]; then
    echo "🧹 Limpiando caches obsoletos..."
    npm cache clean --force --silent
fi

# 🔧 Verificar configuración
echo "🔧 Verificando configuración enterprise..."

# Verificar PATH
if ! echo "$PATH" | grep -q ".npm-global/bin"; then
    echo "⚠️  Actualizando PATH..."
    export PATH="$WORKSPACE_DIR/.npm-global/bin:$PATH"
fi

# Verificar MCP config
if [ ! -f ".mcp.json" ]; then
    echo "⚠️  Recreando configuración MCP..."
    bash .devcontainer/setup-enterprise.sh --mcp-only
fi

echo ""
echo "✅ Actualización enterprise completada"
echo "⏱️ $(date)"