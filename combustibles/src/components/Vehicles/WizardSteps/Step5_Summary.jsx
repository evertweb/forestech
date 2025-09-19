/**
 * Step5_Summary - Quinto paso: Resumen final antes de guardar
 * Muestra toda la información recopilada de forma organizada
 */

import React from 'react';
import { FUEL_TYPES } from '../../../data/vehicleCategories';
import { VEHICLE_STATUS } from '../../../services/vehiclesService';
import './VehicleWizardSteps.css';

const Step5_Summary = ({ formData, isActive, extraData }) => {
  const { categories = [] } = extraData || {};

  // Encontrar la categoría seleccionada
  const selectedCategory = categories.find((c) => c.id === formData.category);

  // Iconos para diferentes tipos de datos
  const getStatusIcon = (status) => {
    switch (status) {
      case VEHICLE_STATUS.ACTIVO:
        return '✅';
      case VEHICLE_STATUS.MANTENIMIENTO:
        return '🔧';
      case VEHICLE_STATUS.REPARACION:
        return '⚠️';
      case VEHICLE_STATUS.INACTIVO:
        return '⏸️';
      case VEHICLE_STATUS.FUERA_DE_SERVICIO:
        return '❌';
      default:
        return '❓';
    }
  };

  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case FUEL_TYPES.DIESEL:
        return '🛢️';
      case FUEL_TYPES.GASOLINE:
        return '⛽';
      case FUEL_TYPES.MIXED:
        return '🔄';
      default:
        return '❓';
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
      <div className="apple-card">
        {/* Pregunta principal */}
        <div className="apple-card">
          <h2>
            📋 ¡Perfecto! Revisa la información de{' '}
            <span className="apple-status-badge">{formData.name}</span>
          </h2>
          <p>Verifica que toda la información sea correcta antes de guardar el vehículo</p>
        </div>

        {/* Resumen en tarjetas */}
        <div className="apple-stats-grid">
          {/* Información básica */}
          <div className="apple-card">
            <div className="apple-card">
              <span className="apple-stat-card-icon">📝</span>
              <h3>Información Básica</h3>
            </div>
            <div className="apple-card">
              <div className="apple-card">
                <span className="apple-form-label">ID del vehículo:</span>
                <span className="apple-status-badge">{formData.vehicleId}</span>
              </div>
              <div className="apple-card">
                <span className="apple-form-label">Nombre:</span>
                <span className="apple-form-input">{formData.name}</span>
              </div>
              <div className="apple-card">
                <span className="apple-form-label">Marca y modelo:</span>
                <span className="apple-form-input">
                  {formData.brand} {formData.model}
                </span>
              </div>
              <div className="apple-card">
                <span className="apple-form-label">Año:</span>
                <span className="apple-form-input">{formData.year}</span>
              </div>
            </div>
          </div>

          {/* Categoría */}
          <div className="apple-card">
            <div className="apple-card">
              <span className="apple-stat-card-icon">{getCategoryIcon(selectedCategory)}</span>
              <h3>Categoría</h3>
            </div>
            <div className="apple-card">
              <div className="apple-card">
                <span className="apple-form-label">Tipo:</span>
                <span className="apple-form-input">
                  {selectedCategory?.name || 'No especificada'}
                </span>
              </div>
              {selectedCategory?.description && (
                <div className="apple-card">
                  <span className="apple-form-label">Descripción:</span>
                  <span className="apple-form-input">{selectedCategory.description}</span>
                </div>
              )}
            </div>
          </div>

          {/* Especificaciones técnicas */}
          <div className="apple-card">
            <div className="apple-card">
              <span className="apple-stat-card-icon">⚙️</span>
              <h3>Especificaciones Técnicas</h3>
            </div>
            <div className="apple-card">
              <div className="apple-card">
                <span className="apple-form-label">Tipo de combustible:</span>
                <span className="apple-form-input">
                  {getFuelIcon(formData.fuelType)} {formData.fuelType}
                </span>
              </div>
              {formData.plateNumber && (
                <div className="apple-card">
                  <span className="apple-form-label">Número de placa:</span>
                  <span className="apple-form-input">🏷️ {formData.plateNumber}</span>
                </div>
              )}
              {formData.enginePower && (
                <div className="apple-card">
                  <span className="apple-form-label">Potencia del motor:</span>
                  <span className="apple-form-input">⚡ {formData.enginePower} HP</span>
                </div>
              )}
              {formData.fuelCapacity && (
                <div className="apple-card">
                  <span className="apple-form-label">Capacidad de combustible:</span>
                  <span className="apple-form-input">⛽ {formData.fuelCapacity} L</span>
                </div>
              )}
            </div>
          </div>

          {/* Información operacional */}
          <div className="apple-card">
            <div className="apple-card">
              <span className="apple-stat-card-icon">🚀</span>
              <h3>Estado Operacional</h3>
            </div>
            <div className="apple-card">
              <div className="apple-card">
                <span className="apple-form-label">Estado actual:</span>
                <span className="apple-form-input">
                  {getStatusIcon(formData.status)} {formData.status}
                </span>
              </div>
              {formData.currentLocation && (
                <div className="apple-card">
                  <span className="apple-form-label">Ubicación:</span>
                  <span className="apple-form-input">📍 {formData.currentLocation}</span>
                </div>
              )}
              <div className="apple-card">
                <span className="apple-form-label">Horómetro:</span>
                <span className="apple-form-input">
                  {formData.hasHourMeter ? (
                    <>🕐 Sí {formData.currentHours ? `(${formData.currentHours} horas)` : ''}</>
                  ) : (
                    '❌ No'
                  )}
                </span>
              </div>
              {formData.lastMaintenanceDate && (
                <div className="apple-card">
                  <span className="apple-form-label">Último mantenimiento:</span>
                  <span className="apple-form-input">🔧 {formData.lastMaintenanceDate}</span>
                </div>
              )}
              {formData.purchaseDate && (
                <div className="apple-card">
                  <span className="apple-form-label">Fecha de compra:</span>
                  <span className="apple-form-input">📅 {formData.purchaseDate}</span>
                </div>
              )}
              {formData.description && (
                <div className="apple-card">
                  <span className="apple-form-label">Observaciones:</span>
                  <span className="apple-form-input">📝 {formData.description}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmación final */}
        <div className="apple-card">
          <div className="apple-card">
            <div className="apple-stat-card-icon">✅</div>
            <h3>¡Todo listo para guardar!</h3>
            <p>
              El vehículo <strong>{formData.name}</strong> ({formData.vehicleId}) se registrará en
              el sistema con toda la información proporcionada.
            </p>
            <div className="apple-action-buttons">
              <div className="apple-status-badge">
                💡 Puedes hacer clic en "Completar" o presionar Enter para finalizar
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="apple-card">
          <div className="apple-card">
            <span className="apple-stat-card-icon">🔄</span>
            <div className="apple-card">
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
