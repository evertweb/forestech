/**
 * VehicleCategoriesManager - Gestión de categorías de vehículos personalizables
 * Permite crear, editar y eliminar categorías dinámicamente
 */

import React, { useState, useEffect } from 'react';
import {
  createCategory,
  getAllVehicleCategories,
  updateCategory,
  deleteCategory,
  subscribeToCategories,
  getCategoryStats
} from '../../services/vehicleCategoriesService';
import { 
  DEFAULT_VEHICLE_CATEGORIES,
  AVAILABLE_FIELDS,
  FUEL_TYPES,
  generateCategoryId
} from '../../data/vehicleCategories';
import './VehicleCategoriesManager.css';

const VehicleCategoriesManager = ({ onClose, onCategoryCreated }) => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🚗',
    color: '#2E86AB',
    fuelTypes: [],
    fields: []
  });

  useEffect(() => {
    loadCategoriesAndStats();
    
    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToCategories((updatedCategories) => {
      setCategories(updatedCategories);
      loadStats();
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const loadCategoriesAndStats = async () => {
    try {
      setLoading(true);
      const [categoriesData, statsData] = await Promise.all([
        getAllVehicleCategories(),
        getCategoryStats()
      ]);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getCategoryStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: '🚗',
      color: '#2E86AB',
      fuelTypes: [],
      fields: []
    });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    if (DEFAULT_VEHICLE_CATEGORIES.some(cat => cat.id === category.id)) {
      setError('No se pueden editar las categorías predeterminadas');
      return;
    }
    
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      icon: category.icon || '🚗',
      color: category.color || '#2E86AB',
      fuelTypes: category.fuelTypes || [],
      fields: category.fields || []
    });
    setShowModal(true);
  };

  const handleDeleteCategory = async (category) => {
    if (DEFAULT_VEHICLE_CATEGORIES.some(cat => cat.id === category.id)) {
      setError('No se pueden eliminar las categorías predeterminadas');
      return;
    }

    const confirmed = window.confirm(
      `¿Está seguro de eliminar la categoría "${category.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      await deleteCategory(category.id);
      setError('');
      // La lista se actualizará automáticamente via suscripción
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre de la categoría es requerido');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const categoryData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      if (selectedCategory) {
        // Actualizar categoría existente
        await updateCategory(selectedCategory.id, categoryData);
      } else {
        // Crear nueva categoría
        categoryData.id = generateCategoryId(categoryData.name, categories);
        const newCategory = await createCategory(categoryData);
        onCategoryCreated && onCategoryCreated(newCategory);
      }

      setShowModal(false);
      // La lista se actualizará automáticamente via suscripción
    } catch (error) {
      console.error('Error guardando categoría:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFieldToggle = (fieldKey) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.includes(fieldKey)
        ? prev.fields.filter(f => f !== fieldKey)
        : [...prev.fields, fieldKey]
    }));
  };

  const handleFuelTypeToggle = (fuelType) => {
    setFormData(prev => ({
      ...prev,
      fuelTypes: prev.fuelTypes.includes(fuelType)
        ? prev.fuelTypes.filter(f => f !== fuelType)
        : [...prev.fuelTypes, fuelType]
    }));
  };

  const getStatsForCategory = (categoryId) => {
    return stats.find(stat => stat.id === categoryId) || { vehicleCount: 0, activeVehicles: 0 };
  };

  if (loading) {
    return (
      <div className="categories-manager">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-manager">
      <div className="categories-header">
        <h3>📋 Gestión de Categorías</h3>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={handleCreateCategory}
            disabled={saving}
          >
            ➕ Nueva Categoría
          </button>
          <button 
            className="btn-secondary"
            onClick={onClose}
          >
            ✕ Cerrar
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      <div className="categories-grid">
        {categories.map(category => {
          const isDefault = DEFAULT_VEHICLE_CATEGORIES.some(cat => cat.id === category.id);
          const categoryStats = getStatsForCategory(category.id);
          
          return (
            <div 
              key={category.id} 
              className={`category-card ${isDefault ? 'default' : 'custom'}`}
              style={{ '--category-color': category.color }}
            >
              <div className="category-header">
                <div className="category-icon" style={{ color: category.color }}>
                  {category.icon}
                </div>
                <div className="category-info">
                  <h4>{category.name}</h4>
                  <p>{category.description}</p>
                </div>
                {isDefault && <span className="default-badge">Predeterminada</span>}
              </div>

              <div className="category-stats">
                <div className="stat">
                  <span className="stat-value">{categoryStats.vehicleCount}</span>
                  <span className="stat-label">Vehículos</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{categoryStats.activeVehicles}</span>
                  <span className="stat-label">Activos</span>
                </div>
              </div>

              <div className="category-details">
                <div className="fuel-types">
                  <strong>Combustibles:</strong>
                  <div className="fuel-list">
                    {(category.fuelTypes || []).map(fuel => (
                      <span key={fuel} className="fuel-tag">{fuel}</span>
                    ))}
                  </div>
                </div>

                <div className="fields">
                  <strong>Campos:</strong>
                  <div className="fields-list">
                    {(category.fields || []).slice(0, 3).map(fieldKey => {
                      const field = AVAILABLE_FIELDS.find(f => f.key === fieldKey);
                      return field ? (
                        <span key={fieldKey} className="field-tag">
                          {field.icon} {field.label}
                        </span>
                      ) : null;
                    })}
                    {(category.fields || []).length > 3 && (
                      <span className="more-fields">+{(category.fields || []).length - 3} más</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="category-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEditCategory(category)}
                  disabled={isDefault || saving}
                  title={isDefault ? 'No se pueden editar categorías predeterminadas' : 'Editar categoría'}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDeleteCategory(category)}
                  disabled={isDefault || saving || categoryStats.vehicleCount > 0}
                  title={
                    isDefault 
                      ? 'No se pueden eliminar categorías predeterminadas'
                      : categoryStats.vehicleCount > 0 
                        ? 'No se puede eliminar una categoría con vehículos asignados'
                        : 'Eliminar categoría'
                  }
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de creación/edición */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedCategory ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              {/* Información básica */}
              <div className="form-section">
                <h4>Información Básica</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Maquinaria Pesada"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Icono</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="🚗"
                      className="icon-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe el tipo de vehículos que incluye esta categoría"
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="color-input"
                  />
                </div>
              </div>

              {/* Tipos de combustible */}
              <div className="form-section">
                <h4>Tipos de Combustible Compatibles</h4>
                <div className="fuel-types-grid">
                  {Object.values(FUEL_TYPES).map(fuelType => (
                    <label key={fuelType} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.fuelTypes.includes(fuelType)}
                        onChange={() => handleFuelTypeToggle(fuelType)}
                      />
                      <span>{fuelType}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Campos disponibles */}
              <div className="form-section">
                <h4>Campos Específicos</h4>
                <p className="section-description">
                  Selecciona los campos que serán relevantes para esta categoría
                </p>
                <div className="fields-grid">
                  {AVAILABLE_FIELDS.map(field => (
                    <label key={field.key} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.fields.includes(field.key)}
                        onChange={() => handleFieldToggle(field.key)}
                      />
                      <span>
                        {field.icon} {field.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Vista previa */}
              <div className="form-section">
                <h4>Vista Previa</h4>
                <div 
                  className="category-preview"
                  style={{ '--category-color': formData.color }}
                >
                  <div className="category-header">
                    <div className="category-icon" style={{ color: formData.color }}>
                      {formData.icon}
                    </div>
                    <div className="category-info">
                      <h4>{formData.name || 'Nombre de la categoría'}</h4>
                      <p>{formData.description || 'Descripción de la categoría'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={saving || !formData.name.trim()}
                >
                  {saving ? 'Guardando...' : selectedCategory ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleCategoriesManager;