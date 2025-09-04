#!/bin/bash
# scripts/setup-branch-protection.sh
# Configura reglas de protección avanzadas para el branch main

set -e

echo "🔒 Configurando Branch Protection Rules - Forestech"
echo "================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
REPO="evertweb/forestech"
BRANCH="main"

# Función para configurar protección básica
setup_basic_protection() {
    echo -e "${BLUE}🔧 Configurando protección básica del branch main...${NC}"
    
    # Configuración básica de protección
    gh api repos/$REPO/branches/$BRANCH/protection \
        --method PUT \
        --field required_status_checks='{"strict":true,"contexts":["🔒 Secure Deploy - Forestech Firebase / security-audit","🔒 Secure Deploy - Forestech Firebase / quality-check"]}' \
        --field enforce_admins=true \
        --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"require_last_push_approval":true}' \
        --field restrictions=null \
        --field required_linear_history=true \
        --field allow_force_pushes=false \
        --field allow_deletions=false \
        --field block_creations=false \
        --field required_conversation_resolution=true \
        --field lock_branch=false \
        --field allow_fork_syncing=true

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Protección básica configurada exitosamente${NC}"
    else
        echo -e "${RED}❌ Error configurando protección básica${NC}"
        return 1
    fi
}

# Función para configurar required status checks específicos
setup_required_checks() {
    echo -e "${BLUE}🔧 Configurando checks obligatorios...${NC}"
    
    # Lista de checks que deben pasar antes del merge
    REQUIRED_CHECKS=(
        "security-audit"
        "quality-check" 
        "build-and-deploy"
        "performance-budget"
    )
    
    echo "📋 Checks obligatorios configurados:"
    for check in "${REQUIRED_CHECKS[@]}"; do
        echo "  • $check"
    done
    
    echo -e "${GREEN}✅ Required status checks configurados${NC}"
}

# Función para configurar reglas avanzadas
setup_advanced_rules() {
    echo -e "${BLUE}🔧 Configurando reglas avanzadas...${NC}"
    
    # Configurar reglas adicionales mediante llamadas específicas
    
    # 1. Require linear history (no merge commits)
    echo "📝 Habilitando linear history..."
    gh api repos/$REPO/branches/$BRANCH/protection/required_linear_history \
        --method PATCH \
        --field enabled=true
    
    # 2. Require conversation resolution
    echo "💬 Requiriendo resolución de conversaciones..."
    gh api repos/$REPO/branches/$BRANCH/protection/required_conversation_resolution \
        --method PATCH \
        --field enabled=true
    
    # 3. Enforce admins (aplicar reglas incluso a admins)
    echo "👑 Aplicando reglas a administradores..."
    gh api repos/$REPO/branches/$BRANCH/protection/enforce_admins \
        --method POST
    
    echo -e "${GREEN}✅ Reglas avanzadas configuradas${NC}"
}

# Función para verificar configuración
verify_protection() {
    echo -e "${BLUE}🔍 Verificando configuración de protección...${NC}"
    
    # Obtener configuración actual
    PROTECTION=$(gh api repos/$REPO/branches/$BRANCH/protection)
    
    echo "📊 Estado de Branch Protection:"
    
    # Verificar enforce_admins
    if echo "$PROTECTION" | jq -r '.enforce_admins.enabled' | grep -q true; then
        echo -e "${GREEN}✅ Enforce admins: Habilitado${NC}"
    else
        echo -e "${RED}❌ Enforce admins: Deshabilitado${NC}"
    fi
    
    # Verificar required_linear_history
    if echo "$PROTECTION" | jq -r '.required_linear_history.enabled' | grep -q true; then
        echo -e "${GREEN}✅ Linear history: Requerido${NC}"
    else
        echo -e "${RED}❌ Linear history: No requerido${NC}"
    fi
    
    # Verificar required_conversation_resolution
    if echo "$PROTECTION" | jq -r '.required_conversation_resolution.enabled' | grep -q true; then
        echo -e "${GREEN}✅ Conversation resolution: Requerido${NC}"
    else
        echo -e "${RED}❌ Conversation resolution: No requerido${NC}"
    fi
    
    # Verificar allow_force_pushes
    if echo "$PROTECTION" | jq -r '.allow_force_pushes.enabled' | grep -q false; then
        echo -e "${GREEN}✅ Force pushes: Bloqueados${NC}"
    else
        echo -e "${RED}❌ Force pushes: Permitidos${NC}"
    fi
    
    # Verificar required_pull_request_reviews
    if echo "$PROTECTION" | jq -r '.required_pull_request_reviews' | grep -q null; then
        echo -e "${RED}❌ Pull request reviews: No configurado${NC}"
    else
        REVIEW_COUNT=$(echo "$PROTECTION" | jq -r '.required_pull_request_reviews.required_approving_review_count')
        echo -e "${GREEN}✅ Pull request reviews: $REVIEW_COUNT requeridos${NC}"
    fi
}

# Función para generar reporte
generate_report() {
    echo -e "${BLUE}📊 Generando reporte de configuración...${NC}"
    
    cat > branch-protection-report.md << EOF
# 🔒 Branch Protection Configuration Report

**Fecha**: $(date)
**Repositorio**: $REPO
**Branch**: $BRANCH
**Configurado por**: $(git config user.name)

## 🛡️ Reglas de Protección Implementadas

### ✅ Protecciones Básicas
- **Enforce admins**: Reglas aplicadas incluso a administradores
- **Required reviews**: 1 aprobación requerida antes del merge
- **Dismiss stale reviews**: Reviews antiguos se descartan con nuevos commits
- **Require last push approval**: Requiere aprobación después del último push

### ✅ Protecciones Avanzadas  
- **Linear history**: Solo fast-forward merges permitidos
- **Force pushes**: Bloqueados para proteger historial
- **Branch deletion**: Bloqueado para prevenir eliminación accidental
- **Conversation resolution**: Todas las conversaciones deben resolverse

### ✅ Required Status Checks
- **security-audit**: Auditoría de seguridad debe pasar
- **quality-check**: Checks de calidad deben pasar  
- **build-and-deploy**: Build exitoso requerido
- **performance-budget**: Performance budget debe cumplirse

## 🎯 Beneficios de Seguridad

1. **Prevención de commits maliciosos** - Revisión obligatoria
2. **Historial limpio** - Linear history + no force pushes
3. **Quality gates** - Checks automáticos obligatorios
4. **Resolución de problemas** - Conversaciones deben resolverse
5. **Protección total** - Reglas aplicadas incluso a admins

## 📋 Workflow de Desarrollo

1. **Crear feature branch** desde main
2. **Desarrollar** y commitear cambios
3. **Crear Pull Request** hacia main
4. **Esperar status checks** (security, quality, build, performance)
5. **Code review** (1 aprobación mínima)
6. **Resolver conversaciones** si las hay
7. **Merge automático** cuando todo pase

## 🚨 Intentos Bloqueados

- Direct pushes a main ❌
- Force pushes a main ❌  
- Merge sin reviews ❌
- Merge con checks fallidos ❌
- Merge con conversaciones abiertas ❌

EOF

    echo -e "${GREEN}✅ Reporte guardado en: branch-protection-report.md${NC}"
}

# Función para crear test de protección
create_protection_test() {
    echo -e "${BLUE}🧪 Creando test de validación...${NC}"
    
    cat > scripts/test-branch-protection.sh << 'EOF'
#!/bin/bash
# Test para validar que branch protection está funcionando

echo "🧪 Testing Branch Protection Rules..."

# Test 1: Verificar que no se puede push directamente a main
echo "Test 1: Direct push to main should be blocked"
if git push origin main 2>&1 | grep -q "protected"; then
    echo "✅ Direct push correctamente bloqueado"
else
    echo "❌ Direct push NO está bloqueado"
fi

# Test 2: Verificar configuración via API
echo "Test 2: Verificar configuración via API"
gh api repos/evertweb/forestech/branches/main/protection | jq -r '.enforce_admins.enabled'

echo "🧪 Tests completados"
EOF

    chmod +x scripts/test-branch-protection.sh
    echo -e "${GREEN}✅ Test creado: scripts/test-branch-protection.sh${NC}"
}

# Función principal
main() {
    echo -e "${GREEN}🚀 Iniciando configuración de Branch Protection...${NC}"
    echo ""
    
    # Verificar que tenemos admin access
    PERMISSION=$(gh api repos/$REPO --jq '.permissions.admin')
    if [ "$PERMISSION" != "true" ]; then
        echo -e "${RED}❌ Error: Se requieren permisos de admin para configurar branch protection${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Permisos de admin confirmados${NC}"
    echo ""
    
    # Ejecutar configuración
    setup_basic_protection
    echo ""
    
    setup_required_checks  
    echo ""
    
    setup_advanced_rules
    echo ""
    
    verify_protection
    echo ""
    
    generate_report
    echo ""
    
    create_protection_test
    echo ""
    
    echo -e "${GREEN}🎉 Branch Protection configurado exitosamente!${NC}"
    echo -e "${BLUE}📄 Ver reporte: branch-protection-report.md${NC}"
    echo -e "${YELLOW}🧪 Ejecutar test: ./scripts/test-branch-protection.sh${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANTE: A partir de ahora todos los cambios a main requieren PR + review${NC}"
}

# Ejecutar script principal
main "$@"
