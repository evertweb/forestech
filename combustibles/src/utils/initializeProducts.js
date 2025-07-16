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
  where,
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
    
    // Verificar específicamente si existe DIESEL
    const dieselQuery = query(
      collection(db, COLLECTION_NAME), 
      where('name', '==', 'DIESEL'),
      limit(1)
    );
    const dieselDocs = await getDocs(dieselQuery);
    
    if (!dieselDocs.empty) {
      console.log('✅ Producto DIESEL ya existe en Firebase');
      return;
    }
    
    console.log('📦 Creando producto DIESEL faltante...');
    
    // Crear solo el producto DIESEL que falta
    const dieselInfo = PRODUCT_INFO.DIESEL;
    const productData = {
      name: dieselInfo.name,
      displayName: dieselInfo.displayName,
      category: dieselInfo.category,
      unit: dieselInfo.unit,
      defaultPrice: dieselInfo.defaultPrice,
      color: dieselInfo.color,
      icon: dieselInfo.icon,
      description: dieselInfo.description,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'manual-fix'
    };
    
    const docRef = doc(collection(db, COLLECTION_NAME));
    await setDoc(docRef, productData);
    
    console.log(`✅ Producto DIESEL creado: ${dieselInfo.displayName}`);
    return [{ id: docRef.id, ...productData }];
    
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