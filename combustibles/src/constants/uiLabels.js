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
  CLEAR: 'Limpiar',

  // Acciones específicas de modales
  CREATE_VEHICLE: '➕ Crear Vehículo',
  SAVE_CHANGES: '💾 Guardar Cambios'
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
  BASIC_INFO: 'Información Básica',
  TECHNICAL_SPECS: 'Especificaciones Técnicas',
  FUEL_INFO: 'Información de Combustible',
  HOUR_METER_SYSTEM: 'Sistema de Horómetro',
  HOUR_METER_INFO: 'Información del Horómetro',
  IMPORTANT_DATES: 'Fechas Importantes',
  DESCRIPTION_AND_NOTES: 'Descripción y Notas',

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
  VEHICLE_ID: 'ID del Vehículo',
  VEHICLE_NAME: 'Nombre del Vehículo',
  PLATE_NUMBER: 'Número de Placa',
  PLATE_CODE: 'Placa/Código',
  VEHICLE_TYPE: 'Tipo de Vehículo',
  VEHICLE_CATEGORY: 'Categoría del Vehículo',
  BRAND: 'Marca',
  MODEL: 'Modelo',
  YEAR: 'Año',
  FUEL_TYPE: 'Tipo de Combustible',
  TANK_CAPACITY: 'Capacidad del Tanque (Galones)',
  ENGINE_POWER: 'Potencia del Motor (HP)',
  SERIAL_NUMBER: 'Número de Serie',
  CURRENT_LOCATION: 'Ubicación Actual',
  HAS_HOUR_METER: 'Tiene Sistema de Horómetro',
  CURRENT_HOURS: 'Lectura Actual del Horómetro (horas)',
  ESTIMATED_CONSUMPTION: 'Consumo Estimado (gal/hr)',
  PURCHASE_DATE: 'Fecha de Compra',
  WARRANTY_EXPIRATION: 'Vencimiento de Garantía',
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
  INTERNAL_NAME: 'Nombre Interno',
  DISPLAY_NAME: 'Nombre de Visualización',
  UNIT_OF_MEASUREMENT: 'Unidad de Medida',
  DEFAULT_PRICE: 'Precio por Defecto',
  IS_ACTIVE: 'Producto Activo',
  CURRENT_STOCK: 'Stock Actual',
  MIN_THRESHOLD: 'Umbral Mínimo',
  MAX_CAPACITY: 'Capacidad Máxima',
  APPEARANCE: 'Apariencia',
  ICON: 'Icono',
  COLOR: 'Color',

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
  NEXT_CHANGE_HOURS: 'Próximo Cambio (horas)',
  FILTERS_EXTRAS: 'Filtros o Extras',
  BATTERY_TYPE: 'Tipo de Batería',
  BATTERY_STATUS: 'Estado de la Batería',
  COST: 'Costo',
  NOTES: 'Notas Adicionales',

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
    PERMISSION_DENIED: 'Sin permisos suficientes',
    // Errores de validación de vehículos
    VEHICLE_ID_REQUIRED: 'El ID del vehículo es obligatorio',
    VEHICLE_ID_MIN_LENGTH: 'El ID debe tener al menos 3 caracteres',
    VEHICLE_NAME_REQUIRED: 'El nombre del vehículo es obligatorio',
    VEHICLE_NAME_MIN_LENGTH: 'El nombre debe tener al menos 2 caracteres',
    FUEL_CAPACITY_POSITIVE: 'La capacidad de combustible debe ser mayor a 0',
    FUEL_CAPACITY_MAX: 'La capacidad no puede ser mayor a 1000 galones',
    ENGINE_POWER_POSITIVE: 'La potencia no puede ser negativa',
    ENGINE_POWER_MAX: 'La potencia no puede ser mayor a 1000 HP',
    CONSUMPTION_POSITIVE: 'El consumo no puede ser negativo',
    CONSUMPTION_MAX: 'El consumo no puede ser mayor a 50 gal/hr',
    NEXT_MAINTENANCE_DATE_INVALID: 'La próxima fecha debe ser posterior al último mantenimiento',
    PURCHASE_DATE_FUTURE: 'La fecha de compra no puede ser futura',

    // Errores de validación de mantenimiento
    MAINTENANCE_TYPE_REQUIRED: 'El tipo de mantenimiento es obligatorio',
    VEHICLE_REQUIRED: 'El vehículo es obligatorio',
    DATE_REQUIRED: 'La fecha es obligatoria',
    OIL_QUANTITY_REQUIRED: 'La cantidad de aceite es obligatoria y debe ser mayor a 0',
    HOUR_METER_REQUIRED: 'La lectura del horómetro es obligatoria',
    BATTERY_TYPE_REQUIRED: 'El tipo de batería es obligatorio',
    BATTERY_COST_REQUIRED: 'El costo de la batería es obligatorio',

    // Errores de validación de productos
    NAME_REQUIRED: 'El nombre es requerido',
    DISPLAY_NAME_REQUIRED: 'El nombre de visualización es requerido',
    CATEGORY_REQUIRED: 'La categoría es requerida',
    UNIT_REQUIRED: 'La unidad es requerida',
    PRICE_POSITIVE: 'El precio debe ser mayor o igual a 0',
    STOCK_POSITIVE: 'El stock debe ser mayor o igual a 0',
    MIN_THRESHOLD_POSITIVE: 'El umbral mínimo debe ser mayor o igual a 0',
    MAX_CAPACITY_POSITIVE: 'La capacidad máxima debe ser mayor a 0',
    MIN_THRESHOLD_LESS_THAN_MAX: 'El umbral mínimo debe ser menor que la capacidad máxima',

    // Errores de validación de VehicleFormSmart
    NAME_MIN_LENGTH: 'Mínimo 2 caracteres',
    CATEGORY_REQUIRED_VEHICLE: 'Selecciona una categoría',
    PLATE_CODE_REQUIRED: 'La placa/código es obligatorio',
    FUEL_TYPE_REQUIRED: 'Selecciona el tipo de combustible'
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
  VEHICLE_ID: 'Ej: EXC-001',
  VEHICLE_NAME: 'Ej: Excavadora Principal',
  BRAND: 'Ej: Caterpillar',
  MODEL: 'Ej: 320D',
  SERIAL_NUMBER: 'Ej: ABC123456789',
  PLATE_NUMBER: 'Ej: ABC123',
  CURRENT_LOCATION: 'Ej: Sector Norte - Lote 15',
  CUSTOM_TYPE: 'Ej: Montacargas, Grúa Torre, etc.',
  VEHICLE_DESCRIPTION: 'Información adicional sobre el vehículo...',
  CURRENT_HOURS: 'Ej: 1250.5',
  PLATE_CODE: 'ABC123',
  SELECT_FUEL: 'Selecciona combustible',
  SPECIAL_NOTES: 'Observaciones, mantenimiento especial, etc...',

  // Placeholders específicos para mantenimiento
  FILTERS_EXTRAS: 'Especificar filtros cambiados o extras...',
  BATTERY_TYPE: 'Ej: 12V 60Ah',
  BATTERY_BRAND: 'Ej: Bosch, Exide',
  BATTERY_MODEL: 'Ej: S4 005',
  COST: '0',
  ADDITIONAL_NOTES: 'Observaciones adicionales...',

  // Placeholders específicos para productos
  INTERNAL_NAME: 'Ej: ACPM, GASOLINA',
  DISPLAY_NAME: 'Ej: ACPM 🚛, Gasolina 🚗',
  PRODUCT_DESCRIPTION: 'Descripción del producto...',

  // Placeholders específicos para VehicleFormSmart
  VEHICLE_NAME_SAP: 'Ingrese el nombre del vehículo',
  PLATE_CODE_SAP: 'ABC123',
  TANK_CAPACITY_SAP: '0.0'
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
  ADD_CUSTOM_TYPE: 'Agregar tipo personalizado',
  CONFIRM_CUSTOM_TYPE: 'Confirmar tipo personalizado',

  PREFERRED_SUPPLIER: 'Proveedor Preferido',
  MAINTENANCE_DUE: 'Mantenimiento próximo',
  LOW_STOCK_WARNING: 'Stock bajo',
  CRITICAL_ALERT: 'Alerta crítica',

  REQUIRED_FIELD: 'Campo obligatorio',
  OPTIONAL_FIELD: 'Campo opcional',
  FORMAT_HINT: 'Formato requerido'
};

// ===================================================================
// TEXTOS ESPECIALIZADOS PARA MODALES
// ===================================================================
export const MODAL_TEXT = {
  VEHICLE: {
    CREATE_TITLE: 'Crear Nuevo Vehículo',
    EDIT_TITLE: 'Editar Vehículo',
    VIEW_TITLE: 'Detalles del Vehículo',
    CREATE_SUBTITLE: 'Registra un nuevo vehículo en la flota',
    EDIT_SUBTITLE: 'Modifica la información del vehículo',
    VIEW_SUBTITLE: 'Información completa del vehículo'
  },
  MAINTENANCE: {
    CREATE_TITLE: 'Crear Mantenimiento',
    EDIT_TITLE: 'Editar Mantenimiento',
    VIEW_TITLE: 'Ver Mantenimiento',
    OIL_CHANGE_INFO: 'Información del Cambio de Aceite',
    BATTERY_CHANGE_INFO: 'Información del Cambio de Batería'
  },
  PRODUCT: {
    CREATE_TITLE: 'Crear Producto',
    EDIT_TITLE: 'Editar Producto',
    VIEW_TITLE: 'Ver Producto'
  },
  VEHICLE_FORM: {
    CREATE_TITLE: 'Crear Nuevo Vehículo',
    EDIT_TITLE: 'Editar Vehículo',
    BASIC_INFO: 'Información Básica',
    OPERATIONAL_DETAILS: 'Detalles Operativos',
    ADDITIONAL_INFO: 'Información Adicional',
    ADD_INFO: '+ Agregar información adicional',
    HIDE_INFO: '- Ocultar información adicional'
  }
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