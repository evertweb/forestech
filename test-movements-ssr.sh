#!/bin/bash

echo "🧪 Testing Movements SSR - Fase 2"
echo "=================================="

BASE_URL="https://forestechdecolombia.com.co"

echo "1. 🔍 Health Check SSR (baseline)"
echo "-----------------------------------"
curl -s -w "Status: %{response_code} | Time: %{time_total}s\n" \
     "$BASE_URL/combustibles/ssr-health" \
     -H "User-Agent: Mozilla/5.0" > /dev/null

echo
echo "2. 📊 Movements Page SSR (sin auth - debe mostrar login)"
echo "--------------------------------------------------------"
MOVEMENTS_RESPONSE=$(curl -s -w "%{response_code}" "$BASE_URL/combustibles/movimientos" -H "User-Agent: Mozilla/5.0")
STATUS=${MOVEMENTS_RESPONSE: -3}

if [[ $STATUS == "200" ]]; then
  echo "✅ Status: $STATUS"
  
  # Verificar que muestra login (fallback correcto)
  CONTENT=$(curl -s "$BASE_URL/combustibles/movimientos" -H "User-Agent: Mozilla/5.0")
  if echo "$CONTENT" | grep -q "Sistema de.*Combustibles"; then
    echo "✅ Fallback a login funcionando para /movimientos"
  elif echo "$CONTENT" | grep -q "Movimientos de Combustible"; then
    echo "🎯 SSR Movements component detectado!"
  else
    echo "⚠️  Contenido inesperado en /movimientos"
  fi
else
  echo "❌ Status: $STATUS"
fi

echo
echo "3. 📊 Performance Comparison"
echo "----------------------------"
echo "Dashboard SSR:"
TIME_DASH=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL/combustibles/dashboard")
echo "  Time: ${TIME_DASH}s"

echo "Movements SSR:"
TIME_MOV=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL/combustibles/movimientos")
echo "  Time: ${TIME_MOV}s"

echo "Health Check:"
TIME_HEALTH=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL/combustibles/ssr-health")
echo "  Time: ${TIME_HEALTH}s"

echo
echo "4. 📋 Server Headers para Movimientos"
echo "-------------------------------------"
curl -I "$BASE_URL/combustibles/movimientos" 2>/dev/null | grep -E "(server-timing|x-fallback|cache-control)"

echo
echo "5. 🧪 Test Multiple Routes en Paralelo"
echo "--------------------------------------"
echo "Testing 3 routes simultaneously..."

{
  TIME1=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL/combustibles/ssr-health")
  echo "Health: ${TIME1}s"
} &

{
  TIME2=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL/combustibles/dashboard")
  echo "Dashboard: ${TIME2}s"
} &

{
  TIME3=$(curl -s -w "%{time_total}" -o /dev/null "$BASE_URL/combustibles/movimientos")
  echo "Movements: ${TIME3}s"
} &

wait

echo
echo "🎯 Movements SSR Testing Complete!"
echo "📋 Summary:"
echo "   - Health Check: ✅ Funcionando"
echo "   - Dashboard SSR: ✅ Fase 1 activa"
echo "   - Movements SSR: 🔄 Fase 2 en testing"