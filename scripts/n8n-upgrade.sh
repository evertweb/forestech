#!/usr/bin/env bash
# n8n-upgrade.sh
# Actualiza un despliegue n8n ejecutado con 'docker run' manteniendo rollback sencillo.
# Uso: ./n8n-upgrade.sh <nueva_etiqueta_version>  (ej: ./n8n-upgrade.sh 1.50.1)
# Vars opcionales:
#   N8N_CONTAINER_NAME (default n8n)
#   N8N_BACKUP_FIRST=true (default true)
#   N8N_BACKUP_SCRIPT=./n8n-backup-daily.sh
#   N8N_PORT=5678 (si necesitas cambiar el puerto expuesto)
#   EXTRA_DOCKER_ARGS="--add-host ..."
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "ERROR: Proporcione etiqueta de versión (ej: 1.50.1 o latest)" >&2; exit 1; fi

TARGET_TAG="$1"
CONTAINER_NAME="${N8N_CONTAINER_NAME:-n8n}"
DO_IMAGE="n8nio/n8n:${TARGET_TAG}"
BACKUP_FIRST="${N8N_BACKUP_FIRST:-true}"
BACKUP_SCRIPT="${N8N_BACKUP_SCRIPT:-./scripts/n8n-backup-daily.sh}"
PORT="${N8N_PORT:-5678}"
EXTRA_ARGS="${EXTRA_DOCKER_ARGS:-}"
TS="$(date +%Y%m%d-%H%M%S)"
ROLLBACK_NAME="${CONTAINER_NAME}_old_${TS}"

log(){ echo "[$(date +%H:%M:%S)] $*"; }

require(){ command -v "$1" >/dev/null 2>&1 || { echo "Necesita '$1'" >&2; exit 1; }; }

require docker

# 1. Verificaciones básicas
if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  echo "ERROR: Contenedor $CONTAINER_NAME no está corriendo" >&2; exit 1; fi

CURRENT_IMAGE=$(docker inspect "$CONTAINER_NAME" --format '{{ .Config.Image }}')
log "Imagen actual: $CURRENT_IMAGE"
log "Nueva imagen objetivo: $DO_IMAGE"

# 2. Backup previo
if [ "$BACKUP_FIRST" = "true" ]; then
  if [ -x "$BACKUP_SCRIPT" ]; then
    log "Ejecutando backup previo..."
    "$BACKUP_SCRIPT"
  else
    log "Script de backup no ejecutable/no encontrado ($BACKUP_SCRIPT). Abortando."; exit 1
  fi
else
  log "BACKUP_FIRST=false -> se omite backup (no recomendado)"
fi

# 3. Pull imagen nueva
log "Pull de $DO_IMAGE"
docker pull "$DO_IMAGE"

# 4. Extraer configuración actual (mounts + env)
log "Extrayendo mounts y variables de entorno actuales..."
TMP_DIR=$(mktemp -d)
ENV_FILE="$TMP_DIR/env.list"
MOUNTS_FILE="$TMP_DIR/mounts.txt"

docker inspect "$CONTAINER_NAME" --format '{{range .Config.Env}}{{println .}}{{end}}' > "$ENV_FILE"
# Filtrar variables dinámicas potenciales (opcional)
sed -i '/^HOSTNAME=/d;/^PATH=/d;/^SHLVL=/d;/^HOME=/d' "$ENV_FILE"

docker inspect "$CONTAINER_NAME" --format '{{ json .Mounts }}' | \
  grep -o '{[^}]*}' | sed 's/"Source":"\([^"]*\)".*"Destination":"\([^"]*\)".*/-v \1:\2/' > "$MOUNTS_FILE"

log "Mounts detectados:"; cat "$MOUNTS_FILE"
log "Variables de entorno preservadas:"; cat "$ENV_FILE"

# 5. Parar y renombrar contenedor actual
log "Parando contenedor actual..."
docker stop "$CONTAINER_NAME"
log "Renombrando a $ROLLBACK_NAME"
docker rename "$CONTAINER_NAME" "$ROLLBACK_NAME"

# 6. Lanzar nuevo contenedor con misma configuración
RUN_CMD=(docker run -d --name "$CONTAINER_NAME" --restart unless-stopped -p "${PORT}:5678")
# Añadir mounts
while read -r m; do [ -n "$m" ] && RUN_CMD+=("$m"); done < "$MOUNTS_FILE"
# Añadir envs
while read -r e; do [ -n "$e" ] && RUN_CMD+=(-e "$e"); done < "$ENV_FILE"
# Args extra
if [ -n "$EXTRA_ARGS" ]; then
  # shellcheck disable=SC2206
  EXTRA_SPLIT=($EXTRA_ARGS)
  RUN_CMD+=("${EXTRA_SPLIT[@]}")
fi
RUN_CMD+=("$DO_IMAGE")

log "Ejecutando nuevo contenedor: ${RUN_CMD[*]}"
"${RUN_CMD[@]}"

sleep 5

# 7. Verificación de arranque
if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
  log "FALLO: nuevo contenedor no está arriba. Iniciando rollback..."
  docker rm -f "$CONTAINER_NAME" 2>/dev/null || true
  docker rename "$ROLLBACK_NAME" "$CONTAINER_NAME"
  docker start "$CONTAINER_NAME"
  echo "ROLLBACK ejecutado. Revisión requerida." >&2
  exit 1
fi

log "Logs iniciales (20 líneas):"
docker logs "$CONTAINER_NAME" 2>&1 | tail -n 20

# 8. Test rápido CLI
log "Verificando versión dentro del contenedor..."
NEW_VERSION=$(docker exec "$CONTAINER_NAME" n8n --version 2>/dev/null || echo "desconocida")
log "Versión reportada: $NEW_VERSION"

# 9. Mantener contenedor viejo para rollback manual
log "Upgrade completado. Para rollback rápido:"
cat <<EOF
---
Rollback comandos:
 docker stop $CONTAINER_NAME
 docker rm $CONTAINER_NAME
 docker rename $ROLLBACK_NAME $CONTAINER_NAME
 docker start $CONTAINER_NAME
---
Eliminar contenedor antiguo cuando confirme estabilidad:
 docker rm $ROLLBACK_NAME
---
EOF

# 10. Limpieza temporal
rm -rf "$TMP_DIR"
log "Proceso finalizado."
