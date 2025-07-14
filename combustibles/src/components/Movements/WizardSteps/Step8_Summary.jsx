/**
 * Step8_Summary - Resumen final del wizard
 * Diseño estilo Typeform: confirmación elegante y clara
 */

import React from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import { formatLocationName } from '../../../constants/locations';

const Step8_Summary = ({ 
  formData, 
  systemData, 
  isLoading,
  error, 
  onCommentsChange, 
  confirmChecked, 
  onConfirmChange 
}) => {

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
      [MOVEMENT_TYPES.ENTRADA]: { icon: '📥', title: 'Entrada de Combustible', color: 'entrada' },
      [MOVEMENT_TYPES.SALIDA]: { icon: '⛽', title: 'Salida de Combustible', color: 'salida' },
      [MOVEMENT_TYPES.TRANSFERENCIA]: { icon: '🔄', title: 'Transferencia', color: 'transferencia' },
      [MOVEMENT_TYPES.AJUSTE]: { icon: '⚖️', title: 'Ajuste de Inventario', color: 'ajuste' }
    };
    return types[formData.type] || { icon: '❓', title: 'Operación', color: 'unknown' };
  };

  const getProductInfo = () => {
    return products.find(p => p.name === formData.fuelType || p.displayName === formData.fuelType);
  };

  const getVehicleInfo = () => {
    return vehicles.find(v => v.vehicleId === formData.vehicleId);
  };

  const getSummaryDescription = () => {
    const quantity = parseFloat(formData.quantity).toLocaleString('es-CO');
    const fuel = getProductInfo()?.displayName || formData.fuelType;
    
    switch (formData.type) {
      case MOVEMENT_TYPES.ENTRADA:
        return `Recibir ${quantity} galones de ${fuel} de ${formData.supplierName}`;
      case MOVEMENT_TYPES.SALIDA:
        const vehicle = getVehicleInfo();
        return `Entregar ${quantity} galones de ${fuel} a ${vehicle?.vehicleId || 'vehículo'}`;
      case MOVEMENT_TYPES.TRANSFERENCIA:
        return `Transferir ${quantity} galones de ${fuel} desde ${formatLocationName(formData.location)} hacia ${formatLocationName(formData.destinationLocation)}`;
      case MOVEMENT_TYPES.AJUSTE:
        return `Ajustar ${quantity} galones de ${fuel} en ${formatLocationName(formData.location)}`;
      default:
        return `Procesar ${quantity} galones de ${fuel}`;
    }
  };

  const totalValue = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.unitPrice) || 0);
  const movementType = getMovementTypeInfo();
  const product = getProductInfo();
  const vehicle = getVehicleInfo();

  const handleComments = (e) => {
    onCommentsChange(e.target.value);
  };
  
  return (
    <div className={`wizard-step step-summary`}>
      <div className="typeform-layout">
        <div className="typeform-question">
          <h2>🎯 ¡Perfecto! Vamos a confirmar</h2>
          <p>Revisa que todo esté correcto antes de procesar tu operación</p>
        </div>

        {/* Resumen principal elegante */}
        <div className="summary-main">
          <div className={`summary-header ${movementType.color}`}>
            <div className="summary-icon">{movementType.icon}</div>
            <div className="summary-title">
              <h4>{movementType.title}</h4>
              <p>{getSummaryDescription()}</p>
            </div>
            <div className="summary-value">
              {formatCurrency(totalValue)}
            </div>
          </div>

          {/* Detalles clave */}
          <div className="summary-details">
            <div className="detail-row">
              <div className="detail-icon">⛽</div>
              <div className="detail-content">
                <span className="detail-label">Combustible</span>
                <span className="detail-value">{product?.displayName || formData.fuelType}</span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon">📊</div>
              <div className="detail-content">
                <span className="detail-label">Cantidad</span>
                <span className="detail-value">{parseFloat(formData.quantity).toLocaleString('es-CO')} galones</span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-icon">💰</div>
              <div className="detail-content">
                <span className="detail-label">Precio unitario</span>
                <span className="detail-value">{formatCurrency(parseFloat(formData.unitPrice))}</span>
              </div>
            </div>

            {formData.type === MOVEMENT_TYPES.ENTRADA && (
              <div className="detail-row">
                <div className="detail-icon">🏪</div>
                <div className="detail-content">
                  <span className="detail-label">Proveedor</span>
                  <span className="detail-value">{formData.supplierName}</span>
                </div>
              </div>
            )}

            {(formData.type === MOVEMENT_TYPES.SALIDA || formData.type === MOVEMENT_TYPES.TRANSFERENCIA) && (
              <div className="detail-row">
                <div className="detail-icon">📍</div>
                <div className="detail-content">
                  <span className="detail-label">Ubicación origen</span>
                  <span className="detail-value">{formatLocationName(formData.location)}</span>
                </div>
              </div>
            )}

            {formData.type === MOVEMENT_TYPES.SALIDA && vehicle && (
              <div className="detail-row">
                <div className="detail-icon">🚗</div>
                <div className="detail-content">
                  <span className="detail-label">Vehículo</span>
                  <span className="detail-value">
                    {vehicle.vehicleId}
                    {formData.currentHours && ` - ${formData.currentHours} hrs`}
                  </span>
                </div>
              </div>
            )}

            {formData.type === MOVEMENT_TYPES.TRANSFERENCIA && (
              <div className="detail-row">
                <div className="detail-icon">🎯</div>
                <div className="detail-content">
                  <span className="detail-label">Destino</span>
                  <span className="detail-value">{formatLocationName(formData.destinationLocation)}</span>
                </div>
              </div>
            )}

            {formData.description && (
              <div className="detail-row">
                <div className="detail-icon">📝</div>
                <div className="detail-content">
                  <span className="detail-label">Descripción</span>
                  <span className="detail-value description">{formData.description}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comentarios adicionales */}
        <div className="typeform-input-section">
          <label htmlFor="additional-comments">
            💬 ¿Algún comentario adicional? (Opcional)
          </label>
          <textarea
            id="additional-comments"
            value={formData.additionalComments || ''}
            onChange={handleComments}
            placeholder="Escribe cualquier observación o detalle especial..."
            className="typeform-textarea"
            rows="3"
          />
        </div>

        {/* Confirmación final */}
        <div className="confirmation-section">
          <div className="confirmation-checkbox">
            <input
              type="checkbox"
              id="final-confirm"
              checked={confirmChecked}
              onChange={(e) => onConfirmChange(e.target.checked)}
            />
            <label htmlFor="final-confirm">
              ✅ Confirmo que toda la información es correcta y deseo procesar este movimiento
            </label>
          </div>

          <div className="confirmation-warning">
            ⚠️ Este movimiento actualizará automáticamente el inventario de combustibles
          </div>
        </div>

        {error && (
          <div className="validation-warning">
            🚫 {error}
          </div>
        )}

        {/* Mensaje final */}
        <div className="final-message">
          <p>🎉 <strong>¡Listo para procesar!</strong></p>
          <p>Tu movimiento será registrado inmediatamente en el sistema.</p>
        </div>
      </div>
    </div>
  );
};

export default Step8_Summary;