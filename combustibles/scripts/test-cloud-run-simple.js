#!/usr/bin/env node

/**
 * Script simple para testing rápido de Cloud Run endpoints
 * DEPRECATED: Cloud Run está obsoleto en este repo. Preferir pruebas contra Firebase Functions.
 * Prueba endpoints públicos sin autenticación interactiva
 * Forestech Combustibles App (Histórico)
 */

import fetch from 'node-fetch';

// Configuración
const CLOUD_RUN_URL = process.env.CLOUD_RUN_SQL_URL || 'https://forestech-sql-service-851382130132.us-central1.run.app';

// Endpoints públicos a probar
const PUBLIC_ENDPOINTS = [
  { name: 'Health Check', endpoint: '/health', method: 'GET' },
  { name: 'Test Endpoint', endpoint: '/test', method: 'GET' },
];

/**
 * Hacer petición HTTP simple
 */
async function makeSimpleRequest(endpoint, method = 'GET') {
  const url = `${CLOUD_RUN_URL}${endpoint}`;

  console.log(`🌐 ${method} ${url}`);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();

    if (response.ok) {
      console.log('✅ Éxito');
      console.log(`📊 Status: ${response.status}`);

      try {
        const data = JSON.parse(responseText);
        console.log('📦 Respuesta:', JSON.stringify(data, null, 2));
      } catch (_e) {
        console.log('📦 Respuesta:', responseText);
      }
    } else {
      console.log('❌ Error');
      console.log(`📊 Status: ${response.status}`);
      console.log('💥 Error:', responseText);
    }

  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }
}

/**
 * Probar endpoint con datos de prueba
 */
async function testWithSampleData(endpoint, data = {}) {
  const url = `${CLOUD_RUN_URL}${endpoint}`;

  console.log(`🌐 POST ${url}`);
  console.log('📤 Datos:', JSON.stringify(data, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();

    if (response.ok) {
      console.log('✅ Éxito');
      console.log(`📊 Status: ${response.status}`);

      try {
        const responseData = JSON.parse(responseText);
        console.log('📦 Respuesta:', JSON.stringify(responseData, null, 2));
      } catch (_e) {
        console.log('📦 Respuesta:', responseText);
      }
    } else {
      console.log('❌ Error');
      console.log(`📊 Status: ${response.status}`);
      console.log('💥 Error:', responseText);
    }

  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }
}

/**
 * Ejecutar pruebas
 */
async function runTests() {
  console.log('🚀 Testing Cloud Run - Pruebas Rápidas');
  console.log('═'.repeat(50));
  console.log(`🎯 URL: ${CLOUD_RUN_URL}`);
  console.log('═'.repeat(50));

  // Probar endpoints públicos
  console.log('\n📡 ENDPOINTS PÚBLICOS');
  console.log('─'.repeat(30));

  for (const endpoint of PUBLIC_ENDPOINTS) {
    await makeSimpleRequest(endpoint.endpoint, endpoint.method);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Probar endpoints con datos de ejemplo (sin auth - mostrarán error 401)
  console.log('\n🔐 ENDPOINTS CON AUTENTICACIÓN (sin token - mostrarán error 401)');
  console.log('─'.repeat(65));

  const authEndpoints = [
    { name: 'Products', endpoint: '/sqlGetAllProducts', data: { filters: {} } },
    { name: 'Movements', endpoint: '/sqlGetAllMovements', data: { filters: {} } },
    { name: 'Vehicles', endpoint: '/sqlGetAllVehicles', data: { filters: {} } },
  ];

  for (const endpoint of authEndpoints) {
    console.log(`\n🧪 Probando: ${endpoint.name}`);
    await testWithSampleData(endpoint.endpoint, endpoint.data);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n💡 NOTA: Los endpoints SQL requieren autenticación Firebase válida');
  console.log('💡 Para testing con auth real, usa: node test-cloud-run-endpoints.js');

  console.log('\n🏁 Pruebas rápidas completadas');
  console.log('═'.repeat(50));
  console.log('\n💡 Para pruebas con autenticación real, usa:');
  console.log('node test-cloud-run-endpoints.js');
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}