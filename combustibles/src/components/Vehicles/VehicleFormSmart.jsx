// VehicleFormSmart.jsx - Formulario Progresivo Inteligente
import React, { useState, useCallback, useEffect } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { renderCategoryIcon, isCustomIcon } from '../../services/iconUploadService';
import './VehicleFormSmart.css';

const VehicleFormSmart = ({ isOpen, onClose, onSuccess, vehicle = null }) => {
  // Estados del formulario progresivo
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    plateCode: '',
    fuelType: '',
    hasHorometer: false,
    tankCapacity: '',
    description: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState('basic'); // basic, details, advanced
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado local para categorías de vehículos
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const { 
    createVehicle,
    updateVehicle, 
    subscribeToVehicleCategories,
    loading 
  } = useCombustibles();

  // Suscribirse a categorías al montar
  useEffect(() => {
    if (isOpen) {
      setCategoriesLoading(true);
      const unsubscribe = subscribeToVehicleCategories((categories) => {
        setVehicleCategories(categories || []);
        setCategoriesLoading(false);
      });
      return unsubscribe;
    }
  }, [isOpen, subscribeToVehicleCategories]);

  // Cargar datos del vehículo en modo edición
  useEffect(() => {
    if (isOpen && vehicle) {
      setFormData({
        name: vehicle.name || '',
        categoryId: vehicle.categoryId || '',
        plateCode: vehicle.plateCode || '',
        fuelType: vehicle.fuelType || '',
        hasHorometer: vehicle.hasHorometer || false,
        tankCapacity: vehicle.tankCapacity ? vehicle.tankCapacity.toString() : '',
        description: vehicle.description || '',
        notes: vehicle.notes || ''
      });
      // Si hay datos, avanzar al paso de detalles
      if (vehicle.categoryId) {
        setCurrentStep('details');
      }
    }
  }, [isOpen, vehicle]);

  // Validación en tiempo real
  const validateField = useCallback((field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'El nombre es obligatorio';
        } else if (value.length < 2) {
          newErrors.name = 'Mínimo 2 caracteres';
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'categoryId':
        if (!value) {
          newErrors.categoryId = 'Selecciona una categoría';
        } else {
          delete newErrors.categoryId;
        }
        break;
        
      case 'plateCode':
        if (!value.trim()) {
          newErrors.plateCode = 'La placa/código es obligatorio';
        } else {
          delete newErrors.plateCode;
        }
        break;
        
      case 'fuelType':
        if (!value) {
          newErrors.fuelType = 'Selecciona el tipo de combustible';
        } else {
          delete newErrors.fuelType;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [errors]);

  // Manejar cambios en campos
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
    
    // Lógica progresiva: mostrar siguiente paso automáticamente
    if (field === 'categoryId' && value && currentStep === 'basic') {
      setTimeout(() => setCurrentStep('details'), 300);
    }
  }, [validateField, currentStep]);

  // Obtener información de la categoría seleccionada (con verificación de seguridad)
  const selectedCategory = vehicleCategories?.find(cat => cat.id === formData.categoryId);

  // Verificar si se puede continuar al siguiente paso
  const canProceedToDetails = formData.name.trim() && formData.categoryId && formData.plateCode.trim();
  const canProceedToAdvanced = canProceedToDetails && formData.fuelType;

  // Resetear formulario
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      categoryId: '',
      plateCode: '',
      fuelType: '',
      hasHorometer: false,
      tankCapacity: '',
      description: '',
      notes: ''
    });
    setCurrentStep('basic');
    setShowAdvanced(false);
    setErrors({});
  }, []);

  // Enviar formulario
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    const requiredFields = ['name', 'categoryId', 'plateCode', 'fuelType'];
    let hasErrors = false;
    
    requiredFields.forEach(field => {
      if (!validateField(field, formData[field])) {
        hasErrors = true;
      }
    });
    
    if (hasErrors) return;
    
    setIsSubmitting(true);
    
    try {
      const vehicleData = {
        ...formData,
        categoryName: selectedCategory?.name || '',
        categoryIcon: selectedCategory?.icon || '🚗',
        tankCapacity: formData.tankCapacity ? parseFloat(formData.tankCapacity) : null,
        updatedAt: new Date()
      };

      // Si es edición, mantener datos existentes
      if (vehicle) {
        vehicleData.id = vehicle.id;
        vehicleData.createdAt = vehicle.createdAt;
      } else {
        vehicleData.createdAt = new Date();
      }
      
      const result = vehicle 
        ? await updateVehicle(vehicle.id, vehicleData)
        : await createVehicle(vehicleData);
      
      if (result.success) {
        onSuccess?.(result.data);
        resetForm();
        onClose();
      } else {
        setErrors({ submit: result.error || `Error al ${vehicle ? 'actualizar' : 'crear'} el vehículo` });
      }
    } catch (err) {
      console.error('Error al enviar formulario:', err);
      setErrors({ submit: `Error inesperado al ${vehicle ? 'actualizar' : 'crear'} el vehículo` });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedCategory, createVehicle, updateVehicle, onSuccess, onClose, validateField, vehicle, resetForm]);

  // Cerrar modal
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="smart-modal-overlay" onClick={handleClose}>
      <div className="smart-modal-container" onClick={e => e.stopPropagation()}>
        {/* Header simplificado */}
        <div className="smart-modal-header">
          <h2>{vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h2>
          <button 
            type="button" 
            className="smart-btn-close"
            onClick={handleClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Indicador de progreso */}
        <div className="progress-indicator">
          <div className={`progress-step ${currentStep !== 'basic' ? 'completed' : 'active'}`}>
            <span className="step-number">1</span>
            <span className="step-label">Básico</span>
          </div>
          <div className={`progress-line ${currentStep === 'advanced' || showAdvanced ? 'completed' : ''}`}></div>
          <div className={`progress-step ${currentStep === 'details' || showAdvanced ? 'completed' : currentStep === 'details' ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Detalles</span>
          </div>
          <div className={`progress-line ${showAdvanced ? 'completed' : ''}`}></div>
          <div className={`progress-step ${showAdvanced ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Adicional</span>
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="smart-modal-body">
          {errors.submit && (
            <div className="error-banner">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="smart-form">
            {/* PASO 1: INFORMACIÓN BÁSICA */}
            <div className="form-section">
              <div className="smart-form-row">
                <div className="smart-form-group">
                  <label className="smart-form-label">
                    Nombre del Vehículo *
                  </label>
                  <input
                    type="text"
                    className={`smart-form-input ${errors.name ? 'error' : ''}`}
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="Ej: Tractor Principal"
                    autoFocus
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="smart-form-group">
                  <label className="smart-form-label">
                    Placa/Código *
                  </label>
                  <input
                    type="text"
                    className={`smart-form-input ${errors.plateCode ? 'error' : ''}`}
                    value={formData.plateCode}
                    onChange={(e) => handleFieldChange('plateCode', e.target.value.toUpperCase())}
                    placeholder="ABC123"
                  />
                  {errors.plateCode && <span className="field-error">{errors.plateCode}</span>}
                </div>
              </div>

              <div className="smart-form-group">
                <label className="smart-form-label">
                  Categoría *
                </label>
                {categoriesLoading ? (
                  <div className="loading-categories">
                    <div className="spinner"></div>
                    <span>Cargando categorías...</span>
                  </div>
                ) : (
                  <div className="custom-select-wrapper">
                    <select
                      className={`smart-form-input ${errors.categoryId ? 'error' : ''}`}
                      value={formData.categoryId}
                      onChange={(e) => handleFieldChange('categoryId', e.target.value)}
                    >
                      <option value="">Selecciona una categoría</option>
                      {vehicleCategories?.map(category => (
                        <option key={category.id} value={category.id}>
                          {isCustomIcon(category.icon) ? '🖼️  ' : category.icon + ' '}{category.name}
                        </option>
                      )) || []}
                    </select>
                  </div>
                )}
                {errors.categoryId && <span className="field-error">{errors.categoryId}</span>}
              </div>
            </div>

            {/* PASO 2: DETALLES OPERATIVOS (aparece cuando se selecciona categoría) */}
            {(currentStep === 'details' || showAdvanced) && canProceedToDetails && (
              <div className="form-section fade-in">
                <h3>Detalles Operativos</h3>
                
                <div className="smart-form-row">
                  <div className="smart-form-group">
                    <label className="smart-form-label">
                      Tipo de Combustible *
                    </label>
                    <select
                      className={`smart-form-input ${errors.fuelType ? 'error' : ''}`}
                      value={formData.fuelType}
                      onChange={(e) => handleFieldChange('fuelType', e.target.value)}
                    >
                      <option value="">Selecciona combustible</option>
                      <option value="diesel">🛢️ Diésel</option>
                      <option value="gasoline">⛽ Gasolina</option>
                      <option value="acpm">🚛 ACPM</option>
                      <option value="electric">⚡ Eléctrico</option>
                    </select>
                    {errors.fuelType && <span className="field-error">{errors.fuelType}</span>}
                  </div>

                  <div className="smart-form-group">
                    <label className="smart-form-label">
                      Capacidad del Tanque (Galones)
                    </label>
                    <input
                      type="number"
                      className="smart-form-input"
                      value={formData.tankCapacity}
                      onChange={(e) => handleFieldChange('tankCapacity', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="smart-form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.hasHorometer}
                      onChange={(e) => handleFieldChange('hasHorometer', e.target.checked)}
                    />
                    <span>Este vehículo tiene horómetro</span>
                  </label>
                </div>

                {/* Botón para mostrar campos avanzados */}
                {canProceedToAdvanced && !showAdvanced && (
                  <div className="advanced-toggle">
                    <button
                      type="button"
                      className="btn-show-advanced"
                      onClick={() => setShowAdvanced(true)}
                    >
                      ➕ Agregar información adicional (opcional)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* PASO 3: INFORMACIÓN ADICIONAL (opcional) */}
            {showAdvanced && (
              <div className="form-section fade-in">
                <h3>Información Adicional</h3>
                
                <div className="smart-form-group">
                  <label className="smart-form-label">
                    Descripción
                  </label>
                  <textarea
                    className="smart-form-input"
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="Características adicionales del vehículo..."
                    rows="3"
                  />
                </div>

                <div className="smart-form-group">
                  <label className="smart-form-label">
                    Notas Especiales
                  </label>
                  <textarea
                    className="smart-form-input"
                    value={formData.notes}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    placeholder="Observaciones, mantenimiento especial, etc..."
                    rows="2"
                  />
                </div>

                <button
                  type="button"
                  className="btn-hide-advanced"
                  onClick={() => setShowAdvanced(false)}
                >
                  ➖ Ocultar información adicional
                </button>
              </div>
            )}

            {/* Acciones del formulario */}
            <div className="smart-form-actions">
              <button
                type="button"
                className="smart-btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="smart-btn-primary"
                disabled={!canProceedToAdvanced || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner small"></div>
                    {vehicle ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  vehicle ? 'Actualizar Vehículo' : 'Crear Vehículo'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleFormSmart;
