/**
 * Step3_Technical - Tercer paso: Especificaciones técnicas del vehículo
 * Campos técnicos con validaciones y ayudas visuales
 */

import React, { useEffect, useCallback } from 'react';
import { FUEL_TYPES } from '../../../data/vehicleCategories';
import './VehicleWizardSteps.css';

const Step3_Technical = ({ 
  formData, 
  updateFormData, 
  errors, 
  isActive 
}) => {

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      // Tab para navegar entre campos
      if (e.key === 'Tab') {
        e.preventDefault();
        const inputs = document.querySelectorAll('.technical-input');
        const currentIndex = Array.from(inputs).indexOf(e.target);
        const nextIndex = (currentIndex + 1) % inputs.length;
        inputs[nextIndex].focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive]);

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

  return (
    <div className={`wizard-step step-technical ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        
        {/* Pregunta principal */}
        <div className="typeform-question">
          <h2>⚙️ Ahora las especificaciones técnicas de <span className="highlight">{formData.name}</span></h2>
          <p>Esta información nos ayudará a gestionar mejor el combustible y mantenimiento</p>
        </div>

        {/* Selección de tipo de combustible */}
        <div className="typeform-section">
          <label className="typeform-label">
            ¿Qué tipo de combustible usa este vehículo?
          </label>
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
          </div>
          {errors.fuelType && (
            <div className="input-error">
              <span className="error-icon">⚠️</span>
              {errors.fuelType}
            </div>
          )}
        </div>

        {/* Número de placa */}
        <div className="typeform-input-group">
          <label className="typeform-label">
            ¿Cuál es el número de placa? (opcional)
          </label>
          <div className="input-with-icon">
            <span className="input-icon">🏷️</span>
            <input
              type="text"
              className="typeform-input technical-input"
              placeholder="Ej: ABC-123, XYZ-456"
              value={formData.plateNumber || ''}
              onChange={handleInputChange('plateNumber')}
            />
          </div>
          {errors.plateNumber && (
            <div className="input-error">
              <span className="error-icon">⚠️</span>
              {errors.plateNumber}
            </div>
          )}
          <div className="input-hint">
            🚗 Deja vacío si no aplica (equipos sin placa)
          </div>
        </div>

        {/* Campos técnicos en fila */}
        <div className="typeform-row">
          <div className="typeform-input-group">
            <label className="typeform-label">
              Potencia del motor (HP)
            </label>
            <div className="input-with-icon">
              <span className="input-icon">⚡</span>
              <input
                type="number"
                className="typeform-input technical-input"
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
                className="typeform-input technical-input"
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
        </div>

        {/* Preview de especificaciones */}
        {(formData.fuelType || formData.enginePower || formData.fuelCapacity) && (
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
                  <span className="preview-value">{formData.plateNumber}</span>
                </div>
              )}
              
              {formData.enginePower && (
                <div className="preview-item">
                  <span className="preview-label">Potencia:</span>
                  <span className="preview-value">{formData.enginePower} HP</span>
                </div>
              )}
              
              {formData.fuelCapacity && (
                <div className="preview-item">
                  <span className="preview-label">Cap. combustible:</span>
                  <span className="preview-value">{formData.fuelCapacity} L</span>
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
              <h4>¿Por qué necesitamos esta información?</h4>
              <ul>
                <li><strong>Tipo de combustible:</strong> Para asignar el combustible correcto</li>
                <li><strong>Potencia:</strong> Para calcular consumos estimados</li>
                <li><strong>Capacidad:</strong> Para controlar recargas y disponibilidad</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Step3_Technical;
