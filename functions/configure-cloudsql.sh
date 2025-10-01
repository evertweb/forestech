#!/bin/bash

# Cloud SQL Network Configuration Script
# Script para configurar authorized networks en Cloud SQL

set -e

INSTANCE_NAME="oil"
CURRENT_IP="200.189.27.77"
ORIGINAL_IP="74.249.85.192"

echo "🔧 CONFIGURACIÓN CLOUD SQL AUTHORIZED NETWORKS"
echo "=============================================="

# Función para mostrar configuración actual
show_current_config() {
    echo "📋 Configuración actual:"
    gcloud sql instances describe $INSTANCE_NAME --format="yaml(settings.ipConfiguration.authorizedNetworks)" 2>/dev/null || echo "Error: No se puede acceder a gcloud"
}

# Función para test de conectividad
test_connectivity() {
    echo "🧪 Probando conectividad..."
    cd /home/hp/Documents/forestech/functions
    timeout 30 node test-sql-connection.js || echo "Test completado (puede haber errores de conexión)"
}

echo ""
echo "OPCIÓN 1: Agregar IP local para testing"
echo "--------------------------------------"
echo "Comando:"
echo "gcloud sql instances patch $INSTANCE_NAME \\"
echo "  --authorized-networks=$ORIGINAL_IP,$CURRENT_IP"
echo ""
read -p "¿Ejecutar OPCIÓN 1? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "⚙️ Configurando authorized networks..."
    gcloud sql instances patch $INSTANCE_NAME --authorized-networks=$ORIGINAL_IP,$CURRENT_IP
    echo "✅ Configuración aplicada. Esperando propagación (30s)..."
    sleep 30
    show_current_config
    test_connectivity
fi

echo ""
echo "OPCIÓN 2: Permitir todas las IPs (para Firebase Functions)"
echo "--------------------------------------------------------"
echo "Comando:"
echo "gcloud sql instances patch $INSTANCE_NAME \\"
echo "  --authorized-networks=0.0.0.0/0"
echo ""
echo "⚠️ ADVERTENCIA: Esto permite conexiones desde cualquier IP"
echo ""
read -p "¿Ejecutar OPCIÓN 2? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "⚙️ Configurando authorized networks..."
    gcloud sql instances patch $INSTANCE_NAME --authorized-networks=0.0.0.0/0
    echo "✅ Configuración aplicada. Esperando propagación (30s)..."
    sleep 30
    show_current_config
    test_connectivity
fi

echo ""
echo "OPCIÓN 3: Restaurar configuración original"
echo "-----------------------------------------"
echo "Comando:"
echo "gcloud sql instances patch $INSTANCE_NAME \\"
echo "  --authorized-networks=$ORIGINAL_IP"
echo ""
read -p "¿Restaurar configuración original? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "⚙️ Restaurando configuración original..."
    gcloud sql instances patch $INSTANCE_NAME --authorized-networks=$ORIGINAL_IP
    echo "✅ Configuración restaurada."
    show_current_config
fi

echo ""
echo "🎯 TESTING FIREBASE FUNCTIONS"
echo "============================="
echo "Si OPCIÓN 2 funcionó, puedes probar Firebase Functions:"
echo ""
echo "cd /home/hp/Documents/forestech"
echo "npm run dev:combustibles"
echo ""
echo "Luego abrir http://localhost:5174 y verificar que no hay errores SQL"

echo ""
echo "📋 Configuración final:"
show_current_config