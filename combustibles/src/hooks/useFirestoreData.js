// combustibles/src/hooks/useFirestoreData.js
// Hooks personalizados para Firestore con fetching por demanda - NIVEL 2 Y 3 OPTIMIZACIÓN
import { useState, useEffect, useRef, useCallback } from 'react';
import movementsService from '../services/movementsService';
import { subscribeToInventory } from '../services/inventoryService';
import { subscribeToVehicles } from '../services/vehiclesService';
import { subscribeToSuppliers } from '../services/suppliersService';
import { optimizedFirestore } from '../services/optimizedFirestore';

// Hook genérico para suscripciones Firestore con cache y optimizaciones
const useFirestoreSubscription = (subscribeFunction, enabled = true, _options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);
  const isSubscribedRef = useRef(false);

  const subscribe = useCallback(() => {
    if (!enabled || isSubscribedRef.current) return;

    setLoading(true);
    setError(null);
    isSubscribedRef.current = true;

    const unsubscribe = subscribeFunction(
      (newData) => {
        setData(newData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    unsubscribeRef.current = unsubscribe;
  }, [subscribeFunction, enabled]);

  const unsubscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
      isSubscribedRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      subscribe();
    } else {
      unsubscribe();
    }

    return () => unsubscribe();
  }, [enabled, subscribe, unsubscribe]);

  return { data, loading, error, subscribe, unsubscribe };
};

// Hooks específicos optimizados
/* eslint-disable react-hooks/rules-of-hooks */
export const useInventory = (autoSubscribe = false, optimized = true) => {
  if (optimized) {
    return useOptimizedCollection('inventory', autoSubscribe, {
      orderByField: 'name',
      limitCount: 100
    });
  }
  return useFirestoreSubscription(subscribeToInventory, autoSubscribe);
};

export const useVehicles = (autoSubscribe = false, optimized = true) => {
  if (optimized) {
    return useOptimizedCollection('vehicles', autoSubscribe, {
      filters: [{ field: 'status', operator: '==', value: 'active' }],
      orderByField: 'plate',
      limitCount: 50
    });
  }
  return useFirestoreSubscription(subscribeToVehicles, autoSubscribe);
};

export const useSuppliers = (autoSubscribe = false, optimized = true) => {
  if (optimized) {
    return useOptimizedCollection('suppliers', autoSubscribe, {
      filters: [{ field: 'status', operator: '==', value: 'active' }],
      orderByField: 'name',
      limitCount: 30
    });
  }
  return useFirestoreSubscription(subscribeToSuppliers, autoSubscribe);
};

export const useMovements = (autoSubscribe = false, optimized = true) => {
  if (optimized) {
    return useOptimizedCollection('movements', autoSubscribe, {
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limitCount: 100
    });
  }
  return useFirestoreSubscription(
    (onData, onError) => movementsService.subscribeToMovements(onData, onError),
    autoSubscribe
  );
};
/* eslint-enable react-hooks/rules-of-hooks */

// Hook para colecciones optimizadas
const useOptimizedCollection = (collectionName, autoSubscribe = false, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  const subscribe = useCallback(() => {
    if (unsubscribeRef.current) return; // Ya suscrito

    setLoading(true);
    setError(null);

    const unsubscribe = optimizedFirestore.subscribeOptimized(
      collectionName,
      (newData, err) => {
        if (err) {
          setError(err.message);
        } else {
          setData(newData);
        }
        setLoading(false);
      },
      options
    );

    unsubscribeRef.current = unsubscribe;
  }, [collectionName, options]);

  const unsubscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (autoSubscribe) {
      subscribe();
    }
    return () => unsubscribe();
  }, [autoSubscribe, subscribe, unsubscribe]);

  return { data, loading, error, subscribe, unsubscribe };
};

// Hook combinado para datos esenciales (solo cuando se necesiten)
export const useEssentialData = (dataTypes = []) => {
  const inventory = useInventory(dataTypes.includes('inventory'));
  const vehicles = useVehicles(dataTypes.includes('vehicles'));
  const suppliers = useSuppliers(dataTypes.includes('suppliers'));
  const movements = useMovements(dataTypes.includes('movements'));

  const loading = inventory.loading || vehicles.loading || suppliers.loading || movements.loading;
  const error = inventory.error || vehicles.error || suppliers.error || movements.error;

  return {
    inventory: inventory.data,
    vehicles: vehicles.data,
    suppliers: suppliers.data,
    movements: movements.data,
    loading,
    error,
    // Funciones para suscribirse manualmente cuando se necesiten
    subscribeToInventory: inventory.subscribe,
    subscribeToVehicles: vehicles.subscribe,
    subscribeToSuppliers: suppliers.subscribe,
    subscribeToMovements: movements.subscribe
  };
};
