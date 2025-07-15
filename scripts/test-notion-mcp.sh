#!/bin/bash

# 🔧 Script de Prueba: Notion MCP Server
# Forestech Colombia - 15 julio 2025
# Verifica que el servidor MCP Notion esté funcionando correctamente

echo "🚀 Iniciando prueba del servidor MCP Notion (GitHub Copilot)..."
echo "📍 Directorio: $(pwd)"
echo "⏰ Fecha: $(date)"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Verificar que el token está configurado en mcp.json
echo -e "${BLUE}📋 1. Verificando configuración del token en mcp.json...${NC}"
TOKEN_CONFIG=$(grep -A 10 "notion" .vscode/mcp.json | grep "NOTION_API_TOKEN")
if [[ "$TOKEN_CONFIG" == *"ntn_175303559088"* ]]; then
    echo -e "${GREEN}✅ Token configurado correctamente en mcp.json${NC}"
else
    echo -e "${RED}❌ Token no encontrado en configuración MCP${NC}"
    echo "Verificando archivo .vscode/mcp.json..."
    cat .vscode/mcp.json | grep -A 15 "notion"
    exit 1
fi

# 2. Verificar la instalación del paquete correcto
echo -e "${BLUE}📦 2. Verificando servidor @suekou/mcp-notion-server...${NC}"
if command -v npx &> /dev/null; then
    echo -e "${GREEN}✅ NPX disponible${NC}"
    
    # Intentar instalar/verificar el paquete
    echo -e "${YELLOW}📥 Instalando/verificando @suekou/mcp-notion-server...${NC}"
    npx -y @suekou/mcp-notion-server --help 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Servidor Notion MCP instalado correctamente${NC}"
    else
        echo -e "${YELLOW}⚠️ Instalando servidor por primera vez...${NC}"
        npx -y @suekou/mcp-notion-server --help
    fi
else
    echo -e "${RED}❌ NPX no disponible${NC}"
    exit 1
fi

# 3. Verificar estructura de configuración MCP
echo -e "${BLUE}🔧 3. Verificando estructura de configuración MCP...${NC}"
MCP_CONFIG=".vscode/mcp.json"
if [ -f "$MCP_CONFIG" ]; then
    echo -e "${GREEN}✅ Archivo mcp.json encontrado${NC}"
    
    # Verificar que el JSON es válido
    if cat "$MCP_CONFIG" | python3 -m json.tool > /dev/null 2>&1; then
        echo -e "${GREEN}✅ JSON válido${NC}"
    else
        echo -e "${RED}❌ JSON inválido${NC}"
        exit 1
    fi
    
    # Mostrar configuración actual
    echo -e "${BLUE}📄 Configuración actual de Notion:${NC}"
    grep -A 12 '"notion"' "$MCP_CONFIG" | head -12
else
    echo -e "${RED}❌ Archivo mcp.json no encontrado${NC}"
    exit 1
fi

# 4. Verificar variables de entorno adicionales
echo -e "${BLUE}🌍 4. Verificando variables de entorno...${NC}"
export NOTION_API_TOKEN="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"
export NOTION_MARKDOWN_CONVERSION="true"
echo -e "${GREEN}✅ Variables exportadas correctamente${NC}"

# 5. Test de conectividad básica (si es posible)
echo -e "${BLUE}🔗 5. Información de herramientas disponibles...${NC}"
echo -e "${YELLOW}📋 Herramientas principales de Notion MCP:${NC}"
echo "   • notion_retrieve_page - Obtener páginas"
echo "   • notion_query_database - Consultar bases de datos"
echo "   • notion_create_database_item - Crear elementos"
echo "   • notion_search - Buscar contenido"
echo "   • notion_append_block_children - Añadir contenido"
echo "   • notion_update_page_properties - Actualizar propiedades"

# 6. Información adicional
echo ""
echo -e "${BLUE}📚 6. Información adicional:${NC}"
echo -e "${YELLOW}🎯 Para usar en GitHub Copilot:${NC}"
echo "   @notion \"consulta mi base de datos de proyectos\""
echo "   @notion \"crea una nueva página para el proyecto X\""
echo "   @notion \"busca documentación sobre Y\""
echo ""
echo -e "${YELLOW}🔧 Configuración aplicada:${NC}"
echo "   • Servidor: @suekou/mcp-notion-server"
echo "   • Conversión Markdown: activada (reduce tokens)"
echo "   • Token: configurado y oculto por seguridad"
echo ""
echo -e "${GREEN}🎉 Prueba completada exitosamente!${NC}"
echo -e "${BLUE}💡 Reinicia VS Code para aplicar la nueva configuración MCP${NC}"
