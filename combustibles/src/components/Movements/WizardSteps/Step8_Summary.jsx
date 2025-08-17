/**
 * Step8_Summary - Resumen final del wizard  const getActionDescription = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const fuel = getProductInfo()?.displayName || formData.fuelType;
    const vehicle = getVehicleInfo();
    
    switch (formData.type) {
      case MOVEMENT_TYPES.ENTRADA:
        return `Recibir ${quantity} galones de ${fuel} de ${formData.supplierName}`;
      case MOVEMENT_TYPES.SALIDA:
        return `Entregar ${quantity} galones de ${fuel} a ${vehicle?.vehicleId || 'vehículo'}`;
      case MOVEMENT_TYPES.TRANSFERENCIA:
        return `Transferir ${quantity} galones de ${fuel} desde ${formatLocationName(formData.location)} hacia ${formatLocationName(formData.destinationLocation)}`;
      case MOVEMENT_TYPES.AJUSTE:
        return `Ajustar ${quantity} galones de ${fuel} en ${formatLocationName(formData.location)}`;
      default:
        return `Procesar ${quantity} galones de ${fuel}`;
    }
  };Typeform: confirmación elegante y clara
 */

import React from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';
import { formatLocationName } from '../../../constants/locations';

const Step8_Summary = ({
  formData,
  systemData,
  error,
  onCommentsChange,
  confirmChecked,
  onConfirmChange,
}) => {
  const { vehicles, products } = systemData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMovementTypeInfo = () => {
    const types = {
      [MOVEMENT_TYPES.ENTRADA]: { icon: '📥', title: 'Entrada de Combustible', color: 'entrada' },
      [MOVEMENT_TYPES.SALIDA]: { icon: '⛽', title: 'Salida de Combustible', color: 'salida' },
      [MOVEMENT_TYPES.TRANSFERENCIA]: {
        icon: '🔄',
        title: 'Transferencia',
        color: 'transferencia',
      },
      [MOVEMENT_TYPES.AJUSTE]: { icon: '⚖️', title: 'Ajuste de Inventario', color: 'ajuste' },
    };
    return types[formData.type] || { icon: '❓', title: 'Operación', color: 'unknown' };
  };

  const getProductInfo = () => {
    return products.find(
      (p) =>
        p.name?.toUpperCase() === formData.fuelType?.toUpperCase() ||
        p.displayName?.toUpperCase() === formData.fuelType?.toUpperCase()
    );
  };

  const getDisplayFuelType = () => {
    const product = getProductInfo();
    if (product?.displayName) {
      return product.displayName;
    }

    // Normalizar el fuelType a mayúsculas para consistencia
    const normalizedFuelType = formData.fuelType?.toUpperCase();

    // Mapeo de fallback para tipos conocidos
    const fuelTypeMap = {
      DIESEL: 'DIESEL 🚛',
      GASOLINE: 'GASOLINE 🚗',
      GASOLINE_CORRIENTE: 'Gasolina Corriente 🚗',
      GASOLINE_EXTRA: 'Gasolina Extra 🚗⭐',
    };

    return fuelTypeMap[normalizedFuelType] || normalizedFuelType || 'Combustible';
  };

  const getVehicleInfo = () => {
    return vehicles.find((v) => v.vehicleId === formData.vehicleId);
  };

  const getSummaryDescription = () => {
    const quantity = parseFloat(formData.quantity).toLocaleString('es-CO');
    const fuel = getDisplayFuelType();
    const vehicle = getVehicleInfo();

    switch (formData.type) {
      case MOVEMENT_TYPES.ENTRADA:
        return `Recibir ${quantity} galones de ${fuel} de ${formData.supplierName}`;
      case MOVEMENT_TYPES.SALIDA:
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
  const vehicle = getVehicleInfo();

  const handleComments = (e) => {
    onCommentsChange(e.target.value);
  };

  return (
    <div className={`wizard-step step-summary sap-theme`}>
      <div className="step-question sap-theme sap-theme">
        <h3>📋 Resumen del Movimiento</h3>
        <p>Revisa que toda la información sea correcta antes de procesar</p>
      </div>

      {/* Resumen principal SAP */}
      <div className="summary-sections sap-theme">
        <div className={`summary-section sap-theme ${movementType.color}`}>
          <h4>Tipo de Operación</h4>
          <div className="summary-item sap-theme sap-theme">
            <span className="summary-label sap-theme sap-theme">Operación:</span>
            <span className="summary-value sap-theme sap-theme">
              {movementType.icon} {movementType.title}
            </span>
          </div>
          <div className="summary-item sap-theme sap-theme">
            <span className="summary-label sap-theme sap-theme">Descripción:</span>
            <span className="summary-value sap-theme sap-theme">{getSummaryDescription()}</span>
          </div>
        </div>

        <div className="summary-section sap-theme sap-theme">
          <h4>Detalles del Combustible</h4>
          <div className="summary-item sap-theme sap-theme">
            <span className="summary-label sap-theme sap-theme">Tipo:</span>
            <span className="summary-value sap-theme sap-theme">{getDisplayFuelType()}</span>
          </div>
          <div className="summary-item highlight sap-theme">
            <span className="summary-label sap-theme">Cantidad:</span>
            <span className="summary-value sap-theme">
              {parseFloat(formData.quantity).toLocaleString('es-CO')} galones
            </span>
          </div>
          <div className="summary-item sap-theme sap-theme">
            <span className="summary-label sap-theme sap-theme">Precio unitario:</span>
            <span className="summary-value sap-theme sap-theme">
              {formatCurrency(parseFloat(formData.unitPrice))}
            </span>
          </div>
          <div className="summary-item total sap-theme">
            <span className="summary-label sap-theme">Valor total:</span>
            <span className="summary-value sap-theme">{formatCurrency(totalValue)}</span>
          </div>
        </div>

        {formData.type === MOVEMENT_TYPES.ENTRADA && (
          <div className="summary-section sap-theme sap-theme">
            <h4>Información del Proveedor</h4>
            <div className="summary-item sap-theme sap-theme">
              <span className="summary-label sap-theme sap-theme">Proveedor:</span>
              <span className="summary-value sap-theme sap-theme">{formData.supplierName}</span>
            </div>
            <div className="summary-item sap-theme sap-theme">
              <span className="summary-label sap-theme sap-theme">Destino:</span>
              <span className="summary-value sap-theme sap-theme">
                {formatLocationName(formData.destinationLocation)}
              </span>
            </div>
          </div>
        )}

        {formData.type === MOVEMENT_TYPES.SALIDA && vehicle && (
          <div className="summary-section sap-theme sap-theme">
            <h4>Información del Vehículo</h4>
            <div className="summary-item sap-theme sap-theme">
              <span className="summary-label sap-theme sap-theme">Vehículo:</span>
              <span className="summary-value sap-theme sap-theme">{vehicle.vehicleId}</span>
            </div>
            {formData.currentHours && (
              <div className="summary-item sap-theme sap-theme">
                <span className="summary-label sap-theme sap-theme">Horómetro:</span>
                <span className="summary-value sap-theme sap-theme">
                  {formData.currentHours} horas
                </span>
              </div>
            )}
          </div>
        )}

        {formData.type === MOVEMENT_TYPES.TRANSFERENCIA && (
          <div className="summary-section sap-theme sap-theme">
            <h4>Información de Transferencia</h4>
            <div className="summary-item sap-theme sap-theme">
              <span className="summary-label sap-theme sap-theme">Origen:</span>
              <span className="summary-value sap-theme sap-theme">
                {formatLocationName(formData.location)}
              </span>
            </div>
            <div className="summary-item sap-theme sap-theme">
              <span className="summary-label sap-theme sap-theme">Destino:</span>
              <span className="summary-value sap-theme sap-theme">
                {formatLocationName(formData.destinationLocation)}
              </span>
            </div>
          </div>
        )}

        {formData.description && (
          <div className="summary-section sap-theme sap-theme">
            <h4>Observaciones</h4>
            <div className="summary-item sap-theme sap-theme">
              <span className="summary-value sap-theme sap-theme">{formData.description}</span>
            </div>
          </div>
        )}
      </div>

      {/* Comentarios adicionales */}
      <div className="form-group sap-theme sap-theme">
        <label htmlFor="additional-comments" className="form-label sap-theme sap-theme">
          Comentarios Adicionales (Opcional)
        </label>
        <textarea
          id="additional-comments"
          value={formData.additionalComments || ''}
          onChange={handleComments}
          placeholder="Escriba cualquier observación o detalle especial..."
          className="form-textarea sap-theme sap-theme"
          rows="3"
        />
      </div>

      {/* Confirmación final */}
      <div className="confirmation-checkbox sap-theme sap-theme">
        <input
          type="checkbox"
          id="final-confirm"
          checked={confirmChecked}
          onChange={(e) => onConfirmChange(e.target.checked)}
        />
        <label htmlFor="final-confirm">
          Confirmo que toda la información es correcta y deseo procesar este movimiento
        </label>
      </div>

      {error && (
        <div className="wizard-error sap-theme sap-theme">
          <span className="error-icon sap-theme sap-theme">⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default Step8_Summary;
