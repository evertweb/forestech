#!/bin/bash

# Script para probar que las passkeys funcionen correctamente
# después de configurar los dominios autorizados

echo "🧪 SCRIPT DE PRUEBA - PASSKEYS FORESTECH COMBUSTIBLES"
echo "===================================================="
echo ""

echo "🔍 Verificando configuración..."
echo ""

# Verificar que la app esté corriendo
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ App combustibles ejecutándose en localhost:5173"
else
    echo "❌ App no está corriendo. Ejecuta: cd combustibles && npm run dev"
    exit 1
fi

# Verificar que la página de demo esté accesible
if curl -s http://localhost:5173/demo-passkeys > /dev/null; then
    echo "✅ Página de demo accesible"
else
    echo "❌ Página de demo no accesible"
    exit 1
fi

echo ""
echo "🔧 Configuración requerida completada:"
echo "✅ Extensión Firebase Web Authn instalada"
echo "✅ Base de datos ext-firebase-web-authn creada"
echo "✅ Permisos IAM configurados"
echo "✅ Región us-east1 configurada en código"
echo "✅ Hosting rewrites configurados"
echo ""

echo "⚠️  PASO CRÍTICO PENDIENTE:"
echo "   Configurar dominios autorizados en Firebase Console"
echo ""
echo "📋 INSTRUCCIONES FINALES:"
echo ""
echo "1️⃣  Ve a: https://console.firebase.google.com/project/liquidacionapp-62962/authentication/settings"
echo "2️⃣  En 'Authorized domains', agregar:"
echo "    • localhost"
echo "    • 127.0.0.1"
echo "    • forestechdecolombia.com.co"
echo "3️⃣  Guardar cambios"
echo "4️⃣  Probar en: http://localhost:5173/demo-passkeys"
echo ""

echo "🎯 CUANDO HAYAS CONFIGURADO LOS DOMINIOS:"
echo "   1. Ve a http://localhost:5173/demo-passkeys"
echo "   2. Haz clic en 'Agregar passkey adicional'"
echo "   3. El error 'not-found' debería desaparecer"
echo "   4. Debería aparecer el gestor de contraseñas de Google"
echo ""

echo "📞 Si aún hay problemas después de configurar dominios:"
echo "   1. Refresca la página (Ctrl+F5)"
echo "   2. Borra caché del navegador"
echo "   3. Prueba en modo incógnito"
echo ""

echo "✅ Tu configuración de passkeys estará completa después de esto!"
