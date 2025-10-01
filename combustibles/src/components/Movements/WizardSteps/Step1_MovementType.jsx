/**
 * Step1_MovementType - Primer paso del wizard: Selección del tipo de movimiento
 * Diseño estilo Typeform: conversacional, centrado y elegante
 * 
 * REFACTORED: Simplificado a solo ENTRADA y SALIDA (según decisiones CORE)
 * REMOVED: Legacy service imports - now using constants directly
 */

import React, { useCallback, useMemo } from 'react';
import { MOVEMENT_TYPES_UI } from '../../../constants';

// Tipos de movimiento simplificados (solo ENTRADA y SALIDA)
const MOVEMENT_TYPES = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
};

const Step1_MovementType = ({
  formData,
  updateFormData,
  setError,
  isActive,
  theme = 'forestech',
}) => {
  // Helper para clases según el tema
  const getThemeClass = (baseClass) => {
    return `${baseClass} ${theme}-theme`;
  };

  // Opciones simplificadas: solo ENTRADA y SALIDA
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
      // REMOVED: TRANSFERENCIA, AJUSTE, MANTENIMIENTO (no son necesarios en refactorización)
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

  // Solo navegación por mouse

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
            className={`${getThemeClass('movement-option')} ${option.type} ${formData.type === option.type ? 'selected' : ''}`}
            onClick={() => handleSelection(option.type)}
            tabIndex={0}
            role="button"
            aria-label={`Seleccionar ${option.title}: ${option.description}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelection(option.type);
              }
            }}
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
