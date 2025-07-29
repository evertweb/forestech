#!/bin/bash

# 🚀 Forestech Prebuild Setup - Optimizado para GitHub Codespaces Prebuilds
set -e

echo "🚀 Iniciando setup optimizado para prebuild..."

# 🔍 Detectar directorio de trabajo
WORKSPACE_DIR="/workspaces/forestech"

if [ ! -d "$WORKSPACE_DIR" ]; then
    echo "⚠️  Directorio workspace no encontrado, usando directorio actual"
    WORKSPACE_DIR="$(pwd)"
fi

cd "$WORKSPACE_DIR"
echo "📂 Trabajando en: $WORKSPACE_DIR"

# 📁 Crear directorios esenciales
echo "📁 Creando directorios esenciales..."
mkdir -p .mcp-memory .claudehooks scripts .npm-cache .yarn-cache .firebase

# 🔧 Configurar cache de npm para builds más rápidos
echo "⚡ Configurando cache de npm..."
npm config set cache "$WORKSPACE_DIR/.npm-cache" --global
npm config set prefer-offline true --global

# 📦 Instalar dependencias en paralelo para máxima velocidad
echo "📦 Instalando dependencias en paralelo..."

install_combustibles() {
    if [ -d "combustibles" ] && [ -f "combustibles/package.json" ]; then
        echo "⛽ Instalando dependencias de Combustibles..."
        cd combustibles
        # Usar npm ci para builds reproducibles y más rápidos
        npm ci --prefer-offline --no-audit --progress=false
        echo "✅ Combustibles: dependencias instaladas"
        cd ..
    else
        echo "⚠️  App Combustibles no encontrada"
    fi
}

install_alimentacion() {
    if [ -d "alimentacion" ] && [ -f "alimentacion/package.json" ]; then
        echo "🍽️ Instalando dependencias de Alimentación..."
        cd alimentacion
        # Usar npm ci para builds reproducibles y más rápidos
        npm ci --prefer-offline --no-audit --progress=false
        echo "✅ Alimentación: dependencias instaladas"
        cd ..
    else
        echo "⚠️  App Alimentación no encontrada"
    fi
}

# Ejecutar instalaciones en paralelo
install_combustibles &
PID_COMBUSTIBLES=$!

install_alimentacion &
PID_ALIMENTACION=$!

# 🌍 Instalar herramientas globales mientras se instalan dependencias
echo "🌍 Instalando herramientas globales..."
npm install -g firebase-tools@latest --prefer-offline &
PID_FIREBASE=$!

# Esperar a que todas las instalaciones terminen
wait $PID_COMBUSTIBLES
wait $PID_ALIMENTACION  
wait $PID_FIREBASE

echo "✅ Todas las dependencias instaladas correctamente"

# 🧠 Configuración MCP optimizada
echo "🧠 Configurando MCP para prebuilds..."
cat > .mcp.json << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspaces/forestech"]
    },
    "memory": {
      "command": "npx", 
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_FILE_PATH": "/workspaces/forestech/.mcp-memory/forestech-memory.json"
      }
    },
    "firebase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-firebase"]
    }
  }
}
EOF

echo "✅ MCP configurado"

# 📝 Script de desarrollo optimizado
echo "📝 Creando scripts de desarrollo..."
cat > scripts/dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando servicios Forestech (desde prebuild)..."

# Función para verificar puertos
check_port() {
    if command -v lsof >/dev/null 2>&1; then
        lsof -i :$1 >/dev/null 2>&1
    else
        netstat -ln 2>/dev/null | grep ":$1 " >/dev/null 2>&1
    fi
}

# 🔥 Firebase Emulators (opcional)
start_firebase() {
    if [ -f "firebase.json" ] && command -v firebase >/dev/null 2>&1; then
        if ! check_port 9099; then
            echo "🔥 Iniciando Firebase Emulators..."
            firebase emulators:start --only auth,firestore &
            sleep 3
        else
            echo "⚠️  Firebase ya ejecutándose en puerto 9099"
        fi
    else
        echo "⚠️  Firebase CLI no disponible o firebase.json no encontrado"
    fi
}

# ⛽ Combustibles
start_combustibles() {
    if [ -d "combustibles" ] && [ -f "combustibles/package.json" ]; then
        if ! check_port 5173; then
            echo "⛽ Iniciando Combustibles..."
            (cd combustibles && npm run dev) &
        else
            echo "⚠️  Combustibles ya ejecutándose en puerto 5173"
        fi
    else
        echo "❌ App Combustibles no encontrada"
    fi
}

# 🍽️ Alimentación  
start_alimentacion() {
    if [ -d "alimentacion" ] && [ -f "alimentacion/package.json" ]; then
        if ! check_port 3000; then
            echo "🍽️ Iniciando Alimentación..."
            (cd alimentacion && npm start) &
        else
            echo "⚠️  Alimentación ya ejecutándose en puerto 3000"
        fi
    else
        echo "❌ App Alimentación no encontrada"
    fi
}

# Ejecutar servicios
start_firebase
start_combustibles  
start_alimentacion

echo ""
echo "✅ Servicios iniciados desde prebuild!"
echo "📱 Combustibles: http://localhost:5173"
echo "🍽️ Alimentación: http://localhost:3000"  
echo "🔥 Firebase UI: http://localhost:4000"
echo ""
echo "💡 Presiona Ctrl+C para detener servicios"

# Esperar por procesos
wait
EOF

chmod +x scripts/dev.sh

# 📝 Scripts adicionales útiles
cat > scripts/build-all.sh << 'EOF'
#!/bin/bash
echo "🔨 Building todas las aplicaciones..."

# Build Combustibles
if [ -d "combustibles" ]; then
    echo "⛽ Building Combustibles..."
    (cd combustibles && npm run build --if-present)
fi

# Build Alimentación  
if [ -d "alimentacion" ]; then
    echo "🍽️ Building Alimentación..."
    (cd alimentacion && npm run build --if-present)
fi

echo "✅ Build completado"
EOF

chmod +x scripts/build-all.sh

cat > scripts/clean-cache.sh << 'EOF'
#!/bin/bash
echo "🧹 Limpiando caches..."

# Limpiar npm cache
npm cache clean --force

# Limpiar node_modules si es necesario
if [ "$1" = "--deep" ]; then
    echo "🗑️ Limpieza profunda: eliminando node_modules..."
    rm -rf combustibles/node_modules
    rm -rf alimentacion/node_modules
    echo "📦 Reinstalando dependencias..."
    (cd combustibles && npm install) &
    (cd alimentacion && npm install) &
    wait
fi

echo "✅ Cache limpiado"
EOF

chmod +x scripts/clean-cache.sh

# 🔧 Warm up - Pre-cargar caches para máximo rendimiento
echo "🔥 Warming up caches..."

# Pre-build si están disponibles (para warm up)
if [ -d "combustibles" ]; then
    (cd combustibles && npm run build --if-present 2>/dev/null || true) &
fi

if [ -d "alimentacion" ]; then
    (cd alimentacion && npm run build --if-present 2>/dev/null || true) &
fi

# Esperar warm up builds (opcional)
wait

# 🧪 Verificar instalaciones
echo "🧪 Verificando instalaciones..."

echo "✅ Node.js: $(node --version)"
echo "✅ NPM: $(npm --version)"

if command -v firebase >/dev/null 2>&1; then
    echo "✅ Firebase CLI: $(firebase --version | head -1)"
else
    echo "⚠️  Firebase CLI no disponible"
fi

# Verificar apps
if [ -d "combustibles/node_modules" ]; then
    echo "✅ Combustibles: dependencias OK"
else
    echo "❌ Combustibles: sin dependencias"
fi

if [ -d "alimentacion/node_modules" ]; then
    echo "✅ Alimentación: dependencias OK"
else
    echo "❌ Alimentación: sin dependencias"
fi

echo ""
echo "=========================================="
echo "🎉 PREBUILD SETUP COMPLETADO!"
echo "=========================================="
echo ""
echo "🚀 Próximos pasos en el Codespace:"
echo "1. ./scripts/dev.sh - Iniciar todas las apps"
echo "2. ./scripts/build-all.sh - Build de producción"
echo "3. ./scripts/clean-cache.sh - Limpiar caches"
echo ""
echo "⏱️ Tiempo total de setup: $(date)"
echo "✅ Prebuild optimizado listo para Codespaces instantáneos!"