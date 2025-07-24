/**
 * Step3_Technical - Tercer paso: Especificaciones técnicas del vehículo
 * Estilo conversacional tipo Typeform con subpasos
 */

import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { FUEL_TYPES } from '../../../data/vehicleCategories';
import './VehicleWizardSteps.css';

const Step3_Technical = ({ 
  formData, 
  updateFormData, 
  errors, 
  isActive 
}) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isSubStepTransitioning, setIsSubStepTransitioning] = useState(false);
  
  const totalSubSteps = 3;
  
  // Definir los subpasos
  const subSteps = useMemo(() => [
    {
      id: 1,
      title: 'Tipo de Combustible',
      question: '⛽ ¿Qué tipo de combustible usa este vehículo?',
      description: 'Esta información es crucial para la gestión de combustible y mantenimiento',
      type: 'fuel-selection',
      hint: '💡 La mayoría de tractores y maquinaria pesada usa diésel'
    },
    {
      id: 2,
      title: 'Número de Placa',
      question: '🏷️ ¿Cuál es el número de placa de este vehículo?',
      description: 'Si el vehículo tiene placa, especifícala aquí. Es opcional para equipos sin placa.',
      type: 'input',
      field: 'plateNumber',
      placeholder: 'Ej: ABC-123, XYZ-456',
      hint: '🚗 Deja vacío si no aplica (equipos sin placa)'
    },
    {
      id: 3,
      title: 'Especificaciones',
      question: '⚡ Especificaciones técnicas del motor',
      description: 'Potencia del motor y capacidad de combustible nos ayudan a gestionar mejor el vehículo',
      type: 'technical-specs',
      hint: '📋 Revisa la documentación técnica si no estás seguro'
    }
  ], []);

  // Resetear subpasos cuando el paso se activa
  useEffect(() => {
    if (isActive) {
      setCurrentSubStep(1);
    }
  }, [isActive]);

  // Navegar entre subpasos
  const goToNextSubStep = useCallback(() => {
    if (currentSubStep < totalSubSteps) {
      setIsSubStepTransitioning(true);
      setTimeout(() => {
        setCurrentSubStep(prev => prev + 1);
        setIsSubStepTransitioning(false);
      }, 200);
    }
  }, [currentSubStep, totalSubSteps]);

  const goToPrevSubStep = useCallback(() => {
    if (currentSubStep > 1) {
      setIsSubStepTransitioning(true);
      setTimeout(() => {
        setCurrentSubStep(prev => prev - 1);
        setIsSubStepTransitioning(false);
      }, 200);
    }
  }, [currentSubStep]);

  // Verificar si el subcampo actual está completo
  const isCurrentSubStepValid = useCallback(() => {
    const currentStep = subSteps[currentSubStep - 1];
    
    switch (currentStep.type) {
      case 'fuel-selection':
        return formData.fuelType && formData.fuelType.trim().length > 0;
      case 'input':
        // Placa es opcional
        return true;
      case 'technical-specs':
        // Al menos uno de los campos técnicos debe tener valor
        return (formData.enginePower && formData.enginePower > 0) || 
               (formData.fuelCapacity && formData.fuelCapacity > 0);
      default:
        return true;
    }
  }, [currentSubStep, formData, subSteps]);

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
        if (isCurrentSubStepValid()) {
          goToNextSubStep();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevSubStep();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (isCurrentSubStepValid()) {
          goToNextSubStep();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, isCurrentSubStepValid, goToNextSubStep, goToPrevSubStep]);

  const handleInputChange = useCallback((field) => (e) => {
    updateFormData(field, e.target.value);
  }, [updateFormData]);

  const handleFuelTypeSelect = useCallback((fuelType) => {
    updateFormData('fuelType', fuelType);
  }, [updateFormData]);

  const fuelTypeOptions = [
    {
      type: FUEL_TYPES.DIESEL,
      icon: '🛢️',
      title: 'Diésel',
      description: 'Para tractores, excavadoras y maquinaria pesada',
      color: 'fuel-diesel'
    },
    {
      type: FUEL_TYPES.GASOLINA,
      icon: '⛽',
      title: 'Gasolina',
      description: 'Para vehículos ligeros y herramientas menores',
      color: 'fuel-gasoline'
    },
    {
      type: FUEL_TYPES.MIXTO,
      icon: '🔄',
      title: 'Mixto',
      description: 'Puede usar tanto diésel como gasolina',
      color: 'fuel-mixed'
    }
  ];

  const currentStepData = subSteps[currentSubStep - 1];
  const subStepProgress = (currentSubStep / totalSubSteps) * 100;

  return (
    <div className={`wizard-step step-technical ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        
        {/* Indicador de progreso de subpasos */}
        <div className="substep-progress">
          <div className="substep-progress-bar">
            <div 
              className="substep-progress-fill"
              style={{ width: `${subStepProgress}%` }}
            />
          </div>
          <div className="substep-counter">
            {currentSubStep} de {totalSubSteps} - {currentStepData.title}
          </div>
        </div>

        {/* Contenedor de subpasos */}
        <div className="substeps-container">
          {subSteps.map((subStep, index) => (
            <div
              key={subStep.id}
              className={`
                substep-slide 
                ${index + 1 === currentSubStep ? 'current' : ''}
                ${index + 1 < currentSubStep ? 'past' : ''}
                ${index + 1 > currentSubStep ? 'future' : ''}
                ${isSubStepTransitioning ? 'transitioning' : ''}
              `}
              style={{
                transform: `translateX(${(index + 1 - currentSubStep) * 100}%)`,
                opacity: index + 1 === currentSubStep ? 1 : 0,
                visibility: index + 1 === currentSubStep ? 'visible' : 'hidden'
              }}
            >
              {/* Pregunta del subpaso */}
              <div className="typeform-question">
                <h2>{subStep.question}</h2>
                <p>{subStep.description}</p>
              </div>

              {/* Contenido específico por tipo de subpaso */}
              {subStep.type === 'fuel-selection' && (
                <div className="typeform-options fuel-options">
                  {fuelTypeOptions.map((option) => (
                    <div
                      key={option.type}
                      className={`typeform-option fuel-option ${option.color} ${
                        formData.fuelType === option.type ? 'selected' : ''
                      }`}
                      onClick={() => handleFuelTypeSelect(option.type)}
                    >
                      <div className="option-header">
                        <span className="option-icon">{option.icon}</span>
                      </div>
                      <div className="option-content">
                        <h4 className="option-title">{option.title}</h4>
                        <p className="option-description">{option.description}</p>
                      </div>
                      {formData.fuelType === option.type && (
                        <div className="selection-indicator">
                          <span className="checkmark">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {errors.fuelType && (
                    <div className="input-error-centered">
                      <span className="error-icon">⚠️</span>
                      {errors.fuelType}
                    </div>
                  )}
                </div>
              )}

              {subStep.type === 'input' && (
                <div className="typeform-input-group">
                  <div className="input-with-icon">
                    <span className="input-icon">🏷️</span>
                    <input
                      type="text"
                      className="typeform-input substep-input"
                      placeholder={subStep.placeholder}
                      value={formData[subStep.field] || ''}
                      onChange={handleInputChange(subStep.field)}
                      autoFocus={index + 1 === currentSubStep}
                    />
                  </div>
                  
                  {errors[subStep.field] && (
                    <div className="input-error">
                      <span className="error-icon">⚠️</span>
                      {errors[subStep.field]}
                    </div>
                  )}
                  
                  <div className="input-hint">
                    {subStep.hint}
                  </div>
                </div>
              )}

              {subStep.type === 'technical-specs' && (
                <div className="typeform-row">
                  <div className="typeform-input-group">
                    <label className="typeform-label">
                      Potencia del motor (HP)
                    </label>
                    <div className="input-with-icon">
                      <span className="input-icon">⚡</span>
                      <input
                        type="number"
                        className="typeform-input substep-input"
                        placeholder="150"
                        min="1"
                        step="1"
                        value={formData.enginePower || ''}
                        onChange={handleInputChange('enginePower')}
                      />
                    </div>
                    {errors.enginePower && (
                      <div className="input-error">
                        <span className="error-icon">⚠️</span>
                        {errors.enginePower}
                      </div>
                    )}
                  </div>

                  <div className="typeform-input-group">
                    <label className="typeform-label">
                      Capacidad de combustible (L)
                    </label>
                    <div className="input-with-icon">
                      <span className="input-icon">⛽</span>
                      <input
                        type="number"
                        className="typeform-input substep-input"
                        placeholder="200"
                        min="1"
                        step="0.1"
                        value={formData.fuelCapacity || ''}
                        onChange={handleInputChange('fuelCapacity')}
                      />
                    </div>
                    {errors.fuelCapacity && (
                      <div className="input-error">
                        <span className="error-icon">⚠️</span>
                        {errors.fuelCapacity}
                      </div>
                    )}
                  </div>
                  
                  <div className="input-hint">
                    {subStep.hint}
                  </div>
                </div>
              )}

              {/* Navegación de subpasos */}
              <div className="substep-navigation">
                {currentSubStep > 1 && (
                  <button 
                    type="button"
                    className="substep-btn substep-btn-back"
                    onClick={goToPrevSubStep}
                  >
                    ← Anterior
                  </button>
                )}
                
                {currentSubStep < totalSubSteps && (
                  <button 
                    type="button"
                    className={`substep-btn substep-btn-next ${!isCurrentSubStepValid() ? 'disabled' : ''}`}
                    onClick={goToNextSubStep}
                    disabled={!isCurrentSubStepValid()}
                  >
                    Siguiente →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Resumen visual (solo mostrar cuando se haya completado información) */}
        {currentSubStep === totalSubSteps && (formData.fuelType || formData.enginePower || formData.fuelCapacity) && (
          <div className="step-preview">
            <div className="preview-card">
              <h4>📋 Especificaciones técnicas</h4>
              
              {formData.fuelType && (
                <div className="preview-item">
                  <span className="preview-label">Combustible:</span>
                  <span className="preview-value">
                    {fuelTypeOptions.find(f => f.type === formData.fuelType)?.icon} {formData.fuelType}
                  </span>
                </div>
              )}
              
              {formData.plateNumber && (
                <div className="preview-item">
                  <span className="preview-label">Placa:</span>
                  <span className="preview-value">🏷️ {formData.plateNumber}</span>
                </div>
              )}
              
              {formData.enginePower && (
                <div className="preview-item">
                  <span className="preview-label">Potencia:</span>
                  <span className="preview-value">⚡ {formData.enginePower} HP</span>
                </div>
              )}
              
              {formData.fuelCapacity && (
                <div className="preview-item">
                  <span className="preview-label">Cap. combustible:</span>
                  <span className="preview-value">⛽ {formData.fuelCapacity} L</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Indicador de navegación */}
        <div className="navigation-hint">
          💡 Tip: Usa Enter o → para avanzar, ← para retroceder
        </div>

      </div>
    </div>
  );
};

export default Step3_Technical;
