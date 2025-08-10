/**
 * Step2_FuelType - Segundo paso del wizard: Selección del tipo de combustible
 * Diseño estilo Typeform: conversacional y centrado en el producto
 */

import React, { useState, useEffect, useCallback } from 'react';
import { WIZARD_QUESTIONS } from '../../../constants';

const Step2_FuelType = ({ formData, updateFormData, systemData, setError, isActive }) => {
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { products } = systemData;

  const handleFuelSelection = useCallback(
    async (fuelType, product) => {
      setLoading(true);
      setError('');

      try {
        // Simular carga de precios actualizados
        await new Promise((resolve) => setTimeout(resolve, 800));

        updateFormData('fuelType', fuelType);
        setSelectedProduct(product);

        // Auto-completar precio
        if (product.defaultPrice) {
          updateFormData('unitPrice', product.defaultPrice.toString());
        }

        console.log(
          '🔄 [Step2] Combustible seleccionado:',
          fuelType,
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
      const product = products.find(
        (p) => p.name === formData.fuelType || p.displayName === formData.fuelType
      );
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
          <h3>⛽ Crear producto diesel manualmente</h3>
          <p>No hay productos disponibles. Creemos uno temporalmente.</p>
        </div>

        <div className="fuel-options sap-theme sap-theme">
          <div
            className="fuel-option sap-theme sap-theme"
            onClick={() =>
              handleFuelSelection('DIESEL', {
                name: 'DIESEL',
                displayName: 'Diesel 🚛',
                icon: '🚛',
                description: 'Combustible diesel para vehículos pesados',
                defaultPrice: 12500,
              })
            }
          >
            <div className="option-icon sap-theme sap-theme">🚛</div>
            <div className="option-content sap-theme sap-theme">
              <h4 className="option-title sap-theme sap-theme">Diesel 🚛</h4>
              <p className="option-description sap-theme sap-theme">
                Combustible diesel para vehículos pesados
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
    <div className={`wizard-step step-fuel-type sap-theme ${isActive ? 'active' : ''}`}>
      <div className="step-question sap-theme sap-theme">
        <h3>{WIZARD_QUESTIONS.FUEL_TYPE.title}</h3>
        <p>{WIZARD_QUESTIONS.FUEL_TYPE.description}</p>
      </div>

      {loading && (
        <div className="wizard-loading sap-theme sap-theme">
          <div className="loading-spinner sap-theme sap-theme"></div>
          <p>📡 Actualizando precios...</p>
        </div>
      )}

      <div className="fuel-options sap-theme sap-theme">
        {products.map((product) => (
          <div
            key={product.id}
            className={`fuel-option sap-theme ${formData.fuelType === product.name ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
            onClick={() => !loading && handleFuelSelection(product.name, product)}
          >
            <div className="option-icon sap-theme sap-theme">{product.icon || '🛢️'}</div>
            <div className="option-content sap-theme sap-theme">
              <h4 className="option-title sap-theme sap-theme">
                {product.displayName || product.name}
              </h4>
              <p className="option-description sap-theme sap-theme">
                {product.description || 'Combustible premium'}
              </p>

              {product.defaultPrice && (
                <div className="fuel-price sap-theme sap-theme">
                  <span className="price-value sap-theme sap-theme">
                    ${product.defaultPrice.toLocaleString('es-CO')} COP/galón
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && formData.fuelType && (
        <div className="selection-confirmation sap-theme sap-theme">
          <div className="confirmation-card sap-theme sap-theme">
            <div className="confirmation-header sap-theme sap-theme">
              <span className="confirmation-icon sap-theme sap-theme">
                {selectedProduct.icon || '🛢️'}
              </span>
              <div className="confirmation-text sap-theme sap-theme">
                <strong>
                  Excelente! Has elegido {selectedProduct.displayName || selectedProduct.name}
                </strong>
                <br />
                <small>{selectedProduct.description || 'Combustible de calidad premium'}</small>
              </div>
            </div>

            {selectedProduct.defaultPrice && (
              <div className="price-confirmation sap-theme sap-theme">
                <div className="price-info sap-theme sap-theme">
                  <span className="price-label sap-theme sap-theme">💰 Precio actual:</span>
                  <span className="price-amount sap-theme sap-theme">
                    ${selectedProduct.defaultPrice.toLocaleString('es-CO')} COP/galón
                  </span>
                </div>
                <small className="price-note sap-theme sap-theme">
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
