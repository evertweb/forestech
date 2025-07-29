#!/bin/bash

# 🚀 Forestech Manual Setup - Para ejecutar DESPUÉS de que el container inicie
echo "🚀 Setup manual de Forestech iniciando..."

# 📁 Crear directorios esenciales
echo "📁 Creando directorios..."
mkdir -p .mcp-memory .claudehooks scripts .firebase

# 🧠 Configuración MCP básica
echo "🧠 Configurando MCP..."
cat > .mcp.json << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspaces/forestech"]
    }
  }
}
EOF

# 📝 Script de desarrollo simple
cat > scripts/dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando aplicaciones..."

# ⛽ Combustibles
if [ -d "combustibles" ]; then
    echo "⛽ Iniciando Combustibles en puerto 5173..."
    (cd combustibles && npm run dev) &
fi

# 🍽️ Alimentación  
if [ -d "alimentacion" ]; then
    echo "🍽️ Iniciando Alimentación en puerto 3000..."
    (cd alimentacion && npm start) &
fi

echo "✅ Apps iniciadas!"
echo "📱 Combustibles: http://localhost:5173"
echo "🍽️ Alimentación: http://localhost:3000"

wait
EOF

chmod +x scripts/dev.sh

echo ""
echo "✅ Setup manual completado!"
echo ""
echo "🎯 Próximos pasos:"
echo "1. 📦 Instalar dependencias: cd combustibles && npm install"
echo "2. 📦 Instalar dependencias: cd alimentacion && npm install"  
echo "3. 🚀 Iniciar apps: ./scripts/dev.sh"
echo "4. 🔥 Firebase CLI (opcional): npm install -g firebase-tools"
echo ""