/**
 * Step6_Destination - Sexto paso del wizard: Selección de ubicación destino (solo para transferencias)
 * Valida capacidad disponible en destino y previene transferencias a la misma ubicación
 */

import React, { useState, useEffect } from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import { OPERATIONAL_LOCATIONS, STORAGE_LOCATIONS, formatLocationName } from '../../../constants/locations';

const Step6_Destination = ({ formData, updateFormData, systemData, setError, isEntryDestination = false }) => {
  const [loading, setLoading] = useState(false);
  const [destinationInfo, setDestinationInfo] = useState({});
  const [validatingCapacity, setValidatingCapacity] = useState(false);

  const { inventory } = systemData;

  // Validar capacidad disponible en destinos (solo para transferencias)
  useEffect(() => {
    const validateDestinationCapacity = async () => {
      // Solo validar capacidad para transferencias, NO para entradas
      if (formData.fuelType && formData.quantity && inventory.length > 0 && !isEntryDestination) {
        setValidatingCapacity(true);
        
        // Simular validación en tiempo real
        await new Promise(resolve => setTimeout(resolve, 700));
        
        const transferQuantity = parseFloat(formData.quantity) || 0;
        const capacityByLocation = {};
        
        OPERATIONAL_LOCATIONS
          .filter(location => isEntryDestination ? true : location !== formData.location) // Para entradas, incluir todas las ubicaciones
          .forEach(location => {
            // Calcular capacidad actual
            const currentStock = inventory
              .filter(item => 
                item.fuelType === formData.fuelType && 
                item.location?.toLowerCase() === location.toLowerCase() &&
                item.status === 'active'
              )
              .reduce((total, item) => total + (parseFloat(item.currentStock) || 0), 0);
            
            // Calcular capacidad máxima
            const maxCapacity = inventory
              .filter(item => 
                item.fuelType === formData.fuelType && 
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
              canAcceptTransfer
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
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

  const availableDestinations = isEntryDestination ? 
    STORAGE_LOCATIONS : // Para entradas, solo bodegas de almacenamiento
    OPERATIONAL_LOCATIONS.filter(loc => loc !== formData.location); // Para transferencias, excluir origen

  return (
    <div className={`wizard-step step-destination ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        <div className="typeform-question">
          <h3>🎯 {isEntryDestination ? '¿A qué ubicación llegará el combustible?' : '¿Hacia qué ubicación se transfiere?'}</h3>
          <p>Selecciona la ubicación de destino:</p>
        </div>

        {validatingCapacity && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>🔍 Verificando capacidad disponible...</p>
          </div>
        )}

        <div className="typeform-options">
          {availableDestinations.map((location) => {
            const destInfo = destinationInfo[location];
            const isSelectable = !destInfo || destInfo.canAcceptTransfer;
            
            return (
              <div
                key={location}
                className={`typeform-option ${formData.destinationLocation === location ? 'selected' : ''} 
                           ${destInfo?.status || 'unknown'} ${!isSelectable || loading ? 'disabled' : ''}`}
                onClick={() => isSelectable && !loading && handleDestinationSelection(location)}
              >
                <div className="typeform-option-icon">🎯</div>
                <div className="typeform-option-content">
                  <h4>{formatLocationName(location)}</h4>
                  
                  {destInfo && (
                    <div className="capacity-info">
                      <p className="capacity-message">{destInfo.message}</p>
                      
                      {destInfo.maxCapacity > 0 && (
                        <>
                          <div className="capacity-bar-mini">
                            <div 
                              className="capacity-current-mini" 
                              style={{ width: `${Math.min(100, (destInfo.currentStock / destInfo.maxCapacity) * 100)}%` }}
                            ></div>
                            {destInfo.canAcceptTransfer && (
                              <div 
                                className="capacity-after-mini" 
                                style={{ 
                                  width: `${Math.min(100, destInfo.occupancyAfter)}%`,
                                  left: `${Math.min(100, (destInfo.currentStock / destInfo.maxCapacity) * 100)}%`
                                }}
                              ></div>
                            )}
                          </div>
                          <small className="capacity-details">
                            Actual: {destInfo.currentStock.toFixed(1)}/{destInfo.maxCapacity.toFixed(1)} gal
                          </small>
                        </>
                      )}
                    </div>
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

        {/* Información de la transferencia */}
        {formData.location && formData.quantity && (
          <div className="transfer-summary">
            <div className="transfer-flow">
              <div className="transfer-origin">
                <span className="transfer-icon">📍</span>
                <div className="transfer-info">
                  <strong>{formatLocationName(formData.location)}</strong>
                  <small>Origen</small>
                </div>
              </div>
              
              <div className="transfer-arrow">
                <span>→</span>
                <small>{parseFloat(formData.quantity).toFixed(1)} gal</small>
              </div>
              
              <div className="transfer-destination">
                <span className="transfer-icon">🎯</span>
                <div className="transfer-info">
                  <strong>
                    {formData.destinationLocation ? 
                      formatLocationName(formData.destinationLocation) : 
                      'Seleccionar destino'
                    }
                  </strong>
                  <small>Destino</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmación de destino */}
        {formData.destinationLocation && destinationInfo[formData.destinationLocation] && (
          <div className="selection-confirmation">
            <div className="confirmation-card destination-confirmation">
              <div className="confirmation-header">
                <span className="confirmation-icon">🎯</span>
                <div className="confirmation-text">
                  <strong>{formatLocationName(formData.destinationLocation)}</strong>
                  <br />
                  <small>Ubicación de destino confirmada</small>
                </div>
              </div>
              
              <div className="capacity-confirmation">
                <div className="capacity-detail">
                  <span className="capacity-label">📊 Después de transferir:</span>
                  <span className="capacity-value">
                    {destinationInfo[formData.destinationLocation].afterTransfer.toFixed(1)} gal
                  </span>
                </div>
                <div className="occupancy-bar">
                  <div 
                    className="occupancy-fill" 
                    style={{ 
                      width: `${destinationInfo[formData.destinationLocation].occupancyAfter}%` 
                    }}
                  ></div>
                </div>
                <small className="occupancy-text">
                  {destinationInfo[formData.destinationLocation].occupancyAfter.toFixed(1)}% de capacidad ocupada
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