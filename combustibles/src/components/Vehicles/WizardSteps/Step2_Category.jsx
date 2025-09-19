/**
 * Step2_Category - Segundo paso: Selección de categoría del vehículo
 * Estilo conversacional con opciones visuales
 */

import React, { useEffect, useCallback } from 'react';
import './VehicleWizardSteps.css';

const Step2_Category = ({ formData, updateFormData, errors, isActive, extraData }) => {
  const { categories = [], onRequestCategoryCreation } = extraData || {};

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      // Números 1-9 para seleccionar categorías
      const num = parseInt(e.key);
      if (num >= 1 && num <= Math.min(9, categories.length)) {
        const selectedCategory = categories[num - 1];
        updateFormData('category', selectedCategory.id);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive, categories, updateFormData]);

  const handleCategorySelect = useCallback(
    (categoryId) => {
      updateFormData('category', categoryId);
    },
    [updateFormData]
  );

  // Manejar apertura del wizard de categorías
  const handleManageCategories = useCallback(() => {
    if (onRequestCategoryCreation) {
      onRequestCategoryCreation();
    }
  }, [onRequestCategoryCreation]);

  // Iconos por defecto según el tipo de categoría
  const getCategoryIcon = (category) => {
    const name = category.name?.toLowerCase() || '';
    if (name.includes('tractor')) return '🚜';
    if (name.includes('camión') || name.includes('camion')) return '🚛';
    if (name.includes('excavadora')) return '🚧';
    if (name.includes('motoniveladora')) return '🛤️';
    if (name.includes('bulldozer')) return '🏗️';
    if (name.includes('retroexcavadora')) return '⚒️';
    if (name.includes('volqueta')) return '🚚';
    if (name.includes('montacarga')) return '🏋️';
    if (name.includes('compresor')) return '💨';
    if (name.includes('generador')) return '⚡';
    return '🚗'; // Icono por defecto
  };

  const _getCategoryColor = (category) => {
    const colorMap = {
      'Equipos de Construcción': '#ff6b35',
      'Vehículos de Transporte': '#4285f4',
      'Maquinaria Especializada': '#34a853',
      'Equipos de Apoyo': '#fbbc04',
      default: '#6b7280',
    };
    return colorMap[category] || colorMap.default;
  };

  return (
    <div className={`wizard-step step-category ${isActive ? 'active' : ''}`}>
      <div className="apple-card">
        {/* Pregunta principal */}
        <div className="apple-card">
          <h2>
            🏷️ ¿Qué tipo de vehículo es{' '}
            <span className="apple-status-badge">{formData.name || formData.vehicleId}</span>?
          </h2>
          <p>Selecciona la categoría que mejor describa este vehículo</p>
        </div>

        {/* Grid de categorías */}
        <div className="apple-stats-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`apple-card ${
                formData.category === category.id ? 'selected' : ''
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className="apple-stat-card-icon">{getCategoryIcon(category)}</div>

              <div className="apple-card">
                <div className="apple-form-label">{category.name}</div>
                <div className="apple-form-input">
                  {category.description || 'Categoría personalizada'}
                </div>

                {/* Mostrar campos específicos de la categoría */}
                {category.fields && category.fields.length > 0 && (
                  <div className="apple-card">
                    <span className="apple-form-label">Incluye:</span>
                    <div className="apple-card">
                      {category.fields.slice(0, 3).map((field) => (
                        <span key={field.key} className="apple-status-badge">
                          {field.icon} {field.label}
                        </span>
                      ))}
                      {category.fields.length > 3 && (
                        <span className="apple-status-badge">
                          +{category.fields.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {formData.category === category.id && (
                <div className="apple-status-badge">
                  <span className="apple-status-badge">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {errors.category && (
          <div className="apple-form-error">
            <span className="apple-form-error">⚠️</span>
            {errors.category}
          </div>
        )}

        {/* Información adicional */}
        {categories.length === 0 && (
          <div className="apple-empty-state">
            <div className="apple-empty-state">📝</div>
            <h3>No hay categorías disponibles</h3>
            <p>Necesitas crear al menos una categoría de vehículo antes de continuar.</p>
            <button
              className="apple-button apple-button-secondary"
              onClick={handleManageCategories}
            >
              🏷️ Ir a Gestión de Categorías
            </button>
          </div>
        )}

        {/* Botón para gestionar categorías cuando hay categorías disponibles */}
        {categories.length > 0 && (
          <div className="apple-card">
            <button
              className="apple-button apple-button-tertiary"
              onClick={handleManageCategories}
            >
              🏷️ Ir a Gestión de Categorías
            </button>
            <p className="apple-form-label">
              ¿Necesitas crear una nueva categoría? Ve a la pestaña Categorías
            </p>
          </div>
        )}

        {/* Preview de la selección */}
        {formData.category && (
          <div className="apple-card">
            <div className="apple-card">
              <h4>📋 Categoría seleccionada</h4>
              {(() => {
                const selectedCategory = categories.find((c) => c.id === formData.category);
                return selectedCategory ? (
                  <div className="apple-card">
                    <div className="apple-card">
                      <span className="apple-stat-card-icon">
                        {getCategoryIcon(selectedCategory)}
                      </span>
                      <span className="apple-form-label">{selectedCategory.name}</span>
                    </div>
                    <p className="apple-form-input">
                      {selectedCategory.description || 'Categoría personalizada'}
                    </p>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        )}

        {/* Hint para navegación */}
        <div className="apple-status-badge">
          💡 Tip: Puedes usar las teclas 1-{Math.min(9, categories.length)} para seleccionar
          rápidamente
        </div>
      </div>
    </div>
  );
};

export default Step2_Category;
