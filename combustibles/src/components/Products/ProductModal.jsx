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
  UI_TITLES 
} from '../../constants';

import { useFormData } from '../../hooks/useFormData';
import { validators, validateForm as runValidation } from '../../utils/validators';
const ProductModal = ({ 
  isOpen, 
  onClose, 
  product, 
  mode = 'create',
  onSave,
  userRole 
}) => {
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
    maxCapacity: 1000
  };
  const [loading] = useState(false);

  // Validación centralizada: requeridos básicos y reglas numéricas comunes
  const validationSchema = {
    name: [validators.required],
    displayName: [validators.required],
    category: [validators.required],
    unit: [validators.required],
    defaultPrice: [validators.nonNegative],
    currentStock: [validators.nonNegative],
    minThreshold: [validators.nonNegative],
    maxCapacity: [validators.fuelCapacity]
  };

  const validate = (values) => runValidation(values, validationSchema);

  const {
    values: formData,
    setValues: setFormData,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
    validateForm
  } = useFormData(initialValues, validate);
  // Colores predefinidos usando design tokens
  const colorOptions = PRODUCT_COLORS.DEFAULT_PALETTE;
  
  // Opciones de unidades
  const unitOptions = [
    { value: 'gal', label: 'Galones' },
    { value: 'L', label: 'Litros' },
    { value: 'bbl', label: 'Barriles' },
    { value: 'kg', label: 'Kilogramos' },
    { value: 'ton', label: 'Toneladas' }
  ];
  
  // Iconos por categoría
  const iconOptions = {
    combustible: ['⛽', '🛢️', '🚗', '⚡'],
    lubricante: ['🛠️', '⚙️', '🔧', '🛡️'],
    aditivo: ['🧪', '⚗️', '💊', '🔬'],
    otros: ['📦', '🏷️', '🔧', '⚡']
  };

  useEffect(() => {
    if (product && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: product.name || '',
        displayName: product.displayName || '',
        category: product.category || PRODUCT_CATEGORIES.COMBUSTIBLE,
        unit: product.unit || 'gal',
        defaultPrice: product.defaultPrice || 0,
        color: product.color || PRODUCT_COLORS.getColorByCategory(product.category || PRODUCT_CATEGORIES.COMBUSTIBLE),
        icon: product.icon || '🛢️',
        description: product.description || '',
        isActive: product.isActive !== undefined ? product.isActive : true,
        currentStock: product.currentStock || 0,
        minThreshold: product.minThreshold || 10,
        maxCapacity: product.maxCapacity || 1000
      });
    } else {
      // Reset form for create mode
      resetForm();
    }
  }, [product, mode, setFormData, resetForm]);

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
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
      className="product-modal"
    >
      <ModalHeader 
        title={getModalTitle()}
        onClose={onClose}
        icon="🛢️"
      />

      <div className="modal-body">
          {/* Preview Card */}
          <div className="product-preview">
            <div className="preview-card">
              <div className="preview-icon" style={{ color: formData.color }}>
                {formData.icon}
              </div>
              <div className="preview-info">
                <h3>{formData.displayName || UI_FORM_LABELS.DISPLAY_NAME}</h3>
                <p className="preview-category">{formData.category}</p>
                <p className="preview-description">{formData.description}</p>
                <div className="preview-price">
                  ${new Intl.NumberFormat('es-CO').format(formData.defaultPrice)} / {formData.unit}
                </div>
              </div>
            </div>
          </div>

          <div className="form-grid">
            {/* Información Básica */}
            <div className="form-section">
              <h3>📝 {UI_TITLES.BASIC_INFO}</h3>
              
              <div className="form-group">
                <label>{UI_FORM_LABELS.INTERNAL_NAME} *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!canEdit}
                  placeholder={UI_PLACEHOLDERS.INTERNAL_NAME}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>{UI_FORM_LABELS.DISPLAY_NAME} *</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  disabled={!canEdit}
                  placeholder={UI_PLACEHOLDERS.DISPLAY_NAME}
                />
                {errors.displayName && <span className="error">{errors.displayName}</span>}
              </div>

              <div className="form-group">
                <label>{UI_FORM_LABELS.CATEGORY} *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={!canEdit}
                >
                  {Object.values(PRODUCT_CATEGORIES).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <span className="error">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label>{UI_FORM_LABELS.DESCRIPTION}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!canEdit}
                  placeholder={UI_PLACEHOLDERS.PRODUCT_DESCRIPTION}
                  rows="3"
                />
              </div>
            </div>

            {/* Configuración */}
            <div className="form-section">
              <h3>⚙️ {UI_TITLES.SETTINGS}</h3>
              
              <div className="form-group">
                <label>{UI_FORM_LABELS.UNIT_OF_MEASUREMENT} *</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  disabled={!canEdit}
                >
                  {unitOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.unit && <span className="error">{errors.unit}</span>}
              </div>

              <div className="form-group">
                <label>{UI_FORM_LABELS.DEFAULT_PRICE}</label>
                <input
                  type="number"
                  name="defaultPrice"
                  value={formData.defaultPrice}
                  onChange={handleInputChange}
                  disabled={!canEdit}
                  min="0"
                  step="0.01"
                />
                {errors.defaultPrice && <span className="error">{errors.defaultPrice}</span>}
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                  />
                  {UI_FORM_LABELS.IS_ACTIVE}
                </label>
              </div>
            </div>

            {/* Stock y Umbrales */}
            <div className="form-section">
              <h3>📊 {UI_TITLES.STOCK_AND_THRESHOLDS}</h3>
              
              <div className="form-group">
                <label>{UI_FORM_LABELS.CURRENT_STOCK}</label>
                <input
                  type="number"
                  name="currentStock"
                  value={formData.currentStock}
                  onChange={handleInputChange}
                  disabled={!canEdit}
                  min="0"
                  step="0.01"
                />
                {errors.currentStock && <span className="error">{errors.currentStock}</span>}
              </div>

              <div className="form-group">
                <label>{UI_FORM_LABELS.MIN_THRESHOLD}</label>
                <input
                  type="number"
                  name="minThreshold"
                  value={formData.minThreshold}
                  onChange={handleInputChange}
                  disabled={!canEdit}
                  min="0"
                  step="0.01"
                />
                {errors.minThreshold && <span className="error">{errors.minThreshold}</span>}
              </div>

              <div className="form-group">
                <label>{UI_FORM_LABELS.MAX_CAPACITY}</label>
                <input
                  type="number"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleInputChange}
                  disabled={!canEdit}
                  min="1"
                  step="0.01"
                />
                {errors.maxCapacity && <span className="error">{errors.maxCapacity}</span>}
              </div>
            </div>

            {/* Apariencia */}
            <div className="form-section">
              <h3>🎨 {UI_FORM_LABELS.APPEARANCE}</h3>
              
              <div className="form-group">
                <label>{UI_FORM_LABELS.ICON}</label>
                <div className="icon-selector">
                  {iconOptions[formData.category]?.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      disabled={!canEdit}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>{UI_FORM_LABELS.COLOR}</label>
                <div className="color-selector">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${formData.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      disabled={!canEdit}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="error-message">
              {errors.submit}
            </div>
          )}
        </div>

        <ModalFooter 
          primaryAction={canEdit ? {
            label: loading ? UI_MESSAGES.LOADING.SAVING : UI_ACTIONS.SAVE,
            onClick: handleSubmit,
            disabled: loading,
            type: 'submit'
          } : null}
          secondaryAction={{
            label: mode === 'view' ? UI_ACTIONS.CLOSE : UI_ACTIONS.CANCEL,
            onClick: onClose
          }}
          isLoading={loading}
        />
    </BaseModal>
  );
};

export default ProductModal;