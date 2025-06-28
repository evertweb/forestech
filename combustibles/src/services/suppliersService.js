// combustibles/src/services/suppliersService.js
// Servicio completo para operaciones CRUD de proveedores de combustibles
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
  onSnapshot
} from "firebase/firestore";
import { db } from "../firebase/config";
import { FUEL_TYPES } from "../constants/combustibleTypes";

// Rutas de colecciones
const SUPPLIERS_COLLECTION = 'combustibles_suppliers';

/**
 * CRUD OPERATIONS - CREATE
 */

/**
 * Crear nuevo proveedor
 * @param {Object} supplierData - Datos del proveedor
 * @param {string} createdBy - Usuario que crea el proveedor
 * @returns {Object} - Resultado de la operación
 */
export const createSupplier = async (supplierData, createdBy) => {
  try {
    // Verificar que no exista duplicado con el mismo nombre
    const existingQuery = query(
      collection(db, SUPPLIERS_COLLECTION),
      where("name", "==", supplierData.name.trim())
    );
    
    const existingDocs = await getDocs(existingQuery);
    if (!existingDocs.empty) {
      return { 
        success: false, 
        error: `Ya existe un proveedor con el nombre "${supplierData.name}"` 
      };
    }

    // Verificar que no exista duplicado con el mismo NIT/Documento
    if (supplierData.taxId) {
      const existingTaxQuery = query(
        collection(db, SUPPLIERS_COLLECTION),
        where("taxId", "==", supplierData.taxId.trim())
      );
      
      const existingTaxDocs = await getDocs(existingTaxQuery);
      if (!existingTaxDocs.empty) {
        return { 
          success: false, 
          error: `Ya existe un proveedor con el NIT/Documento "${supplierData.taxId}"` 
        };
      }
    }

    const newSupplier = {
      // Información básica
      name: supplierData.name.trim(),
      taxId: supplierData.taxId?.trim() || '',
      type: supplierData.type || 'proveedor', // proveedor, distribuidor, mayorista
      category: supplierData.category || 'combustibles', // combustibles, lubricantes, aditivos
      
      // Información de contacto
      contactPerson: supplierData.contactPerson?.trim() || '',
      phone: supplierData.phone?.trim() || '',
      email: supplierData.email?.trim() || '',
      address: supplierData.address?.trim() || '',
      city: supplierData.city?.trim() || '',
      state: supplierData.state?.trim() || 'Colombia',
      
      // Productos que suministra
      fuelTypes: supplierData.fuelTypes || [], // Array de tipos de combustible
      
      // Información comercial
      paymentTerms: supplierData.paymentTerms || 'contado', // contado, 30dias, 60dias, 90dias
      creditLimit: Number(supplierData.creditLimit) || 0,
      priceList: supplierData.priceList || {}, // Objeto con precios por tipo combustible
      
      // Evaluación y rating
      rating: Number(supplierData.rating) || 5, // 1-5 estrellas
      evaluationNotes: supplierData.evaluationNotes || '',
      
      // Estados y configuración
      status: supplierData.status || 'active', // active, inactive, suspended
      isPreferred: supplierData.isPreferred || false,
      
      // Estadísticas (calculadas)
      totalOrders: 0,
      totalPurchased: 0,
      lastOrderDate: null,
      averageDeliveryTime: 0, // en días
      
      // Metadatos
      createdAt: new Date(),
      createdBy: createdBy,
      lastUpdated: new Date(),
      updatedBy: createdBy
    };

    const docRef = await addDoc(collection(db, SUPPLIERS_COLLECTION), newSupplier);
    
    return { 
      success: true, 
      data: { id: docRef.id, ...newSupplier },
      message: `Proveedor "${newSupplier.name}" creado exitosamente`
    };
  } catch (error) {
    console.error("Error creating supplier:", error);
    return { success: false, error: error.message };
  }
};

/**
 * CRUD OPERATIONS - READ
 */

/**
 * Obtener todos los proveedores
 * @returns {Object} - Lista de proveedores
 */
export const getAllSuppliers = async () => {
  try {
    const q = query(
      collection(db, SUPPLIERS_COLLECTION),
      orderBy("name", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const suppliers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: suppliers };
  } catch (error) {
    console.error("Error getting suppliers:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener proveedor por ID
 * @param {string} supplierId - ID del proveedor
 * @returns {Object} - Datos del proveedor
 */
export const getSupplierById = async (supplierId) => {
  try {
    const docRef = doc(db, SUPPLIERS_COLLECTION, supplierId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { success: false, error: 'Proveedor no encontrado' };
    }
    
    return { 
      success: true, 
      data: { id: docSnap.id, ...docSnap.data() } 
    };
  } catch (error) {
    console.error("Error getting supplier:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener proveedores por tipo de combustible
 * @param {string} fuelType - Tipo de combustible
 * @returns {Object} - Lista de proveedores
 */
export const getSuppliersByFuelType = async (fuelType) => {
  try {
    const q = query(
      collection(db, SUPPLIERS_COLLECTION),
      where("fuelTypes", "array-contains", fuelType),
      where("status", "==", "active"),
      orderBy("rating", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const suppliers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: suppliers };
  } catch (error) {
    console.error("Error getting suppliers by fuel type:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Suscribirse a cambios en tiempo real de proveedores
 * @param {Function} callback - Función callback para cambios
 * @returns {Function} - Función para cancelar suscripción
 */
export const subscribeToSuppliers = (callback) => {
  const q = query(
    collection(db, SUPPLIERS_COLLECTION),
    orderBy("name", "asc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const suppliers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(suppliers);
  });
};

/**
 * CRUD OPERATIONS - UPDATE
 */

/**
 * Actualizar proveedor
 * @param {string} supplierId - ID del proveedor
 * @param {Object} updateData - Datos a actualizar
 * @param {string} updatedBy - Usuario que actualiza
 * @returns {Object} - Resultado de la operación
 */
export const updateSupplier = async (supplierId, updateData, updatedBy) => {
  try {
    // Verificar que el proveedor existe
    const supplierDoc = await getDoc(doc(db, SUPPLIERS_COLLECTION, supplierId));
    if (!supplierDoc.exists()) {
      return { success: false, error: 'Proveedor no encontrado' };
    }

    // Si se actualiza el nombre, verificar duplicados
    if (updateData.name && updateData.name.trim() !== supplierDoc.data().name) {
      const existingQuery = query(
        collection(db, SUPPLIERS_COLLECTION),
        where("name", "==", updateData.name.trim())
      );
      
      const existingDocs = await getDocs(existingQuery);
      if (!existingDocs.empty) {
        return { 
          success: false, 
          error: `Ya existe un proveedor con el nombre "${updateData.name}"` 
        };
      }
    }

    // Si se actualiza el NIT, verificar duplicados
    if (updateData.taxId && updateData.taxId.trim() !== supplierDoc.data().taxId) {
      const existingTaxQuery = query(
        collection(db, SUPPLIERS_COLLECTION),
        where("taxId", "==", updateData.taxId.trim())
      );
      
      const existingTaxDocs = await getDocs(existingTaxQuery);
      if (!existingTaxDocs.empty) {
        return { 
          success: false, 
          error: `Ya existe un proveedor con el NIT/Documento "${updateData.taxId}"` 
        };
      }
    }

    const updatePayload = {
      ...updateData,
      lastUpdated: new Date(),
      updatedBy: updatedBy
    };

    // Limpiar campos de texto si existen
    if (updatePayload.name) updatePayload.name = updatePayload.name.trim();
    if (updatePayload.taxId) updatePayload.taxId = updatePayload.taxId.trim();
    if (updatePayload.contactPerson) updatePayload.contactPerson = updatePayload.contactPerson.trim();
    if (updatePayload.phone) updatePayload.phone = updatePayload.phone.trim();
    if (updatePayload.email) updatePayload.email = updatePayload.email.trim();

    await updateDoc(doc(db, SUPPLIERS_COLLECTION, supplierId), updatePayload);
    
    return { 
      success: true, 
      message: 'Proveedor actualizado exitosamente' 
    };
  } catch (error) {
    console.error("Error updating supplier:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar rating y evaluación de proveedor
 * @param {string} supplierId - ID del proveedor
 * @param {number} rating - Rating 1-5
 * @param {string} evaluationNotes - Notas de evaluación
 * @param {string} updatedBy - Usuario que evalúa
 * @returns {Object} - Resultado de la operación
 */
export const updateSupplierRating = async (supplierId, rating, evaluationNotes, updatedBy) => {
  try {
    if (rating < 1 || rating > 5) {
      return { success: false, error: 'El rating debe estar entre 1 y 5' };
    }

    await updateDoc(doc(db, SUPPLIERS_COLLECTION, supplierId), {
      rating: Number(rating),
      evaluationNotes: evaluationNotes || '',
      lastUpdated: new Date(),
      updatedBy: updatedBy
    });
    
    return { 
      success: true, 
      message: 'Evaluación de proveedor actualizada exitosamente' 
    };
  } catch (error) {
    console.error("Error updating supplier rating:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualizar precios de proveedor
 * @param {string} supplierId - ID del proveedor
 * @param {Object} priceList - Lista de precios por tipo de combustible
 * @param {string} updatedBy - Usuario que actualiza
 * @returns {Object} - Resultado de la operación
 */
export const updateSupplierPrices = async (supplierId, priceList, updatedBy) => {
  try {
    await updateDoc(doc(db, SUPPLIERS_COLLECTION, supplierId), {
      priceList: priceList,
      lastUpdated: new Date(),
      updatedBy: updatedBy
    });
    
    return { 
      success: true, 
      message: 'Precios de proveedor actualizados exitosamente' 
    };
  } catch (error) {
    console.error("Error updating supplier prices:", error);
    return { success: false, error: error.message };
  }
};

/**
 * CRUD OPERATIONS - DELETE
 */

/**
 * Eliminar proveedor (soft delete)
 * @param {string} supplierId - ID del proveedor
 * @param {string} deletedBy - Usuario que elimina
 * @returns {Object} - Resultado de la operación
 */
export const deleteSupplier = async (supplierId, deletedBy) => {
  try {
    // Soft delete - cambiar status a inactive
    await updateDoc(doc(db, SUPPLIERS_COLLECTION, supplierId), {
      status: 'inactive',
      lastUpdated: new Date(),
      updatedBy: deletedBy
    });
    
    return { 
      success: true, 
      message: 'Proveedor desactivado exitosamente' 
    };
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Eliminar proveedor permanentemente (hard delete)
 * @param {string} supplierId - ID del proveedor
 * @returns {Object} - Resultado de la operación
 */
export const permanentDeleteSupplier = async (supplierId) => {
  try {
    await deleteDoc(doc(db, SUPPLIERS_COLLECTION, supplierId));
    
    return { 
      success: true, 
      message: 'Proveedor eliminado permanentemente' 
    };
  } catch (error) {
    console.error("Error permanently deleting supplier:", error);
    return { success: false, error: error.message };
  }
};

/**
 * UTILITY FUNCTIONS
 */

/**
 * Obtener estadísticas de proveedores
 * @returns {Object} - Estadísticas generales
 */
export const getSuppliersStats = async () => {
  try {
    const allSuppliers = await getAllSuppliers();
    if (!allSuppliers.success) {
      return allSuppliers;
    }

    const suppliers = allSuppliers.data;
    const stats = {
      total: suppliers.length,
      active: suppliers.filter(s => s.status === 'active').length,
      inactive: suppliers.filter(s => s.status === 'inactive').length,
      suspended: suppliers.filter(s => s.status === 'suspended').length,
      preferred: suppliers.filter(s => s.isPreferred).length,
      averageRating: suppliers.length > 0 
        ? suppliers.reduce((sum, s) => sum + (s.rating || 0), 0) / suppliers.length 
        : 0,
      byCategory: {},
      byType: {}
    };

    // Estadísticas por categoría
    suppliers.forEach(supplier => {
      const category = supplier.category || 'sin_categoria';
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    });

    // Estadísticas por tipo
    suppliers.forEach(supplier => {
      const type = supplier.type || 'sin_tipo';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error getting suppliers stats:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Buscar proveedores
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Object} - Proveedores encontrados
 */
export const searchSuppliers = async (searchTerm) => {
  try {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return getAllSuppliers();
    }

    const term = searchTerm.toLowerCase().trim();
    const allSuppliers = await getAllSuppliers();
    
    if (!allSuppliers.success) {
      return allSuppliers;
    }

    const filteredSuppliers = allSuppliers.data.filter(supplier => 
      supplier.name?.toLowerCase().includes(term) ||
      supplier.taxId?.toLowerCase().includes(term) ||
      supplier.contactPerson?.toLowerCase().includes(term) ||
      supplier.email?.toLowerCase().includes(term) ||
      supplier.city?.toLowerCase().includes(term)
    );

    return { success: true, data: filteredSuppliers };
  } catch (error) {
    console.error("Error searching suppliers:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Comparar precios entre proveedores
 * @param {string} fuelType - Tipo de combustible
 * @returns {Object} - Comparación de precios
 */
export const compareSupplierPrices = async (fuelType) => {
  try {
    const suppliersResult = await getSuppliersByFuelType(fuelType);
    if (!suppliersResult.success) {
      return suppliersResult;
    }

    const suppliers = suppliersResult.data;
    const priceComparison = suppliers
      .filter(supplier => supplier.priceList && supplier.priceList[fuelType])
      .map(supplier => ({
        supplierId: supplier.id,
        supplierName: supplier.name,
        price: supplier.priceList[fuelType],
        rating: supplier.rating,
        paymentTerms: supplier.paymentTerms,
        isPreferred: supplier.isPreferred
      }))
      .sort((a, b) => a.price - b.price); // Ordenar por precio ascendente

    return { success: true, data: priceComparison };
  } catch (error) {
    console.error("Error comparing supplier prices:", error);
    return { success: false, error: error.message };
  }
};