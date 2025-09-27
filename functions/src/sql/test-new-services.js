/**
 * test-new-services.js - Testing básico de servicios SQL migrados en TASK-006
 * Forestech Combustibles App
 */

// Función para probar un endpoint onCall
const testOnCallEndpoint = async (functionName, data = {}) => {
  try {
    console.log(`🧪 Probando ${functionName}...`);

    // Simular request object
    const request = {
      data,
      auth: {
        uid: 'test-user-123',
        token: {
          email: 'test@forestech.com',
          name: 'Test User'
        }
      }
    };

    // Importar la función dinámicamente
    const functionModule = await import('../index.js');
    const functionToTest = functionModule[functionName];

    if (!functionToTest) {
      throw new Error(`Función ${functionName} no encontrada`);
    }

    // Ejecutar la función
    const result = await functionToTest(request);

    console.log(`✅ ${functionName} ejecutado exitosamente:`, result);
    return { success: true, data: result };

  } catch (error) {
    console.error(`❌ Error en ${functionName}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Función principal de testing
export const testNewServices = async () => {
  console.log('🚀 Iniciando testing de servicios SQL migrados (TASK-006)...');

  const results = {
    files: {},
    exports: {},
    endpoints: {}
  };

  try {
    // 1. Verificar que los archivos existen
    console.log('\n📁 Verificando archivos de servicios...');

    const fs = await import('fs');
    const path = await import('path');

    const services = [
      'productsService.js',
      'maintenanceService.js',
      'hourMeterService.js',
      'vehicleCategoriesService.js'
    ];

    services.forEach(service => {
      const filePath = path.join(process.cwd(), 'src/sql', service);
      results.files[service] = fs.existsSync(filePath);
      console.log(`${results.files[service] ? '✅' : '❌'} ${service}: ${results.files[service] ? 'EXISTE' : 'NO ENCONTRADO'}`);
    });

    // 2. Verificar exports de cada servicio
    console.log('\n🔍 Verificando exports de servicios...');

    for (const service of services) {
      try {
        const serviceModule = await import(`./${service.replace('.js', '')}`);
        results.exports[service] = { success: true, exports: Object.keys(serviceModule) };
        console.log(`✅ ${service}: ${results.exports[service].exports.length} exports encontrados`);
      } catch (error) {
        results.exports[service] = { success: false, error: error.message };
        console.log(`❌ ${service}: ERROR - ${error.message}`);
      }
    }

    // 3. Verificar que los endpoints están disponibles en index.js
    console.log('\n🌐 Verificando endpoints en index.js...');

    const endpoints = [
      // Products
      'sqlCreateProduct', 'sqlGetAllProducts', 'sqlGetProduct', 'sqlUpdateProduct', 'sqlDeleteProduct',
      'sqlGetProductsByCategory', 'sqlGetActiveProducts', 'sqlUpdateProductStock', 'sqlSearchProducts',
      'sqlGetLowStockProducts', 'sqlGetProductByCode',

      // Maintenance
      'sqlCreateMaintenance', 'sqlGetAllMaintenance', 'sqlGetMaintenance', 'sqlUpdateMaintenance',
      'sqlDeleteMaintenance', 'sqlGetMaintenanceByVehicle', 'sqlGetUpcomingMaintenance', 'sqlGetMaintenanceStats',

      // Hour Meter
      'sqlRecordHourMeterReading', 'sqlValidateHourMeterForMovement', 'sqlGetHourMeterHistory',
      'sqlInitializeHourMeter', 'sqlGetHourMeterSummary', 'sqlGetHourMeterStats',

      // Vehicle Categories
      'sqlCreateCategory', 'sqlGetAllCategories', 'sqlGetCategory', 'sqlUpdateCategory', 'sqlDeleteCategory',
      'sqlGetCategoryByCode', 'sqlUpdateVehicleCount', 'sqlReorderCategories', 'sqlGetActiveCategories',
      'sqlGetCategoryStats'
    ];

    try {
      const indexModule = await import('../index.js');
      endpoints.forEach(endpoint => {
        results.endpoints[endpoint] = typeof indexModule[endpoint] === 'function';
        console.log(`${results.endpoints[endpoint] ? '✅' : '❌'} ${endpoint}: ${results.endpoints[endpoint] ? 'DISPONIBLE' : 'NO ENCONTRADO'}`);
      });
    } catch (error) {
      results.endpoints.error = error.message;
      console.log(`❌ Error cargando index.js: ${error.message}`);
    }

    // Resumen de resultados
    console.log('\n📊 RESUMEN DE TESTING:');
    console.log('='.repeat(50));

    const totalFiles = services.length;
    const existingFiles = services.filter(service => results.files[service]).length;

    const totalExports = services.length;
    const successfulExports = services.filter(service => results.exports[service]?.success).length;

    const totalEndpoints = endpoints.length;
    const availableEndpoints = endpoints.filter(endpoint => results.endpoints[endpoint]).length;

    console.log(`📁 Archivos: ${existingFiles}/${totalFiles} encontrados`);
    console.log(`🔍 Exports: ${successfulExports}/${totalExports} exitosos`);
    console.log(`🌐 Endpoints: ${availableEndpoints}/${totalEndpoints} disponibles`);

    const totalTests = totalFiles + totalExports + totalEndpoints;
    const passedTests = existingFiles + successfulExports + availableEndpoints;

    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    console.log(`📈 Tasa de éxito: ${successRate}%`);

    if (passedTests === totalTests) {
      console.log('🎉 ¡TODOS LOS TESTS PASARON! Servicios SQL migrados correctamente.');
    } else {
      console.log('⚠️ Algunos tests fallaron. Revisar logs para más detalles.');
    }

    return {
      success: passedTests === totalTests,
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      successRate: `${successRate}%`,
      results
    };

  } catch (error) {
    console.error('❌ Error general en testing:', error);
    return {
      success: false,
      error: error.message,
      results
    };
  }
};

// Ejecutar testing si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testNewServices()
    .then(result => {
      console.log('\n🏁 Testing completado:', result.success ? '✅ ÉXITO' : '❌ FALLÓ');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Error fatal en testing:', error);
      process.exit(1);
    });
}