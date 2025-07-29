#!/bin/bash

# 🔧 Script para arreglar problemas de directorios en Codespace
echo "🔧 Arreglando problemas de directorios en Codespace..."

# Verificar si estamos en el lugar correcto
if [ ! -f "package.json" ] && [ ! -d "combustibles" ]; then
    # Buscar el directorio correcto
    echo "🔍 Buscando directorio correcto del proyecto..."
    
    if [ -d "/workspaces/forestech" ]; then
        echo "📂 Cambiando a /workspaces/forestech"
        cd /workspaces/forestech
    elif [ -d "/workspace" ]; then
        echo "📂 Cambiando a /workspace"
        cd /workspace
    else
        echo "❌ No se encuentra el directorio del proyecto"
        echo "📋 Directorios disponibles:"
        ls -la /workspaces/ 2>/dev/null || echo "  - /workspaces no existe"
        ls -la /workspace/ 2>/dev/null || echo "  - /workspace no existe"
        exit 1
    fi
fi

# Crear directorios faltantes
echo "📁 Verificando estructura de directorios..."

# Crear scripts si no existe
if [ ! -d "scripts" ]; then
    echo "📁 Creando directorio scripts..."
    mkdir -p scripts
fi

# Verificar que los scripts existan
if [ ! -f "scripts/dev-simple.sh" ]; then
    echo "📝 Creando script dev-simple.sh..."
    cat > scripts/dev-simple.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando servicios Forestech - Flujo completo..."

# Función de limpieza
cleanup() {
    echo "🛑 Deteniendo todos los servicios..."
    jobs -p | xargs -r kill
    exit 0
}
trap cleanup SIGINT SIGTERM

# Verificar directorio actual
if [ ! -f "package.json" ] && [ ! -d "combustibles" ]; then
    echo "❌ Error: No estás en el directorio correcto del proyecto"
    echo "📂 Ejecuta desde el directorio raíz de Forestech"
    exit 1
fi

# 🔥 Iniciar Firebase Emulators primero
if [ -f "firebase.json" ]; then
    echo "🔥 Iniciando Firebase Emulators..."
    firebase emulators:start --only auth,firestore,functions,hosting &
    
    # Esperar que Firebase inicie
    echo "⏳ Esperando Firebase Emulators..."
    sleep 5
fi

# ⛽ Iniciar Combustibles  
if [ -d "combustibles" ]; then
    echo "⛽ Iniciando Combustibles (Vite)..."
    (cd combustibles && npm run dev) &
fi

# 🍽️ Iniciar Alimentación
if [ -d "alimentacion" ]; then
    echo "🍽️ Iniciando Alimentación..."
    (cd alimentacion && npm start) &
fi

echo ""
echo "✅ Todos los servicios iniciados - Flujo completo activo!"
echo "================================"
echo "📱 Combustibles: http://localhost:5173"
echo "🍽️ Alimentación: http://localhost:3000" 
echo "🔥 Firebase UI: http://localhost:4000"
echo ""
echo "Presiona Ctrl+C para detener todos los servicios"

# Esperar a que terminen todos los procesos
wait
EOF
    chmod +x scripts/dev-simple.sh
fi

# Instalar dependencias si faltan
echo "📦 Verificando dependencias..."

if [ -d "combustibles" ] && [ -f "combustibles/package.json" ]; then
    if [ ! -d "combustibles/node_modules" ]; then
        echo "📦 Instalando dependencias de combustibles..."
        (cd combustibles && npm install)
    fi
fi

if [ -d "alimentacion" ] && [ -f "alimentacion/package.json" ]; then
    if [ ! -d "alimentacion/node_modules" ]; then
        echo "📦 Instalando dependencias de alimentación..."
        (cd alimentacion && npm install)
    fi
fi

# Verificar Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "🔥 Instalando Firebase CLI..."
    npm install -g firebase-tools
fi

echo ""
echo "✅ Reparación completada!"
echo "📂 Directorio actual: $(pwd)"
echo "🚀 Prueba ahora: ./scripts/dev-simple.sh"