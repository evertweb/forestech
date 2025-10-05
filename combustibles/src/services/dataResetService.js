/**
 * DataResetService - Servicio para resetear datos de la aplicación
 * Permite eliminar todas las colecciones y dejar la app limpia
 */

import { 
  collection, 
  getDocs, 
  writeBatch,
  query,
  limit,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Todas las colecciones de la aplicación de combustibles
export const COLLECTIONS = {
  VEHICLES: 'combustibles_vehicles',
  MOVEMENTS: 'combustibles_movements',
  PRODUCTS: 'combustibles_products',
  INVENTORY: 'combustibles_inventory',
  SUPPLIERS: 'combustibles_suppliers',
  MAINTENANCE: 'combustibles_maintenance',
  VEHICLE_CATEGORIES: 'combustibles_vehicle_categories',
  PRODUCT_CATEGORIES: 'productCategories',
  MIGRATION_ALIASES: 'combustibles_migration_aliases',
  MIGRATION_LOGS: 'migration_logs'
};

// Orden de eliminación para evitar conflictos de referencias
const DELETION_ORDER = [
  COLLECTIONS.MOVEMENTS,        // Primero movimientos (dependen de vehículos/productos)
  COLLECTIONS.MAINTENANCE,      // Mantenimiento (depende de vehículos)
  COLLECTIONS.INVENTORY,        // Inventario (depende de productos)
  COLLECTIONS.VEHICLES,         // Vehículos
  COLLECTIONS.PRODUCTS,         // Productos
  COLLECTIONS.SUPPLIERS,        // Proveedores
  COLLECTIONS.VEHICLE_CATEGORIES, // Categorías de vehículos
  COLLECTIONS.PRODUCT_CATEGORIES, // Categorías de productos
  COLLECTIONS.MIGRATION_ALIASES,  // Alias de migración
  COLLECTIONS.MIGRATION_LOGS      // Logs de migración
];

/**
 * Obtener estadísticas de todas las colecciones
 */
export const getDataStatistics = async () => {
  try {
    const stats = {};
    
    for (const [name, collectionName] of Object.entries(COLLECTIONS)) {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        stats[name] = {
          name: collectionName,
          displayName: getDisplayName(name),
          count: snapshot.size,
          icon: getCollectionIcon(name)
        };
      } catch (error) {
        console.error(`Error getting stats for ${collectionName}:`, error);
        stats[name] = {
          name: collectionName,
          displayName: getDisplayName(name),
          count: 0,
          icon: getCollectionIcon(name),
          error: error.message
        };
      }
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting data statistics:', error);
    throw new Error('Error al obtener estadísticas de datos: ' + error.message);
  }
};

/**
 * Eliminar todos los documentos de una colección
 */
export const deleteCollection = async (collectionName, onProgress = null) => {
  try {
    console.log(`🗑️ Eliminando colección: ${collectionName}`);
    
    let deletedCount = 0;
    let hasMore = true;
    
    while (hasMore) {
      // Obtener documentos en lotes para evitar timeout
      const snapshot = await getDocs(query(collection(db, collectionName), limit(100)));
      
      if (snapshot.empty) {
        hasMore = false;
        break;
      }
      
      // Usar batch para eliminar en lotes
      const batch = writeBatch(db);
      
      snapshot.docs.forEach(docSnapshot => {
        batch.delete(docSnapshot.ref);
      });
      
      await batch.commit();
      deletedCount += snapshot.size;
      
      if (onProgress) {
        onProgress(collectionName, deletedCount);
      }
      
      console.log(`✅ Eliminados ${deletedCount} documentos de ${collectionName}`);
      
      // Si obtuvimos menos de 100 documentos, ya terminamos
      if (snapshot.size < 100) {
        hasMore = false;
      }
    }
    
    return {
      success: true,
      deletedCount,
      collection: collectionName
    };
  } catch (error) {
    console.error(`Error deleting collection ${collectionName}:`, error);
    throw new Error(`Error al eliminar colección ${collectionName}: ${error.message}`);
  }
};

/**
 * Eliminar múltiples colecciones específicas
 */
export const deleteSpecificCollections = async (collectionNames, onProgress = null) => {
  try {
    const results = [];
    
    for (const collectionName of collectionNames) {
      try {
        const result = await deleteCollection(collectionName, onProgress);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          collection: collectionName
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error deleting specific collections:', error);
    throw new Error('Error al eliminar colecciones específicas: ' + error.message);
  }
};

/**
 * Reset completo de toda la aplicación
 */
export const resetAllData = async (onProgress = null) => {
  try {
    console.log('🔥 Iniciando reset completo de datos...');
    
    const results = [];
    
    // Eliminar en el orden correcto para evitar conflictos
    for (const collectionName of DELETION_ORDER) {
      try {
        if (onProgress) {
          onProgress(`Eliminando ${getDisplayName(getCollectionKey(collectionName))}...`);
        }
        
        const result = await deleteCollection(collectionName, (collection, count) => {
          if (onProgress) {
            onProgress(`${getDisplayName(getCollectionKey(collection))}: ${count} elementos eliminados`);
          }
        });
        
        results.push(result);
      } catch (error) {
        console.error(`Error resetting ${collectionName}:`, error);
        results.push({
          success: false,
          error: error.message,
          collection: collectionName
        });
      }
    }
    
    // Registrar el reset en logs
    await logResetAction(results);
    
    if (onProgress) {
      onProgress('✅ Reset completo terminado');
    }
    
    console.log('✅ Reset completo terminado');
    return results;
  } catch (error) {
    console.error('Error during complete reset:', error);
    throw new Error('Error durante el reset completo: ' + error.message);
  }
};

/**
 * Crear backup de datos antes del reset
 */
export const createBackup = async (collectionsToBackup = null) => {
  try {
    console.log('💾 Creando backup de datos...');
    
    const backup = {
      timestamp: new Date().toISOString(),
      collections: {}
    };
    
    const collections = collectionsToBackup || Object.values(COLLECTIONS);
    
    for (const collectionName of collections) {
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        backup.collections[collectionName] = snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }));
        
        console.log(`📦 Backup creado para ${collectionName}: ${snapshot.size} documentos`);
      } catch (error) {
        console.error(`Error creating backup for ${collectionName}:`, error);
        backup.collections[collectionName] = {
          error: error.message,
          count: 0
        };
      }
    }
    
    // Guardar backup en localStorage para recuperación inmediata
    const backupKey = `combustibles_backup_${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify(backup));
    
    console.log('✅ Backup creado exitosamente');
    return {
      success: true,
      backupKey,
      backup
    };
  } catch (error) {
    console.error('Error creating backup:', error);
    throw new Error('Error al crear backup: ' + error.message);
  }
};

/**
 * Registrar acción de reset en logs
 */
const logResetAction = async (results) => {
  try {
    const logEntry = {
      action: 'COMPLETE_DATA_RESET',
      timestamp: serverTimestamp(),
      results,
      totalCollections: results.length,
      successfulResets: results.filter(r => r.success).length,
      failedResets: results.filter(r => !r.success).length,
      totalDocumentsDeleted: results.reduce((sum, r) => sum + (r.deletedCount || 0), 0)
    };
    
    await addDoc(collection(db, 'system_logs'), logEntry);
    console.log('📝 Reset action logged');
  } catch (error) {
    console.error('Error logging reset action:', error);
    // No lanzar error porque el log no es crítico
  }
};

/**
 * Obtener nombre de display para colección
 */
const getDisplayName = (key) => {
  const names = {
    VEHICLES: 'Vehículos',
    MOVEMENTS: 'Movimientos',
    PRODUCTS: 'Productos',
    INVENTORY: 'Inventario',
    SUPPLIERS: 'Proveedores',
    MAINTENANCE: 'Mantenimiento',
    VEHICLE_CATEGORIES: 'Categorías de Vehículos',
    PRODUCT_CATEGORIES: 'Categorías de Productos',
    MIGRATION_ALIASES: 'Alias de Migración',
    MIGRATION_LOGS: 'Logs de Migración'
  };
  return names[key] || key;
};

/**
 * Obtener icono para colección
 */
const getCollectionIcon = (key) => {
  const icons = {
    VEHICLES: '🚜',
    MOVEMENTS: '📈',
    PRODUCTS: '🛢️',
    INVENTORY: '📦',
    SUPPLIERS: '🏪',
    MAINTENANCE: '🔧',
    VEHICLE_CATEGORIES: '🏷️',
    PRODUCT_CATEGORIES: '🏷️',
    MIGRATION_ALIASES: '🔄',
    MIGRATION_LOGS: '📋'
  };
  return icons[key] || '📄';
};

/**
 * Obtener key de colección por nombre
 */
const getCollectionKey = (collectionName) => {
  for (const [key, name] of Object.entries(COLLECTIONS)) {
    if (name === collectionName) {
      return key;
    }
  }
  return collectionName;
};

/**
 * Verificar si el usuario tiene permisos para reset
 */
export const canPerformReset = (_userProfile) => {
  return true; // Todos los usuarios pueden hacer reset en preview
};

/**
 * Obtener backups disponibles
 */
export const getAvailableBackups = () => {
  const backups = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('combustibles_backup_')) {
      try {
        const backup = JSON.parse(localStorage.getItem(key));
        backups.push({
          key,
          timestamp: backup.timestamp,
          collections: Object.keys(backup.collections || {}).length
        });
      } catch (error) {
        console.error(`Error parsing backup ${key}:`, error);
      }
    }
  }
  
  return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};