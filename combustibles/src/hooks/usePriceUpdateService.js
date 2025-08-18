/**
 * Hook para usar el servicio de actualización de precios
 */

import { useContext } from 'react';
import { PriceUpdateServiceContext } from '../contexts/PriceUpdateServiceContext';

export const usePriceUpdateService = () => {
  const context = useContext(PriceUpdateServiceContext);
  if (!context) {
    throw new Error('usePriceUpdateService must be used within a PriceUpdateServiceProvider');
  }
  return context;
};
