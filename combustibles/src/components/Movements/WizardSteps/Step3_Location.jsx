/**
 * Step3_Location - Tercer paso del wizard: Selección de ubicación origen
 * Diseño estilo Typeform: conversacional y centrado en la ubicación
 */

import React, { useState, useEffect, useCallback } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import { OPERATIONAL_LOCATIONS, formatLocationName } from '../../../constants/locations';

const Step3_Location = ({ formData, updateFormData, systemData, setError, isActive }) => {
  const [loading, setLoading] = useState(false);
  const [stockInfo, setStockInfo] = useState({});
  const [validatingStock, setValidatingStock] = useState(false);

  const { suppliers, inventory } = systemData;
  const isEntrada = formData.type === MOVEMENT_TYPES.ENTRADA;

  const handleLocationSelection = useCallback(
    async (location) => {
      setLoading(true);
      setError('');

      try {
        await new Promise((resolve) => setTimeout(resolve, 400));

        if (isEntrada) {
          updateFormData('supplierName', location);
        } else {
          updateFormData('location', location);
        }
      } catch {
        setError('Error al validar la ubicación');
      } finally {
        setLoading(false);
      }
    },
    [isEntrada, updateFormData, setError]
  );

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      const num = parseInt(e.key);

      if (isEntrada) {
        const activeSuppliers = Array.isArray(suppliers)
          ? suppliers.filter((s) => s.status === 'active')
          : [];
        if (num >= 1 && num <= activeSuppliers.length) {
          const selectedSupplier = activeSuppliers[num - 1];
          handleLocationSelection(selectedSupplier.name);
        }
      } else {
        if (num >= 1 && num <= OPERATIONAL_LOCATIONS.length) {
          const selectedLocation = OPERATIONAL_LOCATIONS[num - 1];
          handleLocationSelection(selectedLocation);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive, suppliers, isEntrada, handleLocationSelection]);

  // Validar stock disponible en tiempo real para salidas/transferencias
  useEffect(() => {
    const validateLocationStock = async () => {
      if (!isEntrada && formData.fuelType && inventory.length > 0) {
        setValidatingStock(true);

        await new Promise((resolve) => setTimeout(resolve, 600));

        const stockByLocation = {};

        OPERATIONAL_LOCATIONS.forEach((location) => {
          const itemsEncontrados = inventory.filter(
            (item) =>
              item.fuelType === formData.fuelType &&
              item.location?.toLowerCase() === location.toLowerCase() &&
              item.status === 'active'
          );

          const availableStock = itemsEncontrados.reduce(
            (total, item) => total + (parseFloat(item.currentStock) || 0),
            0
          );

          const maxCapacity = itemsEncontrados.reduce(
            (total, item) => total + (parseFloat(item.maxCapacity) || 0),
            0
          );

          let status = 'available';
          let message = `${availableStock.toFixed(0)} galones disponibles`;

          if (availableStock === 0) {
            status = 'empty';
            message = 'Sin combustible disponible';
          } else if (availableStock < maxCapacity * 0.2) {
            status = 'low';
            message = `${availableStock.toFixed(0)} gal (stock bajo)`;
          }

          stockByLocation[location] = {
            available: availableStock,
            maxCapacity,
            status,
            message,
            percentage: maxCapacity > 0 ? (availableStock / maxCapacity) * 100 : 0,
          };
        });

        setStockInfo(stockByLocation);
        setValidatingStock(false);
      }
    };

    validateLocationStock();
  }, [formData.fuelType, isEntrada, inventory]);

  const getLocationIcon = (location) => {
    switch (location.toLowerCase()) {
      case 'oficina principal':
        return '🏢';
      case 'tanque central':
        return '⛽';
      case 'almacén norte':
        return '🏭';
      case 'zona sur':
        return '🌎';
      case 'taller mecánico':
        return '🔧';
      default:
        return '📍';
    }
  };

  const getMovementLocationQuestion = () => {
    switch (formData.type) {
      case MOVEMENT_TYPES.ENTRADA:
        return '¿De dónde viene el combustible?';
      case MOVEMENT_TYPES.SALIDA:
        return '¿De qué ubicación tomarás el combustible?';
      case MOVEMENT_TYPES.TRANSFERENCIA:
        return '¿Desde dónde quieres transferir?';
      case MOVEMENT_TYPES.AJUSTE:
        return '¿En qué ubicación harás el ajuste?';
      default:
        return '¿Cuál es la ubicación?';
    }
  };

  // Renderizar opciones para entradas (proveedores)
  if (isEntrada) {
    const activeSuppliers = Array.isArray(suppliers)
      ? suppliers.filter((s) => s.status === 'active')
      : [];

    return (
      <div className={`wizard-step step-location sap-theme ${isActive ? 'active' : ''}`}>
        <div className="step-question sap-theme sap-theme">
          <h3>🏪 {getMovementLocationQuestion()}</h3>
          <p>Selecciona el proveedor que está enviando el combustible</p>
        </div>

        {loading && (
          <div className="wizard-loading sap-theme sap-theme">
            <div className="loading-spinner sap-theme sap-theme"></div>
            <p>🔄 Validando proveedor...</p>
          </div>
        )}

        {!Array.isArray(suppliers) || suppliers.length === 0 ? (
          <div className="wizard-loading sap-theme sap-theme">
            <div className="loading-spinner sap-theme sap-theme"></div>
            <p>🔄 Cargando proveedores...</p>
          </div>
        ) : activeSuppliers.length === 0 ? (
          <div className="empty-state sap-theme sap-theme">
            <div className="empty-icon sap-theme sap-theme">🏪</div>
            <h3>No hay proveedores disponibles</h3>
            <p>No se encontraron proveedores activos en el sistema.</p>
            <p>Contacta al administrador para agregar proveedores.</p>
          </div>
        ) : (
          <div className="supplier-options sap-theme sap-theme">
            {activeSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className={`supplier-option sap-theme ${formData.supplierName === supplier.name ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
                onClick={() => !loading && handleLocationSelection(supplier.name)}
              >
                <div className="option-icon sap-theme sap-theme">🏪</div>
                <div className="option-content sap-theme sap-theme">
                  <h4 className="option-title sap-theme sap-theme">{supplier.name}</h4>
                  <p className="option-description sap-theme sap-theme">
                    {supplier.location || 'Proveedor de combustibles'}
                  </p>
                  {supplier.contact && (
                    <small className="supplier-contact sap-theme sap-theme">
                      📞 {supplier.contact}
                    </small>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {formData.supplierName && (
          <div className="selection-confirmation sap-theme sap-theme">
            <div className="confirmation-card sap-theme sap-theme">
              <span className="confirmation-icon sap-theme sap-theme">🏪</span>
              <div className="confirmation-text sap-theme sap-theme">
                <strong>Genial! Recibirás combustible de {formData.supplierName}</strong>
                <br />
                <small>El combustible será registrado en el inventario</small>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Renderizar opciones para salidas/transferencias (ubicaciones operativas)
  return (
    <div className={`wizard-step step-location sap-theme ${isActive ? 'active' : ''}`}>
      <div className="step-question sap-theme sap-theme">
        <h3>📍 {getMovementLocationQuestion()}</h3>
        <p>Elige la ubicación donde está almacenado el combustible</p>
      </div>

      {validatingStock && (
        <div className="wizard-loading sap-theme sap-theme">
          <div className="loading-spinner sap-theme sap-theme"></div>
          <p>⚙️ Verificando stock por ubicación...</p>
        </div>
      )}

      <div className="location-options sap-theme sap-theme">
        {OPERATIONAL_LOCATIONS.map((location) => {
          const stockData = stockInfo[location] || {};
          const isLocationSelected = formData.location === location;

          return (
            <div
              key={location}
              className={`location-option sap-theme ${isLocationSelected ? 'selected' : ''} ${stockData.status || ''} ${loading ? 'disabled' : ''}`}
              onClick={() => !loading && handleLocationSelection(location)}
            >
              <div className="option-icon sap-theme sap-theme">{getLocationIcon(location)}</div>
              <div className="option-content sap-theme sap-theme">
                <h4 className="option-title sap-theme sap-theme">{formatLocationName(location)}</h4>
                <p className="option-description sap-theme sap-theme">
                  {stockData.message || 'Verificando disponibilidad...'}
                </p>

                {stockData.available > 0 && (
                  <div className="stock-indicator sap-theme sap-theme">
                    <div className="stock-bar-mini sap-theme sap-theme">
                      <div
                        className="stock-fill-mini sap-theme sap-theme"
                        style={{ width: `${Math.min(stockData.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {formData.location && stockInfo[formData.location] && (
        <div className="selection-confirmation sap-theme sap-theme">
          <div className="confirmation-card sap-theme sap-theme">
            <span className="confirmation-icon sap-theme sap-theme">
              {getLocationIcon(formData.location)}
            </span>
            <div className="confirmation-text sap-theme sap-theme">
              <strong>Excelente! Usarás {formatLocationName(formData.location)}</strong>
              <br />
              <small>{stockInfo[formData.location].message}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3_Location;
