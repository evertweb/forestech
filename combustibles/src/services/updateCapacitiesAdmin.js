/**
 * updateCapacitiesAdmin.js - Función administrativa para actualizar capacidades
 * Integrado con los servicios existentes de la app
 */

import { updateInventoryItem, getAllInventoryItems } from '../services/inventoryService';

/**
 * Actualizar las capacidades de tanques en bodegas Austria e Ilusión
 * @param {string} updatedBy - UID del usuario que ejecuta la actualización
 * @returns {Promise<Object>} Resultado de la operación
 */
export const updateBodegasCapacities = async (updatedBy = 'admin') => {
  console.log('🔧 Iniciando actualización de capacidades de bodegas...');

  try {
    // Obtener todos los items del inventario
    const result = await getAllInventoryItems();

    if (!result.success) {
      throw new Error(`Error al obtener inventario: ${result.error}`);
    }

    const inventoryItems = result.data;
    const BODEGAS_TO_UPDATE = ['bodega austria', 'bodega ilusion'];
    const TARGET_CAPACITY = 1000;
    const TARGET_THRESHOLD = 150; // 15% de 1000

    console.log(`📦 Total de items en inventario: ${inventoryItems.length}`);

    // Filtrar items que necesitan actualización
    const itemsToUpdate = inventoryItems.filter(
      (item) =>
        BODEGAS_TO_UPDATE.includes(item.location?.toLowerCase()) && item.maxCapacity === 10000
    );

    console.log(`🎯 Items que requieren actualización: ${itemsToUpdate.length}`);

    if (itemsToUpdate.length === 0) {
      console.log(
        'ℹ️ No hay items que actualizar. Las capacidades ya están configuradas correctamente.'
      );
      return {
        success: true,
        message: 'No se requieren actualizaciones',
        updatedItems: 0,
      };
    }

    // Mostrar items a actualizar
    itemsToUpdate.forEach((item) => {
      console.log(
        `📋 ${item.fuelType} en ${item.location}: ${item.maxCapacity} → ${TARGET_CAPACITY} gal`
      );
    });

    // Confirmar actualización
    const confirm = window.confirm(
      `¿Actualizar ${itemsToUpdate.length} tanques de ${BODEGAS_TO_UPDATE.join(' y ')}?\n\n` +
        `Capacidad actual: 10,000 gal → Nueva capacidad: ${TARGET_CAPACITY} gal\n` +
        `Umbral mínimo: 1,500 gal → Nuevo umbral: ${TARGET_THRESHOLD} gal\n\n` +
        `Esta operación no se puede deshacer.`
    );

    if (!confirm) {
      console.log('❌ Operación cancelada por el usuario');
      return {
        success: false,
        message: 'Operación cancelada por el usuario',
        updatedItems: 0,
      };
    }

    // Actualizar cada item
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const item of itemsToUpdate) {
      try {
        console.log(`🔧 Actualizando ${item.fuelType} en ${item.location}...`);

        const updateData = {
          maxCapacity: TARGET_CAPACITY,
          minThreshold: TARGET_THRESHOLD,
          // Mantener otros campos sin cambios
          fuelType: item.fuelType,
          location: item.location,
          currentStock: item.currentStock,
          pricePerUnit: item.pricePerUnit,
          supplier: item.supplier,
          description: item.description,
          status: item.status,
        };

        const updateResult = await updateInventoryItem(item.id, updateData, updatedBy);

        if (updateResult.success) {
          console.log(`✅ ${item.fuelType} en ${item.location} actualizado exitosamente`);
          successCount++;
        } else {
          console.error(
            `❌ Error actualizando ${item.fuelType} en ${item.location}:`,
            updateResult.error
          );
          errorCount++;
          errors.push(`${item.fuelType} en ${item.location}: ${updateResult.error}`);
        }

        // Pausa pequeña entre actualizaciones para evitar sobrecarga
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(
          `❌ Error inesperado actualizando ${item.fuelType} en ${item.location}:`,
          error
        );
        errorCount++;
        errors.push(`${item.fuelType} en ${item.location}: ${error.message}`);
      }
    }

    // Resumen de resultados
    console.log('\n📊 RESUMEN DE ACTUALIZACIÓN:');
    console.log(`✅ Actualizaciones exitosas: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);

    if (errors.length > 0) {
      console.log('\n❌ ERRORES DETALLADOS:');
      errors.forEach((error) => console.log(`  - ${error}`));
    }

    if (successCount > 0) {
      console.log('\n🎉 ¡Actualización completada!');
      console.log('💡 Los cambios se reflejarán automáticamente en la interfaz.');
    }

    return {
      success: errorCount === 0,
      message: `${successCount} items actualizados exitosamente${errorCount > 0 ? `, ${errorCount} errores` : ''}`,
      updatedItems: successCount,
      errors: errors,
    };
  } catch (error) {
    console.error('❌ Error durante la actualización de capacidades:', error);
    return {
      success: false,
      message: `Error durante la actualización: ${error.message}`,
      updatedItems: 0,
    };
  }
};

/**
 * Verificar el estado actual de las capacidades en las bodegas
 * @returns {Promise<Object>} Estado actual de las capacidades
 */
export const checkBodegasCapacities = async () => {
  console.log('🔍 Verificando capacidades actuales de las bodegas...');

  try {
    const result = await getAllInventoryItems();

    if (!result.success) {
      throw new Error(`Error al obtener inventario: ${result.error}`);
    }

    const inventoryItems = result.data;
    const BODEGAS_TO_CHECK = ['bodega austria', 'bodega ilusion'];

    const bodegasStatus = {};

    BODEGAS_TO_CHECK.forEach((bodega) => {
      const itemsInBodega = inventoryItems.filter(
        (item) => item.location?.toLowerCase() === bodega
      );

      bodegasStatus[bodega] = {
        totalTanks: itemsInBodega.length,
        tanks: itemsInBodega.map((item) => ({
          fuelType: item.fuelType,
          maxCapacity: item.maxCapacity,
          minThreshold: item.minThreshold,
          currentStock: item.currentStock,
          needsUpdate: item.maxCapacity === 10000,
        })),
      };
    });

    console.log('📊 ESTADO ACTUAL DE CAPACIDADES:');
    Object.entries(bodegasStatus).forEach(([bodega, status]) => {
      console.log(`\n🏢 ${bodega.toUpperCase()}:`);
      console.log(`  📦 Total tanques: ${status.totalTanks}`);

      if (status.totalTanks === 0) {
        console.log('  ⚠️ No hay tanques configurados');
      } else {
        status.tanks.forEach((tank) => {
          const statusIcon = tank.needsUpdate ? '🔧' : '✅';
          console.log(
            `  ${statusIcon} ${tank.fuelType}: ${tank.maxCapacity} gal (umbral: ${tank.minThreshold} gal)`
          );
        });
      }
    });

    return { success: true, data: bodegasStatus };
  } catch (error) {
    console.error('❌ Error verificando capacidades:', error);
    return { success: false, error: error.message };
  }
};

// Función para uso en consola del navegador
window.updateBodegasCapacities = updateBodegasCapacities;
window.checkBodegasCapacities = checkBodegasCapacities;
