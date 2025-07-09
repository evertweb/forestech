#!/bin/bash
# Script para iniciar Gemini CLI con la configuración del proyecto

# Ruta al directorio raíz del proyecto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Ruta al archivo de configuración MCP
MCP_CONFIG="$PROJECT_DIR/.mcp.json"

# Verificar si el archivo de configuración existe
if [ ! -f "$MCP_CONFIG" ]; then
    echo "Error: No se encontró el archivo de configuración .mcp.json en $PROJECT_DIR"
    exit 1
fi

# Comando para iniciar Gemini CLI (suponiendo que está en el PATH)
# Pasamos la configuración a través de una variable de entorno
GEMINI_MCP_CONFIG="$MCP_CONFIG" gemini
