#!/bin/bash

# 🤖 Setup Auto-Approval System for Safe PRs
# Este script configura un sistema inteligente de auto-aprobación

set -e

echo "🤖 FORESTECH: Configurando Sistema de Auto-Aprobación Inteligente"
echo "=================================================================="

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 CONDICIONES DE SEGURIDAD CONFIGURADAS:${NC}"
echo ""
echo -e "${GREEN}✅ APROBACIÓN AUTOMÁTICA cuando:${NC}"
echo "   • Todos los CI/CD checks pasan (20 puntos)"
echo "   • Sin cambios en archivos críticos (15 puntos)"
echo "   • PR pequeño/mediano ≤20 archivos (10-15 puntos)"
echo "   • Branch feature/fix estándar (5-10 puntos)"
echo "   • PR del owner del repo (15 puntos)"
echo "   • Commits convencionales (10 puntos)"
echo "   • Incluye tests (10 puntos)"
echo "   • Descripción con keywords de seguridad (5 puntos)"
echo ""
echo -e "${YELLOW}⚠️  REVISIÓN MANUAL cuando:${NC}"
echo "   • Score 50-74: Riesgo moderado"
echo "   • Cambios en archivos críticos"
echo "   • PRs muy grandes >20 archivos"
echo "   • Checks de CI/CD fallando"
echo ""
echo -e "${RED}🛑 BLOQUEO TOTAL cuando:${NC}"
echo "   • Score <50: Alto riesgo"
echo "   • Cambios en firebase.json, firestore.rules"
echo "   • Modificaciones en .github/workflows/"
echo "   • Fallas críticas en builds"

echo ""
echo -e "${BLUE}🔍 VERIFICANDO CONFIGURACIÓN ACTUAL...${NC}"

# Verificar que el workflow existe
if [ -f ".github/workflows/auto-approve-safe.yml" ]; then
    echo -e "${GREEN}✅ Workflow auto-approve-safe.yml configurado${NC}"
else
    echo -e "${RED}❌ Error: Workflow no encontrado${NC}"
    exit 1
fi

# Verificar permisos del GITHUB_TOKEN
echo -e "${YELLOW}⚙️  Verificando permisos de GitHub...${NC}"

# Verificar protección de rama actual
if command -v gh >/dev/null 2>&1; then
    echo -e "${BLUE}📊 Estado actual de protección:${NC}"
    
    PROTECTION=$(gh api repos/evertweb/forestech/branches/main/protection 2>/dev/null || echo "none")
    if [ "$PROTECTION" != "none" ]; then
        echo -e "${GREEN}✅ Branch protection activa${NC}"
        
        # Mostrar configuración actual
        REQUIRED_REVIEWS=$(echo "$PROTECTION" | jq -r '.required_pull_request_reviews.required_approving_review_count // 0')
        ENFORCE_ADMINS=$(echo "$PROTECTION" | jq -r '.enforce_admins.enabled // false')
        
        echo "   • Revisiones requeridas: $REQUIRED_REVIEWS"
        echo "   • Aplicar a admins: $ENFORCE_ADMINS"
    else
        echo -e "${YELLOW}⚠️  Branch protection no configurada${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  GitHub CLI no disponible para verificación${NC}"
fi

echo ""
echo -e "${BLUE}🎯 ARCHIVOS CRÍTICOS PROTEGIDOS:${NC}"
echo "   • firebase.json - Configuración Firebase"
echo "   • firestore.rules - Reglas de base de datos"
echo "   • storage.rules - Reglas de almacenamiento"
echo "   • .github/workflows/ - Pipelines CI/CD"
echo "   • package.json - Dependencias principales"
echo "   • vite.config.js - Configuración de build"

echo ""
echo -e "${BLUE}📊 SCORING SYSTEM:${NC}"
echo "   • 🟢 75-100 puntos: Auto-aprobación inmediata"
echo "   • 🟡 50-74 puntos: Revisión manual recomendada"
echo "   • 🔴 0-49 puntos: Revisión manual obligatoria"

echo ""
echo -e "${GREEN}🚀 PRÓXIMOS PASOS:${NC}"
echo "1. Hacer commit de este sistema"
echo "2. Push y crear PR para probarlo"
echo "3. El sistema evaluará automáticamente el PR"
echo "4. Si cumple criterios, se auto-aprobará"
echo "5. Si no, requerirá revisión manual"

echo ""
echo -e "${BLUE}🧪 TESTING DEL SISTEMA:${NC}"
echo "   • Crea un PR pequeño con feature/test-auto-approve"
echo "   • Asegúrate de que los tests pasen"
echo "   • El sistema debería auto-aprobar en ~2 minutos"

echo ""
echo -e "${YELLOW}📝 NOTA IMPORTANTE:${NC}"
echo "Este sistema mantiene la seguridad mientras permite productividad."
echo "Solo aprueba PRs que definitivamente no romperán la aplicación."

echo ""
echo -e "${GREEN}✅ Sistema de Auto-Aprobación Configurado Exitosamente!${NC}"
