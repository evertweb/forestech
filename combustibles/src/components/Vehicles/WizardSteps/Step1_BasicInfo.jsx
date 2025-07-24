/**
 * Step1_BasicInfo - Primer paso: Información básica del vehículo
 * Estilo conversacional tipo Typeform con subpasos
 */

import React, { useEffect, useCallback, useState, useMemo } from 'react';
import './VehicleWizardSteps.css';

const Step1_BasicInfo = ({ 
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
      title: 'ID del Vehículo',
      question: '🚗 ¡Perfecto! Vamos a registrar un nuevo vehículo',
      description: 'Comencemos con la información básica. ¿Cuál es el ID único de este vehículo?',
      field: 'vehicleId',
      placeholder: 'Ej: TR001, CAM01, EXC001',
      hint: '💡 Usa un código único para identificar fácilmente el vehículo'
    },
    {
      id: 2,
      title: 'Nombre',
      question: '📝 ¿Cómo quieres llamar a este vehículo?',
      description: 'Un nombre descriptivo te ayudará a identificarlo rápidamente',
      field: 'name',
      placeholder: 'Ej: Tractor John Deere Principal, Camión de Carga #1',
      hint: '💭 Sé descriptivo, esto aparecerá en todas las operaciones'
    },
    {
      id: 3,
      title: 'Marca',
      question: '🏭 ¿Cuál es la marca del vehículo?',
      description: 'Especifica el fabricante o marca del vehículo',
      field: 'brand',
      placeholder: 'Ej: John Deere, Caterpillar, Mercedes',
      hint: '🏢 La marca nos ayuda con repuestos y mantenimiento'
    },
    {
      id: 4,
      title: 'Modelo',
      question: '🔧 ¿Cuál es el modelo específico?',
      description: 'El modelo nos da detalles técnicos específicos',
      field: 'model',
      placeholder: 'Ej: 5090E, 320D, Actros',
      hint: '📋 Revisa la placa o documentación si no estás seguro'
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
    const value = formData[currentStep.field];
    return value && value.trim().length > 0;
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

  const currentStepData = subSteps[currentSubStep - 1];
  const subStepProgress = (currentSubStep / totalSubSteps) * 100;

  return (
    <div className={`wizard-step step-basic-info ${isActive ? 'active' : ''}`}>
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

              {/* Input del subpaso */}
              <div className="typeform-input-group">
                <div className="input-with-icon">
                  <span className="input-icon">
                    {subStep.field === 'vehicleId' && '🏷️'}
                    {subStep.field === 'name' && '📝'}
                    {subStep.field === 'brand' && '🏭'}
                    {subStep.field === 'model' && '🔧'}
                  </span>
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

        {/* Resumen visual (solo mostrar cuando se hayan completado algunos campos) */}
        {currentSubStep === totalSubSteps && formData.vehicleId && formData.name && (
          <div className="step-preview">
            <div className="preview-card">
              <h4>📋 Vista previa</h4>
              <div className="preview-item">
                <span className="preview-label">ID:</span>
                <span className="preview-value">{formData.vehicleId}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Nombre:</span>
                <span className="preview-value">{formData.name}</span>
              </div>
              {formData.brand && formData.model && (
                <div className="preview-item">
                  <span className="preview-label">Marca/Modelo:</span>
                  <span className="preview-value">{formData.brand} {formData.model}</span>
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

export default Step1_BasicInfo;
