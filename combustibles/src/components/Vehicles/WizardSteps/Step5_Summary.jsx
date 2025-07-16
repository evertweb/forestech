/**
 * Step5_Summary - Quinto paso: Resumen final antes de guardar
 * Muestra toda la información recopilada de forma organizada
 */

import React from 'react';
import { FUEL_TYPES } from '../../../data/vehicleCategories';
import { VEHICLE_STATUS } from '../../../services/vehiclesService';
import './VehicleWizardSteps.css';

const Step5_Summary = ({ 
  formData, 
  isActive,
  extraData 
}) => {
  const { categories = [] } = extraData || {};

  // Encontrar la categoría seleccionada
  const selectedCategory = categories.find(c => c.id === formData.category);

  // Iconos para diferentes tipos de datos
  const getStatusIcon = (status) => {
    switch (status) {
      case VEHICLE_STATUS.ACTIVO: return '✅';
      case VEHICLE_STATUS.MANTENIMIENTO: return '🔧';
      case VEHICLE_STATUS.REPARACION: return '⚠️';
      case VEHICLE_STATUS.INACTIVO: return '⏸️';
      case VEHICLE_STATUS.FUERA_DE_SERVICIO: return '❌';
      default: return '❓';
    }
  };

  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case FUEL_TYPES.DIESEL: return '🛢️';
      case FUEL_TYPES.GASOLINA: return '⛽';
      case FUEL_TYPES.MIXTO: return '🔄';
      default: return '❓';
    }
  };

  const getCategoryIcon = (category) => {
    if (!category) return '🚗';
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
    return '🚗';
  };

  return (
    <div className={`wizard-step step-summary ${isActive ? 'active' : ''}`}>
      <div className="typeform-layout">
        
        {/* Pregunta principal */}
        <div className="typeform-question">
          <h2>📋 ¡Perfecto! Revisa la información de <span className="highlight">{formData.name}</span></h2>
          <p>Verifica que toda la información sea correcta antes de guardar el vehículo</p>
        </div>

        {/* Resumen en tarjetas */}
        <div className="summary-sections">
          
          {/* Información básica */}
          <div className="summary-card">
            <div className="summary-header">
              <span className="summary-icon">📝</span>
              <h3>Información Básica</h3>
            </div>
            <div className="summary-content">
              <div className="summary-item">
                <span className="item-label">ID del vehículo:</span>
                <span className="item-value highlight">{formData.vehicleId}</span>
              </div>
              <div className="summary-item">
                <span className="item-label">Nombre:</span>
                <span className="item-value">{formData.name}</span>
              </div>
              <div className="summary-item">
                <span className="item-label">Marca y modelo:</span>
                <span className="item-value">{formData.brand} {formData.model}</span>
              </div>
              <div className="summary-item">
                <span className="item-label">Año:</span>
                <span className="item-value">{formData.year}</span>
              </div>
            </div>
          </div>

          {/* Categoría */}
          <div className="summary-card">
            <div className="summary-header">
              <span className="summary-icon">{getCategoryIcon(selectedCategory)}</span>
              <h3>Categoría</h3>
            </div>
            <div className="summary-content">
              <div className="summary-item">
                <span className="item-label">Tipo:</span>
                <span className="item-value">{selectedCategory?.name || 'No especificada'}</span>
              </div>
              {selectedCategory?.description && (
                <div className="summary-item">
                  <span className="item-label">Descripción:</span>
                  <span className="item-value">{selectedCategory.description}</span>
                </div>
              )}
            </div>
          </div>

          {/* Especificaciones técnicas */}
          <div className="summary-card">
            <div className="summary-header">
              <span className="summary-icon">⚙️</span>
              <h3>Especificaciones Técnicas</h3>
            </div>
            <div className="summary-content">
              <div className="summary-item">
                <span className="item-label">Tipo de combustible:</span>
                <span className="item-value">
                  {getFuelIcon(formData.fuelType)} {formData.fuelType}
                </span>
              </div>
              {formData.plateNumber && (
                <div className="summary-item">
                  <span className="item-label">Número de placa:</span>
                  <span className="item-value">🏷️ {formData.plateNumber}</span>
                </div>
              )}
              {formData.enginePower && (
                <div className="summary-item">
                  <span className="item-label">Potencia del motor:</span>
                  <span className="item-value">⚡ {formData.enginePower} HP</span>
                </div>
              )}
              {formData.fuelCapacity && (
                <div className="summary-item">
                  <span className="item-label">Capacidad de combustible:</span>
                  <span className="item-value">⛽ {formData.fuelCapacity} L</span>
                </div>
              )}
            </div>
          </div>

          {/* Información operacional */}
          <div className="summary-card">
            <div className="summary-header">
              <span className="summary-icon">🚀</span>
              <h3>Estado Operacional</h3>
            </div>
            <div className="summary-content">
              <div className="summary-item">
                <span className="item-label">Estado actual:</span>
                <span className="item-value">
                  {getStatusIcon(formData.status)} {formData.status}
                </span>
              </div>
              {formData.currentLocation && (
                <div className="summary-item">
                  <span className="item-label">Ubicación:</span>
                  <span className="item-value">📍 {formData.currentLocation}</span>
                </div>
              )}
              <div className="summary-item">
                <span className="item-label">Horómetro:</span>
                <span className="item-value">
                  {formData.hasHourMeter ? (
                    <>🕐 Sí {formData.currentHours ? `(${formData.currentHours} horas)` : ''}</>
                  ) : (
                    '❌ No'
                  )}
                </span>
              </div>
              {formData.lastMaintenanceDate && (
                <div className="summary-item">
                  <span className="item-label">Último mantenimiento:</span>
                  <span className="item-value">🔧 {formData.lastMaintenanceDate}</span>
                </div>
              )}
              {formData.purchaseDate && (
                <div className="summary-item">
                  <span className="item-label">Fecha de compra:</span>
                  <span className="item-value">📅 {formData.purchaseDate}</span>
                </div>
              )}
              {formData.description && (
                <div className="summary-item">
                  <span className="item-label">Observaciones:</span>
                  <span className="item-value">📝 {formData.description}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Confirmación final */}
        <div className="confirmation-section">
          <div className="confirmation-card">
            <div className="confirmation-icon">✅</div>
            <h3>¡Todo listo para guardar!</h3>
            <p>
              El vehículo <strong>{formData.name}</strong> ({formData.vehicleId}) 
              se registrará en el sistema con toda la información proporcionada.
            </p>
            <div className="confirmation-actions">
              <div className="action-hint">
                💡 Puedes hacer clic en "Completar" o presionar Enter para finalizar
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="info-section">
          <div className="info-card">
            <span className="info-icon">🔄</span>
            <div className="info-content">
              <h4>¿Qué pasa después?</h4>
              <ul>
                <li>El vehículo aparecerá en la lista de vehículos</li>
                <li>Podrás asignarle combustible inmediatamente</li>
                <li>Se registrará en el historial de la flota</li>
                <li>Podrás editar esta información cuando quieras</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Step5_Summary;
