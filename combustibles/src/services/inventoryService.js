// combustibles/src/services/inventoryService.js
// Servicio completo para operaciones CRUD de inventario de combustibles
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebase/config";
import { FUEL_INFO, getStockLevel } from "../constants/combustibleTypes";

// Rutas de colecciones
const INVENTORY_COLLECTION = 'combustibles_inventory';

/**
 * CRUD OPERATIONS - CREATE
 */

/**
 * Crear nuevo tipo de combustible en inventario
 * @param {Object} inventoryData - Datos del combustible
 * @returns {Object} - Resultado de la operación
 */
export const createInventoryItem = async (inventoryData, createdBy) => {
  try {
    const fuelInfo = FUEL_INFO[inventoryData.fuelType];
    if (!fuelInfo) {
      return { success: false, error: 'Tipo de combustible no válido' };
    }

    // Verificar que no exista duplicado del mismo tipo en la misma ubicación
    const existingQuery = query(
      collection(db, INVENTORY_COLLECTION),
      where("fuelType", "==", inventoryData.fuelType),
      where("location", "==", inventoryData.location)
    );
    
    const existingDocs = await getDocs(existingQuery);
    if (!existingDocs.empty) {
      return { 
        success: false, 
        error: `Ya existe ${fuelInfo.name} en ${inventoryData.location}` 
      };
    }

    const newItem = {
      fuelType: inventoryData.fuelType,
      name: fuelInfo.name,
      description: inventoryData.description || fuelInfo.description,
      currentStock: Number(inventoryData.currentStock) || 0,
      maxCapacity: Number(inventoryData.maxCapacity),
      minThreshold: Number(inventoryData.minThreshold) || (inventoryData.maxCapacity * 0.15), // 15% por defecto
      unit: fuelInfo.unit,
      location: inventoryData.location,
      pricePerUnit: Number(inventoryData.pricePerUnit) || 0,
      supplier: inventoryData.supplier || '',
      status: inventoryData.status || 'active',
      
      // Metadatos
      createdAt: new Date(),
      createdBy: createdBy,
      lastUpdated: new Date(),
      updatedBy: createdBy
    };

    const docRef = await addDoc(collection(db, INVENTORY_COLLECTION), newItem);
    
    return { 
      success: true, 
      data: { id: docRef.id, ...newItem },
      message: `${fuelInfo.name} agregado al inventario exitosamente`
    };
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return { success: false, error: error.message };
  }
};

/**
 * CRUD OPERATIONS - READ
 */

/**
 * Obtener todos los items del inventario
 * @returns {Object} - Lista de items del inventario
 */
export const getAllInventoryItems = async () => {
  try {
    const q = query(
      collection(db, INVENTORY_COLLECTION),
      orderBy("fuelType", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const items = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        ...data,
        // Calcular nivel de stock
        stockLevel: getStockLevel(data.currentStock, data.maxCapacity),
        // Calcular porcentaje
        stockPercentage: Math.round((data.currentStock / data.maxCapacity) * 100),
        // Verificar si necesita restock
        needsRestock: data.currentStock <= data.minThreshold
      });
    });
    
    return { success: true, data: items };
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener item específico del inventario
 * @param {string} itemId - ID del item
 * @returns {Object} - Item del inventario
 */
export const getInventoryItem = async (itemId) => {
  try {
    const docRef = doc(db, INVENTORY_COLLECTION, itemId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        success: true,
        data: {
          id: docSnap.id,
          ...data,
          stockLevel: getStockLevel(data.currentStock, data.maxCapacity),
          stockPercentage: Math.round((data.currentStock / data.maxCapacity) * 100),
          needsRestock: data.currentStock <= data.minThreshold
        }
      };
    } else {
      return { success: false, error: 'Item no encontrado' };
    }
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener items con stock bajo
 * @returns {Object} - Items que necesitan restock
 */
export const getLowStockItems = async () => {
  try {
    const allItems = await getAllInventoryItems();
    if (!allItems.success) return allItems;
    
    const lowStockItems = allItems.data.filter(item => item.needsRestock);
    
    return { success: true, data: lowStockItems };
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    return { success: false, error: error.message };
  }
};

/**
 * CRUD OPERATIONS - UPDATE
 */

/**
 * Actualizar item del inventario
 * @param {string} itemId - ID del item
 * @param {Object} updateData - Datos a actualizar
 * @param {string} updatedBy - UID del usuario que actualiza
 * @returns {Object} - Resultado de la operación
 */
export const updateInventoryItem = async (itemId, updateData, updatedBy) => {
  try {
    const docRef = doc(db, INVENTORY_COLLECTION, itemId);
    
    // Verificar que el item existe
    const currentDoc = await getDoc(docRef);
    if (!currentDoc.exists()) {
      return { success: false, error: 'Item no encontrado' };
    }

    const updates = {
      ...updateData,
      lastUpdated: new Date(),
      updatedBy: updatedBy
    };

    // Remover campos que no deben actualizarse directamente
    delete updates.id;
    delete updates.createdAt;
    delete updates.createdBy;

    await updateDoc(docRef, updates);
    
    return { 
      success: true, 
      message: 'Item actualizado exitosamente',
      data: { id: itemId, ...updates }
    };
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar stock de un item (para movimientos)
 * @param {string} itemId - ID del item
 * @param {number} newStock - Nuevo stock
 * @param {string} updatedBy - UID del usuario
 * @returns {Object} - Resultado de la operación
 */
export const updateStock = async (itemId, newStock, updatedBy) => {
  try {
    const docRef = doc(db, INVENTORY_COLLECTION, itemId);
    
    await updateDoc(docRef, {
      currentStock: Number(newStock),
      lastUpdated: new Date(),
      updatedBy: updatedBy
    });
    
    return { 
      success: true, 
      message: 'Stock actualizado exitosamente'
    };
  } catch (error) {
    console.error("Error updating stock:", error);
    return { success: false, error: error.message };
  }
};

/**
 * CRUD OPERATIONS - DELETE
 */

/**
 * Eliminar item del inventario
 * @param {string} itemId - ID del item
 * @returns {Object} - Resultado de la operación
 */
export const deleteInventoryItem = async (itemId) => {
  try {
    const docRef = doc(db, INVENTORY_COLLECTION, itemId);
    
    // Verificar que el item existe
    const currentDoc = await getDoc(docRef);
    if (!currentDoc.exists()) {
      return { success: false, error: 'Item no encontrado' };
    }

    await deleteDoc(docRef);
    
    return { 
      success: true, 
      message: 'Item eliminado exitosamente'
    };
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return { success: false, error: error.message };
  }
};

/**
 * REAL-TIME OPERATIONS
 */

/**
 * Suscribirse a cambios en tiempo real del inventario
 * @param {Function} callback - Función que se ejecuta cuando hay cambios
 * @returns {Function} - Función para cancelar la suscripción
 */
export const subscribeToInventory = (callback) => {
  const q = query(
    collection(db, INVENTORY_COLLECTION),
    orderBy("fuelType", "asc")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const items = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        ...data,
        stockLevel: getStockLevel(data.currentStock, data.maxCapacity),
        stockPercentage: Math.round((data.currentStock / data.maxCapacity) * 100),
        needsRestock: data.currentStock <= data.minThreshold
      });
    });
    
    callback(items);
  }, (error) => {
    console.error("Error in inventory subscription:", error);
    callback(null, error);
  });
};

/**
 * BATCH OPERATIONS
 */

/**
 * Actualizar múltiples items en una transacción
 * @param {Array} updates - Array de objetos {id, data}
 * @param {string} updatedBy - UID del usuario
 * @returns {Object} - Resultado de la operación
 */
export const batchUpdateInventory = async (updates, updatedBy) => {
  try {
    const batch = writeBatch(db);
    
    updates.forEach(update => {
      const docRef = doc(db, INVENTORY_COLLECTION, update.id);
      batch.update(docRef, {
        ...update.data,
        lastUpdated: new Date(),
        updatedBy: updatedBy
      });
    });
    
    await batch.commit();
    
    return { 
      success: true, 
      message: `${updates.length} items actualizados exitosamente`
    };
  } catch (error) {
    console.error("Error in batch update:", error);
    return { success: false, error: error.message };
  }
};

/**
 * UTILITY FUNCTIONS
 */

/**
 * Obtener estadísticas del inventario
 * @returns {Object} - Estadísticas calculadas
 */
export const getInventoryStats = async () => {
  try {
    const result = await getAllInventoryItems();
    if (!result.success) return result;
    
    const items = result.data;
    const stats = {
      totalItems: items.length,
      activeItems: items.filter(item => item.status === 'active').length,
      lowStockItems: items.filter(item => item.needsRestock).length,
      totalValue: items.reduce((sum, item) => sum + (item.currentStock * item.pricePerUnit), 0),
      averageStockLevel: items.length > 0 
        ? Math.round(items.reduce((sum, item) => sum + item.stockPercentage, 0) / items.length)
        : 0,
      byFuelType: {}
    };
    
    // Estadísticas por tipo de combustible
    items.forEach(item => {
      if (!stats.byFuelType[item.fuelType]) {
        stats.byFuelType[item.fuelType] = {
          count: 0,
          totalStock: 0,
          totalCapacity: 0,
          totalValue: 0
        };
      }
      
      stats.byFuelType[item.fuelType].count++;
      stats.byFuelType[item.fuelType].totalStock += item.currentStock;
      stats.byFuelType[item.fuelType].totalCapacity += item.maxCapacity;
      stats.byFuelType[item.fuelType].totalValue += (item.currentStock * item.pricePerUnit);
    });
    
    return { success: true, data: stats };
  } catch (error) {
    console.error("Error calculating inventory stats:", error);
    return { success: false, error: error.message };
  }
};