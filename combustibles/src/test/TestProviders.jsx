import React from 'react';
import { AuthProvider } from '../contexts/AuthContextLazy';
import { CombustiblesProvider } from '../contexts/CombustiblesContext';
import { FirebaseProgressProvider } from '../contexts/FirebaseProgressContext';

export const withProviders = (ui) => (
  <AuthProvider>
    <FirebaseProgressProvider>
      <CombustiblesProvider>{ui}</CombustiblesProvider>
    </FirebaseProgressProvider>
  </AuthProvider>
);
