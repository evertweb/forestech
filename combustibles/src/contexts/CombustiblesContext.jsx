// combustibles/src/contexts/CombustiblesContext.jsx
// Context optimizado para combustibles - NIVEL 2 REFACTORING COMPLETADO
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useCombustiblesCRUD } from '../hooks/useCombustiblesCRUD';
import { subscribeToInventory } from '../services/inventoryService';
import { subscribeToVehicles } from '../services/vehiclesService';
import { subscribeToSuppliers } from '../services/suppliersService';
import movementsService from '../services/movementsService';

const CombustiblesContext = createContext();

export const useCombustibles = () => {
  const context = useContext(CombustiblesContext);
  if (context === undefined) {
    throw new Error('useCombustibles must be used within a CombustiblesProvider');
  }
  return context;
};

export const CombustiblesProvider = ({ children }) => {
  // Usar el nuevo AuthContext minimalista
  const auth = useAuth();
  
  // Hook para operaciones CRUD
  const crud = useCombustiblesCRUD();
  
  // Datos básicos (eliminamos useEssentialData por performance tracking)
  const data = {
    inventory: [],
    movements: [],
    vehicles: [],
    suppliers: [],
    dataLoading: false,
    dataError: null
  };

  // Combinar toda la funcionalidad
  const value = {
    // Autenticación y permisos
    ...auth,
    
    // Datos de Firestore (vacíos por defecto hasta que se soliciten)
    inventory: data.inventory,
    movements: data.movements,
    vehicles: data.vehicles,
    suppliers: data.suppliers,
    
    // Estado de carga combinado
    dataLoading: data.loading,
    dataError: data.error,
    
    // Operaciones CRUD
    ...crud,
    
    // Funciones para suscribirse manualmente cuando se necesiten los datos
    subscribeToInventory,
    subscribeToVehicles,
    subscribeToSuppliers,
    subscribeToMovements: movementsService.subscribeToMovements,
  };

  return (
    <CombustiblesContext.Provider value={value}>
      {children}
    </CombustiblesContext.Provider>
  );
};