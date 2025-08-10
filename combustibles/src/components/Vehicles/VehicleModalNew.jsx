/**
 * VehicleModalNew - Modal completamente renovado para crear vehículos desde cero
 * Utiliza sistema de categorías personalizables y campos dinámicos
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useFormData } from '../../hooks/useFormData';
import { VEHICLE_STATUS, FUEL_COMPATIBILITY } from '../../services/vehiclesService';
import { getAllVehicleCategories } from '../../services/vehicleCategoriesService';
import {
  DEFAULT_VEHICLE_CATEGORIES,
  AVAILABLE_FIELDS,
  FUEL_TYPES,
  getCategoryById,
} from '../../data/vehicleCategories';
import VehicleCategoriesManager from './VehicleCategoriesManager';
import './VehicleModalNew.css';

const VehicleModalNew = ({ isOpen, onClose, vehicle, onSave, mode = 'create' }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoriesManager, setShowCategoriesManager] = useState(false);
  const [showCategoryDetails, setShowCategoryDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado inicial del formulario
  const getInitialFormData = useCallback(
    () => ({
      vehicleId: vehicle?.vehicleId || '',
      name: vehicle?.name || '',
      category: vehicle?.category || '',
      brand: vehicle?.brand || '',
      model: vehicle?.model || '',
      fuelType: vehicle?.fuelType || FUEL_COMPATIBILITY.DIESEL,
      status: vehicle?.status || VEHICLE_STATUS.ACTIVO,
      currentLocation: vehicle?.currentLocation || '',
      description: vehicle?.description || '',

      // Campos dinámicos basados en categoría
      plateNumber: vehicle?.plateNumber || '',
      enginePower: vehicle?.enginePower || '',
      fuelCapacity: vehicle?.fuelCapacity || '',
      operatingWeight: vehicle?.operatingWeight || '',
      loadCapacity: vehicle?.loadCapacity || '',
      bucketCapacity: vehicle?.bucketCapacity || '',
      hasHourMeter: vehicle?.hasHourMeter || false,
      currentHours: vehicle?.currentHours || '',
      implementType: vehicle?.implementType || '',
      flow: vehicle?.flow || '',
      pressure: vehicle?.pressure || '',
      weight: vehicle?.weight || '',

      // Fechas
      lastMaintenanceDate: vehicle?.lastMaintenanceDate
        ? new Date(vehicle.lastMaintenanceDate).toISOString().split('T')[0]
        : '',
      purchaseDate: vehicle?.purchaseDate
        ? new Date(vehicle.purchaseDate).toISOString().split('T')[0]
        : '',
    }),
    [vehicle]
  );

  // Función de validación para useFormData
  const validate = (values) => {
    const newErrors = {};
    if (!values.name?.trim()) {
      newErrors.name = 'El nombre del vehículo es requerido';
    }
    if (!values.category) {
      newErrors.category = 'La categoría es requerida';
    }
    if (!values.brand?.trim()) {
      newErrors.brand = 'La marca es requerida';
    }
    if (!values.fuelType) {
      newErrors.fuelType = 'El tipo de combustible es requerido';
    }
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  // Usar el hook useFormData
  const {
    values: formData,
    setValues: setFormData,
    errors,
    setErrors,
    handleInputChange: baseHandleInputChange,
    validateForm,
  } = useFormData(getInitialFormData(), validate);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const categoriesData = await getAllVehicleCategories();
      setCategories(categoriesData);

      // Seleccionar primera categoría si es modo crear
      if (mode === 'create' && categoriesData.length > 0) {
        const firstCategory = categoriesData[0];
        setSelectedCategory(firstCategory);
        setFormData((prev) => ({ ...prev, category: firstCategory.id }));
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    } finally {
      setLoading(false);
    }
  }, [mode, setFormData]); // Added setFormData dependency

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      // Prevenir scroll del fondo cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar scroll del fondo cuando el modal se cierra
      document.body.style.overflow = 'unset';
    }

    // Cleanup function para restaurar overflow
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loadCategories]);

  useEffect(() => {
    if (vehicle && categories.length > 0) {
      const category = getCategoryById(vehicle.category, categories);
      setSelectedCategory(category);
      setFormData(getInitialFormData());
    }
  }, [vehicle, categories, getInitialFormData, setFormData]);

  const handleCategoryChange = (categoryId) => {
    const category = getCategoryById(categoryId, categories);
    setSelectedCategory(category);

    setFormData((prev) => {
      // Regenerar ID del vehículo si hay nombre y es modo crear
      const newVehicleId =
        mode === 'create' && prev.name && category
          ? generateVehicleId(prev.name, category)
          : prev.vehicleId;

      return {
        ...prev,
        category: categoryId,
        vehicleId: newVehicleId,
        // Resetear tipo de combustible si no es compatible
        fuelType: category?.fuelTypes?.includes(prev.fuelType)
          ? prev.fuelType
          : category?.fuelTypes?.[0] || FUEL_COMPATIBILITY.DIESEL,
      };
    });
    setErrors({});
  };

  // Función wrapper para manejar la lógica especial de campos
  const handleInputChange = (field, value) => {
    // Usar baseHandleInputChange del hook para la funcionalidad básica
    const fakeEvent = { target: { name: field, value, type: 'text' } };
    baseHandleInputChange(fakeEvent);

    // Auto-generar ID del vehículo cuando se cambia el nombre
    if (field === 'name' && mode === 'create') {
      const autoId = generateVehicleId(value, selectedCategory);
      const idEvent = { target: { name: 'vehicleId', value: autoId, type: 'text' } };
      baseHandleInputChange(idEvent);
    }

    // Regenerar ID cuando se cambia la categoría
    if (field === 'category' && mode === 'create' && formData.name) {
      const newCategory = selectedCategory;
      if (newCategory) {
        const autoId = generateVehicleId(formData.name, newCategory);
        const idEvent = { target: { name: 'vehicleId', value: autoId, type: 'text' } };
        baseHandleInputChange(idEvent);
      }
    }
  };

  const generateVehicleId = (name, category) => {
    if (!name || !category) return '';

    // Crear prefijo de 2-3 letras de la categoría
    const categoryPrefix = category.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3);

    // Crear sufijo del nombre del vehículo (3-4 caracteres)
    const nameSuffix = name
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 4)
      .toUpperCase();

    // Generar número secuencial basado en timestamp para evitar duplicados
    const timestamp = Date.now().toString();
    const sequential = timestamp.slice(-3); // Últimos 3 dígitos

    return `${categoryPrefix}${nameSuffix}${sequential}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para guardar
      const vehicleData = {
        ...formData,
        // CAMPO CRÍTICO: Agregar type basado en la categoría seleccionada
        type: selectedCategory?.name || formData.category || 'Otro',

        // Convertir strings vacíos a null para campos numéricos opcionales
        enginePower: formData.enginePower ? Number(formData.enginePower) : null,
        fuelCapacity: formData.fuelCapacity ? Number(formData.fuelCapacity) : null,
        operatingWeight: formData.operatingWeight ? Number(formData.operatingWeight) : null,
        loadCapacity: formData.loadCapacity ? Number(formData.loadCapacity) : null,
        bucketCapacity: formData.bucketCapacity ? Number(formData.bucketCapacity) : null,
        currentHours: formData.currentHours ? Number(formData.currentHours) : null,
        flow: formData.flow ? Number(formData.flow) : null,
        pressure: formData.pressure ? Number(formData.pressure) : null,
        weight: formData.weight ? Number(formData.weight) : null,

        // Convertir fechas
        lastMaintenanceDate: formData.lastMaintenanceDate
          ? new Date(formData.lastMaintenanceDate)
          : null,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : null,

        // Agregar metadatos de categoría
        categoryName: selectedCategory?.name,
        categoryIcon: selectedCategory?.icon,
        categoryColor: selectedCategory?.color,
      };

      await onSave(vehicleData);
      onClose();
    } catch (error) {
      console.error('Error guardando vehículo:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getCompatibleFuelTypes = () => {
    if (!selectedCategory) return Object.values(FUEL_COMPATIBILITY);
    return selectedCategory.fuelTypes || Object.values(FUEL_COMPATIBILITY);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{mode === 'create' ? '🚗 Nuevo Vehículo' : '✏️ Editar Vehículo'}</h2>
          <div className="header-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowCategoriesManager(true)}
              disabled={loading}
            >
              📋 Gestionar Categorías
            </button>
            <button type="button" className="btn-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {errors.submit && <div className="error-banner">⚠️ {errors.submit}</div>}

          {/* Selección de categoría */}
          <div className="form-section">
            <h3>📂 Categoría del Vehículo</h3>

            {loading ? (
              <div className="loading-categories">
                <div className="spinner"></div>
                <span>Cargando categorías...</span>
              </div>
            ) : (
              <div className="categories-selector">
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className={`category-select ${errors.category ? 'error' : ''}`}
                >
                  <option value="">Seleccionar categoría del vehículo...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                      {DEFAULT_VEHICLE_CATEGORIES.some((cat) => cat.id === category.id) &&
                        ' (Predeterminada)'}
                    </option>
                  ))}
                </select>

                {/* Información expandible de la categoría seleccionada */}
                {selectedCategory && (
                  <CategoryInfo
                    category={selectedCategory}
                    isExpanded={showCategoryDetails}
                    onToggle={() => setShowCategoryDetails(!showCategoryDetails)}
                  />
                )}
              </div>
            )}

            {errors.category && <span className="field-error">{errors.category}</span>}
          </div>

          {/* Información básica */}
          <div className="form-section">
            <h3>📝 Información Básica</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vehicleId" className="form-label">
                  🔢 Código Único de Identificación *
                </label>
                <input
                  type="text"
                  id="vehicleId"
                  value={formData.vehicleId}
                  className={`form-input ${errors.vehicleId ? 'error' : ''} ${mode === 'create' ? 'readonly' : ''}`}
                  placeholder="Se genera automáticamente al escribir el nombre"
                  readOnly={mode === 'create'}
                  onChange={
                    mode === 'edit'
                      ? (e) => handleInputChange('vehicleId', e.target.value)
                      : undefined
                  }
                  required
                />
                <small className="field-help">
                  Este código se genera automáticamente basado en el nombre y categoría del vehículo
                </small>
                {errors.vehicleId && <span className="field-error">{errors.vehicleId}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  📛 Nombre del Vehículo *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Ej: Excavadora Principal, Tractor TR1"
                  required
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="brand" className="form-label">
                  🏭 Marca
                </label>
                <input
                  type="text"
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="form-input"
                  placeholder="Ej: Caterpillar, John Deere"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fuelType" className="form-label">
                  ⛽ Tipo de Combustible *
                </label>
                <select
                  id="fuelType"
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className={`form-input ${errors.fuelType ? 'error' : ''}`}
                  required
                >
                  {getCompatibleFuelTypes().map((fuelType) => (
                    <option key={fuelType} value={fuelType}>
                      {fuelType}
                    </option>
                  ))}
                </select>
                {errors.fuelType && <span className="field-error">{errors.fuelType}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  🚦 Estado
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="form-input"
                >
                  {Object.entries(VEHICLE_STATUS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="currentLocation" className="form-label">
                📍 Ubicación Actual
              </label>
              <input
                type="text"
                id="currentLocation"
                value={formData.currentLocation}
                onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                className="form-input"
                placeholder="Ej: Sector Norte, Patio Principal"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                📄 Descripción
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="form-input"
                rows="3"
                placeholder="Descripción adicional del vehículo, características especiales, etc."
              />
            </div>
          </div>

          {/* Fechas importantes */}
          <div className="form-section">
            <h3>📅 Fechas Importantes</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="purchaseDate" className="form-label">
                  💰 Fecha de Compra
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastMaintenanceDate" className="form-label">
                  🔧 Último Mantenimiento
                </label>
                <input
                  type="date"
                  id="lastMaintenanceDate"
                  value={formData.lastMaintenanceDate}
                  onChange={(e) => handleInputChange('lastMaintenanceDate', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Vista previa */}
          {selectedCategory && (
            <div className="form-section">
              <h3>👁️ Vista Previa</h3>
              <div
                className="vehicle-preview"
                style={{ '--category-color': selectedCategory.color }}
              >
                <div className="preview-header">
                  <div className="preview-icon" style={{ color: selectedCategory.color }}>
                    {selectedCategory.icon}
                  </div>
                  <div className="preview-info">
                    <h4>{formData.name || 'Nombre del vehículo'}</h4>
                    <p>
                      {formData.vehicleId || 'Código del vehículo'} • {selectedCategory.name}
                    </p>
                    <p>{formData.brand}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading || !selectedCategory}>
              {loading
                ? 'Guardando...'
                : mode === 'create'
                  ? 'Crear Vehículo'
                  : 'Actualizar Vehículo'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de gestión de categorías */}
      {showCategoriesManager && (
        <VehicleCategoriesManager
          onClose={() => setShowCategoriesManager(false)}
          onCategoryCreated={(newCategory) => {
            setCategories((prev) => [...prev, newCategory]);
            setShowCategoriesManager(false);
          }}
        />
      )}
    </div>
  );
};

// Componente para mostrar información expandible de la categoría
const CategoryInfo = ({ category, isExpanded, onToggle }) => {
  if (!category) return null;

  return (
    <div className="category-info-panel">
      {/* Vista compacta */}
      <div className="category-compact">
        <div className="category-summary">
          <span className="category-icon" style={{ color: category.color }}>
            {category.icon}
          </span>
          <div className="category-basic-info">
            <span className="category-name">{category.name}</span>
            <span className="category-short-desc">
              {category.description?.length > 50
                ? category.description.substring(0, 50) + '...'
                : category.description}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="category-toggle-btn"
          onClick={onToggle}
          aria-label={isExpanded ? 'Contraer información' : 'Expandir información'}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Vista expandida */}
      {isExpanded && (
        <div className="category-expanded">
          <div className="category-detail-section">
            <h4>📋 Descripción Completa</h4>
            <p>{category.description}</p>
          </div>

          {category.fuelTypes && category.fuelTypes.length > 0 && (
            <div className="category-detail-section">
              <h4>⛽ Combustibles Compatibles</h4>
              <div className="fuel-types-list">
                {category.fuelTypes.map((fuel) => (
                  <span key={fuel} className="fuel-type-badge">
                    {fuel}
                  </span>
                ))}
              </div>
            </div>
          )}

          {category.fields && category.fields.length > 0 && (
            <div className="category-detail-section">
              <h4>🔧 Campos Específicos</h4>
              <div className="fields-list">
                {category.fields.map((field) => (
                  <span key={field} className="field-badge">
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}

          {category.isCustom && (
            <div className="category-detail-section">
              <span className="custom-badge">✨ Categoría Personalizada</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleModalNew;
