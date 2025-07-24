/**
 * Step4_Operational - Cuarto paso: Información operacional del vehículo
 * Estilo conversacional tipo Typeform con subpasos
 */

import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { VEHICLE_STATUS } from '../../../services/vehiclesService';
import './VehicleWizardSteps.css';

const Step4_Operational = ({ 
  formData, 
  updateFormData, 
  errors, 
  isActive 
}) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isSubStepTransitioning, setIsSubStepTransitioning] = useState(false);
  
  const totalSubSteps = 4;
  
  // Definir los subpasos
  const subSteps = useMemo(() => [
    {
      id: 1,
      title: 'Estado Operacional',
      question: '🚀 ¿Cuál es el estado operacional actual?',
      description: 'Esta información nos ayudará a gestionar la disponibilidad y programar mantenimientos',
      type: 'status-selection',
      hint: '🔧 El estado determina si el vehículo puede ser asignado para operaciones'
    },
    {
      id: 2,
      title: 'Ubicación',
      question: '📍 ¿Dónde se encuentra actualmente este vehículo?',
      description: 'Especifica la ubicación actual para facilitar su localización',
      type: 'input',
      field: 'currentLocation',
      placeholder: 'Ej: Almacén Central, Campo Norte, Taller Mecánico',
      hint: '🗺️ Sé específico para facilitar la localización del vehículo'
    },
    {
      id: 3,
      title: 'Horómetro',
      question: '⏱️ ¿Este vehículo tiene horómetro?',
      description: 'El horómetro nos ayuda a programar mantenimientos preventivos',
      type: 'hour-meter',
      hint: '📊 Las horas de operación son clave para el mantenimiento preventivo'
    },
    {
      id: 4,
      title: 'Fechas y Observaciones',
      question: '📅 Información adicional del vehículo',
      description: 'Fechas importantes y cualquier observación relevante',
      type: 'dates-and-notes',
      hint: '📝 Esta información nos ayuda con el historial y planificación'
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
      case 'status-selection':
        return formData.status && formData.status.trim().length > 0;
      case 'input':
        // Ubicación es opcional pero recomendada
        return true;
      case 'hour-meter':
        // Si tiene horómetro y se marcó, debe tener horas, si no, es válido
        return !formData.hasHourMeter || (formData.hasHourMeter && formData.currentHours);
      case 'dates-and-notes':
        // Todo es opcional en este paso
        return true;
      default:
        return true;
    }
  }, [currentSubStep, formData, subSteps]);

  const statusOptions = useMemo(() => [
    {
      value: VEHICLE_STATUS.ACTIVO,
      icon: '✅',
      title: 'Activo',
      description: 'En operación normal, disponible para uso',
      color: 'status-active'
    },
    {
      value: VEHICLE_STATUS.MANTENIMIENTO,
      icon: '🔧',
      title: 'En Mantenimiento',
      description: 'Mantenimiento preventivo programado',
      color: 'status-maintenance'
    },
    {
      value: VEHICLE_STATUS.REPARACION,
      icon: '⚠️',
      title: 'En Reparación',
      description: 'Requiere reparación, fuera de servicio',
      color: 'status-repair'
    },
    {
      value: VEHICLE_STATUS.INACTIVO,
      icon: '⏸️',
      title: 'Inactivo',
      description: 'Temporalmente fuera de operación',
      color: 'status-inactive'
    },
    {
      value: VEHICLE_STATUS.FUERA_DE_SERVICIO,
      icon: '❌',
      title: 'Fuera de Servicio',
      description: 'Permanentemente fuera de operación',
      color: 'status-out-of-service'
    }
  ], []);

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
  }, [isActive, currentSubStep, isCurrentSubStepValid, goToNextSubStep, goToPrevSubStep, updateFormData, statusOptions]);

  const handleInputChange = useCallback((field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    updateFormData(field, value);
  }, [updateFormData]);

  const handleStatusSelect = useCallback((status) => {
    updateFormData('status', status);
  }, [updateFormData]);

  const currentStepData = subSteps[currentSubStep - 1];
  const subStepProgress = (currentSubStep / totalSubSteps) * 100;

  return (
    <div className={`wizard-step step-operational ${isActive ? 'active' : ''}`}>
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
              {subStep.type === 'status-selection' && (
                <div className="typeform-options status-options">
                  {statusOptions.map((option, optionIndex) => (
                    <div
                      key={option.value}
                      className={`typeform-option status-option ${option.color} ${
                        formData.status === option.value ? 'selected' : ''
                      }`}
                      onClick={() => handleStatusSelect(option.value)}
                    >
                      <div className="option-header">
                        <span className="option-icon">{option.icon}</span>
                        <span className="option-number">{optionIndex + 1}</span>
                      </div>
                      <div className="option-content">
                        <h4 className="option-title">{option.title}</h4>
                        <p className="option-description">{option.description}</p>
                      </div>
                      {formData.status === option.value && (
                        <div className="selection-indicator">
                          <span className="checkmark">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {errors.status && (
                    <div className="input-error-centered">
                      <span className="error-icon">⚠️</span>
                      {errors.status}
                    </div>
                  )}
                </div>
              )}

              {subStep.type === 'input' && (
                <div className="typeform-input-group">
                  <div className="input-with-icon">
                    <span className="input-icon">📍</span>
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

              {subStep.type === 'hour-meter' && (
                <div className="typeform-section">
                  <div className="checkbox-group">
                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        checked={formData.hasHourMeter || false}
                        onChange={handleInputChange('hasHourMeter')}
                      />
                      <span className="checkbox-custom"></span>
                      <span className="checkbox-label">
                        🕐 Sí, este vehículo tiene horómetro
                      </span>
                    </label>
                  </div>
                  
                  {formData.hasHourMeter && (
                    <div className="typeform-input-group dependent-field">
                      <label className="typeform-label">
                        ¿Cuántas horas marca actualmente?
                      </label>
                      <div className="input-with-icon">
                        <span className="input-icon">⏱️</span>
                        <input
                          type="number"
                          className="typeform-input substep-input"
                          placeholder="1250.5"
                          min="0"
                          step="0.1"
                          value={formData.currentHours || ''}
                          onChange={handleInputChange('currentHours')}
                        />
                      </div>
                      {errors.currentHours && (
                        <div className="input-error">
                          <span className="error-icon">⚠️</span>
                          {errors.currentHours}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="input-hint">
                    {subStep.hint}
                  </div>
                </div>
              )}

              {subStep.type === 'dates-and-notes' && (
                <div className="dates-and-notes-section">
                  {/* Fechas importantes */}
                  <div className="typeform-row">
                    <div className="typeform-input-group">
                      <label className="typeform-label">
                        Último mantenimiento (opcional)
                      </label>
                      <div className="input-with-icon">
                        <span className="input-icon">🔧</span>
                        <input
                          type="date"
                          className="typeform-input substep-input"
                          value={formData.lastMaintenanceDate || ''}
                          onChange={handleInputChange('lastMaintenanceDate')}
                        />
                      </div>
                    </div>

                    <div className="typeform-input-group">
                      <label className="typeform-label">
                        Fecha de compra (opcional)
                      </label>
                      <div className="input-with-icon">
                        <span className="input-icon">📅</span>
                        <input
                          type="date"
                          className="typeform-input substep-input"
                          value={formData.purchaseDate || ''}
                          onChange={handleInputChange('purchaseDate')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descripción adicional */}
                  <div className="typeform-input-group">
                    <label className="typeform-label">
                      ¿Algo más que debamos saber? (opcional)
                    </label>
                    <div className="input-with-icon">
                      <span className="input-icon">📝</span>
                      <textarea
                        className="typeform-textarea substep-input"
                        placeholder="Observaciones, características especiales, modificaciones, etc."
                        rows="3"
                        value={formData.description || ''}
                        onChange={handleInputChange('description')}
                      />
                    </div>
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
        {currentSubStep === totalSubSteps && formData.status && (
          <div className="step-preview">
            <div className="preview-card">
              <h4>📋 Estado operacional</h4>
              
              <div className="preview-item">
                <span className="preview-label">Estado:</span>
                <span className="preview-value">
                  {statusOptions.find(s => s.value === formData.status)?.icon} {formData.status}
                </span>
              </div>
              
              {formData.currentLocation && (
                <div className="preview-item">
                  <span className="preview-label">Ubicación:</span>
                  <span className="preview-value">📍 {formData.currentLocation}</span>
                </div>
              )}
              
              {formData.hasHourMeter && formData.currentHours && (
                <div className="preview-item">
                  <span className="preview-label">Horómetro:</span>
                  <span className="preview-value">⏱️ {formData.currentHours} horas</span>
                </div>
              )}
              
              {formData.lastMaintenanceDate && (
                <div className="preview-item">
                  <span className="preview-label">Último mantenimiento:</span>
                  <span className="preview-value">🔧 {formData.lastMaintenanceDate}</span>
                </div>
              )}

              {formData.purchaseDate && (
                <div className="preview-item">
                  <span className="preview-label">Fecha de compra:</span>
                  <span className="preview-value">📅 {formData.purchaseDate}</span>
                </div>
              )}

              {formData.description && (
                <div className="preview-item">
                  <span className="preview-label">Observaciones:</span>
                  <span className="preview-value">📝 {formData.description}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Indicador de navegación */}
        <div className="navigation-hint">
          💡 Tip: Usa Enter o → para avanzar, ← para retroceder
          {currentSubStep === 1 && ` | Teclas 1-${statusOptions.length} para seleccionar estado`}
        </div>

      </div>
    </div>
  );
};

export default Step4_Operational;
