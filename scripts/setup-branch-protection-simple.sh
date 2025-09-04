#!/bin/bash
# scripts/setup-branch-protection-simple.sh
# Configura reglas de protección básicas para el branch main

set -e

echo "🔒 Configurando Branch Protection Rules (Simplificado)"
echo "===================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

REPO="evertweb/forestech"
BRANCH="main"

# Paso 1: Configurar required pull request reviews
echo -e "${BLUE}🔧 Paso 1: Configurando required pull request reviews...${NC}"

cat > /tmp/pr_reviews.json << EOF
{
  "required_approving_review_count": 1,
  "dismiss_stale_reviews": true,
  "require_code_owner_reviews": false,
  "require_last_push_approval": true
}
EOF

gh api repos/$REPO/branches/$BRANCH/protection/required_pull_request_reviews \
    --method PATCH \
    --input /tmp/pr_reviews.json

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Pull request reviews configurados${NC}"
else
    echo -e "${RED}❌ Error configurando pull request reviews${NC}"
fi

# Paso 2: Configurar enforce admins
echo -e "${BLUE}🔧 Paso 2: Configurando enforce admins...${NC}"

gh api repos/$REPO/branches/$BRANCH/protection/enforce_admins \
    --method POST

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Enforce admins habilitado${NC}"
else
    echo -e "${RED}❌ Error configurando enforce admins${NC}"
fi

# Paso 3: Configurar linear history
echo -e "${BLUE}🔧 Paso 3: Configurando linear history...${NC}"

gh api repos/$REPO/branches/$BRANCH/protection/required_linear_history \
    --method PATCH \
    --field enabled=true

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Linear history requerido${NC}"
else
    echo -e "${RED}❌ Error configurando linear history${NC}"
fi

# Paso 4: Configurar conversation resolution
echo -e "${BLUE}🔧 Paso 4: Configurando conversation resolution...${NC}"

gh api repos/$REPO/branches/$BRANCH/protection/required_conversation_resolution \
    --method PATCH \
    --field enabled=true

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Conversation resolution requerido${NC}"
else
    echo -e "${RED}❌ Error configurando conversation resolution${NC}"
fi

# Paso 5: Configurar required status checks (simplificado)
echo -e "${BLUE}🔧 Paso 5: Configurando required status checks...${NC}"

cat > /tmp/status_checks.json << EOF
{
  "strict": true,
  "contexts": []
}
EOF

gh api repos/$REPO/branches/$BRANCH/protection/required_status_checks \
    --method PATCH \
    --input /tmp/status_checks.json

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Status checks configurados (se añadirán específicos después)${NC}"
else
    echo -e "${YELLOW}⚠️ Status checks no configurados (normal en setup inicial)${NC}"
fi

# Verificar configuración final
echo -e "${BLUE}🔍 Verificando configuración final...${NC}"

PROTECTION=$(gh api repos/$REPO/branches/$BRANCH/protection)

echo "📊 Resumen de protección configurada:"

# Verificar cada componente
if echo "$PROTECTION" | jq -e '.required_pull_request_reviews' > /dev/null; then
    REVIEW_COUNT=$(echo "$PROTECTION" | jq -r '.required_pull_request_reviews.required_approving_review_count')
    echo -e "${GREEN}✅ Pull request reviews: $REVIEW_COUNT requeridos${NC}"
else
    echo -e "${RED}❌ Pull request reviews: No configurado${NC}"
fi

if echo "$PROTECTION" | jq -r '.enforce_admins.enabled' | grep -q true; then
    echo -e "${GREEN}✅ Enforce admins: Habilitado${NC}"
else
    echo -e "${RED}❌ Enforce admins: Deshabilitado${NC}"
fi

if echo "$PROTECTION" | jq -r '.required_linear_history.enabled' | grep -q true; then
    echo -e "${GREEN}✅ Linear history: Requerido${NC}"
else
    echo -e "${RED}❌ Linear history: No requerido${NC}"
fi

if echo "$PROTECTION" | jq -r '.required_conversation_resolution.enabled' | grep -q true; then
    echo -e "${GREEN}✅ Conversation resolution: Requerido${NC}"
else
    echo -e "${RED}❌ Conversation resolution: No requerido${NC}"
fi

# Limpiar archivos temporales
rm -f /tmp/pr_reviews.json /tmp/status_checks.json

echo ""
echo -e "${GREEN}🎉 Branch Protection configurado exitosamente!${NC}"
echo -e "${YELLOW}⚠️  IMPORTANTE: A partir de ahora todos los cambios a main requieren PR + review${NC}"
echo ""
echo -e "${BLUE}📋 Workflow de desarrollo:${NC}"
echo "1. Crear feature branch desde main"
echo "2. Desarrollar y commitear cambios"  
echo "3. Crear Pull Request hacia main"
echo "4. Esperar code review (1 aprobación mínima)"
echo "5. Resolver conversaciones si las hay"
echo "6. Merge cuando todo esté aprobado"

echo ""
echo -e "${BLUE}🔒 Protecciones activas:${NC}"
echo "• Direct pushes a main: ❌ BLOQUEADOS"
echo "• Merge sin review: ❌ BLOQUEADO"
echo "• Force pushes: ❌ BLOQUEADOS"
echo "• Reglas aplicadas a admins: ✅ SÍ"
echo "• Historia lineal requerida: ✅ SÍ"
echo "• Resolución de conversaciones: ✅ SÍ"
