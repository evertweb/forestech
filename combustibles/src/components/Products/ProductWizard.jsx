/**
 * ProductWizard - Formulario de creación de productos en modo popup
 * Diseño estilo SAP con validaciones y preview en tiempo real
 */

import React, { useState, useCallback } from 'react';
import { useFormData } from '../../hooks/useFormData';
import { createProduct } from '../../services/productsService';
import { PRODUCT_CATEGORIES } from '../../constants/productTypes';
import { PRODUCT_COLORS } from '../../constants/designTokens';
import { postMessageSafe, POPUP_EVENTS } from '../../services/popupCommunication';
import {
  UI_ACTIONS,
  UI_FORM_LABELS,
  UI_MESSAGES,
  UI_PLACEHOLDERS,
  MODAL_TEXT,
  UI_TITLES,
} from '../../constants';
import './ProductWizard.css';

const ProductWizard = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Valores iniciales del formulario
  const initialValues = {
    name: '',
    displayName: '',
    category: PRODUCT_CATEGORIES.COMBUSTIBLE,
    unit: 'gal',
    defaultPrice: 0,
    color: '#FF6B35',
    icon: '🛢️',
    description: '',
    isActive: true,
    currentStock: 0,
    minThreshold: 10,
    maxCapacity: 1000,
  };

  // Validación del formulario
  const validate = useCallback((values) => {
    const errors = {};

    // Validaciones paso 1: Información básica
    if (!values.name?.trim()) {
      errors.name = 'El nombre interno es requerido';
    }
    if (!values.displayName?.trim()) {
      errors.displayName = 'El nombre para mostrar es requerido';
    }
    if (!values.category) {
      errors.category = 'La categoría es requerida';
    }

    // Validaciones paso 2: Precios y configuración
    if (values.defaultPrice < 0) {
      errors.defaultPrice = 'El precio no puede ser negativo';
    }
    if (values.minThreshold < 0) {
      errors.minThreshold = 'El umbral mínimo no puede ser negativo';
    }
    if (values.maxCapacity <= 0) {
      errors.maxCapacity = 'La capacidad máxima debe ser mayor a 0';
    }

    // Validaciones paso 3: Stock inicial
    if (values.currentStock < 0) {
      errors.currentStock = 'El stock no puede ser negativo';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }, []);

  const {
    values: formData,
    setValues: setFormData,
    errors,
    setErrors,
    handleInputChange,
    validateForm,
  } = useFormData(initialValues, validate);

  // Manejar cambio de paso
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Validar solo los campos del paso actual
  const validateCurrentStep = () => {
    const stepFields = {
      1: ['name', 'displayName', 'category'],
      2: ['defaultPrice', 'minThreshold', 'maxCapacity'],
      3: ['currentStock'],
    };

    const fieldsToValidate = stepFields[currentStep] || [];
    const validation = validate(formData);

    const stepErrors = {};
    fieldsToValidate.forEach((field) => {
      if (validation.errors[field]) {
        stepErrors[field] = validation.errors[field];
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Iconos disponibles para productos
  const availableIcons = ['🛢️', '⛽', '🚛', '🚗', '🔧', '⚙️', '🔋', '💧', '🛠️', '🏭'];

  // Cerrar popup
  const handleClose = () => {
    if (window.opener) {
      postMessageSafe(window.opener, POPUP_EVENTS.WIZARD_CLOSED, {});
      window.close();
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const productData = {
        ...formData,
        name: formData.name.toUpperCase(),
        defaultPrice: parseFloat(formData.defaultPrice) || 0,
        currentStock: parseFloat(formData.currentStock) || 0,
        minThreshold: parseFloat(formData.minThreshold) || 10,
        maxCapacity: parseFloat(formData.maxCapacity) || 1000,
      };

      await createProduct(productData);

      // Notificar éxito a la ventana padre
      if (window.opener) {
        postMessageSafe(window.opener, POPUP_EVENTS.WIZARD_SUCCESS, {
          type: 'product',
          data: productData,
          message: `Producto "${productData.displayName}" creado exitosamente`,
        });
        window.close();
      }
    } catch (error) {
      console.error('Error creando producto:', error);
      setErrors({ submit: 'Error al crear el producto. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  // Render del paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="wizard-step sap-theme">
            <h3 className="step-title sap-theme">📋 Información Básica</h3>

            <div className="form-group sap-theme">
              <label className="sap-label">Nombre interno *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`sap-input ${errors.name ? 'error' : ''}`}
                placeholder="DIESEL, GASOLINE, etc."
              />
              {errors.name && <span className="error-text sap-theme">{errors.name}</span>}
            </div>

            <div className="form-group sap-theme">
              <label className="sap-label">Nombre para mostrar *</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className={`sap-input ${errors.displayName ? 'error' : ''}`}
                placeholder="Diesel Premium, Gasolina Corriente, etc."
              />
              {errors.displayName && (
                <span className="error-text sap-theme">{errors.displayName}</span>
              )}
            </div>

            <div className="form-group sap-theme">
              <label className="sap-label">Categoría *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`sap-select ${errors.category ? 'error' : ''}`}
              >
                {Object.values(PRODUCT_CATEGORIES).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-text sap-theme">{errors.category}</span>}
            </div>

            <div className="form-group sap-theme">
              <label className="sap-label">Unidad de medida</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="sap-select"
              >
                <option value="gal">Galones (gal)</option>
                <option value="L">Litros (L)</option>
                <option value="kg">Kilogramos (kg)</option>
                <option value="ton">Toneladas (ton)</option>
                <option value="und">Unidades (und)</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="wizard-step sap-theme">
            <h3 className="step-title sap-theme">💰 Precios y Configuración</h3>

            <div className="form-group sap-theme">
              <label className="sap-label">Precio por defecto (COP)</label>
              <input
                type="number"
                name="defaultPrice"
                value={formData.defaultPrice}
                onChange={handleInputChange}
                className={`sap-input ${errors.defaultPrice ? 'error' : ''}`}
                min="0"
                step="100"
              />
              {errors.defaultPrice && (
                <span className="error-text sap-theme">{errors.defaultPrice}</span>
              )}
            </div>

            <div className="form-group sap-theme">
              <label className="sap-label">Umbral mínimo</label>
              <input
                type="number"
                name="minThreshold"
                value={formData.minThreshold}
                onChange={handleInputChange}
                className={`sap-input ${errors.minThreshold ? 'error' : ''}`}
                min="0"
              />
              {errors.minThreshold && (
                <span className="error-text sap-theme">{errors.minThreshold}</span>
              )}
            </div>

            <div className="form-group sap-theme">
              <label className="sap-label">Capacidad máxima</label>
              <input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleInputChange}
                className={`sap-input ${errors.maxCapacity ? 'error' : ''}`}
                min="1"
              />
              {errors.maxCapacity && (
                <span className="error-text sap-theme">{errors.maxCapacity}</span>
              )}
            </div>

            <div className="form-row sap-theme">
              <div className="form-group sap-theme">
                <label className="sap-label">Color</label>
                <div className="color-picker sap-theme">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="color-input sap-theme"
                  />
                  <div className="color-presets sap-theme">
                    {PRODUCT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="color-preset sap-theme"
                        style={{ backgroundColor: color }}
                        onClick={() => handleInputChange('color', color)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group sap-theme">
                <label className="sap-label">Icono</label>
                <div className="icon-picker sap-theme">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option sap-theme ${formData.icon === icon ? 'selected' : ''}`}
                      onClick={() => handleInputChange('icon', icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="wizard-step sap-theme">
            <h3 className="step-title sap-theme">📦 Stock y Descripción</h3>

            <div className="form-group sap-theme">
              <label className="sap-label">Stock inicial</label>
              <input
                type="number"
                name="currentStock"
                value={formData.currentStock}
                onChange={handleInputChange}
                className={`sap-input ${errors.currentStock ? 'error' : ''}`}
                min="0"
                step="0.01"
              />
              {errors.currentStock && (
                <span className="error-text sap-theme">{errors.currentStock}</span>
              )}
            </div>

            <div className="form-group sap-theme">
              <label className="sap-label">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="sap-textarea"
                rows="4"
                placeholder="Descripción detallada del producto..."
              />
            </div>

            <div className="form-group sap-theme">
              <label className="checkbox-label sap-theme">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="sap-checkbox"
                />
                <span className="checkbox-text sap-theme">Producto activo</span>
              </label>
            </div>

            {/* Preview del producto */}
            <div className="product-preview sap-theme">
              <h4 className="preview-title sap-theme">Vista previa:</h4>
              <div className="preview-card sap-theme" style={{ borderColor: formData.color }}>
                <div className="preview-icon sap-theme" style={{ color: formData.color }}>
                  {formData.icon}
                </div>
                <div className="preview-info sap-theme">
                  <h5 className="preview-name sap-theme">
                    {formData.displayName || 'Nombre del producto'}
                  </h5>
                  <p className="preview-category sap-theme">{formData.category}</p>
                  <p className="preview-price sap-theme">
                    ${new Intl.NumberFormat('es-CO').format(formData.defaultPrice)} /{' '}
                    {formData.unit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="product-wizard sap-theme">
      {/* Header con progreso */}
      <div className="wizard-header sap-theme">
        <div className="progress-bar sap-theme">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`progress-step sap-theme ${i + 1 <= currentStep ? 'active' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <p className="progress-text sap-theme">
          Paso {currentStep} de {totalSteps}
        </p>
      </div>

      {/* Contenido del formulario */}
      <form onSubmit={handleSubmit} className="wizard-form sap-theme">
        {renderStep()}

        {/* Error de envío */}
        {errors.submit && <div className="error-message sap-theme">{errors.submit}</div>}

        {/* Botones de navegación */}
        <div className="wizard-actions sap-theme">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary sap-theme"
            disabled={loading}
          >
            Cancelar
          </button>

          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="btn-secondary sap-theme"
              disabled={loading}
            >
              ← Anterior
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="btn-primary sap-theme"
              disabled={loading}
            >
              Siguiente →
            </button>
          ) : (
            <button type="submit" className="btn-primary sap-theme" disabled={loading}>
              {loading ? 'Creando...' : '✅ Crear Producto'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductWizard;
