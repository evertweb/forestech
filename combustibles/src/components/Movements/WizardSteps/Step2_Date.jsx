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
    <div className={`wizard-step step-date sap-theme ${isActive ? 'active' : ''}`}>
      <div className="step-question sap-theme sap-theme">
        <h3>📅 ¿Cuándo se realizó el consumo de combustible?</h3>
        <p>Selecciona la fecha y hora del movimiento de salida</p>
      </div>

      <div className="form-group sap-theme sap-theme">
        <label htmlFor="effective-date" className="form-label sap-theme sap-theme">
          Fecha y Hora del Movimiento
        </label>
        <input
          ref={dateInputRef}
          id="effective-date"
          type="datetime-local"
          value={formData.effectiveDate || getDefaultDate()}
          onChange={(e) => handleDateChange(e.target.value)}
          className={`form-input sap-theme ${localError ? 'error' : ''}`}
          max={new Date().toISOString().slice(0, 16)} // No permitir fechas futuras
          autoComplete="off"
        />

        {localError && (
          <div className="wizard-error sap-theme sap-theme">
            <span className="error-icon sap-theme sap-theme">⚠️</span>
            {localError}
          </div>
        )}

        <div className="input-help sap-theme sap-theme">
          <small>💡 Usa la fecha y hora exacta del consumo</small>
        </div>
      </div>

      {/* Confirmación visual */}
      {formData.effectiveDate && !localError && (
        <div className="selection-confirmation sap-theme sap-theme">
          <div className="confirmation-card sap-theme sap-theme">
            <span className="confirmation-icon sap-theme sap-theme">📅</span>
            <div className="confirmation-text sap-theme sap-theme">
              <strong>Fecha registrada</strong>
              <br />
              <small>
                {new Date(formData.effectiveDate).toLocaleString('es-CO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Atajos rápidos */}
      <div className="quick-actions sap-theme sap-theme">
        <button
          type="button"
          className="quick-action-btn sap-theme sap-theme"
          onClick={() => handleDateChange(getDefaultDate())}
        >
          🕐 Ahora
        </button>
        <button
          type="button"
          className="quick-action-btn sap-theme sap-theme"
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
  );
};

export default Step2_Date;
