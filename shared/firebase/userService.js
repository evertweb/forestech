// shared/firebase/userService.js  
// Servicio de gestión de usuarios compartido entre todas las apps Forestech
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config";
import { 
  ROLES, 
  determineUserRole, 
  getAlimentacionPermissions, 
  getCombustiblesPermissions 
} from "../constants/roles";

/**
 * Crea o actualiza el perfil de usuario en Firestore
 * Compatible con todas las apps del monorepo
 */
export const createUserProfile = async (user, additionalData = {}, invitationData = null) => {
  const userRef = doc(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users`, user.uid);
  
  try {
    const existingUser = await getDoc(userRef);
    
    if (!existingUser.exists()) {
      // Determinar rol automático o desde invitación
      const role = invitationData?.role || determineUserRole(user.email);
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData.displayName || '',
        photoURL: user.photoURL || additionalData.photoURL || '',
        role: role,
        emailVerified: user.emailVerified,
        
        // Permisos por app
        alimentacionPermissions: getAlimentacionPermissions(role),
        combustiblesPermissions: getCombustiblesPermissions(role),
        
        // Metadatos
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        provider: additionalData.provider || 'email',
        
        // Datos adicionales
        ...additionalData
      };
      
      await setDoc(userRef, userData);
      return { success: true, userData, isNewUser: true };
    } else {
      // Usuario existente - actualizar datos básicos
      const updateData = {
        lastLogin: new Date().toISOString(),
        emailVerified: user.emailVerified,
        displayName: user.displayName || existingUser.data().displayName,
        photoURL: user.photoURL || existingUser.data().photoURL
      };
      
      await updateDoc(userRef, updateData);
      return { success: true, userData: { ...existingUser.data(), ...updateData }, isNewUser: false };
    }
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene el perfil completo del usuario
 */
export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users`, uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { success: true, userData: userDoc.data() };
    } else {
      return { success: false, error: 'Usuario no encontrado' };
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualiza el rol de un usuario (solo Admin)
 */
export const updateUserRole = async (uid, newRole, updatedBy) => {
  try {
    const userRef = doc(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users`, uid);
    
    const updateData = {
      role: newRole,
      alimentacionPermissions: getAlimentacionPermissions(newRole),
      combustiblesPermissions: getCombustiblesPermissions(newRole),
      roleUpdatedAt: new Date().toISOString(),
      roleUpdatedBy: updatedBy
    };
    
    await updateDoc(userRef, updateData);
    return { success: true, message: `Rol actualizado a ${newRole}` };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene todos los usuarios (solo Admin)
 */
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users`);
    const querySnapshot = await getDocs(usersRef);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching all users:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Verifica si el usuario tiene un permiso específico para una app
 */
export const hasPermission = (userData, app, permission) => {
  if (!userData) return false;
  
  const appPermissions = app === 'alimentacion' 
    ? userData.alimentacionPermissions 
    : userData.combustiblesPermissions;
    
  return appPermissions?.[permission] || false;
};

/**
 * Verifica si el usuario es Admin
 */
export const isAdmin = (userData) => {
  return userData?.role === ROLES.ADMIN;
};

/**
 * Verifica si el usuario es Contador o superior
 */
export const isCounterOrAbove = (userData) => {
  return userData?.role === ROLES.ADMIN || userData?.role === ROLES.CONTADOR;
};

/**
 * Obtiene usuarios por rol específico
 */
export const getUsersByRole = async (role) => {
  try {
    const usersRef = collection(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users`);
    const q = query(usersRef, where("role", "==", role));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching users by role:", error);
    return { success: false, error: error.message };
  }
};