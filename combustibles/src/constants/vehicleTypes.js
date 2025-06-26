/**
 * Tipos de vehículos y maquinaria forestal
 * Específico para operaciones forestales en Colombia
 */

// Categorías principales de vehículos
export const VEHICLE_CATEGORIES = {
  HARVESTING: 'harvesting',      // Cosecha
  TRANSPORT: 'transport',        // Transporte
  MAINTENANCE: 'maintenance',    // Mantenimiento
  SUPPORT: 'support'            // Apoyo
};

// Tipos específicos de vehículos/maquinaria
export const VEHICLE_TYPES = {
  // Maquinaria de cosecha
  CHAINSAW: 'chainsaw',
  HARVESTER: 'harvester',
  FORWARDER: 'forwarder',
  SKIDDER: 'skidder',
  
  // Transporte
  LOG_TRUCK: 'log_truck',
  PICKUP_TRUCK: 'pickup_truck',
  ATV: 'atv',
  
  // Mantenimiento
  BULLDOZER: 'bulldozer',
  EXCAVATOR: 'excavator',
  GRADER: 'grader',
  
  // Apoyo
  GENERATOR: 'generator',
  PUMP: 'pump',
  COMPRESSOR: 'compressor'
};

// Información detallada por tipo de vehículo
export const VEHICLE_INFO = {
  [VEHICLE_TYPES.CHAINSAW]: {
    name: 'Motosierra',
    category: VEHICLE_CATEGORIES.HARVESTING,
    fuelType: 'two_stroke',
    avgConsumption: 2.5, // litros/hora
    icon: '🪚',
    color: '#dc2626',
    description: 'Herramienta para corte de árboles'
  },
  [VEHICLE_TYPES.HARVESTER]: {
    name: 'Cosechadora Forestal',
    category: VEHICLE_CATEGORIES.HARVESTING,
    fuelType: 'diesel',
    avgConsumption: 25, // galones/hora
    icon: '🚜',
    color: '#059669',
    description: 'Máquina para corte y procesamiento de árboles'
  },
  [VEHICLE_TYPES.FORWARDER]: {
    name: 'Forwarder',
    category: VEHICLE_CATEGORIES.HARVESTING,
    fuelType: 'diesel',
    avgConsumption: 20, // galones/hora
    icon: '🚚',
    color: '#0891b2',
    description: 'Transporte de troncos dentro del bosque'
  },
  [VEHICLE_TYPES.LOG_TRUCK]: {
    name: 'Camión Maderero',
    category: VEHICLE_CATEGORIES.TRANSPORT,
    fuelType: 'acpm',
    avgConsumption: 3.5, // galones/100km
    icon: '🚚',
    color: '#ea580c',
    description: 'Transporte de madera a destino'
  },
  [VEHICLE_TYPES.PICKUP_TRUCK]: {
    name: 'Camioneta',
    category: VEHICLE_CATEGORIES.TRANSPORT,
    fuelType: 'gasoline',
    avgConsumption: 8, // galones/100km
    icon: '🚐',
    color: '#2563eb',
    description: 'Transporte de personal y herramientas'
  }
};