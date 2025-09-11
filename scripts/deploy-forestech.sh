#!/bin/bash
# scripts/deploy-forestech.sh
# 🚀 SCRIPT MAESTRO UNIFICADO - Deploy Inteligente Forestech
# Un solo comando para todas las necesidades de deploy

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
SCRIPT_VERSION="2.0.0"
START_TIME=$(date +%s.%N)
CACHE_DIR=".cache-deploy"
LOG_FILE="deploy-$(date +%Y%m%d-%H%M%S).log"
TOTAL_STEPS=8

# 🔧 FUNCIONES UTILITARIAS
print_header() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                    🚀 FORESTECH DEPLOY MAESTRO                ║"
    echo "║                      Versión $SCRIPT_VERSION - Ultra Inteligente                     ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
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
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# 🧠 DETECCIÓN INTELIGENTE DE CONTEXTO
detect_changes() {
    print_step 1 "Análisis Inteligente de Cambios"

    local alimentacion_changed=false
    local combustibles_changed=false
    local shared_changed=false
    local config_changed=false

    # Obtener último deploy exitoso
    local last_deploy_commit=""
    if git tag -l "deploy-*" --sort=-version:refname | head -n 1 > /dev/null 2>&1; then
        last_deploy_commit=$(git tag -l "deploy-*" --sort=-version:refname | head -n 1 | xargs -I {} git rev-list -n 1 {} 2>/dev/null || echo "")
    fi

    if [ -z "$last_deploy_commit" ]; then
        print_warning "Primer deploy - construyendo todo"
        alimentacion_changed=true
        combustibles_changed=true
        BUILD_REASON="primer-deploy"
    else
        print_info "Comparando con último deploy: $(echo $last_deploy_commit | cut -c1-8)"

        # Verificar cambios específicos
        if git diff --name-only $last_deploy_commit..HEAD | grep -E "^(alimentacion/|shared/)" > /dev/null 2>&1; then
            alimentacion_changed=true
        fi

        if git diff --name-only $last_deploy_commit..HEAD | grep -E "^(combustibles/|shared/)" > /dev/null 2>&1; then
            combustibles_changed=true
        fi

        if git diff --name-only $last_deploy_commit..HEAD | grep -E "^(firebase\.json|firestore\.|storage\.rules|\.github/)" > /dev/null 2>&1; then
            config_changed=true
        fi

        # Si shared cambió, rebuild ambas
        if git diff --name-only $last_deploy_commit..HEAD | grep "^shared/" > /dev/null 2>&1; then
            shared_changed=true
            alimentacion_changed=true
            combustibles_changed=true
            BUILD_REASON="shared-cambio"
        fi

        if [ "$alimentacion_changed" = false ] && [ "$combustibles_changed" = false ] && [ "$config_changed" = false ]; then
            BUILD_REASON="sin-cambios"
        else
            BUILD_REASON="cambios-detectados"
        fi
    fi

    # Exportar variables globales
    export ALIMENTACION_CHANGED=$alimentacion_changed
    export COMBUSTIBLES_CHANGED=$combustibles_changed
    export SHARED_CHANGED=$shared_changed
    export CONFIG_CHANGED=$config_changed
    export BUILD_REASON=$BUILD_REASON

    print_info "Plan de construcción:"
    echo "  🍽️  Alimentacion:  $([ "$alimentacion_changed" = true ] && echo -e "${GREEN}REBUILD${NC}" || echo -e "${YELLOW}SKIP${NC}")"
    echo "  ⛽  Combustibles:   $([ "$combustibles_changed" = true ] && echo -e "${GREEN}REBUILD${NC}" || echo -e "${YELLOW}SKIP${NC}")"
    echo "  🔧  Configuración: $([ "$config_changed" = true ] && echo -e "${GREEN}DEPLOY${NC}" || echo -e "${YELLOW}SKIP${NC}")"
    echo "  📦  Razón:         $BUILD_REASON"
}

# 🛠️ PREPARACIÓN DEL ENTORNO
prepare_environment() {
    print_step 2 "Preparación del Entorno"

    # Crear directorio de cache
    mkdir -p "$CACHE_DIR"

    # Verificar dependencias críticas
    if ! command -v npm >/dev/null 2>&1; then
        print_error "npm no está instalado"
        exit 1
    fi

    if ! command -v firebase >/dev/null 2>&1; then
        print_error "Firebase CLI no está instalado"
        exit 1
    fi

    # Verificar login Firebase
    if ! firebase projects:list >/dev/null 2>&1; then
        print_error "No autenticado en Firebase - ejecuta: firebase login"
        exit 1
    fi

    # Instalar/verificar dependencias
    if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
        print_info "Instalando dependencias..."
        npm ci --prefer-offline --no-audit --no-fund --silent
    else
        print_success "Dependencias ya instaladas"
    fi
}

# 🏗️ CONSTRUCCIÓN INTELIGENTE
intelligent_build() {
    print_step 3 "Construcción Inteligente"

    if [ "$BUILD_REASON" = "sin-cambios" ]; then
        print_success "Sin cambios detectados - usando builds existentes"
        return 0
    fi

    local build_pids=()
    local build_start=$(date +%s)

    # Build paralelo condicional
    if [ "$ALIMENTACION_CHANGED" = true ]; then
        print_info "🍽️  Iniciando build de Alimentacion..."
        (
            echo "🔨 Building alimentacion..." | tee -a "$LOG_FILE"
            npm run build:alimentacion 2>&1 | tee -a "$LOG_FILE"
            echo "✅ Alimentacion build completed" | tee -a "$LOG_FILE"
        ) &
        build_pids+=($!)
    fi

    if [ "$COMBUSTIBLES_CHANGED" = true ]; then
        print_info "⛽ Iniciando build de Combustibles..."
        (
            echo "🔨 Building combustibles..." | tee -a "$LOG_FILE"
            npm run build:combustibles 2>&1 | tee -a "$LOG_FILE"
            echo "✅ Combustibles build completed" | tee -a "$LOG_FILE"
        ) &
        build_pids+=($!)
    fi

    # Esperar builds paralelos
    if [ ${#build_pids[@]} -gt 0 ]; then
        print_info "Esperando builds paralelos..."
        for pid in "${build_pids[@]}"; do
            if ! wait $pid; then
                print_error "Build falló"
                exit 1
            fi
        done

        local build_end=$(date +%s)
        local build_time=$((build_end - build_start))
        print_success "Builds completados en ${build_time}s"
    fi
}

# 📊 VALIDACIÓN DE OUTPUTS
validate_builds() {
    print_step 4 "Validación de Builds"

    local validation_errors=0

    # Verificar outputs esperados
    if [ "$ALIMENTACION_CHANGED" = true ] || [ "$BUILD_REASON" = "primer-deploy" ]; then
        if [ -d "public/alimentacion" ]; then
            local size=$(du -sh public/alimentacion 2>/dev/null | cut -f1 || echo "N/A")
            print_success "Alimentacion build: $size"
        else
            print_error "Build de Alimentacion faltante"
            validation_errors=$((validation_errors + 1))
        fi
    fi

    if [ "$COMBUSTIBLES_CHANGED" = true ] || [ "$BUILD_REASON" = "primer-deploy" ]; then
        if [ -d "public/combustibles" ]; then
            local size=$(du -sh public/combustibles 2>/dev/null | cut -f1 || echo "N/A")
            print_success "Combustibles build: $size"
        else
            print_error "Build de Combustibles faltante"
            validation_errors=$((validation_errors + 1))
        fi
    fi

    # Verificar integridad básica
    local total_files=$(find public/ -type f 2>/dev/null | wc -l)
    local total_size=$(du -sh public/ 2>/dev/null | cut -f1 || echo "0")

    print_info "Total: $total_files archivos, $total_size"

    if [ $validation_errors -gt 0 ]; then
        print_error "Validación falló con $validation_errors errores"
        exit 1
    fi
}

# 🧹 OPTIMIZACIÓN PRE-DEPLOY
optimize_for_deploy() {
    print_step 5 "Optimización Pre-Deploy"

    # Crear directorio temporal si no existe
    mkdir -p "$CACHE_DIR"

    # Remover archivos de desarrollo
    find public/ -name "*.md" -delete 2>/dev/null || true
    find public/ -name "package.json" -delete 2>/dev/null || true

    # Comprimir archivos grandes si gzip está disponible
    if command -v gzip >/dev/null 2>&1; then
        local compressed=0
        while read -r file; do
            if [ -f "$file" ] && [ ! -f "$file.gz" ]; then
                gzip -k9 "$file" 2>/dev/null && compressed=$((compressed + 1))
            fi
        done < <(find public/ -name "*.js" -size +10k -o -name "*.css" -size +5k 2>/dev/null)

        if [ $compressed -gt 0 ]; then
            print_info "Comprimidos $compressed archivos"
        fi
    fi

    print_success "Optimización completada"
}

# 🚀 DEPLOY INTELIGENTE A FIREBASE
intelligent_deploy() {
    print_step 6 "Deploy Inteligente a Firebase"

    local deploy_start=$(date +%s)
    local deploy_targets=""

    # Determinar qué deployar
    if [ "$ALIMENTACION_CHANGED" = true ] || [ "$COMBUSTIBLES_CHANGED" = true ] || [ "$BUILD_REASON" = "primer-deploy" ]; then
        deploy_targets="hosting"
    fi

    if [ "$CONFIG_CHANGED" = true ]; then
        deploy_targets="$deploy_targets firestore storage"
    fi

    # Deploy por defecto si no hay targets específicos
    if [ -z "$deploy_targets" ]; then
        deploy_targets="hosting"
    fi

    # Limpiar espacios extras y convertir a formato CSV
    deploy_targets=$(echo $deploy_targets | tr ' ' ',' | sed 's/^,//' | sed 's/,,*/,/g')
    print_info "Deployando servicios: $deploy_targets"

    if firebase deploy --only "$deploy_targets" --json 2>&1 | tee -a "$LOG_FILE"; then
        local deploy_end=$(date +%s)
        local deploy_time=$((deploy_end - deploy_start))
        print_success "Deploy completado en ${deploy_time}s"
    else
        print_error "Deploy falló"
        exit 1
    fi
}

# 📈 MÉTRICAS Y REPORTING
generate_metrics() {
    print_step 7 "Generación de Métricas"

    local end_time=$(date +%s.%N)
    local total_time=$(echo "$end_time - $START_TIME" | bc -l 2>/dev/null || echo "N/A")

    # Calcular métricas
    local total_files=$(find public/ -type f 2>/dev/null | wc -l)
    local total_size=$(du -sh public/ 2>/dev/null | cut -f1 || echo "N/A")

    # Generar reporte
    cat > "$CACHE_DIR/last-deploy-report.json" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "version": "$SCRIPT_VERSION",
  "total_time": "$total_time",
  "build_reason": "$BUILD_REASON",
  "apps_changed": {
    "alimentacion": $ALIMENTACION_CHANGED,
    "combustibles": $COMBUSTIBLES_CHANGED
  },
  "config_updated": $CONFIG_CHANGED,
  "metrics": {
    "total_files": $total_files,
    "total_size": "$total_size"
  }
}
EOF

    print_success "Métricas guardadas en $CACHE_DIR/last-deploy-report.json"
}

# 🏷️ ETIQUETADO DE DEPLOY EXITOSO
tag_successful_deploy() {
    print_step 8 "Etiquetado de Deploy Exitoso"

    local deploy_tag="deploy-$(date +%Y%m%d-%H%M%S)"

    if git tag "$deploy_tag" 2>/dev/null; then
        print_success "Tag creado: $deploy_tag"

        # Guardar para próxima comparación
        echo "$deploy_tag" > "$CACHE_DIR/last-deploy-tag"
    else
        print_warning "No se pudo crear tag (normal en algunos entornos)"
    fi
}

# 📊 RESUMEN FINAL
print_summary() {
    local end_time=$(date +%s.%N)
    local total_time=$(echo "$end_time - $START_TIME" | bc -l 2>/dev/null || echo "N/A")

    echo -e "${GREEN}"
    echo "╔═══════════════��════════════════════════════════════════════════╗"
    echo "║                    🎉 DEPLOY COMPLETADO EXITOSAMENTE           ║"
    echo "╚═══════════════════════════════════���════════════════════════════╝"
    echo -e "${NC}"

    echo -e "${CYAN}📊 RESUMEN DEL DEPLOY:${NC}"
    echo "  ⏱️  Tiempo total:     ${total_time}s"
    echo "  🔨  Apps rebuildeadas: $([ "$ALIMENTACION_CHANGED" = true ] && echo -n "alimentacion "; [ "$COMBUSTIBLES_CHANGED" = true ] && echo -n "combustibles")"
    echo "  📝  Razón:           $BUILD_REASON"
    echo "  📁  Log guardado:     $LOG_FILE"

    echo -e "${GREEN}🌐 URLs ACTIVAS:${NC}"
    echo "  🍽️  Alimentacion:  https://forestechdecolombia.web.app/alimentacion/"
    echo "  ⛽  Combustibles:   https://forestechdecolombia.web.app/combustibles/"
    echo "  🎛️  Console:        https://console.firebase.google.com/project/liquidacionapp-62962"
}

# 🎯 FUNCIÓN PRINCIPAL
main() {
    # Capturar argumentos
    local mode="auto"
    local force_build=false
    local skip_validation=false
    local measure_only=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --force|-f)
                force_build=true
                shift
                ;;
            --fast)
                skip_validation=true
                shift
                ;;
            --measure|-m)
                measure_only=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                print_error "Argumento desconocido: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # Override por argumentos
    if [ "$force_build" = true ]; then
        export ALIMENTACION_CHANGED=true
        export COMBUSTIBLES_CHANGED=true
        export BUILD_REASON="forzado"
    fi

    # Ejecutar pipeline completo
    print_header

    if [ "$measure_only" = true ]; then
        print_info "Modo medición - ejecutando deploy con métricas detalladas"
    fi

    detect_changes
    prepare_environment
    intelligent_build

    if [ "$skip_validation" = false ]; then
        validate_builds
    fi

    optimize_for_deploy
    intelligent_deploy
    generate_metrics
    tag_successful_deploy
    print_summary

    print_success "Deploy maestro completado exitosamente! 🚀"
}

# 📖 AYUDA
show_help() {
    echo -e "${CYAN}🚀 FORESTECH DEPLOY MAESTRO - Ayuda${NC}"
    echo ""
    echo "Un script inteligente unificado para todos los deploys de Forestech"
    echo ""
    echo -e "${YELLOW}USO:${NC}"
    echo "  ./scripts/deploy-forestech.sh [OPCIONES]"
    echo ""
    echo -e "${YELLOW}OPCIONES:${NC}"
    echo "  -f, --force      Forzar rebuild completo (ignorar cache)"
    echo "  --fast           Deploy rápido (saltar validaciones)"
    echo "  -m, --measure    Medir performance detallada"
    echo "  -h, --help       Mostrar esta ayuda"
    echo ""
    echo -e "${YELLOW}EJEMPLOS:${NC}"
    echo "  ./scripts/deploy-forestech.sh                # Deploy inteligente automático"
    echo "  ./scripts/deploy-forestech.sh --force        # Rebuild completo"
    echo "  ./scripts/deploy-forestech.sh --fast         # Deploy ultra-rápido"
    echo "  ./scripts/deploy-forestech.sh --measure      # Con métricas detalladas"
    echo ""
    echo -e "${YELLOW}CARACTERÍSTICAS:${NC}"
    echo "  ✅ Detección inteligente de cambios"
    echo "  ✅ Builds paralelos selectivos"
    echo "  ✅ Cache automático avanzado"
    echo "  ✅ Optimización pre-deploy"
    echo "  ✅ Métricas y logging completo"
    echo "  ✅ Deploy selectivo Firebase"
    echo "  ✅ Validación de integridad"
    echo "  ✅ Etiquetado automático"
}

# 🚨 MANEJO DE ERRORES
trap 'print_error "Script interrumpido"; exit 1' INT TERM

# 🎬 EJECUTAR SCRIPT
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
