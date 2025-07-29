#!/bin/bash

# 🔍 Script de diagnóstico completo para Codespace
echo "🔍 Diagnóstico completo del Codespace Forestech..."
echo "================================================="

# 📂 Verificar directorio actual y estructura
echo ""
echo "📂 ESTRUCTURA DE DIRECTORIOS:"
echo "Directorio actual: $(pwd)"
echo "Usuario actual: $(whoami)"
echo "Directorio home: $HOME"

echo ""
echo "📋 CONTENIDO DEL WORKSPACE:"
ls -la /workspace/ 2>/dev/null || echo "❌ /workspace no existe"

echo ""
echo "📋 CONTENIDO ACTUAL:"
ls -la . 

echo ""
echo "🔍 BUSCAR ESTRUCTURA FORESTECH:"
find . -maxdepth 2 -type d -name "combustibles" 2>/dev/null || echo "❌ combustibles no encontrado"
find . -maxdepth 2 -type d -name "alimentacion" 2>/dev/null || echo "❌ alimentacion no encontrado"
find . -maxdepth 2 -type d -name "scripts" 2>/dev/null || echo "❌ scripts no encontrado"

echo ""
echo "📦 VERIFICAR NODE.JS:"
node --version 2>/dev/null || echo "❌ Node.js no disponible"
npm --version 2>/dev/null || echo "❌ npm no disponible"

echo ""
echo "🔥 VERIFICAR FIREBASE:"
firebase --version 2>/dev/null || echo "❌ Firebase CLI no disponible"

echo ""
echo "🤖 VERIFICAR CLAUDE CODE:"
claude --version 2>/dev/null || echo "❌ Claude Code no disponible"
which claude 2>/dev/null || echo "❌ Claude no está en PATH"

echo ""
echo "🛠️ VERIFICAR ARCHIVOS CLAVE:"
[ -f "package.json" ] && echo "✅ package.json existe" || echo "❌ package.json no existe"
[ -f "firebase.json" ] && echo "✅ firebase.json existe" || echo "❌ firebase.json no existe"
[ -f "CLAUDE.md" ] && echo "✅ CLAUDE.md existe" || echo "❌ CLAUDE.md no existe"

echo ""
echo "🌐 VARIABLES DE ENTORNO:"
echo "NODE_ENV: ${NODE_ENV:-no definida}"
echo "PATH: $PATH"

echo ""
echo "💾 ESPACIO EN DISCO:"
df -h . 2>/dev/null || echo "❌ No se puede verificar espacio"

echo ""
echo "🔧 POSIBLES SOLUCIONES:"
echo "1. Si estás en /workspaces/forestech: cd al directorio correcto"
echo "2. Si falta estructura: git pull para sincronizar"
echo "3. Si faltan dependencias: npm install en cada directorio"
echo "4. Si falta Claude: ejecutar ./scripts/install-claude.sh"

echo ""
echo "📋 COMANDO DE DIAGNÓSTICO COMPLETADO"