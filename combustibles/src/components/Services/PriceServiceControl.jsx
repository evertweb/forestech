/**
 * PriceServiceControl - Panel de control administrativo para el servicio
 * de actualización automática de precios
 */

import React, { useState, useEffect } from 'react';
import { usePriceUpdateService } from '../../hooks/usePriceUpdateService';
import { PRICE_UPDATE_CONFIG } from '../../services/fuelPricesService';
import './PriceServiceControl.css';

const PriceServiceControl = ({ userRole }) => {
  const {
    serviceStatus,
    startService,
    stopService,
    forceUpdate,
    getUpdateHistory,
    clearNotifications,
  } = usePriceUpdateService();

  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [customInterval, setCustomInterval] = useState(24); // horas

  // Solo admin y supervisor pueden controlar el servicio
  const canControl = ['admin', 'supervisor'].includes(userRole);

  useEffect(() => {
    if (showHistory) {
      const historyData = getUpdateHistory(20);
      setHistory(historyData);
    }
  }, [showHistory, getUpdateHistory, serviceStatus.totalUpdates]);

  const handleStartService = () => {
    const intervalMs = customInterval * 60 * 60 * 1000; // convertir horas a ms
    startService(intervalMs);
  };

  const handleForceUpdate = async () => {
    await forceUpdate();
  };

  const getStatusIcon = () => {
    return serviceStatus.isRunning ? '🟢' : '🔴';
  };

  const getStatusText = () => {
    return serviceStatus.isRunning ? 'Activo' : 'Detenido';
  };

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('es-CO');
  };

  const getHistoryIcon = (type) => {
    switch (type) {
      case 'batch_update':
        return '📊';
      case 'batch_error':
        return '❌';
      case 'no_compatible_products':
        return 'ℹ️';
      default:
        return '📋';
    }
  };

  if (!canControl) {
    return (
      <div className="price-service-readonly">
        <div className="service-status-display">
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-text">Servicio de precios automáticos: {getStatusText()}</span>
          {serviceStatus.lastUpdate && (
            <span className="last-update-readonly">
              Última actualización: {formatDateTime(serviceStatus.lastUpdate)}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="price-service-control">
      <div className="control-header">
        <h3>🔄 Control de Precios Automáticos</h3>
        <div className="service-status">
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-text">{getStatusText()}</span>
        </div>
      </div>

      <div className="control-panels">
        {/* Panel de configuración */}
        <div className="control-panel">
          <h4>⚙️ Configuración</h4>

          <div className="config-item">
            <label htmlFor="update-interval">Intervalo de actualización (horas):</label>
            <input
              id="update-interval"
              type="number"
              min="1"
              max="168"
              value={customInterval}
              onChange={(e) => setCustomInterval(parseInt(e.target.value))}
              disabled={serviceStatus.isRunning}
            />
            <small>Entre 1 hora y 7 días (168 horas)</small>
          </div>

          <div className="control-actions">
            {!serviceStatus.isRunning ? (
              <button
                className="btn-start-service"
                onClick={handleStartService}
                title="Iniciar servicio automático"
              >
                🚀 Iniciar Servicio
              </button>
            ) : (
              <button
                className="btn-stop-service"
                onClick={stopService}
                title="Detener servicio automático"
              >
                ⏹️ Detener Servicio
              </button>
            )}

            <button
              className="btn-force-update"
              onClick={handleForceUpdate}
              title="Forzar actualización inmediata"
            >
              🔄 Actualizar Ahora
            </button>
          </div>
        </div>

        {/* Panel de estadísticas */}
        <div className="control-panel">
          <h4>📊 Estadísticas</h4>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total de actualizaciones:</span>
              <span className="stat-value">{serviceStatus.totalUpdates}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Últimas exitosas:</span>
              <span className="stat-value success">{serviceStatus.recentSuccessful}</span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Últimas fallidas:</span>
              <span className="stat-value error">{serviceStatus.recentFailed}</span>
            </div>

            {serviceStatus.lastUpdate && (
              <div className="stat-item full-width">
                <span className="stat-label">Última actualización:</span>
                <span className="stat-value">{formatDateTime(serviceStatus.lastUpdate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Panel de configuración avanzada */}
        <div className="control-panel">
          <h4>🔧 Configuración Avanzada</h4>

          <div className="config-info">
            <div className="config-item">
              <span className="config-label">Intervalo por defecto:</span>
              <span className="config-value">
                {PRICE_UPDATE_CONFIG.UPDATE_INTERVAL / (60 * 60 * 1000)} horas
              </span>
            </div>

            <div className="config-item">
              <span className="config-label">Duración del caché:</span>
              <span className="config-value">
                {PRICE_UPDATE_CONFIG.CACHE_DURATION / (60 * 1000)} minutos
              </span>
            </div>

            <div className="config-item">
              <span className="config-label">Tipos soportados:</span>
              <span className="config-value">
                {PRICE_UPDATE_CONFIG.SUPPORTED_FUEL_TYPES.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de historial */}
      <div className="history-panel">
        <div className="history-header">
          <button className="btn-toggle-history" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? '🔽' : '▶️'} Historial de Actualizaciones
          </button>

          {showHistory && (
            <button
              className="btn-clear-notifications"
              onClick={clearNotifications}
              title="Limpiar notificaciones"
            >
              🗑️ Limpiar
            </button>
          )}
        </div>

        {showHistory && (
          <div className="history-list">
            {history.length === 0 ? (
              <div className="no-history">
                <span>📭 No hay historial de actualizaciones</span>
              </div>
            ) : (
              history.map((entry, index) => (
                <div key={index} className="history-entry">
                  <div className="entry-header">
                    <span className="entry-icon">{getHistoryIcon(entry.type)}</span>
                    <span className="entry-time">{formatDateTime(entry.timestamp)}</span>
                    <span className="entry-type">{entry.type}</span>
                  </div>

                  <div className="entry-details">
                    {entry.successful > 0 && (
                      <span className="success-count">✅ {entry.successful} exitosos</span>
                    )}
                    {entry.failed > 0 && (
                      <span className="error-count">❌ {entry.failed} fallidos</span>
                    )}
                    {entry.error && <span className="error-message">Error: {entry.error}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceServiceControl;
