#!/bin/bash
# Prueba rápida del webhook de commit notifications

echo "🧪 Probando webhook de commit notifications..."

curl -X POST https://n8n.forestechdecolombia.com.co/webhook/commit-notifications \
-H "Content-Type: application/json" \
-H "User-Agent: Forestech-PreCommit/1.1.0" \
-d '{
  "eventType": "commit",
  "status": "success",
  "timestamp": "'$(date -Iseconds)'",
  "app": "forestech",
  "commit": {
    "hash": "test123",
    "branch": "feature/webhook-test",
    "message": "test: webhook integration",
    "author": {
      "name": "Test User",
      "email": "test@forestech.com"
    },
    "repository": "forestech",
    "changedFiles": 3,
    "affectedApps": "combustibles shared"
  },
  "pipeline": {
    "title": "✅ Pre-commit EXITOSO",
    "message": "Deploy automático completado",
    "duration": "15.4",
    "mode": "test",
    "deployEnabled": "true",
    "details": "Prueba de integración webhook"
  },
  "metadata": {
    "scriptVersion": "1.1.0",
    "environment": "test",
    "hostname": "'$(hostname)'",
    "user": "'$(whoami)'"
  }
}'

echo -e "\n✅ Prueba enviada. Revisa Telegram para verificar que llegó la notificación."
