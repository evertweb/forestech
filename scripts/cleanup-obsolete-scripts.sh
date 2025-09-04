#!/bin/bash
# scripts/cleanup-obsolete-scripts.sh
# Eliminar scripts obsoletos y redundantes del proyecto

set -e

echo "🧹 Limpieza de Scripts Obsoletos - Forestech"
echo "=========================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Lista de scripts obsoletos a eliminar
declare -a OBSOLETE_SCRIPTS=(
    "build-single.sh"                    # Reemplazado por build-incremental.sh
    "verificar-ssr.sh"                   # Reemplazado por verify-ssr-system.sh  
    "configure-remote-config.mjs"        # Versión antigua, usar v2
    "setup-login-background.sh"          # Redundante con create-login-background.sh
    "upload-background-image.js"         # Funcionalidad integrada en otros scripts
    "run-lighthouse-baseline.js"         # Reemplazado por performance-budget-check.sh
    "setup-notion.sh"                    # No usado en el proyecto actual
)

# Lista de scripts mantenidos (para referencia)
declare -a MAINTAINED_SCRIPTS=(
    "performance-budget-check.sh"        # Sistema de performance budget
    "optimize-performance.sh"            # Optimización automática
    "security-audit.sh"                  # Auditoría de seguridad CI/CD
    "validate-pipeline.sh"               # Validación de pipeline
    "deploy-smart.sh"                    # Deployment inteligente
    "build-incremental.sh"               # Builds incrementales optimizados
    "clean-cache.sh"                     # Limpieza de cache
    "verify-ssr-system.sh"               # Verificación SSR completa
    "configure-remote-config-v2.mjs"     # Configuración remote config actual
    "create-login-background.sh"         # Creación de backgrounds
    "activate-ssr-production.sh"         # Activación SSR producción
    "activate-ssr-permanent-manual.sh"   # Activación SSR manual
    "generate-favicons.js"               # Generación de favicons
    "generate-ico.js"                    # Generación de archivos ICO
    "setup-firebase-cors.sh"             # Configuración CORS Firebase
    "update-remote-config.js"            # Actualización remote config
    "verify-seo.sh"                      # Verificación SEO
)

# Función para crear backup antes de eliminar
create_backup() {
    echo -e "${BLUE}📦 Creando backup de scripts obsoletos...${NC}"
    
    BACKUP_DIR="scripts/backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    for script in "${OBSOLETE_SCRIPTS[@]}"; do
        if [ -f "scripts/$script" ]; then
            cp "scripts/$script" "$BACKUP_DIR/"
            echo "  ✅ Backup: $script"
        fi
    done
    
    echo -e "${GREEN}✅ Backup creado en: $BACKUP_DIR${NC}"
}

# Función para eliminar scripts obsoletos
remove_obsolete_scripts() {
    echo -e "${BLUE}🗑️ Eliminando scripts obsoletos...${NC}"
    
    local removed_count=0
    
    for script in "${OBSOLETE_SCRIPTS[@]}"; do
        if [ -f "scripts/$script" ]; then
            echo -e "${YELLOW}🗑️ Eliminando: $script${NC}"
            
            # Mostrar resumen del script antes de eliminar
            echo "   📄 $(head -n 3 "scripts/$script" | tail -n 1 | sed 's/^# *//')"
            
            rm "scripts/$script"
            removed_count=$((removed_count + 1))
            echo -e "${RED}   ❌ Eliminado${NC}"
        else
            echo -e "${YELLOW}⚠️ No encontrado: $script${NC}"
        fi
    done
    
    echo ""
    echo -e "${GREEN}✅ Scripts eliminados: $removed_count${NC}"
}

# Función para mostrar scripts mantenidos
show_maintained_scripts() {
    echo -e "${BLUE}📋 Scripts mantenidos en el proyecto:${NC}"
    echo ""
    
    for script in "${MAINTAINED_SCRIPTS[@]}"; do
        if [ -f "scripts/$script" ]; then
            # Obtener descripción del script
            description=$(head -n 5 "scripts/$script" | grep -E "^#.*" | tail -n 1 | sed 's/^# *//')
            echo -e "${GREEN}✅ $script${NC}"
            echo -e "${YELLOW}   📄 $description${NC}"
        else
            echo -e "${RED}❌ $script (NO ENCONTRADO)${NC}"
        fi
    done
}

# Función para generar reporte de limpieza
generate_cleanup_report() {
    echo -e "${BLUE}📊 Generando reporte de limpieza...${NC}"
    
    cat > scripts-cleanup-report.md << EOF
# 🧹 Scripts Cleanup Report

**Fecha**: $(date)
**Commit**: $(git rev-parse --short HEAD)
**Branch**: $(git branch --show-current)

## 🗑️ Scripts Eliminados

### Scripts Obsoletos Removidos:
$(for script in "${OBSOLETE_SCRIPTS[@]}"; do echo "- \`$script\`"; done)

**Total eliminados**: ${#OBSOLETE_SCRIPTS[@]} scripts

## ✅ Scripts Mantenidos

### Scripts Activos en Producción:
$(for script in "${MAINTAINED_SCRIPTS[@]}"; do echo "- \`$script\`"; done)

**Total mantenidos**: ${#MAINTAINED_SCRIPTS[@]} scripts

## 📊 Estadísticas

- **Reducción de archivos**: ${#OBSOLETE_SCRIPTS[@]} archivos eliminados
- **Scripts activos**: ${#MAINTAINED_SCRIPTS[@]} scripts mantenidos
- **Optimización**: $(( ${#OBSOLETE_SCRIPTS[@]} * 100 / (${#OBSOLETE_SCRIPTS[@]} + ${#MAINTAINED_SCRIPTS[@]}) ))% de reducción

## 🎯 Beneficios

1. **Claridad**: Elimina confusión sobre qué scripts usar
2. **Mantenimiento**: Reduce superficie de código a mantener
3. **Performance**: Menos archivos en el repositorio
4. **CI/CD**: Pipeline más limpio y rápido

## 🔗 Scripts de Reemplazo

- \`build-single.sh\` → \`build-incremental.sh\` (builds inteligentes)
- \`verificar-ssr.sh\` → \`verify-ssr-system.sh\` (verificación completa)
- \`configure-remote-config.mjs\` → \`configure-remote-config-v2.mjs\` (versión actualizada)
- \`setup-login-background.sh\` → \`create-login-background.sh\` (más funciones)
- \`run-lighthouse-baseline.js\` → \`performance-budget-check.sh\` (sistema completo)

EOF

    echo -e "${GREEN}✅ Reporte guardado en: scripts-cleanup-report.md${NC}"
}

# Función para verificar dependencias
check_dependencies() {
    echo -e "${BLUE}🔍 Verificando dependencias en scripts eliminados...${NC}"
    
    # Buscar referencias a scripts obsoletos en el código
    echo "📋 Buscando referencias en package.json, workflows, etc..."
    
    for script in "${OBSOLETE_SCRIPTS[@]}"; do
        script_name=$(basename "$script" .sh)
        script_name=$(basename "$script_name" .js)
        script_name=$(basename "$script_name" .mjs)
        
        # Buscar en package.json
        if grep -q "$script_name" package.json combustibles/package.json alimentacion/package.json 2>/dev/null; then
            echo -e "${YELLOW}⚠️ Referencia encontrada en package.json: $script${NC}"
        fi
        
        # Buscar en workflows
        if grep -rq "$script" .github/workflows/ 2>/dev/null; then
            echo -e "${YELLOW}⚠️ Referencia encontrada en workflows: $script${NC}"
        fi
    done
    
    echo -e "${GREEN}✅ Verificación de dependencias completada${NC}"
}

# Función principal
main() {
    echo -e "${GREEN}🚀 Iniciando limpieza de scripts obsoletos...${NC}"
    echo ""
    
    # Verificar que estamos en el directorio correcto
    if [ ! -d "scripts" ]; then
        echo -e "${RED}❌ Error: Directorio scripts/ no encontrado${NC}"
        echo "   Ejecutar desde la raíz del proyecto forestech/"
        exit 1
    fi
    
    # Mostrar scripts que se van a eliminar
    echo -e "${YELLOW}📋 Scripts marcados para eliminación:${NC}"
    for script in "${OBSOLETE_SCRIPTS[@]}"; do
        echo "  • $script"
    done
    echo ""
    
    # Confirmar antes de proceder
    read -p "¿Continuar con la eliminación? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}⏸️ Operación cancelada${NC}"
        exit 0
    fi
    
    # Ejecutar limpieza
    check_dependencies
    echo ""
    
    create_backup
    echo ""
    
    remove_obsolete_scripts
    echo ""
    
    show_maintained_scripts
    echo ""
    
    generate_cleanup_report
    echo ""
    
    echo -e "${GREEN}🎉 Limpieza completada exitosamente!${NC}"
    echo -e "${BLUE}📄 Ver reporte completo: scripts-cleanup-report.md${NC}"
    echo -e "${YELLOW}💾 Backup disponible en: scripts/backup-*${NC}"
}

# Ejecutar script principal
main "$@"
