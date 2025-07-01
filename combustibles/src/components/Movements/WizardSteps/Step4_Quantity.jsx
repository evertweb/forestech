/**
 * Step4_Quantity - Cuarto paso del wizard: Especificar cantidad de combustible
 * Incluye validación de stock en tiempo real y cuadro dinámico de información
 */

import React, { useState, useEffect } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import { validateStockAvailability } from '../../../utils/calculations';

const Step4_Quantity = ({ formData, updateFormData, systemData, setError }) => {
  const [calculating, setCalculating] = useState(false);
  const [stockInfo, setStockInfo] = useState(null);
  const [validationWarning, setValidationWarning] = useState('');

  const { inventory } = systemData;
  const isStockRequired = formData.type === MOVEMENT_TYPES.SALIDA || formData.type === MOVEMENT_TYPES.TRANSFERENCIA;

  // Calcular información de stock en tiempo real
  useEffect(() => {
    const calculateStockInfo = async () => {
      if (isStockRequired && formData.fuelType && formData.location && inventory.length > 0) {
        setCalculating(true);
        
        // Simular cálculo en tiempo real
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Calcular stock disponible
        const availableStock = inventory
          .filter(item => 
            item.fuelType === formData.fuelType && 
            item.location?.toLowerCase() === formData.location?.toLowerCase() &&
            item.status === 'active'
          )
          .reduce((total, item) => total + (parseFloat(item.currentStock) || 0), 0);

        // Calcular capacidad máxima
        const maxCapacity = inventory
          .filter(item => 
            item.fuelType === formData.fuelType && 
            item.location?.toLowerCase() === formData.location?.toLowerCase() &&
            item.status === 'active'
          )
          .reduce((total, item) => total + (parseFloat(item.maxCapacity) || 0), 0);

        const requiredQuantity = parseFloat(formData.quantity) || 0;
        const remainingStock = availableStock - requiredQuantity;
        const capacityPercentage = maxCapacity > 0 ? (availableStock / maxCapacity) * 100 : 0;
        
        // Determinar estado
        let status = 'available';
        let icon = '✅';
        let title = 'Stock Suficiente';
        let message = 'Hay suficiente combustible disponible.';
        
        if (requiredQuantity > 0) {
          if (availableStock < requiredQuantity) {
            status = 'critical';
            icon = '🚫';
            title = 'Stock Insuficiente';
            message = `Faltan ${(requiredQuantity - availableStock).toFixed(2)} galones.`;
          } else if (remainingStock < (availableStock * 0.2)) {
            status = 'warning';
            icon = '⚠️';
            title = 'Stock Quedará Bajo';
            message = `Después del movimiento quedarán ${remainingStock.toFixed(2)} galones.`;
          } else {
            message = `Después del movimiento quedarán ${remainingStock.toFixed(2)} galones disponibles.`;
          }
        }

        setStockInfo({
          available: availableStock,
          required: requiredQuantity,
          remaining: Math.max(0, remainingStock),
          maxCapacity,
          capacityPercentage,
          status,
          icon,
          title,
          message,
          isValid: availableStock >= requiredQuantity
        });

        // Validación adicional usando calculations.js
        if (requiredQuantity > 0) {
          const movementForValidation = {
            type: formData.type === MOVEMENT_TYPES.SALIDA ? 'outbound' : 'transfer',
            fuelType: formData.fuelType,
            quantity: formData.quantity,
            sourceLocation: formData.location
          };

          const validation = validateStockAvailability(movementForValidation, inventory);
          
          if (!validation.isValid) {
            setValidationWarning(`🚫 ${validation.error}`);
          } else if (validation.warning) {
            setValidationWarning(`⚠️ ${validation.warning}`);
          } else {
            setValidationWarning('');
          }
        }
        
        setCalculating(false);
      }
    };

    calculateStockInfo();
  }, [formData.quantity, formData.fuelType, formData.location, formData.type, isStockRequired, inventory]);

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
      { label: '25%', value: (available * 0.25).toFixed(1) },
      { label: '50%', value: (available * 0.50).toFixed(1) },
      { label: '75%', value: (available * 0.75).toFixed(1) },
      { label: 'Todo', value: available.toFixed(1) }
    ];
  };

  return (
    <div className="wizard-step step-quantity">
      <div className="step-content">
        <div className="step-question">
          <h3>📊 ¿Cuántos galones necesitas?</h3>
          <p>Especifica la cantidad de combustible:</p>
        </div>

        {/* Input de cantidad */}
        <div className="quantity-input-section">
          <div className="quantity-input-wrapper">
            <label htmlFor="quantity">Cantidad (galones)</label>
            <div className="quantity-input-container">
              <input
                id="quantity"
                type="number"
                step="0.1"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                placeholder="0.0"
                className={`quantity-input ${validationWarning ? 'error' : ''}`}
              />
              <span className="quantity-unit">gal</span>
            </div>
          </div>

          {/* Sugerencias rápidas de cantidad */}
          {stockInfo && stockInfo.available > 0 && (
            <div className="quantity-suggestions">
              <label>Cantidades sugeridas:</label>
              <div className="suggestion-buttons">
                {suggestQuantities().map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="suggestion-btn"
                    onClick={() => handleQuantityChange(suggestion.value)}
                  >
                    {suggestion.label}
                    <br />
                    <small>{suggestion.value} gal</small>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Indicador de cálculo */}
        {calculating && (
          <div className="calculating-indicator">
            <div className="loading-spinner small"></div>
            <span>⚙️ Calculando disponibilidad...</span>
          </div>
        )}

        {/* Cuadro de información de stock en tiempo real */}
        {stockInfo && isStockRequired && !calculating && (
          <div className={`stock-info-container ${stockInfo.status}`}>
            <div className="stock-info-header">
              <div className="stock-info-icon">
                {stockInfo.icon}
              </div>
              <h4 className="stock-info-title">{stockInfo.title}</h4>
            </div>
            
            <div className="stock-info-details">
              <div className="stock-detail-item">
                <span className="stock-detail-label">Stock Disponible</span>
                <span className="stock-detail-value">
                  {stockInfo.available.toFixed(2)} gal
                </span>
              </div>
              
              {stockInfo.required > 0 && (
                <>
                  <div className="stock-detail-item">
                    <span className="stock-detail-label">Cantidad Solicitada</span>
                    <span className="stock-detail-value">
                      {stockInfo.required.toFixed(2)} gal
                    </span>
                  </div>
                  
                  <div className="stock-detail-item">
                    <span className="stock-detail-label">Stock Restante</span>
                    <span className="stock-detail-value">
                      {stockInfo.remaining.toFixed(2)} gal
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Barra de capacidad */}
            {stockInfo.maxCapacity > 0 && (
              <div className="stock-bar-container">
                <div className="stock-bar">
                  <div 
                    className="stock-bar-current" 
                    style={{ 
                      width: `${Math.min(100, stockInfo.capacityPercentage)}%` 
                    }}
                  ></div>
                  {stockInfo.required > 0 && stockInfo.isValid && (
                    <div 
                      className="stock-bar-after" 
                      style={{ 
                        width: `${Math.min(100, (stockInfo.remaining / stockInfo.maxCapacity) * 100)}%` 
                      }}
                    ></div>
                  )}
                </div>
                <div className="stock-bar-labels">
                  <span>Actual: {stockInfo.capacityPercentage.toFixed(1)}%</span>
                  {stockInfo.required > 0 && stockInfo.isValid && (
                    <span>Después: {((stockInfo.remaining / stockInfo.maxCapacity) * 100).toFixed(1)}%</span>
                  )}
                </div>
              </div>
            )}

            <div className="stock-info-message">
              {stockInfo.message}
            </div>
          </div>
        )}

        {/* Warning de validación */}
        {validationWarning && (
          <div className="validation-warning">
            {validationWarning}
          </div>
        )}

        {/* Confirmación de cantidad para entradas */}
        {!isStockRequired && formData.quantity && parseFloat(formData.quantity) > 0 && (
          <div className="selection-confirmation">
            <div className="confirmation-card">
              <span className="confirmation-icon">📊</span>
              <div className="confirmation-text">
                <strong>Cantidad:</strong> {parseFloat(formData.quantity).toFixed(2)} galones
                <br />
                <small>Se añadirá al inventario de {formData.location}</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4_Quantity;