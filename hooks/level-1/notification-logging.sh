#!/bin/bash
# HOOK NIVEL 1: Notification - Log de cambios importantes
# Seguro: Solo registra información, no modifica archivos críticos

set -e  # Salir si hay errores

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
PROJECT_DIR="/home/evert/Documentos/appwebforestech/forestech"

# Variables del hook
NOTIFICATION_TYPE="${NOTIFICATION_TYPE:-info}"
NOTIFICATION_MESSAGE="${NOTIFICATION_MESSAGE:-No message provided}"

# Crear log específico para notificaciones
NOTIFICATION_LOG="$PROJECT_DIR/logs/notifications.log"

# Log de la notificación
echo "[$TIMESTAMP] NOTIFICATION [$NOTIFICATION_TYPE]: $NOTIFICATION_MESSAGE" >> "$NOTIFICATION_LOG"

# Clasificar por tipo de notificación
case "$NOTIFICATION_TYPE" in
    "error")
        echo "[$TIMESTAMP] 🚨 ERROR CRÍTICO: $NOTIFICATION_MESSAGE" >> "$PROJECT_DIR/logs/errors.log"
        # Crear alerta visible en consola
        echo "🚨 ERROR CRÍTICO EN FORESTECH: $NOTIFICATION_MESSAGE"
        ;;
    "warning")
        echo "[$TIMESTAMP] ⚠️ ADVERTENCIA: $NOTIFICATION_MESSAGE" >> "$PROJECT_DIR/logs/warnings.log"
        echo "⚠️ ADVERTENCIA: $NOTIFICATION_MESSAGE"
        ;;
    "success")
        echo "[$TIMESTAMP] ✅ ÉXITO: $NOTIFICATION_MESSAGE" >> "$PROJECT_DIR/logs/success.log"
        echo "✅ ÉXITO: $NOTIFICATION_MESSAGE"
        ;;
    "info")
        echo "[$TIMESTAMP] ℹ️ INFO: $NOTIFICATION_MESSAGE" >> "$PROJECT_DIR/logs/info.log"
        echo "ℹ️ INFO: $NOTIFICATION_MESSAGE"
        ;;
    *)
        echo "[$TIMESTAMP] 📝 GENERAL: $NOTIFICATION_MESSAGE" >> "$PROJECT_DIR/logs/general.log"
        echo "📝 GENERAL: $NOTIFICATION_MESSAGE"
        ;;
esac

# Mantener logs de notificaciones con límite de tamaño
if [ -f "$NOTIFICATION_LOG" ]; then
    # Mantener solo las últimas 1000 líneas
    tail -n 1000 "$NOTIFICATION_LOG" > "$NOTIFICATION_LOG.tmp" && mv "$NOTIFICATION_LOG.tmp" "$NOTIFICATION_LOG"
fi

# Log en archivo principal de hooks
echo "[$TIMESTAMP] Notification procesada: [$NOTIFICATION_TYPE] $NOTIFICATION_MESSAGE" >> "$PROJECT_DIR/logs/hooks.log"

exit 0