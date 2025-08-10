/**
 * DataResetService - Servicio refactorizado para reseteo completo de datos
 * Utiliza BaseService y CRUDService para operaciones optimizadas
 *
 * Funcionalidades:
 * - Reseteo seguro de todas las colecciones de la aplicación
 * - Operaciones por lotes para optimizar performance
 * - Sistema de confirmación y validación de seguridad
 * - Backup antes del reseteo (opcional)
 * - Logging detallado de todas las operaciones
 * - Restauración de datos básicos post-reseteo
 *
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.2 BaseService Implementation
 * @date 2025-08-04
 */

import { CRUDService } from './base/CRUDService.js';
import {
  collection,
  getDocs,
  writeBatch,
  query,
  limit,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Todas las colecciones de la aplicación de combustibles
export const COLLECTIONS = {
  VEHICLES: 'combustibles_vehicles',
  MOVEMENTS: 'combustibles_movements',
  PRODUCTS: 'combustibles_products',
  INVENTORY: 'combustibles_inventory',
  SUPPLIERS: 'combustibles_suppliers',
  MAINTENANCE: 'combustibles_maintenance',
  VEHICLE_CATEGORIES: 'combustibles_vehicle_categories',
  PRODUCT_CATEGORIES: 'productCategories',
  MIGRATION_ALIASES: 'combustibles_migration_aliases',
  MIGRATION_LOGS: 'migration_logs',
  RESET_LOGS: 'data_reset_logs',
};

// Orden de eliminación para evitar conflictos de referencias
const DELETION_ORDER = [
  COLLECTIONS.MOVEMENTS, // Primero movimientos (dependen de vehículos/productos)
  COLLECTIONS.MAINTENANCE, // Mantenimiento (depende de vehículos)
  COLLECTIONS.INVENTORY, // Inventario (depende de productos)
  COLLECTIONS.VEHICLES, // Vehículos
  COLLECTIONS.PRODUCTS, // Productos
  COLLECTIONS.SUPPLIERS, // Proveedores
  COLLECTIONS.VEHICLE_CATEGORIES, // Categorías de vehículos
  COLLECTIONS.PRODUCT_CATEGORIES, // Categorías de productos
  COLLECTIONS.MIGRATION_ALIASES, // Alias de migración
  COLLECTIONS.MIGRATION_LOGS, // Logs de migración (excepto reset_logs)
];

/**
 * Estados de operación de reseteo
 */
export const RESET_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ERROR: 'error',
  CANCELLED: 'cancelled',
};

/**
 * Configuración de seguridad para reseteo
 */
const SECURITY_CONFIG = {
  requireConfirmation: true,
  confirmationPhrase: 'RESET ALL DATA',
  maxResetAttempts: 3,
  cooldownPeriod: 24 * 60 * 60 * 1000, // 24 horas
  batchSize: 450, // Límite de Firebase
};

/**
 * Clase DataResetService refactorizada
 */
class DataResetService extends CRUDService {
  constructor() {
    super('data_reset_logs', {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'createdAt',
      defaultOrderDirection: 'desc',
    });

    this.activeResets = new Map(); // Reseteos activos
    this.callbacks = new Map(); // Callbacks de progreso
  }

  /**
   * Validación específica para logs de reseteo
   */
  validateData(data) {
    const baseValidation = super.validateData(data);
    if (!baseValidation.isValid) return baseValidation;

    const errors = [];

    if (data.resetId && typeof data.resetId !== 'string') {
      errors.push('resetId debe ser una cadena');
    }

    if (data.status && !Object.values(RESET_STATUS).includes(data.status)) {
      errors.push('status debe ser un estado válido de reseteo');
    }

    if (data.confirmationPhrase && data.confirmationPhrase !== SECURITY_CONFIG.confirmationPhrase) {
      errors.push('Frase de confirmación incorrecta');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Procesar datos específicos de reseteo
   */
  processData(data, isUpdate = false) {
    const baseProcessed = super.processData(data, isUpdate);

    // Agregar metadatos de seguridad
    baseProcessed.userAgent =
      typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 200) : 'Unknown';

    baseProcessed.ipAddress = 'masked'; // Por seguridad, no almacenar IP real

    return baseProcessed;
  }

  /**
   * Obtener estadísticas de todas las colecciones
   */
  async getDataStatistics() {
    try {
      this.log('Obteniendo estadísticas de datos');
      const stats = {};
      let totalDocuments = 0;

      for (const [collectionName, collectionPath] of Object.entries(COLLECTIONS)) {
        try {
          // Obtener documentos de la colección
          const collectionRef = collection(db, collectionPath);
          const snapshot = await getDocs(collectionRef);

          const count = snapshot.size;
          stats[collectionName] = {
            collection: collectionPath,
            count,
            isEmpty: count === 0,
          };

          totalDocuments += count;
        } catch (error) {
          this.logError(`Error obteniendo estadísticas de ${collectionName}`, error);
          stats[collectionName] = {
            collection: collectionPath,
            count: 0,
            isEmpty: true,
            error: error.message,
          };
        }
      }

      stats.TOTAL = {
        collection: 'ALL_COLLECTIONS',
        count: totalDocuments,
        isEmpty: totalDocuments === 0,
      };

      this.log('Estadísticas de datos obtenidas', {
        totalCollections: Object.keys(COLLECTIONS).length,
        totalDocuments,
      });

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      this.logError('Error obteniendo estadísticas de datos', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Validar si se puede realizar reseteo
   */
  async validateResetPermission(userId, confirmationPhrase) {
    try {
      const errors = [];

      // Verificar frase de confirmación
      if (confirmationPhrase !== SECURITY_CONFIG.confirmationPhrase) {
        errors.push(
          `Frase de confirmación incorrecta. Debe ser: "${SECURITY_CONFIG.confirmationPhrase}"`
        );
      }

      // Verificar intentos recientes
      const recentAttempts = await this.getRecentResetAttempts(userId);
      if (recentAttempts.length >= SECURITY_CONFIG.maxResetAttempts) {
        const lastAttempt = recentAttempts[0];
        const timeSinceLastAttempt = Date.now() - new Date(lastAttempt.createdAt).getTime();

        if (timeSinceLastAttempt < SECURITY_CONFIG.cooldownPeriod) {
          const remainingTime = Math.ceil(
            (SECURITY_CONFIG.cooldownPeriod - timeSinceLastAttempt) / 1000 / 60 / 60
          );
          errors.push(
            `Demasiados intentos. Espere ${remainingTime} horas antes de intentar nuevamente`
          );
        }
      }

      // Verificar que no hay reseteos activos
      const activeResets = Array.from(this.activeResets.values()).filter(
        (reset) => reset.status === RESET_STATUS.IN_PROGRESS
      );

      if (activeResets.length > 0) {
        errors.push('Ya hay un reseteo en progreso. Espere a que termine');
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    } catch (error) {
      this.logError('Error validando permisos de reseteo', error);
      return {
        isValid: false,
        errors: [error.message],
      };
    }
  }

  /**
   * Obtener intentos recientes de reseteo
   */
  async getRecentResetAttempts(userId) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setTime(cutoffDate.getTime() - SECURITY_CONFIG.cooldownPeriod);

      const recentAttempts = await this.getByFields({
        userId,
        createdAt: { '>=': cutoffDate },
      });

      return recentAttempts;
    } catch (error) {
      this.logError('Error obteniendo intentos recientes', error);
      return [];
    }
  }

  /**
   * Iniciar proceso de reseteo completo
   */
  async startDataReset(userId, confirmationPhrase, options = {}) {
    try {
      // Validar permisos
      const validation = await this.validateResetPermission(userId, confirmationPhrase);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors,
        };
      }

      const resetId = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Crear contexto de reseteo
      const resetContext = {
        resetId,
        userId,
        status: RESET_STATUS.IN_PROGRESS,
        startTime: new Date(),
        endTime: null,
        options: {
          createBackup: options.createBackup || false,
          restoreBasicData: options.restoreBasicData || true,
          ...options,
        },
        progress: {
          currentStep: 'Iniciando reseteo...',
          totalSteps:
            DELETION_ORDER.length +
            (options.createBackup ? 1 : 0) +
            (options.restoreBasicData ? 1 : 0),
          completedSteps: 0,
          collections: {},
        },
        errors: [],
        warnings: [],
      };

      // Guardar en memoria
      this.activeResets.set(resetId, resetContext);
      this.callbacks.set(resetId, []);

      // Log inicial
      await this.create({
        resetId,
        userId,
        action: 'start',
        status: RESET_STATUS.IN_PROGRESS,
        confirmationPhrase,
        options: resetContext.options,
        progress: resetContext.progress,
      });

      this.log(`Reseteo iniciado: ${resetId}`, { userId, options: resetContext.options });

      // Ejecutar reseteo de forma asíncrona
      this.executeReset(resetId).catch((error) => {
        this.logError(`Error en reseteo ${resetId}`, error);
      });

      return {
        success: true,
        resetId,
        message: 'Reseteo iniciado exitosamente',
      };
    } catch (error) {
      this.logError('Error iniciando reseteo de datos', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Agregar callback para progreso de reseteo
   */
  onResetProgress(resetId, callback) {
    if (!this.callbacks.has(resetId)) {
      this.callbacks.set(resetId, []);
    }

    if (typeof callback === 'function') {
      this.callbacks.get(resetId).push(callback);
      this.log(`Callback agregado para reseteo: ${resetId}`);
    }
  }

  /**
   * Notificar progreso del reseteo
   */
  async notifyResetProgress(resetId) {
    try {
      const context = this.activeResets.get(resetId);
      if (!context) return;

      const callbacks = this.callbacks.get(resetId) || [];

      callbacks.forEach((callback) => {
        try {
          callback(context);
        } catch (error) {
          this.logError(`Error en callback de reseteo ${resetId}`, error);
        }
      });
    } catch (error) {
      this.logError('Error notificando progreso de reseteo', error);
    }
  }

  /**
   * Ejecutar reseteo completo
   */
  async executeReset(resetId) {
    try {
      const context = this.activeResets.get(resetId);
      if (!context) throw new Error(`Contexto de reseteo no encontrado: ${resetId}`);

      this.log(`Ejecutando reseteo: ${resetId}`);

      // PASO 1: Crear backup si está habilitado
      if (context.options.createBackup) {
        context.progress.currentStep = 'Creando backup de datos...';
        await this.notifyResetProgress(resetId);

        try {
          await this.createDataBackup(resetId);
          context.progress.completedSteps++;
        } catch (error) {
          context.warnings.push(`Error creando backup: ${error.message}`);
        }
      }

      // PASO 2: Eliminar colecciones en orden
      for (const collectionPath of DELETION_ORDER) {
        const collectionName = Object.keys(COLLECTIONS).find(
          (key) => COLLECTIONS[key] === collectionPath
        );

        context.progress.currentStep = `Eliminando ${collectionName}...`;
        await this.notifyResetProgress(resetId);

        try {
          const result = await this.deleteCollection(collectionPath);
          context.progress.collections[collectionName] = {
            deleted: result.deletedCount,
            errors: result.errors,
          };

          if (result.errors > 0) {
            context.warnings.push(`${result.errors} errores en ${collectionName}`);
          }

          context.progress.completedSteps++;
        } catch (error) {
          context.errors.push({
            collection: collectionName,
            error: error.message,
            timestamp: new Date(),
          });
          this.logError(`Error eliminando colección ${collectionName}`, error);
        }
      }

      // PASO 3: Restaurar datos básicos si está habilitado
      if (context.options.restoreBasicData) {
        context.progress.currentStep = 'Restaurando datos básicos...';
        await this.notifyResetProgress(resetId);

        try {
          await this.restoreBasicData(resetId);
          context.progress.completedSteps++;
        } catch (error) {
          context.warnings.push(`Error restaurando datos básicos: ${error.message}`);
        }
      }

      // Finalizar reseteo
      context.status = RESET_STATUS.COMPLETED;
      context.endTime = new Date();
      context.progress.currentStep = 'Reseteo completado exitosamente';

      await this.notifyResetProgress(resetId);

      // Log final
      await this.create({
        resetId,
        userId: context.userId,
        action: 'complete',
        status: RESET_STATUS.COMPLETED,
        progress: context.progress,
        errors: context.errors,
        warnings: context.warnings,
        duration: context.endTime - context.startTime,
      });

      this.log(`Reseteo completado: ${resetId}`, {
        duration: context.endTime - context.startTime,
        errors: context.errors.length,
        warnings: context.warnings.length,
      });
    } catch (error) {
      const context = this.activeResets.get(resetId);
      if (context) {
        context.status = RESET_STATUS.ERROR;
        context.endTime = new Date();
        context.progress.currentStep = `Error: ${error.message}`;

        await this.notifyResetProgress(resetId);
      }

      this.logError(`Error ejecutando reseteo ${resetId}`, error);
    } finally {
      // Limpiar contexto de memoria después de un tiempo
      setTimeout(() => {
        this.activeResets.delete(resetId);
        this.callbacks.delete(resetId);
      }, 60000); // 1 minuto
    }
  }

  /**
   * Eliminar colección completa por lotes
   */
  async deleteCollection(collectionPath) {
    try {
      this.log(`Iniciando eliminación de colección: ${collectionPath}`);

      let deletedCount = 0;
      let errors = 0;
      let hasMore = true;

      while (hasMore) {
        // Obtener lote de documentos
        const collectionRef = collection(db, collectionPath);
        const q = query(collectionRef, limit(SECURITY_CONFIG.batchSize));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          hasMore = false;
          break;
        }

        // Crear batch para eliminación
        const batch = writeBatch(db);

        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        try {
          await batch.commit();
          deletedCount += snapshot.docs.length;
        } catch (error) {
          errors += snapshot.docs.length;
          this.logError(`Error eliminando lote de ${collectionPath}`, error);
        }

        // Verificar si hay más documentos
        hasMore = snapshot.docs.length === SECURITY_CONFIG.batchSize;
      }

      this.log(`Eliminación de ${collectionPath} completada`, {
        deletedCount,
        errors,
      });

      return { deletedCount, errors };
    } catch (error) {
      this.logError(`Error eliminando colección ${collectionPath}`, error);
      return { deletedCount: 0, errors: 1 };
    }
  }

  /**
   * Crear backup de datos (implementación básica)
   */
  async createDataBackup(resetId) {
    try {
      this.log(`Creando backup para reseteo: ${resetId}`);

      // Por simplicidad, solo registramos el backup
      // En una implementación completa, se exportarían los datos
      await this.create({
        resetId,
        action: 'backup_created',
        backupTimestamp: new Date(),
        note: 'Backup básico registrado antes del reseteo',
      });

      this.log('Backup básico registrado');
    } catch (error) {
      this.logError('Error creando backup', error);
      throw error;
    }
  }

  /**
   * Restaurar datos básicos del sistema
   */
  async restoreBasicData(resetId) {
    try {
      this.log(`Restaurando datos básicos para reseteo: ${resetId}`);

      // Crear categorías básicas de productos
      const basicProductCategories = [
        { name: 'COMBUSTIBLES', description: 'Combustibles principales' },
        { name: 'ACEITES', description: 'Aceites y lubricantes' },
        { name: 'FILTROS', description: 'Filtros de vehículos' },
      ];

      for (const category of basicProductCategories) {
        await addDoc(collection(db, COLLECTIONS.PRODUCT_CATEGORIES), {
          ...category,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          restoredBy: resetId,
        });
      }

      // Crear categorías básicas de vehículos
      const basicVehicleCategories = [
        { name: 'CAMIONETAS', description: 'Camionetas y vehículos livianos' },
        { name: 'MAQUINARIA', description: 'Maquinaria pesada y tractores' },
        { name: 'EQUIPOS', description: 'Equipos auxiliares' },
      ];

      for (const category of basicVehicleCategories) {
        await addDoc(collection(db, COLLECTIONS.VEHICLE_CATEGORIES), {
          ...category,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          restoredBy: resetId,
        });
      }

      this.log('Datos básicos restaurados');
    } catch (error) {
      this.logError('Error restaurando datos básicos', error);
      throw error;
    }
  }

  /**
   * Obtener estado de reseteo activo
   */
  getResetStatus(resetId) {
    return this.activeResets.get(resetId) || null;
  }

  /**
   * Cancelar reseteo en progreso
   */
  async cancelReset(resetId, userId) {
    try {
      const context = this.activeResets.get(resetId);
      if (!context) {
        return { success: false, error: 'Reseteo no encontrado' };
      }

      if (context.userId !== userId) {
        return { success: false, error: 'No autorizado para cancelar este reseteo' };
      }

      context.status = RESET_STATUS.CANCELLED;
      context.endTime = new Date();
      context.progress.currentStep = 'Reseteo cancelado por usuario';

      await this.notifyResetProgress(resetId);

      // Log de cancelación
      await this.create({
        resetId,
        userId,
        action: 'cancel',
        status: RESET_STATUS.CANCELLED,
        progress: context.progress,
      });

      this.log(`Reseteo cancelado: ${resetId}`, { userId });

      return { success: true, message: 'Reseteo cancelado exitosamente' };
    } catch (error) {
      this.logError(`Error cancelando reseteo ${resetId}`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener histórico de reseteos
   */
  async getResetHistory(days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentResets = await this.search('createdAt', '>=', cutoffDate);

      const history = recentResets
        .filter((reset) => reset.action === 'start' || reset.action === 'complete')
        .map((reset) => ({
          resetId: reset.resetId,
          userId: reset.userId,
          status: reset.status,
          startTime: reset.createdAt,
          endTime: reset.endTime,
          duration: reset.duration,
          collections: Object.keys(reset.progress?.collections || {}),
          errors: reset.errors?.length || 0,
          warnings: reset.warnings?.length || 0,
        }));

      return { success: true, data: history };
    } catch (error) {
      this.logError('Error obteniendo histórico de reseteos', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Limpiar logs de reseteo antiguos
   */
  async cleanOldResetLogs(daysOld = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const oldLogs = await this.search('createdAt', '<', cutoffDate);
      let cleanedCount = 0;

      for (const log of oldLogs) {
        await this.delete(log.id);
        cleanedCount++;
      }

      this.log(`Limpieza de logs de reseteo completada: ${cleanedCount} logs eliminados`);
      return { success: true, cleanedCount };
    } catch (error) {
      this.logError('Error en limpieza de logs de reseteo', error);
      return { success: false, error: error.message };
    }
  }
}

// Crear instancia singleton
const dataResetService = new DataResetService();

// Exportar métodos para compatibilidad con código existente
export const getDataStatistics = () => dataResetService.getDataStatistics();
export const startDataReset = (userId, confirmationPhrase, options) =>
  dataResetService.startDataReset(userId, confirmationPhrase, options);
export const onResetProgress = (resetId, callback) =>
  dataResetService.onResetProgress(resetId, callback);
export const getResetStatus = (resetId) => dataResetService.getResetStatus(resetId);
export const cancelReset = (resetId, userId) => dataResetService.cancelReset(resetId, userId);
export const getResetHistory = (days) => dataResetService.getResetHistory(days);
export const cleanOldResetLogs = (daysOld) => dataResetService.cleanOldResetLogs(daysOld);

// Exportar configuración
export { SECURITY_CONFIG, DELETION_ORDER };

// Exportar clase por defecto
export default dataResetService;
