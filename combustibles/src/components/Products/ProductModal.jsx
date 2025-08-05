/**
 * ProductModal - Modal para crear, editar y ver productos
 * Refactorizado usando BaseModal system + useFormData hook
 */
import React, { useState, useMemo } from 'react';
import BaseModal from '../shared/BaseModal';
import ModalHeader from '../shared/ModalHeader';
import ModalFooter from '../shared/ModalFooter';
import { useFormData } from '../../hooks/useFormData';
import { PRODUCT_CATEGORIES } from '../../constants/productTypes';

const ProductModal = ({ 
  isOpen, 
  onClose, 
  product, 
  mode = 'create',
  onSave,
  userRole 
}) => {
  const [loading, setLoading] = useState(false);

  // Datos iniciales del formulario
  const initialData = useMemo(() => {
    if (product && (mode === 'edit' || mode === 'view')) {
      return {
        name: product.name || '',
        displayName: product.displayName || '',
        category: product.category || PRODUCT_CATEGORIES.COMBUSTIBLE,
        unit: product.unit || 'gal',
        defaultPrice: product.defaultPrice || 0,
        color: product.color || '#FF6B35',
        icon: product.icon || '🛢️',
        description: product.description || '',
        isActive: product.isActive !== undefined ? product.isActive : true,
        currentStock: product.currentStock || 0,
        minThreshold: product.minThreshold || 10,
        maxCapacity: product.maxCapacity || 1000
      };
    }
    return {
      name: '',
      displayName: '',
      category: PRODUCT_CATEGORIES.COMBUSTIBLE,
      unit: 'gal',
      defaultPrice: 0,
      color: '#FF6B35',
      icon: '🛢️',
      description: '',
      isActive: true,
      currentStock: 0,
      minThreshold: 10,
      maxCapacity: 1000
    };
  }, [product, mode]);

  // Reglas de validación
  const validationRules = useMemo(() => ({
    name: {
      required: 'El nombre es requerido'
    },
    displayName: {
      required: 'El nombre de visualización es requerido'
    },
    category: {
      required: 'La categoría es requerida'
    },
    unit: {
      required: 'La unidad es requerida'
    },
    defaultPrice: {
      min: 0,
      minMessage: 'El precio debe ser mayor o igual a 0'
    },
    currentStock: {
      min: 0,
      minMessage: 'El stock debe ser mayor o igual a 0'
    },
    minThreshold: {
      min: 0,
      minMessage: 'El umbral mínimo debe ser mayor o igual a 0',
      validate: (value, formData) => {
        if (value >= formData.maxCapacity) {
          return 'El umbral mínimo debe ser menor que la capacidad máxima';
        }
        return null;
      }
    },
    maxCapacity: {
      min: 1,
      minMessage: 'La capacidad máxima debe ser mayor a 0'
    }
  }), []);

  // Hook de formulario
  const { 
    formData, 
    errors, 
    handleInputChange, 
    updateValue,
    validateForm, 
    resetForm 
  } = useFormData(initialData, validationRules);

  // Opciones de configuración
  const unitOptions = [
    { value: 'gal', label: 'Galones (gal)' },
    { value: 'L', label: 'Litros (L)' },
    { value: 'kg', label: 'Kilogramos (kg)' },
    { value: 'und', label: 'Unidades (und)' }
  ];

  const iconOptions = {
    [PRODUCT_CATEGORIES.COMBUSTIBLE]: ['🛢️', '🚛', '🚗', '⛽', '🌿'],
    [PRODUCT_CATEGORIES.ACEITE]: ['🛢️', '⚙️', '🔧', '🚜', '🏭'],
    [PRODUCT_CATEGORIES.LUBRICANTE]: ['🟥', '🟡', '🔵', '⚫', '🟤'],
    [PRODUCT_CATEGORIES.FLUIDO]: ['🛑', '💧', '🔴', '🟢', '🔵']
  };

  const colorOptions = [
    '#FF6B35', '#4CAF50', '#2196F3', '#FF9800', '#F44336',
    '#9C27B0', '#E91E63', '#795548', '#607D8B', '#3F51B5'
  ];

  // Funciones de manejo
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave({
        ...formData,
        defaultPrice: parseFloat(formData.defaultPrice),
        currentStock: parseFloat(formData.currentStock),
        minThreshold: parseFloat(formData.minThreshold),
        maxCapacity: parseFloat(formData.maxCapacity)
      });
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      // Los errores los maneja el componente padre
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm(initialData);
    onClose();
  };

  // Permisos
  const canEdit = ['admin', 'supervisor'].includes(userRole) && mode !== 'view';

  // Título del modal
  const getTitle = () => {
    if (mode === 'create') return '➕ Crear Producto';
    if (mode === 'edit') return '✏️ Editar Producto';
    return '👁️ Ver Producto';
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size="lg"
      className="product-modal"
    >
      <ModalHeader 
        title={getTitle()} 
        onClose={handleClose} 
      />

      <form onSubmit={handleSubmit} className="modal-body">
        {/* Vista Previa del Producto */}
        <div className="product-preview">
          <div className="preview-card">
            <div className="preview-icon" style={{ color: formData.color }}>
              {formData.icon}
            </div>
            <div className="preview-info">
              <h3>{formData.displayName || 'Nombre del producto'}</h3>
              <p className="preview-category">{formData.category}</p>
              <p className="preview-description">{formData.description}</p>
              <div className="preview-price">
                ${new Intl.NumberFormat('es-CO').format(formData.defaultPrice)} / {formData.unit}
              </div>
            </div>
          </div>
        </div>

        <div className="form-grid">
          {/* Información Básica */}
          <div className="form-section">
            <h3>📝 Información Básica</h3>
            
            <div className="form-group">
              <label>Nombre Interno *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!canEdit}
                placeholder="Ej: ACPM, GASOLINA"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Nombre de Visualización *</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                disabled={!canEdit}
                placeholder="Ej: ACPM 🚛, Gasolina 🚗"
              />
              {errors.displayName && <span className="error">{errors.displayName}</span>}
            </div>

            <div className="form-group">
              <label>Categoría *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={!canEdit}
              >
                {Object.values(PRODUCT_CATEGORIES).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <span className="error">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!canEdit}
                placeholder="Descripción del producto..."
                rows="3"
              />
            </div>
          </div>

          {/* Configuración */}
          <div className="form-section">
            <h3>⚙️ Configuración</h3>
            
            <div className="form-group">
              <label>Unidad de Medida *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                disabled={!canEdit}
              >
                {unitOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.unit && <span className="error">{errors.unit}</span>}
            </div>

            <div className="form-group">
              <label>Precio por Defecto</label>
              <input
                type="number"
                name="defaultPrice"
                value={formData.defaultPrice}
                onChange={handleInputChange}
                disabled={!canEdit}
                min="0"
                step="0.01"
              />
              {errors.defaultPrice && <span className="error">{errors.defaultPrice}</span>}
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  disabled={!canEdit}
                />
                Producto Activo
              </label>
            </div>
          </div>

          {/* Stock y Umbrales */}
          <div className="form-section">
            <h3>📊 Stock y Umbrales</h3>
            
            <div className="form-group">
              <label>Stock Actual</label>
              <input
                type="number"
                name="currentStock"
                value={formData.currentStock}
                onChange={handleInputChange}
                disabled={!canEdit}
                min="0"
                step="0.01"
              />
              {errors.currentStock && <span className="error">{errors.currentStock}</span>}
            </div>

            <div className="form-group">
              <label>Umbral Mínimo</label>
              <input
                type="number"
                name="minThreshold"
                value={formData.minThreshold}
                onChange={handleInputChange}
                disabled={!canEdit}
                min="0"
                step="0.01"
              />
              {errors.minThreshold && <span className="error">{errors.minThreshold}</span>}
            </div>

            <div className="form-group">
              <label>Capacidad Máxima</label>
              <input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleInputChange}
                disabled={!canEdit}
                min="1"
                step="0.01"
              />
              {errors.maxCapacity && <span className="error">{errors.maxCapacity}</span>}
            </div>
          </div>

          {/* Apariencia */}
          <div className="form-section">
            <h3>🎨 Apariencia</h3>
            
            <div className="form-group">
              <label>Icono</label>
              <div className="icon-selector">
                {iconOptions[formData.category]?.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                    onClick={() => updateValue('icon', icon)}
                    disabled={!canEdit}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Color</label>
              <div className="color-selector">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateValue('color', color)}
                    disabled={!canEdit}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>

      <ModalFooter 
        primaryAction={canEdit ? {
          label: 'Guardar',
          onClick: handleSubmit,
          disabled: Object.keys(errors).some(key => errors[key]),
          loadingLabel: 'Guardando...'
        } : undefined}
        secondaryAction={{
          label: mode === 'view' ? 'Cerrar' : 'Cancelar',
          onClick: handleClose
        }}
        isLoading={loading}
      />
    </BaseModal>
  );
};

export default ProductModal;