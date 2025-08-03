// VehicleFormSmart-Retro80s.jsx - Synthwave 80s Version
import React, { useState, useCallback, useEffect } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { renderCategoryIcon, isCustomIcon } from '../../services/iconUploadService';
import './VehicleFormSmart-Retro80s.css';

const VehicleFormSmartRetro80s = ({ isOpen, onClose, onSuccess, vehicle = null }) => {
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

  // Mapeo de iconos de combustible con estilo retro
  const getFuelIcon = (fuelType) => {
    const icons = {
      diesel: '🛢️',
      gasoline: '⛽',
      acpm: '🚛',
      electric: '⚡'
    };
    return icons[fuelType] || '🛢️';
  };

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
    <div className="smart-modal-overlay retro-80s retro-synthwave-bg" onClick={handleClose}>
      <div className="smart-modal-container retro-80s crt-effect retro-80s" onClick={e => e.stopPropagation()}>
        {/* Loading overlay */}
        {(isSubmitting || loading) && (
          <div className="loading-overlay retro-80s">
            <div className="loading-spinner retro-80s"></div>
          </div>
        )}

        {/* Header retro */}
        <div className="smart-modal-header retro-80s">
          <h2>{vehicle ? '< EDITAR_VEHÍCULO.EXE >' : '< NUEVO_VEHÍCULO.EXE >'}</h2>
          <button 
            type="button" 
            className="close-button"
            onClick={handleClose}
            aria-label="Cerrar"
          >
            X
          </button>
        </div>

        {/* Indicador de progreso retro */}
        <div className="progress-indicator retro-80s">
          <div className={`progress-step retro-80s ${getStepStatus('basic')}`}>
            BÁSICO
          </div>
          <div className={`progress-step retro-80s ${getStepStatus('details')}`}>
            DETALLES
          </div>
          <div className={`progress-step retro-80s ${getStepStatus('advanced')}`}>
            AVANZADO
          </div>
        </div>

        {/* Contenido del formulario */}
        <div className="smart-modal-content retro-80s">
          {errors.submit && (
            <div className="error-message retro-80s" style={{ padding: '1rem 2rem', textAlign: 'center' }}>
              ❌ {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* PASO 1: INFORMACIÓN BÁSICA */}
            <div className="form-section retro-80s">
              <div className="section-title retro-80s">
                &gt; DATOS_BÁSICOS
              </div>
              
              <div className="form-group retro-80s">
                <label className="form-label retro-80s required">
                  NOMBRE_VEHÍCULO
                </label>
                <input
                  type="text"
                  className={`form-input retro-80s ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="&gt;&gt;&gt; Ingresa nombre del vehículo..."
                  autoFocus
                />
                {errors.name && <div className="error-message retro-80s">⚠ {errors.name}</div>}
              </div>

              <div className="form-group retro-80s">
                <label className="form-label retro-80s required">
                  PLACA_CÓDIGO
                </label>
                <input
                  type="text"
                  className={`form-input retro-80s ${errors.plateCode ? 'error' : ''}`}
                  value={formData.plateCode}
                  onChange={(e) => handleFieldChange('plateCode', e.target.value.toUpperCase())}
                  placeholder="&gt;&gt;&gt; ABC123"
                />
                {errors.plateCode && <div className="error-message retro-80s">⚠ {errors.plateCode}</div>}
              </div>

              <div className="form-group retro-80s">
                <label className="form-label retro-80s required">
                  CATEGORÍA_VEHÍCULO
                </label>
                {categoriesLoading ? (
                  <div className="loading-spinner retro-80s" style={{ margin: '1rem 0' }}></div>
                ) : (
                  <select
                    className={`form-select retro-80s ${errors.categoryId ? 'error' : ''}`}
                    value={formData.categoryId}
                    onChange={(e) => handleFieldChange('categoryId', e.target.value)}
                  >
                    <option value="">&gt;&gt;&gt; Seleccionar categoría...</option>
                    {vehicleCategories?.map(category => (
                      <option key={category.id} value={category.id}>
                        {isCustomIcon(category.icon) ? '🖼️  ' : category.icon + ' '}{category.name}
                      </option>
                    )) || []}
                  </select>
                )}
                {errors.categoryId && <div className="error-message retro-80s">⚠ {errors.categoryId}</div>}
              </div>
            </div>

            {/* PASO 2: DETALLES OPERATIVOS */}
            {(currentStep === 'details' || showAdvanced) && canProceedToDetails && (
              <div className="form-section retro-80s">
                <div className="section-title retro-80s">
                  &gt; DETALLES_OPERATIVOS
                </div>
                
                <div className="form-group retro-80s">
                  <label className="form-label retro-80s required">
                    TIPO_COMBUSTIBLE
                  </label>
                  <select
                    className={`form-select retro-80s ${errors.fuelType ? 'error' : ''}`}
                    value={formData.fuelType}
                    onChange={(e) => handleFieldChange('fuelType', e.target.value)}
                  >
                    <option value="">&gt;&gt;&gt; Seleccionar combustible...</option>
                    <option value="diesel">🛢️ DIESEL</option>
                    <option value="gasoline">⛽ GASOLINA</option>
                    <option value="acpm">🚛 ACPM</option>
                    <option value="electric">⚡ ELÉCTRICO</option>
                  </select>
                  {errors.fuelType && <div className="error-message retro-80s">⚠ {errors.fuelType}</div>}
                </div>

                <div className="form-group retro-80s">
                  <label className="form-label retro-80s">
                    CAPACIDAD_TANQUE (GALONES)
                  </label>
                  <input
                    type="number"
                    className="form-input retro-80s"
                    value={formData.tankCapacity}
                    onChange={(e) => handleFieldChange('tankCapacity', e.target.value)}
                    placeholder="&gt;&gt;&gt; 0.0"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="form-group retro-80s">
                  <label className="form-label retro-80s" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.hasHorometer}
                      onChange={(e) => handleFieldChange('hasHorometer', e.target.checked)}
                      style={{ 
                        appearance: 'none',
                        width: '20px',
                        height: '20px',
                        border: '2px solid var(--retro-neon-cyan)',
                        background: formData.hasHorometer ? 'var(--retro-neon-cyan)' : 'transparent',
                        position: 'relative'
                      }}
                    />
                    {formData.hasHorometer && (
                      <span style={{ 
                        position: 'absolute', 
                        left: '4px', 
                        color: 'var(--retro-bg-primary)',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </span>
                    )}
                    [ ] TIENE_HORÓMETRO
                  </label>
                </div>

                {/* Botón para mostrar campos avanzados */}
                {canProceedToAdvanced && !showAdvanced && (
                  <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                    <button
                      type="button"
                      className="btn retro-80s btn-secondary retro-80s"
                      onClick={() => setShowAdvanced(true)}
                    >
                      + INFORMACIÓN_ADICIONAL
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* PASO 3: INFORMACIÓN ADICIONAL */}
            {showAdvanced && (
              <div className="form-section retro-80s">
                <div className="section-title retro-80s">
                  &gt; DATOS_ADICIONALES
                </div>
                
                <div className="form-group retro-80s">
                  <label className="form-label retro-80s">
                    DESCRIPCIÓN
                  </label>
                  <textarea
                    className="form-textarea retro-80s"
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="&gt;&gt;&gt; Características adicionales del vehículo..."
                    rows="3"
                  />
                </div>

                <div className="form-group retro-80s">
                  <label className="form-label retro-80s">
                    NOTAS_ESPECIALES
                  </label>
                  <textarea
                    className="form-textarea retro-80s"
                    value={formData.notes}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    placeholder="&gt;&gt;&gt; Observaciones, mantenimiento especial..."
                    rows="2"
                  />
                </div>

                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                  <button
                    type="button"
                    className="btn retro-80s btn-secondary retro-80s"
                    onClick={() => setShowAdvanced(false)}
                  >
                    - OCULTAR_ADICIONALES
                  </button>
                </div>
              </div>
            )}

            {/* Acciones del formulario */}
            <div className="form-actions retro-80s">
              <button
                type="button"
                className="btn retro-80s btn-secondary retro-80s"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                [ CANCELAR ]
              </button>
              
              <button
                type="submit"
                className="btn retro-80s btn-success retro-80s"
                disabled={!canProceedToAdvanced || isSubmitting}
              >
                {isSubmitting ? (
                  '[ PROCESANDO... ]'
                ) : (
                  vehicle ? '[ ACTUALIZAR_VEHÍCULO ]' : '[ CREAR_VEHÍCULO ]'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleFormSmartRetro80s;
