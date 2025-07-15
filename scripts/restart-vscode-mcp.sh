#!/bin/bash

# restart-vscode-mcp.sh
# Script para reiniciar VS Code y cargar la configuración MCP de Firebase

echo "🔄 Reiniciando VS Code para cargar Firebase MCP..."
echo "=============================================="

# Verificar que VS Code esté instalado
if ! command -v code &> /dev/null; then
    echo "❌ Error: VS Code no está instalado o no está en PATH"
    exit 1
fi

# Verificar configuración MCP
if [ ! -f ".vscode/mcp.json" ]; then
    echo "❌ Error: Configuración MCP no encontrada"
    exit 1
fi

echo "✅ Configuración MCP encontrada"
echo "📄 Configuración actual:"
cat .vscode/mcp.json | jq .

echo ""
echo "🔄 Cerrando VS Code..."
# Cerrar todas las ventanas de VS Code
pkill -f "code.*forestech" 2>/dev/null || true
sleep 2

echo "🚀 Abriendo VS Code con configuración MCP..."
# Abrir VS Code en el directorio actual
code . &

echo ""
echo "✅ VS Code reiniciado!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Espera a que VS Code cargue completamente"
echo "   2. Abre el panel de Copilot Chat"
echo "   3. Prueba con comandos como:"
echo "      - @firebase ¿cuáles son las colecciones en mi Firestore?"
echo "      - @firebase lista los usuarios autenticados"
echo "      - @firebase ayúdame con las reglas de seguridad"
echo ""
echo "🎉 ¡Firebase MCP está listo para usar!"
