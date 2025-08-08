/**
 * InventoryModal - Modal para crear y editar items de inventario
 * Refactorizado para usar BaseModal
 */
import React, { useState, useEffect, useCallback } from 'react';
import BaseModal from '../shared/BaseModal';
import ModalHeader from '../shared/ModalHeader';
import ModalFooter from '../shared/ModalFooter';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { createInventoryItem, updateInventoryItem } from '../../services/inventoryService';
import { FUEL_TYPES, FUEL_INFO } from '../../constants/combustibleTypes';
import { MODAL_PRESETS, UI_ACTIONS, UI_FORM_LABELS, UI_MESSAGES } from '../../constants';
import useFormData from '../../hooks/useFormData';

const InventoryModal = ({ item, onClose, onSuccess }) => {
  // Estado y loading solo con hooks centralizados
  const [loading, setLoading] = useState(false);
  const isEditing = !!item;
  const { userProfile } = useCombustibles();

  // Estado inicial y validación con useFormData
  const getInitialFormData = useCallback(() => ({
    fuelType: '',
    location: '',
    currentStock: '',
    maxCapacity: '',
    minThreshold: '',
    pricePerUnit: '',
    supplier: '',
    description: '',
    status: 'active'
  }), []);

  const validate = (values) => {
    const newErrors = {};
    if (!values.fuelType) newErrors.fuelType = 'Tipo de combustible es requerido';
    if (!values.location) newErrors.location = 'Ubicación es requerida';
    if (!values.maxCapacity) newErrors.maxCapacity = 'Capacidad máxima es requerida';

    const currentStock = Number(values.currentStock);
    const maxCapacity = Number(values.maxCapacity);
    const minThreshold = Number(values.minThreshold);
    const pricePerUnit = Number(values.pricePerUnit);

    if (values.currentStock && (isNaN(currentStock) || currentStock < 0)) {
      newErrors.currentStock = 'Stock actual debe ser un número válido mayor o igual a 0';
    }
    if (values.maxCapacity && (isNaN(maxCapacity) || maxCapacity <= 0)) {
      newErrors.maxCapacity = 'Capacidad máxima debe ser un número válido mayor a 0';
    }
    if (values.minThreshold && (isNaN(minThreshold) || minThreshold < 0)) {
      newErrors.minThreshold = 'Umbral mínimo debe ser un número válido mayor o igual a 0';
    }
    if (values.pricePerUnit && (isNaN(pricePerUnit) || pricePerUnit < 0)) {
      newErrors.pricePerUnit = 'Precio debe ser un número válido mayor o igual a 0';
    }
    if (currentStock > maxCapacity) {
      newErrors.currentStock = 'Stock actual no puede ser mayor a la capacidad máxima';
    }
    if (minThreshold > maxCapacity) {
      newErrors.minThreshold = 'Umbral mínimo no puede ser mayor a la capacidad máxima';
    }
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const {
    values: formData,
    setValues: setFormData,
    errors,
    handleInputChange,
    validateForm
  } = useFormData(getInitialFormData(), validate);

  // Reinicializar formulario cuando cambie el item a editar
  useEffect(() => {
    if (isEditing && item) {
      setFormData({
        fuelType: item.fuelType || '',
        location: item.location || '',
        currentStock: item.currentStock || '',
        maxCapacity: item.maxCapacity || '',
        minThreshold: item.minThreshold || '',
        pricePerUnit: item.pricePerUnit || '',
        supplier: item.supplier || '',
        description: item.description || '',
        status: item.status || 'active'
      });
    }
  }, [isEditing, item, setFormData]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let result;
      
      if (isEditing) {
        // Update existing item
        result = await updateInventoryItem(
          item.id,
          {
            location: formData.location,
            currentStock: Number(formData.currentStock) || 0,
            maxCapacity: Number(formData.maxCapacity),
            minThreshold: Number(formData.minThreshold) || (Number(formData.maxCapacity) * 0.15),
            pricePerUnit: Number(formData.pricePerUnit) || 0,
            supplier: formData.supplier,
            description: formData.description,
            status: formData.status
          },
          userProfile.uid
        );
      } else {
        // Create new item
        result = await createInventoryItem(
          {
            fuelType: formData.fuelType,
            location: formData.location,
            currentStock: Number(formData.currentStock) || 0,
            maxCapacity: Number(formData.maxCapacity),
            minThreshold: Number(formData.minThreshold) || (Number(formData.maxCapacity) * 0.15),
            pricePerUnit: Number(formData.pricePerUnit) || 0,
            supplier: formData.supplier,
            description: formData.description,
            status: formData.status
          },
          userProfile.uid
        );
      }

      if (result.success) {
        alert(result.message);
        onSuccess();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving inventory item:', error);
      alert('Error inesperado al guardar el item');
    } finally {
      setLoading(false);
    }
  };

  const selectedFuelInfo = FUEL_INFO[formData.fuelType];

  const getModalTitle = () => {
    return isEditing ? `${UI_ACTIONS.EDIT} Combustible` : `${UI_ACTIONS.ADD} Nuevo Combustible`;
  };

  const getModalIcon = () => {
    return isEditing ? '✏️' : '➕';
  };

  return (
    <BaseModal 
      isOpen={true} 
      onClose={onClose}
      size="lg"
      className="inventory-modal"
    >
      <ModalHeader 
        title={getModalTitle()}
        icon={getModalIcon()}
        onClose={onClose}
      />

      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Tipo de Combustible */}
            <div className="form-group">
              <label htmlFor="fuelType">
                {UI_FORM_LABELS.FUEL_TYPE} *
                {selectedFuelInfo && (
                  <span className="fuel-preview">
                    {selectedFuelInfo.icon} {selectedFuelInfo.name}
                  </span>
                )}
              </label>
              <select
                id="fuelType"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                disabled={isEditing} // No permitir cambiar tipo al editar
                className={errors.fuelType ? 'error' : ''}
                required
              >
                <option value="">Seleccionar tipo...</option>
                {Object.entries(FUEL_TYPES).map(([key, value]) => {
                  const info = FUEL_INFO[value];
                  return (
                    <option key={key} value={value}>
                      {info.icon} {info.name} ({info.unit})
                    </option>
                  );
                })}
              </select>
              {errors.fuelType && <span className="error-text">{errors.fuelType}</span>}
            </div>

            {/* Ubicación */}
            <div className="form-group">
              <label htmlFor="location">Ubicación / Tanque *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="ej. Tanque Principal, Depósito A, Bodega Norte"
                className={errors.location ? 'error' : ''}
                required
              />
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>

            {/* Stock Actual */}
            <div className="form-group">
              <label htmlFor="currentStock">
                Stock Actual {selectedFuelInfo && `(${selectedFuelInfo.unit})`}
              </label>
              <input
                type="number"
                id="currentStock"
                name="currentStock"
                value={formData.currentStock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
                className={errors.currentStock ? 'error' : ''}
              />
              {errors.currentStock && <span className="error-text">{errors.currentStock}</span>}
            </div>

            {/* Capacidad Máxima */}
            <div className="form-group">
              <label htmlFor="maxCapacity">
                Capacidad Máxima * {selectedFuelInfo && `(${selectedFuelInfo.unit})`}
              </label>
              <input
                type="number"
                id="maxCapacity"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleInputChange}
                placeholder="1000"
                min="1"
                step="0.01"
                className={errors.maxCapacity ? 'error' : ''}
                required
              />
              {errors.maxCapacity && <span className="error-text">{errors.maxCapacity}</span>}
            </div>

            {/* Umbral Mínimo */}
            <div className="form-group">
              <label htmlFor="minThreshold">
                Umbral Mínimo {selectedFuelInfo && `(${selectedFuelInfo.unit})`}
                <span className="field-hint">Para alertas de stock bajo</span>
              </label>
              <input
                type="number"
                id="minThreshold"
                name="minThreshold"
                value={formData.minThreshold}
                onChange={handleInputChange}
                placeholder="Auto: 15% de capacidad máxima"
                min="0"
                step="0.01"
                className={errors.minThreshold ? 'error' : ''}
              />
              {errors.minThreshold && <span className="error-text">{errors.minThreshold}</span>}
              {formData.maxCapacity && (
                <span className="field-hint">
                  Sugerido: {Math.round(Number(formData.maxCapacity) * 0.15)} {selectedFuelInfo?.unit || 'unidades'}
                </span>
              )}
            </div>

            {/* Precio por Unidad */}
            <div className="form-group">
              <label htmlFor="pricePerUnit">
                Precio por {selectedFuelInfo?.unit || 'Unidad'}
              </label>
              <input
                type="number"
                id="pricePerUnit"
                name="pricePerUnit"
                value={formData.pricePerUnit}
                onChange={handleInputChange}
                placeholder="12000"
                min="0"
                step="0.01"
                className={errors.pricePerUnit ? 'error' : ''}
              />
              {errors.pricePerUnit && <span className="error-text">{errors.pricePerUnit}</span>}
            </div>

            {/* Proveedor */}
            <div className="form-group">
              <label htmlFor="supplier">Proveedor Principal</label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                placeholder="ej. Petrobras, Terpel, Mobil"
              />
            </div>

            {/* Estado */}
            <div className="form-group">
              <label htmlFor="status">Estado</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="maintenance">Mantenimiento</option>
              </select>
            </div>

            {/* Descripción */}
            <div className="form-group full-width">
              <label htmlFor="description">Descripción / Notas</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Información adicional sobre este combustible..."
                rows="3"
              />
            </div>
          </div>

          {/* Preview */}
          {selectedFuelInfo && formData.maxCapacity && (
            <div className="form-preview">
              <h4>📊 Vista Previa</h4>
              <div className="preview-card">
                <div className="preview-header">
                  <span style={{ color: selectedFuelInfo.color }}>
                    {selectedFuelInfo.icon} {selectedFuelInfo.name}
                  </span>
                  <span>{formData.location}</span>
                </div>
                <div className="preview-capacity">
                  {formData.currentStock || 0} / {formData.maxCapacity} {selectedFuelInfo.unit}
                  {formData.currentStock && formData.maxCapacity && (
                    <span className="preview-percentage">
                      ({Math.round((Number(formData.currentStock) / Number(formData.maxCapacity)) * 100)}%)
                    </span>
                  )}
                </div>
                {formData.pricePerUnit && (
                  <div className="preview-value">
                    Valor total: {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0
                    }).format((Number(formData.currentStock) || 0) * Number(formData.pricePerUnit))}
                  </div>
                )}
              </div>
            </div>
          )}

        </form>
      </div>

      <ModalFooter 
        primaryAction={{
          label: loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear'),
          onClick: handleSubmit,
          disabled: loading,
          type: 'submit'
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: onClose
        }}
        isLoading={loading}
      />
    </BaseModal>
  );
};

export default InventoryModal;