/**
 * MigrationWizard.jsx - Componente principal del wizard de migración
 * Sistema unificado de 5 pasos para migración de datos
 */

import React, { useState, useCallback, useMemo } from 'react';
import { X, Upload, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import migrationManager, { MIGRATION_STEPS } from '../../services/migrationManager';
import './MigrationWizard.css';

// Importar componentes de pasos
import Step1_FileUpload from './steps/Step1_FileUpload';
import Step2_ColumnMapping from './steps/Step2_ColumnMapping';
import Step3_ValueMapping from './steps/Step3_ValueMapping';
import Step4_Validation from './steps/Step4_Validation';
import Step5_Execution from './steps/Step5_Execution';

/**
 * Configuración de pasos del wizard
 */
const WIZARD_STEPS = [
  {
    id: MIGRATION_STEPS.FILE_UPLOAD,
    title: 'Cargar Archivo',
    description: 'Selecciona y carga tu archivo Excel o CSV',
    icon: Upload,
    component: 'Step1_FileUpload'
  },
  {
    id: MIGRATION_STEPS.COLUMN_MAPPING,
    title: 'Mapear Columnas',
    description: 'Relaciona las columnas del archivo con los campos del sistema',
    icon: ArrowRight,
    component: 'Step2_ColumnMapping'
  },
  {
    id: MIGRATION_STEPS.VALUE_MAPPING,
    title: 'Mapear Valores',
    description: 'Define alias para vehículos, productos y ubicaciones',
    icon: ArrowRight,
    component: 'Step3_ValueMapping'
  },
  {
    id: MIGRATION_STEPS.VALIDATION,
    title: 'Validar Datos',
    description: 'Verifica que todos los datos sean correctos antes de migrar',
    icon: CheckCircle,
    component: 'Step4_Validation'
  },
  {
    id: MIGRATION_STEPS.EXECUTION,
    title: 'Ejecutar Migración',
    description: 'Procesa y carga los datos en el sistema',
    icon: Loader,
    component: 'Step5_Execution'
  }
];

/**
 * Componente principal del wizard de migración
 */
const MigrationWizard = ({ isOpen, onClose, onComplete }) => {
  const [migrationContext, setMigrationContext] = useState(
    migrationManager.createMigrationContext()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Información del paso actual
   */
  const currentStepInfo = useMemo(() => {
    return WIZARD_STEPS.find(step => step.id === migrationContext.step) || WIZARD_STEPS[0];
  }, [migrationContext.step]);

  /**
   * Progreso del wizard (1-100)
   */
  const progress = useMemo(() => {
    return ((migrationContext.step - 1) / (WIZARD_STEPS.length - 1)) * 100;
  }, [migrationContext.step]);

  /**
   * Verificar si se puede avanzar al siguiente paso
   */
  const canAdvance = useMemo(() => {
    switch (migrationContext.step) {
      case MIGRATION_STEPS.FILE_UPLOAD:
        return migrationContext.fileData && migrationContext.fileData.success;
      case MIGRATION_STEPS.COLUMN_MAPPING:
        // Verificar que se han mapeado los campos obligatorios
        const requiredFields = ['fecha', 'cantidad', 'vehiculo', 'producto'];
        const mappedFields = Object.keys(migrationContext.columnMapping || {});
        return requiredFields.every(field => mappedFields.includes(field));
      case MIGRATION_STEPS.VALUE_MAPPING:
        // Value mapping es opcional, siempre se puede avanzar
        return true;
      case MIGRATION_STEPS.VALIDATION:
        return migrationContext.validationResult && migrationContext.validationResult.isValid;
      case MIGRATION_STEPS.EXECUTION:
        return false; // No se puede avanzar desde el último paso
      default:
        return false;
    }
  }, [migrationContext]);

  /**
   * Verificar si se puede retroceder
   */
  const canGoBack = useMemo(() => {
    return migrationContext.step > MIGRATION_STEPS.FILE_UPLOAD && 
           migrationContext.step !== MIGRATION_STEPS.EXECUTION;
  }, [migrationContext.step]);

  /**
   * Actualizar contexto de migración
   */
  const updateContext = useCallback((updates) => {
    setMigrationContext(prev => ({
      ...prev,
      ...updates,
      metadata: {
        ...prev.metadata,
        ...updates.metadata
      }
    }));
  }, []);

  /**
   * Manejar carga de archivo (Paso 1)
   */
  const handleFileUpload = async (file, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await migrationManager.processFile(file, options);
      
      if (result.success) {
        updateContext({
          fileData: result,
          metadata: {
            fileName: file.name,
            totalRows: result.metadata.rowCount
          }
        });
      } else {
        setError(result.error);
      }

    } catch (error) {
      console.error('Error procesando archivo:', error);
      setError(`Error procesando archivo: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar configuración de mapeo de columnas (Paso 2)
   */
  const handleColumnMapping = (userMappings) => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = migrationContext.fileData?.preview?.headers || [];
      const result = migrationManager.configureColumnMapping(headers, userMappings);
      
      if (result.success) {
        updateContext({
          columnMapping: result.mapping
        });
      } else {
        setError(result.error);
      }

    } catch (error) {
      console.error('Error configurando mapeo de columnas:', error);
      setError(`Error en mapeo de columnas: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar configuración de mapeo de valores (Paso 3)
   */
  const handleValueMapping = (userValueMappings) => {
    // Actualizar directamente sin loading ya que el Step3 maneja su propio estado
    updateContext({
      valueMapping: userValueMappings
    });
  };

  /**
   * Manejar validación de datos (Paso 4)
   */
  const handleValidation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await migrationManager.validateData(
        migrationContext.fileData.data,
        migrationContext.columnMapping,
        migrationContext.valueMapping
      );
      
      if (result.success) {
        updateContext({
          validationResult: result.validationResult
        });
      } else {
        setError(result.error);
      }

    } catch (error) {
      console.error('Error en validación:', error);
      setError(`Error en validación: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar ejecución de migración (Paso 5)
   */
  const handleExecution = async (progressCallback) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await migrationManager.executeMigration(
        migrationContext.validationResult,
        migrationContext.valueMapping,
        progressCallback
      );
      
      if (result.success) {
        updateContext({
          executionResult: result.executionResult
        });

        // Notificar completado al componente padre
        if (onComplete) {
          onComplete(result.executionResult);
        }
      } else {
        setError(result.error);
      }

    } catch (error) {
      console.error('Error en ejecución:', error);
      setError(`Error en migración: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navegar al siguiente paso
   */
  const handleNextStep = () => {
    if (canAdvance && migrationContext.step < WIZARD_STEPS.length) {
      updateContext({ step: migrationContext.step + 1 });
      setError(null);
    }
  };

  /**
   * Navegar al paso anterior
   */
  const handlePreviousStep = () => {
    if (canGoBack) {
      updateContext({ step: migrationContext.step - 1 });
      setError(null);
    }
  };

  /**
   * Cerrar wizard con confirmación
   */
  const handleClose = () => {
    if (migrationContext.step > MIGRATION_STEPS.FILE_UPLOAD) {
      if (confirm('¿Estás seguro de que quieres cerrar el wizard? Se perderá el progreso actual.')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  /**
   * Reiniciar wizard
   */
  const handleRestart = () => {
    if (confirm('¿Estás seguro de que quieres reiniciar el wizard?')) {
      setMigrationContext(migrationManager.createMigrationContext());
      setError(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="migration-wizard-overlay">
      <div className="migration-wizard">
        {/* Header */}
        <div className="wizard-header">
          <div className="wizard-title">
            <h2>Asistente de Migración de Datos</h2>
            <p>Importa datos históricos de forma segura y validada</p>
          </div>
          <button className="wizard-close" onClick={handleClose} aria-label="Cerrar">
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="wizard-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-steps">
            {WIZARD_STEPS.map((step, index) => (
              <div 
                key={step.id}
                className={`progress-step ${
                  migrationContext.step > step.id ? 'completed' :
                  migrationContext.step === step.id ? 'active' : 'pending'
                }`}
              >
                <div className="step-circle">
                  {migrationContext.step > step.id ? (
                    <CheckCircle size={16} />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <span className="step-title">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="wizard-content">
          <div className="step-header">
            <div className="step-icon">
              <currentStepInfo.icon size={32} />
            </div>
            <div className="step-info">
              <h3>{currentStepInfo.title}</h3>
              <p>{currentStepInfo.description}</p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="wizard-error">
              <AlertCircle size={20} />
              <span>{error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {/* Step Content */}
          <div className="step-content">
            {migrationContext.step === MIGRATION_STEPS.FILE_UPLOAD && (
              <Step1_FileUpload
                onFileProcessed={handleFileUpload}
                currentFile={migrationContext.fileData}
                isLoading={isLoading}
                error={error}
              />
            )}

            {migrationContext.step === MIGRATION_STEPS.COLUMN_MAPPING && (
              <Step2_ColumnMapping
                fileHeaders={migrationContext.fileData?.preview?.headers || []}
                currentMapping={migrationContext.columnMapping}
                columnSuggestions={migrationContext.fileData?.columnSuggestions || {}}
                onMappingChange={handleColumnMapping}
                previewData={migrationContext.fileData?.preview?.preview || []}
                isLoading={isLoading}
                error={error}
              />
            )}

            {migrationContext.step === MIGRATION_STEPS.VALUE_MAPPING && (
              <Step3_ValueMapping
                mappedData={migrationContext.fileData?.data || []}
                columnMapping={migrationContext.columnMapping}
                currentValueMapping={migrationContext.valueMapping}
                onValueMappingChange={handleValueMapping}
                isLoading={isLoading}
                error={error}
              />
            )}

            {migrationContext.step === MIGRATION_STEPS.VALIDATION && (
              <Step4_Validation
                fileData={migrationContext.fileData?.data || []}
                columnMapping={migrationContext.columnMapping}
                valueMapping={migrationContext.valueMapping}
                currentValidation={migrationContext.validationResult}
                isValidating={isLoading}
                onValidationComplete={(result) => updateContext({ validationResult: result })}
                error={error}
              />
            )}

            {migrationContext.step === MIGRATION_STEPS.EXECUTION && (
              <Step5_Execution
                validationResult={migrationContext.validationResult}
                valueMapping={migrationContext.valueMapping}
                currentExecution={migrationContext.executionResult}
                canExecute={migrationContext.validationResult?.isValid || false}
                onExecutionComplete={(result) => {
                  updateContext({ executionResult: result });
                  if (onComplete) onComplete(result);
                }}
                onNavigateToStep={(stepId) => updateContext({ step: stepId })}
                error={error}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="wizard-footer">
          <div className="footer-left">
            <button 
              className="btn-secondary" 
              onClick={handleRestart}
              disabled={isLoading}
            >
              Reiniciar
            </button>
          </div>
          
          <div className="footer-right">
            <button 
              className="btn-secondary" 
              onClick={handlePreviousStep}
              disabled={!canGoBack || isLoading}
            >
              <ArrowLeft size={16} />
              Anterior
            </button>
            
            {migrationContext.step < WIZARD_STEPS.length ? (
              <button 
                className="btn-primary" 
                onClick={handleNextStep}
                disabled={!canAdvance || isLoading}
              >
                Siguiente
                <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                className="btn-success" 
                onClick={handleClose}
                disabled={isLoading}
              >
                Finalizar
                <CheckCircle size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="wizard-loading">
            <Loader className="spinner" size={32} />
            <p>Procesando...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MigrationWizard;