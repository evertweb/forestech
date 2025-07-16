/**
 * Step1_BasicInfo - Primer paso: Información básica del vehículo
 * Estilo conversacional tipo Typeform
 */

import React, { useEffect, useCallback } from 'react';
import './VehicleWizardSteps.css';

const Step1_BasicInfo = ({ 
  formData, 
  updateFormData, 
  errors, 
  isActive 
}) => {

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      // Enter para ir al siguiente campo
      if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
        const inputs = document.querySelectorAll('.basic-info-input');
        const currentIndex = Array.from(inputs).indexOf(e.target);
        if (currentIndex < inputs.length - 1) {
          inputs[currentIndex + 1].focus();
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive]);

  const handleInputChange = useCallback((field) => (e) => {
    updateFormData(field, e.target.value);
  }, [updateFormData]);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1980 + 2 }, 
    (_, i) => currentYear + 1 - i
  );

  return (
    <div className={`wizard-step step-basic-info ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        
        {/* Pregunta principal */}
        <div className="typeform-question">
          <h2>🚗 ¡Perfecto! Vamos a registrar un nuevo vehículo</h2>
          <p>Comencemos con la información básica. ¿Cuál es el ID único de este vehículo?</p>
        </div>

        {/* Campo ID del vehículo */}
        <div className="typeform-input-group">
          <div className="input-with-icon">
            <span className="input-icon">🏷️</span>
            <input
              type="text"
              className="typeform-input basic-info-input"
              placeholder="Ej: TR001, CAM01, EXC001"
              value={formData.vehicleId || ''}
              onChange={handleInputChange('vehicleId')}
              autoFocus
            />
          </div>
          {errors.vehicleId && (
            <div className="input-error">
              <span className="error-icon">⚠️</span>
              {errors.vehicleId}
            </div>
          )}
          <div className="input-hint">
            💡 Usa un código único para identificar fácilmente el vehículo
          </div>
        </div>

        {/* Campo nombre del vehículo */}
        <div className="typeform-input-group">
          <label className="typeform-label">
            ¿Cómo quieres llamar a este vehículo?
          </label>
          <div className="input-with-icon">
            <span className="input-icon">📝</span>
            <input
              type="text"
              className="typeform-input basic-info-input"
              placeholder="Ej: Tractor John Deere Principal, Camión de Carga #1"
              value={formData.name || ''}
              onChange={handleInputChange('name')}
            />
          </div>
          {errors.name && (
            <div className="input-error">
              <span className="error-icon">⚠️</span>
              {errors.name}
            </div>
          )}
        </div>

        {/* Campos marca y modelo en fila */}
        <div className="typeform-row">
          <div className="typeform-input-group">
            <label className="typeform-label">Marca</label>
            <div className="input-with-icon">
              <span className="input-icon">🏭</span>
              <input
                type="text"
                className="typeform-input basic-info-input"
                placeholder="Ej: John Deere, Caterpillar, Mercedes"
                value={formData.brand || ''}
                onChange={handleInputChange('brand')}
              />
            </div>
            {errors.brand && (
              <div className="input-error">
                <span className="error-icon">⚠️</span>
                {errors.brand}
              </div>
            )}
          </div>

          <div className="typeform-input-group">
            <label className="typeform-label">Modelo</label>
            <div className="input-with-icon">
              <span className="input-icon">🔧</span>
              <input
                type="text"
                className="typeform-input basic-info-input"
                placeholder="Ej: 5090E, 320D, Actros"
                value={formData.model || ''}
                onChange={handleInputChange('model')}
              />
            </div>
            {errors.model && (
              <div className="input-error">
                <span className="error-icon">⚠️</span>
                {errors.model}
              </div>
            )}
          </div>
        </div>

        {/* Campo año */}
        <div className="typeform-input-group">
          <label className="typeform-label">
            ¿De qué año es este vehículo?
          </label>
          <div className="input-with-icon">
            <span className="input-icon">📅</span>
            <select
              className="typeform-select basic-info-input"
              value={formData.year || ''}
              onChange={handleInputChange('year')}
            >
              <option value="">Seleccionar año</option>
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          {errors.year && (
            <div className="input-error">
              <span className="error-icon">⚠️</span>
              {errors.year}
            </div>
          )}
        </div>

        {/* Resumen visual */}
        {formData.vehicleId && formData.name && (
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
              {formData.year && (
                <div className="preview-item">
                  <span className="preview-label">Año:</span>
                  <span className="preview-value">{formData.year}</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Step1_BasicInfo;
