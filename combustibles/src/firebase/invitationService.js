/**
 * Servicio de Invitaciones para Combustibles
 * Gestiona códigos de invitación para crear nuevos usuarios de forma segura
 * Adaptado del sistema de alimentación
 */

import { 
  doc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  getDocs,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import { ROLES, getCombustiblesPermissions } from '../constants/roles';
import { getUserProfile } from './userService';

/**
 * Obtiene la referencia base para invitaciones en Firestore
 */
const getInvitationsPath = () => {
  return `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/invitations`;
};

/**
 * Genera un código de invitación único
 * @returns {string} - Código de 8 caracteres alfanumérico
 */
const generateInvitationCode = () => {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // Sin O, 0 para evitar confusión
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Crea una nueva invitación (en lugar de crear usuario directamente)
 * @param {Object} invitationData - Datos de la invitación
 * @param {string} adminUserId - UID del admin que crea la invitación
 * @returns {Promise<Object>} - Resultado de la creación
 */
export const createInvitation = async (invitationData, adminUserId) => {
  try {
    // Verificar permisos de admin
    const adminProfile = await getUserProfile(adminUserId);
    if (!adminProfile.success || adminProfile.userData.role !== 'admin') {
      return { success: false, error: 'Solo administradores pueden crear invitaciones' };
    }

    // Generar código único
    let invitationCode;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      invitationCode = generateInvitationCode();
      
      // Verificar si el código ya existe
      const q = query(
        collection(db, getInvitationsPath()),
        where("code", "==", invitationCode)
      );
      const existingCodes = await getDocs(q);
      
      if (existingCodes.empty) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return { success: false, error: 'No se pudo generar un código único' };
    }

    // Crear invitación
    const invitationRef = doc(collection(db, getInvitationsPath()));
    const invitation = {
      code: invitationCode,
      targetEmail: invitationData.email.toLowerCase(),
      targetRole: invitationData.role || ROLES.CLIENTE,
      targetName: invitationData.name || '',
      status: 'pending',
      appContext: 'combustibles',
      expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // 7 días
      createdAt: serverTimestamp(),
      createdBy: adminUserId,
      usedAt: null,
      usedBy: null
    };

    await setDoc(invitationRef, invitation);

    console.log('🎫 Invitación creada:', {
      code: invitationCode,
      email: invitationData.email,
      role: invitationData.role
    });

    return { 
      success: true, 
      invitation: {
        id: invitationRef.id,
        code: invitationCode,
        ...invitation
      }
    };
  } catch (error) {
    console.error('Error creating invitation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Valida un código de invitación
 * @param {string} invitationCode - Código a validar
 * @returns {Promise<Object>} - Resultado de la validación
 */
export const validateInvitationCode = async (invitationCode) => {
  try {
    const q = query(
      collection(db, getInvitationsPath()),
      where("code", "==", invitationCode.toUpperCase()),
      where("status", "==", "pending")
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: 'Código de invitación inválido o expirado' };
    }

    const invitationDoc = querySnapshot.docs[0];
    const invitation = invitationDoc.data();
    
    // Verificar expiración
    const now = new Date();
    const expiresAt = invitation.expiresAt.toDate();
    
    if (now > expiresAt) {
      return { success: false, error: 'Código de invitación expirado' };
    }

    return { 
      success: true, 
      invitation: {
        id: invitationDoc.id,
        ...invitation
      }
    };
  } catch (error) {
    console.error('Error validating invitation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Marca una invitación como usada
 * @param {string} invitationId - ID de la invitación
 * @param {string} userId - UID del usuario que usó la invitación
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const markInvitationAsUsed = async (invitationId, userId) => {
  try {
    const invitationRef = doc(db, getInvitationsPath(), invitationId);
    
    await updateDoc(invitationRef, {
      status: 'used',
      usedAt: serverTimestamp(),
      usedBy: userId
    });

    return { success: true };
  } catch (error) {
    console.error('Error marking invitation as used:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Lista todas las invitaciones (solo para admins)
 * @param {string} adminUserId - UID del admin
 * @returns {Promise<Object>} - Lista de invitaciones
 */
export const getInvitations = async (adminUserId) => {
  try {
    // Verificar permisos de admin
    const adminProfile = await getUserProfile(adminUserId);
    if (!adminProfile.success || adminProfile.userData.role !== 'admin') {
      return { success: false, error: 'Solo administradores pueden ver invitaciones' };
    }

    const q = query(collection(db, getInvitationsPath()));
    const querySnapshot = await getDocs(q);
    
    const invitations = [];
    querySnapshot.forEach((doc) => {
      invitations.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Ordenar por fecha de creación (más recientes primero)
    invitations.sort((a, b) => {
      const aTime = a.createdAt?.toDate() || new Date(0);
      const bTime = b.createdAt?.toDate() || new Date(0);
      return bTime - aTime;
    });

    return { success: true, invitations };
  } catch (error) {
    console.error('Error getting invitations:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Cancela una invitación pendiente
 * @param {string} invitationId - ID de la invitación
 * @param {string} adminUserId - UID del admin
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const cancelInvitation = async (invitationId, adminUserId) => {
  try {
    // Verificar permisos de admin
    const adminProfile = await getUserProfile(adminUserId);
    if (!adminProfile.success || adminProfile.userData.role !== 'admin') {
      return { success: false, error: 'Solo administradores pueden cancelar invitaciones' };
    }

    const invitationRef = doc(db, getInvitationsPath(), invitationId);
    
    await updateDoc(invitationRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      cancelledBy: adminUserId
    });

    return { success: true };
  } catch (error) {
    console.error('Error cancelling invitation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene los permisos basados en una invitación
 * @param {Object} invitation - Datos de la invitación
 * @returns {Object} - Permisos para combustibles
 */
export const getPermissionsFromInvitation = (invitation) => {
  return getCombustiblesPermissions(invitation.targetRole);
};