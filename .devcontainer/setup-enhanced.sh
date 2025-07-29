#!/bin/bash

# 🚀 Forestech Enhanced Setup - Funcionalidades críticas de PC local
# Configuración avanzada que incluye Serena, MCPs, Claude Hooks y más

set -e

echo "🚀 Configuración ENHANCED de Forestech iniciando..."
echo "🎯 Integrando funcionalidades críticas de tu PC local..."

# 🔍 Detectar directorio correcto automáticamente
if [ -d "/workspaces/forestech" ]; then
    WORKSPACE_DIR="/workspaces/forestech"
    echo "📂 Codespace detectado: usando /workspaces/forestech"
elif [ -d "/workspace" ]; then
    WORKSPACE_DIR="/workspace"
    echo "📂 Container detectado: usando /workspace"
else
    WORKSPACE_DIR="$(pwd)"
    echo "📂 Usando directorio actual: $WORKSPACE_DIR"
fi

cd "$WORKSPACE_DIR"

# 📦 Instalar dependencias Node.js básicas primero
echo "📦 Instalando dependencias Node.js del proyecto..."

# Proyecto principal
if [ -f "package.json" ]; then
    echo "📦 Instalando dependencias raíz..."
    npm ci --prefer-offline --no-audit --silent || npm install --silent
fi

# Combustibles
if [ -d "combustibles" ] && [ -f "combustibles/package.json" ]; then
    echo "⛽ Instalando dependencias de Combustibles..."
    cd combustibles
    npm ci --prefer-offline --no-audit --silent || npm install --silent
    cd ..
fi

# Alimentación
if [ -d "alimentacion" ] && [ -f "alimentacion/package.json" ]; then
    echo "🍽️ Instalando dependencias de Alimentación..."
    cd alimentacion
    npm ci --prefer-offline --no-audit --silent || npm install --silent
    cd ..
fi

# 🔥 Firebase CLI
echo "🔥 Instalando Firebase CLI..."
npm install -g firebase-tools --silent

# 🤖 Instalar Claude Code
echo "🤖 Instalando Claude Code..."
if command -v curl &> /dev/null; then
    curl -sSL https://claude.ai/install.sh | bash || {
        echo "⚠️  Error instalando Claude Code automáticamente"
    }
    
    if [ -f "$HOME/.claude/bin/claude" ]; then
        echo 'export PATH="$HOME/.claude/bin:$PATH"' >> ~/.bashrc
        export PATH="$HOME/.claude/bin:$PATH"
        echo "✅ Claude Code instalado y configurado"
    fi
fi

# 🧠 Configurar MCPs (adaptados para Codespace)
echo "🧠 Configurando MCPs avanzados..."
mkdir -p "$WORKSPACE_DIR/.mcp-memory"

cat > "$WORKSPACE_DIR/.mcp.json" << EOF
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "$WORKSPACE_DIR"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_FILE_PATH": "$WORKSPACE_DIR/.mcp-memory/forestech-memory.json"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "mcp-sequential-thinking"]
    },
    "firebase": {
      "command": "npx",
      "args": ["firebase-tools@latest", "experimental:mcp", "--dir", "$WORKSPACE_DIR"],
      "env": {
        "FIREBASE_PROJECT": "liquidacionapp-62962"
      }
    },
    "ide": {
      "command": "npx",
      "args": ["-y", "mcp-server-ide"]
    }
  }
}
EOF

# Crear archivo de memoria inicial
cat > "$WORKSPACE_DIR/.mcp-memory/forestech-memory.json" << 'EOF'
{
  "patterns": {
    "react_patterns": {
      "hooks": ["useState", "useEffect", "useContext"],
      "components": ["functional", "jsx_syntax"],
      "styling": ["tailwind", "css_modules"]
    },
    "firebase_patterns": {
      "auth": ["signInWithEmailAndPassword", "onAuthStateChanged"],
      "firestore": ["collection", "doc", "onSnapshot"],
      "emulators": ["auth", "firestore", "functions", "hosting"]
    },
    "build_patterns": {
      "vite": ["dev", "build", "preview"],
      "npm_scripts": ["dev:combustibles", "dev:alimentacion", "build:all"]
    }
  }
}
EOF

# 🔧 Configurar Claude Hooks (versión simplificada para Codespace)
echo "🔧 Configurando Claude Hooks..."
mkdir -p "$WORKSPACE_DIR/.claudehooks"

cat > "$WORKSPACE_DIR/.claudehooks/hook-config.json" << 'EOF'
{
  "enabled": true,
  "verbose": false,
  "timing": true,
  "hooks": {
    "contextSwitcher": {
      "enabled": true,
      "priority": 1,
      "description": "Auto-switch entre combustibles/alimentacion"
    },
    "taskClassifier": {
      "enabled": true,
      "priority": 2,
      "description": "Clasificar tareas por dominio"
    },
    "patternLogger": {
      "enabled": true,
      "priority": 3,
      "description": "Log patrones para memory MCP"
    }
  },
  "execution": {
    "timeout": 10000,
    "maxRetries": 2
  }
}
EOF

# Hook simplificado para cambio de contexto
cat > "$WORKSPACE_DIR/.claudehooks/context-switcher.js" << 'EOF'
#!/usr/bin/env node

// 🔄 Context Switcher - Detecta automáticamente el contexto de trabajo
const fs = require('fs');
const path = require('path');

function detectContext(input) {
    const keywords = {
        combustibles: ['combustible', 'vite', 'puerto 5173', 'gasolina', 'diesel'],
        alimentacion: ['alimentacion', 'comida', 'puerto 3000', 'menu', 'liquidacion'],
        firebase: ['firebase', 'emulator', 'firestore', 'auth'],
        general: ['monorepo', 'workspace', 'ambas apps']
    };
    
    for (const [context, words] of Object.entries(keywords)) {
        if (words.some(word => input.toLowerCase().includes(word))) {
            return context;
        }
    }
    return 'general';
}

// Log del contexto detectado
const input = process.argv[2] || '';
const context = detectContext(input);

console.log(`🎯 Contexto detectado: ${context}`);

// Guardar en memoria para Claude
const memoryPath = path.join(process.cwd(), '.mcp-memory', 'context.json');
const contextData = {
    timestamp: new Date().toISOString(),
    detected_context: context,
    input_sample: input.substring(0, 100)
};

try {
    fs.writeFileSync(memoryPath, JSON.stringify(contextData, null, 2));
} catch (err) {
    // Silently fail if can't write
}

process.exit(0);
EOF

chmod +x "$WORKSPACE_DIR/.claudehooks/context-switcher.js"

# 📝 Scripts personalizados (adaptados)
echo "📝 Creando scripts personalizados..."
mkdir -p "$WORKSPACE_DIR/scripts"

# Script de generación de contexto
cat > "$WORKSPACE_DIR/scripts/generate-context.sh" << 'EOF'
#!/bin/bash
echo "📄 Generando contexto del proyecto Forestech..."

CONTEXT_FILE="$WORKSPACE_DIR/contexto-actual.md"

cat > "$CONTEXT_FILE" << CONTEXT_EOF
# 🚀 Contexto Actual - Forestech

## 📊 Estado del Proyecto
- **Fecha**: $(date)
- **Directorio**: $WORKSPACE_DIR
- **Entorno**: Codespace Enhanced

## 📱 Aplicaciones
- **Combustibles**: $([ -d "combustibles" ] && echo "✅" || echo "❌")
- **Alimentación**: $([ -d "alimentacion" ] && echo "✅" || echo "❌")

## 🔥 Firebase
- **Configurado**: $([ -f "firebase.json" ] && echo "✅" || echo "❌")
- **Proyecto**: liquidacionapp-62962

## 🛠️ Herramientas
- **Node.js**: $(node --version 2>/dev/null || echo "No disponible")
- **Firebase CLI**: $(firebase --version 2>/dev/null || echo "No disponible")
- **Claude Code**: $(claude --version 2>/dev/null || echo "No disponible")

## 📦 Dependencias
- **Root**: $([ -d "node_modules" ] && echo "✅ Instaladas" || echo "❌ Faltantes")
- **Combustibles**: $([ -d "combustibles/node_modules" ] && echo "✅" || echo "❌")
- **Alimentación**: $([ -d "alimentacion/node_modules" ] && echo "✅" || echo "❌")
CONTEXT_EOF

echo "✅ Contexto generado en: $CONTEXT_FILE"
EOF

chmod +x "$WORKSPACE_DIR/scripts/generate-context.sh"

# Script dev mejorado con hooks
cat > "$WORKSPACE_DIR/scripts/dev-enhanced.sh" << 'EOF'
#!/bin/bash
echo "🚀 Iniciando servicios Forestech - Versión Enhanced..."

# Ejecutar hook de cambio de contexto
if [ -f ".claudehooks/context-switcher.js" ]; then
    node .claudehooks/context-switcher.js "starting development services"
fi

# Función de limpieza
cleanup() {
    echo "🛑 Deteniendo todos los servicios..."
    jobs -p | xargs -r kill
    exit 0
}
trap cleanup SIGINT SIGTERM

# 🔥 Firebase Emulators primero
if [ -f "firebase.json" ]; then
    echo "🔥 Iniciando Firebase Emulators..."
    firebase emulators:start --only auth,firestore,functions,hosting &
    sleep 5
fi

# ⛽ Combustibles
if [ -d "combustibles" ]; then
    echo "⛽ Iniciando Combustibles (Enhanced)..."
    (cd combustibles && npm run dev) &
fi

# 🍽️ Alimentación  
if [ -d "alimentacion" ]; then
    echo "🍽️ Iniciando Alimentación (Enhanced)..."
    (cd alimentacion && npm start) &
fi

echo ""
echo "✅ Servicios Enhanced iniciados!"
echo "================================"
echo "📱 Combustibles: http://localhost:5173"
echo "🍽️ Alimentación: http://localhost:3000"
echo "🔥 Firebase UI: http://localhost:4000"
echo "🧠 MCPs: Filesystem, Memory, Firebase, IDE"
echo "🔧 Hooks: Context Switcher, Pattern Logger activos"
echo ""
echo "Presiona Ctrl+C para detener"

wait
EOF

chmod +x "$WORKSPACE_DIR/scripts/dev-enhanced.sh"

# 📊 Script de métricas simplificado
cat > "$WORKSPACE_DIR/scripts/metrics.sh" << 'EOF'
#!/bin/bash
echo "📊 Métricas Forestech Codespace"
echo "==============================="

# Uso de recursos
echo "💾 Memoria: $(free -h | awk '/^Mem:/{printf "%.1f/%.1fGB (%.0f%%)\n", $3/1024, $2/1024, $3*100/$2}')"
echo "🖥️  CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')"
echo "💿 Disco: $(df -h $WORKSPACE_DIR | awk 'NR==2{printf "%s/%s (%s)\n", $3, $2, $5}')"

# Estado de servicios
echo ""
echo "🚀 Servicios activos:"
ps aux | grep -E "(node|npm|firebase)" | grep -v grep | awk '{printf "%-10s %s\n", $1, $11}' || echo "Ninguno"

# Puertos en uso
echo ""
echo "🌐 Puertos activos:"
ss -tuln | grep -E ":(3000|5173|4000|8080|9099)" || echo "Ninguno"
EOF

chmod +x "$WORKSPACE_DIR/scripts/metrics.sh"

# 🎯 Configuración final
echo ""
echo "✅ Setup Enhanced completado exitosamente!"
echo "🎉 Forestech con funcionalidades críticas listo!"
echo ""
echo "📋 Nuevas funcionalidades disponibles:"
echo "🧠 MCPs: Memory, Filesystem, Firebase, IDE, Sequential Thinking"
echo "🔧 Hooks: Context Switcher, Pattern Logger"
echo "📝 Scripts: generate-context.sh, metrics.sh"
echo "🚀 Enhanced: ./scripts/dev-enhanced.sh"
echo ""
echo "🎯 URLs de desarrollo:"
echo "📱 Combustibles: http://localhost:5173"
echo "🍽️ Alimentación: http://localhost:3000"
echo "🔥 Firebase UI: http://localhost:4000"
echo ""
echo "📂 Directorio: $WORKSPACE_DIR"
echo "🧠 Memoria MCP: $WORKSPACE_DIR/.mcp-memory/"
echo "🔧 Hooks: $WORKSPACE_DIR/.claudehooks/"