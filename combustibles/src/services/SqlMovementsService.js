/**
 * SqlMovementsService - Servicio de movimientos usando Azure SQL Server
 * Adaptación del MovementsService original para usar SQL Server
 * Forestech Combustibles App
 */

import SqlCrudService from './base/SqlCrudService.js';
import sqlConnection from './base/SqlConnection.js';
import { preciseAdd, preciseSubtract, preciseRound } from '../utils/calculations.js';

const TABLE_NAME = 'combustibles_movements';
const INVENTORY_TABLE = 'combustibles_inventory';
const VEHICLES_TABLE = 'combustibles_vehicles';

// Tipos de movimientos (mantenemos compatibilidad)
export const MOVEMENT_TYPES = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
  TRANSFERENCIA: 'transferencia',
  AJUSTE: 'ajuste',
  MANTENIMIENTO: 'mantenimiento',
};

export const MOVEMENT_STATUS = {
  PENDIENTE: 'pendiente',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
};

class SqlMovementsService extends SqlCrudService {
  constructor() {
    super(TABLE_NAME, {
      enableTimestamps: true,
      defaultOrderBy: 'createdAt',
      defaultOrderDirection: 'DESC',
    });
  }

  /**
   * Crear nuevo movimiento con lógica de negocio
   * @param {Object} movementData - Datos del movimiento
   * @param {Object} userInfo - Información del usuario
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async createMovement(movementData, userInfo = null) {
    try {
      console.log('🚀 Iniciando creación de movimiento SQL:', movementData);

      // Normalizar fuelType
      if (movementData.fuelType) {
        movementData.fuelType = movementData.fuelType.toUpperCase();
      }

      // Validar datos básicos
      this.validateMovementData(movementData);

      // Preparar datos del movimiento
      const movement = {
        type: movementData.type,
        fuelType: movementData.fuelType,
        quantity: preciseRound(movementData.quantity),
        unitPrice: preciseRound(movementData.unitPrice || 0),
        totalValue: preciseRound(this.calculateMovementValue(movementData)),
        vehicleId: movementData.vehicleId || null,
        location: movementData.location?.toLowerCase() || 'principal',
        destinationLocation: movementData.destinationLocation?.toLowerCase() || null,
        description: movementData.description || '',
        effectiveDate: movementData.effectiveDate || new Date(),

        // Metadatos específicos por tipo
        ...(movementData.type === MOVEMENT_TYPES.ENTRADA && {
          supplierName: movementData.supplierName,
          invoiceNumber: movementData.invoiceNumber || null,
          purchaseOrderNumber: movementData.purchaseOrderNumber || null,
        }),

        // Información del usuario
        createdBy: userInfo?.email || 'unknown',
        createdByUid: userInfo?.uid || null,
        createdByName: userInfo?.displayName || userInfo?.email || 'Usuario',

        // Timestamps
        status: 'completed',
        approvedBy: userInfo?.email || 'system',
        approvedAt: new Date(),
      };

      // Crear movimiento en transacción para actualizar inventario
      const result = await this.runTransaction(async (transaction) => {
        // Crear el movimiento
        const createResult = await this.create(movement);
        if (!createResult.success) {
          throw new Error(createResult.error);
        }

        const movementId = createResult.id;

        // Actualizar inventario según el tipo de movimiento
        await this.updateInventoryFromMovement(transaction, movement, movementId);

        return { id: movementId, ...movement };
      });

      console.log('✅ Movimiento SQL creado exitosamente:', result.id);
      return { success: true, id: result.id, data: result };

    } catch (error) {
      console.error('❌ Error al crear movimiento SQL:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener movimientos con filtros
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Object>} - Lista de movimientos
   */
  async getAllMovements(filters = {}) {
    try {
      // Normalizar fuelType en filtros
      if (filters.fuelType) {
        filters.fuelType = filters.fuelType.toUpperCase();
      }

      // Convertir filtros al formato SQL
      const sqlFilters = [];
      if (filters.type) sqlFilters.push({ field: 'type', value: filters.type });
      if (filters.status) sqlFilters.push({ field: 'status', value: filters.status });
      if (filters.fuelType) sqlFilters.push({ field: 'fuelType', value: filters.fuelType });
      if (filters.vehicleId) sqlFilters.push({ field: 'vehicleId', value: filters.vehicleId });

      const result = await this.getAll({
        filters: sqlFilters,
        orderBy: 'createdAt',
        orderDirection: 'DESC',
      });

      if (result.success) {
        // Convertir timestamps para compatibilidad con frontend
        result.data = result.data.map(movement => ({
          ...movement,
          createdAt: movement.createdAt?.toISOString(),
          updatedAt: movement.updatedAt?.toISOString(),
          effectiveDate: movement.effectiveDate?.toISOString(),
        }));
      }

      return result;
    } catch (error) {
      console.error('❌ Error al obtener movimientos SQL:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener movimiento específico por ID
   * @param {string} movementId - ID del movimiento
   * @returns {Promise<Object>} - Datos del movimiento
   */
  async getMovement(movementId) {
    try {
      const result = await this.getById(movementId);

      if (result.success) {
        // Convertir timestamps
        result.data = {
          ...result.data,
          createdAt: result.data.createdAt?.toISOString(),
          updatedAt: result.data.updatedAt?.toISOString(),
          effectiveDate: result.data.effectiveDate?.toISOString(),
        };
      }

      return result;
    } catch (error) {
      console.error('❌ Error al obtener movimiento SQL:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar movimiento
   * @param {string} movementId - ID del movimiento
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateMovement(movementId, updateData) {
    try {
      // Recalcular valor si cambian cantidades o precios
      if (updateData.quantity || updateData.unitPrice) {
        const currentMovement = await this.getMovement(movementId);
        if (currentMovement.success) {
          updateData.totalValue = this.calculateMovementValue({
            ...currentMovement.data,
            ...updateData,
          });
        }
      }

      updateData.updatedAt = new Date();

      return await this.update(movementId, updateData);
    } catch (error) {
      console.error('❌ Error al actualizar movimiento SQL:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar movimiento y revertir inventario
   * @param {string} movementId - ID del movimiento
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async deleteMovement(movementId) {
    try {
      // Obtener el movimiento para poder revertirlo
      const movementResult = await this.getMovement(movementId);
      if (!movementResult.success) {
        return movementResult;
      }

      const movement = movementResult.data;

      // Ejecutar en transacción
      await this.runTransaction(async (transaction) => {
        // Revertir cambios de inventario
        await this.revertInventoryChanges(transaction, movement);

        // Eliminar el movimiento
        await this.delete(movementId);
      });

      console.log('✅ Movimiento SQL eliminado y cambios de inventario revertidos');
      return { success: true, message: 'Movimiento eliminado exitosamente' };

    } catch (error) {
      console.error('❌ Error al eliminar movimiento SQL:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Actualizar inventario desde movimiento (dentro de transacción)
   * @param {Object} transaction - Transacción SQL
   * @param {Object} movement - Datos del movimiento
   * @param {string} movementId - ID del movimiento
   */
  async updateInventoryFromMovement(transaction, movement, movementId) {
    try {
      // Determinar ubicación correcta
      let targetLocation = movement.location || 'principal';
      if (movement.type === MOVEMENT_TYPES.ENTRADA) {
        targetLocation = movement.destinationLocation || 'principal';
      }

      // Buscar item de inventario
      const inventoryQuery = `
        SELECT * FROM ${INVENTORY_TABLE}
        WHERE fuelType = @fuelType AND location = @location
      `;

      const inventoryResult = await sqlConnection.query(inventoryQuery, {
        fuelType: movement.fuelType,
        location: targetLocation,
      });

      if (inventoryResult.length === 0) {
        // Crear inventario automáticamente
        if (movement.type !== MOVEMENT_TYPES.ENTRADA) {
          throw new Error(`No se encontró inventario para ${movement.fuelType} en ${targetLocation}`);
        }

        console.log(`📦 Creando inventario SQL automático para ${movement.fuelType} en ${targetLocation}`);

        const newInventory = {
          fuelType: movement.fuelType,
          location: targetLocation,
          name: movement.fuelType,
          maxCapacity: 1000,
          currentStock: preciseRound(movement.quantity, 2),
          minThreshold: 150,
          pricePerUnit: movement.unitPrice || 0,
          status: 'active',
          lastMovementId: movementId,
          lastMovementType: movement.type,
          lastMovementQuantity: movement.quantity,
          lastMovementDate: new Date(),
        };

        const insertQuery = `
          INSERT INTO ${INVENTORY_TABLE}
          (fuelType, location, name, maxCapacity, currentStock, minThreshold, pricePerUnit, status, lastMovementId, lastMovementType, lastMovementQuantity, lastMovementDate, createdAt, updatedAt)
          VALUES (@fuelType, @location, @name, @maxCapacity, @currentStock, @minThreshold, @pricePerUnit, @status, @lastMovementId, @lastMovementType, @lastMovementQuantity, @lastMovementDate, @createdAt, @updatedAt)
        `;

        await sqlConnection.execute(insertQuery, {
          ...newInventory,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      } else {
        // Actualizar inventario existente
        const inventory = inventoryResult[0];
        let newQuantity = inventory.currentStock;

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
            // TODO: Implementar transferencia al destino
            break;
        }

        newQuantity = preciseRound(newQuantity, 2);

        const updateQuery = `
          UPDATE ${INVENTORY_TABLE}
          SET currentStock = @currentStock,
              lastMovementId = @lastMovementId,
              lastMovementType = @lastMovementType,
              lastMovementQuantity = @lastMovementQuantity,
              lastMovementDate = @lastMovementDate,
              updatedAt = @updatedAt
          WHERE id = @id
        `;

        await sqlConnection.execute(updateQuery, {
          id: inventory.id,
          currentStock: newQuantity,
          lastMovementId: movementId,
          lastMovementType: movement.type,
          lastMovementQuantity: movement.quantity,
          lastMovementDate: new Date(),
          updatedAt: new Date(),
        });
      }

    } catch (error) {
      console.error('❌ Error al actualizar inventario SQL:', error);
      throw error;
    }
  }

  /**
   * Revertir cambios de inventario
   * @param {Object} transaction - Transacción SQL
   * @param {Object} movement - Movimiento a revertir
   */
  async revertInventoryChanges(transaction, movement) {
    try {
      console.log('🔄 Revirtiendo cambios de inventario SQL para movimiento:', movement.id);

      // Lógica simplificada para reversión
      let targetLocation = movement.location || 'principal';
      if (movement.type === MOVEMENT_TYPES.ENTRADA) {
        targetLocation = movement.destinationLocation || 'principal';
      }

      const inventoryQuery = `
        SELECT * FROM ${INVENTORY_TABLE}
        WHERE fuelType = @fuelType AND location = @location
      `;

      const inventoryResult = await sqlConnection.query(inventoryQuery, {
        fuelType: movement.fuelType,
        location: targetLocation,
      });

      if (inventoryResult.length > 0) {
        const inventory = inventoryResult[0];
        let newQuantity = inventory.currentStock;

        // Revertir según tipo de movimiento
        switch (movement.type) {
          case MOVEMENT_TYPES.ENTRADA:
            newQuantity = preciseSubtract(newQuantity, movement.quantity);
            if (newQuantity < 0) newQuantity = 0;
            break;
          case MOVEMENT_TYPES.SALIDA:
          case MOVEMENT_TYPES.MANTENIMIENTO:
            newQuantity = preciseAdd(newQuantity, movement.quantity);
            break;
          case MOVEMENT_TYPES.AJUSTE:
            newQuantity = preciseSubtract(newQuantity, movement.quantity);
            if (newQuantity < 0) newQuantity = 0;
            break;
          case MOVEMENT_TYPES.TRANSFERENCIA:
            newQuantity = preciseAdd(newQuantity, movement.quantity);
            break;
        }

        newQuantity = preciseRound(newQuantity, 2);

        const updateQuery = `
          UPDATE ${INVENTORY_TABLE}
          SET currentStock = @currentStock,
              lastMovementId = NULL,
              updatedAt = @updatedAt
          WHERE id = @id
        `;

        await sqlConnection.execute(updateQuery, {
          id: inventory.id,
          currentStock: newQuantity,
          updatedAt: new Date(),
        });
      }

    } catch (error) {
      console.error('❌ Error al revertir inventario SQL:', error);
      throw error;
    }
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========

  /**
   * Validar datos de movimiento
   * @param {Object} movementData - Datos a validar
   */
  validateMovementData(movementData) {
    const required = ['type', 'fuelType', 'quantity', 'unitPrice'];

    for (const field of required) {
      if (!movementData[field]) {
        throw new Error(`Campo requerido: ${field}`);
      }
    }

    if (movementData.fuelType) {
      movementData.fuelType = movementData.fuelType.toUpperCase();
    }

    if (!Object.values(MOVEMENT_TYPES).includes(movementData.type)) {
      throw new Error('Tipo de movimiento inválido');
    }

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

    if (movementData.type === MOVEMENT_TYPES.ENTRADA) {
      if (!movementData.supplierName) {
        throw new Error('Las entradas deben tener un proveedor');
      }
      if (!movementData.destinationLocation) {
        throw new Error('Las entradas deben tener una ubicación destino');
      }
    }
  }

  /**
   * Calcular valor total del movimiento
   * @param {Object} movementData - Datos del movimiento
   * @returns {number} - Valor total
   */
  calculateMovementValue(movementData) {
    return (movementData.quantity || 0) * (movementData.unitPrice || 0);
  }
}

// Instancia singleton del servicio
const sqlMovementsService = new SqlMovementsService();

export default sqlMovementsService;
export { SqlMovementsService };