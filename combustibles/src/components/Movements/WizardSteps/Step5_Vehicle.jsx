/**
 * Step5_Vehicle - Quinto paso del wizard: Selección de vehículo/equipo (solo para salidas)
 * Incluye validación especial para tractores y sus horómetros
 */

import React, { useState, useEffect } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';

const Step5_Vehicle = ({ formData, updateFormData, systemData, setError }) => {
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showHourMeter, setShowHourMeter] = useState(false);
  const [localError, setLocalError] = useState('');

  const { vehicles } = systemData;

  // Buscar vehículo seleccionado
  useEffect(() => {
    if (formData.vehicleId && vehicles.length > 0) {
      const vehicle = vehicles.find(v => v.vehicleId === formData.vehicleId);
      setSelectedVehicle(vehicle);
      
      // Verificar si es tractor para mostrar horómetro
      const isTractor = checkIfTractor(vehicle);
      setShowHourMeter(isTractor);
    }
  }, [formData.vehicleId, vehicles]);

  const checkIfTractor = (vehicle) => {
    if (!vehicle) return false;
    
    const vehicleId = vehicle.vehicleId?.toUpperCase();
    const isTractorById = vehicleId && (
      vehicleId.includes('TR1') || 
      vehicleId.includes('TR2') || 
      vehicleId.includes('TR3') ||
      vehicleId === 'TR1' ||
      vehicleId === 'TR2' ||
      vehicleId === 'TR3'
    );
    
    const isTractorByCategory = vehicle.category === 'tractor' || 
                               vehicle.type?.toLowerCase().includes('tractor');
    
    return isTractorById || isTractorByCategory;
  };

  const handleVehicleSelection = async (vehicle) => {
    setLoading(true);
    setError('');
    
    try {
      // Simular validación de vehículo
      await new Promise(resolve => setTimeout(resolve, 600));
      
      updateFormData('vehicleId', vehicle.vehicleId);
      setSelectedVehicle(vehicle);
      
      const isTractor = checkIfTractor(vehicle);
      setShowHourMeter(isTractor);
      
      // Limpiar horómetro si no es tractor
      if (!isTractor && formData.currentHours) {
        updateFormData('currentHours', '');
      }
      
      // 🔍 DEBUG: Logs específicos para Step5
      console.log('🚜 [Step5] Vehículo seleccionado:', vehicle.vehicleId, 'Es tractor:', isTractor);
      console.log('🔍 [Step5] FormData después de selección:', { 
        vehicleId: vehicle.vehicleId, 
        type: formData.type,
        fuelType: formData.fuelType,
        location: formData.location 
      });
      
    } catch (err) {
      console.error('Error al validar vehículo:', err);
      setError('Error al validar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  const handleHourMeterChange = (value) => {
    const numValue = parseFloat(value);
    
    if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
      updateFormData('currentHours', value);
      
      // Validar que sea mayor a la lectura anterior
      if (selectedVehicle?.currentHours && numValue < parseFloat(selectedVehicle.currentHours)) {
        setLocalError(`La lectura debe ser mayor a la anterior: ${selectedVehicle.currentHours} hrs`);
      } else {
        setLocalError('');
      }
    }
  };

  // Solo mostrar este paso para salidas
  if (formData.type !== MOVEMENT_TYPES.SALIDA) {
    return null;
  }

  if (vehicles.length === 0) {
    return (
      <div className={`wizard-step step-vehicle ${isActive ? 'active' : ''}`}>
        <div className="typeform-layout">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>🔄 Cargando vehículos disponibles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`wizard-step step-vehicle ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        <div className="typeform-question">
          <h3>🚜 ¿A qué vehículo/equipo va el combustible?</h3>
          <p>Selecciona el vehículo que recibirá el combustible:</p>
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>🔄 Validando vehículo...</p>
          </div>
        )}

        <div className="typeform-options">
          {vehicles.map((vehicle) => {
            const isTractor = checkIfTractor(vehicle);
            
            return (
              <div
                key={vehicle.id}
                className={`typeform-option ${formData.vehicleId === vehicle.vehicleId ? 'selected' : ''} 
                           ${isTractor ? 'tractor' : ''} ${loading ? 'disabled' : ''}`}
                onClick={() => !loading && handleVehicleSelection(vehicle)}
              >
                <div className="typeform-option-icon">
                  {isTractor ? '🚜' : '🚚'}
                </div>
                <div className="typeform-option-content">
                  <h4>{vehicle.vehicleId} - {vehicle.name}</h4>
                  <p>{vehicle.type}</p>
                  
                  {vehicle.currentHours && isTractor && (
                    <small className="vehicle-hours">
                      ⏱️ Horómetro: {vehicle.currentHours} hrs
                    </small>
                  )}
                </div>
                <div className="typeform-option-selector">
                  <div className="typeform-check">
                    <span className="typeform-check-icon">✓</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Campo de horómetro para tractores */}
        {showHourMeter && selectedVehicle && (
          <div className="typeform-input-section">
            <label htmlFor="currentHours">Horas actuales *</label>
            <input
              id="currentHours"
              type="number"
              step="0.1"
              min="0"
              value={formData.currentHours}
              onChange={(e) => handleHourMeterChange(e.target.value)}
              placeholder="0.0"
              className={`typeform-input ${localError ? 'error' : ''}`}
            />
            <span className="typeform-unit">horas</span>
            
            {selectedVehicle.currentHours && (
              <small className="hour-meter-hint">
                💡 Última lectura: {selectedVehicle.currentHours} horas
              </small>
            )}
            
            {localError && (
              <div className="field-error">
                {localError}
              </div>
            )}
          </div>
        )}

        {/* Confirmación de selección */}
        {selectedVehicle && formData.vehicleId && (
          <div className="selection-confirmation">
            <div className="confirmation-card vehicle-confirmation">
              <div className="confirmation-header">
                <span className="confirmation-icon">
                  {checkIfTractor(selectedVehicle) ? '🚜' : '🚚'}
                </span>
                <div className="confirmation-text">
                  <strong>{selectedVehicle.vehicleId} - {selectedVehicle.name}</strong>
                  <br />
                  <small>{selectedVehicle.type}</small>
                </div>
              </div>
              
              <div className="vehicle-details">
                <div className="detail-item">
                  <span className="detail-label">📋 Tipo:</span>
                  <span className="detail-value">{selectedVehicle.type}</span>
                </div>
                
                {selectedVehicle.category && (
                  <div className="detail-item">
                    <span className="detail-label">🏷️ Categoría:</span>
                    <span className="detail-value">{selectedVehicle.category}</span>
                  </div>
                )}
                
                {showHourMeter && formData.currentHours && (
                  <div className="detail-item">
                    <span className="detail-label">⏱️ Horómetro:</span>
                    <span className="detail-value">{formData.currentHours} hrs</span>
                  </div>
                )}
              </div>
              
              {checkIfTractor(selectedVehicle) && !formData.currentHours && (
                <div className="warning-message">
                  ⚠️ Se requiere lectura del horómetro para tractores
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step5_Vehicle;