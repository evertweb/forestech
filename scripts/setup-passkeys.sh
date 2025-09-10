#!/bin/bash

# Script para configurar passkeys en Forestech Combustibles
# Instala la extensión Firebase Web Authn y configura el proyecto

echo "🔐 Configurando passkeys para Forestech Combustibles..."

# Verificar que Firebase CLI esté instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI no está instalado. Instalando..."
    npm install -g firebase-tools
fi

# Navegar al directorio del proyecto
cd "$(dirname "$0")/.."

# Autenticar con Firebase (si no está autenticado)
echo "🔑 Verificando autenticación Firebase..."
firebase login --no-localhost

# Seleccionar el proyecto
echo "📋 Configurando proyecto Firebase..."
firebase use liquidacionapp-62962

# Instalar la extensión Firebase Web Authn
echo "🔧 Instalando extensión Firebase Web Authn..."
firebase ext:install gavinsawyer/firebase-web-authn --project=liquidacionapp-62962

# Configurar reglas de Firestore para passkeys
echo "📝 Configurando reglas de Firestore para passkeys..."

# Hacer backup de las reglas actuales
cp firestore.rules firestore.rules.backup.$(date +%Y%m%d_%H%M%S)

# Agregar reglas para passkeys si no existen
if ! grep -q "webAuthnCredentials" firestore.rules; then
    echo "
    // Reglas para Firebase Web Authn Extension
    match /webAuthnCredentials/{credentialId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    match /webAuthnUsers/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }" >> firestore.rules

    echo "✅ Reglas de Firestore actualizadas para passkeys"
else
    echo "✅ Reglas de Firestore ya configuradas para passkeys"
fi

# Desplegar las reglas actualizadas
echo "🚀 Desplegando reglas de Firestore..."
firebase deploy --only firestore:rules

echo "
🎉 ¡Configuración de passkeys completada!

📋 Próximos pasos:
1. Verifica que la extensión esté instalada: firebase ext:list
2. Configura los dominios autorizados en Firebase Console
3. Prueba la implementación en tu app local
4. Despliega a producción cuando esté listo

🔗 URLs importantes:
- Firebase Console: https://console.firebase.google.com/project/liquidacionapp-62962
- Extensión Web Authn: https://extensions.dev/extensions/gavinsawyer/firebase-web-authn
"
