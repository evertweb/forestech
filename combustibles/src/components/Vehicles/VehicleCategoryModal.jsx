/**
 * VehicleCategoryModal - Modal para crear y editar categorías de vehículos
 * Basado en el patrón de modales existentes con mejores dimensiones y CSS
 */

import React, { useState, useEffect } from 'react';
import {
  createCategory,
  updateCategory,
  getAllVehicleCategories,
  deleteCategory,
} from '../../services/FirebaseVehicleCategoriesService';
import {
  AVAILABLE_FIELDS,
  FUEL_TYPES,
  generateCategoryId,
  validateCategory,
} from '../../data/vehicleCategories';
import './VehicleCategoryModal.css';

const VehicleCategoryModal = ({ isOpen, onClose, category = null, onSuccess }) => {
  // Debug inmediato de props
  console.log('🎭 VehicleCategoryModal PROPS RECIBIDAS:', {
    isOpen,
    isOpenType: typeof isOpen,
    isOpenValue: isOpen,
    category,
    hasOnClose: typeof onClose === 'function',
    hasOnSuccess: typeof onSuccess === 'function',
    timestamp: new Date().toISOString(),
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [existingCategories, setExistingCategories] = useState([]);
  const [errors, setErrors] = useState({});

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🚗',
    color: '#3b82f6',
    fuelTypes: [FUEL_TYPES.DIESEL],
    fields: [],
    uniqueCode: '',
  });

  const totalSteps = 4;

  // Configuración de pasos
  const FORM_STEPS = {
    1: { title: '🏷️ Información Básica', description: 'Nombre y descripción de la categoría' },
    2: { title: '⛽ Tipos de Combustible', description: 'Combustibles compatibles' },
    3: { title: '📋 Campos Personalizados', description: 'Campos opcionales para vehículos' },
    4: { title: '🎨 Personalización Visual', description: 'Ícono y color de la categoría' },
  };

  // Inicializar datos si es edición
  useEffect(() => {
    if (category && isOpen) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '🚗',
        color: category.color || '#3b82f6',
        fuelTypes: category.fuelTypes || [FUEL_TYPES.DIESEL],
        fields: category.fields || [],
        uniqueCode: category.uniqueCode || '',
      });
    } else if (isOpen) {
      // Reset para nueva categoría
      setFormData({
        name: '',
        description: '',
        icon: '🚗',
        color: '#3b82f6',
        fuelTypes: [FUEL_TYPES.DIESEL],
        fields: [],
        uniqueCode: '',
      });
      setCurrentStep(1);
      setErrors({});
    }
  }, [category, isOpen]);

  // Cargar categorías existentes
  useEffect(() => {
    if (isOpen) {
      loadExistingCategories();
    }
  }, [isOpen]);

  const loadExistingCategories = async () => {
    try {
      const categories = await getAllVehicleCategories();
      setExistingCategories(categories);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  // Manejar cambio de nombre (auto-generar código)
  const handleNameChange = (name) => {
    const uniqueCode = generateCategoryId(name, existingCategories);
    setFormData((prev) => ({ ...prev, name, uniqueCode }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
  };

  // Manejar toggle de tipos de combustible
  const handleFuelTypeToggle = (fuelType) => {
    setFormData((prev) => ({
      ...prev,
      fuelTypes: prev.fuelTypes.includes(fuelType)
        ? prev.fuelTypes.filter((f) => f !== fuelType)
        : [...prev.fuelTypes, fuelType],
    }));
    if (errors.fuelTypes) setErrors((prev) => ({ ...prev, fuelTypes: '' }));
  };

  // Manejar toggle de campos
  const handleFieldToggle = (fieldKey) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.includes(fieldKey)
        ? prev.fields.filter((f) => f !== fieldKey)
        : [...prev.fields, fieldKey],
    }));
  };

  // Navegación entre pasos
  const handleNextStep = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Validación por paso
  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.name.trim().length >= 2;
      case 2:
        return formData.fuelTypes.length > 0;
      case 3:
        return true; // Campos opcionales
      case 4:
        return formData.uniqueCode.trim().length >= 3;
      default:
        return false;
    }
  };

  // Validar formulario completo
  const validateForm = () => {
    const validation = validateCategory(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  // Manejar envío
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (category) {
        await updateCategory(category.id, formData);
      } else {
        await createCategory(formData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error guardando categoría:', error);
      setErrors({ submit: error.message || 'Error al guardar la categoría' });
    } finally {
      setLoading(false);
    }
  };

  // Manejar eliminación
  const handleDelete = async () => {
    if (!category) return;

    const confirmed = window.confirm(
      `¿Está seguro de eliminar la categoría "${category.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteCategory(category.id);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      setErrors({ submit: error.message || 'Error al eliminar la categoría' });
    } finally {
      setDeleting(false);
    }
  };

  // Manejar clic en continuar/guardar
  const handleContinueClick = (e) => {
    e.preventDefault();

    if (currentStep === totalSteps) {
      handleSubmit(e);
    } else {
      handleNextStep();
    }
  };

  // Renderizar paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="form-group">
              <label className="form-label">Nombre de la Categoría *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Maquinaria Pesada, Vehículos Livianos..."
                className={`form-input ${errors.name ? 'error' : ''}`}
                autoFocus
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
              {formData.name && (
                <div className="auto-generated">
                  <small>
                    Código generado: <code>{formData.uniqueCode}</code>
                  </small>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción opcional de la categoría..."
                className="form-textarea"
                rows="3"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="fuel-options-grid">
              {Object.values(FUEL_TYPES).map((fuelType) => (
                <label key={fuelType} className="fuel-option-card">
                  <input
                    type="checkbox"
                    checked={formData.fuelTypes.includes(fuelType)}
                    onChange={() => handleFuelTypeToggle(fuelType)}
                    className="fuel-checkbox"
                  />
                  <div className="fuel-card-content">
                    <span className="fuel-icon">
                      {fuelType === 'DIESEL' && '🛢️'}
                      {fuelType === 'GASOLINE' && '⛽'}
                      {fuelType === 'MIXED' && '🔄'}
                    </span>
                    <span className="fuel-name">{fuelType}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.fuelTypes && <div className="error-message">{errors.fuelTypes}</div>}
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="fields-grid">
              {AVAILABLE_FIELDS.map((field) => (
                <label key={field.key} className="field-option-card">
                  <input
                    type="checkbox"
                    checked={formData.fields.includes(field.key)}
                    onChange={() => handleFieldToggle(field.key)}
                    className="field-checkbox"
                  />
                  <div className="field-card-content">
                    <span className="field-icon">{field.icon}</span>
                    <div className="field-details">
                      <span className="field-label">{field.label}</span>
                      <small className="field-description">{field.description}</small>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="visual-customization">
              <div className="form-group">
                <label className="form-label">Ícono</label>
                <div className="icon-picker">
                  {['🚗', '🚛', '🚜', '🏍️', '🚙', '🚌', '🚚', '🏗️'].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                      onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <div className="color-picker">
                  {[
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#06b6d4',
                    '#84cc16',
                    '#f97316',
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${formData.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData((prev) => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>

              {/* Vista previa */}
              <div className="preview-section">
                <label className="form-label">Vista Previa</label>
                <div className="category-preview" style={{ borderColor: formData.color }}>
                  <div className="preview-header" style={{ backgroundColor: formData.color }}>
                    <span className="preview-icon">{formData.icon}</span>
                    <span className="preview-name">{formData.name || 'Nombre de Categoría'}</span>
                  </div>
                  <div className="preview-content">
                    <p className="preview-description">
                      {formData.description || 'Descripción de la categoría'}
                    </p>
                    <div className="preview-fuels">
                      <strong>Combustibles:</strong> {formData.fuelTypes.join(', ')}
                    </div>
                    {formData.fields.length > 0 && (
                      <div className="preview-fields">
                        <strong>Campos:</strong> {formData.fields.length} personalizados
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) {
    console.log('🚫 VehicleCategoryModal: isOpen es false, no renderizando');
    return null;
  }

  console.log('✅ VehicleCategoryModal: Renderizando modal');

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="category-modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <h2>{category ? '✏️ Editar Categoría' : '➕ Nueva Categoría de Vehículos'}</h2>
            <div className="step-indicator">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i + 1} className={`step-dot ${i + 1 <= currentStep ? 'active' : ''}`} />
              ))}
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {errors.submit && <div className="error-banner">⚠️ {errors.submit}</div>}

          <div className="step-header">
            <div className="step-number">{currentStep}</div>
            <div className="step-info">
              <h3>{FORM_STEPS[currentStep].title}</h3>
              <p>{FORM_STEPS[currentStep].description}</p>
            </div>
          </div>

          <form onSubmit={handleContinueClick}>{renderStep()}</form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-actions">
            <div className="footer-left">
              {category && (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={handleDelete}
                  disabled={deleting || loading}
                >
                  {deleting ? (
                    <>
                      <span className="spinner-small"></span>
                      Eliminando...
                    </>
                  ) : (
                    <>🗑️ Eliminar</>
                  )}
                </button>
              )}
            </div>

            <div className="footer-right">
              <button
                type="button"
                className="btn-secondary"
                onClick={currentStep === 1 ? onClose : handlePrevStep}
                disabled={deleting}
              >
                {currentStep === 1 ? 'Cancelar' : 'Anterior'}
              </button>

              <button
                type="button"
                className={`btn-primary ${!isStepValid(currentStep) ? 'disabled' : ''}`}
                onClick={handleContinueClick}
                disabled={!isStepValid(currentStep) || loading || deleting}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Guardando...
                  </>
                ) : currentStep === totalSteps ? (
                  'Guardar Categoría'
                ) : (
                  'Continuar'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCategoryModal;
