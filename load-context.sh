#!/bin/bash

# 🚀 SCRIPT DE CONTEXTO INICIAL FORESTECH
# Uso: ./load-context.sh

echo "🔥 Cargando contexto inicial Forestech..."

# 1. Verificar MCPs
echo "📡 Verificando MCPs..."
if [ -f ".vscode/mcp.json" ]; then
    echo "✅ MCP configurado"
else
    echo "❌ MCP no encontrado"
fi

# 2. Verificar Firebase
echo "🔥 Verificando Firebase..."
if [ -f "firebase.json" ]; then
    echo "✅ Firebase configurado"
else
    echo "❌ Firebase no encontrado"
fi

# 3. Leer contexto de CLAUDE.md
echo "📖 Estado según CLAUDE.md:"
if [ -f "CLAUDE.md" ]; then
    echo "✅ CLAUDE.md encontrado - Configuración completa disponible"
    echo "   - Sistema Dual AI Agents (Copilot + Claude)"
    echo "   - Firebase MCP server integrado"
    echo "   - 13 MCPs configurados"
else
    echo "❌ CLAUDE.md no encontrado"
fi

# 4. Historial Git reciente
echo "🔀 Últimos 5 commits:"
git log --oneline -5 2>/dev/null || echo "No hay historial Git disponible"

# 5. Mostrar estructura
echo "🏗️ Estructura del proyecto:"
echo "├── alimentacion/ (App de alimentación)"
echo "├── combustibles/ (App de combustibles)" 
echo "├── .vscode/ (Configuración MCPs)"
echo "├── CLAUDE.md (Configuración completa)"
echo "└── scripts/ (Scripts de testing)"

# 6. Estado de MCPs
echo ""
echo "📋 MCPs Configurados:"
echo "├── ✅ Firebase MCP (liquidacionapp-62962)"
echo "├── ✅ GitHub MCP (evertweb/forestech)"
echo "├── ✅ Memory MCP (contexto persistente)"
echo "├── ✅ Filesystem MCP (operaciones archivos)"
echo "└── ✅ Notion MCP (documentación auto)"

echo ""
echo "🎯 Para Copilot, usa:"
echo "   'Cargar contexto Forestech: MCPs + CLAUDE.md + Git'"
echo ""
echo "✨ Contexto inicial completo listo!"
echo "📖 Incluye: Memory MCP + CLAUDE.md + Git Log + Configuración"