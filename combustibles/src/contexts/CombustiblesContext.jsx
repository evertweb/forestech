// combustibles/src/contexts/CombustiblesContext.jsx
// Context específico para la app de combustibles con autenticación compartida
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile, getUserProfile } from '../firebase/userService';
import movementsService from '../services/movementsService';
import { subscribeToInventory } from '../services/inventoryService';
import { subscribeToVehicles } from '../services/vehiclesService';
import { subscribeToSuppliers } from '../services/suppliersService';

const CombustiblesContext = createContext();

export const useCombustibles = () => {
  const context = useContext(CombustiblesContext);
  if (context === undefined) {
    throw new Error('useCombustibles must be used within a CombustiblesProvider');
  }
  return context;
};

export const CombustiblesProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados específicos de combustibles
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        
        if (firebaseUser) {
          setUser(firebaseUser);
          
          let profileResult = await getUserProfile(firebaseUser.uid);
          
          if (!profileResult.success) {
            profileResult = await createUserProfile(firebaseUser, {
              provider: 'existing_account',
              appContext: 'combustibles'
            });
          }
          
          if (profileResult.success) {
            setUserProfile(profileResult.userData);
          } else {
            setError('Error cargando perfil de usuario');
          }
        } else {
          setUser(null);
          setUserProfile(null);
          setInventory([]);
          setMovements([]);
          setVehicles([]);
          setSuppliers([]);
        }
      } catch (error) {
        console.error('Error en autenticación:', error);
        setError('Error de autenticación');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Suscripciones a datos de Firestore
  useEffect(() => {
    if (user) {
      const unsubInventory = subscribeToInventory(setInventory, (err) => setError(err.message));
      const unsubVehicles = subscribeToVehicles(setVehicles, (err) => setError(err.message));
      const unsubSuppliers = subscribeToSuppliers(setSuppliers, (err) => setError(err.message));
      const unsubMovements = movementsService.subscribeToMovements(setMovements, (err) => setError(err.message));

      return () => {
        unsubInventory();
        unsubVehicles();
        unsubSuppliers();
        unsubMovements();
      };
    }
  }, [user]);

  // Funciones de utilidad para permisos específicos de combustibles
  const hasPermission = (permission) => {
    return userProfile?.combustiblesPermissions?.[permission] || false;
  };

  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  const isCounterOrAbove = () => {
    return userProfile?.role === 'admin' || userProfile?.role === 'contador';
  };

  // --- Funciones CRUD para Movimientos ---
  const deleteMovement = async (movementId) => {
    try {
      await movementsService.deleteMovement(movementId);
      setMovements((prevMovements) => prevMovements.filter((m) => m.id !== movementId));
      // Opcional: podrías querer refrescar el inventario también
      // await refreshInventory(); 
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar el movimiento en el contexto:", error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };


  // Funciones específicas de combustibles (placeholder para futuras implementaciones)
  const refreshInventory = async () => {
    // TODO: Implementar carga de inventario desde Firestore
    console.log('Refrescando inventario...');
  };

  const refreshMovements = async () => {
    // TODO: Implementar carga de movimientos desde Firestore
    console.log('Refrescando movimientos...');
  };

  const refreshVehicles = async () => {
    // TODO: Implementar carga de vehículos desde Firestore
    console.log('Refrescando vehículos...');
  };

  const refreshSuppliers = async () => {
    // TODO: Implementar carga de proveedores desde Firestore
    console.log('Refrescando proveedores...');
  };

  const value = {
    // Estado de autenticación
    user,
    userProfile,
    loading,
    error,
    
    // Funciones de permisos
    hasPermission,
    isAdmin,
    isCounterOrAbove,
    
    // Estados de combustibles
    inventory,
    movements,
    vehicles,
    suppliers,
    setInventory,
    setMovements,
    setVehicles,
    setSuppliers,
    
    // Funciones CRUD
    deleteMovement,

    // Funciones de refreso de datos
    refreshInventory,
    refreshMovements,
    refreshVehicles,
    refreshSuppliers
  };

  return (
    <CombustiblesContext.Provider value={value}>
      {children}
    </CombustiblesContext.Provider>
  );
};

export { CombustiblesContext };