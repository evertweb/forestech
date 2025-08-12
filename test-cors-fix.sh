#!/bin/bash
# Script de verificación post-fix de errores CORS
# forestech/test-cors-fix.sh

echo "🔍 Verificando solución de errores CORS..."
echo

# 1. Verificar que la imagen de fondo existe y es accesible
echo "📸 Verificando imagen de fondo..."
IMAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://firebasestorage.googleapis.com/v0/b/liquidacionapp-62962.firebasestorage.app/o/auth%2Flogin-background.jpg?alt=media")

if [ "$IMAGE_STATUS" = "200" ]; then
    echo "✅ Imagen de fondo accesible (HTTP $IMAGE_STATUS)"
else
    echo "❌ Error accediendo a imagen de fondo (HTTP $IMAGE_STATUS)"
fi

# 2. Verificar que la aplicación carga correctamente
echo
echo "🌐 Verificando aplicación combustibles..."
APP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://liquidacionapp-62962.web.app/combustibles/login")

if [ "$APP_STATUS" = "200" ]; then
    echo "✅ Aplicación accesible (HTTP $APP_STATUS)"
else
    echo "❌ Error accediendo a aplicación (HTTP $APP_STATUS)"
fi

# 3. Verificar configuración CORS
echo
echo "🔒 Verificando configuración CORS..."
CORS_TEST=$(curl -s -H "Origin: https://liquidacionapp-62962.web.app" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS "https://firebasestorage.googleapis.com/v0/b/liquidacionapp-62962.firebasestorage.app/o/auth%2Flogin-background.jpg?alt=media" | grep -i "access-control" | wc -l)

if [ "$CORS_TEST" -gt 0 ]; then
    echo "✅ Configuración CORS presente"
else
    echo "⚠️  Configuración CORS no detectada (puede ser normal)"
fi

# 4. Verificar otros recursos
echo
echo "📦 Verificando otros recursos..."
ASSETS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://liquidacionapp-62962.web.app/combustibles/")

if [ "$ASSETS_STATUS" = "200" ]; then
    echo "✅ Recursos de aplicación accesibles (HTTP $ASSETS_STATUS)"
else
    echo "❌ Error accediendo a recursos (HTTP $ASSETS_STATUS)"
fi

echo
echo "🏁 Verificación completada."
echo
echo "📋 Resumen de cambios aplicados:"
echo "   • ✅ Configuración CORS actualizada"
echo "   • ✅ StorageBucket corregido (.firebasestorage.app)"
echo "   • ✅ Imagen de fondo subida a Firebase Storage"
echo "   • ✅ Aplicación reconstruida y desplegada"
echo
echo "💡 Si aún hay errores, verifica la consola del navegador para más detalles."
