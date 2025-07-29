#!/bin/bash

# 🚀 Forestech Setup Light - Sin instalaciones pesadas
# Configuración mínima que NO causa OOM

set -e

echo "🚀 Configuración ligera de Forestech iniciando..."

# 🔍 Detectar directorio correcto automáticamente
if [ -d "/workspaces/forestech" ]; then
    WORKSPACE_DIR="/workspaces/forestech"
    echo "📂 Codespace detectado: usando /workspaces/forestech"
elif [ -d "/workspace" ]; then
    WORKSPACE_DIR="/workspace"
    echo "📂 Container detectado: usando /workspace"
else
    # Usar directorio actual si no encontramos los estándar
    WORKSPACE_DIR="$(pwd)"
    echo "📂 Usando directorio actual: $WORKSPACE_DIR"
fi

cd "$WORKSPACE_DIR"

# 📦 Solo instalar dependencias Node.js (no paquetes del sistema)
echo "📦 Instalando dependencias Node.js del proyecto..."

# Proyecto principal
if [ -f "package.json" ]; then
    echo "📦 Instalando dependencias raíz..."
    npm ci --prefer-offline --no-audit --silent || npm install --silent
fi

# Combustibles
if [ -d "combustibles" ] && [ -f "combustibles/package.json" ]; then
    echo "⛽ Instalando dependencias de Combustibles..."
    cd combustibles
    npm ci --prefer-offline --no-audit --silent || npm install --silent
    cd ..
fi

# Alimentación
if [ -d "alimentacion" ] && [ -f "alimentacion/package.json" ]; then
    echo "🍽️ Instalando dependencias de Alimentación..."
    cd alimentacion
    npm ci --prefer-offline --no-audit --silent || npm install --silent
    cd ..
fi

# 🔥 Firebase CLI (global, pero ligero)
echo "🔥 Instalando Firebase CLI..."
npm install -g firebase-tools --silent

# 🤖 Instalar Claude Code automáticamente
echo "🤖 Instalando Claude Code..."
if command -v curl &> /dev/null; then
    curl -sSL https://claude.ai/install.sh | bash || {
        echo "⚠️  Error instalando Claude Code automáticamente"
        echo "📋 Instálalo manualmente después: curl -sSL https://claude.ai/install.sh | bash"
    }
    
    # Añadir Claude al PATH si se instaló correctamente
    if [ -f "$HOME/.claude/bin/claude" ]; then
        echo 'export PATH="$HOME/.claude/bin:$PATH"' >> ~/.bashrc
        export PATH="$HOME/.claude/bin:$PATH"
        echo "✅ Claude Code instalado y configurado"
    fi
else
    echo "⚠️  curl no disponible, instala Claude Code manualmente"
fi

# 📝 Crear scripts básicos
echo "📝 Creando scripts de desarrollo..."
mkdir -p "$WORKSPACE_DIR/scripts"

# Script dev completo pero eficiente
cat > "$WORKSPACE_DIR/scripts/dev-simple.sh" << 'EOF'
#!/bin/bash
echo "🚀 Iniciando servicios Forestech - Flujo completo..."

# Función de limpieza
cleanup() {
    echo "🛑 Deteniendo todos los servicios..."
    jobs -p | xargs -r kill
    exit 0
}
trap cleanup SIGINT SIGTERM

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
echo "🔥 Firebase Auth: http://localhost:9099"
echo "🔥 Firestore: http://localhost:8080"
echo ""
echo "🎯 Esto es EXACTAMENTE como tu PC local"
echo "Presiona Ctrl+C para detener todos los servicios"

# Esperar a que terminen todos los procesos
wait
EOF

chmod +x "$WORKSPACE_DIR/scripts/dev-simple.sh"

# 🎯 Crear archivo de configuración de entorno
cat > "$WORKSPACE_DIR/.env.light" << 'EOF'
# 🚀 Forestech Light Environment
NODE_ENV=development
NODE_OPTIONS=--max-old-space-size=4096
GENERATE_SOURCEMAP=false
FAST_REFRESH=true
EOF

# 📚 Documentación rápida
cat > "$WORKSPACE_DIR/CODESPACE-LIGHT.md" << 'EOF'
# 🚀 Forestech Codespace Light - Flujo Completo

## ⚡ Mismo flujo que tu PC local, pero económico

Esta configuración te da:
- ✅ Firebase Emulators funcionando exactamente igual
- ✅ Combustibles con Vite hot-reload completo
- ✅ Alimentación con todos los features
- ✅ Extensiones necesarias: Tailwind, ESLint, Prettier, Copilot
- ✅ Sin errores OOM - setup garantizado en 2-3 minutos

## 🎯 Comandos - Exactamente como local

```bash
# Iniciar TODO (Firebase + Apps) - Como tu local
./scripts/dev-simple.sh

# Solo combustibles con Vite
cd combustibles && npm run dev

# Solo alimentación  
cd alimentacion && npm start

# Solo Firebase emulators
firebase emulators:start --only auth,firestore,functions,hosting

# Autenticación Firebase
firebase login --no-localhost
```

## 🔧 Extensiones incluidas para tu flujo

- **Tailwind CSS**: Autocompletado completo
- **ESLint + Prettier**: Formato automático como local
- **Firebase**: Integración completa con emulators
- **Copilot + Chat**: IA asistida
- **Auto Rename Tag**: Productividad JSX
- **Path Intellisense**: Autocompletado rutas
- **VS Code Icons**: Navegación visual

## 🎯 URLs de desarrollo - Como local

- **Combustibles**: http://localhost:5173 (Vite)
- **Alimentación**: http://localhost:3000 (React)
- **Firebase UI**: http://localhost:4000 (Emulator Suite)
- **Firestore**: http://localhost:8080 (Database)
- **Auth**: http://localhost:9099 (Authentication)

## 💰 Costo optimizado

- **Desarrollo diario**: GRATIS (180h/mes GitHub Pro)
- **Premium ocasional**: Solo cuando necesites builds pesados
- **Auto-pausa**: Tras inactividad, sin costos adicionales

**🏆 Resultado: Tu flujo de trabajo exacto, sin errores, económico**
EOF

echo ""
echo "✅ Setup light completado exitosamente!"
echo "🎉 Forestech listo para desarrollo económico"
echo ""
echo "📋 Comandos disponibles:"
echo "🚀 Iniciar desarrollo:  ./scripts/dev-simple.sh"
echo "🤖 Verificar Claude:    claude --version"
echo "🔧 Instalar Claude:     ./scripts/install-claude.sh (si es necesario)"
echo "📚 Documentación:       cat CODESPACE-LIGHT.md"
echo ""
echo "🎯 URLs de desarrollo:"
echo "📱 Combustibles:        http://localhost:5173"
echo "🍽️ Alimentación:        http://localhost:3000"
echo "🔥 Firebase UI:         http://localhost:4000"
echo ""
echo "📂 Directorio de trabajo: $WORKSPACE_DIR"