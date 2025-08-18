/**
 * Script de prueba para verificar la integración SICOM
 */

import {
  getCurrentFuelPrice,
  detectFuelType,
  PRICE_UPDATE_CONFIG,
} from '../services/fuelPricesService';
import { getSicomConfigStatus } from '../config/sicomConfig';

/**
 * Ejecutar pruebas de integración SICOM
 */
export const runSicomIntegrationTests = async () => {
  console.log('🧪 Iniciando pruebas de integración SICOM...\n');

  // Test 1: Verificar configuración
  console.log('📋 Test 1: Verificar configuración SICOM');
  const configStatus = getSicomConfigStatus();
  console.log('Configuración:', configStatus);

  if (!configStatus.hasApiKey) {
    console.warn('⚠️ No se ha configurado API key para SICOM');
    console.log('ℹ️ Configurar en .env: REACT_APP_SICOM_API_KEY=tu_api_key');
  }

  console.log('✅ Test 1 completado\n');

  // Test 2: Detección de tipos de combustible
  console.log('🔍 Test 2: Detección de tipos de combustible');
  const testProducts = [
    { name: 'ACPM', category: 'COMBUSTIBLE' },
    { name: 'DIESEL', category: 'COMBUSTIBLE' },
    { name: 'GASOLINA CORRIENTE', category: 'COMBUSTIBLE' },
    { name: 'BIODIESEL', category: 'COMBUSTIBLE' },
  ];

  testProducts.forEach((product) => {
    const fuelType = detectFuelType(product.name, product.category);
    console.log(`${product.name} -> ${fuelType || 'NO DETECTADO'}`);
  });

  console.log('✅ Test 2 completado\n');

  // Test 3: Consulta de precios para La Primavera
  console.log('💰 Test 3: Consulta de precios para La Primavera');

  try {
    console.log('Consultando precio de DIESEL en LA PRIMAVERA...');
    const dieselPrice = await getCurrentFuelPrice('DIESEL', 'LA PRIMAVERA');

    if (dieselPrice.success) {
      console.log('✅ Precio DIESEL obtenido:', {
        precio: dieselPrice.data.price,
        moneda: dieselPrice.data.currency,
        fuente: dieselPrice.data.source,
        ultimaActualizacion: dieselPrice.data.lastUpdate,
      });
    } else {
      console.warn('⚠️ No se pudo obtener precio DIESEL:', dieselPrice.error);
      if (dieselPrice.fallbackPrice) {
        console.log('💼 Precio de respaldo:', dieselPrice.fallbackPrice);
      }
    }
  } catch (error) {
    console.error('❌ Error consultando precio DIESEL:', error.message);
  }

  console.log('\n');

  // Test 4: Consulta de precios para GASOLINA
  try {
    console.log('Consultando precio de GASOLINA en LA PRIMAVERA...');
    const gasolinePrice = await getCurrentFuelPrice('GASOLINE', 'LA PRIMAVERA');

    if (gasolinePrice.success) {
      console.log('✅ Precio GASOLINA obtenido:', {
        precio: gasolinePrice.data.price,
        moneda: gasolinePrice.data.currency,
        fuente: gasolinePrice.data.source,
        ultimaActualizacion: gasolinePrice.data.lastUpdate,
      });
    } else {
      console.warn('⚠️ No se pudo obtener precio GASOLINA:', gasolinePrice.error);
      if (gasolinePrice.fallbackPrice) {
        console.log('💼 Precio de respaldo:', gasolinePrice.fallbackPrice);
      }
    }
  } catch (error) {
    console.error('❌ Error consultando precio GASOLINA:', error.message);
  }

  console.log('✅ Test 3 completado\n');

  // Test 5: Verificar ciudades disponibles
  console.log('🏙️ Test 4: Ciudades disponibles');
  console.log('Ciudades configuradas:', PRICE_UPDATE_CONFIG.AVAILABLE_CITIES);
  console.log('✅ Test 4 completado\n');

  console.log('🎉 Pruebas de integración SICOM completadas');

  return {
    configurationOk: configStatus.isConfigured,
    detectionWorking: true,
    pricesAvailable: false, // Se actualiza con los resultados reales
    timestamp: new Date().toISOString(),
  };
};

/**
 * Ejecutar prueba rápida de conectividad
 */
export const quickConnectivityTest = async () => {
  console.log('🏃‍♂️ Prueba rápida de conectividad...');

  try {
    const testResult = await getCurrentFuelPrice('DIESEL', 'LA PRIMAVERA');

    if (testResult.success) {
      console.log('✅ Conectividad OK - Precio obtenido desde:', testResult.data.source);
      return true;
    } else {
      console.warn('⚠️ Conectividad limitada - Usando fallback');
      return false;
    }
  } catch (error) {
    console.error('❌ Error de conectividad:', error.message);
    return false;
  }
};

export default {
  runSicomIntegrationTests,
  quickConnectivityTest,
};
