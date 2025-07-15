#!/bin/bash

# setup-notion-mcp.sh
# Script para configurar Notion MCP con VS Code Copilot

echo "📝 Configuración de Notion MCP para Forestech"
echo "=============================================="

# Verificar que existe el archivo de ejemplo
if [ ! -f ".vscode/notion.env.example" ]; then
    echo "❌ Error: Archivo de ejemplo no encontrado"
    exit 1
fi

echo ""
echo "📋 PASOS PARA CONFIGURAR NOTION:"
echo ""
echo "1. 🌐 Ve a: https://www.notion.so/my-integrations"
echo "2. 🔧 Crea una nueva integración:"
echo "   - Name: Forestech VS Code Copilot"
echo "   - Description: Integración para desarrollo"
echo "   - Workspace: [Tu workspace]"
echo ""
echo "3. 🔑 Copia el 'Internal Integration Token'"
echo "4. 📄 Pégalo en el archivo .vscode/notion.env"
echo ""
echo "5. 🔒 Da permisos a la integración:"
echo "   - Ve a las páginas de Notion que quieras usar"
echo "   - Haz clic en 'Share' → 'Invite'"
echo "   - Busca 'Forestech VS Code Copilot' y agrégala"
echo ""

# Verificar si ya existe configuración
if [ -f ".vscode/notion.env" ]; then
    if grep -q "NOTION_API_KEY=secret_" ".vscode/notion.env"; then
        echo "✅ Archivo .vscode/notion.env ya configurado"
    else
        echo "⚠️  Archivo .vscode/notion.env existe pero necesita el token"
        echo "📝 Edita .vscode/notion.env y agrega tu token:"
        echo "   NOTION_API_KEY=secret_tu_token_aqui"
    fi
else
    echo "📝 Copia el archivo de ejemplo:"
    cp .vscode/notion.env.example .vscode/notion.env
    echo "✅ Archivo .vscode/notion.env creado"
    echo "📝 Ahora edítalo y agrega tu token de Notion"
fi

echo ""
echo "🧪 Para probar la configuración:"
echo "   1. Configura tu token en .vscode/notion.env"
echo "   2. Ejecuta: ./scripts/test-notion-mcp.sh"
echo "   3. Reinicia VS Code: ./scripts/restart-vscode-mcp.sh"
echo ""
echo "🎯 Comandos que podrás usar:"
echo "   @notion crea una página de documentación"
echo "   @notion busca información sobre el proyecto"
echo "   @notion actualiza el estado del sprint"
