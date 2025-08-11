# 🔧 Guía de Configuración de Secrets en GitHub

## Problema Identificado

Los errores en producción se deben a que las variables de entorno de Firebase no están configuradas en GitHub Actions durante el build.

## ✅ Cambios Realizados Localmente

1. **Storage Bucket URL corregido**:
   - Cambiado de `liquidacionapp-62962.firebasestorage.app`
   - A: `liquidacionapp-62962.appspot.com`

2. **Workflow actualizado**: Variables de entorno agregadas al proceso de build

## 🚨 ACCIÓN REQUERIDA: Configurar Secrets en GitHub

Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions

### Secrets que debes agregar:

```
VITE_FIREBASE_API_KEY = AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4
VITE_FIREBASE_APP_ID = 1:851382130132:web:eaba38fab449f14fb5b241
VITE_FIREBASE_MEASUREMENT_ID = G-TPNSX0EGB0
```

### Variables que ya están hardcodeadas (no cambián):

- `VITE_FIREBASE_AUTH_DOMAIN` = liquidacionapp-62962.firebaseapp.com
- `VITE_FIREBASE_PROJECT_ID` = liquidacionapp-62962
- `VITE_FIREBASE_STORAGE_BUCKET` = liquidacionapp-62962.appspot.com
- `VITE_FIREBASE_MESSAGING_SENDER_ID` = 851382130132

## 🔧 Pasos para configurar secrets:

1. Ve a: https://github.com/evertweb/forestech/settings/secrets/actions

2. Haz clic en "New repository secret" para cada una:

   **Secret 1:**
   - Name: `VITE_FIREBASE_API_KEY`
   - Value: `AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4`

   **Secret 2:**
   - Name: `VITE_FIREBASE_APP_ID`
   - Value: `1:851382130132:web:eaba38fab449f14fb5b241`

   **Secret 3:**
   - Name: `VITE_FIREBASE_MEASUREMENT_ID`
   - Value: `G-TPNSX0EGB0`

## 🚀 Después de configurar los secrets:

1. Haz push de estos cambios:

   ```bash
   git push origin main
   ```

2. El deploy se ejecutará automáticamente y debería funcionar

## ✅ Verificación

Una vez que el deploy termine, verifica:

- https://forestechdecolombia.com.co/combustibles/
- No deberían aparecer más errores de configuración Firebase
- El Storage debería cargar correctamente

## 📝 Notas Técnicas

- **Build local confirmado**: ✅ Funciona perfectamente
- **Problema raíz**: Variables de entorno faltantes en CI/CD
- **Solución aplicada**: Configuración explícita en GitHub Actions workflow
- **Storage Bucket**: Corrección del dominio reciente de Firebase
