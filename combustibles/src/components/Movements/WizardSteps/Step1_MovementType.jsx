/**
 * Step1_MovementType - Primer paso del wizard: Selección del tipo de movimiento
 * Diseño estilo Typeform: conversacional, centrado y elegante
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import { MOVEMENT_TYPES_UI } from '../../../constants';

const Step1_MovementType = ({ formData, updateFormData, setError, isActive }) => {
  
  const movementOptions = useMemo(() => [
    {
      type: MOVEMENT_TYPES.ENTRADA,
      ...MOVEMENT_TYPES_UI.ENTRADA
    },
    {
      type: MOVEMENT_TYPES.SALIDA,
      ...MOVEMENT_TYPES_UI.SALIDA
    },
    {
      type: MOVEMENT_TYPES.TRANSFERENCIA,
      ...MOVEMENT_TYPES_UI.TRANSFERENCIA
    },
    {
      type: MOVEMENT_TYPES.AJUSTE,
      ...MOVEMENT_TYPES_UI.AJUSTE
    }
  ], []);

  const handleSelection = useCallback((type) => {
    updateFormData('type', type);
    setError('');
  }, [updateFormData, setError]);

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      // Números 1-4 para seleccionar opciones
      const num = parseInt(e.key);
      if (num >= 1 && num <= 4) {
        const selectedOption = movementOptions[num - 1];
        handleSelection(selectedOption.type);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive, handleSelection, movementOptions]);

  return (
    <div className={`wizard-step step-movement-type ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        <div className="typeform-question">
          <h2>🌿 ¡Hola! ¿Qué operación necesitas registrar hoy?</h2>
          <p>Selecciona el tipo de movimiento que vas a realizar</p>
        </div>

        <div className="typeform-options">
          {movementOptions.map((option) => (
            <div
              key={option.type}
              className={`typeform-option ${formData.type === option.type ? 'selected' : ''} ${option.color}`}
              onClick={() => handleSelection(option.type)}
            >
              <div className="typeform-option-icon">
                {option.icon}
              </div>
              <div className="typeform-option-content">
                <h4>{option.title}</h4>
                <p>{option.description}</p>
              </div>
              <div className="typeform-option-selector">
                <div className="typeform-check">
                  <span className="typeform-check-icon">✓</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {formData.type && (
          <div className="selection-confirmation">
            <div className="confirmation-card">
              <span className="confirmation-icon">
                {movementOptions.find(opt => opt.type === formData.type)?.icon}
              </span>
              <div className="confirmation-text">
                <strong>Perfecto! Has seleccionado:</strong> {movementOptions.find(opt => opt.type === formData.type)?.title}
                <br />
                <small>{movementOptions.find(opt => opt.type === formData.type)?.details}</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1_MovementType;