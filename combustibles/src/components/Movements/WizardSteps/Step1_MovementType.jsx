/**
 * Step1_MovementType - Primer paso del wizard: Selección del tipo de movimiento
 * Diseño estilo Typeform: conversacional, centrado y elegante
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import { MOVEMENT_TYPES_UI } from '../../../constants';

const Step1_MovementType = ({ formData, updateFormData, setError, isActive }) => {
  const movementOptions = useMemo(
    () => [
      {
        type: MOVEMENT_TYPES.ENTRADA,
        ...MOVEMENT_TYPES_UI.ENTRADA,
      },
      {
        type: MOVEMENT_TYPES.SALIDA,
        ...MOVEMENT_TYPES_UI.SALIDA,
      },
      {
        type: MOVEMENT_TYPES.TRANSFERENCIA,
        ...MOVEMENT_TYPES_UI.TRANSFERENCIA,
      },
      {
        type: MOVEMENT_TYPES.AJUSTE,
        ...MOVEMENT_TYPES_UI.AJUSTE,
      },
    ],
    []
  );

  const handleSelection = useCallback(
    (type) => {
      updateFormData('type', type);
      setError('');
    },
    [updateFormData, setError]
  );

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
    <div className={`wizard-step step-movement-type sap-theme ${isActive ? 'active' : ''}`}>
      <div className="step-question sap-theme sap-theme">
        <h3>📋 ¿Qué tipo de movimiento vas a registrar?</h3>
        <p>Selecciona la operación que necesitas realizar hoy</p>
      </div>

      <div className="movement-options sap-theme sap-theme">
        {movementOptions.map((option) => (
          <div
            key={option.type}
            className={`movement-option sap-theme ${formData.type === option.type ? 'selected' : ''}`}
            onClick={() => handleSelection(option.type)}
          >
            <div className="option-icon sap-theme sap-theme">{option.icon}</div>
            <div className="option-content sap-theme sap-theme">
              <h4 className="option-title sap-theme sap-theme">{option.title}</h4>
              <p className="option-description sap-theme sap-theme">{option.description}</p>
            </div>
          </div>
        ))}
      </div>

      {formData.type && (
        <div className="selection-confirmation sap-theme sap-theme">
          <div className="confirmation-card sap-theme sap-theme">
            <span className="confirmation-icon sap-theme sap-theme">
              {movementOptions.find((opt) => opt.type === formData.type)?.icon}
            </span>
            <div className="confirmation-text sap-theme sap-theme">
              <strong>Perfecto! Has seleccionado:</strong>{' '}
              {movementOptions.find((opt) => opt.type === formData.type)?.title}
              <br />
              <small>{movementOptions.find((opt) => opt.type === formData.type)?.details}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1_MovementType;
