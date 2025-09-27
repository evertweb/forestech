# 🚀 ROADMAP MIGRACIÓN: FIREBASE FUNCTIONS → GOOGLE CLOUD RUN
## 📅 **Fecha inicio:** 21 de septiembre de 2025
## 🎯 **Objetivo:** Migrar servicios SQL de Firebase Functions a Cloud Run para resolver problemas de cuota

---

## 📊 CONTEXTO ACTUAL

### 🔍 **PROBLEMA IDENTIFICADO**
- **Cuota CPU Firebase Functions:** 45% usada (9,000/20,000 mCPU)
- **Funciones desplegadas:** Solo 2/35 funcionando correctamente
- **Error principal:** "Quota exceeded for total allowable CPU per project per region"
- **Impacto:** Frontend no puede usar funciones SQL migradas

### 📈 **ESTADO DE LA MIGRACIÓN SQL**
- **Servicios migrados:** ✅ 8/8 (100%)
- **Endpoints creados:** ✅ 35/35 (100%)
- **Private Link configurado:** ✅ Funcionando
- **Variables de entorno:** ✅ Configuradas
- **Deploy exitoso:** ❌ Bloqueado por cuota

### 🎯 **OBJETIVO DE LA MIGRACIÓN**
**Arquitectura objetivo:** React Frontend → Cloud Run → Azure SQL Server

---

## 📋 ANÁLISIS DE Opciones

### **OPCIÓN 1: PERMANECER EN FIREBASE FUNCTIONS**
❌ **Problemas:** Cuota limitada, deploy bloqueado
❌ **Riesgo:** No se puede completar la migración SQL
❌ **Costo:** $0.70/mes por aumento cuota (pendiente aprobación)

### **OPCIÓN 2: MIGRAR A GOOGLE CLOUD RUN** ⭐ **RECOMENDADA**
✅ **Beneficios:** Más cuota, mejor performance, costos bajos
✅ **Plan gratis:** 2M requests, 400K vCPU-segundos, 360K GB-segundos
✅ **Costo estimado:** $0.50-2/mes para uso actual
✅ **Tiempo migración:** 2-3 días

### **OPCIÓN 3: MIGRAR A AZURE FUNCTIONS**
❌ **Problemas:** Cambio arquitectónico mayor, curva aprendizaje
❌ **Tiempo:** 5-7 días
❌ **Costo:** Similar a Cloud Run pero más complejo

---

## 🎯 PLAN DE MIGRACIÓN A CLOUD RUN

### **FASE 1: PREPARACIÓN (Día 1)**

#### **TASK-001** ✅ **Análisis y planificación**
- **Estado:** 🔄 EN PROCESO
- **Responsable:** Kilo Code
- **Tiempo estimado:** 2 horas

**Subtareas:**
- [x] Analizar código actual de Firebase Functions
- [x] Identificar dependencias y configuración
- [x] Diseñar arquitectura Cloud Run
- [x] Crear Dockerfile para containerización

#### **TASK-002** 🔄 **Setup Cloud Run**
- **Estado:** 🔴 PENDIENTE
- **Responsable:** Kilo Code
- **Tiempo estimado:** 3 horas

**Subtareas:**
- [ ] Habilitar Cloud Run API en Google Cloud Console
- [ ] Configurar variables de entorno en Cloud Run
- [ ] Crear service account para Cloud Run
- [ ] Configurar permisos IAM necesarios

### **FASE 2: MIGRACIÓN TÉCNICA (Día 2)**

#### **TASK-003** 🔄 **Crear estructura Cloud Run**
- **Estado:** 🔴 PENDIENTE
- **Responsable:** Kilo Code
- **Tiempo estimado:** 4 horas

**Subtareas:**
- [ ] Crear Dockerfile para Node.js
- [ ] Migrar configuración SQL (config.js)
- [ ] Adaptar servicios SQL para HTTP endpoints
- [ ] Implementar middleware CORS
- [ ] Configurar manejo de errores

#### **TASK-004** 🔄 **Migrar servicios SQL**
- **Estado:** 🔴 PENDIENTE
- **Responsable:** Kilo Code
- **Tiempo estimado:** 6 horas

**Servicios a migrar:**
- [ ] SqlProductsService (12 endpoints)
- [ ] SqlMaintenanceService (8 endpoints)
- [ ] SqlHourMeterService (6 endpoints)
- [ ] SqlVehicleCategoriesService (9 endpoints)
- [ ] SqlMovementsService (5 endpoints)
- [ ] SqlInventoryService (5 endpoints)
- [ ] SqlVehiclesService (5 endpoints)
- [ ] SqlSuppliersService (8 endpoints)

### **FASE 3: INTEGRACIÓN FRONTEND (Día 3)**

#### **TASK-005** 🔄 **Actualizar servicios frontend**
- **Estado:** 🔴 PENDIENTE
- **Responsable:** Kilo Code
- **Tiempo estimado:** 4 horas

**Subtareas:**
- [ ] Reemplazar Firebase Functions calls con HTTP calls
- [ ] Actualizar manejo de autenticación
- [ ] Implementar retry logic para HTTP requests
- [ ] Actualizar error handling
- [ ] Testing de integración

#### **TASK-006** 🔄 **Testing y validación**
- **Estado:** 🔴 PENDIENTE
- **Responsable:** Kilo Code
- **Tiempo estimado:** 3 horas

**Subtareas:**
- [ ] Testing funcional de todos los endpoints
- [ ] Validación de conexión Private Link
- [ ] Performance testing vs Firebase Functions
- [ ] Load testing básico
- [ ] Error handling verification

### **FASE 4: DEPLOY Y MONITOREO (Día 4)**

#### **TASK-007** 🔄 **Deploy a producción**
- **Estado:** 🔴 PENDIENTE
- **Responsable:** Kilo Code
- **Tiempo estimado:** 2 horas

**Subtareas:**
- [ ] Deploy inicial de Cloud Run services
- [ ] Configuración de domains y SSL
- [ ] Setup de logging y monitoring
- [ ] Configuración de alerts
- [ ] Documentación de endpoints

#### **TASK-008** 🔄 **Monitoreo y optimización**
- **Estado:** 🔴 PENDIENTE
- **Responsable:** Kilo Code
- **Tiempo estimado:** 2 horas

**Subtareas:**
- [ ] Setup Cloud Monitoring
- [ ] Configurar dashboards
- [ ] Optimizar recursos (CPU/Memory)
- [ ] Implementar caching si necesario
- [ ] Documentación final

---

## 🛠️ DETALLES TÉCNICOS

### **ARQUITECTURA ACTUAL**
```
React Frontend → Firebase Functions → Azure SQL Server
```

### **ARQUITECTURA OBJETIVO**
```
React Frontend → Cloud Run → Azure SQL Server
```

### **CAMBIOS PRINCIPALES**

#### **1. Dockerfile para Cloud Run**
```dockerfile
FROM node:20-slim

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 8080

CMD ["node", "server.js"]
```

#### **2. Server HTTP para Cloud Run**
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Middleware de autenticación
app.use(async (req, res, next) => {
  // Validar Firebase Auth token
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// Endpoints SQL
app.post('/sqlGetAllProducts', sqlGetAllProducts);
app.post('/sqlCreateProduct', sqlCreateProduct);
// ... más endpoints

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
```

#### **3. Frontend: Cambiar de onCall a HTTP**
```javascript
// ANTES (Firebase Functions)
const result = await sqlGetAllProducts();

// DESPUÉS (Cloud Run)
const response = await fetch('https://your-cloudrun-url/sqlGetAllProducts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  }
});
const result = await response.json();
```

---

## 💰 ANÁLISIS DE COSTOS

### **COSTOS CLOUD RUN (Plan Gratis Incluido)**

| **Recurso** | **Plan Gratis** | **Costo Exceso** | **Tu Uso Estimado** |
|-------------|-----------------|------------------|-------------------|
| **Requests** | 2M/mes | $0.40/M | ~1,000/mes = ✅ GRATIS |
| **vCPU** | 400K seg/mes | $0.000024/seg | ~10K seg/mes = ✅ GRATIS |
| **Memoria** | 360K GB-seg/mes | $0.00000325/GB-seg | ~20K GB-seg/mes = ✅ GRATIS |
| **Salida Red** | 1GB/mes | $0.12/GB | ~0.1GB/mes = ✅ GRATIS |

### **COSTO ESTIMADO MENSUAL**
- **Tu uso actual:** **$0.00 - $0.50/mes** (dentro del plan gratis)
- **100 usuarios/día:** **$0.50 - $1.00/mes**
- **1,000 usuarios/día:** **$2.00 - $5.00/mes**

### **COMPARACIÓN CON FIREBASE FUNCTIONS**
- **Firebase Functions:** $0.70/mes (solo aumento cuota) + problemas de deploy
- **Cloud Run:** $0.00-0.50/mes + deploy ilimitado + mejor performance

---

## ⚠️ RIESGOS Y MITIGACIÓN

### **RIESGOS IDENTIFICADOS**

#### **Riesgo Alto:**
- **Tiempo de migración:** 3-4 días
- **Posible downtime:** Durante el cambio de endpoints
- **Errores de integración:** Frontend con nuevos endpoints

#### **Riesgo Medio:**
- **Curva de aprendizaje:** Cloud Run vs Firebase Functions
- **Configuración inicial:** Variables de entorno, permisos
- **Testing insuficiente:** Posibles bugs en migración

#### **Riesgo Bajo:**
- **Costo inesperado:** Monitoreo de uso
- **Performance:** Cloud Run generalmente mejor
- **Mantenimiento:** Similar a Firebase Functions

### **PLAN DE MITIGACIÓN**

#### **1. Rollback Plan**
```bash
# Mantener Firebase Functions como backup
# Cambiar solo URLs en frontend
# Rollback: Cambiar URLs de vuelta
```

#### **2. Testing Gradual**
- Deploy Cloud Run en paralelo
- Testing A/B con subset de usuarios
- Monitoreo constante de errores

#### **3. Backup de Funciones**
- Mantener Firebase Functions deployadas
- Switch rápido si problemas

---

## 📊 TIMELINE DETALLADO

### **DÍA 1: PREPARACIÓN**
- **Mañana:** TASK-001, TASK-002 (5 horas)
- **Tarde:** Setup inicial Cloud Run

### **DÍA 2: MIGRACIÓN TÉCNICA**
- **Mañana:** TASK-003 (4 horas)
- **Tarde:** TASK-004 - Migrar servicios (6 horas)

### **DÍA 3: INTEGRACIÓN**
- **Mañana:** TASK-005 - Frontend (4 horas)
- **Tarde:** TASK-006 - Testing (3 horas)

### **DÍA 4: DEPLOY FINAL**
- **Mañana:** TASK-007 - Deploy (2 horas)
- **Tarde:** TASK-008 - Optimización (2 horas)

### **DÍA 5: MONITOREO**
- Soporte post-migración
- Optimizaciones finales
- Documentación completa

---

## 🎯 CRITERIOS DE ÉXITO

### **Definición de "Done"**
- [ ] Todas las funciones SQL funcionando en Cloud Run
- [ ] Frontend integrado completamente
- [ ] Performance igual o mejor que Firebase Functions
- [ ] Sin errores de cuota
- [ ] Costos dentro del plan gratis
- [ ] Documentación completa
- [ ] Rollback plan probado

### **Métricas de Éxito**
- **Uptime:** 99.9% (igual o mejor)
- **Latencia:** < 500ms (mejor que Firebase Functions)
- **Costo:** < $1/mes (mejor que Firebase Functions)
- **Errores:** < 0.1% (mejor que actual)

---

## 📞 SOPORTE Y COMUNICACIÓN

### **Daily Standups**
```markdown
#### **Kilo Code - [FECHA]**
**Completé ayer:** TASK-XXX
**Trabajaré hoy en:** TASK-XXX
**Blockers:** [si aplica]
**Necesito ayuda con:** [si aplica]
```

### **Puntos de Control**
- **Fin Día 1:** Cloud Run configurado y funcionando
- **Fin Día 2:** Todos los servicios migrados
- **Fin Día 3:** Frontend integrado y probado
- **Fin Día 4:** Deploy completo y optimizado

---

## 🚀 **PRÓXIMOS PASOS INMEDIATOS**

1. **Confirmar migración** - ¿Procedemos con Cloud Run?
2. **Backup actual** - Crear copia de funciones Firebase
3. **Setup inicial** - Comenzar con TASK-001 y TASK-002
4. **Timeline** - Ajustar según disponibilidad

**¿Listo para comenzar la migración a Cloud Run?** 🚀

---

**🔄 ÚLTIMA ACTUALIZACIÓN:** 21 septiembre 2025
**📝 ESTADO:** Planificación completada, esperando confirmación para iniciar