#!/bin/bash

echo "🐙 Comparando implementaciones de GitHub MCP"
echo "=============================================="

echo ""
echo "1. 🔍 GitHub CLI (Directo):"
echo "----------------------------"
echo "📋 Información del repo:"
gh repo view --json name,owner,defaultBranchRef

echo ""
echo "📝 PRs actuales:"
gh pr list --state all --limit 5

echo ""
echo "📊 Últimos commits:"
gh repo view --json pushedAt
git log --oneline -5

echo ""
echo "2. 🌐 GitHub MCP Oficial (HTTP):"
echo "--------------------------------"
echo "   Configurado en: https://api.githubcopilot.com/mcp/"
echo "   Tipo: API REST de GitHub vía servicios Copilot"
echo "   ✅ No requiere GitHub CLI"
echo "   ✅ Integración nativa con Copilot"

echo ""
echo "3. 🔧 GitHub MCP Custom (CLI Wrapper):"
echo "-------------------------------------"
echo "   Archivo: scripts/custom-github-mcp.js"
echo "   Tipo: Wrapper de GitHub CLI"
echo "   ⚡ Usa comandos 'gh' directamente"
echo "   🎯 Más control granular"

echo ""
echo "🤔 ¿Cuál usar?"
echo "=============="
echo "   HTTP MCP: Mejor integración, menos dependencias"
echo "   CLI MCP: Más funcionalidades, control directo"
echo ""
echo "   Recomendación: Mantener HTTP MCP como principal"
echo "                  CLI MCP como backup/especializado"