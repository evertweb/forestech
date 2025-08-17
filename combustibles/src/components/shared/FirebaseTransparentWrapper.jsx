/**
 * FirebaseTransparentWrapper - Wrapper que proporciona feedback transparente
 * para operaciones Firebase en cualquier componente
 */

import React from 'react';
import useFirebaseProgress from '../../hooks/useFirebaseProgress';
import FirebaseProgressModal from './FirebaseProgressModal';

const FirebaseTransparentWrapper = ({ children }) => {
  const { isProgressOpen, currentOperation, completeProgress, errorProgress } =
    useFirebaseProgress();

  return (
    <>
      {children}

      {/* Modal de progreso transparente Firebase */}
      <FirebaseProgressModal
        isOpen={isProgressOpen}
        operation={currentOperation}
        onComplete={completeProgress}
        onError={errorProgress}
        showLogs={true}
      />
    </>
  );
};

export default FirebaseTransparentWrapper;
