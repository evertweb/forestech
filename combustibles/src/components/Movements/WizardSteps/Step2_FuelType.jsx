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
  theme = 'forestech',
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Helper para clases según el tema
  const getThemeClass = (baseClass) => {
    return `${baseClass} ${theme}-theme`;
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

  // Solo navegación por mouse

  if (products.length === 0) {
    return (
      <div
        className={`wizard-step step-fuel-type ${getThemeClass('')} ${isActive ? 'active' : ''}`}
      >
        <div className={getThemeClass('step-question')}>
          <h3>⛽ Crear producto DIESEL manualmente</h3>
          <p>No hay productos disponibles. Creemos uno temporalmente.</p>
        </div>

        <div className={getThemeClass('fuel-options')}>
          <div
            className={getThemeClass('fuel-option')}
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
            <div className={getThemeClass('option-icon')}>🚛</div>
            <div className={getThemeClass('option-content')}>
              <h4 className={getThemeClass('option-title')}>DIESEL 🚛</h4>
              <p className={getThemeClass('option-description')}>
                Combustible DIESEL para vehículos pesados
              </p>
              <div className={getThemeClass('fuel-price')}>
                <span className={getThemeClass('price-value')}>$12,500 COP/galón</span>
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
