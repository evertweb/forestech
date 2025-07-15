#!/bin/bash

# 📋 GENERADOR DE CONTEXTO AUTOMÁTICO FORESTECH
# Genera un resumen actualizado para nuevas sesiones de Copilot

echo "🔄 Generando contexto actualizado..."

# Header
echo "# 🚀 CONTEXTO FORESTECH - $(date '+%d/%m/%Y %H:%M')"
echo ""
echo "## 🎯 COMANDO PARA NUEVA SESIÓN:"
echo "\`\`\`"
echo "Cargar contexto Forestech: MCPs + CLAUDE.md + historial Git"
echo "\`\`\`"
echo ""

# Git History
echo "## 🔀 HISTORIAL GIT RECIENTE"
echo "\`\`\`"
git log --oneline -10 2>/dev/null || echo "No hay historial disponible"
echo "\`\`\`"
echo ""

# CLAUDE.md Summary
echo "## 📖 RESUMEN CLAUDE.MD"
if [ -f "CLAUDE.md" ]; then
    echo "✅ **Estado**: Configuración completa disponible"
    echo ""
    echo "**Características clave:**"
    grep -E "^###|^##|\- \*\*" CLAUDE.md | head -10 | sed 's/^/- /'
else
    echo "❌ CLAUDE.md no encontrado"
fi
echo ""

# MCP Status
echo "## 🤖 ESTADO MCPs"
if [ -f ".vscode/mcp.json" ]; then
    echo "✅ **5 MCPs configurados:**"
    echo "- Firebase MCP (liquidacionapp-62962)"
    echo "- GitHub MCP (evertweb/forestech)"
    echo "- Memory MCP (contexto persistente)"
    echo "- Filesystem MCP (operaciones archivos)"
    echo "- Notion MCP (documentación automática)"
else
    echo "❌ MCPs no configurados"
fi
echo ""

# Project Status
echo "## 🏗️ ESTADO PROYECTO"
echo "- **Alimentación**: $([ -d 'alimentacion' ] && echo '✅ Disponible' || echo '❌ No encontrado')"
echo "- **Combustibles**: $([ -d 'combustibles' ] && echo '✅ Disponible' || echo '❌ No encontrado')"
echo "- **Firebase**: $([ -f 'firebase.json' ] && echo '✅ Configurado' || echo '❌ No configurado')"
echo "- **Fecha generación**: $(date '+%d/%m/%Y %H:%M')"
echo ""

echo "---"
echo "**Contexto generado automáticamente para continuidad entre sesiones**"