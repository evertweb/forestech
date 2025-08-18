/**
 * Servicio para actualización periódica y automática de precios de combustibles
 * Mantiene los precios sincronizados con la API del gobierno colombiano
 */

import {
  getCurrentFuelPrice,
  detectFuelType,
  canUseAutomaticPricing,
  PRICE_UPDATE_CONFIG,
} from './fuelPricesService';
import { updateProduct, getAllProducts } from './productsService';

class PriceUpdateService {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.updateHistory = [];
    this.listeners = new Set();
  }

  /**
   * Iniciar el servicio de actualización automática
   * @param {number} intervalMs - Intervalo en milisegundos (por defecto 24 horas)
   */
  start(intervalMs = PRICE_UPDATE_CONFIG.UPDATE_INTERVAL) {
    if (this.isRunning) {
      console.log('🔄 Servicio de actualización de precios ya está ejecutándose');
      return;
    }

    console.log('🚀 Iniciando servicio de actualización automática de precios');
    this.isRunning = true;

    // Ejecutar inmediatamente y luego cada intervalo
    this.updateAllProductPrices();

    this.intervalId = setInterval(() => {
      this.updateAllProductPrices();
    }, intervalMs);

    this.notifyListeners('service_started', { intervalMs });
  }

  /**
   * Detener el servicio de actualización automática
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    console.log('⏹️ Deteniendo servicio de actualización automática de precios');
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.notifyListeners('service_stopped', {});
  }

  /**
   * Verificar si el servicio está ejecutándose
   */
  isServiceRunning() {
    return this.isRunning;
  }

  /**
   * Actualizar precios de todos los productos compatibles
   */
  async updateAllProductPrices() {
    console.log('📊 Iniciando actualización masiva de precios...');

    try {
      const products = await getAllProducts();
      const compatibleProducts = products.filter(
        (product) => canUseAutomaticPricing(product) && product.automaticPricing !== false // Respetar configuración del producto
      );

      console.log(
        `🎯 Encontrados ${compatibleProducts.length} productos compatibles para actualización`
      );

      if (compatibleProducts.length === 0) {
        this.logUpdate('no_compatible_products', 0, 0);
        return;
      }

      const updateResults = await Promise.allSettled(
        compatibleProducts.map((product) => this.updateProductPrice(product))
      );

      const successful = updateResults.filter((result) => result.status === 'fulfilled').length;
      const failed = updateResults.filter((result) => result.status === 'rejected').length;

      console.log(`✅ Actualización completada: ${successful} exitosos, ${failed} fallidos`);

      this.logUpdate('batch_update', successful, failed);
      this.notifyListeners('batch_update_completed', {
        successful,
        failed,
        total: compatibleProducts.length,
      });
    } catch (error) {
      console.error('❌ Error en actualización masiva de precios:', error);
      this.logUpdate('batch_error', 0, 0, error.message);
      this.notifyListeners('batch_update_error', { error: error.message });
    }
  }

  /**
   * Actualizar precio de un producto específico
   * @param {Object} product - Producto a actualizar
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async updateProductPrice(product) {
    const fuelType = detectFuelType(product.name, product.category);

    if (!fuelType) {
      throw new Error(`No se pudo detectar tipo de combustible para ${product.name}`);
    }

    try {
      const priceData = await getCurrentFuelPrice(fuelType, 'BOGOTA');

      if (priceData.success) {
        const updatedProduct = {
          ...product,
          defaultPrice: priceData.data.price,
          lastPriceUpdate: new Date().toISOString(),
          priceSource: 'api_automatico',
          apiPriceData: priceData.data,
        };

        await updateProduct(product.id, updatedProduct);

        console.log(
          `💰 Precio actualizado para ${product.name}: $${priceData.data.price.toLocaleString('es-CO')}`
        );

        this.notifyListeners('product_price_updated', {
          productId: product.id,
          productName: product.name,
          oldPrice: product.defaultPrice,
          newPrice: priceData.data.price,
          source: 'api',
        });

        return { success: true, product: updatedProduct, priceData };
      } else {
        // Usar precio de respaldo si está disponible
        if (priceData.fallbackPrice) {
          const updatedProduct = {
            ...product,
            defaultPrice: priceData.fallbackPrice,
            lastPriceUpdate: new Date().toISOString(),
            priceSource: 'fallback',
            apiError: priceData.error,
          };

          await updateProduct(product.id, updatedProduct);

          console.log(
            `⚠️ Precio de respaldo para ${product.name}: $${priceData.fallbackPrice.toLocaleString('es-CO')}`
          );

          this.notifyListeners('product_price_updated', {
            productId: product.id,
            productName: product.name,
            oldPrice: product.defaultPrice,
            newPrice: priceData.fallbackPrice,
            source: 'fallback',
          });

          return { success: true, product: updatedProduct, usedFallback: true };
        } else {
          throw new Error(priceData.error || 'No se pudo obtener precio');
        }
      }
    } catch (error) {
      console.error(`❌ Error actualizando precio de ${product.name}:`, error);

      this.notifyListeners('product_price_error', {
        productId: product.id,
        productName: product.name,
        error: error.message,
      });

      throw error;
    }
  }

  /**
   * Forzar actualización inmediata de un producto específico
   * @param {string} productId - ID del producto
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async forceUpdateProduct(productId) {
    try {
      const products = await getAllProducts();
      const product = products.find((p) => p.id === productId);

      if (!product) {
        throw new Error('Producto no encontrado');
      }

      if (!canUseAutomaticPricing(product)) {
        throw new Error('Producto no compatible con actualización automática');
      }

      return await this.updateProductPrice(product);
    } catch (error) {
      console.error(`❌ Error en actualización forzada del producto ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener historial de actualizaciones
   * @param {number} limit - Límite de registros (por defecto 50)
   * @returns {Array} Historial de actualizaciones
   */
  getUpdateHistory(limit = 50) {
    return this.updateHistory.slice(-limit);
  }

  /**
   * Limpiar historial de actualizaciones
   */
  clearUpdateHistory() {
    this.updateHistory = [];
  }

  /**
   * Registrar evento de actualización en el historial
   * @private
   */
  logUpdate(type, successful, failed, error = null) {
    const entry = {
      timestamp: new Date().toISOString(),
      type,
      successful,
      failed,
      error,
    };

    this.updateHistory.push(entry);

    // Mantener solo los últimos 100 registros
    if (this.updateHistory.length > 100) {
      this.updateHistory = this.updateHistory.slice(-100);
    }
  }

  /**
   * Agregar listener para eventos del servicio
   * @param {Function} callback - Función callback para eventos
   */
  addListener(callback) {
    this.listeners.add(callback);
  }

  /**
   * Remover listener de eventos del servicio
   * @param {Function} callback - Función callback a remover
   */
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  /**
   * Notificar a todos los listeners sobre un evento
   * @private
   */
  notifyListeners(event, data) {
    this.listeners.forEach((callback) => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error en listener del servicio de precios:', error);
      }
    });
  }

  /**
   * Obtener estadísticas del servicio
   * @returns {Object} Estadísticas actuales
   */
  getStats() {
    const recentUpdates = this.updateHistory.slice(-10);
    const totalSuccessful = recentUpdates.reduce((sum, entry) => sum + (entry.successful || 0), 0);
    const totalFailed = recentUpdates.reduce((sum, entry) => sum + (entry.failed || 0), 0);

    return {
      isRunning: this.isRunning,
      totalUpdates: this.updateHistory.length,
      recentSuccessful: totalSuccessful,
      recentFailed: totalFailed,
      lastUpdate:
        this.updateHistory.length > 0
          ? this.updateHistory[this.updateHistory.length - 1].timestamp
          : null,
    };
  }
}

// Instancia singleton del servicio
const priceUpdateService = new PriceUpdateService();

export default priceUpdateService;

// Exportar funciones principales para uso directo
export const {
  start: startPriceUpdateService,
  stop: stopPriceUpdateService,
  updateAllProductPrices,
  forceUpdateProduct,
  isServiceRunning,
  getUpdateHistory,
  clearUpdateHistory,
  addListener,
  removeListener,
  getStats,
} = priceUpdateService;
