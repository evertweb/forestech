/**
 * Step3_Technical - Tercer paso: Especificaciones técnicas del vehículo
 * Estilo conversacional tipo Typeform con subpasos
 */

import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { FUEL_TYPES } from '../../../data/vehicleCategories';
import './VehicleWizardSteps.css';

const Step3_Technical = ({ formData, updateFormData, errors, isActive, extraData }) => {
  console.log('🚨 Step3_Technical CARGADO - NUEVOS CAMBIOS APLICADOS!');

  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isSubStepTransitioning, setIsSubStepTransitioning] = useState(false);

  const { categories = [] } = extraData || {};

  // Encontrar la categoría seleccionada
  const selectedCategory = categories.find((cat) => cat.id === formData.category);

  // DEBUG: Agregar logging detallado
  React.useEffect(() => {
    console.log('🔍 DEBUG Step3_Technical:');
    console.log('- formData.category:', formData.category);
    console.log(
      '- categories disponibles:',
      categories.map((c) => ({ id: c.id, name: c.name, fuelTypes: c.fuelTypes }))
    );
    console.log('- selectedCategory:', selectedCategory);
    console.log('- selectedCategory.fuelTypes:', selectedCategory?.fuelTypes);
    console.log('- fuelTypes.length:', selectedCategory?.fuelTypes?.length);
  }, [formData.category, categories, selectedCategory]);

  // Determinar si necesitamos mostrar el campo de tipo de combustible
  const shouldShowFuelSelection =
    !selectedCategory || !selectedCategory.fuelTypes || selectedCategory.fuelTypes.length !== 1;

  console.log('🎯 shouldShowFuelSelection:', shouldShowFuelSelection, {
    hasCategory: !!selectedCategory,
    hasFuelTypes: !!selectedCategory?.fuelTypes,
    fuelTypesLength: selectedCategory?.fuelTypes?.length,
  });

  // Si la categoría tiene exactamente un tipo de combustible, heredarlo automáticamente
  React.useEffect(() => {
    if (
      selectedCategory &&
      selectedCategory.fuelTypes &&
      selectedCategory.fuelTypes.length === 1 &&
      !formData.fuelType
    ) {
      console.log('🔄 Heredando tipo de combustible de categoría:', selectedCategory.fuelTypes[0]);
      updateFormData('fuelType', selectedCategory.fuelTypes[0]);
    }
  }, [selectedCategory, formData.fuelType, updateFormData]);

  const totalSubSteps = shouldShowFuelSelection ? 3 : 2;

  // Definir los subpasos dinámicamente según la categoría seleccionada
  const subSteps = useMemo(() => {
    const steps = [];

    // Solo agregar el paso de combustible si es necesario
    if (shouldShowFuelSelection) {
      steps.push({
        id: steps.length + 1,
        title: 'Tipo de Combustible',
        question:
          selectedCategory && selectedCategory.fuelTypes?.length > 1
            ? `⛽ Esta categoría soporta ${selectedCategory.fuelTypes.join(' y ')}. ¿Cuál usa este vehículo?`
            : '⛽ ¿Qué tipo de combustible usa este vehículo?',
        description: 'Esta información es crucial para la gestión de combustible y mantenimiento',
        type: 'fuel-selection',
        hint: selectedCategory
          ? `💡 Categoría "${selectedCategory.name}" - combustibles permitidos: ${selectedCategory.fuelTypes?.join(', ') || 'todos'}`
          : '💡 La mayoría de tractores y maquinaria pesada usa diésel',
      });
    }

    // Siempre agregar el paso de placa
    steps.push({
      id: steps.length + 1,
      title: 'Número de Placa',
      question: '🏷️ ¿Cuál es el número de placa de este vehículo?',
      description:
        'Si el vehículo tiene placa, especifícala aquí. Es opcional para equipos sin placa.',
      type: 'input',
      field: 'plateNumber',
      placeholder: 'Ej: ABC-123, XYZ-456',
      hint: '🚗 Deja vacío si no aplica (equipos sin placa)',
    });

    // Siempre agregar el paso de especificaciones técnicas
    steps.push({
      id: steps.length + 1,
      title: 'Especificaciones Técnicas',
      question: '🔧 ¿Cuáles son las especificaciones técnicas?',
      description: 'Ingresa la potencia del motor y/o capacidad del tanque si están disponibles',
      type: 'technical-specs',
      hint: '⚡ Especifica al menos uno de los dos campos',
    });

    return steps;
  }, [shouldShowFuelSelection, selectedCategory]);

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

  // Filtrar opciones de combustible según la categoría seleccionada
  const allFuelTypeOptions = [
    {
      type: FUEL_TYPES.DIESEL,
      icon: '🛢️',
      title: 'Diésel',
      description: 'Para tractores, excavadoras y maquinaria pesada',
      color: 'fuel-diesel',
    },
    {
      type: FUEL_TYPES.GASOLINE,
      icon: '⛽',
      title: 'Gasolina',
      description: 'Para vehículos ligeros y herramientas menores',
      color: 'fuel-gasoline',
    },
    {
      type: FUEL_TYPES.MIXED,
      icon: '🔄',
      title: 'Mixed',
      description: 'Puede usar tanto DIESEL como gasolina',
      color: 'fuel-mixed',
    },
  ];

  // Filtrar según los tipos permitidos por la categoría
  const fuelTypeOptions =
    selectedCategory && selectedCategory.fuelTypes
      ? allFuelTypeOptions.filter((option) => selectedCategory.fuelTypes.includes(option.type))
      : allFuelTypeOptions;

  const currentStepData = subSteps[currentSubStep - 1];
  const subStepProgress = (currentSubStep / totalSubSteps) * 100;

  return (
    <div className={`wizard-step step-technical ${isActive ? 'active' : ''}`}>
      <div className="apple-card">
        {/* Mensaje informativo si el combustible se hereda automáticamente */}
        {!shouldShowFuelSelection && selectedCategory && (
          <div
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
              zIndex: 1000,
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>⛽</span>
              <div>
                <div style={{ fontWeight: '600' }}>Combustible heredado</div>
                <div style={{ fontSize: '12px', opacity: '0.9' }}>
                  {selectedCategory.name}: {selectedCategory.fuelTypes?.[0]}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Indicador de progreso de subpasos */}
        <div className="apple-progress-bar">
          <div className="apple-progress-bar">
            <div
              className="apple-progress-fill"
              style={{ width: `${subStepProgress}%` }}
            />
          </div>
          <div className="apple-status-badge">
            {currentSubStep} de {totalSubSteps} - {currentStepData.title}
          </div>
        </div>

        {/* Contenedor de subpasos */}
        <div className="apple-card">
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
              <div className="apple-card">
                <h3>{subStep.question}</h3>
                <p>{subStep.description}</p>
              </div>

              {/* Contenido específico por tipo de subpaso */}
              {subStep.type === 'fuel-selection' && (
                <div className="apple-stats-grid">
                  {fuelTypeOptions.map((option) => (
                    <div
                      key={option.type}
                      className={`apple-card ${
                        formData.fuelType === option.type ? 'selected' : ''
                      }`}
                      onClick={() => handleFuelTypeSelect(option.type)}
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <div className="apple-form-label">
                        {option.icon} {option.title}
                      </div>
                      <div className="apple-form-input">{option.description}</div>
                      {formData.fuelType === option.type && (
                        <div className="apple-status-badge">
                          <span className="apple-status-badge">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {errors.fuelType && (
                    <div className="apple-form-error">
                      <span className="apple-form-error">⚠️</span>
                      {errors.fuelType}
                    </div>
                  )}
                </div>
              )}

              {subStep.type === 'input' && (
                <div className="apple-form-group">
                  <div className="apple-form-input">
                    <span className="apple-form-input">🏷️</span>
                    <input
                      type="text"
                      className="apple-form-input"
                      placeholder={subStep.placeholder}
                      value={formData[subStep.field] || ''}
                      onChange={handleInputChange(subStep.field)}
                      autoFocus={index + 1 === currentSubStep}
                    />
                  </div>

                  {errors[subStep.field] && (
                    <div className="apple-form-error">
                      <span className="apple-form-error">⚠️</span>
                      {errors[subStep.field]}
                    </div>
                  )}

                  <div className="apple-form-label">{subStep.hint}</div>
                </div>
              )}

              {subStep.type === 'technical-specs' && (
                <div className="apple-card">
                  <div className="apple-form-group">
                    <label className="apple-form-label">Potencia del motor (HP)</label>
                    <div className="apple-form-input">
                      <span className="apple-form-input">⚡</span>
                      <input
                        type="number"
                        className="apple-form-input"
                        placeholder="150"
                        min="1"
                        step="1"
                        value={formData.enginePower || ''}
                        onChange={handleInputChange('enginePower')}
                      />
                    </div>
                    {errors.enginePower && (
                      <div className="apple-form-error">
                        <span className="apple-form-error">⚠️</span>
                        {errors.enginePower}
                      </div>
                    )}
                  </div>

                  <div className="apple-form-group">
                    <label className="apple-form-label">Capacidad de combustible (L)</label>
                    <div className="apple-form-input">
                      <span className="apple-form-input">⛽</span>
                      <input
                        type="number"
                        className="apple-form-input"
                        placeholder="200"
                        min="1"
                        step="0.1"
                        value={formData.fuelCapacity || ''}
                        onChange={handleInputChange('fuelCapacity')}
                      />
                    </div>
                    {errors.fuelCapacity && (
                      <div className="apple-form-error">
                        <span className="apple-form-error">⚠️</span>
                        {errors.fuelCapacity}
                      </div>
                    )}
                  </div>

                  <div className="apple-form-label">{subStep.hint}</div>
                </div>
              )}

              {/* Navegación de subpasos */}
              <div className="apple-action-buttons">
                {currentSubStep > 1 && (
                  <button
                    type="button"
                    className="apple-button apple-button-secondary"
                    onClick={goToPrevSubStep}
                  >
                    ← Anterior
                  </button>
                )}

                {currentSubStep < totalSubSteps && (
                  <button
                    type="button"
                    className={`apple-button apple-button-primary ${!isCurrentSubStepValid() ? 'disabled' : ''}`}
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
            <div className="apple-card">
              <div className="apple-card">
                <h4>📋 Especificaciones técnicas</h4>

                {formData.fuelType && (
                  <div className="apple-card">
                    <span className="apple-form-label">Combustible:</span>
                    <span className="apple-form-input">
                      {fuelTypeOptions.find((f) => f.type === formData.fuelType)?.icon}{' '}
                      {formData.fuelType}
                    </span>
                  </div>
                )}

                {formData.plateNumber && (
                  <div className="apple-card">
                    <span className="apple-form-label">Placa:</span>
                    <span className="apple-form-input">🏷️ {formData.plateNumber}</span>
                  </div>
                )}

                {formData.enginePower && (
                  <div className="apple-card">
                    <span className="apple-form-label">Potencia:</span>
                    <span className="apple-form-input">⚡ {formData.enginePower} HP</span>
                  </div>
                )}

                {formData.fuelCapacity && (
                  <div className="apple-card">
                    <span className="apple-form-label">Cap. combustible:</span>
                    <span className="apple-form-input">⛽ {formData.fuelCapacity} L</span>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Indicador de navegación */}
        <div className="apple-status-badge">
          💡 Tip: Usa Enter o → para avanzar, ← para retroceder
        </div>
      </div>
    </div>
  );
};

export default Step3_Technical;
