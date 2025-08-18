# Dockerfile simple que funcionaba antes
FROM n8nio/n8n:latest

# Solo configurar lo esencial
ENV N8N_BASIC_AUTH_ACTIVE=false

# Cloud Run expone el puerto en la variable PORT (por defecto 8080).
# Haz que n8n escuche en ese puerto y en todas las interfaces.
ENV N8N_PORT=8080
ENV N8N_LISTEN_ADDRESS=0.0.0.0
ENV N8N_HOST=n8n-713969639058.us-central1.run.app

# URL externa pública de tu servicio (usada para webhooks y redirecciones)
ENV N8N_PROTOCOL=https
ENV WEBHOOK_URL=https://n8n-713969639058.us-central1.run.app
ENV N8N_EDITOR_BASE_URL=https://n8n-713969639058.us-central1.run.app


