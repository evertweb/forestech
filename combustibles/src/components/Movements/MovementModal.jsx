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
import { getAllSuppliers } from '../../services/suppliersService';
import { getActiveProducts } from '../../services/productsService';
import { OPERATIONAL_LOCATIONS, formatLocationName } from '../../constants/locations';
import { validateStockAvailability, formatCurrency } from '../../utils/calculations';

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
    location: '',
    vehicleId: '',
    destinationLocation: '',
    description: '',
    reference: '',
    effectiveDate: new Date().toISOString().slice(0, 16), // Format for datetime-local
    currentHours: '' // Para horómetros de tractores
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [stockWarning, setStockWarning] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  // Cargar vehículos, inventario, proveedores y productos cuando se abre el modal
  useEffect(() => {
    const loadData = async () => {
      if (isOpen) {
        // Prevenir scroll del fondo cuando el modal está abierto
        document.body.style.overflow = 'hidden';
        setLoadingVehicles(true);
        try {
          console.log('🔄 Cargando datos para formulario de movimientos...');
          const [vehiclesData, inventoryResult, suppliersResult, productsData] = await Promise.all([
            getAllVehicles(),
            getAllInventoryItems(),
            getAllSuppliers(),
            getActiveProducts()
          ]);
          
          console.log('📊 Datos cargados:', {
            vehicles: vehiclesData?.length || 0,
            inventory: inventoryResult?.success ? inventoryResult.data?.length || 0 : 'Error',
            suppliers: suppliersResult?.success ? suppliersResult.data?.length || 0 : 'Error',
            products: productsData?.length || 0
          });
          
          setVehicles(vehiclesData);
          setInventory(inventoryResult.success ? inventoryResult.data : []);
          setSuppliers(suppliersResult.success ? suppliersResult.data : []);
          setProducts(productsData);
          
          console.log('✅ Datos cargados exitosamente');
        } catch (error) {
          console.error('❌ Error al cargar datos:', error);
        } finally {
          setLoadingVehicles(false);
        }
      } else {
        // Restaurar scroll del fondo cuando el modal se cierra
        document.body.style.overflow = 'unset';
      }
    };

    loadData();
    
    // Cleanup function para restaurar overflow
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Inicializar formulario
  useEffect(() => {
    if (movement && (mode === 'edit' || mode === 'view')) {
      setFormData({
        type: movement.type || '',
        fuelType: movement.fuelType || '',
        quantity: movement.quantity?.toString() || '',
        unitPrice: movement.unitPrice?.toString() || '',
        location: movement.location || 'principal',
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
        location: '',
        vehicleId: '',
        destinationLocation: '',
        description: '',
        reference: '',
        effectiveDate: new Date().toISOString().slice(0, 16),
        currentHours: ''
      });
    }
    setError('');
    setValidationErrors({});
  }, [movement, mode, isOpen]);

  // Auto-llenar precio cuando se selecciona combustible
  useEffect(() => {
    if (formData.fuelType && !formData.unitPrice && products.length > 0) {
      const productData = products.find(p => p.name === formData.fuelType || p.displayName === formData.fuelType);
      if (productData && productData.defaultPrice) {
        setFormData(prev => ({
          ...prev,
          unitPrice: productData.defaultPrice.toString()
        }));
      }
    }
  }, [formData.fuelType, products]);

  // Estado para información de stock detallada
  const [stockInfo, setStockInfo] = useState(null);

  // Calcular información de stock disponible en tiempo real
  useEffect(() => {
    setStockWarning('');
    setStockInfo(null);
    
    // Solo mostrar info para salidas y transferencias con combustible y ubicación seleccionados
    if ((formData.type === MOVEMENT_TYPES.SALIDA || formData.type === MOVEMENT_TYPES.TRANSFERENCIA) &&
        formData.fuelType && formData.location && formData.location.trim() !== '' && inventory.length > 0) {
      
      // Calcular stock disponible en la ubicación específica
      const availableStock = inventory
        .filter(item => 
          item.fuelType === formData.fuelType && 
          item.location?.toLowerCase() === formData.location?.toLowerCase() &&
          item.status === 'active'
        )
        .reduce((total, item) => total + (parseFloat(item.currentStock) || 0), 0);

      // Calcular capacidad máxima total para este combustible en esta ubicación
      const maxCapacity = inventory
        .filter(item => 
          item.fuelType === formData.fuelType && 
          item.location?.toLowerCase() === formData.location?.toLowerCase() &&
          item.status === 'active'
        )
        .reduce((total, item) => total + (parseFloat(item.maxCapacity) || 0), 0);

      // Calcular información de stock
      const requiredStock = parseFloat(formData.quantity) || 0;
      const remainingStock = availableStock - requiredStock;
      const capacityPercentage = maxCapacity > 0 ? (availableStock / maxCapacity) * 100 : 0;
      
      // Determinar estado del stock
      let status = 'available';
      let icon = '✅';
      let title = 'Stock Disponible';
      let message = `Hay suficiente stock para realizar el movimiento.`;
      
      if (requiredStock > 0) {
        if (availableStock < requiredStock) {
          status = 'critical';
          icon = '🚫';
          title = 'Stock Insuficiente';
          message = `No hay suficiente stock. Necesitas ${(requiredStock - availableStock).toFixed(2)} galones adicionales.`;
        } else if (remainingStock < (availableStock * 0.2)) {
          status = 'warning';
          icon = '⚠️';
          title = 'Stock Quedará Bajo';
          message = `Después del movimiento, el stock quedará en ${remainingStock.toFixed(2)} galones (${((remainingStock / maxCapacity) * 100).toFixed(1)}%).`;
        } else {
          message = `Después del movimiento quedarán ${remainingStock.toFixed(2)} galones disponibles.`;
        }
      }

      setStockInfo({
        available: availableStock,
        required: requiredStock,
        remaining: remainingStock,
        capacityPercentage,
        maxCapacity,
        status,
        icon,
        title,
        message,
        isValid: availableStock >= requiredStock
      });

      // Mostrar información de diagnóstico
      console.log('🔍 Stock Analysis:', {
        fuelType: formData.fuelType,
        location: formData.location,
        available: availableStock,
        required: requiredStock,
        remaining: remainingStock,
        status,
        inventoryItems: inventory.filter(item => 
          item.fuelType === formData.fuelType && 
          item.location?.toLowerCase() === formData.location?.toLowerCase()
        ).length
      });

      // Validación adicional usando la función existente
      if (requiredStock > 0) {
        const movementForValidation = {
          type: formData.type === MOVEMENT_TYPES.SALIDA ? 'outbound' : 'transfer',
          fuelType: formData.fuelType,
          quantity: formData.quantity,
          sourceLocation: formData.location
        };

        const validation = validateStockAvailability(movementForValidation, inventory);
        
        if (!validation.isValid) {
          setStockWarning(`🚫 ${validation.error}`);
        } else if (validation.warning) {
          setStockWarning(`⚠️ ${validation.warning}`);
        }
      }
    }
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

  // Detectar si el vehículo seleccionado es un tractor
  const getSelectedVehicle = () => {
    if (!formData.vehicleId || !vehicles.length) return null;
    return vehicles.find(v => v.vehicleId === formData.vehicleId);
  };

  const isTractor = () => {
    const selectedVehicle = getSelectedVehicle();
    if (!selectedVehicle) return false;
    
    // Detectar tractores por ID (TR1, TR2, TR3) o por categoría
    const vehicleId = selectedVehicle.vehicleId?.toUpperCase();
    const isTracktorById = vehicleId && (
      vehicleId.includes('TR1') || 
      vehicleId.includes('TR2') || 
      vehicleId.includes('TR3') ||
      vehicleId === 'TR1' ||
      vehicleId === 'TR2' ||
      vehicleId === 'TR3'
    );
    
    const isTracktorByCategory = selectedVehicle.category === 'tractor' || 
                                selectedVehicle.type?.toLowerCase().includes('tractor');
    
    return isTracktorById || isTracktorByCategory;
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
    if (formData.type === MOVEMENT_TYPES.ENTRADA && !formData.location) {
      errors.location = 'Las entradas requieren un proveedor';
    }

    if ((formData.type === MOVEMENT_TYPES.SALIDA || formData.type === MOVEMENT_TYPES.TRANSFERENCIA) && !formData.location) {
      errors.location = 'La ubicación es requerida para salidas y transferencias';
    }

    if (formData.type === MOVEMENT_TYPES.SALIDA && !formData.vehicleId) {
      errors.vehicleId = 'Las salidas requieren un vehículo';
    }

    if (formData.type === MOVEMENT_TYPES.TRANSFERENCIA && !formData.destinationLocation) {
      errors.destinationLocation = 'Las transferencias requieren una ubicación destino';
    }

    // Validación de horómetro para tractores en salidas
    if (formData.type === MOVEMENT_TYPES.SALIDA && isTractor()) {
      if (!formData.currentHours) {
        errors.currentHours = 'La lectura del horómetro es requerida para tractores';
      } else if (parseFloat(formData.currentHours) < 0) {
        errors.currentHours = 'La lectura del horómetro debe ser mayor a 0';
      } else {
        // Validar que la lectura sea incremental respecto a la anterior
        const selectedVehicle = getSelectedVehicle();
        if (selectedVehicle?.currentHours && parseFloat(formData.currentHours) < parseFloat(selectedVehicle.currentHours)) {
          errors.currentHours = `La lectura debe ser mayor a la anterior: ${selectedVehicle.currentHours} hrs`;
        }
      }
    }

    // Validación crítica de stock usando calculations.js
    if ((formData.type === MOVEMENT_TYPES.SALIDA || formData.type === MOVEMENT_TYPES.TRANSFERENCIA) &&
        formData.fuelType && formData.location && formData.quantity && inventory.length > 0) {
      
      const movementForValidation = {
        type: formData.type === MOVEMENT_TYPES.SALIDA ? 'outbound' : 'transfer',
        fuelType: formData.fuelType,
        quantity: formData.quantity,
        sourceLocation: formData.location
      };

      const validation = validateStockAvailability(movementForValidation, inventory);
      
      if (!validation.isValid) {
        errors.quantity = validation.error;
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

        {/* Botón de prueba para debug */}
        {mode === 'create' && (
          <div style={{ padding: '10px', background: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
            <button 
              onClick={() => {
                console.log('🔍 Debug - Estado actual:', {
                  products: products.length,
                  vehicles: vehicles.length,
                  suppliers: suppliers.length,
                  inventory: inventory.length,
                  loadingVehicles
                });
                alert(`Productos: ${products.length}, Vehículos: ${vehicles.length}, Proveedores: ${suppliers.length}`);
              }}
              style={{ 
                background: '#007bff', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔍 Debug Datos
            </button>
          </div>
        )}

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
                  <option value="">Seleccionar producto/combustible...</option>
                  {products.map(product => (
                    <option key={product.id} value={product.name}>
                      {product.icon} {product.displayName}
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
                  <div className={`stock-warning ${stockInfo?.status === 'critical' ? 'critical' : ''}`}>
                    {stockWarning}
                  </div>
                )}
              </div>
            </div>

            {/* Cuadro de Stock en Tiempo Real */}
            {stockInfo && (formData.type === MOVEMENT_TYPES.SALIDA || formData.type === MOVEMENT_TYPES.TRANSFERENCIA) && mode !== 'view' && (
              <div className={`stock-info-container ${stockInfo.status}`}>
                <div className="stock-info-header">
                  <div className="stock-info-icon">
                    {stockInfo.icon}
                  </div>
                  <h4 className="stock-info-title">{stockInfo.title}</h4>
                </div>
                
                <div className="stock-info-details">
                  <div className="stock-detail-item">
                    <span className="stock-detail-label">Stock Disponible</span>
                    <span className="stock-detail-value">
                      {stockInfo.available.toFixed(2)} gal
                    </span>
                  </div>
                  
                  <div className="stock-detail-item">
                    <span className="stock-detail-label">
                      {stockInfo.required > 0 ? 'Stock Restante' : 'Capacidad Total'}
                    </span>
                    <span className="stock-detail-value">
                      {stockInfo.required > 0 
                        ? `${Math.max(0, stockInfo.remaining).toFixed(2)} gal`
                        : `${stockInfo.maxCapacity.toFixed(2)} gal`
                      }
                    </span>
                  </div>
                </div>

                {stockInfo.maxCapacity > 0 && (
                  <div className="stock-bar-container">
                    <div className="stock-bar">
                      <div 
                        className="stock-bar-fill" 
                        style={{ 
                          width: `${Math.min(100, Math.max(0, stockInfo.capacityPercentage))}%` 
                        }}
                      ></div>
                    </div>
                    <div className="stock-bar-label">
                      {stockInfo.capacityPercentage.toFixed(1)}% de capacidad utilizada
                    </div>
                  </div>
                )}

                <div className="stock-info-message">
                  {stockInfo.message}
                </div>
              </div>
            )}

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
                <label>
                  {formData.type === MOVEMENT_TYPES.ENTRADA ? 'Proveedor *' : 'Ubicación'}
                </label>
                {formData.type === MOVEMENT_TYPES.ENTRADA ? (
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={mode === 'view'}
                    className={validationErrors.location ? 'error' : ''}
                  >
                    <option value="">Seleccionar proveedor...</option>
                    {suppliers.filter(s => s.status === 'active').map(supplier => (
                      <option key={supplier.id} value={supplier.name}>
                        🏪 {supplier.name} - {supplier.city}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={mode === 'view'}
                  >
                    <option value="">Seleccionar ubicación...</option>
                    {OPERATIONAL_LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>
                        📍 {formatLocationName(loc)}
                      </option>
                    ))}
                  </select>
                )}
                {validationErrors.location && (
                  <span className="field-error">{validationErrors.location}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  {formData.type === MOVEMENT_TYPES.ENTRADA 
                    ? 'Vehículo que hizo el transporte' 
                    : `Vehículo/Equipo ${formData.type === MOVEMENT_TYPES.SALIDA ? '*' : ''}`}
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

            {/* Campo Horómetro para tractores en salidas */}
            {formData.type === MOVEMENT_TYPES.SALIDA && isTractor() && (
              <div className="form-row">
                <div className="form-group">
                  <label>⏱️ Lectura Horómetro *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.currentHours}
                    onChange={(e) => handleInputChange('currentHours', e.target.value)}
                    disabled={mode === 'view'}
                    placeholder="Horas actuales del tractor"
                    className={validationErrors.currentHours ? 'error' : ''}
                  />
                  {validationErrors.currentHours && (
                    <span className="field-error">{validationErrors.currentHours}</span>
                  )}
                  {getSelectedVehicle()?.currentHours && (
                    <small className="field-hint">
                      Última lectura: {getSelectedVehicle().currentHours} horas
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label>ℹ️ Información del Tractor</label>
                  <div className="tractor-info">
                    <p><strong>Vehículo:</strong> {getSelectedVehicle()?.name || formData.vehicleId}</p>
                    <p><strong>Tipo:</strong> {getSelectedVehicle()?.type || 'Tractor'}</p>
                    <p><strong>Estado:</strong> {getSelectedVehicle()?.status || 'Activo'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ENTRADA: Ubicación destino */}
            {formData.type === MOVEMENT_TYPES.ENTRADA && (
              <div className="form-row">
                <div className="form-group">
                  <label>Ubicación Destino</label>
                  <select
                    value={formData.destinationLocation}
                    onChange={(e) => handleInputChange('destinationLocation', e.target.value)}
                    disabled={mode === 'view'}
                    className={validationErrors.destinationLocation ? 'error' : ''}
                  >
                    <option value="">Seleccionar ubicación destino (opcional)...</option>
                    {OPERATIONAL_LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>
                        📍 {formatLocationName(loc)}
                      </option>
                    ))}
                  </select>
                  {validationErrors.destinationLocation && (
                    <span className="field-error">{validationErrors.destinationLocation}</span>
                  )}
                  <small className="field-hint">
                    Si no se especifica, se usará la ubicación "Principal"
                  </small>
                </div>
              </div>
            )}

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
                    {OPERATIONAL_LOCATIONS.filter(loc => loc !== formData.location).map(loc => (
                      <option key={loc} value={loc}>
                        📍 {formatLocationName(loc)}
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