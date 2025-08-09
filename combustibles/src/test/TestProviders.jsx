import React from 'react';
import { CombustiblesProvider } from '../contexts/CombustiblesContext';

export const withProviders = (ui) => (
  <CombustiblesProvider>
    {ui}
  </CombustiblesProvider>
);
