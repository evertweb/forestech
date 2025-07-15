#!/bin/bash

# 🎯 PROMPT MAESTRO FORESTECH - VERSIÓN UNIFICADA
# Combina: Contexto MCPs + AI Preferences + CLAUDE.md + Git
# Comando: "Cargar contexto Forestech completo: MCPs + Wrappers + CLAUDE.md + Git"

echo "🔥 CARGANDO CONTEXTO FORESTECH COMPLETO"
echo "======================================="
echo "📅 Fecha: $(date '+%d/%m/%Y %H:%M')"
echo ""

# 1. 🎯 PREFERENCIAS AI CRÍTICAS
echo "🎯 PREFERENCIAS AI CONFIGURADAS (14/07/2025):"
echo "=============================================="
echo "🚨 CONFIGURACIÓN PERMANENTE ESTABLECIDA:"
echo "   • SIEMPRE usar github-cli MCP wrapper internamente"
echo "   • NUNCA ejecutar comandos gh en terminal del usuario"
echo "   • Usar herramientas MCP automáticamente como procesos internos"
echo "   • Evitar comandos directos en terminal - preferir MCPs"
echo "   • Prioridad: github-cli > github > memory > filesystem > firebase > notion"
echo ""

# 2. 📡 ESTADO MCPs
echo "📡 MCPs ACTIVOS (6 configurados):"
echo "=================================="
if [ -f ".vscode/mcp.json" ]; then
    echo "✅ Configuración MCP encontrada:"
    echo "   🔥 Firebase MCP: proyecto liquidacionapp-62962"
    echo "   🐙 GitHub HTTP: api.githubcopilot.com/mcp/"
    echo "   ⚡ GitHub CLI: wrapper automático (PRIORITARIO)"
    echo "   🧠 Memory MCP: contexto persistente"
    echo "   📁 Filesystem MCP: gestión archivos"
    echo "   📝 Notion MCP: documentación automática"
else
    echo "❌ Configuración MCP no encontrada"
fi
echo ""

# 3. 📖 CONTEXTO CLAUDE.MD
echo "📖 CONFIGURACIÓN CLAUDE.MD:"
echo "============================"
if [ -f "CLAUDE.md" ]; then
    echo "✅ CLAUDE.md - Configuración completa disponible"
    echo "   📋 Selector de proyecto: ALIMENTACION | COMBUSTIBLES | SHARED | GENERAL"
    echo "   🤖 Sistema Dual AI: Copilot + Claude"
    echo "   🎯 MCPs integrados con preferencias AI"
    echo "   🔧 Fix Memory MCP para GitHub Copilot Agent"
    echo "   📚 Guías y mejores prácticas establecidas"
else
    echo "❌ CLAUDE.md no encontrado"
fi
echo ""

# 4. 🔀 HISTORIAL GIT
echo "🔀 HISTORIAL GIT RECIENTE:"
echo "========================="
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "📊 Últimos 5 commits:"
    git log --oneline -5 --pretty=format:"   %h %s (%an)"
    echo ""
    echo "🌿 Branch actual: $(git branch --show-current)"
    echo "📈 Estado: $(git status --porcelain | wc -l) archivos modificados"
else
    echo "❌ No hay repositorio Git"
fi
echo ""

# 5. 🏗️ ESTRUCTURA PROYECTO
echo "🏗️ ESTRUCTURA FORESTECH:"
echo "========================"
echo "📁 Monorepo con 3 aplicaciones principales:"
echo "   🍽️  alimentacion/ - App liquidaciones comidas"
echo "   ⛽  combustibles/ - App gestión combustibles"
echo "   🔧  shared/ - Recursos compartidos"
echo "   📋  .vscode/ - Configuración MCPs + AI preferences"
echo "   📚  docs/ - Documentación y análisis"
echo "   🔥  firebase.json - Configuración Firebase"
echo ""

# 6. 🎯 COMANDOS DISPONIBLES
echo "🎯 COMANDOS MCP DISPONIBLES:"
echo "==========================="
echo "🔥 Firebase: @firebase [consulta sobre Firestore/Auth]"
echo "🐙 GitHub HTTP: @github [información repositorio]"
echo "⚡ GitHub CLI: @github-cli [operaciones avanzadas]"
echo "🧠 Memory: @memory [guardar/recuperar contexto]"
echo "📁 Filesystem: @filesystem [gestión archivos]"
echo "📝 Notion: @notion [documentación automática]"
echo ""

# 7. 🚀 FRASE COMANDO MAESTRO
echo "🚀 COMANDO MAESTRO ESTABLECIDO:"
echo "==============================="
echo "\"Cargar contexto Forestech completo: MCPs + Wrappers + CLAUDE.md + Git\""
echo ""
echo "📋 Este comando carga:"
echo "   ✅ Preferencias AI (github-cli wrapper automático)"
echo "   ✅ Configuración MCPs (6 servidores)"
echo "   ✅ Contexto CLAUDE.md (guías completas)"
echo "   ✅ Historial Git (commits + estado actual)"
echo "   ✅ Estructura proyecto (apps + configuración)"
echo ""

echo "🎉 CONTEXTO FORESTECH COMPLETO CARGADO"
echo "======================================"
echo "✨ Sistema listo para trabajar con preferencias AI configuradas"
echo "🤖 MCPs configurados para uso automático interno"
echo "📚 Documentación y contexto completo disponible"