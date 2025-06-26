/**
 * Estructura de colecciones Firestore para el monorepo Forestech
 * Define la organización de datos para todas las apps
 */

// Base path para todas las colecciones
export const getBasePath = () => `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}`;

// Estructura para ALIMENTACION (existente)
export const ALIMENTACION_COLLECTIONS = {
  USERS: `${getBasePath()}/users`,
  SETTLEMENTS: (userId) => `${getBasePath()}/users/${userId}/settlements`,
  INVITATIONS: `${getBasePath()}/invitations`
};

// Estructura para COMBUSTIBLES (nueva)
export const COMBUSTIBLES_COLLECTIONS = {
  // Inventario de combustibles
  INVENTORY: `${getBasePath()}/combustibles/inventory`,
  
  // Movimientos de combustibles (entradas/salidas)
  MOVEMENTS: `${getBasePath()}/combustibles/movements`,
  
  // Registro de vehículos/maquinaria
  VEHICLES: `${getBasePath()}/combustibles/vehicles`,
  
  // Proveedores de combustibles
  SUPPLIERS: `${getBasePath()}/combustibles/suppliers`,
  
  // Configuraciones específicas de combustibles
  SETTINGS: `${getBasePath()}/combustibles/settings`,
  
  // Reportes generados
  REPORTS: `${getBasePath()}/combustibles/reports`
};

// Estructura de documentos - INVENTARIO
export const INVENTORY_DOCUMENT_STRUCTURE = {
  id: 'string',                    // ID único del tipo de combustible
  fuelType: 'string',             // Tipo de combustible (diesel, gasoline, etc.)
  name: 'string',                 // Nombre legible
  description: 'string',          // Descripción
  currentStock: 'number',         // Stock actual en la unidad base
  maxCapacity: 'number',          // Capacidad máxima del tanque/almacén
  minThreshold: 'number',         // Umbral mínimo para alertas
  unit: 'string',                 // Unidad de medida (galones, litros)
  location: 'string',             // Ubicación física del tanque
  lastUpdated: 'timestamp',       // Última actualización
  updatedBy: 'string',           // UID del usuario que actualizó
  pricePerUnit: 'number',        // Precio por unidad
  supplier: 'string',            // Proveedor principal
  status: 'string',              // active, inactive, maintenance
  
  // Metadatos
  createdAt: 'timestamp',
  createdBy: 'string'
};

// Estructura de documentos - MOVIMIENTOS
export const MOVEMENT_DOCUMENT_STRUCTURE = {
  id: 'string',                   // ID único del movimiento
  type: 'string',                // 'entry' | 'exit' | 'transfer' | 'adjustment'
  fuelType: 'string',            // Tipo de combustible
  quantity: 'number',            // Cantidad del movimiento
  unit: 'string',               // Unidad de medida
  
  // Para entradas
  supplier: 'string',           // ID del proveedor (si es entrada)
  purchasePrice: 'number',      // Precio de compra
  invoiceNumber: 'string',      // Número de factura
  
  // Para salidas
  vehicleId: 'string',          // ID del vehículo que consume (si es salida)
  operatorId: 'string',         // ID del operador
  workHours: 'number',          // Horas trabajadas
  
  // Para transferencias
  fromLocation: 'string',       // Ubicación origen
  toLocation: 'string',         // Ubicación destino
  
  // Información general
  date: 'timestamp',            // Fecha del movimiento
  description: 'string',        // Descripción o notas
  approvedBy: 'string',        // UID del aprobador
  status: 'string',            // pending, approved, rejected
  
  // Stock después del movimiento
  stockAfter: 'number',        // Stock resultante
  
  // Metadatos
  createdAt: 'timestamp',
  createdBy: 'string',
  modifiedAt: 'timestamp',
  modifiedBy: 'string'
};

// Estructura de documentos - VEHÍCULOS
export const VEHICLE_DOCUMENT_STRUCTURE = {
  id: 'string',                  // ID único del vehículo
  vehicleType: 'string',         // Tipo según vehicleTypes.js
  name: 'string',               // Nombre/identificador del vehículo
  brand: 'string',              // Marca
  model: 'string',              // Modelo
  year: 'number',               // Año
  serialNumber: 'string',       // Número de serie
  plateNumber: 'string',        // Placa (si aplica)
  
  // Consumo
  fuelType: 'string',           // Tipo de combustible que usa
  avgConsumption: 'number',     // Consumo promedio
  consumptionUnit: 'string',    // Unidad del consumo (gal/hora, gal/100km)
  
  // Estado operativo
  status: 'string',             // active, maintenance, inactive, breakdown
  location: 'string',           // Ubicación actual
  assignedOperator: 'string',   // UID del operador asignado
  
  // Mantenimiento
  lastMaintenance: 'timestamp', // Último mantenimiento
  nextMaintenance: 'timestamp', // Próximo mantenimiento
  maintenanceNotes: 'string',   // Notas de mantenimiento
  
  // Estadísticas
  totalHours: 'number',         // Horas totales de operación
  totalFuelConsumed: 'number',  // Combustible total consumido
  avgEfficiency: 'number',      // Eficiencia promedio
  
  // Metadatos
  createdAt: 'timestamp',
  createdBy: 'string',
  modifiedAt: 'timestamp',
  modifiedBy: 'string'
};

// Estructura de documentos - PROVEEDORES
export const SUPPLIER_DOCUMENT_STRUCTURE = {
  id: 'string',                 // ID único del proveedor
  name: 'string',              // Nombre de la empresa
  contactName: 'string',       // Nombre del contacto
  email: 'string',             // Email de contacto
  phone: 'string',             // Teléfono
  address: 'string',           // Dirección
  city: 'string',              // Ciudad
  
  // Información fiscal
  taxId: 'string',             // NIT o RUT
  taxType: 'string',           // Tipo de régimen fiscal
  
  // Productos que suministra
  fuelTypes: 'array',          // Array de tipos de combustible que suministra
  
  // Precios actuales
  currentPrices: 'object',     // Objeto con precios por tipo de combustible
  
  // Evaluación
  rating: 'number',            // Calificación del proveedor (1-5)
  reliability: 'number',       // Confiabilidad (1-5)
  
  // Estado
  status: 'string',            // active, inactive, suspended
  
  // Estadísticas
  totalOrders: 'number',       // Total de órdenes
  totalPurchased: 'number',    // Total comprado en COP
  lastOrder: 'timestamp',      // Última orden
  
  // Metadatos
  createdAt: 'timestamp',
  createdBy: 'string',
  modifiedAt: 'timestamp',
  modifiedBy: 'string'
};

// Funciones de utilidad para generar IDs únicos
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Funciones para generar rutas de colecciones
export const getInventoryPath = () => COMBUSTIBLES_COLLECTIONS.INVENTORY;
export const getMovementsPath = () => COMBUSTIBLES_COLLECTIONS.MOVEMENTS;
export const getVehiclesPath = () => COMBUSTIBLES_COLLECTIONS.VEHICLES;
export const getSuppliersPath = () => COMBUSTIBLES_COLLECTIONS.SUPPLIERS;