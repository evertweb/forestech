#!/bin/bash
# dev-codespace.sh - Script para ejecutar la app en Codespaces con variables de entorno

echo "🚀 Iniciando aplicación Combustibles en Codespace..."

# Detectar si estamos en Codespace
if [ -n "$CODESPACE_NAME" ]; then
    echo "📱 Detectado entorno Codespace: $CODESPACE_NAME"
    ENVIRONMENT="codespace"
else
    echo "💻 Ejecutándose en entorno local"
    ENVIRONMENT="local"
fi

# Cargar variables de entorno desde el archivo más apropiado
ENV_FILES=(".env.local" ".env.development" ".env")

for env_file in "${ENV_FILES[@]}"; do
    if [ -f "$env_file" ]; then
        echo "📁 Cargando variables desde: $env_file"
        export $(cat $env_file | grep -v '^#' | grep -v '^$' | xargs)
        break
    fi
done

# Verificar variables críticas
echo "🔍 Verificando variables de Firebase..."

if [ -z "$VITE_FIREBASE_API_KEY" ]; then
    echo "❌ VITE_FIREBASE_API_KEY no está definida"
    MISSING_VARS=1
else
    echo "✅ VITE_FIREBASE_API_KEY: Configurada"
fi

if [ -z "$VITE_FIREBASE_APP_ID" ]; then
    echo "❌ VITE_FIREBASE_APP_ID no está definida"
    MISSING_VARS=1
else
    echo "✅ VITE_FIREBASE_APP_ID: Configurada"
fi

if [ "$MISSING_VARS" = "1" ]; then
    echo ""
    echo "⚠️  Faltan variables críticas de Firebase."
    echo "   Asegúrate de tener un archivo .env.local con las variables necesarias."
    echo "   Puedes copiar .env.example como punto de partida:"
    echo "   cp .env.example .env.local"
    echo ""
    exit 1
fi

echo ""
echo "✅ Todas las variables están configuradas correctamente"
echo ""

# Ejecutar Vite con configuración específica para Codespaces
if [ "$ENVIRONMENT" = "codespace" ]; then
    echo "🌐 Iniciando servidor con configuración de Codespace..."
    vite --host 0.0.0.0 --port 5174
else
    echo "🏠 Iniciando servidor local..."
    vite
fi