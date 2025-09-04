#!/bin/bash

# Script para descargar y preparar imagen de fondo para el login
# forestech/scripts/setup-login-background.sh

echo "🖼️ Configurando imagen de fondo para login..."

# Crear directorio temporal
mkdir -p /tmp/forestech-bg

# Descargar imagen de fondo (usando una imagen de Unsplash relacionada con combustibles/industria)
echo "📥 Descargando imagen de fondo..."
curl -L "https://images.unsplash.com/photo-1574263867128-6fbaa6ccbacd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" \
  -o /tmp/forestech-bg/login-background.jpg

# Verificar que se descargó correctamente
if [ -f "/tmp/forestech-bg/login-background.jpg" ]; then
  echo "✅ Imagen descargada exitosamente"
  
  # Mostrar información de la imagen
  echo "📊 Información de la imagen:"
  file /tmp/forestech-bg/login-background.jpg
  ls -lh /tmp/forestech-bg/login-background.jpg
  
  echo ""
  echo "🔧 Pasos siguientes:"
  echo "1. Usa la herramienta test-upload-background.html para subir la imagen"
  echo "2. O copia manualmente la imagen a Firebase Storage"
  echo "3. La imagen está en: /tmp/forestech-bg/login-background.jpg"
  
else
  echo "❌ Error descargando la imagen"
  exit 1
fi

echo ""
echo "🌟 ¡Listo! Ahora puedes subir la imagen usando la herramienta web."
