/**
 * MigrationProgress - Componente para mostrar el progreso de migración en tiempo real
 * Muestra estadísticas detalladas y progreso por cada fase
 */

import React from 'react';
import './Migration.css';

const MigrationProgress = ({ progress }) => {
  if (!progress) return null;

  const calculateOverallProgress = () => {
    const totalItems = progress.vehicles.total + progress.products.total + 
                     progress.movements.total + progress.maintenance.total;
    const processedItems = progress.vehicles.processed + progress.products.processed + 
                          progress.movements.processed + progress.maintenance.processed;
    
    return totalItems > 0 ? Math.round((processedItems / totalItems) * 100) : 0;
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="migration-progress">
      <div className="progress-header">
        <h3>🔄 Progreso de Migración</h3>
        <div className="current-step">
          <strong>{progress.currentStep}</strong>
          {progress.currentStepNumber && (
            <span className="step-counter">
              Paso {progress.currentStepNumber} de {progress.totalSteps}
            </span>
          )}
        </div>
      </div>

      {/* Barra de progreso general */}
      <div className="overall-progress">
        <div className="progress-label">
          Progreso General: {overallProgress}%
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Progreso detallado por categoría */}
      <div className="detailed-progress">
        
        {/* Vehículos */}
        <div className="progress-category">
          <div className="category-header">
            <span className="category-icon">🚗</span>
            <span className="category-name">Vehículos</span>
            <span className="category-stats">
              {progress.vehicles.processed}/{progress.vehicles.total}
              {progress.vehicles.errors > 0 && (
                <span className="error-count"> ({progress.vehicles.errors} errores)</span>
              )}
            </span>
          </div>
          {progress.vehicles.total > 0 && (
            <div className="progress-bar small">
              <div 
                className="progress-fill vehicles" 
                style={{ 
                  width: `${(progress.vehicles.processed / progress.vehicles.total) * 100}%` 
                }}
              />
            </div>
          )}
        </div>

        {/* Productos */}
        <div className="progress-category">
          <div className="category-header">
            <span className="category-icon">📦</span>
            <span className="category-name">Productos</span>
            <span className="category-stats">
              {progress.products.processed}/{progress.products.total}
              {progress.products.errors > 0 && (
                <span className="error-count"> ({progress.products.errors} errores)</span>
              )}
            </span>
          </div>
          {progress.products.total > 0 && (
            <div className="progress-bar small">
              <div 
                className="progress-fill products" 
                style={{ 
                  width: `${(progress.products.processed / progress.products.total) * 100}%` 
                }}
              />
            </div>
          )}
        </div>

        {/* Movimientos */}
        <div className="progress-category">
          <div className="category-header">
            <span className="category-icon">🔄</span>
            <span className="category-name">Movimientos</span>
            <span className="category-stats">
              {progress.movements.processed}/{progress.movements.total}
              {progress.movements.errors > 0 && (
                <span className="error-count"> ({progress.movements.errors} errores)</span>
              )}
            </span>
          </div>
          {progress.movements.total > 0 && (
            <div className="progress-bar small">
              <div 
                className="progress-fill movements" 
                style={{ 
                  width: `${(progress.movements.processed / progress.movements.total) * 100}%` 
                }}
              />
            </div>
          )}
        </div>

        {/* Mantenimiento */}
        <div className="progress-category">
          <div className="category-header">
            <span className="category-icon">🔧</span>
            <span className="category-name">Mantenimiento</span>
            <span className="category-stats">
              {progress.maintenance.processed}/{progress.maintenance.total}
              {progress.maintenance.errors > 0 && (
                <span className="error-count"> ({progress.maintenance.errors} errores)</span>
              )}
            </span>
          </div>
          {progress.maintenance.total > 0 && (
            <div className="progress-bar small">
              <div 
                className="progress-fill maintenance" 
                style={{ 
                  width: `${(progress.maintenance.processed / progress.maintenance.total) * 100}%` 
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas en tiempo real */}
      <div className="migration-stats">
        <div className="stat-item">
          <div className="stat-value">
            {progress.vehicles.processed + progress.products.processed + 
             progress.movements.processed + progress.maintenance.processed}
          </div>
          <div className="stat-label">Elementos procesados</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">
            {progress.vehicles.total + progress.products.total + 
             progress.movements.total + progress.maintenance.total}
          </div>
          <div className="stat-label">Total elementos</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value error">
            {progress.vehicles.errors + progress.products.errors + 
             progress.movements.errors + progress.maintenance.errors}
          </div>
          <div className="stat-label">Errores</div>
        </div>

        <div className="stat-item">
          <div className="stat-value warning">
            {progress.warnings?.length || 0}
          </div>
          <div className="stat-label">Advertencias</div>
        </div>
      </div>

      {/* Errores recientes */}
      {progress.errors && progress.errors.length > 0 && (
        <div className="recent-errors">
          <h4>❌ Errores recientes:</h4>
          <div className="error-list">
            {progress.errors.slice(-3).map((error, index) => (
              <div key={index} className="error-item">
                <span className="error-type">{error.type}:</span>
                <span className="error-message">{error.message}</span>
                {error.vehicleId && (
                  <span className="error-context">Vehículo: {error.vehicleId}</span>
                )}
                {error.productCode && (
                  <span className="error-context">Producto: {error.productCode}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advertencias recientes */}
      {progress.warnings && progress.warnings.length > 0 && (
        <div className="recent-warnings">
          <h4>⚠️ Advertencias recientes:</h4>
          <div className="warning-list">
            {progress.warnings.slice(-3).map((warning, index) => (
              <div key={index} className="warning-item">
                {warning}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado de migración */}
      <div className="migration-status">
        {overallProgress === 100 ? (
          <div className="status-completed">
            ✅ Migración completada exitosamente
          </div>
        ) : (
          <div className="status-in-progress">
            🔄 Migración en progreso... {overallProgress}%
          </div>
        )}
      </div>
    </div>
  );
};

export default MigrationProgress;