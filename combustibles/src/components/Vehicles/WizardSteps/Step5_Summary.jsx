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
      <div className="typeform-layout sap-theme">
        {/* Pregunta principal */}
        <div className="typeform-question sap-theme">
          <h2>
            📋 ¡Perfecto! Revisa la información de{' '}
            <span className="highlight sap-theme">{formData.name}</span>
          </h2>
          <p>Verifica que toda la información sea correcta antes de guardar el vehículo</p>
        </div>

        {/* Resumen en tarjetas */}
        <div className="summary-sections sap-theme">
          {/* Información básica */}
          <div className="summary-card sap-theme">
            <div className="summary-header sap-theme">
              <span className="summary-icon sap-theme">📝</span>
              <h3>Información Básica</h3>
            </div>
            <div className="summary-content sap-theme">
              <div className="summary-item sap-theme">
                <span className="item-label sap-theme">ID del vehículo:</span>
                <span className="item-value highlight sap-theme">{formData.vehicleId}</span>
              </div>
              <div className="summary-item sap-theme">
                <span className="item-label sap-theme">Nombre:</span>
                <span className="item-value sap-theme">{formData.name}</span>
              </div>
              <div className="summary-item sap-theme">
                <span className="item-label sap-theme">Marca y modelo:</span>
                <span className="item-value sap-theme">
                  {formData.brand} {formData.model}
                </span>
              </div>
              <div className="summary-item sap-theme">
                <span className="item-label sap-theme">Año:</span>
                <span className="item-value sap-theme">{formData.year}</span>
              </div>
            </div>
          </div>

          {/* Categoría */}
          <div className="summary-card sap-theme">
            <div className="summary-header sap-theme">
              <span className="summary-icon sap-theme">{getCategoryIcon(selectedCategory)}</span>
              <h3>Categoría</h3>
            </div>
            <div className="summary-content sap-theme">
              <div className="summary-item sap-theme">
                <span className="item-label sap-theme">Tipo:</span>
                <span className="item-value sap-theme">
                  {selectedCategory?.name || 'No especificada'}
                </span>
              </div>
              {selectedCategory?.description && (
                <div className="summary-item sap-theme">
                  <span className="item-label sap-theme">Descripción:</span>
                  <span className="item-value sap-theme">{selectedCategory.description}</span>
                </div>
              )}
            </div>
          </div>

          {/* Especificaciones técnicas */}
          <div className="summary-card sap-theme">
            <div className="summary-header sap-theme">
              <span className="summary-icon sap-theme">⚙️</span>
              <h3>Especificaciones Técnicas</h3>
            </div>
            <div className="summary-content sap-theme">
              <div className="summary-item sap-theme">
                <span className="item-label sap-theme">Tipo de combustible:</span>
                <span className="item-value sap-theme">
                  {getFuelIcon(formData.fuelType)} {formData.fuelType}
                </span>
              </div>
              {formData.plateNumber && (
                <div className="summary-item sap-theme">
                  <span className="item-label sap-theme">Número de placa:</span>
                  <span className="item-value sap-theme">🏷️ {formData.plateNumber}</span>
                </div>
              )}
              {formData.enginePower && (
                <div className="summary-item sap-theme">
                  <span className="item-label sap-theme">Potencia del motor:</span>
                  <span className="item-value sap-theme">⚡ {formData.enginePower} HP</span>
                </div>
              )}
              {formData.fuelCapacity && (
                <div className="summary-item sap-theme">
                  <span className="item-label sap-theme">Capacidad de combustible:</span>
                  <span className="item-value sap-theme">⛽ {formData.fuelCapacity} L</span>
                </div>
              )}
            </div>
          </div>

          {/* Información operacional */}
          <div className="summary-card sap-theme">
            <div className="summary-header sap-theme">
              <span className="summary-icon sap-theme">🚀</span>
              <h3>Estado Operacional</h3>
            </div>
            <div className="summary-content sap-theme">
              <div className="summary-item sap-theme">
                <span className="item-label sap-theme">Estado actual:</span>
                <span className="item-value sap-theme">
                  {getStatusIcon(formData.status)} {formData.status}
                </span>
              </div>
              {formData.currentLocation && (
                <div className="summary-item sap-theme">
                  <span className="item-label sap-theme">Ubicación:</span>
                  <span className="item-value sap-theme">📍 {formData.currentLocation}</span>
                </div>
              )}
              <div className="summary-item sap-theme">
                <span className="item-label sap-theme">Horómetro:</span>
                <span className="item-value sap-theme">
                  {formData.hasHourMeter ? (
                    <>🕐 Sí {formData.currentHours ? `(${formData.currentHours} horas)` : ''}</>
                  ) : (
                    '❌ No'
                  )}
                </span>
              </div>
              {formData.lastMaintenanceDate && (
                <div className="summary-item sap-theme">
                  <span className="item-label sap-theme">Último mantenimiento:</span>
                  <span className="item-value sap-theme">🔧 {formData.lastMaintenanceDate}</span>
                </div>
              )}
              {formData.purchaseDate && (
                <div className="summary-item sap-theme">
                  <span className="item-label sap-theme">Fecha de compra:</span>
                  <span className="item-value sap-theme">📅 {formData.purchaseDate}</span>
                </div>
              )}
              {formData.description && (
                <div className="summary-item sap-theme">
                  <span className="item-label sap-theme">Observaciones:</span>
                  <span className="item-value sap-theme">📝 {formData.description}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmación final */}
        <div className="confirmation-section sap-theme">
          <div className="confirmation-card sap-theme">
            <div className="confirmation-icon sap-theme">✅</div>
            <h3>¡Todo listo para guardar!</h3>
            <p>
              El vehículo <strong>{formData.name}</strong> ({formData.vehicleId}) se registrará en
              el sistema con toda la información proporcionada.
            </p>
            <div className="confirmation-actions sap-theme">
              <div className="action-hint sap-theme">
                💡 Puedes hacer clic en "Completar" o presionar Enter para finalizar
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="info-section sap-theme">
          <div className="info-card sap-theme">
            <span className="info-icon sap-theme">🔄</span>
            <div className="info-content sap-theme">
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
