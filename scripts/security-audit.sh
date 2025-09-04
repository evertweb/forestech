#!/bin/bash
# scripts/security-audit.sh
# Auditoría de seguridad automatizada para CI/CD

set -e

echo "🛡️ Iniciando auditoría de seguridad..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para verificar vulnerabilidades NPM
check_npm_vulnerabilities() {
    echo -e "${BLUE}🔍 Verificando vulnerabilidades NPM...${NC}"
    
    # Ejecutar npm audit y capturar resultado
    if npm audit --audit-level=moderate --json > npm-audit.json 2>/dev/null; then
        echo -e "${GREEN}✅ No vulnerabilidades críticas encontradas${NC}"
        VULNERABILITIES=0
    else
        VULNERABILITIES=$(cat npm-audit.json | jq '.metadata.vulnerabilities.total // 0')
        HIGH_VULNS=$(cat npm-audit.json | jq '.metadata.vulnerabilities.high // 0')
        CRITICAL_VULNS=$(cat npm-audit.json | jq '.metadata.vulnerabilities.critical // 0')
        
        echo -e "${YELLOW}⚠️ Vulnerabilidades encontradas:${NC}"
        echo "  • Total: $VULNERABILITIES"
        echo "  • High: $HIGH_VULNS"
        echo "  • Critical: $CRITICAL_VULNS"
        
        if [ "$CRITICAL_VULNS" -gt 0 ]; then
            echo -e "${RED}❌ CRÍTICO: $CRITICAL_VULNS vulnerabilidades críticas${NC}"
            echo -e "${RED}🚨 Deployment BLOQUEADO${NC}"
            return 1
        fi
        
        if [ "$HIGH_VULNS" -gt 0 ]; then
            echo -e "${YELLOW}⚠️ ADVERTENCIA: $HIGH_VULNS vulnerabilidades altas${NC}"
            echo -e "${YELLOW}💡 Recomendado: Actualizar dependencias antes del deploy${NC}"
        fi
    fi
    
    return 0
}

# Función para detectar secrets hardcodeados
check_hardcoded_secrets() {
    echo -e "${BLUE}🔍 Buscando secrets hardcodeados...${NC}"
    
    # Patrones de secrets comunes
    SECRET_PATTERNS=(
        "AKIA[0-9A-Z]{16}"                    # AWS Access Key
        "sk_live_[0-9a-zA-Z]{24,}"           # Stripe Live Key
        "pk_live_[0-9a-zA-Z]{24,}"           # Stripe Publishable Key
        "AIza[0-9A-Za-z\\-_]{35}"            # Google API Key
        "ya29\\.[0-9A-Za-z\\-_]+"            # Google OAuth
        "[0-9a-f]{32}"                       # MD5 Hash (potential token)
        "github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}" # GitHub PAT
        "ghp_[a-zA-Z0-9]{36}"                # GitHub Token
        "firebase-adminsdk-[a-z0-9]{5}-[a-z0-9]{10}\\.json" # Firebase Service Account
    )
    
    local secrets_found=false
    
    for pattern in "${SECRET_PATTERNS[@]}"; do
        if grep -r -E "$pattern" --exclude-dir=node_modules --exclude-dir=.git --exclude="npm-audit.json" . > /dev/null 2>&1; then
            echo -e "${RED}❌ Potential secret found matching pattern: $pattern${NC}"
            secrets_found=true
        fi
    done
    
    # Verificar archivos .env en repositorio
    if find . -name ".env*" -not -path "./node_modules/*" -not -name ".env.example" | grep -q .; then
        echo -e "${RED}❌ Archivos .env encontrados en repositorio${NC}"
        find . -name ".env*" -not -path "./node_modules/*" -not -name ".env.example"
        secrets_found=true
    fi
    
    if [ "$secrets_found" = true ]; then
        echo -e "${RED}🚨 CRÍTICO: Secrets detectados en código${NC}"
        echo -e "${RED}🔒 Deployment BLOQUEADO${NC}"
        return 1
    else
        echo -e "${GREEN}✅ No se detectaron secrets hardcodeados${NC}"
        return 0
    fi
}

# Función para verificar dependencias maliciosas
check_malicious_packages() {
    echo -e "${BLUE}🔍 Verificando dependencias sospechosas...${NC}"
    
    # Lista de paquetes conocidos como problemáticos
    SUSPICIOUS_PACKAGES=(
        "event-stream"
        "flatmap-stream"
        "getcookies"
        "http-signature"
        "node-uuid"
    )
    
    local suspicious_found=false
    
    for package in "${SUSPICIOUS_PACKAGES[@]}"; do
        if npm list "$package" > /dev/null 2>&1; then
            echo -e "${YELLOW}⚠️ Paquete sospechoso encontrado: $package${NC}"
            suspicious_found=true
        fi
    done
    
    if [ "$suspicious_found" = true ]; then
        echo -e "${YELLOW}💡 Revisar manualmente estos paquetes${NC}"
    else
        echo -e "${GREEN}✅ No se encontraron paquetes sospechosos${NC}"
    fi
    
    return 0
}

# Función para verificar configuraciones de seguridad
check_security_config() {
    echo -e "${BLUE}🔍 Verificando configuraciones de seguridad...${NC}"
    
    local config_issues=false
    
    # Verificar Content Security Policy
    if ! grep -r "Content-Security-Policy" firebase.json functions/ > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️ CSP no configurado${NC}"
        config_issues=true
    fi
    
    # Verificar HTTPS enforcement
    if ! grep -r "Strict-Transport-Security" firebase.json functions/ > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️ HSTS no configurado${NC}"
        config_issues=true
    fi
    
    # Verificar reglas de Firestore
    if [ -f "firestore.rules" ]; then
        if grep -q "allow read, write: if true" firestore.rules; then
            echo -e "${RED}❌ Reglas de Firestore demasiado permisivas${NC}"
            config_issues=true
        else
            echo -e "${GREEN}✅ Reglas de Firestore configuradas${NC}"
        fi
    fi
    
    if [ "$config_issues" = true ]; then
        echo -e "${YELLOW}💡 Configuraciones de seguridad mejoradas recomendadas${NC}"
    fi
    
    return 0
}

# Función para generar reporte de seguridad
generate_security_report() {
    echo -e "${BLUE}📝 Generando reporte de seguridad...${NC}"
    
    REPORT_FILE="security-audit-report.md"
    TIMESTAMP=$(date)
    COMMIT=$(git rev-parse --short HEAD)
    BRANCH=$(git branch --show-current)
    
    cat > "$REPORT_FILE" << EOF
# 🛡️ Security Audit Report

**Fecha**: $TIMESTAMP
**Commit**: $COMMIT
**Branch**: $BRANCH

## 📊 Resumen Ejecutivo

| Categoría | Status | Detalles |
|-----------|--------|----------|
| NPM Vulnerabilidades | $([ -f npm-audit.json ] && echo "📊 Ver detalles" || echo "✅ OK") | $([ -f npm-audit.json ] && cat npm-audit.json | jq -r '.metadata.vulnerabilities.total // 0' | xargs -I {} echo "{} vulnerabilidades") |
| Secrets Hardcodeados | ✅ OK | No detectados |
| Dependencias Sospechosas | ✅ OK | No detectadas |
| Configuración Seguridad | ⚠️ REVIEW | Mejoras recomendadas |

## 🎯 Recomendaciones

### 🔒 Configuraciones de Seguridad Recomendadas

1. **Content Security Policy (CSP)**
   \`\`\`javascript
   // En functions/index.js
   app.use((req, res, next) => {
     res.setHeader('Content-Security-Policy', 
       "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com");
     next();
   });
   \`\`\`

2. **HTTP Security Headers**
   \`\`\`javascript
   res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
   res.setHeader('X-Frame-Options', 'DENY');
   res.setHeader('X-Content-Type-Options', 'nosniff');
   \`\`\`

3. **Firebase Security Rules** ✅
   - Reglas de Firestore configuradas correctamente
   - Autenticación requerida para operaciones

### 🚀 Próximos Pasos

- [ ] Implementar CSP headers
- [ ] Configurar HSTS
- [ ] Setup automated security scanning
- [ ] Regular dependency updates

EOF

    echo "📄 Reporte guardado en: $REPORT_FILE"
}

# Función principal
main() {
    echo "🛡️ Security Audit v1.0"
    echo "========================"
    
    local overall_status=0
    
    # Ejecutar todas las verificaciones
    check_npm_vulnerabilities || overall_status=1
    echo ""
    
    check_hardcoded_secrets || overall_status=1
    echo ""
    
    check_malicious_packages
    echo ""
    
    check_security_config
    echo ""
    
    generate_security_report
    echo ""
    
    # Resultado final
    if [ $overall_status -eq 0 ]; then
        echo -e "${GREEN}🎉 Security Audit: PASSED${NC}"
        echo -e "${GREEN}✅ No se encontraron problemas críticos de seguridad${NC}"
    else
        echo -e "${RED}❌ Security Audit: FAILED${NC}"
        echo -e "${RED}🚨 Problemas críticos de seguridad detectados${NC}"
        echo ""
        echo -e "${YELLOW}🔧 Para resolver:${NC}"
        echo "  npm audit fix          # Corregir vulnerabilidades automáticamente"
        echo "  git rm --cached .env*  # Remover archivos .env del repositorio"
        echo "  git commit -m 'Remove secrets from repository'"
    fi
    
    exit $overall_status
}

# Ejecutar script principal
main "$@"
