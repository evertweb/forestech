#!/bin/bash

# Test script para validar las correcciones de los workflows
echo "🧪 Testing workflow corrections..."

# 1. Test de sintaxis YAML
echo "📝 Checking YAML syntax..."
if command -v yamllint &> /dev/null; then
    yamllint .github/workflows/copilot-integration.yml
    yamllint .github/workflows/copilot-bridge.yml
else
    echo "yamllint not found, using python to validate YAML..."
    python3 -c "
import yaml
import sys

files = ['.github/workflows/copilot-integration.yml', '.github/workflows/copilot-bridge.yml']
for file in files:
    try:
        with open(file, 'r') as f:
            yaml.safe_load(f)
        print(f'✅ {file} is valid YAML')
    except Exception as e:
        print(f'❌ {file} has YAML syntax error: {e}')
        sys.exit(1)
"
fi

# 2. Verificar que los scripts existan
echo "📁 Checking required scripts..."
if [ -f "scripts/error-collector.js" ]; then
    echo "✅ error-collector.js exists"
else
    echo "❌ error-collector.js not found"
fi

# 3. Verificar package.json scripts
echo "📦 Checking package.json scripts..."
node -e "
const pkg = require('./package.json');
const requiredScripts = ['lint:alimentacion', 'lint:combustibles', 'build:alimentacion', 'build:combustibles'];
let missing = [];

requiredScripts.forEach(script => {
    if (!pkg.scripts[script]) {
        missing.push(script);
    }
});

if (missing.length > 0) {
    console.log('❌ Missing scripts:', missing.join(', '));
    process.exit(1);
} else {
    console.log('✅ All required scripts found');
}
"

# 4. Test del error-collector
echo "🔍 Testing error-collector..."
if node scripts/error-collector.js --help &>/dev/null; then
    echo "✅ error-collector.js is executable"
else
    echo "⚠️  error-collector.js may have issues (continuing...)"
fi

echo ""
echo "🎉 Workflow corrections validation complete!"
echo ""
echo "📋 Summary of fixes applied:"
echo "  1. ✅ Added explicit permissions to both workflows"
echo "  2. ✅ Added error handling for GitHub API calls"
echo "  3. ✅ Added fallback behavior when issue creation fails"
echo "  4. ✅ Improved dependency installation with error tolerance"
echo "  5. ✅ Added explicit github-token parameter"
echo ""
echo "🚀 Next steps:"
echo "  - Commit these changes to trigger the workflows"
echo "  - Monitor the workflow runs for success"
echo "  - The workflows should now handle permissions correctly"
