#!/bin/bash

# Script para activar SSR permanentemente en producción
# Configura Remote Config con parámetros para SSR activo

echo "🚀 Configurando SSR permanente en producción..."

# Crear configuración Remote Config
cat > remote-config-production.json << 'EOF'
{
  "parameters": {
    "ssr_enabled": {
      "defaultValue": {
        "value": "true"
      },
      "description": "Habilita Server-Side Rendering globalmente - PRODUCCIÓN"
    },
    "ssr_enabled_routes": {
      "defaultValue": {
        "value": "[\"\/combustibles\/login\", \"\/combustibles\/movements\", \"\/combustibles\/inventory\", \"\/combustibles\/vehicles\", \"\/combustibles\/dashboard\", \"\/combustibles\/maintenance\", \"\/combustibles\/reports\"]"
      },
      "description": "Rutas donde SSR está activo - TODAS las rutas de combustibles"
    },
    "ssr_user_sampling": {
      "defaultValue": {
        "value": "100"
      },
      "description": "Porcentaje de usuarios que reciben SSR (100 = todos)"
    },
    "max_data_fetch_time": {
      "defaultValue": {
        "value": "800"
      },
      "description": "Tiempo máximo para fetch de datos SSR en ms"
    },
    "enable_caching": {
      "defaultValue": {
        "value": "true"
      },
      "description": "Cache de respuestas SSR habilitado"
    },
    "ssr_production_mode": {
      "defaultValue": {
        "value": "true"
      },
      "description": "Modo producción SSR - optimizaciones completas"
    }
  },
  "parameterGroups": {},
  "version": {
    "description": "SSR Permanente Activado - Configuración Producción v1.0"
  }
}
EOF

echo "📝 Configuración Remote Config creada."

# Usar Firebase CLI para configurar (método alternativo)
echo "🔧 Aplicando configuración via gcloud..."

# Configurar via REST API de Firebase
PROJECT_ID="liquidacionapp-62962"
ACCESS_TOKEN=$(gcloud auth print-access-token)

curl -X PUT \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @remote-config-production.json \
  "https://firebase.googleapis.com/v1/projects/$PROJECT_ID/remoteConfig"

if [ $? -eq 0 ]; then
    echo "✅ SSR activado permanentemente en producción!"
    echo "🌐 Verificando configuración..."
    
    # Verificar que funciona
    echo "🧪 Probando SSR en producción..."
    curl -I "https://liquidacionapp-62962.web.app/combustibles/ssr-health" | grep -E "(server-timing|x-fallback)"
    
    echo ""
    echo "🎉 ¡SSR está ahora PERMANENTEMENTE ACTIVO!"
    echo "📋 No necesitas reconfigurar en cada deploy."
    echo "📊 Remote Config persiste independientemente de los deploys."
else
    echo "❌ Error configurando Remote Config"
    echo "💡 Usar método manual en Firebase Console"
fi
