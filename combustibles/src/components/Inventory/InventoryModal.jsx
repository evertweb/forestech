// combustibles/src/components/Inventory/InventoryModal.jsx
// Modal para crear y editar items de inventario
import React, { useState, useEffect } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { createInventoryItem, updateInventoryItem } from '../../services/inventoryService';
import { FUEL_TYPES, FUEL_INFO } from '../../constants/combustibleTypes';

const InventoryModal = ({ item, onClose, onSuccess }) => {
  const { userProfile } = useCombustibles();
  const isEditing = !!item;

  // Form state
  const [formData, setFormData] = useState({
    fuelType: '',
    location: '',
    currentStock: '',
    maxCapacity: '',
    minThreshold: '',
    pricePerUnit: '',
    supplier: '',
    description: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form data
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
  }, [isEditing, item]);

  // Auto-calculate min threshold when max capacity changes
  useEffect(() => {
    if (formData.maxCapacity && !formData.minThreshold) {
      const autoThreshold = Math.round(Number(formData.maxCapacity) * 0.15);
      setFormData(prev => ({
        ...prev,
        minThreshold: autoThreshold
      }));
    }
  }, [formData.maxCapacity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.fuelType) newErrors.fuelType = 'Tipo de combustible es requerido';
    if (!formData.location) newErrors.location = 'Ubicación es requerida';
    if (!formData.maxCapacity) newErrors.maxCapacity = 'Capacidad máxima es requerida';

    // Numeric validations
    const currentStock = Number(formData.currentStock);
    const maxCapacity = Number(formData.maxCapacity);
    const minThreshold = Number(formData.minThreshold);
    const pricePerUnit = Number(formData.pricePerUnit);

    if (formData.currentStock && (isNaN(currentStock) || currentStock < 0)) {
      newErrors.currentStock = 'Stock actual debe ser un número válido mayor o igual a 0';
    }

    if (formData.maxCapacity && (isNaN(maxCapacity) || maxCapacity <= 0)) {
      newErrors.maxCapacity = 'Capacidad máxima debe ser un número válido mayor a 0';
    }

    if (formData.minThreshold && (isNaN(minThreshold) || minThreshold < 0)) {
      newErrors.minThreshold = 'Umbral mínimo debe ser un número válido mayor o igual a 0';
    }

    if (formData.pricePerUnit && (isNaN(pricePerUnit) || pricePerUnit < 0)) {
      newErrors.pricePerUnit = 'Precio debe ser un número válido mayor o igual a 0';
    }

    // Business logic validations
    if (currentStock > maxCapacity) {
      newErrors.currentStock = 'Stock actual no puede ser mayor a la capacidad máxima';
    }

    if (minThreshold > maxCapacity) {
      newErrors.minThreshold = 'Umbral mínimo no puede ser mayor a la capacidad máxima';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content inventory-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {isEditing ? '✏️ Editar Combustible' : '➕ Agregar Nuevo Combustible'}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Tipo de Combustible */}
            <div className="form-group">
              <label htmlFor="fuelType">
                Tipo de Combustible *
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

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;