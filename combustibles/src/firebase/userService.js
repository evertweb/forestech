// combustibles/src/firebase/userService.js
// Servicio básico de usuarios para combustibles
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config";
import { determineUserRole, getCombustiblesPermissions } from "../constants/roles";

/**
 * Crea o actualiza el perfil de usuario
 */
export const createUserProfile = async (user, additionalData = {}) => {
  const userRef = doc(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users`, user.uid);
  
  try {
    const existingUser = await getDoc(userRef);
    
    if (!existingUser.exists()) {
      // Nuevo usuario
      const role = determineUserRole(user.email);
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: role,
        emailVerified: user.emailVerified,
        combustiblesPermissions: getCombustiblesPermissions(role),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        ...additionalData
      };
      
      await setDoc(userRef, userData);
      return { success: true, userData, isNewUser: true };
    } else {
      // Usuario existente
      const userData = existingUser.data();
      return { success: true, userData, isNewUser: false };
    }
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene el perfil del usuario
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