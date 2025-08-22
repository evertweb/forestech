/**
 * Step7_Details - Séptimo paso del wizard: Detalles adicionales
 * Precio unitario, fecha efectiva, referencia y descripción
 */

import React, { useState, useEffect } from 'react';

const Step7_Details = ({
  formData,
  updateFormData,
  systemData,
  error,
  setError,
  isActive,
  theme = 'forestech',
}) => {
  const [calculating, setCalculating] = useState(false);
  const [priceValidated, setPriceValidated] = useState(false);

  // Helper para clases según el tema
  const getThemeClass = (baseClass) => {
    if (theme === 'government') {
      return `${baseClass} government-override`;
    }
    return `${baseClass} sap-theme`;
  };

  const { products } = systemData;

  // Auto-completar precio si no está establecido
  useEffect(() => {
    if (formData.fuelType && !formData.unitPrice && products.length > 0) {
      const product = products.find(
        (p) =>
          p.name?.toUpperCase() === formData.fuelType?.toUpperCase() ||
          p.displayName?.toUpperCase() === formData.fuelType?.toUpperCase()
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
      (p) =>
        p.name?.toUpperCase() === formData.fuelType?.toUpperCase() ||
        p.displayName?.toUpperCase() === formData.fuelType?.toUpperCase()
    );
  };

  return (
    <div className={`wizard-step step-details ${isActive ? 'active' : ''}`}>
      <div className={getThemeClass('typeform-layout')}>
        <div className={getThemeClass('typeform-question')}>
          <h3>📋 Información adicional del movimiento</h3>
          <p>Completa los detalles restantes:</p>
        </div>

        {/* Precio unitario */}
        <div className={getThemeClass('typeform-input-section')}>
          <label htmlFor="unitPrice">💰 Precio por galón (COP) *</label>
          <input
            id="unitPrice"
            type="number"
            step="1"
            min="0"
            value={formData.unitPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            placeholder="0"
            className={`${getThemeClass('typeform-input')} ${error ? 'error' : ''}`}
          />
          <span className={getThemeClass('typeform-unit')}>COP</span>

          {calculating && (
            <div className={getThemeClass('calculating-price')}>
              <div className={`${getThemeClass('loading-spinner')} small`}></div>
              <span>💰 Validando precio...</span>
            </div>
          )}

          {getCurrentProduct()?.defaultPrice && (
            <small className={getThemeClass('price-suggestion')}>
              💡 Precio sugerido: ${getCurrentProduct().defaultPrice.toLocaleString('es-CO')} COP
            </small>
          )}
        </div>

        {/* Valor total calculado */}
        {formData.quantity &&
          formData.unitPrice &&
          priceValidated && ( // Solo mostrar si hay cantidad y precio
            <div className={getThemeClass('total-value-section')}>
              <div className={getThemeClass('total-value-card')}>
                <div className={getThemeClass('total-icon')}>📊</div>
                <div className={getThemeClass('total-content')}>
                  <h4>Valor Total Calculado</h4>
                  <div className={getThemeClass('total-calculation')}>
                    <span className={getThemeClass('calculation-details')}>
                      {parseFloat(formData.quantity).toFixed(2)} gal × $
                      {parseFloat(formData.unitPrice).toLocaleString('es-CO')} COP
                    </span>
                    <div className={getThemeClass('total-amount')}>
                      {formatCurrency(totalValue)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Fecha efectiva */}
        <div className={getThemeClass('typeform-input-section')}>
          <label htmlFor="effectiveDate">📅 ¿Cuándo ocurrió este movimiento?</label>
          <input
            id="effectiveDate"
            type="datetime-local"
            value={formData.effectiveDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className={getThemeClass('typeform-input')}
          />
          <small className={getThemeClass('typeform-unit')}>
            💡 Por defecto se usa la fecha y hora actual
          </small>
        </div>

        {/* Descripción */}
        <div className={getThemeClass('typeform-input-section')}>
          <label htmlFor="description">📝 Detalles adicionales del movimiento (opcional)</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Ej: Combustible para operación en sector norte, mantenimiento programado, etc."
            className={getThemeClass('typeform-input')}
            rows="3"
            maxLength="500"
          />
          <div className={getThemeClass('description-counter')}>
            {formData.description.length}/500 caracteres
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step7_Details;
