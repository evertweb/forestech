import React from 'react';
import { CombustiblesProvider } from '../contexts/CombustiblesContext';
import { FirebaseProgressProvider } from '../contexts/FirebaseProgressContext';

export const withProviders = (ui) => (
  <FirebaseProgressProvider>
    <CombustiblesProvider>{ui}</CombustiblesProvider>
  </FirebaseProgressProvider>
);
