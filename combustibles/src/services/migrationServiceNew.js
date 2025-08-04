/**
 * MigrationService - Servicio refactorizado para migración de datos históricos
 * Utiliza BaseService y CRUDService para operaciones optimizadas
 * 
 * Funcionalidades:
 * - Migración completa de datos Excel históricos a Firebase
 * - Manejo de progreso y callbacks en tiempo real
 * - Validación avanzada y logging de errores
 * - Estrategia: Migrar todo EXCEPTO cálculos de stock (análisis posterior)
 * - Operaciones por lotes para optimizar performance
 * 
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.2 BaseService Implementation  
 * @date 2025-08-04
 */

import { CRUDService } from './base/CRUDService.js';
import { 
  collection,
  addDoc,
  doc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { createVehicle, getVehicleByCode, updateVehicle } from './vehiclesService';
import { getProductByCode } from './productsService';

// Colecciones Firebase
const COLLECTIONS = {
  VEHICLES: 'combustibles_vehicles',
  MOVEMENTS: 'combustibles_movements', 
  PRODUCTS: 'combustibles_products',
  MIGRATION_LOG: 'migration_logs'
};

/**
 * Estados de migración
 */
export const MIGRATION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ERROR: 'error',
  CANCELLED: 'cancelled'
};

/**
 * Clase MigrationService refactorizada
 */
class MigrationService extends CRUDService {
  constructor() {
    super('migration_logs', {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'createdAt',
      defaultOrderDirection: 'desc'
    });

    this.migrationId = `migration_${Date.now()}`;
    this.progress = this.initializeProgress();
    this.callbacks = [];
  }

  /**
   * Inicializar estructura de progreso
   */
  initializeProgress() {
    return {
      migrationId: this.migrationId,
      status: MIGRATION_STATUS.PENDING,
      currentStep: '',
      totalSteps: 5,
      stepNumber: 0,
      startTime: null,
      endTime: null,
      vehicles: { total: 0, processed: 0, errors: 0, skipped: 0 },
      movements: { total: 0, processed: 0, errors: 0, skipped: 0 },
      products: { total: 0, processed: 0, errors: 0, skipped: 0 },
      maintenance: { total: 0, processed: 0, errors: 0, skipped: 0 },
      errors: [],
      warnings: [],
      summary: {}
    };
  }

  /**
   * Validación específica para datos de migración
   */
  validateData(data) {
    const baseValidation = super.validateData(data);
    if (!baseValidation.isValid) return baseValidation;

    const errors = [];

    // Validar estructura de migración
    if (!data.migrationId) {
      errors.push('migrationId es requerido');
    }

    if (data.status && !Object.values(MIGRATION_STATUS).includes(data.status)) {
      errors.push('status debe ser un estado válido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Procesar datos específicos de migración
   */
  processData(data, isUpdate = false) {
    const baseProcessed = super.processData(data, isUpdate);

    // Agregar metadatos específicos
    baseProcessed.migrationId = baseProcessed.migrationId || this.migrationId;
    baseProcessed.status = baseProcessed.status || MIGRATION_STATUS.PENDING;

    // Sanitizar arrays de errores y warnings
    if (baseProcessed.errors && Array.isArray(baseProcessed.errors)) {
      baseProcessed.errors = baseProcessed.errors.slice(0, 100); // Limitar errores
    }

    return baseProcessed;
  }

  /**
   * Agregar callback para progreso
   */
  onProgress(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
      this.log(`Callback de progreso agregado. Total: ${this.callbacks.length}`);
    }
  }

  /**
   * Notificar progreso a todos los callbacks
   */
  async notifyProgress() {
    try {
      // Actualizar en Firebase
      await this.updateMigrationProgress();
      
      // Notificar callbacks
      this.callbacks.forEach(callback => {
        try {
          callback(this.progress);
        } catch (error) {
          this.logError('Error en callback de progreso', error);
        }
      });
    } catch (error) {
      this.logError('Error al notificar progreso', error);
    }
  }

  /**
   * Iniciar migración completa
   */
  async startMigration(historicalData) {
    try {
      this.progress.startTime = new Date();
      this.progress.status = MIGRATION_STATUS.IN_PROGRESS;
      this.log('Iniciando migración completa', { migrationId: this.migrationId });
      
      await this.logMigrationStart();
      
      this.updateProgressStep('Preparando migración...', 0);
      await this.notifyProgress();

      // FASE 1: Migrar vehículos y equipos
      this.updateProgressStep('Migrando vehículos y equipos...', 1);
      await this.migrateVehicles(historicalData.vehicles || []);

      // FASE 2: Migrar productos (sin stock)
      this.updateProgressStep('Migrando productos...', 2);
      await this.migrateProducts(historicalData.products || []);

      // FASE 3: Migrar movimientos históricos
      this.updateProgressStep('Migrando movimientos históricos...', 3);
      await this.migrateMovements(historicalData.movements || []);

      // FASE 4: Migrar datos de mantenimiento
      this.updateProgressStep('Migrando datos de mantenimiento...', 4);
      await this.migrateMaintenance(historicalData.maintenance || []);

      // FASE 5: Finalizar y generar resumen
      this.updateProgressStep('Finalizando migración...', 5);
      await this.finalizeMigration();

      this.progress.status = MIGRATION_STATUS.COMPLETED;
      this.progress.endTime = new Date();
      
      await this.notifyProgress();
      await this.logMigrationEnd();

      this.log('Migración completada exitosamente', {
        migrationId: this.migrationId,
        duration: this.getMigrationDuration()
      });

      return {
        success: true,
        data: this.progress,
        migrationId: this.migrationId
      };

    } catch (error) {
      this.progress.status = MIGRATION_STATUS.ERROR;
      this.progress.endTime = new Date();
      this.logError('Error en migración', error);
      
      await this.notifyProgress();
      await this.logMigrationError(error);

      return {
        success: false,
        error: error.message,
        data: this.progress
      };
    }
  }

  /**
   * Actualizar paso actual de progreso
   */
  updateProgressStep(stepName, stepNumber) {
    this.progress.currentStep = stepName;
    this.progress.stepNumber = stepNumber;
    this.log(`Progreso: ${stepName} (${stepNumber}/${this.progress.totalSteps})`);
  }

  /**
   * Migrar vehículos con validación mejorada
   */
  async migrateVehicles(vehiclesData) {
    if (!Array.isArray(vehiclesData)) {
      this.logWarning('No hay datos de vehículos para migrar');
      return;
    }

    this.progress.vehicles.total = vehiclesData.length;
    const batch = writeBatch(db);
    let batchCount = 0;
    const BATCH_SIZE = 450; // Límite de Firebase

    for (const vehicleData of vehiclesData) {
      try {
        // Validar datos del vehículo
        if (!this.validateVehicleData(vehicleData)) {
          this.progress.vehicles.skipped++;
          continue;
        }

        // Verificar si ya existe
        const existing = await getVehicleByCode(vehicleData.code);
        if (existing) {
          await updateVehicle(existing.id, vehicleData);
        } else {
          await createVehicle(vehicleData);
        }

        this.progress.vehicles.processed++;

      } catch (error) {
        this.progress.vehicles.errors++;
        this.progress.errors.push({
          type: 'vehicle',
          data: vehicleData,
          error: error.message,
          timestamp: new Date()
        });
        this.logError(`Error migrando vehículo: ${vehicleData?.code}`, error);
      }

      // Ejecutar batch si alcanza el límite
      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        batchCount = 0;
      }

      await this.notifyProgress();
    }

    // Ejecutar batch final
    if (batchCount > 0) {
      await batch.commit();
    }

    this.log(`Migración de vehículos completada: ${this.progress.vehicles.processed}/${this.progress.vehicles.total}`);
  }

  /**
   * Migrar productos con optimización
   */
  async migrateProducts(productsData) {
    if (!Array.isArray(productsData)) {
      this.logWarning('No hay datos de productos para migrar');
      return;
    }

    this.progress.products.total = productsData.length;

    for (const productData of productsData) {
      try {
        // Validar datos del producto
        if (!this.validateProductData(productData)) {
          this.progress.products.skipped++;
          continue;
        }

        // Verificar si ya existe
        const existing = await getProductByCode(productData.code);
        if (!existing) {
          const result = await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
            ...productData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          this.log(`Producto creado: ${productData.code} - ${result.id}`);
        }

        this.progress.products.processed++;

      } catch (error) {
        this.progress.products.errors++;
        this.progress.errors.push({
          type: 'product',
          data: productData,
          error: error.message,
          timestamp: new Date()
        });
        this.logError(`Error migrando producto: ${productData?.code}`, error);
      }

      await this.notifyProgress();
    }

    this.log(`Migración de productos completada: ${this.progress.products.processed}/${this.progress.products.total}`);
  }

  /**
   * Migrar movimientos históricos
   */
  async migrateMovements(movementsData) {
    if (!Array.isArray(movementsData)) {
      this.logWarning('No hay datos de movimientos para migrar');
      return;
    }

    this.progress.movements.total = movementsData.length;
    const batch = writeBatch(db);
    let batchCount = 0;
    const BATCH_SIZE = 400;

    for (const movementData of movementsData) {
      try {
        // Validar datos del movimiento
        if (!this.validateMovementData(movementData)) {
          this.progress.movements.skipped++;
          continue;
        }

        // Agregar al batch
        const docRef = doc(collection(db, COLLECTIONS.MOVEMENTS));
        batch.set(docRef, {
          ...movementData,
          migratedAt: serverTimestamp(),
          migrationId: this.migrationId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        batchCount++;
        this.progress.movements.processed++;

        // Ejecutar batch si alcanza el límite
        if (batchCount >= BATCH_SIZE) {
          await batch.commit();
          batchCount = 0;
        }

      } catch (error) {
        this.progress.movements.errors++;
        this.progress.errors.push({
          type: 'movement',
          data: movementData,
          error: error.message,
          timestamp: new Date()
        });
        this.logError(`Error migrando movimiento`, error);
      }

      // Notificar progreso cada 100 items
      if (this.progress.movements.processed % 100 === 0) {
        await this.notifyProgress();
      }
    }

    // Ejecutar batch final
    if (batchCount > 0) {
      await batch.commit();
    }

    this.log(`Migración de movimientos completada: ${this.progress.movements.processed}/${this.progress.movements.total}`);
  }

  /**
   * Migrar datos de mantenimiento
   */
  async migrateMaintenance(maintenanceData) {
    if (!Array.isArray(maintenanceData)) {
      this.logWarning('No hay datos de mantenimiento para migrar');
      return;
    }

    this.progress.maintenance.total = maintenanceData.length;

    for (const maintenanceItem of maintenanceData) {
      try {
        // Validar datos de mantenimiento
        if (!this.validateMaintenanceData(maintenanceItem)) {
          this.progress.maintenance.skipped++;
          continue;
        }

        // Crear registro de mantenimiento
        await addDoc(collection(db, 'combustibles_maintenance'), {
          ...maintenanceItem,
          migratedAt: serverTimestamp(),
          migrationId: this.migrationId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        this.progress.maintenance.processed++;

      } catch (error) {
        this.progress.maintenance.errors++;
        this.progress.errors.push({
          type: 'maintenance',
          data: maintenanceItem,
          error: error.message,
          timestamp: new Date()
        });
        this.logError(`Error migrando mantenimiento`, error);
      }

      await this.notifyProgress();
    }

    this.log(`Migración de mantenimiento completada: ${this.progress.maintenance.processed}/${this.progress.maintenance.total}`);
  }

  /**
   * Validaciones específicas
   */
  validateVehicleData(data) {
    return data && data.code && data.plateNumber;
  }

  validateProductData(data) {
    return data && data.code && data.name;
  }

  validateMovementData(data) {
    return data && data.type && data.quantity && data.vehicleCode;
  }

  validateMaintenanceData(data) {
    return data && data.vehicleCode && data.type;
  }

  /**
   * Finalizar migración y generar resumen
   */
  async finalizeMigration() {
    const summary = {
      totalProcessed: this.progress.vehicles.processed + this.progress.products.processed + 
                     this.progress.movements.processed + this.progress.maintenance.processed,
      totalErrors: this.progress.vehicles.errors + this.progress.products.errors + 
                   this.progress.movements.errors + this.progress.maintenance.errors,
      duration: this.getMigrationDuration(),
      successRate: this.calculateSuccessRate()
    };

    this.progress.summary = summary;
    this.log('Resumen de migración generado', summary);
  }

  /**
   * Calcular duración de migración
   */
  getMigrationDuration() {
    if (!this.progress.startTime) return 0;
    const endTime = this.progress.endTime || new Date();
    return Math.round((endTime - this.progress.startTime) / 1000); // segundos
  }

  /**
   * Calcular tasa de éxito
   */
  calculateSuccessRate() {
    const total = this.progress.vehicles.total + this.progress.products.total + 
                  this.progress.movements.total + this.progress.maintenance.total;
    const processed = this.progress.vehicles.processed + this.progress.products.processed + 
                     this.progress.movements.processed + this.progress.maintenance.processed;
    
    return total > 0 ? Math.round((processed / total) * 100) : 0;
  }

  /**
   * Logging de inicio de migración
   */
  async logMigrationStart() {
    try {
      await this.create({
        migrationId: this.migrationId,
        type: 'migration_start',
        status: MIGRATION_STATUS.IN_PROGRESS,
        progress: this.progress,
        startTime: this.progress.startTime
      });
    } catch (error) {
      this.logError('Error al registrar inicio de migración', error);
    }
  }

  /**
   * Logging de fin de migración
   */
  async logMigrationEnd() {
    try {
      await this.create({
        migrationId: this.migrationId,
        type: 'migration_end',
        status: MIGRATION_STATUS.COMPLETED,
        progress: this.progress,
        endTime: this.progress.endTime,
        summary: this.progress.summary
      });
    } catch (error) {
      this.logError('Error al registrar fin de migración', error);
    }
  }

  /**
   * Logging de error de migración
   */
  async logMigrationError(error) {
    try {
      await this.create({
        migrationId: this.migrationId,
        type: 'migration_error',
        status: MIGRATION_STATUS.ERROR,
        progress: this.progress,
        error: error.message,
        stack: error.stack,
        endTime: this.progress.endTime
      });
    } catch (logError) {
      console.error('Error al registrar error de migración:', logError);
    }
  }

  /**
   * Actualizar progreso en Firebase
   */
  async updateMigrationProgress() {
    try {
      // Implementar update de progreso si se necesita persistencia en tiempo real
      // Por ahora solo loggeamos localmente para performance
    } catch (error) {
      this.logError('Error al actualizar progreso en Firebase', error);
    }
  }

  /**
   * Cancelar migración en progreso
   */
  async cancelMigration() {
    try {
      this.progress.status = MIGRATION_STATUS.CANCELLED;
      this.progress.endTime = new Date();
      
      await this.create({
        migrationId: this.migrationId,
        type: 'migration_cancelled',
        status: MIGRATION_STATUS.CANCELLED,
        progress: this.progress,
        endTime: this.progress.endTime
      });

      this.log('Migración cancelada', { migrationId: this.migrationId });
      await this.notifyProgress();

      return { success: true, message: 'Migración cancelada exitosamente' };
    } catch (error) {
      this.logError('Error al cancelar migración', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener estado de migración por ID
   */
  async getMigrationStatus(migrationId) {
    try {
      const migrations = await this.getByField('migrationId', migrationId);
      return {
        success: true,
        data: migrations.length > 0 ? migrations[0] : null
      };
    } catch (error) {
      this.logError('Error al obtener estado de migración', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Limpiar logs de migración antiguos
   */
  async cleanOldMigrations(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const oldMigrations = await this.search('createdAt', '<', cutoffDate);
      let cleanedCount = 0;

      for (const migration of oldMigrations) {
        await this.delete(migration.id);
        cleanedCount++;
      }

      this.log(`Limpieza completada: ${cleanedCount} migraciones antiguas eliminadas`);
      return { success: true, cleanedCount };
    } catch (error) {
      this.logError('Error en limpieza de migraciones', error);
      return { success: false, error: error.message };
    }
  }
}

// Crear instancia singleton
const migrationService = new MigrationService();

// Exportar métodos para compatibilidad con código existente
export const startMigration = (historicalData) => migrationService.startMigration(historicalData);
export const cancelMigration = () => migrationService.cancelMigration();
export const getMigrationStatus = (migrationId) => migrationService.getMigrationStatus(migrationId);
export const onProgress = (callback) => migrationService.onProgress(callback);
export const cleanOldMigrations = (daysOld) => migrationService.cleanOldMigrations(daysOld);

// Exportar clase y constantes
export { COLLECTIONS };
export default migrationService;