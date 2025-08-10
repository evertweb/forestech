/**
 * Script para actualizar las capacidades de tanques de las bodegas Austria e Ilusión
 * de 10,000 a 1,000 galones
 *
 * EJECUTAR DESDE LA CONSOLA DEL NAVEGADOR:
 * 1. Abrir la app de combustibles en el navegador
 * 2. Abrir las herramientas de desarrollador (F12)
 * 3. Ir a la pestaña Console
 * 4. Copiar y pegar este código
 * 5. Presionar Enter
 */

const updateTankCapacities = async () => {
  console.log('🔧 Iniciando actualización de capacidades de tanques...');

  try {
    // Importar Firebase desde el contexto global de la app
    const { db } = window.firebaseConfig || {};

    if (!db) {
      console.error(
        '❌ Error: Firebase no está disponible. Asegúrate de ejecutar esto desde la app.'
      );
      return;
    }

    // Importar funciones de Firestore
    const { collection, query, where, getDocs, updateDoc, doc } = window.firestore || {};

    if (!collection || !query || !where || !getDocs || !updateDoc || !doc) {
      console.error('❌ Error: Funciones de Firestore no disponibles.');
      console.log(
        '💡 Sugerencia: Ejecuta este código después de que la app haya cargado completamente.'
      );
      return;
    }

    const INVENTORY_COLLECTION = 'combustibles_inventory';
    const BODEGAS_TO_UPDATE = ['bodega austria', 'bodega ilusion'];

    console.log('📍 Buscando tanques en bodegas Austria e Ilusión...');

    let totalUpdated = 0;

    for (const bodega of BODEGAS_TO_UPDATE) {
      console.log(`🔍 Procesando ${bodega}...`);

      // Buscar todos los registros de inventario en esta bodega
      const q = query(collection(db, INVENTORY_COLLECTION), where('location', '==', bodega));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(`⚠️ No se encontraron registros en ${bodega}`);
        continue;
      }

      console.log(`📦 Encontrados ${querySnapshot.size} registros en ${bodega}`);

      // Actualizar cada registro
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        const currentCapacity = data.maxCapacity;

        if (currentCapacity === 10000) {
          console.log(
            `🔧 Actualizando ${data.fuelType} en ${bodega}: ${currentCapacity} → 1000 galones`
          );

          await updateDoc(doc(db, INVENTORY_COLLECTION, docSnapshot.id), {
            maxCapacity: 1000,
            minThreshold: 150, // 15% de 1000 galones
            updatedAt: new Date(),
            updatedBy: 'system_capacity_update',
          });

          totalUpdated++;
          console.log(`✅ Actualizado: ${data.fuelType} en ${bodega}`);
        } else {
          console.log(
            `ℹ️ ${data.fuelType} en ${bodega} ya tiene capacidad ${currentCapacity} (no requiere actualización)`
          );
        }
      }
    }

    console.log(`🎉 ¡Actualización completada! Total de registros actualizados: ${totalUpdated}`);
    console.log('💡 Recarga la página para ver los cambios reflejados en la interfaz.');
  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
    console.log('💡 Sugerencia: Verifica que tengas permisos de escritura en Firebase.');
  }
};

// Función alternativa usando fetch API si Firebase no está disponible
const updateTankCapacitiesViaAPI = async () => {
  console.log('🌐 Intentando actualización vía API...');

  try {
    // Esta función requeriría un endpoint en el backend
    console.warn('⚠️ Función API no implementada. Usa updateTankCapacities() directamente.');
  } catch (error) {
    console.error('❌ Error en actualización vía API:', error);
  }
};

// Función de ayuda para mostrar instrucciones
const showInstructions = () => {
  console.log(`
🔧 INSTRUCCIONES PARA ACTUALIZAR CAPACIDADES DE TANQUES

1. Ejecutar función principal:
   updateTankCapacities()

2. Si Firebase no está disponible:
   - Asegúrate de estar en la app de combustibles
   - Espera a que la app cargue completamente
   - Inicia sesión como administrador

3. Verificar resultados:
   - Busca mensajes de éxito en la consola
   - Recarga la página
   - Verifica en Inventario que las capacidades sean 1000 gal

4. En caso de problemas:
   - Revisa los permisos de Firebase
   - Verifica la conexión a internet
   - Contacta al administrador del sistema
  `);
};

// Exportar funciones para uso global
window.updateTankCapacities = updateTankCapacities;
window.updateTankCapacitiesViaAPI = updateTankCapacitiesViaAPI;
window.showTankUpdateInstructions = showInstructions;

// Mostrar instrucciones automáticamente
showInstructions();

console.log('📋 Funciones disponibles:');
console.log('- updateTankCapacities()');
console.log('- updateTankCapacitiesViaAPI()');
console.log('- showTankUpdateInstructions()');
