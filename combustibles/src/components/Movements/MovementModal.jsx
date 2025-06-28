/**
 * MovementModal - Modal para crear, editar y ver movimientos
 * Formulario completo con validaciones y vista de detalles
 */

import React, { useState, useEffect } from 'react';
import { 
  createMovement, 
  updateMovement, 
  MOVEMENT_TYPES,
  MOVEMENT_STATUS 
} from '../../services/movementsService';
import { getAllVehicles } from '../../services/vehiclesService';
import { getAllInventoryItems } from '../../services/inventoryService';

const MovementModal = ({ 
  isOpen, 
  onClose, 
  movement, 
  mode, // 'create' | 'edit' | 'view'
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    type: '',
    fuelType: '',
    quantity: '',
    unitPrice: '',
    location: 'Principal',
    vehicleId: '',
    destinationLocation: '',
    description: '',
    reference: '',
    effectiveDate: new Date().toISOString().slice(0, 16) // Format for datetime-local
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [stockWarning, setStockWarning] = useState('');

  // Tipos de combustible disponibles
  const fuelTypes = [
    { value: 'Diesel', label: 'Diesel 🚛', price: 12500 },
    { value: 'Gasolina', label: 'Gasolina 🚗', price: 14200 },
    { value: 'ACPM', label: 'ACPM 🚚', price: 13800 },
    { value: 'Lubricante', label: 'Lubricante 🛢️', price: 45000 }
  ];

  // Ubicaciones disponibles
  const locations = [
    'Principal',
    'Bodega Norte',
    'Bodega Sur',
    'Campo Operativo',
    'Estación Móvil'
  ];

  // Cargar vehículos y inventario cuando se abre el modal
  useEffect(() => {
    const loadData = async () => {
      if (isOpen) {
        setLoadingVehicles(true);
        try {
          const [vehiclesData, inventoryResult] = await Promise.all([
            getAllVehicles(),
            getAllInventoryItems()
          ]);
          setVehicles(vehiclesData);
          setInventory(inventoryResult.success ? inventoryResult.data : []);
        } catch (error) {
          console.error('Error al cargar datos:', error);
        } finally {
          setLoadingVehicles(false);
        }
      }
    };

    loadData();
  }, [isOpen]);

  // Inicializar formulario
  useEffect(() => {
    if (movement && (mode === 'edit' || mode === 'view')) {
      setFormData({
        type: movement.type || '',
        fuelType: movement.fuelType || '',
        quantity: movement.quantity?.toString() || '',
        unitPrice: movement.unitPrice?.toString() || '',
        location: movement.location || 'Principal',
        vehicleId: movement.vehicleId || '',
        destinationLocation: movement.destinationLocation || '',
        description: movement.description || '',
        reference: movement.reference || '',
        effectiveDate: movement.effectiveDate 
          ? new Date(movement.effectiveDate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16)
      });
    } else if (mode === 'create') {
      // Reset para nuevo movimiento
      setFormData({
        type: '',
        fuelType: '',
        quantity: '',
        unitPrice: '',
        location: 'Principal',
        vehicleId: '',
        destinationLocation: '',
        description: '',
        reference: '',
        effectiveDate: new Date().toISOString().slice(0, 16)
      });
    }
    setError('');
    setValidationErrors({});
  }, [movement, mode, isOpen]);

  // Auto-llenar precio cuando se selecciona combustible
  useEffect(() => {
    if (formData.fuelType && !formData.unitPrice) {
      const fuelData = fuelTypes.find(f => f.value === formData.fuelType);
      if (fuelData) {
        setFormData(prev => ({
          ...prev,
          unitPrice: fuelData.price.toString()
        }));
      }
    }
  }, [formData.fuelType]);

  // Validar stock disponible en tiempo real para salidas y transferencias
  useEffect(() => {
    const validateStock = () => {
      setStockWarning('');
      
      // Solo validar para salidas y transferencias con datos completos
      if ((formData.type === MOVEMENT_TYPES.SALIDA || formData.type === MOVEMENT_TYPES.TRANSFERENCIA) &&
          formData.fuelType && formData.location && formData.quantity && inventory.length > 0) {
        
        // Buscar inventario para el combustible y ubicación específicos
        const availableStock = inventory.find(item => 
          item.fuelType === formData.fuelType && 
          item.location === formData.location
        );

        if (!availableStock) {
          setStockWarning(`⚠️ No hay inventario de ${formData.fuelType} en ${formData.location}`);
          return;
        }

        const requestedQuantity = parseFloat(formData.quantity);
        const currentStock = availableStock.currentStock || 0;

        if (requestedQuantity > currentStock) {
          setStockWarning(
            `⚠️ Stock insuficiente. Disponible: ${currentStock.toFixed(2)} gal, Solicitado: ${requestedQuantity.toFixed(2)} gal`
          );
        } else if (requestedQuantity > currentStock * 0.8) {
          setStockWarning(
            `⚠️ Atención: Esta salida dejará poco stock (${(currentStock - requestedQuantity).toFixed(2)} gal restantes)`
          );
        }
      }
    };

    validateStock();
  }, [formData.type, formData.fuelType, formData.location, formData.quantity, inventory]);

  // Manejar cambios en el formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error de validación para este campo
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    if (!formData.type) {
      errors.type = 'Tipo de movimiento requerido';
    }

    if (!formData.fuelType) {
      errors.fuelType = 'Tipo de combustible requerido';
    }

    if (!formData.quantity) {
      errors.quantity = 'Cantidad requerida';
    } else if (parseFloat(formData.quantity) <= 0) {
      errors.quantity = 'La cantidad debe ser mayor a cero';
    }

    if (!formData.unitPrice) {
      errors.unitPrice = 'Precio unitario requerido';
    } else if (parseFloat(formData.unitPrice) < 0) {
      errors.unitPrice = 'El precio no puede ser negativo';
    }

    // Validaciones específicas por tipo
    if (formData.type === MOVEMENT_TYPES.SALIDA && !formData.vehicleId) {
      errors.vehicleId = 'Las salidas requieren un vehículo';
    }

    if (formData.type === MOVEMENT_TYPES.TRANSFERENCIA && !formData.destinationLocation) {
      errors.destinationLocation = 'Las transferencias requieren una ubicación destino';
    }

    // Validación crítica de stock para salidas y transferencias
    if ((formData.type === MOVEMENT_TYPES.SALIDA || formData.type === MOVEMENT_TYPES.TRANSFERENCIA) &&
        formData.fuelType && formData.location && formData.quantity && inventory.length > 0) {
      
      const availableStock = inventory.find(item => 
        item.fuelType === formData.fuelType && 
        item.location === formData.location
      );

      if (!availableStock) {
        errors.quantity = `No hay inventario de ${formData.fuelType} en ${formData.location}`;
      } else {
        const requestedQuantity = parseFloat(formData.quantity);
        const currentStock = availableStock.currentStock || 0;

        if (requestedQuantity > currentStock) {
          errors.quantity = `Stock insuficiente. Disponible: ${currentStock.toFixed(2)} gal`;
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const movementData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        effectiveDate: new Date(formData.effectiveDate)
      };

      if (mode === 'create') {
        await createMovement(movementData);
      } else if (mode === 'edit') {
        await updateMovement(movement.id, movementData);
      }

      onSuccess();
    } catch (error) {
      console.error('Error al guardar movimiento:', error);
      setError(error.message || 'Error al guardar el movimiento');
    } finally {
      setLoading(false);
    }
  };

  // Calcular valor total
  const totalValue = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.unitPrice) || 0);

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Obtener título del modal
  const getModalTitle = () => {
    switch (mode) {
      case 'create': return '➕ Nuevo Movimiento';
      case 'edit': return '✏️ Editar Movimiento';
      case 'view': return '👁️ Detalles del Movimiento';
      default: return 'Movimiento';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content movement-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>{getModalTitle()}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="movement-form">
            {/* Tipo y Estado */}
            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Movimiento *</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  disabled={mode === 'view'}
                  className={validationErrors.type ? 'error' : ''}
                >
                  <option value="">Seleccionar tipo...</option>
                  <option value={MOVEMENT_TYPES.ENTRADA}>📥 Entrada</option>
                  <option value={MOVEMENT_TYPES.SALIDA}>📤 Salida</option>
                  <option value={MOVEMENT_TYPES.TRANSFERENCIA}>🔄 Transferencia</option>
                  <option value={MOVEMENT_TYPES.AJUSTE}>⚖️ Ajuste</option>
                </select>
                {validationErrors.type && (
                  <span className="field-error">{validationErrors.type}</span>
                )}
              </div>

              {mode === 'view' && movement && (
                <div className="form-group">
                  <label>Estado</label>
                  <div className="status-display">
                    <span className={`status-badge status-${movement.status}`}>
                      {movement.status === MOVEMENT_STATUS.COMPLETADO && '✅'}
                      {movement.status === MOVEMENT_STATUS.PENDIENTE && '⏳'}
                      {movement.status === MOVEMENT_STATUS.CANCELADO && '❌'}
                      {movement.status.charAt(0).toUpperCase() + movement.status.slice(1)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Combustible y Cantidad */}
            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Combustible *</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  disabled={mode === 'view'}
                  className={validationErrors.fuelType ? 'error' : ''}
                >
                  <option value="">Seleccionar combustible...</option>
                  {fuelTypes.map(fuel => (
                    <option key={fuel.value} value={fuel.value}>
                      {fuel.label}
                    </option>
                  ))}
                </select>
                {validationErrors.fuelType && (
                  <span className="field-error">{validationErrors.fuelType}</span>
                )}
              </div>

              <div className="form-group">
                <label>Cantidad (galones) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  disabled={mode === 'view'}
                  placeholder="0.00"
                  className={validationErrors.quantity ? 'error' : ''}
                />
                {validationErrors.quantity && (
                  <span className="field-error">{validationErrors.quantity}</span>
                )}
                {stockWarning && !validationErrors.quantity && (
                  <div className="stock-warning">
                    {stockWarning}
                  </div>
                )}
              </div>
            </div>

            {/* Precio y Valor Total */}
            <div className="form-row">
              <div className="form-group">
                <label>Precio Unitario (COP) *</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={formData.unitPrice}
                  onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                  disabled={mode === 'view'}
                  placeholder="0"
                  className={validationErrors.unitPrice ? 'error' : ''}
                />
                {validationErrors.unitPrice && (
                  <span className="field-error">{validationErrors.unitPrice}</span>
                )}
              </div>

              <div className="form-group">
                <label>Valor Total</label>
                <div className="total-value-display">
                  {formatCurrency(totalValue)}
                </div>
              </div>
            </div>

            {/* Ubicación y Vehículo */}
            <div className="form-row">
              <div className="form-group">
                <label>Ubicación</label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={mode === 'view'}
                >
                  {locations.map(location => (
                    <option key={location} value={location}>
                      📍 {location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Vehículo/Equipo {formData.type === MOVEMENT_TYPES.SALIDA && '*'}
                </label>
                {formData.type === MOVEMENT_TYPES.SALIDA ? (
                  loadingVehicles ? (
                    <div className="loading-vehicles">
                      <span className="loading-spinner small"></span>
                      Cargando vehículos...
                    </div>
                  ) : (
                    <select
                      value={formData.vehicleId}
                      onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                      disabled={mode === 'view'}
                      className={validationErrors.vehicleId ? 'error' : ''}
                    >
                      <option value="">Seleccionar vehículo destino...</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.vehicleId}>
                          🚜 {vehicle.vehicleId} - {vehicle.name} ({vehicle.type})
                        </option>
                      ))}
                    </select>
                  )
                ) : (
                  <input
                    type="text"
                    value={formData.vehicleId}
                    onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                    disabled={mode === 'view'}
                    placeholder="ID del vehículo o equipo"
                    className={validationErrors.vehicleId ? 'error' : ''}
                  />
                )}
                {validationErrors.vehicleId && (
                  <span className="field-error">{validationErrors.vehicleId}</span>
                )}
              </div>
            </div>

            {/* Transferencia: Ubicación destino */}
            {formData.type === MOVEMENT_TYPES.TRANSFERENCIA && (
              <div className="form-row">
                <div className="form-group">
                  <label>Ubicación Destino *</label>
                  <select
                    value={formData.destinationLocation}
                    onChange={(e) => handleInputChange('destinationLocation', e.target.value)}
                    disabled={mode === 'view'}
                    className={validationErrors.destinationLocation ? 'error' : ''}
                  >
                    <option value="">Seleccionar destino...</option>
                    {locations.filter(loc => loc !== formData.location).map(location => (
                      <option key={location} value={location}>
                        📍 {location}
                      </option>
                    ))}
                  </select>
                  {validationErrors.destinationLocation && (
                    <span className="field-error">{validationErrors.destinationLocation}</span>
                  )}
                </div>
              </div>
            )}

            {/* Fecha y Referencia */}
            <div className="form-row">
              <div className="form-group">
                <label>Fecha Efectiva</label>
                <input
                  type="datetime-local"
                  value={formData.effectiveDate}
                  onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                  disabled={mode === 'view'}
                />
              </div>

              <div className="form-group">
                <label>Referencia</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                  disabled={mode === 'view'}
                  placeholder="Factura, orden, etc."
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="form-row">
              <div className="form-group full-width">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={mode === 'view'}
                  placeholder="Detalles adicionales del movimiento..."
                  rows="3"
                />
              </div>
            </div>

            {/* Vista de solo lectura: información adicional */}
            {mode === 'view' && movement && (
              <div className="movement-details">
                <div className="details-section">
                  <h4>📋 Información del Sistema</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>ID:</label>
                      <span>{movement.id}</span>
                    </div>
                    <div className="detail-item">
                      <label>Creado:</label>
                      <span>{new Date(movement.createdAt).toLocaleString('es-CO')}</span>
                    </div>
                    {movement.updatedAt && (
                      <div className="detail-item">
                        <label>Actualizado:</label>
                        <span>{new Date(movement.updatedAt).toLocaleString('es-CO')}</span>
                      </div>
                    )}
                    {movement.approvedAt && (
                      <div className="detail-item">
                        <label>Aprobado:</label>
                        <span>{new Date(movement.approvedAt).toLocaleString('es-CO')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={onClose}
          >
            {mode === 'view' ? 'Cerrar' : 'Cancelar'}
          </button>
          
          {mode !== 'view' && (
            <button 
              type="submit"
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner small"></span>
                  Guardando...
                </>
              ) : (
                mode === 'create' ? 'Crear Movimiento' : 'Actualizar Movimiento'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovementModal;