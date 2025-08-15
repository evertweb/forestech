/**
 * Step4_Operational - Cuarto paso: Información operacional del vehículo
 * Estilo conversacional tipo Typeform con subpasos
 */

import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { VEHICLE_STATUS } from '../../../services/vehiclesService';
import './VehicleWizardSteps.css';

const Step4_Operational = ({ formData, updateFormData, errors, isActive, extraData }) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isSubStepTransitioning, setIsSubStepTransitioning] = useState(false);

  const { categories = [] } = extraData || {};

  // Encontrar la categoría seleccionada
  const selectedCategory = categories.find((cat) => cat.id === formData.category);

  // Verificar si la categoría incluye el campo hasHourMeter
  const categoryHasHourMeter =
    selectedCategory && selectedCategory.fields && selectedCategory.fields.includes('hasHourMeter');

  // Si la categoría incluye horómetro, heredarlo automáticamente
  React.useEffect(() => {
    if (categoryHasHourMeter && formData.hasHourMeter === undefined) {
      console.log('🔄 Heredando hasHourMeter=true de categoría:', selectedCategory.name);
      updateFormData('hasHourMeter', true);
    }
  }, [categoryHasHourMeter, formData.hasHourMeter, updateFormData, selectedCategory]);

  // Determinar si necesitamos mostrar la pregunta del horómetro
  const shouldShowHourMeterQuestion = !categoryHasHourMeter;

  const totalSubSteps = shouldShowHourMeterQuestion ? 4 : 3;

  // Definir los subpasos dinámicamente según la categoría
  const subSteps = useMemo(() => {
    const steps = [];

    // Siempre agregar estado operacional
    steps.push({
      id: steps.length + 1,
      title: 'Estado Operacional',
      question: '🚀 ¿Cuál es el estado operacional actual?',
      description:
        'Esta información nos ayudará a gestionar la disponibilidad y programar mantenimientos',
      type: 'status-selection',
      hint: '🔧 El estado determina si el vehículo puede ser asignado para operaciones',
    });

    // Siempre agregar ubicación
    steps.push({
      id: steps.length + 1,
      title: 'Ubicación',
      question: '📍 ¿Dónde se encuentra actualmente este vehículo?',
      description: 'Especifica la ubicación actual para facilitar su localización',
      type: 'input',
      field: 'currentLocation',
      placeholder: 'Ej: Almacén Central, Campo Norte, Taller Mecánico',
      hint: '🗺️ Sé específico para facilitar la localización del vehículo',
    });

    // Solo agregar pregunta de horómetro si la categoría no lo define
    if (shouldShowHourMeterQuestion) {
      steps.push({
        id: steps.length + 1,
        title: 'Horómetro',
        question: '⏱️ ¿Este vehículo tiene horómetro?',
        description: 'El horómetro nos ayuda a programar mantenimientos preventivos',
        type: 'hour-meter',
        hint: '📊 Las horas de operación son clave para el mantenimiento preventivo',
      });
    } else {
      // Si la categoría tiene horómetro, preguntar directamente por las horas
      steps.push({
        id: steps.length + 1,
        title: 'Horas del Horómetro',
        question: '⏰ ¿Cuántas horas marca actualmente el horómetro?',
        description: `La categoría "${selectedCategory?.name}" incluye horómetro. Ingresa las horas actuales.`,
        type: 'hour-meter-value',
        hint: '📊 Las horas actuales son importantes para el programa de mantenimiento',
      });
    }

    // Siempre agregar fechas y observaciones
    steps.push({
      id: steps.length + 1,
      title: 'Fechas y Observaciones',
      question: '📅 Información adicional del vehículo',
      description: 'Fechas importantes y cualquier observación relevante',
      type: 'dates-and-notes',
      hint: '📝 Esta información nos ayuda con el historial y planificación',
    });

    return steps;
  }, [shouldShowHourMeterQuestion, selectedCategory]);

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
      case 'status-selection':
        return formData.status && formData.status.trim().length > 0;
      case 'input':
        // Ubicación es opcional pero recomendada
        return true;
      case 'hour-meter':
        // Si tiene horómetro y se marcó, debe tener horas, si no, es válido
        return !formData.hasHourMeter || (formData.hasHourMeter && formData.currentHours);
      case 'hour-meter-value':
        // Para horómetro heredado, las horas son opcionales pero recomendadas
        return true; // Permitir continuar aunque no haya horas
      case 'dates-and-notes':
        // Todo es opcional en este paso
        return true;
      default:
        return true;
    }
  }, [currentSubStep, formData, subSteps]);

  const statusOptions = useMemo(
    () => [
      {
        value: VEHICLE_STATUS.ACTIVO,
        icon: '✅',
        title: 'Activo',
        description: 'En operación normal, disponible para uso',
        color: 'status-active',
      },
      {
        value: VEHICLE_STATUS.MANTENIMIENTO,
        icon: '🔧',
        title: 'En Mantenimiento',
        description: 'Mantenimiento preventivo programado',
        color: 'status-maintenance',
      },
      {
        value: VEHICLE_STATUS.REPARACION,
        icon: '⚠️',
        title: 'En Reparación',
        description: 'Requiere reparación, fuera de servicio',
        color: 'status-repair',
      },
      {
        value: VEHICLE_STATUS.INACTIVO,
        icon: '⏸️',
        title: 'Inactivo',
        description: 'Temporalmente fuera de operación',
        color: 'status-inactive',
      },
      {
        value: VEHICLE_STATUS.FUERA_DE_SERVICIO,
        icon: '❌',
        title: 'Fuera de Servicio',
        description: 'Permanentemente fuera de operación',
        color: 'status-out-of-service',
      },
    ],
    []
  );

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
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

      // Numbers 1-5 para seleccionar estado (solo en el subpaso de estado)
      if (currentSubStep === 1) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= statusOptions.length) {
          const selectedStatus = statusOptions[num - 1];
          updateFormData('status', selectedStatus.value);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    isActive,
    currentSubStep,
    isCurrentSubStepValid,
    goToNextSubStep,
    goToPrevSubStep,
    updateFormData,
    statusOptions,
  ]);

  const handleInputChange = useCallback(
    (field) => (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      updateFormData(field, value);
    },
    [updateFormData]
  );

  const handleStatusSelect = useCallback(
    (status) => {
      updateFormData('status', status);
    },
    [updateFormData]
  );

  const currentStepData = subSteps[currentSubStep - 1];
  const subStepProgress = (currentSubStep / totalSubSteps) * 100;

  return (
    <div className={`wizard-step step-operational ${isActive ? 'active' : ''}`}>
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
              <div className="typeform-question sap-theme">
                <h2>{subStep.question}</h2>
                <p>{subStep.description}</p>
              </div>

              {/* Contenido específico por tipo de subpaso */}
              {subStep.type === 'status-selection' && (
                <div className="typeform-options status-options sap-theme">
                  {statusOptions.map((option, optionIndex) => (
                    <div
                      key={option.value}
                      className={`typeform-option status-option ${option.color} ${
                        formData.status === option.value ? 'selected' : ''
                      }`}
                      onClick={() => handleStatusSelect(option.value)}
                    >
                      <div className="option-header sap-theme">
                        <span className="option-icon sap-theme">{option.icon}</span>
                        <span className="option-number sap-theme">{optionIndex + 1}</span>
                      </div>
                      <div className="option-content sap-theme">
                        <h4 className="option-title sap-theme">{option.title}</h4>
                        <p className="option-description sap-theme">{option.description}</p>
                      </div>
                      {formData.status === option.value && (
                        <div className="selection-indicator sap-theme">
                          <span className="checkmark sap-theme">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {errors.status && (
                    <div className="input-error-centered sap-theme">
                      <span className="error-icon sap-theme">⚠️</span>
                      {errors.status}
                    </div>
                  )}
                </div>
              )}

              {subStep.type === 'input' && (
                <div className="typeform-input-group sap-theme">
                  <div className="input-with-icon sap-theme">
                    <span className="input-icon sap-theme">📍</span>
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

              {subStep.type === 'hour-meter' && (
                <div className="typeform-section sap-theme">
                  <div className="checkbox-group sap-theme">
                    <label className="checkbox-option sap-theme">
                      <input
                        type="checkbox"
                        checked={formData.hasHourMeter || false}
                        onChange={handleInputChange('hasHourMeter')}
                      />
                      <span className="checkbox-custom sap-theme"></span>
                      <span className="checkbox-label sap-theme">
                        🕐 Sí, este vehículo tiene horómetro
                      </span>
                    </label>
                  </div>

                  {formData.hasHourMeter && (
                    <div className="typeform-input-group dependent-field sap-theme">
                      <label className="typeform-label sap-theme">
                        ¿Cuántas horas marca actualmente?
                      </label>
                      <div className="input-with-icon sap-theme">
                        <span className="input-icon sap-theme">⏱️</span>
                        <input
                          type="number"
                          className="typeform-input substep-input sap-theme"
                          placeholder="1250.5"
                          min="0"
                          step="0.1"
                          value={formData.currentHours || ''}
                          onChange={handleInputChange('currentHours')}
                        />
                      </div>
                      {errors.currentHours && (
                        <div className="input-error sap-theme">
                          <span className="error-icon sap-theme">⚠️</span>
                          {errors.currentHours}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="input-hint sap-theme">{subStep.hint}</div>
                </div>
              )}

              {subStep.type === 'hour-meter-value' && (
                <div className="typeform-section sap-theme">
                  {/* Mensaje informativo sobre horómetro heredado */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '16px',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>⏰</span>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          Horómetro incluido automáticamente
                        </div>
                        <div style={{ fontSize: '12px', opacity: '0.9' }}>
                          La categoría "{selectedCategory?.name}" incluye horómetro por defecto
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campo para ingresar horas */}
                  <div className="typeform-input-group sap-theme">
                    <label className="typeform-label sap-theme">
                      Horas actuales del horómetro (opcional)
                    </label>
                    <div className="input-with-icon sap-theme">
                      <span className="input-icon sap-theme">⏰</span>
                      <input
                        type="number"
                        className="typeform-input substep-input sap-theme"
                        placeholder="1250.5"
                        min="0"
                        step="0.1"
                        value={formData.currentHours || ''}
                        onChange={handleInputChange('currentHours')}
                        autoFocus={index + 1 === currentSubStep}
                      />
                    </div>
                    {errors.currentHours && (
                      <div className="input-error sap-theme">
                        <span className="error-icon sap-theme">⚠️</span>
                        {errors.currentHours}
                      </div>
                    )}
                    <div className="input-hint sap-theme">{subStep.hint}</div>
                  </div>
                </div>
              )}

              {subStep.type === 'dates-and-notes' && (
                <div className="dates-and-notes-section sap-theme">
                  {/* Fechas importantes */}
                  <div className="typeform-row sap-theme">
                    <div className="typeform-input-group sap-theme">
                      <label className="typeform-label sap-theme">
                        Último mantenimiento (opcional)
                      </label>
                      <div className="input-with-icon sap-theme">
                        <span className="input-icon sap-theme">🔧</span>
                        <input
                          type="date"
                          className="typeform-input substep-input sap-theme"
                          value={formData.lastMaintenanceDate || ''}
                          onChange={handleInputChange('lastMaintenanceDate')}
                        />
                      </div>
                    </div>

                    <div className="typeform-input-group sap-theme">
                      <label className="typeform-label sap-theme">Fecha de compra (opcional)</label>
                      <div className="input-with-icon sap-theme">
                        <span className="input-icon sap-theme">📅</span>
                        <input
                          type="date"
                          className="typeform-input substep-input sap-theme"
                          value={formData.purchaseDate || ''}
                          onChange={handleInputChange('purchaseDate')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descripción adicional */}
                  <div className="typeform-input-group sap-theme">
                    <label className="typeform-label sap-theme">
                      ¿Algo más que debamos saber? (opcional)
                    </label>
                    <div className="input-with-icon sap-theme">
                      <span className="input-icon sap-theme">📝</span>
                      <textarea
                        className="typeform-textarea substep-input sap-theme"
                        placeholder="Observaciones, características especiales, modificaciones, etc."
                        rows="3"
                        value={formData.description || ''}
                        onChange={handleInputChange('description')}
                      />
                    </div>
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
        {currentSubStep === totalSubSteps && formData.status && (
          <div className="step-preview sap-theme">
            <div className="preview-card sap-theme">
              <h4>📋 Estado operacional</h4>

              <div className="preview-item sap-theme">
                <span className="preview-label sap-theme">Estado:</span>
                <span className="preview-value sap-theme">
                  {statusOptions.find((s) => s.value === formData.status)?.icon} {formData.status}
                </span>
              </div>

              {formData.currentLocation && (
                <div className="preview-item sap-theme">
                  <span className="preview-label sap-theme">Ubicación:</span>
                  <span className="preview-value sap-theme">📍 {formData.currentLocation}</span>
                </div>
              )}

              {formData.hasHourMeter && formData.currentHours && (
                <div className="preview-item sap-theme">
                  <span className="preview-label sap-theme">Horómetro:</span>
                  <span className="preview-value sap-theme">⏱️ {formData.currentHours} horas</span>
                </div>
              )}

              {formData.lastMaintenanceDate && (
                <div className="preview-item sap-theme">
                  <span className="preview-label sap-theme">Último mantenimiento:</span>
                  <span className="preview-value sap-theme">🔧 {formData.lastMaintenanceDate}</span>
                </div>
              )}

              {formData.purchaseDate && (
                <div className="preview-item sap-theme">
                  <span className="preview-label sap-theme">Fecha de compra:</span>
                  <span className="preview-value sap-theme">📅 {formData.purchaseDate}</span>
                </div>
              )}

              {formData.description && (
                <div className="preview-item sap-theme">
                  <span className="preview-label sap-theme">Observaciones:</span>
                  <span className="preview-value sap-theme">📝 {formData.description}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Indicador de navegación */}
        <div className="navigation-hint sap-theme">
          💡 Tip: Usa Enter o → para avanzar, ← para retroceder
          {currentSubStep === 1 && ` | Teclas 1-${statusOptions.length} para seleccionar estado`}
        </div>
      </div>
    </div>
  );
};

export default Step4_Operational;
