/**
 * useFirebaseProgress - Hook para gestionar el progreso de operaciones Firebase
 * Proporciona una API simple para mostrar feedback transparente al usuario
 */

import { useState, useCallback } from 'react';

const useFirebaseProgress = () => {
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [currentOperation, setCurrentOperation] = useState(null);

  // Iniciar una operación con progreso transparente
  const startProgress = useCallback((operationType, description, additionalData = {}) => {
    const operation = {
      type: operationType,
      description,
      startTime: Date.now(),
      ...additionalData,
    };

    console.log('🚀 Firebase Progress START:', operation);
    setCurrentOperation(operation);
    setIsProgressOpen(true);

    return operation;
  }, []);

  // Completar la operación actual
  const completeProgress = useCallback(
    (result = null) => {
      console.log('🎯 completeProgress LLAMADO:', { result, currentOperation });
      if (currentOperation) {
        const completedOperation = {
          ...currentOperation,
          endTime: Date.now(),
          duration: Date.now() - currentOperation.startTime,
          result,
        };

        // Log de la operación completada
        console.log('🔥 Firebase Operation Completed:', completedOperation);
      }

      console.log('🎯 Cerrando modal de progreso...');
      setIsProgressOpen(false);
      setCurrentOperation(null);
    },
    [currentOperation]
  );

  // Manejar errores en la operación
  const errorProgress = useCallback(
    (error) => {
      if (currentOperation) {
        const failedOperation = {
          ...currentOperation,
          endTime: Date.now(),
          duration: Date.now() - currentOperation.startTime,
          error: error.message || error,
        };

        // Log del error
        console.error('🔥 Firebase Operation Failed:', failedOperation);
      }

      setIsProgressOpen(false);
      setCurrentOperation(null);
    },
    [currentOperation]
  );

  // Wrapper para ejecutar operaciones Firebase con progreso automático
  const executeWithProgress = useCallback(
    async (operationType, description, firebaseOperation, additionalData = {}) => {
      console.log('🎯 executeWithProgress INICIADO:', {
        operationType,
        description,
        additionalData,
      });
      try {
        // Iniciar progreso
        console.log('🎯 Llamando startProgress...');
        startProgress(operationType, description, additionalData);
        console.log('🎯 startProgress ejecutado, iniciando operación Firebase...');

        // Ejecutar la operación Firebase
        console.log('🎯 Ejecutando firebaseOperation...');
        const result = await firebaseOperation();
        console.log('🎯 firebaseOperation completada:', result);

        // Completar progreso con delay más largo para ver el resultado
        console.log('🎯 Programando cierre del progreso en 5 segundos...');
        setTimeout(() => {
          console.log('🎯 Cerrando progreso ahora...');
          completeProgress(result);
        }, 5000); // Delay mucho más largo para debugging

        return result;
      } catch (error) {
        console.log('🎯 ERROR en executeWithProgress:', error);
        // Manejar error
        setTimeout(() => {
          errorProgress(error);
        }, 500);

        throw error;
      }
    },
    [startProgress, completeProgress, errorProgress]
  );

  return {
    // Estado
    isProgressOpen,
    currentOperation,

    // Métodos manuales
    startProgress,
    completeProgress,
    errorProgress,

    // Método automático
    executeWithProgress,
  };
};

export default useFirebaseProgress;
