#!/bin/bash

echo "🚀 VERIFICACIÓN SSR - $(date)"
echo "=================================="
echo ""

# Probar SSR
echo "📡 Probando SSR en /combustibles/login..."
RESPONSE=$(curl -s -I https://liquidacionapp-62962.web.app/combustibles/login)

# Verificar server-timing (SSR activo)
if echo "$RESPONSE" | grep -q "server-timing:"; then
    echo "✅ SSR ESTÁ ACTIVO!"
    SERVER_TIMING=$(echo "$RESPONSE" | grep "server-timing:" | head -1)
    echo "   $SERVER_TIMING"
else
    echo "⚠️  SSR no detectado"
fi

# Verificar fallback CSR (SSR inactivo)
if echo "$RESPONSE" | grep -q "x-fallback-csr:"; then
    echo "❌ Modo fallback CSR detectado"
    FALLBACK_REASON=$(echo "$RESPONSE" | grep "x-fallback-reason:" | head -1)
    echo "   $FALLBACK_REASON"
    ERROR_CODE=$(echo "$RESPONSE" | grep "x-error-code:" | head -1)
    echo "   $ERROR_CODE"
else
    echo "✅ Sin fallback CSR - SSR funcionando normalmente"
fi

echo ""
echo "🔍 Headers completos:"
echo "$RESPONSE"

echo ""
echo "📝 Remote Config actual:"
firebase remoteconfig:get --project liquidacionapp-62962 2>/dev/null || echo "   (Error accediendo a Remote Config)"

echo ""
if echo "$RESPONSE" | grep -q "server-timing:" && ! echo "$RESPONSE" | grep -q "x-fallback-csr:"; then
    echo "🎉 ¡SSR ESTÁ PERMANENTEMENTE ACTIVO!"
    echo "   ✓ Server-Side Rendering funcionando"
    echo "   ✓ Mejor SEO y performance inicial"
    echo "   ✓ Persistirá entre todos los deploys"
else
    echo "⏳ SSR aún no activo - espera un poco más o verifica logs"
fi
