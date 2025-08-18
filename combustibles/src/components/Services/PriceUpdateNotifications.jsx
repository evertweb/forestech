/**
 * PriceUpdateNotifications - Componente para mostrar notificaciones
 * del servicio de actualización automática de precios
 */

import React from 'react';
import { usePriceUpdateService } from '../../hooks/usePriceUpdateService';
import './PriceUpdateNotifications.css';

const PriceUpdateNotifications = ({ position = 'bottom-right', maxVisible = 5 }) => {
  const { notifications, removeNotification } = usePriceUpdateService();

  if (notifications.length === 0) {
    return null;
  }

  const visibleNotifications = notifications.slice(-maxVisible);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getNotificationClass = (type) => {
    return `notification notification-${type}`;
  };

  return (
    <div className={`notifications-container ${position}`}>
      {visibleNotifications.map((notification) => (
        <div key={notification.id} className={getNotificationClass(notification.type)}>
          <div className="notification-content">
            <span className="notification-icon">{getNotificationIcon(notification.type)}</span>
            <span className="notification-message">{notification.message}</span>
            <span className="notification-time">
              {new Date(notification.timestamp).toLocaleTimeString('es-CO')}
            </span>
          </div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
            title="Cerrar notificación"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default PriceUpdateNotifications;
