#!/bin/bash

# 🚀 Forestech Setup Light - Sin instalaciones pesadas
# Configuración mínima que NO causa OOM

set -e

echo "🚀 Configuración ligera de Forestech iniciando..."

cd /workspace

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

# 📝 Crear scripts básicos
echo "📝 Creando scripts de desarrollo..."
mkdir -p /workspace/scripts

# Script dev simplificado
cat > /workspace/scripts/dev-simple.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando servicios Forestech..."

# Función de limpieza
cleanup() {
    echo "🛑 Deteniendo servicios..."
    jobs -p | xargs -r kill
    exit 0
}
trap cleanup SIGINT SIGTERM

# Iniciar solo lo necesario
if [ -d "/workspace/combustibles" ]; then
    echo "⛽ Iniciando Combustibles..."
    (cd /workspace/combustibles && npm run dev) &
fi

if [ -d "/workspace/alimentacion" ]; then
    echo "🍽️ Iniciando Alimentación..."
    (cd /workspace/alimentacion && npm start) &
fi

echo "✅ Servicios iniciados!"
echo "📱 Combustibles: http://localhost:5173"
echo "🍽️ Alimentación: http://localhost:3000"
echo ""
echo "Presiona Ctrl+C para detener"

wait
EOF

chmod +x /workspace/scripts/dev-simple.sh

# 🎯 Crear archivo de configuración de entorno
cat > /workspace/.env.light << 'EOF'
# 🚀 Forestech Light Environment
NODE_ENV=development
NODE_OPTIONS=--max-old-space-size=4096
GENERATE_SOURCEMAP=false
FAST_REFRESH=true
EOF

# 📚 Documentación rápida
cat > /workspace/CODESPACE-LIGHT.md << 'EOF'
# 🚀 Forestech Codespace Light

## ⚡ Configuración Económica

Esta configuración está optimizada para:
- ✅ Máximo uso de horas GRATIS de GitHub Pro (180h/mes)
- ✅ Sin instalaciones pesadas que causen OOM
- ✅ Setup rápido (2-3 minutos vs 10+ minutos)
- ✅ Menor costo cuando uses premium

## 🎯 Comandos Básicos

```bash
# Iniciar desarrollo
./scripts/dev-simple.sh

# Solo combustibles
cd combustibles && npm run dev

# Solo alimentación
cd alimentacion && npm start

# Firebase (instalar manual si necesitas)
firebase login --no-localhost
firebase emulators:start
```

## 💰 Estrategia de Costo

1. **Desarrollo Normal**: Usa 2-core, 8GB (GRATIS - 180h/mes)
2. **Builds Pesados**: Upgrade temporalmente a 4-core
3. **Pausa Automática**: Codespace se pausa solo tras inactividad
4. **No Keep-Alive**: Sin costo 24/7 innecesario

## 🔧 Si Necesitas Más Herramientas

Instalar solo cuando las necesites:
```bash
# Claude Code (manual)
curl -sSL https://claude.ai/install.sh | bash

# Extensiones adicionales (desde VS Code)
# Docker (solo si necesitas contenedores)
```

**🏆 Resultado: Desarrollo eficiente con costos mínimos**
EOF

echo ""
echo "✅ Setup light completado exitosamente!"
echo "🎉 Forestech listo para desarrollo económico"
echo "📚 Consulta: cat CODESPACE-LIGHT.md"
echo "🚀 Inicia con: ./scripts/dev-simple.sh"