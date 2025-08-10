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
  getCategoryStats,
} from '../../services/vehicleCategoriesService';
import {
  resetVehicleCategories,
  hasCustomCategories,
} from '../../services/resetVehicleCategoriesService';
import {
  uploadCategoryIcon,
  deleteCategoryIcon,
  generateImagePreview,
  validateImageFile,
  isCustomIcon,
  renderCategoryIcon,
} from '../../services/iconUploadService.jsx';
import {
  DEFAULT_VEHICLE_CATEGORIES,
  AVAILABLE_FIELDS,
  FUEL_TYPES,
  generateCategoryId,
} from '../../data/vehicleCategories';
import './VehicleCategoriesManager.css';

const VehicleCategoriesManager = ({ onClose, onCategoryCreated, embedded = false }) => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [hasCustom, setHasCustom] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🚗',
    color: '#2E86AB',
    fuelTypes: [],
    fields: [],
    uniqueCode: '',
  });

  // Estado para manejo de iconos personalizados
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState('');
  const [iconUploading, setIconUploading] = useState(false);
  const [iconError, setIconError] = useState('');

  // Estado para el formulario tipo Typeform
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(4);

  // Pasos del formulario
  const FORM_STEPS = {
    1: { title: '¿Cuál es el nombre de la categoría?', field: 'name' },
    2: { title: '¿Qué tipos de combustible utiliza?', field: 'fuelTypes' },
    3: { title: '¿Qué campos específicos necesita?', field: 'fields' },
    4: { title: 'Personalización y vista previa', field: 'preview' },
  };

  useEffect(() => {
    loadCategoriesAndStats();
    checkCustomCategories();

    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToCategories((updatedCategories) => {
      setCategories(updatedCategories);
      loadStats();
      checkCustomCategories();
    });

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  const loadCategoriesAndStats = async () => {
    try {
      setLoading(true);
      const [categoriesData, statsData] = await Promise.all([
        getAllVehicleCategories(),
        getCategoryStats(),
      ]);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (error) {
      console.error('❌ Error cargando categorías:', error);
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

  const checkCustomCategories = async () => {
    try {
      const hasCustomCats = await hasCustomCategories();
      setHasCustom(hasCustomCats);
    } catch (error) {
      console.error('❌ Error verificando categorías personalizadas:', error);
    }
  };

  // Función para generar código único automáticamente
  const generateUniqueCode = (name) => {
    if (!name) return '';

    const baseCode = name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 6);

    const randomSuffix = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `${baseCode}${randomSuffix}`;
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: '🚗',
      color: '#2E86AB',
      fuelTypes: [],
      fields: [],
      uniqueCode: '',
    });
    // Limpiar estado de iconos
    setIconFile(null);
    setIconPreview('');
    setIconError('');
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      icon: category.icon || '🚗',
      color: category.color || '#2E86AB',
      fuelTypes: category.fuelTypes || [],
      fields: category.fields || [],
      uniqueCode: category.uniqueCode || generateUniqueCode(category.name),
    });

    // Limpiar estado de iconos al editar
    setIconFile(null);
    setIconPreview('');
    setIconError('');
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleDeleteCategory = async (category) => {
    console.log('🗑️ Intentando eliminar categoría:', category);

    const confirmed = window.confirm(
      `¿Está seguro de eliminar la categoría "${category.name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) {
      console.log('❌ Eliminación cancelada por el usuario');
      return;
    }

    try {
      setSaving(true);
      console.log('🔄 Eliminando categoría del Firestore...');

      // Si tiene un icono personalizado, eliminarlo también
      if (category.icon && isCustomIcon(category.icon)) {
        console.log('🖼️ Eliminando icono personalizado:', category.icon);
        try {
          await deleteCategoryIcon(category.icon);
          console.log('✅ Icono eliminado exitosamente');
        } catch (iconError) {
          console.warn('⚠️ Error eliminando icono, continuando con categoría:', iconError);
        }
      }

      await deleteCategory(category.id);
      console.log('✅ Categoría eliminada exitosamente');
      setError('');
      // La lista se actualizará automáticamente via suscripción
    } catch (error) {
      console.error('❌ Error eliminando categoría:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.name.trim()) {
      setError('El nombre de la categoría es requerido');
      return;
    }

    if (!formData.uniqueCode.trim()) {
      setError('El código único es requerido');
      return;
    }

    if (formData.fuelTypes.length === 0) {
      setError('Debe seleccionar al menos un tipo de combustible');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Subir icono personalizado si existe
      let iconURL = formData.icon;
      if (iconFile) {
        try {
          iconURL = await handleIconUpload();
        } catch (iconError) {
          // Si falla la subida del icono, usar emoji por defecto
          console.warn('Error subiendo icono, usando emoji por defecto:', iconError);
          iconURL = '🚗';
        }
      }

      const categoryData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        uniqueCode: formData.uniqueCode.trim(),
        icon: iconURL,
        createdAt: selectedCategory ? selectedCategory.createdAt : new Date(),
        updatedAt: new Date(),
      };

      if (selectedCategory) {
        // Si había un icono personalizado anterior y se cambió, eliminar el anterior
        if (
          selectedCategory.icon &&
          isCustomIcon(selectedCategory.icon) &&
          selectedCategory.icon !== iconURL
        ) {
          try {
            await deleteCategoryIcon(selectedCategory.icon);
          } catch (deleteError) {
            console.warn('Error eliminando icono anterior:', deleteError);
          }
        }

        // Actualizar categoría existente
        await updateCategory(selectedCategory.id, categoryData);
      } else {
        // Crear nueva categoría
        categoryData.id = generateCategoryId(categoryData.name, categories);
        const newCategory = await createCategory(categoryData);
        onCategoryCreated && onCategoryCreated(newCategory);
      }

      // Limpiar estado de iconos
      setIconFile(null);
      setIconPreview('');
      setIconError('');
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

  const handleFuelTypeToggle = (fuelType) => {
    setFormData((prev) => ({
      ...prev,
      fuelTypes: prev.fuelTypes.includes(fuelType)
        ? prev.fuelTypes.filter((f) => f !== fuelType)
        : [...prev.fuelTypes, fuelType],
    }));
  };

  const handleNameChange = (name) => {
    setFormData((prev) => ({
      ...prev,
      name: name,
      uniqueCode: generateUniqueCode(name),
    }));
  };

  // Funciones para manejo de iconos personalizados
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Limpiar errores previos
    setIconError('');

    // Validar archivo
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setIconError(validation.error);
      return;
    }

    try {
      // Generar preview
      const preview = await generateImagePreview(file);
      setIconFile(file);
      setIconPreview(preview);
      setIconError('');
    } catch (error) {
      setIconError('Error al procesar la imagen');
      console.error('Error generando preview:', error);
    }
  };

  const handleIconUpload = async () => {
    if (!iconFile) return null;

    setIconUploading(true);
    try {
      const downloadURL = await uploadCategoryIcon(
        iconFile,
        formData.uniqueCode || 'temp',
        (progress) => {
          // Callback de progreso opcional
          console.log('Upload progress:', progress);
        }
      );

      setIconUploading(false);
      return downloadURL;
    } catch (error) {
      setIconUploading(false);
      setIconError(`Error subiendo icono: ${error.message}`);
      throw error;
    }
  };

  const clearCustomIcon = () => {
    setIconFile(null);
    setIconPreview('');
    setIconError('');
    setFormData((prev) => ({ ...prev, icon: '🚗' }));
  };

  // Navegación entre pasos
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleStepSubmit = (e) => {
    e.preventDefault();

    if (currentStep === totalSteps) {
      // Último paso - guardar categoría
      handleSubmit(e);
    } else {
      // Siguiente paso
      handleNextStep();
    }
  };

  // Validación por paso
  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.name.trim().length >= 2;
      case 2:
        return formData.fuelTypes.length > 0;
      case 3:
        return true; // Los campos son opcionales
      case 4:
        return formData.uniqueCode.trim().length >= 3 && !iconUploading;
      default:
        return false;
    }
  };

  // Renderizar paso específico
  const renderStep = (step) => {
    switch (step) {
      case 1:
        return (
          <div className="typeform-step">
            <div className="step-header">
              <span className="step-number">{step}</span>
              <h2>{FORM_STEPS[step].title}</h2>
              <p>Ingresa un nombre descriptivo para esta categoría de vehículos</p>
            </div>
            <div className="step-content">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Maquinaria Pesada, Vehículos Livianos..."
                className="typeform-input"
                autoFocus
              />
              {formData.name && (
                <div className="auto-generated">
                  <small>
                    Código generado: <code>{formData.uniqueCode}</code>
                  </small>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="typeform-step">
            <div className="step-header">
              <span className="step-number">{step}</span>
              <h2>{FORM_STEPS[step].title}</h2>
              <p>Selecciona los tipos de combustible compatibles con esta categoría</p>
            </div>
            <div className="step-content">
              <div className="fuel-options">
                {Object.values(FUEL_TYPES).map((fuelType) => (
                  <label key={fuelType} className="fuel-option">
                    <input
                      type="checkbox"
                      checked={formData.fuelTypes.includes(fuelType)}
                      onChange={() => handleFuelTypeToggle(fuelType)}
                    />
                    <span className="fuel-card">
                      <span className="fuel-icon">
                        {fuelType === 'Diesel' && '🛢️'}
                        {fuelType === 'Gasolina' && '⛽'}
                        {fuelType === 'Mixto' && '🔄'}
                      </span>
                      <span className="fuel-name">{fuelType}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="typeform-step">
            <div className="step-header">
              <span className="step-number">{step}</span>
              <h2>{FORM_STEPS[step].title}</h2>
              <p>Selecciona los campos que serán requeridos para los vehículos de esta categoría</p>
            </div>
            <div className="step-content">
              <div className="field-options">
                {AVAILABLE_FIELDS.map((field) => (
                  <label key={field.key} className="field-option">
                    <input
                      type="checkbox"
                      checked={formData.fields.includes(field.key)}
                      onChange={() => handleFieldToggle(field.key)}
                    />
                    <span className="field-card">
                      <span className="field-icon">{field.icon}</span>
                      <div className="field-info">
                        <strong>{field.label}</strong>
                        <small>{field.description}</small>
                        {field.required && <span className="required-badge">Requerido</span>}
                      </div>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="typeform-step">
            <div className="step-header">
              <span className="step-number">{step}</span>
              <h2>{FORM_STEPS[step].title}</h2>
              <p>Personaliza el aspecto y revisa la información antes de crear</p>
            </div>
            <div className="step-content">
              <div className="customization-section">
                <div className="custom-fields">
                  <div className="field-group">
                    <label>Descripción (opcional)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="Describe el tipo de vehículos que incluye esta categoría"
                      className="typeform-textarea"
                    />
                  </div>

                  <div className="field-row">
                    <div className="field-group">
                      <label>Icono</label>
                      <div className="icon-selection">
                        <input
                          type="text"
                          value={iconFile ? '' : formData.icon}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, icon: e.target.value }))
                          }
                          placeholder="🚗"
                          className="typeform-input-small"
                          disabled={iconFile || iconUploading}
                        />
                        <span className="icon-separator">o</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          style={{ display: 'none' }}
                          id="icon-upload"
                          disabled={iconUploading}
                        />
                        <label
                          htmlFor="icon-upload"
                          className={`upload-button ${iconUploading ? 'uploading' : ''}`}
                          title="Subir imagen personalizada"
                        >
                          {iconUploading ? '⏳' : '📁'} Subir imagen
                        </label>
                      </div>

                      {iconError && <div className="icon-error">⚠️ {iconError}</div>}

                      {iconPreview && (
                        <div className="icon-preview-section">
                          <img
                            src={iconPreview}
                            alt="Preview del icono"
                            className="icon-preview-img"
                            width={32}
                            height={32}
                            loading="lazy"
                            decoding="async"
                          />
                          <button
                            type="button"
                            className="clear-icon-btn"
                            onClick={clearCustomIcon}
                            disabled={iconUploading}
                          >
                            ✕ Limpiar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="field-group">
                      <label>Color</label>
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, color: e.target.value }))
                        }
                        className="typeform-color"
                      />
                    </div>
                  </div>

                  <div className="field-group">
                    <label>Código único</label>
                    <input
                      type="text"
                      value={formData.uniqueCode}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, uniqueCode: e.target.value }))
                      }
                      placeholder="CODIGO123"
                      className="typeform-input unique-code"
                    />
                  </div>
                </div>

                <div className="preview-section">
                  <h3>Vista previa</h3>
                  <div
                    className="category-preview-card"
                    style={{ '--category-color': formData.color }}
                  >
                    <div className="preview-header">
                      <span className="preview-icon" style={{ color: formData.color }}>
                        {iconPreview ? (
                          <img
                            src={iconPreview}
                            alt="Preview del icono"
                            className="preview-custom-icon"
                            width={24}
                            height={24}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          formData.icon
                        )}
                      </span>
                      <div className="preview-info">
                        <h4>{formData.name || 'Nombre de la categoría'}</h4>
                        <p>{formData.description || 'Sin descripción'}</p>
                      </div>
                    </div>
                    <div className="preview-details">
                      <div className="preview-item">
                        <strong>Código:</strong> {formData.uniqueCode || 'Sin código'}
                      </div>
                      <div className="preview-item">
                        <strong>Combustibles:</strong> {formData.fuelTypes.join(', ') || 'Ninguno'}
                      </div>
                      <div className="preview-item">
                        <strong>Campos:</strong> {formData.fields.length} seleccionados
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleResetCategories = async () => {
    try {
      setSaving(true);
      setError('');

      const result = await resetVehicleCategories();

      if (result.success) {
        setShowResetConfirm(false);
        setError('');
        alert(`✅ ${result.message}`);
        // Los datos se actualizarán automáticamente via suscripción
      } else {
        setError('Error al resetear categorías');
      }
    } catch (error) {
      console.error('Error reseteando categorías:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const getStatsForCategory = (categoryId) => {
    return stats.find((stat) => stat.id === categoryId) || { vehicleCount: 0, activeVehicles: 0 };
  };

  if (loading) {
    const loadingContent = (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando categorías...</p>
      </div>
    );

    return embedded ? loadingContent : <div className="categories-manager">{loadingContent}</div>;
  }

  const mainContent = (
    <>
      <div className="categories-header">
        <h3>📋 Gestión de Categorías</h3>
        <div className="header-actions">
          <button
            className="btn-primary"
            onClick={handleCreateCategory}
            disabled={saving}
            style={{
              pointerEvents: saving ? 'none' : 'auto',
              opacity: saving ? 0.6 : 1,
            }}
          >
            ➕ Nueva Categoría
          </button>

          {hasCustom && (
            <button
              className="btn-warning"
              onClick={() => setShowResetConfirm(true)}
              disabled={saving}
            >
              🗑️ Eliminar Todas
            </button>
          )}

          {!embedded && onClose && (
            <button className="btn-secondary" onClick={onClose}>
              ✕ Cerrar
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      <div className="categories-grid">
        {categories.map((category) => {
          const categoryStats = getStatsForCategory(category.id);

          return (
            <div
              key={category.id}
              className="category-card custom"
              style={{ '--category-color': category.color }}
            >
              <div className="category-header">
                <div className="category-icon" style={{ color: category.color }}>
                  {renderCategoryIcon(category.icon, {
                    className: 'category-icon-display',
                    style: { color: category.color },
                  })}
                </div>
                <div className="category-info">
                  <h4>{category.name}</h4>
                  <p>{category.description}</p>
                </div>
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
                    {(category.fuelTypes || []).map((fuel) => (
                      <span key={fuel} className="fuel-tag">
                        {fuel}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="fields">
                  <strong>Campos:</strong>
                  <div className="fields-list">
                    {(category.fields || []).slice(0, 3).map((fieldKey) => {
                      const field = AVAILABLE_FIELDS.find((f) => f.key === fieldKey);
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
                  disabled={saving}
                  title="Editar categoría"
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteCategory(category)}
                  disabled={saving || categoryStats.vehicleCount > 0}
                  title={
                    categoryStats.vehicleCount > 0
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
    </>
  );

  return embedded ? (
    <>
      {mainContent}

      {/* Modal de creación/edición - Estilo Typeform */}
      {showModal && (
        <div className="typeform-overlay">
          <div className="typeform-modal">
            <div className="typeform-header">
              <button className="typeform-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
              <div className="typeform-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
                <span className="progress-text">
                  {currentStep} de {totalSteps}
                </span>
              </div>
            </div>

            <div className="typeform-body">
              <form onSubmit={handleStepSubmit} className="typeform-form">
                {renderStep(currentStep)}

                <div className="typeform-actions">
                  {currentStep > 1 && (
                    <button type="button" className="btn-back" onClick={handlePrevStep}>
                      ← Anterior
                    </button>
                  )}

                  <button
                    type="submit"
                    className="btn-next"
                    disabled={!isStepValid(currentStep) || saving}
                  >
                    {saving
                      ? 'Guardando...'
                      : iconUploading
                        ? 'Subiendo icono...'
                        : currentStep === totalSteps
                          ? 'Crear Categoría'
                          : 'Siguiente →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para reset */}
      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🗑️ Confirmar Eliminación</h3>
              <button onClick={() => setShowResetConfirm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>
                <strong>¿Estás seguro de que deseas eliminar todas las categorías?</strong>
              </p>
              <p>Esta acción eliminará todas las categorías de vehículos de la aplicación.</p>
              <p className="warning">⚠️ Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowResetConfirm(false)}
                disabled={saving}
              >
                Cancelar
              </button>
              <button className="btn-danger" onClick={handleResetCategories} disabled={saving}>
                {saving ? 'Eliminando...' : 'Eliminar Todas'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <div className="categories-manager">
      {mainContent}

      {/* Modal de creación/edición - Estilo Typeform */}
      {showModal && (
        <div className="typeform-overlay">
          <div className="typeform-modal">
            <div className="typeform-header">
              <button className="typeform-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
              <div className="typeform-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
                <span className="progress-text">
                  {currentStep} de {totalSteps}
                </span>
              </div>
            </div>

            <div className="typeform-body">
              <form onSubmit={handleStepSubmit} className="typeform-form">
                {renderStep(currentStep)}

                <div className="typeform-actions">
                  {currentStep > 1 && (
                    <button type="button" className="btn-back" onClick={handlePrevStep}>
                      ← Anterior
                    </button>
                  )}

                  <button
                    type="submit"
                    className="btn-next"
                    disabled={!isStepValid(currentStep) || saving}
                  >
                    {saving
                      ? 'Guardando...'
                      : iconUploading
                        ? 'Subiendo icono...'
                        : currentStep === totalSteps
                          ? 'Crear Categoría'
                          : 'Siguiente →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para reset */}
      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🗑️ Confirmar Eliminación</h3>
              <button onClick={() => setShowResetConfirm(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>
                <strong>¿Estás seguro de que deseas eliminar todas las categorías?</strong>
              </p>
              <p>Esta acción eliminará todas las categorías de vehículos de la aplicación.</p>
              <p className="warning">⚠️ Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowResetConfirm(false)}
                disabled={saving}
              >
                Cancelar
              </button>
              <button className="btn-danger" onClick={handleResetCategories} disabled={saving}>
                {saving ? 'Eliminando...' : 'Eliminar Todas'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleCategoriesManager;
