# Configuración AWS Rekognition para Reconocimiento Facial

## 🚨 Error Actual
El error "functions.config() is no longer available in Cloud Functions for Firebase v2" indica que el proyecto está usando Firebase Functions v2, que requiere variables de entorno en lugar de la configuración antigua.

## 🔧 Solución - Configurar Variables de Entorno (Firebase Functions v2)

### Paso 1: Obtener Credenciales AWS
1. Accede a la consola de AWS (https://console.aws.amazon.com)
2. Ve a IAM (Identity and Access Management)
3. Crea un nuevo usuario IAM o usa uno existente
4. Asigna los siguientes permisos:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "rekognition:IndexFaces",
           "rekognition:SearchFacesByImage",
           "rekognition:CreateCollection",
           "rekognition:ListCollections"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
5. Genera una clave de acceso (Access Key) y guarda:
   - Access Key ID
   - Secret Access Key

### Paso 2: Configurar Variables de Entorno en Firebase Functions v2

**Método Recomendado - Variables de Entorno:**

1. Crea un archivo `.env` en la carpeta `functions/`:
```bash
cd functions
cat > .env << EOF
AWS_ACCESS_KEY_ID=tu_access_key_id_aqui
AWS_SECRET_ACCESS_KEY=tu_secret_access_key_aqui
AWS_REGION=us-east-1
FACIAL_MIN_SIMILARITY=90.0
EOF
```

2. O configúralas usando Firebase CLI:
```bash
# Configurar variables de entorno para Functions v2
firebase functions:secrets:set AWS_ACCESS_KEY_ID
firebase functions:secrets:set AWS_SECRET_ACCESS_KEY
firebase functions:config:set aws.region="us-east-1"
firebase functions:config:set facial.min_similarity="90.0"

# Redesplegar functions
firebase deploy --only functions
```

**Alternativa - Consola de Firebase:**
1. Ve a Firebase Console → Functions → Configuration
2. En la pestaña "Environment variables", agrega:
   - `AWS_ACCESS_KEY_ID`: Tu Access Key ID
   - `AWS_SECRET_ACCESS_KEY`: Tu Secret Access Key  
   - `AWS_REGION`: us-east-1
   - `FACIAL_MIN_SIMILARITY`: 90.0

### Paso 3: Verificar la Configuración

Después de configurar, intenta registrar un rostro nuevamente. Si las credenciales están configuradas correctamente, deberías ver en los logs:

```
🔧 Configuración AWS verificada, región: us-east-1
📸 Registrando rostro para usuario: [USER_ID]
✅ Colección users creada
✅ Rostro registrado exitosamente: [FACE_ID]
```

## 🐛 Diagnóstico de Problemas

### Error: "Configuración de AWS incompleta"
- Verifica que las credenciales estén configuradas correctamente
- Ejecuta `firebase functions:config:get` para ver la configuración actual

### Error: "No se detectó ningún rostro en la imagen"
- Asegúrate de que la imagen tenga buena iluminación
- La cara debe estar bien visible y centrada
- Intenta con una imagen de mejor calidad

### Error de permisos AWS
- Verifica que el usuario IAM tenga los permisos correctos de Rekognition
- Confirma que la región configurada sea compatible con Rekognition

## 📋 Lista de Verificación

- [ ] Usuario IAM creado en AWS
- [ ] Permisos de Rekognition asignados
- [ ] Access Key y Secret Key generados
- [ ] Credenciales configuradas en Firebase Functions
- [ ] Functions redespleadas
- [ ] Prueba de registro de rostro exitosa

## 🔗 Enlaces Útiles

- [AWS IAM Console](https://console.aws.amazon.com/iam/)
- [AWS Rekognition Pricing](https://aws.amazon.com/rekognition/pricing/)
- [Firebase Functions Configuration](https://firebase.google.com/docs/functions/config-env)
- [Guía completa de reconocimiento facial](combustibles/docs/FACIAL_RECOGNITION_GUIDE.md)