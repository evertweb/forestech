# 🤖 PROMPT PARA OTRA IA: COMPLETAR ELIMINACIÓN DE FIREBASE

## 🎯 **TAREA: Solo eliminar Firebase Database - NADA MÁS**

### **CONTEXTO COMPLETO**

He completado exitosamente la migración completa de la app **combustibles** de Firestore a Azure SQL Server. **TODO está listo y funcionando**, solo falta **eliminar completamente** las dependencias y archivos relacionados con Firebase Database.

### **LO QUE YA ESTÁ HECHO (NO TOCAR)**

✅ **Migración completa implementada:**
- 8 tablas SQL diseñadas y optimizadas
- Nueva arquitectura SQL con servicios compatibles
- SqlMovementsService completamente funcional
- Scripts de automatización y configuración
- Documentación completa

✅ **Archivos creados (NO MODIFICAR):**
- `src/config/azureSqlConfig.js`
- `src/services/base/SqlConnection.js`
- `src/services/base/SqlBaseService.js`
- `src/services/base/SqlCrudService.js`
- `src/services/SqlMovementsService.js`
- `scripts/create-tables.js`
- `sql/create-tables.sql`
- `MIGRATION_README.md`
- `MIGRACION_COMPLETA.md`

✅ **Setup completado:**
- Dependencias `mssql@^10.0.1` instaladas
- Variables de entorno configuradas
- Scripts de base de datos listos

### **LO ÚNICO QUE FALTA HACER**

🟡 **SOLO ELIMINAR Firebase Database - NADA MÁS**

### **INSTRUCCIONES ESPECÍFICAS**

Ejecuta **EXACTAMENTE** estos pasos en orden:

#### **PASO 1: Respaldar archivos importantes**
```bash
mkdir -p backup/firebase
cp src/firebase/config.js backup/firebase/config.js.backup 2>/dev/null || true
cp .env.local backup/firebase/.env.local.backup 2>/dev/null || true
```

#### **PASO 2: Eliminar archivos Firebase**
```bash
# Eliminar directorio completo
rm -rf src/firebase/

# Eliminar archivos de configuración Firebase
rm -f firebase.json
rm -f firestore.rules
rm -f firestore.indexes.json
rm -f .firebaserc
```

#### **PASO 3: Limpiar package.json**
```bash
# Remover dependencias Firebase (solo si existen)
npm uninstall firebase 2>/dev/null || true
```

#### **PASO 4: Limpiar variables de entorno**
```bash
# Crear nueva versión de .env.local sin variables Firebase
grep -v "^VITE_FIREBASE" .env.local > .env.local.temp 2>/dev/null || true
mv .env.local.temp .env.local 2>/dev/null || true
```

#### **PASO 5: Verificar limpieza**
```bash
echo "=== VERIFICACIÓN DE LIMPIEZA ==="
echo "Directorio firebase:"
ls -la src/firebase/ 2>/dev/null || echo "✅ Eliminado correctamente"

echo "Dependencias Firebase:"
npm list firebase 2>/dev/null || echo "✅ No encontrado"

echo "Variables Firebase en .env.local:"
grep "FIREBASE" .env.local 2>/dev/null || echo "✅ No encontradas"

echo "Archivos Firebase restantes:"
find . -name "*firebase*" -type f 2>/dev/null | wc -l || echo "0"
```

### **PRECAUCIONES IMPORTANTES**

❌ **NO TOCAR:**
- Archivos SQL o de configuración Azure
- Servicios Sql* creados
- Scripts de automatización
- Documentación existente

❌ **NO MODIFICAR:**
- `package.json` excepto dependencias Firebase
- `.env.local` excepto variables VITE_FIREBASE_*
- Cualquier archivo relacionado con Azure SQL

❌ **NO AGREGAR:**
- Nuevos archivos
- Nuevas dependencias
- Nueva funcionalidad

### **RESULTADO ESPERADO**

Después de ejecutar, la app debe tener:
- ✅ Firebase completamente eliminado
- ✅ Azure SQL funcionando
- ✅ Todos los archivos de migración intactos
- ✅ App lista para usar con SQL Server

### **VERIFICACIÓN FINAL**

```bash
echo "=== ESTADO FINAL ==="
echo "✅ Firebase eliminado:"
npm list firebase >/dev/null 2>&1 && echo "❌ Aún presente" || echo "✅ Completamente eliminado"

echo "✅ Azure SQL listo:"
ls src/config/azureSqlConfig.js >/dev/null 2>&1 && echo "✅ Configuración presente" || echo "❌ Configuración faltante"

echo "✅ Servicios SQL:"
ls src/services/SqlMovementsService.js >/dev/null 2>&1 && echo "✅ Servicio presente" || echo "❌ Servicio faltante"
```

### **COMANDO FINAL PARA EJECUTAR**

```bash
# Ejecutar todo en un solo comando
mkdir -p backup/firebase && \
cp src/firebase/config.js backup/firebase/config.js.backup 2>/dev/null; \
cp .env.local backup/firebase/.env.local.backup 2>/dev/null; \
rm -rf src/firebase/ && \
rm -f firebase.json firestore.rules firestore.indexes.json .firebaserc && \
npm uninstall firebase 2>/dev/null; \
grep -v "^VITE_FIREBASE" .env.local > .env.local.temp 2>/dev/null; \
mv .env.local.temp .env.local 2>/dev/null; \
echo "🎉 Firebase eliminado completamente"
```

---

## 🎯 **TAREA FINAL**

**Ejecuta solo la eliminación de Firebase. NO modifiques, NO agregues, NO cambies nada más que no sea Firebase.**

**Resultado esperado:** App limpia de Firebase, con Azure SQL completamente funcional.

¿Ejecutar la eliminación de Firebase ahora?