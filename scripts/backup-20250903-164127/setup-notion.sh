#!/bin/bash
# 📄 NOTION AUTOMATION SETUP - FORESTECH
# Script para configurar y probar la integración con Notion

echo "🚀 Configurando automatización de Notion para Forestech..."
echo "=========================================================="

# Verificar dependencias
echo "🔍 Verificando dependencias..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# NPM
if ! command -v npm &> /dev/null; then
    echo "❌ NPM no está instalado"
    exit 1
fi
echo "✅ NPM: $(npm --version)"

# Verificar .env
if [ ! -f ".env" ]; then
    echo "❌ Archivo .env no encontrado"
    exit 1
fi

# Verificar token de Notion
if ! grep -q "NOTION_API_KEY" .env; then
    echo "❌ NOTION_API_KEY no configurado en .env"
    exit 1
fi
echo "✅ Token de Notion configurado"

# Verificar cliente de Notion
echo "📦 Verificando cliente de Notion..."
if npm list @notionhq/client &> /dev/null; then
    echo "✅ Cliente de Notion instalado"
else
    echo "📦 Instalando cliente de Notion..."
    npm install @notionhq/client
fi

# Verificar dotenv
if npm list dotenv &> /dev/null; then
    echo "✅ dotenv instalado"
else
    echo "📦 Instalando dotenv..."
    npm install dotenv
fi

echo ""
echo "🎯 CONFIGURACIÓN COMPLETADA"
echo "=========================================================="

# Probar conexión
echo "🔗 Probando conexión con Notion..."
node scripts/notion-integration.js

echo ""
echo "📋 COMANDOS DISPONIBLES:"
echo "----------------------------------------"
echo "# Subir análisis de combustibles:"
echo "node scripts/notion-integration.js"
echo ""
echo "# Crear base de datos de documentación:"
echo "node scripts/notion-integration.js --create-db"
echo ""
echo "# Descubrir workspace:"
echo "node scripts/notion-integration.js --discover"
echo ""
echo "✅ Setup completado!"
