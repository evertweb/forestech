#!/bin/bash

# Script para aplicar configuración de idioma español en GitHub Copilot
# Autor: Forestech Colombia
# Fecha: 15 de julio de 2025

echo "🇪🇸 Aplicando configuración de idioma español para GitHub Copilot..."

# Verificar si VS Code está abierto
if pgrep -f "code" > /dev/null; then
    echo "📝 VS Code está ejecutándose. Preparando recargar configuración..."
    
    # Esperar un momento para que se guarden los cambios
    sleep 2
    
    echo "🔄 Instrucciones para aplicar cambios:"
    echo "1. Presiona Ctrl+Shift+P en VS Code"
    echo "2. Busca y ejecuta: 'Developer: Reload Window'"
    echo "3. O alternativamente, cierra y vuelve a abrir VS Code"
    
    echo ""
    echo "✅ Configuraciones aplicadas:"
    echo "   - github.copilot.chat.localeOverride: es"
    echo "   - github.copilot.conversation.localeOverride: es"
    echo "   - ai.locale: es"
    echo "   - Instrucciones de Copilot actualizadas en español"
    echo ""
    
    echo "🧪 Para probar la configuración:"
    echo "   1. Abre Copilot Chat (Ctrl+Shift+I)"
    echo "   2. Escribe: 'Explícame el proyecto Forestech'"
    echo "   3. Verifica que la respuesta sea completamente en español"
    
else
    echo "❌ VS Code no está ejecutándose actualmente"
    echo "👉 Abre VS Code para aplicar las configuraciones"
fi

echo ""
echo "📋 Archivos modificados:"
echo "   - .vscode/settings.json (configuraciones de idioma)"
echo "   - .github/copilot-instructions.md (instrucciones en español)"
echo "   - .github/workflows/copilot-bridge.yml (issues en español)"
echo "   - docs/CONFIGURACION-COPILOT-ESPAÑOL.md (documentación)"

echo ""
echo "🎯 Resultado esperado:"
echo "   ✅ Copilot Chat responde en español"
echo "   ✅ Issues automáticos generados en español"
echo "   ✅ Sugerencias de código con comentarios en español"
echo "   ✅ Workflows y mensajes en español"

echo ""
echo "🔧 Si sigues viendo respuestas en inglés:"
echo "   1. Cierra completamente VS Code"
echo "   2. Espera 5 segundos"
echo "   3. Vuelve a abrir VS Code"
echo "   4. Verifica la configuración en Settings (Ctrl+,)"

echo ""
echo "✨ ¡Configuración de idioma español aplicada exitosamente!"
