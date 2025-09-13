#!/bin/bash
# scripts/post-commit-notify.sh
# 📡 NOTIFICACIONES POST-COMMIT - Envía notificación con información correcta del commit

set -e

# Configuración de webhook
WEBHOOK_URL=${WEBHOOK_URL:-"https://n8n.forestechdecolombia.com.co/webhook/commit-notifications"}

# 🔧 OBTENER INFORMACIÓN CORRECTA DEL COMMIT (AHORA SÍ EXISTE)
commit_hash=$(git rev-parse --short HEAD)
branch_name=$(git branch --show-current 2>/dev/null || echo "unknown")
commit_message=$(git log -1 --pretty=%s)  # ✅ AHORA SÍ FUNCIONA
author_name=$(git log -1 --pretty=%an)
author_email=$(git log -1 --pretty=%ae)
repo_name=$(basename $(git rev-parse --show-toplevel) 2>/dev/null || echo "forestech")
changed_files=$(git diff --name-only HEAD~1 HEAD | wc -l)

# Detectar qué apps fueron afectadas
affected_apps=""
if git diff --name-only HEAD~1 HEAD | grep -q "alimentacion/"; then
    affected_apps="$affected_apps alimentacion"
fi
if git diff --name-only HEAD~1 HEAD | grep -q "combustibles/"; then
    affected_apps="$affected_apps combustibles"
fi
if git diff --name-only HEAD~1 HEAD | grep -q "shared/"; then
    affected_apps="$affected_apps shared"
fi

# Crear payload JSON con información correcta
payload=$(cat <<EOF
{
  "eventType": "commit",
  "status": "success",
  "timestamp": "$(date -Iseconds)",
  "app": "forestech",
  "commit": {
    "hash": "$commit_hash",
    "branch": "$branch_name",
    "message": "$commit_message",
    "author": {
      "name": "$author_name",
      "email": "$author_email"
    },
    "repository": "$repo_name",
    "changedFiles": $changed_files,
    "affectedApps": "$affected_apps"
  },
  "pipeline": {
    "title": "✅ Commit exitoso",
    "message": "Código confirmado y desplegado exitosamente",
    "duration": "0",
    "mode": "post-commit",
    "deployEnabled": "true",
    "details": "Notificación enviada después del commit exitoso"
  },
  "metadata": {
    "scriptVersion": "1.1.0",
    "environment": "post-commit",
    "hostname": "$(hostname)",
    "user": "$(whoami)"
  }
}
EOF
)

# Enviar notificación
echo "📡 Enviando notificación con información correcta del commit..."
if curl -s -S -X POST \
    -H "Content-Type: application/json" \
    -H "User-Agent: Forestech-PostCommit/1.1.0" \
    --max-time 10 \
    --connect-timeout 5 \
    -d "$payload" \
    "$WEBHOOK_URL" > /tmp/post-commit-response.log 2>&1; then
    echo "✅ Notificación enviada exitosamente"
else
    echo "⚠️ Falló el envío de notificación (no afecta el commit)"
fi

# Limpiar logs
rm -f /tmp/post-commit-response.log
