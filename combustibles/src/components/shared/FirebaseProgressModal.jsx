/**
 * FirebaseProgressModal - Modal transparente para mostrar progreso de operaciones Firebase
 * Proporciona feedback detallado al usuario durante procesos CRUD
 */

import React, { useState, useEffect } from 'react';
import './FirebaseProgressModal.css';

const FirebaseProgressModal = ({ isOpen, operation, onComplete, onError, showLogs = true }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [progress, setProgress] = useState(0);

  // Definir pasos según el tipo de operación
  const getOperationSteps = (operation) => {
    const baseSteps = {
      createMovement: [
        { key: 'validating', text: '🔍 Validando datos del movimiento...', duration: 800 },
        { key: 'checking', text: '📋 Verificando inventario disponible...', duration: 600 },
        { key: 'creating', text: '💾 Creando movimiento en base de datos...', duration: 1000 },
        { key: 'updating', text: '🔄 Actualizando inventario automáticamente...', duration: 900 },
        { key: 'syncing', text: '⚡ Sincronizando datos en tiempo real...', duration: 400 },
        { key: 'complete', text: '✅ Movimiento creado exitosamente', duration: 500 },
      ],
      updateMovement: [
        { key: 'validating', text: '🔍 Validando cambios...', duration: 600 },
        { key: 'reverting', text: '🔄 Revirtiendo cambios anteriores...', duration: 800 },
        { key: 'updating', text: '💾 Aplicando nuevos cambios...', duration: 900 },
        { key: 'syncing', text: '⚡ Sincronizando actualizaciones...', duration: 400 },
        { key: 'complete', text: '✅ Movimiento actualizado exitosamente', duration: 500 },
      ],
      deleteMovement: [
        { key: 'validating', text: '🔍 Verificando permisos de eliminación...', duration: 500 },
        { key: 'reverting', text: '🔄 Revirtiendo impacto en inventario...', duration: 900 },
        { key: 'deleting', text: '🗑️ Eliminando movimiento de la base de datos...', duration: 700 },
        { key: 'syncing', text: '⚡ Sincronizando cambios...', duration: 400 },
        { key: 'complete', text: '✅ Movimiento eliminado exitosamente', duration: 500 },
      ],
      createVehicle: [
        { key: 'validating', text: '🔍 Validando datos del vehículo...', duration: 700 },
        { key: 'checking', text: '🚗 Verificando ID único...', duration: 600 },
        { key: 'creating', text: '💾 Registrando vehículo en el sistema...', duration: 800 },
        { key: 'configuring', text: '⚙️ Configurando parámetros operacionales...', duration: 600 },
        { key: 'complete', text: '✅ Vehículo registrado exitosamente', duration: 500 },
      ],
      createInventory: [
        { key: 'validating', text: '🔍 Validando datos de inventario...', duration: 600 },
        { key: 'checking', text: '📦 Verificando duplicados en ubicación...', duration: 700 },
        { key: 'creating', text: '💾 Creando item de inventario...', duration: 800 },
        { key: 'initializing', text: '🔧 Configurando umbrales y alertas...', duration: 600 },
        { key: 'complete', text: '✅ Item de inventario creado exitosamente', duration: 500 },
      ],
      createSupplier: [
        { key: 'validating', text: '🔍 Validando datos del proveedor...', duration: 600 },
        { key: 'checking', text: '🏢 Verificando NIT y documentos...', duration: 700 },
        { key: 'creating', text: '💾 Registrando proveedor en el sistema...', duration: 800 },
        { key: 'complete', text: '✅ Proveedor registrado exitosamente', duration: 500 },
      ],
      createMaintenance: [
        { key: 'validating', text: '🔍 Validando datos de mantenimiento...', duration: 600 },
        { key: 'checking', text: '🔧 Verificando horómetro del vehículo...', duration: 700 },
        { key: 'creating', text: '💾 Registrando mantenimiento...', duration: 800 },
        { key: 'updating', text: '📊 Actualizando historial del vehículo...', duration: 600 },
        { key: 'complete', text: '✅ Mantenimiento registrado exitosamente', duration: 500 },
      ],
    };

    return (
      baseSteps[operation?.type] || [
        { key: 'processing', text: '⚡ Procesando solicitud...', duration: 1000 },
        { key: 'complete', text: '✅ Operación completada', duration: 500 },
      ]
    );
  };

  // Agregar log de manera temporal con ID único
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('es-CO', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setLogs((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`, // ID único para evitar duplicados
        message,
        type,
        timestamp,
      },
    ]);
  };

  // Ejecutar simulación de pasos
  useEffect(() => {
    if (!isOpen || !operation) return;

    console.log('🎭 FirebaseProgressModal EJECUTÁNDOSE:', { isOpen, operation });

    // Obtener steps dentro del useEffect para evitar dependencia
    const currentSteps = getOperationSteps(operation);
    let timeoutId;
    let stepIndex = 0;

    const executeSteps = () => {
      if (stepIndex < currentSteps.length) {
        const step = currentSteps[stepIndex];
        setCurrentStep(stepIndex);
        setProgress(((stepIndex + 1) / currentSteps.length) * 100);

        if (showLogs) {
          addLog(step.text, stepIndex === currentSteps.length - 1 ? 'success' : 'info');
        }

        if (stepIndex === currentSteps.length - 1) {
          // Último paso - completado
          setStatus('success');
          console.log('🎭 Modal completado, NO llamando onComplete automáticamente');
          // NO llamar onComplete automáticamente - dejar que el hook controle el cierre
          // setTimeout(() => {
          //   onComplete?.(operation);
          // }, step.duration);
        } else {
          // Continuar con el siguiente paso
          timeoutId = setTimeout(() => {
            stepIndex++;
            executeSteps();
          }, step.duration);
        }
      }
    };

    // Reset del estado
    setCurrentStep(0);
    setLogs([]);
    setStatus('processing');
    setProgress(0);

    // Iniciar log inicial
    if (showLogs) {
      addLog(`🚀 Iniciando operación: ${operation.description || operation.type}`, 'info');
    }

    // Comenzar ejecución de pasos
    executeSteps();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen, operation, onComplete, showLogs]); // ✅ FIXED: usar operation completo en lugar de propiedades específicas

  // Simular error (para testing)
  const simulateError = () => {
    setStatus('error');
    addLog('❌ Error al procesar la operación', 'error');
    onError?.('Error simulado durante la operación Firebase');
  };

  if (!isOpen) return null;

  return (
    <div className="firebase-progress-overlay">
      <div className="firebase-progress-modal">
        {/* Header */}
        <div className="progress-header">
          <div className="operation-icon">
            {status === 'processing' && '⚡'}
            {status === 'success' && '✅'}
            {status === 'error' && '❌'}
          </div>
          <h3 className="operation-title">
            {operation?.description || 'Procesando operación Firebase...'}
          </h3>
          <div className="operation-subtitle">
            {status === 'processing' && 'En progreso...'}
            {status === 'success' && 'Completado exitosamente'}
            {status === 'error' && 'Error en la operación'}
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">{Math.round(progress)}% completado</div>
        </div>

        {/* Paso actual */}
        <div className="current-step">
          {operation
            ? getOperationSteps(operation)[currentStep]?.text || 'Procesando...'
            : 'Cargando...'}
        </div>

        {/* Logs detallados */}
        {showLogs && (
          <div className="logs-container">
            <div className="logs-header">
              <span>📋 Logs detallados</span>
              <span className="logs-count">{logs.length} eventos</span>
            </div>
            <div className="logs-list">
              {logs.map((log) => (
                <div key={log.id} className={`log-entry ${log.type}`}>
                  <span className="log-timestamp">[{log.timestamp}]</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="progress-actions">
          {status === 'processing' && (
            <button className="btn-simulate-error" onClick={simulateError}>
              Simular Error
            </button>
          )}
          {(status === 'success' || status === 'error') && (
            <button
              className="btn-close"
              onClick={() => {
                console.log('🎭 Usuario clickeó cerrar modal');
                onComplete?.(operation);
              }}
            >
              Cerrar Manual
            </button>
          )}
        </div>

        {/* Indicador de tiempo estimado */}
        {status === 'processing' && operation && (
          <div className="time-estimate">
            ⏱️ Tiempo estimado:{' '}
            {Math.ceil((getOperationSteps(operation).length - currentStep) * 0.7)} segundos
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseProgressModal;
