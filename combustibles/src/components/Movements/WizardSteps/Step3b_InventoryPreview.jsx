/**
 * Step3b_InventoryPreview - Vista previa del inventario disponible
 * Muestra el stock detallado después de seleccionar ubicación y antes de cantidad
 */

import React, { useState, useEffect } from 'react';
import { getLocationStock } from '../../../services/locationsService';

const Step3b_InventoryPreview = ({ formData, systemData, setError, isActive }) => {
  const [locationStock, setLocationStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inventoryItems, setInventoryItems] = useState([]);

  const { inventory } = systemData;

  // Cargar información detallada del stock
  useEffect(() => {
    const loadLocationStock = async () => {
      if (!formData.location || !formData.fuelType) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Obtener stock total de la ubicación
        const stockResult = await getLocationStock(formData.location, formData.fuelType);

        if (stockResult.success) {
          setLocationStock(stockResult.data);
        }

        // Obtener items individuales de inventario para mostrar detalles
        const locationItems = inventory.filter(
          (item) =>
            item.location?.toLowerCase() === formData.location.toLowerCase() &&
            item.fuelType?.toUpperCase() === formData.fuelType.toUpperCase() &&
            item.status === 'active'
        );

        setInventoryItems(locationItems);
      } catch (error) {
        console.error('Error cargando stock de ubicación:', error);
        setError('Error al cargar información del inventario');
      } finally {
        setLoading(false);
      }
    };

    if (isActive) {
      loadLocationStock();
    }
  }, [formData.location, formData.fuelType, inventory, isActive, setError]);

  // Función para formatear ubicación
  const formatLocationName = (location) => {
    if (!location) return '';
    return location
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Función para obtener color según el estado del stock
  const getStockStatusColor = (percentage) => {
    if (percentage >= 80) return '#10b981'; // Verde
    if (percentage >= 50) return '#f59e0b'; // Amarillo
    if (percentage >= 20) return '#f97316'; // Naranja
    return '#ef4444'; // Rojo
  };

  if (!isActive) return null;

  return (
    <div className="wizard-step step-inventory-preview sap-theme active">
      <div className="step-question sap-theme">
        <h3>📊 Estado del Inventario</h3>
        <p>
          Revisión de stock disponible en <strong>{formatLocationName(formData.location)}</strong>
        </p>
      </div>

      {loading ? (
        <div className="wizard-loading sap-theme">
          <div className="loading-spinner sap-theme"></div>
          <p>🔄 Cargando información del inventario...</p>
        </div>
      ) : (
        <div className="inventory-preview-container">
          {/* Resumen principal */}
          <div className="main-stock-summary">
            <div className="fuel-type-header">
              <div className="fuel-icon">⛽</div>
              <div className="fuel-info">
                <h4>{formData.fuelType}</h4>
                <p>en {formatLocationName(formData.location)}</p>
              </div>
            </div>

            {locationStock && (
              <div className="stock-overview">
                <div className="stock-main-number">
                  <span className="stock-value">{Math.floor(locationStock.available)}</span>
                  <span className="stock-unit">galones</span>
                </div>

                <div className="stock-details">
                  <div className="stock-bar-large">
                    <div
                      className="stock-fill-large"
                      style={{
                        width: `${Math.min(locationStock.percentage || 0, 100)}%`,
                        backgroundColor: getStockStatusColor(locationStock.percentage || 0),
                      }}
                    ></div>
                  </div>

                  <div className="stock-info-row">
                    <span>Disponible: {Math.floor(locationStock.available)} gal</span>
                    <span>Capacidad: {Math.floor(locationStock.maxCapacity)} gal</span>
                    <span>Nivel: {Math.round(locationStock.percentage || 0)}%</span>
                  </div>
                </div>

                <div className="stock-status-message">
                  <span className={`status-indicator ${locationStock.status}`}>
                    {locationStock.status === 'excellent' && '🟢'}
                    {locationStock.status === 'good' && '🟡'}
                    {locationStock.status === 'medium' && '🟠'}
                    {locationStock.status === 'low' && '🔴'}
                    {locationStock.status === 'empty' && '⚫'}
                  </span>
                  <span className="status-text">{locationStock.message}</span>
                </div>
              </div>
            )}
          </div>

          {/* Detalles por tanque/contenedor */}
          {inventoryItems.length > 0 && (
            <div className="tanks-detail">
              <h5>📦 Detalles por Tanque/Contenedor:</h5>
              <div className="tanks-grid">
                {inventoryItems.map((item, index) => (
                  <div key={item.id || index} className="tank-card">
                    <div className="tank-header">
                      <span className="tank-name">{item.name || `Tanque ${index + 1}`}</span>
                      <span className="tank-status">{item.status}</span>
                    </div>

                    <div className="tank-stock">
                      <div className="tank-numbers">
                        <span className="current">{Math.floor(item.currentStock || 0)}</span>
                        <span className="separator">/</span>
                        <span className="capacity">{Math.floor(item.maxCapacity || 0)} gal</span>
                      </div>

                      <div className="tank-bar">
                        <div
                          className="tank-fill"
                          style={{
                            width: `${Math.min(((item.currentStock || 0) / (item.maxCapacity || 1)) * 100, 100)}%`,
                            backgroundColor: getStockStatusColor(
                              ((item.currentStock || 0) / (item.maxCapacity || 1)) * 100
                            ),
                          }}
                        ></div>
                      </div>
                    </div>

                    {item.supplier && (
                      <div className="tank-supplier">
                        <small>Proveedor: {item.supplier}</small>
                      </div>
                    )}

                    {item.pricePerUnit && (
                      <div className="tank-price">
                        <small>Precio: ${item.pricePerUnit}/gal</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendaciones */}
          {locationStock && (
            <div className="stock-recommendations">
              <h5>💡 Recomendaciones:</h5>
              <div className="recommendations-list">
                {locationStock.percentage >= 80 && (
                  <div className="recommendation good">
                    <span className="rec-icon">✅</span>
                    <span>Stock excelente. Puedes realizar salidas de gran volumen.</span>
                  </div>
                )}

                {locationStock.percentage >= 50 && locationStock.percentage < 80 && (
                  <div className="recommendation medium">
                    <span className="rec-icon">⚠️</span>
                    <span>Stock moderado. Planifica reabastecimiento próximamente.</span>
                  </div>
                )}

                {locationStock.percentage >= 20 && locationStock.percentage < 50 && (
                  <div className="recommendation warning">
                    <span className="rec-icon">🔶</span>
                    <span>Stock bajo. Considera reabastecer antes de grandes movimientos.</span>
                  </div>
                )}

                {locationStock.percentage < 20 && locationStock.percentage > 0 && (
                  <div className="recommendation critical">
                    <span className="rec-icon">🚨</span>
                    <span>Stock crítico. Reabastecer urgentemente después de esta operación.</span>
                  </div>
                )}

                <div className="recommendation info">
                  <span className="rec-icon">📋</span>
                  <span>
                    Máximo recomendado para esta salida:{' '}
                    <strong>{Math.floor(locationStock.available * 0.8)} galones</strong>
                    <small> (80% del stock disponible)</small>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Continuar */}
          <div className="continue-prompt">
            <div className="continue-card">
              <p>
                🎯 <strong>Todo listo!</strong> Ahora puedes proceder a seleccionar la cantidad para
                tu movimiento de salida.
              </p>
              <small>
                La información del stock se actualizará automáticamente cuando completes el
                movimiento.
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3b_InventoryPreview;
