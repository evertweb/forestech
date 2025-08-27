#!/usr/bin/env node

/**
 * Script para probar el webhook de Telegram/N8N
 * Simula el envío de un movimiento de entrada desde N8N
 */

const WEBHOOK_URL = 'https://us-central1-forestech-01.cloudfunctions.net/combustiblesWebhookReceiver';
const SECRET_TOKEN = 'forestech_webhook_2024';

/**
 * Test de conexión básica
 */
async function testConnection() {
  console.log('🧪 Probando conexión básica...');
  
  const payload = {
    action: 'test_connection',
    source: 'test_script',
    timestamp: new Date().toISOString()
  };
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SECRET_TOKEN}`,
        'User-Agent': 'Test-Script/1.0'
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Test de conexión exitoso:', result);
      return true;
    } else {
      console.error('❌ Test de conexión falló:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Error en test de conexión:', error.message);
    return false;
  }
}

/**
 * Test de creación de movimiento
 */
async function testCreateMovement() {
  console.log('\n🧪 Probando creación de movimiento...');
  
  const payload = {
    action: 'create_movement',
    movementData: {
      type: 'entrada',
      fuelType: 'DIESEL',
      quantity: 500,
      unitPrice: 14500,
      supplierName: 'Proveedor Test desde Script',
      destinationLocation: 'principal',
      effectiveDate: new Date().toISOString(),
      description: 'Movimiento de prueba desde script',
      reference: 'TEST-001',
      telegramUserId: '123456789',
      telegramUsername: 'test_user'
    },
    source: 'test_script',
    n8nExecutionId: 'test_execution_' + Date.now(),
    timestamp: new Date().toISOString()
  };
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SECRET_TOKEN}`,
        'User-Agent': 'Test-Script/1.0'
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    console.log('\n📄 Respuesta completa:');
    console.log(JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('\n✅ Movimiento creado exitosamente!');
      console.log(`📥 ID del movimiento: ${result.movementId}`);
      console.log(`⛽ Combustible: ${result.data.fuelType}`);
      console.log(`📊 Cantidad: ${result.data.quantity} galones`);
      console.log(`💰 Precio: $${result.data.unitPrice.toLocaleString('es-CO')} por galón`);
      console.log(`💵 Valor total: $${result.data.totalValue.toLocaleString('es-CO')}`);
      return true;
    } else {
      console.error('\n❌ Error al crear movimiento:');
      console.error('Status:', response.status);
      console.error('Error:', result.error);
      if (result.details) {
        console.error('Detalles:', result.details);
      }
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error en test de movimiento:', error.message);
    return false;
  }
}

/**
 * Test de validación de datos incorrectos
 */
async function testInvalidData() {
  console.log('\n🧪 Probando validación con datos incorrectos...');
  
  const payload = {
    action: 'create_movement',
    movementData: {
      type: 'entrada',
      fuelType: 'COMBUSTIBLE_INEXISTENTE',
      quantity: -100, // Cantidad negativa
      unitPrice: 'precio_invalido', // Precio no numérico
      supplierName: '', // Proveedor vacío
      destinationLocation: 'ubicacion_inexistente'
    },
    source: 'test_script'
  };
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SECRET_TOKEN}`,
        'User-Agent': 'Test-Script/1.0'
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      console.log('✅ Validación funcionando correctamente - datos rechazados');
      console.log('Error esperado:', result.error);
      if (result.details) {
        console.log('Detalles de validación:', result.details);
      }
      return true;
    } else {
      console.error('❌ Validación falló - datos incorrectos fueron aceptados');
      return false;
    }
  } catch (error) {
    console.error('❌ Error en test de validación:', error.message);
    return false;
  }
}

/**
 * Test de autenticación incorrecta
 */
async function testInvalidAuth() {
  console.log('\n🧪 Probando autenticación incorrecta...');
  
  const payload = {
    action: 'test_connection',
    source: 'unauthorized_test'
  };
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token_incorrecto',
        'User-Agent': 'Test-Script/1.0'
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    
    if (response.status === 401) {
      console.log('✅ Autenticación funcionando correctamente - acceso denegado');
      console.log('Error esperado:', result.error);
      return true;
    } else {
      console.error('❌ Autenticación falló - acceso no autorizado fue permitido');
      return false;
    }
  } catch (error) {
    console.error('❌ Error en test de autenticación:', error.message);
    return false;
  }
}

/**
 * Ejecutar todos los tests
 */
async function runAllTests() {
  console.log('🚀 Iniciando tests del webhook de combustibles...\n');
  
  const tests = [
    { name: 'Conexión básica', fn: testConnection },
    { name: 'Creación de movimiento', fn: testCreateMovement },
    { name: 'Validación de datos', fn: testInvalidData },
    { name: 'Autenticación', fn: testInvalidAuth }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const success = await test.fn();
      if (success) {
        passed++;
      }
    } catch (error) {
      console.error(`❌ Error en test "${test.name}":`, error.message);
    }
  }
  
  console.log('\n📊 Resultados de los tests:');
  console.log(`✅ Exitosos: ${passed}/${total}`);
  console.log(`❌ Fallidos: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 Todos los tests pasaron! El webhook está funcionando correctamente.');
  } else {
    console.log('\n⚠️  Algunos tests fallaron. Revisar configuración del webhook.');
  }
}

// Ejecutar tests si el script es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export { testConnection, testCreateMovement, testInvalidData, testInvalidAuth };
