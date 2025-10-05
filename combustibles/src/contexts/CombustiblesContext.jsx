// combustibles/src/contexts/CombustiblesContext.jsx
// Context optimizado para combustibles - NIVEL 2 REFACTORING COMPLETADO
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthContextLazy';
import { useCombustiblesCRUD } from '../hooks/useCombustiblesCRUD';
import { subscribeToInventory } from '../services/FirebaseInventoryService';
import { subscribeToVehicles } from '../services/FirebaseVehiclesService';
import { subscribeToSuppliers } from '../services/FirebaseSuppliersService';
import { subscribeToCategories } from '../services/FirebaseVehicleCategoriesService';
import FirebaseMovementsService from '../services/FirebaseMovementsService';
import { getUserProfile } from '../firebase/userService';

// Importar servicios Firebase Functions
import FirebaseInventoryService from '../services/FirebaseInventoryService';
import FirebaseVehiclesService from '../services/FirebaseVehiclesService';
import FirebaseSuppliersService from '../services/FirebaseSuppliersService';
import FirebaseProductsService from '../services/FirebaseProductsService';
import FirebaseMaintenanceService from '../services/FirebaseMaintenanceService';
import FirebaseHourMeterService from '../services/FirebaseHourMeterService';
import FirebaseVehicleCategoriesService from '../services/FirebaseVehicleCategoriesService';

// Instancia del servicio Firebase de movimientos
const firebaseMovementsService = new FirebaseMovementsService();

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

  // Estados para datos de Firebase
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  // Estado para controlar si las suscripciones ya están activas
  const [subscriptionsActive, setSubscriptionsActive] = useState(false);

  // Suscripciones a Firebase
  useEffect(() => {
    // No ejecutar suscripciones hasta que la autenticación esté completamente lista
    if (!auth?.authReady) {
      console.log('🔥 CombustiblesContext: Esperando autenticación completa...');
      return;
    }

    // TEMPORAL: Cargar datos incluso sin usuario para debugging en desarrollo
    // TODO: Restaurar verificación de auth cuando se resuelva el problema de autenticación
    const forceLoadData = import.meta.env.DEV;

    // Solo cargar datos si hay usuario autenticado O si estamos forzando en desarrollo
    if (!auth?.user && !forceLoadData) {
      // Reset data when no user (solo en producción)
      setInventory([]);
      setMovements([]);
      setVehicles([]);
      setSuppliers([]);
      setVehicleCategories([]);
      setDataLoading(false);
      setSubscriptionsActive(false);
      return;
    }

    console.log('🔥 CombustiblesContext: Iniciando suscripciones a Firebase...');
    console.log('👤 Usuario autenticado:', !!auth?.user, auth?.user?.email);
    console.log('🔐 Autenticación lista:', auth?.authReady);
    console.log('🔧 Modo desarrollo forzado:', forceLoadData);

    // Verificar si las suscripciones ya están activas para evitar duplicados
    if (subscriptionsActive) {
      console.log('🔥 CombustiblesContext: Suscripciones ya activas, omitiendo...');
      return;
    }

    setSubscriptionsActive(true);
    let loadingCount = 5;
    setDataLoading(true);
    setDataError(null);

    const updateLoading = () => {
      loadingCount--;
      if (loadingCount === 0) {
        setDataLoading(false);
      }
    };

    // Suscripción a inventario
    const unsubInventory = subscribeToInventory((data, error) => {
      if (error) {
        console.error('Error en suscripción de inventario:', error);
        setDataError('Error al cargar el inventario.');
      } else {
        console.log('🔥 CombustiblesContext - Inventario actualizado:', data?.length, 'items');
        setInventory(data || []);
      }
      updateLoading();
    });

    // Suscripción a vehículos
    const unsubVehicles = subscribeToVehicles((data, error) => {
      if (error) {
        console.error('Error en suscripción de vehículos:', error);
        setDataError('Error al cargar los vehículos.');
      } else {
        setVehicles(data || []);
      }
      updateLoading();
    });

    // Suscripción a proveedores
    const unsubSuppliers = subscribeToSuppliers((data, error) => {
      if (error) {
        console.error('Error en suscripción de proveedores:', error);
        setDataError('Error al cargar los proveedores.');
      } else {
        setSuppliers(data || []);
      }
      updateLoading();
    });

    // Suscripción a categorías de vehículos
    const unsubCategories = subscribeToCategories((data, error) => {
      if (error) {
        console.error('Error en suscripción de categorías:', error);
        setDataError('Error al cargar las categorías.');
      } else {
        setVehicleCategories(data || []);
      }
      updateLoading();
    });

    // Suscripción a movimientos (ahora usando Firebase Functions)
    const unsubMovements = firebaseMovementsService.subscribeToMovements((data, error) => {
      if (error) {
        console.error('Error en suscripción de movimientos:', error);
        setDataError('Error al cargar los movimientos.');
      } else {
        setMovements(data || []);
      }
      updateLoading();
    });

    return () => {
      console.log('🔥 CombustiblesContext: Limpiando suscripciones...');
      setSubscriptionsActive(false);
      if (typeof unsubInventory === 'function') unsubInventory();
      if (typeof unsubVehicles === 'function') unsubVehicles();
      if (typeof unsubSuppliers === 'function') unsubSuppliers();
      if (typeof unsubCategories === 'function') unsubCategories();
      if (typeof unsubMovements === 'function') unsubMovements();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user, auth?.authReady]); // Removed subscriptionsActive from deps to prevent infinite loop

  // Datos estructurados
  const data = {
    inventory,
    movements,
    vehicles,
    suppliers,
    vehicleCategories,
    dataLoading,
    dataError,
  };

  // Memoizar el userProfile para evitar re-renders innecesarios
  const memoizedUserProfile = useMemo(
    () => auth.userProfile || localProfile || null,
    [auth.userProfile, localProfile]
  );

  // Memoizar las funciones de permisos - TODOS tienen acceso completo en preview
  const permissionFunctions = useMemo(
    () => ({
      hasPermission: () => true,
      isAdmin: () => true,
      isCounterOrAbove: () => true,
    }),
    []
  );

  // Combinar toda la funcionalidad
  const value = useMemo(
    () => ({
      // Autenticación y permisos
      ...auth,
      // Compat: exponer userProfile y helpers aunque el AuthContext lazy no los incluya
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
      subscribeToMovements: firebaseMovementsService.subscribeToMovements.bind(firebaseMovementsService),

      // Servicios Firebase Functions para operaciones directas
      firebaseInventoryService: new FirebaseInventoryService(),
      firebaseVehiclesService: new FirebaseVehiclesService(),
      firebaseSuppliersService: new FirebaseSuppliersService(),
      firebaseProductsService: new FirebaseProductsService(),
      firebaseMaintenanceService: new FirebaseMaintenanceService(),
      firebaseHourMeterService: new FirebaseHourMeterService(),
      firebaseVehicleCategoriesService: new FirebaseVehicleCategoriesService(),
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
