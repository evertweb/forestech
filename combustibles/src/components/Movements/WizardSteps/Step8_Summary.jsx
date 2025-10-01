/**
 * Step8_Summary - Resumen final del wizard: confirmación elegante y clara
 * 
 * REFACTORED: Removed legacy service import
 * SIMPLIFIED: Only ENTRADA and SALIDA types (removed TRANSFERENCIA, AJUSTE)
 */

import React from 'react';
import { formatLocationName } from '../../../constants/locations';

// Tipos de movimiento simplificados
const MOVEMENT_TYPES = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
};

const Step8_Summary = ({
  formData,
  systemData,
  error,
  onCommentsChange,
  confirmChecked,
  onConfirmChange,
  theme = 'forestech',
}) => {
  const { vehicles, products } = systemData;

  // Helper para clases según el tema
  const getThemeClass = (baseClass) => {
    if (theme === 'government') {
      return `${baseClass} government-override`;
    }
    return `${baseClass} sap-theme`;
  };

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
    <div className={`wizard-step step-summary ${getThemeClass('')}`}>
      <div className={getThemeClass('step-question')}>
        <h3>📋 Resumen del Movimiento</h3>
        <p>Revisa que toda la información sea correcta antes de procesar</p>
      </div>

      {/* Resumen principal SAP */}
      <div className={getThemeClass('summary-sections')}>
        <div className={`${getThemeClass('summary-section')} ${movementType.color}`}>
          <h4>Tipo de Operación</h4>
          <div className={getThemeClass('summary-item')}>
            <span className={getThemeClass('summary-label')}>Operación:</span>
            <span className={getThemeClass('summary-value')}>
              {movementType.icon} {movementType.title}
            </span>
          </div>
          <div className={getThemeClass('summary-item')}>
            <span className={getThemeClass('summary-label')}>Descripción:</span>
            <span className={getThemeClass('summary-value')}>{getSummaryDescription()}</span>
          </div>
        </div>

        <div className={getThemeClass('summary-section')}>
          <h4>Detalles del Combustible</h4>
          <div className={getThemeClass('summary-item')}>
            <span className={getThemeClass('summary-label')}>Tipo:</span>
            <span className={getThemeClass('summary-value')}>{getDisplayFuelType()}</span>
          </div>
          <div className={`${getThemeClass('summary-item')} highlight`}>
            <span className={getThemeClass('summary-label')}>Cantidad:</span>
            <span className={getThemeClass('summary-value')}>
              {parseFloat(formData.quantity).toLocaleString('es-CO')} galones
            </span>
          </div>
          <div className={getThemeClass('summary-item')}>
            <span className={getThemeClass('summary-label')}>Precio unitario:</span>
            <span className={getThemeClass('summary-value')}>
              {formatCurrency(parseFloat(formData.unitPrice))}
            </span>
          </div>
          <div className={`${getThemeClass('summary-item')} total`}>
            <span className={getThemeClass('summary-label')}>Valor total:</span>
            <span className={getThemeClass('summary-value')}>{formatCurrency(totalValue)}</span>
          </div>
        </div>

        {formData.type === MOVEMENT_TYPES.ENTRADA && (
          <div className={getThemeClass('summary-section')}>
            <h4>Información del Proveedor</h4>
            <div className={getThemeClass('summary-item')}>
              <span className={getThemeClass('summary-label')}>Proveedor:</span>
              <span className={getThemeClass('summary-value')}>{formData.supplierName}</span>
            </div>
            <div className={getThemeClass('summary-item')}>
              <span className={getThemeClass('summary-label')}>Destino:</span>
              <span className={getThemeClass('summary-value')}>
                {formatLocationName(formData.destinationLocation)}
              </span>
            </div>
          </div>
        )}

        {formData.type === MOVEMENT_TYPES.SALIDA && vehicle && (
          <div className={getThemeClass('summary-section')}>
            <h4>Información del Vehículo</h4>
            <div className={getThemeClass('summary-item')}>
              <span className={getThemeClass('summary-label')}>Vehículo:</span>
              <span className={getThemeClass('summary-value')}>{vehicle.vehicleId}</span>
            </div>
            {formData.currentHours && (
              <div className={getThemeClass('summary-item')}>
                <span className={getThemeClass('summary-label')}>Horómetro:</span>
                <span className={getThemeClass('summary-value')}>
                  {formData.currentHours} horas
                </span>
              </div>
            )}
          </div>
        )}

        {formData.type === MOVEMENT_TYPES.TRANSFERENCIA && (
          <div className={getThemeClass('summary-section')}>
            <h4>Información de Transferencia</h4>
            <div className={getThemeClass('summary-item')}>
              <span className={getThemeClass('summary-label')}>Origen:</span>
              <span className={getThemeClass('summary-value')}>
                {formatLocationName(formData.location)}
              </span>
            </div>
            <div className={getThemeClass('summary-item')}>
              <span className={getThemeClass('summary-label')}>Destino:</span>
              <span className={getThemeClass('summary-value')}>
                {formatLocationName(formData.destinationLocation)}
              </span>
            </div>
          </div>
        )}

        {formData.description && (
          <div className={getThemeClass('summary-section')}>
            <h4>Observaciones</h4>
            <div className={getThemeClass('summary-item')}>
              <span className={getThemeClass('summary-value')}>{formData.description}</span>
            </div>
          </div>
        )}
      </div>

      {/* Comentarios adicionales */}
      <div className={getThemeClass('comments-section')}>
        <label htmlFor="additional-comments" className={getThemeClass('form-label')}>
          Comentarios Adicionales (Opcional)
        </label>
        <textarea
          id="additional-comments"
          value={formData.additionalComments || ''}
          onChange={handleComments}
          placeholder="Escriba cualquier observación o detalle especial..."
          className={getThemeClass('form-textarea')}
          rows="3"
        />
      </div>

      {/* Confirmación final */}
      <div className={getThemeClass('confirmation-checkbox')}>
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
        <div className={getThemeClass('wizard-error')}>
          <span className={getThemeClass('error-icon')}>⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default Step8_Summary;
