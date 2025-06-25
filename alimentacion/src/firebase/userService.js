/**
 * Servicio de gestión de perfiles de usuario para Forestech
 * Extiende la funcionalidad de Firebase Auth con roles y permisos
 * Mantiene consistencia con authService.js existente
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import { 
  ROLES, 
  determineUserRole, 
  getDefaultPermissions, 
  ADMIN_EMAIL 
} from '../constants/roles';
import { analyticsEvents } from './analytics';

/**
 * Obtiene la referencia base para usuarios en Firestore
 * Mantiene la estructura existente del proyecto
 */
const getUsersCollectionPath = () => {
  return `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users`;
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
      // Usar lógica anterior
      role = customRole || determineUserRole(user.email);
      permissions = getDefaultPermissions(role);
      displayName = user.displayName || user.email.split('@')[0];
    }
    
    const profile = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      role: role,
      permissions: permissions,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      emailVerified: user.emailVerified,
      photoURL: user.photoURL || null,
      isActive: true
    };

    const userRef = doc(db, `${getUsersCollectionPath()}/${user.uid}/profile/data`);
    await setDoc(userRef, profile);

    // Analytics tracking
    analyticsEvents.custom('user_profile_created', {
      role: role,
      method: 'automatic'
    });

    console.log('✅ Perfil de usuario creado:', role, user.email);
    return { success: true, profile, message: 'Perfil creado exitosamente' };
    
  } catch (error) {
    console.error('❌ Error creando perfil de usuario:', error);
    analyticsEvents.custom('user_profile_error', {
      error_code: error.code,
      operation: 'create'
    });
    
    return { 
      success: false, 
      error: error.message, 
      message: 'Error al crear perfil de usuario' 
    };
  }
};

/**
 * Obtiene el perfil de un usuario desde Firestore
 * @param {string} userId - UID del usuario
 * @returns {Promise<Object|null>} - Perfil del usuario o null
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, `${getUsersCollectionPath()}/${userId}/profile/data`);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const profile = docSnap.data();
      return { success: true, profile };
    } else {
      return { success: false, profile: null, message: 'Perfil no encontrado' };
    }
    
  } catch (error) {
    console.error('❌ Error obteniendo perfil de usuario:', error);
    return { success: false, error: error.message, profile: null };
  }
};

/**
 * Actualiza la última conexión del usuario
 * @param {string} userId - UID del usuario
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const updateLastLogin = async (userId) => {
  try {
    const userRef = doc(db, `${getUsersCollectionPath()}/${userId}/profile/data`);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp()
    });
    
    return { success: true, message: 'Última conexión actualizada' };
    
  } catch (error) {
    console.error('❌ Error actualizando última conexión:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene o crea un perfil de usuario (función principal)
 * @param {Object} user - Usuario de Firebase Auth
 * @returns {Promise<Object>} - Perfil del usuario
 */
export const getOrCreateUserProfile = async (user) => {
  try {
    // Intentar obtener perfil existente
    const profileResult = await getUserProfile(user.uid);
    
    if (profileResult.success && profileResult.profile) {
      // Perfil existe, actualizar última conexión
      await updateLastLogin(user.uid);
      
      // Verificar si es admin y necesita upgrade de permisos
      if (user.email === ADMIN_EMAIL && profileResult.profile.role !== ROLES.ADMIN) {
        console.log('🔄 Actualizando permisos de admin para:', user.email);
        const upgradeResult = await upgradeToAdmin(user.uid);
        if (upgradeResult.success) {
          return { success: true, profile: upgradeResult.profile };
        }
      }
      
      return { success: true, profile: profileResult.profile };
    } else {
      // Perfil no existe, crear nuevo
      console.log('🆕 Creando nuevo perfil para:', user.email);
      const createResult = await createUserProfile(user);
      return createResult;
    }
    
  } catch (error) {
    console.error('❌ Error en getOrCreateUserProfile:', error);
    return { 
      success: false, 
      error: error.message, 
      message: 'Error procesando perfil de usuario' 
    };
  }
};

/**
 * Actualiza un usuario existente a Admin (solo para contacto.evert@gmail.com)
 * @param {string} userId - UID del usuario
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const upgradeToAdmin = async (userId) => {
  try {
    const userRef = doc(db, `${getUsersCollectionPath()}/${userId}/profile/data`);
    const permissions = getDefaultPermissions(ROLES.ADMIN);
    
    const updateData = {
      role: ROLES.ADMIN,
      permissions: permissions,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(userRef, updateData);
    
    // Obtener perfil actualizado
    const profileResult = await getUserProfile(userId);
    
    analyticsEvents.custom('user_role_upgraded', {
      role: ROLES.ADMIN,
      method: 'automatic'
    });
    
    console.log('✅ Usuario actualizado a Admin');
    return { 
      success: true, 
      profile: profileResult.profile, 
      message: 'Permisos de administrador otorgados' 
    };
    
  } catch (error) {
    console.error('❌ Error actualizando a admin:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Cambia el rol de un usuario (solo admins pueden hacer esto)
 * @param {string} userId - UID del usuario a modificar
 * @param {string} newRole - Nuevo rol
 * @param {string} adminUserId - UID del admin que hace el cambio
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const changeUserRole = async (userId, newRole, adminUserId) => {
  try {
    // Verificar que quien hace el cambio es admin
    const adminProfile = await getUserProfile(adminUserId);
    if (!adminProfile.success || adminProfile.profile.role !== ROLES.ADMIN) {
      return { 
        success: false, 
        message: 'Solo los administradores pueden cambiar roles' 
      };
    }
    
    // No permitir cambiar el rol del admin principal
    const targetProfile = await getUserProfile(userId);
    if (targetProfile.success && targetProfile.profile.email === ADMIN_EMAIL) {
      return { 
        success: false, 
        message: 'No se puede modificar el rol del administrador principal' 
      };
    }
    
    const userRef = doc(db, `${getUsersCollectionPath()}/${userId}/profile/data`);
    const permissions = getDefaultPermissions(newRole);
    
    await updateDoc(userRef, {
      role: newRole,
      permissions: permissions,
      updatedAt: serverTimestamp(),
      updatedBy: adminUserId
    });
    
    analyticsEvents.custom('user_role_changed', {
      new_role: newRole,
      changed_by: 'admin'
    });
    
    return { success: true, message: 'Rol actualizado exitosamente' };
    
  } catch (error) {
    console.error('❌ Error cambiando rol de usuario:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene todos los usuarios (solo para admins)
 * @param {string} adminUserId - UID del admin
 * @returns {Promise<Object>} - Lista de usuarios
 */
export const getAllUsers = async (adminUserId) => {
  try {
    // Verificar permisos de admin
    const adminProfile = await getUserProfile(adminUserId);
    if (!adminProfile.success || adminProfile.profile.role !== ROLES.ADMIN) {
      return { success: false, message: 'Acceso denegado' };
    }
    
    // Obtener la colección de usuarios
    const usersCollection = collection(db, getUsersCollectionPath());
    const querySnapshot = await getDocs(usersCollection);
    
    const users = [];
    
    // Para cada usuario, obtener su perfil
    for (const userDoc of querySnapshot.docs) {
      try {
        const userId = userDoc.id;
        
        // Intentar obtener el perfil del usuario
        const profileResult = await getUserProfile(userId);
        if (profileResult.success && profileResult.profile) {
          users.push({
            id: userId,
            uid: userId,
            ...profileResult.profile
          });
        }
      } catch (err) {
        console.warn(`Error obteniendo perfil para usuario ${userDoc.id}:`, err);
        // Continuar con el siguiente usuario
      }
    }
    
    console.log(`✅ Obtenidos ${users.length} usuarios para admin`);
    return { success: true, users };
    
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verifica si un usuario tiene un permiso específico
 * @param {Object} userProfile - Perfil del usuario
 * @param {string} permission - Permiso a verificar
 * @returns {boolean} - True si tiene el permiso
 */
export const hasPermission = (userProfile, permission) => {
  if (!userProfile || !userProfile.permissions) {
    return false;
  }
  return userProfile.permissions[permission] === true;
};

/**
 * Verifica si un usuario tiene un rol específico
 * @param {Object} userProfile - Perfil del usuario
 * @param {string} role - Rol a verificar
 * @returns {boolean} - True si tiene el rol
 */
export const hasRole = (userProfile, role) => {
  if (!userProfile) {
    return false;
  }
  return userProfile.role === role;
};

/**
 * Crea un nuevo usuario desde el panel admin
 * @param {Object} userData - Datos del nuevo usuario
 * @param {string} adminUserId - UID del admin que crea el usuario
 * @returns {Promise<Object>} - Resultado de la creación
 */
export const createNewUser = async (userData, adminUserId) => {
  try {
    // Verificar permisos de admin
    const adminProfile = await getUserProfile(adminUserId);
    if (!adminProfile.success || adminProfile.profile.role !== ROLES.ADMIN) {
      return { 
        success: false, 
        message: 'Solo los administradores pueden crear usuarios' 
      };
    }

    const { email, password, displayName, role } = userData;

    // Validar datos requeridos
    if (!email || !password || !displayName || !role) {
      return {
        success: false,
        message: 'Todos los campos son requeridos (email, contraseña, nombre, rol)'
      };
    }

    // Validar que el rol es válido
    if (!Object.values(ROLES).includes(role)) {
      return {
        success: false,
        message: 'Rol no válido'
      };
    }

    // No permitir crear más admins
    if (role === ROLES.ADMIN) {
      return {
        success: false,
        message: 'No se pueden crear múltiples administradores'
      };
    }

    // Verificar que el email no esté en uso
    const existingUsers = await getAllUsers(adminUserId);
    if (existingUsers.success) {
      const emailExists = existingUsers.users.some(user => user.email === email);
      if (emailExists) {
        return {
          success: false,
          message: 'Ya existe un usuario con ese email'
        };
      }
    }

    // Crear el perfil del usuario en Firestore
    // (La cuenta de Firebase Auth se creará cuando el usuario haga login por primera vez)
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const permissions = getDefaultPermissions(role);
    
    const userProfile = {
      uid: userId,
      email: email,
      displayName: displayName,
      role: role,
      permissions: permissions,
      accountStatus: 'pending', // El usuario debe hacer login por primera vez
      temporaryPassword: password, // Para que el admin pueda comunicársela
      createdAt: serverTimestamp(),
      createdBy: adminUserId,
      mustChangePassword: true
    };

    // Guardar en la estructura correcta: artifacts/{appId}/users/{userId}/profile/data
    const userRef = doc(db, `${getUsersCollectionPath()}/${userId}/profile/data`);
    await setDoc(userRef, userProfile);
    
    // También crear un documento en la colección de usuarios para que aparezca en getAllUsers
    const userDocRef = doc(db, `${getUsersCollectionPath()}/${userId}`);
    await setDoc(userDocRef, { 
      email: email,
      displayName: displayName,
      role: role,
      createdAt: serverTimestamp(),
      hasProfile: true
    });

    analyticsEvents.custom('new_user_created', {
      user_role: role,
      created_by: 'admin'
    });

    return { 
      success: true, 
      message: 'Usuario creado exitosamente',
      userId: userId,
      temporaryPassword: password
    };
    
  } catch (error) {
    console.error('❌ Error creando nuevo usuario:', error);
    return { success: false, error: error.message };
  }
};