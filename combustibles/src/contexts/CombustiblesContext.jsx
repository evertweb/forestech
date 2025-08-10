// combustibles/src/contexts/CombustiblesContext.jsx
// Context optimizado para combustibles - NIVEL 2 REFACTORING COMPLETADO
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthContextLazy';
import { useCombustiblesCRUD } from '../hooks/useCombustiblesCRUD';
import { subscribeToInventory } from '../services/inventoryService';
import { subscribeToVehicles } from '../services/vehiclesService';
import { subscribeToSuppliers } from '../services/suppliersService';
import { subscribeToCategories } from '../services/vehicleCategoriesService';
import movementsService from '../services/movementsService';
import { getUserProfile } from '../firebase/userService';

export const CombustiblesContext = createContext();

export const useCombustibles = () => {
  const context = useContext(CombustiblesContext);
  if (context === undefined) {
    throw new Error('useCombustibles must be used within a CombustiblesProvider');
  }
  return context;
};

export const CombustiblesProvider = ({ children, overrides }) => {
  // Usar el nuevo AuthContext minimalista
  const auth = useAuth();
  const [localProfile, setLocalProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  // Cargar perfil de usuario cuando exista sesión (compat con AuthContextLazy)
  useEffect(() => {
    let cancelled = false;
    const loadProfile = async () => {
      if (!auth?.user || localProfile || auth.userProfile) return;
      try {
        setProfileLoading(true);
        setProfileError(null);
        const result = await getUserProfile(auth.user.uid);
        if (!cancelled && result.success) {
          setLocalProfile(result.userData);
        }
      } catch (e) {
        if (!cancelled) setProfileError(e.message);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [auth?.user, auth?.userProfile, localProfile]);

  // Hook para operaciones CRUD
  const crud = useCombustiblesCRUD();

  // Datos básicos (eliminamos useEssentialData por performance tracking)
  const data = {
    inventory: [],
    movements: [],
    vehicles: [],
    suppliers: [],
    vehicleCategories: [],
    dataLoading: false,
    dataError: null,
  };

  // Memoizar el userProfile para evitar re-renders innecesarios
  const memoizedUserProfile = useMemo(
    () => auth.userProfile || localProfile || null,
    [auth.userProfile, localProfile]
  );

  // Memoizar las funciones de permisos para evitar re-creación en cada render
  const permissionFunctions = useMemo(
    () => ({
      hasPermission: (permission) =>
        typeof auth.hasPermission === 'function'
          ? auth.hasPermission(permission)
          : Boolean(memoizedUserProfile?.combustiblesPermissions?.[permission]),
      isAdmin: () =>
        typeof auth.isAdmin === 'function' ? auth.isAdmin() : memoizedUserProfile?.role === 'admin',
      isCounterOrAbove: () =>
        typeof auth.isCounterOrAbove === 'function'
          ? auth.isCounterOrAbove()
          : memoizedUserProfile?.role === 'admin' || memoizedUserProfile?.role === 'contador',
    }),
    [auth, memoizedUserProfile]
  );

  // Combinar toda la funcionalidad
  const value = useMemo(
    () => ({
      // Autenticación y permisos
      ...auth,
      // Compat: exponer userProfile y helpers aunque el AuthContext lazy no los incluya
      // Esto evita errores como "isAdmin is not a function" en componentes existentes
      userProfile: memoizedUserProfile,
      profileLoading,
      profileError,
      ...permissionFunctions,

      // Datos de Firestore (vacíos por defecto hasta que se soliciten)
      inventory: data.inventory,
      movements: data.movements,
      vehicles: data.vehicles,
      suppliers: data.suppliers,
      vehicleCategories: data.vehicleCategories,

      // Estado de carga combinado
      dataLoading: data.dataLoading,
      dataError: data.dataError,

      // Operaciones CRUD
      ...crud,

      // Funciones para suscribirse manualmente cuando se necesiten los datos
      subscribeToInventory,
      subscribeToVehicles,
      subscribeToSuppliers,
      subscribeToVehicleCategories: subscribeToCategories,
      subscribeToMovements: movementsService.subscribeToMovements,
    }),
    [
      auth,
      memoizedUserProfile,
      profileLoading,
      profileError,
      permissionFunctions,
      data.inventory,
      data.movements,
      data.vehicles,
      data.suppliers,
      data.vehicleCategories,
      data.dataLoading,
      data.dataError,
      crud,
    ]
  );

  // Permitir overrides para modo popup u otros wrappers (solo para props seguras)
  const finalValue = useMemo(
    () => ({
      ...value,
      ...(overrides || {}),
    }),
    [value, overrides]
  );

  return <CombustiblesContext.Provider value={finalValue}>{children}</CombustiblesContext.Provider>;
};
