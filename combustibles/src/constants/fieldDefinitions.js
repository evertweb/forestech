/**
 * Definiciones de campos centralizadas para la app combustibles
 * Unifica la configuración de campos de formularios, validaciones y tipos de datos.
 * Cada bloque está documentado para facilitar el mantenimiento y la extensión.
 */

// ===================================================================
// CAMPOS DE PRODUCTOS Y COMBUSTIBLES
// -------------------------------------------------------------------
// Definiciones técnicas de campos de productos y combustibles, incluyendo validaciones y metadatos.
// ===================================================================
export const PRODUCT_FIELD_DEFINITIONS = {
  // Campos técnicos de productos
  OCTANAGE: {
    key: 'octanage',
    label: 'Octanaje',
    icon: '🔥',
    type: 'number',
    placeholder: 'Ej: 87, 91, 95',
    validation: { min: 70, max: 110 },
  },

  DENSITY: {
    key: 'density',
    label: 'Densidad',
    icon: '⚖️',
    type: 'number',
    unit: 'kg/L',
    placeholder: '0.75 - 0.95',
    validation: { min: 0.5, max: 1.2, step: 0.01 },
  },

  VISCOSITY: {
    key: 'viscosity',
    label: 'Viscosidad',
    icon: '🌊',
    type: 'text',
    placeholder: 'Ej: SAE 20W-50',
    validation: { maxLength: 50 },
  },

  TEMPERATURE: {
    key: 'temperature',
    label: 'Temperatura Operación',
    icon: '🌡️',
    type: 'text',
    placeholder: 'Ej: -10°C a 50°C',
    validation: { maxLength: 30 },
  },

  APPLICATION: {
    key: 'application',
    label: 'Aplicación',
    icon: '🔧',
    type: 'text',
    placeholder: 'Ej: Motores diesel, transmisiones',
    validation: { maxLength: 100 },
  },

  SUPPLIER: {
    key: 'supplier',
    label: 'Proveedor',
    icon: '🏪',
    type: 'text',
    placeholder: 'Nombre del proveedor',
    validation: { required: true, maxLength: 100 },
  },

  SPECIFICATION: {
    key: 'specification',
    label: 'Especificación',
    icon: '📋',
    type: 'text',
    placeholder: 'Normas técnicas o estándares',
    validation: { maxLength: 200 },
  },

  COMPATIBILITY: {
    key: 'compatibility',
    label: 'Compatibilidad',
    icon: '🔗',
    type: 'text',
    placeholder: 'Compatible con...',
    validation: { maxLength: 150 },
  },

  CONSISTENCY: {
    key: 'consistency',
    label: 'Consistencia',
    icon: '💧',
    type: 'text',
    placeholder: 'Líquido, gel, sólido',
    validation: { maxLength: 50 },
  },
};

// ===================================================================
// CAMPOS DE VEHÍCULOS
// ===================================================================
export const VEHICLE_FIELD_DEFINITIONS = {
  // Información básica del vehículo
  PLATE_NUMBER: {
    key: 'plateNumber',
    label: 'Número de Placa',
    icon: '🚗',
    type: 'text',
    placeholder: 'ABC123 o ABC1234',
    validation: {
      required: true,
      pattern: '^[A-Z]{3}[0-9]{3,4}$',
      maxLength: 7,
    },
  },

  BRAND: {
    key: 'brand',
    label: 'Marca',
    icon: '🏭',
    type: 'text',
    placeholder: 'Toyota, Ford, Caterpillar...',
    validation: { required: true, maxLength: 50 },
  },

  MODEL: {
    key: 'model',
    label: 'Modelo',
    icon: '🚙',
    type: 'text',
    placeholder: 'Hilux, F-150, 320D...',
    validation: { required: true, maxLength: 50 },
  },

  YEAR: {
    key: 'year',
    label: 'Año',
    icon: '📅',
    type: 'number',
    placeholder: '2020',
    validation: {
      required: true,
      min: 1980,
      max: new Date().getFullYear() + 1,
    },
  },

  VIN: {
    key: 'vin',
    label: 'VIN (Número de Chasis)',
    icon: '🔢',
    type: 'text',
    placeholder: '17 caracteres alfanuméricos',
    validation: {
      minLength: 17,
      maxLength: 17,
      pattern: '^[A-HJ-NPR-Z0-9]{17}$',
    },
  },

  ENGINE_NUMBER: {
    key: 'engineNumber',
    label: 'Número de Motor',
    icon: '⚙️',
    type: 'text',
    placeholder: 'Número del motor',
    validation: { maxLength: 30 },
  },

  // Verificaciones técnicas
  HOROMETER_VERIFICATION: {
    key: 'horometerVerification',
    label: 'Verificación de Horómetro',
    icon: '⏱️',
    type: 'boolean',
    description: 'Indica si el vehículo requiere verificación de horómetro',
  },

  CURRENT_HOROMETER: {
    key: 'currentHorometer',
    label: 'Horómetro Actual',
    icon: '⏲️',
    type: 'number',
    unit: 'horas',
    placeholder: '1250',
    validation: { min: 0, max: 999999 },
  },

  // Identificadores únicos
  UNIQUE_CODE: {
    key: 'uniqueCode',
    label: 'Código Único',
    icon: '🏷️',
    type: 'text',
    placeholder: 'Código interno del sistema',
    validation: { maxLength: 20 },
  },

  INTERNAL_ID: {
    key: 'internalId',
    label: 'ID Interno',
    icon: '🆔',
    type: 'text',
    placeholder: 'Identificador interno de la empresa',
    validation: { maxLength: 15 },
  },
};

// ===================================================================
// CAMPOS DE MOVIMIENTOS
// ===================================================================
export const MOVEMENT_FIELD_DEFINITIONS = {
  // Tipos de movimiento
  MOVEMENT_TYPE: {
    key: 'movementType',
    label: 'Tipo de Movimiento',
    icon: '📋',
    type: 'select',
    options: [
      { value: 'entrada', label: 'Entrada de Combustible', icon: '📥' },
      { value: 'salida', label: 'Salida de Combustible', icon: '📤' },
      { value: 'transferencia', label: 'Transferencia', icon: '🔄' },
    ],
    validation: { required: true },
  },

  // Información de cantidad
  QUANTITY: {
    key: 'quantity',
    label: 'Cantidad',
    icon: '🔢',
    type: 'number',
    placeholder: '100',
    validation: {
      required: true,
      min: 0.01,
      max: 99999,
      step: 0.01,
    },
  },

  UNIT: {
    key: 'unit',
    label: 'Unidad',
    icon: '📏',
    type: 'select',
    options: [
      { value: 'galones', label: 'Galones' },
      { value: 'litros', label: 'Litros' },
      { value: 'kg', label: 'Kilogramos' },
    ],
    validation: { required: true },
  },

  // Ubicaciones
  ORIGIN_LOCATION: {
    key: 'originLocation',
    label: 'Ubicación de Origen',
    icon: '📍',
    type: 'select',
    placeholder: 'Seleccione la ubicación',
    validation: { required: true },
  },

  DESTINATION_LOCATION: {
    key: 'destinationLocation',
    label: 'Ubicación de Destino',
    icon: '🎯',
    type: 'select',
    placeholder: 'Seleccione el destino',
    validation: { required: true },
  },

  // Información temporal
  MOVEMENT_DATE: {
    key: 'movementDate',
    label: 'Fecha del Movimiento',
    icon: '📅',
    type: 'date',
    validation: { required: true },
  },

  MOVEMENT_TIME: {
    key: 'movementTime',
    label: 'Hora del Movimiento',
    icon: '🕐',
    type: 'time',
    validation: { required: false },
  },
};

// ===================================================================
// CAMPOS DE PROVEEDORES
// ===================================================================
export const SUPPLIER_FIELD_DEFINITIONS = {
  // Información básica
  COMPANY_NAME: {
    key: 'companyName',
    label: 'Nombre de la Empresa',
    icon: '🏢',
    type: 'text',
    placeholder: 'Nombre completo de la empresa',
    validation: { required: true, maxLength: 100 },
  },

  NIT: {
    key: 'nit',
    label: 'NIT',
    icon: '🆔',
    type: 'text',
    placeholder: '123456789-0',
    validation: {
      required: true,
      pattern: '^[0-9]{8,10}-[0-9kK]$',
      maxLength: 12,
    },
  },

  // Información de contacto
  CONTACT_NAME: {
    key: 'contactName',
    label: 'Nombre del Contacto',
    icon: '👤',
    type: 'text',
    placeholder: 'Nombre del representante',
    validation: { required: true, maxLength: 80 },
  },

  PHONE: {
    key: 'phone',
    label: 'Teléfono',
    icon: '📞',
    type: 'tel',
    placeholder: '+57 300 123 4567',
    validation: {
      pattern: '^\\+?[0-9\\s\\-\\(\\)]{10,15}$',
      maxLength: 15,
    },
  },

  EMAIL: {
    key: 'email',
    label: 'Correo Electrónico',
    icon: '📧',
    type: 'email',
    placeholder: 'contacto@empresa.com',
    validation: {
      pattern: '^[^@]+@[^@]+\\.[^@]+$',
      maxLength: 100,
    },
  },

  ADDRESS: {
    key: 'address',
    label: 'Dirección',
    icon: '🏠',
    type: 'textarea',
    placeholder: 'Dirección completa',
    validation: { maxLength: 200 },
  },

  // Estado del proveedor
  IS_PREFERRED: {
    key: 'isPreferred',
    label: 'Proveedor Preferido',
    icon: '⭐',
    type: 'boolean',
    description: 'Marca este proveedor como preferido',
  },

  STATUS: {
    key: 'status',
    label: 'Estado',
    icon: '🟢',
    type: 'select',
    options: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' },
      { value: 'suspended', label: 'Suspendido' },
    ],
    validation: { required: true },
  },
};

// ===================================================================
// CAMPOS DE MANTENIMIENTO
// ===================================================================
export const MAINTENANCE_FIELD_DEFINITIONS = {
  // Tipo de mantenimiento
  MAINTENANCE_TYPE: {
    key: 'maintenanceType',
    label: 'Tipo de Mantenimiento',
    icon: '🔧',
    type: 'select',
    options: [
      { value: 'preventivo', label: 'Preventivo' },
      { value: 'correctivo', label: 'Correctivo' },
      { value: 'predictivo', label: 'Predictivo' },
      { value: 'emergencia', label: 'Emergencia' },
    ],
    validation: { required: true },
  },

  // Fechas de mantenimiento
  LAST_MAINTENANCE: {
    key: 'lastMaintenance',
    label: 'Último Mantenimiento',
    icon: '📅',
    type: 'date',
    validation: { required: false },
  },

  NEXT_MAINTENANCE: {
    key: 'nextMaintenance',
    label: 'Próximo Mantenimiento',
    icon: '📆',
    type: 'date',
    validation: { required: false },
  },

  // Información técnica
  ODOMETER_AT_MAINTENANCE: {
    key: 'odometerAtMaintenance',
    label: 'Kilometraje en Mantenimiento',
    icon: '🛣️',
    type: 'number',
    unit: 'km',
    placeholder: '15000',
    validation: { min: 0, max: 9999999 },
  },

  HOROMETER_AT_MAINTENANCE: {
    key: 'horometerAtMaintenance',
    label: 'Horómetro en Mantenimiento',
    icon: '⏱️',
    type: 'number',
    unit: 'horas',
    placeholder: '250',
    validation: { min: 0, max: 999999 },
  },

  // Descripción y observaciones
  DESCRIPTION: {
    key: 'description',
    label: 'Descripción del Mantenimiento',
    icon: '📝',
    type: 'textarea',
    placeholder: 'Describe el trabajo realizado...',
    validation: { maxLength: 500 },
  },

  COST: {
    key: 'cost',
    label: 'Costo',
    icon: '💰',
    type: 'number',
    unit: 'COP',
    placeholder: '150000',
    validation: { min: 0, max: 999999999 },
  },
};

// ===================================================================
// CAMPOS COMUNES Y GENERALES
// ===================================================================
export const COMMON_FIELD_DEFINITIONS = {
  // Campos básicos comunes
  NAME: {
    key: 'name',
    label: 'Nombre',
    icon: '📝',
    type: 'text',
    placeholder: 'Ingrese el nombre',
    validation: { required: true, maxLength: 100 },
  },

  DESCRIPTION: {
    key: 'description',
    label: 'Descripción',
    icon: '📄',
    type: 'textarea',
    placeholder: 'Ingrese una descripción...',
    validation: { maxLength: 250 },
  },

  NOTES: {
    key: 'notes',
    label: 'Observaciones',
    icon: '📋',
    type: 'textarea',
    placeholder: 'Observaciones adicionales...',
    validation: { maxLength: 500 },
  },

  // Campos de fechas comunes
  CREATED_DATE: {
    key: 'createdDate',
    label: 'Fecha de Creación',
    icon: '📅',
    type: 'datetime-local',
    readonly: true,
  },

  UPDATED_DATE: {
    key: 'updatedDate',
    label: 'Última Actualización',
    icon: '🔄',
    type: 'datetime-local',
    readonly: true,
  },

  // Campos de usuario
  CREATED_BY: {
    key: 'createdBy',
    label: 'Creado por',
    icon: '👤',
    type: 'text',
    readonly: true,
  },

  UPDATED_BY: {
    key: 'updatedBy',
    label: 'Actualizado por',
    icon: '👥',
    type: 'text',
    readonly: true,
  },
};

// ===================================================================
// UTILIDADES PARA MANEJO DE CAMPOS
// ===================================================================

/**
 * Obtiene la definición completa de un campo por su clave
 * @param {string} fieldKey - Clave del campo
 * @param {string} category - Categoría del campo (product, vehicle, etc.)
 * @returns {object|null} Definición del campo o null si no existe
 */
export const getFieldDefinition = (fieldKey, category = 'common') => {
  const categories = {
    product: PRODUCT_FIELD_DEFINITIONS,
    vehicle: VEHICLE_FIELD_DEFINITIONS,
    movement: MOVEMENT_FIELD_DEFINITIONS,
    supplier: SUPPLIER_FIELD_DEFINITIONS,
    maintenance: MAINTENANCE_FIELD_DEFINITIONS,
    common: COMMON_FIELD_DEFINITIONS,
  };

  const categoryFields = categories[category];
  if (!categoryFields) return null;

  return Object.values(categoryFields).find((field) => field.key === fieldKey) || null;
};

/**
 * Obtiene todos los campos de una categoría específica
 * @param {string} category - Categoría de campos
 * @returns {array} Array de definiciones de campos
 */
export const getFieldsByCategory = (category) => {
  const categories = {
    product: PRODUCT_FIELD_DEFINITIONS,
    vehicle: VEHICLE_FIELD_DEFINITIONS,
    movement: MOVEMENT_FIELD_DEFINITIONS,
    supplier: SUPPLIER_FIELD_DEFINITIONS,
    maintenance: MAINTENANCE_FIELD_DEFINITIONS,
    common: COMMON_FIELD_DEFINITIONS,
  };

  return Object.values(categories[category] || {});
};

// ===================================================================
// EXPORTACIÓN PRINCIPAL
// ===================================================================
export const FIELD_DEFINITIONS = {
  PRODUCT: PRODUCT_FIELD_DEFINITIONS,
  VEHICLE: VEHICLE_FIELD_DEFINITIONS,
  MOVEMENT: MOVEMENT_FIELD_DEFINITIONS,
  SUPPLIER: SUPPLIER_FIELD_DEFINITIONS,
  MAINTENANCE: MAINTENANCE_FIELD_DEFINITIONS,
  COMMON: COMMON_FIELD_DEFINITIONS,

  // Utilidades
  getFieldDefinition,
  getFieldsByCategory,
};

export default FIELD_DEFINITIONS;
