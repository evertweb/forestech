# 🔧 Fix para Codespace - Ejecutar en /workspaces/forestech

## 1. 🚀 Ejecutar setup manual desde raíz del proyecto
```bash
cd /workspaces/forestech
bash .devcontainer/setup-manual.sh
```

## 2. ✅ Verificar que se crearon los scripts
```bash
ls -la scripts/
```

## 3. 🔧 Si el script no existe, crearlo manualmente:
```bash
mkdir -p scripts
cat > scripts/dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando aplicaciones Forestech..."

# ⛽ Combustibles
if [ -d "combustibles" ]; then
    echo "⛽ Iniciando Combustibles en puerto 5173..."
    (cd combustibles && npm run dev) &
fi

# 🍽️ Alimentación  
if [ -d "alimentacion" ]; then
    echo "🍽️ Iniciando Alimentación en puerto 3000..."
    (cd alimentacion && npm start) &
fi

echo "✅ Apps iniciadas!"
echo "📱 Combustibles: http://localhost:5173"
echo "🍽️ Alimentación: http://localhost:3000"

wait
EOF

chmod +x scripts/dev.sh
```

## 4. 🎯 Iniciar aplicaciones
```bash
./scripts/dev.sh
```

## 5. 🔄 Para actualizar a Node 20 (opcional):
```bash
# Desde el codespace, actualizar devcontainer.json
cp .devcontainer/devcontainer-node20.json .devcontainer/devcontainer.json
# Luego rebuild container
```

## 6. 🔧 Comandos individuales si prefieres:
```bash
# Solo Combustibles
cd combustibles && npm run dev

# Solo Alimentación
cd alimentacion && npm start
```