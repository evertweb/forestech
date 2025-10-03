/**
 * Servicio para gestión dinámica de categorías de productos
 * Permite crear, editar, eliminar y gestionar categorías personalizadas
 */

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Colección de categorías en Firestore
const CATEGORIES_COLLECTION = 'productCategories';

// Categorías predeterminadas (no se pueden eliminar)
export const DEFAULT_PRODUCT_CATEGORIES = [
  {
    id: 'combustible',
    name: 'Combustible',
    description: 'Combustibles líquidos como diesel, gasolina, mezclas',
    icon: '⛽',
    color: '#FF6B35',
    isDefault: true,
    units: ['gal', 'L'],
    fields: ['octanage', 'density', 'supplier']
  },
  {
    id: 'aceite',
    name: 'Aceite',
    description: 'Aceites lubricantes y hidráulicos',
    icon: '🛢️',
    color: '#FF9800',
    isDefault: true,
    units: ['L', 'gal'],
    fields: ['viscosity', 'temperature', 'application']
  },
  {
    id: 'lubricante',
    name: 'Lubricante',
    description: 'Grasas y lubricantes sólidos',
    icon: '🟥',
    color: '#F44336',
    isDefault: true,
    units: ['kg', 'g'],
    fields: ['consistency', 'temperature', 'application']
  },
  {
    id: 'fluido',
    name: 'Fluido',
    description: 'Fluidos especializados (frenos, hidráulicos, etc.)',
    icon: '🛑',
    color: '#E91E63',
    isDefault: true,
    units: ['L', 'ml'],
    fields: ['specification', 'temperature', 'compatibility']
  }
];

// Campos disponibles para personalización
export const AVAILABLE_FIELDS = [
  { key: 'octanage', label: 'Octanaje', icon: '🔥', type: 'number' },
  { key: 'density', label: 'Densidad', icon: '⚖️', type: 'number' },
  { key: 'viscosity', label: 'Viscosidad', icon: '🌊', type: 'text' },
  { key: 'temperature', label: 'Temperatura Operación', icon: '🌡️', type: 'text' },
  { key: 'application', label: 'Aplicación', icon: '🔧', type: 'text' },
  { key: 'supplier', label: 'Proveedor', icon: '🏪', type: 'text' },
  { key: 'specification', label: 'Especificación', icon: '📋', type: 'text' },
  { key: 'compatibility', label: 'Compatibilidad', icon: '🔗', type: 'text' },
  { key: 'consistency', label: 'Consistencia', icon: '💧', type: 'text' }
];

/**
 * Generar ID único para nueva categoría
 */
export const generateCategoryId = (name, existingCategories = []) => {
  const baseId = name.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
  
  let id = baseId;
  let counter = 1;
  
  while (existingCategories.some(cat => cat.id === id)) {
    id = `${baseId}_${counter}`;
    counter++;
  }
  
  return id;
};

/**
 * Crear nueva categoría de producto
 */
export const createCategory = async (categoryData) => {
  try {
    const newCategory = {
      ...categoryData,
      isDefault: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), newCategory);
    
    return {
      id: docRef.id,
      ...newCategory
    };
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error('Error al crear la categoría: ' + error.message);
  }
};

/**
 * Obtener todas las categorías (predeterminadas + personalizadas)
 */
export const getAllProductCategories = async () => {
  try {
    // Obtener categorías personalizadas de Firestore
    const querySnapshot = await getDocs(
      query(collection(db, CATEGORIES_COLLECTION), orderBy('name'))
    );
    
    const customCategories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Combinar con categorías predeterminadas
    return [...DEFAULT_PRODUCT_CATEGORIES, ...customCategories];
  } catch (error) {
    console.error('Error getting categories:', error);
    // En caso de error, retornar solo las predeterminadas
    return DEFAULT_PRODUCT_CATEGORIES;
  }
};

/**
 * Actualizar categoría existente
 */
export const updateCategory = async (categoryId, updates) => {
  try {
    // Verificar que no sea una categoría predeterminada
    if (DEFAULT_PRODUCT_CATEGORIES.some(cat => cat.id === categoryId)) {
      throw new Error('No se pueden editar las categorías predeterminadas');
    }

    const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    
    await updateDoc(categoryRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Error al actualizar la categoría: ' + error.message);
  }
};

/**
 * Eliminar categoría
 */
export const deleteCategory = async (categoryId) => {
  try {
    // Verificar que no sea una categoría predeterminada
    if (DEFAULT_PRODUCT_CATEGORIES.some(cat => cat.id === categoryId)) {
      throw new Error('No se pueden eliminar las categorías predeterminadas');
    }

    // Verificar que no tenga productos asociados
    const productsWithCategory = await getDocs(
      query(collection(db, 'products'), where('categoryId', '==', categoryId))
    );

    if (!productsWithCategory.empty) {
      throw new Error('No se puede eliminar una categoría que tiene productos asociados');
    }

    await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Error al eliminar la categoría: ' + error.message);
  }
};

/**
 * Suscribirse a cambios en tiempo real
 */
export const subscribeToCategories = (callback) => {
  try {
    const unsubscribe = onSnapshot(
      query(collection(db, CATEGORIES_COLLECTION), orderBy('name')),
      (snapshot) => {
        const customCategories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Combinar con categorías predeterminadas
        const allCategories = [...DEFAULT_PRODUCT_CATEGORIES, ...customCategories];
        callback(allCategories);
      },
      (error) => {
        console.error('Error in categories subscription:', error);
        callback(DEFAULT_PRODUCT_CATEGORIES); // Fallback a categorías predeterminadas
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up categories subscription:', error);
    callback(DEFAULT_PRODUCT_CATEGORIES);
    return () => {}; // Retornar función vacía si falla
  }
};

/**
 * Obtener estadísticas de categorías
 */
export const getCategoryStats = async () => {
  try {
    const categories = await getAllProductCategories();
    const statsPromises = categories.map(async (category) => {
      // Contar productos por categoría
      let productCount = 0;
      let activeProducts = 0;

      try {
        const productsSnapshot = await getDocs(
          query(collection(db, 'products'), where('category', '==', category.name))
        );
        
        productCount = productsSnapshot.size;
        activeProducts = productsSnapshot.docs.filter(doc => 
          doc.data().isActive !== false
        ).length;
      } catch (error) {
        console.error(`Error getting stats for category ${category.id}:`, error);
      }

      return {
        id: category.id,
        productCount,
        activeProducts
      };
    });

    return await Promise.all(statsPromises);
  } catch (error) {
    console.error('Error getting category stats:', error);
    return [];
  }
};

/**
 * Obtener categoría por ID
 */
export const getCategoryById = async (categoryId) => {
  try {
    // Verificar primero en categorías predeterminadas
    const defaultCategory = DEFAULT_PRODUCT_CATEGORIES.find(cat => cat.id === categoryId);
    if (defaultCategory) {
      return defaultCategory;
    }

    // Buscar en categorías personalizadas
    const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Categoría no encontrada');
    }
  } catch (error) {
    console.error('Error getting category by ID:', error);
    throw new Error('Error al obtener la categoría: ' + error.message);
  }
};

/**
 * Inicializar categorías predeterminadas en Firestore (si no existen)
 */
export const initializeDefaultCategories = async () => {
  try {
    console.log('🔍 Verificando categorías predeterminadas...');
    
    // Esto no es necesario para este servicio porque las categorías predeterminadas
    // se mantienen en el código y no se almacenan en Firestore
    // Solo las categorías personalizadas van a Firestore
    
    console.log('✅ Categorías predeterminadas listas (están en el código)');
    return { success: true };
  } catch (error) {
    console.error('Error initializing default categories:', error);
    return { success: false, error: error.message };
  }
};