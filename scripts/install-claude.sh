#!/bin/bash

# 🤖 Script para instalar Claude Code en Codespace
# Ejecutar si no se instaló automáticamente

echo "🤖 Instalando Claude Code manualmente..."

# Instalar Claude Code
curl -sSL https://claude.ai/install.sh | bash

# Añadir al PATH
if [ -f "$HOME/.claude/bin/claude" ]; then
    echo 'export PATH="$HOME/.claude/bin:$PATH"' >> ~/.bashrc
    export PATH="$HOME/.claude/bin:$PATH"
    
    # Recargar bash
    source ~/.bashrc
    
    echo "✅ Claude Code instalado correctamente!"
    echo "🎯 Verifica con: claude --version"
    echo "🚀 Usa con: claude"
else
    echo "❌ Error: Claude Code no se instaló correctamente"
    echo "🔧 Intenta reinstalar o contacta soporte"
fi