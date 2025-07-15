#!/bin/bash

# test-notion-mcp.sh
# Script para verificar que Notion MCP esté configurado correctamente

echo "📝 Verificando configuración de Notion MCP"
echo "=========================================="

# Verificar archivo de configuración
echo "1. 📄 Verificando archivo de configuración..."
if [ -f ".vscode/notion.env" ]; then
    echo "   ✅ Archivo .vscode/notion.env existe"
    
    if grep -q "NOTION_API_KEY=ntn_" ".vscode/notion.env"; then
        echo "   ✅ Token de Notion configurado"
        
        # Cargar variables de entorno
        export $(cat .vscode/notion.env | xargs)
        
        if [ -n "$NOTION_API_KEY" ] && [ "$NOTION_API_KEY" != "ntn_" ]; then
            echo "   ✅ Token válido detectado: ${NOTION_API_KEY:0:12}..."
        else
            echo "   ❌ Token no válido o vacío"
            exit 1
        fi
    else
        echo "   ❌ Token no configurado en .vscode/notion.env"
        echo "   📝 Agrega: NOTION_API_KEY=ntn_tu_token_aqui"
        exit 1
    fi
else
    echo "   ❌ Archivo .vscode/notion.env no encontrado"
    echo "   🔧 Ejecuta: ./scripts/setup-notion-mcp.sh"
    exit 1
fi

# Verificar MCP configuration
echo ""
echo "2. ⚙️  Verificando configuración MCP..."
if grep -q '"notion"' ".vscode/mcp.json"; then
    echo "   ✅ Notion MCP configurado en .vscode/mcp.json"
else
    echo "   ❌ Notion MCP no encontrado en configuración"
    exit 1
fi

# Verificar que el package esté disponible
echo ""
echo "3. 📦 Verificando package de Notion MCP..."
npx @modelcontextprotocol/server-notion@latest --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Package de Notion MCP disponible"
else
    echo "   ⚠️  Package se instalará automáticamente cuando sea necesario"
fi

# Test básico de conectividad (si está configurado)
echo ""
echo "4. 🔗 Probando conectividad con Notion..."
if [ -n "$NOTION_API_KEY" ]; then
    # Test básico usando curl
    response=$(curl -s -w "%{http_code}" -o /dev/null \
        -H "Authorization: Bearer $NOTION_API_KEY" \
        -H "Content-Type: application/json" \
        -H "Notion-Version: 2022-06-28" \
        "https://api.notion.com/v1/users/me")
    
    if [ "$response" = "200" ]; then
        echo "   ✅ Conexión exitosa con Notion API"
    else
        echo "   ⚠️  Error de conexión (código: $response)"
        echo "   💡 Verifica que el token sea correcto y tenga permisos"
    fi
else
    echo "   ⚠️  No se puede probar - token no configurado"
fi

echo ""
echo "🎉 Verificación completada!"
echo ""
echo "📚 Comandos disponibles en VS Code Copilot:"
echo "   @notion busca páginas sobre [tema]"
echo "   @notion crea una página llamada [nombre]"
echo "   @notion lee el contenido de [página]"
echo "   @notion actualiza [página] con [contenido]"
echo ""
echo "🔄 Para aplicar cambios: ./scripts/restart-vscode-mcp.sh"
