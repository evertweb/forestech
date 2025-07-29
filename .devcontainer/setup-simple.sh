#!/bin/bash

# 🚀 Forestech Simple Setup - Solo lo esencial para evitar fallos

echo "🚀 Configuración SIMPLE de Forestech iniciando..."

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

# 📦 Solo crear directorios necesarios
echo "📁 Creando directorios esenciales..."
mkdir -p .mcp-memory .claudehooks scripts

# 🧠 Configuración MCP mínima
echo "🧠 Configurando MCPs básicos..."
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
    }
  }
}
EOF

# 📝 Script de desarrollo básico
cat > scripts/dev-simple.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando servicios Forestech básicos..."

# 🔥 Firebase Emulators
if [ -f "firebase.json" ]; then
    echo "🔥 Iniciando Firebase Emulators..."
    firebase emulators:start --only auth,firestore &
    sleep 3
fi

# ⛽ Combustibles
if [ -d "combustibles" ]; then
    echo "⛽ Iniciando Combustibles..."
    (cd combustibles && npm run dev) &
fi

# 🍽️ Alimentación  
if [ -d "alimentacion" ]; then
    echo "🍽️ Iniciando Alimentación..."
    (cd alimentacion && npm start) &
fi

echo "✅ Servicios iniciados!"
echo "📱 Combustibles: http://localhost:5173"
echo "🍽️ Alimentación: http://localhost:3000"
echo "🔥 Firebase UI: http://localhost:4000"

wait
EOF

chmod +x scripts/dev-simple.sh

echo ""
echo "✅ Setup SIMPLE completado!"
echo "🎯 Para iniciar desarrollo: ./scripts/dev-simple.sh"
echo "🤖 Claude Code: instalar manualmente con 'curl -sSL https://claude.ai/install.sh | bash'"
echo "🔥 Firebase CLI: instalar manualmente con 'npm install -g firebase-tools'"