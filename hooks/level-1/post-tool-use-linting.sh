#!/bin/bash
# HOOK NIVEL 1: PostToolUse - Linting automático después de editar archivos
# Seguro: Solo ejecuta linting, no modifica archivos críticos

set -e  # Salir si hay errores

# Obtener información del hook
TOOL_NAME="${TOOL_NAME:-unknown}"
FILE_PATH="${FILE_PATH:-unknown}"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Log de la operación
echo "[$TIMESTAMP] PostToolUse Hook - Tool: $TOOL_NAME, File: $FILE_PATH" >> /home/evert/Documentos/appwebforestech/forestech/logs/hooks.log

# Solo proceder si fue una edición de archivo
if [[ "$TOOL_NAME" == "Edit" ]] || [[ "$TOOL_NAME" == "MultiEdit" ]] || [[ "$TOOL_NAME" == "Write" ]]; then
    
    # Cambiar al directorio del proyecto
    cd /home/evert/Documentos/appwebforestech/forestech
    
    # Linting automático para archivos de combustibles
    if [[ "$FILE_PATH" == *"combustibles"* ]] && [[ "$FILE_PATH" == *".jsx"* ]]; then
        echo "[$TIMESTAMP] Ejecutando linting automático para combustibles..." >> logs/hooks.log
        
        # Ejecutar linting con auto-fix (solo si el comando existe)
        if command -v npm &> /dev/null; then
            npm run lint:combustibles --fix --silent 2>/dev/null || {
                echo "[$TIMESTAMP] Warning: lint:combustibles falló o no está disponible" >> logs/hooks.log
            }
        fi
    fi
    
    # Linting automático para archivos de alimentación
    if [[ "$FILE_PATH" == *"alimentacion"* ]] && [[ "$FILE_PATH" == *".jsx"* ]]; then
        echo "[$TIMESTAMP] Ejecutando linting automático para alimentación..." >> logs/hooks.log
        
        if command -v npm &> /dev/null; then
            npm run lint:alimentacion --fix --silent 2>/dev/null || {
                echo "[$TIMESTAMP] Warning: lint:alimentacion falló o no está disponible" >> logs/hooks.log
            }
        fi
    fi
    
    echo "[$TIMESTAMP] Linting automático completado" >> logs/hooks.log
fi

exit 0