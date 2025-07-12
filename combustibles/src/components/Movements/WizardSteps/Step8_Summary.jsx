/**
 * Step8_Summary - Octavo paso del wizard: Resumen final y confirmación
 * Muestra todos los datos ingresados para revisión antes de crear el movimiento
 */

import React from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import { formatLocationName } from '../../../constants/locations';

const Step8_Summary = ({ formData, systemData, _isLoading, error, onCommentsChange, confirmChecked, onConfirmChange }) => {

  const { vehicles, products, suppliers } = systemData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMovementTypeInfo = () => {
    const types = {
      [MOVEMENT_TYPES.ENTRADA]: { icon: '📥', title: 'Entrada', color: 'entrada' },
      [MOVEMENT_TYPES.SALIDA]: { icon: '📤', title: 'Salida', color: 'salida' },
      [MOVEMENT_TYPES.TRANSFERENCIA]: { icon: '🔄', title: 'Transferencia', color: 'transferencia' },
      [MOVEMENT_TYPES.AJUSTE]: { icon: '⚖️', title: 'Ajuste', color: 'ajuste' }
    };
    return types[formData.type] || { icon: '❓', title: 'Desconocido', color: 'unknown' };
  };

  const getProductInfo = () => {
    return products.find(p => p.name === formData.fuelType || p.displayName === formData.fuelType);
  };

  const getVehicleInfo = () => {
    return vehicles.find(v => v.vehicleId === formData.vehicleId);
  };

  const getSupplierInfo = () => {
    const supplierName = formData.type === MOVEMENT_TYPES.ENTRADA ? 
      formData.supplierName : formData.location;
    return suppliers.find(s => s.name === supplierName);
  };

  const totalValue = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.unitPrice) || 0);
  const movementType = getMovementTypeInfo();
  const product = getProductInfo();
  const vehicle = getVehicleInfo();
  const supplier = getSupplierInfo();

  const handleComments = (e) => {
    onCommentsChange(e.target.value);
  };
  
  return (
    <div className={`wizard-step step-summary`}>
      <div className="typeform-layout">
        <div className="typeform-question">
          <h3>✅ Confirma tu movimiento</h3>
          <p>Revisa toda la información antes de crear el movimiento:</p>
        </div>

        {/* Resumen principal */}
        <div className="summary-main">
          <div className={`summary-header ${movementType.color}`}>
            <div className="summary-icon">{movementType.icon}</div>
            <div className="summary-title">
              <h4>{movementType.title} de Combustible</h4>
              <p>{parseFloat(formData.quantity).toFixed(2)} galones de {product?.displayName || formData.fuelType}</p>
            </div>
            <div className="summary-value">
              {formatCurrency(totalValue)}
            </div>
          </div>

          {/* Detalles del movimiento */}
          <div className="summary-details">
            
            {/* Combustible */}
            <div className="detail-row">
              <div className="detail-icon">⛽</div>
              <div className="detail-content">
                <span className="detail-label">Combustible:</span>
                <span className="detail-value">
                  {product?.icon} {product?.displayName || formData.fuelType}
                </span>
              </div>
            </div>

            {/* Cantidad y precio */}
            <div className="detail-row">
              <div className="detail-icon">📊</div>
              <div className="detail-content">
                <span className="detail-label">Cantidad:</span>
                <span className="detail-value">
                  {parseFloat(formData.quantity).toFixed(2)} gal × ${parseFloat(formData.unitPrice).toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>

            {/* Ubicación origen */}
            <div className="detail-row">
              <div className="detail-icon">
                {formData.type === MOVEMENT_TYPES.ENTRADA ? '🏪' : '📍'}
              </div>
              <div className="detail-content">
                <span className="detail-label">
                  {formData.type === MOVEMENT_TYPES.ENTRADA ? 'Proveedor:' : 'Origen:'}
                </span>
                <span className="detail-value">
                  {formData.type === MOVEMENT_TYPES.ENTRADA ? 
                    (supplier ? `${supplier.name} - ${supplier.city}` : formData.location) :
                    formatLocationName(formData.location)
                  }
                </span>
              </div>
            </div>

            {/* Vehículo (solo para salidas) */}
            {formData.type === MOVEMENT_TYPES.SALIDA && vehicle && (
              <div className="detail-row">
                <div className="detail-icon">🚜</div>
                <div className="detail-content">
                  <span className="detail-label">Vehículo:</span>
                  <span className="detail-value">
                    {vehicle.vehicleId} - {vehicle.name} ({vehicle.type})
                  </span>
                </div>
              </div>
            )}

            {/* Horómetro (solo para tractores) */}
            {formData.currentHours && (
              <div className="detail-row">
                <div className="detail-icon">⏱️</div>
                <div className="detail-content">
                  <span className="detail-label">Horómetro:</span>
                  <span className="detail-value">{formData.currentHours} horas</span>
                </div>
              </div>
            )}

            {/* Destino (solo para transferencias) */}
            {formData.type === MOVEMENT_TYPES.TRANSFERENCIA && formData.destinationLocation && (
              <div className="detail-row">
                <div className="detail-icon">🎯</div>
                <div className="detail-content">
                  <span className="detail-label">Destino:</span>
                  <span className="detail-value">{formatLocationName(formData.destinationLocation)}</span>
                </div>
              </div>
            )}

            {/* Fecha */}
            <div className="detail-row">
              <div className="detail-icon">📅</div>
              <div className="detail-content">
                <span className="detail-label">Fecha:</span>
                <span className="detail-value">
                  {new Date(formData.effectiveDate).toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            {/* Referencia */}
            {formData.reference && (
              <div className="detail-row">
                <div className="detail-icon">📄</div>
                <div className="detail-content">
                  <span className="detail-label">Referencia:</span>
                  <span className="detail-value">{formData.reference}</span>
                </div>
              </div>
            )}

            {/* Descripción */}
            {formData.description && (
              <div className="detail-row">
                <div className="detail-icon">📝</div>
                <div className="detail-content">
                  <span className="detail-label">Descripción:</span>
                  <span className="detail-value description">{formData.description}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Flujo visual para transferencias */}
        {formData.type === MOVEMENT_TYPES.TRANSFERENCIA && (
          <div className="transfer-flow-summary">
            <div className="flow-header">🔄 Flujo de Transferencia</div>
            <div className="flow-diagram">
              <div className="flow-location origin">
                <div className="flow-icon">📍</div>
                <div className="flow-text">
                  <strong>{formatLocationName(formData.location)}</strong>
                  <small>Origen</small>
                </div>
              </div>
              
              <div className="flow-arrow">
                <div className="arrow-line"></div>
                <div className="arrow-head">→</div>
                <div className="flow-quantity">
                  {parseFloat(formData.quantity).toFixed(1)} gal
                </div>
              </div>
              
              <div className="flow-location destination">
                <div className="flow-icon">🎯</div>
                <div className="flow-text">
                  <strong>{formatLocationName(formData.destinationLocation)}</strong>
                  <small>Destino</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campo de comentarios adicionales */}
        <div className="additional-comments-section">
          <div className="comments-header">
            <h4>💬 Comentarios Adicionales</h4>
            <small>Opcional - Agrega información adicional sobre este movimiento</small>
          </div>
          <textarea
            className="comments-textarea"
            value={formData.additionalComments || ''}
            onChange={handleComments}
            placeholder="Ejemplo: Combustible entregado por transporte especial, requiere almacenamiento prioritario, etc."
            rows={3}
            maxLength={500}
          />
          <div className="comments-counter">
            {(formData.additionalComments || '').length}/500 caracteres
          </div>
        </div>

        {/* Confirmación requerida */}
        <div className="confirmation-section">
          <div className="confirmation-checkbox">
            <input
              type="checkbox"
              id="confirmMovement"
              checked={confirmChecked}
              onChange={(e) => onConfirmChange(e.target.checked)}
            />
            <label htmlFor="confirmMovement">
              ✅ Confirmo que toda la información es correcta y autorizo crear este movimiento
            </label>
          </div>
          
          <div className="confirmation-warning">
            ⚠️ Una vez creado, el movimiento actualizará automáticamente el inventario
          </div>
        </div>

        {/* Error de validación */}
        {error && (
          <div className="summary-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {/* Botón de confirmación final ha sido removido */}
        
      </div>
    </div>
  );
};

export default Step8_Summary;
