/**
 * ProductWizard - Formulario de creación de productos en modo popup
 * Diseño estilo SAP con validaciones y preview en tiempo real
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useFormData } from '../../hooks/useFormData';
import { createProduct } from '../../services/FirebaseProductsService';
import { postMessageSafe, POPUP_EVENTS } from '../../services/popupCommunication';
import {
  detectFuelType,
  canUseAutomaticPricing,
  getCurrentFuelPrice,
} from '../../services/fuelPricesService';
import {
  UI_ACTIONS,
  UI_FORM_LABELS,
  UI_MESSAGES,
  UI_PLACEHOLDERS,
  MODAL_TEXT,
  UI_TITLES,
} from '../../constants';
import './ProductWizard.css';
import './ProductPricing.css';

const ProductWizard = () => {
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [expandedStep, setExpandedStep] = useState(1);

  // Estados para precios automáticos
  const [automaticPricing, setAutomaticPricing] = useState(true);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(null);
  const [lastPriceUpdate, setLastPriceUpdate] = useState(null);

  // Valores iniciales del formulario
  const initialValues = {
    name: '',
    displayName: '',
    defaultPrice: 0,
    isActive: true,
    currentStock: 0,
    minThreshold: 10,
    maxCapacity: 1000,
    code: '',
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

  // Función para sincronizar precio manualmente
  const handleSyncPrice = useCallback(async () => {
    const fuelType = detectFuelType(formData.name);
    if (!fuelType) {
      setPriceError('No se pudo detectar el tipo de combustible');
      return;
    }

    setPriceLoading(true);

    try {
      const priceData = await getCurrentFuelPrice(fuelType, 'LA PRIMAVERA');

      if (priceData.success) {
        setFormData((prev) => ({
          ...prev,
          defaultPrice: priceData.data.price,
        }));
        setLastPriceUpdate(new Date().toISOString());
        setPriceError(null);
      } else {
        // Usar precio de respaldo
        if (priceData.fallbackPrice) {
          setFormData((prev) => ({
            ...prev,
            defaultPrice: priceData.fallbackPrice,
          }));
          setLastPriceUpdate(new Date().toISOString());
          setPriceError(
            `API no disponible. Usando precio estimado: $${priceData.fallbackPrice.toLocaleString('es-CO')}`
          );
        } else {
          setPriceError(priceData.error || 'Error obteniendo precio');
        }
      }
    } catch (error) {
      console.error('Error sincronizando precio:', error);
      setPriceError('Error de conexión. Verifique su internet.');
    } finally {
      setPriceLoading(false);
    }
  }, [formData.name, setFormData]);

  // Sincronización automática de precios cuando cambia el nombre o categoría
  useEffect(() => {
    const syncPriceAutomatically = async () => {
      if (!automaticPricing) return;

      const fuelType = detectFuelType(formData.name);
      if (!fuelType) return;

      // Solo sincronizar si el precio actual es 0 o si ha pasado más de 1 hora desde la última actualización
      const shouldSync =
        formData.defaultPrice === 0 ||
        !lastPriceUpdate ||
        Date.now() - new Date(lastPriceUpdate).getTime() > 3600000; // 1 hora

      if (shouldSync) {
        await handleSyncPrice();
      }
    };

    // Debounce para evitar múltiples llamadas
    const timeoutId = setTimeout(syncPriceAutomatically, 1000);
    return () => clearTimeout(timeoutId);
  }, [
    formData.name,
    formData.defaultPrice,
    automaticPricing,
    lastPriceUpdate,
    handleSyncPrice,
  ]);

  // Manejar cambio de paso
  const toggleStep = (stepNumber) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  const markStepComplete = (stepNumber) => {
    setCompletedSteps((prev) => new Set([...prev, stepNumber]));
  };

  const isStepComplete = (stepNumber) => {
    return completedSteps.has(stepNumber);
  };

  // Validar solo los campos del paso actual
  const validateStep = (stepNumber) => {
    const stepFields = {
      1: ['name', 'displayName'], // Categoría removida
      2: ['defaultPrice', 'minThreshold', 'maxCapacity'],
      3: ['currentStock'],
    };

    const fieldsToValidate = stepFields[stepNumber] || [];
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

  const handleStepComplete = (stepNumber) => {
    if (validateStep(stepNumber)) {
      markStepComplete(stepNumber);
      // Expandir siguiente paso automáticamente
      if (stepNumber < 3) {
        setExpandedStep(stepNumber + 1);
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    const { errors: validationErrors } = validate(formData);
    const hasStep3Errors = Boolean(validationErrors.currentStock);

    if (!hasStep3Errors) {
      setCompletedSteps((prev) => (prev.has(3) ? prev : new Set([...prev, 3])));
    } else {
      setCompletedSteps((prev) => {
        if (!prev.has(3)) {
          return prev;
        }
        const updatedSteps = new Set(prev);
        updatedSteps.delete(3);
        return updatedSteps;
      });
    }
  }, [formData, validate]);

  // Iconos disponibles para productos (mantenidos en diseño, movimiento a constantes si se necesita)

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

    console.log('🔍 ProductWizard.handleSubmit - Validando formulario...');
    console.log('📊 Estado de pasos completos:', Array.from(completedSteps));
    console.log('📋 Datos del formulario:', formData);

    if (!validateForm()) {
      console.error('❌ Validación fallida:', errors);
      return;
    }

    setLoading(true);
    try {
      // Enviar sólo los campos esenciales (payload reducido)
      const productData = {
        name: formData.name.toUpperCase(),
        displayName: formData.displayName,
        code: formData.code ? formData.code.toUpperCase() : null,
        unit: formData.unit,
        price: parseFloat(formData.defaultPrice) || 0,
        currentStock: parseFloat(formData.currentStock) || 0,
        minThreshold: parseFloat(formData.minThreshold) || 0,
        maxCapacity: parseFloat(formData.maxCapacity) || 1000,
        isActive: !!formData.isActive,
      };

      console.log('📤 Enviando producto a crear:', productData);

      const result = await createProduct(productData);

      console.log('📥 Resultado de creación:', result);

      if (result && result.success !== false) {
        // Notificar éxito a la ventana padre
        if (window.opener) {
          postMessageSafe(window.opener, POPUP_EVENTS.WIZARD_SUCCESS, {
            type: 'product',
            data: productData,
            message: `Producto "${productData.displayName}" creado exitosamente`,
          });
          window.close();
        }
      } else {
        throw new Error(result.error || 'Error desconocido al crear producto');
      }
    } catch (error) {
      console.error('❌ Error creando producto:', error);
      setErrors({ submit: `Error al crear el producto: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Render del paso actual
  const renderStepContent = (stepNumber) => {
    const isExpanded = expandedStep === stepNumber;
    const isComplete = isStepComplete(stepNumber);

    if (!isExpanded && isComplete) {
      return null; // No mostrar contenido si está colapsado y completo
    }

    switch (stepNumber) {
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
              <label className="sap-label">Código (opcional)</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="sap-input"
                placeholder="GEXT001"
              />
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

            {/* Control de precios automáticos */}
            <div className="automatic-pricing-section sap-theme">
              <div className="form-group pricing-toggle sap-theme">
                <label className="toggle-label sap-theme">
                  <input
                    type="checkbox"
                    checked={automaticPricing}
                    onChange={(e) => setAutomaticPricing(e.target.checked)}
                    className="toggle-input sap-theme"
                  />
                  <span className="toggle-switch sap-theme"></span>
                  <span className="toggle-text sap-theme">
                    🔄 Sincronización automática de precios
                  </span>
                </label>
                <small className="pricing-help sap-theme">
                  Precios actualizados desde datos oficiales del gobierno (datos.gov.co optimizado)
                </small>
              </div>

              {automaticPricing &&
                canUseAutomaticPricing({ name: formData.name }) && (
                  <div className="automatic-pricing-info sap-theme">
                    <div className="pricing-status sap-theme">
                      <span className="status-icon sap-theme">🇨🇴</span>
                      <span className="status-text sap-theme">
                        Precio automático para {detectFuelType(formData.name)}{' '}
                        (La Primavera)
                      </span>
                      <small className="status-details sap-theme">
                        Datos oficiales con ajuste por inflación 2025
                      </small>
                      {lastPriceUpdate && (
                        <span className="last-update sap-theme">
                          Última actualización: {new Date(lastPriceUpdate).toLocaleString('es-CO')}
                        </span>
                      )}
                    </div>
                    {priceError && (
                      <div className="pricing-error sap-theme">
                        <span className="error-icon sap-theme">⚠️</span>
                        <span className="error-text sap-theme">{priceError}</span>
                      </div>
                    )}
                  </div>
                )}

              {automaticPricing &&
                !canUseAutomaticPricing({ name: formData.name }) && (
                  <div className="automatic-pricing-unavailable sap-theme">
                    <span className="unavailable-icon sap-theme">ℹ️</span>
                    <span className="unavailable-text sap-theme">
                      La sincronización automática no está disponible para este tipo de producto.
                      Ingrese el precio manualmente.
                    </span>
                  </div>
                )}
            </div>

            <div className="form-group sap-theme">
              <div className="price-input-header sap-theme">
                <label className="sap-label">Precio por defecto (COP)</label>
                {automaticPricing &&
                  canUseAutomaticPricing({ name: formData.name }) && (
                    <button
                      type="button"
                      className="btn-sync-price sap-theme"
                      onClick={handleSyncPrice}
                      disabled={priceLoading}
                      title="Sincronizar precio ahora"
                    >
                      {priceLoading ? '🔄' : '🔄'} Sincronizar
                    </button>
                  )}
              </div>
              <input
                type="number"
                name="defaultPrice"
                value={formData.defaultPrice}
                onChange={handleInputChange}
                className={`sap-input ${errors.defaultPrice ? 'error' : ''}`}
                min="0"
                step="100"
                disabled={priceLoading}
              />
              {errors.defaultPrice && (
                <span className="error-text sap-theme">{errors.defaultPrice}</span>
              )}
              {priceLoading && (
                <div className="price-loading sap-theme">
                  <span className="loading-icon sap-theme">⏳</span>
                  <span className="loading-text sap-theme">Obteniendo precio actualizado...</span>
                </div>
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

            {/* Pequeña vista previa simplificada */}
            <div className="product-preview sap-theme">
              <h4 className="preview-title sap-theme">Vista previa:</h4>
              <div className="preview-card sap-theme">
                <div className="preview-info sap-theme">
                  <h5 className="preview-name sap-theme">{formData.displayName || 'Nombre del producto'}</h5>
                  <p className="preview-category sap-theme">{formData.unit}</p>
                  <p className="preview-price sap-theme">${new Intl.NumberFormat('es-CO').format(formData.defaultPrice)} / {formData.unit}</p>
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
    <div className="product-wizard-cascade sap-theme">
      {/* Header principal */}
      <div className="wizard-header-cascade sap-theme">
        <h2 className="wizard-main-title">Crear Nuevo Producto</h2>
        <p className="wizard-subtitle">Complete los siguientes pasos para crear un producto</p>
      </div>

      {/* Contenido del formulario en cascada */}
      <form onSubmit={handleSubmit} className="wizard-form-cascade sap-theme">
        
        {/* Paso 1: Información Básica */}
        <div className={`cascade-step sap-theme ${isStepComplete(1) ? 'complete' : ''} ${expandedStep === 1 ? 'expanded' : ''}`}>
          <div className="step-header sap-theme" onClick={() => toggleStep(1)}>
            <div className="step-indicator sap-theme">
              {isStepComplete(1) ? '✓' : '1'}
            </div>
            <div className="step-title-section sap-theme">
              <h3 className="step-title-cascade sap-theme">📋 Información Básica</h3>
              <p className="step-description sap-theme">Nombre y unidad de medida del producto</p>
            </div>
            <div className="step-toggle sap-theme">
              {expandedStep === 1 ? '▲' : '▼'}
            </div>
          </div>

          {expandedStep === 1 && (
            <div className="step-content sap-theme">
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
                <label className="sap-label">Código (opcional)</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="sap-input"
                  placeholder="GEXT001"
                />
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

              <div className="step-actions sap-theme">
                <button
                  type="button"
                  onClick={() => handleStepComplete(1)}
                  className="btn-continue sap-theme"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Paso 2: Precios y Configuración */}
        <div className={`cascade-step sap-theme ${isStepComplete(2) ? 'complete' : ''} ${expandedStep === 2 ? 'expanded' : ''}`}>
          <div className="step-header sap-theme" onClick={() => toggleStep(2)}>
            <div className="step-indicator sap-theme">
              {isStepComplete(2) ? '✓' : '2'}
            </div>
            <div className="step-title-section sap-theme">
              <h3 className="step-title-cascade sap-theme">💰 Precios y Configuración</h3>
              <p className="step-description sap-theme">Define precios y límites de stock</p>
            </div>
            <div className="step-toggle sap-theme">
              {expandedStep === 2 ? '▲' : '▼'}
            </div>
          </div>

          {expandedStep === 2 && (
            <div className="step-content sap-theme">
              {renderStepContent(2)}
              
              <div className="step-actions sap-theme">
                <button
                  type="button"
                  onClick={() => setExpandedStep(1)}
                  className="btn-back sap-theme"
                >
                  ← Volver
                </button>
                <button
                  type="button"
                  onClick={() => handleStepComplete(2)}
                  className="btn-continue sap-theme"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Paso 3: Stock y Descripción */}
        <div className={`cascade-step sap-theme ${isStepComplete(3) ? 'complete' : ''} ${expandedStep === 3 ? 'expanded' : ''}`}>
          <div className="step-header sap-theme" onClick={() => toggleStep(3)}>
            <div className="step-indicator sap-theme">
              {isStepComplete(3) ? '✓' : '3'}
            </div>
            <div className="step-title-section sap-theme">
              <h3 className="step-title-cascade sap-theme">📦 Stock y Descripción</h3>
              <p className="step-description sap-theme">Stock inicial y detalles finales</p>
            </div>
            <div className="step-toggle sap-theme">
              {expandedStep === 3 ? '▲' : '▼'}
            </div>
          </div>

          {expandedStep === 3 && (
            <div className="step-content sap-theme">
              {renderStepContent(3)}
              
              <div className="step-actions sap-theme">
                <button
                  type="button"
                  onClick={() => setExpandedStep(2)}
                  className="btn-back sap-theme"
                >
                  ← Volver
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error de envío */}
        {errors.submit && <div className="error-message sap-theme">{errors.submit}</div>}

        {/* Botones finales */}
        <div className="wizard-actions-cascade sap-theme">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary sap-theme"
            disabled={loading}
          >
            Cancelar
          </button>

          <button 
            type="submit" 
            className="btn-primary sap-theme" 
            disabled={loading || !isStepComplete(1) || !isStepComplete(2) || !isStepComplete(3)}
          >
            {loading ? 'Creando...' : '✅ Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductWizard;
