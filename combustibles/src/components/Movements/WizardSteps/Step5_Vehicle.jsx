/**
 * Step5_Vehicle - Quinto paso del wizard: Selección de vehículo/equipo
 * Diseño estilo Typeform: centrado en el vehículo y uso intuitivo
 */

import React, { useState, useEffect, useRef } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';

const Step5_Vehicle = ({ formData, updateFormData, systemData, setError, isActive }) => {
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showHourMeter, setShowHourMeter] = useState(false);
  const [localError, setLocalError] = useState('');
  const hourMeterRef = useRef(null);

  const { vehicles } = systemData;

  // Solo mostrar para salidas
  if (formData.type !== MOVEMENT_TYPES.SALIDA) {
    return null;
  }

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      const compatibleVehicles = getCompatibleVehicles();
      const num = parseInt(e.key);
      
      if (num >= 1 && num <= compatibleVehicles.length) {
        const selectedVehicle = compatibleVehicles[num - 1];
        handleVehicleSelection(selectedVehicle);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive, vehicles, formData.fuelType]);

  // Buscar vehículo seleccionado
  useEffect(() => {
    if (formData.vehicleId && vehicles.length > 0) {
      const vehicle = vehicles.find(v => v.vehicleId === formData.vehicleId);
      setSelectedVehicle(vehicle);
      
      const requiresHourMeter = checkIfRequiresHourMeter(vehicle);
      setShowHourMeter(requiresHourMeter);

      // Auto-focus en horómetro si es requerido
      if (requiresHourMeter && hourMeterRef.current) {
        setTimeout(() => hourMeterRef.current.focus(), 500);
      }
    }
  }, [formData.vehicleId, vehicles]);

  const checkIfRequiresHourMeter = (vehicle) => {
    if (!vehicle) return false;
    
    const isDieselVehicle = vehicle.fuelType === 'diesel' || vehicle.fuelType === 'Diesel';
    const isTractorByCategory = vehicle.category === 'tractor' || 
                               vehicle.type?.toLowerCase().includes('tractor');
    
    return isDieselVehicle || isTractorByCategory;
  };

  const getCompatibleVehicles = () => {
    if (!formData.fuelType) return vehicles;
    
    return vehicles.filter(vehicle => {
      const vehicleFuelType = vehicle.fuelType?.toLowerCase();
      const requiredFuelType = formData.fuelType?.toLowerCase();
      
      return vehicleFuelType === requiredFuelType || 
             (requiredFuelType === 'diesel' && vehicleFuelType === 'diesel') ||
             (requiredFuelType === 'gasolina' && vehicleFuelType === 'gasolina');
    });
  };

  const handleVehicleSelection = async (vehicle) => {
    setLoading(true);
    setError('');
    setLocalError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      updateFormData('vehicleId', vehicle.vehicleId);
      setSelectedVehicle(vehicle);
      
      const requiresHourMeter = checkIfRequiresHourMeter(vehicle);
      setShowHourMeter(requiresHourMeter);
      
      // Limpiar horómetro previo si no es requerido
      if (!requiresHourMeter) {
        updateFormData('currentHours', '');
      }
      
    } catch (err) {
      setError('Error al seleccionar vehículo');
    } finally {
      setLoading(false);
    }
  };

  const handleHourMeterChange = (value) => {
    const numValue = parseFloat(value);
    
    if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
      updateFormData('currentHours', value);
      setLocalError('');
    } else {
      setLocalError('Ingresa un valor válido de horómetro');
    }
  };

  const getVehicleIcon = (vehicle) => {
    const category = vehicle.category?.toLowerCase() || '';
    const type = vehicle.type?.toLowerCase() || '';
    
    if (category.includes('tractor') || type.includes('tractor')) return '🚜';
    if (category.includes('excavadora') || type.includes('excavadora')) return '🦕';
    if (category.includes('volqueta') || type.includes('volqueta')) return '🚛';
    if (category.includes('moto') || type.includes('moto')) return '🏍️';
    if (category.includes('carro') || type.includes('carro')) return '🚗';
    return '🚙';
  };

  const compatibleVehicles = getCompatibleVehicles();

  if (compatibleVehicles.length === 0) {
    return (
      <div className={`wizard-step step-vehicle ${isActive ? 'active' : ''}`}>
        <div className="typeform-layout">
          <div className="typeform-question">
            <h2>🚫 No hay vehículos compatibles</h2>
            <p>No se encontraron vehículos que usen {formData.fuelType}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`wizard-step step-vehicle ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        <div className="typeform-question">
          <h2>🚗 ¿A qué vehículo le darás combustible?</h2>
          <p>Selecciona el vehículo o equipo que recibirá el {formData.fuelType}</p>
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>🔄 Validando vehículo...</p>
          </div>
        )}

        <div className="typeform-options">
          {compatibleVehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className={`typeform-option ${formData.vehicleId === vehicle.vehicleId ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
              onClick={() => !loading && handleVehicleSelection(vehicle)}
            >
              <div className="typeform-option-icon">
                {getVehicleIcon(vehicle)}
              </div>
              <div className="typeform-option-content">
                <h4>{vehicle.vehicleId} - {vehicle.brand || 'Vehículo'}</h4>
                <p>{vehicle.model || vehicle.type || 'Equipo de trabajo'}</p>
                {vehicle.currentHours && (
                  <small className="vehicle-hours">🕐 {vehicle.currentHours} horas registradas</small>
                )}
              </div>
              <div className="typeform-option-selector">
                <div className="typeform-check">
                  <span className="typeform-check-icon">✓</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input de horómetro si es requerido */}
        {showHourMeter && selectedVehicle && (
          <div className="typeform-input-section">
            <div className="typeform-question">
              <h3>🕐 ¿Cuál es el horómetro actual?</h3>
              <p>Ingresa las horas actuales de {selectedVehicle.vehicleId}</p>
            </div>
            
            <input
              ref={hourMeterRef}
              type="number"
              step="0.1"
              min="0"
              value={formData.currentHours || ''}
              onChange={(e) => handleHourMeterChange(e.target.value)}
              placeholder="0"
              className={`typeform-input ${localError ? 'error' : ''}`}
              autoComplete="off"
            />
            <span className="typeform-unit">horas</span>
            
            {localError && (
              <div className="validation-warning">
                {localError}
              </div>
            )}
          </div>
        )}

        {/* Confirmación */}
        {selectedVehicle && formData.vehicleId && (
          <div className="selection-confirmation">
            <div className="confirmation-card">
              <span className="confirmation-icon">{getVehicleIcon(selectedVehicle)}</span>
              <div className="confirmation-text">
                <strong>Perfecto! Combustible para {selectedVehicle.vehicleId}</strong>
                <br />
                <small>
                  {selectedVehicle.brand} {selectedVehicle.model}
                  {showHourMeter && formData.currentHours && 
                    ` - Horómetro: ${formData.currentHours} horas`
                  }
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step5_Vehicle;