/**
 * VehicleCategoriesService - Servicio refactorizado para gestión de categorías de vehículos
 * Utiliza BaseService y CRUDService para operaciones optimizadas
 * 
 * Funcionalidades:
 * - Gestión de categorías predeterminadas y personalizadas
 * - CRUD completo con validaciones específicas
 * - Estadísticas de uso por categoría
 * - Suscripciones en tiempo real
 * 
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.2 BaseService Implementation  
 * @date 2025-08-04
 */

import { CRUDService } from './base/CRUDService.js';
import { 
  collection, 
  query, 
  where, 
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  DEFAULT_VEHICLE_CATEGORIES, 
  validateCategory, 
  generateCategoryId, 
  getAllCategories 
} from '../data/vehicleCategories';

/**
 * Clase VehicleCategoriesService
 */
class VehicleCategoriesService extends CRUDService {
  constructor() {
    super('combustibles_vehicle_categories', {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'name',
      defaultOrderDirection: 'asc'
    });
  }

  /**
   * Validación específica para categorías de vehículos
   */
  validateData(data) {
    const baseValidation = super.validateData(data);
    if (!baseValidation.isValid) return baseValidation;
    
    // Usar validador existente del data/vehicleCategories
    const categoryValidation = validateCategory(data);
    if (!categoryValidation.isValid) {
      return {
        isValid: false,
        errors: categoryValidation.errors
      };
    }

    return { isValid: true, errors: [] };
  }

  /**
   * Procesamiento específico para categorías de vehículos
   */
  processData(data, isUpdate = false) {
    const baseProcessed = super.processData(data, isUpdate);
    
    return {
      ...baseProcessed,
      id: data.id || generateCategoryId(data.name),
      name: data.name?.trim(),
      description: data.description?.trim() || '',
      icon: data.icon || '🚗',
      color: data.color || '#666666',
      fuelType: data.fuelType || 'ACPM',
      baseConsumption: Number(data.baseConsumption) || 0,
      engineType: data.engineType || 'diesel',
      isCustom: true, // Las categorías personalizadas siempre son custom
      isActive: data.isActive !== false
    };
  }

  /**
   * Crear categoría personalizada de vehículo
   */
  async createVehicleCategory(categoryData, user) {
    try {
      this.log('createVehicleCategory', { categoryData, user: user?.email });

      // Verificar que no exista una categoría predeterminada con ese nombre
      const existingDefault = DEFAULT_VEHICLE_CATEGORIES.find(
        cat => cat.name.toLowerCase() === categoryData.name?.toLowerCase()
      );
      
      if (existingDefault) {
        return {
          success: false,
          error: 'Ya existe una categoría predeterminada con ese nombre'
        };
      }

      // Verificar duplicados en categorías personalizadas
      const duplicateCheck = await this.findDuplicates('name', categoryData.name);
      if (duplicateCheck.length > 0) {
        return {
          success: false,
          error: 'Ya existe una categoría personalizada con ese nombre'
        };
      }

      const result = await this.create(categoryData, { 
        createdBy: user?.email,
        auditUser: user?.email 
      });

      if (result.success) {
        this.log('createVehicleCategory:success', { 
          categoryId: result.data.id, 
          name: categoryData.name 
        });
      }

      return result;
    } catch (error) {
      this.log('createVehicleCategory:error', { error: error.message });
      return {
        success: false,
        error: `Error al crear la categoría: ${error.message}`
      };
    }
  }

  /**
   * Obtener categorías personalizadas
   */
  async getCustomVehicleCategories() {
    try {
      this.log('getCustomVehicleCategories');

      const result = await this.getAll();
      return result;
    } catch (error) {
      this.log('getCustomVehicleCategories:error', { error: error.message });
      return {
        success: false,
        error: `Error al obtener categorías personalizadas: ${error.message}`
      };
    }
  }

  /**
   * Obtener todas las categorías (predeterminadas + personalizadas)
   */
  async getAllVehicleCategories() {
    try {
      this.log('getAllVehicleCategories');

      // Obtener categorías personalizadas
      const customResult = await this.getCustomVehicleCategories();
      const customCategories = customResult.success ? customResult.data : [];

      // Combinar usando la función existente
      const allCategories = getAllCategories(customCategories);

      return {
        success: true,
        data: allCategories
      };
    } catch (error) {
      this.log('getAllVehicleCategories:error', { error: error.message });
      return {
        success: false,
        error: `Error al obtener todas las categorías: ${error.message}`
      };
    }
  }

  /**
   * Actualizar categoría personalizada
   */
  async updateVehicleCategory(categoryId, categoryData, user) {
    try {
      this.log('updateVehicleCategory', { categoryId, categoryData, user: user?.email });

      // Verificar que no sea una categoría predeterminada
      const isDefault = DEFAULT_VEHICLE_CATEGORIES.find(cat => cat.id === categoryId);
      if (isDefault) {
        return {
          success: false,
          error: 'No se pueden modificar las categorías predeterminadas'
        };
      }

      const result = await this.update(categoryId, categoryData, { 
        updatedBy: user?.email,
        auditUser: user?.email 
      });

      if (result.success) {
        this.log('updateVehicleCategory:success', { categoryId });
      }

      return result;
    } catch (error) {
      this.log('updateVehicleCategory:error', { error: error.message, categoryId });
      return {
        success: false,
        error: `Error al actualizar la categoría: ${error.message}`
      };
    }
  }

  /**
   * Eliminar categoría personalizada
   */
  async deleteVehicleCategory(categoryId, user) {
    try {
      this.log('deleteVehicleCategory', { categoryId, user: user?.email });

      // Verificar que no sea una categoría predeterminada
      const isDefault = DEFAULT_VEHICLE_CATEGORIES.find(cat => cat.id === categoryId);
      if (isDefault) {
        return {
          success: false,
          error: 'No se pueden eliminar las categorías predeterminadas'
        };
      }

      // Verificar que no tenga vehículos asociados
      const vehiclesRef = collection(db, 'combustibles_vehicles');
      const q = query(vehiclesRef, where('category', '==', categoryId));
      const snapshot = await getDocs(q);

      if (snapshot.size > 0) {
        return {
          success: false,
          error: `No se puede eliminar la categoría porque tiene ${snapshot.size} vehículo(s) asociado(s)`
        };
      }

      const result = await this.delete(categoryId, { 
        deletedBy: user?.email,
        auditUser: user?.email 
      });

      if (result.success) {
        this.log('deleteVehicleCategory:success', { categoryId });
      }

      return result;
    } catch (error) {
      this.log('deleteVehicleCategory:error', { error: error.message, categoryId });
      return {
        success: false,
        error: `Error al eliminar la categoría: ${error.message}`
      };
    }
  }

  /**
   * Obtener estadísticas de uso de categorías
   */
  async getCategoryStats() {
    try {
      this.log('getCategoryStats');

      // Obtener todas las categorías
      const categoriesResult = await this.getAllVehicleCategories();
      if (!categoriesResult.success) return categoriesResult;

      // Obtener vehículos (importación dinámica para evitar dependencias circulares)
      const { getAllVehicles } = await import('./vehiclesService');
      const vehicles = await getAllVehicles();

      const stats = categoriesResult.data.map(category => {
        const vehiclesInCategory = vehicles.filter(v => v.category === category.id);
        
        return {
          id: category.id,
          name: category.name,
          icon: category.icon,
          color: category.color,
          isCustom: category.isCustom || false,
          vehicleCount: vehiclesInCategory.length,
          activeVehicles: vehiclesInCategory.filter(v => v.status === 'activo').length,
          totalFuelCapacity: vehiclesInCategory.reduce((sum, v) => sum + (v.fuelCapacity || 0), 0),
          avgEnginepower: vehiclesInCategory.length > 0 
            ? vehiclesInCategory.reduce((sum, v) => sum + (v.enginePower || 0), 0) / vehiclesInCategory.length
            : 0
        };
      }).sort((a, b) => b.vehicleCount - a.vehicleCount);

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      this.log('getCategoryStats:error', { error: error.message });
      return {
        success: false,
        error: `Error al obtener estadísticas: ${error.message}`
      };
    }
  }

  /**
   * Suscribirse a cambios en categorías personalizadas
   */
  subscribeToVehicleCategories(callback) {
    try {
      this.log('subscribeToVehicleCategories');

      return this.subscribe((customCategories) => {
        // Combinar con categorías predeterminadas
        const allCategories = getAllCategories(customCategories);
        callback(allCategories);
      });
    } catch (error) {
      this.log('subscribeToVehicleCategories:error', { error: error.message });
      // Fallback con categorías predeterminadas
      callback(DEFAULT_VEHICLE_CATEGORIES);
      return () => {}; // Función vacía para cancelar
    }
  }
}

// Singleton
const service = new VehicleCategoriesService();

// Exports para compatibilidad con API existente
export const createCategory = (categoryData, user) => service.createVehicleCategory(categoryData, user);
export const getCustomCategories = () => service.getCustomVehicleCategories();
export const getAllVehicleCategories = () => service.getAllVehicleCategories();
export const updateCategory = (categoryId, categoryData, user) => service.updateVehicleCategory(categoryId, categoryData, user);
export const deleteCategory = (categoryId, user) => service.deleteVehicleCategory(categoryId, user);
export const subscribeToCategories = (callback) => service.subscribeToVehicleCategories(callback);
export const getCategoryStats = () => service.getCategoryStats();

export default service;
