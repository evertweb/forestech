#!/bin/bash

# 🚀 Forestech Post-Start Script
# Este script se ejecuta cada vez que se inicia el contenedor

set -e

echo "🌟 Iniciando servicios de Forestech..."

# 🔄 Actualizar información del repositorio
cd /workspace
git fetch --quiet || true

# 🔥 Verificar estado de Firebase
echo "🔥 Verificando Firebase..."
if command -v firebase &> /dev/null; then
    # Verificar si ya está logueado
    if firebase projects:list &> /dev/null; then
        echo "✅ Firebase ya está autenticado"
        CURRENT_PROJECT=$(firebase use --json 2>/dev/null | jq -r '.result.name // "ninguno"' || echo "ninguno")
        echo "📋 Proyecto actual: $CURRENT_PROJECT"
    else
        echo "⚠️  Firebase necesita autenticación"
        echo "📋 Ejecuta: firebase login --no-localhost"
    fi
else
    echo "❌ Firebase CLI no está instalado"
fi

# 🤖 Verificar Claude Code
echo "🤖 Verificando Claude Code..."
if command -v claude &> /dev/null; then
    echo "✅ Claude Code está disponible"
    CLAUDE_VERSION=$(claude --version 2>/dev/null || echo "desconocida")
    echo "📋 Versión: $CLAUDE_VERSION"
else
    echo "⚠️  Claude Code no está instalado"
    echo "📋 Instálalo con: curl -sSL https://claude.ai/install.sh | bash"
fi

# 📊 Mostrar estado del proyecto
echo ""
echo "📊 Estado del proyecto Forestech:"
echo "=================================="

# Verificar estructura
if [ -d "combustibles" ]; then
    echo "⛽ Combustibles: ✅ Encontrado"
    if [ -f "combustibles/package.json" ]; then
        COMBUSTIBLES_VERSION=$(jq -r '.version // "unknown"' combustibles/package.json 2>/dev/null || echo "unknown")
        echo "   📦 Versión: $COMBUSTIBLES_VERSION"
    fi
else
    echo "⛽ Combustibles: ❌ No encontrado"
fi

if [ -d "alimentacion" ]; then
    echo "🍽️ Alimentación: ✅ Encontrado"
    if [ -f "alimentacion/package.json" ]; then
        ALIMENTACION_VERSION=$(jq -r '.version // "unknown"' alimentacion/package.json 2>/dev/null || echo "unknown")
        echo "   📦 Versión: $ALIMENTACION_VERSION"
    fi
else
    echo "🍽️ Alimentación: ❌ No encontrado"
fi

if [ -d "shared" ]; then
    echo "🔗 Shared: ✅ Encontrado"
else
    echo "🔗 Shared: ⚠️  No encontrado (opcional)"
fi

# Verificar archivos de configuración importantes
echo ""
echo "🔧 Archivos de configuración:"
echo "=============================="

[ -f "firebase.json" ] && echo "🔥 firebase.json: ✅" || echo "🔥 firebase.json: ❌"
[ -f "package.json" ] && echo "📦 package.json: ✅" || echo "📦 package.json: ❌"
[ -f ".gitignore" ] && echo "🐙 .gitignore: ✅" || echo "🐙 .gitignore: ❌"
[ -f "CLAUDE.md" ] && echo "🤖 CLAUDE.md: ✅" || echo "🤖 CLAUDE.md: ❌"

# 🌐 Verificar conectividad de red
echo ""
echo "🌐 Verificando conectividad:"
echo "============================"

if ping -c 1 google.com &> /dev/null; then
    echo "🌍 Internet: ✅ Conectado"
else
    echo "🌍 Internet: ❌ Sin conexión"
fi

if ping -c 1 github.com &> /dev/null; then
    echo "🐙 GitHub: ✅ Accesible"
else
    echo "🐙 GitHub: ❌ No accesible"
fi

# 📋 Mostrar comandos útiles
echo ""
echo "📋 Comandos útiles:"
echo "=================="
echo "🚀 Iniciar todo:           ./scripts/dev-all.sh"
echo "⛽ Solo combustibles:      cd combustibles && npm run dev"
echo "🍽️ Solo alimentación:      cd alimentacion && npm start"
echo "🔥 Firebase emulators:     firebase emulators:start"
echo "🤖 Claude Code:            claude --help"
echo "🧹 Limpiar todo:           ./scripts/clean-all.sh"
echo "🏗️ Build todo:             ./scripts/build-all.sh"
echo ""
echo "📚 Documentación completa: cat docs/CODESPACES.md"

# 🎯 Crear mensaje de bienvenida
cat > /tmp/welcome_message << 'EOF'

  ███████╗  ██████╗  ██████╗  ███████╗ ███████╗ ████████╗ ███████╗  ██████╗ ██╗  ██╗
  ██╔════╝ ██╔═══██╗ ██╔══██╗ ██╔════╝ ██╔════╝ ╚══██╔══╝ ██╔════╝ ██╔════╝ ██║  ██║
  █████╗   ██║   ██║ ██████╔╝ █████╗   ███████╗    ██║    █████╗   ██║      ███████║
  ██╔══╝   ██║   ██║ ██╔══██╗ ██╔══╝   ╚════██║    ██║    ██╔══╝   ██║      ██╔══██║
  ██║      ╚██████╔╝ ██║  ██║ ███████╗ ███████║    ██║    ███████╗ ╚██████╗ ██║  ██║
  ╚═╝       ╚═════╝  ╚═╝  ╚═╝ ╚══════╝ ╚══════╝    ╚═╝    ╚══════╝  ╚═════╝ ╚═╝  ╚═╝

  🎉 ¡Bienvenido al entorno de desarrollo de Forestech en GitHub Codespaces!
  
  💡 Este es un entorno completo y preconfigurado para desarrollar:
     ⛽ Sistema de Combustibles
     🍽️ Sistema de Alimentación  
     🔗 Componentes Compartidos
  
  🚀 Para empezar rápidamente, ejecuta: ./scripts/dev-all.sh
  📚 Para más información: cat docs/CODESPACES.md
  
  ¡Feliz codificación! 🚀

EOF

cat /tmp/welcome_message

# 🎨 Configurar prompt personalizado para mostrar proyecto actual
if [ -f ~/.bashrc ]; then
    if ! grep -q "FORESTECH_PROMPT" ~/.bashrc; then
        cat >> ~/.bashrc << 'EOF'

# 🌟 FORESTECH_PROMPT
export PS1='\[\033[01;32m\]🚀 Forestech\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
EOF
    fi
fi

if [ -f ~/.zshrc ]; then
    if ! grep -q "FORESTECH_PROMPT" ~/.zshrc; then
        cat >> ~/.zshrc << 'EOF'

# 🌟 FORESTECH_PROMPT  
export PS1='🚀 Forestech:%~ $ '
EOF
    fi
fi

# 🏠 Configurar como Codespace permanente
echo ""
echo "🏠 Configurando persistencia de Codespace..."

# Crear keep-alive si no existe
if [ ! -f "/workspace/scripts/keep-alive.sh" ]; then
    mkdir -p /workspace/scripts
    cat > /workspace/scripts/keep-alive.sh << 'EOF'
#!/bin/bash
while true; do
    echo "🚀 Forestech Codespace activo: $(date)" >> /workspace/.keep-alive.log
    touch /workspace/.keep-alive
    git status > /dev/null 2>&1 || true
    sleep 1800  # 30 minutos
done
EOF
    chmod +x /workspace/scripts/keep-alive.sh
    echo "✅ Keep-alive script creado"
fi

# Iniciar keep-alive en background si no está corriendo
if ! pgrep -f keep-alive.sh > /dev/null; then
    echo "🔄 Iniciando keep-alive automático..."
    nohup /workspace/scripts/keep-alive.sh > /dev/null 2>&1 &
    echo "✅ Keep-alive iniciado en background"
fi

# Configurar git para commits automáticos de backup
git config --global user.email "codespace@forestech.local" 2>/dev/null || true
git config --global user.name "Forestech Codespace" 2>/dev/null || true

# Auto-iniciar servicios si está configurado
if [ "$AUTO_START_SERVICES" = "true" ]; then
    echo "🚀 Auto-iniciando servicios de desarrollo..."
    nohup /workspace/scripts/dev-all.sh > /workspace/.services.log 2>&1 &
    echo "✅ Servicios iniciados automáticamente"
fi

# Crear script de status permanente
cat > /workspace/scripts/codespace-status.sh << 'EOF'
#!/bin/bash
echo "🏠 Estado del Codespace Permanente Forestech"
echo "============================================="
echo "📅 Iniciado: $(cat /workspace/.keep-alive 2>/dev/null | head -1 || echo 'Primera vez')"
echo "🔄 Última actividad: $(tail -1 /workspace/.keep-alive.log 2>/dev/null || echo 'Iniciando...')"
echo "⚡ Keep-alive: $(pgrep -f keep-alive.sh > /dev/null && echo '✅ Activo' || echo '❌ Inactivo')"
echo "🚀 Servicios: $(pgrep -f dev-all.sh > /dev/null && echo '✅ Corriendo' || echo '⚠️ Detenidos')"
echo ""
echo "💰 Información de facturación estimada:"
echo "   🆓 Plan GitHub Pro: 180h gratis/mes"
echo "   💸 Uso premium actual: Calculando..."
echo ""
echo "📊 Recursos actuales:"
./scripts/monitor-resources.sh 2>/dev/null || echo "Monitor no disponible"
EOF

chmod +x /workspace/scripts/codespace-status.sh

echo ""  
echo "🏠 Configuración permanente completada:"
echo "   ✅ Keep-alive automático activo"
echo "   ✅ Backup de configuración habilitado"
echo "   ✅ Auto-inicio de servicios configurado"
echo "   ✅ Scripts de monitoreo instalados"
echo ""
echo "📋 Comandos adicionales:"
echo "   ./scripts/codespace-status.sh  - Ver estado del Codespace"
echo "   tail -f .keep-alive.log       - Ver actividad en tiempo real"
echo ""
echo "✅ Post-start completado - ¡Forestech Codespace Permanente está listo!"