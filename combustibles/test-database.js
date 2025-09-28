/**
 * Script de diagnóstico para verificar el estado de la base de datos
 * y crear datos de prueba para el dashboard
 */

import { createMovement } from './src/services/FirebaseMovementsService.js';

async function testDatabaseConnection() {
  console.log('🔍 Verificando conexión a la base de datos...');

  try {
    // Crear un movimiento de prueba
    const testMovement = {
      type: 'entrada',
      fuelType: 'DIESEL',
      quantity: 100,
      unitPrice: 4500,
      supplierName: 'Proveedor de Prueba',
      destinationLocation: 'principal',
      description: 'Movimiento de prueba para verificar dashboard'
    };

    console.log('📦 Creando movimiento de prueba:', testMovement);

    const result = await createMovement(testMovement);

    if (result.success) {
      console.log('✅ Movimiento creado exitosamente:', result.id);
      console.log('🎯 Ahora el dashboard debería mostrar:');
      console.log('  - 1 movimiento en "Movimientos Pendientes"');
      console.log('  - Inventario con 100 galones de DIESEL');
      console.log('  - Valor total del inventario: $450,000');
      console.log('  - "Combustible Total": 100.00 galones');
    } else {
      console.error('❌ Error al crear movimiento:', result.error);
    }

  } catch (error) {
    console.error('❌ Error en el test:', error);
  }
}

// Ejecutar el test
testDatabaseConnection();