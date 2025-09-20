/**
 * Servicio de gestión de perfiles de usuario para Forestech Combustibles
 * Extiende la funcionalidad de Firebase Auth con roles y permisos
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// Roles básicos para combustibles
export const ROLES = {
  ADMIN: 'admin',
  OPERADOR: 'operador', 
  CONSULTA: 'consulta',
  INVITADO: 'invitado'
};

// Permisos por defecto
const DEFAULT_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canViewAll: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: true,
    combustiblesPermissions: {
      viewMovements: true,
      createMovements: true,
      editMovements: true,
      deleteMovements: true,
      viewInventory: true,
      editInventory: true,
      viewVehicles: true,
      editVehicles: true,
      viewReports: true,
      manageSettings: true
    }
  },
  [ROLES.OPERADOR]: {
    canViewAll: true,
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canManageUsers: false,
    combustiblesPermissions: {
      viewMovements: true,
      createMovements: true,
      editMovements: true,
      deleteMovements: false,
      viewInventory: true,
      editInventory: false,
      viewVehicles: true,
      editVehicles: false,
      viewReports: true,
      manageSettings: false
    }
  },
  [ROLES.CONSULTA]: {
    canViewAll: true,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    combustiblesPermissions: {
      viewMovements: true,
      createMovements: false,
      editMovements: false,
      deleteMovements: false,
      viewInventory: true,
      editInventory: false,
      viewVehicles: true,
      editVehicles: false,
      viewReports: true,
      manageSettings: false
    }
  },
  [ROLES.INVITADO]: {
    canViewAll: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    combustiblesPermissions: {
      viewMovements: false,
      createMovements: false,
      editMovements: false,
      deleteMovements: false,
      viewInventory: false,
      editInventory: false,
      viewVehicles: false,
      editVehicles: false,
      viewReports: false,
      manageSettings: false
    }
  }
};

// Email del administrador principal
const ADMIN_EMAIL = 'evertweb@hotmail.com';

/**
 * Obtiene la referencia base para usuarios en Firestore
 */
const getUsersCollectionPath = () => {
  return `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users`;
};

/**
 * Determina el rol del usuario basado en su email
 * @param {string} email - Email del usuario
 * @returns {string} - Rol determinado
 */
const determineUserRole = (email) => {
  if (email === ADMIN_EMAIL) {
    return ROLES.ADMIN;
  }
  
  // Lógica adicional de roles basada en dominio, etc.
  if (email.includes('@forestech')) {
    return ROLES.OPERADOR;
  }
  
  return ROLES.CONSULTA;
};

/**
 * Obtiene permisos por defecto para un rol
 * @param {string} role - Rol del usuario
 * @returns {Object} - Permisos por defecto
 */
const getDefaultPermissions = (role) => {
  return DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS[ROLES.INVITADO];
};

/**
 * Crea un perfil de usuario en Firestore
 * @param {Object} user - Usuario de Firebase Auth
 * @param {string} customRole - Rol personalizado (opcional)
 * @param {Object} invitationData - Datos de la invitación (opcional)
 * @returns {Promise<Object>} - Perfil creado
 */
export const createUserProfile = async (user, customRole = null, invitationData = null) => {
  try {
    let role, permissions, displayName;
    
    if (invitationData) {
      // Usar datos de la invitación
      role = invitationData.role;
      permissions = invitationData.permissions;
      displayName = invitationData.displayName;
    } else {
      // Determinar rol automáticamente
      role = customRole || determineUserRole(user.email);
      permissions = getDefaultPermissions(role);
      displayName = user.displayName || user.email.split('@')[0];
    }

    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      role: role,
      ...permissions,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      isActive: true,
      invitedBy: invitationData?.invitedBy || null,
      invitationUsed: invitationData ? true : false
    };

    const userDocRef = doc(db, getUsersCollectionPath(), user.uid);
    await setDoc(userDocRef, userProfile);

    console.log('✅ Perfil de usuario creado:', {
      email: user.email,
      role: role,
      uid: user.uid
    });

    return userProfile;

  } catch (error) {
    console.error('❌ Error creando perfil de usuario:', error);
    throw error;
  }
};

/**
 * Crea un perfil de usuario con datos de invitación
 * @param {Object} user - Usuario de Firebase Auth
 * @param {Object} invitationData - Datos de la invitación
 * @returns {Promise<Object>} - Perfil creado
 */
export const createUserProfileWithInvitation = async (user, invitationData) => {
  return createUserProfile(user, null, invitationData);
};

/**
 * Obtiene el perfil de usuario desde Firestore
 * @param {string} uid - UID del usuario
 * @returns {Promise<Object|null>} - Perfil del usuario o null
 */
export const getUserProfile = async (uid) => {
  try {
    const userDocRef = doc(db, getUsersCollectionPath(), uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const profile = userDoc.data();
      
      // Actualizar último login
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp()
      });
      
      return profile;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error obteniendo perfil de usuario:', error);
    throw error;
  }
};

/**
 * Actualiza el perfil de usuario
 * @param {string} uid - UID del usuario
 * @param {Object} updateData - Datos a actualizar
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (uid, updateData) => {
  try {
    const userDocRef = doc(db, getUsersCollectionPath(), uid);
    await updateDoc(userDocRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Perfil de usuario actualizado:', uid);
  } catch (error) {
    console.error('❌ Error actualizando perfil de usuario:', error);
    throw error;
  }
};

/**
 * Actualiza los permisos de un usuario
 * @param {string} uid - UID del usuario
 * @param {Object} permissions - Nuevos permisos
 * @returns {Promise<void>}
 */
export const updateUserPermissions = async (uid, permissions) => {
  try {
    const userDocRef = doc(db, getUsersCollectionPath(), uid);
    await updateDoc(userDocRef, {
      ...permissions,
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Permisos de usuario actualizados:', uid);
  } catch (error) {
    console.error('❌ Error actualizando permisos de usuario:', error);
    throw error;
  }
};

/**
 * Obtiene todos los usuarios (solo para administradores)
 * @returns {Promise<Array>} - Lista de usuarios
 */
export const getAllUsers = async () => {
  try {
    const usersCollectionRef = collection(db, getUsersCollectionPath());
    const usersSnapshot = await getDocs(usersCollectionRef);
    
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return users;
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);
    throw error;
  }
};

/**
 * Cambia el rol de un usuario
 * @param {string} uid - UID del usuario
 * @param {string} newRole - Nuevo rol
 * @returns {Promise<void>}
 */
export const changeUserRole = async (uid, newRole) => {
  try {
    const newPermissions = getDefaultPermissions(newRole);
    const userDocRef = doc(db, getUsersCollectionPath(), uid);
    
    await updateDoc(userDocRef, {
      role: newRole,
      ...newPermissions,
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Rol de usuario cambiado:', { uid, newRole });
  } catch (error) {
    console.error('❌ Error cambiando rol de usuario:', error);
    throw error;
  }
};

/**
 * Desactiva un usuario
 * @param {string} uid - UID del usuario
 * @returns {Promise<void>}
 */
export const deactivateUser = async (uid) => {
  try {
    const userDocRef = doc(db, getUsersCollectionPath(), uid);
    await updateDoc(userDocRef, {
      isActive: false,
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Usuario desactivado:', uid);
  } catch (error) {
    console.error('❌ Error desactivando usuario:', error);
    throw error;
  }
};

/**
 * Obtiene el perfil de usuario o lo crea si no existe
 * @param {Object} user - Usuario de Firebase Auth
 * @returns {Promise<Object>} - Perfil del usuario
 */
export const getOrCreateUserProfile = async (user) => {
  try {
    let profile = await getUserProfile(user.uid);
    
    if (!profile) {
      profile = await createUserProfile(user);
    }
    
    return profile;
  } catch (error) {
    console.error('❌ Error obteniendo o creando perfil de usuario:', error);
    throw error;
  }
};

// ROLES ya está exportado arriba, no duplicar el export