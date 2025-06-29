/**
 * Servicio para gestión de categorías de vehículos personalizables
 * Permite crear, modificar y eliminar categorías dinámicamente
 */

import { 
  collection, 
  addDoc,
  updateDoc, 
  deleteDoc,
  doc, 
  getDocs, 
  getDoc,
  query, 
  orderBy,
  onSnapshot,
  serverTimestamp,
  // where
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  DEFAULT_VEHICLE_CATEGORIES, 
  validateCategory, 
  generateCategoryId, 
  getAllCategories 
} from '../data/vehicleCategories';

const COLLECTION_NAME = 'combustibles_vehicle_categories';

/**
 * Crear nueva categoría personalizada
 * @param {Object} categoryData - Datos de la categoría
 * @returns {Promise<Object>} - Categoría creada
 */
export const createCategory = async (categoryData) => {
  try {
    // Validar datos
    const validation = validateCategory(categoryData);
    if (!validation.isValid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    // Verificar si ya existe
    const existingCategories = await getCustomCategories();
    const categoryExists = existingCategories.some(cat => 
      cat.id === categoryData.id || cat.name.toLowerCase() === categoryData.name.toLowerCase()
    );

    if (categoryExists) {
      throw new Error('Ya existe una categoría con ese nombre o ID');
    }

    // Generar ID si no se proporciona
    if (!categoryData.id) {
      categoryData.id = generateCategoryId(categoryData.name, existingCategories);
    }

    const categoryToCreate = {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isCustom: true,
      vehicleCount: 0
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), categoryToCreate);
    
    console.log('✅ Categoría creada:', categoryData.name);
    
    return {
      id: docRef.id,
      ...categoryToCreate,
      createdAt: new Date(),
      updatedAt: new Date()
    };

  } catch (error) {
    console.error('❌ Error al crear categoría:', error);
    throw new Error(`Error al crear categoría: ${error.message}`);
  }
};

/**
 * Obtener todas las categorías personalizadas
 * @returns {Promise<Array>} - Lista de categorías personalizadas
 */
export const getCustomCategories = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      });
    });

    return categories;

  } catch (error) {
    console.error('❌ Error al obtener categorías personalizadas:', error);
    throw new Error(`Error al obtener categorías: ${error.message}`);
  }
};

/**
 * Obtener todas las categorías (predeterminadas + personalizadas)
 * @returns {Promise<Array>} - Lista completa de categorías
 */
export const getAllVehicleCategories = async () => {
  try {
    const customCategories = await getCustomCategories();
    return getAllCategories(customCategories);
  } catch (error) {
    console.error('❌ Error al obtener todas las categorías:', error);
    return DEFAULT_VEHICLE_CATEGORIES; // Fallback solo con predeterminadas
  }
};

/**
 * Actualizar categoría personalizada
 * @param {string} categoryId - ID de la categoría
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<Object>} - Categoría actualizada
 */
export const updateCategory = async (categoryId, updates) => {
  try {
    if (!categoryId) {
      throw new Error('ID de categoría requerido');
    }

    // Validar si es una categoría predeterminada
    const isDefault = DEFAULT_VEHICLE_CATEGORIES.some(cat => cat.id === categoryId);
    if (isDefault) {
      throw new Error('No se pueden modificar las categorías predeterminadas');
    }

    // Validar datos si se está actualizando la estructura
    if (updates.name || updates.fuelTypes || updates.fields) {
      const validation = validateCategory({ ...updates, id: categoryId });
      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
      }
    }

    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    const docRef = doc(db, COLLECTION_NAME, categoryId);
    await updateDoc(docRef, updateData);

    console.log('✅ Categoría actualizada:', categoryId);

    // Obtener categoría actualizada
    const updatedDoc = await getDoc(docRef);
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      createdAt: updatedDoc.data().createdAt?.toDate?.() || updatedDoc.data().createdAt,
      updatedAt: updatedDoc.data().updatedAt?.toDate?.() || updatedDoc.data().updatedAt
    };

  } catch (error) {
    console.error('❌ Error al actualizar categoría:', error);
    throw new Error(`Error al actualizar categoría: ${error.message}`);
  }
};

/**
 * Eliminar categoría personalizada
 * @param {string} categoryId - ID de la categoría
 * @returns {Promise<boolean>} - Éxito de la operación
 */
export const deleteCategory = async (categoryId) => {
  try {
    if (!categoryId) {
      throw new Error('ID de categoría requerido');
    }

    // Validar si es una categoría predeterminada
    const isDefault = DEFAULT_VEHICLE_CATEGORIES.some(cat => cat.id === categoryId);
    if (isDefault) {
      throw new Error('No se pueden eliminar las categorías predeterminadas');
    }

    // Verificar si hay vehículos usando esta categoría
    const { countVehiclesByCategory } = await import('./vehiclesService');
    const vehicleCount = await countVehiclesByCategory(categoryId);
    
    if (vehicleCount > 0) {
      throw new Error(`No se puede eliminar la categoría porque tiene ${vehicleCount} vehículo(s) asignado(s)`);
    }

    const docRef = doc(db, COLLECTION_NAME, categoryId);
    await deleteDoc(docRef);

    console.log('✅ Categoría eliminada:', categoryId);
    return true;

  } catch (error) {
    console.error('❌ Error al eliminar categoría:', error);
    throw new Error(`Error al eliminar categoría: ${error.message}`);
  }
};

/**
 * Suscribirse a cambios en categorías personalizadas
 * @param {Function} callback - Función callback para recibir actualizaciones
 * @returns {Function} - Función para cancelar suscripción
 */
export const subscribeToCategories = (callback) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const categories = [];
      querySnapshot.forEach((doc) => {
        categories.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
        });
      });

      // Combinar con categorías predeterminadas
      const allCategories = getAllCategories(categories);
      callback(allCategories);
    }, (error) => {
      console.error('❌ Error en suscripción a categorías:', error);
      callback(DEFAULT_VEHICLE_CATEGORIES); // Fallback
    });

  } catch (error) {
    console.error('❌ Error al suscribirse a categorías:', error);
    callback(DEFAULT_VEHICLE_CATEGORIES); // Fallback
    return () => {}; // Función vacía para cancelar
  }
};

/**
 * Obtener estadísticas de uso de categorías
 * @returns {Promise<Array>} - Estadísticas por categoría
 */
export const getCategoryStats = async () => {
  try {
    const { getAllVehicles } = await import('./vehiclesService');
    const vehicles = await getAllVehicles();
    const categories = await getAllVehicleCategories();

    return categories.map(category => {
      const vehiclesInCategory = vehicles.filter(v => v.category === category.id);
      
      return {
        ...category,
        vehicleCount: vehiclesInCategory.length,
        activeVehicles: vehiclesInCategory.filter(v => v.status === 'activo').length,
        totalFuelCapacity: vehiclesInCategory.reduce((sum, v) => sum + (v.fuelCapacity || 0), 0),
        avgEnginepower: vehiclesInCategory.length > 0 
          ? vehiclesInCategory.reduce((sum, v) => sum + (v.enginePower || 0), 0) / vehiclesInCategory.length
          : 0
      };
    }).sort((a, b) => b.vehicleCount - a.vehicleCount);

  } catch (error) {
    console.error('❌ Error al obtener estadísticas de categorías:', error);
    return [];
  }
};

export default {
  createCategory,
  getCustomCategories,
  getAllVehicleCategories,
  updateCategory,
  deleteCategory,
  subscribeToCategories,
  getCategoryStats
};