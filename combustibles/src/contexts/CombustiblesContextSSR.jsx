// combustibles/src/contexts/CombustiblesContextSSR.jsx
// Context SSR-compatible para combustibles - no ejecuta efectos en servidor
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './AuthContextSSR';
import { isServer } from '../utils/ssr';

export const CombustiblesContext = createContext();

export const useCombustibles = () => {
  const context = useContext(CombustiblesContext);
  if (context === undefined) {
    throw new Error('useCombustibles must be used within a CombustiblesProvider');
  }
  return context;
};

export const CombustiblesProvider = ({ children, overrides }) => {
  // Usar el AuthContext SSR-compatible
  const auth = useAuth();
  const [localProfile, setLocalProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(isServer ? false : false);
  const [profileError, setProfileError] = useState(null);

  // Estados de datos - inicial vacío para SSR
  const [inventory, setInventory] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [movements, setMovements] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);

  // Estados de carga
  const [inventoryLoading, setInventoryLoading] = useState(isServer ? false : true);
  const [vehiclesLoading, setVehiclesLoading] = useState(isServer ? false : true);
  const [movementsLoading, setMovementsLoading] = useState(isServer ? false : true);
  const [suppliersLoading, setSuppliersLoading] = useState(isServer ? false : true);
  const [categoriesLoading, setCategoriesLoading] = useState(isServer ? false : true);

  // Cargar perfil de usuario cuando exista sesión (solo en cliente)
  useEffect(() => {
    if (isServer) return;

    let cancelled = false;
    const loadProfile = async () => {
      if (!auth?.user || localProfile || auth.userProfile) return;
      try {
        setProfileLoading(true);
        setProfileError(null);
        const { getUserProfile } = await import('../firebase/userService');
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
  }, [auth?.user, localProfile, auth.userProfile]);

  // Suscribirse a datos cuando haya usuario autenticado (solo en cliente)
  useEffect(() => {
    if (isServer || !auth.user) return;

    let unsubscribes = [];

    const setupSubscriptions = async () => {
      try {
        // Importar servicios de forma lazy
        const [
          { subscribeToInventory },
          { subscribeToVehicles },
          { subscribeToSuppliers },
          { subscribeToCategories },
          movementsService,
        ] = await Promise.all([
          import('../services/inventoryService'),
          import('../services/vehiclesService'),
          import('../services/suppliersService'),
          import('../services/vehicleCategoriesService'),
          import('../services/movementsService'),
        ]);

        // Configurar suscripciones
        const inventoryUnsub = subscribeToInventory(
          (data) => {
            setInventory(data);
            setInventoryLoading(false);
          },
          (error) => {
            console.error('Error en suscripción inventory:', error);
            setInventoryLoading(false);
          }
        );

        const vehiclesUnsub = subscribeToVehicles(
          (data) => {
            setVehicles(data);
            setVehiclesLoading(false);
          },
          (error) => {
            console.error('Error en suscripción vehicles:', error);
            setVehiclesLoading(false);
          }
        );

        const suppliersUnsub = subscribeToSuppliers(
          (data) => {
            setSuppliers(data);
            setSuppliersLoading(false);
          },
          (error) => {
            console.error('Error en suscripción suppliers:', error);
            setSuppliersLoading(false);
          }
        );

        const categoriesUnsub = subscribeToCategories(
          (data) => {
            setCategories(data);
            setCategoriesLoading(false);
          },
          (error) => {
            console.error('Error en suscripción categories:', error);
            setCategoriesLoading(false);
          }
        );

        // Cargar movimientos iniciales
        const loadMovements = async () => {
          try {
            const result = await movementsService.getMovements({ limit: 50 });
            if (result.success) {
              setMovements(result.movements);
            }
          } catch (error) {
            console.error('Error cargando movimientos:', error);
          } finally {
            setMovementsLoading(false);
          }
        };

        loadMovements();

        unsubscribes = [inventoryUnsub, vehiclesUnsub, suppliersUnsub, categoriesUnsub];
      } catch (error) {
        console.error('Error configurando suscripciones:', error);
        setInventoryLoading(false);
        setVehiclesLoading(false);
        setSuppliersLoading(false);
        setCategoriesLoading(false);
        setMovementsLoading(false);
      }
    };

    setupSubscriptions();

    return () => {
      unsubscribes.forEach((unsub) => unsub?.());
    };
  }, [auth.user]);

  // Computar valores derivados
  const userProfile = useMemo(() => {
    return auth.userProfile || localProfile;
  }, [auth.userProfile, localProfile]);

  const loading = useMemo(() => {
    return auth.loading || profileLoading;
  }, [auth.loading, profileLoading]);

  const user = useMemo(() => {
    return auth.user;
  }, [auth.user]);

  const value = useMemo(
    () => ({
      // Usuario y perfil
      user,
      userProfile,
      loading,
      profileError,

      // Datos
      inventory,
      vehicles,
      movements,
      suppliers,
      categories,

      // Estados de carga
      inventoryLoading,
      vehiclesLoading,
      movementsLoading,
      suppliersLoading,
      categoriesLoading,

      // Métodos de auth
      signIn: auth.signIn,
      signOut: auth.signOut,

      // Aplicar overrides si se proporcionan (para testing)
      ...overrides,
    }),
    [
      user,
      userProfile,
      loading,
      profileError,
      inventory,
      vehicles,
      movements,
      suppliers,
      categories,
      inventoryLoading,
      vehiclesLoading,
      movementsLoading,
      suppliersLoading,
      categoriesLoading,
      auth.signIn,
      auth.signOut,
      overrides,
    ]
  );

  return <CombustiblesContext.Provider value={value}>{children}</CombustiblesContext.Provider>;
};
