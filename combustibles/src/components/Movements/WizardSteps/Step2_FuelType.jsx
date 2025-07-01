/**
 * Step2_FuelType - Segundo paso del wizard: Selección del tipo de combustible
 * Muestra productos disponibles con precios automáticos y estado de loading
 */

import React, { useState, useEffect } from 'react';

const Step2_FuelType = ({ formData, updateFormData, systemData, setError }) => {
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
      
      // 🔍 DEBUG: Log específico para fuelType
      console.log('🔄 [Step2] Combustible seleccionado:', fuelType, 'Precio:', product.defaultPrice);
      console.log('🔍 [Step2] FormData después de actualización:', { fuelType, unitPrice: product.defaultPrice });
      
    } catch (err) {
      console.error('Error al cargar combustible:', err);
      setError('Error al cargar información del combustible');
    } finally {
      setLoading(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="wizard-step step-fuel-type">
        <div className="step-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>🔄 Cargando productos disponibles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-step step-fuel-type">
      <div className="step-content">
        <div className="step-question">
          <h3>⛽ ¿Qué combustible vas a mover?</h3>
          <p>Selecciona el producto del inventario:</p>
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>📡 Solicitando precios actualizados...</p>
          </div>
        )}

        <div className="fuel-options">
          {products.map((product) => (
            <div
              key={product.id}
              className={`fuel-option ${formData.fuelType === product.name ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
              onClick={() => !loading && handleFuelSelection(product.name, product)}
            >
              <div className="fuel-icon">
                {product.icon || '🛢️'}
              </div>
              <div className="fuel-content">
                <h4>{product.displayName || product.name}</h4>
                <p className="fuel-description">{product.description || 'Combustible'}</p>
                
                {product.defaultPrice && (
                  <div className="fuel-price">
                    <span className="price-label">Precio actual:</span>
                    <span className="price-value">
                      ${product.defaultPrice.toLocaleString('es-CO')} COP/gal
                    </span>
                  </div>
                )}
                
                {product.category && (
                  <small className="fuel-category">{product.category}</small>
                )}
              </div>
              <div className="fuel-selector">
                {formData.fuelType === product.name && <span className="check-icon">✅</span>}
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
                  <strong>{selectedProduct.displayName || selectedProduct.name}</strong>
                  <br />
                  <small>{selectedProduct.description || 'Combustible seleccionado'}</small>
                </div>
              </div>
              
              {selectedProduct.defaultPrice && (
                <div className="price-confirmation">
                  <div className="price-info">
                    <span className="price-label">💰 Precio por galón:</span>
                    <span className="price-amount">
                      ${selectedProduct.defaultPrice.toLocaleString('es-CO')} COP
                    </span>
                  </div>
                  <small className="price-note">
                    ✨ Precio aplicado automáticamente (puedes modificarlo más adelante)
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