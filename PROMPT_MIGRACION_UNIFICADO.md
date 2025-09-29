# 🚀 Prompt Unificado: Migración Forestech Combustibles

## 🎯 Meta principal
Migrar la plataforma Combustibles de la arquitectura Azure SQL + Cloud Run (53+ endpoints) a Cloud SQL SQL Server + Firebase Functions (8 funciones) manteniendo rendimiento <400 ms, autenticación Firebase y cero regresiones en frontend. 

---

## 🧭 Estado actual
- ✅ Instancia Cloud SQL `oil` operativa (`liquidacionapp-62962:us-central1:oil`, IP pública `34.61.242.157`).
- ✅ Esquema SQL Server desplegado en Cloud SQL, conexiones autorizadas.
- 🔄 Datos aún por migrar desde Azure SQL (`oilforestech.privatelink.database.windows.net`).
- ✅ Código backend listo para funciones Cloud SQL (`functions/src/sql/*`).
- ✅ Servicios frontend adaptados para `httpsCallable` (pendiente validación completa).
- ⚠️ Despliegue de Firebase Functions bloqueado por conflicto Gen 1 vs Gen 2 (requiere ajuste en `firebase.json`).
- ⏳ QA integral, monitoreo y descomisión de Cloud Run pendientes.

---

## 🗂️ Recursos clave
- Este prompt ya integra el roadmap detallado y las pautas para agentes que antes vivían en archivos separados (ambos archivados tras esta consolidación).
- Scripts útiles:
  - `./scripts/setup-cloud-sql-sqlserver.sh`
  - `./scripts/migrate-azure-to-cloudsql-sqlserver.sh`
  - `node scripts/test-cloud-sql-migration.js`
  - `firebase deploy --only functions`
- Conexión SQL: `functions/src/cloudsql/sqlserver-connection.js`.

---

## 🧑‍🤝‍🧑 Equipo de agentes y entregables

### 1. 🗄️ Database Admin — *Semana 1 · Días 1-2*
**Objetivo:** Migrar y validar la base de datos `forestechCombus`.

**Entradas:** Instancia Cloud SQL `oil`, acceso a Azure SQL, scripts de migración.

**Acciones prioritarias:**
1. Probar conectividad (`node scripts/test-cloud-sql-migration.js`).
2. Ejecutar backup en Azure SQL y restaurarlo en Cloud SQL con `./scripts/migrate-azure-to-cloudsql-sqlserver.sh`.
3. Validar integridad: conteos por tabla, constraints, performance <500 ms.
4. Documentar resultados y problemas (timeouts, autorizaciones, SSL).

**Éxito:** Datos espejo entre Azure y Cloud SQL, reporte de migración firmado.

---

### 2. ⚙️ Backend Developer — *Semana 1 · Días 3-5*
**Objetivo:** Convertir 53+ endpoints en 8 Firebase Functions callable.

**Funciones meta:**
1. `combustiblesVehicles`
2. `combustiblesMovements`
3. `combustiblesInventory`
4. `combustiblesSuppliers`
5. `combustiblesProducts`
6. `combustiblesMaintenance`
7. `combustiblesHourMeter`
8. `combustiblesCategories`

**Checklist:**
- Reusar servicios en `functions/src/sql/*.js` con `sqlserver-connection.js`.
- Pattern callable:
  ```js
  export const combustiblesVehicles = onCall(async (request) => {
    const { action, data } = request.data;
    const { auth } = request;
    switch (action) {
      case 'create': return createVehicle(data, auth);
      case 'getAll': return getAllVehicles(data?.filters);
      case 'update': return updateVehicle(data.id, data.updates, auth);
      case 'delete': return deleteVehicle(data.id);
      case 'getById': return getVehicleById(data.id);
      case 'getStats': return getVehiclesStats(data?.filters);
      default: throw new functions.https.HttpsError('invalid-argument', 'Acción no soportada.');
    }
  });
  ```
- Incorporar autenticación Firebase y manejo uniforme de errores.
- Tests locales por acción; documentar métricas de latencia.

**Éxito:** 8 funciones empaquetan todos los casos de uso sin pérdida de cobertura.

---

### 3. 🎨 Frontend Developer — *Semana 2 · Días 8-10*
**Objetivo:** Actualizar servicios React (`combustibles/src/services/`) para usar `httpsCallable`.

**Pasos:**
1. Mapear cada servicio a su función (vehicles → `combustiblesVehicles`, etc.).
2. Sustituir `fetch` a Cloud Run por `httpsCallable(functions, name)` con `{ action, data }`.
3. Mantener interfaces públicas y manejo de errores existentes.
4. Validar flujos críticos: altas/bajas de vehículos, movimientos, inventario, reportes.

**Éxito:** UX sin cambios, sin referencias a Cloud Run, consola limpia.

---

### 4. 🚀 DevOps Engineer — *Semana 2 · Día 12 y Semana 3 · Días 15-19*
**Objetivo:** Desplegar, monitorear y descomisionar infraestructura antigua.

**Tareas previas al deploy:**
- Resolver conflicto Gen 1/Gen 2 ajustando `firebase.json` y `firebase-tools`.
- Configurar variables de entorno de funciones (credenciales SQL, etc.).

**Deploy & monitoreo:**
1. `firebase deploy --only functions` (deploy gradual, ventana de bajo tráfico).
2. Instrumentar métricas: latencia <400 ms, error rate <1%, health de Cloud SQL.
3. Rollback plan listo (reactivar Cloud Run + revertir frontend si falla).

**Cleanup:**
- Tras 48 h estables, eliminar servicio Cloud Run (`gcloud run services delete forestech-sql-service`).
- Auditoría de costos y actualización de runbooks.

**Éxito:** Infraestructura limpia, costos reducidos 60-70%, monitoreo en verde.

---

### 5. 🧪 QA Engineer — *Semana 2 · Día 11 y continuo hasta cierre*
**Objetivo:** Certificar la migración end-to-end.

**Ámbitos de prueba:**
- **Base de datos:** Conteos, constraints, tiempos de consulta.
- **APIs:** Todas las acciones de las 8 funciones callable.
- **Frontend:** Flujos WebAuthn, movimientos, inventario, reportes, administración.
- **Performance:** Comparativa antes/después, carga con datos reales, pooling conexiones.

**Entregable:** Informe con casos ejecutados, métricas de performance, issues y sign-off.

---

## 🔄 Coordinación y secuencia
1. **Fase 1 (Paralelo):** Database Admin + Backend Developer.
2. **Fase 2:** Frontend Developer integra nuevas funciones.
3. **Fase 3:** DevOps despliega y monitorea.
4. **Fase 4:** QA valida y firma.
5. **Fase 5:** DevOps ejecuta cleanup final.

**Bloqueador actual:** solucionar conflicto Gen 1/Gen 2 para habilitar deploy de funciones. Priorizar soporte de DevOps + Backend.

---

## ⚠️ Puntos críticos & rollback
- **Día 2:** Verificación de migración de datos.
- **Día 5:** Deploy inicial de funciones (tener rollback listo).
- **Día 12:** Deploy frontend y monitoreo intenso.

**Plan de rollback (≤5 min):**
1. Reactivar servicio Cloud Run (`forestech-sql-service`).
2. Revertir frontend a endpoints anteriores.
3. Confirmar Azure SQL operativo.
4. Registrar incidente y ajustar plan.

---

## ✅ Definición de éxito global
- Base de datos migrada y validada al 100%.
- 8 Firebase Functions callable cubren todo el dominio.
- Frontend opera con nuevas funciones sin regresiones.
- Latencia promedio <400 ms y error rate <1%.
- Cloud Run y Azure SQL descomisionados; reducción de costo 65%.
- Documentación y runbooks actualizados.

---

## 📣 Instrucción final para el orquestador
"Coordina a los agentes siguiendo la secuencia, resuelve el bloqueo Gen 1/Gen 2 para completar el deploy y asegura que cada fase entregue su reporte antes de avanzar. Reporta progreso diario y activa rollback inmediato ante degradaciones mayores."