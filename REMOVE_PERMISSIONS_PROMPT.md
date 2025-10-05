# 🤖 Prompt para Agente de IA: Eliminar Sistema de Roles y Permisos

## 📋 Contexto del Proyecto

Estás trabajando en el monorepo **Forestech**, específicamente en la aplicación **combustibles** (React + Firebase). La app está en fase de preview y necesitamos eliminar completamente el sistema de roles y permisos para que todos los usuarios tengan acceso completo a todas las funcionalidades.

## 🎯 Objetivo Principal

**Eliminar todas las verificaciones de roles y permisos en la aplicación combustibles**, haciendo que todos los botones, acciones y funcionalidades sean visibles y utilizables por cualquier usuario.

## 📁 Estructura del Proyecto

```
combustibles/
├── src/
│   ├── components/
│   │   ├── Products/ProductsMain.jsx
│   │   ├── Vehicles/VehiclesMain.jsx
│   │   ├── Movements/MovementsMain.jsx, MovementsTable.jsx, MovementsCards.jsx
│   │   ├── Maintenance/MaintenanceTable.jsx, MaintenanceCards.jsx
│   │   ├── Dashboard/
│   │   ├── Suppliers/SupplierModal.jsx
│   │   └── ... (otros componentes)
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── CombustiblesContext.jsx
│   ├── stores/ (Zustand)
│   └── constants/permissions.js
```

## 🔍 Patrones a Buscar y Eliminar

### 1. Variables de Permisos
Busca y elimina estas verificaciones:

```javascript
// ❌ ELIMINAR estos patrones:
const canManageProducts = ['admin', 'supervisor'].includes(userProfile?.role);
const canEdit = userProfile?.combustiblesPermissions?.canEdit;
const canDelete = user?.role === 'admin';
const canApprove = ['admin', 'supervisor'].includes(role);
const isReadOnly = !canEdit;

// ✅ REEMPLAZAR por:
// Simplemente eliminar estas variables y usar los componentes directamente
```

### 2. Renderizado Condicional de Botones
```javascript
// ❌ ELIMINAR condiciones:
{canManageProducts && (
  <button onClick={handleCreate}>Crear</button>
)}

// ✅ REEMPLAZAR por:
<button onClick={handleCreate}>Crear</button>
```

### 3. Propiedades Disabled en Inputs
```javascript
// ❌ ELIMINAR:
disabled={isReadOnly || !canEdit}
disabled={mode === 'view' || !userPermissions?.canEdit}

// ✅ REEMPLAZAR por:
disabled={mode === 'view'}
// O eliminar completamente si no hay modo vista
```

### 4. Operadores Ternarios de Permisos
```javascript
// ❌ ELIMINAR:
userRole === 'admin' ? <AdminButton /> : null

// ✅ REEMPLAZAR por:
<AdminButton />
```

## 📝 Archivos Prioritarios a Modificar

### Alta Prioridad (contienen verificaciones críticas):

1. **combustibles/src/components/Products/ProductsMain.jsx**
   - Eliminar `canManageProducts`
   - Hacer visible botón "➕ Nuevo producto"
   - Hacer visibles botones de editar/eliminar en cards

2. **combustibles/src/components/Vehicles/VehiclesMain.jsx**
   - Eliminar todas las variables `canManage*`
   - Hacer visibles todos los botones de acción

3. **combustibles/src/components/Movements/MovementsMain.jsx**
   - Eliminar verificaciones de permisos para crear/editar movimientos

4. **combustibles/src/components/Movements/MovementsTable.jsx**
   - Eliminar condiciones en botones de acción

5. **combustibles/src/components/Movements/MovementsCards.jsx**
   - Igual que MovementsTable

6. **combustibles/src/components/Maintenance/MaintenanceTable.jsx**
   - Eliminar verificaciones de permisos

7. **combustibles/src/components/Maintenance/MaintenanceCards.jsx**
   - Eliminar verificaciones de permisos

8. **combustibles/src/components/Suppliers/SupplierModal.jsx**
   - Eliminar `disabled` basados en permisos

9. **combustibles/src/components/Vehicles/VehicleModal.jsx**
   - Eliminar `disabled` basados en permisos

10. **combustibles/src/components/Products/ProductModal.jsx**
    - Eliminar `disabled` basados en permisos

### Media Prioridad (contexts y stores):

11. **combustibles/src/contexts/AuthContext.jsx**
    - Eliminar verificaciones de `isAdmin`, `canApprove`

12. **combustibles/src/contexts/CombustiblesContext.jsx**
    - Eliminar lógica relacionada con permisos

13. **combustibles/src/stores/** (si hay verificaciones)
    - Revisar stores de Zustand

### Baja Prioridad (limpiar después):

14. **combustibles/src/constants/permissions.js**
    - Eliminar o vaciar este archivo

15. **Cualquier otro archivo** con referencias a:
    - `userProfile?.role`
    - `combustiblesPermissions`
    - `canManage*`
    - `canEdit*`
    - `canDelete*`
    - `canApprove*`
    - `isAdmin`
    - `['admin', 'supervisor']`

## 🛠️ Comandos para Buscar Referencias

Usa estos comandos para encontrar todas las ocurrencias:

```bash
# Buscar variables de permisos
grep -r "canManage" combustibles/src/
grep -r "canEdit" combustibles/src/
grep -r "canDelete" combustibles/src/
grep -r "canApprove" combustibles/src/
grep -r "isAdmin" combustibles/src/

# Buscar verificaciones de roles
grep -r "userProfile?.role" combustibles/src/
grep -r "user?.role" combustibles/src/
grep -r "\['admin'" combustibles/src/
grep -r "combustiblesPermissions" combustibles/src/

# Buscar disabled condicionales
grep -r "disabled={.*&&" combustibles/src/
grep -r "disabled={.*canEdit" combustibles/src/
```

## ✅ Criterios de Éxito

Al finalizar, la aplicación debe:

1. ✅ Mostrar TODOS los botones de acción (crear, editar, eliminar) sin condiciones
2. ✅ No tener inputs deshabilitados por falta de permisos (solo por modo vista si aplica)
3. ✅ No tener renderizado condicional basado en roles
4. ✅ No tener verificaciones del tipo `if (user.role === 'admin')`
5. ✅ Compilar sin errores: `npm run build:combustibles`
6. ✅ Ejecutarse correctamente: `npm run dev:combustibles`

## 🚨 Advertencias Importantes

1. **NO eliminar** verificaciones de `mode === 'view'` - estas son legítimas para modos de solo lectura
2. **NO eliminar** verificaciones de `isLoading` - estas son para UX
3. **NO eliminar** validaciones de datos - solo permisos de usuario
4. **MANTENER** la estructura de los componentes, solo quitar las condiciones de permisos
5. **PROBAR** después de cada cambio grande para asegurar que no se rompió nada

## 🔧 Ejemplo Completo de Transformación

### ANTES:
```javascript
const ProductsMain = () => {
  const userProfile = useAuthStore(state => state.userProfile);
  const canManageProducts = ['admin', 'supervisor', 'manager', 'operator'].includes(
    userProfile?.role
  );

  const headerActions = useMemo(() => {
    if (!canManageProducts) {
      return null;
    }

    return (
      <div className="apple-content-actions">
        <button onClick={handleCreateProduct}>
          ➕ Nuevo producto
        </button>
      </div>
    );
  }, [canManageProducts, handleCreateProduct]);

  return (
    <>
      {/* ... */}
      {canManageProducts && (
        <button onClick={handleEdit}>✏️</button>
      )}
      {canManageProducts && (
        <button onClick={handleDelete}>🗑️</button>
      )}
    </>
  );
};
```

### DESPUÉS:
```javascript
const ProductsMain = () => {
  // userProfile puede quedarse si se usa para otras cosas (nombre, etc.)
  const userProfile = useAuthStore(state => state.userProfile);

  // ❌ ELIMINADO: const canManageProducts = ...

  const headerActions = useMemo(() => {
    // ❌ ELIMINADO: if (!canManageProducts) return null;

    return (
      <div className="apple-content-actions">
        <button onClick={handleCreateProduct}>
          ➕ Nuevo producto
        </button>
      </div>
    );
  }, [handleCreateProduct]); // ❌ ELIMINADO: canManageProducts de dependencias

  return (
    <>
      {/* ... */}
      {/* ❌ ELIMINADO: {canManageProducts && ( */}
      <button onClick={handleEdit}>✏️</button>
      {/* ❌ ELIMINADO: )} */}
      
      {/* ❌ ELIMINADO: {canManageProducts && ( */}
      <button onClick={handleDelete}>🗑️</button>
      {/* ❌ ELIMINADO: )} */}
    </>
  );
};
```

## 📊 Plan de Ejecución Sugerido

### Fase 1: Componentes Principales (30 min)
- [ ] ProductsMain.jsx
- [ ] VehiclesMain.jsx
- [ ] MovementsMain.jsx

### Fase 2: Tablas y Cards (20 min)
- [ ] MovementsTable.jsx
- [ ] MovementsCards.jsx
- [ ] MaintenanceTable.jsx
- [ ] MaintenanceCards.jsx

### Fase 3: Modales (15 min)
- [ ] SupplierModal.jsx
- [ ] VehicleModal.jsx
- [ ] ProductModal.jsx

### Fase 4: Contexts (10 min)
- [ ] AuthContext.jsx
- [ ] CombustiblesContext.jsx

### Fase 5: Limpieza Final (10 min)
- [ ] Eliminar archivos de permisos no usados
- [ ] Buscar referencias restantes
- [ ] Probar compilación

### Fase 6: Pruebas (15 min)
- [ ] `npm run build:combustibles`
- [ ] `npm run dev:combustibles`
- [ ] Verificar UI manualmente

## 🎬 Comandos Finales de Verificación

```bash
# Compilar para verificar que no hay errores
npm run build:combustibles

# Ejecutar en desarrollo
npm run dev:combustibles

# Buscar referencias restantes (debería retornar 0 o muy pocas)
grep -r "canManage\|canEdit\|canDelete\|canApprove" combustibles/src/ | wc -l
```

## 📌 Notas Adicionales

- **Idioma**: Todo el código debe mantener comentarios en español
- **Estilo**: Seguir las convenciones del proyecto (ver AGENTS.md)
- **Git**: Hacer commits granulares si es posible
- **Testing**: Si hay tests relacionados con permisos, eliminarlos también

---

## 🚀 ¡Comienza Aquí!

**Paso 1**: Ejecuta los comandos grep para ver cuántas referencias hay
**Paso 2**: Empieza por ProductsMain.jsx (el más crítico)
**Paso 3**: Continúa con la lista de prioridad
**Paso 4**: Prueba después de cada archivo importante
**Paso 5**: Verifica compilación al final

¡Buena suerte! 🎯
