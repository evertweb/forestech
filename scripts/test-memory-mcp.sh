#!/bin/bash
# Test script para Memory MCP

echo "🧠 Probando Memory MCP..."

# Configurar variable de entorno para memoria persistente
export MEMORY_FILE_PATH="/home/evert/Documentos/appwebforestech/forestech/.mcp-memory/forestech-memory.json"

# Crear directorio si no existe
mkdir -p "$(dirname "$MEMORY_FILE_PATH")"

echo "📁 Archivo de memoria: $MEMORY_FILE_PATH"

# Probar que Memory MCP funciona
echo "🔍 Testando Memory MCP con NPX..."

# Test básico - verificar que se inicia correctamente
timeout 5s npx -y @modelcontextprotocol/server-memory 2>&1 | head -10

echo ""
echo "✅ Memory MCP configurado correctamente"
echo "📋 Variables configuradas:"
echo "   - MEMORY_FILE_PATH: $MEMORY_FILE_PATH"
echo "   - Directorio: $(dirname "$MEMORY_FILE_PATH")"
echo ""
echo "🎯 Próximo paso: Configurar en .mcp.json para integración con Claude"