/**
 * MigrationService - Servicio para migración de datos históricos
 * Maneja la importación completa de datos Excel históricos a Firebase
 * Estrategia: Migrar todo EXCEPTO cálculos de stock (análisis posterior)
 */

import { 
  collection, 
  addDoc,
  // updateDoc, 
  doc, 
  // getDocs, 
  // query, 
  // where,
  writeBatch,
  serverTimestamp,
  // runTransaction
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { createVehicle, getVehicleByCode, updateVehicle } from './vehiclesService';
import { /* createProduct, */ getProductByCode } from './productsService';

// Colecciones Firebase
const VEHICLES_COLLECTION = 'combustibles_vehicles';
const MOVEMENTS_COLLECTION = 'combustibles_movements';
const PRODUCTS_COLLECTION = 'combustibles_products';
const MIGRATION_LOG_COLLECTION = 'migration_logs';

/**
 * Clase principal para migración de datos históricos
 */
class MigrationService {
  constructor() {
    this.migrationId = `migration_${Date.now()}`;
    this.progress = {
      currentStep: '',
      totalSteps: 5,
      stepNumber: 0,
      vehicles: { total: 0, processed: 0, errors: 0 },
      movements: { total: 0, processed: 0, errors: 0 },
      products: { total: 0, processed: 0, errors: 0 },
      maintenance: { total: 0, processed: 0, errors: 0 },
      errors: [],
      warnings: []
    };
    this.callbacks = [];
  }

  /**
   * Agregar callback para progreso
   */
  onProgress(callback) {
    this.callbacks.push(callback);
  }

  /**
   * Notificar progreso a todos los callbacks
   */
  notifyProgress() {
    this.callbacks.forEach(callback => callback(this.progress));
  }

  /**
   * Iniciar migración completa
   */
  async startMigration(historicalData) {
    try {
      await this.logMigrationStart();
      
      this.progress.currentStep = 'Preparando migración...';
      this.notifyProgress();

      // FASE 1: Migrar vehículos y equipos
      this.progress.currentStep = 'Migrando vehículos y equipos...';
      this.progress.currentStepNumber = 1;
      this.notifyProgress();
      
      await this.migrateVehicles(historicalData.vehicles);

      // FASE 2: Migrar productos (sin stock)
      this.progress.currentStep = 'Migrando productos...';
      this.progress.currentStepNumber = 2;
      this.notifyProgress();
      
      await this.migrateProducts(historicalData.products);

      // FASE 3: Migrar movimientos históricos
      this.progress.currentStep = 'Migrando movimientos históricos...';
      this.progress.currentStepNumber = 3;
      this.notifyProgress();
      
      await this.migrateMovements(historicalData.movements);

      // FASE 4: Migrar datos de mantenimiento
      this.progress.currentStep = 'Migrando datos de mantenimiento...';
      this.progress.currentStepNumber = 4;
      this.notifyProgress();
      
      await this.migrateMaintenance(historicalData.maintenance);

      // FASE 5: Finalizar migración
      this.progress.currentStep = 'Finalizando migración...';
      this.progress.currentStepNumber = 5;
      this.notifyProgress();
      
      await this.finalizeMigration();

      this.progress.currentStep = '¡Migración completada exitosamente!';
      this.notifyProgress();

      return {
        success: true,
        migrationId: this.migrationId,
        summary: this.generateSummary()
      };

    } catch (error) {
      console.error('❌ Error en migración:', error);
      await this.logMigrationError(error);
      
      this.progress.errors.push({
        type: 'MIGRATION_FAILED',
        message: error.message,
        timestamp: new Date()
      });
      
      throw new Error(`Migración fallida: ${error.message}`);
    }
  }

  /**
   * Migrar vehículos y equipos históricos
   */
  async migrateVehicles(vehiclesData) {
    console.log('📋 Iniciando migración de vehículos...');
    
    this.progress.vehicles.total = vehiclesData.length;
    
    for (let i = 0; i < vehiclesData.length; i++) {
      const vehicleData = vehiclesData[i];
      
      try {
        // Verificar si el vehículo ya existe
        const existingVehicle = await getVehicleByCode(vehicleData.vehicleId);
        
        if (existingVehicle) {
          // Actualizar vehículo existente con datos históricos
          await this.updateExistingVehicle(existingVehicle, vehicleData);
          this.progress.warnings.push(`Vehículo ${vehicleData.vehicleId} ya existe - actualizado con datos históricos`);
        } else {
          // Crear nuevo vehículo
          await this.createNewVehicle(vehicleData);
        }
        
        this.progress.vehicles.processed++;
        
      } catch (error) {
        console.error(`❌ Error migrando vehículo ${vehicleData.vehicleId}:`, error);
        this.progress.vehicles.errors++;
        this.progress.errors.push({
          type: 'VEHICLE_MIGRATION_ERROR',
          vehicleId: vehicleData.vehicleId,
          message: error.message,
          timestamp: new Date()
        });
      }
      
      this.notifyProgress();
    }
    
    console.log(`✅ Migración de vehículos completada: ${this.progress.vehicles.processed}/${this.progress.vehicles.total}`);
  }

  /**
   * Migrar productos (sin calcular stock)
   */
  async migrateProducts(productsData) {
    console.log('📦 Iniciando migración de productos...');
    
    this.progress.products.total = productsData.length;
    
    for (let i = 0; i < productsData.length; i++) {
      const productData = productsData[i];
      
      try {
        // Verificar si el producto ya existe
        const existingProduct = await getProductByCode(productData.code);
        
        if (existingProduct) {
          // Actualizar producto existente (sin tocar inventario)
          await this.updateExistingProduct(existingProduct, productData);
          this.progress.warnings.push(`Producto ${productData.code} ya existe - actualizado sin modificar inventario`);
        } else {
          // Crear nuevo producto (sin inventario inicial)
          await this.createNewProduct(productData);
        }
        
        this.progress.products.processed++;
        
      } catch (error) {
        console.error(`❌ Error migrando producto ${productData.code}:`, error);
        this.progress.products.errors++;
        this.progress.errors.push({
          type: 'PRODUCT_MIGRATION_ERROR',
          productCode: productData.code,
          message: error.message,
          timestamp: new Date()
        });
      }
      
      this.notifyProgress();
    }
    
    console.log(`✅ Migración de productos completada: ${this.progress.products.processed}/${this.progress.products.total}`);
  }

  /**
   * Migrar movimientos históricos (1,446+ registros)
   */
  async migrateMovements(movementsData) {
    console.log('🔄 Iniciando migración de movimientos históricos...');
    
    this.progress.movements.total = movementsData.length;
    
    // Migrar en lotes para mejor performance
    const batchSize = 50;
    const totalBatches = Math.ceil(movementsData.length / batchSize);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const startIndex = batchIndex * batchSize;
      const endIndex = Math.min(startIndex + batchSize, movementsData.length);
      const batchData = movementsData.slice(startIndex, endIndex);
      
      await this.processBatchMovements(batchData);
      
      this.progress.currentStep = `Migrando movimientos... Lote ${batchIndex + 1}/${totalBatches}`;
      this.notifyProgress();
    }
    
    console.log(`✅ Migración de movimientos completada: ${this.progress.movements.processed}/${this.progress.movements.total}`);
  }

  /**
   * Procesar lote de movimientos
   */
  async processBatchMovements(batchData) {
    const batch = writeBatch(db);
    
    for (const movementData of batchData) {
      try {
        const processedMovement = await this.processMovement(movementData);
        
        if (processedMovement) {
          const movementRef = doc(collection(db, MOVEMENTS_COLLECTION));
          batch.set(movementRef, processedMovement);
          this.progress.movements.processed++;
        }
        
      } catch (error) {
        console.error('❌ Error procesando movimiento:', error);
        this.progress.movements.errors++;
        this.progress.errors.push({
          type: 'MOVEMENT_PROCESSING_ERROR',
          movement: movementData,
          message: error.message,
          timestamp: new Date()
        });
      }
    }
    
    try {
      await batch.commit();
      console.log(`✅ Lote de ${batchData.length} movimientos migrado exitosamente`);
    } catch (error) {
      console.error('❌ Error en commit de lote:', error);
      throw error;
    }
  }

  /**
   * Migrar datos de mantenimiento
   */
  async migrateMaintenance(maintenanceData) {
    console.log('🔧 Iniciando migración de datos de mantenimiento...');
    
    this.progress.maintenance.total = maintenanceData.length;
    
    for (let i = 0; i < maintenanceData.length; i++) {
      const maintenanceRecord = maintenanceData[i];
      
      try {
        await this.processMaintenanceRecord(maintenanceRecord);
        this.progress.maintenance.processed++;
        
      } catch (error) {
        console.error('❌ Error migrando mantenimiento:', error);
        this.progress.maintenance.errors++;
        this.progress.errors.push({
          type: 'MAINTENANCE_MIGRATION_ERROR',
          record: maintenanceRecord,
          message: error.message,
          timestamp: new Date()
        });
      }
      
      this.notifyProgress();
    }
    
    console.log(`✅ Migración de mantenimiento completada: ${this.progress.maintenance.processed}/${this.progress.maintenance.total}`);
  }

  /**
   * Procesar un movimiento individual
   */
  async processMovement(rawMovement) {
    // Normalizar y validar datos del movimiento
    const normalizedMovement = this.normalizeMovementData(rawMovement);
    
    if (!this.validateMovement(normalizedMovement)) {
      throw new Error(`Movimiento inválido: ${JSON.stringify(rawMovement)}`);
    }
    
    return {
      ...normalizedMovement,
      migrationId: this.migrationId,
      createdAt: normalizedMovement.date || serverTimestamp(),
      updatedAt: serverTimestamp(),
      isHistorical: true,
      source: 'historical_migration'
    };
  }

  /**
   * Crear nuevo vehículo desde datos históricos
   */
  async createNewVehicle(vehicleData) {
    const normalizedVehicle = {
      vehicleId: vehicleData.vehicleId,
      name: vehicleData.name,
      type: vehicleData.type,
      category: vehicleData.category || 'general',
      fuelType: vehicleData.fuelType,
      status: 'activo',
      currentLocation: vehicleData.location || 'No especificada',
      hasHourMeter: vehicleData.hasHourMeter || false,
      currentHours: vehicleData.currentHours || 0,
      totalHoursWorked: vehicleData.totalHoursWorked || 0,
      totalFuelConsumed: 0, // Se calculará después del análisis
      estimatedConsumptionPerHour: vehicleData.estimatedConsumption || 0,
      migrationId: this.migrationId,
      source: 'historical_migration'
    };
    
    return await createVehicle(normalizedVehicle);
  }

  /**
   * Actualizar vehículo existente con datos históricos
   */
  async updateExistingVehicle(existingVehicle, historicalData) {
    const updateData = {
      // Actualizar horómetro si es más reciente
      ...(historicalData.currentHours > existingVehicle.currentHours ? {
        currentHours: historicalData.currentHours,
        lastHourMeterDate: serverTimestamp()
      } : {}),
      
      // Agregar datos históricos al registro
      historicalDataMigrated: true,
      migrationId: this.migrationId,
      updatedAt: serverTimestamp()
    };
    
    return await updateVehicle(existingVehicle.id, updateData);
  }

  /**
   * Normalizar datos de movimiento
   */
  normalizeMovementData(rawMovement) {
    return {
      code: rawMovement.codigo,
      date: this.parseHistoricalDate(rawMovement.fecha),
      productType: this.mapProductType(rawMovement.articulo),
      destinationVehicle: this.mapVehicleDestination(rawMovement.usuario),
      quantity: this.parseQuantity(rawMovement.cantidad),
      type: 'salida', // Todos los movimientos históricos son salidas
      location: this.extractLocation(rawMovement.usuario),
      originalData: rawMovement // Preservar datos originales para auditoría
    };
  }

  /**
   * Validar movimiento
   */
  validateMovement(movement) {
    return movement.date && 
           movement.productType && 
           movement.quantity > 0 &&
           movement.destinationVehicle;
  }

  /**
   * Parsear fechas históricas (maneja DD/MM/YYYY y MM/DD/YYYY)
   */
  parseHistoricalDate(dateString) {
    if (!dateString) return null;
    
    try {
      // Intentar varios formatos de fecha
      const formats = [
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY o MM/DD/YYYY
        /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/   // DD/MM/YY o MM/DD/YY
      ];
      
      for (const format of formats) {
        const match = dateString.match(format);
        if (match) {
          let [, part1, part2, year] = match;
          
          // Convertir año de 2 dígitos
          if (year.length === 2) {
            year = parseInt(year) > 50 ? `19${year}` : `20${year}`;
          }
          
          // Determinar si es DD/MM o MM/DD basándose en valores
          let day, month;
          if (parseInt(part1) > 12) {
            // part1 debe ser día
            day = part1;
            month = part2;
          } else if (parseInt(part2) > 12) {
            // part2 debe ser día  
            day = part2;
            month = part1;
          } else {
            // Ambiguo - asumir DD/MM para datos históricos
            day = part1;
            month = part2;
          }
          
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          
          if (!isNaN(date.getTime())) {
            return date;
          }
        }
      }
      
      // Si no funciona ningún formato, intentar parsing directo
      const directDate = new Date(dateString);
      if (!isNaN(directDate.getTime())) {
        return directDate;
      }
      
    } catch {
      console.warn(`⚠️ No se pudo parsear fecha: ${dateString}`);
    }
    
    return null;
  }

  /**
   * Mapear tipo de producto
   */
  mapProductType(articulo) {
    const mapping = {
      'GASOLINA': 'Gasolina',
      'ACPM': 'Diesel',
      'Aceite Hidraulico': 'Aceite Hidraulico',
      'Aceite Motor 20w50': 'Aceite Motor',
      'GRASA': 'Grasa',
      'Valbulina': 'Valbulina',
      'Liquido para frenos': 'Liquido Frenos',
      'Mistura 2t': 'Mistura 2T',
      'ACEITE 15W40': 'Aceite 15W40'
    };
    
    return mapping[articulo] || articulo;
  }

  /**
   * Mapear destino del vehículo
   */
  mapVehicleDestination(usuario) {
    const vehicleMapping = {
      'TR-1': 'TR-001',
      'TR-2': 'TR-002', 
      'TR-3': 'TR-003',
      'VOLQUETA': 'VQ-001',
      'Camioneta Amarilla': 'CA-001',
      'Camioneta Burbuja': 'CB-001',
      'CARRO AZUL': 'CAZ-001',
      'Moto XTZ Negra': 'MXN-001',
      'Moto XR150 Blanca': 'MXB-001'
    };
    
    return vehicleMapping[usuario] || this.generateVehicleCode(usuario);
  }

  /**
   * Generar código de vehículo automáticamente
   */
  generateVehicleCode(name) {
    const words = name.split(' ');
    let code = '';
    
    for (const word of words) {
      if (word.length > 0) {
        code += word[0].toUpperCase();
        if (code.length >= 3) break;
      }
    }
    
    return `${code}-001`;
  }

  /**
   * Parsear cantidad
   */
  parseQuantity(cantidad) {
    if (typeof cantidad === 'number') return cantidad;
    if (typeof cantidad === 'string') {
      const parsed = parseFloat(cantidad.replace(',', '.'));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  /**
   * Extraer ubicación del destino
   */
  extractLocation(usuario) {
    const locationKeywords = ['Campamento', 'Vivero', 'Austria'];
    
    for (const keyword of locationKeywords) {
      if (usuario.includes(keyword)) {
        return usuario;
      }
    }
    
    return 'Campo'; // Ubicación por defecto para vehículos
  }

  /**
   * Generar resumen de migración
   */
  generateSummary() {
    return {
      migrationId: this.migrationId,
      timestamp: new Date(),
      totals: {
        vehicles: this.progress.vehicles,
        products: this.progress.products,
        movements: this.progress.movements,
        maintenance: this.progress.maintenance
      },
      errors: this.progress.errors,
      warnings: this.progress.warnings
    };
  }

  /**
   * Log inicio de migración
   */
  async logMigrationStart() {
    const logData = {
      migrationId: this.migrationId,
      type: 'MIGRATION_START',
      timestamp: serverTimestamp(),
      status: 'in_progress'
    };
    
    await addDoc(collection(db, MIGRATION_LOG_COLLECTION), logData);
  }

  /**
   * Log error de migración
   */
  async logMigrationError(error) {
    const logData = {
      migrationId: this.migrationId,
      type: 'MIGRATION_ERROR',
      error: error.message,
      timestamp: serverTimestamp(),
      status: 'failed'
    };
    
    await addDoc(collection(db, MIGRATION_LOG_COLLECTION), logData);
  }

  /**
   * Finalizar migración
   */
  async finalizeMigration() {
    const logData = {
      migrationId: this.migrationId,
      type: 'MIGRATION_COMPLETE',
      summary: this.generateSummary(),
      timestamp: serverTimestamp(),
      status: 'completed'
    };
    
    await addDoc(collection(db, MIGRATION_LOG_COLLECTION), logData);
    
    console.log('✅ Migración completada exitosamente:', this.migrationId);
  }
}

// Función para crear nueva instancia de migración
export const createMigrationService = () => {
  return new MigrationService();
};

// Función de conveniencia para migración completa
export const migrateHistoricalData = async (historicalData, onProgress) => {
  const migrationService = createMigrationService();
  
  if (onProgress) {
    migrationService.onProgress(onProgress);
  }
  
  return await migrationService.startMigration(historicalData);
};

export default MigrationService;