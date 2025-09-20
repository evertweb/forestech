# 🤖 PROMPTS DINÁMICOS PARA AGENTES - MIGRACIÓN SQL

## 📋 INSTRUCCIONES GENERALES PARA TODOS LOS AGENTES

**Antes de asignar cualquier prompt, copia y pega esto:**

```
Eres un desarrollador experto trabajando en la migración de Firestore a Azure SQL Server para la app Forestech Combustibles. 

CONTEXTO CRÍTICO:
- La app actualmente usa Firebase/Firestore y funciona correctamente
- Estamos migrando a Azure SQL Server via Firebase Functions (NO directamente en frontend)
- El problema actual es que servicios SQL intentan ejecutarse en React (imposible)
- La solución es mover servicios SQL a Firebase Functions (backend Node.js)

ARQUITECTURA OBJETIVO:
React Frontend → Firebase Functions (Node.js) → Azure SQL Server

WORKSPACE UBICACIÓN:
- Repositorio: /home/hp/Documents/forestech/
- App combustibles: /home/hp/Documents/forestech/combustibles/
- Firebase Functions: /home/hp/Documents/forestech/functions/

ROADMAP PRINCIPAL: Consulta /home/hp/Documents/forestech/ROADMAP_MIGRACION_SQL.md

REGLAS DE TRABAJO:
1. Siempre actualiza el roadmap cuando completes una tarea
2. Reporta problemas en el formato especificado
3. Haz commits frecuentes con mensajes descriptivos
4. Documenta lo que hagas para el siguiente agente
```

---

## 👤 AGENTE 1 - BACKEND SPECIALIST

### 🎯 **PROMPT PARA TASK-001: Setup inicial Firebase Functions**

```
AGENTE 1 - BACKEND SPECIALIST | TASK-001: Setup inicial Firebase Functions

OBJETIVO: Configurar Firebase Functions para conectar con Azure SQL Server

CONTEXTO ESPECÍFICO:
- Ya existe una carpeta /functions/ con configuración básica
- Necesitas instalar mssql y crear la infraestructura SQL
- Azure SQL credentials: server=oilforestech.database.windows.net, database=forestechCombus, user=oil, password=271202ev

TAREAS ESPECÍFICAS:
1. Navega a /home/hp/Documents/forestech/functions/
2. Instala mssql: npm install mssql
3. Crea estructura /src/sql/
4. Crea config.js con credenciales Azure SQL
5. Crea testConnection.js para probar conexión
6. Crea function testSqlConnection en index.js
7. Deploy y prueba: firebase deploy --only functions:testSqlConnection

ENTREGABLES REQUERIDOS:
- ✅ package.json actualizado con mssql
- ✅ /src/sql/config.js con configuración Azure
- ✅ /src/sql/testConnection.js funcionando  
- ✅ Function deployada y probada
- ✅ Actualizar ROADMAP con progreso

VERIFICACIÓN DE ÉXITO:
- La function testSqlConnection responde exitosamente
- Se puede conectar a Azure SQL desde Firebase Functions
- Logs muestran conexión exitosa

COMANDO FINAL VERIFICACIÓN:
firebase functions:shell
> testSqlConnection()

¿Alguna duda sobre esta tarea? Procede paso a paso y reporta cualquier error.
```

### 🎯 **PROMPT PARA TASK-002: Migrar SqlMovementsService**

```
AGENTE 1 - BACKEND SPECIALIST | TASK-002: Migrar SqlMovementsService a Functions

PREREQUISITO: TASK-001 debe estar completada y función testSqlConnection funcionando

OBJETIVO: Migrar el servicio de movimientos de frontend a Firebase Functions

ARCHIVOS FUENTE A MIGRAR:
- /home/hp/Documents/forestech/combustibles/src/services/SqlMovementsService.js
- /home/hp/Documents/forestech/combustibles/src/services/base/SqlCrudService.js
- /home/hp/Documents/forestech/combustibles/src/services/base/SqlConnection.js

TAREAS ESPECÍFICAS:
1. Copia la lógica de SqlMovementsService.js a /functions/src/sql/movementsService.js
2. Adapta imports y dependencias para Node.js (no React)
3. Crea funciones exportables: createMovement, getAllMovements, updateMovement, deleteMovement
4. En /functions/index.js agrega endpoints:
   - export const sqlCreateMovement = onCall(...)
   - export const sqlGetAllMovements = onCall(...)
   - export const sqlUpdateMovement = onCall(...)
   - export const sqlDeleteMovement = onCall(...)
5. Deploy y prueba cada endpoint

IMPORTANTE:
- NO copies las clases, convierte a funciones exportables
- Usa la configuración SQL de TASK-001
- Mantén la misma lógica de negocio
- Agrega manejo de errores robusto

ENTREGABLES:
- ✅ /functions/src/sql/movementsService.js funcionando
- ✅ 4 Firebase Functions deployadas para movimientos
- ✅ Testing básico de cada endpoint
- ✅ Documentación de endpoints creados
- ✅ Actualizar ROADMAP: TASK-002 completada

VERIFICACIÓN:
- Todas las functions se deployan sin error
- Se pueden invocar desde Firebase console
- Responden con datos coherentes

¿Necesitas ver el código específico del SqlMovementsService original antes de empezar?
```

---

## 👤 AGENTE 2 - SERVICES MIGRATOR

### 🎯 **PROMPT PARA TASK-003: Migrar SqlInventoryService**

```
AGENTE 2 - SERVICES MIGRATOR | TASK-003: Migrar SqlInventoryService a Functions

PREREQUISITO: TASK-001 (setup SQL) debe estar completada

OBJETIVO: Migrar servicio de inventario siguiendo el patrón establecido en TASK-002

ARCHIVO FUENTE:
- /home/hp/Documents/forestech/combustibles/src/services/SqlInventoryService.js

PATRÓN A SEGUIR:
1. Revisa cómo AGENTE 1 migró SqlMovementsService en TASK-002
2. Usa la misma estructura y convenciones
3. Mantén consistencia en naming y error handling

TAREAS ESPECÍFICAS:
1. Migra SqlInventoryService.js a /functions/src/sql/inventoryService.js
2. Convierte clase a funciones exportables
3. Crea endpoints en /functions/index.js:
   - sqlCreateInventoryItem
   - sqlGetAllInventory  
   - sqlUpdateInventoryItem
   - sqlDeleteInventoryItem
   - sqlGetInventoryByLocation
4. Deploy y testing básico

CONSIDERACIONES ESPECIALES:
- El inventario maneja cálculos de stock
- Validar tipos de combustible (DIESEL, GASOLINE, etc.)
- Mantener lógica de ubicaciones (locations)

ENTREGABLES:
- ✅ /functions/src/sql/inventoryService.js
- ✅ Functions de inventario deployadas
- ✅ Testing de operaciones CRUD
- ✅ Actualizar ROADMAP: TASK-003 completada

¿Necesitas revisar el código del SqlInventoryService antes de empezar?
```

### 🎯 **PROMPT PARA TASK-004: Migrar SqlVehiclesService**

```
AGENTE 2 - SERVICES MIGRATOR | TASK-004: Migrar SqlVehiclesService a Functions

PREREQUISITO: TASK-001 completada

OBJETIVO: Migrar servicio de vehículos (hay un bug conocido de imports)

ARCHIVO FUENTE:
- /home/hp/Documents/forestech/combustibles/src/services/SqlVehiclesService.js

⚠️ PROBLEMA CONOCIDO:
- Hay un error en línea 15: export { VEHICLE_STATUS, FUEL_TYPES } from '../../data/vehicleCategories.js';
- El path está mal, debe ser '../data/vehicleCategories.js'
- Este import debe manejarse diferente en Functions

TAREAS ESPECÍFICAS:
1. Migra SqlVehiclesService.js a /functions/src/sql/vehiclesService.js
2. RESOLVER el problema de imports de vehicleCategories:
   - Opción A: Copia las constantes directamente al archivo
   - Opción B: Crea /functions/src/shared/vehicleCategories.js
3. Crear endpoints de vehículos
4. Testing completo

ENDPOINTS REQUERIDOS:
- sqlCreateVehicle
- sqlGetAllVehicles
- sqlUpdateVehicle  
- sqlDeleteVehicle
- sqlGetVehicleById

ENTREGABLES:
- ✅ Problema de imports resuelto
- ✅ /functions/src/sql/vehiclesService.js funcionando
- ✅ Functions deployadas
- ✅ Actualizar ROADMAP: TASK-004 completada

¿Quieres que te muestre el error específico del import antes de empezar?
```

---

## 👤 AGENTE 3 - FRONTEND INTEGRATOR

### 🎯 **PROMPT PARA TASK-007: Actualizar servicios frontend**

```
AGENTE 3 - FRONTEND INTEGRATOR | TASK-007: Actualizar servicios frontend

PREREQUISITOS: TASK-002, TASK-003, TASK-004 deben estar completadas (Functions SQL deployadas)

OBJETIVO: Actualizar frontend para usar Firebase Functions en lugar de servicios SQL directos

PROBLEMA ACTUAL:
- Frontend importa servicios SQL directamente (causa error de build)
- Necesitas cambiar a httpsCallable pattern

ARCHIVOS A MODIFICAR:
- /combustibles/src/contexts/CombustiblesContext.jsx
- /combustibles/src/contexts/CombustiblesContextSSR.jsx  
- /combustibles/src/components/Vehicles/VehiclesMain.jsx
- /combustibles/src/components/MovementsList.jsx

PATRÓN DE MIGRACIÓN:
❌ ANTES:
```javascript
import SqlMovementsService from '../services/SqlMovementsService';
const sqlMovementsService = new SqlMovementsService();
const result = await sqlMovementsService.createMovement(data);
```

✅ DESPUÉS:
```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';
const functions = getFunctions();
const createMovementFn = httpsCallable(functions, 'sqlCreateMovement');
const result = await createMovementFn({ movementData: data, userInfo });
```

TAREAS ESPECÍFICAS:
1. Crear nuevos servicios frontend que usen httpsCallable
2. Actualizar CombustiblesContext para usar nuevos servicios
3. Actualizar componentes que importan servicios SQL
4. Verificar que build funciona: npm run build

ENTREGABLES:
- ✅ Frontend usa Functions en lugar de servicios SQL directos
- ✅ Build exitoso sin errores de mssql
- ✅ Contextos actualizados
- ✅ Componentes funcionando
- ✅ Actualizar ROADMAP: TASK-007 completada

¿Necesitas ver la lista específica de Functions disponibles antes de empezar?
```

---

## 👤 AGENTE 4 - QA TESTER

### 🎯 **PROMPT PARA TASK-010: Testing funcional completo**

```
AGENTE 4 - QA TESTER | TASK-010: Testing funcional completo

PREREQUISITOS: TASK-007, TASK-008 deben estar completadas (Frontend integrado)

OBJETIVO: Validar que la migración SQL funciona correctamente end-to-end

ESCENARIOS DE PRUEBA CRÍTICOS:
1. **Flujo de movimientos:**
   - Crear movimiento de entrada
   - Crear movimiento de salida  
   - Verificar actualización de inventario
   - Validar cálculos de stock

2. **Gestión de vehículos:**
   - Crear nuevo vehículo
   - Actualizar datos de vehículo
   - Validar tipos de combustible
   - Testing de horómetro

3. **Gestión de inventario:**
   - Ver inventario por ubicación
   - Actualizar cantidades
   - Validar niveles de stock
   - Testing de alertas

4. **Gestión de proveedores:**
   - CRUD completo de proveedores
   - Validar datos requeridos

MÉTODO DE TESTING:
1. Inicia la app: npm run dev:combustibles
2. Usa la interfaz para probar cada escenario
3. Verifica datos en Firebase Console → Functions logs
4. Compara comportamiento con versión Firestore original

CASOS DE ERROR A PROBAR:
- Conexión SQL fallida
- Datos inválidos
- Operaciones concurrentes
- Timeouts de Functions

ENTREGABLES:
- ✅ Documento con resultados de pruebas
- ✅ Lista de bugs encontrados (si aplica)
- ✅ Comparación de performance vs Firestore
- ✅ Recomendaciones de mejora
- ✅ Actualizar ROADMAP: TASK-010 completada

¿Necesitas acceso a credenciales específicas o instrucciones adicionales para testing?
```

---

## 🔄 PROMPT GENÉRICO PARA ACTUALIZAR ROADMAP

```
ACTUALIZACION DE ROADMAP

Cuando completes cualquier tarea, actualiza el roadmap:

1. Ve a /home/hp/Documents/forestech/ROADMAP_MIGRACION_SQL.md
2. Busca tu tarea (TASK-XXX)
3. Cambia el estado de 🔴 TODO a 🟡 IN PROGRESS a 🟢 DONE
4. Agrega una actualización:

```markdown
#### **TASK-XXX** - ACTUALIZACIÓN
**Fecha:** [fecha actual]
**Agente:** [tu rol]
**Comentario:** [lo que completaste y cualquier nota importante]
**Tiempo real:** [vs estimación]
**Próximo agente:** [si aplica]
```

5. Si encontraste problemas, agrega:
```markdown
#### 🚨 **BLOCKER/ISSUE ENCONTRADO**
**Tarea:** TASK-XXX
**Problema:** [descripción]
**Solución aplicada:** [qué hiciste]
**Impacto:** [otras tareas afectadas]
```

SIEMPRE actualiza el roadmap al completar tu tarea.
```

---

## 📞 PROMPT PARA PEDIR AYUDA

```
SOLICITUD DE AYUDA ENTRE AGENTES

Si necesitas ayuda de otro agente:

"Necesito ayuda del [AGENTE X] para [problema específico].

CONTEXTO:
- Estoy trabajando en TASK-XXX
- El problema es: [descripción detallada]
- Lo que he intentado: [pasos dados]
- Lo que necesito: [ayuda específica]
- Urgencia: [alta/media/baja]

Archivos relevantes: [lista de paths]
Error específico: [si aplica]

¿Puedes ayudarme?"
```

¿Te sirven estos prompts? ¿Necesitas que ajuste alguno o que agregue prompts para tareas específicas adicionales?
