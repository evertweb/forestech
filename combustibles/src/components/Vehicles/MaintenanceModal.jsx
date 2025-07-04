/**
 * MaintenanceModal - Modal para registrar mantenimientos de vehículos
 * Incluye diferentes tipos de mantenimiento y seguimiento de costos
 */

import React, { useState, useEffect } from 'react';
import { VEHICLE_STATUS } from '../../services/vehiclesService';

// Tipos de mantenimiento
const MAINTENANCE_TYPES = {
  PREVENTIVO: 'preventivo',
  CORRECTIVO: 'correctivo',
  PREDICTIVO: 'predictivo',
  EMERGENCIA: 'emergencia'
};

// Estados de mantenimiento
const MAINTENANCE_STATUS = {
  PROGRAMADO: 'programado',
  EN_PROCESO: 'en_proceso',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado'
};

// Prioridades
const MAINTENANCE_PRIORITY = {
  BAJA: 'baja',
  MEDIA: 'media',
  ALTA: 'alta',
  CRITICA: 'critica'
};

const MaintenanceModal = ({ 
  isOpen, 
  onClose, 
  vehicle, 
  maintenance,
  onSave, 
  mode = 'create',
  userRole 
}) => {
  // Estado inicial del formulario
  const getInitialFormData = () => ({
    vehicleId: vehicle?.vehicleId || '',
    vehicleName: vehicle?.name || '',
    type: maintenance?.type || MAINTENANCE_TYPES.PREVENTIVO,
    title: maintenance?.title || '',
    description: maintenance?.description || '',
    priority: maintenance?.priority || MAINTENANCE_PRIORITY.MEDIA,
    status: maintenance?.status || MAINTENANCE_STATUS.PROGRAMADO,
    scheduledDate: maintenance?.scheduledDate ? 
      new Date(maintenance.scheduledDate).toISOString().split('T')[0] : '',
    startDate: maintenance?.startDate ? 
      new Date(maintenance.startDate).toISOString().split('T')[0] : '',
    completedDate: maintenance?.completedDate ? 
      new Date(maintenance.completedDate).toISOString().split('T')[0] : '',
    estimatedHours: maintenance?.estimatedHours || 0,
    actualHours: maintenance?.actualHours || 0,
    estimatedCost: maintenance?.estimatedCost || 0,
    actualCost: maintenance?.actualCost || 0,
    technician: maintenance?.technician || '',
    workshop: maintenance?.workshop || '',
    parts: maintenance?.parts || [],
    notes: maintenance?.notes || '',
    nextMaintenanceKm: maintenance?.nextMaintenanceKm || 0,
    nextMaintenanceHours: maintenance?.nextMaintenanceHours || 0,
    nextMaintenanceDate: maintenance?.nextMaintenanceDate ? 
      new Date(maintenance.nextMaintenanceDate).toISOString().split('T')[0] : ''
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newPart, setNewPart] = useState({ name: '', quantity: 1, cost: 0 });

  // Reinicializar formulario cuando cambie el mantenimiento
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setErrors({});
    }
  }, [isOpen, maintenance, vehicle, getInitialFormData]);

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Limpiar error del campo si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Manejar cambios en partes
  const handlePartChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setNewPart(prev => ({
      ...prev,
      [name]: newValue
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
      total: newPart.quantity * newPart.cost
    };

    setFormData(prev => ({
      ...prev,
      parts: [...prev.parts, part]
    }));

    setNewPart({ name: '', quantity: 1, cost: 0 });
  };

  // Remover parte
  const removePart = (partId) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.filter(part => part.id !== partId)
    }));
  };

  // Validaciones del formulario
  const validateForm = () => {
    const newErrors = {};

    // Validaciones obligatorias
    if (!formData.title.trim()) {
      newErrors.title = 'El título del mantenimiento es obligatorio';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'La fecha programada es obligatoria';
    }

    // Validaciones de fechas
    if (formData.startDate && formData.completedDate) {
      const startDate = new Date(formData.startDate);
      const completedDate = new Date(formData.completedDate);
      if (completedDate < startDate) {
        newErrors.completedDate = 'La fecha de finalización debe ser posterior al inicio';
      }
    }

    if (formData.scheduledDate && formData.startDate) {
      const scheduledDate = new Date(formData.scheduledDate);
      const startDate = new Date(formData.startDate);
      if (startDate < scheduledDate) {
        // Permitir pero avisar
      }
    }

    // Validaciones numéricas
    if (formData.estimatedHours < 0) {
      newErrors.estimatedHours = 'Las horas estimadas no pueden ser negativas';
    }

    if (formData.actualHours < 0) {
      newErrors.actualHours = 'Las horas reales no pueden ser negativas';
    }

    if (formData.estimatedCost < 0) {
      newErrors.estimatedCost = 'El costo estimado no puede ser negativo';
    }

    if (formData.actualCost < 0) {
      newErrors.actualCost = 'El costo real no puede ser negativo';
    }

    // Validación de estado vs fechas
    if (formData.status === MAINTENANCE_STATUS.COMPLETADO && !formData.completedDate) {
      newErrors.completedDate = 'La fecha de finalización es obligatoria para mantenimientos completados';
    }

    if (formData.status === MAINTENANCE_STATUS.EN_PROCESO && !formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es obligatoria para mantenimientos en proceso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Calcular totales
      const totalPartsCost = formData.parts.reduce((sum, part) => sum + part.total, 0);
      const totalEstimatedCost = formData.estimatedCost + totalPartsCost;
      const totalActualCost = formData.actualCost + totalPartsCost;

      // Preparar datos para envío
      const submitData = {
        ...formData,
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        totalPartsCost,
        totalEstimatedCost,
        totalActualCost,
        // Convertir fechas vacías a null
        scheduledDate: formData.scheduledDate || null,
        startDate: formData.startDate || null,
        completedDate: formData.completedDate || null,
        nextMaintenanceDate: formData.nextMaintenanceDate || null,
        createdAt: maintenance?.createdAt || new Date(),
        updatedAt: new Date()
      };

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error('Error guardando mantenimiento:', error);
      setErrors({ general: 'Error al guardar el mantenimiento. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  // Obtener icono para tipo de mantenimiento
  const getMaintenanceTypeIcon = (type) => {
    switch (type) {
      case MAINTENANCE_TYPES.PREVENTIVO: return '🔧';
      case MAINTENANCE_TYPES.CORRECTIVO: return '🛠️';
      case MAINTENANCE_TYPES.PREDICTIVO: return '📊';
      case MAINTENANCE_TYPES.EMERGENCIA: return '🚨';
      default: return '⚙️';
    }
  };

  // Obtener clase CSS para prioridad
  const getPriorityClass = (priority) => {
    switch (priority) {
      case MAINTENANCE_PRIORITY.BAJA: return 'priority-low';
      case MAINTENANCE_PRIORITY.MEDIA: return 'priority-medium';
      case MAINTENANCE_PRIORITY.ALTA: return 'priority-high';
      case MAINTENANCE_PRIORITY.CRITICA: return 'priority-critical';
      default: return 'priority-medium';
    }
  };

  // Obtener clase CSS para estado
  const getStatusClass = (status) => {
    switch (status) {
      case MAINTENANCE_STATUS.PROGRAMADO: return 'status-scheduled';
      case MAINTENANCE_STATUS.EN_PROCESO: return 'status-in-progress';
      case MAINTENANCE_STATUS.COMPLETADO: return 'status-completed';
      case MAINTENANCE_STATUS.CANCELADO: return 'status-cancelled';
      default: return 'status-scheduled';
    }
  };

  // Calcular total de partes
  const getTotalPartsCost = () => {
    return formData.parts.reduce((sum, part) => sum + part.total, 0);
  };

  // Determinar si el campo está deshabilitado
  const isReadOnly = mode === 'view';
  const canEdit = userRole === 'admin' || userRole === 'supervisor';

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content maintenance-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="modal-header">
          <div className="modal-title">
            <span className="title-icon">
              {mode === 'create' ? '➕' : mode === 'edit' ? '✏️' : '👁️'}
            </span>
            <div className="title-text">
              <h3>
                {mode === 'create' && 'Registrar Mantenimiento'}
                {mode === 'edit' && 'Editar Mantenimiento'}
                {mode === 'view' && 'Detalles del Mantenimiento'}
              </h3>
              <p>
                Vehículo: {vehicle?.vehicleId} - {vehicle?.name}
              </p>
            </div>
          </div>
          <button 
            className="btn-close" 
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-content">
            {/* Error general */}
            {errors.general && (
              <div className="error-message general-error">
                ⚠️ {errors.general}
              </div>
            )}

            {/* Información básica */}
            <div className="form-section">
              <h4 className="section-title">📋 Información del Mantenimiento</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="type">Tipo de Mantenimiento</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  >
                    {Object.values(MAINTENANCE_TYPES).map(type => (
                      <option key={type} value={type}>
                        {getMaintenanceTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Prioridad</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className={getPriorityClass(formData.priority)}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  >
                    {Object.values(MAINTENANCE_PRIORITY).map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Estado</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={getStatusClass(formData.status)}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  >
                    {Object.values(MAINTENANCE_STATUS).map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="title">Título del Mantenimiento *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ej: Cambio de aceite y filtros"
                    className={errors.title ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={100}
                  />
                  {errors.title && (
                    <span className="error-text">{errors.title}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Fechas de programación */}
            <div className="form-section">
              <h4 className="section-title">📅 Programación</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="scheduledDate">Fecha Programada *</label>
                  <input
                    type="date"
                    id="scheduledDate"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    className={errors.scheduledDate ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                  {errors.scheduledDate && (
                    <span className="error-text">{errors.scheduledDate}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="startDate">Fecha de Inicio</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={errors.startDate ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                  {errors.startDate && (
                    <span className="error-text">{errors.startDate}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="completedDate">Fecha de Finalización</label>
                  <input
                    type="date"
                    id="completedDate"
                    name="completedDate"
                    value={formData.completedDate}
                    onChange={handleInputChange}
                    className={errors.completedDate ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                  {errors.completedDate && (
                    <span className="error-text">{errors.completedDate}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="nextMaintenanceDate">Próximo Mantenimiento</label>
                  <input
                    type="date"
                    id="nextMaintenanceDate"
                    name="nextMaintenanceDate"
                    value={formData.nextMaintenanceDate}
                    onChange={handleInputChange}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                </div>
              </div>
            </div>

            {/* Recursos y costos */}
            <div className="form-section">
              <h4 className="section-title">💰 Recursos y Costos</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="technician">Técnico Responsable</label>
                  <input
                    type="text"
                    id="technician"
                    name="technician"
                    value={formData.technician}
                    onChange={handleInputChange}
                    placeholder="Nombre del técnico"
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="workshop">Taller/Ubicación</label>
                  <input
                    type="text"
                    id="workshop"
                    name="workshop"
                    value={formData.workshop}
                    onChange={handleInputChange}
                    placeholder="Taller donde se realiza"
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="estimatedHours">Horas Estimadas</label>
                  <input
                    type="number"
                    id="estimatedHours"
                    name="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={handleInputChange}
                    min="0"
                    step="0.5"
                    className={errors.estimatedHours ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                  {errors.estimatedHours && (
                    <span className="error-text">{errors.estimatedHours}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="actualHours">Horas Reales</label>
                  <input
                    type="number"
                    id="actualHours"
                    name="actualHours"
                    value={formData.actualHours}
                    onChange={handleInputChange}
                    min="0"
                    step="0.5"
                    className={errors.actualHours ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                  {errors.actualHours && (
                    <span className="error-text">{errors.actualHours}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="estimatedCost">Costo Estimado (COP)</label>
                  <input
                    type="number"
                    id="estimatedCost"
                    name="estimatedCost"
                    value={formData.estimatedCost}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    className={errors.estimatedCost ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                  {errors.estimatedCost && (
                    <span className="error-text">{errors.estimatedCost}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="actualCost">Costo Real (COP)</label>
                  <input
                    type="number"
                    id="actualCost"
                    name="actualCost"
                    value={formData.actualCost}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    className={errors.actualCost ? 'error' : ''}
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                  {errors.actualCost && (
                    <span className="error-text">{errors.actualCost}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Partes y repuestos */}
            <div className="form-section">
              <h4 className="section-title">🔧 Partes y Repuestos</h4>
              
              {!isReadOnly && canEdit && (
                <div className="parts-form">
                  <div className="form-grid">
                    <div className="form-group">
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

                    <div className="form-group">
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

                    <div className="form-group">
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

                    <div className="form-group">
                      <button
                        type="button"
                        className="btn-add-part"
                        onClick={addPart}
                        disabled={!newPart.name.trim()}
                      >
                        ➕ Agregar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de partes */}
              {formData.parts.length > 0 && (
                <div className="parts-list">
                  <table className="parts-table">
                    <thead>
                      <tr>
                        <th>Parte</th>
                        <th>Cantidad</th>
                        <th>Costo Unit.</th>
                        <th>Total</th>
                        {!isReadOnly && canEdit && <th>Acciones</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {formData.parts.map((part) => (
                        <tr key={part.id}>
                          <td>{part.name}</td>
                          <td>{part.quantity}</td>
                          <td>${part.cost.toLocaleString('es-CO')}</td>
                          <td>${part.total.toLocaleString('es-CO')}</td>
                          {!isReadOnly && canEdit && (
                            <td>
                              <button
                                type="button"
                                className="btn-remove-part"
                                onClick={() => removePart(part.id)}
                                title="Eliminar parte"
                              >
                                🗑️
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="total-row">
                        <td colSpan="3"><strong>Total Partes:</strong></td>
                        <td><strong>${getTotalPartsCost().toLocaleString('es-CO')}</strong></td>
                        {!isReadOnly && canEdit && <td></td>}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Próximo mantenimiento */}
            <div className="form-section">
              <h4 className="section-title">🔄 Próximo Mantenimiento</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nextMaintenanceKm">Próximo Mantenimiento (Km)</label>
                  <input
                    type="number"
                    id="nextMaintenanceKm"
                    name="nextMaintenanceKm"
                    value={formData.nextMaintenanceKm}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    placeholder="0 = No aplica"
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nextMaintenanceHours">Próximo Mantenimiento (Horas)</label>
                  <input
                    type="number"
                    id="nextMaintenanceHours"
                    name="nextMaintenanceHours"
                    value={formData.nextMaintenanceHours}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    placeholder="0 = No aplica"
                    disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                  />
                </div>
              </div>
            </div>

            {/* Descripción y notas */}
            <div className="form-section">
              <h4 className="section-title">📝 Descripción y Notas</h4>
              <div className="form-group">
                <label htmlFor="description">Descripción del Trabajo *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe el trabajo a realizar o realizado..."
                  rows="3"
                  maxLength="500"
                  className={errors.description ? 'error' : ''}
                  disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                />
                {errors.description && (
                  <span className="error-text">{errors.description}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notas Adicionales</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Observaciones, recomendaciones, problemas encontrados..."
                  rows="3"
                  maxLength="500"
                  disabled={isReadOnly || (mode === 'edit' && !canEdit)}
                />
                <span className="char-count">
                  {formData.notes.length}/500 caracteres
                </span>
              </div>
            </div>

            {/* Resumen de costos */}
            <div className="cost-summary">
              <h4>💰 Resumen de Costos</h4>
              <div className="cost-grid">
                <div className="cost-item">
                  <span className="cost-label">Mano de Obra:</span>
                  <span className="cost-value">${formData.actualCost.toLocaleString('es-CO')}</span>
                </div>
                <div className="cost-item">
                  <span className="cost-label">Partes:</span>
                  <span className="cost-value">${getTotalPartsCost().toLocaleString('es-CO')}</span>
                </div>
                <div className="cost-item total-cost">
                  <span className="cost-label">Total:</span>
                  <span className="cost-value">
                    ${(formData.actualCost + getTotalPartsCost()).toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer del modal */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              {mode === 'view' ? 'Cerrar' : 'Cancelar'}
            </button>
            
            {!isReadOnly && canEdit && (
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    {mode === 'create' ? '➕ Registrar Mantenimiento' : '💾 Guardar Cambios'}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceModal;