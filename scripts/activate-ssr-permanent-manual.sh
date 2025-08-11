#!/bin/bash

# Script para activar SSR permanentemente usando Firebase Console
echo "🚀 ACTIVACIÓN SSR PERMANENTE - PRODUCCIÓN"
echo "==========================================="
echo ""

PROJECT_ID="liquidacionapp-62962"

echo "📋 Para activar SSR PERMANENTEMENTE en producción, sigue estos pasos:"
echo ""
echo "1. 🌐 Abre Firebase Console:"
echo "   https://console.firebase.google.com/project/$PROJECT_ID/config"
echo ""
echo "2. 🔧 Ve a la sección 'Remote Config'"
echo ""
echo "3. ➕ Agrega estos parámetros:"
echo ""
echo "   ✅ ssr_enabled"
echo "      Valor: true"
echo "      Descripción: Habilita SSR globalmente - PRODUCCIÓN PERMANENTE"
echo ""
echo "   ✅ ssr_enabled_routes" 
echo "      Valor: [\"/combustibles/login\", \"/combustibles/movements\", \"/combustibles/inventory\", \"/combustibles/vehicles\", \"/combustibles/dashboard\", \"/combustibles/maintenance\", \"/combustibles/reports\", \"/combustibles\"]"
echo "      Descripción: Rutas donde SSR está activo - TODAS las rutas de combustibles"
echo ""
echo "   ✅ ssr_user_sampling"
echo "      Valor: 100"
echo "      Descripción: Porcentaje de usuarios que reciben SSR (100 = todos) - PRODUCCIÓN"
echo ""
echo "   ✅ max_data_fetch_time"
echo "      Valor: 800"
echo "      Descripción: Tiempo máximo para fetch de datos SSR en ms"
echo ""
echo "   ✅ enable_caching"
echo "      Valor: true"
echo "      Descripción: Cache de respuestas SSR habilitado en producción"
echo ""
echo "   ✅ ssr_production_mode"
echo "      Valor: true"
echo "      Descripción: Modo producción SSR - optimizaciones completas activas"
echo ""
echo "4. 📤 Haz clic en 'Publish changes'"
echo ""
echo "🎉 BENEFICIOS DE ESTA CONFIGURACIÓN:"
echo ""
echo "   ✓ SSR permanece activo entre deploys"
echo "   ✓ No necesitas reactivar SSR manualmente"
echo "   ✓ Todos los usuarios reciben SSR (mejor SEO y performance inicial)"
echo "   ✓ Optimizado para producción"
echo "   ✓ Cache habilitado para máximo rendimiento"
echo ""
echo "🔍 Para verificar que está funcionando:"
echo ""
echo "   curl -I https://liquidacionapp-62962.web.app/combustibles/login"
echo ""
echo "   Deberías ver: server-timing: ssr_total;dur=X"
echo ""
echo "🚨 IMPORTANTE: Una vez configurado, SSR estará PERMANENTEMENTE activo."
echo "   Remote Config persiste entre todos los deploys automáticamente."
echo ""

# Verificar estado actual
echo "🔍 Verificando estado actual de SSR..."
echo ""

RESPONSE=$(curl -s -I https://liquidacionapp-62962.web.app/combustibles/login 2>/dev/null)

if echo "$RESPONSE" | grep -q "server-timing:"; then
    echo "✅ SSR está ACTIVO - detectado server-timing header"
    SERVER_TIMING=$(echo "$RESPONSE" | grep "server-timing:" | head -1)
    echo "   $SERVER_TIMING"
else
    echo "⚠️  SSR no detectado o aún no configurado"
fi

if echo "$RESPONSE" | grep -q "x-fallback-csr:"; then
    echo "⚠️  Modo fallback CSR detectado"
    FALLBACK_REASON=$(echo "$RESPONSE" | grep "x-fallback-reason:" | head -1)
    echo "   $FALLBACK_REASON"
fi

echo ""
echo "📝 Remote Config actual:"
firebase remoteconfig:get 2>/dev/null || echo "   (Sin configuración aún)"
echo ""
echo "🌐 Abre el enlace de arriba para configurar permanentemente."
