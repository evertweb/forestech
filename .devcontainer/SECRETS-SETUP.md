# 🔐 CONFIGURACIÓN DE SECRETS PARA CODESPACES

## 🚨 SECRET REQUERIDO

Tu devcontainer.json requiere este secret para funcionar correctamente:

### FIREBASE_TOKEN  
**Descripción**: Token para deployment con Firebase CLI
**Cómo obtener**:
```bash
# En tu máquina local (NO en Codespace)
firebase login:ci
# Copia el token que se muestra
```

## 🛠️ CONFIGURAR EN GITHUB

### Paso a paso:
1. Ve a: https://github.com/evertweb/forestech/settings/secrets/codespaces
2. Click "New repository secret"
3. Agrega el secret:

**Secret:**
- Name: `FIREBASE_TOKEN`
- Value: `[tu_firebase_token_aquí]`

## ✅ VERIFICACIÓN

Una vez configurado el secret:
1. Los Codespaces se crearán sin pedir tokens
2. Firebase deploy estará disponible automáticamente
3. Claude Code CLI funcionará sin problemas

## 🔒 SEGURIDAD

- El secret solo es visible en tus Codespaces
- No se muestra en logs o código
- Se inyecta como variable de entorno

## 📱 URLs ÚTILES

- **GitHub Secrets**: https://github.com/evertweb/forestech/settings/secrets/codespaces
- **Firebase Console**: https://console.firebase.google.com/project/liquidacionapp-62962