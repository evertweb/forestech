/**
 * VehicleModal - Modal para crear, editar y ver detalles de vehículos
 * Incluye validaciones business logic y preview en tiempo real
 * Refactorizado para usar BaseModal
 */

import React, { useState, useEffect, useCallback } from 'react';
import BaseModal from '../shared/BaseModal';
import ModalHeader from '../shared/ModalHeader';
import ModalFooter from '../shared/ModalFooter';
import useFormData from '../../hooks/useFormData';
import {
  validationSchemas,
  validateForm as runValidation,
  crossFieldValidators,
} from '../../utils/validators';
import { VEHICLE_TYPES, VEHICLE_STATUS, FUEL_COMPATIBILITY } from '../../services/vehiclesService';
import { VEHICLE_INFO } from '../../constants/vehicleTypes';
import { FUEL_TYPES, FUEL_INFO } from '../../constants/combustibleTypes';
import {
  UI_ACTIONS,
  UI_FORM_LABELS,
  UI_MESSAGES,
  UI_PLACEHOLDERS,
  UI_TITLES,
  MODAL_TEXT,
  UI_TOOLTIPS,
} from '../../constants';

const VehicleModal = ({ isOpen, onClose, vehicle, onSave, mode = 'create', userRole }) => {
  // Estado y validación centralizados con useFormData
  const getInitialFormData = useCallback(
    () => ({
      vehicleId: vehicle?.vehicleId || '',
      name: vehicle?.name || '',
      type: vehicle?.type || VEHICLE_TYPES.EXCAVADORA,
      brand: vehicle?.brand || '',
      model: vehicle?.model || '',
      fuelType: vehicle?.fuelType || FUEL_COMPATIBILITY.DIESEL,
      fuelCapacity: vehicle?.fuelCapacity || 0,
      enginePower: vehicle?.enginePower || 0,
      status: vehicle?.status || VEHICLE_STATUS.ACTIVO,
      currentLocation: vehicle?.currentLocation || '',
      description: vehicle?.description || '',
      estimatedConsumptionPerHour: vehicle?.estimatedConsumptionPerHour || 0,
      serialNumber: vehicle?.serialNumber || '',
      plateNumber: vehicle?.plateNumber || '',
      hasHourMeter: vehicle?.hasHourMeter || false,
      currentHours: vehicle?.currentHours || 0,
      lastMaintenanceDate: vehicle?.lastMaintenanceDate
        ? new Date(vehicle.lastMaintenanceDate).toISOString().split('T')[0]
        : '',
      nextMaintenanceDate: vehicle?.nextMaintenanceDate
        ? new Date(vehicle.nextMaintenanceDate).toISOString().split('T')[0]
        : '',
      purchaseDate: vehicle?.purchaseDate
        ? new Date(vehicle.purchaseDate).toISOString().split('T')[0]
        : '',
      warrantyExpiration: vehicle?.warrantyExpiration
        ? new Date(vehicle.warrantyExpiration).toISOString().split('T')[0]
        : '',
    }),
    [vehicle]
  );

  const [loading, setLoading] = useState(false);
  const [customType, setCustomType] = useState('');
  const [showCustomType, setShowCustomType] = useState(false);

  // Validación centralizada por schema + reglas adicionales
  const validate = (values) => {
    const base = runValidation(values, validationSchemas.vehicle);
    const errors = { ...base.errors };

    // Fechas: próxima mantenimiento posterior a última
    const cross = crossFieldValidators.maintenanceDates({
      lastMaintenanceDate: values.lastMaintenanceDate,
      nextMaintenanceDate: values.nextMaintenanceDate,
    });
    Object.assign(errors, cross);

    // Purchase date no futura
    if (values.purchaseDate) {
      const purchase = new Date(values.purchaseDate);
      const today = new Date();
      if (purchase > today) {
        errors.purchaseDate = UI_MESSAGES.ERROR.PURCHASE_DATE_FUTURE;
      }
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const {
    values: formData,
    setValues: setFormData,
    errors,
    setErrors,
    handleInputChange,
    validateForm,
  } = useFormData(getInitialFormData(), validate);

  // Reinicializar formulario cuando cambie el vehículo
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setErrors({});
    }
  }, [isOpen, vehicle, getInitialFormData, setFormData, setErrors]);

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
        warrantyExpiration: formData.warrantyExpiration || null,
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
      case VEHICLE_TYPES.EXCAVADORA:
        return '🚚';
      case VEHICLE_TYPES.BULLDOZER:
        return '🚜';
      case VEHICLE_TYPES.CARGADOR:
        return '🏗️';
      case VEHICLE_TYPES.CAMION:
        return '🚛';
      case VEHICLE_TYPES.GRUA:
        return '🏗️';
      case VEHICLE_TYPES.MOTOSIERRA:
        return '🪚';
      case VEHICLE_TYPES.TRACTOR:
        return '🚜';
      case VEHICLE_TYPES.VOLQUETA:
        return '🚛';
      default:
        return '🚗';
    }
  };

  // Obtener icono para combustible
  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case FUEL_COMPATIBILITY.DIESEL:
        return '🚛';
      case FUEL_COMPATIBILITY.GASOLINE:
        return '🚗';
      case FUEL_COMPATIBILITY.MIXED:
        return '🔄';
      default:
        return '⛽';
    }
  };

  // Determinar permisos de edición
  const canEdit = ['admin', 'supervisor'].includes(userRole) && mode !== 'view';
  const isReadOnly = mode === 'view' || !canEdit;

  const getModalTitle = () => {
    if (mode === 'create') return MODAL_TEXT.VEHICLE.CREATE_TITLE;
    if (mode === 'edit') return MODAL_TEXT.VEHICLE.EDIT_TITLE;
    return MODAL_TEXT.VEHICLE.VIEW_TITLE;
  };

  const getModalSubtitle = () => {
    if (mode === 'create') return MODAL_TEXT.VEHICLE.CREATE_SUBTITLE;
    if (mode === 'edit') return MODAL_TEXT.VEHICLE.EDIT_SUBTITLE;
    return MODAL_TEXT.VEHICLE.VIEW_SUBTITLE;
  };

  const getModalIcon = () => {
    if (mode === 'create') return '➕';
    if (mode === 'edit') return '✏️';
    return '👁️';
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="xl" className="vehicle-modal sap-theme">
      <ModalHeader
        title={getModalTitle()}
        subtitle={getModalSubtitle()}
        icon={getModalIcon()}
        onClose={onClose}
      />

      <div className="modal-body sap-theme">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="modal-form sap-theme">
          <div className="form-content sap-theme">
            {/* Preview Card */}
            <div className="vehicle-preview sap-theme">
              <div className="preview-header sap-theme">
                <span className="preview-icon sap-theme">{getVehicleIcon(formData.type)}</span>
                <div className="preview-info sap-theme">
                  <span className="preview-id sap-theme">{formData.vehicleId || 'ID-000'}</span>
                  <span className="preview-name sap-theme">
                    {formData.name || UI_FORM_LABELS.VEHICLE_NAME}
                  </span>
                </div>
                <div className="preview-fuel sap-theme">
                  <span className="fuel-icon sap-theme">{getFuelIcon(formData.fuelType)}</span>
                  <span className="fuel-text sap-theme">{formData.fuelType}</span>
                </div>
              </div>
              <div className="preview-specs sap-theme">
                {formData.enginePower > 0 && (
                  <span className="spec sap-theme">⚡ {formData.enginePower} HP</span>
                )}
                {formData.fuelCapacity > 0 && (
                  <span className="spec sap-theme">🛢️ {formData.fuelCapacity} gal</span>
                )}
              </div>
            </div>

            {/* Error general */}
            {errors.general && (
              <div className="error-message general-error sap-theme">⚠️ {errors.general}</div>
            )}

            {/* Información básica */}
            <div className="form-section sap-theme">
              <h4 className="section-title sap-theme">📋 {UI_TITLES.BASIC_INFO}</h4>
              <div className="form-grid sap-theme">
                <div className="form-group sap-theme">
                  <label htmlFor="vehicleId">{UI_FORM_LABELS.VEHICLE_ID} *</label>
                  <input
                    type="text"
                    id="vehicleId"
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleInputChange}
                    placeholder={UI_PLACEHOLDERS.VEHICLE_ID}
                    className={errors.vehicleId ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={20}
                  />
                  {errors.vehicleId && (
                    <span className="error-text sap-theme">{errors.vehicleId}</span>
                  )}
                </div>

                <div className="form-group sap-theme">
                  <label htmlFor="name">{UI_FORM_LABELS.VEHICLE_NAME} *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={UI_PLACEHOLDERS.VEHICLE_NAME}
                    className={errors.name ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={100}
                  />
                  {errors.name && <span className="error-text sap-theme">{errors.name}</span>}
                </div>

                <div className="form-group sap-theme">
                  <label htmlFor="type">{UI_FORM_LABELS.VEHICLE_TYPE}</label>
                  {!showCustomType ? (
                    <div className="select-with-button sap-theme">
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
                        className="btn-add-custom sap-theme"
                        onClick={() => setShowCustomType(true)}
                        disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                        title={UI_TOOLTIPS.ADD_CUSTOM_TYPE}
                      >
                        ➕
                      </button>
                    </div>
                  ) : (
                    <div className="custom-type-input sap-theme">
                      <input
                        type="text"
                        placeholder={UI_PLACEHOLDERS.CUSTOM_TYPE}
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (customType.trim()) {
                              setFormData((prev) => ({ ...prev, type: customType.trim() }));
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
                        className="btn-confirm-custom sap-theme"
                        onClick={() => {
                          if (customType.trim()) {
                            setFormData((prev) => ({ ...prev, type: customType.trim() }));
                            setShowCustomType(false);
                            setCustomType('');
                          }
                        }}
                        title={UI_TOOLTIPS.CONFIRM_CUSTOM_TYPE}
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        className="btn-cancel-custom sap-theme"
                        onClick={() => {
                          setShowCustomType(false);
                          setCustomType('');
                        }}
                        title={UI_ACTIONS.CANCEL}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group sap-theme">
                  <label htmlFor="status">{UI_FORM_LABELS.STATUS}</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  >
                    {Object.values(VEHICLE_STATUS).map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Especificaciones técnicas */}
            <div className="form-section sap-theme">
              <h4 className="section-title sap-theme">🔧 {UI_TITLES.TECHNICAL_SPECS}</h4>
              <div className="form-grid sap-theme">
                <div className="form-group sap-theme">
                  <label htmlFor="brand">{UI_FORM_LABELS.BRAND}</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder={UI_PLACEHOLDERS.BRAND}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={50}
                  />
                </div>

                <div className="form-group sap-theme">
                  <label htmlFor="model">{UI_FORM_LABELS.MODEL}</label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder={UI_PLACEHOLDERS.MODEL}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={50}
                  />
                </div>

                <div className="form-group sap-theme">
                  <label htmlFor="serialNumber">{UI_FORM_LABELS.SERIAL_NUMBER}</label>
                  <input
                    type="text"
                    id="serialNumber"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    placeholder={UI_PLACEHOLDERS.SERIAL_NUMBER}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={50}
                  />
                </div>

                <div className="form-group sap-theme">
                  <label htmlFor="plateNumber">{UI_FORM_LABELS.PLATE_NUMBER}</label>
                  <input
                    type="text"
                    id="plateNumber"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleInputChange}
                    placeholder={UI_PLACEHOLDERS.PLATE_NUMBER}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={10}
                  />
                </div>

                <div className="form-group sap-theme">
                  <label htmlFor="enginePower">{UI_FORM_LABELS.ENGINE_POWER}</label>
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
                    <span className="error-text sap-theme">{errors.enginePower}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Combustible */}
            <div className="form-section sap-theme">
              <h4 className="section-title sap-theme">⛽ {UI_TITLES.FUEL_INFO}</h4>
              <div className="form-grid sap-theme">
                <div className="form-group sap-theme">
                  <label htmlFor="fuelType">{UI_FORM_LABELS.FUEL_TYPE}</label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  >
                    {Object.values(FUEL_COMPATIBILITY).map((fuel) => (
                      <option key={fuel} value={fuel}>
                        {getFuelIcon(fuel)} {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group sap-theme">
                  <label htmlFor="fuelCapacity">{UI_FORM_LABELS.TANK_CAPACITY} *</label>
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
                    <span className="error-text sap-theme">{errors.fuelCapacity}</span>
                  )}
                </div>

                <div className="form-group sap-theme">
                  <label htmlFor="estimatedConsumptionPerHour">
                    {UI_FORM_LABELS.ESTIMATED_CONSUMPTION}
                  </label>
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
                    <span className="error-text sap-theme">
                      {errors.estimatedConsumptionPerHour}
                    </span>
                  )}
                </div>

                <div className="form-group sap-theme">
                  <label htmlFor="currentLocation">{UI_FORM_LABELS.CURRENT_LOCATION}</label>
                  <input
                    type="text"
                    id="currentLocation"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleInputChange}
                    placeholder={UI_PLACEHOLDERS.CURRENT_LOCATION}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={100}
                  />
                </div>
              </div>
            </div>

            {/* ✅ NUEVO: Sección Horómetro para tractores */}
            {(formData.type === VEHICLE_TYPES.TRACTOR || formData.hasHourMeter) && (
              <div className="form-section sap-theme">
                <h4 className="section-title sap-theme">⏰ {UI_TITLES.HOUR_METER_SYSTEM}</h4>
                <div className="form-grid sap-theme">
                  <div className="form-group sap-theme">
                    <label htmlFor="hasHourMeter">
                      <input
                        type="checkbox"
                        id="hasHourMeter"
                        name="hasHourMeter"
                        checked={formData.hasHourMeter}
                        onChange={handleInputChange}
                        disabled={
                          isReadOnly ||
                          (mode === 'edit' && !canEdit) ||
                          formData.type === VEHICLE_TYPES.TRACTOR
                        }
                      />{' '}
                      {UI_FORM_LABELS.HAS_HOUR_METER}
                      {formData.type === VEHICLE_TYPES.TRACTOR && (
                        <span className="auto-enabled sap-theme"> (Automático para tractores)</span>
                      )}
                    </label>
                    <small className="field-help sap-theme">
                      Los tractores TR1, TR2, TR3 requieren control de horómetro para reportes de
                      consumo
                    </small>
                  </div>

                  {formData.hasHourMeter && (
                    <>
                      <div className="form-group sap-theme">
                        <label htmlFor="currentHours">{UI_FORM_LABELS.CURRENT_HOURS}</label>
                        <input
                          type="number"
                          id="currentHours"
                          name="currentHours"
                          value={formData.currentHours}
                          onChange={handleInputChange}
                          min="0"
                          max="50000"
                          step="0.1"
                          placeholder={UI_PLACEHOLDERS.CURRENT_HOURS}
                          disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                        />
                        <small className="field-help sap-theme">
                          Ingrese la lectura actual mostrada en el horómetro del vehículo
                        </small>
                      </div>

                      {formData.currentHours > 0 && (
                        <div className="form-group sap-theme">
                          <div className="hour-meter-info sap-theme">
                            <h5>📊 {UI_TITLES.HOUR_METER_INFO}</h5>
                            <div className="info-grid sap-theme">
                              <div className="info-item sap-theme">
                                <span className="info-label sap-theme">Lectura actual:</span>
                                <span className="info-value sap-theme">
                                  {formData.currentHours} horas
                                </span>
                              </div>
                              {mode === 'edit' && vehicle?.totalHoursWorked && (
                                <div className="info-item sap-theme">
                                  <span className="info-label sap-theme">
                                    Horas trabajadas totales:
                                  </span>
                                  <span className="info-value sap-theme">
                                    {vehicle.totalHoursWorked} horas
                                  </span>
                                </div>
                              )}
                              <div className="info-item sap-theme">
                                <span className="info-label sap-theme">Próximo mantenimiento:</span>
                                <span className="info-value sap-theme">
                                  {250 - (formData.currentHours % 250)} horas (
                                  {(
                                    formData.currentHours +
                                    (250 - (formData.currentHours % 250))
                                  ).toFixed(1)}
                                  h)
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
            <div className="form-section sap-theme">
              <h4 className="section-title sap-theme">📅 {UI_TITLES.IMPORTANT_DATES}</h4>
              <div className="form-grid sap-theme">
                <div className="form-group sap-theme">
                  <label htmlFor="purchaseDate">{UI_FORM_LABELS.PURCHASE_DATE}</label>
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
                    <span className="error-text sap-theme">{errors.purchaseDate}</span>
                  )}
                </div>

                <div className="form-group sap-theme">
                  <label htmlFor="warrantyExpiration">{UI_FORM_LABELS.WARRANTY_EXPIRATION}</label>
                  <input
                    type="date"
                    id="warrantyExpiration"
                    name="warrantyExpiration"
                    value={formData.warrantyExpiration}
                    onChange={handleInputChange}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                </div>

                <div className="form-group sap-theme">
                  <label htmlFor="lastMaintenanceDate">{UI_FORM_LABELS.LAST_MAINTENANCE}</label>
                  <input
                    type="date"
                    id="lastMaintenanceDate"
                    name="lastMaintenanceDate"
                    value={formData.lastMaintenanceDate}
                    onChange={handleInputChange}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                </div>

                <div className="form-group sap-theme">
                  <label htmlFor="nextMaintenanceDate">{UI_FORM_LABELS.NEXT_MAINTENANCE}</label>
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
                    <span className="error-text sap-theme">{errors.nextMaintenanceDate}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="form-section sap-theme">
              <h4 className="section-title sap-theme">📝 {UI_TITLES.DESCRIPTION_AND_NOTES}</h4>
              <div className="form-group sap-theme">
                <label htmlFor="description">{UI_FORM_LABELS.DESCRIPTION}</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={UI_PLACEHOLDERS.VEHICLE_DESCRIPTION}
                  rows="3"
                  maxLength="500"
                  disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                />
                <span className="char-count sap-theme">
                  {formData.description.length}/500 caracteres
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <ModalFooter
        primaryAction={
          !isReadOnly && canEdit
            ? {
                label: loading
                  ? UI_MESSAGES.LOADING.SAVING
                  : mode === 'create'
                    ? UI_ACTIONS.CREATE_VEHICLE
                    : UI_ACTIONS.SAVE_CHANGES,
                onClick: handleSubmit,
                disabled: loading,
                type: 'submit',
              }
            : null
        }
        secondaryAction={{
          label: mode === 'view' ? UI_ACTIONS.CLOSE : UI_ACTIONS.CANCEL,
          onClick: onClose,
        }}
        isLoading={loading}
      />
    </BaseModal>
  );
};

export default VehicleModal;
