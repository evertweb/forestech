/**
 * Script de prueba para crear categoría directamente desde local
 * Simula exactamente lo que hace el frontend
 */

const testCategoryData = {
  name: 'MAQUINARIA AGRICOLA',
  description: '',
  icon: '🚜',
  color: '#3b82f6',
  fuelTypes: ['DIESEL'],
  fields: [],
  uniqueCode: '',
  createdAt: new Date(),
  updatedAt: new Date()
};

console.log('🧪 Datos que envía el frontend:');
console.log(JSON.stringify(testCategoryData, null, 2));

// Simulación del mapeo que debe hacer el servicio
const mappedData = {
  name: testCategoryData.name.trim(),
  code: testCategoryData.uniqueCode || testCategoryData.name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10),
  description: testCategoryData.description || '',
  type: 'vehicle',
  icon: testCategoryData.icon || 'vehicle',
  color: testCategoryData.color || '#4F46E5',
  customFields: JSON.stringify({
    fields: testCategoryData.fields || [],
    fuelTypes: testCategoryData.fuelTypes || []
  }),
  defaultFuelType: (testCategoryData.fuelTypes && testCategoryData.fuelTypes[0]) || 'DIESEL',
  estimatedConsumption: 0,
  isActive: 1,
  sortOrder: 1,
  vehicleCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'test-user',
  updatedBy: 'test-user'
};

console.log('\n🔄 Datos mapeados para SQL:');
console.log(JSON.stringify(mappedData, null, 2));

console.log('\n📝 Query que se debería generar:');
const columns = Object.keys(mappedData);
const values = columns.map((_, index) => `@param${index}`);

const insertQuery = `
INSERT INTO combustibles_vehicle_categories (${columns.join(', ')})
VALUES (${values.join(', ')});
SELECT SCOPE_IDENTITY() as id;
`;

console.log(insertQuery);

console.log('\n🔍 Parámetros:');
columns.forEach((col, index) => {
  console.log(`  @param${index} = ${mappedData[col]} (${typeof mappedData[col]})`);
});