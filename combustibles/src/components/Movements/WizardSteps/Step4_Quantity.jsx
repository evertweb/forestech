/**
 * Step4_Quantity - Cuarto paso del wizard: Especificar cantidad de combustible
 * Diseño estilo Typeform: entrada de cantidad conversacional y visual
 */

import React, { useState, useEffect, useRef } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import { validateStockAvailability } from '../../../utils/calculations';

const Step4_Quantity = ({ formData, updateFormData, systemData, setError, isActive }) => {
  const [calculating, setCalculating] = useState(false);
  const [stockInfo, setStockInfo] = useState(null);
  const [validationWarning, setValidationWarning] = useState('');
  const inputRef = useRef(null);

  const { inventory } = systemData;
  const isStockRequired =
    formData.type === MOVEMENT_TYPES.SALIDA || formData.type === MOVEMENT_TYPES.TRANSFERENCIA;

  // Auto-focus del input cuando se activa el paso
  useEffect(() => {
    if (isActive && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isActive]);

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      // Enter para continuar si la cantidad es válida
      if (e.key === 'Enter' && formData.quantity && parseFloat(formData.quantity) > 0) {
        // Trigger para avanzar paso
        return;
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive, formData.quantity]);

  // Calcular información de stock en tiempo real
  useEffect(() => {
    const calculateStockInfo = async () => {
      if (isStockRequired && formData.fuelType && formData.location && inventory.length > 0) {
        setCalculating(true);

        // Simular cálculo en tiempo real
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Calcular stock disponible
        const availableStock = inventory
          .filter(
            (item) =>
              item.fuelType === formData.fuelType &&
              item.location?.toLowerCase() === formData.location?.toLowerCase() &&
              item.status === 'active'
          )
          .reduce((total, item) => total + (parseFloat(item.currentStock) || 0), 0);

        const requiredQuantity = parseFloat(formData.quantity) || 0;
        const remainingStock = availableStock - requiredQuantity;

        // Determinar estado
        let status = 'available';
        let icon = '✅';
        let title = 'Stock Disponible';
        let message = 'Perfecto, hay suficiente combustible.';

        if (requiredQuantity > 0) {
          if (availableStock < requiredQuantity) {
            status = 'critical';
            icon = '🚫';
            title = 'Cantidad No Disponible';
            message = `Solo hay ${availableStock.toFixed(2)} galones disponibles`;
          } else if (remainingStock < availableStock * 0.2) {
            status = 'warning';
            icon = '⚠️';
            title = 'Stock Quedará Bajo';
            message = `Quedarán solo ${remainingStock.toFixed(2)} galones`;
          } else {
            message = `Quedarán ${remainingStock.toFixed(2)} galones en stock`;
          }
        }

        setStockInfo({
          available: availableStock,
          required: requiredQuantity,
          remaining: Math.max(0, remainingStock),
          status,
          icon,
          title,
          message,
          isValid: availableStock >= requiredQuantity,
        });

        // Validación adicional
        if (requiredQuantity > 0 && isStockRequired) {
          const movementForValidation = {
            type: formData.type === MOVEMENT_TYPES.SALIDA ? 'outbound' : 'transfer',
            fuelType: formData.fuelType,
            quantity: formData.quantity,
            sourceLocation: formData.location,
          };

          const validation = validateStockAvailability(movementForValidation, inventory);

          if (!validation.isValid) {
            setValidationWarning(`🚫 ${validation.error}`);
          } else if (validation.warning) {
            setValidationWarning(`⚠️ ${validation.warning}`);
          } else {
            setValidationWarning('');
          }
        } else if (!isStockRequired) {
          setValidationWarning('');
        }

        setCalculating(false);
      }
    };

    calculateStockInfo();
  }, [
    formData.quantity,
    formData.fuelType,
    formData.location,
    formData.type,
    isStockRequired,
    inventory,
  ]);

  const handleQuantityChange = (value) => {
    const numValue = parseFloat(value);

    if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
      updateFormData('quantity', value);
      setError('');
    }
  };

  const suggestQuantities = () => {
    if (!stockInfo || !stockInfo.available) return [];

    const available = stockInfo.available;
    return [
      { label: '25 gal', value: '25' },
      { label: '50 gal', value: '50' },
      { label: '100 gal', value: '100' },
      { label: `${available.toFixed(0)} gal`, value: available.toFixed(1) },
    ];
  };

  const getMovementEmoji = () => {
    switch (formData.type) {
      case MOVEMENT_TYPES.ENTRADA:
        return '📥';
      case MOVEMENT_TYPES.SALIDA:
        return '⛽';
      case MOVEMENT_TYPES.TRANSFERENCIA:
        return '🔄';
      case MOVEMENT_TYPES.AJUSTE:
        return '⚖️';
      default:
        return '📊';
    }
  };

  const getQuantityQuestion = () => {
    switch (formData.type) {
      case MOVEMENT_TYPES.ENTRADA:
        return '¿Cuántos galones estás recibiendo?';
      case MOVEMENT_TYPES.SALIDA:
        return '¿Cuántos galones necesitas entregar?';
      case MOVEMENT_TYPES.TRANSFERENCIA:
        return '¿Cuántos galones vas a transferir?';
      case MOVEMENT_TYPES.AJUSTE:
        return '¿Cuál es la cantidad del ajuste?';
      default:
        return '¿Cuántos galones necesitas?';
    }
  };

  return (
    <div className={`wizard-step step-quantity ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout sap-theme">
        <div className="typeform-question sap-theme">
          <h2>
            {getMovementEmoji()} {getQuantityQuestion()}
          </h2>
          <p>Ingresa la cantidad en galones</p>
        </div>

        {/* Input de cantidad mejorado y profesional */}
        <div className="professional-quantity-section">
          <div className="quantity-input-container-enhanced">
            <div className="quantity-input-icon">⛽</div>
            <input
              ref={inputRef}
              id="quantity"
              type="number"
              step="0.1"
              min="0"
              value={formData.quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              placeholder="0.0"
              className={`professional-quantity-input ${validationWarning ? 'error' : ''}`}
              autoComplete="off"
            />
            <div className="quantity-unit-enhanced">
              <span className="unit-text">galones</span>
              <div className="unit-divider"></div>
              <div className="fuel-type-indicator">
                {formData.fuelType === 'ACPM' && (
                  <span className="fuel-badge diesel">🛢️ DIESEL</span>
                )}
                {formData.fuelType === 'GASOLINA_CORRIENTE' && (
                  <span className="fuel-badge gasoline">⛽ GASOLINA</span>
                )}
                {formData.fuelType === 'GASOLINA_EXTRA' && (
                  <span className="fuel-badge gasoline-extra">🏎️ EXTRA</span>
                )}
                {formData.fuelType === 'JET_A1' && (
                  <span className="fuel-badge jet">✈️ JET A1</span>
                )}
              </div>
            </div>
          </div>

          {/* Indicador visual del valor */}
          {formData.quantity && parseFloat(formData.quantity) > 0 && (
            <div className="quantity-visual-indicator">
              <div className="quantity-bar">
                <div
                  className="quantity-fill"
                  style={{
                    width: `${Math.min((parseFloat(formData.quantity) / 100) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <div className="quantity-labels">
                <span className="quantity-value">
                  {parseFloat(formData.quantity).toLocaleString('es-CO', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 2,
                  })}{' '}
                  galones
                </span>
                {stockInfo && isStockRequired && (
                  <span className={`quantity-stock ${stockInfo.status}`}>
                    {stockInfo.icon} Stock: {stockInfo.available.toFixed(1)} gal
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sugerencias rápidas mejoradas */}
        {stockInfo && stockInfo.available > 0 && (
          <div className="professional-suggestions">
            <div className="suggestions-header">
              <span className="suggestions-icon">💡</span>
              <label className="suggestions-title">Cantidades frecuentes:</label>
            </div>
            <div className="suggestions-grid">
              {suggestQuantities().map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="professional-suggestion-btn"
                  onClick={() => handleQuantityChange(suggestion.value)}
                >
                  <span className="suggestion-value">{suggestion.label}</span>
                  <span className="suggestion-action">Usar esta cantidad</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Indicador de cálculo mejorado */}
        {calculating && (
          <div className="professional-calculating">
            <div className="calculating-spinner"></div>
            <div className="calculating-content">
              <span className="calculating-text">Verificando disponibilidad</span>
              <div className="calculating-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {/* Información de stock simplificada */}
        {stockInfo && isStockRequired && !calculating && (
          <div className={`stock-info-container ${stockInfo.status}`}>
            <div className="stock-info-header sap-theme">
              <div className="stock-info-icon sap-theme">{stockInfo.icon}</div>
              <h4 className="stock-info-title sap-theme">{stockInfo.title}</h4>
            </div>
            <div className="stock-info-message sap-theme">{stockInfo.message}</div>
          </div>
        )}

        {/* Warning de validación */}
        {validationWarning && (
          <div className="validation-warning sap-theme">{validationWarning}</div>
        )}

        {/* Confirmación visual mejorada */}
        {formData.quantity && parseFloat(formData.quantity) > 0 && (
          <div className="professional-confirmation">
            <div className="confirmation-card-enhanced">
              <div className="confirmation-header">
                <span className="confirmation-icon-enhanced">{getMovementEmoji()}</span>
                <div className="confirmation-status">
                  <span className="status-dot"></span>
                  Cantidad confirmada
                </div>
              </div>
              <div className="confirmation-details">
                <div className="main-quantity">
                  {parseFloat(formData.quantity).toLocaleString('es-CO', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 2,
                  })}{' '}
                  galones
                </div>
                <div className="quantity-description">
                  {isStockRequired
                    ? `Se tomarán del inventario de ${formData.location}`
                    : `Se agregarán al inventario de combustible`}
                </div>
              </div>
              <div className="confirmation-action">
                <span className="action-indicator">✓</span>
                Listo para continuar
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4_Quantity;
