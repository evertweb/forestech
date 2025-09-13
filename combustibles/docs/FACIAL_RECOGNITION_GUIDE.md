# Reconocimiento Facial - Guía de Implementación

## 🎯 Resumen

Esta implementación integra AWS Rekognition con Firebase para proporcionar autenticación facial en la app "combustibles". Los usuarios pueden registrar su rostro y usarlo como método de login alternativo.

## 🏗️ Arquitectura

### Backend (Firebase Functions)
- **registerFace**: Registra el rostro del usuario en AWS Rekognition
- **loginFace**: Verifica la identidad usando reconocimiento facial
- **Colección Firestore**: `facial_auth` almacena la relación uid ↔ faceId

### Frontend (React)
- **Servicio**: `firebaseFacialService.js` maneja llamadas a Functions
- **Componentes**: Integrado en `AuthVisualEnhancedClean.jsx` y `PasskeyManager.jsx`
- **Captura**: Usa MediaDevices API para acceder a la cámara

## ⚙️ Configuración

### 1. Credenciales AWS
Configurar en Firebase Functions:

```bash
firebase functions:config:set aws.access_key_id="TU_ACCESS_KEY"
firebase functions:config:set aws.secret_access_key="TU_SECRET_KEY"
firebase functions:config:set aws.region="us-east-1"
```

### 2. Similitud Mínima (Opcional)
```bash
firebase functions:config:set facial.min_similarity="90.0"
```

### 3. Permisos IAM de AWS
El usuario IAM necesita estos permisos:
- `rekognition:IndexFaces`
- `rekognition:SearchFacesByImage`
- `rekognition:CreateCollection`

## 🚀 Uso

### Registro de Rostro
1. Usuario autenticado accede a "Gestión de Autenticación Biométrica"
2. Hace clic en "Registrar Rostro"
3. Otorga permisos de cámara
4. Captura imagen facial
5. Sistema registra el rostro en AWS Rekognition

### Login Facial
1. En página de login, usuario hace clic en "Acceder con Rostro"
2. Otorga permisos de cámara
3. Captura imagen facial
4. Sistema busca coincidencias con similitud > 90%
5. Si coincide, inicia sesión automáticamente

## 🔧 API Reference

### registerFace (Callable Function)
```javascript
const result = await registerFace(imageFile);
// Retorna: { success: true, faceId, message } o { success: false, error }
```

### loginFace (Callable Function)
```javascript
const result = await loginFace(imageFile);
// Retorna: { success: true, uid, similarity, customToken } o { success: false, error }
```

### Servicio Frontend
```javascript
import { registerFace, loginWithFace } from '../services/firebaseFacialService';

// Registro
const result = await registerFace(imageBlob);

// Login
const result = await loginWithFace(imageBlob);
```

## 🛡️ Seguridad

- **HTTPS Requerido**: La API de MediaDevices solo funciona en HTTPS
- **Permisos Explícitos**: Usuario debe otorgar acceso a cámara
- **Similitud Alta**: Umbral de 90% para evitar falsos positivos
- **Custom Tokens**: Firebase maneja la autenticación final
- **FaceId Encriptado**: AWS maneja el almacenamiento seguro

## 🐛 Troubleshooting

### Error: "No se pudo acceder a la cámara"
- Verificar HTTPS
- Revisar permisos del navegador
- Intentar en otro navegador

### Error: "Face not recognized"
- Verificar iluminación
- Asegurar rostro completo visible
- Re-registrar el rostro si cambió significativamente

### Error: "No se detectó ningún rostro"
- Imagen muy oscura/clara
- Rostro parcialmente oculto
- Ángulo extremo

## 📊 Logs y Monitoreo

Los logs se generan en:
- **Firebase Functions**: Console de Google Cloud
- **Frontend**: Browser DevTools Console
- **AWS Rekognition**: AWS CloudWatch (si configurado)

Logs importantes:
- `📸 Registrando rostro para usuario: [uid]`
- `✅ Rostro registrado exitosamente: [faceId]`
- `🔍 Buscando coincidencia facial`
- `✅ Autenticación facial exitosa para usuario: [uid]`

## 🔄 Actualizaciones

Para actualizar la configuración:
1. Modificar `functions.config()` en Firebase
2. Re-desplegar functions: `firebase deploy --only functions`
3. Limpiar cache del navegador

## 📝 Notas de Desarrollo

- **Colección AWS**: Se crea automáticamente como "users"
- **Límite**: 1 rostro por usuario
- **Formato**: Imágenes base64 o Buffer
- **Tamaño**: Máx. 5MB por imagen
- **Timeout**: 60 segundos por función</content>
<parameter name="filePath">/home/hp/Documents/forestech/combustibles/docs/FACIAL_RECOGNITION_GUIDE.md