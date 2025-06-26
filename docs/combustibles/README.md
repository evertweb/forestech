# ⛽ COMBUSTIBLES - Gestión de Stock y Combustibles

## Estado Actual: MÓDULO INVENTARIO COMPLETADO (Enero 2025)

**URL en vivo**: https://forestechdecolombia.com.co/combustibles/
**Estado**: Inventario CRUD completo, Dashboard operativo

## Descripción

Sistema de gestión y control de inventario de combustibles para equipos forestales de Forestech Colombia.

## Comandos de Desarrollo

```bash
cd combustibles
npm run dev         # Servidor desarrollo (puerto 5174)
npm run build       # Build producción
npm run lint        # ESLint
```

## Arquitectura

- **Frontend**: React 19 + Vite
- **Backend**: Firebase compartido con alimentación
- **Charts**: Chart.js + react-chartjs-2
- **Tema**: Verde forestal responsive

## Estado de Implementación

### ✅ Fase 1 - Setup Inicial (COMPLETADO)
- Estructura monorepo configurada
- React App con tema verde forestal
- Firebase multi-app routing
- Deploy automático funcionando

### ✅ Fase 2 - Dashboard Base (COMPLETADO)
- Dashboard operativo con navegación
- Context Firebase compartido
- Layout responsive con sidebar
- Métricas mock implementadas

### ✅ Fase 3 - Módulo Inventario (COMPLETADO)
- **CRUD completo**: createInventoryItem, updateInventoryItem, deleteInventoryItem
- **Real-time**: Suscripción automática con onSnapshot
- **UI profesional**: Cards, tabla, modal, estadísticas
- **Validaciones**: Business logic, duplicados, stock mínimo
- **Permisos**: Integración sistema roles

## Funcionalidades Implementadas

### 🛢️ Inventario CRUD
- **Tipos**: Diésel, Gasolina, ACPM, Lubricantes
- **Gestión**: Crear, editar, eliminar, consultar
- **Alertas**: Stock bajo automático (15% capacidad)
- **Estadísticas**: Valor total, items activos, métricas

### 📊 Dashboard Operativo
- **Navegación**: Sidebar con módulos
- **Métricas**: Resumen general en tiempo real
- **Filtros**: Búsqueda, estado, vista cards/tabla
- **Responsive**: Mobile-first design

## Estructura de Archivos

```
combustibles/
├── src/
│   ├── components/
│   │   ├── Dashboard/          # Dashboard principal ✅
│   │   ├── Inventory/          # Inventario CRUD ✅
│   │   ├── Movements/          # Movimientos (próximo)
│   │   ├── Vehicles/           # Vehículos (próximo)
│   │   ├── Suppliers/          # Proveedores (próximo)
│   │   └── Reports/            # Reportes (próximo)
│   ├── services/
│   │   └── inventoryService.js # CRUD completo ✅
│   ├── contexts/
│   │   └── CombustiblesContext.jsx # Context Firebase ✅
│   └── utils/                  # Calculations (próximo)
```

## Próximos Módulos

### 📊 Movimientos (Próximo)
- Registro entradas/salidas
- Historial movimientos
- Transferencias entre tanques

### 🚜 Vehículos (Próximo)
- Catálogo maquinaria forestal
- Tracking consumo por equipo
- Rendimiento galón/hora

### 📈 Reportes (Próximo)
- Dashboard ejecutivo
- Gráficos consumo Chart.js
- Proyecciones compra

## 📋 **ORDEN LÓGICO DESARROLLO - GUARDADO EN MEMORIA**

### Secuencia Arquitectónica Definida:
**1. 📊 MOVIMIENTOS** - Entradas/salidas combustible (PRÓXIMO)
**2. 🚜 VEHÍCULOS** - Catálogo maquinaria forestal  
**3. 🏪 PROVEEDORES** - Gestión proveedores y compras
**4. 📈 REPORTES** - Dashboard ejecutivo final

### Flujo de Dependencias:
```
INVENTARIO (✅ completo) 
    ↓
MOVIMIENTOS (📊 en desarrollo)
    ↓
VEHÍCULOS (🚜 después)
    ↓  
PROVEEDORES (🏪 después)
    ↓
REPORTES (📈 final)
```

Ver más detalles en:
- [Roadmap](./roadmap.md)
- [Módulos](./modules.md)
- [API](./api.md)