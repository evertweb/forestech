/**
 * Step1_MovementType - Primer paso del wizard: Selección del tipo de movimiento
 * Diseño estilo Typeform: conversacional, centrado y elegante
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import { MOVEMENT_TYPES_UI } from '../../../constants';

const Step1_MovementType = ({ formData, updateFormData, setError, isActive, theme = 'modern' }) => {
  // Helper para clases según el tema
  const getThemeClass = (baseClass) => {
    if (theme === 'government') {
      return `${baseClass} government-override`;
    }
    return `${baseClass} sap-theme`;
  };
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
      {
        type: MOVEMENT_TYPES.MANTENIMIENTO,
        ...MOVEMENT_TYPES_UI.MANTENIMIENTO,
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
      // Números 1-5 para seleccionar opciones
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5) {
        const selectedOption = movementOptions[num - 1];
        handleSelection(selectedOption.type);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive, handleSelection, movementOptions]);

  return (
    <div
      className={`wizard-step step-movement-type ${getThemeClass('')} ${isActive ? 'active' : ''}`}
    >
      <div className={getThemeClass('step-question')}>
        <h3>📋 ¿Qué tipo de movimiento vas a registrar?</h3>
        <p>Selecciona la operación que necesitas realizar hoy</p>
      </div>

      <div className={getThemeClass('movement-options')}>
        {movementOptions.map((option) => (
          <div
            key={option.type}
            className={`${getThemeClass('movement-option')} ${formData.type === option.type ? 'selected' : ''}`}
            onClick={() => handleSelection(option.type)}
          >
            <div className={getThemeClass('option-icon')}>{option.icon}</div>
            <div className={getThemeClass('option-content')}>
              <h4 className={getThemeClass('option-title')}>{option.title}</h4>
              <p className={getThemeClass('option-description')}>{option.description}</p>
            </div>
          </div>
        ))}
      </div>

      {formData.type && (
        <div className={getThemeClass('selection-confirmation')}>
          <div className={getThemeClass('confirmation-card')}>
            <span className={getThemeClass('confirmation-icon')}>
              {movementOptions.find((opt) => opt.type === formData.type)?.icon}
            </span>
            <div className={getThemeClass('confirmation-text')}>
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
