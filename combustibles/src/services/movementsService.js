/**
 * MovementsService - Servicio para gestión de movimientos de combustibles
 * Maneja entradas, salidas, transferencias y ajustes de inventario
 */

import { 
  collection, 
  updateDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  where,
  onSnapshot,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { preciseAdd, preciseSubtract, preciseRound } from '../utils/calculations';

const COLLECTION_NAME = 'combustibles_movements';
const INVENTORY_COLLECTION = 'combustibles_inventory';

// Tipos de movimientos
export const MOVEMENT_TYPES = {
  ENTRADA: 'entrada',           // Compras, reabastecimientos
  SALIDA: 'salida',            // Consumo por vehículos
  TRANSFERENCIA: 'transferencia', // Entre tanques/ubicaciones
  AJUSTE: 'ajuste'             // Mermas, pérdidas, calibraciones
};

// Estados de movimiento
export const MOVEMENT_STATUS = {
  PENDIENTE: 'pendiente',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado'
};

/**
 * Crear un nuevo movimiento de combustible
 * @param {Object} movementData - Datos del movimiento
 * @returns {Promise<string>} - ID del movimiento creado
 */
export const createMovement = async (movementData) => {
  try {
    // Validar datos requeridos
    validateMovementData(movementData);

    // Preparar datos del movimiento
    const movement = {
      ...movementData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: MOVEMENT_STATUS.COMPLETADO, // Marcar como completado ya que se actualiza inventario automáticamente
      approvedAt: serverTimestamp(), // Marcar como aprobado automáticamente
      // Campos calculados
      totalValue: calculateMovementValue(movementData),
      effectiveDate: movementData.effectiveDate || serverTimestamp()
    };

    // Crear movimiento en transacción para actualizar inventario
    const result = await runTransaction(db, async (transaction) => {
      // Crear el movimiento
      const movementRef = doc(collection(db, COLLECTION_NAME));
      transaction.set(movementRef, movement);

      // Actualizar inventario según el tipo de movimiento
      await updateInventoryFromMovement(transaction, movement, movementRef.id);

      return movementRef.id;
    });

    console.log('✅ Movimiento creado exitosamente:', result);
    return result;

  } catch (error) {
    console.error('❌ Error al crear movimiento:', error);
    throw new Error(`Error al crear movimiento: ${error.message}`);
  }
};

/**
 * Obtener todos los movimientos con filtros opcionales
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Array>} - Lista de movimientos
 */
export const getAllMovements = async (filters = {}) => {
  try {
    let q = collection(db, COLLECTION_NAME);

    // Aplicar filtros
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.fuelType) {
      q = query(q, where('fuelType', '==', filters.fuelType));
    }
    if (filters.vehicleId) {
      q = query(q, where('vehicleId', '==', filters.vehicleId));
    }

    // Ordenar por fecha (más recientes primero)
    q = query(q, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const movements = [];

    querySnapshot.forEach((doc) => {
      movements.push({
        id: doc.id,
        ...doc.data(),
        // Convertir timestamps para el frontend
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
        effectiveDate: doc.data().effectiveDate?.toDate?.() || doc.data().effectiveDate
      });
    });

    return movements;

  } catch (error) {
    console.error('❌ Error al obtener movimientos:', error);
    throw new Error(`Error al obtener movimientos: ${error.message}`);
  }
};

/**
 * Obtener un movimiento específico por ID
 * @param {string} movementId - ID del movimiento
 * @returns {Promise<Object|null>} - Datos del movimiento
 */
export const getMovement = async (movementId) => {
  try {
    if (!movementId) {
      throw new Error('ID de movimiento requerido');
    }

    const docRef = doc(db, COLLECTION_NAME, movementId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.() || docSnap.data().createdAt,
      updatedAt: docSnap.data().updatedAt?.toDate?.() || docSnap.data().updatedAt,
      effectiveDate: docSnap.data().effectiveDate?.toDate?.() || docSnap.data().effectiveDate
    };

  } catch (error) {
    console.error('❌ Error al obtener movimiento:', error);
    throw new Error(`Error al obtener movimiento: ${error.message}`);
  }
};

/**
 * Actualizar un movimiento existente
 * @param {string} movementId - ID del movimiento
 * @param {Object} updateData - Datos a actualizar
 * @returns {Promise<void>}
 */
export const updateMovement = async (movementId, updateData) => {
  try {
    if (!movementId) {
      throw new Error('ID de movimiento requerido');
    }

    // Preparar datos de actualización
    const updatedData = {
      ...updateData,
      updatedAt: serverTimestamp(),
      // Recalcular valor si cambian cantidades o precios
      ...(updateData.quantity || updateData.unitPrice ? {
        totalValue: calculateMovementValue(updateData)
      } : {})
    };

    const docRef = doc(db, COLLECTION_NAME, movementId);
    await updateDoc(docRef, updatedData);

    console.log('✅ Movimiento actualizado exitosamente');

  } catch (error) {
    console.error('❌ Error al actualizar movimiento:', error);
    throw new Error(`Error al actualizar movimiento: ${error.message}`);
  }
};

/**
 * Eliminar un movimiento y revertir su impacto en el inventario.
 * @param {string} movementId - ID del movimiento
 * @returns {Promise<void>}
 */
export const deleteMovement = async (movementId) => {
  try {
    if (!movementId) {
      throw new Error('ID de movimiento requerido');
    }

    // Obtener el movimiento para poder revertirlo
    const movement = await getMovement(movementId);
    if (!movement) {
      throw new Error('Movimiento no encontrado');
    }

    // Se permite eliminar movimientos en cualquier estado, 
    // revirtiendo el inventario si ya estaba completado.

    await runTransaction(db, async (transaction) => {
      const docRef = doc(db, COLLECTION_NAME, movementId);
      
      // Si el movimiento ya había afectado el inventario, revertir los cambios.
      if (movement.status === MOVEMENT_STATUS.COMPLETADO) {
        await revertInventoryChanges(transaction, movement);
      }
      
      // Finalmente, eliminar el documento del movimiento.
      transaction.delete(docRef);
    });

    console.log('✅ Movimiento eliminado y cambios de inventario revertidos exitosamente');

  } catch (error) {
    console.error('❌ Error al eliminar movimiento:', error);
    throw new Error(`Error al eliminar movimiento: ${error.message}`);
  }
};

/**
 * Suscribirse a cambios en tiempo real de movimientos
 * @param {Function} callback - Función a ejecutar cuando hay cambios
 * @param {Object} filters - Filtros opcionales
 * @returns {Function} - Función para cancelar la suscripción
 */
export const subscribeToMovements = (callback, filters = {}) => {
  try {
    let q = collection(db, COLLECTION_NAME);

    // Aplicar filtros
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    // Ordenar por fecha
    q = query(q, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
      const movements = [];
      querySnapshot.forEach((doc) => {
        movements.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
          effectiveDate: doc.data().effectiveDate?.toDate?.() || doc.data().effectiveDate
        });
      });
      callback(movements);
    }, (error) => {
      console.error('❌ Error en suscripción de movimientos:', error);
      callback([], error);
    });

  } catch (error) {
    console.error('❌ Error al configurar suscripción:', error);
    throw new Error(`Error en suscripción: ${error.message}`);
  }
};

/**
 * Aprobar/completar un movimiento pendiente
 * @param {string} movementId - ID del movimiento
 * @returns {Promise<void>}
 */
export const approveMovement = async (movementId) => {
  try {
    const movement = await getMovement(movementId);
    if (!movement) {
      throw new Error('Movimiento no encontrado');
    }

    if (movement.status !== MOVEMENT_STATUS.PENDIENTE) {
      throw new Error('Solo se pueden aprobar movimientos pendientes');
    }

    await runTransaction(db, async (transaction) => {
      const docRef = doc(db, COLLECTION_NAME, movementId);
      
      // Actualizar estado a completado
      transaction.update(docRef, {
        status: MOVEMENT_STATUS.COMPLETADO,
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Actualizar inventario
      await updateInventoryFromMovement(transaction, movement, movementId);
    });

    console.log('✅ Movimiento aprobado exitosamente');

  } catch (error) {
    console.error('❌ Error al aprobar movimiento:', error);
    throw new Error(`Error al aprobar movimiento: ${error.message}`);
  }
};

/**
 * Obtener estadísticas de movimientos
 * @param {Object} filters - Filtros de período
 * @returns {Promise<Object>} - Estadísticas calculadas
 */
export const getMovementsStats = async (filters = {}) => {
  try {
    const movements = await getAllMovements(filters);

    // Calcular estadísticas
    const stats = {
      totalMovements: movements.length,
      byType: {},
      byStatus: {},
      byFuelType: {},
      totalValue: 0,
      totalQuantity: 0,
      averageValue: 0,
      // Estadísticas por período
      thisMonth: 0,
      lastMonth: 0,
      thisWeek: 0
    };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    movements.forEach(movement => {
      // Por tipo
      stats.byType[movement.type] = (stats.byType[movement.type] || 0) + 1;
      
      // Por estado
      stats.byStatus[movement.status] = (stats.byStatus[movement.status] || 0) + 1;
      
      // Por tipo de combustible
      stats.byFuelType[movement.fuelType] = (stats.byFuelType[movement.fuelType] || 0) + 1;
      
      // Totales
      stats.totalValue += movement.totalValue || 0;
      stats.totalQuantity += movement.quantity || 0;

      // Por período
      const movementDate = new Date(movement.createdAt);
      if (movementDate >= startOfMonth) {
        stats.thisMonth++;
      }
      if (movementDate >= startOfLastMonth && movementDate < startOfMonth) {
        stats.lastMonth++;
      }
      if (movementDate >= startOfWeek) {
        stats.thisWeek++;
      }
    });

    stats.averageValue = stats.totalMovements > 0 ? stats.totalValue / stats.totalMovements : 0;

    return stats;

  } catch (error) {
    console.error('❌ Error al calcular estadísticas:', error);
    throw new Error(`Error al calcular estadísticas: ${error.message}`);
  }
};

// ============ FUNCIONES AUXILIARES ============

/**
 * Validar datos de movimiento
 * @param {Object} movementData - Datos a validar
 */
const validateMovementData = (movementData) => {
  const required = ['type', 'fuelType', 'quantity', 'unitPrice'];
  
  for (const field of required) {
    if (!movementData[field]) {
      throw new Error(`Campo requerido: ${field}`);
    }
  }

  // Validar tipo de movimiento
  if (!Object.values(MOVEMENT_TYPES).includes(movementData.type)) {
    throw new Error('Tipo de movimiento inválido');
  }

  // Validar cantidades
  if (movementData.quantity <= 0) {
    throw new Error('La cantidad debe ser mayor a cero');
  }

  if (movementData.unitPrice < 0) {
    throw new Error('El precio unitario no puede ser negativo');
  }

  // Validaciones específicas por tipo
  if (movementData.type === MOVEMENT_TYPES.SALIDA && !movementData.vehicleId) {
    throw new Error('Las salidas deben tener un vehículo asociado');
  }

  if (movementData.type === MOVEMENT_TYPES.TRANSFERENCIA && !movementData.destinationLocation) {
    throw new Error('Las transferencias deben tener una ubicación destino');
  }
};

/**
 * Calcular valor total del movimiento
 * @param {Object} movementData - Datos del movimiento
 * @returns {number} - Valor total
 */
const calculateMovementValue = (movementData) => {
  return (movementData.quantity || 0) * (movementData.unitPrice || 0);
};

/**
 * Actualizar inventario basado en movimiento
 * @param {Transaction} transaction - Transacción Firestore
 * @param {Object} movement - Datos del movimiento
 * @param {string} movementId - ID del movimiento
 */
const updateInventoryFromMovement = async (transaction, movement, movementId) => {
  try {
    // Determinar ubicación correcta según tipo de movimiento
    let targetLocation = movement.location || 'principal';
    
    // Para ENTRADA, usar destinationLocation si existe, sino ubicación principal
    if (movement.type === MOVEMENT_TYPES.ENTRADA) {
      targetLocation = movement.destinationLocation || 'principal';
    }

    // Buscar item de inventario por tipo de combustible y ubicación
    const inventoryQuery = query(
      collection(db, INVENTORY_COLLECTION),
      where('fuelType', '==', movement.fuelType),
      where('location', '==', targetLocation)
    );

    const inventorySnapshot = await getDocs(inventoryQuery);
    
    if (inventorySnapshot.empty) {
      // --- LÓGICA DE CREACIÓN ---
      // Si no existe inventario, solo se puede procesar una ENTRADA.
      if (movement.type !== MOVEMENT_TYPES.ENTRADA) {
        throw new Error(`No se encontró inventario para ${movement.fuelType} en ${targetLocation} para realizar un movimiento de ${movement.type}.`);
      }
      
      console.log(`📦 Creando inventario automático para ${movement.fuelType} en ${targetLocation}`);
      
      const inventoryRef = doc(collection(db, INVENTORY_COLLECTION));
      const newInventoryData = {
        fuelType: movement.fuelType,
        location: targetLocation,
        name: movement.fuelType, // Asignar un nombre por defecto
        capacity: 10000, // Capacidad por defecto, se puede ajustar luego
        currentStock: preciseRound(movement.quantity, 2), // Iniciar con la cantidad del movimiento usando precisión
        minStock: 1500, // 15% de la capacidad por defecto
        unitPrice: movement.unitPrice || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        lastMovement: {
          movementId,
          type: movement.type,
          quantity: movement.quantity,
          date: serverTimestamp()
        }
      };
      
      // Crear el nuevo item de inventario en la transacción
      transaction.set(inventoryRef, newInventoryData);

    } else {
      // --- LÓGICA DE ACTUALIZACIÓN ---
      // Usar inventario existente
      const inventoryDoc = inventorySnapshot.docs[0];
      const inventoryData = inventoryDoc.data();
      const inventoryRef = doc(db, INVENTORY_COLLECTION, inventoryDoc.id);
      let newQuantity = inventoryData.currentStock;

      // Aplicar cambio según tipo de movimiento usando aritmética precisa
      switch (movement.type) {
        case MOVEMENT_TYPES.ENTRADA:
          newQuantity = preciseAdd(newQuantity, movement.quantity);
          break;
        case MOVEMENT_TYPES.SALIDA:
          newQuantity = preciseSubtract(newQuantity, movement.quantity);
          if (newQuantity < 0) {
            throw new Error('Stock insuficiente para realizar la salida');
          }
          break;
        case MOVEMENT_TYPES.AJUSTE:
          newQuantity = preciseAdd(newQuantity, movement.quantity); // Puede ser positivo o negativo
          if (newQuantity < 0) newQuantity = 0;
          break;
        case MOVEMENT_TYPES.TRANSFERENCIA:
          newQuantity = preciseSubtract(newQuantity, movement.quantity);
          if (newQuantity < 0) {
            throw new Error('Stock insuficiente para realizar la transferencia');
          }
          // TODO: Agregar al destino (requiere lógica adicional)
          break;
      }

      // Redondear resultado a 2 decimales para consistencia
      newQuantity = preciseRound(newQuantity, 2);

      // Actualizar el inventario existente
      transaction.update(inventoryRef, {
        currentStock: newQuantity,
        lastMovement: {
          movementId,
          type: movement.type,
          quantity: movement.quantity,
          date: serverTimestamp()
        },
        updatedAt: serverTimestamp()
      });
    }

    // Actualizar horómetro del vehículo si es una salida y tiene datos del horómetro
    if (movement.type === MOVEMENT_TYPES.SALIDA && movement.vehicleId && movement.currentHours) {
      await updateVehicleHourMeter(transaction, movement.vehicleId, movement.currentHours);
    }

    // Actualizar horómetro del vehículo si es una salida y tiene datos del horómetro
    if (movement.type === MOVEMENT_TYPES.SALIDA && movement.vehicleId && movement.currentHours) {
      await updateVehicleHourMeter(transaction, movement.vehicleId, movement.currentHours);
    }

  } catch (error) {
    console.error('❌ Error al actualizar inventario:', error);
    throw error;
  }
};

/**
 * Revertir cambios de inventario (para eliminación de movimientos)
 * @param {Transaction} transaction - Transacción Firestore
 * @param {Object} movement - Datos del movimiento a revertir
 */
const revertInventoryChanges = async (transaction, movement) => {
  try {
    console.log('🔄 Revirtiendo cambios de inventario para movimiento:', movement.id);

    // Determinar la ubicación correcta según el tipo de movimiento
    let targetLocation;
    switch (movement.type) {
      case MOVEMENT_TYPES.ENTRADA:
        // Para ENTRADA, usar destinationLocation (donde se agregó el inventario)
        targetLocation = movement.destinationLocation || 'principal';
        break;
      case MOVEMENT_TYPES.SALIDA:
      case MOVEMENT_TYPES.AJUSTE:
        // Para SALIDA y AJUSTE, usar location (donde se modificó el inventario)
        targetLocation = movement.location || 'principal';
        break;
      case MOVEMENT_TYPES.TRANSFERENCIA:
        // Para TRANSFERENCIA, usar location (origen donde se restó)
        targetLocation = movement.location || 'principal';
        break;
      default:
        targetLocation = movement.location || movement.destinationLocation || 'principal';
    }

    console.log(`🔍 Buscando inventario: ${movement.fuelType} en ${targetLocation}`);

    // Buscar item de inventario por tipo de combustible y ubicación
    const inventoryQuery = query(
      collection(db, INVENTORY_COLLECTION),
      where('fuelType', '==', movement.fuelType),
      where('location', '==', targetLocation)
    );

    const inventorySnapshot = await getDocs(inventoryQuery);
    
    if (inventorySnapshot.empty) {
      // Si no encuentra inventario, intentar con ubicación alternativa o crear entrada
      console.warn(`⚠️ No se encontró inventario para ${movement.fuelType} en ${targetLocation}`);
      
      // Estrategia de fallback: buscar en cualquier ubicación para el mismo combustible
      const fallbackQuery = query(
        collection(db, INVENTORY_COLLECTION),
        where('fuelType', '==', movement.fuelType)
      );
      
      const fallbackSnapshot = await getDocs(fallbackQuery);
      
      if (fallbackSnapshot.empty) {
        // Si no existe inventario en ninguna ubicación, no se puede revertir
        console.error(`❌ No existe inventario para ${movement.fuelType} en ninguna ubicación`);
        throw new Error(`No se puede revertir: no existe inventario para ${movement.fuelType} en ninguna ubicación. Movimiento huérfano detectado.`);
      }
      
      // Usar el primer inventario encontrado como fallback
      console.log(`🔄 Usando inventario fallback en ${fallbackSnapshot.docs[0].data().location}`);
      const inventoryDoc = fallbackSnapshot.docs[0];
      const inventoryData = inventoryDoc.data();
      const inventoryRef = doc(db, INVENTORY_COLLECTION, inventoryDoc.id);
      
      // Proceder con la reversión usando el inventario fallback
      await processInventoryReversion(transaction, inventoryRef, inventoryData, movement);
      return;
    }

    const inventoryDoc = inventorySnapshot.docs[0];
    const inventoryData = inventoryDoc.data();
    const inventoryRef = doc(db, INVENTORY_COLLECTION, inventoryDoc.id);

    // Proceder con la reversión usando el inventario encontrado
    await processInventoryReversion(transaction, inventoryRef, inventoryData, movement);

  } catch (error) {
    console.error('❌ Error al revertir cambios de inventario:', error);
    throw new Error(`Error al revertir inventario: ${error.message}`);
  }
};

/**
 * Procesar reversión de inventario con validaciones robustas
 * @param {Transaction} transaction - Transacción Firestore
 * @param {DocumentReference} inventoryRef - Referencia al documento de inventario
 * @param {Object} inventoryData - Datos actuales del inventario
 * @param {Object} movement - Movimiento a revertir
 */
const processInventoryReversion = async (transaction, inventoryRef, inventoryData, movement) => {
  try {
    let newQuantity = inventoryData.currentStock;

    // Revertir cambio según tipo de movimiento (operación inversa) usando aritmética precisa
    switch (movement.type) {
      case MOVEMENT_TYPES.ENTRADA:
        // Revertir entrada: restar la cantidad que se había sumado
        newQuantity = preciseSubtract(newQuantity, movement.quantity);
        if (newQuantity < 0) {
          console.warn('⚠️ Advertencia: La reversión resulta en stock negativo, ajustando a 0');
          newQuantity = 0;
        }
        break;

      case MOVEMENT_TYPES.SALIDA:
        // Revertir salida: sumar la cantidad que se había restado
        newQuantity = preciseAdd(newQuantity, movement.quantity);
        break;

      case MOVEMENT_TYPES.AJUSTE:
        // Revertir ajuste: restar la cantidad que se había sumado
        newQuantity = preciseSubtract(newQuantity, movement.quantity);
        if (newQuantity < 0) {
          console.warn('⚠️ Advertencia: La reversión de ajuste resulta en stock negativo, ajustando a 0');
          newQuantity = 0;
        }
        break;

      case MOVEMENT_TYPES.TRANSFERENCIA:
        // Revertir transferencia: sumar la cantidad que se había restado del origen
        newQuantity = preciseAdd(newQuantity, movement.quantity);
        // TODO: También habría que restar del destino si se implementa lógica completa de transferencias
        break;

      default:
        throw new Error(`Tipo de movimiento no soportado para reversión: ${movement.type}`);
    }

    // Redondear resultado final para consistencia
    newQuantity = preciseRound(newQuantity, 2);

    // Actualizar inventario con los valores revertidos
    transaction.update(inventoryRef, {
      currentStock: newQuantity,
      lastMovement: {
        movementId: null, // Limpiar referencia al movimiento eliminado
        type: 'reversion',
        quantity: movement.quantity,
        originalType: movement.type,
        date: serverTimestamp(),
        note: `Reversión de movimiento ${movement.id} - Ubicación original: ${movement.location || movement.destinationLocation || 'no especificada'}`
      },
      updatedAt: serverTimestamp()
    });

    console.log(`✅ Inventario revertido exitosamente. Stock anterior: ${inventoryData.currentStock}, Nuevo stock: ${newQuantity}`);

  } catch (error) {
    console.error('❌ Error en procesamiento de reversión:', error);
    throw error;
  }
};

/**
 * Actualizar horómetro del vehículo durante movimientos de salida
 * @param {Transaction} transaction - Transacción Firestore
 * @param {string} vehicleId - ID del vehículo
 * @param {number} currentHours - Horas actuales del horómetro
 */
const updateVehicleHourMeter = async (transaction, vehicleId, currentHours) => {
  try {
    console.log(`🕒 Actualizando horómetro del vehículo ${vehicleId} a ${currentHours} horas`);

    // Buscar el vehículo por vehicleId
    const vehiclesQuery = query(
      collection(db, 'combustibles_vehicles'),
      where('vehicleId', '==', vehicleId)
    );

    const vehiclesSnapshot = await getDocs(vehiclesQuery);
    
    if (vehiclesSnapshot.empty) {
      console.warn(`⚠️ Vehículo ${vehicleId} no encontrado para actualizar horómetro`);
      return;
    }

    const vehicleDoc = vehiclesSnapshot.docs[0];
    const vehicleData = vehicleDoc.data();
    const vehicleRef = doc(db, 'combustibles_vehicles', vehicleDoc.id);

    // Validar que la nueva lectura sea mayor a la anterior
    const previousHours = parseFloat(vehicleData.currentHours) || 0;
    const newHours = parseFloat(currentHours);

    if (newHours < previousHours) {
      console.warn(`⚠️ Nueva lectura horómetro (${newHours}) menor a la anterior (${previousHours}). Actualizando de todas formas.`);
    }

    // Crear registro de historial de horómetro
    const hourMeterHistory = vehicleData.hourMeterHistory || [];
    hourMeterHistory.push({
      previousHours: previousHours,
      newHours: newHours,
      difference: newHours - previousHours,
      updatedAt: new Date(),
      updatedBy: 'movement_service',
      source: 'fuel_consumption'
    });

    // Actualizar vehículo con nueva lectura
    transaction.update(vehicleRef, {
      currentHours: newHours,
      hourMeterHistory: hourMeterHistory,
      lastHourMeterUpdate: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log(`✅ Horómetro actualizado: ${vehicleId} - ${previousHours}h → ${newHours}h`);

  } catch (error) {
    console.error('❌ Error al actualizar horómetro del vehículo:', error);
    // No hacer throw para no afectar el movimiento principal
    console.warn('⚠️ Continuando con el movimiento sin actualización de horómetro');
  }
};

export default {
  createMovement,
  getAllMovements,
  getMovement,
  updateMovement,
  deleteMovement,
  subscribeToMovements,
  approveMovement,
  getMovementsStats,
  MOVEMENT_TYPES,
  MOVEMENT_STATUS
};