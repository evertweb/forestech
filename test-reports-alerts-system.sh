#!/bin/bash
# Test del Sistema de Reportes y Alertas SSR - Fase 4
# Script para validar funcionamiento completo del sistema

echo "🧪 Testing SSR Reports & Alerting System - Fase 4"
echo "=================================================="

# Variables de configuración
BASE_URL="http://localhost:5001/liquidacionapp-62962/us-central1/ssrCombustibles"
LOG_FILE="test-reports-alerts.log"

# Función para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Función para hacer requests HTTP
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        curl -s -X POST \
             -H "Content-Type: application/json" \
             -d "$data" \
             "$BASE_URL$endpoint"
    else
        curl -s -X "$method" "$BASE_URL$endpoint"
    fi
}

# Función para validar JSON response
validate_json() {
    local response=$1
    echo "$response" | jq . > /dev/null 2>&1
    return $?
}

echo ""
log "🔧 1. Testing Health Check"
echo "-------------------------"

health_response=$(make_request GET "/health")
if validate_json "$health_response"; then
    log "✅ Health check passed"
    echo "$health_response" | jq .
else
    log "❌ Health check failed"
    echo "$health_response"
    exit 1
fi

echo ""
log "📊 2. Testing SSR Reports System"
echo "--------------------------------"

# Test 2.1: Get basic reports status
log "2.1 Testing reports status..."
reports_status=$(make_request GET "/ssr-reports?action=status")
if validate_json "$reports_status"; then
    log "✅ Reports status endpoint working"
    echo "$reports_status" | jq .
else
    log "❌ Reports status failed"
    echo "$reports_status"
fi

# Test 2.2: Generate live report
log "2.2 Generating live SSR report..."
live_report=$(make_request GET "/ssr-reports?action=generate&timeframe=5m")
if validate_json "$live_report"; then
    log "✅ Live report generation working"
    
    # Verificar estructura del reporte
    total_requests=$(echo "$live_report" | jq '.report.summary.totalRequests // 0')
    error_rate=$(echo "$live_report" | jq '.report.summary.errorRate // 0')
    
    log "   - Total Requests: $total_requests"
    log "   - Error Rate: $error_rate%"
    
    if [ "$total_requests" -gt 0 ]; then
        log "✅ Report contains valid data"
    else
        log "⚠️  Report generated but no traffic data"
    fi
else
    log "❌ Live report generation failed"
    echo "$live_report"
fi

# Test 2.3: Generate HTML report
log "2.3 Testing HTML report generation..."
html_report=$(make_request GET "/ssr-reports?action=html&timeframe=15m")
if echo "$html_report" | grep -q "<!DOCTYPE html"; then
    log "✅ HTML report generation working"
    html_size=$(echo "$html_report" | wc -c)
    log "   - HTML Report size: ${html_size} characters"
else
    log "❌ HTML report generation failed"
fi

# Test 2.4: Test report scheduling
log "2.4 Testing report scheduling..."
schedule_response=$(make_request POST "/ssr-reports?action=schedule" '{"frequency":"hourly","format":"json","enabled":true}')
if validate_json "$schedule_response"; then
    log "✅ Report scheduling working"
    echo "$schedule_response" | jq .
else
    log "❌ Report scheduling failed"
    echo "$schedule_response"
fi

echo ""
log "🚨 3. Testing SSR Alerts System"
echo "-------------------------------"

# Test 3.1: Get alerts status
log "3.1 Testing alerts system status..."
alerts_status=$(make_request GET "/ssr-alerts?action=status")
if validate_json "$alerts_status"; then
    log "✅ Alerts status endpoint working"
    
    is_running=$(echo "$alerts_status" | jq '.isRunning')
    active_alerts=$(echo "$alerts_status" | jq '.activeAlerts')
    channels=$(echo "$alerts_status" | jq '.channels | length')
    
    log "   - System Running: $is_running"
    log "   - Active Alerts: $active_alerts"
    log "   - Channels Enabled: $channels"
    
    echo "$alerts_status" | jq .
else
    log "❌ Alerts status failed"
    echo "$alerts_status"
fi

# Test 3.2: Start alerting system (if not running)
is_running=$(echo "$alerts_status" | jq -r '.isRunning // false')
if [ "$is_running" = "false" ]; then
    log "3.2 Starting alerting system..."
    start_response=$(make_request POST "/ssr-alerts?action=start")
    if validate_json "$start_response"; then
        log "✅ Alerting system started successfully"
        echo "$start_response" | jq .
    else
        log "❌ Failed to start alerting system"
        echo "$start_response"
    fi
else
    log "✅ Alerting system already running"
fi

# Test 3.3: Get active alerts
log "3.3 Checking active alerts..."
active_alerts=$(make_request GET "/ssr-alerts?action=active")
if validate_json "$active_alerts"; then
    log "✅ Active alerts endpoint working"
    
    alert_count=$(echo "$active_alerts" | jq '.activeAlerts | length')
    log "   - Current Active Alerts: $alert_count"
    
    if [ "$alert_count" -gt 0 ]; then
        log "📋 Active alerts found:"
        echo "$active_alerts" | jq '.activeAlerts[] | {type: .type, severity: .severity, triggeredAt: .triggeredAt}'
    fi
else
    log "❌ Active alerts check failed"
    echo "$active_alerts"
fi

# Test 3.4: Get alerts history
log "3.4 Checking alerts history..."
alerts_history=$(make_request GET "/ssr-alerts?action=history&limit=10")
if validate_json "$alerts_history"; then
    log "✅ Alerts history endpoint working"
    
    history_count=$(echo "$alerts_history" | jq '.history | length')
    log "   - Recent Alerts: $history_count"
    
    if [ "$history_count" -gt 0 ]; then
        log "📊 Recent alerts summary:"
        echo "$alerts_history" | jq '.history[] | {type: .type, severity: .severity, status: .status, triggeredAt: .triggeredAt}' | head -20
    fi
else
    log "❌ Alerts history check failed"
    echo "$alerts_history"
fi

echo ""
log "🧪 4. Integration Testing"
echo "------------------------"

# Test 4.1: Generate stress to trigger alerts (if in development)
if [ "$NODE_ENV" != "production" ]; then
    log "4.1 Testing alert trigger simulation..."
    
    # Simular múltiples requests para generar métricas
    log "   - Generating test traffic..."
    for i in {1..5}; do
        make_request GET "/combustibles/" > /dev/null 2>&1 &
    done
    wait
    
    # Esperar un momento para que las métricas se procesen
    sleep 3
    
    # Verificar si se generaron nuevas métricas
    new_report=$(make_request GET "/ssr-reports?action=generate&timeframe=1m")
    if validate_json "$new_report"; then
        recent_requests=$(echo "$new_report" | jq '.report.summary.totalRequests // 0')
        log "   - Test requests processed: $recent_requests"
        
        if [ "$recent_requests" -gt 0 ]; then
            log "✅ Traffic generation and metrics collection working"
        else
            log "⚠️  Test traffic may not have reached SSR handler"
        fi
    fi
else
    log "⚠️  Skipping stress testing in production environment"
fi

# Test 4.2: Cross-system validation
log "4.2 Cross-system validation..."

# Verificar que los sistemas se integren correctamente
integration_test=$(make_request GET "/ssr-reports?action=generate&timeframe=1h")
if validate_json "$integration_test"; then
    # Extraer métricas clave
    total_requests=$(echo "$integration_test" | jq '.report.summary.totalRequests // 0')
    error_rate=$(echo "$integration_test" | jq '.report.summary.errorRate // 0')
    avg_response_time=$(echo "$integration_test" | jq '.report.performance.averageResponseTime // 0')
    
    log "   - Integration Test Results:"
    log "     * Total Requests (1h): $total_requests"
    log "     * Error Rate: $error_rate%"
    log "     * Avg Response Time: ${avg_response_time}ms"
    
    # Validar thresholds básicos
    if (( $(echo "$error_rate <= 5" | bc -l) )); then
        log "✅ Error rate within acceptable range"
    else
        log "⚠️  Error rate above 5% - may trigger alerts"
    fi
    
    if (( $(echo "$avg_response_time <= 1500" | bc -l) )); then
        log "✅ Response time within acceptable range"
    else
        log "⚠️  Response time above 1.5s - may trigger alerts"
    fi
else
    log "❌ Integration test failed"
fi

echo ""
log "📋 5. Test Summary"
echo "-----------------"

# Generar resumen final
final_status=$(make_request GET "/ssr-alerts?action=status")
final_reports=$(make_request GET "/ssr-reports?action=status")

if validate_json "$final_status" && validate_json "$final_reports"; then
    # Status del sistema de alertas
    alerts_running=$(echo "$final_status" | jq -r '.isRunning')
    active_count=$(echo "$final_status" | jq '.activeAlerts')
    
    # Status del sistema de reportes  
    reports_enabled=$(echo "$final_reports" | jq -r '.reportsEnabled // true')
    
    log "📊 Final System Status:"
    log "   - SSR Alerts System: $alerts_running"
    log "   - Active Alerts: $active_count"
    log "   - Reports System: $reports_enabled"
    
    if [ "$alerts_running" = "true" ] && [ "$reports_enabled" = "true" ]; then
        log "✅ All systems operational!"
        echo ""
        echo "🎉 SSR Reports & Alerting System - Fase 4 - FULLY OPERATIONAL"
        echo ""
        echo "📍 Available endpoints:"
        echo "   - Reports: $BASE_URL/ssr-reports"
        echo "   - Alerts:  $BASE_URL/ssr-alerts"
        echo "   - Health:  $BASE_URL/health"
        echo ""
        echo "🔗 Quick access URLs:"
        echo "   - Live Report:    $BASE_URL/ssr-reports?action=generate&timeframe=1h"
        echo "   - HTML Dashboard: $BASE_URL/ssr-reports?action=html&timeframe=6h"
        echo "   - Alerts Status:  $BASE_URL/ssr-alerts?action=status"
        echo "   - Active Alerts:  $BASE_URL/ssr-alerts?action=active"
        echo ""
        exit 0
    else
        log "❌ Some systems not fully operational"
        exit 1
    fi
else
    log "❌ Unable to get final system status"
    exit 1
fi
