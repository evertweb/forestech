/**
 * Step1_BasicInfo - Primer paso: Información básica de la categoría
 * Nombre, descripción y tipos de combustible compatibles
 */

import React, { useEffect, useCallback } from 'react';
import '../WizardSteps/VehicleWizardSteps.css';

const Step1_BasicInfo = ({ formData, updateFormData, errors, isActive }) => {
  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      // Enter para ir al siguiente campo
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
        const inputs = document.querySelectorAll('.category-basic-input');
        const currentIndex = Array.from(inputs).indexOf(e.target);
        if (currentIndex < inputs.length - 1) {
          inputs[currentIndex + 1].focus();
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive]);

  const handleInputChange = useCallback(
    (field) => (e) => {
      updateFormData(field, e.target.value);
    },
    [updateFormData]
  );

  const handleFuelTypeToggle = useCallback(
    (fuelType) => {
      const currentFuelTypes = formData.fuelTypes || [];
      if (currentFuelTypes.includes(fuelType)) {
        // Remover si ya está seleccionado
        updateFormData(
          'fuelTypes',
          currentFuelTypes.filter((type) => type !== fuelType)
        );
      } else {
        // Agregar si no está seleccionado
        updateFormData('fuelTypes', [...currentFuelTypes, fuelType]);
      }
    },
    [formData.fuelTypes, updateFormData]
  );

  const fuelTypeOptions = [
    {
      type: 'DIESEL',
      icon: '🛢️',
      title: 'Diésel',
      description: 'Para maquinaria pesada y tractores',
      color: 'fuel-diesel',
    },
    {
      type: 'GASOLINE',
      icon: '⛽',
      title: 'Gasolina',
      description: 'Para vehículos ligeros y herramientas',
      color: 'fuel-gasoline',
    },
    {
      type: 'MIXED',
      icon: '🔄',
      title: 'Mixed',
      description: 'Compatible con múltiples combustibles',
      color: 'fuel-mixed',
    },
  ];

  return (
    <div className={`wizard-step step-category-basic ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        {/* Pregunta principal */}
        <div className="typeform-question">
          <h2>🏷️ ¡Excelente! Vamos a crear una nueva categoría de vehículo</h2>
          <p>Primero, necesitamos la información básica. ¿Cómo se llamará esta categoría?</p>
        </div>

        {/* Campo nombre de la categoría */}
        <div className="typeform-input-group">
          <div className="input-with-icon">
            <span className="input-icon">📝</span>
            <input
              type="text"
              className="typeform-input category-basic-input"
              placeholder="Ej: Tractores, Camiones de Carga, Excavadoras"
              value={formData.name || ''}
              onChange={handleInputChange('name')}
              autoFocus
            />
          </div>
          {errors.name && (
            <div className="input-error">
              <span className="error-icon">⚠️</span>
              {errors.name}
            </div>
          )}
          <div className="input-hint">
            💡 Usa un nombre descriptivo que identifique claramente el tipo de vehículo
          </div>
        </div>

        {/* Campo descripción */}
        <div className="typeform-input-group">
          <label className="typeform-label">Ahora describe brevemente esta categoría</label>
          <div className="input-with-icon">
            <span className="input-icon">📋</span>
            <textarea
              className="typeform-textarea category-basic-input"
              placeholder="Ej: Vehículos agrícolas para labores de campo, incluye tractores de diferentes potencias"
              rows="3"
              value={formData.description || ''}
              onChange={handleInputChange('description')}
            />
          </div>
          {errors.description && (
            <div className="input-error">
              <span className="error-icon">⚠️</span>
              {errors.description}
            </div>
          )}
          <div className="input-hint">
            📝 Esta descripción ayudará a los usuarios a entender qué tipos de vehículos incluye
          </div>
        </div>

        {/* Selección de tipos de combustible */}
        <div className="typeform-section">
          <label className="typeform-label">
            ¿Qué tipos de combustible usan los vehículos de esta categoría?
          </label>
          <div className="typeform-options fuel-options">
            {fuelTypeOptions.map((option) => {
              const isSelected = (formData.fuelTypes || []).includes(option.type);
              return (
                <div
                  key={option.type}
                  className={`typeform-option fuel-option ${option.color} ${
                    isSelected ? 'selected' : ''
                  }`}
                  onClick={() => handleFuelTypeToggle(option.type)}
                >
                  <div className="option-header">
                    <span className="option-icon">{option.icon}</span>
                  </div>
                  <div className="option-content">
                    <h4 className="option-title">{option.title}</h4>
                    <p className="option-description">{option.description}</p>
                  </div>
                  {isSelected && (
                    <div className="selection-indicator">
                      <span className="checkmark">✓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {errors.fuelTypes && (
            <div className="input-error-centered">
              <span className="error-icon">⚠️</span>
              {errors.fuelTypes}
            </div>
          )}
          <div className="navigation-hint">
            💡 Puedes seleccionar múltiples tipos de combustible
          </div>
        </div>

        {/* Preview de la información básica */}
        {formData.name && formData.description && (
          <div className="step-preview">
            <div className="preview-card">
              <h4>📋 Vista previa de la categoría</h4>
              <div className="preview-item">
                <span className="preview-label">Nombre:</span>
                <span className="preview-value highlight">{formData.name}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Descripción:</span>
                <span className="preview-value">{formData.description}</span>
              </div>
              {formData.fuelTypes && formData.fuelTypes.length > 0 && (
                <div className="preview-item">
                  <span className="preview-label">Combustibles:</span>
                  <span className="preview-value">
                    {formData.fuelTypes
                      .map((type) => {
                        const option = fuelTypeOptions.find((opt) => opt.type === type);
                        return option ? `${option.icon} ${type}` : type;
                      })
                      .join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="info-section">
          <div className="info-card">
            <span className="info-icon">💡</span>
            <div className="info-content">
              <h4>¿Para qué sirve crear categorías?</h4>
              <ul>
                <li>
                  <strong>Organización:</strong> Agrupa vehículos similares
                </li>
                <li>
                  <strong>Campos personalizados:</strong> Define información específica
                </li>
                <li>
                  <strong>Gestión eficiente:</strong> Facilita búsquedas y filtros
                </li>
                <li>
                  <strong>Reportes:</strong> Genera estadísticas por tipo de vehículo
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_BasicInfo;
