/**
 * Step2_FuelType - Segundo paso del wizard: Selección del tipo de combustible
 * Diseño estilo Typeform: conversacional y centrado en el producto
 */

import React, { useState, useEffect, useCallback } from 'react';
import { WIZARD_QUESTIONS } from '../../../constants';

const Step2_FuelType = ({
  formData,
  updateFormData,
  systemData,
  setError,
  isActive,
  theme = 'modern',
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Helper para clases según el tema
  const getThemeClass = (baseClass) => {
    if (theme === 'government') {
      return `${baseClass} government-override`;
    }
    return `${baseClass} sap-theme`;
  };

  const { products } = systemData;

  const handleFuelSelection = useCallback(
    async (fuelType, product) => {
      setLoading(true);
      setError('');

      try {
        // Simular carga de precios actualizados
        await new Promise((resolve) => setTimeout(resolve, 800));

        // 🔧 Normalizar fuelType a mayúsculas antes de guardar
        const normalizedFuelType = fuelType?.toUpperCase() || fuelType;

        console.log('🔄 [Step2] Seleccionando combustible:', normalizedFuelType, product);
        updateFormData('fuelType', normalizedFuelType);
        setSelectedProduct(product);

        // Auto-completar precio
        if (product.defaultPrice) {
          updateFormData('unitPrice', product.defaultPrice.toString());
        }

        console.log(
          '🔄 [Step2] Combustible seleccionado:',
          normalizedFuelType,
          'Precio:',
          product.defaultPrice
        );
      } catch (err) {
        console.error('Error al cargar combustible:', err);
        setError('Error al cargar información del combustible');
      } finally {
        setLoading(false);
      }
    },
    [updateFormData, setError]
  );

  // Actualizar producto seleccionado cuando cambia el combustible
  useEffect(() => {
    if (formData.fuelType && products.length > 0) {
      console.log('🔍 [Step2 useEffect] Buscando producto para fuelType:', formData.fuelType);
      console.log(
        '🔍 [Step2 useEffect] Productos disponibles:',
        products.map((p) => ({ name: p.name, displayName: p.displayName }))
      );

      const product = products.find(
        (p) =>
          p.name?.toUpperCase() === formData.fuelType?.toUpperCase() ||
          p.displayName?.toUpperCase() === formData.fuelType?.toUpperCase()
      );

      console.log('🔍 [Step2 useEffect] Producto encontrado:', product);
      setSelectedProduct(product);

      // Auto-completar precio si existe
      if (product && product.defaultPrice && !formData.unitPrice) {
        updateFormData('unitPrice', product.defaultPrice.toString());
      }
    }
  }, [formData.fuelType, formData.unitPrice, products, updateFormData]);

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      // Números 1-N para seleccionar productos
      const num = parseInt(e.key);
      if (num >= 1 && num <= products.length) {
        const selectedProduct = products[num - 1];
        handleFuelSelection(selectedProduct.name, selectedProduct);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive, products, handleFuelSelection]);

  if (products.length === 0) {
    return (
      <div className={`wizard-step step-fuel-type sap-theme ${isActive ? 'active' : ''}`}>
        <div className="step-question sap-theme sap-theme">
          <h3>⛽ Crear producto DIESEL manualmente</h3>
          <p>No hay productos disponibles. Creemos uno temporalmente.</p>
        </div>

        <div className="fuel-options sap-theme sap-theme">
          <div
            className="fuel-option sap-theme sap-theme"
            onClick={() =>
              handleFuelSelection('DIESEL', {
                name: 'DIESEL',
                displayName: 'DIESEL 🚛',
                icon: '🚛',
                description: 'Combustible DIESEL para vehículos pesados',
                defaultPrice: 12500,
              })
            }
          >
            <div className="option-icon sap-theme sap-theme">🚛</div>
            <div className="option-content sap-theme sap-theme">
              <h4 className="option-title sap-theme sap-theme">DIESEL 🚛</h4>
              <p className="option-description sap-theme sap-theme">
                Combustible DIESEL para vehículos pesados
              </p>
              <div className="fuel-price sap-theme sap-theme">
                <span className="price-value sap-theme sap-theme">$12,500 COP/galón</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`wizard-step step-fuel-type ${getThemeClass('')} ${isActive ? 'active' : ''}`}>
      <div className={getThemeClass('step-question')}>
        <h3>{WIZARD_QUESTIONS.FUEL_TYPE.title}</h3>
        <p>{WIZARD_QUESTIONS.FUEL_TYPE.description}</p>
      </div>

      {loading && (
        <div className={getThemeClass('wizard-loading')}>
          <div className={getThemeClass('loading-spinner')}></div>
          <p>📡 Actualizando precios...</p>
        </div>
      )}

      <div className={getThemeClass('fuel-options')}>
        {products.map((product) => (
          <div
            key={product.id}
            className={`${getThemeClass('fuel-option')} ${formData.fuelType?.toUpperCase() === product.name?.toUpperCase() ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
            onClick={() =>
              !loading && handleFuelSelection(product.name?.toUpperCase() || product.name, product)
            }
          >
            <div className={getThemeClass('option-icon')}>{product.icon || '🛢️'}</div>
            <div className={getThemeClass('option-content')}>
              <h4 className={getThemeClass('option-title')}>
                {product.displayName || product.name}
              </h4>
              <p className={getThemeClass('option-description')}>
                {product.description || 'Combustible premium'}
              </p>

              {product.defaultPrice && (
                <div className={getThemeClass('fuel-price')}>
                  <span className={getThemeClass('price-value')}>
                    ${product.defaultPrice.toLocaleString('es-CO')} COP/galón
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && formData.fuelType && (
        <div className={getThemeClass('selection-confirmation')}>
          <div className={getThemeClass('confirmation-card')}>
            <div className={getThemeClass('confirmation-header')}>
              <span className={getThemeClass('confirmation-icon')}>
                {selectedProduct.icon || '🛢️'}
              </span>
              <div className={getThemeClass('confirmation-text')}>
                <strong>
                  Excelente! Has elegido {selectedProduct.displayName || selectedProduct.name}
                </strong>
                <br />
                <small>{selectedProduct.description || 'Combustible de calidad premium'}</small>
              </div>
            </div>

            {selectedProduct.defaultPrice && (
              <div className={getThemeClass('price-confirmation')}>
                <div className={getThemeClass('price-info')}>
                  <span className={getThemeClass('price-label')}>💰 Precio actual:</span>
                  <span className={getThemeClass('price-amount')}>
                    ${selectedProduct.defaultPrice.toLocaleString('es-CO')} COP/galón
                  </span>
                </div>
                <small className={getThemeClass('price-note')}>
                  ✨ Aplicamos el precio automáticamente (lo puedes ajustar después)
                </small>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2_FuelType;
