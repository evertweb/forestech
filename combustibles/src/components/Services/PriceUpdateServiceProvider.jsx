/**
 * PriceUpdateServiceProvider - Proveedor para inicializar y gestionar
 * el servicio de actualización automática de precios
 */

import React, { useEffect, useState, useCallback } from 'react';
import priceUpdateService from '../../services/priceUpdateService';
import { PriceUpdateServiceContext } from '../../contexts/PriceUpdateServiceContext';

const PriceUpdateServiceProvider = ({ children }) => {
  const [serviceStatus, setServiceStatus] = useState({
    isRunning: false,
    lastUpdate: null,
    totalUpdates: 0,
    recentSuccessful: 0,
    recentFailed: 0,
  });
  const [notifications, setNotifications] = useState([]);

  // Función para formatear precios
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Función para remover notificación
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Función para agregar notificaciones
  const addNotification = useCallback((type, message) => {
    const notification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toISOString(),
    };

    setNotifications((prev) => [...prev, notification].slice(-20)); // Mantener últimas 20

    // Auto-eliminar después de 5 segundos para tipos específicos
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);
    }
  }, []);

  // Función para actualizar estado del servicio
  const updateServiceStatus = () => {
    const stats = priceUpdateService.getStats();
    setServiceStatus({
      isRunning: stats.isRunning,
      lastUpdate: stats.lastUpdate,
      totalUpdates: stats.totalUpdates,
      recentSuccessful: stats.recentSuccessful,
      recentFailed: stats.recentFailed,
    });
  };

  useEffect(() => {
    // Función para manejar eventos del servicio
    const handleServiceEvent = (event, data) => {
      switch (event) {
        case 'service_started':
          setServiceStatus((prev) => ({ ...prev, isRunning: true }));
          addNotification('success', 'Servicio de actualización automática iniciado');
          break;

        case 'service_stopped':
          setServiceStatus((prev) => ({ ...prev, isRunning: false }));
          addNotification('info', 'Servicio de actualización automática detenido');
          break;

        case 'batch_update_completed':
          setServiceStatus((prev) => ({
            ...prev,
            lastUpdate: new Date().toISOString(),
            totalUpdates: prev.totalUpdates + 1,
            recentSuccessful: data.successful,
            recentFailed: data.failed,
          }));

          if (data.successful > 0) {
            addNotification(
              'success',
              `Precios actualizados: ${data.successful} productos exitosos`
            );
          }

          if (data.failed > 0) {
            addNotification('warning', `${data.failed} productos no pudieron actualizarse`);
          }
          break;

        case 'batch_update_error':
          addNotification('error', `Error en actualización masiva: ${data.error}`);
          break;

        case 'product_price_updated':
          addNotification(
            'success',
            `${data.productName}: precio actualizado a ${formatPrice(data.newPrice)}`
          );
          break;

        case 'product_price_error':
          addNotification('error', `Error actualizando ${data.productName}: ${data.error}`);
          break;

        default:
          break;
      }
    };

    // Registrar listener
    priceUpdateService.addListener(handleServiceEvent);

    // Inicializar estado del servicio
    updateServiceStatus();

    // Auto-iniciar el servicio si está configurado
    const shouldAutoStart = localStorage.getItem('autoStartPriceService') === 'true';
    if (shouldAutoStart && !priceUpdateService.isServiceRunning()) {
      priceUpdateService.start();
    }

    // Cleanup
    return () => {
      priceUpdateService.removeListener(handleServiceEvent);
    };
  }, [addNotification]);

  // Funciones de control del servicio
  const startService = (intervalMs) => {
    priceUpdateService.start(intervalMs);
    localStorage.setItem('autoStartPriceService', 'true');
    updateServiceStatus();
  };

  const stopService = () => {
    priceUpdateService.stop();
    localStorage.setItem('autoStartPriceService', 'false');
    updateServiceStatus();
  };

  const forceUpdate = async () => {
    try {
      await priceUpdateService.updateAllProductPrices();
      addNotification('success', 'Actualización manual completada');
    } catch (error) {
      addNotification('error', `Error en actualización manual: ${error.message}`);
    }
    updateServiceStatus();
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getUpdateHistory = (limit) => {
    return priceUpdateService.getUpdateHistory(limit);
  };

  const contextValue = {
    // Estado
    serviceStatus,
    notifications,

    // Funciones de control
    startService,
    stopService,
    forceUpdate,
    updateServiceStatus,

    // Funciones de notificaciones
    addNotification,
    removeNotification,
    clearNotifications,

    // Funciones de historial
    getUpdateHistory,

    // Utilidades
    formatPrice,
  };

  return (
    <PriceUpdateServiceContext.Provider value={contextValue}>
      {children}
    </PriceUpdateServiceContext.Provider>
  );
};

export default PriceUpdateServiceProvider;
