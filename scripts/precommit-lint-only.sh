#!/bin/bash
# scripts/precommit-lint-only.sh
# 🚀 PRECOMMIT SCRIPT - Solo Lint (Sin Deploy Automático)
# Ejecuta validaciones rápidas antes del commit

set -e

# 🎨 COLORES
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 📊 CONFIGURACIÓN
SCRIPT_VERSION="1.0.0"
START_TIME=$(date +%s)

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════╗"
    echo "║          🚀 FORESTECH PRECOMMIT LINT         ║"
    echo "║              Solo Validación de Código       ║"
    echo "╚══════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 🚀 MAIN
main() {
    print_header

    echo "🔍 Ejecutando validaciones rápidas de código..."
    echo "⏱️ Tiempo estimado: ~15-30 segundos"
    echo

    # 1. Verificar que estamos en el directorio correcto
    if [ ! -f "package.json" ]; then
        print_error "No se encuentra package.json. Ejecuta desde la raíz del proyecto."
        exit 1
    fi

    # 2. Lint Combustibles (rápido)
    echo "🔍 Validando Combustibles..."
    START_LINT=$(date +%s)
    if npm run lint:combustibles > /dev/null 2>&1; then
        END_LINT=$(date +%s)
        DURATION_LINT=$((END_LINT - START_LINT))
        print_success "Combustibles: Lint OK (${DURATION_LINT}s)"
    else
        print_error "Combustibles: Errores de lint encontrados"
        echo "💡 Ejecuta: cd combustibles && npm run lint:fix"
        echo "💡 O ejecuta: npm run lint:combustibles (para ver detalles)"
        exit 1
    fi

    # 3. Lint Alimentacion (rápido)
    echo "🔍 Validando Alimentacion..."
    START_LINT=$(date +%s)
    if npm run lint:alimentacion > /dev/null 2>&1; then
        END_LINT=$(date +%s)
        DURATION_LINT=$((END_LINT - START_LINT))
        print_success "Alimentacion: Lint OK (${DURATION_LINT}s)"
    else
        print_error "Alimentacion: Errores de lint encontrados"
        echo "💡 Ejecuta: cd alimentacion && npm run lint:fix"
        echo "💡 O ejecuta: npm run lint:alimentacion (para ver detalles)"
        exit 1
    fi

    # 4. Calcular tiempo total
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))

    echo
    print_success "✅ Todas las validaciones pasaron!"
    echo "⏱️ Tiempo total: ${DURATION}s"
    echo
    echo "🎯 Listo para commit. El deploy será manual cuando lo decidas."
    echo "🚀 Para deploy: Ve a GitHub Actions → 'Forestech Manual Deploy TURBO'"
    echo "🏷️ Para deploy automático: Crea un release/tag"
}

# Ejecutar main
main "$@"