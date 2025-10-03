/**
 * ProductsService - Servicio para gestión de productos/combustibles
 * Maneja CRUD completo de productos dinámicos
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
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { checkAndInitializeProducts } from '../utils/initializeProducts';

const COLLECTION_NAME = 'combustibles_products';

/**
 * Crear un nuevo producto
 * @param {Object} productData - Datos del producto
 * @returns {Promise<string>} - ID del producto creado
 */
export const createProduct = async (productData) => {
  try {
    const product = {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), product);
    console.log('Product created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Obtener todos los productos
 * @returns {Promise<Object>} - Resultado con success y data
 */
export const getAllProducts = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, data: products };
  } catch (error) {
    console.error('Error getting products:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener producto por ID
 * @param {string} productId - ID del producto
 * @returns {Promise<Object>} - Producto encontrado
 */
export const getProductById = async (productId) => {
  try {
    const docSnap = await getDoc(doc(db, COLLECTION_NAME, productId));
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Producto no encontrado');
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

/**
 * Actualizar producto
 * @param {string} productId - ID del producto
 * @param {Object} updateData - Datos a actualizar
 * @returns {Promise<void>}
 */
export const updateProduct = async (productId, updateData) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, productId);
    await updateDoc(productRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    console.log('Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Eliminar producto
 * @param {string} productId - ID del producto
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, productId));
    console.log('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Obtener productos por categoría
 * @param {string} category - Categoría del producto
 * @returns {Promise<Array>} - Lista de productos
 */
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('category', '==', category),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
};

/**
 * Obtener productos activos
 * @returns {Promise<Array>} - Lista de productos activos
 */
export const getActiveProducts = async () => {
  try {
    // Verificar e inicializar productos si no existen
    await checkAndInitializeProducts();
    
    console.log('🔍 Obteniendo productos activos...');
    
    // Consulta con índice compuesto
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('isActive', '==', true),
      orderBy('name')
    );
    
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`✅ Productos activos obtenidos: ${products.length}`);
    return products;
    
  } catch (error) {
    console.error('❌ Error obteniendo productos activos:', error);
    
    // Si es un error de índice, intentar consulta alternativa
    if (error.code === 'failed-precondition' || error.message.includes('index')) {
      console.warn('⚠️ Índice no disponible, usando consulta alternativa...');
      
      try {
        const qSimple = query(
          collection(db, COLLECTION_NAME), 
          where('isActive', '==', true)
        );
        const querySnapshot = await getDocs(qSimple);
        
        // Ordenar en cliente
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const sortedProducts = products.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        console.log(`✅ Productos activos obtenidos (ordenamiento en cliente): ${sortedProducts.length}`);
        return sortedProducts;
        
      } catch (fallbackError) {
        console.error('❌ Error en consulta alternativa:', fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
};

/**
 * Suscribirse a cambios en productos (tiempo real)
 * @param {Function} onSuccess - Callback para datos exitosos
 * @param {Function} onError - Callback para errores
 * @returns {Function} - Función para cancelar suscripción
 */
export const subscribeToProducts = (onSuccess, onError) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    
    return onSnapshot(q, 
      (querySnapshot) => {
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        onSuccess(products);
      },
      (error) => {
        console.error('Error in products subscription:', error);
        onError(error);
      }
    );
  } catch (error) {
    console.error('Error setting up products subscription:', error);
    onError(error);
    return () => {}; // Return empty function if setup fails
  }
};

/**
 * Actualizar stock de producto
 * @param {string} productId - ID del producto
 * @param {number} newStock - Nuevo stock
 * @returns {Promise<void>}
 */
export const updateProductStock = async (productId, newStock) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, productId);
    await updateDoc(productRef, {
      currentStock: newStock,
      updatedAt: serverTimestamp()
    });
    console.log('Product stock updated successfully');
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

/**
 * Buscar productos por nombre
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise<Array>} - Lista de productos encontrados
 */
export const searchProducts = async (searchTerm) => {
  try {
    // Firebase no soporta búsquedas de texto completo nativas
    // Implementamos una búsqueda básica obteniendo todos y filtrando
    const allProducts = await getAllProducts();
    
    if (!allProducts.success) {
      throw new Error(allProducts.error);
    }

    const filtered = allProducts.data.filter(product => 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Obtener productos con stock bajo
 * @returns {Promise<Array>} - Lista de productos con stock bajo
 */
export const getLowStockProducts = async () => {
  try {
    const allProducts = await getAllProducts();
    
    if (!allProducts.success) {
      throw new Error(allProducts.error);
    }

    const lowStockProducts = allProducts.data.filter(product => {
      const currentStock = product.currentStock || 0;
      const minThreshold = product.minThreshold || 0;
      return currentStock <= minThreshold;
    });

    return lowStockProducts;
  } catch (error) {
    console.error('Error getting low stock products:', error);
    throw error;
  }
};

/**
 * Obtener producto por código
 * @param {string} productCode - Código del producto
 * @returns {Promise<Object|null>} - Producto encontrado o null
 */
export const getProductByCode = async (productCode) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('code', '==', productCode)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting product by code:', error);
    throw error;
  }
};