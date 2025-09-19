/**
 * ProductModal - Modal para crear, editar y ver productos
 * Formulario completo con validaciones y preview
 * Refactorizado para usar BaseModal
 */

import React, { useState, useEffect } from 'react';
import BaseModal from '../shared/BaseModal';
import ModalHeader from '../shared/ModalHeader';
import ModalFooter from '../shared/ModalFooter';
import { PRODUCT_CATEGORIES } from '../../constants/productTypes';
import { PRODUCT_COLORS } from '../../constants/designTokens';
import {
  UI_ACTIONS,
  UI_FORM_LABELS,
  UI_MESSAGES,
  UI_PLACEHOLDERS,
  MODAL_TEXT,
  UI_TITLES,
} from '../../constants';

import { useFormData } from '../../hooks/useFormData';
import { useAutomaticPricing } from '../../hooks/useAutomaticPricing';
import { validators, validateForm as runValidation } from '../../utils/validators';
import './ProductPricing.css';

// Valores iniciales definidos fuera del componente para evitar recreación
const INITIAL_VALUES = {
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

const ProductModal = ({ isOpen, onClose, product, mode = 'create', onSave, userRole }) => {
  const [loading] = useState(false);

  // Hook para precios automáticos
  const {
    automaticPricing,
    priceLoading,
    priceError,
    lastPriceUpdate,
    syncPrice,
    canUseAutomatic,
    getFuelType,
    toggleAutomaticPricing,
    clearPriceError,
  } = useAutomaticPricing(product);

  // Validación centralizada: requeridos básicos y reglas numéricas comunes
  const validationSchema = {
    name: [validators.required],
    displayName: [validators.required],
    category: [validators.required],
    unit: [validators.required],
    defaultPrice: [validators.nonNegative],
    currentStock: [validators.nonNegative],
    minThreshold: [validators.nonNegative],
    maxCapacity: [validators.fuelCapacity],
  };

  const validate = (values) => runValidation(values, validationSchema);

  const {
    values: formData,
    setValues: setFormData,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
    validateForm,
  } = useFormData(INITIAL_VALUES, validate);
  // Colores predefinidos usando design tokens
  const colorOptions = PRODUCT_COLORS;

  // Opciones de unidades
  const unitOptions = [
    { value: 'gal', label: 'Galones' },
    { value: 'L', label: 'Litros' },
    { value: 'bbl', label: 'Barriles' },
    { value: 'kg', label: 'Kilogramos' },
    { value: 'ton', label: 'Toneladas' },
  ];

  // Iconos por categoría
  const iconOptions = {
    combustible: ['⛽', '🛢️', '🚗', '⚡'],
    lubricante: ['🛠️', '⚙️', '🔧', '🛡️'],
    aditivo: ['🧪', '⚗️', '💊', '🔬'],
    otros: ['📦', '🏷️', '🔧', '⚡'],
  };

  useEffect(() => {
    if (product && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: product.name || '',
        displayName: product.displayName || '',
        category: product.category || PRODUCT_CATEGORIES.COMBUSTIBLE,
        unit: product.unit || 'gal',
        defaultPrice: product.defaultPrice || 0,
        color:
          product.color ||
          PRODUCT_COLORS.getColorByCategory(product.category || PRODUCT_CATEGORIES.COMBUSTIBLE),
        icon: product.icon || '🛢️',
        description: product.description || '',
        isActive: product.isActive !== undefined ? product.isActive : true,
        currentStock: product.currentStock || 0,
        minThreshold: product.minThreshold || 10,
        maxCapacity: product.maxCapacity || 1000,
      });
    } else {
      // Reset form for create mode
      resetForm();
    }
  }, [product, mode, setFormData, resetForm]);

  // Función para sincronizar precio automáticamente
  const handleSyncPrice = async () => {
    const result = await syncPrice(formData);
    if (result.success) {
      setFormData((prev) => ({
        ...prev,
        defaultPrice: result.price,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !canEdit) return;

    try {
      await onSave(formData);
    } catch {
      setErrors({ submit: 'Error al guardar el producto' });
    }
  };

  const canEdit = ['admin', 'supervisor'].includes(userRole) && mode !== 'view';

  const getModalTitle = () => {
    if (mode === 'create') return `➕ ${MODAL_TEXT.PRODUCT.CREATE_TITLE}`;
    if (mode === 'edit') return `✏️ ${MODAL_TEXT.PRODUCT.EDIT_TITLE}`;
    return `👁️ ${MODAL_TEXT.PRODUCT.VIEW_TITLE}`;
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="lg" className="apple-modal">
      <ModalHeader title={getModalTitle()} onClose={onClose} icon="🛢️" />

      <div className="apple-modal-content">
        {/* Preview Card */}
        <div className="apple-card apple-card-compact product-preview">
          <div className="apple-card-header">
            <div className="preview-icon" style={{ color: formData.color }}>
              {formData.icon}
            </div>
            <div className="preview-info">
              <h3 className="apple-title-medium">{formData.displayName || UI_FORM_LABELS.DISPLAY_NAME}</h3>
              <p className="apple-body-small text-secondary preview-category">{formData.category}</p>
              <p className="apple-body-small text-secondary preview-description">{formData.description}</p>
              <div className="apple-badge apple-badge-primary preview-price">
                ${new Intl.NumberFormat('es-CO').format(formData.defaultPrice)} / {formData.unit}
              </div>
            </div>
          </div>
        </div>

        <div className="apple-form-content">
          {/* Información Básica */}
          <div className="apple-form-section">
            <h3 className="apple-form-section-title">📝 {UI_TITLES.BASIC_INFO}</h3>

            <div className="apple-form-group">
              <label className="apple-form-label required">{UI_FORM_LABELS.INTERNAL_NAME}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!canEdit}
                placeholder={UI_PLACEHOLDERS.INTERNAL_NAME}
                className="apple-form-input"
              />
              {errors.name && <div className="apple-form-error">{errors.name}</div>}
            </div>

            <div className="apple-form-group">
              <label className="apple-form-label required">{UI_FORM_LABELS.DISPLAY_NAME}</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                disabled={!canEdit}
                placeholder={UI_PLACEHOLDERS.DISPLAY_NAME}
                className="apple-form-input"
              />
              {errors.displayName && <div className="apple-form-error">{errors.displayName}</div>}
            </div>

            <div className="apple-form-group">
              <label className="apple-form-label required">{UI_FORM_LABELS.CATEGORY}</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={!canEdit}
                className="apple-form-select"
              >
                {Object.values(PRODUCT_CATEGORIES).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <div className="apple-form-error">{errors.category}</div>}
            </div>

            <div className="apple-form-group">
              <label className="apple-form-label">{UI_FORM_LABELS.DESCRIPTION}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!canEdit}
                placeholder={UI_PLACEHOLDERS.PRODUCT_DESCRIPTION}
                rows="3"
                className="apple-form-textarea"
              />
            </div>
          </div>

          {/* Configuración */}
          <div className="apple-form-section">
            <h3 className="apple-form-section-title">⚙️ {UI_TITLES.SETTINGS}</h3>

            <div className="apple-form-group">
              <label className="apple-form-label required">{UI_FORM_LABELS.UNIT_OF_MEASUREMENT}</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                disabled={!canEdit}
                className="apple-form-select"
              >
                {unitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.unit && <div className="apple-form-error">{errors.unit}</div>}
            </div>

            {/* Control de precios automáticos */}
            {canUseAutomatic(formData) && (
              <div className="apple-card apple-card-compact automatic-pricing-section">
                <div className="apple-form-group">
                  <div className="apple-form-checkbox">
                    <input
                      type="checkbox"
                      checked={automaticPricing}
                      onChange={(e) => toggleAutomaticPricing(e.target.checked)}
                      disabled={!canEdit}
                    />
                    <label className="apple-form-checkbox-label">
                      🔄 Sincronización automática de precios
                    </label>
                  </div>
                  <div className="apple-form-help">
                    Actualiza automáticamente desde la API del gobierno colombiano
                  </div>
                </div>

                {automaticPricing && (
                  <div className="automatic-pricing-info">
                    <div className="pricing-status">
                      <span className="apple-badge apple-badge-success">🇨🇴</span>
                      <span className="apple-body-small">
                        Disponible para {getFuelType(formData)}
                      </span>
                      {lastPriceUpdate && (
                        <span className="apple-body-small text-secondary">
                          Última actualización: {new Date(lastPriceUpdate).toLocaleString('es-CO')}
                        </span>
                      )}
                    </div>
                    {priceError && (
                      <div className="apple-form-error">
                        <span>⚠️</span>
                        <span>{priceError}</span>
                        <button
                          type="button"
                          onClick={clearPriceError}
                          className="apple-button apple-button-tertiary apple-button-small"
                          disabled={!canEdit}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="apple-form-group">
              <div className="price-input-header">
                <label className="apple-form-label">{UI_FORM_LABELS.DEFAULT_PRICE}</label>
                {automaticPricing && canUseAutomatic(formData) && canEdit && (
                  <button
                    type="button"
                    className="apple-button apple-button-tertiary apple-button-small"
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
                disabled={!canEdit || priceLoading}
                min="0"
                step="0.01"
                className="apple-form-input"
              />
              {errors.defaultPrice && (
                <div className="apple-form-error">{errors.defaultPrice}</div>
              )}
              {priceLoading && (
                <div className="apple-loading-state">
                  <span className="apple-loading-spinner"></span>
                  <span className="apple-loading-text">Obteniendo precio actualizado...</span>
                </div>
              )}
            </div>

            <div className="apple-form-group">
              <div className="apple-form-checkbox">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  disabled={!canEdit}
                />
                <label className="apple-form-checkbox-label">
                  {UI_FORM_LABELS.IS_ACTIVE}
                </label>
              </div>
            </div>
          </div>

          {/* Stock y Umbrales */}
          <div className="apple-form-section">
            <h3 className="apple-form-section-title">📊 {UI_TITLES.STOCK_AND_THRESHOLDS}</h3>

            <div className="apple-form-group">
              <label className="apple-form-label">{UI_FORM_LABELS.CURRENT_STOCK}</label>
              <input
                type="number"
                name="currentStock"
                value={formData.currentStock}
                onChange={handleInputChange}
                disabled={!canEdit}
                min="0"
                step="0.01"
                className="apple-form-input"
              />
              {errors.currentStock && (
                <div className="apple-form-error">{errors.currentStock}</div>
              )}
            </div>

            <div className="apple-form-group">
              <label className="apple-form-label">{UI_FORM_LABELS.MIN_THRESHOLD}</label>
              <input
                type="number"
                name="minThreshold"
                value={formData.minThreshold}
                onChange={handleInputChange}
                disabled={!canEdit}
                min="0"
                step="0.01"
                className="apple-form-input"
              />
              {errors.minThreshold && (
                <div className="apple-form-error">{errors.minThreshold}</div>
              )}
            </div>

            <div className="apple-form-group">
              <label className="apple-form-label">{UI_FORM_LABELS.MAX_CAPACITY}</label>
              <input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleInputChange}
                disabled={!canEdit}
                min="1"
                step="0.01"
                className="apple-form-input"
              />
              {errors.maxCapacity && <div className="apple-form-error">{errors.maxCapacity}</div>}
            </div>
          </div>

          {/* Apariencia */}
          <div className="apple-form-section">
            <h3 className="apple-form-section-title">🎨 {UI_FORM_LABELS.APPEARANCE}</h3>

            <div className="apple-form-group">
              <label className="apple-form-label">{UI_FORM_LABELS.ICON}</label>
              <div className="icon-selector">
                {iconOptions[formData.category]?.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`apple-button apple-button-icon ${formData.icon === icon ? 'apple-button-primary' : 'apple-button-secondary'}`}
                    onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                    disabled={!canEdit}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="apple-form-group">
              <label className="apple-form-label">{UI_FORM_LABELS.COLOR}</label>
              <div className="color-selector">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`apple-button apple-button-icon color-option ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                    disabled={!canEdit}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {errors.submit && <div className="apple-form-error">{errors.submit}</div>}
      </div>

      <ModalFooter
        primaryAction={
          canEdit
            ? {
                label: loading ? UI_MESSAGES.LOADING.SAVING : UI_ACTIONS.SAVE,
                onClick: handleSubmit,
                disabled: loading,
                type: 'submit',
              }
            : null
        }
        secondaryAction={{
          label: mode === 'view' ? UI_ACTIONS.CLOSE : UI_ACTIONS.CANCEL,
          onClick: onClose,
        }}
        isLoading={loading}
      />
    </BaseModal>
  );
};

export default ProductModal;
