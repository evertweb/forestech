/**
 * DirectMigrationPanel - Panel de migración directa sin problemas de permisos
 * Utiliza Firebase con reglas temporales permisivas
 */

import React, { useState } from 'react';
import './Migration.css';
import { executeRealDataMigration } from '../../services/realDataMigrationService';

const DirectMigrationPanel = () => {
  const [migrationState, setMigrationState] = useState({
    status: 'ready', // ready, running, completed, error
    progress: 0,
    currentStep: '',
    result: null,
    error: null
  });

  /**
   * Ejecutar migración directa
   */
  const handleDirectMigration = async () => {
    try {
      setMigrationState({
        status: 'running',
        progress: 0,
        currentStep: 'Iniciando migración directa...',
        result: null,
        error: null
      });

      const result = await executeRealDataMigration((progressData) => {
        setMigrationState(prev => ({
          ...prev,
          progress: progressData.progress,
          currentStep: progressData.step
        }));
      });

      setMigrationState({
        status: 'completed',
        progress: 100,
        currentStep: '¡Migración completada exitosamente!',
        result: result,
        error: null
      });

    } catch (error) {
      console.error('❌ Error en migración directa:', error);
      setMigrationState({
        status: 'error',
        progress: 0,
        currentStep: 'Error en migración',
        result: null,
        error: error.message
      });
    }
  };

  /**
   * Resetear estado
   */
  const handleReset = () => {
    setMigrationState({
      status: 'ready',
      progress: 0,
      currentStep: '',
      result: null,
      error: null
    });
  };

  return (
    <div className="migration-panel">
      <div className="migration-header">
        <h2>🚀 Migración COMPLETA de Datos Reales</h2>
        <p className="migration-description">
          Migra TODOS los 1,446+ movimientos reales extraídos de Google Sheets usando acceso directo sin problemas de permisos.
        </p>
      </div>

      {/* Estado Ready */}
      {migrationState.status === 'ready' && (
        <div className="migration-ready">
          <div className="migration-info">
            <h3>📋 ¿Qué se va a migrar?</h3>
            <div className="migration-items">
              <div className="migration-item">
                <span className="item-icon">🚜</span>
                <div className="item-details">
                  <h4>Vehículos Históricos</h4>
                  <p>TR-1, TR-2, TR-3, VOLQUETA, camionetas y equipos</p>
                </div>
              </div>
              <div className="migration-item">
                <span className="item-icon">🔄</span>
                <div className="item-details">
                  <h4>1,446+ Movimientos REALES</h4>
                  <p>Datos extraídos directamente de Google Sheets "COMBUSTIBLE 2025"</p>
                </div>
              </div>
              <div className="migration-item">
                <span className="item-icon">⏱️</span>
                <div className="item-details">
                  <h4>Horómetros Actualizados Abril 2025</h4>
                  <p>TR-1: 9,173h | TR-2: 7,401h | TR-3: 3,860h (datos reales)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="migration-warning">
            <h4>⚠️ Importante:</h4>
            <ul>
              <li>Esta migración usa acceso administrativo directo</li>
              <li>Los datos existentes se preservarán intactos</li>
              <li>Solo se crearán registros que no existan</li>
              <li>El proceso es reversible</li>
            </ul>
          </div>

          <button 
            className="btn-migration-start"
            onClick={handleDirectMigration}
          >
            🚀 Migrar TODOS los Datos Reales (1,446+ movimientos)
          </button>
        </div>
      )}

      {/* Estado Running */}
      {migrationState.status === 'running' && (
        <div className="migration-running">
          <div className="migration-progress">
            <h3>🔄 Migración en Progreso...</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${migrationState.progress}%` }}
              ></div>
            </div>
            <p className="progress-text">
              {migrationState.progress}% - {migrationState.currentStep}
            </p>
          </div>

          <div className="migration-live-log">
            <h4>📊 Progreso en Tiempo Real:</h4>
            <div className="log-item active">
              <span className="log-icon">⚡</span>
              <span>{migrationState.currentStep}</span>
            </div>
          </div>
        </div>
      )}

      {/* Estado Completed */}
      {migrationState.status === 'completed' && (
        <div className="migration-completed">
          <div className="success-header">
            <span className="success-icon">🎉</span>
            <h3>¡Migración Completada Exitosamente!</h3>
          </div>

          {migrationState.result && (
            <div className="migration-summary">
              <h4>📊 Resumen de Migración:</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Vehículos Creados:</span>
                  <span className="summary-value">
                    {migrationState.result.summary.vehicles.created}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Vehículos Existentes:</span>
                  <span className="summary-value">
                    {migrationState.result.summary.vehicles.existing}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Movimientos Creados:</span>
                  <span className="summary-value">
                    {migrationState.result.summary.movements.created}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">ID de Migración:</span>
                  <span className="summary-value migration-id">
                    {migrationState.result.migrationId}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="next-steps">
            <h4>🎯 Próximos Pasos Recomendados:</h4>
            <ol>
              <li>Verificar los datos migrados en el Dashboard</li>
              <li>Revisar vehículos con horómetros actualizados</li>
              <li>Validar movimientos históricos en Reportes</li>
              <li>Configurar alertas de mantenimiento</li>
            </ol>
          </div>

          <button 
            className="btn-migration-reset"
            onClick={handleReset}
          >
            🔄 Nueva Migración
          </button>
        </div>
      )}

      {/* Estado Error */}
      {migrationState.status === 'error' && (
        <div className="migration-error">
          <div className="error-header">
            <span className="error-icon">❌</span>
            <h3>Error en Migración</h3>
          </div>

          <div className="error-details">
            <p><strong>Detalle del Error:</strong></p>
            <code className="error-message">{migrationState.error}</code>
          </div>

          <div className="error-solutions">
            <h4>🛠️ Posibles Soluciones:</h4>
            <ul>
              <li>Verificar conexión a Internet</li>
              <li>Comprobar autenticación Firebase</li>
              <li>Revisar reglas de seguridad</li>
              <li>Intentar nuevamente en unos minutos</li>
            </ul>
          </div>

          <button 
            className="btn-migration-retry"
            onClick={handleReset}
          >
            🔄 Intentar Nuevamente
          </button>
        </div>
      )}
    </div>
  );
};

export default DirectMigrationPanel;