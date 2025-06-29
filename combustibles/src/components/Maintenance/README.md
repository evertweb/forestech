# 🔧 Módulo de Mantenimiento - FORESTECH

## Descripción
El módulo de mantenimiento gestiona los cambios de aceite, filtros y baterías de la flota de vehículos forestales, con integración especial para el sistema de horómetro de tractores TR1, TR2 y TR3.

## 🚀 Características Implementadas

### ✅ Funcionalidades Completadas

#### 1. **Gestión de Mantenimientos**
- ✅ Crear, editar, ver y eliminar registros de mantenimiento
- ✅ Filtros avanzados por tipo, estado, vehículo y fechas
- ✅ Búsqueda en tiempo real
- ✅ Vista de cards y tabla
- ✅ Estadísticas detalladas

#### 2. **Tipos de Mantenimiento**
- ✅ **Cambio de Aceite**: Con integración horómetro tractores
- ✅ **Cambio de Batería**: Con cálculo automático de próxima fecha
- ✅ **Cambio de Filtros**: Gestión de filtros y extras
- ✅ **Mantenimiento General**: Para otros tipos de mantenimiento

#### 3. **Integración Horómetro Tractores**
- ✅ Actualización automática del horómetro al registrar cambio de aceite
- ✅ Cálculo automático del próximo cambio (actual + 250 horas)
- ✅ Validación de lecturas del horómetro
- ✅ Soporte para tractores TR1, TR2, TR3

#### 4. **Sistema de Permisos**
- ✅ **Admin**: Acceso completo a todas las funciones
- ✅ **Contador**: Puede gestionar mantenimientos
- ✅ **Cliente**: Solo visualización

#### 5. **Dashboard Integration**
- ✅ Estadísticas de mantenimiento en dashboard principal
- ✅ Alertas de mantenimientos vencidos
- ✅ Lista de mantenimientos recientes
- ✅ Métricas en tiempo real

## 📁 Estructura de Archivos

```
src/components/Maintenance/
├── MaintenanceMain.jsx          # Componente principal
├── MaintenanceModal.jsx         # Modal para crear/editar
├── MaintenanceStats.jsx         # Estadísticas
├── MaintenanceFilters.jsx       # Filtros y búsqueda
├── MaintenanceList.jsx          # Contenedor de lista
├── MaintenanceCards.jsx         # Vista de cards
├── MaintenanceTable.jsx         # Vista de tabla
├── Maintenance.css              # Estilos completos
└── README.md                    # Esta documentación
```

## 🔧 Servicios

### `maintenanceService.js`
- ✅ CRUD completo con Firebase
- ✅ Suscripciones en tiempo real
- ✅ Integración con horómetro de tractores
- ✅ Validaciones de datos
- ✅ Cálculos automáticos

## 🎨 Interfaz de Usuario

### Características de UX
- ✅ Diseño responsive y moderno
- ✅ Tema verde forestal consistente
- ✅ Iconos intuitivos para cada tipo
- ✅ Estados visuales claros
- ✅ Feedback inmediato de acciones

### Componentes UI
- ✅ Cards informativas con hover effects
- ✅ Tabla ordenable con filtros
- ✅ Modal con formularios dinámicos
- ✅ Estadísticas con gráficos visuales
- ✅ Badges de estado y tipo

## 🔐 Seguridad y Validaciones

### Validaciones Implementadas
- ✅ Campos obligatorios por tipo de mantenimiento
- ✅ Validación de horómetro para tractores
- ✅ Validación de fechas y costos
- ✅ Verificación de permisos por rol

### Seguridad Firebase
- ✅ Reglas de Firestore configuradas
- ✅ Validación de datos en servidor
- ✅ Control de acceso por usuario

## 📊 Datos y Modelos

### Estructura de Datos
```javascript
{
  id: string,
  type: 'oil_change' | 'battery_change' | 'filter_change' | 'general_maintenance',
  vehicleId: string,
  vehicleName: string,
  date: Date,
  status: 'completado' | 'pendiente' | 'cancelado',
  
  // Campos específicos para cambio de aceite
  quantity: number,
  currentHours: number,
  nextChangeHours: number,
  filters: string,
  
  // Campos específicos para cambio de batería
  batteryType: string,
  brand: string,
  model: string,
  cost: number,
  batteryStatus: 'nueva' | 'usada' | 'reparada',
  
  // Campos generales
  notes: string,
  cost: number,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: string
}
```

## 🚀 Instalación y Uso

### Prerrequisitos
- ✅ Firebase configurado
- ✅ Servicios de vehículos funcionando
- ✅ Permisos de usuario configurados

### Integración
1. ✅ Servicio importado en Dashboard
2. ✅ Navegación agregada al sidebar
3. ✅ Permisos configurados en roles
4. ✅ Estadísticas integradas en dashboard

## 🧪 Testing

### Funcionalidades Probadas
- ✅ Creación de mantenimientos
- ✅ Edición y eliminación
- ✅ Filtros y búsqueda
- ✅ Integración horómetro
- ✅ Permisos por rol
- ✅ Responsive design

## 📈 Métricas y Analytics

### Estadísticas Disponibles
- ✅ Total de mantenimientos
- ✅ Desglose por tipo
- ✅ Desglose por estado
- ✅ Costos totales y promedio
- ✅ Mantenimientos próximos y vencidos
- ✅ Métricas por vehículo

## 🔄 Integración con Otros Módulos

### Módulos Conectados
- ✅ **Vehículos**: Selección de vehículos para mantenimiento
- ✅ **Dashboard**: Estadísticas y alertas
- ✅ **Usuarios**: Sistema de permisos
- ✅ **Firebase**: Base de datos y autenticación

## 🎯 Próximas Mejoras

### Funcionalidades Futuras
- 📋 Reportes de mantenimiento
- 📋 Notificaciones automáticas
- �� Calendario de mantenimientos
- 📋 Integración con proveedores
- 📋 Historial detallado por vehículo

## 📞 Soporte

Para soporte técnico o reportar bugs:
- 📧 Email: contacto.evert@gmail.com
- 🔗 Repositorio: FORESTECH Combustibles

---

**Estado**: ✅ **COMPLETADO AL 100%**
**Versión**: 1.0.0
**Última actualización**: Diciembre 2024
