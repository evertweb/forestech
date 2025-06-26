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
  [VEHICLE_TYPES.SKIDDER]: {
    name: 'Skidder',
    category: VEHICLE_CATEGORIES.HARVESTING,
    fuelType: 'diesel',
    avgConsumption: 18, // galones/hora
    icon: '🚛',
    color: '#7c3aed',
    description: 'Arrastre de troncos'
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
  },
  [VEHICLE_TYPES.ATV]: {
    name: 'Cuatrimoto',
    category: VEHICLE_CATEGORIES.TRANSPORT,
    fuelType: 'gasoline',
    avgConsumption: 4, // galones/100km
    icon: '🏍️',
    color: '#16a34a',
    description: 'Transporte en terrenos difíciles'
  },
  [VEHICLE_TYPES.BULLDOZER]: {
    name: 'Buldózer',
    category: VEHICLE_CATEGORIES.MAINTENANCE,
    fuelType: 'diesel',
    avgConsumption: 30, // galones/hora
    icon: '🚜',
    color: '#ca8a04',
    description: 'Construcción y mantenimiento de caminos'
  },
  [VEHICLE_TYPES.EXCAVATOR]: {
    name: 'Excavadora',
    category: VEHICLE_CATEGORIES.MAINTENANCE,
    fuelType: 'diesel',
    avgConsumption: 22, // galones/hora
    icon: '🚜',
    color: '#dc2626',
    description: 'Excavación y movimiento de tierra'
  },
  [VEHICLE_TYPES.GRADER]: {
    name: 'Motoniveladora',
    category: VEHICLE_CATEGORIES.MAINTENANCE,
    fuelType: 'diesel',
    avgConsumption: 15, // galones/hora
    icon: '🚜',
    color: '#7c2d12',
    description: 'Nivelación de caminos forestales'
  },
  [VEHICLE_TYPES.GENERATOR]: {
    name: 'Generador',
    category: VEHICLE_CATEGORIES.SUPPORT,
    fuelType: 'diesel',
    avgConsumption: 5, // galones/hora
    icon: '⚡',
    color: '#0891b2',
    description: 'Generación de energía eléctrica'
  },
  [VEHICLE_TYPES.PUMP]: {
    name: 'Bomba de Agua',
    category: VEHICLE_CATEGORIES.SUPPORT,
    fuelType: 'gasoline',
    avgConsumption: 3, // galones/hora
    icon: '💧',
    color: '#0ea5e9',
    description: 'Bombeo de agua'
  },
  [VEHICLE_TYPES.COMPRESSOR]: {
    name: 'Compresor de Aire',
    category: VEHICLE_CATEGORIES.SUPPORT,
    fuelType: 'diesel',
    avgConsumption: 4, // galones/hora
    icon: '💨',
    color: '#6b7280',
    description: 'Compresión de aire para herramientas'
  }
};

// Información de categorías
export const CATEGORY_INFO = {
  [VEHICLE_CATEGORIES.HARVESTING]: {
    name: 'Cosecha',
    description: 'Maquinaria para corte y procesamiento de madera',
    icon: '🌲',
    color: '#059669'
  },
  [VEHICLE_CATEGORIES.TRANSPORT]: {
    name: 'Transporte', 
    description: 'Vehículos para movilización de personal y material',
    icon: '🚚',
    color: '#0891b2'
  },
  [VEHICLE_CATEGORIES.MAINTENANCE]: {
    name: 'Mantenimiento',
    description: 'Maquinaria para construcción y mantenimiento',
    icon: '🔧',
    color: '#ca8a04'
  },
  [VEHICLE_CATEGORIES.SUPPORT]: {
    name: 'Apoyo',
    description: 'Equipos de soporte y servicios generales',
    icon: '⚙️',
    color: '#6b7280'
  }
};

// Estados operativos de vehículos
export const VEHICLE_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
  INACTIVE: 'inactive',
  BREAKDOWN: 'breakdown'
};

// Información de estados
export const STATUS_INFO = {
  [VEHICLE_STATUS.ACTIVE]: {
    name: 'Activo',
    color: '#16a34a',
    icon: '✅',
    description: 'En operación normal'
  },
  [VEHICLE_STATUS.MAINTENANCE]: {
    name: 'Mantenimiento',
    color: '#ca8a04',
    icon: '🔧',
    description: 'En mantenimiento programado'
  },
  [VEHICLE_STATUS.INACTIVE]: {
    name: 'Inactivo',
    color: '#6b7280',
    icon: '⏸️',
    description: 'Temporalmente fuera de servicio'
  },
  [VEHICLE_STATUS.BREAKDOWN]: {
    name: 'Averiado',
    color: '#dc2626',
    icon: '❌',
    description: 'Requiere reparación'
  }
};

// Obtener información de vehículo por tipo
export const getVehicleInfo = (vehicleType) => {
  return VEHICLE_INFO[vehicleType] || null;
};

// Obtener información de categoría
export const getCategoryInfo = (category) => {
  return CATEGORY_INFO[category] || null;
};

// Obtener todos los vehículos por categoría
export const getVehiclesByCategory = (category) => {
  return Object.keys(VEHICLE_TYPES)
    .map(key => ({
      id: VEHICLE_TYPES[key],
      ...VEHICLE_INFO[VEHICLE_TYPES[key]]
    }))
    .filter(vehicle => vehicle.category === category);
};

// Obtener todos los tipos de vehículos como array
export const getAllVehicleTypes = () => {
  return Object.keys(VEHICLE_TYPES).map(key => ({
    id: VEHICLE_TYPES[key],
    ...VEHICLE_INFO[VEHICLE_TYPES[key]]
  }));
};

// Calcular consumo estimado
export const calculateEstimatedConsumption = (vehicleType, hours) => {
  const vehicleInfo = getVehicleInfo(vehicleType);
  if (!vehicleInfo) return 0;
  
  return vehicleInfo.avgConsumption * hours;
};