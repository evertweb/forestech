/**
 * FirebaseProgressModal - Modal transparente para mostrar progreso de operaciones Firebase
 * Proporciona feedback detallado al usuario durante procesos CRUD
 */

import React, { useState, useEffect } from 'react';
import './FirebaseProgressModal.css';

const FirebaseProgressModal = ({
  isOpen,
  operation,
  onComplete,
  onError, // eslint-disable-line no-unused-vars
  showLogs = true,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [progress, setProgress] = useState(0);

  // Definir pasos según el tipo de operación (estilo terminal)
  const getOperationSteps = (operation) => {
    const baseSteps = {
      createMovement: [
        { key: 'validating', text: 'validating movement data...', duration: 800 },
        { key: 'checking', text: 'checking inventory availability...', duration: 600 },
        { key: 'creating', text: 'creating movement record...', duration: 1000 },
        { key: 'updating', text: 'updating inventory database...', duration: 900 },
        { key: 'syncing', text: 'syncing real-time data...', duration: 400 },
        { key: 'complete', text: 'movement created successfully', duration: 500 },
      ],
      updateMovement: [
        { key: 'validating', text: 'validating changes...', duration: 600 },
        { key: 'reverting', text: 'reverting previous changes...', duration: 800 },
        { key: 'updating', text: 'applying new changes...', duration: 900 },
        { key: 'syncing', text: 'syncing updates...', duration: 400 },
        { key: 'complete', text: 'movement updated successfully', duration: 500 },
      ],
      deleteMovement: [
        { key: 'validating', text: 'checking deletion permissions...', duration: 500 },
        { key: 'reverting', text: 'reverting inventory impact...', duration: 900 },
        { key: 'deleting', text: 'deleting from database...', duration: 700 },
        { key: 'syncing', text: 'syncing changes...', duration: 400 },
        { key: 'complete', text: 'movement deleted successfully', duration: 500 },
      ],
      createVehicle: [
        { key: 'validating', text: 'validating vehicle data...', duration: 700 },
        { key: 'checking', text: 'checking unique ID...', duration: 600 },
        { key: 'creating', text: 'registering vehicle...', duration: 800 },
        { key: 'configuring', text: 'configuring parameters...', duration: 600 },
        { key: 'complete', text: 'vehicle registered successfully', duration: 500 },
      ],
      createInventory: [
        { key: 'validating', text: 'validating inventory data...', duration: 600 },
        { key: 'checking', text: 'checking location duplicates...', duration: 700 },
        { key: 'creating', text: 'creating inventory item...', duration: 800 },
        { key: 'initializing', text: 'setting up thresholds...', duration: 600 },
        { key: 'complete', text: 'inventory item created successfully', duration: 500 },
      ],
      createSupplier: [
        { key: 'validating', text: 'validating supplier data...', duration: 600 },
        { key: 'checking', text: 'checking tax ID and documents...', duration: 700 },
        { key: 'creating', text: 'registering supplier...', duration: 800 },
        { key: 'complete', text: 'supplier registered successfully', duration: 500 },
      ],
      createMaintenance: [
        { key: 'validating', text: 'validating maintenance data...', duration: 600 },
        { key: 'checking', text: 'checking vehicle odometer...', duration: 700 },
        { key: 'creating', text: 'creating maintenance record...', duration: 800 },
        { key: 'updating', text: 'updating vehicle history...', duration: 600 },
        { key: 'complete', text: 'maintenance recorded successfully', duration: 500 },
      ],
    };

    return (
      baseSteps[operation?.type] || [
        { key: 'processing', text: 'processing request...', duration: 1000 },
        { key: 'complete', text: 'operation completed', duration: 500 },
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

  if (!isOpen) return null;

  return (
    <div className="firebase-progress-overlay-terminal">
      <div className="firebase-progress-terminal">
        {/* Header estilo terminal */}
        <div className="terminal-header">
          <div className="terminal-title">
            $ firebase-operation --type={operation?.type || 'unknown'}
          </div>
        </div>

        {/* Contenido de la terminal */}
        <div className="terminal-content">
          {/* Información de la operación */}
          <div className="terminal-line">
            <span className="terminal-prompt">$</span>
            <span className="terminal-text">
              {operation?.description || 'Procesando operación...'}
            </span>
          </div>

          {/* Línea de separación */}
          <div className="terminal-line">
            <span className="terminal-prompt">&gt;</span>
            <span className="terminal-text">{'─'.repeat(60)}</span>
          </div>

          {/* Progreso actual */}
          <div className="terminal-line">
            <span className="terminal-prompt">[{Math.round(progress)}%]</span>
            <span className="terminal-text">
              {operation
                ? getOperationSteps(operation)[currentStep]?.text || 'Procesando...'
                : 'Cargando...'}
            </span>
          </div>

          {/* Logs detallados estilo terminal */}
          {showLogs && logs.length > 0 && (
            <>
              <div className="terminal-line">
                <span className="terminal-prompt">&gt;</span>
                <span className="terminal-text">Logs de ejecución:</span>
              </div>
              {logs.map((log) => (
                <div key={log.id} className="terminal-line">
                  <span className="terminal-timestamp">[{log.timestamp}]</span>
                  <span className={`terminal-message ${log.type}`}>{log.message}</span>
                </div>
              ))}
            </>
          )}

          {/* Estado final */}
          {status === 'success' && (
            <div className="terminal-line success">
              <span className="terminal-prompt">✓</span>
              <span className="terminal-text">Operación completada exitosamente</span>
            </div>
          )}

          {status === 'error' && (
            <div className="terminal-line error">
              <span className="terminal-prompt">✗</span>
              <span className="terminal-text">Error en la operación</span>
            </div>
          )}

          {/* Botón de cierre estilo terminal */}
          {(status === 'success' || status === 'error') && (
            <div className="terminal-line">
              <span className="terminal-prompt">$</span>
              <button
                className="terminal-button"
                onClick={() => {
                  console.log('🎭 Usuario clickeó cerrar modal');
                  onComplete?.(operation);
                }}
              >
                exit
              </button>
            </div>
          )}

          {/* Cursor parpadeante */}
          {status === 'processing' && (
            <div className="terminal-line">
              <span className="terminal-prompt">$</span>
              <span className="terminal-cursor">_</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseProgressModal;
