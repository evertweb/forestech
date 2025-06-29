/**
 * Script para inicializar productos predefinidos en Firebase
 * Se ejecuta automáticamente si no existen productos en la colección
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { PRODUCT_INFO } from '../constants/productTypes.js';

const COLLECTION_NAME = 'combustibles_products';

/**
 * Crear productos predefinidos en Firebase
 */
export const initializePredefinedProducts = async () => {
  try {
    console.log('🔄 Verificando productos existentes...');
    
    // Verificar si ya existen productos
    const existingQuery = query(collection(db, COLLECTION_NAME), limit(1));
    const existingDocs = await getDocs(existingQuery);
    
    if (!existingDocs.empty) {
      console.log('✅ Productos ya existen en Firebase');
      return;
    }
    
    console.log('📦 Creando productos predefinidos...');
    
    // Crear cada producto predefinido
    const productPromises = Object.values(PRODUCT_INFO).map(async (productInfo) => {
      const productData = {
        name: productInfo.name,
        displayName: productInfo.displayName,
        category: productInfo.category,
        unit: productInfo.unit,
        defaultPrice: productInfo.defaultPrice,
        color: productInfo.color,
        icon: productInfo.icon,
        description: productInfo.description,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system-initialization'
      };
      
      const docRef = doc(collection(db, COLLECTION_NAME));
      await setDoc(docRef, productData);
      
      console.log(`✅ Producto creado: ${productInfo.displayName}`);
      return { id: docRef.id, ...productData };
    });
    
    const createdProducts = await Promise.all(productPromises);
    
    console.log(`🎉 ${createdProducts.length} productos inicializados correctamente`);
    return createdProducts;
    
  } catch (error) {
    console.error('❌ Error inicializando productos:', error);
    throw error;
  }
};

/**
 * Verificar si necesita inicialización y ejecutarla
 */
export const checkAndInitializeProducts = async () => {
  try {
    await initializePredefinedProducts();
  } catch (error) {
    console.error('❌ Error en inicialización automática:', error);
    // No lanzar error para no bloquear la aplicación
  }
};