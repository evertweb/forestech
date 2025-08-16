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
  runTransaction,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { preciseAdd, preciseSubtract, preciseRound } from '../utils/calculations';
import { OPERATIONAL_LOCATIONS } from '../constants/locations';

const COLLECTION_NAME = 'combustibles_movements';
const INVENTORY_COLLECTION = 'combustibles_inventory';

// Tipos de movimientos
export const MOVEMENT_TYPES = {
  ENTRADA: 'entrada', // Compras, reabastecimientos
  SALIDA: 'salida', // Consumo por vehículos
  TRANSFERENCIA: 'transferencia', // Entre tanques/ubicaciones
  AJUSTE: 'ajuste', // Mermas, pérdidas, calibraciones
  MANTENIMIENTO: 'mantenimiento', // Mantenimiento de vehículos con combustible
};

// Estados de movimiento
export const MOVEMENT_STATUS = {
  PENDIENTE: 'pendiente',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
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

    // ✅ PREPARAR DATOS DEL MOVIMIENTO EN EL ORDEN OPTIMIZADO PARA SALIDAS
    // Orden: fecha → tipo → producto → vehículo → cantidad → precio → detalles
    const movement = {
      // 1. FECHA (efectiveDate) - Campo principal para ordenamiento
      effectiveDate: movementData.effectiveDate || serverTimestamp(),

      // 2. TIPO DE MOVIMIENTO
      type: movementData.type,

      // 3. PRODUCTO (fuelType)
      fuelType: movementData.fuelType,

      // 4. VEHÍCULO (para salidas)
      ...(movementData.type === MOVEMENT_TYPES.SALIDA &&
        movementData.vehicleId && {
          vehicleId: movementData.vehicleId,
          currentHours: movementData.currentHours || null,
        }),

      // 5. CANTIDAD
      quantity: movementData.quantity,

      // 6. PRECIO
      unitPrice: movementData.unitPrice,
      totalValue: calculateMovementValue(movementData),

      // 7. UBICACIONES (según tipo de movimiento)
      ...(movementData.location && { location: movementData.location }),
      ...(movementData.destinationLocation && {
        destinationLocation: movementData.destinationLocation,
      }),
      ...(movementData.supplierName && { supplierName: movementData.supplierName }),

      // 8. DETALLES ADICIONALES
      ...(movementData.description && { description: movementData.description }),
      ...(movementData.reference && { reference: movementData.reference }),
      ...(movementData.additionalComments && {
        additionalComments: movementData.additionalComments,
      }),

      // 9. METADATOS DEL SISTEMA (al final)
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: MOVEMENT_STATUS.COMPLETADO,
      approvedAt: serverTimestamp(),
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

    // ✅ Track Firebase read
    // Firebase read tracked
    const querySnapshot = await getDocs(q);
    const movements = [];

    querySnapshot.forEach((doc) => {
      movements.push({
        id: doc.id,
        ...doc.data(),
        // Convertir timestamps para el frontend
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
        effectiveDate: doc.data().effectiveDate?.toDate?.() || doc.data().effectiveDate,
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
    // ✅ Track Firebase read
    // Firebase read tracked
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.() || docSnap.data().createdAt,
      updatedAt: docSnap.data().updatedAt?.toDate?.() || docSnap.data().updatedAt,
      effectiveDate: docSnap.data().effectiveDate?.toDate?.() || docSnap.data().effectiveDate,
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
      ...(updateData.quantity || updateData.unitPrice
        ? {
            totalValue: calculateMovementValue(updateData),
          }
        : {}),
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

    return onSnapshot(
      q,
      (querySnapshot) => {
        const movements = [];
        querySnapshot.forEach((doc) => {
          movements.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
            updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
            effectiveDate: doc.data().effectiveDate?.toDate?.() || doc.data().effectiveDate,
          });
        });
        callback(movements);
      },
      (error) => {
        console.error('❌ Error en suscripción de movimientos:', error);
        callback([], error);
      }
    );
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
        updatedAt: serverTimestamp(),
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
      thisWeek: 0,
    };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    movements.forEach((movement) => {
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
 * ✅ Validar si una ubicación es válida según las ubicaciones operacionales
 * @param {string} location - Ubicación a validar
 * @returns {boolean} - true si es válida
 */
const isValidLocation = (location) => {
  if (!location) return false;
  return OPERATIONAL_LOCATIONS.includes(location.toLowerCase());
};

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

  // ✅ Validaciones específicas para entradas
  if (movementData.type === MOVEMENT_TYPES.ENTRADA) {
    if (!movementData.supplierName) {
      throw new Error('Las entradas deben tener un proveedor');
    }
    if (!movementData.destinationLocation) {
      throw new Error('Las entradas deben tener una ubicación destino');
    }
  }

  // ✅ Validar ubicaciones válidas (excepto para entradas que usan supplierName)
  if (
    movementData.type !== MOVEMENT_TYPES.ENTRADA &&
    movementData.location &&
    !isValidLocation(movementData.location)
  ) {
    throw new Error(
      `Ubicación origen inválida: ${movementData.location}. Ubicaciones válidas: ${OPERATIONAL_LOCATIONS.join(', ')}`
    );
  }

  if (movementData.destinationLocation && !isValidLocation(movementData.destinationLocation)) {
    throw new Error(
      `Ubicación destino inválida: ${movementData.destinationLocation}. Ubicaciones válidas: ${OPERATIONAL_LOCATIONS.join(', ')}`
    );
  }

  // ✅ Validar que origen y destino sean diferentes en transferencias
  if (movementData.type === MOVEMENT_TYPES.TRANSFERENCIA) {
    const origin = (movementData.location || 'principal').toLowerCase();
    const destination = movementData.destinationLocation.toLowerCase();

    if (origin === destination) {
      throw new Error('La ubicación origen y destino no pueden ser la misma en una transferencia');
    }
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
        throw new Error(
          `No se encontró inventario para ${movement.fuelType} en ${targetLocation} para realizar un movimiento de ${movement.type}.`
        );
      }

      console.log(
        `📦 Creando inventario automático para ${movement.fuelType} en ${targetLocation}`
      );

      const inventoryRef = doc(collection(db, INVENTORY_COLLECTION));
      const newInventoryData = {
        fuelType: movement.fuelType,
        location: targetLocation,
        name: movement.fuelType, // Asignar un nombre por defecto
        maxCapacity: 1000, // ✅ Capacidad ajustada para bodegas Austria e Ilusión
        currentStock: preciseRound(movement.quantity, 2), // Iniciar con la cantidad del movimiento usando precisión
        minThreshold: 150, // ✅ 15% de la capacidad por defecto (ajustado a nueva capacidad)
        pricePerUnit: movement.unitPrice || 0, // ✅ Usar pricePerUnit consistente
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active', // ✅ Usar status consistente con inventoryService
        lastMovement: {
          movementId,
          type: movement.type,
          quantity: movement.quantity,
          date: serverTimestamp(),
        },
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

          // ✅ IMPLEMENTAR SUMA AL DESTINO
          await handleTransferToDestination(transaction, movement, movementId);
          break;
        case MOVEMENT_TYPES.MANTENIMIENTO:
          // Para mantenimiento, funciona como una salida
          newQuantity = preciseSubtract(newQuantity, movement.quantity);
          if (newQuantity < 0) {
            throw new Error('Stock insuficiente para realizar el mantenimiento');
          }
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
          date: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });
    }

    // Actualizar horómetro del vehículo para salidas y mantenimientos
    if (
      (movement.type === MOVEMENT_TYPES.SALIDA || movement.type === MOVEMENT_TYPES.MANTENIMIENTO) &&
      movement.vehicleId &&
      movement.currentHours
    ) {
      await updateVehicleHourMeter(transaction, movement.vehicleId, movement.currentHours);
    }

    // Guardar datos específicos de mantenimiento si aplica
    if (movement.type === MOVEMENT_TYPES.MANTENIMIENTO) {
      await saveMaintenanceData(transaction, movement, movementId);
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
        throw new Error(
          `No se puede revertir: no existe inventario para ${movement.fuelType} en ninguna ubicación. Movimiento huérfano detectado.`
        );
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
          console.warn(
            '⚠️ Advertencia: La reversión de ajuste resulta en stock negativo, ajustando a 0'
          );
          newQuantity = 0;
        }
        break;

      case MOVEMENT_TYPES.TRANSFERENCIA:
        // Revertir transferencia: sumar la cantidad que se había restado del origen
        newQuantity = preciseAdd(newQuantity, movement.quantity);

        // ✅ TAMBIÉN REVERTIR DEL DESTINO
        await revertTransferFromDestination(transaction, movement);
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
        note: `Reversión de movimiento ${movement.id} - Ubicación original: ${movement.location || movement.destinationLocation || 'no especificada'}`,
      },
      updatedAt: serverTimestamp(),
    });

    console.log(
      `✅ Inventario revertido exitosamente. Stock anterior: ${inventoryData.currentStock}, Nuevo stock: ${newQuantity}`
    );
  } catch (error) {
    console.error('❌ Error en procesamiento de reversión:', error);
    throw error;
  }
};

/**
 * ✅ Manejar suma de inventario en ubicación destino durante transferencias
 * @param {Transaction} transaction - Transacción Firestore
 * @param {Object} movement - Datos del movimiento de transferencia
 * @param {string} movementId - ID del movimiento
 */
const handleTransferToDestination = async (transaction, movement, movementId) => {
  try {
    if (!movement.destinationLocation) {
      throw new Error('Ubicación destino requerida para transferencias');
    }

    console.log(
      `🔄 Transfiriendo ${movement.quantity} ${movement.fuelType} a ${movement.destinationLocation}`
    );

    // Buscar inventario destino
    const destinationQuery = query(
      collection(db, INVENTORY_COLLECTION),
      where('fuelType', '==', movement.fuelType),
      where('location', '==', movement.destinationLocation)
    );

    const destinationSnapshot = await getDocs(destinationQuery);

    if (destinationSnapshot.empty) {
      // Crear inventario automáticamente en destino
      console.log(
        `📦 Creando inventario automático en destino: ${movement.fuelType} en ${movement.destinationLocation}`
      );

      const inventoryRef = doc(collection(db, INVENTORY_COLLECTION));
      const newInventoryData = {
        fuelType: movement.fuelType,
        location: movement.destinationLocation,
        name: movement.fuelType,
        maxCapacity: 1000, // ✅ Capacidad ajustada para bodegas Austria e Ilusión
        currentStock: preciseRound(movement.quantity, 2), // Iniciar con la cantidad transferida
        minThreshold: 150, // ✅ Umbral mínimo ajustado (15% de 1000 galones)
        pricePerUnit: movement.unitPrice || 0, // ✅ Usar pricePerUnit consistente
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active', // ✅ Usar status consistente
        lastMovement: {
          movementId,
          type: 'transferencia_entrada',
          quantity: movement.quantity,
          date: serverTimestamp(),
          originLocation: movement.location,
        },
      };

      transaction.set(inventoryRef, newInventoryData);
    } else {
      // Sumar al inventario existente en destino
      const destinationDoc = destinationSnapshot.docs[0];
      const destinationData = destinationDoc.data();
      const destinationRef = doc(db, INVENTORY_COLLECTION, destinationDoc.id);

      const newQuantity = preciseRound(
        preciseAdd(destinationData.currentStock, movement.quantity),
        2
      );

      transaction.update(destinationRef, {
        currentStock: newQuantity,
        lastMovement: {
          movementId,
          type: 'transferencia_entrada',
          quantity: movement.quantity,
          date: serverTimestamp(),
          originLocation: movement.location,
        },
        updatedAt: serverTimestamp(),
      });
    }

    console.log(`✅ Transferencia al destino completada exitosamente`);
  } catch (error) {
    console.error('❌ Error al transferir a destino:', error);
    throw new Error(`Error en transferencia a destino: ${error.message}`);
  }
};

/**
 * ✅ Revertir suma de inventario en ubicación destino al eliminar transferencias
 * @param {Transaction} transaction - Transacción Firestore
 * @param {Object} movement - Movimiento de transferencia a revertir
 */
const revertTransferFromDestination = async (transaction, movement) => {
  try {
    if (!movement.destinationLocation) {
      console.warn('⚠️ No hay ubicación destino para revertir');
      return;
    }

    console.log(`🔄 Revirtiendo transferencia en destino: ${movement.destinationLocation}`);

    // Buscar inventario destino
    const destinationQuery = query(
      collection(db, INVENTORY_COLLECTION),
      where('fuelType', '==', movement.fuelType),
      where('location', '==', movement.destinationLocation)
    );

    const destinationSnapshot = await getDocs(destinationQuery);

    if (destinationSnapshot.empty) {
      console.warn(
        `⚠️ No se encontró inventario destino para revertir: ${movement.fuelType} en ${movement.destinationLocation}`
      );
      return;
    }

    const destinationDoc = destinationSnapshot.docs[0];
    const destinationData = destinationDoc.data();
    const destinationRef = doc(db, INVENTORY_COLLECTION, destinationDoc.id);

    // Restar la cantidad que se había sumado
    let newQuantity = preciseSubtract(destinationData.currentStock, movement.quantity);
    if (newQuantity < 0) {
      console.warn(
        '⚠️ Advertencia: La reversión en destino resulta en stock negativo, ajustando a 0'
      );
      newQuantity = 0;
    }

    newQuantity = preciseRound(newQuantity, 2);

    transaction.update(destinationRef, {
      currentStock: newQuantity,
      lastMovement: {
        movementId: null,
        type: 'reversion_transferencia',
        quantity: movement.quantity,
        date: serverTimestamp(),
        note: `Reversión de transferencia desde ${movement.location}`,
      },
      updatedAt: serverTimestamp(),
    });

    console.log(`✅ Reversión en destino completada exitosamente`);
  } catch (error) {
    console.error('❌ Error al revertir transferencia en destino:', error);
    throw new Error(`Error al revertir destino: ${error.message}`);
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
      console.warn(
        `⚠️ Nueva lectura horómetro (${newHours}) menor a la anterior (${previousHours}). Actualizando de todas formas.`
      );
    }

    // Crear registro de historial de horómetro
    const hourMeterHistory = vehicleData.hourMeterHistory || [];
    hourMeterHistory.push({
      previousHours: previousHours,
      newHours: newHours,
      difference: newHours - previousHours,
      updatedAt: new Date(),
      updatedBy: 'movement_service',
      source: 'fuel_consumption',
    });

    // Actualizar vehículo con nueva lectura
    transaction.update(vehicleRef, {
      currentHours: newHours,
      hourMeterHistory: hourMeterHistory,
      lastHourMeterUpdate: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`✅ Horómetro actualizado: ${vehicleId} - ${previousHours}h → ${newHours}h`);
  } catch (error) {
    console.error('❌ Error al actualizar horómetro del vehículo:', error);
    // No hacer throw para no afectar el movimiento principal
    console.warn('⚠️ Continuando con el movimiento sin actualización de horómetro');
  }
};

/**
 * Guardar datos específicos de mantenimiento en una colección separada
 * @param {Transaction} transaction - Transacción Firestore
 * @param {Object} movement - Datos del movimiento de mantenimiento
 * @param {string} movementId - ID del movimiento
 */
const saveMaintenanceData = async (transaction, movement, movementId) => {
  try {
    console.log(`🔧 Guardando datos de mantenimiento para movimiento ${movementId}`);

    // Crear un documento en la colección de mantenimiento
    const maintenanceRef = doc(collection(db, 'combustibles_maintenance'));

    const maintenanceData = {
      // Referencia al movimiento
      movementId,
      movementType: movement.type,

      // Datos del vehículo
      vehicleId: movement.vehicleId,
      vehicleName: movement.vehicleName,

      // Datos básicos del mantenimiento
      type: movement.maintenanceType || 'preventivo',
      priority: movement.maintenancePriority || 'media',
      title: movement.maintenanceTitle || 'Mantenimiento con combustible',
      description: movement.maintenanceDescription || '',
      notes: movement.maintenanceNotes || '',

      // Costos y tiempo
      hours: movement.maintenanceHours || 0,
      laborCost: movement.maintenanceCost || 0,
      technician: movement.maintenanceTechnician || '',

      // Partes y repuestos
      parts: movement.maintenanceParts || [],
      totalPartsCost: (movement.maintenanceParts || []).reduce(
        (sum, part) => sum + (part.total || 0),
        0
      ),

      // Combustible utilizado
      fuelType: movement.fuelType,
      fuelQuantity: movement.quantity,
      fuelCost: (movement.quantity || 0) * (movement.unitPrice || 0),

      // Horómetro
      currentHours: movement.currentHours,

      // Fechas
      scheduledDate: movement.effectiveDate || new Date(),
      completedDate: movement.effectiveDate || new Date(),

      // Metadatos
      status: 'completado', // Como se registra después del hecho
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: movement.createdBy || 'system',
    };

    // Calcular costo total
    maintenanceData.totalCost =
      (maintenanceData.laborCost || 0) +
      (maintenanceData.totalPartsCost || 0) +
      (maintenanceData.fuelCost || 0);

    transaction.set(maintenanceRef, maintenanceData);

    console.log(`✅ Datos de mantenimiento guardados exitosamente`);
  } catch (error) {
    console.error('❌ Error al guardar datos de mantenimiento:', error);
    // No hacer throw para no afectar el movimiento principal
    console.warn('⚠️ Continuando con el movimiento sin guardar datos de mantenimiento');
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
  MOVEMENT_STATUS,
};
