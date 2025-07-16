/**
 * Step4_Summary - Cuarto paso: Resumen y confirmación de la categoría
 * Vista final con todos los datos antes de crear/editar la categoría
 */

import React, { useEffect, useState } from 'react';
import '../WizardSteps/VehicleWizardSteps.css';

const Step4_Summary = ({ 
  formData, 
  errors, 
  isActive,
  isLoading,
  extraData 
}) => {
  const { availableFields = [], fuelTypes = [] } = extraData || {};
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  // Navegación por teclado para vista JSON
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      if (e.key === 'j' || e.key === 'J') {
        setShowJsonPreview(!showJsonPreview);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive, showJsonPreview]);

  const getSummaryIcon = () => {
    return formData.icon || '🚗';
  };

  const getSummaryColor = () => {
    return formData.color || '#4A90E2';
  };

  const getFuelTypeNames = () => {
    if (!formData.fuelTypes || formData.fuelTypes.length === 0) {
      return 'No especificado';
    }
    return formData.fuelTypes
      .map(id => {
        const fuel = fuelTypes.find(f => f.id === id);
        return fuel ? fuel.name : id;
      })
      .join(', ');
  };

  const getFieldsCount = () => {
    const basicFields = 6; // Campos básicos estándar
    const customFields = formData.fields ? formData.fields.length : 0;
    return { basic: basicFields, custom: customFields, total: basicFields + customFields };
  };

  const fieldsCount = getFieldsCount();

  const summaryData = {
    'Información Básica': {
      icon: '📋',
      items: [
        { label: 'Nombre', value: formData.name || 'Sin especificar' },
        { label: 'Descripción', value: formData.description || 'Sin descripción' },
        { label: 'Icono', value: getSummaryIcon() },
        { label: 'Color', value: getSummaryColor() }
      ]
    },
    'Apariencia Visual': {
      icon: '🎨',
      items: [
        { 
          label: 'Vista previa', 
          value: (
            <div className="color-preview-container">
              <div 
                className="color-preview" 
                style={{ backgroundColor: getSummaryColor() }}
              >
                <span style={{ color: 'white', fontSize: '20px' }}>
                  {getSummaryIcon()}
                </span>
              </div>
              <span>{getSummaryColor()}</span>
            </div>
          )
        }
      ]
    },
    'Configuración de Combustibles': {
      icon: '⛽',
      items: [
        { 
          label: 'Tipos de combustible', 
          value: getFuelTypeNames() 
        },
        { 
          label: 'Configuración', 
          value: formData.fuelTypes && formData.fuelTypes.length > 0 
            ? `${formData.fuelTypes.length} tipo(s) configurado(s)`
            : 'Acepta todos los tipos de combustible'
        }
      ]
    },
    'Campos Personalizados': {
      icon: '🔧',
      items: [
        { 
          label: 'Campos básicos', 
          value: `${fieldsCount.basic} campos estándar` 
        },
        { 
          label: 'Campos personalizados', 
          value: `${fieldsCount.custom} campos adicionales` 
        },
        { 
          label: 'Total de campos', 
          value: `${fieldsCount.total} campos por vehículo` 
        }
      ]
    }
  };

  return (
    <div className={`wizard-step step-category-summary ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        
        {/* Pregunta principal */}
        <div className="typeform-question">
          <h2>✨ ¡Perfecto! Tu categoría <span className="highlight">{formData.name}</span> está lista</h2>
          <p>Revisa todos los detalles antes de continuar</p>
        </div>

        {/* Card principal con vista previa */}
        <div className="summary-preview-card">
          <div className="category-preview-header">
            <div 
              className="category-preview-icon"
              style={{ backgroundColor: getSummaryColor() }}
            >
              {getSummaryIcon()}
            </div>
            <div className="category-preview-info">
              <h3>{formData.name}</h3>
              <p>{formData.description || 'Sin descripción'}</p>
            </div>
          </div>
        </div>

        {/* Secciones de resumen */}
        <div className="summary-sections">
          {Object.entries(summaryData).map(([sectionTitle, section]) => (
            <div key={sectionTitle} className="summary-section">
              <div className="summary-section-header">
                <span className="section-icon">{section.icon}</span>
                <h4>{sectionTitle}</h4>
              </div>
              <div className="summary-items">
                {section.items.map((item, index) => (
                  <div key={index} className="summary-item">
                    <span className="item-label">{item.label}:</span>
                    <span className="item-value">
                      {React.isValidElement(item.value) ? item.value : item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Campos personalizados detallados */}
        {formData.fields && formData.fields.length > 0 && (
          <div className="summary-section">
            <div className="summary-section-header">
              <span className="section-icon">📝</span>
              <h4>Detalle de Campos Personalizados</h4>
            </div>
            <div className="custom-fields-detail">
              {formData.fields.map((field, index) => (
                <div key={field.key} className="custom-field-item">
                  <div className="field-info">
                    <span className="field-icon">{field.icon}</span>
                    <div className="field-details">
                      <span className="field-name">{field.label}</span>
                      <span className="field-type">
                        {field.type === 'number' ? '🔢 Numérico' : '📝 Texto'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vista JSON (para desarrolladores) */}
        <div className="json-preview-section">
          <div className="json-toggle">
            <button 
              className="json-toggle-btn"
              onClick={() => setShowJsonPreview(!showJsonPreview)}
            >
              {showJsonPreview ? '👁️ Ocultar' : '👁️ Ver'} datos técnicos
            </button>
          </div>
          
          {showJsonPreview && (
            <div className="json-preview">
              <pre className="json-content">
                {JSON.stringify({
                  name: formData.name,
                  description: formData.description,
                  icon: formData.icon,
                  color: formData.color,
                  fuelTypes: formData.fuelTypes,
                  fields: formData.fields,
                  createdAt: new Date().toISOString(),
                  status: 'active'
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Creando categoría...</p>
          </div>
        )}

        {/* Información adicional */}
        <div className="info-section">
          <div className="info-card success">
            <span className="info-icon">🎯</span>
            <div className="info-content">
              <h4>¿Qué sucede después?</h4>
              <ul>
                <li><strong>Creación:</strong> La categoría se guardará en la base de datos</li>
                <li><strong>Disponibilidad:</strong> Estará disponible inmediatamente para nuevos vehículos</li>
                <li><strong>Edición:</strong> Podrás modificar estos ajustes en cualquier momento</li>
                <li><strong>Vehículos existentes:</strong> No se verán afectados por esta nueva categoría</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Errores de validación */}
        {errors && Object.keys(errors).length > 0 && (
          <div className="validation-errors">
            <div className="error-card">
              <span className="error-icon">⚠️</span>
              <div className="error-content">
                <h4>Errores de validación</h4>
                <ul>
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}><strong>{field}:</strong> {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Hint para navegación */}
        <div className="navigation-hint">
          💡 Tip: Presiona "J" para ver/ocultar los datos técnicos
        </div>

      </div>
    </div>
  );
};

export default Step4_Summary;
