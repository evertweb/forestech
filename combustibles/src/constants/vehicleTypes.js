/**
 * Tipos de vehículos y maquinaria forestal
 * Específico para operaciones forestales en Colombia.
 * Cada bloque está documentado para facilitar el mantenimiento y la extensión.
 */

// Categorías principales de vehículos utilizados en la app
export const VEHICLE_CATEGORIES = {
  HARVESTING: 'harvesting', // Cosecha
  TRANSPORT: 'transport', // Transporte
  MAINTENANCE: 'maintenance', // Mantenimiento
  SUPPORT: 'support', // Apoyo
};

// Tipos específicos de vehículos/maquinaria, agrupados por función
export const VEHICLE_TYPES = {
  // Maquinaria de cosecha
  CHAINSAW: 'chainsaw',
  HARVESTER: 'harvester',
  FORWARDER: 'forwarder',
  SKIDDER: 'skidder',

  // Transporte terrestre
  LOG_TRUCK: 'log_truck',
  PICKUP_TRUCK: 'pickup_truck',
  CAR: 'car',
  MOTORCYCLE: 'motorcycle',
  ATV: 'atv',

  // Maquinaria pesada
  BULLDOZER: 'bulldozer',
  EXCAVATOR: 'excavator',
  GRADER: 'grader',
  LOADER: 'loader',

  // Equipos de bombeo y emergencia
  WATER_PUMP: 'water_pump',
  FIRE_PUMP: 'fire_pump',
  GENERATOR: 'generator',
  COMPRESSOR: 'compressor',
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
    description: 'Herramienta para corte de árboles',
  },
  [VEHICLE_TYPES.HARVESTER]: {
    name: 'Cosechadora Forestal',
    category: VEHICLE_CATEGORIES.HARVESTING,
    fuelType: 'diesel',
    avgConsumption: 25, // galones/hora
    icon: '🚜',
    color: '#059669',
    description: 'Máquina para corte y procesamiento de árboles',
  },
  [VEHICLE_TYPES.FORWARDER]: {
    name: 'Forwarder',
    category: VEHICLE_CATEGORIES.HARVESTING,
    fuelType: 'diesel',
    avgConsumption: 20, // galones/hora
    icon: '🚚',
    color: '#0891b2',
    description: 'Transporte de troncos dentro del bosque',
  },
  [VEHICLE_TYPES.LOG_TRUCK]: {
    name: 'Camión Maderero',
    category: VEHICLE_CATEGORIES.TRANSPORT,
    fuelType: 'acpm',
    avgConsumption: 3.5, // galones/100km
    icon: '🚚',
    color: '#ea580c',
    description: 'Transporte de madera a destino',
  },
  [VEHICLE_TYPES.PICKUP_TRUCK]: {
    name: 'Camioneta',
    category: VEHICLE_CATEGORIES.TRANSPORT,
    fuelType: 'gasoline',
    avgConsumption: 8, // galones/100km
    icon: '🚐',
    color: '#2563eb',
    description: 'Transporte de personal y herramientas',
  },
  [VEHICLE_TYPES.CAR]: {
    name: 'Automóvil',
    category: VEHICLE_CATEGORIES.TRANSPORT,
    fuelType: 'gasoline',
    avgConsumption: 12, // galones/100km
    icon: '🚗',
    color: '#3b82f6',
    description: 'Vehículo liviano para transporte ejecutivo',
  },
  [VEHICLE_TYPES.MOTORCYCLE]: {
    name: 'Motocicleta',
    category: VEHICLE_CATEGORIES.TRANSPORT,
    fuelType: 'gasoline',
    avgConsumption: 25, // galones/100km
    icon: '🏍️',
    color: '#6366f1',
    description: 'Transporte ágil para terrenos difíciles',
  },
  [VEHICLE_TYPES.ATV]: {
    name: 'Cuatrimoto',
    category: VEHICLE_CATEGORIES.TRANSPORT,
    fuelType: 'gasoline',
    avgConsumption: 15, // galones/100km
    icon: '🏍️',
    color: '#84cc16',
    description: 'Vehículo todo terreno para supervisión',
  },
  [VEHICLE_TYPES.SKIDDER]: {
    name: 'Skidder',
    category: VEHICLE_CATEGORIES.HARVESTING,
    fuelType: 'diesel',
    avgConsumption: 22, // galones/hora
    icon: '🚜',
    color: '#f59e0b',
    description: 'Arrastre de troncos desde el lugar de corte',
  },
  [VEHICLE_TYPES.BULLDOZER]: {
    name: 'Bulldozer',
    category: VEHICLE_CATEGORIES.MAINTENANCE,
    fuelType: 'diesel',
    avgConsumption: 30, // galones/hora
    icon: '🚜',
    color: '#f97316',
    description: 'Construcción y mantenimiento de caminos',
  },
  [VEHICLE_TYPES.EXCAVATOR]: {
    name: 'Excavadora',
    category: VEHICLE_CATEGORIES.MAINTENANCE,
    fuelType: 'diesel',
    avgConsumption: 28, // galones/hora
    icon: '🏗️',
    color: '#eab308',
    description: 'Excavación y movimiento de tierra',
  },
  [VEHICLE_TYPES.GRADER]: {
    name: 'Motoniveladora',
    category: VEHICLE_CATEGORIES.MAINTENANCE,
    fuelType: 'diesel',
    avgConsumption: 25, // galones/hora
    icon: '🚜',
    color: '#a3a3a3',
    description: 'Nivelación y mantenimiento de vías',
  },
  [VEHICLE_TYPES.LOADER]: {
    name: 'Cargador Frontal',
    category: VEHICLE_CATEGORIES.MAINTENANCE,
    fuelType: 'diesel',
    avgConsumption: 24, // galones/hora
    icon: '🚜',
    color: '#71717a',
    description: 'Carga y descarga de materiales',
  },
  [VEHICLE_TYPES.WATER_PUMP]: {
    name: 'Motobomba de Agua',
    category: VEHICLE_CATEGORIES.SUPPORT,
    fuelType: 'gasoline',
    avgConsumption: 3.5, // galones/hora
    icon: '💧',
    color: '#0891b2',
    description: 'Bombeo de agua para operaciones',
  },
  [VEHICLE_TYPES.FIRE_PUMP]: {
    name: 'Motobomba Contra Incendios',
    category: VEHICLE_CATEGORIES.SUPPORT,
    fuelType: 'gasoline',
    avgConsumption: 4.2, // galones/hora
    icon: '🔥',
    color: '#dc2626',
    description: 'Equipo de emergencia contra incendios',
  },
  [VEHICLE_TYPES.GENERATOR]: {
    name: 'Generador Eléctrico',
    category: VEHICLE_CATEGORIES.SUPPORT,
    fuelType: 'gasoline',
    avgConsumption: 2.8, // galones/hora
    icon: '⚡',
    color: '#7c3aed',
    description: 'Suministro de energía eléctrica',
  },
  [VEHICLE_TYPES.COMPRESSOR]: {
    name: 'Compresor de Aire',
    category: VEHICLE_CATEGORIES.SUPPORT,
    fuelType: 'gasoline',
    avgConsumption: 2.5, // galones/hora
    icon: '💨',
    color: '#64748b',
    description: 'Suministro de aire comprimido',
  },
};

// NOTA: FUEL_TYPES y FUEL_INFO ahora están centralizados en combustibleTypes.js
// Este archivo se enfoca únicamente en tipos y categorías de vehículos

// Función para obtener vehículos por categoría
export const getVehiclesByCategory = (category) => {
  return Object.entries(VEHICLE_INFO)
    .filter(([, info]) => info.category === category)
    .map(([type, info]) => ({ type, ...info }));
};

// Función para obtener información completa de un vehículo
export const getVehicleInfo = (vehicleType) => {
  return VEHICLE_INFO[vehicleType] || null;
};
