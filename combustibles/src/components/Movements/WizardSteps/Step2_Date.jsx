/**
 * Step2_Date - Segundo paso del wizard: Selección de fecha del movimiento
 * Diseño estilo Typeform: centrado en la fecha y uso intuitivo
 */

import React, { useState, useEffect, useRef } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';

const Step2_Date = ({ formData, updateFormData, setError, isActive }) => {
  const [localError, setLocalError] = useState('');
  const dateInputRef = useRef(null);

  // Obtener fecha por defecto (hoy)
  const getDefaultDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  // Auto-focus en el input cuando el paso esté activo
  useEffect(() => {
    if (isActive && dateInputRef.current && formData.type === MOVEMENT_TYPES.SALIDA) {
      setTimeout(() => dateInputRef.current.focus(), 300);
    }
  }, [isActive, formData.type]);

  // Si no hay fecha, establecer la fecha actual como default
  useEffect(() => {
    if (!formData.effectiveDate && formData.type === MOVEMENT_TYPES.SALIDA) {
      updateFormData('effectiveDate', getDefaultDate());
    }
  }, [formData.effectiveDate, formData.type, updateFormData]);

  // Solo mostrar para salidas en el nuevo flujo
  if (formData.type !== MOVEMENT_TYPES.SALIDA) {
    return null;
  }

  const handleDateChange = (value) => {
    setLocalError('');
    setError('');
    
    if (value) {
      // Validar que la fecha no sea futura
      const selectedDate = new Date(value);
      const today = new Date();
      
      if (selectedDate > today) {
        setLocalError('La fecha no puede ser futura');
        return;
      }
      
      // Validar que la fecha no sea muy antigua (más de 1 año)
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      
      if (selectedDate < oneYearAgo) {
        setLocalError('La fecha no puede ser anterior a un año');
        return;
      }
    }
    
    updateFormData('effectiveDate', value);
  };

  return (
    <div className={`wizard-step step-date ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        <div className="typeform-question">
          <h2>📅 ¿Cuándo se realizó el consumo de combustible?</h2>
          <p>Selecciona la fecha y hora del movimiento de salida</p>
        </div>

        <div className="typeform-input-section">
          <input
            ref={dateInputRef}
            type="datetime-local"
            value={formData.effectiveDate || getDefaultDate()}
            onChange={(e) => handleDateChange(e.target.value)}
            className={`typeform-input date-input ${localError ? 'error' : ''}`}
            max={new Date().toISOString().slice(0, 16)} // No permitir fechas futuras
            autoComplete="off"
          />
          
          {localError && (
            <div className="validation-warning">
              {localError}
            </div>
          )}
          
          <div className="input-help">
            <small>💡 Usa la fecha y hora exacta del consumo</small>
          </div>
        </div>

        {/* Confirmación visual */}
        {formData.effectiveDate && !localError && (
          <div className="selection-confirmation">
            <div className="confirmation-card">
              <span className="confirmation-icon">📅</span>
              <div className="confirmation-text">
                <strong>Fecha registrada</strong>
                <br />
                <small>
                  {new Date(formData.effectiveDate).toLocaleString('es-CO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </small>
              </div>
            </div>
          </div>
        )}

        {/* Atajos rápidos */}
        <div className="quick-actions">
          <button
            type="button"
            className="quick-action-btn"
            onClick={() => handleDateChange(getDefaultDate())}
          >
            🕐 Ahora
          </button>
          <button
            type="button"
            className="quick-action-btn"
            onClick={() => {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              handleDateChange(yesterday.toISOString().slice(0, 16));
            }}
          >
            📅 Ayer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2_Date;
