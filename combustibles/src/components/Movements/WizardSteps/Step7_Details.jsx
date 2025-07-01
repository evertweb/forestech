/**
 * Step7_Details - Séptimo paso del wizard: Detalles adicionales
 * Precio unitario, fecha efectiva, referencia y descripción
 */

import React, { useState, useEffect } from 'react';

const Step7_Details = ({ formData, updateFormData, systemData, error, setError }) => {
  const [calculating, setCalculating] = useState(false);
  const [priceValidated, setPriceValidated] = useState(false);

  const { products } = systemData;

  // Auto-completar precio si no está establecido
  useEffect(() => {
    if (formData.fuelType && !formData.unitPrice && products.length > 0) {
      const product = products.find(p => p.name === formData.fuelType || p.displayName === formData.fuelType);
      if (product && product.defaultPrice) {
        updateFormData('unitPrice', product.defaultPrice.toString());
        setPriceValidated(true);
      }
    }
  }, [formData.fuelType, formData.unitPrice, products, updateFormData]);

  const handlePriceChange = async (value) => {
    const numValue = parseFloat(value);
    
    if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
      setCalculating(true);
      
      // Simular validación de precio
      await new Promise(resolve => setTimeout(resolve, 300));
      
      updateFormData('unitPrice', value);
      setPriceValidated(value !== '');
      setError('');
      setCalculating(false);
    }
  };

  const handleDateChange = (value) => {
    updateFormData('effectiveDate', value);
  };

  const handleReferenceChange = (value) => {
    updateFormData('reference', value);
  };

  const handleDescriptionChange = (value) => {
    updateFormData('description', value);
  };

  // Calcular valor total
  const totalValue = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.unitPrice) || 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCurrentProduct = () => {
    return products.find(p => p.name === formData.fuelType || p.displayName === formData.fuelType);
  };

  return (
    <div className="wizard-step step-details">
      <div className="step-content">
        <div className="step-question">
          <h3>📋 Información adicional del movimiento</h3>
          <p>Completa los detalles restantes:</p>
        </div>

        {/* Precio unitario */}
        <div className="detail-section">
          <div className="detail-header">
            <h4>💰 Precio Unitario</h4>
          </div>
          
          <div className="price-input-wrapper">
            <label htmlFor="unitPrice">Precio por galón (COP) *</label>
            <div className="price-input-container">
              <span className="currency-symbol">$</span>
              <input
                id="unitPrice"
                type="number"
                step="1"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="0"
                className={`price-input ${error ? 'error' : ''}`}
              />
              <span className="currency-unit">COP</span>
            </div>
            
            {calculating && (
              <div className="calculating-price">
                <div className="loading-spinner small"></div>
                <span>💰 Validando precio...</span>
              </div>
            )}
            
            {getCurrentProduct()?.defaultPrice && (
              <small className="price-suggestion">
                💡 Precio sugerido: ${getCurrentProduct().defaultPrice.toLocaleString('es-CO')} COP
              </small>
            )}
          </div>
        </div>

        {/* Valor total calculado */}
        {formData.quantity && formData.unitPrice && priceValidated && (
          <div className="total-value-section">
            <div className="total-value-card">
              <div className="total-icon">📊</div>
              <div className="total-content">
                <h4>Valor Total Calculado</h4>
                <div className="total-calculation">
                  <span className="calculation-details">
                    {parseFloat(formData.quantity).toFixed(2)} gal × ${parseFloat(formData.unitPrice).toLocaleString('es-CO')} COP
                  </span>
                  <div className="total-amount">
                    {formatCurrency(totalValue)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fecha efectiva */}
        <div className="detail-section">
          <div className="detail-header">
            <h4>📅 Fecha y Hora Efectiva</h4>
          </div>
          
          <div className="date-input-wrapper">
            <label htmlFor="effectiveDate">¿Cuándo ocurrió este movimiento?</label>
            <input
              id="effectiveDate"
              type="datetime-local"
              value={formData.effectiveDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="date-input"
            />
            <small className="date-hint">
              💡 Por defecto se usa la fecha y hora actual
            </small>
          </div>
        </div>

        {/* Referencia */}
        <div className="detail-section">
          <div className="detail-header">
            <h4>📄 Referencia</h4>
          </div>
          
          <div className="reference-input-wrapper">
            <label htmlFor="reference">Número de factura, orden o referencia (opcional)</label>
            <input
              id="reference"
              type="text"
              value={formData.reference}
              onChange={(e) => handleReferenceChange(e.target.value)}
              placeholder="Ej: Factura #12345, Orden #ORD-001"
              className="reference-input"
              maxLength="100"
            />
            <small className="reference-hint">
              📝 Ayuda a identificar el movimiento en reportes
            </small>
          </div>
        </div>

        {/* Descripción */}
        <div className="detail-section">
          <div className="detail-header">
            <h4>📝 Descripción</h4>
          </div>
          
          <div className="description-input-wrapper">
            <label htmlFor="description">Detalles adicionales del movimiento (opcional)</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Ej: Combustible para operación en sector norte, mantenimiento programado, etc."
              className="description-input"
              rows="3"
              maxLength="500"
            />
            <div className="description-counter">
              {formData.description.length}/500 caracteres
            </div>
          </div>
        </div>

        {/* Resumen rápido de detalles */}
        {priceValidated && (
          <div className="details-summary">
            <div className="summary-card">
              <h4>📋 Resumen de Detalles</h4>
              <div className="summary-items">
                <div className="summary-item">
                  <span className="summary-label">💰 Precio unitario:</span>
                  <span className="summary-value">
                    ${parseFloat(formData.unitPrice).toLocaleString('es-CO')} COP/gal
                  </span>
                </div>
                
                {totalValue > 0 && (
                  <div className="summary-item">
                    <span className="summary-label">📊 Valor total:</span>
                    <span className="summary-value total">
                      {formatCurrency(totalValue)}
                    </span>
                  </div>
                )}
                
                <div className="summary-item">
                  <span className="summary-label">📅 Fecha:</span>
                  <span className="summary-value">
                    {new Date(formData.effectiveDate).toLocaleString('es-CO')}
                  </span>
                </div>
                
                {formData.reference && (
                  <div className="summary-item">
                    <span className="summary-label">📄 Referencia:</span>
                    <span className="summary-value">{formData.reference}</span>
                  </div>
                )}
                
                {formData.description && (
                  <div className="summary-item">
                    <span className="summary-label">📝 Descripción:</span>
                    <span className="summary-value description">
                      {formData.description.length > 50 ? 
                        formData.description.substring(0, 50) + '...' : 
                        formData.description
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step7_Details;