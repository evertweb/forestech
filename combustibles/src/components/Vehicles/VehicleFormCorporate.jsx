/**
 * VehicleFormCorporate - Formulario corporativo moderno para vehículos
 * Diseño minimalista, profesional y sin iconos/emojis
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  createVehicle,
  updateVehicle,
  VEHICLE_STATUS,
  getAllVehicles,
} from '../../services/vehiclesService';
import { getAllVehicleCategories } from '../../services/vehicleCategoriesService';
import { FUEL_TYPES } from '../../data/vehicleCategories';
import { DEFAULT_VEHICLE_ICON } from '../../constants/vehicleIcons';
import VehicleIconSelector from './VehicleIconSelector';
import './VehicleFormCorporate.css';

// Función para generar ID automático de vehículo
const generateVehicleId = async (vehicleName, existingVehicles = []) => {
  if (!vehicleName || vehicleName.trim().length === 0) {
    return '';
  }

  // Obtener primera letra del nombre del vehículo
  const firstLetter = vehicleName.trim().charAt(0).toUpperCase();

  // Obtener números existentes para esta letra
  const existingNumbers = existingVehicles
    .filter((v) => v.vehicleId && v.vehicleId.startsWith(firstLetter))
    .map((v) => {
      const numberPart = v.vehicleId.slice(1);
      return parseInt(numberPart) || 0;
    })
    .filter((num) => !isNaN(num));

  // Encontrar el siguiente número disponible
  let nextNumber = 1;
  while (existingNumbers.includes(nextNumber)) {
    nextNumber++;
  }

  // Formatear con ceros a la izquierda (mínimo 2 dígitos)
  const formattedNumber = nextNumber.toString().padStart(2, '0');

  return `${firstLetter}${formattedNumber}`;
};

const VehicleFormCorporate = ({ isOpen, onClose, vehicle = null, onSuccess }) => {
  // Estados principales
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [existingVehicles, setExistingVehicles] = useState([]);

  // Referencias para animaciones
  const containerRef = useRef(null);

  // Datos del formulario
  const [formData, setFormData] = useState({
    // Información básica
    vehicleId: vehicle?.vehicleId || '',
    name: vehicle?.name || '',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    iconId: vehicle?.iconId || DEFAULT_VEHICLE_ICON.id,

    // Categoría y especificaciones
    category: vehicle?.category || '',
    fuelType: vehicle?.fuelType || FUEL_TYPES.DIESEL,
    plateNumber: vehicle?.plateNumber || '',
    enginePower: vehicle?.enginePower || '',
    fuelCapacity: vehicle?.fuelCapacity || '',

    // Información operacional
    status: vehicle?.status || VEHICLE_STATUS.ACTIVO,
    currentLocation: vehicle?.currentLocation || '',
    hasHourMeter: vehicle?.hasHourMeter || false,
    currentHours: vehicle?.currentHours || '',
    lastMaintenanceDate: vehicle?.lastMaintenanceDate
      ? new Date(vehicle.lastMaintenanceDate).toISOString().split('T')[0]
      : '',
    purchaseDate: vehicle?.purchaseDate
      ? new Date(vehicle.purchaseDate).toISOString().split('T')[0]
      : '',
    description: vehicle?.description || '',
  });

  // Definición de pasos del formulario
  const steps = useMemo(
    () => [
      {
        id: 'basic',
        title: 'Información Básica',
        subtitle: 'Datos principales del vehículo',
        fields: ['vehicleId', 'name', 'brand', 'model', 'iconId'],
      },
      {
        id: 'category',
        title: 'Categoría',
        subtitle: 'Clasificación del vehículo',
        fields: ['category'],
      },
      {
        id: 'technical',
        title: 'Especificaciones Técnicas',
        subtitle: 'Características del motor y combustible',
        fields: ['fuelType', 'plateNumber', 'enginePower', 'fuelCapacity'],
      },
      {
        id: 'operational',
        title: 'Estado Operacional',
        subtitle: 'Información de operación y mantenimiento',
        fields: ['status', 'currentLocation', 'hasHourMeter', 'currentHours'],
      },
      {
        id: 'additional',
        title: 'Información Adicional',
        subtitle: 'Fechas importantes y observaciones',
        fields: ['lastMaintenanceDate', 'purchaseDate', 'description'],
      },
    ],
    []
  );

  // Cargar categorías y vehículos existentes al abrir
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const loadInitialData = async () => {
    try {
      // Cargar categorías y vehículos existentes en paralelo
      const [categoriesData, vehiclesData] = await Promise.all([
        getAllVehicleCategories(),
        getAllVehicles(),
      ]);

      setCategories(categoriesData);
      setExistingVehicles(vehiclesData);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      setCategories([]);
      setExistingVehicles([]);
    }
  };

  // Validación de campos
  const validateStep = useCallback(
    (stepIndex) => {
      const step = steps[stepIndex];
      const stepErrors = {};

      step.fields.forEach((field) => {
        switch (field) {
          case 'vehicleId':
            if (!formData.vehicleId?.trim()) {
              stepErrors.vehicleId = 'El ID del vehículo es requerido';
            }
            break;
          case 'name':
            if (!formData.name?.trim()) {
              stepErrors.name = 'El nombre del vehículo es requerido';
            }
            break;
          case 'brand':
            if (!formData.brand?.trim()) {
              stepErrors.brand = 'La marca es requerida';
            }
            break;
          case 'model':
            if (!formData.model?.trim()) {
              stepErrors.model = 'El modelo es requerido';
            }
            break;
          case 'category':
            if (!formData.category) {
              stepErrors.category = 'Debe seleccionar una categoría';
            }
            break;
          case 'fuelType':
            if (!formData.fuelType) {
              stepErrors.fuelType = 'Debe seleccionar el tipo de combustible';
            }
            break;
          case 'status':
            if (!formData.status) {
              stepErrors.status = 'Debe seleccionar el estado del vehículo';
            }
            break;
          case 'currentHours':
            if (formData.hasHourMeter && (!formData.currentHours || formData.currentHours < 0)) {
              stepErrors.currentHours = 'Las horas del horómetro son requeridas';
            }
            break;
        }
      });

      return stepErrors;
    },
    [formData, steps]
  );

  // Navegación entre pasos
  const goToStep = useCallback(
    (stepIndex) => {
      if (stepIndex === currentStep) return;

      setIsAnimating(true);

      setTimeout(() => {
        setCurrentStep(stepIndex);
        setIsAnimating(false);
      }, 150);
    },
    [currentStep]
  );

  const nextStep = useCallback(() => {
    const stepErrors = validateStep(currentStep);
    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      if (currentStep < steps.length - 1) {
        goToStep(currentStep + 1);
      }
    }
  }, [currentStep, goToStep, steps.length, validateStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  // Manejo de cambios en el formulario
  const handleChange = useCallback(
    async (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Generar ID automáticamente cuando se cambia el nombre (solo para vehículos nuevos)
      if (field === 'name' && !vehicle && value && value.trim()) {
        try {
          const generatedId = await generateVehicleId(value, existingVehicles);
          setFormData((prev) => ({ ...prev, vehicleId: generatedId }));
        } catch (error) {
          console.error('Error generando ID automático:', error);
        }
      }

      // Limpiar error del campo cuando se modifica
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors, vehicle, existingVehicles]
  );

  // Manejo específico para cambio de iconos (no async)
  const handleIconChange = useCallback((iconId) => {
    setFormData((prev) => ({ ...prev, iconId }));
  }, []);

  // Envío del formulario
  const handleSubmit = useCallback(async () => {
    // Validar todos los pasos
    let allErrors = {};
    steps.forEach((_, index) => {
      const stepErrors = validateStep(index);
      allErrors = { ...allErrors, ...stepErrors };
    });

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCategory = categories.find((cat) => cat.id === formData.category);

      const vehicleData = {
        vehicleId: formData.vehicleId.trim(),
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        iconId: formData.iconId,
        type: selectedCategory?.name || '',
        category: formData.category,
        fuelType: formData.fuelType,
        plateNumber: formData.plateNumber?.trim() || '',
        enginePower: formData.enginePower ? parseFloat(formData.enginePower) : null,
        fuelCapacity: formData.fuelCapacity ? parseFloat(formData.fuelCapacity) : null,
        status: formData.status,
        currentLocation: formData.currentLocation?.trim() || '',
        hasHourMeter: formData.hasHourMeter,
        currentHours: formData.currentHours ? parseFloat(formData.currentHours) : null,
        description: formData.description?.trim() || '',
        lastMaintenanceDate: formData.lastMaintenanceDate || null,
        purchaseDate: formData.purchaseDate || null,
      };

      let result;
      if (vehicle) {
        // Modo edición
        result = await updateVehicle(vehicle.id, vehicleData);
      } else {
        // Modo creación
        result = await createVehicle(vehicleData);
      }

      if (result.success) {
        console.log('✅ Vehículo guardado exitosamente:', result.data);

        if (onSuccess) {
          onSuccess(result.data);
        }
        onClose();
      } else {
        throw new Error(result.error || 'Error al guardar el vehículo');
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, categories, vehicle, onSuccess, onClose, steps, validateStep]);

  // Navegación por teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Opciones para selects
  const fuelTypeOptions = [
    { value: FUEL_TYPES.DIESEL, label: 'Diésel' },
    { value: FUEL_TYPES.GASOLINE, label: 'Gasolina' },
    { value: FUEL_TYPES.MIXTO, label: 'Mixto' },
  ];

  const statusOptions = [
    { value: VEHICLE_STATUS.ACTIVO, label: 'Activo' },
    { value: VEHICLE_STATUS.MANTENIMIENTO, label: 'En Mantenimiento' },
    { value: VEHICLE_STATUS.REPARACION, label: 'En Reparación' },
    { value: VEHICLE_STATUS.INACTIVO, label: 'Inactivo' },
    { value: VEHICLE_STATUS.FUERA_DE_SERVICIO, label: 'Fuera de Servicio' },
  ];

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="corporate-modal-overlay" onClick={onClose}>
      <div
        className="corporate-modal-container"
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="corporate-header">
          <div className="header-content">
            <h1 className="modal-title">{vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h1>
            <button className="close-button" onClick={onClose}>
              <span className="close-icon">&times;</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>

          {/* Step Navigation */}
          <div className="step-navigation">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`step-indicator ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                onClick={() => index < currentStep && goToStep(index)}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-label">{step.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="corporate-content">
          <div className="step-header">
            <h2 className="step-title">{currentStepData.title}</h2>
            <p className="step-subtitle">{currentStepData.subtitle}</p>
          </div>

          <div className={`form-container ${isAnimating ? 'animating' : ''}`}>
            {/* Step 0: Información Básica */}
            {currentStep === 0 && (
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="vehicleId" className="form-label">
                    ID del Vehículo *
                    {!vehicle && (
                      <span className="field-hint">Se genera automáticamente desde el nombre</span>
                    )}
                  </label>
                  <input
                    id="vehicleId"
                    type="text"
                    className={`form-input ${errors.vehicleId ? 'error' : ''}`}
                    placeholder={
                      vehicle ? 'TR001, CAM01, EXC001' : 'Se generará automáticamente...'
                    }
                    value={formData.vehicleId}
                    onChange={(e) => handleChange('vehicleId', e.target.value)}
                    disabled={!vehicle && !formData.vehicleId}
                  />
                  {!vehicle && (
                    <div className="field-help">
                      El ID se genera automáticamente con la primera letra del nombre + número
                      consecutivo (ej: T01, C02, E03)
                    </div>
                  )}
                  {errors.vehicleId && <div className="error-message">{errors.vehicleId}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Nombre del Vehículo *
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Tractor Principal, Camión de Carga"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="brand" className="form-label">
                      Marca *
                    </label>
                    <input
                      id="brand"
                      type="text"
                      className={`form-input ${errors.brand ? 'error' : ''}`}
                      placeholder="John Deere, Caterpillar"
                      value={formData.brand}
                      onChange={(e) => handleChange('brand', e.target.value)}
                    />
                    {errors.brand && <div className="error-message">{errors.brand}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="model" className="form-label">
                      Modelo *
                    </label>
                    <input
                      id="model"
                      type="text"
                      className={`form-input ${errors.model ? 'error' : ''}`}
                      placeholder="5090E, 320D"
                      value={formData.model}
                      onChange={(e) => handleChange('model', e.target.value)}
                    />
                    {errors.model && <div className="error-message">{errors.model}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Icono del Vehículo</label>
                  <VehicleIconSelector
                    key={`icon-selector-${formData.iconId}`}
                    selectedIconId={formData.iconId}
                    onIconSelect={handleIconChange}
                    disabled={isSubmitting}
                  />
                  <div className="field-help">
                    Selecciona un icono que represente mejor este vehículo
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Categoría */}
            {currentStep === 1 && (
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    Categoría del Vehículo *
                  </label>
                  <select
                    id="category"
                    className={`form-select ${errors.category ? 'error' : ''}`}
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <div className="error-message">{errors.category}</div>}
                </div>

                {formData.category && (
                  <div className="category-preview">
                    {(() => {
                      const selectedCategory = categories.find((c) => c.id === formData.category);
                      return selectedCategory ? (
                        <div className="category-info">
                          <h4>{selectedCategory.name}</h4>
                          <p>{selectedCategory.description || 'Categoría personalizada'}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Especificaciones Técnicas */}
            {currentStep === 2 && (
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="fuelType" className="form-label">
                    Tipo de Combustible *
                  </label>
                  <select
                    id="fuelType"
                    className={`form-select ${errors.fuelType ? 'error' : ''}`}
                    value={formData.fuelType}
                    onChange={(e) => handleChange('fuelType', e.target.value)}
                  >
                    {fuelTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.fuelType && <div className="error-message">{errors.fuelType}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="plateNumber" className="form-label">
                    Número de Placa
                  </label>
                  <input
                    id="plateNumber"
                    type="text"
                    className="form-input"
                    placeholder="ABC-123 (opcional)"
                    value={formData.plateNumber}
                    onChange={(e) => handleChange('plateNumber', e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="enginePower" className="form-label">
                      Potencia del Motor (HP)
                    </label>
                    <input
                      id="enginePower"
                      type="number"
                      className="form-input"
                      placeholder="150"
                      min="1"
                      value={formData.enginePower}
                      onChange={(e) => handleChange('enginePower', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="fuelCapacity" className="form-label">
                      Capacidad de Combustible (L)
                    </label>
                    <input
                      id="fuelCapacity"
                      type="number"
                      className="form-input"
                      placeholder="200"
                      min="1"
                      step="0.1"
                      value={formData.fuelCapacity}
                      onChange={(e) => handleChange('fuelCapacity', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Estado Operacional */}
            {currentStep === 3 && (
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    Estado del Vehículo *
                  </label>
                  <select
                    id="status"
                    className={`form-select ${errors.status ? 'error' : ''}`}
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && <div className="error-message">{errors.status}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="currentLocation" className="form-label">
                    Ubicación Actual
                  </label>
                  <input
                    id="currentLocation"
                    type="text"
                    className="form-input"
                    placeholder="Almacén Central, Campo Norte"
                    value={formData.currentLocation}
                    onChange={(e) => handleChange('currentLocation', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      id="hasHourMeter"
                      type="checkbox"
                      className="form-checkbox"
                      checked={formData.hasHourMeter}
                      onChange={(e) => handleChange('hasHourMeter', e.target.checked)}
                    />
                    <label htmlFor="hasHourMeter" className="checkbox-label">
                      Este vehículo tiene horómetro
                    </label>
                  </div>
                </div>

                {formData.hasHourMeter && (
                  <div className="form-group">
                    <label htmlFor="currentHours" className="form-label">
                      Horas Actuales del Horómetro *
                    </label>
                    <input
                      id="currentHours"
                      type="number"
                      className={`form-input ${errors.currentHours ? 'error' : ''}`}
                      placeholder="1250.5"
                      min="0"
                      step="0.1"
                      value={formData.currentHours}
                      onChange={(e) => handleChange('currentHours', e.target.value)}
                    />
                    {errors.currentHours && (
                      <div className="error-message">{errors.currentHours}</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Información Adicional */}
            {currentStep === 4 && (
              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="lastMaintenanceDate" className="form-label">
                      Último Mantenimiento
                    </label>
                    <input
                      id="lastMaintenanceDate"
                      type="date"
                      className="form-input"
                      value={formData.lastMaintenanceDate}
                      onChange={(e) => handleChange('lastMaintenanceDate', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="purchaseDate" className="form-label">
                      Fecha de Compra
                    </label>
                    <input
                      id="purchaseDate"
                      type="date"
                      className="form-input"
                      value={formData.purchaseDate}
                      onChange={(e) => handleChange('purchaseDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Observaciones
                  </label>
                  <textarea
                    id="description"
                    className="form-textarea"
                    placeholder="Características especiales, modificaciones, notas importantes..."
                    rows="4"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error General */}
          {errors.submit && <div className="submit-error">{errors.submit}</div>}
        </div>

        {/* Footer */}
        <div className="corporate-footer">
          <div className="footer-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Anterior
            </button>

            <div className="step-info">
              Paso {currentStep + 1} de {steps.length}
            </div>

            {currentStep < steps.length - 1 ? (
              <button type="button" className="btn-primary" onClick={nextStep}>
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : vehicle ? 'Actualizar' : 'Crear'} Vehículo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleFormCorporate;
