/**
 * MovementsService - Servicio refactorizado para gestión de movimientos de combustibles
 * Utiliza BaseService y CRUDService para operaciones optimizadas
 * Maneja entradas, salidas, transferencias y ajustes de inventario
 */
import { CRUDService } from './base/CRUDService.js';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  runTransaction, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { preciseAdd, preciseSubtract, preciseRound } from '../utils/calculations';
import { OPERATIONAL_LOCATIONS } from '../constants/locations';

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

const INVENTORY_COLLECTION = 'combustibles_inventory';

class MovementsService extends CRUDService {
  constructor() {
    super('combustibles_movements', {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'createdAt',
      defaultOrderDirection: 'desc'
    });
  }

  validateData(data) {
    const baseValidation = super.validateData(data);
    if (!baseValidation.isValid) return baseValidation;
    
    const errors = [];
    
    // Campos requeridos
    const required = ['type', 'fuelType', 'quantity', 'unitPrice'];
    for (const field of required) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        errors.push(`Campo requerido: ${field}`);
      }
    }

    // Validar tipo de movimiento
    if (data.type && !Object.values(MOVEMENT_TYPES).includes(data.type)) {
      errors.push('Tipo de movimiento inválido');
    }

    // Validar cantidades
    if (data.quantity !== undefined && Number(data.quantity) <= 0) {
      errors.push('La cantidad debe ser mayor a cero');
    }

    if (data.unitPrice !== undefined && Number(data.unitPrice) < 0) {
      errors.push('El precio unitario no puede ser negativo');
    }

    // Validaciones específicas por tipo
    if (data.type === MOVEMENT_TYPES.SALIDA && !data.vehicleId) {
      errors.push('Las salidas deben tener un vehículo asociado');
    }

    if (data.type === MOVEMENT_TYPES.TRANSFERENCIA && !data.destinationLocation) {
      errors.push('Las transferencias deben tener una ubicación destino');
    }

    // Validaciones específicas para entradas
    if (data.type === MOVEMENT_TYPES.ENTRADA) {
      if (!data.supplierName) {
        errors.push('Las entradas deben tener un proveedor');
      }
      if (!data.destinationLocation) {
        errors.push('Las entradas deben tener una ubicación destino');
      }
    }

    // Validar ubicaciones válidas
    if (data.tipo !== MOVEMENT_TYPES.ENTRADA && data.location && !this.isValidLocation(data.location)) {
      errors.push(`Ubicación origen inválida: ${data.location}. Ubicaciones válidas: ${OPERATIONAL_LOCATIONS.join(', ')}`);
    }

    if (data.destinationLocation && !this.isValidLocation(data.destinationLocation)) {
      errors.push(`Ubicación destino inválida: ${data.destinationLocation}. Ubicaciones válidas: ${OPERATIONAL_LOCATIONS.join(', ')}`);
    }

    // Validar que origen y destino sean diferentes en transferencias
    if (data.type === MOVEMENT_TYPES.TRANSFERENCIA) {
      const origin = (data.location || 'principal').toLowerCase();
      const destination = data.destinationLocation?.toLowerCase();
      
      if (origin === destination) {
        errors.push('La ubicación origen y destino no pueden ser la misma en una transferencia');
      }
    }
    
    return { isValid: errors.length === 0, errors };
  }

  processData(data, isUpdate = false) {
    const baseProcessed = super.processData(data, isUpdate);
    
    // Procesar números
    if (data.quantity !== undefined) {
      baseProcessed.quantity = Number(data.quantity);
    }
    if (data.unitPrice !== undefined) {
      baseProcessed.unitPrice = Number(data.unitPrice);
    }
    if (data.currentHours !== undefined) {
      baseProcessed.currentHours = Number(data.currentHours) || null;
    }

    // Calcular valor total
    if (baseProcessed.quantity && baseProcessed.unitPrice) {
      baseProcessed.totalValue = baseProcessed.quantity * baseProcessed.unitPrice;
    }

    // Fecha efectiva
    if (data.effectiveDate) {
      baseProcessed.effectiveDate = data.effectiveDate;
    } else if (!isUpdate) {
      baseProcessed.effectiveDate = serverTimestamp();
    }

    // Estado por defecto
    if (!isUpdate && !data.status) {
      baseProcessed.status = MOVEMENT_STATUS.COMPLETADO;
    }

    // Fecha de aprobación para movimientos completados
    if (!isUpdate && baseProcessed.status === MOVEMENT_STATUS.COMPLETADO) {
      baseProcessed.approvedAt = serverTimestamp();
    }

    return baseProcessed;
  }

  isValidLocation(location) {
    if (!location) return false;
    return OPERATIONAL_LOCATIONS.includes(location.toLowerCase());
  }

  enrichData(item) {
    return {
      ...item,
      // Convertir timestamps para el frontend
      createdAt: item.createdAt?.toDate?.() || item.createdAt,
      updatedAt: item.updatedAt?.toDate?.() || item.updatedAt,
      effectiveDate: item.effectiveDate?.toDate?.() || item.effectiveDate,
      approvedAt: item.approvedAt?.toDate?.() || item.approvedAt
    };
  }

  async createMovement(data, user) {
    try {
      // Crear movimiento en transacción para actualizar inventario
      const result = await runTransaction(db, async (transaction) => {
        // Crear el movimiento usando el método base
        const movementData = this.processData(data, false);
        if (user) {
          movementData.createdBy = user;
          movementData.updatedBy = user;
        }

        const movementRef = doc(collection(db, this.collectionName));
        transaction.set(movementRef, movementData);

        // Actualizar inventario según el tipo de movimiento
        await this.updateInventoryFromMovement(transaction, movementData, movementRef.id);

        return { id: movementRef.id, ...movementData };
      });

      this.logInfo('createMovement', 'Movimiento creado exitosamente', { id: result.id });
      return { success: true, data: result, message: 'Movimiento creado exitosamente' };
    } catch (error) {
      this.logError('createMovement', error, data);
      return { success: false, error: error.message };
    }
  }

  async getAllMovements(filters = {}) {
    try {
      // Construir filtros para CRUDService
      const crudFilters = [];
      
      if (filters.type) {
        crudFilters.push({ field: 'type', operator: '==', value: filters.type });
      }
      if (filters.status) {
        crudFilters.push({ field: 'status', operator: '==', value: filters.status });
      }
      if (filters.fuelType) {
        crudFilters.push({ field: 'fuelType', operator: '==', value: filters.fuelType });
      }
      if (filters.vehicleId) {
        crudFilters.push({ field: 'vehicleId', operator: '==', value: filters.vehicleId });
      }

      const result = await this.getAll(crudFilters, {
        orderBy: 'createdAt',
        orderDirection: 'desc'
      });

      if (!result.success) return result;

      // Enriquecer datos con conversión de timestamps
      const enrichedData = result.data.map(item => this.enrichData(item));

      return { ...result, data: enrichedData };
    } catch (error) {
      this.logError('getAllMovements', error, filters);
      return { success: false, error: error.message };
    }
  }

  async getMovementById(id) {
    const result = await this.getById(id);
    if (!result.success) return result;

    // Enriquecer datos con conversión de timestamps
    const enrichedData = this.enrichData(result.data);

    return { ...result, data: enrichedData };
  }

  async updateMovement(id, data, user) {
    // Recalcular valor si cambian cantidades o precios
    if (data.quantity || data.unitPrice) {
      const currentData = await this.getById(id);
      if (currentData.success) {
        const quantity = data.quantity || currentData.data.quantity;
        const unitPrice = data.unitPrice || currentData.data.unitPrice;
        data.totalValue = quantity * unitPrice;
      }
    }

    return await this.update(id, data, user);
  }

  async deleteMovement(id) {
    try {
      // Obtener el movimiento para poder revertirlo
      const movementResult = await this.getById(id);
      if (!movementResult.success) {
        return { success: false, error: 'Movimiento no encontrado' };
      }

      const movement = movementResult.data;

      // Eliminar en transacción revirtiendo el inventario
      await runTransaction(db, async (transaction) => {
        const docRef = doc(db, this.collectionName, id);
        
        // Si el movimiento ya había afectado el inventario, revertir los cambios
        if (movement.status === MOVEMENT_STATUS.COMPLETADO) {
          await this.revertInventoryChanges(transaction, movement);
        }
        
        // Eliminar el documento del movimiento
        transaction.delete(docRef);
      });

      this.logInfo('deleteMovement', 'Movimiento eliminado y cambios revertidos', { id });
      return { success: true, message: 'Movimiento eliminado exitosamente' };
    } catch (error) {
      this.logError('deleteMovement', error, { id });
      return { success: false, error: error.message };
    }
  }

  async approveMovement(movementId) {
    try {
      const movementResult = await this.getById(movementId);
      if (!movementResult.success) {
        return { success: false, error: 'Movimiento no encontrado' };
      }

      const movement = movementResult.data;

      if (movement.status !== MOVEMENT_STATUS.PENDIENTE) {
        return { success: false, error: 'Solo se pueden aprobar movimientos pendientes' };
      }

      await runTransaction(db, async (transaction) => {
        const docRef = doc(db, this.collectionName, movementId);
        
        // Actualizar estado a completado
        transaction.update(docRef, {
          status: MOVEMENT_STATUS.COMPLETADO,
          approvedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        // Actualizar inventario
        await this.updateInventoryFromMovement(transaction, movement, movementId);
      });

      return { success: true, message: 'Movimiento aprobado exitosamente' };
    } catch (error) {
      this.logError('approveMovement', error, { movementId });
      return { success: false, error: error.message };
    }
  }

  async getMovementsStats(filters = {}) {
    try {
      const result = await this.getAllMovements(filters);
      if (!result.success) return result;

      const movements = result.data;

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

      return { success: true, data: stats };
    } catch (error) {
      this.logError('getMovementsStats', error, filters);
      return { success: false, error: error.message };
    }
  }

  subscribeToMovements(callback, filters = {}) {
    // Construir filtros para el método base
    const subscribeFilters = [];
    
    if (filters.type) {
      subscribeFilters.push({ field: 'type', operator: '==', value: filters.type });
    }
    if (filters.status) {
      subscribeFilters.push({ field: 'status', operator: '==', value: filters.status });
    }

    // Wrapper para enriquecer datos en tiempo real
    return this.subscribeToChanges((movements, error) => {
      if (error) {
        callback([], error);
        return;
      }
      
      const enrichedMovements = movements.map(movement => this.enrichData(movement));
      callback(enrichedMovements);
    }, {
      filters: subscribeFilters,
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
  }

  // Métodos auxiliares para inventario
  async updateInventoryFromMovement(transaction, movement, movementId) {
    try {
      // Determinar ubicación correcta según tipo de movimiento
      let targetLocation = movement.location || 'principal';
      
      // Para ENTRADA, usar destinationLocation si existe
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
        // Si no existe inventario, solo se puede procesar una ENTRADA
        if (movement.type !== MOVEMENT_TYPES.ENTRADA) {
          throw new Error(`No se encontró inventario para ${movement.fuelType} en ${targetLocation} para realizar un movimiento de ${movement.type}.`);
        }
        
        // Crear inventario automáticamente
        await this.createInventoryFromMovement(transaction, movement, movementId, targetLocation);
      } else {
        // Actualizar inventario existente
        await this.updateExistingInventory(transaction, movement, movementId, inventorySnapshot);
      }

      // Actualizar horómetro del vehículo si es una salida y tiene datos del horómetro
      if (movement.type === MOVEMENT_TYPES.SALIDA && movement.vehicleId && movement.currentHours) {
        await this.updateVehicleHourMeter(transaction, movement.vehicleId, movement.currentHours);
      }
    } catch (error) {
      this.logError('updateInventoryFromMovement', error, { movement, movementId });
      throw error;
    }
  }

  async createInventoryFromMovement(transaction, movement, movementId, targetLocation) {
    const inventoryRef = doc(collection(db, INVENTORY_COLLECTION));
    const newInventoryData = {
      fuelType: movement.fuelType,
      location: targetLocation,
      name: movement.fuelType,
      maxCapacity: 10000,
      currentStock: preciseRound(movement.quantity, 2),
      minThreshold: 1500,
      pricePerUnit: movement.unitPrice || 0,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMovement: {
        movementId,
        type: movement.type,
        quantity: movement.quantity,
        date: serverTimestamp()
      }
    };
    
    transaction.set(inventoryRef, newInventoryData);
  }

  async updateExistingInventory(transaction, movement, movementId, inventorySnapshot) {
    const inventoryDoc = inventorySnapshot.docs[0];
    const inventoryData = inventoryDoc.data();
    const inventoryRef = doc(db, INVENTORY_COLLECTION, inventoryDoc.id);
    let newQuantity = inventoryData.currentStock;

    // Aplicar cambio según tipo de movimiento
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
        newQuantity = preciseAdd(newQuantity, movement.quantity);
        if (newQuantity < 0) newQuantity = 0;
        break;
      case MOVEMENT_TYPES.TRANSFERENCIA:
        newQuantity = preciseSubtract(newQuantity, movement.quantity);
        if (newQuantity < 0) {
          throw new Error('Stock insuficiente para realizar la transferencia');
        }
        
        // Manejar suma al destino
        await this.handleTransferToDestination(transaction, movement, movementId);
        break;
    }

    // Redondear resultado
    newQuantity = preciseRound(newQuantity, 2);

    // Actualizar el inventario
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

  async handleTransferToDestination(transaction, movement, movementId) {
    if (!movement.destinationLocation) {
      throw new Error('Ubicación destino requerida para transferencias');
    }

    // Buscar inventario destino
    const destinationQuery = query(
      collection(db, INVENTORY_COLLECTION),
      where('fuelType', '==', movement.fuelType),
      where('location', '==', movement.destinationLocation)
    );

    const destinationSnapshot = await getDocs(destinationQuery);

    if (destinationSnapshot.empty) {
      // Crear inventario automáticamente en destino
      const inventoryRef = doc(collection(db, INVENTORY_COLLECTION));
      const newInventoryData = {
        fuelType: movement.fuelType,
        location: movement.destinationLocation,
        name: movement.fuelType,
        maxCapacity: 10000,
        currentStock: preciseRound(movement.quantity, 2),
        minThreshold: 1500,
        pricePerUnit: movement.unitPrice || 0,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMovement: {
          movementId,
          type: 'transferencia_entrada',
          quantity: movement.quantity,
          date: serverTimestamp(),
          originLocation: movement.location
        }
      };
      
      transaction.set(inventoryRef, newInventoryData);
    } else {
      // Sumar al inventario existente en destino
      const destinationDoc = destinationSnapshot.docs[0];
      const destinationData = destinationDoc.data();
      const destinationRef = doc(db, INVENTORY_COLLECTION, destinationDoc.id);
      
      const newQuantity = preciseRound(preciseAdd(destinationData.currentStock, movement.quantity), 2);

      transaction.update(destinationRef, {
        currentStock: newQuantity,
        lastMovement: {
          movementId,
          type: 'transferencia_entrada',
          quantity: movement.quantity,
          date: serverTimestamp(),
          originLocation: movement.location
        },
        updatedAt: serverTimestamp()
      });
    }
  }

  async revertInventoryChanges(transaction, movement) {
    try {
      // Determinar la ubicación correcta según el tipo de movimiento
      let targetLocation;
      switch (movement.type) {
        case MOVEMENT_TYPES.ENTRADA:
          targetLocation = movement.destinationLocation || 'principal';
          break;
        case MOVEMENT_TYPES.SALIDA:
        case MOVEMENT_TYPES.AJUSTE:
          targetLocation = movement.location || 'principal';
          break;
        case MOVEMENT_TYPES.TRANSFERENCIA:
          targetLocation = movement.location || 'principal';
          break;
        default:
          targetLocation = movement.location || movement.destinationLocation || 'principal';
      }

      // Buscar inventario
      const inventoryQuery = query(
        collection(db, INVENTORY_COLLECTION),
        where('fuelType', '==', movement.fuelType),
        where('location', '==', targetLocation)
      );

      const inventorySnapshot = await getDocs(inventoryQuery);
      
      if (inventorySnapshot.empty) {
        this.logWarning('revertInventoryChanges', `No se encontró inventario para ${movement.fuelType} en ${targetLocation}`);
        return;
      }

      const inventoryDoc = inventorySnapshot.docs[0];
      const inventoryData = inventoryDoc.data();
      const inventoryRef = doc(db, INVENTORY_COLLECTION, inventoryDoc.id);
      
      await this.processInventoryReversion(transaction, inventoryRef, inventoryData, movement);

    } catch (error) {
      this.logError('revertInventoryChanges', error, movement);
      throw error;
    }
  }

  async processInventoryReversion(transaction, inventoryRef, inventoryData, movement) {
    let newQuantity = inventoryData.currentStock;

    // Revertir cambio según tipo de movimiento (operación inversa)
    switch (movement.type) {
      case MOVEMENT_TYPES.ENTRADA:
        newQuantity = preciseSubtract(newQuantity, movement.quantity);
        if (newQuantity < 0) newQuantity = 0;
        break;
      case MOVEMENT_TYPES.SALIDA:
        newQuantity = preciseAdd(newQuantity, movement.quantity);
        break;
      case MOVEMENT_TYPES.AJUSTE:
        newQuantity = preciseSubtract(newQuantity, movement.quantity);
        if (newQuantity < 0) newQuantity = 0;
        break;
      case MOVEMENT_TYPES.TRANSFERENCIA:
        newQuantity = preciseAdd(newQuantity, movement.quantity);
        // También revertir del destino
        await this.revertTransferFromDestination(transaction, movement);
        break;
    }

    newQuantity = preciseRound(newQuantity, 2);

    // Actualizar inventario
    transaction.update(inventoryRef, {
      currentStock: newQuantity,
      lastMovement: {
        movementId: null,
        type: 'reversion',
        quantity: movement.quantity,
        originalType: movement.type,
        date: serverTimestamp(),
        note: `Reversión de movimiento ${movement.id}`
      },
      updatedAt: serverTimestamp()
    });
  }

  async revertTransferFromDestination(transaction, movement) {
    if (!movement.destinationLocation) return;

    const destinationQuery = query(
      collection(db, INVENTORY_COLLECTION),
      where('fuelType', '==', movement.fuelType),
      where('location', '==', movement.destinationLocation)
    );

    const destinationSnapshot = await getDocs(destinationQuery);

    if (destinationSnapshot.empty) {
      this.logWarning('revertTransferFromDestination', `No se encontró inventario destino: ${movement.fuelType} en ${movement.destinationLocation}`);
      return;
    }

    const destinationDoc = destinationSnapshot.docs[0];
    const destinationData = destinationDoc.data();
    const destinationRef = doc(db, INVENTORY_COLLECTION, destinationDoc.id);
    
    let newQuantity = preciseSubtract(destinationData.currentStock, movement.quantity);
    if (newQuantity < 0) newQuantity = 0;
    
    newQuantity = preciseRound(newQuantity, 2);

    transaction.update(destinationRef, {
      currentStock: newQuantity,
      lastMovement: {
        movementId: null,
        type: 'reversion_transferencia',
        quantity: movement.quantity,
        date: serverTimestamp(),
        note: `Reversión de transferencia desde ${movement.location}`
      },
      updatedAt: serverTimestamp()
    });
  }

  async updateVehicleHourMeter(transaction, vehicleId, currentHours) {
    try {
      // Buscar el vehículo
      const vehiclesQuery = query(
        collection(db, 'combustibles_vehicles'),
        where('vehicleId', '==', vehicleId)
      );

      const vehiclesSnapshot = await getDocs(vehiclesQuery);
      
      if (vehiclesSnapshot.empty) {
        this.logWarning('updateVehicleHourMeter', `Vehículo ${vehicleId} no encontrado`);
        return;
      }

      const vehicleDoc = vehiclesSnapshot.docs[0];
      const vehicleData = vehicleDoc.data();
      const vehicleRef = doc(db, 'combustibles_vehicles', vehicleDoc.id);

      const previousHours = parseFloat(vehicleData.currentHours) || 0;
      const newHours = parseFloat(currentHours);

      // Crear registro de historial
      const hourMeterHistory = vehicleData.hourMeterHistory || [];
      hourMeterHistory.push({
        previousHours: previousHours,
        newHours: newHours,
        difference: newHours - previousHours,
        updatedAt: new Date(),
        updatedBy: 'movement_service',
        source: 'fuel_consumption'
      });

      // Actualizar vehículo
      transaction.update(vehicleRef, {
        currentHours: newHours,
        hourMeterHistory: hourMeterHistory,
        lastHourMeterUpdate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

    } catch (error) {
      this.logError('updateVehicleHourMeter', error, { vehicleId, currentHours });
      // No hacer throw para no afectar el movimiento principal
    }
  }
}

// Singleton
const movementsService = new MovementsService();

// Exports para compatibilidad con código existente
export const createMovement = (data) => movementsService.createMovement(data);
export const getAllMovements = (filters) => movementsService.getAllMovements(filters);
export const getMovement = (id) => movementsService.getMovementById(id);
export const updateMovement = (id, data) => movementsService.updateMovement(id, data);
export const deleteMovement = (id) => movementsService.deleteMovement(id);
export const subscribeToMovements = (callback, filters) => movementsService.subscribeToMovements(callback, filters);
export const approveMovement = (id) => movementsService.approveMovement(id);
export const getMovementsStats = (filters) => movementsService.getMovementsStats(filters);

export default movementsService;