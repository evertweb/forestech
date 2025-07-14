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
  const isStockRequired = formData.type === MOVEMENT_TYPES.SALIDA || formData.type === MOVEMENT_TYPES.TRANSFERENCIA;

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
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Calcular stock disponible
        const availableStock = inventory
          .filter(item => 
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
          } else if (remainingStock < (availableStock * 0.2)) {
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
          isValid: availableStock >= requiredQuantity
        });

        // Validación adicional
        if (requiredQuantity > 0 && isStockRequired) {
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
        } else if (!isStockRequired) {
          setValidationWarning('');
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
      { label: '25 gal', value: '25' },
      { label: '50 gal', value: '50' },
      { label: '100 gal', value: '100' },
      { label: `${available.toFixed(0)} gal`, value: available.toFixed(1) }
    ];
  };

  const getMovementEmoji = () => {
    switch (formData.type) {
      case MOVEMENT_TYPES.ENTRADA: return '📥';
      case MOVEMENT_TYPES.SALIDA: return '⛽';
      case MOVEMENT_TYPES.TRANSFERENCIA: return '🔄';
      case MOVEMENT_TYPES.AJUSTE: return '⚖️';
      default: return '📊';
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
      <div className="typeform-layout">
        <div className="typeform-question">
          <h2>{getMovementEmoji()} {getQuantityQuestion()}</h2>
          <p>Ingresa la cantidad en galones</p>
        </div>

        {/* Input de cantidad estilo Typeform */}
        <div className="typeform-input-section">
          <input
            ref={inputRef}
            id="quantity"
            type="number"
            step="0.1"
            min="0"
            value={formData.quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            placeholder="0"
            className={`typeform-input ${validationWarning ? 'error' : ''}`}
            autoComplete="off"
          />
          <span className="typeform-unit">galones</span>
        </div>

        {/* Sugerencias rápidas */}
        {stockInfo && stockInfo.available > 0 && (
          <div className="typeform-suggestions">
            <label className="typeform-suggestions-label">Cantidades comunes:</label>
            <div className="typeform-suggestions-buttons">
              {suggestQuantities().map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="typeform-suggestion-btn"
                  onClick={() => handleQuantityChange(suggestion.value)}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Indicador de cálculo */}
        {calculating && (
          <div className="calculating-indicator">
            <div className="loading-spinner small"></div>
            <span>⚙️ Verificando disponibilidad...</span>
          </div>
        )}

        {/* Información de stock simplificada */}
        {stockInfo && isStockRequired && !calculating && (
          <div className={`stock-info-container ${stockInfo.status}`}>
            <div className="stock-info-header">
              <div className="stock-info-icon">
                {stockInfo.icon}
              </div>
              <h4 className="stock-info-title">{stockInfo.title}</h4>
            </div>
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

        {/* Confirmación visual */}
        {formData.quantity && parseFloat(formData.quantity) > 0 && (
          <div className="selection-confirmation">
            <div className="confirmation-card">
              <span className="confirmation-icon">{getMovementEmoji()}</span>
              <div className="confirmation-text">
                <strong>Perfecto! {parseFloat(formData.quantity).toLocaleString('es-CO')} galones</strong>
                <br />
                <small>
                  {isStockRequired ? 
                    `Saldrán del inventario de ${formData.location}` : 
                    `Se agregarán al inventario`
                  }
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step4_Quantity;