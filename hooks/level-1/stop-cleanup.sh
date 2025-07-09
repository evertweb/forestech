#!/bin/bash
# HOOK NIVEL 1: Stop - Cleanup automático al finalizar sesión
# Seguro: Solo limpia archivos temporales conocidos

set -e  # Salir si hay errores

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
PROJECT_DIR="/home/evert/Documentos/appwebforestech/forestech"

# Log de inicio
echo "[$TIMESTAMP] Stop Hook - Iniciando cleanup automático..." >> "$PROJECT_DIR/logs/hooks.log"

# Cambiar al directorio del proyecto
cd "$PROJECT_DIR"

# Contador de archivos limpiados
CLEANED_COUNT=0

# Limpiar archivos temporales seguros
echo "[$TIMESTAMP] Limpiando archivos temporales..." >> logs/hooks.log

# Archivos .tmp
if find . -name "*.tmp" -type f 2>/dev/null; then
    TEMP_COUNT=$(find . -name "*.tmp" -type f | wc -l)
    find . -name "*.tmp" -type f -delete 2>/dev/null || true
    CLEANED_COUNT=$((CLEANED_COUNT + TEMP_COUNT))
fi

# Archivos .DS_Store (macOS)
if find . -name ".DS_Store" -type f 2>/dev/null; then
    DS_COUNT=$(find . -name ".DS_Store" -type f | wc -l)
    find . -name ".DS_Store" -type f -delete 2>/dev/null || true
    CLEANED_COUNT=$((CLEANED_COUNT + DS_COUNT))
fi

# Archivos de log antiguos (más de 7 días)
if find logs -name "*.log" -type f -mtime +7 2>/dev/null; then
    OLD_LOG_COUNT=$(find logs -name "*.log" -type f -mtime +7 | wc -l)
    find logs -name "*.log" -type f -mtime +7 -delete 2>/dev/null || true
    CLEANED_COUNT=$((CLEANED_COUNT + OLD_LOG_COUNT))
fi

# Actualizar timestamp en CLAUDE.md
if [ -f "CLAUDE.md" ]; then
    sed -i "s/Última actualización: .*/Última actualización: $(date +'%B %Y') - Sesión completada automáticamente/" CLAUDE.md 2>/dev/null || true
    echo "[$TIMESTAMP] Timestamp actualizado en CLAUDE.md" >> logs/hooks.log
fi

# Log final
echo "[$TIMESTAMP] Cleanup completado - $CLEANED_COUNT archivos limpiados" >> logs/hooks.log
echo "[$TIMESTAMP] Sesión Claude Code finalizada correctamente" >> logs/hooks.log

exit 0