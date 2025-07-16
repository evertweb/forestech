/**
 * Step4_Operational - Cuarto paso: Información operacional del vehículo
 * Estado, ubicación, horómetro y fechas importantes
 */

import React, { useEffect, useCallback, useMemo } from 'react';
import { VEHICLE_STATUS } from '../../../services/vehiclesService';
import './VehicleWizardSteps.css';

const Step4_Operational = ({ 
  formData, 
  updateFormData, 
  errors, 
  isActive 
}) => {

  const statusOptions = useMemo(() => [
    {
      value: VEHICLE_STATUS.ACTIVO,
      icon: '✅',
      title: 'Activo',
      description: 'En operación normal, disponible para uso',
      color: 'status-active'
    },
    {
      value: VEHICLE_STATUS.MANTENIMIENTO,
      icon: '🔧',
      title: 'En Mantenimiento',
      description: 'Mantenimiento preventivo programado',
      color: 'status-maintenance'
    },
    {
      value: VEHICLE_STATUS.REPARACION,
      icon: '⚠️',
      title: 'En Reparación',
      description: 'Requiere reparación, fuera de servicio',
      color: 'status-repair'
    },
    {
      value: VEHICLE_STATUS.INACTIVO,
      icon: '⏸️',
      title: 'Inactivo',
      description: 'Temporalmente fuera de operación',
      color: 'status-inactive'
    },
    {
      value: VEHICLE_STATUS.FUERA_DE_SERVICIO,
      icon: '❌',
      title: 'Fuera de Servicio',
      description: 'Permanentemente fuera de operación',
      color: 'status-out-of-service'
    }
  ], []);

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      // Numbers 1-5 para seleccionar estado
      const num = parseInt(e.key);
      if (num >= 1 && num <= statusOptions.length) {
        const selectedStatus = statusOptions[num - 1];
        updateFormData('status', selectedStatus.value);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive, updateFormData, statusOptions]);

  const handleInputChange = useCallback((field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    updateFormData(field, value);
  }, [updateFormData]);

  const handleStatusSelect = useCallback((status) => {
    updateFormData('status', status);
  }, [updateFormData]);

  return (
    <div className={`wizard-step step-operational ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        
        {/* Pregunta principal */}
        <div className="typeform-question">
          <h2>🚀 ¿Cuál es el estado operacional de <span className="highlight">{formData.name}</span>?</h2>
          <p>Esta información nos ayudará a gestionar la disponibilidad y programar mantenimientos</p>
        </div>

        {/* Selección de estado */}
        <div className="typeform-options status-options">
          {statusOptions.map((option, index) => (
            <div
              key={option.value}
              className={`typeform-option status-option ${option.color} ${
                formData.status === option.value ? 'selected' : ''
              }`}
              onClick={() => handleStatusSelect(option.value)}
            >
              <div className="option-header">
                <span className="option-icon">{option.icon}</span>
                <span className="option-number">{index + 1}</span>
              </div>
              <div className="option-content">
                <h4 className="option-title">{option.title}</h4>
                <p className="option-description">{option.description}</p>
              </div>
              {formData.status === option.value && (
                <div className="selection-indicator">
                  <span className="checkmark">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
        {errors.status && (
          <div className="input-error-centered">
            <span className="error-icon">⚠️</span>
            {errors.status}
          </div>
        )}

        {/* Ubicación actual */}
        <div className="typeform-input-group">
          <label className="typeform-label">
            ¿Dónde se encuentra actualmente este vehículo?
          </label>
          <div className="input-with-icon">
            <span className="input-icon">📍</span>
            <input
              type="text"
              className="typeform-input operational-input"
              placeholder="Ej: Almacén Central, Campo Norte, Taller Mecánico"
              value={formData.currentLocation || ''}
              onChange={handleInputChange('currentLocation')}
            />
          </div>
          <div className="input-hint">
            🗺️ Especifica la ubicación actual para facilitar su localización
          </div>
        </div>

        {/* Horómetro */}
        <div className="typeform-section">
          <label className="typeform-label">
            ¿Este vehículo tiene horómetro?
          </label>
          <div className="checkbox-group">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={formData.hasHourMeter || false}
                onChange={handleInputChange('hasHourMeter')}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-label">
                🕐 Sí, este vehículo tiene horómetro
              </span>
            </label>
          </div>
          
          {formData.hasHourMeter && (
            <div className="typeform-input-group dependent-field">
              <label className="typeform-label">
                ¿Cuántas horas marca actualmente?
              </label>
              <div className="input-with-icon">
                <span className="input-icon">⏱️</span>
                <input
                  type="number"
                  className="typeform-input operational-input"
                  placeholder="1250.5"
                  min="0"
                  step="0.1"
                  value={formData.currentHours || ''}
                  onChange={handleInputChange('currentHours')}
                />
              </div>
              {errors.currentHours && (
                <div className="input-error">
                  <span className="error-icon">⚠️</span>
                  {errors.currentHours}
                </div>
              )}
              <div className="input-hint">
                ⏱️ Las horas del horómetro nos ayudan a programar mantenimientos
              </div>
            </div>
          )}
        </div>

        {/* Fechas importantes */}
        <div className="typeform-row">
          <div className="typeform-input-group">
            <label className="typeform-label">
              Último mantenimiento (opcional)
            </label>
            <div className="input-with-icon">
              <span className="input-icon">🔧</span>
              <input
                type="date"
                className="typeform-input operational-input"
                value={formData.lastMaintenanceDate || ''}
                onChange={handleInputChange('lastMaintenanceDate')}
              />
            </div>
          </div>

          <div className="typeform-input-group">
            <label className="typeform-label">
              Fecha de compra (opcional)
            </label>
            <div className="input-with-icon">
              <span className="input-icon">📅</span>
              <input
                type="date"
                className="typeform-input operational-input"
                value={formData.purchaseDate || ''}
                onChange={handleInputChange('purchaseDate')}
              />
            </div>
          </div>
        </div>

        {/* Descripción adicional */}
        <div className="typeform-input-group">
          <label className="typeform-label">
            ¿Algo más que debamos saber? (opcional)
          </label>
          <div className="input-with-icon">
            <span className="input-icon">📝</span>
            <textarea
              className="typeform-textarea operational-input"
              placeholder="Observaciones, características especiales, modificaciones, etc."
              rows="3"
              value={formData.description || ''}
              onChange={handleInputChange('description')}
            />
          </div>
          <div className="input-hint">
            💭 Cualquier información adicional que sea relevante para la operación
          </div>
        </div>

        {/* Preview del estado operacional */}
        {formData.status && (
          <div className="step-preview">
            <div className="preview-card">
              <h4>📋 Estado operacional</h4>
              
              <div className="preview-item">
                <span className="preview-label">Estado:</span>
                <span className="preview-value">
                  {statusOptions.find(s => s.value === formData.status)?.icon} {formData.status}
                </span>
              </div>
              
              {formData.currentLocation && (
                <div className="preview-item">
                  <span className="preview-label">Ubicación:</span>
                  <span className="preview-value">📍 {formData.currentLocation}</span>
                </div>
              )}
              
              {formData.hasHourMeter && formData.currentHours && (
                <div className="preview-item">
                  <span className="preview-label">Horómetro:</span>
                  <span className="preview-value">⏱️ {formData.currentHours} horas</span>
                </div>
              )}
              
              {formData.lastMaintenanceDate && (
                <div className="preview-item">
                  <span className="preview-label">Último mantenimiento:</span>
                  <span className="preview-value">{formData.lastMaintenanceDate}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hint para navegación */}
        <div className="navigation-hint">
          💡 Tip: Usa las teclas 1-{statusOptions.length} para seleccionar el estado rápidamente
        </div>

      </div>
    </div>
  );
};

export default Step4_Operational;
