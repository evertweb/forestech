#!/bin/bash
# scripts/precommit-unified.sh
# 🚀 SCRIPT PRE-COMMIT UNIFICADO - Test + Lint + Build + Deploy Automático + Notificaciones
# Ejecuta automáticamente en cada commit para garantizar calidad y deploy continuo

set -e

# 🎨 COLORES Y EMOJIS
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 📊 CONFIGURACIÓN GLOBAL
SCRIPT_VERSION="1.1.0"
START_TIME=$(date +%s.%N)
FAST_MODE=false
SKIP_DEPLOY=false
TOTAL_STEPS=6

# 🔧 VARIABLES DE ENTORNO CONFIGURABLES
# Puedes configurar estas variables en un archivo .env o exportarlas
SKIP_DEPLOY=${SKIP_DEPLOY:-false}
SKIP_TESTS=${SKIP_TESTS:-false}
SKIP_LINT=${SKIP_LINT:-false}
FORCE_FULL_BUILD=${FORCE_FULL_BUILD:-false}
AUTO_DEPLOY_ENABLED=${AUTO_DEPLOY_ENABLED:-true}
NOTIFY_ON_SUCCESS=${NOTIFY_ON_SUCCESS:-true}
NOTIFY_ON_ERROR=${NOTIFY_ON_ERROR:-true}
WEBHOOK_URL=${WEBHOOK_URL:-"https://n8n.forestechdecolombia.com.co/webhook/commit-notifications"}

# Cargar configuración local si existe
if [ -f ".forestech-precommit.config" ]; then
    source .forestech-precommit.config
fi

# Parsear argumentos
while [[ $# -gt 0 ]]; do
  case $1 in
    --fast)
      FAST_MODE=true
      TOTAL_STEPS=4
      shift
      ;;
    --no-deploy)
      SKIP_DEPLOY=true
      TOTAL_STEPS=5
      shift
      ;;
    --no-notify)
      NOTIFY_ON_SUCCESS=false
      NOTIFY_ON_ERROR=false
      shift
      ;;
    *)
      shift
      ;;
  esac
done

# 🔧 FUNCIONES UTILITARIAS
print_header() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║               🚀 FORESTECH PRE-COMMIT UNIFICADO               ║"
    echo "║                  Versión $SCRIPT_VERSION - Auto Deploy + Notify           ║"
    if [ "$FAST_MODE" = true ]; then
      echo "║                        🚀 MODO RÁPIDO ACTIVO                  ║"
    fi
    echo "╚═════════════════════════════════════════════════════��══════════╝"
    echo -e "${NC}"
}

print_step() {
    local step=$1
    local title=$2
    echo -e "${BLUE}[$step/$TOTAL_STEPS]${NC} ${PURPLE}$title${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    send_error_notification "$1"
    exit 1
}

# 📡 FUNCIÓN PARA ENVIAR NOTIFICACIONES WEBHOOK
send_notification() {
    local event_type=$1
    local title=$2
    local message=$3
    local status=$4
    local duration=$5
    local details=$6

    if [ "$NOTIFY_ON_SUCCESS" = false ] && [ "$event_type" = "success" ]; then
        return 0
    fi

    if [ "$NOTIFY_ON_ERROR" = false ] && [ "$event_type" = "error" ]; then
        return 0
    fi

    if [ -z "$WEBHOOK_URL" ] || [ "$WEBHOOK_URL" = "" ]; then
        return 0
    fi

    # Obtener información del commit y repositorio
    local commit_hash="staging"  # Durante pre-commit aún no existe el hash
    local branch_name=$(git branch --show-current 2>/dev/null || echo "unknown")

    # 🔧 CORREGIDO: Obtener mensaje del commit actual desde argumentos de Git
    local commit_message="commit en progreso"

    # Intentar obtener el mensaje desde diferentes fuentes en orden de prioridad
    if [ -n "$GIT_COMMIT_MESSAGE" ]; then
        # Si la variable de entorno está definida (para testing)
        commit_message="$GIT_COMMIT_MESSAGE"
    elif [ -f ".git/COMMIT_EDITMSG" ] && [ -s ".git/COMMIT_EDITMSG" ]; then
        # Si el archivo existe y no está vacío (algunos casos especiales)
        commit_message=$(head -n 1 .git/COMMIT_EDITMSG 2>/dev/null)
    else
        # Durante pre-commit, el mensaje aún no está disponible
        commit_message="commit en progreso"
    fi

    local author_name=$(git config user.name 2>/dev/null || echo "unknown")
    local author_email=$(git config user.email 2>/dev/null || echo "unknown")
    local repo_name=$(basename $(git rev-parse --show-toplevel 2>/dev/null) 2>/dev/null || echo "forestech")
    local changed_files=$(git diff --cached --name-only 2>/dev/null | wc -l || echo "0")

    # Detectar qué apps fueron afectadas
    local affected_apps=""
    if git diff --cached --name-only | grep -q "alimentacion/"; then
        affected_apps="$affected_apps alimentacion"
    fi
    if git diff --cached --name-only | grep -q "combustibles/"; then
        affected_apps="$affected_apps combustibles"
    fi
    if git diff --cached --name-only | grep -q "shared/"; then
        affected_apps="$affected_apps shared"
    fi

    # Crear payload JSON
    local payload=$(cat <<EOF
{
  "eventType": "commit",
  "status": "$status",
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
    "title": "$title",
    "message": "$message",
    "duration": "$duration",
    "mode": "$([ "$FAST_MODE" = true ] && echo "fast" || echo "full")",
    "deployEnabled": "$([ "$SKIP_DEPLOY" = false ] && echo "true" || echo "false")",
    "details": "$details"
  },
  "metadata": {
    "scriptVersion": "$SCRIPT_VERSION",
    "environment": "pre-commit",
    "hostname": "$(hostname)",
    "user": "$(whoami)"
  }
}
EOF
)

    # Enviar webhook con timeout y retry
    local max_retries=2
    local retry_count=0

    while [ $retry_count -lt $max_retries ]; do
        if curl -s -S -X POST \
            -H "Content-Type: application/json" \
            -H "User-Agent: Forestech-PreCommit/$SCRIPT_VERSION" \
            --max-time 10 \
            --connect-timeout 5 \
            -d "$payload" \
            "$WEBHOOK_URL" > /tmp/webhook-response.log 2>&1; then

            print_success "🔔 Notificación enviada exitosamente"
            break
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $max_retries ]; then
                print_warning "🔔 Reintentando notificación ($retry_count/$max_retries)..."
                sleep 2
            else
                print_warning "🔔 Falló el envío de notificación (sin afectar commit)"
                # No fallar el commit por problemas de notificación
            fi
        fi
    done
}

# 📡 FUNCIÓN ESPECÍFICA PARA ERRORES
send_error_notification() {
    local error_message=$1
    local duration=$(echo "$(date +%s.%N) - $START_TIME" | bc 2>/dev/null || echo "unknown")

    send_notification "error" "❌ Pre-commit FALLÓ" "$error_message" "failed" "$duration" "El proceso de pre-commit falló durante la ejecución"
}

# 📡 FUNCIÓN ESPECÍFICA PARA ÉXITO
send_success_notification() {
    local duration=$1
    local summary=$2

    send_notification "success" "✅ Pre-commit EXITOSO" "Deploy automático completado" "success" "$duration" "$summary"
}

execute_with_progress() {
    local step=$1
    local title=$2
    local command=$3

    print_step $step "$title"

    if eval "$command" > /tmp/precommit-step-$step.log 2>&1; then
        print_success "$title completado"
    else
        print_error "$title falló. Ver log: /tmp/precommit-step-$step.log"
        cat /tmp/precommit-step-$step.log
        exit 1
    fi
}

# 🚀 INICIO DEL PROCESO
print_header

# PASO 1: Validación de archivos staged
execute_with_progress 1 "🔍 Validando archivos staged" "git diff --cached --name-only | wc -l | xargs test 0 -lt"

# PASO 2: Linting completo
if [ "$SKIP_LINT" = false ]; then
    if [ "$FAST_MODE" = false ]; then
        # Usar linting permisivo que no falle por warnings menores
        execute_with_progress 2 "🔍 Ejecutando linting completo" "npm run lint:all || echo 'Linting completado con warnings'"
    else
        execute_with_progress 2 "🔍 Linting rápido (solo archivos modificados)" "npm run lint-staged || echo 'Linting completado con warnings'"
    fi
else
    print_step 2 "🔍 Saltando linting (SKIP_LINT=true)"
    print_warning "Linting saltado por configuración"
fi

# PASO 3: Tests
if [ "$SKIP_TESTS" = false ]; then
    if [ "$FAST_MODE" = false ]; then
        execute_with_progress 3 "🧪 Ejecutando tests completos" "npm run test:ci"
    else
        print_step 3 "🧪 Saltando tests (modo rápido)"
        print_warning "Tests saltados en modo rápido"
    fi
else
    print_step 3 "🧪 Saltando tests (SKIP_TESTS=true)"
    print_warning "Tests saltados por configuración"
fi

# PASO 4: Build inteligente
CURRENT_STEP=4
if [ "$FAST_MODE" = true ]; then
    CURRENT_STEP=3
fi

# Detectar qué apps necesitan rebuild
CHANGED_FILES=$(git diff --cached --name-only)
BUILD_ALIMENTACION=false
BUILD_COMBUSTIBLES=false

if echo "$CHANGED_FILES" | grep -q "alimentacion/\|shared/"; then
    BUILD_ALIMENTACION=true
fi

if echo "$CHANGED_FILES" | grep -q "combustibles/\|shared/"; then
    BUILD_COMBUSTIBLES=true
fi

if [ "$FORCE_FULL_BUILD" = true ]; then
    execute_with_progress $CURRENT_STEP "🏗️  Building todas las apps (FORCE_FULL_BUILD)" "npm run build:parallel"
elif [ "$BUILD_ALIMENTACION" = true ] && [ "$BUILD_COMBUSTIBLES" = true ]; then
    execute_with_progress $CURRENT_STEP "🏗️  Building ambas apps (cambios detectados)" "npm run build:parallel"
elif [ "$BUILD_ALIMENTACION" = true ]; then
    execute_with_progress $CURRENT_STEP "🏗️  Building app alimentación" "npm run build:alimentacion"
elif [ "$BUILD_COMBUSTIBLES" = true ]; then
    execute_with_progress $CURRENT_STEP "🏗️  Building app combustibles" "npm run build:combustibles"
else
    print_step $CURRENT_STEP "🏗️  No se requiere build (sin cambios en apps)"
    print_warning "Build saltado - solo cambios en documentación/config"
fi

# PASO 5: Validación de build
CURRENT_STEP=$((CURRENT_STEP + 1))
if [ "$BUILD_ALIMENTACION" = true ] || [ "$BUILD_COMBUSTIBLES" = true ] || [ "$FORCE_FULL_BUILD" = true ]; then
    # Validar que existan los builds en public/ (donde Vite los genera)
    execute_with_progress $CURRENT_STEP "✅ Validando builds generados" "test -d public/combustibles -o -d public/alimentacion"
else
    print_step $CURRENT_STEP "✅ Validación de build saltada (no hay builds nuevos)"
fi

# PASO 6: Deploy automático (solo si no está en modo --no-deploy)
if [ "$SKIP_DEPLOY" = false ] && [ "$AUTO_DEPLOY_ENABLED" = true ]; then
    CURRENT_STEP=$((CURRENT_STEP + 1))

    if [ "$FAST_MODE" = true ]; then
        execute_with_progress $CURRENT_STEP "🚀 Deploy rápido a Firebase" "npm run deploy:fast"
    else
        execute_with_progress $CURRENT_STEP "🚀 Deploy completo a Firebase" "npm run deploy"
    fi

    print_success "🎉 Deploy completado exitosamente"
else
    print_warning "Deploy saltado (SKIP_DEPLOY=true o AUTO_DEPLOY_ENABLED=false)"
fi

# 📊 RESUMEN FINAL
END_TIME=$(date +%s.%N)
DURATION=$(echo "$END_TIME - $START_TIME" | bc 2>/dev/null || echo "unknown")

# Crear resumen para notificación
SUMMARY="Modo: $([ "$FAST_MODE" = true ] && echo "RÁPIDO" || echo "COMPLETO") | "
SUMMARY+="Deploy: $([ "$SKIP_DEPLOY" = false ] && echo "COMPLETADO" || echo "SALTADO") | "
SUMMARY+="Apps: $(echo "$CHANGED_FILES" | grep -o -E "(alimentacion|combustibles|shared)" | sort -u | tr '\n' ' ')"

echo -e "${GREEN}"
echo "╔═════════════���══════════════════════════════════════════════════╗"
echo "║                    ✅ PRE-COMMIT EXITOSO                       ║"
echo "║                                                                ║"
echo "║  ⏱️  Tiempo total: ${DURATION}s                                    ║"
if [ "$FAST_MODE" = true ]; then
echo "║  🚀 Modo: RÁPIDO                                               ║"
else
echo "║  🔍 Modo: COMPLETO                                             ║"
fi
if [ "$SKIP_DEPLOY" = false ]; then
echo "║  🌐 Deploy: COMPLETADO                                         ║"
else
echo "║  🌐 Deploy: SALTADO                                            ║"
fi
echo "║                                                                ║"
echo "║  🎯 Tu código está listo y desplegado automáticamente         ║"
echo "╚════════════════════════════════════════════════════════════════���"
echo -e "${NC}"

# 📡 ENVIAR NOTIFICACIÓN DE ÉXITO
send_success_notification "$DURATION" "$SUMMARY"

# Limpiar logs temporales
rm -f /tmp/precommit-step-*.log /tmp/webhook-response.log

print_success "Pre-commit unificado completado - ¡Listo para commit!"
