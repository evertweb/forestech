/**
 * Step5_Execution.jsx - Componente para ejecución final de migración
 * Quinto paso del wizard: ejecutar migración con progreso en tiempo real
 */

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { 
  Play, 
  Pause,
  Square,
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  Info,
  RotateCcw,
  Download,
  ExternalLink,
  Clock,
  Database,
  Users,
  Package,
  TrendingUp,
  Activity,
  FileText,
  Home,
  RefreshCw,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import migrationManager from '../../../services/migrationManager';

/**
 * Estados de ejecución
 */
const EXECUTION_STATES = {
  READY: 'ready',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

/**
 * Componente para ejecución final de migración
 */
const Step5_Execution = ({ 
  validationResult,
  valueMapping = {},
  onExecutionComplete,
  onNavigateToStep,
  currentExecution = null,
  canExecute = true,
  error = null 
}) => {
  const [executionState, setExecutionState] = useState(EXECUTION_STATES.READY);
  const [executionResult, setExecutionResult] = useState(currentExecution);
  const [progress, setProgress] = useState({ progress: 0, processedRows: 0, totalRows: 0, currentStep: '' });
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [logs, setLogs] = useState([]);
  const [showDetailedLogs, setShowDetailedLogs] = useState(false);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(null);

  // Refs para control de ejecución
  const executionRef = useRef(null);
  const intervalRef = useRef(null);

  /**
   * Efecto para manejar timer de tiempo transcurrido
   */
  useEffect(() => {
    if (executionState === EXECUTION_STATES.RUNNING && startTime) {
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setElapsedTime(elapsed);

        // Calcular tiempo estimado restante
        if (progress.progress > 0) {
          const totalEstimated = (elapsed / progress.progress) * 100;
          const remaining = totalEstimated - elapsed;
          setEstimatedTimeRemaining(remaining > 0 ? remaining : 0);
        }
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [executionState, startTime, progress.progress]);

  /**
   * Limpiar timer al desmontar componente
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Agregar log de ejecución
   */
  const addLog = useCallback((message, type = 'info') => {
    const logEntry = {
      id: Date.now(),
      timestamp: new Date(),
      message,
      type
    };
    setLogs(prev => [...prev, logEntry]);
  }, []);

  /**
   * Callback de progreso para migrationManager
   */
  const progressCallback = useCallback((progressData) => {
    setProgress(progressData);
    addLog(`${progressData.currentStep} - ${progressData.processedRows}/${progressData.totalRows} filas`, 'progress');
  }, [addLog]);

  /**
   * Ejecutar migración
   */
  const handleStartExecution = async () => {
    if (!validationResult || !canExecute) return;

    try {
      setExecutionState(EXECUTION_STATES.RUNNING);
      setStartTime(Date.now());
      setProgress({ progress: 0, processedRows: 0, totalRows: validationResult.statistics.validRows, currentStep: 'Iniciando...' });
      setLogs([]);
      setElapsedTime(0);
      setEstimatedTimeRemaining(null);

      addLog('🚀 Iniciando migración de datos...', 'info');
      addLog(`📊 Total de filas válidas a procesar: ${validationResult.statistics.validRows}`, 'info');

      if (validationResult.statistics.newVehicles.length > 0) {
        addLog(`🚛 Se crearán ${validationResult.statistics.newVehicles.length} vehículos nuevos`, 'info');
      }

      if (validationResult.statistics.newProducts.length > 0) {
        addLog(`⛽ Se crearán ${validationResult.statistics.newProducts.length} productos nuevos`, 'info');
      }

      // Ejecutar migración
      const result = await migrationManager.executeMigration(
        validationResult,
        valueMapping,
        progressCallback
      );

      if (result.success) {
        setExecutionState(EXECUTION_STATES.COMPLETED);
        setExecutionResult(result.executionResult);
        addLog('✅ Migración completada exitosamente', 'success');
        addLog(`📈 Estadísticas finales: ${result.executionResult.statistics.successfulRows} movimientos creados`, 'success');
        onExecutionComplete(result.executionResult);
      } else {
        setExecutionState(EXECUTION_STATES.FAILED);
        addLog(`❌ Error en migración: ${result.error}`, 'error');
      }

    } catch (error) {
      console.error('Error ejecutando migración:', error);
      setExecutionState(EXECUTION_STATES.FAILED);
      addLog(`❌ Error inesperado: ${error.message}`, 'error');
    }
  };

  /**
   * Pausar ejecución (simulado - el backend no soporta pausa real)
   */
  const handlePauseExecution = () => {
    setExecutionState(EXECUTION_STATES.PAUSED);
    addLog('⏸️ Ejecución pausada por el usuario', 'warning');
  };

  /**
   * Reanudar ejecución
   */
  const handleResumeExecution = () => {
    setExecutionState(EXECUTION_STATES.RUNNING);
    addLog('▶️ Reanudando ejecución...', 'info');
  };

  /**
   * Cancelar ejecución
   */
  const handleCancelExecution = () => {
    setExecutionState(EXECUTION_STATES.CANCELLED);
    addLog('🛑 Ejecución cancelada por el usuario', 'warning');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  /**
   * Reiniciar para nueva ejecución
   */
  const handleResetExecution = () => {
    setExecutionState(EXECUTION_STATES.READY);
    setExecutionResult(null);
    setProgress({ progress: 0, processedRows: 0, totalRows: 0, currentStep: '' });
    setStartTime(null);
    setElapsedTime(0);
    setEstimatedTimeRemaining(null);
    setLogs([]);
  };

  /**
   * Exportar logs de ejecución
   */
  const handleExportLogs = () => {
    const exportData = {
      executionResult,
      logs,
      progress,
      elapsedTime,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migracion_logs_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Formatear tiempo
   */
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  /**
   * Calcular estadísticas de rendimiento
   */
  const performanceStats = useMemo(() => {
    if (!executionResult || !elapsedTime) return null;

    const rowsPerSecond = executionResult.statistics.processedRows / (elapsedTime / 1000);
    const successRate = executionResult.statistics.totalRows > 0 
      ? (executionResult.statistics.successfulRows / executionResult.statistics.totalRows) * 100 
      : 0;

    return {
      rowsPerSecond: Math.round(rowsPerSecond * 100) / 100,
      successRate: Math.round(successRate * 100) / 100,
      totalTime: formatTime(elapsedTime),
      averageTimePerRow: Math.round((elapsedTime / executionResult.statistics.processedRows) * 100) / 100
    };
  }, [executionResult, elapsedTime]);

  /**
   * Renderizar estado pre-ejecución
   */
  const renderPreExecution = () => (
    <div className="pre-execution">
      <div className="execution-summary">
        <h3>🚀 ¿Listo para ejecutar la migración?</h3>
        <p>Se procesarán <strong>{validationResult.statistics.validRows} filas válidas</strong> y se crearán los siguientes elementos:</p>
        
        <div className="summary-grid">
          <div className="summary-item">
            <Database size={24} />
            <div>
              <h4>{validationResult.statistics.validRows}</h4>
              <p>Movimientos de combustible</p>
            </div>
          </div>
          
          {validationResult.statistics.newVehicles.length > 0 && (
            <div className="summary-item">
              <Users size={24} />
              <div>
                <h4>{validationResult.statistics.newVehicles.length}</h4>
                <p>Vehículos nuevos</p>
              </div>
            </div>
          )}
          
          {validationResult.statistics.newProducts.length > 0 && (
            <div className="summary-item">
              <Package size={24} />
              <div>
                <h4>{validationResult.statistics.newProducts.length}</h4>
                <p>Productos nuevos</p>
              </div>
            </div>
          )}
        </div>

        <div className="execution-warning">
          <AlertTriangle size={20} />
          <div>
            <h4>⚠️ Importante</h4>
            <p>Esta acción <strong>modificará permanentemente</strong> la base de datos. Asegúrate de que la validación sea correcta.</p>
          </div>
        </div>

        <div className="execution-actions">
          <button 
            className="btn-secondary"
            onClick={() => onNavigateToStep(4)}
          >
            <RotateCcw size={16} />
            Volver a validación
          </button>
          <button 
            className="btn-primary"
            onClick={handleStartExecution}
            disabled={!canExecute}
          >
            <Play size={16} />
            Ejecutar migración
          </button>
        </div>
      </div>
    </div>
  );

  /**
   * Renderizar progreso de ejecución
   */
  const renderExecutionProgress = () => (
    <div className="execution-progress">
      {/* Header de progreso */}
      <div className="progress-header">
        <div className="progress-status">
          <Activity size={24} className="status-icon running" />
          <div className="status-content">
            <h3>Migración en progreso...</h3>
            <p>{progress.currentStep}</p>
          </div>
        </div>

        <div className="progress-controls">
          {executionState === EXECUTION_STATES.RUNNING && (
            <>
              <button className="btn-icon" onClick={handlePauseExecution}>
                <Pause size={16} />
              </button>
              <button className="btn-icon danger" onClick={handleCancelExecution}>
                <Square size={16} />
              </button>
            </>
          )}
          {executionState === EXECUTION_STATES.PAUSED && (
            <button className="btn-primary" onClick={handleResumeExecution}>
              <Play size={16} />
              Reanudar
            </button>
          )}
        </div>
      </div>

      {/* Barra de progreso principal */}
      <div className="main-progress">
        <div className="progress-info">
          <span>{progress.processedRows} / {progress.totalRows} filas procesadas</span>
          <span>{Math.round(progress.progress)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Estadísticas en tiempo real */}
      <div className="real-time-stats">
        <div className="stat-item">
          <Clock size={16} />
          <span>Tiempo transcurrido: {formatTime(elapsedTime)}</span>
        </div>
        
        {estimatedTimeRemaining !== null && (
          <div className="stat-item">
            <Target size={16} />
            <span>Tiempo estimado restante: {formatTime(estimatedTimeRemaining)}</span>
          </div>
        )}
        
        <div className="stat-item">
          <TrendingUp size={16} />
          <span>Velocidad: {Math.round((progress.processedRows / (elapsedTime / 1000)) * 10) / 10} filas/seg</span>
        </div>
      </div>

      {/* Logs en tiempo real */}
      <div className="execution-logs">
        <div className="logs-header">
          <h4>
            <FileText size={16} />
            Registro de ejecución
          </h4>
          <button 
            className="btn-secondary"
            onClick={() => setShowDetailedLogs(!showDetailedLogs)}
          >
            {showDetailedLogs ? 'Ocultar' : 'Mostrar'} detalles
          </button>
        </div>

        <div className={`logs-container ${showDetailedLogs ? 'detailed' : 'compact'}`}>
          {logs.slice(-10).map(log => (
            <div key={log.id} className={`log-entry ${log.type}`}>
              <span className="log-time">
                {log.timestamp.toLocaleTimeString('es-CO')}
              </span>
              <span className="log-message">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /**
   * Renderizar resultados finales
   */
  const renderResults = () => {
    const isSuccess = executionState === EXECUTION_STATES.COMPLETED;
    const stats = executionResult?.statistics;

    return (
      <div className="execution-results">
        {/* Header de resultados */}
        <div className="results-header">
          <div className="results-status">
            {isSuccess ? (
              <CheckCircle size={48} className="success" />
            ) : (
              <AlertCircle size={48} className="error" />
            )}
            <div className="status-content">
              <h3>
                {isSuccess ? '🎉 ¡Migración completada exitosamente!' : '❌ Migración falló'}
              </h3>
              <p>
                {isSuccess 
                  ? `Se procesaron ${stats?.processedRows || 0} filas con ${stats?.successfulRows || 0} movimientos creados`
                  : 'La migración no pudo completarse. Revisa los errores para más información.'
                }
              </p>
            </div>
          </div>

          <div className="results-actions">
            <button className="btn-secondary" onClick={handleExportLogs}>
              <Download size={16} />
              Exportar logs
            </button>
            <button className="btn-secondary" onClick={handleResetExecution}>
              <RefreshCw size={16} />
              Nueva migración
            </button>
            <button className="btn-primary" onClick={() => window.location.href = '/combustibles'}>
              <Home size={16} />
              Ir al sistema
            </button>
          </div>
        </div>

        {/* Estadísticas detalladas */}
        {isSuccess && stats && (
          <div className="results-stats">
            <h4>📊 Estadísticas finales</h4>
            
            <div className="stats-grid">
              <div className="stat-card success">
                <div className="stat-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="stat-content">
                  <h3>{stats.successfulRows}</h3>
                  <p>Movimientos creados</p>
                </div>
              </div>

              <div className="stat-card info">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <h3>{stats.newVehiclesCreated}</h3>
                  <p>Vehículos creados</p>
                </div>
              </div>

              <div className="stat-card info">
                <div className="stat-icon">
                  <Package size={24} />
                </div>
                <div className="stat-content">
                  <h3>{stats.newProductsCreated}</h3>
                  <p>Productos creados</p>
                </div>
              </div>

              {stats.failedRows > 0 && (
                <div className="stat-card warning">
                  <div className="stat-icon">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="stat-content">
                    <h3>{stats.failedRows}</h3>
                    <p>Filas fallidas</p>
                  </div>
                </div>
              )}
            </div>

            {/* Estadísticas de rendimiento */}
            {performanceStats && (
              <div className="performance-stats">
                <h5>⚡ Rendimiento</h5>
                <div className="performance-grid">
                  <div className="perf-item">
                    <span className="perf-label">Tiempo total:</span>
                    <span className="perf-value">{performanceStats.totalTime}</span>
                  </div>
                  <div className="perf-item">
                    <span className="perf-label">Velocidad promedio:</span>
                    <span className="perf-value">{performanceStats.rowsPerSecond} filas/seg</span>
                  </div>
                  <div className="perf-item">
                    <span className="perf-label">Tasa de éxito:</span>
                    <span className="perf-value">{performanceStats.successRate}%</span>
                  </div>
                  <div className="perf-item">
                    <span className="perf-label">Tiempo por fila:</span>
                    <span className="perf-value">{performanceStats.averageTimePerRow}ms</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Errores y advertencias */}
        {executionResult?.errors && executionResult.errors.length > 0 && (
          <div className="results-issues">
            <h4>❌ Errores encontrados</h4>
            <div className="issues-list">
              {executionResult.errors.slice(0, 10).map((error, index) => (
                <div key={index} className="issue-item error">
                  {error}
                </div>
              ))}
              {executionResult.errors.length > 10 && (
                <div className="issue-item info">
                  ... y {executionResult.errors.length - 10} errores más
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logs completos */}
        <div className="complete-logs">
          <h4>📋 Registro completo</h4>
          <div className="logs-container">
            {logs.map(log => (
              <div key={log.id} className={`log-entry ${log.type}`}>
                <span className="log-time">
                  {log.timestamp.toLocaleTimeString('es-CO')}
                </span>
                <span className="log-message">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="execution-step">
      {/* Información del paso */}
      <div className="step-info-card">
        <Info size={20} className="text-blue-500" />
        <div>
          <h4>Ejecución de migración</h4>
          <p>
            {executionState === EXECUTION_STATES.READY && 'Confirma la ejecución para procesar los datos validados.'}
            {executionState === EXECUTION_STATES.RUNNING && 'La migración está en progreso. No cierres esta ventana.'}
            {executionState === EXECUTION_STATES.COMPLETED && 'Migración completada. Revisa los resultados.'}
            {executionState === EXECUTION_STATES.FAILED && 'La migración falló. Revisa los errores reportados.'}
            {executionState === EXECUTION_STATES.CANCELLED && 'Migración cancelada por el usuario.'}
          </p>
        </div>
      </div>

      {/* Contenido según estado */}
      {executionState === EXECUTION_STATES.READY && renderPreExecution()}
      {(executionState === EXECUTION_STATES.RUNNING || executionState === EXECUTION_STATES.PAUSED) && renderExecutionProgress()}
      {(executionState === EXECUTION_STATES.COMPLETED || executionState === EXECUTION_STATES.FAILED || executionState === EXECUTION_STATES.CANCELLED) && renderResults()}

      {/* Error display */}
      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Step5_Execution;