// VehicleFormSmart-SAP.jsx - SAP Fiori Corporate Theme
import React, { useState, useCallback, useEffect } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { renderCategoryIcon, isCustomIcon } from '../../services/iconUploadService';
import './VehicleFormSmart-SAP.css';

const VehicleFormSmartSAP = ({ isOpen, onClose, onSuccess, vehicle = null }) => {
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
      setTimeout(() => setCurrentStep('details'), 200);
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

  // Mapeo de step status
  const getStepStatus = (step) => {
    if (step === 'basic') {
      return currentStep === 'basic' ? 'active' : 'completed';
    }
    if (step === 'details') {
      if (currentStep === 'basic') return 'inactive';
      return currentStep === 'details' ? 'active' : 'completed';
    }
    if (step === 'advanced') {
      return showAdvanced ? 'active' : 'inactive';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="smart-modal-overlay sap-theme" onClick={handleClose}>
      <div className="smart-modal-container sap-theme" onClick={e => e.stopPropagation()}>
        {/* Loading overlay */}
        {(isSubmitting || loading) && (
          <div className="loading-overlay sap-theme">
            <div className="loading-spinner sap-theme"></div>
            <div className="loading-text sap-theme">
              {isSubmitting ? 'Procesando...' : 'Cargando...'}
            </div>
          </div>
        )}

        {/* Header SAP */}
        <div className="smart-modal-header sap-theme">
          <h2>{vehicle ? 'Editar Vehículo' : 'Crear Nuevo Vehículo'}</h2>
          <button 
            type="button" 
            className="close-button"
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Indicador de progreso SAP */}
        <div className="progress-indicator sap-theme">
          <div className={`progress-step sap-theme ${getStepStatus('basic')}`}>
            Información Básica
          </div>
          <div className={`progress-step sap-theme ${getStepStatus('details')}`}>
            Detalles Operativos
          </div>
          <div className={`progress-step sap-theme ${getStepStatus('advanced')}`}>
            Información Adicional
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="smart-modal-content sap-theme">
          {errors.submit && (
            <div className="error-banner sap-theme">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* PASO 1: INFORMACIÓN BÁSICA */}
            <div className="form-section sap-theme">
              <div className="section-title sap-theme">
                Información Básica
              </div>
              
              <div className="form-row sap-theme">
                <div className="form-group sap-theme">
                  <label className="form-label sap-theme required">
                    Nombre del Vehículo
                  </label>
                  <input
                    type="text"
                    className={`form-input sap-theme ${errors.name ? 'error' : ''}`}
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="Ingrese el nombre del vehículo"
                    autoFocus
                  />
                  {errors.name && <div className="error-message sap-theme">{errors.name}</div>}
                </div>

                <div className="form-group sap-theme">
                  <label className="form-label sap-theme required">
                    Placa o Código
                  </label>
                  <input
                    type="text"
                    className={`form-input sap-theme ${errors.plateCode ? 'error' : ''}`}
                    value={formData.plateCode}
                    onChange={(e) => handleFieldChange('plateCode', e.target.value.toUpperCase())}
                    placeholder="ABC123"
                  />
                  {errors.plateCode && <div className="error-message sap-theme">{errors.plateCode}</div>}
                </div>
              </div>

              <div className="form-group sap-theme">
                <label className="form-label sap-theme required">
                  Categoría del Vehículo
                </label>
                {categoriesLoading ? (
                  <div className="loading-spinner sap-theme" style={{ margin: '1rem 0' }}></div>
                ) : (
                  <select
                    className={`form-select sap-theme ${errors.categoryId ? 'error' : ''}`}
                    value={formData.categoryId}
                    onChange={(e) => handleFieldChange('categoryId', e.target.value)}
                  >
                    <option value="">Seleccione una categoría</option>
                    {vehicleCategories?.map(category => (
                      <option key={category.id} value={category.id}>
                        {isCustomIcon(category.icon) ? '🖼️  ' : category.icon + ' '}{category.name}
                      </option>
                    )) || []}
                  </select>
                )}
                {errors.categoryId && <div className="error-message sap-theme">{errors.categoryId}</div>}
              </div>
            </div>

            {/* PASO 2: DETALLES OPERATIVOS */}
            {(currentStep === 'details' || showAdvanced) && canProceedToDetails && (
              <div className="form-section sap-theme fade-in sap-theme">
                <div className="section-title sap-theme">
                  Detalles Operativos
                </div>
                
                <div className="form-row sap-theme">
                  <div className="form-group sap-theme">
                    <label className="form-label sap-theme required">
                      Tipo de Combustible
                    </label>
                    <select
                      className={`form-select sap-theme ${errors.fuelType ? 'error' : ''}`}
                      value={formData.fuelType}
                      onChange={(e) => handleFieldChange('fuelType', e.target.value)}
                    >
                      <option value="">Seleccione el tipo de combustible</option>
                      <option value="diesel">🛢️ Diésel</option>
                      <option value="gasoline">⛽ Gasolina</option>
                      <option value="acpm">🚛 ACPM</option>
                      <option value="electric">⚡ Eléctrico</option>
                    </select>
                    {errors.fuelType && <div className="error-message sap-theme">{errors.fuelType}</div>}
                  </div>

                  <div className="form-group sap-theme">
                    <label className="form-label sap-theme">
                      Capacidad del Tanque (Galones)
                    </label>
                    <input
                      type="number"
                      className="form-input sap-theme"
                      value={formData.tankCapacity}
                      onChange={(e) => handleFieldChange('tankCapacity', e.target.value)}
                      placeholder="0.0"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="form-group sap-theme">
                  <div className="checkbox-wrapper sap-theme">
                    <input
                      type="checkbox"
                      id="hasHorometer"
                      className="checkbox-input sap-theme"
                      checked={formData.hasHorometer}
                      onChange={(e) => handleFieldChange('hasHorometer', e.target.checked)}
                    />
                    <label htmlFor="hasHorometer" className="checkbox-label sap-theme">
                      Este vehículo tiene horómetro
                    </label>
                  </div>
                </div>

                {/* Botón para mostrar campos avanzados */}
                {canProceedToAdvanced && !showAdvanced && (
                  <div className="advanced-toggle sap-theme">
                    <button
                      type="button"
                      className="btn-show-advanced sap-theme"
                      onClick={() => setShowAdvanced(true)}
                    >
                      + Agregar información adicional
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* PASO 3: INFORMACIÓN ADICIONAL */}
            {showAdvanced && (
              <div className="form-section sap-theme fade-in sap-theme">
                <div className="section-title sap-theme">
                  Información Adicional
                </div>
                
                <div className="form-group sap-theme">
                  <label className="form-label sap-theme">
                    Descripción
                  </label>
                  <textarea
                    className="form-textarea sap-theme"
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="Ingrese características adicionales del vehículo..."
                    rows="3"
                  />
                </div>

                <div className="form-group sap-theme">
                  <label className="form-label sap-theme">
                    Notas Especiales
                  </label>
                  <textarea
                    className="form-textarea sap-theme"
                    value={formData.notes}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    placeholder="Ingrese observaciones, mantenimiento especial, etc..."
                    rows="2"
                  />
                </div>

                <div className="advanced-toggle sap-theme">
                  <button
                    type="button"
                    className="btn-hide-advanced sap-theme"
                    onClick={() => setShowAdvanced(false)}
                  >
                    - Ocultar información adicional
                  </button>
                </div>
              </div>
            )}

            {/* Acciones del formulario */}
            <div className="form-actions sap-theme">
              <button
                type="button"
                className="btn btn-secondary sap-theme"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="btn btn-primary sap-theme"
                disabled={!canProceedToAdvanced || isSubmitting}
              >
                {isSubmitting ? (
                  'Procesando...'
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

export default VehicleFormSmartSAP;
