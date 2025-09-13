# Passkeys Sencillas - Versión Simplificada

Esta es una implementación **muy simplificada** de passkeys que usa solo WebAuthn nativo, sin dependencias externas ni integración compleja con Firebase.

## 🎯 Características

- ✅ **Solo WebAuthn nativo** - Sin Firebase extensions
- ✅ **Almacenamiento local** - Usa localStorage para simplicidad
- ✅ **Código minimalista** - ~200 líneas vs 1200+ de la versión compleja
- ✅ **Funciona inmediatamente** - No requiere configuración de servidor
- ✅ **Compatible** - Touch ID, Face ID, Windows Hello

## 📁 Archivos

```
services/simpleWebAuthnService.js    # Servicio WebAuthn simple
components/SimplePasskeyAuth.jsx     # Componente de UI
pages/SimplePasskeyDemo.jsx          # Página de demo
```

## 🚀 Cómo usar

1. **Accede a la demo:**
   ```
   http://localhost:5174/combustibles/simple-passkeys
   ```

2. **Registra una passkey:**
   - Ingresa tu nombre
   - Haz clic en "Registrar Passkey"
   - Usa tu biometría (Touch ID/Face ID/Windows Hello)

3. **Prueba la autenticación:**
   - Haz clic en "Probar Autenticación"
   - Se autenticará automáticamente

## 🔧 API Simple

```javascript
import {
  registerPasskey,
  authenticateWithPasskey,
  getRegisteredPasskeys,
  clearAllPasskeys
} from './services/simpleWebAuthnService';

// Registrar nueva passkey
const result = await registerPasskey('Mi Nombre');

// Autenticar
const auth = await authenticateWithPasskey();

// Ver passkeys guardadas
const passkeys = getRegisteredPasskeys();
```

## 🎨 Diferencias con la versión compleja

| Aspecto | Versión Simple | Versión Compleja |
|---------|----------------|------------------|
| **Dependencias** | Solo WebAuthn nativo | Firebase Auth + Firestore |
| **Almacenamiento** | localStorage | Firestore collections |
| **Integración** | Independiente | Vinculada a usuarios Firebase |
| **Complejidad** | ~200 líneas | 1200+ líneas |
| **Configuración** | Ninguna | Firebase extensions + reglas |
| **Persistencia** | Solo en dispositivo | Multi-dispositivo |

## 🔄 Próximos pasos

Esta versión simple es perfecta para:
- **Probar funcionalidad básica** de WebAuthn
- **Aprender** cómo funcionan las passkeys
- **Desarrollar UI/UX** sin complejidad backend
- **Demo rápida** para stakeholders

Para producción, integrar con:
- Firebase Auth (vincular passkeys a usuarios)
- Base de datos persistente
- Manejo de múltiples dispositivos
- Seguridad adicional

## 🧪 Testing

La demo incluye:
- Verificación de soporte WebAuthn
- Lista de passkeys registradas
- Manejo de errores amigable
- Contador de usos por passkey</content>
</xai:function_call">The following files were successfully edited:
/home/hp/Documents/forestech/combustibles/src/services/README-simple-passkeys.md