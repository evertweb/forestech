/**
 * Reset Service para Categorías de Vehículos
 * Elimina todas las categorías personalizadas dejando solo las predeterminadas
 */

import { 
  collection, 
  getDocs, 
  writeBatch,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { DEFAULT_VEHICLE_CATEGORIES } from '../data/vehicleCategories';

const COLLECTION_NAME = 'combustibles_vehicle_categories';

/**
 * Eliminar todas las categorías de vehículos
 */
export const resetVehicleCategories = async () => {
  try {
    console.log('🔄 Iniciando reset completo de categorías de vehículos...');
    
    // Obtener todas las categorías de la colección
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    if (snapshot.empty) {
      console.log('ℹ️ No hay categorías para eliminar');
      return {
        success: true,
        deletedCount: 0,
        message: 'No había categorías para eliminar'
      };
    }
    
    // Usar batch para eliminar todas las categorías
    const batch = writeBatch(db);
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log(`✅ Eliminadas ${snapshot.size} categorías`);
    
    return {
      success: true,
      deletedCount: snapshot.size,
      message: `Se eliminaron ${snapshot.size} categorías`
    };
    
  } catch (error) {
    console.error('❌ Error reseteando categorías de vehículos:', error);
    throw new Error('Error al resetear categorías de vehículos: ' + error.message);
  }
};

/**
 * Verificar si hay categorías existentes
 */
export const hasCustomCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return !snapshot.empty;
  } catch (error) {
    console.error('Error verificando categorías:', error);
    return false;
  }
};

/**
 * Obtener estadísticas de categorías
 */
export const getCategoriesStats = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    return {
      total: snapshot.size,
      predefined: 0,
      custom: snapshot.size
    };
    
  } catch (error) {
    console.error('Error obteniendo estadísticas de categorías:', error);
    return {
      total: 0,
      predefined: 0,
      custom: 0
    };
  }
};