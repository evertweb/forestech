#!/bin/bash
# Script para instalar MCPs prioritarios para Forestech

echo "🤖 Instalando MCPs prioritarios para Forestech..."

# Crear directorio para MCPs locales
mkdir -p ~/.mcp-servers

echo "📦 Instalando MCPs usando diferentes métodos..."

# 1. Memory MCP (NPX - más confiable)
echo "🧠 Configurando Memory MCP..."
echo "✅ Memory MCP se ejecutará via NPX: @modelcontextprotocol/server-memory"

# 2. Time MCP (necesita instalación Python)
echo "⏰ Configurando Time MCP..."
if command -v pipx &> /dev/null; then
    echo "Installing with pipx..."
    pipx install mcp-server-time
elif command -v pip3 &> /dev/null; then
    echo "Installing with pip3 in user space..."
    pip3 install --user mcp-server-time
else
    echo "⚠️  Python pip not available. Time MCP will need manual installation."
fi

# 3. Git MCP 
echo "🔧 Configurando Git MCP..."
if command -v pipx &> /dev/null; then
    pipx install mcp-server-git
elif command -v pip3 &> /dev/null; then
    pip3 install --user mcp-server-git
else
    echo "⚠️  Git MCP will need manual installation."
fi

# 4. Firebase MCP (NPM)
echo "🔥 Configurando Firebase MCP..."
if command -v npm &> /dev/null; then
    echo "Installing with npm..."
    npm install -g firebase-tools
else
    echo "⚠️  NPM not available. Firebase MCP will need manual installation."
fi

# 5. Verificar instalaciones
echo "🔍 Verificando instalaciones..."

# Test Memory MCP
echo "Testing Memory MCP..."
npx -y @modelcontextprotocol/server-memory --version 2>/dev/null && echo "✅ Memory MCP: OK" || echo "⚠️  Memory MCP: Manual installation needed"

# Test Time MCP
echo "Testing Time MCP..."
mcp-server-time --version 2>/dev/null && echo "✅ Time MCP: OK" || echo "⚠️  Time MCP: Manual installation needed"

# Test Git MCP
echo "Testing Git MCP..."
mcp-server-git --version 2>/dev/null && echo "✅ Git MCP: OK" || echo "⚠️  Git MCP: Manual installation needed"

# Test Firebase MCP
echo "Testing Firebase MCP..."
firebase --version 2>/dev/null && echo "✅ Firebase MCP: OK" || echo "⚠️  Firebase MCP: Manual installation needed"

echo ""
echo "🎯 Configuración completada!"
echo "Los MCPs están configurados en .mcp.json y listos para usar."
echo ""
echo "📋 Para usar los MCPs:"
echo "1. Memory MCP: Se ejecuta automáticamente via NPX"
echo "2. Time MCP: Requiere instalación Python (pip install mcp-server-time)"
echo "3. Git MCP: Requiere instalación Python (pip install mcp-server-git)"
echo "4. GitHub MCP: Se ejecuta via ecosistema MCP existente"
echo "5. Firebase MCP: Requiere instalación NPM (npm install -g firebase-tools)"
echo ""
echo "📚 Ver documentación en CLAUDE.md para más detalles."
