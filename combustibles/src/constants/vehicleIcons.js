/**
 * VehicleIcons - Biblioteca de iconos predefinidos para vehículos forestales
 * Incluye iconos SVG y emojis para diferentes tipos de maquinaria
 */

// Iconos predefinidos organizados por categoría
export const VEHICLE_ICONS = {
  // Tractores y equipos agrícolas
  TRACTOR_GREEN: {
    id: 'tractor_green',
    name: 'Tractor Verde',
    emoji: '🚜',
    color: '#4CAF50',
    category: 'tractores',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 15.5C4 16.3284 4.67157 17 5.5 17C6.32843 17 7 16.3284 7 15.5C7 14.6716 6.32843 14 5.5 14C4.67157 14 4 14.6716 4 15.5Z"/>
      <path d="M17 15.5C17 16.8807 18.1193 18 19.5 18C20.8807 18 22 16.8807 22 15.5C22 14.1193 20.8807 13 19.5 13C18.1193 13 17 14.1193 17 15.5Z"/>
      <path d="M6 10H18V12H6V10Z"/>
      <path d="M8 8H16V10H8V8Z"/>
    </svg>`,
  },
  TRACTOR_BLUE: {
    id: 'tractor_blue',
    name: 'Tractor Azul',
    emoji: '🚜',
    color: '#2196F3',
    category: 'tractores',
  },
  TRACTOR_RED: {
    id: 'tractor_red',
    name: 'Tractor Rojo',
    emoji: '🚜',
    color: '#F44336',
    category: 'tractores',
  },

  // Camiones y transporte
  TRUCK_GREEN: {
    id: 'truck_green',
    name: 'Camión Verde',
    emoji: '🚛',
    color: '#4CAF50',
    category: 'camiones',
  },
  TRUCK_BLUE: {
    id: 'truck_blue',
    name: 'Camión Azul',
    emoji: '🚛',
    color: '#2196F3',
    category: 'camiones',
  },
  TRUCK_ORANGE: {
    id: 'truck_orange',
    name: 'Camión Naranja',
    emoji: '🚛',
    color: '#FF9800',
    category: 'camiones',
  },
  PICKUP_TRUCK: {
    id: 'pickup_truck',
    name: 'Camioneta',
    emoji: '🛻',
    color: '#607D8B',
    category: 'camiones',
  },

  // Excavadoras y maquinaria pesada
  EXCAVATOR_YELLOW: {
    id: 'excavator_yellow',
    name: 'Excavadora Amarilla',
    emoji: '🚜',
    color: '#FFC107',
    category: 'excavadoras',
    customEmoji: '⛏️',
  },
  EXCAVATOR_ORANGE: {
    id: 'excavator_orange',
    name: 'Excavadora Naranja',
    emoji: '🚜',
    color: '#FF9800',
    category: 'excavadoras',
    customEmoji: '⛏️',
  },
  BULLDOZER: {
    id: 'bulldozer',
    name: 'Bulldozer',
    emoji: '🚜',
    color: '#795548',
    category: 'excavadoras',
    customEmoji: '🏗️',
  },

  // Vehículos ligeros
  CAR_RED: {
    id: 'car_red',
    name: 'Auto Rojo',
    emoji: '🚗',
    color: '#F44336',
    category: 'vehiculos_ligeros',
  },
  CAR_BLUE: {
    id: 'car_blue',
    name: 'Auto Azul',
    emoji: '🚗',
    color: '#2196F3',
    category: 'vehiculos_ligeros',
  },
  CAR_WHITE: {
    id: 'car_white',
    name: 'Auto Blanco',
    emoji: '🚗',
    color: '#FFFFFF',
    category: 'vehiculos_ligeros',
  },
  SUV: {
    id: 'suv',
    name: 'SUV',
    emoji: '🚙',
    color: '#424242',
    category: 'vehiculos_ligeros',
  },

  // Motocicletas y vehículos pequeños
  MOTORCYCLE: {
    id: 'motorcycle',
    name: 'Motocicleta',
    emoji: '🏍️',
    color: '#E91E63',
    category: 'motocicletas',
  },
  ATV: {
    id: 'atv',
    name: 'Cuatrimoto',
    emoji: '🏍️',
    color: '#795548',
    category: 'motocicletas',
  },

  // Equipos especializados
  CRANE: {
    id: 'crane',
    name: 'Grúa',
    emoji: '🏗️',
    color: '#FF9800',
    category: 'especializados',
  },
  CHAINSAW: {
    id: 'chainsaw',
    name: 'Motosierra',
    emoji: '🪚',
    color: '#FF5722',
    category: 'herramientas',
  },
  GENERATOR: {
    id: 'generator',
    name: 'Planta Eléctrica',
    emoji: '⚡',
    color: '#FFC107',
    category: 'equipos',
  },
  PUMP: {
    id: 'pump',
    name: 'Motobomba',
    emoji: '💧',
    color: '#03A9F4',
    category: 'equipos',
  },
  SPRAYER: {
    id: 'sprayer',
    name: 'Fumigadora',
    emoji: '💨',
    color: '#4CAF50',
    category: 'equipos',
  },
  MOWER: {
    id: 'mower',
    name: 'Guadaña',
    emoji: '🌾',
    color: '#8BC34A',
    category: 'herramientas',
  },

  // Volquetas y carga
  DUMP_TRUCK: {
    id: 'dump_truck',
    name: 'Volqueta',
    emoji: '🚚',
    color: '#9E9E9E',
    category: 'camiones',
  },
  LOADER: {
    id: 'loader',
    name: 'Cargador',
    emoji: '🚜',
    color: '#FFEB3B',
    category: 'excavadoras',
    customEmoji: '🏗️',
  },
};

// Categorías de iconos
export const ICON_CATEGORIES = {
  tractores: {
    name: 'Tractores',
    description: 'Tractores y equipos agrícolas',
  },
  camiones: {
    name: 'Camiones',
    description: 'Camiones, volquetas y transporte',
  },
  excavadoras: {
    name: 'Maquinaria Pesada',
    description: 'Excavadoras, bulldozers y cargadores',
  },
  vehiculos_ligeros: {
    name: 'Vehículos Ligeros',
    description: 'Autos, SUVs y camionetas',
  },
  motocicletas: {
    name: 'Motocicletas',
    description: 'Motos y cuatrimotos',
  },
  especializados: {
    name: 'Especializados',
    description: 'Grúas y equipo especializado',
  },
  herramientas: {
    name: 'Herramientas',
    description: 'Motosierras, guadañas y herramientas',
  },
  equipos: {
    name: 'Equipos',
    description: 'Plantas eléctricas, bombas y fumigadoras',
  },
};

// Icono por defecto
export const DEFAULT_VEHICLE_ICON = VEHICLE_ICONS.CAR_RED;

// Función para obtener icono por ID
export const getVehicleIcon = (iconId) => {
  // Buscar el icono por su campo 'id' dentro del objeto
  const icon = Object.values(VEHICLE_ICONS).find((icon) => icon.id === iconId);
  return icon || DEFAULT_VEHICLE_ICON;
};

// Función para obtener iconos por categoría
export const getIconsByCategory = (category) => {
  return Object.values(VEHICLE_ICONS).filter((icon) => icon.category === category);
};

// Función para obtener todos los iconos agrupados por categoría
export const getIconsGroupedByCategory = () => {
  const grouped = {};

  Object.entries(ICON_CATEGORIES).forEach(([categoryId, categoryInfo]) => {
    grouped[categoryId] = {
      ...categoryInfo,
      icons: getIconsByCategory(categoryId),
    };
  });

  return grouped;
};

// Función para buscar iconos por nombre
export const searchIcons = (searchTerm) => {
  if (!searchTerm) return Object.values(VEHICLE_ICONS);

  const term = searchTerm.toLowerCase();
  return Object.values(VEHICLE_ICONS).filter(
    (icon) => icon.name.toLowerCase().includes(term) || icon.category.toLowerCase().includes(term)
  );
};

export default {
  VEHICLE_ICONS,
  ICON_CATEGORIES,
  DEFAULT_VEHICLE_ICON,
  getVehicleIcon,
  getIconsByCategory,
  getIconsGroupedByCategory,
  searchIcons,
};
