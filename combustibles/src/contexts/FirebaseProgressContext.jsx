/**
 * FirebaseProgressContext - Contexto global para gestionar progreso Firebase
 * Proporciona funcionalidad transparente de feedback en toda la aplicación
 */

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import useFirebaseProgress from '../hooks/useFirebaseProgress';
import FirebaseProgressModal from '../components/shared/FirebaseProgressModal';

const FirebaseProgressContext = createContext();

export const useFirebaseProgressContext = () => {
  const context = useContext(FirebaseProgressContext);
  if (!context) {
    throw new Error('useFirebaseProgressContext debe usarse dentro de FirebaseProgressProvider');
  }
  return context;
};

export const FirebaseProgressProvider = ({ children }) => {
  const progressHook = useFirebaseProgress();

  console.log('🎯 FirebaseProgressProvider render:', {
    isOpen: progressHook.isProgressOpen,
    operation: progressHook.currentOperation,
  });

  return (
    <FirebaseProgressContext.Provider value={progressHook}>
      {children}

      {/* Modal global de progreso Firebase */}
      <FirebaseProgressModal
        isOpen={progressHook.isProgressOpen}
        operation={progressHook.currentOperation}
        onComplete={progressHook.completeProgress}
        onError={progressHook.errorProgress}
        showLogs={true}
      />
    </FirebaseProgressContext.Provider>
  );
};

export default FirebaseProgressContext;
