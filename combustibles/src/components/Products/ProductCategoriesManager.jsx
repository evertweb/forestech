/**
 * ProductCategoriesManager - Gestión de categorías de productos personalizables
 * Permite crear, editar y eliminar categorías dinámicamente
 */

import React, { useState, useEffect } from 'react';
import {
  createCategory,
  getAllProductCategories,
  updateCategory,
  deleteCategory,
  subscribeToCategories,
  getCategoryStats,
  DEFAULT_PRODUCT_CATEGORIES,
  AVAILABLE_FIELDS,
  generateCategoryId,
} from '../../services/FirebaseProductCategoriesService';
import './ProductCategoriesManager.css';

const ProductCategoriesManager = ({ onClose, onCategoryCreated }) => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  // Unidades disponibles para productos
  const AVAILABLE_UNITS = ['gal', 'L', 'kg', 'g', 'ml', 'oz', 'lb'];

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📦',
    color: '#2E86AB',
    units: [],
    fields: [],
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
        getAllProductCategories(),
        getCategoryStats(),
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
      icon: '📦',
      color: '#2E86AB',
      units: [],
      fields: [],
    });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    if (category.isDefault) {
      setError('No se pueden editar las categorías predeterminadas');
      return;
    }

    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      icon: category.icon || '📦',
      color: category.color || '#2E86AB',
      units: category.units || [],
      fields: category.fields || [],
    });
    setShowModal(true);
  };

  const handleDeleteCategory = async (category) => {
    if (category.isDefault) {
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
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.includes(fieldKey)
        ? prev.fields.filter((f) => f !== fieldKey)
        : [...prev.fields, fieldKey],
    }));
  };

  const handleUnitToggle = (unit) => {
    setFormData((prev) => ({
      ...prev,
      units: prev.units.includes(unit)
        ? prev.units.filter((u) => u !== unit)
        : [...prev.units, unit],
    }));
  };

  const getStatsForCategory = (categoryId) => {
    return stats.find((stat) => stat.id === categoryId) || { productCount: 0, activeProducts: 0 };
  };

  if (loading) {
    return (
      <div className="product-categories-manager sap-theme">
        <div className="loading sap-theme">
          <div className="spinner sap-theme"></div>
          <p>Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-categories-manager sap-theme">
      <div className="categories-header sap-theme">
        <h3>🏷️ Gestión de Categorías de Productos</h3>
        <div className="header-actions sap-theme">
          <button
            className="btn-primary sap-theme"
            onClick={handleCreateCategory}
            disabled={saving}
          >
            ➕ Nueva Categoría
          </button>
          <button className="btn-secondary sap-theme" onClick={onClose}>
            ✕ Cerrar
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message sap-theme">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      <div className="categories-grid sap-theme">
        {categories.map((category) => {
          const categoryStats = getStatsForCategory(category.id);

          return (
            <div
              key={category.id}
              className={`category-card ${category.isDefault ? 'default' : 'custom'}`}
              style={{ '--category-color': category.color }}
            >
              <div className="category-header sap-theme">
                <div className="category-icon sap-theme" style={{ color: category.color }}>
                  {category.icon}
                </div>
                <div className="category-info sap-theme">
                  <h4>{category.name}</h4>
                  <p>{category.description}</p>
                </div>
                {category.isDefault && (
                  <span className="default-badge sap-theme">Predeterminada</span>
                )}
              </div>

              <div className="category-stats sap-theme">
                <div className="stat sap-theme">
                  <span className="stat-value sap-theme">{categoryStats.productCount}</span>
                  <span className="stat-label sap-theme">Productos</span>
                </div>
                <div className="stat sap-theme">
                  <span className="stat-value sap-theme">{categoryStats.activeProducts}</span>
                  <span className="stat-label sap-theme">Activos</span>
                </div>
              </div>

              <div className="category-details sap-theme">
                <div className="units sap-theme">
                  <strong>Unidades:</strong>
                  <div className="units-list sap-theme">
                    {(category.units || []).map((unit) => (
                      <span key={unit} className="unit-tag sap-theme">
                        {unit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="fields sap-theme">
                  <strong>Campos:</strong>
                  <div className="fields-list sap-theme">
                    {(category.fields || []).slice(0, 3).map((fieldKey) => {
                      const field = AVAILABLE_FIELDS.find((f) => f.key === fieldKey);
                      return field ? (
                        <span key={fieldKey} className="field-tag sap-theme">
                          {field.icon} {field.label}
                        </span>
                      ) : null;
                    })}
                    {(category.fields || []).length > 3 && (
                      <span className="more-fields sap-theme">
                        +{(category.fields || []).length - 3} más
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="category-actions sap-theme">
                <button
                  className="btn-edit sap-theme"
                  onClick={() => handleEditCategory(category)}
                  disabled={category.isDefault || saving}
                  title={
                    category.isDefault
                      ? 'No se pueden editar categorías predeterminadas'
                      : 'Editar categoría'
                  }
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn-delete sap-theme"
                  onClick={() => handleDeleteCategory(category)}
                  disabled={category.isDefault || saving || categoryStats.productCount > 0}
                  title={
                    category.isDefault
                      ? 'No se pueden eliminar categorías predeterminadas'
                      : categoryStats.productCount > 0
                        ? 'No se puede eliminar una categoría con productos asignados'
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
        <div className="modal-overlay sap-theme">
          <div className="modal-content sap-theme">
            <div className="modal-header sap-theme">
              <h3>{selectedCategory ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="category-form sap-theme">
              {/* Información básica */}
              <div className="form-section sap-theme">
                <h4>Información Básica</h4>

                <div className="form-row sap-theme">
                  <div className="form-group sap-theme">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Aditivos"
                      required
                    />
                  </div>

                  <div className="form-group sap-theme">
                    <label>Icono</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                      placeholder="📦"
                      className="icon-input sap-theme"
                    />
                  </div>
                </div>

                <div className="form-group sap-theme">
                  <label>Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe el tipo de productos que incluye esta categoría"
                    rows="2"
                  />
                </div>

                <div className="form-group sap-theme">
                  <label>Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                    className="color-input sap-theme"
                  />
                </div>
              </div>

              {/* Unidades disponibles */}
              <div className="form-section sap-theme">
                <h4>Unidades de Medida</h4>
                <div className="units-grid sap-theme">
                  {AVAILABLE_UNITS.map((unit) => (
                    <label key={unit} className="checkbox-label sap-theme">
                      <input
                        type="checkbox"
                        checked={formData.units.includes(unit)}
                        onChange={() => handleUnitToggle(unit)}
                      />
                      <span>{unit}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Campos disponibles */}
              <div className="form-section sap-theme">
                <h4>Campos Específicos</h4>
                <p className="section-description sap-theme">
                  Selecciona los campos que serán relevantes para esta categoría
                </p>
                <div className="fields-grid sap-theme">
                  {AVAILABLE_FIELDS.map((field) => (
                    <label key={field.key} className="checkbox-label sap-theme">
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
              <div className="form-section sap-theme">
                <h4>Vista Previa</h4>
                <div
                  className="category-preview sap-theme"
                  style={{ '--category-color': formData.color }}
                >
                  <div className="category-header sap-theme">
                    <div className="category-icon sap-theme" style={{ color: formData.color }}>
                      {formData.icon}
                    </div>
                    <div className="category-info sap-theme">
                      <h4>{formData.name || 'Nombre de la categoría'}</h4>
                      <p>{formData.description || 'Descripción de la categoría'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions sap-theme">
                <button
                  type="button"
                  className="btn-secondary sap-theme"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary sap-theme"
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

export default ProductCategoriesManager;
