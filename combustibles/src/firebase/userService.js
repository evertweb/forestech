// combustibles/src/firebase/userService.js
// Servicio de usuarios para combustibles con soporte de invitaciones
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';
import { determineUserRole, getCombustiblesPermissions } from '../constants/roles';
import {
  validateInvitationCode,
  markInvitationAsUsed,
  getPermissionsFromInvitation,
} from './invitationService';

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
        ...additionalData,
      };

      await setDoc(userRef, userData);
      return { success: true, userData, isNewUser: true };
    } else {
      // Usuario existente
      const userData = existingUser.data();
      return { success: true, userData, isNewUser: false };
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Crea perfil de usuario usando código de invitación
 */
export const createUserProfileWithInvitation = async (
  user,
  invitationCode,
  additionalData = {}
) => {
  const userRef = doc(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users`, user.uid);

  try {
    const existingUser = await getDoc(userRef);

    if (existingUser.exists()) {
      // Usuario ya existe
      const userData = existingUser.data();
      return { success: true, userData, isNewUser: false };
    }

    // Validar código de invitación
    const invitationResult = await validateInvitationCode(invitationCode);
    if (!invitationResult.success) {
      return invitationResult;
    }

    const invitation = invitationResult.invitation;

    // Verificar que el email coincida
    if (invitation.targetEmail !== user.email.toLowerCase()) {
      return {
        success: false,
        error: 'El código de invitación no corresponde a este email',
      };
    }

    // Crear usuario con rol de la invitación
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || invitation.targetName || '',
      photoURL: user.photoURL || '',
      role: invitation.targetRole,
      emailVerified: user.emailVerified,
      combustiblesPermissions: getPermissionsFromInvitation(invitation),
      invitationUsed: invitation.id,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      ...additionalData,
    };

    await setDoc(userRef, userData);

    // Marcar invitación como usada
    await markInvitationAsUsed(invitation.id, user.uid);

    console.log('👤 Usuario creado con invitación:', {
      email: user.email,
      role: invitation.targetRole,
      invitationCode: invitation.code,
    });

    return { success: true, userData, isNewUser: true };
  } catch (error) {
    console.error('Error creating user profile with invitation:', error);
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
    console.error('Error fetching user profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Actualiza los permisos de un usuario específico (función temporal para desarrollo)
 */
export const updateUserPermissions = async (userId, newRole = 'admin') => {
  const userRef = doc(db, `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users`, userId);

  try {
    const newPermissions = getCombustiblesPermissions(newRole);

    await setDoc(
      userRef,
      {
        role: newRole,
        combustiblesPermissions: newPermissions,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return { success: true, newRole, newPermissions };
  } catch (error) {
    console.error('Error updating user permissions:', error);
    return { success: false, error: error.message };
  }
};
