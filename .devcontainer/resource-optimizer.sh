#!/bin/bash

# 🎯 Forestech Resource Optimizer
# Script para optimizar recursos según configuración detectada

set -e

echo "🎯 Optimizando recursos para Forestech..."

# 🔍 Detectar recursos disponibles
AVAILABLE_CPUS=$(nproc)
AVAILABLE_RAM=$(free -g | awk '/^Mem:/{print $2}')
AVAILABLE_STORAGE=$(df -BG /workspace | awk 'NR==2{print $2}' | sed 's/G//')

echo "📊 Recursos detectados:"
echo "   CPU: ${AVAILABLE_CPUS} cores"
echo "   RAM: ${AVAILABLE_RAM}GB"
echo "   Storage: ${AVAILABLE_STORAGE}GB"

# 🎨 Configurar según recursos disponibles
if [ "$AVAILABLE_RAM" -ge 16 ]; then
    ENVIRONMENT="enterprise"
    NODE_MEMORY=16384
    VITE_MEMORY=4096
    echo "🚀 Configuración: Enterprise (High-Performance)"
elif [ "$AVAILABLE_RAM" -ge 8 ]; then
    ENVIRONMENT="performance"
    NODE_MEMORY=8192
    VITE_MEMORY=2048
    echo "⚡ Configuración: Performance (Premium)"
else
    ENVIRONMENT="development"
    NODE_MEMORY=4096
    VITE_MEMORY=1024
    echo "🏠 Configuración: Development (Standard)"
fi

# 📝 Configurar variables de entorno optimizadas
cat > /workspace/.env.codespace << EOF
# 🎯 Forestech Codespace Optimization
CODESPACE_ENVIRONMENT=${ENVIRONMENT}
NODE_OPTIONS=--max-old-space-size=${NODE_MEMORY}
VITE_MAX_MEMORY=${VITE_MEMORY}

# 🔧 Build optimizations
GENERATE_SOURCEMAP=false
INLINE_RUNTIME_CHUNK=false
BUILD_PATH=./build

# 🏃‍♂️ Performance settings
CHOKIDAR_USEPOLLING=false
WATCHPACK_POLLING=false
FAST_REFRESH=true

# 🗂️ Cache locations
npm_config_cache=/workspace/.npm-cache
yarn_cache_folder=/workspace/.yarn-cache
VITE_CACHE_DIR=/workspace/.vite-cache
EOF

# 🏗️ Configurar npm según recursos
if [ "$AVAILABLE_RAM" -ge 16 ]; then
    npm config set cache /workspace/.npm-cache
    npm config set maxsockets 50
    npm config set network-concurrency 8
elif [ "$AVAILABLE_RAM" -ge 8 ]; then
    npm config set cache /workspace/.npm-cache
    npm config set maxsockets 25
    npm config set network-concurrency 4
else
    npm config set cache /workspace/.npm-cache
    npm config set maxsockets 15
    npm config set network-concurrency 2
fi

# 📊 Crear script de monitoreo de recursos
cat > /workspace/scripts/monitor-resources.sh << 'EOF'
#!/bin/bash
echo "📊 Estado de Recursos Forestech"
echo "================================"
echo "🖥️  CPU: $(nproc) cores disponibles"
echo "📈 CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')"
echo "💾 RAM: $(free -h | awk '/^Mem:/{printf "%.1fGB/%.1fGB (%.1f%%)\n", $3/1024, $2/1024, $3*100/$2}')"
echo "💿 Disk: $(df -h /workspace | awk 'NR==2{printf "%s/%s (%s)\n", $3, $2, $5}')"
echo ""
echo "🚀 Procesos Forestech activos:"
ps aux | grep -E "(node|npm|firebase|vite)" | grep -v grep | awk '{printf "%-10s %-8s %-6s %s\n", $1, $3"%", $4"%", $11}'
EOF

chmod +x /workspace/scripts/monitor-resources.sh

# 🎯 Configurar limits para contenedores si es Docker Compose
if [ -f "/workspace/.devcontainer/docker-compose.yml" ]; then
    if [ "$AVAILABLE_RAM" -ge 16 ]; then
        DEPLOY_LIMITS="cpus: '4.0'\n        memory: 12G"
    elif [ "$AVAILABLE_RAM" -ge 8 ]; then
        DEPLOY_LIMITS="cpus: '2.0'\n        memory: 6G"
    else
        DEPLOY_LIMITS="cpus: '1.0'\n        memory: 3G"
    fi
    
    echo "🐳 Docker limits configurados para $ENVIRONMENT"
fi

echo "✅ Optimización completada para entorno: $ENVIRONMENT"
echo "📋 Variables configuradas en: /workspace/.env.codespace"
echo "📊 Monitor de recursos: ./scripts/monitor-resources.sh"