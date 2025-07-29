#!/bin/bash

# 🔄 Script para actualizar dependencias en prebuilds
echo "🔄 Actualizando dependencias para prebuild..."

cd /workspaces/forestech

# Actualizar dependencias en paralelo
update_combustibles() {
    if [ -d "combustibles" ]; then
        echo "⛽ Actualizando Combustibles..."
        cd combustibles
        npm update --prefer-offline
        cd ..
    fi
}

update_alimentacion() {
    if [ -d "alimentacion" ]; then
        echo "🍽️ Actualizando Alimentación..."
        cd alimentacion  
        npm update --prefer-offline
        cd ..
    fi
}

# Ejecutar actualizaciones en paralelo
update_combustibles &
update_alimentacion &

# Actualizar herramientas globales
npm update -g firebase-tools &

# Esperar a que terminen
wait

echo "✅ Dependencias actualizadas para prebuild"