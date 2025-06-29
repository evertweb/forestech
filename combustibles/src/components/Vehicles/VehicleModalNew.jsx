/**
 * VehicleModalNew - Modal completamente renovado para crear vehículos desde cero
 * Utiliza sistema de categorías personalizables y campos dinámicos
 */

import React, { useState, useEffect } from 'react';
import { VEHICLE_STATUS, FUEL_COMPATIBILITY } from '../../services/vehiclesService';
import { getAllVehicleCategories } from '../../services/vehicleCategoriesService';
import { 
  DEFAULT_VEHICLE_CATEGORIES, 
  AVAILABLE_FIELDS, 
  FUEL_TYPES,
  getCategoryById 
} from '../../data/vehicleCategories';
import VehicleCategoriesManager from './VehicleCategoriesManager';
import './VehicleModalNew.css';

const VehicleModalNew = ({ 
  isOpen, 
  onClose, 
  vehicle, 
  onSave, 
  mode = 'create'
}) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoriesManager, setShowCategoriesManager] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Estado inicial del formulario
  const getInitialFormData = () => ({
    vehicleId: vehicle?.vehicleId || '',
    name: vehicle?.name || '',
    category: vehicle?.category || '',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
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
    lastMaintenanceDate: vehicle?.lastMaintenanceDate ? 
      new Date(vehicle.lastMaintenanceDate).toISOString().split('T')[0] : '',
    purchaseDate: vehicle?.purchaseDate ? 
      new Date(vehicle.purchaseDate).toISOString().split('T')[0] : ''
  });

  const [formData, setFormData] = useState(getInitialFormData());

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (vehicle && categories.length > 0) {
      const category = getCategoryById(vehicle.category, categories);
      setSelectedCategory(category);
      setFormData(getInitialFormData());
    }
  }, [vehicle, categories]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getAllVehicleCategories();
      setCategories(categoriesData);
      
      // Seleccionar primera categoría si es modo crear
      if (mode === 'create' && categoriesData.length > 0) {
        const firstCategory = categoriesData[0];
        setSelectedCategory(firstCategory);
        setFormData(prev => ({ ...prev, category: firstCategory.id }));
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    const category = getCategoryById(categoryId, categories);
    setSelectedCategory(category);
    setFormData(prev => ({ 
      ...prev, 
      category: categoryId,
      // Resetear tipo de combustible si no es compatible
      fuelType: category?.fuelTypes?.includes(prev.fuelType) 
        ? prev.fuelType 
        : category?.fuelTypes?.[0] || FUEL_COMPATIBILITY.DIESEL
    }));
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }

    // Auto-generar ID del vehículo si no existe
    if (field === 'name' && !formData.vehicleId && mode === 'create') {
      const autoId = generateVehicleId(value, selectedCategory);
      setFormData(prev => ({ ...prev, vehicleId: autoId }));
    }
  };

  const generateVehicleId = (name, category) => {
    if (!name || !category) return '';
    
    const prefix = category.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    
    const suffix = name
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 6)
      .toUpperCase();
    
    return `${prefix}-${suffix}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`;
  };

  const validateForm = () => {
    const newErrors = {};

    // Campos obligatorios
    if (!formData.vehicleId?.trim()) {
      newErrors.vehicleId = 'Código del vehículo es requerido';
    }

    if (!formData.name?.trim()) {
      newErrors.name = 'Nombre del vehículo es requerido';
    }

    if (!formData.category) {
      newErrors.category = 'Categoría es requerida';
    }

    if (!formData.fuelType) {
      newErrors.fuelType = 'Tipo de combustible es requerido';
    }

    // Validar compatibilidad de combustible con categoría
    if (selectedCategory && formData.fuelType) {
      if (!selectedCategory.fuelTypes?.includes(formData.fuelType)) {
        newErrors.fuelType = `Este combustible no es compatible con la categoría ${selectedCategory.name}`;
      }
    }

    // Validar campos numéricos
    const numericFields = ['enginePower', 'fuelCapacity', 'operatingWeight', 'loadCapacity', 'bucketCapacity', 'flow', 'pressure', 'weight'];
    numericFields.forEach(field => {
      if (formData[field] && (isNaN(formData[field]) || Number(formData[field]) < 0)) {
        newErrors[field] = 'Debe ser un número válido mayor o igual a 0';
      }
    });

    // Validar año
    if (formData.year && (formData.year < 1900 || formData.year > new Date().getFullYear() + 1)) {
      newErrors.year = `Año debe estar entre 1900 y ${new Date().getFullYear() + 1}`;
    }

    // Validar horómetro para tractores
    if (formData.hasHourMeter && formData.currentHours) {
      if (isNaN(formData.currentHours) || Number(formData.currentHours) < 0) {
        newErrors.currentHours = 'Horas actuales debe ser un número válido mayor o igual a 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        year: Number(formData.year),
        
        // Convertir fechas
        lastMaintenanceDate: formData.lastMaintenanceDate ? new Date(formData.lastMaintenanceDate) : null,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : null,
        
        // Agregar metadatos de categoría
        categoryName: selectedCategory?.name,
        categoryIcon: selectedCategory?.icon,
        categoryColor: selectedCategory?.color
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

  const renderField = (fieldKey) => {
    const field = AVAILABLE_FIELDS.find(f => f.key === fieldKey);
    if (!field) return null;

    const value = formData[fieldKey] || '';
    const error = errors[fieldKey];

    // Campo dependiente
    if (field.dependsOn && !formData[field.dependsOn]) {
      return null;
    }

    const commonProps = {
      id: fieldKey,
      value: value,
      onChange: (e) => handleInputChange(fieldKey, e.target.value),
      className: `form-input ${error ? 'error' : ''}`
    };

    return (
      <div key={fieldKey} className="form-group">
        <label htmlFor={fieldKey} className="form-label">
          {field.icon} {field.label}
        </label>
        
        {field.type === 'boolean' ? (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleInputChange(fieldKey, e.target.checked)}
            />
            <span>Sí, tiene {field.label.toLowerCase()}</span>
          </label>
        ) : (
          <input
            type={field.type}
            {...commonProps}
            placeholder={`Ingrese ${field.label.toLowerCase()}`}
            min={field.type === 'number' ? '0' : undefined}
            step={field.type === 'number' ? 'any' : undefined}
          />
        )}
        
        {error && <span className="field-error">{error}</span>}
      </div>
    );
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
          <h2>
            {mode === 'create' ? '🚗 Nuevo Vehículo' : '✏️ Editar Vehículo'}
          </h2>
          <div className="header-actions">
            <button 
              type="button"
              className="btn-secondary"
              onClick={() => setShowCategoriesManager(true)}
              disabled={loading}
            >
              📋 Gestionar Categorías
            </button>
            <button 
              type="button"
              className="btn-close"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {errors.submit && (
            <div className="error-banner">
              ⚠️ {errors.submit}
            </div>
          )}

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
                {categories.map(category => (
                  <div 
                    key={category.id}
                    className={`category-option ${formData.category === category.id ? 'selected' : ''}`}
                    onClick={() => handleCategoryChange(category.id)}
                    style={{ '--category-color': category.color }}
                  >
                    <div className="category-icon" style={{ color: category.color }}>
                      {category.icon}
                    </div>
                    <div className="category-info">
                      <h4>{category.name}</h4>
                      <p>{category.description}</p>
                    </div>
                    {DEFAULT_VEHICLE_CATEGORIES.some(cat => cat.id === category.id) && (
                      <span className="default-badge">Predeterminada</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {errors.category && <span className="field-error">{errors.category}</span>}
          </div>

          {/* Información básica */}
          <div className="form-section">
            <h3>📝 Información Básica</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vehicleId" className="form-label">🏷️ Código del Vehículo *</label>
                <input
                  type="text"
                  id="vehicleId"
                  value={formData.vehicleId}
                  onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                  className={`form-input ${errors.vehicleId ? 'error' : ''}`}
                  placeholder="Ej: EXC-001, TR-123"
                  required
                />
                {errors.vehicleId && <span className="field-error">{errors.vehicleId}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="name" className="form-label">📛 Nombre del Vehículo *</label>
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
                <label htmlFor="brand" className="form-label">🏭 Marca</label>
                <input
                  type="text"
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="form-input"
                  placeholder="Ej: Caterpillar, John Deere"
                />
              </div>

              <div className="form-group">
                <label htmlFor="model" className="form-label">🔧 Modelo</label>
                <input
                  type="text"
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="form-input"
                  placeholder="Ej: 320D, 6120M"
                />
              </div>

              <div className="form-group">
                <label htmlFor="year" className="form-label">📅 Año</label>
                <input
                  type="number"
                  id="year"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className={`form-input ${errors.year ? 'error' : ''}`}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
                {errors.year && <span className="field-error">{errors.year}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fuelType" className="form-label">⛽ Tipo de Combustible *</label>
                <select
                  id="fuelType"
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className={`form-input ${errors.fuelType ? 'error' : ''}`}
                  required
                >
                  {getCompatibleFuelTypes().map(fuelType => (
                    <option key={fuelType} value={fuelType}>
                      {fuelType}
                    </option>
                  ))}
                </select>
                {errors.fuelType && <span className="field-error">{errors.fuelType}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">🚦 Estado</label>
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
              <label htmlFor="currentLocation" className="form-label">📍 Ubicación Actual</label>
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
              <label htmlFor="description" className="form-label">📄 Descripción</label>
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

          {/* Campos específicos de la categoría */}
          {selectedCategory && selectedCategory.fields && selectedCategory.fields.length > 0 && (
            <div className="form-section">
              <h3>🔧 Especificaciones de {selectedCategory.name}</h3>
              <div className="dynamic-fields">
                {selectedCategory.fields.map(fieldKey => renderField(fieldKey))}
              </div>
            </div>
          )}

          {/* Fechas importantes */}
          <div className="form-section">
            <h3>📅 Fechas Importantes</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="purchaseDate" className="form-label">💰 Fecha de Compra</label>
                <input
                  type="date"
                  id="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastMaintenanceDate" className="form-label">🔧 Último Mantenimiento</label>
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
                    <p>{formData.vehicleId || 'Código del vehículo'} • {selectedCategory.name}</p>
                    <p>{formData.brand} {formData.model} {formData.year}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || !selectedCategory}
            >
              {loading ? 'Guardando...' : mode === 'create' ? 'Crear Vehículo' : 'Actualizar Vehículo'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de gestión de categorías */}
      {showCategoriesManager && (
        <VehicleCategoriesManager
          onClose={() => setShowCategoriesManager(false)}
          onCategoryCreated={(newCategory) => {
            setCategories(prev => [...prev, newCategory]);
            setShowCategoriesManager(false);
          }}
        />
      )}
    </div>
  );
};

export default VehicleModalNew;