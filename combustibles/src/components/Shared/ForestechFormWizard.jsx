/**
 * ForestechFormWizard - Componente base reutilizable para formularios tipo wizard
 * Basado en el diseño exitoso de MovementWizard con estilo Typeform
 */

import React, { useState, useEffect, useCallback } from 'react';
import './ForestechFormWizard.css';

const ForestechFormWizard = ({
  isOpen,
  onClose,
  onComplete,
  steps = [],
  initialData = {},
  title = "Formulario",
  subtitle = "Completa la información paso a paso",
  theme = "forestech", // forestech, vehicles, products, etc.
  validateStep = null, // Función personalizada de validación
  onStepChange = null, // Callback cuando cambia el paso
  extraData = {} // Datos adicionales para pasar a los componentes
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Resetear wizard cuando se abre
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormData(initialData);
      setErrors({});
      setIsLoading(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialData]);

  // Actualizar datos del formulario
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      return newData;
    });
    
    // Limpiar errores del campo actualizado
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Validar paso actual
  const validateCurrentStep = useCallback(() => {
    if (validateStep) {
      const stepErrors = validateStep(currentStep, formData);
      setErrors(stepErrors || {});
      return Object.keys(stepErrors || {}).length === 0;
    }
    return true;
  }, [currentStep, formData, validateStep]);

  // Navegar al siguiente paso
  const goToNextStep = useCallback(() => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length) {
      setIsTransitioning(true);
      
      // Transición más suave con animación escalonada
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        if (onStepChange) {
          onStepChange(currentStep + 1, formData);
        }
      }, 200);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }
  }, [currentStep, steps.length, validateCurrentStep, onStepChange, formData]);

  // Navegar al paso anterior
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      
      // Transición más suave con animación escalonada
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        if (onStepChange) {
          onStepChange(currentStep - 1, formData);
        }
      }, 200);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }
  }, [currentStep, onStepChange, formData]);

  // Completar wizard
  const handleComplete = useCallback(async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setIsLoading(true);
    try {
      await onComplete(formData);
      onClose();
    } catch (error) {
      console.error('Error al completar formulario:', error);
      setErrors({ general: error.message || 'Error al guardar los datos' });
    } finally {
      setIsLoading(false);
    }
  }, [validateCurrentStep, onComplete, formData, onClose]);

  // Navegación por teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (currentStep === steps.length) {
          handleComplete();
        } else {
          goToNextStep();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentStep, steps.length, goToNextStep, handleComplete, onClose]);

  if (!isOpen) return null;

  const progress = (currentStep / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <div className="modal-overlay">
      <div className={`wizard-overlay ${theme}`}>
        <div className="modal-content">
          <div className={`forestech-wizard-modal ${theme}`}>
            
            {/* Barra de progreso estilo Typeform */}
            <div className="typeform-progress">
              <div 
                className="typeform-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Header del wizard */}
            <div className="forestech-wizard-header">
              <div className="wizard-progress-info">
                <span className="step-counter">{currentStep} de {steps.length}</span>
                <h1 className="wizard-title">{title}</h1>
                <p className="wizard-subtitle">{subtitle}</p>
                
                {/* Mini indicadores de pasos */}
                <div className="step-indicators">
                  {steps.map((step, index) => (
                    <div 
                      key={index}
                      className={`step-indicator ${index + 1 === currentStep ? 'active' : ''} ${index + 1 < currentStep ? 'completed' : ''}`}
                      title={step.title}
                    >
                      {index + 1 < currentStep ? '✓' : index + 1}
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                className="wizard-close-btn"
                onClick={onClose}
                aria-label="Cerrar formulario"
              >
                <span>✕</span>
              </button>
            </div>

            {/* Contenido del paso actual */}
            <div className="forestech-wizard-content">
              <div className="typeform-steps-container">
                {steps.map((step, index) => {
                  const StepComponent = step.component;
                  const stepNumber = index + 1;
                  const isCurrentStep = stepNumber === currentStep;
                  const isPastStep = stepNumber < currentStep;
                  const isFutureStep = stepNumber > currentStep;
                  
                  return (
                    <div 
                      key={stepNumber}
                      className={`
                        wizard-step-slide 
                        ${isCurrentStep ? 'current' : ''}
                        ${isPastStep ? 'past' : ''}
                        ${isFutureStep ? 'future' : ''}
                        ${isTransitioning ? 'transitioning' : ''}
                      `}
                      style={{
                        transform: `translateX(${(stepNumber - currentStep) * 100}%)`,
                        opacity: isCurrentStep ? 1 : 0,
                        visibility: isCurrentStep ? 'visible' : 'hidden'
                      }}
                    >
                      <div className="step-content-wrapper">
                        <StepComponent
                          formData={formData}
                          updateFormData={updateFormData}
                          errors={errors}
                          setError={(field, message) => setErrors(prev => ({ ...prev, [field]: message }))}
                          isActive={isCurrentStep && !isTransitioning}
                          stepNumber={stepNumber}
                          totalSteps={steps.length}
                          extraData={extraData}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error general */}
            {errors.general && (
              <div className="wizard-error-general">
                <span className="error-icon">⚠️</span>
                {errors.general}
              </div>
            )}

            {/* Footer con navegación */}
            <div className="forestech-wizard-footer">
              <div className="wizard-navigation">
                {currentStep > 1 && (
                  <button 
                    className="wizard-btn wizard-btn-secondary"
                    onClick={goToPreviousStep}
                    disabled={isLoading}
                  >
                    ← Anterior
                  </button>
                )}
                
                <div className="wizard-navigation-right">
                  {currentStep < steps.length ? (
                    <button 
                      className="wizard-btn wizard-btn-primary"
                      onClick={goToNextStep}
                      disabled={isLoading || isTransitioning}
                    >
                      Siguiente →
                    </button>
                  ) : (
                    <button 
                      className="wizard-btn wizard-btn-success"
                      onClick={handleComplete}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Guardando...' : 'Completar ✓'}
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ForestechFormWizard;
