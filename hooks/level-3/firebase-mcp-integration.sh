#!/bin/bash
# HOOK NIVEL 3: Integración avanzada con Firebase MCP
# Avanzado: Monitoreo inteligente y acciones automáticas

set -e  # Salir si hay errores

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
PROJECT_DIR="/home/evert/Documentos/appwebforestech/forestech"

# Variables del hook
TOOL_NAME="${TOOL_NAME:-unknown}"
NOTIFICATION_TYPE="${NOTIFICATION_TYPE:-info}"

# Log de inicio
echo "[$TIMESTAMP] Firebase MCP Integration Hook - Tool: $TOOL_NAME" >> "$PROJECT_DIR/logs/hooks.log"

# Cambiar al directorio del proyecto
cd "$PROJECT_DIR"

# Función para verificar estado de Firebase
check_firebase_status() {
    echo "[$TIMESTAMP] Verificando estado completo de Firebase..." >> logs/hooks.log
    
    if command -v firebase &> /dev/null; then
        # Verificar proyecto
        if firebase projects:list --format=json | jq -r '.[] | select(.projectId=="liquidacionapp-62962") | .lifecycleState' | grep -q "ACTIVE"; then
            echo "[$TIMESTAMP] ✅ Proyecto Firebase activo" >> logs/hooks.log
            
            # Verificar colecciones críticas de combustibles
            COLLECTIONS=("combustibles_inventory" "combustibles_movements" "combustibles_vehicles")
            for collection in "${COLLECTIONS[@]}"; do
                echo "[$TIMESTAMP] Verificando colección: $collection" >> logs/hooks.log
                # Aquí se podría integrar con Firebase MCP para verificar datos
            done
            
            return 0
        else
            echo "[$TIMESTAMP] ❌ Proyecto Firebase no activo" >> logs/hooks.log
            return 1
        fi
    else
        echo "[$TIMESTAMP] ❌ Firebase CLI no disponible" >> logs/hooks.log
        return 1
    fi
}

# Función para backup inteligente
intelligent_backup() {
    echo "[$TIMESTAMP] Ejecutando backup inteligente..." >> logs/hooks.log
    
    # Crear directorio de backup con timestamp
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup de archivos críticos
    CRITICAL_FILES=("firebase.json" "firestore.rules" "package.json" "CLAUDE.md")
    for file in "${CRITICAL_FILES[@]}"; do
        if [ -f "$file" ]; then
            cp "$file" "$BACKUP_DIR/"
            echo "[$TIMESTAMP] Backup: $file" >> logs/hooks.log
        fi
    done
    
    # Backup de configuraciones de hooks
    if [ -d "hooks" ]; then
        cp -r hooks "$BACKUP_DIR/"
        echo "[$TIMESTAMP] Backup: hooks directory" >> logs/hooks.log
    fi
    
    # Limpiar backups antiguos (más de 30 días)
    find backups -type d -mtime +30 -exec rm -rf {} \; 2>/dev/null || true
    
    echo "[$TIMESTAMP] Backup completado en: $BACKUP_DIR" >> logs/hooks.log
}

# Función para alertas avanzadas
advanced_alerts() {
    local alert_type="$1"
    local message="$2"
    
    echo "[$TIMESTAMP] Procesando alerta avanzada: $alert_type" >> logs/hooks.log
    
    # Crear alerta en archivo específico
    ALERT_FILE="logs/alerts_$(date +%Y%m%d).log"
    echo "[$TIMESTAMP] [$alert_type] $message" >> "$ALERT_FILE"
    
    # Alertas críticas
    if [ "$alert_type" == "CRITICAL" ]; then
        # Crear archivo de alerta crítica
        echo "ALERTA CRÍTICA: $message" > "CRITICAL_ALERT.txt"
        echo "Timestamp: $TIMESTAMP" >> "CRITICAL_ALERT.txt"
        echo "🚨 ALERTA CRÍTICA CREADA: CRITICAL_ALERT.txt"
    fi
    
    # Alertas de performance
    if [ "$alert_type" == "PERFORMANCE" ]; then
        echo "[$TIMESTAMP] PERFORMANCE: $message" >> logs/performance.log
        echo "⚡ Alerta de performance: $message"
    fi
}

# Ejecución principal basada en el tipo de evento
case "$TOOL_NAME" in
    "mcp__firebase__"*)
        echo "[$TIMESTAMP] Operación Firebase detectada" >> logs/hooks.log
        check_firebase_status
        
        # Backup automático antes de operaciones críticas
        if [[ "$TOOL_NAME" == *"delete"* ]] || [[ "$TOOL_NAME" == *"update"* ]]; then
            intelligent_backup
        fi
        ;;
        
    "Edit"|"MultiEdit"|"Write")
        # Backup inteligente para archivos críticos
        if [[ "$TOOL_ARGS" == *"firebase.json"* ]] || [[ "$TOOL_ARGS" == *"firestore.rules"* ]]; then
            intelligent_backup
            advanced_alerts "CRITICAL" "Archivo crítico modificado: $TOOL_ARGS"
        fi
        ;;
        
    "Bash")
        # Monitorear comandos de deploy
        if [[ "$TOOL_ARGS" == *"firebase deploy"* ]]; then
            check_firebase_status
            intelligent_backup
            advanced_alerts "PERFORMANCE" "Deploy iniciado"
        fi
        ;;
esac

# Verificaciones periódicas
if [ "$NOTIFICATION_TYPE" == "error" ]; then
    advanced_alerts "CRITICAL" "Error detectado en el sistema"
fi

# Estadísticas del sistema
echo "[$TIMESTAMP] === ESTADÍSTICAS DEL SISTEMA ===" >> logs/hooks.log
echo "[$TIMESTAMP] Hooks ejecutados hoy: $(grep "$(date +%Y-%m-%d)" logs/hooks.log | wc -l)" >> logs/hooks.log
echo "[$TIMESTAMP] Espacio en disco: $(df -h . | tail -1 | awk '{print $5}')" >> logs/hooks.log
echo "[$TIMESTAMP] Memoria libre: $(free -h | grep Mem | awk '{print $7}')" >> logs/hooks.log

# Log final
echo "[$TIMESTAMP] Firebase MCP Integration completado" >> logs/hooks.log

exit 0