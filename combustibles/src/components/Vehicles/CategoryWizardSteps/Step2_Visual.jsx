/**
 * Step2_Visual - Segundo paso: Apariencia visual de la categoría
 * Selección de icono y color para identificar la categoría
 */

import React, { useEffect, useCallback } from 'react';
import '../WizardSteps/VehicleWizardSteps.css';

const Step2_Visual = ({ 
  formData, 
  updateFormData, 
  errors, 
  isActive 
}) => {

  // Navegación por teclado
  useEffect(() => {
    if (!isActive) return;

    const handleKeyPress = (e) => {
      // Números 1-9 para seleccionar iconos
      const num = parseInt(e.key);
      if (num >= 1 && num <= Math.min(9, iconOptions.length)) {
        const selectedIcon = iconOptions[num - 1];
        updateFormData('icon', selectedIcon.icon);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isActive, updateFormData]);

  const handleIconSelect = useCallback((icon) => {
    updateFormData('icon', icon);
  }, [updateFormData]);

  const handleColorSelect = useCallback((color) => {
    updateFormData('color', color);
  }, [updateFormData]);

  const iconOptions = [
    { icon: '🚜', name: 'Tractor', description: 'Para vehículos agrícolas' },
    { icon: '🚛', name: 'Camión', description: 'Para vehículos de carga' },
    { icon: '🚧', name: 'Excavadora', description: 'Para maquinaria de construcción' },
    { icon: '🛤️', name: 'Motoniveladora', description: 'Para trabajo en carreteras' },
    { icon: '🏗️', name: 'Bulldozer', description: 'Para movimiento de tierra' },
    { icon: '⚒️', name: 'Retroexcavadora', description: 'Para excavación y carga' },
    { icon: '🚚', name: 'Volqueta', description: 'Para transporte de materiales' },
    { icon: '🏋️', name: 'Montacargas', description: 'Para manejo de materiales' },
    { icon: '💨', name: 'Compresor', description: 'Para equipos neumáticos' },
    { icon: '⚡', name: 'Generador', description: 'Para equipos eléctricos' },
    { icon: '🚗', name: 'Vehículo', description: 'Para vehículos generales' },
    { icon: '🚙', name: 'Camioneta', description: 'Para vehículos utilitarios' }
  ];

  const colorOptions = [
    { color: '#3b82f6', name: 'Azul', description: 'Profesional y confiable' },
    { color: '#10b981', name: 'Verde', description: 'Natural y ecológico' },
    { color: '#f59e0b', name: 'Naranja', description: 'Energético y llamativo' },
    { color: '#ef4444', name: 'Rojo', description: 'Urgente e importante' },
    { color: '#8b5cf6', name: 'Morado', description: 'Elegante y distintivo' },
    { color: '#06b6d4', name: 'Cian', description: 'Moderno y tecnológico' },
    { color: '#84cc16', name: 'Lima', description: 'Fresco y dinámico' },
    { color: '#f97316', name: 'Ámbar', description: 'Cálido y acogedor' },
    { color: '#ec4899', name: 'Rosa', description: 'Creativo y único' },
    { color: '#64748b', name: 'Gris', description: 'Neutro y versátil' }
  ];

  return (
    <div className={`wizard-step step-category-visual ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        
        {/* Pregunta principal */}
        <div className="typeform-question">
          <h2>🎨 ¡Genial! Ahora dale personalidad a <span className="highlight">{formData.name}</span></h2>
          <p>Elige un icono que represente mejor esta categoría de vehículos</p>
        </div>

        {/* Selección de iconos */}
        <div className="typeform-section">
          <div className="typeform-options icon-grid">
            {iconOptions.map((option, index) => (
              <div
                key={option.icon}
                className={`typeform-option icon-option ${
                  formData.icon === option.icon ? 'selected' : ''
                }`}
                onClick={() => handleIconSelect(option.icon)}
              >
                <div className="option-header">
                  <span className="option-icon large">{option.icon}</span>
                  <span className="option-number">{index + 1}</span>
                </div>
                <div className="option-content">
                  <h4 className="option-title">{option.name}</h4>
                  <p className="option-description">{option.description}</p>
                </div>
                {formData.icon === option.icon && (
                  <div className="selection-indicator">
                    <span className="checkmark">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {errors.icon && (
            <div className="input-error-centered">
              <span className="error-icon">⚠️</span>
              {errors.icon}
            </div>
          )}
        </div>

        {/* Selección de color */}
        <div className="typeform-section">
          <label className="typeform-label">
            Perfecto! Ahora elige un color que identifique esta categoría
          </label>
          <div className="color-palette">
            {colorOptions.map((option) => (
              <div
                key={option.color}
                className={`color-option ${
                  formData.color === option.color ? 'selected' : ''
                }`}
                onClick={() => handleColorSelect(option.color)}
                style={{ backgroundColor: option.color }}
                title={`${option.name} - ${option.description}`}
              >
                {formData.color === option.color && (
                  <span className="color-checkmark">✓</span>
                )}
              </div>
            ))}
          </div>
          {errors.color && (
            <div className="input-error-centered">
              <span className="error-icon">⚠️</span>
              {errors.color}
            </div>
          )}
          <div className="navigation-hint">
            🎨 El color se usará en tarjetas, gráficos y reportes
          </div>
        </div>

        {/* Preview de la apariencia */}
        {formData.icon && formData.color && (
          <div className="step-preview">
            <div className="preview-card">
              <h4>🔍 Vista previa de la categoría</h4>
              <div className="category-preview" style={{ borderColor: formData.color }}>
                <div className="category-preview-header">
                  <span 
                    className="category-preview-icon"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.icon}
                  </span>
                  <div className="category-preview-content">
                    <h3 style={{ color: formData.color }}>{formData.name}</h3>
                    <p>{formData.description}</p>
                  </div>
                </div>
                <div className="category-preview-badge" style={{ backgroundColor: formData.color }}>
                  <span>{formData.icon}</span>
                  <span>{formData.name}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="info-section">
          <div className="info-card">
            <span className="info-icon">💡</span>
            <div className="info-content">
              <h4>¿Cómo se usará la apariencia?</h4>
              <ul>
                <li><strong>Identificación rápida:</strong> Reconoce categorías de un vistazo</li>
                <li><strong>Interfaz consistente:</strong> Colores uniformes en toda la app</li>
                <li><strong>Reportes visuales:</strong> Gráficos con colores distintivos</li>
                <li><strong>Organización intuitiva:</strong> Agrupa visualmente vehículos similares</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hint para navegación */}
        <div className="navigation-hint">
          💡 Tip: Puedes usar las teclas 1-{Math.min(9, iconOptions.length)} para seleccionar iconos rápidamente
        </div>

      </div>
    </div>
  );
};

export default Step2_Visual;
