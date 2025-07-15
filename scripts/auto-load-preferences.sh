#!/bin/bash

# auto-load-preferences.sh
# Script que carga automáticamente las preferencias del AI al iniciar sesión

PREFERENCES_FILE="/home/evert/Documentos/appwebforestech/forestech/.vscode/ai-preferences.json"

echo "🤖 Cargando preferencias del AI Forestech..."
echo "============================================="

if [ -f "$PREFERENCES_FILE" ]; then
    echo "✅ Preferencias encontradas en: $PREFERENCES_FILE"
    
    # Extraer preferencias clave
    PREFER_WRAPPER=$(jq -r '.preferences.github.preferWrapper' "$PREFERENCES_FILE")
    AVOID_DIRECT=$(jq -r '.preferences.terminal.avoidDirectExecution' "$PREFERENCES_FILE")
    USE_WRAPPERS=$(jq -r '.preferences.automation.useWrappersInternally' "$PREFERENCES_FILE")
    
    echo ""
    echo "📋 Configuración cargada:"
    echo "   🐙 Usar GitHub CLI wrapper: $PREFER_WRAPPER"
    echo "   🚫 Evitar comandos directos: $AVOID_DIRECT"
    echo "   ⚡ Usar wrappers internamente: $USE_WRAPPERS"
    
    echo ""
    echo "🎯 Instrucciones para el AI:"
    echo "   - SIEMPRE usar github-cli MCP wrapper para GitHub"
    echo "   - NUNCA ejecutar comandos gh en terminal"
    echo "   - Usar herramientas MCP automáticamente"
    echo "   - Mantener preferencias entre sesiones"
    
    echo ""
    echo "✅ Preferencias cargadas exitosamente!"
    
    # Guardar en variable de entorno para la sesión
    export FORESTECH_USE_WRAPPERS="true"
    export FORESTECH_AVOID_TERMINAL="true"
    export FORESTECH_PREFER_GITHUB_CLI="true"
    
else
    echo "⚠️  Archivo de preferencias no encontrado"
    echo "   Ubicación esperada: $PREFERENCES_FILE"
fi

echo ""
echo "🔄 Para usar en una nueva sesión, ejecuta:"
echo "   source scripts/auto-load-preferences.sh"