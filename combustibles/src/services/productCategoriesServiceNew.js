/**
 * ProductCategoriesService - Servicio refactorizado para gestión de categorías de productos
 * Utiliza BaseService y CRUDService para operaciones optimizadas
 * 
 * Funcionalidades:
 * - Gestión de categorías predeterminadas y personalizadas
 * - CRUD completo con validaciones específicas
 * - Estadísticas de uso por categoría
 * - Búsqueda y filtrado avanzado
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

// Categorías predeterminadas (no se pueden eliminar)
export const DEFAULT_PRODUCT_CATEGORIES = [
  {
    id: 'combustible',
    name: 'Combustible',
    description: 'Combustibles líquidos como diesel, gasolina, mezclas',
    icon: '⛽',
    color: '#FF6B35',
    isDefault: true,
    units: ['gal', 'L'],
    fields: ['octanage', 'density', 'supplier']
  },
  {
    id: 'aceite',
    name: 'Aceite',
    description: 'Aceites lubricantes y hidráulicos',
    icon: '🛢️',
    color: '#FF9800',
    isDefault: true,
    units: ['L', 'gal'],
    fields: ['viscosity', 'temperature', 'application']
  },
  {
    id: 'lubricante',
    name: 'Lubricante',
    description: 'Grasas y lubricantes sólidos',
    icon: '🧴',
    color: '#4CAF50',
    isDefault: true,
    units: ['kg', 'g'],
    fields: ['consistency', 'temperature', 'application']
  },
  {
    id: 'filtro',
    name: 'Filtro',
    description: 'Filtros de aire, aceite, combustible',
    icon: '🔧',
    color: '#2196F3',
    isDefault: true,
    units: ['un'],
    fields: ['size', 'compatibility', 'lifespan']
  },
  {
    id: 'herramienta',
    name: 'Herramienta',
    description: 'Herramientas de mantenimiento y reparación',
    icon: '🛠️',
    color: '#9C27B0',
    isDefault: true,
    units: ['un'],
    fields: ['brand', 'model', 'condition']
  },
  {
    id: 'repuesto',
    name: 'Repuesto',
    description: 'Repuestos y componentes de vehículos',
    icon: '⚙️',
    color: '#607D8B',
    isDefault: true,
    units: ['un'],
    fields: ['partNumber', 'compatibility', 'condition']
  },
  {
    id: 'quimico',
    name: 'Químico',
    description: 'Productos químicos y aditivos',
    icon: '🧪',
    color: '#E91E63',
    isDefault: true,
    units: ['L', 'kg'],
    fields: ['concentration', 'hazards', 'storage']
  },
  {
    id: 'consumible',
    name: 'Consumible',
    description: 'Materiales de uso general y consumo',
    icon: '📦',
    color: '#795548',
    isDefault: true,
    units: ['un', 'kg', 'L'],
    fields: ['brand', 'expiration', 'usage']
  },
  {
    id: 'otro',
    name: 'Otro',
    description: 'Categoría general para productos diversos',
    icon: '❓',
    color: '#9E9E9E',
    isDefault: true,
    units: ['un'],
    fields: ['description', 'usage', 'notes']
  }
];

/**
 * Clase ProductCategoriesService
 */
class ProductCategoriesService extends CRUDService {
  constructor() {
    super('productCategories', {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'name',
      defaultOrderDirection: 'asc'
    });
  }

  /**
   * Validación específica para categorías de productos
   */
  validateData(data) {
    const baseValidation = super.validateData(data);
    if (!baseValidation.isValid) return baseValidation;
    
    const errors = [];

    // Validaciones específicas
    if (!data.name || data.name.trim().length < 2) {
      errors.push('El nombre de la categoría es obligatorio y debe tener al menos 2 caracteres');
    }

    if (data.name && data.name.length > 50) {
      errors.push('El nombre de la categoría no puede exceder 50 caracteres');
    }

    if (data.description && data.description.length > 200) {
      errors.push('La descripción no puede exceder 200 caracteres');
    }

    if (data.color && !/^#[0-9A-F]{6}$/i.test(data.color)) {
      errors.push('El color debe ser un código hexadecimal válido (#RRGGBB)');
    }

    if (data.units && (!Array.isArray(data.units) || data.units.length === 0)) {
      errors.push('Debe especificar al menos una unidad de medida');
    }

    if (data.fields && !Array.isArray(data.fields)) {
      errors.push('Los campos deben ser un array');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Procesamiento específico para categorías
   */
  processData(data, isUpdate = false) {
    const baseProcessed = super.processData(data, isUpdate);
    
    return {
      ...baseProcessed,
      name: data.name?.trim(),
      description: data.description?.trim() || '',
      icon: data.icon || '📦',
      color: data.color || '#9E9E9E',
      isDefault: false, // Las categorías personalizadas nunca son default
      units: data.units || ['un'],
      fields: data.fields || [],
      isActive: data.isActive !== false
    };
  }

  /**
   * Crear categoría personalizada
   */
  async createProductCategory(data, user) {
    try {
      this.log('createProductCategory', { data, user: user?.email });

      // Verificar que no sea una categoría predeterminada
      const existingDefault = DEFAULT_PRODUCT_CATEGORIES.find(
        cat => cat.name.toLowerCase() === data.name?.toLowerCase()
      );
      
      if (existingDefault) {
        return {
          success: false,
          error: 'Ya existe una categoría predeterminada con ese nombre'
        };
      }

      // Verificar duplicados en categorías personalizadas
      const duplicateCheck = await this.findDuplicates('name', data.name);
      if (duplicateCheck.length > 0) {
        return {
          success: false,
          error: 'Ya existe una categoría personalizada con ese nombre'
        };
      }

      const result = await this.create(data, { 
        createdBy: user?.email,
        auditUser: user?.email 
      });

      if (result.success) {
        this.log('createProductCategory:success', { 
          categoryId: result.data.id, 
          name: data.name 
        });
      }

      return result;
    } catch (error) {
      this.log('createProductCategory:error', { error: error.message });
      return {
        success: false,
        error: `Error al crear la categoría: ${error.message}`
      };
    }
  }

  /**
   * Obtener todas las categorías (predeterminadas + personalizadas)
   */
  async getAllProductCategories() {
    try {
      this.log('getAllProductCategories');

      // Obtener categorías personalizadas de Firestore
      const customCategories = await this.getAll();
      
      // Combinar con categorías predeterminadas
      const allCategories = [
        ...DEFAULT_PRODUCT_CATEGORIES,
        ...(customCategories.success ? customCategories.data : [])
      ];

      return {
        success: true,
        data: allCategories.sort((a, b) => a.name.localeCompare(b.name))
      };
    } catch (error) {
      this.log('getAllProductCategories:error', { error: error.message });
      return {
        success: false,
        error: `Error al obtener las categorías: ${error.message}`
      };
    }
  }

  /**
   * Buscar categorías por término
   */
  async searchProductCategories(searchTerm) {
    try {
      this.log('searchProductCategories', { searchTerm });

      const allCategories = await this.getAllProductCategories();
      if (!allCategories.success) return allCategories;

      const term = searchTerm.toLowerCase();
      const filtered = allCategories.data.filter(category =>
        category.name.toLowerCase().includes(term) ||
        category.description.toLowerCase().includes(term)
      );

      return {
        success: true,
        data: filtered
      };
    } catch (error) {
      this.log('searchProductCategories:error', { error: error.message });
      return {
        success: false,
        error: `Error al buscar categorías: ${error.message}`
      };
    }
  }

  /**
   * Obtener estadísticas de uso por categoría
   */
  async getCategoryStats() {
    try {
      this.log('getCategoryStats');

      const allCategories = await this.getAllProductCategories();
      if (!allCategories.success) return allCategories;

      const statsPromises = allCategories.data.map(async (category) => {
        try {
          // Contar productos en esta categoría
          const productsRef = collection(db, 'products');
          const q = query(productsRef, where('category', '==', category.id));
          const snapshot = await getDocs(q);
          
          const productCount = snapshot.size;
          const activeProducts = snapshot.docs.filter(doc =>
            doc.data().isActive !== false
          ).length;

          return {
            id: category.id,
            name: category.name,
            productCount,
            activeProducts,
            icon: category.icon,
            color: category.color,
            isDefault: category.isDefault || false
          };
        } catch (error) {
          console.error(`Error getting stats for category ${category.id}:`, error);
          return {
            id: category.id,
            name: category.name,
            productCount: 0,
            activeProducts: 0,
            icon: category.icon,
            color: category.color,
            isDefault: category.isDefault || false
          };
        }
      });

      const stats = await Promise.all(statsPromises);

      return {
        success: true,
        data: stats.sort((a, b) => b.productCount - a.productCount)
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
   * Obtener categoría por ID
   */
  async getCategoryById(categoryId) {
    try {
      this.log('getCategoryById', { categoryId });

      // Verificar primero en categorías predeterminadas
      const defaultCategory = DEFAULT_PRODUCT_CATEGORIES.find(cat => cat.id === categoryId);
      if (defaultCategory) {
        return {
          success: true,
          data: defaultCategory
        };
      }

      // Buscar en categorías personalizadas
      const result = await this.getById(categoryId);
      return result;
    } catch (error) {
      this.log('getCategoryById:error', { error: error.message, categoryId });
      return {
        success: false,
        error: `Error al obtener la categoría: ${error.message}`
      };
    }
  }

  /**
   * Actualizar categoría personalizada
   */
  async updateProductCategory(categoryId, data, user) {
    try {
      this.log('updateProductCategory', { categoryId, data, user: user?.email });

      // Verificar que no sea una categoría predeterminada
      const isDefault = DEFAULT_PRODUCT_CATEGORIES.find(cat => cat.id === categoryId);
      if (isDefault) {
        return {
          success: false,
          error: 'No se pueden modificar las categorías predeterminadas'
        };
      }

      const result = await this.update(categoryId, data, { 
        updatedBy: user?.email,
        auditUser: user?.email 
      });

      if (result.success) {
        this.log('updateProductCategory:success', { categoryId });
      }

      return result;
    } catch (error) {
      this.log('updateProductCategory:error', { error: error.message, categoryId });
      return {
        success: false,
        error: `Error al actualizar la categoría: ${error.message}`
      };
    }
  }

  /**
   * Eliminar categoría personalizada
   */
  async deleteProductCategory(categoryId, user) {
    try {
      this.log('deleteProductCategory', { categoryId, user: user?.email });

      // Verificar que no sea una categoría predeterminada
      const isDefault = DEFAULT_PRODUCT_CATEGORIES.find(cat => cat.id === categoryId);
      if (isDefault) {
        return {
          success: false,
          error: 'No se pueden eliminar las categorías predeterminadas'
        };
      }

      // Verificar que no tenga productos asociados
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('category', '==', categoryId));
      const snapshot = await getDocs(q);

      if (snapshot.size > 0) {
        return {
          success: false,
          error: `No se puede eliminar la categoría porque tiene ${snapshot.size} producto(s) asociado(s)`
        };
      }

      const result = await this.delete(categoryId, { 
        deletedBy: user?.email,
        auditUser: user?.email 
      });

      if (result.success) {
        this.log('deleteProductCategory:success', { categoryId });
      }

      return result;
    } catch (error) {
      this.log('deleteProductCategory:error', { error: error.message, categoryId });
      return {
        success: false,
        error: `Error al eliminar la categoría: ${error.message}`
      };
    }
  }

  /**
   * Inicializar categorías predeterminadas (método de compatibilidad)
   */
  async initializeDefaultCategories() {
    try {
      this.log('initializeDefaultCategories');
      
      // Las categorías predeterminadas están en código, no necesitan inicialización
      return { 
        success: true, 
        message: 'Categorías predeterminadas disponibles en código' 
      };
    } catch (error) {
      this.log('initializeDefaultCategories:error', { error: error.message });
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

// Singleton
const service = new ProductCategoriesService();

// Exports para compatibilidad con API existente
export const createProductCategory = (data, user) => service.createProductCategory(data, user);
export const getAllProductCategories = () => service.getAllProductCategories();
export const searchProductCategories = (searchTerm) => service.searchProductCategories(searchTerm);
export const getCategoryStats = () => service.getCategoryStats();
export const getCategoryById = (categoryId) => service.getCategoryById(categoryId);
export const updateProductCategory = (categoryId, data, user) => service.updateProductCategory(categoryId, data, user);
export const deleteProductCategory = (categoryId, user) => service.deleteProductCategory(categoryId, user);
export const initializeDefaultCategories = () => service.initializeDefaultCategories();

// Subscribe methods
export const subscribeToProductCategories = (callback) => service.subscribe(callback);
export const subscribeToProductCategoriesWhere = (field, operator, value, callback) => 
  service.subscribeWhere(field, operator, value, callback);

export default service;
