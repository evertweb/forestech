/**
 * Step3_Fields - Tercer paso: Campos personalizados para la categoría
 * Selección de campos específicos que tendrán los vehículos de esta categoría
 */

import React, { useEffect, useCallback, useState } from 'react';
import '../WizardSteps/VehicleWizardSteps.css';

const Step3_Fields = ({ 
  formData, 
  updateFormData, 
  isActive,
  extraData 
}) => {
  const { availableFields = [] } = extraData || {};
  const [selectedFields, setSelectedFields] = useState(formData.fields || []);

  // Sincronizar con formData cuando cambie
  useEffect(() => {
    setSelectedFields(formData.fields || []);
  }, [formData.fields]);

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      // Números 1-9 para seleccionar/deseleccionar campos
      const num = parseInt(e.key);
      if (num >= 1 && num <= Math.min(9, availableFields.length)) {
        const field = availableFields[num - 1];
        handleFieldToggle(field);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive, availableFields, handleFieldToggle]);

  const handleFieldToggle = useCallback((field) => {
    const isSelected = selectedFields.some(f => f.key === field.key);
    let newFields;
    
    if (isSelected) {
      // Remover campo
      newFields = selectedFields.filter(f => f.key !== field.key);
    } else {
      // Agregar campo
      newFields = [...selectedFields, field];
    }
    
    setSelectedFields(newFields);
    updateFormData('fields', newFields);
  }, [selectedFields, updateFormData]);

  const getFieldCategory = (fieldKey) => {
    if (['plateNumber', 'enginePower', 'fuelCapacity'].includes(fieldKey)) {
      return 'basic';
    }
    if (['operatingWeight', 'loadCapacity', 'bucketCapacity'].includes(fieldKey)) {
      return 'capacity';
    }
    if (['implementType', 'flow', 'pressure', 'weight'].includes(fieldKey)) {
      return 'specialized';
    }
    return 'other';
  };

  const fieldCategories = {
    basic: {
      title: 'Campos Básicos',
      description: 'Información fundamental del vehículo',
      icon: '📋',
      color: 'category-basic'
    },
    capacity: {
      title: 'Capacidades',
      description: 'Pesos y capacidades de carga',
      icon: '⚖️',
      color: 'category-capacity'
    },
    specialized: {
      title: 'Especializados',
      description: 'Campos específicos por tipo',
      icon: '🔧',
      color: 'category-specialized'
    }
  };

  const groupedFields = availableFields.reduce((groups, field) => {
    const category = getFieldCategory(field.key);
    if (!groups[category]) groups[category] = [];
    groups[category].push(field);
    return groups;
  }, {});

  return (
    <div className={`wizard-step step-category-fields ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        
        {/* Pregunta principal */}
        <div className="typeform-question">
          <h2>🔧 ¡Excelente! Ahora personaliza los campos de <span className="highlight">{formData.name}</span></h2>
          <p>Selecciona qué información específica necesitarás para los vehículos de esta categoría</p>
        </div>

        {/* Campos agrupados por categoría */}
        {Object.entries(groupedFields).map(([categoryKey, fields]) => {
          const category = fieldCategories[categoryKey];
          if (!category || fields.length === 0) return null;

          return (
            <div key={categoryKey} className="fields-category-section">
              <div className="fields-category-header">
                <span className="category-icon">{category.icon}</span>
                <div className="category-info">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>
              </div>

              <div className={`typeform-options fields-grid ${category.color}`}>
                {fields.map((field, index) => {
                  const isSelected = selectedFields.some(f => f.key === field.key);
                  return (
                    <div
                      key={field.key}
                      className={`typeform-option field-option ${
                        isSelected ? 'selected' : ''
                      }`}
                      onClick={() => handleFieldToggle(field)}
                    >
                      <div className="option-header">
                        <span className="option-icon">{field.icon}</span>
                        <span className="option-number">{index + 1}</span>
                      </div>
                      <div className="option-content">
                        <h4 className="option-title">{field.label}</h4>
                        <p className="option-description">
                          Tipo: {field.type === 'number' ? 'Numérico' : 'Texto'}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="selection-indicator">
                          <span className="checkmark">✓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Campos seleccionados */}
        {selectedFields.length > 0 && (
          <div className="step-preview">
            <div className="preview-card">
              <h4>📋 Campos seleccionados ({selectedFields.length})</h4>
              <div className="selected-fields-list">
                {selectedFields.map((field) => (
                  <div key={field.key} className="selected-field-item">
                    <span className="field-icon">{field.icon}</span>
                    <span className="field-label">{field.label}</span>
                    <span className="field-type">
                      {field.type === 'number' ? '🔢' : '📝'}
                    </span>
                    <button 
                      className="remove-field-btn"
                      onClick={() => handleFieldToggle(field)}
                      title="Quitar campo"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Estado sin campos seleccionados */}
        {selectedFields.length === 0 && (
          <div className="empty-fields-state">
            <div className="empty-icon">📝</div>
            <h3>Sin campos personalizados</h3>
            <p>Los vehículos de esta categoría solo tendrán los campos básicos estándar.</p>
            <div className="basic-fields-info">
              <h4>Campos básicos incluidos por defecto:</h4>
              <ul>
                <li>📋 Nombre del vehículo</li>
                <li>🏭 Marca y modelo</li>
                <li>📅 Año de fabricación</li>
                <li>⛽ Tipo de combustible</li>
                <li>🚀 Estado operacional</li>
                <li>📍 Ubicación actual</li>
              </ul>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="info-section">
          <div className="info-card">
            <span className="info-icon">💡</span>
            <div className="info-content">
              <h4>¿Para qué sirven los campos personalizados?</h4>
              <ul>
                <li><strong>Información específica:</strong> Cada tipo de vehículo tiene necesidades únicas</li>
                <li><strong>Reportes detallados:</strong> Más datos permiten análisis más profundos</li>
                <li><strong>Gestión eficiente:</strong> Campos relevantes para cada categoría</li>
                <li><strong>Flexibilidad:</strong> Puedes agregar o quitar campos después</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hint para navegación */}
        <div className="navigation-hint">
          💡 Tip: Puedes usar números para seleccionar campos rápidamente. ¡No es obligatorio agregar campos!
        </div>

      </div>
    </div>
  );
};

export default Step3_Fields;
