#!/usr/bin/env bash
# n8n-backup-daily.sh
# Realiza backup de workflows, credenciales (si hay ENCRYPTION_KEY) y volumen de datos.
# Diseñado para instalación n8n con 'docker run' (contenedor llamado normalmente "n8n").

set -euo pipefail

CONTAINER_NAME="${N8N_CONTAINER_NAME:-n8n}"
BACKUP_ROOT="${N8N_BACKUP_DIR:-/root/n8n-backup}"  # Directorio en host
DATE_STAMP="$(date +%F-%H%M%S)"
TARGET_DIR="$BACKUP_ROOT/$DATE_STAMP"
MIN_FREE_MB=512

log(){ echo "[$(date +%H:%M:%S)] $*"; }

check_prereqs(){
  command -v docker >/dev/null 2>&1 || { echo "ERROR: docker no encontrado" >&2; exit 1; }
  [ -d "$BACKUP_ROOT" ] || mkdir -p "$BACKUP_ROOT"
  local avail_mb
  avail_mb="$(df -Pm "$BACKUP_ROOT" | awk 'NR==2 {print $4}')"
  if [ "${avail_mb:-0}" -lt "$MIN_FREE_MB" ]; then
    echo "ERROR: Espacio libre insuficiente en $BACKUP_ROOT (${avail_mb}MB < ${MIN_FREE_MB}MB)" >&2
    exit 1
  fi
  docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME" || { echo "ERROR: Contenedor $CONTAINER_NAME no está corriendo" >&2; exit 1; }
}

export_workflows(){
  log "Exportando workflows..."
  docker exec "$CONTAINER_NAME" bash -c 'rm -rf /home/node/backup && mkdir -p /home/node/backup' >/dev/null
  docker exec "$CONTAINER_NAME" n8n export:workflow --all --output=/home/node/backup/ >/dev/null
  docker cp "$CONTAINER_NAME":/home/node/backup "$TARGET_DIR"/workflows_raw >/dev/null
}

export_credentials(){
  # Intentar obtener ENCRYPTION KEY del entorno del contenedor (si no está definido externamente)
  local key
  key="${N8N_ENCRYPTION_KEY:-}"
  if [ -z "$key" ]; then
    key=$(docker exec "$CONTAINER_NAME" printenv N8N_ENCRYPTION_KEY || true)
  fi
  if [ -z "$key" ]; then
    log "No se encontró N8N_ENCRYPTION_KEY. Se omite export de credenciales."; return 0; fi
  log "Exportando credenciales..."
  docker exec "$CONTAINER_NAME" bash -c 'rm -rf /home/node/cred && mkdir -p /home/node/cred' >/dev/null
  docker exec -e N8N_ENCRYPTION_KEY="$key" "$CONTAINER_NAME" n8n export:credentials --all --decrypter-key="$key" --output=/home/node/cred/ >/dev/null || {
    log "WARNING: fallo export credenciales"; return 0; }
  docker cp "$CONTAINER_NAME":/home/node/cred "$TARGET_DIR"/credentials_raw >/dev/null
}

backup_volume(){
  log "Detectando volumen de datos..."
  local mount_json host_path
  mount_json=$(docker inspect "$CONTAINER_NAME" --format '{{ json .Mounts }}')
  host_path=$(echo "$mount_json" | grep -o '"Source":"[^"]*"[^}]*"Destination":"/home/node/.n8n"' | head -n1 | sed -E 's/.*"Source":"([^"]*)".*/\1/')
  if [ -z "$host_path" ]; then
    log "ERROR: No se encontró el path del volumen bind para /home/node/.n8n"; return 1; fi
  log "Empaquetando volumen: $host_path"
  tar -C "$host_path/.." -czf "$TARGET_DIR"/n8n-data.tar.gz "$(basename "$host_path")"
}

backup_metadata(){
  log "Guardando metadatos docker..."
  docker ps --no-trunc > "$TARGET_DIR"/docker-ps.txt
  docker images > "$TARGET_DIR"/docker-images.txt
  docker inspect "$CONTAINER_NAME" > "$TARGET_DIR"/container-inspect.json
}

rotate_old(){
  local keep_days="${N8N_BACKUP_KEEP_DAYS:-15}"; log "Rotando backups > ${keep_days}d"
  find "$BACKUP_ROOT" -maxdepth 1 -type d -mtime +"$keep_days" -exec rm -rf {} + 2>/dev/null || true
}

main(){
  check_prereqs
  mkdir -p "$TARGET_DIR"
  export_workflows
  export_credentials
  backup_volume
  backup_metadata
  rotate_old
  log "Backup completado en: $TARGET_DIR"
}

main "$@"

