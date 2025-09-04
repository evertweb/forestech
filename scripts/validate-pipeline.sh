#!/bin/bash
# scripts/validate-pipeline.sh
# Script para validar el pipeline CI/CD localmente antes del deploy

echo "🔒 FORESTECH PIPELINE VALIDATION"
echo "================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Función para mostrar resultados
check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

echo "📋 Step 1: Security Audit"
echo "-------------------------"

# Check for hardcoded secrets
echo "🔍 Checking for hardcoded secrets..."
if grep -r "forestech_webhook_2024\|8220750519:AAEAVznImiHr8MmRmHVsHcJoSfZvC2LIaiQ" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=docs --exclude="*.sh" --exclude="*.yml" . > /dev/null; then
    check_result 1 "Hardcoded secrets found"
else
    check_result 0 "No hardcoded secrets detected"
fi

# NPM Audit - Allow moderate vulnerabilities for dev environment
echo "🔍 Running npm audit..."
npm audit --audit-level=critical > /dev/null 2>&1
check_result $? "NPM security audit (critical vulnerabilities only)"

echo ""
echo "🚦 Step 2: Quality Gates"
echo "------------------------"

# Lint check
echo "🔍 Running lint checks..."
npm run lint:combustibles > /dev/null 2>&1
check_result $? "Lint validation"

# Unit tests
echo "🧪 Running unit tests..."
cd combustibles 
npm test -- --run --reporter=basic > /tmp/test_output.log 2>&1
TEST_RESULT=$?
cd ..
if [ $TEST_RESULT -eq 0 ]; then
    check_result 0 "Unit tests"
else
    echo "   Test output:"
    cat /tmp/test_output.log | tail -10
    check_result 1 "Unit tests"
fi

echo ""
echo "🏗️ Step 3: Build Validation"
echo "---------------------------"

# Build test
echo "🏗️ Testing build process..."
npm run build:all > /dev/null 2>&1
check_result $? "Build process"

# Verify build outputs
echo "📁 Checking build outputs..."
if [ -d "public/combustibles" ] && [ -d "public/alimentacion" ]; then
    check_result 0 "Build outputs exist"
else
    check_result 1 "Build outputs missing"
fi

# Bundle size check
echo "📊 Checking bundle size..."
if [ -d "public/combustibles" ]; then
    BUNDLE_SIZE=$(du -sk public/combustibles | cut -f1)
    echo "   Bundle size: ${BUNDLE_SIZE}KB"
    if [ "$BUNDLE_SIZE" -gt 2560 ]; then
        check_result 1 "Bundle size exceeds 2.5MB limit"
    else
        check_result 0 "Bundle size within limits (< 2.5MB)"
    fi
else
    check_result 1 "Cannot check bundle size - build missing"
fi

echo ""
echo "🔐 Step 4: Environment Check"
echo "----------------------------"

# Check for required .env files
echo "🔍 Checking environment configuration..."
if [ -f "combustibles/.env.local" ] || [ -f "combustibles/.env" ]; then
    check_result 0 "Environment files configured"
else
    check_result 1 "No environment files found (create .env.local)"
fi

echo ""
echo "📊 VALIDATION SUMMARY"
echo "===================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED! Pipeline ready for deployment.${NC}"
    echo ""
    echo "✅ Security: PASSED"
    echo "✅ Quality: PASSED"
    echo "✅ Build: PASSED"
    echo "✅ Environment: CONFIGURED"
    echo ""
    echo "🚀 Ready to deploy to production!"
    exit 0
else
    echo -e "${RED}❌ $ERRORS ISSUES FOUND! Fix before deployment.${NC}"
    echo ""
    echo "🔧 Please resolve the issues above before running the deploy pipeline."
    exit 1
fi
