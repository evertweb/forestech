/**
 * DirectMigrationService - Migración directa usando Firebase Admin
 * Servicio optimizado para migrar datos históricos sin problemas de permisos
 */

import { 
  collection, 
  addDoc,
  getDocs, 
  query, 
  where,
  writeBatch,
  serverTimestamp,
  doc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { getHistoricalDataFromAnalysis } from '../utils/googleSheetsIntegration';

const COLLECTIONS = {
  VEHICLES: 'combustibles_vehicles',
  MOVEMENTS: 'combustibles_movements', 
  PRODUCTS: 'combustibles_products',
  MIGRATION_LOG: 'migration_logs'
};

/**
 * Migración directa usando reglas temporales permisivas
 */
class DirectMigrationService {
  constructor() {
    this.migrationId = `direct_migration_${Date.now()}`;
    this.progress = {
      vehicles: { total: 0, created: 0, existing: 0, errors: 0 },
      movements: { total: 0, created: 0, errors: 0 },
      products: { total: 0, mapped: 0, errors: 0 }
    };
  }

  /**
   * Ejecutar migración completa
   */
  async executeMigration(onProgress) {
    try {
      console.log('🚀 Iniciando migración directa con Firebase MCP...');
      
      await this.logMigrationStart();
      
      // FASE 1: Obtener datos históricos
      const historicalData = await getHistoricalDataFromAnalysis();
      
      onProgress && onProgress({ step: 'Datos históricos cargados', progress: 10 });
      
      // FASE 2: Migrar vehículos
      await this.migrateVehiclesOptimized(historicalData.vehicles);
      onProgress && onProgress({ step: 'Vehículos migrados', progress: 40 });
      
      // FASE 3: Migrar movimientos
      await this.migrateMovementsOptimized(historicalData.movements);
      onProgress && onProgress({ step: 'Movimientos migrados', progress: 80 });
      
      // FASE 4: Finalizar
      await this.finalizeMigration();
      onProgress && onProgress({ step: '¡Migración completada!', progress: 100 });

      return {
        success: true,
        migrationId: this.migrationId,
        summary: this.progress
      };

    } catch (error) {
      console.error('❌ Error en migración directa:', error);
      throw new Error(`Migración fallida: ${error.message}`);
    }
  }

  /**
   * Migrar vehículos optimizado
   */
  async migrateVehiclesOptimized(vehicleNames) {
    console.log('🚜 Migrando vehículos históricos...');
    
    const vehiclesToCreate = this.prepareHistoricalVehicles(vehicleNames);
    this.progress.vehicles.total = vehiclesToCreate.length;

    // Verificar vehículos existentes
    const existingVehicles = await this.getExistingVehicles();
    const existingIds = existingVehicles.map(v => v.vehicleId);

    for (const vehicle of vehiclesToCreate) {
      try {
        if (existingIds.includes(vehicle.vehicleId)) {
          console.log(`⚠️ Vehículo ${vehicle.vehicleId} ya existe - omitiendo`);
          this.progress.vehicles.existing++;
        } else {
          await this.createVehicleDocument(vehicle);
          console.log(`✅ Vehículo ${vehicle.vehicleId} creado exitosamente`);
          this.progress.vehicles.created++;
        }
      } catch (error) {
        console.error(`❌ Error creando vehículo ${vehicle.vehicleId}:`, error);
        this.progress.vehicles.errors++;
      }
    }
  }

  /**
   * Migrar movimientos optimizado
   */
  async migrateMovementsOptimized(movements) {
    console.log('🔄 Migrando movimientos históricos...');
    
    this.progress.movements.total = movements.length;
    const batchSize = 20; // Batches más pequeños para mayor confiabilidad
    
    for (let i = 0; i < movements.length; i += batchSize) {
      const batch = movements.slice(i, i + batchSize);
      await this.processBatch(batch);
      
      // Log de progreso
      const processed = Math.min(i + batchSize, movements.length);
      console.log(`📊 Progreso: ${processed}/${movements.length} movimientos`);
    }
  }

  /**
   * Procesar batch de movimientos
   */
  async processBatch(movementsBatch) {
    const batch = writeBatch(db);
    
    for (const movement of movementsBatch) {
      try {
        const processedMovement = this.processHistoricalMovement(movement);
        const movementRef = doc(collection(db, COLLECTIONS.MOVEMENTS));
        batch.set(movementRef, processedMovement);
        
      } catch (error) {
        console.error('Error procesando movimiento:', error);
        this.progress.movements.errors++;
      }
    }
    
    try {
      await batch.commit();
      this.progress.movements.created += movementsBatch.length;
    } catch (error) {
      console.error('Error en commit de batch:', error);
      this.progress.movements.errors += movementsBatch.length;
    }
  }

  /**
   * Preparar vehículos históricos
   */
  prepareHistoricalVehicles(vehicleNames) {
    const vehicleMap = {
      'TR-1': {
        vehicleId: 'TR-001',
        name: 'TRACTOR TR1', 
        currentHours: 9173,
        estimatedConsumptionPerHour: 3.2,
        hasHourMeter: true
      },
      'TR-2': {
        vehicleId: 'TR-002',
        name: 'TRACTOR TR2',
        currentHours: 7401, 
        estimatedConsumptionPerHour: 3.0,
        hasHourMeter: true
      },
      'TR-3': {
        vehicleId: 'TR-003',
        name: 'TRACTOR TR3',
        currentHours: 3860,
        estimatedConsumptionPerHour: 2.8,
        hasHourMeter: true
      },
      'VOLQUETA': {
        vehicleId: 'VQ-001',
        name: 'VOLQUETA',
        currentHours: 0,
        estimatedConsumptionPerHour: 5.4,
        hasHourMeter: false
      },
      'Camioneta Amarilla': {
        vehicleId: 'CA-001',
        name: 'CAMIONETA AMARILLA',
        currentHours: 0,
        estimatedConsumptionPerHour: 2.5,
        hasHourMeter: false
      },
      'Camioneta Burbuja': {
        vehicleId: 'CB-001', 
        name: 'CAMIONETA BURBUJA',
        currentHours: 0,
        estimatedConsumptionPerHour: 2.5,
        hasHourMeter: false
      },
      'CARRO AZUL': {
        vehicleId: 'CAZ-001',
        name: 'CARRO AZUL',
        currentHours: 0,
        estimatedConsumptionPerHour: 2.0,
        hasHourMeter: false
      }
    };

    return Object.keys(vehicleMap).map(key => {
      const base = vehicleMap[key];
      return {
        ...base,
        category: base.vehicleId.startsWith('TR-') ? 'agricola' : 'transporte',
        brand: base.vehicleId.startsWith('TR-') ? 'JHON DEERE' : 'CHEVROLET',
        fuelType: 'Diesel',
        status: 'activo',
        currentLocation: 'CAMPAMENTO AUSTRIA',
        type: base.vehicleId.startsWith('TR-') ? 'Agrícola/Forestal' : 'Transporte',
        categoryName: base.vehicleId.startsWith('TR-') ? 'Agrícola/Forestal' : 'Transporte',
        categoryIcon: base.vehicleId.startsWith('TR-') ? '🚜' : '🚛',
        categoryColor: base.vehicleId.startsWith('TR-') ? '#2F7D32' : '#FF6B35',
        totalFuelConsumed: 0,
        totalHoursWorked: 0,
        totalMovements: 0,
        migrationId: this.migrationId,
        source: 'historical_migration',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
    });
  }

  /**
   * Procesar movimiento histórico
   */
  processHistoricalMovement(movement) {
    return {
      vehicleId: this.mapVehicleCode(movement.usuario),
      productType: this.mapProductType(movement.articulo),
      quantity: parseFloat(movement.cantidad) || 0,
      type: 'salida',
      location: 'CAMPAMENTO AUSTRIA',
      createdAt: this.parseDate(movement.fecha) || serverTimestamp(),
      updatedAt: serverTimestamp(),
      migrationId: this.migrationId,
      source: 'historical_migration',
      originalData: movement,
      createdBy: 'migration_service'
    };
  }

  /**
   * Crear documento de vehículo
   */
  async createVehicleDocument(vehicleData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.VEHICLES), vehicleData);
      return docRef.id;
    } catch (error) {
      console.error('Error creando vehículo:', error);
      throw error;
    }
  }

  /**
   * Obtener vehículos existentes
   */
  async getExistingVehicles() {
    try {
      const q = query(collection(db, COLLECTIONS.VEHICLES));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error obteniendo vehículos:', error);
      return [];
    }
  }

  /**
   * Mapear código de vehículo
   */
  mapVehicleCode(usuario) {
    const mapping = {
      'TR-1': 'TR-001',
      'TR-2': 'TR-002', 
      'TR-3': 'TR-003',
      'VOLQUETA': 'VQ-001',
      'Camioneta Amarilla': 'CA-001',
      'Camioneta Burbuja': 'CB-001',
      'CARRO AZUL': 'CAZ-001'
    };
    
    return mapping[usuario] || usuario;
  }

  /**
   * Mapear tipo de producto
   */
  mapProductType(articulo) {
    const mapping = {
      'GASOLINA': 'Gasolina',
      'ACPM': 'Diesel'
    };
    
    return mapping[articulo] || articulo;
  }

  /**
   * Parsear fecha histórica
   */
  parseDate(dateString) {
    try {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
      }
    } catch (error) {
      console.warn('Error parseando fecha:', dateString);
    }
    return null;
  }

  /**
   * Log inicio de migración
   */
  async logMigrationStart() {
    try {
      await addDoc(collection(db, COLLECTIONS.MIGRATION_LOG), {
        migrationId: this.migrationId,
        type: 'DIRECT_MIGRATION_START',
        timestamp: serverTimestamp(),
        status: 'in_progress'
      });
    } catch (error) {
      console.warn('No se pudo crear log de migración:', error);
    }
  }

  /**
   * Finalizar migración
   */
  async finalizeMigration() {
    try {
      await addDoc(collection(db, COLLECTIONS.MIGRATION_LOG), {
        migrationId: this.migrationId,
        type: 'DIRECT_MIGRATION_COMPLETE',
        summary: this.progress,
        timestamp: serverTimestamp(),
        status: 'completed'
      });
      
      console.log('✅ Migración directa completada exitosamente:', this.migrationId);
    } catch (error) {
      console.warn('No se pudo crear log de finalización:', error);
    }
  }
}

/**
 * Función principal de migración directa
 */
export const executDirectMigration = async (onProgress) => {
  const service = new DirectMigrationService();
  return await service.executeMigration(onProgress);
};

export default DirectMigrationService;