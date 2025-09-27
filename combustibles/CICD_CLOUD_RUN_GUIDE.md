# 🚀 CI/CD PARA CLOUD RUN - GUÍA COMPLETA

## 📋 **RESUMEN DE LA MIGRACIÓN**

✅ **Completado:** Firebase Functions → Google Cloud Run
✅ **Estado:** Sistema funcionando correctamente
✅ **Pendiente:** Generar datos de prueba y configurar CI/CD

---

## 🗂️ **GENERAR DATOS DE PRUEBA**

### **Script Disponible**
```bash
cd combustibles/scripts
node generate-test-data.js
```

### **Datos que Genera**
- **📦 Productos:** 3 productos de prueba (Gasolina, Diesel, Aceite)
- **🚗 Vehículos:** 3 vehículos de prueba (Camión, Excavadora, Motobomba)
- **📊 Movimientos:** 3 movimientos de prueba (entradas y salidas)

### **Uso del Script**
1. **Ejecutar:** `node generate-test-data.js`
2. **Ingresar credenciales** de Firebase
3. **Esperar** a que genere todos los datos
4. **Verificar** en la aplicación

---

## 🔄 **CI/CD ACTUALIZADO**

### **Workflows Disponibles**

#### **1. Deploy Solo Cloud Run**
```yaml
# .github/workflows/deploy-cloud-run.yml
```
- ✅ Deploy automático cuando cambian archivos de `functions/`
- ✅ Configuración optimizada (512MB RAM, 1 CPU)
- ✅ Health check automático
- ✅ Variables de entorno configuradas

#### **2. Deploy Unificado (Recomendado)**
```yaml
# .github/workflows/deploy-unified.yml
```
- ✅ Build completo del frontend
- ✅ Deploy de Cloud Run
- ✅ Deploy de Firebase Hosting
- ✅ Verificaciones automáticas
- ✅ Summary de deployment

### **Configuración de Secrets**

#### **GitHub Secrets Requeridos**
```bash
# Firebase
FIREBASE_SERVICE_ACCOUNT_LIQUIDACIONAPP_62962
FIREBASE_TOKEN
VITE_FIREBASE_API_KEY
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID

# Google Cloud
GCP_SA_KEY
```

#### **Configurar Secrets**
1. **Ve a GitHub:** `Settings > Secrets and variables > Actions`
2. **Agrega los secrets** con los valores correspondientes
3. **Firebase Console:** Para obtener service account y tokens
4. **Google Cloud Console:** Para obtener service account key

---

## 📊 **FLUJO DE CI/CD ACTUAL**

### **Antes (Firebase Functions)**
```
Push → Firebase Functions Deploy → Hosting Deploy
```

### **Ahora (Cloud Run)**
```
Push → Build Frontend → Deploy Cloud Run → Deploy Hosting
```

### **Ventajas del Nuevo Flujo**
- ✅ **Mejor rendimiento:** Cloud Run vs Functions
- ✅ **Costo optimizado:** $0-2/mes vs $50-100/mes
- ✅ **Escalabilidad:** Automática (0-10 instancias)
- ✅ **35 endpoints:** Un servicio vs múltiples functions

---

## 🛠️ **CONFIGURACIÓN DE PRODUCCIÓN**

### **Variables de Entorno en Cloud Run**
```bash
NODE_ENV=production
FIREBASE_PROJECT_ID=liquidacionapp-62962
GCLOUD_PROJECT=liquidacionapp-62962
```

### **Configuración de Cloud Run**
- **Memoria:** 512Mi
- **CPU:** 1 vCPU
- **Max instancias:** 10
- **Región:** us-central1
- **Autenticación:** Permitida (sin auth)

---

## 🚀 **COMANDOS ÚTILES**

### **Deploy Manual**
```bash
# Deploy Cloud Run
cd functions
gcloud run deploy forestech-sql-service \
  --source . \
  --region us-central1 \
  --project liquidacionapp-62962 \
  --allow-unauthenticated

# Ver logs
gcloud run services logs read forestech-sql-service \
  --region us-central1 \
  --project liquidacionapp-62962 \
  --limit=50
```

### **Testing**
```bash
# Testing básico
node combustibles/scripts/test-cloud-run-simple.js

# Testing completo
node combustibles/scripts/test-cloud-run-endpoints.js

# Generar datos
node combustibles/scripts/generate-test-data.js
```

### **Monitoreo**
```bash
# Estado del servicio
gcloud run services describe forestech-sql-service \
  --region us-central1 \
  --project liquidacionapp-62962

# Métricas
gcloud run services logs read forestech-sql-service \
  --region us-central1 \
  --project liquidacionapp-62962 \
  --limit=100 | grep -E "(✅|❌|📊|🔥)"
```

---

## 📋 **CHECKLIST DE DEPLOY**

### **✅ Completado**
- [x] Migración Firebase Functions → Cloud Run
- [x] Configuración de autenticación Firebase
- [x] Conexión a Azure SQL Server
- [x] Creación de workflows CI/CD
- [x] Scripts de testing y datos

### **🔄 Pendiente**
- [ ] Configurar GitHub Secrets
- [ ] Probar workflows CI/CD
- [ ] Generar datos de prueba
- [ ] Verificar integración completa

---

## 🎯 **PRÓXIMOS PASOS**

### **1. Configurar Secrets en GitHub**
```bash
# Agregar estos secrets en GitHub Actions
GCP_SA_KEY                    # Service Account Key de Google Cloud
FIREBASE_SERVICE_ACCOUNT_LIQUIDACIONAPP_62962  # Service Account de Firebase
FIREBASE_TOKEN               # Token de Firebase CLI
VITE_FIREBASE_API_KEY        # API Key de Firebase
VITE_FIREBASE_APP_ID         # App ID de Firebase
VITE_FIREBASE_MEASUREMENT_ID # Measurement ID de Firebase
```

### **2. Generar Datos de Prueba**
```bash
node combustibles/scripts/generate-test-data.js
```

### **3. Probar CI/CD**
- Hacer push a `main`
- Verificar que los workflows se ejecuten
- Confirmar deployment exitoso

### **4. Verificar Integración**
- Probar la aplicación en producción
- Verificar que todos los endpoints funcionen
- Confirmar autenticación y permisos

---

## 💰 **COSTOS ESTIMADOS**

### **Cloud Run (Plan Gratis Incluido)**
| **Recurso** | **Plan Gratis** | **Tu Uso** | **Estado** |
|-------------|-----------------|------------|------------|
| **Requests** | 2M/mes | ~1,000/mes | ✅ GRATIS |
| **vCPU** | 400K seg/mes | ~10K seg/mes | ✅ GRATIS |
| **Memoria** | 360K GB-seg/mes | ~20K GB-seg/mes | ✅ GRATIS |

### **Comparación con Firebase Functions**
- **Antes:** $50-100/mes (cuota + functions)
- **Ahora:** $0-2/mes (solo exceso del plan gratis)
- **Ahorro:** ~95% de costos

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### **Error de Autenticación**
- Verificar API key de Firebase
- Confirmar project ID correcto
- Revisar logs de Cloud Run

### **Error de Base de Datos**
- Verificar firewall de Azure SQL
- Confirmar credenciales SQL
- Revisar nombres de tablas

### **Error de CI/CD**
- Verificar GitHub Secrets
- Confirmar permisos de service accounts
- Revisar logs de GitHub Actions

---

## 📞 **SOPORTE**

### **URLs de Producción**
- **Frontend:** https://forestech-combustibles.web.app
- **Cloud Run:** https://forestech-sql-service-851382130132.us-central1.run.app
- **Firebase Console:** https://console.firebase.google.com/project/liquidacionapp-62962
- **Google Cloud Console:** https://console.cloud.google.com/run

### **Comandos de Emergencia**
```bash
# Rollback rápido
gcloud run services rollback forestech-sql-service --region us-central1

# Ver logs en tiempo real
gcloud run services logs tail forestech-sql-service --region us-central1

# Estado del servicio
gcloud run services describe forestech-sql-service --region us-central1
```

---

**🎉 ¡La migración está completa! Solo falta configurar los secrets y generar datos de prueba.**