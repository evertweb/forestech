#!/bin/bash

# Script para configurar CORS en Firebase Storage
# combustibles/scripts/setup-firebase-cors.sh

echo "🔧 Configuración CORS para Firebase Storage"
echo "=========================================="
echo ""

PROJECT_ID="liquidacionapp-62962"
BUCKET_NAME="${PROJECT_ID}.appspot.com"
CORS_FILE="cors.json"

echo "📋 Información del proyecto:"
echo "   Proyecto: $PROJECT_ID"
echo "   Bucket: $BUCKET_NAME"
echo "   CORS config: $CORS_FILE"
echo ""

# Verificar si el archivo CORS existe
if [[ ! -f "$CORS_FILE" ]]; then
    echo "❌ Error: No se encontró el archivo $CORS_FILE"
    exit 1
fi

echo "📄 Configuración CORS a aplicar:"
cat "$CORS_FILE" | jq '.'
echo ""

# Verificar si gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo "⚠️  Google Cloud SDK no está instalado"
    echo ""
    echo "🛠️  OPCIONES PARA CONFIGURAR CORS:"
    echo ""
    echo "OPCIÓN 1: Instalar Google Cloud SDK (recomendado)"
    echo "1. Ejecutar: curl https://sdk.cloud.google.com | bash"
    echo "2. Reiniciar terminal: exec -l \$SHELL"
    echo "3. Autenticar: gcloud auth login"
    echo "4. Configurar proyecto: gcloud config set project $PROJECT_ID"
    echo "5. Aplicar CORS: gsutil cors set $CORS_FILE gs://$BUCKET_NAME"
    echo ""
    echo "OPCIÓN 2: Configurar desde Firebase Console"
    echo "1. Ir a: https://console.firebase.google.com/project/$PROJECT_ID/storage"
    echo "2. Hacer clic en 'Rules' en la parte superior"
    echo "3. Cambiar a la pestaña 'CORS'"
    echo "4. Copiar y pegar esta configuración:"
    echo ""
    cat "$CORS_FILE" | jq -c '.'
    echo ""
    echo "OPCIÓN 3: Usar Cloud Shell"
    echo "1. Ir a: https://console.cloud.google.com/cloudshell"
    echo "2. Subir el archivo cors.json"
    echo "3. Ejecutar: gsutil cors set cors.json gs://$BUCKET_NAME"
    echo ""
    exit 1
fi

# Si gcloud está instalado, proceder
echo "✅ Google Cloud SDK detectado"

# Verificar autenticación
if ! gcloud auth list --filter="status:ACTIVE" --format="value(account)" | grep -q "@"; then
    echo "🔐 Autenticando con Google Cloud..."
    gcloud auth login
fi

# Configurar proyecto
echo "🔧 Configurando proyecto $PROJECT_ID..."
gcloud config set project "$PROJECT_ID"

# Verificar si gsutil está disponible
if ! command -v gsutil &> /dev/null; then
    echo "❌ Error: gsutil no está disponible"
    exit 1
fi

# Aplicar configuración CORS
echo "🌐 Aplicando configuración CORS al bucket $BUCKET_NAME..."
gsutil cors set "$CORS_FILE" "gs://$BUCKET_NAME"

if [[ $? -eq 0 ]]; then
    echo "✅ CORS configurado exitosamente!"
    echo ""
    echo "🔍 Verificar configuración actual:"
    gsutil cors get "gs://$BUCKET_NAME"
    echo ""
    echo "🚀 Ahora puedes probar la carga de imágenes desde http://localhost:5174"
else
    echo "❌ Error al configurar CORS"
    echo "   Verifica que tengas permisos de administrador en el proyecto"
    exit 1
fi