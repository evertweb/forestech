/**
 * Hook personalizado para gestionar precios automáticos en formularios de productos
 * Proporciona funcionalidades para sincronización y actualización de precios
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentFuelPrice,
  detectFuelType,
  canUseAutomaticPricing,
} from '../services/fuelPricesService';
import priceUpdateService from '../services/priceUpdateService';

export const useAutomaticPricing = (initialProduct = null) => {
  // Estados para control de precios automáticos
  const [automaticPricing, setAutomaticPricing] = useState(
    initialProduct?.automaticPricing !== false
  );
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(null);
  const [lastPriceUpdate, setLastPriceUpdate] = useState(initialProduct?.lastPriceUpdate || null);
  const [priceHistory, setPriceHistory] = useState([]);

  // Función para sincronizar precio manualmente
  const syncPrice = useCallback(async (productData, city = 'BOGOTA') => {
    const fuelType = detectFuelType(productData.name);

    if (!fuelType) {
      setPriceError('No se pudo detectar el tipo de combustible');
      return { success: false, error: 'Tipo de combustible no detectado' };
    }

    setPriceLoading(true);
    setPriceError(null);

    try {
      const priceData = await getCurrentFuelPrice(fuelType, city);

      if (priceData.success) {
        const newPrice = priceData.data.price;
        const updateTime = new Date().toISOString();

        setLastPriceUpdate(updateTime);
        setPriceError(null);

        // Añadir al historial
        setPriceHistory((prev) =>
          [
            ...prev,
            {
              timestamp: updateTime,
              price: newPrice,
              source: 'api',
              fuelType: fuelType,
              city: city,
            },
          ].slice(-10)
        ); // Mantener solo los últimos 10

        return {
          success: true,
          price: newPrice,
          data: priceData.data,
          updateTime,
        };
      } else {
        // Usar precio de respaldo si está disponible
        if (priceData.fallbackPrice) {
          const newPrice = priceData.fallbackPrice;
          const updateTime = new Date().toISOString();

          setLastPriceUpdate(updateTime);
          setPriceError(
            `API no disponible. Usando precio estimado: $${newPrice.toLocaleString('es-CO')}`
          );

          // Añadir al historial
          setPriceHistory((prev) =>
            [
              ...prev,
              {
                timestamp: updateTime,
                price: newPrice,
                source: 'fallback',
                fuelType: fuelType,
                city: city,
              },
            ].slice(-10)
          );

          return {
            success: true,
            price: newPrice,
            usedFallback: true,
            updateTime,
          };
        } else {
          setPriceError(priceData.error || 'Error obteniendo precio');
          return { success: false, error: priceData.error };
        }
      }
    } catch (error) {
      console.error('Error sincronizando precio:', error);
      setPriceError('Error de conexión. Verifique su internet.');
      return { success: false, error: error.message };
    } finally {
      setPriceLoading(false);
    }
  }, []);

  // Función para detectar si el producto puede usar precios automáticos
  const canUseAutomatic = useCallback((productData) => {
    // productData may be object or string name
    if (!productData) return false;
    if (typeof productData === 'string') return canUseAutomaticPricing({ name: productData });
    return canUseAutomaticPricing(productData);
  }, []);

  // Función para obtener el tipo de combustible detectado
  const getFuelType = useCallback((productData) => {
    if (!productData) return null;
    const name = typeof productData === 'string' ? productData : productData.name;
    return detectFuelType(name);
  }, []);

  // Función para determinar si se debe sincronizar automáticamente
  const shouldAutoSync = useCallback(
    (productData, currentPrice) => {
      if (!automaticPricing || !canUseAutomatic(productData)) {
        return false;
      }

      // Sincronizar si el precio es 0 o si ha pasado más de 1 hora
      const shouldSync =
        currentPrice === 0 ||
        !lastPriceUpdate ||
        Date.now() - new Date(lastPriceUpdate).getTime() > 3600000; // 1 hora

      return shouldSync;
    },
    [automaticPricing, lastPriceUpdate, canUseAutomatic]
  );

  // Función para toggle del modo automático
  const toggleAutomaticPricing = useCallback((enabled) => {
    setAutomaticPricing(enabled);
    if (!enabled) {
      setPriceError(null);
    }
  }, []);

  // Función para limpiar errores
  const clearPriceError = useCallback(() => {
    setPriceError(null);
  }, []);

  // Función para obtener el último precio del historial
  const getLastPrice = useCallback(() => {
    return priceHistory.length > 0 ? priceHistory[priceHistory.length - 1] : null;
  }, [priceHistory]);

  // Función para formatear el precio
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  // Función para obtener estadísticas del precio
  const getPriceStats = useCallback(() => {
    if (priceHistory.length === 0) {
      return null;
    }

    const prices = priceHistory.map((entry) => entry.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const lastPrice = prices[prices.length - 1];
    const trend =
      prices.length > 1
        ? lastPrice > prices[prices.length - 2]
          ? 'up'
          : lastPrice < prices[prices.length - 2]
            ? 'down'
            : 'stable'
        : 'stable';

    return {
      min: minPrice,
      max: maxPrice,
      average: avgPrice,
      current: lastPrice,
      trend,
      entries: priceHistory.length,
    };
  }, [priceHistory]);

  // Efecto para escuchar eventos del servicio de actualización
  useEffect(() => {
    const handleServiceEvent = (event, data) => {
      switch (event) {
        case 'product_price_updated':
          if (data.productId === initialProduct?.id) {
            setLastPriceUpdate(new Date().toISOString());
            setPriceHistory((prev) =>
              [
                ...prev,
                {
                  timestamp: new Date().toISOString(),
                  price: data.newPrice,
                  source: data.source,
                  oldPrice: data.oldPrice,
                },
              ].slice(-10)
            );
          }
          break;
        case 'product_price_error':
          if (data.productId === initialProduct?.id) {
            setPriceError(data.error);
          }
          break;
        default:
          break;
      }
    };

    priceUpdateService.addListener(handleServiceEvent);

    return () => {
      priceUpdateService.removeListener(handleServiceEvent);
    };
  }, [initialProduct?.id]);

  return {
    // Estados
    automaticPricing,
    priceLoading,
    priceError,
    lastPriceUpdate,
    priceHistory,

    // Funciones
    syncPrice,
    canUseAutomatic,
    getFuelType,
    shouldAutoSync,
    toggleAutomaticPricing,
    clearPriceError,
    getLastPrice,
    formatPrice,
    getPriceStats,

    // Utilidades
    isCompatible: canUseAutomatic,
    hasRecentUpdate: Boolean(
      lastPriceUpdate && Date.now() - new Date(lastPriceUpdate).getTime() < 3600000
    ), // Menos de 1 hora

    // Estado del servicio
    serviceRunning: priceUpdateService.isServiceRunning(),
    serviceStats: priceUpdateService.getStats(),
  };
};
