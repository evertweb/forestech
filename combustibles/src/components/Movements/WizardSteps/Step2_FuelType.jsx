/**
 * Step2_FuelType - Segundo paso del wizard: Selección del tipo de combustible
 * Diseño estilo Typeform: conversacional y centrado en el producto
 */

import React, { useState, useEffect } from 'react';

const Step2_FuelType = ({ formData, updateFormData, systemData, setError, isActive }) => {
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { products } = systemData;

  // Actualizar producto seleccionado cuando cambia el combustible
  useEffect(() => {
    if (formData.fuelType && products.length > 0) {
      const product = products.find(p => p.name === formData.fuelType || p.displayName === formData.fuelType);
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

  const handleFuelSelection = async (fuelType, product) => {
    setLoading(true);
    setError('');
    
    try {
      // Simular carga de precios actualizados
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateFormData('fuelType', fuelType);
      setSelectedProduct(product);
      
      // Auto-completar precio
      if (product.defaultPrice) {
        updateFormData('unitPrice', product.defaultPrice.toString());
      }
      
      console.log('🔄 [Step2] Combustible seleccionado:', fuelType, 'Precio:', product.defaultPrice);
      
    } catch (err) {
      console.error('Error al cargar combustible:', err);
      setError('Error al cargar información del combustible');
    } finally {
      setLoading(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className={`wizard-step step-fuel-type ${isActive ? 'active' : ''}`}>
        <div className="typeform-layout">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>🔄 Cargando productos disponibles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`wizard-step step-fuel-type ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        <div className="typeform-question">
          <h2>⛽ ¿Qué tipo de combustible necesitas?</h2>
          <p>Elige el producto que vas a mover</p>
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>📡 Actualizando precios...</p>
          </div>
        )}

        <div className="typeform-options">
          {products.map((product) => (
            <div
              key={product.id}
              className={`typeform-option ${formData.fuelType === product.name ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
              onClick={() => !loading && handleFuelSelection(product.name, product)}
            >
              <div className="typeform-option-icon">
                {product.icon || '🛢️'}
              </div>
              <div className="typeform-option-content">
                <h4>{product.displayName || product.name}</h4>
                <p>{product.description || 'Combustible premium'}</p>
                
                {product.defaultPrice && (
                  <div className="fuel-price">
                    <span className="price-value">
                      ${product.defaultPrice.toLocaleString('es-CO')} COP/galón
                    </span>
                  </div>
                )}
              </div>
              <div className="typeform-option-selector">
                <div className="typeform-check">
                  <span className="typeform-check-icon">✓</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && formData.fuelType && (
          <div className="selection-confirmation">
            <div className="confirmation-card fuel-confirmation">
              <div className="confirmation-header">
                <span className="confirmation-icon">
                  {selectedProduct.icon || '🛢️'}
                </span>
                <div className="confirmation-text">
                  <strong>Excelente! Has elegido {selectedProduct.displayName || selectedProduct.name}</strong>
                  <br />
                  <small>{selectedProduct.description || 'Combustible de calidad premium'}</small>
                </div>
              </div>
              
              {selectedProduct.defaultPrice && (
                <div className="price-confirmation">
                  <div className="price-info">
                    <span className="price-label">💰 Precio actual:</span>
                    <span className="price-amount">
                      ${selectedProduct.defaultPrice.toLocaleString('es-CO')} COP/galón
                    </span>
                  </div>
                  <small className="price-note">
                    ✨ Aplicamos el precio automáticamente (lo puedes ajustar después)
                  </small>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2_FuelType;