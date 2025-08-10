/**
 * Step7_Details - Séptimo paso del wizard: Detalles adicionales
 * Precio unitario, fecha efectiva, referencia y descripción
 */

import React, { useState, useEffect } from 'react';

const Step7_Details = ({ formData, updateFormData, systemData, error, setError, isActive }) => {
  const [calculating, setCalculating] = useState(false);
  const [priceValidated, setPriceValidated] = useState(false);

  const { products } = systemData;

  // Auto-completar precio si no está establecido
  useEffect(() => {
    if (formData.fuelType && !formData.unitPrice && products.length > 0) {
      const product = products.find(
        (p) => p.name === formData.fuelType || p.displayName === formData.fuelType
      );
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
      await new Promise((resolve) => setTimeout(resolve, 300));

      updateFormData('unitPrice', value);
      setPriceValidated(value !== '');
      setError('');
      setCalculating(false);
    }
  };

  const handleDateChange = (value) => {
    updateFormData('effectiveDate', value);
  };

  const _handleReferenceChange = (value) => {
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
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCurrentProduct = () => {
    return products.find(
      (p) => p.name === formData.fuelType || p.displayName === formData.fuelType
    );
  };

  return (
    <div className={`wizard-step step-details ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout sap-theme">
        <div className="typeform-question sap-theme">
          <h3>📋 Información adicional del movimiento</h3>
          <p>Completa los detalles restantes:</p>
        </div>

        {/* Precio unitario */}
        <div className="typeform-input-section sap-theme">
          <label htmlFor="unitPrice">💰 Precio por galón (COP) *</label>
          <input
            id="unitPrice"
            type="number"
            step="1"
            min="0"
            value={formData.unitPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            placeholder="0"
            className={`typeform-input ${error ? 'error' : ''}`}
          />
          <span className="typeform-unit sap-theme">COP</span>

          {calculating && (
            <div className="calculating-price sap-theme">
              <div className="loading-spinner small sap-theme"></div>
              <span>💰 Validando precio...</span>
            </div>
          )}

          {getCurrentProduct()?.defaultPrice && (
            <small className="price-suggestion sap-theme">
              💡 Precio sugerido: ${getCurrentProduct().defaultPrice.toLocaleString('es-CO')} COP
            </small>
          )}
        </div>

        {/* Valor total calculado */}
        {formData.quantity &&
          formData.unitPrice &&
          priceValidated && ( // Solo mostrar si hay cantidad y precio
            <div className="total-value-section sap-theme">
              <div className="total-value-card sap-theme">
                <div className="total-icon sap-theme">📊</div>
                <div className="total-content sap-theme">
                  <h4>Valor Total Calculado</h4>
                  <div className="total-calculation sap-theme">
                    <span className="calculation-details sap-theme">
                      {parseFloat(formData.quantity).toFixed(2)} gal × $
                      {parseFloat(formData.unitPrice).toLocaleString('es-CO')} COP
                    </span>
                    <div className="total-amount sap-theme">{formatCurrency(totalValue)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Fecha efectiva */}
        <div className="typeform-input-section sap-theme">
          <label htmlFor="effectiveDate">📅 ¿Cuándo ocurrió este movimiento?</label>
          <input
            id="effectiveDate"
            type="datetime-local"
            value={formData.effectiveDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="typeform-input sap-theme"
          />
          <small className="typeform-unit sap-theme">
            💡 Por defecto se usa la fecha y hora actual
          </small>
        </div>

        {/* Descripción */}
        <div className="typeform-input-section sap-theme">
          <label htmlFor="description">📝 Detalles adicionales del movimiento (opcional)</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Ej: Combustible para operación en sector norte, mantenimiento programado, etc."
            className="typeform-input sap-theme"
            rows="3"
            maxLength="500"
          />
          <div className="description-counter sap-theme">
            {formData.description.length}/500 caracteres
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step7_Details;
