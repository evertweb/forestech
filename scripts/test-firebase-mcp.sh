#!/bin/bash

# test-firebase-mcp.sh
# Script para verificar que Firebase MCP server esté funcionando correctamente

echo "🔥 Verificando Firebase MCP Server para Forestech"
echo "=================================================="

# Verificar autenticación Firebase
echo "1. ✅ Verificando autenticación Firebase..."
npx firebase-tools@latest projects:list --json > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Firebase CLI autenticado correctamente"
else
    echo "   ❌ Error: Firebase CLI no autenticado"
    exit 1
fi

# Verificar proyecto activo
echo ""
echo "2. 📋 Verificando proyecto activo..."
CURRENT_PROJECT=$(npx firebase-tools@latest use --json 2>/dev/null | jq -r '.current // "none"')
echo "   📋 Proyecto activo: $CURRENT_PROJECT"

if [ "$CURRENT_PROJECT" = "liquidacionapp-62962" ]; then
    echo "   ✅ Proyecto correcto configurado"
else
    echo "   ⚠️  Proyecto esperado: liquidacionapp-62962"
fi

# Verificar configuración MCP
echo ""
echo "3. ⚙️  Verificando configuración MCP..."
if [ -f ".vscode/mcp.json" ]; then
    echo "   ✅ Archivo .vscode/mcp.json existe (configuración local)"
    echo "   📄 Contenido:"
    cat .vscode/mcp.json | jq .
else
    echo "   ❌ Error: Archivo .vscode/mcp.json no encontrado"
    exit 1
fi

# Verificar que no hay configuración global conflictiva
if [ -f "$HOME/.config/Code/User/mcp.json" ]; then
    echo "   ⚠️  Configuración MCP global encontrada - puede causar conflictos"
else
    echo "   ✅ Sin configuración MCP global - usando solo configuración local"
fi

# Verificar que Firebase MCP package esté disponible
echo ""
echo "4. 🧪 Verificando Firebase MCP package..."
npx @google-cloud/firebase-mcp@latest --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Firebase MCP package disponible"
else
    echo "   ⚠️  Firebase MCP package se instalará automáticamente cuando sea necesario"
fi

# Verificar firebase.json
echo ""
echo "5. 📁 Verificando configuración Firebase..."
if [ -f "firebase.json" ]; then
    echo "   ✅ firebase.json existe"
    echo "   🔥 Servicios configurados:"
    jq -r 'keys[]' firebase.json | sed 's/^/      - /'
else
    echo "   ❌ Error: firebase.json no encontrado"
fi

# Verificar .firebaserc
echo ""
echo "6. 🎯 Verificando proyecto por defecto..."
if [ -f ".firebaserc" ]; then
    echo "   ✅ .firebaserc existe"
    DEFAULT_PROJECT=$(jq -r '.projects.default // "none"' .firebaserc)
    echo "   🎯 Proyecto por defecto: $DEFAULT_PROJECT"
else
    echo "   ❌ Error: .firebaserc no encontrado"
fi

echo ""
echo "🎉 Verificación completada!"
echo ""
echo "📚 Para usar Firebase MCP server:"
echo "   - Las herramientas están disponibles en VS Code Copilot"
echo "   - Puedes hacer consultas sobre Firestore, Auth, Storage"
echo "   - Gemini in Firebase está habilitado para asistencia"
echo ""
echo "🔍 Ejemplos de comandos disponibles:"
echo "   "
echo "🔥 Firebase MCP:"
echo "   - @firebase ¿cuáles son las colecciones en mi Firestore?"
echo "   - @firebase lista los usuarios autenticados"
echo "   - @firebase ayúdame con las reglas de seguridad"
echo "   "
echo "🐙 GitHub MCP:"
echo "   - @github analiza el repositorio actual"
echo "   - @github cuáles son los últimos commits?"
echo "   - @github ayúdame con el PR actual"
echo "   "
echo "🧠 Memory MCP:"
echo "   - @memory recuerda que usamos React + Vite"
echo "   - @memory ¿qué decisiones tomamos en el último sprint?"
echo "   - @memory guarda esta configuración importante"
echo "   "
echo "📁 Filesystem MCP:"
echo "   - @filesystem busca archivos .jsx en src/"
echo "   - @filesystem lee el contenido de package.json"
echo "   - @filesystem crea un archivo de configuración"
echo "   "
echo "📝 Notion MCP (opcional):"
echo "   - @notion crea una página de documentación"
echo "   - @notion busca notas sobre el proyecto"
echo "   - @notion actualiza el estado del sprint"
