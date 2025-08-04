/**
 * MaintenanceModal - Modal para crear, editar y ver mantenimientos
 * Incluye secciones para cambios de aceite y baterías con integración horómetro
 */

import React, { useState, useEffect, useCallback } from 'react';
import useFormData from '../../hooks/useFormData';
import { 
  MAINTENANCE_TYPES, 
  MAINTENANCE_STATUS, 
  BATTERY_STATUS,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  getVehiclesForMaintenance,
  calculateNextOilChange
} from '../../services/maintenanceService';
import { 
  UI_ACTIONS, 
  UI_FORM_LABELS, 
  UI_MESSAGES, 
  UI_PLACEHOLDERS, 
  UI_TITLES,
  MODAL_TEXT 
} from '../../constants';
// import { formatCurrency, formatNumber } from '../../utils/calculations';

const MaintenanceModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  maintenance, 
  mode = 'create',
  userRole 
}) => {
  // Estado inicial del formulario
  const getInitialFormData = useCallback(() => ({
    type: maintenance?.type || MAINTENANCE_TYPES.OIL_CHANGE,
    vehicleId: maintenance?.vehicleId || '',
    vehicleName: maintenance?.vehicleName || '',
    date: maintenance?.date ? new Date(maintenance.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    status: maintenance?.status || MAINTENANCE_STATUS.COMPLETED,
    
    // Campos específicos para cambio de aceite
    quantity: maintenance?.quantity || 0,
    currentHours: maintenance?.currentHours || 0,
    nextChangeHours: maintenance?.nextChangeHours || 0,
    filters: maintenance?.filters || '',
    
    // Campos específicos para cambio de batería
    batteryType: maintenance?.batteryType || '',
    brand: maintenance?.brand || '',
    model: maintenance?.model || '',
    batteryStatus: maintenance?.batteryStatus || BATTERY_STATUS.NEW,
    
    // Campos generales
    notes: maintenance?.notes || '',
    cost: maintenance?.cost || 0
  }), [maintenance]);

  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  // Validación centralizada
  const validate = (values) => {
    const newErrors = {};
    if (!values.type) newErrors.type = 'Tipo de mantenimiento es requerido';
    if (!values.vehicleId) newErrors.vehicleId = 'Vehículo es requerido';
    if (!values.date) newErrors.date = 'Fecha es requerida';
    if (!values.status) newErrors.status = 'Estado es requerido';
    if (values.type === MAINTENANCE_TYPES.OIL_CHANGE) {
      if (!values.quantity || values.quantity <= 0) newErrors.quantity = 'Cantidad de aceite es requerida y debe ser mayor a 0';
      if (values.currentHours < 0) newErrors.currentHours = 'Horas actuales inválidas';
      if (values.nextChangeHours < 0) newErrors.nextChangeHours = 'Próximo cambio inválido';
    }
    if (values.type === MAINTENANCE_TYPES.BATTERY_CHANGE) {
      if (!values.batteryType) newErrors.batteryType = 'Tipo de batería es requerido';
      if (!values.brand) newErrors.brand = 'Marca es requerida';
      if (!values.model) newErrors.model = 'Modelo es requerido';
    }
    if (values.cost && (isNaN(values.cost) || values.cost < 0)) newErrors.cost = 'Costo inválido';
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const {
    values: formData,
    setValues: setFormData,
    errors,
    setErrors,
    handleInputChange,
    validateForm
  } = useFormData(getInitialFormData(), validate);
  // const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Cargar vehículos disponibles
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const vehiclesData = await getVehiclesForMaintenance();
        setVehicles(vehiclesData);
      } catch (error) {
        console.error('Error al cargar vehículos:', error);
      }
    };
    if (isOpen) {
      loadVehicles();
    }
  }, [isOpen]);

  // Reinicializar formulario cuando cambie el mantenimiento
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setErrors({});
      
      // Buscar vehículo seleccionado
      // if (maintenance?.vehicleId) {
      //   const vehicle = vehicles.find(v => v.vehicleId === maintenance.vehicleId);
      //   setSelectedVehicle(vehicle);
      // }
    }
  }, [isOpen, maintenance, vehicles, getInitialFormData, setFormData, setErrors]);

  // Calcular próximo cambio automáticamente
  useEffect(() => {
    if (formData.type === MAINTENANCE_TYPES.OIL_CHANGE && formData.currentHours > 0) {
      const nextChange = calculateNextOilChange(formData.currentHours);
      setFormData(prev => ({
        ...prev,
        nextChangeHours: nextChange
      }));
    }
  }, [formData.currentHours, formData.type, setFormData]);



  // Manejar cambio de vehículo
  const handleVehicleChange = (vehicleId) => {
    const vehicle = vehicles.find(v => v.vehicleId === vehicleId);
    // setSelectedVehicle(vehicle);
    
    setFormData(prev => ({
      ...prev,
      vehicleId: vehicleId,
      vehicleName: vehicle ? vehicle.name : ''
    }));

    // Si es tractor, cargar horómetro actual
    if (vehicle && vehicle.hasHourMeter && vehicle.currentHours) {
      setFormData(prev => ({
        ...prev,
        currentHours: vehicle.currentHours
      }));
    }
  };

  // Validaciones del formulario


  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const maintenanceData = {
        ...formData,
        date: new Date(formData.date),
        createdBy: userRole || 'user'
      };

      if (mode === 'create') {
        await createMaintenanceRecord(maintenanceData);
        console.log('✅ Mantenimiento creado exitosamente');
      } else if (mode === 'edit') {
        await updateMaintenanceRecord(maintenance.id, maintenanceData);
        console.log('✅ Mantenimiento actualizado exitosamente');
      }

      onSuccess();
    } catch (error) {
      console.error('❌ Error al guardar mantenimiento:', error);
      alert('Error al guardar mantenimiento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener título del modal
  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return MODAL_TEXT.MAINTENANCE.CREATE_TITLE;
      case 'edit':
        return MODAL_TEXT.MAINTENANCE.EDIT_TITLE;
      case 'view':
        return MODAL_TEXT.MAINTENANCE.VIEW_TITLE;
      default:
        return UI_TITLES.MAINTENANCE;
    }
  };

  // Obtener icono del tipo de mantenimiento
  const getMaintenanceIcon = (type) => {
    switch (type) {
      case MAINTENANCE_TYPES.OIL_CHANGE:
        return '🛢️';
      case MAINTENANCE_TYPES.BATTERY_CHANGE:
        return '🔋';
      case MAINTENANCE_TYPES.FILTER_CHANGE:
        return '🔧';
      case MAINTENANCE_TYPES.GENERAL_MAINTENANCE:
        return '⚙️';
      default:
        return '🔧';
    }
  };

  // Obtener nombre del tipo de mantenimiento
  // const getMaintenanceTypeName = (type) => {
  //   switch (type) {
  //     case MAINTENANCE_TYPES.OIL_CHANGE:
  //       return 'Cambio de Aceite';
  //     case MAINTENANCE_TYPES.BATTERY_CHANGE:
  //       return 'Cambio de Batería';
  //     case MAINTENANCE_TYPES.FILTER_CHANGE:
  //       return 'Cambio de Filtros';
  //     case MAINTENANCE_TYPES.GENERAL_MAINTENANCE:
  //       return 'Mantenimiento General';
  //     default:
  //       return type;
  //   }
  // };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content maintenance-modal">
        {/* Header */}
        <div className="modal-header">
          <h2>{getModalTitle()}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="maintenance-form">
            {/* Tipo de mantenimiento */}
            <div className="form-group">
              <label>{UI_FORM_LABELS.MAINTENANCE_TYPE} *</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                disabled={mode === 'view'}
              >
                <option value={MAINTENANCE_TYPES.OIL_CHANGE}>
                  {getMaintenanceIcon(MAINTENANCE_TYPES.OIL_CHANGE)} Cambio de Aceite
                </option>
                <option value={MAINTENANCE_TYPES.BATTERY_CHANGE}>
                  {getMaintenanceIcon(MAINTENANCE_TYPES.BATTERY_CHANGE)} Cambio de Batería
                </option>
                <option value={MAINTENANCE_TYPES.FILTER_CHANGE}>
                  {getMaintenanceIcon(MAINTENANCE_TYPES.FILTER_CHANGE)} Cambio de Filtros
                </option>
                <option value={MAINTENANCE_TYPES.GENERAL_MAINTENANCE}>
                  {getMaintenanceIcon(MAINTENANCE_TYPES.GENERAL_MAINTENANCE)} Mantenimiento General
                </option>
              </select>
              {errors.type && <span className="error-text">{errors.type}</span>}
            </div>

            {/* Vehículo */}
            <div className="form-group">
              <label>{UI_FORM_LABELS.VEHICLE} *</label>
              <select
                value={formData.vehicleId}
                onChange={(e) => handleVehicleChange(e.target.value)}
                disabled={mode === 'view'}
              >
                <option value="">{UI_MESSAGES.INFO.SELECT_OPTION}</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                    {vehicle.vehicleId} - {vehicle.name} ({vehicle.type})
                  </option>
                ))}
              </select>
              {errors.vehicleId && <span className="error-text">{errors.vehicleId}</span>}
            </div>

            {/* Fecha */}
            <div className="form-group">
              <label>{UI_FORM_LABELS.DATE} *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                disabled={mode === 'view'}
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>

            {/* Sección específica según tipo */}
            {formData.type === MAINTENANCE_TYPES.OIL_CHANGE && (
              <div className="maintenance-section">
                <h3>🛢️ {MODAL_TEXT.MAINTENANCE.OIL_CHANGE_INFO}</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>{UI_FORM_LABELS.QUANTITY} (galones) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      disabled={mode === 'view'}
                    />
                    {errors.quantity && <span className="error-text">{errors.quantity}</span>}
                  </div>

                  <div className="form-group">
                    <label>{UI_FORM_LABELS.HOROMETER} *</label>
                    <input
                      type="number"
                      value={formData.currentHours}
                      onChange={(e) => handleInputChange('currentHours', e.target.value)}
                      disabled={mode === 'view'}
                    />
                    {errors.currentHours && <span className="error-text">{errors.currentHours}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>{UI_FORM_LABELS.NEXT_CHANGE_HOURS}</label>
                  <input
                    type="number"
                    value={formData.nextChangeHours}
                    disabled
                    className="readonly-input"
                  />
                  <small>Calculado automáticamente: actual + 250 horas</small>
                </div>

                <div className="form-group">
                  <label>{UI_FORM_LABELS.FILTERS_EXTRAS}</label>
                  <textarea
                    value={formData.filters}
                    onChange={(e) => handleInputChange('filters', e.target.value)}
                    disabled={mode === 'view'}
                    placeholder={UI_PLACEHOLDERS.FILTERS_EXTRAS}
                  />
                </div>
              </div>
            )}

            {formData.type === MAINTENANCE_TYPES.BATTERY_CHANGE && (
              <div className="maintenance-section">
                <h3>🔋 {MODAL_TEXT.MAINTENANCE.BATTERY_CHANGE_INFO}</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>{UI_FORM_LABELS.BATTERY_TYPE} *</label>
                    <input
                      type="text"
                      value={formData.batteryType}
                      onChange={(e) => handleInputChange('batteryType', e.target.value)}
                      disabled={mode === 'view'}
                      placeholder={UI_PLACEHOLDERS.BATTERY_TYPE}
                    />
                    {errors.batteryType && <span className="error-text">{errors.batteryType}</span>}
                  </div>

                  <div className="form-group">
                    <label>{UI_FORM_LABELS.STATUS} *</label>
                    <select
                      value={formData.batteryStatus}
                      onChange={(e) => handleInputChange('batteryStatus', e.target.value)}
                      disabled={mode === 'view'}
                    >
                      <option value={BATTERY_STATUS.NEW}>Nueva</option>
                      <option value={BATTERY_STATUS.USED}>Usada</option>
                      <option value={BATTERY_STATUS.REPAIRED}>Reparada</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{UI_FORM_LABELS.BRAND}</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      disabled={mode === 'view'}
                      placeholder={UI_PLACEHOLDERS.BATTERY_BRAND}
                    />
                  </div>

                  <div className="form-group">
                    <label>{UI_FORM_LABELS.MODEL}</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      disabled={mode === 'view'}
                      placeholder={UI_PLACEHOLDERS.BATTERY_MODEL}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>{UI_FORM_LABELS.COST} *</label>
                  <input
                    type="number"
                    step="1000"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', e.target.value)}
                    disabled={mode === 'view'}
                    placeholder={UI_PLACEHOLDERS.COST}
                  />
                  {errors.cost && <span className="error-text">{errors.cost}</span>}
                </div>
              </div>
            )}

            {/* Notas generales */}
            <div className="form-group">
              <label>{UI_FORM_LABELS.NOTES}</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                disabled={mode === 'view'}
                placeholder={UI_PLACEHOLDERS.ADDITIONAL_NOTES}
                rows="3"
              />
            </div>

            {/* Estado */}
            <div className="form-group">
              <label>{UI_FORM_LABELS.STATUS}</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                disabled={mode === 'view'}
              >
                <option value={MAINTENANCE_STATUS.COMPLETED}>Completado</option>
                <option value={MAINTENANCE_STATUS.PENDING}>Pendiente</option>
                <option value={MAINTENANCE_STATUS.CANCELLED}>Cancelado</option>
              </select>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={loading}
          >
            {UI_ACTIONS.CANCEL}
          </button>
          
          {mode !== 'view' && (
            <button 
              type="submit" 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? UI_MESSAGES.LOADING.SAVING : (mode === 'create' ? UI_ACTIONS.CREATE : UI_ACTIONS.UPDATE)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModal;
