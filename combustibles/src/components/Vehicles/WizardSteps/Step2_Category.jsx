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

  const getCategoryColor = (category) => {
    const name = category.name?.toLowerCase() || '';
    if (name.includes('tractor')) return 'category-agriculture';
    if (name.includes('camión') || name.includes('camion') || name.includes('volqueta'))
      return 'category-transport';
    if (
      name.includes('excavadora') ||
      name.includes('bulldozer') ||
      name.includes('retroexcavadora')
    )
      return 'category-construction';
    if (name.includes('motoniveladora')) return 'category-road';
    if (name.includes('compresor') || name.includes('generador')) return 'category-equipment';
    return 'category-general';
  };

  return (
    <div className={`wizard-step step-category ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout sap-theme">
        {/* Pregunta principal */}
        <div className="typeform-question sap-theme">
          <h2>
            🏷️ ¿Qué tipo de vehículo es{' '}
            <span className="highlight sap-theme">{formData.name || formData.vehicleId}</span>?
          </h2>
          <p>Selecciona la categoría que mejor describa este vehículo</p>
        </div>

        {/* Grid de categorías */}
        <div className="typeform-options category-grid sap-theme">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`typeform-option category-option ${getCategoryColor(category)} ${
                formData.category === category.id ? 'selected' : ''
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className="category-header sap-theme">
                <span className="category-icon sap-theme">{getCategoryIcon(category)}</span>
                <span className="category-number sap-theme">{index + 1}</span>
              </div>

              <div className="category-content sap-theme">
                <h3 className="category-title sap-theme">{category.name}</h3>
                <p className="category-description sap-theme">
                  {category.description || 'Categoría personalizada'}
                </p>

                {/* Mostrar campos específicos de la categoría */}
                {category.fields && category.fields.length > 0 && (
                  <div className="category-fields sap-theme">
                    <span className="fields-label sap-theme">Incluye:</span>
                    <div className="fields-list sap-theme">
                      {category.fields.slice(0, 3).map((field) => (
                        <span key={field.key} className="field-tag sap-theme">
                          {field.icon} {field.label}
                        </span>
                      ))}
                      {category.fields.length > 3 && (
                        <span className="field-tag more sap-theme">
                          +{category.fields.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {formData.category === category.id && (
                <div className="selection-indicator sap-theme">
                  <span className="checkmark sap-theme">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {errors.category && (
          <div className="input-error-centered sap-theme">
            <span className="error-icon sap-theme">⚠️</span>
            {errors.category}
          </div>
        )}

        {/* Información adicional */}
        {categories.length === 0 && (
          <div className="empty-state sap-theme">
            <div className="empty-icon sap-theme">📝</div>
            <h3>No hay categorías disponibles</h3>
            <p>Necesitas crear al menos una categoría de vehículo antes de continuar.</p>
            <button
              className="wizard-btn wizard-btn-secondary sap-theme"
              onClick={handleManageCategories}
            >
              🏷️ Ir a Gestión de Categorías
            </button>
          </div>
        )}

        {/* Botón para gestionar categorías cuando hay categorías disponibles */}
        {categories.length > 0 && (
          <div className="manage-categories-section sap-theme">
            <button
              className="wizard-btn wizard-btn-outline sap-theme"
              onClick={handleManageCategories}
            >
              🏷️ Ir a Gestión de Categorías
            </button>
            <p className="manage-hint sap-theme">
              ¿Necesitas crear una nueva categoría? Ve a la pestaña Categorías
            </p>
          </div>
        )}

        {/* Preview de la selección */}
        {formData.category && (
          <div className="step-preview sap-theme">
            <div className="preview-card sap-theme">
              <h4>📋 Categoría seleccionada</h4>
              {(() => {
                const selectedCategory = categories.find((c) => c.id === formData.category);
                return selectedCategory ? (
                  <div className="selected-category-preview sap-theme">
                    <div className="preview-header sap-theme">
                      <span className="preview-icon sap-theme">
                        {getCategoryIcon(selectedCategory)}
                      </span>
                      <span className="preview-name sap-theme">{selectedCategory.name}</span>
                    </div>
                    <p className="preview-description sap-theme">
                      {selectedCategory.description || 'Categoría personalizada'}
                    </p>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        )}

        {/* Hint para navegación */}
        <div className="navigation-hint sap-theme">
          💡 Tip: Puedes usar las teclas 1-{Math.min(9, categories.length)} para seleccionar
          rápidamente
        </div>
      </div>
    </div>
  );
};

export default Step2_Category;
