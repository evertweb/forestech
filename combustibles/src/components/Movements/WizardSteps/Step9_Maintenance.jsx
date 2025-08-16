/**
 * Step9_Maintenance - Paso específico para capturar datos de mantenimiento
 * Solo se muestra cuando el tipo de movimiento es MANTENIMIENTO
 */

import React, { useState, useCallback } from 'react';

// Tipos de mantenimiento (importamos desde el componente de mantenimiento existente)
const MAINTENANCE_TYPES = {
  PREVENTIVO: 'preventivo',
  CORRECTIVO: 'correctivo',
  PREDICTIVO: 'predictivo',
  EMERGENCIA: 'emergencia',
};

// Prioridades
const MAINTENANCE_PRIORITY = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
  CRITICA: 'critica',
};

const Step9_Maintenance = ({ formData, updateFormData, errors, isActive }) => {
  const [newPart, setNewPart] = useState({ name: '', quantity: 1, cost: 0 });

  // Handlers para campos de mantenimiento
  const handleInputChange = useCallback(
    (field) => (e) => {
      const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
      updateFormData(field, value);
    },
    [updateFormData]
  );

  // Manejar cambios en partes
  const handlePartChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;

    setNewPart((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Agregar parte
  const addPart = () => {
    if (!newPart.name.trim()) return;

    const part = {
      id: Date.now().toString(),
      name: newPart.name.trim(),
      quantity: newPart.quantity,
      cost: newPart.cost,
      total: newPart.quantity * newPart.cost,
    };

    const currentParts = formData.maintenanceParts || [];
    updateFormData('maintenanceParts', [...currentParts, part]);
    setNewPart({ name: '', quantity: 1, cost: 0 });
  };

  // Remover parte
  const removePart = (partId) => {
    const currentParts = formData.maintenanceParts || [];
    updateFormData(
      'maintenanceParts',
      currentParts.filter((part) => part.id !== partId)
    );
  };

  // Calcular total de partes
  const getTotalPartsCost = () => {
    const parts = formData.maintenanceParts || [];
    return parts.reduce((sum, part) => sum + part.total, 0);
  };

  // Obtener icono para tipo de mantenimiento
  const getMaintenanceTypeIcon = (type) => {
    switch (type) {
      case MAINTENANCE_TYPES.PREVENTIVO:
        return '🔧';
      case MAINTENANCE_TYPES.CORRECTIVO:
        return '🛠️';
      case MAINTENANCE_TYPES.PREDICTIVO:
        return '📊';
      case MAINTENANCE_TYPES.EMERGENCIA:
        return '🚨';
      default:
        return '⚙️';
    }
  };

  if (!isActive) return null;

  return (
    <div className="wizard-step step-maintenance sap-theme">
      <div className="step-header sap-theme">
        <h3>🔧 Datos del Mantenimiento</h3>
        <p>Registra los detalles del mantenimiento realizado con este combustible</p>
      </div>

      <div className="step-content sap-theme">
        {/* Información básica del mantenimiento */}
        <div className="form-section sap-theme">
          <h4 className="section-title sap-theme">📋 Información del Mantenimiento</h4>

          <div className="form-grid sap-theme">
            <div className="form-group sap-theme">
              <label htmlFor="maintenanceType">Tipo de Mantenimiento *</label>
              <select
                id="maintenanceType"
                name="maintenanceType"
                value={formData.maintenanceType || MAINTENANCE_TYPES.PREVENTIVO}
                onChange={handleInputChange('maintenanceType')}
                className={errors.maintenanceType ? 'error' : ''}
              >
                {Object.values(MAINTENANCE_TYPES).map((type) => (
                  <option key={type} value={type}>
                    {getMaintenanceTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {errors.maintenanceType && (
                <span className="error-text sap-theme">{errors.maintenanceType}</span>
              )}
            </div>

            <div className="form-group sap-theme">
              <label htmlFor="maintenancePriority">Prioridad</label>
              <select
                id="maintenancePriority"
                name="maintenancePriority"
                value={formData.maintenancePriority || MAINTENANCE_PRIORITY.MEDIA}
                onChange={handleInputChange('maintenancePriority')}
              >
                {Object.values(MAINTENANCE_PRIORITY).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width sap-theme">
              <label htmlFor="maintenanceTitle">Título del Mantenimiento *</label>
              <input
                type="text"
                id="maintenanceTitle"
                name="maintenanceTitle"
                value={formData.maintenanceTitle || ''}
                onChange={handleInputChange('maintenanceTitle')}
                placeholder="Ej: Cambio de aceite y filtros"
                className={errors.maintenanceTitle ? 'error' : ''}
                maxLength={100}
              />
              {errors.maintenanceTitle && (
                <span className="error-text sap-theme">{errors.maintenanceTitle}</span>
              )}
            </div>
          </div>
        </div>

        {/* Costos y tiempo */}
        <div className="form-section sap-theme">
          <h4 className="section-title sap-theme">💰 Costos y Tiempo</h4>

          <div className="form-grid sap-theme">
            <div className="form-group sap-theme">
              <label htmlFor="maintenanceHours">Horas de Trabajo</label>
              <input
                type="number"
                id="maintenanceHours"
                name="maintenanceHours"
                value={formData.maintenanceHours || ''}
                onChange={handleInputChange('maintenanceHours')}
                min="0"
                step="0.5"
                placeholder="8.5"
              />
            </div>

            <div className="form-group sap-theme">
              <label htmlFor="maintenanceCost">Costo Mano de Obra (COP)</label>
              <input
                type="number"
                id="maintenanceCost"
                name="maintenanceCost"
                value={formData.maintenanceCost || ''}
                onChange={handleInputChange('maintenanceCost')}
                min="0"
                step="1000"
                placeholder="50000"
              />
            </div>

            <div className="form-group sap-theme">
              <label htmlFor="maintenanceTechnician">Técnico Responsable</label>
              <input
                type="text"
                id="maintenanceTechnician"
                name="maintenanceTechnician"
                value={formData.maintenanceTechnician || ''}
                onChange={handleInputChange('maintenanceTechnician')}
                placeholder="Nombre del técnico"
                maxLength={100}
              />
            </div>
          </div>
        </div>

        {/* Partes y repuestos */}
        <div className="form-section sap-theme">
          <h4 className="section-title sap-theme">🔧 Partes y Repuestos</h4>

          {/* Formulario para agregar partes */}
          <div className="parts-form sap-theme">
            <div className="form-grid sap-theme">
              <div className="form-group sap-theme">
                <label htmlFor="partName">Nombre de la Parte</label>
                <input
                  type="text"
                  id="partName"
                  name="name"
                  value={newPart.name}
                  onChange={handlePartChange}
                  placeholder="Ej: Filtro de aceite"
                  maxLength={100}
                />
              </div>

              <div className="form-group sap-theme">
                <label htmlFor="partQuantity">Cantidad</label>
                <input
                  type="number"
                  id="partQuantity"
                  name="quantity"
                  value={newPart.quantity}
                  onChange={handlePartChange}
                  min="1"
                  step="1"
                />
              </div>

              <div className="form-group sap-theme">
                <label htmlFor="partCost">Costo Unitario (COP)</label>
                <input
                  type="number"
                  id="partCost"
                  name="cost"
                  value={newPart.cost}
                  onChange={handlePartChange}
                  min="0"
                  step="1000"
                />
              </div>

              <div className="form-group sap-theme">
                <button
                  type="button"
                  className="btn-add-part sap-theme"
                  onClick={addPart}
                  disabled={!newPart.name.trim()}
                >
                  ➕ Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Lista de partes agregadas */}
          {formData.maintenanceParts && formData.maintenanceParts.length > 0 && (
            <div className="parts-list sap-theme">
              <table className="parts-table sap-theme">
                <thead>
                  <tr>
                    <th>Parte</th>
                    <th>Cantidad</th>
                    <th>Costo Unit.</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.maintenanceParts.map((part) => (
                    <tr key={part.id}>
                      <td>{part.name}</td>
                      <td>{part.quantity}</td>
                      <td>${part.cost.toLocaleString('es-CO')}</td>
                      <td>${part.total.toLocaleString('es-CO')}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-remove-part sap-theme"
                          onClick={() => removePart(part.id)}
                          title="Eliminar parte"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row sap-theme">
                    <td colSpan="3">
                      <strong>Total Partes:</strong>
                    </td>
                    <td>
                      <strong>${getTotalPartsCost().toLocaleString('es-CO')}</strong>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Descripción del trabajo */}
        <div className="form-section sap-theme">
          <h4 className="section-title sap-theme">📝 Descripción del Trabajo</h4>

          <div className="form-group sap-theme">
            <label htmlFor="maintenanceDescription">Descripción del Trabajo *</label>
            <textarea
              id="maintenanceDescription"
              name="maintenanceDescription"
              value={formData.maintenanceDescription || ''}
              onChange={handleInputChange('maintenanceDescription')}
              placeholder="Describe el trabajo realizado..."
              rows="3"
              maxLength="500"
              className={errors.maintenanceDescription ? 'error' : ''}
            />
            {errors.maintenanceDescription && (
              <span className="error-text sap-theme">{errors.maintenanceDescription}</span>
            )}
          </div>

          <div className="form-group sap-theme">
            <label htmlFor="maintenanceNotes">Notas Adicionales</label>
            <textarea
              id="maintenanceNotes"
              name="maintenanceNotes"
              value={formData.maintenanceNotes || ''}
              onChange={handleInputChange('maintenanceNotes')}
              placeholder="Observaciones, recomendaciones..."
              rows="2"
              maxLength="300"
            />
            <span className="char-count sap-theme">
              {(formData.maintenanceNotes || '').length}/300 caracteres
            </span>
          </div>
        </div>

        {/* Resumen de costos */}
        {(formData.maintenanceCost || getTotalPartsCost() > 0) && (
          <div className="cost-summary sap-theme">
            <h4>💰 Resumen de Costos</h4>
            <div className="cost-grid sap-theme">
              <div className="cost-item sap-theme">
                <span className="cost-label sap-theme">Mano de Obra:</span>
                <span className="cost-value sap-theme">
                  ${(formData.maintenanceCost || 0).toLocaleString('es-CO')}
                </span>
              </div>
              <div className="cost-item sap-theme">
                <span className="cost-label sap-theme">Partes:</span>
                <span className="cost-value sap-theme">
                  ${getTotalPartsCost().toLocaleString('es-CO')}
                </span>
              </div>
              <div className="cost-item total-cost sap-theme">
                <span className="cost-label sap-theme">Total:</span>
                <span className="cost-value sap-theme">
                  ${((formData.maintenanceCost || 0) + getTotalPartsCost()).toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="step-hint sap-theme">
        💡 Este mantenimiento se registrará junto con el movimiento de combustible
      </div>
    </div>
  );
};

export default Step9_Maintenance;
