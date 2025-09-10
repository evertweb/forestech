#!/bin/bash

# Script para configurar dominios autorizados en Firebase Console
# Este script abre las URLs necesarias para configuración manual

echo "🔧 CONFIGURACIÓN FINAL DE DOMINIOS AUTORIZADOS PARA PASSKEYS"
echo "=========================================================="
echo ""
echo "❌ ERROR 'not-found' CAUSADO POR DOMINIOS NO AUTORIZADOS"
echo ""
echo "📋 PASOS MANUALES OBLIGATORIOS:"
echo ""
echo "1️⃣  Abre Firebase Console - Authentication:"
echo "    🔗 https://console.firebase.google.com/project/liquidacionapp-62962/authentication/settings"
echo ""
echo "2️⃣  En la sección 'Authorized domains', AGREGAR:"
echo "    ✅ localhost"
echo "    ✅ 127.0.0.1"
echo "    ✅ forestechdecolombia.com.co"
echo ""
echo "3️⃣  Hacer clic en 'Save' después de agregar cada dominio"
echo ""
echo "4️⃣  Verificar que aparezcan en la lista como 'Authorized'"
echo ""
echo "⚠️  SIN ESTOS DOMINIOS, LAS PASSKEYS NO FUNCIONARÁN"
echo ""
echo "🧪 DESPUÉS DE CONFIGURAR, PROBAR EN:"
echo "    http://localhost:5173/demo-passkeys"
echo ""

# Intentar abrir automáticamente (si está en entorno gráfico)
if command -v xdg-open > /dev/null; then
    echo "🌐 Abriendo Firebase Console automáticamente..."
    xdg-open "https://console.firebase.google.com/project/liquidacionapp-62962/authentication/settings"
fi

echo "✅ Ejecuta este script cuando hayas configurado los dominios:"
echo "   ./scripts/test-passkeys.sh"
