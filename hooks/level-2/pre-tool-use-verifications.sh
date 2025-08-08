#!/bin/bash
# HOOK NIVEL 2: PreToolUse - Verificaciones antes de operaciones críticas
# Intermedio: Verificaciones de estado antes de ejecutar herramientas

set -e  # Salir si hay errores

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
PROJECT_DIR="/home/hp/Documents/forestech"

# Variables del hook
TOOL_NAME="${TOOL_NAME:-unknown}"
TOOL_ARGS="${TOOL_ARGS:-unknown}"

# Log de inicio
echo "[$TIMESTAMP] PreToolUse Hook - Tool: $TOOL_NAME" >> "$PROJECT_DIR/logs/hooks.log"

# Cambiar al directorio del proyecto
cd "$PROJECT_DIR"

# Verificaciones específicas por herramienta
case "$TOOL_NAME" in
    "mcp__firebase__*")
        echo "[$TIMESTAMP] Verificando conectividad Firebase..." >> logs/hooks.log
        
        # Verificar si Firebase CLI está disponible
        if command -v firebase &> /dev/null; then
            # Verificar autenticación
            if ! firebase projects:list --format=json &>/dev/null; then
                echo "[$TIMESTAMP] ⚠️ Firebase no autenticado" >> logs/hooks.log
                echo "⚠️ Firebase no autenticado - algunas operaciones pueden fallar"
            else
                # Verificar proyecto específico
                if firebase projects:list --format=json | jq -r '.[] | select(.projectId=="liquidacionapp-62962") | .lifecycleState' | grep -q "ACTIVE"; then
                    echo "[$TIMESTAMP] ✅ Firebase proyecto activo" >> logs/hooks.log
                else
                    echo "[$TIMESTAMP] ⚠️ Proyecto Firebase no activo" >> logs/hooks.log
                    echo "⚠️ Proyecto Firebase liquidacionapp-62962 no está activo"
                fi
            fi
        else
            echo "[$TIMESTAMP] ⚠️ Firebase CLI no disponible" >> logs/hooks.log
        fi
        ;;
        
    "Edit"|"MultiEdit"|"Write")
        echo "[$TIMESTAMP] Verificando estado antes de editar..." >> logs/hooks.log
        
        # Verificar que no hay builds en progreso
        if pgrep -f "npm run build" > /dev/null; then
            echo "[$TIMESTAMP] ⚠️ Build en progreso detectado" >> logs/hooks.log
            echo "⚠️ Build en progreso - la edición puede interferir"
        fi
        
        # Verificar espacio en disco (solo si es crítico)
        DISK_USAGE=$(df . | tail -1 | awk '{print $5}' | sed 's/%//')
        if [ "$DISK_USAGE" -gt 90 ]; then
            echo "[$TIMESTAMP] ⚠️ Espacio en disco bajo: $DISK_USAGE%" >> logs/hooks.log
            echo "⚠️ Espacio en disco bajo: $DISK_USAGE%"
        fi
        ;;
        
    "Bash")
        echo "[$TIMESTAMP] Verificando comando bash..." >> logs/hooks.log
        
        # Verificar comandos potencialmente peligrosos
        if [[ "$TOOL_ARGS" == *"rm -rf"* ]] || [[ "$TOOL_ARGS" == *"sudo"* ]]; then
            echo "[$TIMESTAMP] ⚠️ Comando potencialmente peligroso detectado" >> logs/hooks.log
            echo "⚠️ Comando potencialmente peligroso detectado"
        fi
        
        # Verificar si es un comando de deploy
        if [[ "$TOOL_ARGS" == *"firebase deploy"* ]]; then
            echo "[$TIMESTAMP] 🚀 Deploy detectado" >> logs/hooks.log
            echo "🚀 Deploy iniciado - verificando estado..."
        fi
        ;;
esac

# Log final
echo "[$TIMESTAMP] PreToolUse verificaciones completadas" >> logs/hooks.log

exit 0