/**
 * VehicleModal - Modal para crear, editar y ver detalles de vehículos
 * Incluye validaciones business logic y preview en tiempo real
 */

import React, { useState, useEffect } from 'react';
import { VEHICLE_TYPES, VEHICLE_STATUS, FUEL_COMPATIBILITY } from '../../services/vehiclesService';
import { VEHICLE_INFO } from '../../constants/vehicleTypes';
import { FUEL_TYPES, FUEL_INFO } from '../../constants/combustibleTypes';

const VehicleModal = ({ 
  isOpen, 
  onClose, 
  vehicle, 
  onSave, 
  mode = 'create', 
  userRole 
}) => {
  // Estado inicial del formulario
  const getInitialFormData = () => ({
    vehicleId: vehicle?.vehicleId || '',
    name: vehicle?.name || '',
    type: vehicle?.type || VEHICLE_TYPES.EXCAVADORA,
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    fuelType: vehicle?.fuelType || FUEL_COMPATIBILITY.DIESEL,
    fuelCapacity: vehicle?.fuelCapacity || 0,
    enginePower: vehicle?.enginePower || 0,
    status: vehicle?.status || VEHICLE_STATUS.ACTIVO,
    currentLocation: vehicle?.currentLocation || '',
    description: vehicle?.description || '',
    estimatedConsumptionPerHour: vehicle?.estimatedConsumptionPerHour || 0,
    serialNumber: vehicle?.serialNumber || '',
    plateNumber: vehicle?.plateNumber || '',
    // ✅ NUEVO: Campos para horómetro de tractores
    hasHourMeter: vehicle?.hasHourMeter || false,
    currentHours: vehicle?.currentHours || 0,
    lastMaintenanceDate: vehicle?.lastMaintenanceDate ? 
      new Date(vehicle.lastMaintenanceDate).toISOString().split('T')[0] : '',
    nextMaintenanceDate: vehicle?.nextMaintenanceDate ? 
      new Date(vehicle.nextMaintenanceDate).toISOString().split('T')[0] : '',
    purchaseDate: vehicle?.purchaseDate ? 
      new Date(vehicle.purchaseDate).toISOString().split('T')[0] : '',
    warrantyExpiration: vehicle?.warrantyExpiration ? 
      new Date(vehicle.warrantyExpiration).toISOString().split('T')[0] : ''
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [customType, setCustomType] = useState('');
  const [showCustomType, setShowCustomType] = useState(false);

  // Reinicializar formulario cuando cambie el vehículo
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setErrors({});
    }
  }, [isOpen, vehicle]);

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Limpiar error del campo si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validaciones del formulario
  const validateForm = () => {
    const newErrors = {};

    // Validaciones obligatorias
    if (!formData.vehicleId.trim()) {
      newErrors.vehicleId = 'El ID del vehículo es obligatorio';
    } else if (formData.vehicleId.length < 3) {
      newErrors.vehicleId = 'El ID debe tener al menos 3 caracteres';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del vehículo es obligatorio';
    } else if (formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validaciones numéricas
    if (formData.fuelCapacity <= 0) {
      newErrors.fuelCapacity = 'La capacidad de combustible debe ser mayor a 0';
    } else if (formData.fuelCapacity > 1000) {
      newErrors.fuelCapacity = 'La capacidad no puede ser mayor a 1000 galones';
    }

    if (formData.enginePower < 0) {
      newErrors.enginePower = 'La potencia no puede ser negativa';
    } else if (formData.enginePower > 1000) {
      newErrors.enginePower = 'La potencia no puede ser mayor a 1000 HP';
    }

    if (formData.estimatedConsumptionPerHour < 0) {
      newErrors.estimatedConsumptionPerHour = 'El consumo no puede ser negativo';
    } else if (formData.estimatedConsumptionPerHour > 50) {
      newErrors.estimatedConsumptionPerHour = 'El consumo no puede ser mayor a 50 gal/hr';
    }

    // Validaciones de año
    const currentYear = new Date().getFullYear();
    if (formData.year < 1990) {
      newErrors.year = 'El año no puede ser anterior a 1990';
    } else if (formData.year > currentYear + 1) {
      newErrors.year = `El año no puede ser mayor a ${currentYear + 1}`;
    }

    // Validaciones de fechas
    if (formData.lastMaintenanceDate && formData.nextMaintenanceDate) {
      const lastDate = new Date(formData.lastMaintenanceDate);
      const nextDate = new Date(formData.nextMaintenanceDate);
      if (nextDate <= lastDate) {
        newErrors.nextMaintenanceDate = 'La próxima fecha debe ser posterior al último mantenimiento';
      }
    }

    if (formData.purchaseDate) {
      const purchaseDate = new Date(formData.purchaseDate);
      const today = new Date();
      if (purchaseDate > today) {
        newErrors.purchaseDate = 'La fecha de compra no puede ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para envío
      const submitData = {
        ...formData,
        // Convertir fechas vacías a null
        lastMaintenanceDate: formData.lastMaintenanceDate || null,
        nextMaintenanceDate: formData.nextMaintenanceDate || null,
        purchaseDate: formData.purchaseDate || null,
        warrantyExpiration: formData.warrantyExpiration || null
      };

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error('Error guardando vehículo:', error);
      setErrors({ general: 'Error al guardar el vehículo. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  // Obtener icono para tipo de vehículo
  const getVehicleIcon = (type) => {
    switch (type) {
      case VEHICLE_TYPES.EXCAVADORA: return '🚚';
      case VEHICLE_TYPES.BULLDOZER: return '🚜';
      case VEHICLE_TYPES.CARGADOR: return '🏗️';
      case VEHICLE_TYPES.CAMION: return '🚛';
      case VEHICLE_TYPES.GRUA: return '🏗️';
      case VEHICLE_TYPES.MOTOSIERRA: return '🪚';
      case VEHICLE_TYPES.TRACTOR: return '🚜';
      case VEHICLE_TYPES.VOLQUETA: return '🚛';
      default: return '🚗';
    }
  };

  // Obtener icono para combustible
  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case FUEL_COMPATIBILITY.DIESEL: return '🚛';
      case FUEL_COMPATIBILITY.GASOLINA: return '🚗';
      case FUEL_COMPATIBILITY.ACPM: return '🚚';
      case FUEL_COMPATIBILITY.MIXTO: return '⛽';
      default: return '⛽';
    }
  };

  // Determinar si el campo está deshabilitado
  const isReadOnly = mode === 'view';
  const canEdit = userRole === 'admin' || userRole === 'supervisor';

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content vehicle-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="modal-header">
          <div className="modal-title">
            <span className="title-icon">
              {mode === 'create' ? '➕' : mode === 'edit' ? '✏️' : '👁️'}
            </span>
            <div className="title-text">
              <h3>
                {mode === 'create' && 'Crear Nuevo Vehículo'}
                {mode === 'edit' && 'Editar Vehículo'}
                {mode === 'view' && 'Detalles del Vehículo'}
              </h3>
              <p>
                {mode === 'create' && 'Registra un nuevo vehículo en la flota'}
                {mode === 'edit' && 'Modifica la información del vehículo'}
                {mode === 'view' && 'Información completa del vehículo'}
              </p>
            </div>
          </div>
          <button 
            className="btn-close" 
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-content">
            {/* Preview Card */}
            <div className="vehicle-preview">
              <div className="preview-header">
                <span className="preview-icon">{getVehicleIcon(formData.type)}</span>
                <div className="preview-info">
                  <span className="preview-id">{formData.vehicleId || 'ID-000'}</span>
                  <span className="preview-name">{formData.name || 'Nombre del vehículo'}</span>
                </div>
                <div className="preview-fuel">
                  <span className="fuel-icon">{getFuelIcon(formData.fuelType)}</span>
                  <span className="fuel-text">{formData.fuelType}</span>
                </div>
              </div>
              <div className="preview-specs">
                {formData.enginePower > 0 && (
                  <span className="spec">⚡ {formData.enginePower} HP</span>
                )}
                {formData.fuelCapacity > 0 && (
                  <span className="spec">🛢️ {formData.fuelCapacity} gal</span>
                )}
                {formData.year && (
                  <span className="spec">📅 {formData.year}</span>
                )}
              </div>
            </div>

            {/* Error general */}
            {errors.general && (
              <div className="error-message general-error">
                ⚠️ {errors.general}
              </div>
            )}

            {/* Información básica */}
            <div className="form-section">
              <h4 className="section-title">📋 Información Básica</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="vehicleId">ID del Vehículo *</label>
                  <input
                    type="text"
                    id="vehicleId"
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleInputChange}
                    placeholder="Ej: EXC-001"
                    className={errors.vehicleId ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={20}
                  />
                  {errors.vehicleId && (
                    <span className="error-text">{errors.vehicleId}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="name">Nombre del Vehículo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Excavadora Principal"
                    className={errors.name ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={100}
                  />
                  {errors.name && (
                    <span className="error-text">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="type">Tipo de Vehículo</label>
                  {!showCustomType ? (
                    <div className="select-with-button">
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                      >
                        {Object.entries(VEHICLE_INFO).map(([key, info]) => (
                          <option key={key} value={key}>
                            {info.icon} {info.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn-add-custom"
                        onClick={() => setShowCustomType(true)}
                        disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                        title="Agregar tipo personalizado"
                      >
                        ➕
                      </button>
                    </div>
                  ) : (
                    <div className="custom-type-input">
                      <input
                        type="text"
                        placeholder="Ej: Montacargas, Grúa Torre, etc."
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (customType.trim()) {
                              setFormData(prev => ({ ...prev, type: customType.trim() }));
                              setShowCustomType(false);
                              setCustomType('');
                            }
                          } else if (e.key === 'Escape') {
                            setShowCustomType(false);
                            setCustomType('');
                          }
                        }}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="btn-confirm-custom"
                        onClick={() => {
                          if (customType.trim()) {
                            setFormData(prev => ({ ...prev, type: customType.trim() }));
                            setShowCustomType(false);
                            setCustomType('');
                          }
                        }}
                        title="Confirmar tipo personalizado"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        className="btn-cancel-custom"
                        onClick={() => {
                          setShowCustomType(false);
                          setCustomType('');
                        }}
                        title="Cancelar"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="status">Estado</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  >
                    {Object.values(VEHICLE_STATUS).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Especificaciones técnicas */}
            <div className="form-section">
              <h4 className="section-title">🔧 Especificaciones Técnicas</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="brand">Marca</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Ej: Caterpillar"
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={50}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="model">Modelo</label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="Ej: 320D"
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={50}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="year">Año</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    className={errors.year ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                  {errors.year && (
                    <span className="error-text">{errors.year}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="serialNumber">Número de Serie</label>
                  <input
                    type="text"
                    id="serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    placeholder="Ej: ABC123456789"
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={50}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="plateNumber">Placa</label>
                  <input
                    type="text"
                    id="plateNumber"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleInputChange}
                    placeholder="Ej: ABC123"
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={10}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="enginePower">Potencia del Motor (HP)</label>
                  <input
                    type="number"
                    id="enginePower"
                    name="enginePower"
                    value={formData.enginePower}
                    onChange={handleInputChange}
                    min="0"
                    max="1000"
                    step="0.1"
                    className={errors.enginePower ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                  {errors.enginePower && (
                    <span className="error-text">{errors.enginePower}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Combustible */}
            <div className="form-section">
              <h4 className="section-title">⛽ Información de Combustible</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fuelType">Tipo de Combustible</label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  >
                    {Object.values(FUEL_COMPATIBILITY).map(fuel => (
                      <option key={fuel} value={fuel}>
                        {getFuelIcon(fuel)} {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="fuelCapacity">Capacidad de Combustible (gal) *</label>
                  <input
                    type="number"
                    id="fuelCapacity"
                    name="fuelCapacity"
                    value={formData.fuelCapacity}
                    onChange={handleInputChange}
                    min="0"
                    max="1000"
                    step="0.1"
                    className={errors.fuelCapacity ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                  {errors.fuelCapacity && (
                    <span className="error-text">{errors.fuelCapacity}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="estimatedConsumptionPerHour">Consumo Estimado (gal/hr)</label>
                  <input
                    type="number"
                    id="estimatedConsumptionPerHour"
                    name="estimatedConsumptionPerHour"
                    value={formData.estimatedConsumptionPerHour}
                    onChange={handleInputChange}
                    min="0"
                    max="50"
                    step="0.1"
                    className={errors.estimatedConsumptionPerHour ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                  {errors.estimatedConsumptionPerHour && (
                    <span className="error-text">{errors.estimatedConsumptionPerHour}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="currentLocation">Ubicación Actual</label>
                  <input
                    type="text"
                    id="currentLocation"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleInputChange}
                    placeholder="Ej: Sector Norte - Lote 15"
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={100}
                  />
                </div>
              </div>
            </div>

            {/* ✅ NUEVO: Sección Horómetro para tractores */}
            {(formData.type === VEHICLE_TYPES.TRACTOR || formData.hasHourMeter) && (
              <div className="form-section">
                <h4 className="section-title">⏰ Sistema de Horómetro</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="hasHourMeter">
                      <input
                        type="checkbox"
                        id="hasHourMeter"
                        name="hasHourMeter"
                        checked={formData.hasHourMeter}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          hasHourMeter: e.target.checked,
                          // Auto-habilitar para tractores
                          ...(formData.type === VEHICLE_TYPES.TRACTOR ? { hasHourMeter: true } : {})
                        }))}
                        disabled={isReadOnly || (mode === 'edit' && !canEdit) || formData.type === VEHICLE_TYPES.TRACTOR}
                      />
                      {' '}Tiene Sistema de Horómetro
                      {formData.type === VEHICLE_TYPES.TRACTOR && (
                        <span className="auto-enabled"> (Automático para tractores)</span>
                      )}
                    </label>
                    <small className="field-help">
                      Los tractores TR1, TR2, TR3 requieren control de horómetro para reportes de consumo
                    </small>
                  </div>

                  {formData.hasHourMeter && (
                    <>
                      <div className="form-group">
                        <label htmlFor="currentHours">Lectura Actual del Horómetro (horas)</label>
                        <input
                          type="number"
                          id="currentHours"
                          name="currentHours"
                          value={formData.currentHours}
                          onChange={handleInputChange}
                          min="0"
                          max="50000"
                          step="0.1"
                          placeholder="Ej: 1250.5"
                          disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                        />
                        <small className="field-help">
                          Ingrese la lectura actual mostrada en el horómetro del vehículo
                        </small>
                      </div>

                      {formData.currentHours > 0 && (
                        <div className="form-group">
                          <div className="hour-meter-info">
                            <h5>📊 Información del Horómetro</h5>
                            <div className="info-grid">
                              <div className="info-item">
                                <span className="info-label">Lectura actual:</span>
                                <span className="info-value">{formData.currentHours} horas</span>
                              </div>
                              {mode === 'edit' && vehicle?.totalHoursWorked && (
                                <div className="info-item">
                                  <span className="info-label">Horas trabajadas totales:</span>
                                  <span className="info-value">{vehicle.totalHoursWorked} horas</span>
                                </div>
                              )}
                              <div className="info-item">
                                <span className="info-label">Próximo mantenimiento:</span>
                                <span className="info-value">
                                  {250 - (formData.currentHours % 250)} horas
                                  ({(formData.currentHours + (250 - (formData.currentHours % 250))).toFixed(1)}h)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Fechas importantes */}
            <div className="form-section">
              <h4 className="section-title">📅 Fechas Importantes</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="purchaseDate">Fecha de Compra</label>
                  <input
                    type="date"
                    id="purchaseDate"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={errors.purchaseDate ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                  {errors.purchaseDate && (
                    <span className="error-text">{errors.purchaseDate}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="warrantyExpiration">Vencimiento de Garantía</label>
                  <input
                    type="date"
                    id="warrantyExpiration"
                    name="warrantyExpiration"
                    value={formData.warrantyExpiration}
                    onChange={handleInputChange}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastMaintenanceDate">Último Mantenimiento</label>
                  <input
                    type="date"
                    id="lastMaintenanceDate"
                    name="lastMaintenanceDate"
                    value={formData.lastMaintenanceDate}
                    onChange={handleInputChange}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nextMaintenanceDate">Próximo Mantenimiento</label>
                  <input
                    type="date"
                    id="nextMaintenanceDate"
                    name="nextMaintenanceDate"
                    value={formData.nextMaintenanceDate}
                    onChange={handleInputChange}
                    className={errors.nextMaintenanceDate ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                  {errors.nextMaintenanceDate && (
                    <span className="error-text">{errors.nextMaintenanceDate}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="form-section">
              <h4 className="section-title">📝 Descripción y Notas</h4>
              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Información adicional sobre el vehículo..."
                  rows="3"
                  maxLength="500"
                  disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                />
                <span className="char-count">
                  {formData.description.length}/500 caracteres
                </span>
              </div>
            </div>
          </div>

          {/* Footer del modal */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              {mode === 'view' ? 'Cerrar' : 'Cancelar'}
            </button>
            
            {!isReadOnly && canEdit && (
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    {mode === 'create' ? '➕ Crear Vehículo' : '💾 Guardar Cambios'}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;