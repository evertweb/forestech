#!/bin/bash

echo "🧪 Testing Production SSR - Fase 1"
echo "================================="

BASE_URL="https://forestechdecolombia.com.co"

echo "1. 🔍 Health Check SSR"
echo "-----------------------"
curl -w "Time: %{time_total}s | Status: %{response_code}\n" \
     -s "$BASE_URL/combustibles/ssr-health" \
     -H "User-Agent: Mozilla/5.0" | grep -E "(SSR Health Check|Route:|User:|Timestamp:)"

echo
echo "2. 🏠 Landing Page SSR"
echo "-----------------------"
LANDING_TEST=$(curl -w "%{response_code}:%{time_total}" -s "$BASE_URL/combustibles/" -H "User-Agent: Mozilla/5.0")
STATUS=$(echo $LANDING_TEST | cut -d: -f1)
TIME=$(echo $LANDING_TEST | cut -d: -f2)
if [[ $STATUS == "200" ]]; then
  echo "✅ Status: $STATUS | Time: ${TIME}s"
else
  echo "❌ Status: $STATUS | Time: ${TIME}s"
fi

echo
echo "3. 🎛️ Dashboard SSR (sin auth - debe mostrar login)"
echo "---------------------------------------------------"
DASHBOARD_TEST=$(curl -w "%{response_code}:%{time_total}" -s "$BASE_URL/combustibles/dashboard" -H "User-Agent: Mozilla/5.0")
STATUS=$(echo $DASHBOARD_TEST | cut -d: -f1)
TIME=$(echo $DASHBOARD_TEST | cut -d: -f2)
if [[ $STATUS == "200" ]]; then
  echo "✅ Status: $STATUS | Time: ${TIME}s"
  # Verificar que muestra login (fallback correcto)
  CONTENT=$(curl -s "$BASE_URL/combustibles/dashboard" -H "User-Agent: Mozilla/5.0")
  if echo "$CONTENT" | grep -q "Sistema de.*Combustibles"; then
    echo "✅ Fallback a login funcionando"
  else
    echo "⚠️  Contenido inesperado"
  fi
else
  echo "❌ Status: $STATUS | Time: ${TIME}s"
fi

echo
echo "4. 📊 Server-Timing Headers"
echo "----------------------------"
curl -I "$BASE_URL/combustibles/ssr-health" 2>/dev/null | grep -i "server-timing"

echo
echo "5. 🚀 Cache Headers"
echo "-------------------"
curl -I "$BASE_URL/combustibles/" 2>/dev/null | grep -E "(cache-control|x-fallback)"

echo
echo "6. 🔄 Performance Test (5 requests)"
echo "------------------------------------"
for i in {1..5}; do
  TIME=$(curl -w "%{time_total}" -s -o /dev/null "$BASE_URL/combustibles/ssr-health")
  echo "Request $i: ${TIME}s"
done

echo
echo "🎯 Production SSR Tests Complete!"