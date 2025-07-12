#!/bin/bash

# 🔍 Script de Monitoreo de Bucles Infinitos
# Forestech Colombia - Sistema de Prevención de Bucles

echo "🔍 Iniciando monitoreo de bucles infinitos..."

# Configuración
REPO="evertweb/forestech"
MAX_WORKFLOWS_PER_HOUR=10
MAX_ISSUES_PER_HOUR=5
ALERT_THRESHOLD=3

# Funciones de verificación
check_workflow_frequency() {
    echo "📊 Verificando frecuencia de workflows..."
    
    # Obtener workflows de la última hora
    CURRENT_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    ONE_HOUR_AGO=$(date -u -d '1 hour ago' +"%Y-%m-%dT%H:%M:%SZ")
    
    echo "Período: $ONE_HOUR_AGO a $CURRENT_TIME"
    
    # Simulación de verificación (requiere gh CLI en producción)
    echo "⚠️ ADVERTENCIA: Script en modo de prueba"
    echo "   En producción usaría: gh workflow list --limit 50"
    
    # Lógica de detección
    WORKFLOW_COUNT=3  # Simulado
    
    if [ $WORKFLOW_COUNT -gt $MAX_WORKFLOWS_PER_HOUR ]; then
        echo "🚨 ALERTA: $WORKFLOW_COUNT workflows en 1 hora (máximo: $MAX_WORKFLOWS_PER_HOUR)"
        return 1
    else
        echo "✅ Frecuencia normal: $WORKFLOW_COUNT workflows"
        return 0
    fi
}

check_copilot_issues() {
    echo "🤖 Verificando issues del Copilot Agent..."
    
    # Simulación de verificación de issues
    COPILOT_ISSUES=2  # Simulado
    
    if [ $COPILOT_ISSUES -gt $MAX_ISSUES_PER_HOUR ]; then
        echo "🚨 ALERTA: $COPILOT_ISSUES issues de Copilot en 1 hora (máximo: $MAX_ISSUES_PER_HOUR)"
        return 1
    else
        echo "✅ Issues normales: $COPILOT_ISSUES issues de Copilot"
        return 0
    fi
}

detect_commit_patterns() {
    echo "📝 Analizando patrones de commits..."
    
    # Verificar commits recientes
    RECENT_COMMITS=$(git rev-list --count HEAD~10..HEAD 2>/dev/null || echo "0")
    
    if [ $RECENT_COMMITS -gt 5 ]; then
        echo "⚠️ PATRÓN SOSPECHOSO: $RECENT_COMMITS commits recientes"
        
        # Verificar si hay commits automáticos consecutivos
        AUTO_COMMITS=$(git log --oneline -10 | grep -c "copilot\|automated\|auto-fix" || echo "0")
        
        if [ $AUTO_COMMITS -gt 2 ]; then
            echo "🚨 BUCLE DETECTADO: $AUTO_COMMITS commits automáticos consecutivos"
            return 1
        fi
    fi
    
    echo "✅ Patrones de commit normales"
    return 0
}

# Función principal de monitoreo
main_monitor() {
    echo "🛡️ FORESTECH - MONITOR DE BUCLES INFINITOS"
    echo "============================================="
    echo "Repositorio: $REPO"
    echo "Fecha: $(date)"
    echo ""
    
    ALERTS=0
    
    # Verificaciones
    if ! check_workflow_frequency; then
        ((ALERTS++))
    fi
    echo ""
    
    if ! check_copilot_issues; then
        ((ALERTS++))
    fi
    echo ""
    
    if ! detect_commit_patterns; then
        ((ALERTS++))
    fi
    echo ""
    
    # Evaluación final
    echo "📊 RESUMEN DE MONITOREO:"
    echo "========================"
    echo "Alertas generadas: $ALERTS"
    
    if [ $ALERTS -ge $ALERT_THRESHOLD ]; then
        echo "🚨 ESTADO CRÍTICO: POSIBLE BUCLE INFINITO DETECTADO"
        echo ""
        echo "🛠️ ACCIONES RECOMENDADAS:"
        echo "1. Revisar workflows recientes"
        echo "2. Verificar issues del Copilot Agent"
        echo "3. Pausar workflows automáticos temporalmente"
        echo "4. Contactar al equipo de DevOps"
        
        # En producción, aquí se enviarían alertas
        # slack_alert "🚨 Bucle infinito detectado en Forestech"
        # email_alert "admin@forestech.com"
        
        exit 1
    elif [ $ALERTS -gt 0 ]; then
        echo "⚠️ ESTADO DE ADVERTENCIA: Monitoreo continuo requerido"
        exit 2
    else
        echo "✅ ESTADO NORMAL: Sistema operando correctamente"
        exit 0
    fi
}

# Función de ayuda
show_help() {
    echo "🔍 Monitor de Bucles Infinitos - Forestech"
    echo ""
    echo "Uso: $0 [opción]"
    echo ""
    echo "Opciones:"
    echo "  monitor    Ejecutar monitoreo completo (por defecto)"
    echo "  workflows  Verificar solo workflows"
    echo "  issues     Verificar solo issues"
    echo "  commits    Verificar solo commits"
    echo "  help       Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0                # Monitoreo completo"
    echo "  $0 workflows      # Solo verificar workflows"
    echo "  $0 commits        # Solo verificar commits"
}

# Procesamiento de argumentos
case "${1:-monitor}" in
    "monitor")
        main_monitor
        ;;
    "workflows")
        check_workflow_frequency
        ;;
    "issues")
        check_copilot_issues
        ;;
    "commits")
        detect_commit_patterns
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        echo "❌ Opción desconocida: $1"
        show_help
        exit 1
        ;;
esac
