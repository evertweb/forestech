// Script para actualizar capacidades de tanques - Consola del navegador
// Ejecutar cuando la app esté completamente cargada

async function _updateTankCapacitiesFixed() {
  console.log('🔧 Iniciando actualización de capacidades...');

  try {
    // Verificar que estamos en la página correcta
    if (!window.location.href.includes('combustibles')) {
      alert('Este script debe ejecutarse desde la app de combustibles');
      return;
    }

    // Método 1: Usar servicios de la app si están disponibles
    if (window.inventoryService) {
      console.log('📦 Usando servicio de inventario existente...');
      return await updateUsingService();
    }

    // Método 2: Acceder directamente a Firebase desde React components
    const reactFiberRoot =
      document.querySelector('#root')._reactInternalInstance ||
      document.querySelector('#root')._reactInternals;

    if (reactFiberRoot) {
      console.log('⚛️ Intentando acceder a Firebase desde React...');
      return await updateUsingReactContext();
    }

    // Método 3: Usar fetch directo a Firestore REST API
    console.log('🌐 Usando Firestore REST API...');
    return await updateUsingRestAPI();
  } catch (error) {
    console.error('❌ Error general:', error);

    // Fallback: Mostrar instrucciones manuales
    showManualInstructions();
  }
}

async function updateUsingService() {
  try {
    const result = await window.inventoryService.getAllInventoryItems();

    if (!result.success) {
      throw new Error(result.error);
    }

    const itemsToUpdate = result.data.filter((item) => {
      const location = item.location?.toLowerCase() || '';
      return (
        (location.includes('austria') || location.includes('ilusion')) && item.maxCapacity === 10000
      );
    });

    console.log(`📋 Items encontrados para actualizar: ${itemsToUpdate.length}`);

    if (itemsToUpdate.length === 0) {
      console.log('✅ No hay items que actualizar');
      return;
    }

    // Mostrar items
    itemsToUpdate.forEach((item) => {
      console.log(`🔧 ${item.fuelType} en ${item.location}: ${item.maxCapacity} → 1000 gal`);
    });

    const confirm = window.confirm(
      `¿Actualizar ${itemsToUpdate.length} tanques?\n\n` +
        `Capacidad: 10,000 → 1,000 galones\n` +
        `Umbral: 1,500 → 150 galones`
    );

    if (!confirm) {
      console.log('❌ Operación cancelada');
      return;
    }

    // Actualizar cada item
    for (const item of itemsToUpdate) {
      const updateData = {
        ...item,
        maxCapacity: 1000,
        minThreshold: 150,
      };

      const result = await window.inventoryService.updateInventoryItem(item.id, updateData);

      if (result.success) {
        console.log(`✅ ${item.fuelType} en ${item.location} actualizado`);
      } else {
        console.error(`❌ Error: ${item.fuelType} en ${item.location}:`, result.error);
      }
    }

    console.log('🎉 ¡Actualización completada! Recarga la página.');
  } catch (error) {
    console.error('❌ Error usando servicio:', error);
    throw error;
  }
}

async function updateUsingReactContext() {
  // Intentar obtener Firebase desde el contexto de React
  console.log('⚛️ Buscando Firebase en contexto de React...');

  // Buscar en el DOM elementos que puedan tener referencia a Firebase
  const scripts = Array.from(document.scripts);
  const firebaseScript = scripts.find(
    (script) => script.src.includes('firebase') || script.textContent.includes('firebase')
  );

  if (firebaseScript) {
    console.log('🔍 Firebase detectado en scripts');
  }

  // Buscar en window object
  const firebaseKeys = Object.keys(window).filter(
    (key) => key.toLowerCase().includes('firebase') || key.toLowerCase().includes('firestore')
  );

  console.log('🔍 Keys relacionadas con Firebase:', firebaseKeys);

  throw new Error('No se pudo acceder a Firebase desde React context');
}

async function updateUsingRestAPI() {
  console.log('🌐 Intentando usar Firestore REST API...');

  // Obtener project ID de la configuración visible
  const _projectId = 'liquidacionapp-62962'; // Del config visible

  try {
    // Esta aproximación requiere autenticación que no tenemos desde la consola
    console.log('⚠️ REST API requiere token de autenticación');
    throw new Error('REST API no disponible sin token');
  } catch (error) {
    console.error('❌ Error con REST API:', error);
    throw error;
  }
}

function showManualInstructions() {
  console.log(`
  
📋 INSTRUCCIONES MANUALES PARA ACTUALIZAR CAPACIDADES:

1. Ve a la sección de Inventario en la app
2. Busca los tanques de:
   - Bodega Austria
   - Bodega Ilusión
   
3. Para cada tanque con capacidad de 10,000 galones:
   - Haz clic en "Editar"
   - Cambia "Capacidad máxima" de 10000 a 1000
   - Cambia "Umbral mínimo" de 1500 a 150
   - Guarda los cambios

4. Alternativamente, desde la consola del navegador, intenta:
   
   // Si tienes acceso al contexto de combustibles:
   const context = document.querySelector('[data-context="combustibles"]');
   if (context && context._reactInternalFiber) {
     // Acceder al contexto desde el componente
   }
   
   // O si tienes acceso directo a db:
   // (esto solo funciona si db está disponible globalmente)
   if (window.db) {
     // Usar window.db para las operaciones
   }

Alternativa más simple: 
Ve a Firebase Console → Firestore → combustibles_inventory
Busca documentos con location "bodega austria" o "bodega ilusion"
Edita manualmente maxCapacity: 1000, minThreshold: 150

  `);
}

// Función adicional para debugging
function debugFirebaseAccess() {
  console.log('🔍 DEBUGGING FIREBASE ACCESS:');

  // Verificar objetos globales
  console.log('window.firebase:', typeof window.firebase);
  console.log('window.db:', typeof window.db);
  console.log('window.firestore:', typeof window.firestore);

  // Verificar servicios de la app
  console.log('window.inventoryService:', typeof window.inventoryService);
  console.log('window.combustiblesService:', typeof window.combustiblesService);

  // Verificar en elementos del DOM
  const rootElement = document.querySelector('#root');
  console.log('Root element:', rootElement);

  if (rootElement) {
    const reactKeys = Object.keys(rootElement).filter(
      (key) => key.includes('react') || key.includes('fiber')
    );
    console.log('React keys en root:', reactKeys);
  }

  // Verificar variables de entorno visibles
  if (window.process && window.process.env) {
    console.log('Env variables available');
  }

  // Verificar imports de módulos
  if (window.__vite__) {
    console.log('Vite detected');
  }
}

// Ejecutar funciones
console.log('🚀 Script de actualización de capacidades cargado');
console.log('📋 Funciones disponibles:');
console.log('  - updateTankCapacitiesFixed() - Actualizar capacidades');
console.log('  - debugFirebaseAccess() - Debug acceso a Firebase');

// Auto-ejecutar debugging
debugFirebaseAccess();
