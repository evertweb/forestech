/**
 * Step6_Destination - Sexto paso del wizard: Selección de ubicación destino (solo para transferencias)
 * Valida capacidad disponible en destino y previene transferencias a la misma ubicación
 */

import React, { useState, useEffect } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import {
  OPERATIONAL_LOCATIONS,
  STORAGE_LOCATIONS,
  formatLocationName,
} from '../../../constants/locations';

const Step6_Destination = ({
  formData,
  updateFormData,
  systemData,
  setError,
  isEntryDestination = false,
  isActive,
  theme = 'modern',
}) => {
  const [loading, setLoading] = useState(false);
  const [destinationInfo, setDestinationInfo] = useState({});
  const [validatingCapacity, setValidatingCapacity] = useState(false);

  // Helper para clases según el tema
  const getThemeClass = (baseClass) => {
    if (theme === 'government') {
      return `${baseClass} government-override`;
    }
    return `${baseClass} sap-theme`;
  };

  const { inventory } = systemData;

  // Validar capacidad disponible en destinos (solo para transferencias)
  useEffect(() => {
    const validateDestinationCapacity = async () => {
      // Solo validar capacidad para transferencias, NO para entradas
      if (formData.fuelType && formData.quantity && inventory.length > 0 && !isEntryDestination) {
        setValidatingCapacity(true);

        // Simular validación en tiempo real
        await new Promise((resolve) => setTimeout(resolve, 700));

        const transferQuantity = parseFloat(formData.quantity) || 0;
        const capacityByLocation = {};

        OPERATIONAL_LOCATIONS.filter((location) =>
          isEntryDestination ? true : location !== formData.location
        ) // Para entradas, incluir todas las ubicaciones
          .forEach((location) => {
            // Calcular capacidad actual
            const currentStock = inventory
              .filter(
                (item) =>
                  item.fuelType?.toUpperCase() === formData.fuelType?.toUpperCase() &&
                  item.location?.toLowerCase() === location.toLowerCase() &&
                  item.status === 'active'
              )
              .reduce((total, item) => total + (parseFloat(item.currentStock) || 0), 0);

            // Calcular capacidad máxima
            const maxCapacity = inventory
              .filter(
                (item) =>
                  item.fuelType?.toUpperCase() === formData.fuelType?.toUpperCase() &&
                  item.location?.toLowerCase() === location.toLowerCase() &&
                  item.status === 'active'
              )
              .reduce((total, item) => total + (parseFloat(item.maxCapacity) || 0), 0);

            const availableCapacity = maxCapacity - currentStock;
            const afterTransfer = currentStock + transferQuantity;
            const occupancyAfter = maxCapacity > 0 ? (afterTransfer / maxCapacity) * 100 : 0;

            let status = 'available';
            let message = `Capacidad: ${availableCapacity.toFixed(1)} gal libres`;
            let canAcceptTransfer = availableCapacity >= transferQuantity;

            if (maxCapacity === 0) {
              status = 'no_capacity';
              message = 'Sin tanques configurados';
              canAcceptTransfer = false;
            } else if (availableCapacity < transferQuantity) {
              status = 'insufficient';
              message = `Insuficiente: faltan ${(transferQuantity - availableCapacity).toFixed(1)} gal`;
              canAcceptTransfer = false;
            } else if (occupancyAfter > 90) {
              status = 'warning';
              message = `Quedará al ${occupancyAfter.toFixed(1)}% (casi lleno)`;
            }

            capacityByLocation[location] = {
              currentStock,
              maxCapacity,
              availableCapacity,
              afterTransfer,
              occupancyAfter,
              status,
              message,
              canAcceptTransfer,
            };
          });

        setDestinationInfo(capacityByLocation);
        setValidatingCapacity(false);

        console.log('🔍 Capacidad validada por destino:', capacityByLocation);
      }
    };

    validateDestinationCapacity();
  }, [formData.fuelType, formData.quantity, formData.location, inventory, isEntryDestination]);

  const handleDestinationSelection = async (destination) => {
    const destInfo = destinationInfo[destination];

    // Solo validar capacidad para transferencias, no para entradas
    if (!isEntryDestination && !destInfo?.canAcceptTransfer) {
      setError('Esta ubicación no puede recibir la cantidad solicitada');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simular validación final
      await new Promise((resolve) => setTimeout(resolve, 500));

      updateFormData('destinationLocation', destination);

      console.log('🎯 Destino seleccionado:', destination);
    } catch (err) {
      console.error('Error al validar destino:', err);
      setError('Error al validar el destino');
    } finally {
      setLoading(false);
    }
  };

  // Solo mostrar este paso para transferencias o entradas (con isEntryDestination)
  if (!isEntryDestination && formData.type !== MOVEMENT_TYPES.TRANSFERENCIA) {
    return null;
  }

  const availableDestinations = isEntryDestination
    ? STORAGE_LOCATIONS // Para entradas, solo bodegas de almacenamiento
    : OPERATIONAL_LOCATIONS.filter((loc) => loc !== formData.location); // Para transferencias, excluir origen

  return (
    <div className={`wizard-step step-destination ${isActive ? 'active' : ''}`}>
      <div className={getThemeClass('typeform-layout')}>
        <div className={getThemeClass('typeform-question')}>
          <h3>
            🎯{' '}
            {isEntryDestination
              ? '¿A qué ubicación llegará el combustible?'
              : '¿Hacia qué ubicación se transfiere?'}
          </h3>
          <p>Selecciona la ubicación de destino:</p>
        </div>

        {validatingCapacity && (
          <div className={getThemeClass('loading-overlay')}>
            <div className={getThemeClass('loading-spinner')}></div>
            <p>🔍 Verificando capacidad disponible...</p>
          </div>
        )}

        <div className={getThemeClass('typeform-options')}>
          {availableDestinations.map((location) => {
            const destInfo = destinationInfo[location];
            const isSelectable = !destInfo || destInfo.canAcceptTransfer;

            return (
              <div
                key={location}
                className={`${getThemeClass('typeform-option')} ${formData.destinationLocation === location ? 'selected' : ''} ${destInfo?.status || 'unknown'} ${!isSelectable || loading ? 'disabled' : ''}`}
                onClick={() => isSelectable && !loading && handleDestinationSelection(location)}
              >
                <div className={getThemeClass('typeform-option-icon')}>🎯</div>
                <div className={getThemeClass('typeform-option-content')}>
                  <h4>{formatLocationName(location)}</h4>

                  {destInfo && (
                    <div className={getThemeClass('capacity-info')}>
                      <p className={getThemeClass('capacity-message')}>{destInfo.message}</p>

                      {destInfo.maxCapacity > 0 && (
                        <>
                          <div className={getThemeClass('capacity-bar-mini')}>
                            <div
                              className={getThemeClass('capacity-current-mini')}
                              style={{
                                width: `${Math.min(100, (destInfo.currentStock / destInfo.maxCapacity) * 100)}%`,
                              }}
                            ></div>
                            {destInfo.canAcceptTransfer && (
                              <div
                                className={getThemeClass('capacity-after-mini')}
                                style={{
                                  width: `${Math.min(100, destInfo.occupancyAfter)}%`,
                                  left: `${Math.min(100, (destInfo.currentStock / destInfo.maxCapacity) * 100)}%`,
                                }}
                              ></div>
                            )}
                          </div>
                          <small className={getThemeClass('capacity-details')}>
                            Actual: {destInfo.currentStock.toFixed(1)}/
                            {destInfo.maxCapacity.toFixed(1)} gal
                          </small>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className={getThemeClass('typeform-option-selector')}>
                  <div className={getThemeClass('typeform-check')}>
                    <span className={getThemeClass('typeform-check-icon')}>✓</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Información de la transferencia */}
        {formData.location && formData.quantity && (
          <div className={getThemeClass('transfer-summary')}>
            <div className={getThemeClass('transfer-flow')}>
              <div className={getThemeClass('transfer-origin')}>
                <span className={getThemeClass('transfer-icon')}>📍</span>
                <div className={getThemeClass('transfer-info')}>
                  <strong>{formatLocationName(formData.location)}</strong>
                  <small>Origen</small>
                </div>
              </div>

              <div className={getThemeClass('transfer-arrow')}>
                <span>→</span>
                <small>{parseFloat(formData.quantity).toFixed(1)} gal</small>
              </div>

              <div className={getThemeClass('transfer-destination')}>
                <span className={getThemeClass('transfer-icon')}>🎯</span>
                <div className={getThemeClass('transfer-info')}>
                  <strong>
                    {formData.destinationLocation
                      ? formatLocationName(formData.destinationLocation)
                      : 'Seleccionar destino'}
                  </strong>
                  <small>Destino</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmación de destino */}
        {formData.destinationLocation && destinationInfo[formData.destinationLocation] && (
          <div className={getThemeClass('selection-confirmation')}>
            <div className={`${getThemeClass('confirmation-card')} destination-confirmation`}>
              <div className={getThemeClass('confirmation-header')}>
                <span className={getThemeClass('confirmation-icon')}>🎯</span>
                <div className={getThemeClass('confirmation-text')}>
                  <strong>{formatLocationName(formData.destinationLocation)}</strong>
                  <br />
                  <small>Ubicación de destino confirmada</small>
                </div>
              </div>

              <div className={getThemeClass('capacity-confirmation')}>
                <div className={getThemeClass('capacity-detail')}>
                  <span className={getThemeClass('capacity-label')}>📊 Después de transferir:</span>
                  <span className={getThemeClass('capacity-value')}>
                    {destinationInfo[formData.destinationLocation].afterTransfer.toFixed(1)} gal
                  </span>
                </div>
                <div className={getThemeClass('occupancy-bar')}>
                  <div
                    className={getThemeClass('occupancy-fill')}
                    style={{
                      width: `${destinationInfo[formData.destinationLocation].occupancyAfter}%`,
                    }}
                  ></div>
                </div>
                <small className={getThemeClass('occupancy-text')}>
                  {destinationInfo[formData.destinationLocation].occupancyAfter.toFixed(1)}% de
                  capacidad ocupada
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step6_Destination;
