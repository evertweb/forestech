#!/bin/bash
# Test SSR Coverage 45% Achievement - Fase 4
# Script para validar que se alcance el objetivo del 45% de cobertura SSR

echo "🎯 Testing SSR Coverage 45% Achievement - Fase 4"
echo "================================================"

# Variables de configuración
BASE_URL="http://localhost:5001/liquidacionapp-62962/us-central1/ssrCombustibles"
TARGET_COVERAGE=45
LOG_FILE="test-ssr-coverage-45.log"

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

# Función para extraer valores numéricos de JSON
extract_number() {
    local json=$1
    local path=$2
    echo "$json" | jq -r "$path // 0"
}

echo ""
log "🔧 1. Health Check y Validación de Sistema"
echo "----------------------------------------"

health_response=$(make_request GET "/health")
if validate_json "$health_response"; then
    log "✅ Sistema SSR operativo"
    echo "$health_response" | jq .
else
    log "❌ Sistema SSR no responde correctamente"
    echo "$health_response"
    exit 1
fi

echo ""
log "📊 2. Análisis de Cobertura SSR Actual"
echo "------------------------------------"

# Test 2.1: Obtener cobertura actual
log "2.1 Obteniendo cobertura SSR actual..."
current_coverage=$(make_request GET "/ssr-coverage?action=current")
if validate_json "$current_coverage"; then
    log "✅ Datos de cobertura obtenidos"
    
    weighted_coverage=$(extract_number "$current_coverage" ".weightedCoverage")
    total_coverage=$(extract_number "$current_coverage" ".totalCoverage")
    target_achieved=$(echo "$current_coverage" | jq -r ".targetAchieved")
    
    log "   - Cobertura Total: ${total_coverage}%"
    log "   - Cobertura Ponderada: ${weighted_coverage}%"
    log "   - Target (45%) Alcanzado: $target_achieved"
    
    echo "$current_coverage" | jq .
else
    log "❌ Error obteniendo datos de cobertura"
    echo "$current_coverage"
    exit 1
fi

# Test 2.2: Dashboard de cobertura completo
log "2.2 Generando dashboard de cobertura..."
coverage_dashboard=$(make_request GET "/ssr-coverage?action=dashboard")
if validate_json "$coverage_dashboard"; then
    log "✅ Dashboard de cobertura generado"
    
    current_cov=$(extract_number "$coverage_dashboard" ".summary.currentCoverage")
    target_cov=$(extract_number "$coverage_dashboard" ".summary.targetCoverage")
    progress_pct=$(extract_number "$coverage_dashboard" ".summary.progressPercentage")
    
    log "   - Dashboard Summary:"
    log "     * Current Coverage: ${current_cov}%"
    log "     * Target Coverage: ${target_cov}%"
    log "     * Progress: ${progress_pct}%"
    
    # Mostrar breakdown por rutas
    log "   - Route Breakdown:"
    echo "$coverage_dashboard" | jq -r '.routeBreakdown | to_entries[] | "     * \(.key): SSR=\(.value.ssrEnabled), Traffic=\(.value.traffic), Contribution=\(.value.currentContribution)"'
    
else
    log "❌ Error generando dashboard de cobertura"
    echo "$coverage_dashboard"
fi

echo ""
log "📈 3. Análisis de Performance y Optimización"
echo "-------------------------------------------"

# Test 3.1: Estado de optimización de performance
log "3.1 Verificando estado de optimización de performance..."
optimization_status=$(make_request GET "/ssr-optimization?action=status")
if validate_json "$optimization_status"; then
    log "✅ Sistema de optimización operativo"
    
    # Verificar targets de Fase 4
    echo "$optimization_status" | jq '.targets.phase4Targets' > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        ttfb_target=$(extract_number "$optimization_status" ".targets.phase4Targets.ttfb")
        error_rate_target=$(extract_number "$optimization_status" ".targets.phase4Targets.errorRate")
        
        log "   - Targets Fase 4:"
        log "     * TTFB Target: ${ttfb_target}ms"
        log "     * Error Rate Target: ${error_rate_target}"
    fi
    
    echo "$optimization_status" | jq .targets
else
    log "❌ Error verificando sistema de optimización"
    echo "$optimization_status"
fi

# Test 3.2: Ejecutar optimización (si es necesario)
if [ "$weighted_coverage" -lt "$TARGET_COVERAGE" ]; then
    log "3.2 Cobertura por debajo del target - ejecutando optimización..."
    optimization_trigger=$(make_request POST "/ssr-optimization?action=optimize")
    if validate_json "$optimization_trigger"; then
        log "✅ Optimización de performance iniciada"
        echo "$optimization_trigger" | jq .
        
        # Esperar un momento para que la optimización procese
        log "   - Esperando 10 segundos para procesamiento..."
        sleep 10
        
        # Verificar progreso
        optimization_history=$(make_request GET "/ssr-optimization?action=history")
        if validate_json "$optimization_history"; then
            log "   - Historial de optimización:"
            echo "$optimization_history" | jq .lastOptimization.report.summary 2>/dev/null || log "     No hay datos de optimización recientes"
        fi
    else
        log "⚠️  Error iniciando optimización (continuando tests)"
    fi
else
    log "✅ Cobertura ya alcanza el target - optimización no necesaria"
fi

echo ""
log "🚦 4. Validación de Quality Gates"
echo "--------------------------------"

# Test 4.1: Validar quality gates para rutas críticas
critical_routes=("/combustibles/" "/combustibles/dashboard" "/combustibles/movimientos" "/combustibles/vehiculos")

for route in "${critical_routes[@]}"; do
    log "4.1.$((${#critical_routes[@]} - ${#critical_routes[@]} + 1)) Validando quality gates para: $route"
    
    quality_gates=$(make_request GET "/ssr-coverage?action=quality&route=$route")
    if validate_json "$quality_gates"; then
        passed=$(echo "$quality_gates" | jq -r ".passed")
        score=$(extract_number "$quality_gates" ".score")
        
        if [ "$passed" = "true" ]; then
            log "   ✅ Quality gates PASSED - Score: ${score}%"
        else
            log "   ⚠️  Quality gates FAILED - Score: ${score}%"
            
            # Mostrar detalles de validaciones fallidas
            echo "$quality_gates" | jq -r '.validations | to_entries[] | select(.value.passed == false) | "     ❌ \(.key): \(.value.actual) (threshold: \(.value.threshold))"'
        fi
    else
        log "   ❌ Error validando quality gates para $route"
    fi
done

echo ""
log "📋 5. Plan de Rollout para 45% Coverage"
echo "--------------------------------------"

# Test 5.1: Obtener plan de rollout
log "5.1 Generando plan de rollout..."
rollout_plan=$(make_request GET "/ssr-coverage?action=plan")
if validate_json "$rollout_plan"; then
    log "✅ Plan de rollout generado"
    
    status=$(echo "$rollout_plan" | jq -r ".status // \"active\"")
    current_cov=$(extract_number "$rollout_plan" ".currentCoverage")
    target_cov=$(extract_number "$rollout_plan" ".target")
    gap=$(extract_number "$rollout_plan" ".gap")
    
    log "   - Plan Status: $status"
    log "   - Current Coverage: ${current_cov}%"
    log "   - Target Coverage: ${target_cov}%"
    log "   - Coverage Gap: ${gap}%"
    
    if [ "$status" = "target_achieved" ]; then
        log "🎉 TARGET DE 45% COVERAGE YA ALCANZADO!"
    else
        # Mostrar fases del rollout
        log "   - Rollout Phases:"
        echo "$rollout_plan" | jq -r '.phases[]? | "     Phase \(.phase): \(.route) (Priority: \(.priority), Weight: \(.weight)%)"'
        
        # Mostrar resumen
        total_phases=$(extract_number "$rollout_plan" ".summary.totalPhases")
        estimated_duration=$(echo "$rollout_plan" | jq -r ".summary.estimatedDuration // \"unknown\"")
        final_coverage=$(extract_number "$rollout_plan" ".summary.finalCoverage")
        
        log "   - Summary:"
        log "     * Total Phases: $total_phases"
        log "     * Estimated Duration: $estimated_duration"
        log "     * Final Coverage: ${final_coverage}%"
    fi
    
else
    log "❌ Error generando plan de rollout"
    echo "$rollout_plan"
fi

echo ""
log "📊 6. Análisis de Progreso y Siguiente Acción"
echo "--------------------------------------------"

# Test 6.1: Monitorear progreso actual
log "6.1 Monitoreando progreso de rollout..."
rollout_progress=$(make_request GET "/ssr-coverage?action=progress")
if validate_json "$rollout_progress"; then
    log "✅ Progreso de rollout monitoreado"
    
    progress_pct=$(extract_number "$rollout_progress" ".progress")
    active_routes=$(echo "$rollout_progress" | jq -r ".activeRoutes | length")
    pending_routes=$(echo "$rollout_progress" | jq -r ".pendingRoutes | length")
    
    log "   - Progress: ${progress_pct}%"
    log "   - Active SSR Routes: $active_routes"
    log "   - Pending Routes: $pending_routes"
    
    # Mostrar próxima fase
    next_phase=$(echo "$rollout_progress" | jq -r ".nextPhase.route // \"none\"")
    if [ "$next_phase" != "none" ] && [ "$next_phase" != "null" ]; then
        next_priority=$(echo "$rollout_progress" | jq -r ".nextPhase.priority")
        log "   - Next Phase: $next_phase (Priority: $next_priority)"
    else
        log "   - Next Phase: No pending phases"
    fi
    
    # Mostrar recomendaciones
    log "   - Recommendations:"
    echo "$rollout_progress" | jq -r '.recommendations[]? | "     \(.priority | ascii_upcase): \(.description)"'
    
else
    log "❌ Error monitoreando progreso"
    echo "$rollout_progress"
fi

echo ""
log "🎯 7. Validación Final del Target 45%"
echo "-----------------------------------"

# Test 7.1: Validación final de cobertura
log "7.1 Validación final de cobertura SSR..."

# Obtener métricas finales
final_coverage=$(make_request GET "/ssr-coverage?action=current")
if validate_json "$final_coverage"; then
    final_weighted=$(extract_number "$final_coverage" ".weightedCoverage")
    final_total=$(extract_number "$final_coverage" ".totalCoverage")
    target_achieved=$(echo "$final_coverage" | jq -r ".targetAchieved")
    
    log "   - Métricas Finales:"
    log "     * Weighted Coverage: ${final_weighted}%"
    log "     * Total Coverage: ${final_total}%"
    log "     * Target Achieved: $target_achieved"
    
    # Verificar si se alcanzó el target
    if [ "$target_achieved" = "true" ] || (( $(echo "$final_weighted >= $TARGET_COVERAGE" | bc -l) )); then
        log "🎉 ¡TARGET DE 45% SSR COVERAGE ALCANZADO!"
        echo ""
        echo "🏆 ================== SUCCESS =================="
        echo "🎯 SSR Coverage Target: ${TARGET_COVERAGE}%"
        echo "📊 Current Coverage: ${final_weighted}%"
        echo "✅ Status: TARGET ACHIEVED"
        echo "🚀 Fase 4 Performance Optimization: COMPLETADA"
        echo "==============================================="
        echo ""
        exit 0
    else
        gap=$((TARGET_COVERAGE - ${final_weighted%.*}))
        log "⚠️  Target aún no alcanzado - Gap: ${gap}%"
        
        echo ""
        echo "📈 ============== PROGRESS REPORT =============="
        echo "🎯 SSR Coverage Target: ${TARGET_COVERAGE}%"
        echo "📊 Current Coverage: ${final_weighted}%"
        echo "📉 Remaining Gap: ${gap}%"
        echo "⚠️  Status: IN PROGRESS"
        echo "🔄 Next Action: Continue rollout plan execution"
        echo "=============================================="
        echo ""
        
        # Mostrar próximos pasos
        log "📋 Próximos pasos recomendados:"
        log "   1. Ejecutar siguiente fase del rollout plan"
        log "   2. Validar quality gates para rutas pendientes"
        log "   3. Aplicar optimizaciones de performance adicionales"
        log "   4. Monitorear métricas continuamente"
        
        exit 1
    fi
else
    log "❌ Error en validación final"
    echo "$final_coverage"
    exit 1
fi

echo ""
log "🔧 8. Información del Sistema para Debug"
echo "--------------------------------------"

# Test 8.1: Configuración SSR
log "8.1 Configuración SSR actual..."
ssr_config=$(make_request GET "/ssr-coverage?action=config")
if validate_json "$ssr_config"; then
    target_config=$(extract_number "$ssr_config" ".config.targetCoverage")
    total_routes=$(echo "$ssr_config" | jq -r ".routes | length")
    
    log "   - Target Coverage Configurado: ${target_config}%"
    log "   - Total SSR Routes: $total_routes"
    log "   - Routes:"
    echo "$ssr_config" | jq -r '.config.routes | to_entries[] | "     * \(.key): enabled=\(.value.enabled), priority=\(.value.priority), weight=\(.value.weight)%"'
else
    log "⚠️  No se pudo obtener configuración SSR"
fi

# Test 8.2: URLs de monitoreo
log "8.2 URLs de monitoreo disponibles:"
log "   - Coverage Dashboard: $BASE_URL/ssr-coverage?action=dashboard"
log "   - Current Coverage: $BASE_URL/ssr-coverage?action=current"
log "   - Rollout Plan: $BASE_URL/ssr-coverage?action=plan"
log "   - Performance Status: $BASE_URL/ssr-optimization?action=status"
log "   - Reports System: $BASE_URL/ssr-reports?action=generate&timeframe=1h"
log "   - Alerts System: $BASE_URL/ssr-alerts?action=status"

echo ""
log "📋 RESUMEN DE TESTING COMPLETADO"
echo "==============================="
log "Timestamp: $(date)"
log "Target Coverage: ${TARGET_COVERAGE}%"
log "Final Coverage: ${final_weighted}%"
log "Status: $([ "$target_achieved" = "true" ] && echo "TARGET ACHIEVED" || echo "IN PROGRESS")"
log "Log File: $LOG_FILE"
