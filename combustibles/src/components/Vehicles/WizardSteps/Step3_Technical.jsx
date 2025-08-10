/**
 * Step3_Technical - Tercer paso: Especificaciones técnicas del vehículo
 * Estilo conversacional tipo Typeform con subpasos
 */

import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { FUEL_TYPES } from '../../../data/vehicleCategories';
import './VehicleWizardSteps.css';

const Step3_Technical = ({ formData, updateFormData, errors, isActive }) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isSubStepTransitioning, setIsSubStepTransitioning] = useState(false);

  const totalSubSteps = 3;

  // Definir los subpasos
  const subSteps = useMemo(
    () => [
      {
        id: 1,
        title: 'Tipo de Combustible',
        question: '⛽ ¿Qué tipo de combustible usa este vehículo?',
        description: 'Esta información es crucial para la gestión de combustible y mantenimiento',
        type: 'fuel-selection',
        hint: '💡 La mayoría de tractores y maquinaria pesada usa diésel',
      },
      {
        id: 2,
        title: 'Número de Placa',
        question: '🏷️ ¿Cuál es el número de placa de este vehículo?',
        description:
          'Si el vehículo tiene placa, especifícala aquí. Es opcional para equipos sin placa.',
        type: 'input',
        field: 'plateNumber',
        placeholder: 'Ej: ABC-123, XYZ-456',
        hint: '🚗 Deja vacío si no aplica (equipos sin placa)',
      },
      {
        id: 3,
        title: 'Especificaciones',
        question: '⚡ Especificaciones técnicas del motor',
        description:
          'Potencia del motor y capacidad de combustible nos ayudan a gestionar mejor el vehículo',
        type: 'technical-specs',
        hint: '📋 Revisa la documentación técnica si no estás seguro',
      },
    ],
    []
  );

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
        setCurrentSubStep((prev) => prev + 1);
        setIsSubStepTransitioning(false);
      }, 200);
    }
  }, [currentSubStep, totalSubSteps]);

  const goToPrevSubStep = useCallback(() => {
    if (currentSubStep > 1) {
      setIsSubStepTransitioning(true);
      setTimeout(() => {
        setCurrentSubStep((prev) => prev - 1);
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
        return (
          (formData.enginePower && formData.enginePower > 0) ||
          (formData.fuelCapacity && formData.fuelCapacity > 0)
        );
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

  const handleInputChange = useCallback(
    (field) => (e) => {
      updateFormData(field, e.target.value);
    },
    [updateFormData]
  );

  const handleFuelTypeSelect = useCallback(
    (fuelType) => {
      updateFormData('fuelType', fuelType);
    },
    [updateFormData]
  );

  const fuelTypeOptions = [
    {
      type: FUEL_TYPES.DIESEL,
      icon: '🛢️',
      title: 'Diésel',
      description: 'Para tractores, excavadoras y maquinaria pesada',
      color: 'fuel-diesel',
    },
    {
      type: FUEL_TYPES.GASOLINA,
      icon: '⛽',
      title: 'Gasolina',
      description: 'Para vehículos ligeros y herramientas menores',
      color: 'fuel-gasoline',
    },
    {
      type: FUEL_TYPES.MIXTO,
      icon: '🔄',
      title: 'Mixto',
      description: 'Puede usar tanto diésel como gasolina',
      color: 'fuel-mixed',
    },
  ];

  const currentStepData = subSteps[currentSubStep - 1];
  const subStepProgress = (currentSubStep / totalSubSteps) * 100;

  return (
    <div className={`wizard-step step-technical ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout sap-theme">
        {/* Indicador de progreso de subpasos */}
        <div className="substep-progress sap-theme">
          <div className="substep-progress-bar sap-theme">
            <div
              className="substep-progress-fill sap-theme"
              style={{ width: `${subStepProgress}%` }}
            />
          </div>
          <div className="substep-counter sap-theme">
            {currentSubStep} de {totalSubSteps} - {currentStepData.title}
          </div>
        </div>

        {/* Contenedor de subpasos */}
        <div className="substeps-container sap-theme">
          {subSteps.map((subStep, index) => (
            <div
              key={subStep.id}
              className={`substep-slide ${index + 1 === currentSubStep ? 'current' : ''} ${index + 1 < currentSubStep ? 'past' : ''} ${index + 1 > currentSubStep ? 'future' : ''} ${isSubStepTransitioning ? 'transitioning' : ''} `}
              style={{
                transform: `translateX(${(index + 1 - currentSubStep) * 100}%)`,
                opacity: index + 1 === currentSubStep ? 1 : 0,
                visibility: index + 1 === currentSubStep ? 'visible' : 'hidden',
              }}
            >
              {/* Pregunta del subpaso */}
              <div className="step-question sap-theme">
                <h3>{subStep.question}</h3>
                <p>{subStep.description}</p>
              </div>

              {/* Contenido específico por tipo de subpaso */}
              {subStep.type === 'fuel-selection' && (
                <div className="technical-specs-grid sap-theme">
                  {fuelTypeOptions.map((option) => (
                    <div
                      key={option.type}
                      className={`spec-group ${
                        formData.fuelType === option.type ? 'selected' : ''
                      }`}
                      onClick={() => handleFuelTypeSelect(option.type)}
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <div className="spec-label sap-theme">
                        {option.icon} {option.title}
                      </div>
                      <div className="spec-description sap-theme">{option.description}</div>
                      {formData.fuelType === option.type && (
                        <div className="selection-indicator sap-theme">
                          <span className="checkmark sap-theme">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {errors.fuelType && (
                    <div className="input-error-centered sap-theme">
                      <span className="error-icon sap-theme">⚠️</span>
                      {errors.fuelType}
                    </div>
                  )}
                </div>
              )}

              {subStep.type === 'input' && (
                <div className="typeform-input-group sap-theme">
                  <div className="input-with-icon sap-theme">
                    <span className="input-icon sap-theme">🏷️</span>
                    <input
                      type="text"
                      className="typeform-input substep-input sap-theme"
                      placeholder={subStep.placeholder}
                      value={formData[subStep.field] || ''}
                      onChange={handleInputChange(subStep.field)}
                      autoFocus={index + 1 === currentSubStep}
                    />
                  </div>

                  {errors[subStep.field] && (
                    <div className="input-error sap-theme">
                      <span className="error-icon sap-theme">⚠️</span>
                      {errors[subStep.field]}
                    </div>
                  )}

                  <div className="input-hint sap-theme">{subStep.hint}</div>
                </div>
              )}

              {subStep.type === 'technical-specs' && (
                <div className="typeform-row sap-theme">
                  <div className="typeform-input-group sap-theme">
                    <label className="typeform-label sap-theme">Potencia del motor (HP)</label>
                    <div className="input-with-icon sap-theme">
                      <span className="input-icon sap-theme">⚡</span>
                      <input
                        type="number"
                        className="typeform-input substep-input sap-theme"
                        placeholder="150"
                        min="1"
                        step="1"
                        value={formData.enginePower || ''}
                        onChange={handleInputChange('enginePower')}
                      />
                    </div>
                    {errors.enginePower && (
                      <div className="input-error sap-theme">
                        <span className="error-icon sap-theme">⚠️</span>
                        {errors.enginePower}
                      </div>
                    )}
                  </div>

                  <div className="typeform-input-group sap-theme">
                    <label className="typeform-label sap-theme">Capacidad de combustible (L)</label>
                    <div className="input-with-icon sap-theme">
                      <span className="input-icon sap-theme">⛽</span>
                      <input
                        type="number"
                        className="typeform-input substep-input sap-theme"
                        placeholder="200"
                        min="1"
                        step="0.1"
                        value={formData.fuelCapacity || ''}
                        onChange={handleInputChange('fuelCapacity')}
                      />
                    </div>
                    {errors.fuelCapacity && (
                      <div className="input-error sap-theme">
                        <span className="error-icon sap-theme">⚠️</span>
                        {errors.fuelCapacity}
                      </div>
                    )}
                  </div>

                  <div className="input-hint sap-theme">{subStep.hint}</div>
                </div>
              )}

              {/* Navegación de subpasos */}
              <div className="substep-navigation sap-theme">
                {currentSubStep > 1 && (
                  <button
                    type="button"
                    className="substep-btn substep-btn-back sap-theme"
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
        {currentSubStep === totalSubSteps &&
          (formData.fuelType || formData.enginePower || formData.fuelCapacity) && (
            <div className="step-preview sap-theme">
              <div className="preview-card sap-theme">
                <h4>📋 Especificaciones técnicas</h4>

                {formData.fuelType && (
                  <div className="preview-item sap-theme">
                    <span className="preview-label sap-theme">Combustible:</span>
                    <span className="preview-value sap-theme">
                      {fuelTypeOptions.find((f) => f.type === formData.fuelType)?.icon}{' '}
                      {formData.fuelType}
                    </span>
                  </div>
                )}

                {formData.plateNumber && (
                  <div className="preview-item sap-theme">
                    <span className="preview-label sap-theme">Placa:</span>
                    <span className="preview-value sap-theme">🏷️ {formData.plateNumber}</span>
                  </div>
                )}

                {formData.enginePower && (
                  <div className="preview-item sap-theme">
                    <span className="preview-label sap-theme">Potencia:</span>
                    <span className="preview-value sap-theme">⚡ {formData.enginePower} HP</span>
                  </div>
                )}

                {formData.fuelCapacity && (
                  <div className="preview-item sap-theme">
                    <span className="preview-label sap-theme">Cap. combustible:</span>
                    <span className="preview-value sap-theme">⛽ {formData.fuelCapacity} L</span>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Indicador de navegación */}
        <div className="navigation-hint sap-theme">
          💡 Tip: Usa Enter o → para avanzar, ← para retroceder
        </div>
      </div>
    </div>
  );
};

export default Step3_Technical;
