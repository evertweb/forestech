/**
 * Script de verificación para confirmar que todas las referencias a DIESEL están en mayúsculas
 * Ejecutar en la consola del navegador para verificar la consistencia
 */

// Verificar constantes principales
console.log('🔍 Verificando unificación de DIESEL...\n');

// 1. Verificar FUEL_TYPES
import { FUEL_TYPES } from './src/constants/combustibleTypes.js';
console.log('FUEL_TYPES.DIESEL:', FUEL_TYPES.DIESEL);

// 2. Verificar FUEL_COMPATIBILITY
import { FUEL_COMPATIBILITY } from './src/services/vehiclesService.js';
console.log('FUEL_COMPATIBILITY.DIESEL:', FUEL_COMPATIBILITY.DIESEL);

// 3. Verificar en vehicleCategories
import { FUEL_TYPES as VEHICLE_FUEL_TYPES } from './src/data/vehicleCategories.js';
console.log('VEHICLE_FUEL_TYPES.DIESEL:', VEHICLE_FUEL_TYPES.DIESEL);

// 4. Verificar PRODUCT_TYPES
import { PRODUCT_TYPES, PRODUCT_INFO } from './src/constants/productTypes.js';
console.log('PRODUCT_TYPES.DIESEL:', PRODUCT_TYPES.DIESEL);
console.log('PRODUCT_INFO[PRODUCT_TYPES.DIESEL].name:', PRODUCT_INFO[PRODUCT_TYPES.DIESEL].name);
console.log(
  'PRODUCT_INFO[PRODUCT_TYPES.DIESEL].displayName:',
  PRODUCT_INFO[PRODUCT_TYPES.DIESEL].displayName
);

console.log(
  '\n✅ Si todos los valores muestran "DIESEL" en mayúsculas, la unificación fue exitosa!'
);

// Test de comparación
const testValues = ['DIESEL', 'diesel', 'Diesel'];
testValues.forEach((value) => {
  const matches = value === FUEL_TYPES.DIESEL;
  console.log(`${value} === FUEL_TYPES.DIESEL: ${matches ? '✅' : '❌'}`);
});
