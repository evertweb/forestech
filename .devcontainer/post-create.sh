#!/bin/bash

# 🚀 Forestech Post-Create Setup
# Este script se ejecuta después de crear el contenedor

set -e

echo "🚀 Iniciando configuración post-creación de Forestech..."

# 🎯 Optimizar recursos según máquina detectada
if [ -f "/workspace/.devcontainer/resource-optimizer.sh" ]; then
    echo "🎯 Ejecutando optimizador de recursos..."
    bash /workspace/.devcontainer/resource-optimizer.sh
fi

# 📂 Cambiar al directorio de trabajo
cd /workspace

# 🔍 Verificar estructura del proyecto
echo "🔍 Verificando estructura del proyecto..."
if [ ! -f "package.json" ] && [ ! -d "combustibles" ] && [ ! -d "alimentacion" ]; then
    echo "⚠️  Advertencia: No se detectó la estructura esperada del proyecto Forestech"
fi

# 📦 Instalar dependencias del proyecto principal
echo "📦 Instalando dependencias del proyecto principal..."
if [ -f "package.json" ]; then
    npm ci --prefer-offline --no-audit || npm install
fi

# 🔥 Instalar dependencias de Combustibles
echo "🔥 Instalando dependencias de Combustibles..."
if [ -d "combustibles" ] && [ -f "combustibles/package.json" ]; then
    cd combustibles
    npm ci --prefer-offline --no-audit || npm install
    cd ..
else
    echo "⚠️  No se encontró la app de combustibles"
fi

# 🍽️ Instalar dependencias de Alimentación
echo "🍽️ Instalando dependencias de Alimentación..."
if [ -d "alimentacion" ] && [ -f "alimentacion/package.json" ]; then
    cd alimentacion
    npm ci --prefer-offline --no-audit || npm install
    cd ..
else
    echo "⚠️  No se encontró la app de alimentación"
fi

# 🔗 Instalar dependencias de Shared
echo "🔗 Instalando dependencias de Shared..."
if [ -d "shared" ] && [ -f "shared/package.json" ]; then
    cd shared
    npm ci --prefer-offline --no-audit || npm install
    cd ..
else
    echo "ℹ️  No se encontró la librería shared"
fi

# 🤖 Instalar Claude Code
echo "🤖 Instalando Claude Code..."
if command -v curl &> /dev/null; then
    curl -sSL https://claude.ai/install.sh | bash || {
        echo "⚠️  No se pudo instalar Claude Code automáticamente"
        echo "📋 Instálalo manualmente con: curl -sSL https://claude.ai/install.sh | bash"
    }
else
    echo "⚠️  curl no está disponible, no se puede instalar Claude Code automáticamente"
fi

# 🔧 Configurar Claude Code para el proyecto
echo "🔧 Configurando Claude Code..."
mkdir -p ~/.claude

# Crear configuración base de Claude para el proyecto
cat > ~/.claude/config.json << 'EOF'
{
  "workspace": "/workspace",
  "projects": {
    "forestech": {
      "path": "/workspace",
      "type": "monorepo",
      "apps": ["combustibles", "alimentacion", "shared"]
    }
  },
  "mcps": {
    "firebase": {
      "enabled": true,
      "project": "liquidacionapp-62962"
    },
    "github": {
      "enabled": true
    },
    "memory": {
      "enabled": true
    }
  }
}
EOF

# 🔥 Configurar Firebase
echo "🔥 Configurando Firebase..."
if [ -f "firebase.json" ]; then
    echo "✅ Configuración de Firebase encontrada"
    # Verificar que los emuladores estén configurados
    if ! grep -q "emulators" firebase.json; then
        echo "⚠️  No se encontraron emuladores configurados en firebase.json"
    fi
else
    echo "⚠️  No se encontró firebase.json"
fi

# 📝 Crear scripts de desarrollo útiles
echo "📝 Creando scripts de desarrollo..."
mkdir -p /workspace/scripts

# Script para iniciar todos los servicios
cat > /workspace/scripts/dev-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando todos los servicios de Forestech..."

# Función para manejo de señales
cleanup() {
    echo "🛑 Deteniendo todos los servicios..."
    jobs -p | xargs -r kill
    exit 0
}
trap cleanup SIGINT SIGTERM

# Iniciar Firebase Emulators en background
if [ -f "/workspace/firebase.json" ]; then
    echo "🔥 Iniciando Firebase Emulators..."
    (cd /workspace && firebase emulators:start --only auth,firestore,functions,hosting) &
fi

# Esperar un poco para que Firebase inicie
sleep 3

# Iniciar Combustibles
if [ -d "/workspace/combustibles" ]; then
    echo "⛽ Iniciando app de Combustibles..."
    (cd /workspace/combustibles && npm run dev) &
fi

# Iniciar Alimentación  
if [ -d "/workspace/alimentacion" ]; then
    echo "🍽️ Iniciando app de Alimentación..."
    (cd /workspace/alimentacion && npm start) &
fi

echo "✅ Todos los servicios iniciados!"
echo "📱 Combustibles: http://localhost:5173"
echo "🍽️ Alimentación: http://localhost:3000"
echo "🔥 Firebase UI: http://localhost:4000"
echo ""
echo "Presiona Ctrl+C para detener todos los servicios"

# Esperar a que terminen todos los procesos
wait
EOF

chmod +x /workspace/scripts/dev-all.sh

# Script para build de producción
cat > /workspace/scripts/build-all.sh << 'EOF'
#!/bin/bash
echo "🏗️ Construyendo todos los proyectos de Forestech..."

# Build Combustibles
if [ -d "/workspace/combustibles" ]; then
    echo "⛽ Construyendo Combustibles..."
    (cd /workspace/combustibles && npm run build)
fi

# Build Alimentación
if [ -d "/workspace/alimentacion" ]; then
    echo "🍽️ Construyendo Alimentación..."
    (cd /workspace/alimentacion && npm run build)
fi

# Build Shared si existe
if [ -d "/workspace/shared" ]; then
    echo "🔗 Construyendo Shared..."
    (cd /workspace/shared && npm run build)
fi

echo "✅ Construcción completada!"
EOF

chmod +x /workspace/scripts/build-all.sh

# 🧹 Script de limpieza
cat > /workspace/scripts/clean-all.sh << 'EOF'
#!/bin/bash
echo "🧹 Limpiando todos los node_modules y builds..."

find /workspace -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find /workspace -name "build" -type d -exec rm -rf {} + 2>/dev/null || true
find /workspace -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
find /workspace -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true

echo "✅ Limpieza completada!"
EOF

chmod +x /workspace/scripts/clean-all.sh

# 📄 Crear documentación del entorno
cat > /workspace/docs/CODESPACES.md << 'EOF'
# 🚀 Forestech en GitHub Codespaces

## 🎯 Comandos Rápidos

### Desarrollo
```bash
# Iniciar todos los servicios
./scripts/dev-all.sh

# Solo combustibles
cd combustibles && npm run dev

# Solo alimentación  
cd alimentacion && npm start

# Firebase emulators
firebase emulators:start
```

### Build y Deploy
```bash
# Build todo
./scripts/build-all.sh

# Deploy a Firebase
firebase deploy
```

### Utilidades
```bash
# Limpiar todo
./scripts/clean-all.sh

# Ver puertos activos
ports

# Claude Code
claude --help
```

## 🔧 Configuración

- **Claude Code**: Configurado con MCPs para Firebase, GitHub, Memory
- **Firebase**: Emuladores preconfigurados
- **Extensions**: React, Firebase, GitHub, Claude Code
- **Aliases**: Shortcuts para navegación y comandos comunes

## 📱 Puertos

- `3000`: Alimentación App
- `5173`: Combustibles App
- `9005`: Firebase Emulator UI
- `8080`: Firebase Hosting
- `9099`: Firebase Auth
- `8081`: Firebase Functions

## 🆘 Troubleshooting

### Claude Code no funciona
```bash
curl -sSL https://claude.ai/install.sh | bash
```

### Firebase no autentica
```bash
firebase login --no-localhost
```

### Permisos de scripts
```bash
chmod +x scripts/*.sh
```
EOF

# 🎨 Configurar tema y settings adicionales
echo "🎨 Configurando VS Code..."
mkdir -p /workspace/.vscode

cat > /workspace/.vscode/settings.json << 'EOF'
{
  "workbench.colorCustomizations": {
    "statusBar.background": "#2d5016",
    "statusBar.foreground": "#ffffff",
    "titleBar.activeBackground": "#1b4332",
    "titleBar.activeForeground": "#ffffff"
  },
  "files.associations": {
    "*.css": "css",
    "*.jsx": "javascriptreact",
    "*.tsx": "typescriptreact"
  },
  "search.useGlobalIgnoreFiles": true,
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
EOF

# Configurar tasks para VS Code
cat > /workspace/.vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🚀 Dev All",
      "type": "shell",
      "command": "./scripts/dev-all.sh",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "⛽ Combustibles Dev",
      "type": "shell",
      "command": "npm run dev",
      "options": {
        "cwd": "${workspaceFolder}/combustibles"
      },
      "group": "build"
    },
    {
      "label": "🍽️ Alimentacion Dev", 
      "type": "shell",
      "command": "npm start",
      "options": {
        "cwd": "${workspaceFolder}/alimentacion"
      },
      "group": "build"
    },
    {
      "label": "🔥 Firebase Emulators",
      "type": "shell", 
      "command": "firebase emulators:start",
      "group": "build"
    },
    {
      "label": "🏗️ Build All",
      "type": "shell",
      "command": "./scripts/build-all.sh",
      "group": "build"
    }
  ]
}
EOF

# 🔍 Crear launch configurations
cat > /workspace/.vscode/launch.json << 'EOF'
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "🔥 Firebase Functions",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "restart": true,
      "protocol": "inspector",
      "localRoot": "${workspaceFolder}/functions",
      "remoteRoot": "/workspace/functions"
    }
  ]
}
EOF

echo "✅ Configuración post-creación completada!"
echo ""
echo "🎉 ¡Forestech está listo para desarrollo!"
echo "📋 Consulta /workspace/docs/CODESPACES.md para más información"
echo "🚀 Ejecuta './scripts/dev-all.sh' para iniciar todos los servicios"