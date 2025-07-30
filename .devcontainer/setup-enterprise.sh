#!/bin/bash

# 🚀 Forestech Enterprise Setup - Equivalente al entorno local
set -e

echo "🚀 Iniciando setup Enterprise para Codespaces..."

# 🔍 Detectar directorio de trabajo
WORKSPACE_DIR="/workspaces/forestech"

if [ ! -d "$WORKSPACE_DIR" ]; then
    echo "⚠️  Directorio workspace no encontrado, usando directorio actual"
    WORKSPACE_DIR="$(pwd)"
fi

cd "$WORKSPACE_DIR"
echo "📂 Trabajando en: $WORKSPACE_DIR"

# 📁 Crear estructura completa como en local
echo "📁 Creando estructura enterprise..."
mkdir -p .mcp-memory .claudehooks scripts .npm-cache .yarn-cache .firebase logs tmp .vscode/settings

# 🔧 Configurar npm como en local
echo "⚡ Configurando npm enterprise..."
npm config set cache "$WORKSPACE_DIR/.npm-cache" --global
npm config set prefix "$WORKSPACE_DIR/.npm-global" --global
npm config set prefer-offline true --global
npm config set progress false --global
npm config set audit false --global

# 📦 Instalar herramientas enterprise en paralelo
echo "📦 Instalando stack enterprise..."

install_combustibles() {
    if [ -d "combustibles" ] && [ -f "combustibles/package.json" ]; then
        echo "⛽ Instalando Combustibles..."
        cd combustibles
        npm ci --prefer-offline --no-audit --progress=false
        echo "✅ Combustibles: dependencias OK"
        cd ..
    fi
}

install_alimentacion() {
    if [ -d "alimentacion" ] && [ -f "alimentacion/package.json" ]; then
        echo "🍽️ Instalando Alimentación..."
        cd alimentacion
        npm ci --prefer-offline --no-audit --progress=false
        echo "✅ Alimentación: dependencias OK"
        cd ..
    fi
}

install_global_tools() {
    echo "🌍 Instalando herramientas globales enterprise..."
    
    # Firebase CLI
    npm install -g firebase-tools@latest --prefer-offline
    
    # Claude Code CLI - CRÍTICO para paridad con local
    npm install -g @anthropic-ai/claude-code@latest --prefer-offline
    
    # Gemini CLI
    npm install -g @google/gemini-cli@latest --prefer-offline
    
    # Herramientas adicionales
    npm install -g serve http-server pm2 --prefer-offline
    
    echo "✅ Herramientas globales instaladas"
}

# Ejecutar en paralelo para máxima velocidad
install_combustibles &
PID_COMBUSTIBLES=$!

install_alimentacion &
PID_ALIMENTACION=$!

install_global_tools &
PID_GLOBAL=$!

# Esperar instalaciones críticas
wait $PID_COMBUSTIBLES
wait $PID_ALIMENTACION  
wait $PID_GLOBAL

# 🔑 Configurar PATH enterprise
echo '# Forestech Enterprise PATH' >> ~/.bashrc
echo 'export PATH="$WORKSPACE_DIR/.npm-global/bin:$PATH"' >> ~/.bashrc
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc

# Aplicar PATH inmediatamente
export PATH="$WORKSPACE_DIR/.npm-global/bin:$PATH"

# 🛠️ Configurar Git enterprise (básico)
echo "🛠️ Configurando Git enterprise..."
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global core.autocrlf input

# Solo configurar si no está ya configurado
if [ -z "$(git config --global user.name)" ]; then
    echo "⚠️  Git user.name no configurado - requerirá configuración manual"
fi

# 🧠 Configurar MCP enterprise completo
echo "🧠 Configurando MCP enterprise..."
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
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "time": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-time"]
    }
  }
}
EOF

# 🔥 Configurar Firebase enterprise
echo "🔥 Configurando Firebase enterprise..."
if [ -f "firebase.json" ]; then
    # Login automático con token si está disponible
    if [ ! -z "$FIREBASE_TOKEN" ]; then
        echo "$FIREBASE_TOKEN" | firebase login:ci --token-stdin
    fi
    
    # Configurar proyecto
    firebase use liquidacionapp-62962 --token "$FIREBASE_TOKEN" 2>/dev/null || true
fi

# 📝 Scripts enterprise avanzados
echo "📝 Creando scripts enterprise..."

# Script principal mejorado
cat > scripts/dev-enterprise.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando Forestech Enterprise Stack..."

# Función para verificar puertos
check_port() {
    if command -v lsof >/dev/null 2>&1; then
        lsof -i :$1 >/dev/null 2>&1
    else
        netstat -ln 2>/dev/null | grep ":$1 " >/dev/null 2>&1
    fi
}

# 🔥 Firebase Emulators Suite completo
start_firebase_enterprise() {
    if [ -f "firebase.json" ] && command -v firebase >/dev/null 2>&1; then
        if ! check_port 9099; then
            echo "🔥 Iniciando Firebase Emulators Suite..."
            firebase emulators:start --only auth,firestore,functions,hosting &
            sleep 5
            echo "✅ Firebase Emulators: http://localhost:4000"
        else
            echo "⚠️  Firebase ya ejecutándose"
        fi
    fi
}

# ⛽ Combustibles con hot reload
start_combustibles_enterprise() {
    if [ -d "combustibles" ]; then
        if ! check_port 5173; then
            echo "⛽ Iniciando Combustibles..."
            (cd combustibles && npm run dev -- --host 0.0.0.0) &
            sleep 2
            echo "✅ Combustibles: http://localhost:5173"
        fi
    fi
}

# 🍽️ Alimentación con hot reload
start_alimentacion_enterprise() {
    if [ -d "alimentacion" ]; then
        if ! check_port 3000; then
            echo "🍽️ Iniciando Alimentación..."
            (cd alimentacion && npm run dev -- --host 0.0.0.0) &
            sleep 2
            echo "✅ Alimentación: http://localhost:3000"
        fi
    fi
}

# Iniciar todos los servicios
start_firebase_enterprise
start_combustibles_enterprise  
start_alimentacion_enterprise

echo ""
echo "🎉 FORESTECH ENTERPRISE STACK INICIADO"
echo "════════════════════════════════════════"
echo "📱 Combustibles: http://localhost:5173"
echo "🍽️ Alimentación: http://localhost:3000"  
echo "🔥 Firebase UI: http://localhost:4000"
echo "🔥 Auth Emulator: http://localhost:9099"
echo ""
echo "💡 Presiona Ctrl+C para detener"

# Monitorear procesos
wait
EOF

chmod +x scripts/dev-enterprise.sh

# Script de diagnóstico enterprise
cat > scripts/diagnose-enterprise.sh << 'EOF'
#!/bin/bash
echo "🔍 DIAGNÓSTICO ENTERPRISE FORESTECH"
echo "════════════════════════════════════"

# Versiones
echo "📋 VERSIONES:"
echo "✅ Node.js: $(node --version)"
echo "✅ NPM: $(npm --version)"

if command -v firebase >/dev/null 2>&1; then
    echo "✅ Firebase CLI: $(firebase --version | head -1)"
else
    echo "❌ Firebase CLI: NO INSTALADO"
fi

if command -v claude >/dev/null 2>&1; then
    echo "✅ Claude Code: $(claude --version 2>/dev/null | head -1 || echo 'Instalado')"
else
    echo "❌ Claude Code: NO INSTALADO"
fi

if command -v gemini >/dev/null 2>&1; then
    echo "✅ Gemini CLI: Instalado"
else
    echo "❌ Gemini CLI: NO INSTALADO"
fi

# Configuración
echo ""
echo "🔧 CONFIGURACIÓN:"
echo "📂 Workspace: $(pwd)"
echo "🔑 Git user: $(git config --global user.name || echo 'NO CONFIGURADO')"
echo "📧 Git email: $(git config --global user.email || echo 'NO CONFIGURADO')"

# Variables de entorno
echo ""
echo "🌍 VARIABLES DE ENTORNO:"
[ ! -z "$GEMINI_API_KEY" ] && echo "✅ GEMINI_API_KEY: Configurado" || echo "❌ GEMINI_API_KEY: NO CONFIGURADO"
[ ! -z "$FIREBASE_TOKEN" ] && echo "✅ FIREBASE_TOKEN: Configurado" || echo "❌ FIREBASE_TOKEN: NO CONFIGURADO"

# Dependencias de apps
echo ""
echo "📦 DEPENDENCIAS DE APPS:"
[ -d "combustibles/node_modules" ] && echo "✅ Combustibles: OK" || echo "❌ Combustibles: FALTANTES"
[ -d "alimentacion/node_modules" ] && echo "✅ Alimentación: OK" || echo "❌ Alimentación: FALTANTES"

echo ""
echo "🎯 RECOMENDACIONES:"
echo "1. Configurar Git: git config --global user.name 'Tu Nombre'"
echo "2. Configurar secrets en GitHub Codespaces"
echo "3. Verificar que todas las herramientas estén instaladas"
EOF

chmod +x scripts/diagnose-enterprise.sh

# 🧪 Warm up enterprise completo
echo "🔥 Ejecutando warm up enterprise..."

# Pre-build para cache warming
if [ -d "combustibles" ]; then
    (cd combustibles && npm run build --if-present 2>/dev/null || true) &
fi

if [ -d "alimentacion" ]; then
    (cd alimentacion && npm run build --if-present 2>/dev/null || true) &
fi

# Warm up de herramientas
firebase --version >/dev/null 2>&1 &
claude --version >/dev/null 2>&1 &

# Esperar warm up
wait

# 🔍 Verificación final enterprise
echo "🧪 Verificación enterprise final..."

echo "✅ Node.js: $(node --version)"
echo "✅ NPM: $(npm --version)"

if command -v firebase >/dev/null 2>&1; then
    echo "✅ Firebase CLI: $(firebase --version | head -1)"
else
    echo "❌ Firebase CLI: ERROR"
fi

if command -v claude >/dev/null 2>&1; then
    echo "✅ Claude Code: Disponible"
else
    echo "❌ Claude Code: ERROR"
fi

# Verificar dependencias
[ -d "combustibles/node_modules" ] && echo "✅ Combustibles: OK" || echo "❌ Combustibles: ERROR"
[ -d "alimentacion/node_modules" ] && echo "✅ Alimentación: OK" || echo "❌ Alimentación: ERROR"

echo ""
echo "════════════════════════════════════════"
echo "🎉 SETUP ENTERPRISE COMPLETADO!"
echo "════════════════════════════════════════"
echo ""
echo "🚀 Comandos disponibles:"
echo "• ./scripts/dev-enterprise.sh - Iniciar stack completo"
echo "• ./scripts/diagnose-enterprise.sh - Diagnóstico completo"
echo "• ./scripts/build-all.sh - Build de producción"
echo ""
echo "⏱️ Tiempo de setup: $(date)"
echo "✅ Codespace enterprise listo - equivalente al entorno local!"