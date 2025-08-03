// VehicleFormSmart-SAP.jsx - SAP Fiori Corporate Theme
import React, { useState, useCallback, useEffect } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { isCustomIcon } from '../../services/iconUploadService';
import { 
  UI_ACTIONS, 
  UI_FORM_LABELS, 
  UI_MESSAGES, 
  UI_PLACEHOLDERS, 
  MODAL_TEXT 
} from '../../constants';
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
          newErrors.name = UI_MESSAGES.ERROR.NAME_REQUIRED;
        } else if (value.length < 2) {
          newErrors.name = UI_MESSAGES.ERROR.NAME_MIN_LENGTH;
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'categoryId':
        if (!value) {
          newErrors.categoryId = UI_MESSAGES.ERROR.CATEGORY_REQUIRED_VEHICLE;
        } else {
          delete newErrors.categoryId;
        }
        break;
        
      case 'plateCode':
        if (!value.trim()) {
          newErrors.plateCode = UI_MESSAGES.ERROR.PLATE_CODE_REQUIRED;
        } else {
          delete newErrors.plateCode;
        }
        break;
        
      case 'fuelType':
        if (!value) {
          newErrors.fuelType = UI_MESSAGES.ERROR.FUEL_TYPE_REQUIRED;
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
          <h2>{vehicle ? MODAL_TEXT.VEHICLE_FORM.EDIT_TITLE : MODAL_TEXT.VEHICLE_FORM.CREATE_TITLE}</h2>
          <button 
            type="button" 
            className="close-button"
            onClick={handleClose}
            aria-label={UI_ACTIONS.CLOSE}
          >
            ✕
          </button>
        </div>

        {/* Indicador de progreso SAP */}
        <div className="progress-indicator sap-theme">
          <div className={`progress-step sap-theme ${getStepStatus('basic')}`}>
            {MODAL_TEXT.VEHICLE_FORM.BASIC_INFO}
          </div>
          <div className={`progress-step sap-theme ${getStepStatus('details')}`}>
            {MODAL_TEXT.VEHICLE_FORM.OPERATIONAL_DETAILS}
          </div>
          <div className={`progress-step sap-theme ${getStepStatus('advanced')}`}>
            {MODAL_TEXT.VEHICLE_FORM.ADDITIONAL_INFO}
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
                {MODAL_TEXT.VEHICLE_FORM.BASIC_INFO}
              </div>
              
              <div className="form-row sap-theme">
                <div className="form-group sap-theme">
                  <label className="form-label sap-theme required">
                    {UI_FORM_LABELS.VEHICLE_NAME}
                  </label>
                  <input
                    type="text"
                    className={`form-input sap-theme ${errors.name ? 'error' : ''}`}
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder={UI_PLACEHOLDERS.VEHICLE_NAME_SAP}
                    autoFocus
                  />
                  {errors.name && <div className="error-message sap-theme">{errors.name}</div>}
                </div>

                <div className="form-group sap-theme">
                  <label className="form-label sap-theme required">
                    {UI_FORM_LABELS.PLATE_CODE}
                  </label>
                  <input
                    type="text"
                    className={`form-input sap-theme ${errors.plateCode ? 'error' : ''}`}
                    value={formData.plateCode}
                    onChange={(e) => handleFieldChange('plateCode', e.target.value.toUpperCase())}
                    placeholder={UI_PLACEHOLDERS.PLATE_CODE_SAP}
                  />
                  {errors.plateCode && <div className="error-message sap-theme">{errors.plateCode}</div>}
                </div>
              </div>

              <div className="form-group sap-theme">
                <label className="form-label sap-theme required">
                  {UI_FORM_LABELS.VEHICLE_CATEGORY}
                </label>
                {categoriesLoading ? (
                  <div className="loading-spinner sap-theme" style={{ margin: '1rem 0' }}></div>
                ) : (
                  <select
                    className={`form-select sap-theme ${errors.categoryId ? 'error' : ''}`}
                    value={formData.categoryId}
                    onChange={(e) => handleFieldChange('categoryId', e.target.value)}
                  >
                    <option value="">{UI_MESSAGES.INFO.SELECT_OPTION}</option>
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
                  {MODAL_TEXT.VEHICLE_FORM.OPERATIONAL_DETAILS}
                </div>
                
                <div className="form-row sap-theme">
                  <div className="form-group sap-theme">
                    <label className="form-label sap-theme required">
                      {UI_FORM_LABELS.FUEL_TYPE}
                    </label>
                    <select
                      className={`form-select sap-theme ${errors.fuelType ? 'error' : ''}`}
                      value={formData.fuelType}
                      onChange={(e) => handleFieldChange('fuelType', e.target.value)}
                    >
                      <option value="">{UI_MESSAGES.INFO.SELECT_OPTION}</option>
                      <option value="diesel">🛢️ Diésel</option>
                      <option value="gasoline">⛽ Gasolina</option>
                      <option value="acpm">🚛 ACPM</option>
                      <option value="electric">⚡ Eléctrico</option>
                    </select>
                    {errors.fuelType && <div className="error-message sap-theme">{errors.fuelType}</div>}
                  </div>

                  <div className="form-group sap-theme">
                    <label className="form-label sap-theme">
                      {UI_FORM_LABELS.TANK_CAPACITY}
                    </label>
                    <input
                      type="number"
                      className="form-input sap-theme"
                      value={formData.tankCapacity}
                      onChange={(e) => handleFieldChange('tankCapacity', e.target.value)}
                      placeholder={UI_PLACEHOLDERS.TANK_CAPACITY_SAP}
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
                      {UI_FORM_LABELS.HAS_HOROMETER}
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
                      {MODAL_TEXT.VEHICLE_FORM.ADD_INFO}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* PASO 3: INFORMACIÓN ADICIONAL */}
            {showAdvanced && (
              <div className="form-section sap-theme fade-in sap-theme">
                <div className="section-title sap-theme">
                  {MODAL_TEXT.VEHICLE_FORM.ADDITIONAL_INFO}
                </div>
                
                <div className="form-group sap-theme">
                  <label className="form-label sap-theme">
                    {UI_FORM_LABELS.DESCRIPTION}
                  </label>
                  <textarea
                    className="form-textarea sap-theme"
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder={UI_PLACEHOLDERS.VEHICLE_DESCRIPTION}
                    rows="3"
                  />
                </div>

                <div className="form-group sap-theme">
                  <label className="form-label sap-theme">
                    {UI_FORM_LABELS.SPECIAL_NOTES}
                  </label>
                  <textarea
                    className="form-textarea sap-theme"
                    value={formData.notes}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    placeholder={UI_PLACEHOLDERS.SPECIAL_NOTES}
                    rows="2"
                  />
                </div>

                <div className="advanced-toggle sap-theme">
                  <button
                    type="button"
                    className="btn-hide-advanced sap-theme"
                    onClick={() => setShowAdvanced(false)}
                  >
                    {MODAL_TEXT.VEHICLE_FORM.HIDE_INFO}
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
                {UI_ACTIONS.CANCEL}
              </button>
              
              <button
                type="submit"
                className="btn btn-primary sap-theme"
                disabled={!canProceedToAdvanced || isSubmitting}
              >
                {isSubmitting ? (
                  UI_MESSAGES.LOADING.SAVING
                ) : (
                  vehicle ? UI_ACTIONS.UPDATE : UI_ACTIONS.CREATE
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
