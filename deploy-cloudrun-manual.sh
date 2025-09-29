#!/bin/bash

# Deploy manual de Cloud Run desde local
# Usar cuando GitHub Actions no tiene permisos suficientes

echo "🚀 DEPLOY MANUAL DE CLOUD RUN"
echo "=============================="

# Verificar si está logueado en gcloud
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1 | grep -q "@"; then
    echo "❌ No estás logueado en gcloud"
    echo "💡 Ejecuta: gcloud auth login"
    exit 1
fi

CURRENT_USER=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n1)
echo "👤 Usuario actual: $CURRENT_USER"

# Configurar proyecto
PROJECT_ID="liquidacionapp-62962"
SERVICE_NAME="forestech-sql-service"
REGION="us-central1"

echo "📋 Configuración:"
echo "  - Proyecto: $PROJECT_ID"
echo "  - Servicio: $SERVICE_NAME"
echo "  - Región: $REGION"
echo ""

# Configurar proyecto activo
gcloud config set project $PROJECT_ID

# Cambiar al directorio functions
cd functions || {
    echo "❌ Directorio 'functions' no encontrado"
    exit 1
}

echo "📦 Instalando dependencias..."
npm ci --prefer-offline --no-audit --no-fund

echo ""
echo "🏗️ Deployando a Cloud Run..."
echo "⏳ Esto puede tomar 3-5 minutos..."

# Deploy a Cloud Run
gcloud run deploy $SERVICE_NAME \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10 \
    --port 8080 \
    --set-env-vars="NODE_ENV=production" \
    --set-env-vars="FIREBASE_PROJECT_ID=$PROJECT_ID" \
    --set-env-vars="GCLOUD_PROJECT=$PROJECT_ID"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡DEPLOY EXITOSO!"
    echo "🌐 Servicio disponible en:"
    echo "   https://$SERVICE_NAME-851382130132.$REGION.run.app"
    echo ""
    echo "🧪 Para probar:"
    echo "   curl https://$SERVICE_NAME-851382130132.$REGION.run.app/health"
    echo ""
    echo "🎯 SIGUIENTE PASO: Prueba crear una categoría en la app"
else
    echo ""
    echo "❌ Deploy falló"
    echo "💡 Verifica:"
    echo "   - Permisos de Cloud Run"
    echo "   - Proyecto activo en gcloud"
    echo "   - Conexión a internet"
fi