# 🚀 INSTRUCCIONES RÁPIDAS - Migración Lista

## ✅ SETUP COMPLETADO - Solo 3 Pasos

### **PASO 1: Verificar Credenciales** ⏱️ 1 minuto
```bash
# Edita el archivo .env.local con tus datos reales:
nano .env.local

# Asegúrate de que tenga:
VITE_AZURE_SQL_SERVER=oilforestech.database.windows.net
VITE_AZURE_SQL_DATABASE=forestechCombus
VITE_AZURE_SQL_USER=oil
VITE_AZURE_SQL_PASSWORD=271202ev
```

### **PASO 2: Crear Base de Datos** ⏱️ 2 minutos
```bash
# Crear todas las tablas en Azure SQL:
npm run db:create-tables
```

### **PASO 3: Probar Conexión** ⏱️ 1 minuto
```bash
# Verificar que todo funciona:
npm run db:test-connection
```

---

## 🎯 **EMPEZAR A USAR** - Solo cambiar imports

### En tus componentes React:

**❌ ANTES (Firestore):**
```javascript
import { movementsService } from '../services/movementsService.js';
```

**✅ DESPUÉS (SQL) - Solo esta línea:**
```javascript
import sqlMovementsService from '../services/SqlMovementsService.js';
```

**El resto del código queda EXACTAMENTE igual:**
```javascript
// ✅ MISMA INTERFAZ - Sin cambios
const result = await sqlMovementsService.createMovement(data, userInfo);
const movements = await sqlMovementsService.getAllMovements(filters);
```

---

## 📁 **ARCHIVOS CREADOS**

```
combustibles/
├── ✅ MIGRATION_README.md          # Documentación completa
├── ✅ setup-migration.sh           # Script de instalación
├── ✅ sql/create-tables.sql        # Script SQL de tablas
├── ✅ scripts/test-connection.js   # Prueba de conexión
├── ✅ src/config/azureSqlConfig.js # Configuración SQL
├── ✅ src/services/base/           # Capa base SQL
│   ├── SqlConnection.js           # Conexión robusta
│   ├── SqlBaseService.js          # Clase base
│   └── SqlCrudService.js          # CRUD completo
└── ✅ src/services/SqlMovementsService.js # Servicio migrado
```

---

## 🛠️ **COMANDOS ÚTILES**

```bash
# Ver estado de conexión
npm run db:test-connection

# Recrear tablas si es necesario
npm run db:create-tables

# Ver documentación completa
cat MIGRATION_README.md
```

---

## 🎉 **¡LISTO PARA USAR!**

**Tiempo total de migración: ~5 minutos**

- ✅ Dependencias instaladas
- ✅ Base de datos diseñada
- ✅ Servicios compatibles
- ✅ Documentación completa

**El cambio será completamente transparente para tus usuarios** 🚀