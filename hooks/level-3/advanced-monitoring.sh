#!/bin/bash
# HOOK NIVEL 3: Monitoreo avanzado y alertas inteligentes
# Avanzado: Sistema de monitoreo completo con métricas y alertas

set -e  # Salir si hay errores

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
PROJECT_DIR="/home/evert/Documentos/appwebforestech/forestech"

# Variables del hook
TOOL_NAME="${TOOL_NAME:-unknown}"
NOTIFICATION_TYPE="${NOTIFICATION_TYPE:-info}"
NOTIFICATION_MESSAGE="${NOTIFICATION_MESSAGE:-No message}"

# Log de inicio
echo "[$TIMESTAMP] Advanced Monitoring Hook iniciado" >> "$PROJECT_DIR/logs/hooks.log"

# Cambiar al directorio del proyecto
cd "$PROJECT_DIR"

# Función para métricas del sistema
collect_system_metrics() {
    echo "[$TIMESTAMP] Recolectando métricas del sistema..." >> logs/hooks.log
    
    # Crear archivo de métricas diario
    METRICS_FILE="logs/metrics_$(date +%Y%m%d).log"
    
    # Métricas básicas
    echo "[$TIMESTAMP] === MÉTRICAS DEL SISTEMA ===" >> "$METRICS_FILE"
    echo "[$TIMESTAMP] CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')" >> "$METRICS_FILE"
    echo "[$TIMESTAMP] RAM: $(free -h | grep Mem | awk '{print $3 "/" $2}')" >> "$METRICS_FILE"
    echo "[$TIMESTAMP] Disco: $(df -h . | tail -1 | awk '{print $3 "/" $2 " (" $5 ")"}')" >> "$METRICS_FILE"
    
    # Métricas de Forestech
    echo "[$TIMESTAMP] === MÉTRICAS DE FORESTECH ===" >> "$METRICS_FILE"
    echo "[$TIMESTAMP] Archivos .jsx: $(find . -name "*.jsx" | wc -l)" >> "$METRICS_FILE"
    echo "[$TIMESTAMP] Archivos .js: $(find . -name "*.js" | wc -l)" >> "$METRICS_FILE"
    echo "[$TIMESTAMP] Líneas de código: $(find . -name "*.jsx" -o -name "*.js" | xargs wc -l | tail -1)" >> "$METRICS_FILE"
    
    # Métricas de logs
    echo "[$TIMESTAMP] === MÉTRICAS DE LOGS ===" >> "$METRICS_FILE"
    echo "[$TIMESTAMP] Hooks ejecutados hoy: $(grep "$(date +%Y-%m-%d)" logs/hooks.log | wc -l)" >> "$METRICS_FILE"
    echo "[$TIMESTAMP] Errores hoy: $(grep "$(date +%Y-%m-%d)" logs/errors.log 2>/dev/null | wc -l)" >> "$METRICS_FILE"
    echo "[$TIMESTAMP] Warnings hoy: $(grep "$(date +%Y-%m-%d)" logs/warnings.log 2>/dev/null | wc -l)" >> "$METRICS_FILE"
}

# Función para análisis de patrones
analyze_patterns() {
    echo "[$TIMESTAMP] Analizando patrones de uso..." >> logs/hooks.log
    
    # Archivo de análisis
    ANALYSIS_FILE="logs/analysis_$(date +%Y%m%d).log"
    
    # Patrones de herramientas más usadas
    echo "[$TIMESTAMP] === ANÁLISIS DE PATRONES ===" >> "$ANALYSIS_FILE"
    echo "[$TIMESTAMP] Herramientas más usadas:" >> "$ANALYSIS_FILE"
    grep "$(date +%Y-%m-%d)" logs/hooks.log | grep -o "Tool: [^,]*" | sort | uniq -c | sort -nr | head -5 >> "$ANALYSIS_FILE"
    
    # Patrones de archivos más editados
    echo "[$TIMESTAMP] Archivos más editados:" >> "$ANALYSIS_FILE"
    grep "$(date +%Y-%m-%d)" logs/hooks.log | grep -o "File: [^,]*" | sort | uniq -c | sort -nr | head -5 >> "$ANALYSIS_FILE"
    
    # Patrones de errores
    if [ -f "logs/errors.log" ]; then
        echo "[$TIMESTAMP] Errores recurrentes:" >> "$ANALYSIS_FILE"
        grep "$(date +%Y-%m-%d)" logs/errors.log | awk '{print $4}' | sort | uniq -c | sort -nr | head -3 >> "$ANALYSIS_FILE"
    fi
}

# Función para alertas inteligentes
intelligent_alerts() {
    local severity="$1"
    local message="$2"
    
    echo "[$TIMESTAMP] Procesando alerta inteligente: $severity" >> logs/hooks.log
    
    # Crear directorio de alertas
    mkdir -p "alerts"
    
    # Archivo de alerta con timestamp
    ALERT_FILE="alerts/alert_$(date +%Y%m%d_%H%M%S).log"
    
    echo "ALERTA: $severity" > "$ALERT_FILE"
    echo "Timestamp: $TIMESTAMP" >> "$ALERT_FILE"
    echo "Mensaje: $message" >> "$ALERT_FILE"
    echo "Sistema: Forestech" >> "$ALERT_FILE"
    
    # Alertas críticas
    if [ "$severity" == "CRITICAL" ]; then
        # Crear archivo de estado crítico
        echo "SISTEMA EN ESTADO CRÍTICO" > "SYSTEM_CRITICAL.txt"
        echo "Timestamp: $TIMESTAMP" >> "SYSTEM_CRITICAL.txt"
        echo "Razón: $message" >> "SYSTEM_CRITICAL.txt"
        
        # Alerta visual
        echo "🚨🚨🚨 ALERTA CRÍTICA: $message 🚨🚨🚨"
        
        # Log en archivo principal
        echo "[$TIMESTAMP] 🚨 ALERTA CRÍTICA: $message" >> logs/critical_alerts.log
    fi
    
    # Alertas de performance
    if [ "$severity" == "PERFORMANCE" ]; then
        echo "[$TIMESTAMP] ⚡ PERFORMANCE: $message" >> logs/performance_alerts.log
        echo "⚡ Alerta de performance: $message"
    fi
    
    # Alertas de seguridad
    if [ "$severity" == "SECURITY" ]; then
        echo "[$TIMESTAMP] 🔒 SECURITY: $message" >> logs/security_alerts.log
        echo "🔒 Alerta de seguridad: $message"
    fi
    
    # Limpiar alertas antiguas (más de 7 días)
    find alerts -name "*.log" -mtime +7 -delete 2>/dev/null || true
}

# Función para health check completo
system_health_check() {
    echo "[$TIMESTAMP] Ejecutando health check completo..." >> logs/hooks.log
    
    HEALTH_FILE="logs/health_$(date +%Y%m%d_%H%M%S).log"
    
    echo "[$TIMESTAMP] === HEALTH CHECK FORESTECH ===" >> "$HEALTH_FILE"
    
    # Verificar archivos críticos
    CRITICAL_FILES=("package.json" "firebase.json" "CLAUDE.md")
    for file in "${CRITICAL_FILES[@]}"; do
        if [ -f "$file" ]; then
            echo "[$TIMESTAMP] ✅ $file: OK" >> "$HEALTH_FILE"
        else
            echo "[$TIMESTAMP] ❌ $file: FALTANTE" >> "$HEALTH_FILE"
            intelligent_alerts "CRITICAL" "Archivo crítico faltante: $file"
        fi
    done
    
    # Verificar estructura de directorios
    CRITICAL_DIRS=("combustibles/src" "alimentacion/src" "logs" "hooks")
    for dir in "${CRITICAL_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            echo "[$TIMESTAMP] ✅ $dir: OK" >> "$HEALTH_FILE"
        else
            echo "[$TIMESTAMP] ❌ $dir: FALTANTE" >> "$HEALTH_FILE"
            intelligent_alerts "CRITICAL" "Directorio crítico faltante: $dir"
        fi
    done
    
    # Verificar espacio en disco
    DISK_USAGE=$(df . | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 90 ]; then
        echo "[$TIMESTAMP] ❌ Espacio en disco: $DISK_USAGE% (CRÍTICO)" >> "$HEALTH_FILE"
        intelligent_alerts "CRITICAL" "Espacio en disco crítico: $DISK_USAGE%"
    elif [ "$DISK_USAGE" -gt 80 ]; then
        echo "[$TIMESTAMP] ⚠️ Espacio en disco: $DISK_USAGE% (ADVERTENCIA)" >> "$HEALTH_FILE"
        intelligent_alerts "PERFORMANCE" "Espacio en disco alto: $DISK_USAGE%"
    else
        echo "[$TIMESTAMP] ✅ Espacio en disco: $DISK_USAGE% (OK)" >> "$HEALTH_FILE"
    fi
    
    # Verificar procesos críticos
    if pgrep -f "npm" > /dev/null; then
        echo "[$TIMESTAMP] ✅ Procesos npm: ACTIVOS" >> "$HEALTH_FILE"
    else
        echo "[$TIMESTAMP] ℹ️ Procesos npm: INACTIVOS" >> "$HEALTH_FILE"
    fi
}

# Ejecución principal
case "$TOOL_NAME" in
    "mcp__firebase__"*)
        collect_system_metrics
        intelligent_alerts "PERFORMANCE" "Operación Firebase ejecutada: $TOOL_NAME"
        ;;
        
    "Edit"|"MultiEdit"|"Write")
        analyze_patterns
        if [[ "$TOOL_ARGS" == *"firebase"* ]]; then
            intelligent_alerts "SECURITY" "Archivo de configuración Firebase modificado"
        fi
        ;;
        
    "Bash")
        if [[ "$TOOL_ARGS" == *"sudo"* ]]; then
            intelligent_alerts "SECURITY" "Comando sudo ejecutado"
        fi
        if [[ "$TOOL_ARGS" == *"deploy"* ]]; then
            system_health_check
            intelligent_alerts "PERFORMANCE" "Deploy iniciado"
        fi
        ;;
esac

# Health check periódico (cada 100 hooks)
HOOK_COUNT=$(grep "$(date +%Y-%m-%d)" logs/hooks.log | wc -l)
if [ $((HOOK_COUNT % 100)) -eq 0 ]; then
    echo "[$TIMESTAMP] Health check automático (hook #$HOOK_COUNT)" >> logs/hooks.log
    system_health_check
fi

# Recolectar métricas cada hora
CURRENT_HOUR=$(date +%H)
LAST_METRICS_HOUR=$(tail -1 logs/metrics_$(date +%Y%m%d).log 2>/dev/null | grep -o '[0-9][0-9]:[0-9][0-9]' | cut -d: -f1 || echo "00")

if [ "$CURRENT_HOUR" != "$LAST_METRICS_HOUR" ]; then
    collect_system_metrics
fi

# Log final
echo "[$TIMESTAMP] Advanced Monitoring completado" >> logs/hooks.log

exit 0