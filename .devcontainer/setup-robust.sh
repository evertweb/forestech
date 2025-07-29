#!/bin/bash

# 🚀 Forestech Robust Setup - Con manejo de errores completo
set -e  # Salir si cualquier comando falla
set -u  # Salir si se usa variable no definida

echo "🚀 Configuración ROBUSTA de Forestech iniciando..."

# 🔍 Detectar y validar directorio de trabajo
detect_workspace() {
    if [ -d "/workspaces/forestech" ]; then
        WORKSPACE_DIR="/workspaces/forestech"
        echo "📂 Codespace detectado: usando /workspaces/forestech"  
    elif [ -d "/workspace" ]; then
        WORKSPACE_DIR="/workspace"
        echo "📂 Container detectado: usando /workspace"
    else
        WORKSPACE_DIR="$(pwd)"
        echo "📂 Usando directorio actual: $WORKSPACE_DIR"
    fi
    
    # Validar que el directorio existe y es accesible
    if [ ! -d "$WORKSPACE_DIR" ]; then
        echo "❌ ERROR: Directorio $WORKSPACE_DIR no existe"
        exit 1
    fi
    
    if [ ! -w "$WORKSPACE_DIR" ]; then
        echo "❌ ERROR: No hay permisos de escritura en $WORKSPACE_DIR"
        exit 1
    fi
}

# 📁 Crear directorios con validación
create_directories() {
    echo "📁 Creando directorios esenciales..."
    
    local dirs=(".mcp-memory" ".claudehooks" "scripts" ".npm-cache" ".yarn-cache")
    
    for dir in "${dirs[@]}"; do
        if mkdir -p "$WORKSPACE_DIR/$dir" 2>/dev/null; then
            echo "✅ Creado: $dir"
        else
            echo "⚠️  Ya existe o error creando: $dir"
        fi
    done
}

# 🧠 Configuración MCP con validación
setup_mcp() {
    echo "🧠 Configurando MCPs básicos..."
    
    local mcp_file="$WORKSPACE_DIR/.mcp.json"
    
    cat > "$mcp_file" << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspaces/forestech"]
    },
    "memory": {
      "command": "npx", 
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_FILE_PATH": "/workspaces/forestech/.mcp-memory/forestech-memory.json"
      }
    }
  }
}
EOF
    
    if [ -f "$mcp_file" ]; then
        echo "✅ MCP config creado: $mcp_file"
    else
        echo "❌ ERROR: No se pudo crear MCP config"
        exit 1
    fi
}

# 📝 Script de desarrollo con validación
create_dev_script() {
    echo "📝 Creando script de desarrollo..."
    
    local script_file="$WORKSPACE_DIR/scripts/dev-simple.sh"
    
    cat > "$script_file" << 'EOF'
#!/bin/bash
echo "🚀 Iniciando servicios Forestech básicos..."

# Función para verificar si un puerto está en uso
check_port() {
    if command -v lsof >/dev/null 2>&1; then
        lsof -i :$1 >/dev/null 2>&1
    else
        netstat -ln 2>/dev/null | grep ":$1 " >/dev/null 2>&1
    fi
}

# 🔥 Firebase Emulators
start_firebase() {
    if [ -f "firebase.json" ]; then
        if ! check_port 9099; then
            echo "🔥 Iniciando Firebase Emulators..."
            firebase emulators:start --only auth,firestore &
            sleep 3
        else
            echo "⚠️  Firebase ya está ejecutándose en puerto 9099"
        fi
    else
        echo "⚠️  firebase.json no encontrado - omitiendo Firebase"
    fi
}

# ⛽ Combustibles
start_combustibles() {
    if [ -d "combustibles" ] && [ -f "combustibles/package.json" ]; then
        if ! check_port 5173; then
            echo "⛽ Iniciando Combustibles..."
            (cd combustibles && npm run dev) &
        else
            echo "⚠️  Combustibles ya está ejecutándose en puerto 5173"
        fi
    else
        echo "⚠️  App Combustibles no encontrada - omitiendo"
    fi
}

# 🍽️ Alimentación  
start_alimentacion() {
    if [ -d "alimentacion" ] && [ -f "alimentacion/package.json" ]; then
        if ! check_port 3000; then
            echo "🍽️ Iniciando Alimentación..."
            (cd alimentacion && npm start) &
        else
            echo "⚠️  Alimentación ya está ejecutándose en puerto 3000"
        fi
    else
        echo "⚠️  App Alimentación no encontrada - omitiendo"
    fi
}

# Ejecutar servicios
start_firebase
start_combustibles  
start_alimentacion

echo ""
echo "✅ Servicios iniciados!"
echo "📱 Combustibles: http://localhost:5173"
echo "🍽️ Alimentación: http://localhost:3000"
echo "🔥 Firebase UI: http://localhost:4000"
echo ""
echo "💡 Presiona Ctrl+C para detener todos los servicios"

# Esperar por todos los procesos background
wait
EOF
    
    if chmod +x "$script_file" 2>/dev/null; then
        echo "✅ Script creado: $script_file"
    else
        echo "❌ ERROR: No se pudo crear script de desarrollo"
        exit 1
    fi
}

# 🧪 Verificar instalaciones opcionales
check_tools() {
    echo "🧪 Verificando herramientas disponibles..."
    
    # Node.js (debería estar en la imagen base)
    if command -v node >/dev/null 2>&1; then
        echo "✅ Node.js: $(node --version)"
    else
        echo "⚠️  Node.js no encontrado"
    fi
    
    # NPM
    if command -v npm >/dev/null 2>&1; then
        echo "✅ NPM: $(npm --version)"
    else
        echo "⚠️  NPM no encontrado"
    fi
    
    # Firebase CLI (opcional)
    if command -v firebase >/dev/null 2>&1; then
        echo "✅ Firebase CLI: $(firebase --version | head -1)"
    else
        echo "⚠️  Firebase CLI no encontrado - instalar con: npm install -g firebase-tools"
    fi
    
    # Git
    if command -v git >/dev/null 2>&1; then
        echo "✅ Git: $(git --version)"
    else
        echo "⚠️  Git no encontrado"
    fi
}

# 🚀 Ejecutar setup
main() {
    echo "=========================================="
    echo "🚀 FORESTECH ROBUST SETUP"
    echo "=========================================="
    
    detect_workspace
    cd "$WORKSPACE_DIR"
    
    create_directories
    setup_mcp
    create_dev_script
    check_tools
    
    echo ""
    echo "=========================================="
    echo "✅ SETUP COMPLETADO EXITOSAMENTE!"
    echo "=========================================="
    echo ""
    echo "🎯 Próximos pasos:"
    echo "1. 🔥 Instalar Firebase CLI: npm install -g firebase-tools"
    echo "2. 🤖 Instalar Claude Code: curl -sSL https://claude.ai/install.sh | bash"
    echo "3. 📦 Instalar dependencias: npm install en cada app"
    echo "4. 🚀 Iniciar desarrollo: ./scripts/dev-simple.sh"
    echo ""
}

# Ejecutar con manejo de errores
if main "$@"; then
    echo "🎉 Setup completado sin errores!"
    exit 0
else
    echo "❌ Setup falló. Revisa los mensajes de error arriba."
    exit 1
fi