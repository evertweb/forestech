/**
 * Step5_Vehicle - Quinto paso del wizard: Selección de vehículo/equipo
 * Diseño estilo Typeform: centrado en el vehículo y uso intuitivo
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import { WIZARD_QUESTIONS } from '../../../constants';

const Step5_Vehicle = ({ formData, updateFormData, systemData, setError, isActive }) => {
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showHourMeter, setShowHourMeter] = useState(false);
  const [localError, setLocalError] = useState('');
  const hourMeterRef = useRef(null);

  const { vehicles } = systemData;

  // Debug crítico: Solo log cuando NO hay vehículos (problema)
  if (isActive && formData.fuelType && (!vehicles || vehicles.length === 0)) {
    console.log(
      `❌ Step5_Vehicle SIN VEHÍCULOS: fuelType="${formData.fuelType}", vehicles=${vehicles?.length || 0}`
    );
  }

  // Función para determinar si requiere horómetro
  const checkIfRequiresHourMeter = useCallback((vehicle) => {
    if (!vehicle) return false;

    // Verificar primero si el vehículo tiene el campo hasHourMeter explícito
    if (vehicle.hasHourMeter !== undefined) {
      return vehicle.hasHourMeter;
    }

    // Fallback: detectar por tipo y categoría (lógica anterior)
    return (
      vehicle.type === 'heavy' ||
      vehicle.type === 'construction' ||
      vehicle.category === 'maquinaria' ||
      vehicle.category === 'tractor' ||
      vehicle.vehicleId?.toLowerCase().includes('tr') // Para tractores como TR-1, TR-2, etc.
    );
  }, []);

  // Función para obtener vehículos compatibles
  const getCompatibleVehicles = useCallback(() => {
    if (!formData.fuelType || vehicles.length === 0) {
      console.log('🔍 [Step5] No fuelType o no vehicles:', {
        fuelType: formData.fuelType,
        vehiclesCount: vehicles.length,
      });
      return [];
    }

    // 🔧 Normalizar el tipo de combustible requerido a mayúsculas
    const requiredFuelType = formData.fuelType?.toUpperCase() || '';
    console.log('🔍 [Step5] Buscando vehículos para:', requiredFuelType);
    console.log('🔍 [Step5] Total vehículos disponibles:', vehicles.length);

    // Debug: mostrar tipos de combustible de todos los vehículos
    const fuelTypes = vehicles.map((v) => ({
      name: v.name || v.plateNumber,
      fuelType: v.fuelType,
      status: v.status,
    }));
    console.log('🔍 [Step5] Tipos de combustible en vehículos:', fuelTypes);

    const filtered = vehicles.filter((vehicle) => {
      // 🔧 Normalizar ambos lados de la comparación a mayúsculas
      const vehicleFuelType = vehicle.fuelType?.toUpperCase() || '';
      const requiredFuelTypeNormalized = requiredFuelType?.toUpperCase() || '';
      const isActive = vehicle.status === 'activo';

      // Lógica robusta de compatibilidad de combustibles (unificada)
      const isFuelCompatible =
        // DIESEL es compatible con DIESEL (unificado, ACPM migrado a DIESEL)
        (requiredFuelTypeNormalized === 'DIESEL' && vehicleFuelType === 'DIESEL') ||
        // GASOLINE es compatible con GASOLINE (unificado, GASOLINA migrado a GASOLINE)
        (requiredFuelTypeNormalized === 'GASOLINE' && vehicleFuelType === 'GASOLINE') ||
        // MIXED es compatible con cualquier combustible
        (requiredFuelTypeNormalized === 'MIXED' &&
          (vehicleFuelType === 'DIESEL' ||
            vehicleFuelType === 'GASOLINE' ||
            vehicleFuelType === 'LUBRICANTS' ||
            vehicleFuelType === 'TWO_STROKE'));

      console.log(
        `🔍 [Step5] Vehículo ${vehicle.name || vehicle.plateNumber}: fuelType=${vehicleFuelType}, required=${requiredFuelTypeNormalized}, status=${vehicle.status}, compatible=${isFuelCompatible}`
      );

      return isActive && isFuelCompatible;
    });

    console.log('🔍 [Step5] Vehículos compatibles encontrados:', filtered.length);
    return filtered;
  }, [formData.fuelType, vehicles]);

  const handleVehicleSelection = useCallback(
    async (vehicle) => {
      setLoading(true);
      setError('');
      setLocalError('');

      try {
        await new Promise((resolve) => setTimeout(resolve, 400));

        updateFormData('vehicleId', vehicle.vehicleId);
        setSelectedVehicle(vehicle);

        const requiresHourMeter = checkIfRequiresHourMeter(vehicle);
        setShowHourMeter(requiresHourMeter);

        // Limpiar horómetro previo si no es requerido
        if (!requiresHourMeter) {
          updateFormData('currentHours', '');
        }
      } catch {
        setError('Error al seleccionar vehículo');
      } finally {
        setLoading(false);
      }
    },
    [updateFormData, setError, checkIfRequiresHourMeter]
  );

  // Navegación por teclado
  useEffect(() => {
    if (!isActive || formData.type !== MOVEMENT_TYPES.SALIDA) return;

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
  }, [
    isActive,
    vehicles,
    formData.fuelType,
    formData.type,
    getCompatibleVehicles,
    handleVehicleSelection,
  ]);

  // Buscar vehículo seleccionado
  useEffect(() => {
    if (formData.vehicleId && vehicles.length > 0 && formData.type === MOVEMENT_TYPES.SALIDA) {
      const vehicle = vehicles.find((v) => v.vehicleId === formData.vehicleId);
      setSelectedVehicle(vehicle);

      const requiresHourMeter = checkIfRequiresHourMeter(vehicle);
      setShowHourMeter(requiresHourMeter);

      // Auto-focus en horómetro si es requerido
      if (requiresHourMeter && hourMeterRef.current) {
        setTimeout(() => hourMeterRef.current.focus(), 500);
      }
    }
  }, [formData.vehicleId, formData.type, vehicles, checkIfRequiresHourMeter]);

  // Solo mostrar para salidas
  if (formData.type !== MOVEMENT_TYPES.SALIDA) {
    return null;
  }

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
        <div className="typeform-layout sap-theme">
          <div className="typeform-question sap-theme">
            <h2>🚫 No hay vehículos compatibles</h2>
            <p>No se encontraron vehículos activos que usen {formData.fuelType}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`wizard-step step-vehicle ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout sap-theme">
        <div className="typeform-question sap-theme">
          <h2>{WIZARD_QUESTIONS.VEHICLE_SELECTION.title}</h2>
          <p>
            {WIZARD_QUESTIONS.VEHICLE_SELECTION.description.replace(
              '{fuelType}',
              formData.fuelType || 'combustible'
            )}
          </p>
        </div>

        {loading && (
          <div className="loading-overlay sap-theme">
            <div className="loading-spinner sap-theme"></div>
            <p>🔄 Validando vehículo...</p>
          </div>
        )}

        <div className="typeform-options sap-theme">
          {compatibleVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`typeform-option ${formData.vehicleId === vehicle.vehicleId ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
              onClick={() => !loading && handleVehicleSelection(vehicle)}
            >
              <div className="typeform-option-icon sap-theme">{getVehicleIcon(vehicle)}</div>
              <div className="typeform-option-content sap-theme">
                <h4>
                  {vehicle.vehicleId} - {vehicle.brand || 'Vehículo'}
                </h4>
                <p>{vehicle.model || vehicle.type || 'Equipo de trabajo'}</p>
                {vehicle.currentHours && (
                  <small className="vehicle-hours sap-theme">
                    🕐 {vehicle.currentHours} horas registradas
                  </small>
                )}
              </div>
              <div className="typeform-option-selector sap-theme">
                <div className="typeform-check sap-theme">
                  <span className="typeform-check-icon sap-theme">✓</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input de horómetro si es requerido */}
        {showHourMeter && selectedVehicle && (
          <div className="typeform-input-section sap-theme">
            <div className="typeform-question sap-theme">
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
            <span className="typeform-unit sap-theme">horas</span>

            {localError && <div className="validation-warning sap-theme">{localError}</div>}
          </div>
        )}

        {/* Confirmación */}
        {selectedVehicle && formData.vehicleId && (
          <div className="selection-confirmation sap-theme">
            <div className="confirmation-card sap-theme">
              <span className="confirmation-icon sap-theme">{getVehicleIcon(selectedVehicle)}</span>
              <div className="confirmation-text sap-theme">
                <strong>Perfecto! Combustible para {selectedVehicle.vehicleId}</strong>
                <br />
                <small>
                  {selectedVehicle.brand} {selectedVehicle.model}
                  {showHourMeter &&
                    formData.currentHours &&
                    ` - Horómetro: ${formData.currentHours} horas`}
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
