#!/bin/bash

# Script para crear una imagen de fondo con ImageMagick
# forestech/scripts/create-login-background.sh

echo "🎨 Creando imagen de fondo personalizada..."

# Verificar si ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick no está instalado. Instalando..."
    sudo apt-get update && sudo apt-get install -y imagemagick
fi

# Crear directorio temporal
mkdir -p /tmp/forestech-bg

# Crear imagen de fondo con gradiente y patrones
echo "🖌️ Generando imagen de fondo..."

convert -size 1920x1080 \
  gradient:'#1b4332-#2d5016' \
  -blur 0x3 \
  \( -size 1920x1080 xc:none \
     -draw "fill rgba(82,165,113,0.3) circle 200,200 200,300" \
     -draw "fill rgba(101,200,120,0.2) circle 1500,300 1500,450" \
     -draw "fill rgba(64,130,109,0.25) circle 800,700 800,850" \
     -draw "fill rgba(45,80,22,0.2) circle 1200,800 1200,950" \
  \) \
  -composite \
  -quality 90 \
  /tmp/forestech-bg/login-background.jpg

# Verificar que se creó correctamente
if [ -f "/tmp/forestech-bg/login-background.jpg" ]; then
  echo "✅ Imagen creada exitosamente"
  
  # Mostrar información de la imagen
  echo "📊 Información de la imagen:"
  file /tmp/forestech-bg/login-background.jpg
  ls -lh /tmp/forestech-bg/login-background.jpg
  
  echo ""
  echo "🔧 La imagen está lista en: /tmp/forestech-bg/login-background.jpg"
  echo "📱 Ahora puedes subirla usando la herramienta de prueba."
  
else
  echo "❌ Error creando la imagen"
  exit 1
fi

echo ""
echo "🌟 ¡Imagen de fondo lista para subir!"
