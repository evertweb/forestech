/**
 * UI Labels y textos de interfaz centralizados para la app combustibles
 * Centralizar todos los textos facilita mantenimiento, localización y consistencia
 */

// ===================================================================
// ACCIONES COMUNES DE INTERFAZ
// ===================================================================
export const UI_ACTIONS = {
  // Acciones principales
  ADD: 'Agregar',
  EDIT: 'Editar', 
  DELETE: 'Eliminar',
  SAVE: 'Guardar',
  CANCEL: 'Cancelar',
  CONFIRM: 'Confirmar',
  ACCEPT: 'Aceptar',
  REJECT: 'Rechazar',
  
  // Navegación
  BACK: 'Volver',
  NEXT: 'Siguiente',
  PREVIOUS: 'Anterior',
  CLOSE: 'Cerrar',
  HIDE: 'Ocultar',
  SHOW: 'Mostrar',
  
  // Búsqueda y filtros
  SEARCH: 'Buscar',
  FILTER: 'Filtrar', 
  EXPORT: 'Exportar',
  IMPORT: 'Importar',
  RESET: 'Restablecer',
  
  // Estados de formulario
  CREATE: 'Crear',
  UPDATE: 'Actualizar',
  SUBMIT: 'Enviar',
  CLEAR: 'Limpiar'
};

// ===================================================================
// TÍTULOS DE MÓDULOS Y SECCIONES
// ===================================================================
export const UI_TITLES = {
  // Módulos principales
  DASHBOARD: 'Panel de Control',
  DASHBOARD_MAIN: 'Dashboard Principal',
  
  // Gestión
  VEHICLES_MANAGEMENT: 'Gestión de Vehículos',
  INVENTORY_MANAGEMENT: 'Gestión de Inventario', 
  MOVEMENTS_MANAGEMENT: 'Gestión de Movimientos',
  SUPPLIERS_MANAGEMENT: 'Gestión de Proveedores',
  MAINTENANCE_MANAGEMENT: 'Gestión de Mantenimiento',
  PRODUCTS_MANAGEMENT: 'Gestión de Productos',
  REPORTS_MANAGEMENT: 'Gestión de Reportes',
  ADMIN_MANAGEMENT: 'Administración del Sistema',
  
  // Secciones específicas
  VEHICLES: 'Vehículos',
  INVENTORY: 'Inventario',
  MOVEMENTS: 'Movimientos', 
  SUPPLIERS: 'Proveedores',
  MAINTENANCE: 'Mantenimiento',
  PRODUCTS: 'Productos',
  REPORTS: 'Reportes',
  ADMIN: 'Administración',
  
  // Categorías y configuración
  VEHICLE_CATEGORIES: 'Categorías de Vehículos',
  PRODUCT_CATEGORIES: 'Categorías de Productos',
  USER_MANAGEMENT: 'Gestión de Usuarios',
  SETTINGS: 'Configuración'
};

// ===================================================================
// ESTADOS Y ETIQUETAS DE STATUS
// ===================================================================
export const UI_STATUS = {
  // Estados generales
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  ENABLED: 'Habilitado',
  DISABLED: 'Deshabilitado',
  
  // Estados específicos de negocio
  PREFERRED_SUPPLIER: 'Proveedor Preferido',
  OPERATIONAL: 'Operativo',
  IN_MAINTENANCE: 'En Mantenimiento',
  OUT_OF_SERVICE: 'Fuera de Servicio',
  
  // Estados de stock
  IN_STOCK: 'En Stock',
  LOW_STOCK: 'Stock Bajo',
  OUT_OF_STOCK: 'Sin Stock',
  CRITICAL_STOCK: 'Stock Crítico',
  
  // Estados de movimientos
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
  IN_PROGRESS: 'En Progreso'
};

// ===================================================================
// ETIQUETAS DE FORMULARIOS Y CAMPOS
// ===================================================================
export const UI_FORM_LABELS = {
  // Campos básicos
  NAME: 'Nombre',
  DESCRIPTION: 'Descripción', 
  TYPE: 'Tipo',
  CATEGORY: 'Categoría',
  STATUS: 'Estado',
  DATE: 'Fecha',
  TIME: 'Hora',
  
  // Campos específicos de vehículos
  VEHICLE: 'Vehículo',
  VEHICLE_NAME: 'Nombre del Vehículo',
  PLATE_NUMBER: 'Número de Placa',
  PLATE_CODE: 'Placa/Código',
  VEHICLE_TYPE: 'Tipo de Vehículo',
  BRAND: 'Marca',
  MODEL: 'Modelo',
  YEAR: 'Año',
  FUEL_TYPE: 'Tipo de Combustible',
  TANK_CAPACITY: 'Capacidad del Tanque (Galones)',
  HAS_HOROMETER: 'Este vehículo tiene horómetro',
  OPERATIONAL_DETAILS: 'Detalles Operativos',
  ADDITIONAL_INFO: 'Información Adicional',
  SPECIAL_NOTES: 'Notas Especiales',
  
  // Campos de inventario y productos
  QUANTITY: 'Cantidad',
  UNIT: 'Unidad',
  PRICE: 'Precio',
  TOTAL: 'Total',
  STOCK: 'Stock',
  MINIMUM_STOCK: 'Stock Mínimo',
  
  // Campos de movimientos
  MOVEMENT_TYPE: 'Tipo de Movimiento',
  ORIGIN: 'Origen',
  DESTINATION: 'Destino',
  LOCATION: 'Ubicación',
  
  // Campos de proveedor
  SUPPLIER: 'Proveedor',
  CONTACT: 'Contacto',
  PHONE: 'Teléfono',
  EMAIL: 'Correo Electrónico',
  ADDRESS: 'Dirección',
  
  // Campos de mantenimiento
  MAINTENANCE_TYPE: 'Tipo de Mantenimiento',
  NEXT_MAINTENANCE: 'Próximo Mantenimiento',
  LAST_MAINTENANCE: 'Último Mantenimiento',
  HOROMETER: 'Horómetro',
  
  // Campos de autenticación
  USERNAME: 'Usuario',
  PASSWORD: 'Contraseña',
  INVITATION_CODE: 'Código de Invitación'
};

// ===================================================================
// MENSAJES DEL SISTEMA
// ===================================================================
export const UI_MESSAGES = {
  // Mensajes de éxito
  SUCCESS: {
    SAVED: 'Guardado exitosamente',
    CREATED: 'Creado exitosamente', 
    UPDATED: 'Actualizado exitosamente',
    DELETED: 'Eliminado exitosamente',
    EXPORTED: 'Exportado exitosamente'
  },
  
  // Mensajes de error
  ERROR: {
    GENERAL: 'Ha ocurrido un error',
    SAVE_FAILED: 'Error al guardar',
    LOAD_FAILED: 'Error al cargar datos',
    NETWORK_ERROR: 'Error de conexión',
    PERMISSION_DENIED: 'Sin permisos suficientes'
  },
  
  // Mensajes de confirmación
  CONFIRM: {
    DELETE: '¿Está seguro de que desea eliminar este elemento?',
    CANCEL: '¿Está seguro de que desea cancelar? Se perderán los cambios.',
    RESET: '¿Está seguro de que desea restablecer todos los filtros?'
  },
  
  // Mensajes informativos
  INFO: {
    NO_DATA: 'No hay datos disponibles',
    LOADING: 'Cargando...',
    EMPTY_RESULTS: 'No se encontraron resultados',
    SELECT_OPTION: 'Seleccione una opción'
  },
  
  // Mensajes de carga específicos
  LOADING: {
    CREATING: 'Creando...',
    UPDATING: 'Actualizando...',
    DELETING: 'Eliminando...',
    SAVING: 'Guardando...',
    CATEGORIES: 'Cargando categorías...'
  }
};

// ===================================================================
// PLACEHOLDERS PARA INPUTS
// ===================================================================
export const UI_PLACEHOLDERS = {
  SEARCH: 'Buscar...',
  SEARCH_VEHICLES: 'Buscar vehículos...',
  SEARCH_PRODUCTS: 'Buscar productos...',
  SEARCH_SUPPLIERS: 'Buscar proveedores...',
  
  ENTER_NAME: 'Ingrese el nombre',
  ENTER_DESCRIPTION: 'Ingrese la descripción',
  ENTER_QUANTITY: 'Ingrese la cantidad',
  ENTER_PRICE: 'Ingrese el precio',
  
  SELECT_TYPE: 'Seleccione el tipo',
  SELECT_CATEGORY: 'Selecciona una categoría',
  SELECT_STATUS: 'Seleccione el estado',
  SELECT_DATE: 'Seleccione la fecha',
  
  PLATE_FORMAT: 'ABC123 o ABC1234',
  EMAIL_FORMAT: 'ejemplo@correo.com',
  PHONE_FORMAT: '+57 300 123 4567',
  
  // Placeholders específicos para vehículos
  VEHICLE_NAME: 'Ej: Tractor Principal',
  PLATE_CODE: 'ABC123',
  SELECT_FUEL: 'Selecciona combustible',
  VEHICLE_DESCRIPTION: 'Características adicionales del vehículo...',
  SPECIAL_NOTES: 'Observaciones, mantenimiento especial, etc...'
};

// ===================================================================
// TÍTULOS DE TOOLTIPS Y AYUDAS
// ===================================================================
export const UI_TOOLTIPS = {
  EDIT: 'Editar este elemento',
  DELETE: 'Eliminar este elemento', 
  VIEW: 'Ver detalles',
  DOWNLOAD: 'Descargar',
  REFRESH: 'Actualizar datos',
  
  PREFERRED_SUPPLIER: 'Proveedor Preferido',
  MAINTENANCE_DUE: 'Mantenimiento próximo',
  LOW_STOCK_WARNING: 'Stock bajo',
  CRITICAL_ALERT: 'Alerta crítica',
  
  REQUIRED_FIELD: 'Campo obligatorio',
  OPTIONAL_FIELD: 'Campo opcional',
  FORMAT_HINT: 'Formato requerido'
};

// ===================================================================
// ETIQUETAS DE PESTAÑAS Y NAVEGACIÓN  
// ===================================================================
export const UI_TABS = {
  VEHICLES: 'Vehículos',
  CATEGORIES: 'Categorías',
  MAINTENANCE: 'Mantenimiento',
  REPORTS: 'Reportes',
  
  INVENTORY: 'Inventario',
  MOVEMENTS: 'Movimientos',
  SUPPLIERS: 'Proveedores',
  PRODUCTS: 'Productos',
  
  GENERAL: 'General',
  TECHNICAL: 'Técnico',
  OPERATIONAL: 'Operacional',
  SUMMARY: 'Resumen'
};

// ===================================================================
// EXPORTACIÓN AGRUPADA
// ===================================================================
export const UI_LABELS = {
  ACTIONS: UI_ACTIONS,
  TITLES: UI_TITLES, 
  STATUS: UI_STATUS,
  FORM_LABELS: UI_FORM_LABELS,
  MESSAGES: UI_MESSAGES,
  PLACEHOLDERS: UI_PLACEHOLDERS,
  TOOLTIPS: UI_TOOLTIPS,
  TABS: UI_TABS
};

export default UI_LABELS;