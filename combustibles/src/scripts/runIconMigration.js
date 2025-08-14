/**
 * Script para ejecutar la migración de iconos de vehículos
 * Ejecutar con: node src/scripts/runIconMigration.js
 */

/* eslint-env node */

import {
  migrateVehicleIcons,
  needsIconMigration,
  getIconStats,
} from '../utils/vehicleIconMigration.js';

const runMigration = async () => {
  console.log('🚀 Iniciando script de migración de iconos de vehículos\n');

  try {
    // Verificar si es necesaria la migración
    console.log('1️⃣ Verificando necesidad de migración...');
    const needsMigration = await needsIconMigration();

    if (!needsMigration) {
      console.log('✅ Todos los vehículos ya tienen iconos asignados');

      // Mostrar estadísticas actuales
      const stats = await getIconStats();
      if (stats) {
        console.log('\n📊 Estadísticas actuales:');
        console.log(`   Total vehículos: ${stats.total}`);
        console.log(`   Con icono: ${stats.withIcon}`);
        console.log(`   Sin icono: ${stats.withoutIcon}`);

        if (Object.keys(stats.iconDistribution).length > 0) {
          console.log('\n🎨 Distribución de iconos:');
          Object.entries(stats.iconDistribution).forEach(([iconId, count]) => {
            console.log(`   ${iconId}: ${count} vehículos`);
          });
        }
      }

      return;
    }

    console.log('⚠️ Se encontraron vehículos sin iconos. Iniciando migración...\n');

    // Ejecutar migración
    console.log('2️⃣ Ejecutando migración...');
    const result = await migrateVehicleIcons();

    // Mostrar resultado
    console.log('\n📋 Resultado de la migración:');
    console.log(`   ${result.success ? '✅ Exitosa' : '❌ Con errores'}`);
    console.log(`   Mensaje: ${result.message}`);
    console.log(`   Actualizados: ${result.updated || 0}`);
    console.log(`   Fallidos: ${result.failed || 0}`);
    console.log(`   Total procesados: ${result.total || 0}`);

    if (result.errors && result.errors.length > 0) {
      console.log('\n❌ Errores encontrados:');
      result.errors.forEach((error) => {
        console.log(`   ${error.vehicleId}: ${error.error}`);
      });
    }

    // Mostrar estadísticas finales
    console.log('\n3️⃣ Obteniendo estadísticas finales...');
    const finalStats = await getIconStats();
    if (finalStats) {
      console.log('\n📊 Estadísticas finales:');
      console.log(`   Total vehículos: ${finalStats.total}`);
      console.log(`   Con icono: ${finalStats.withIcon}`);
      console.log(`   Sin icono: ${finalStats.withoutIcon}`);

      if (Object.keys(finalStats.iconDistribution).length > 0) {
        console.log('\n🎨 Distribución de iconos:');
        Object.entries(finalStats.iconDistribution)
          .sort(([, a], [, b]) => b - a) // Ordenar por cantidad descendente
          .forEach(([iconId, count]) => {
            console.log(`   ${iconId}: ${count} vehículos`);
          });
      }
    }
  } catch (error) {
    console.error('\n❌ Error ejecutando migración:', error);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }

  console.log('\n🎉 Script completado exitosamente');
};

// Ejecutar script
runMigration();
