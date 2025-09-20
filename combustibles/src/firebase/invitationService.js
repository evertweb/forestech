/**
 * Servicio de invitaciones para Forestech Combustibles
 * Gestiona invitaciones de usuarios
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  collection, 
  getDocs,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

/**
 * Obtiene la referencia base para invitaciones en Firestore
 */
const getInvitationsCollectionPath = () => {
  return `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/invitations`;
};

/**
 * Crear una nueva invitación
 * @param {Object} invitationData - Datos de la invitación
 * @returns {Promise<string>} - ID de la invitación
 */
export const createInvitation = async (invitationData) => {
  try {
    const invitationId = crypto.randomUUID();
    const invitation = {
      id: invitationId,
      email: invitationData.email,
      role: invitationData.role,
      permissions: invitationData.permissions,
      displayName: invitationData.displayName,
      invitedBy: invitationData.invitedBy,
      status: 'pending',
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      used: false,
      usedAt: null,
      usedBy: null
    };

    const invitationDocRef = doc(db, getInvitationsCollectionPath(), invitationId);
    await setDoc(invitationDocRef, invitation);

    console.log('✅ Invitación creada:', invitationId);
    return invitationId;

  } catch (error) {
    console.error('❌ Error creando invitación:', error);
    throw error;
  }
};

/**
 * Obtener invitación por ID
 * @param {string} invitationId - ID de la invitación
 * @returns {Promise<Object|null>} - Datos de la invitación
 */
export const getInvitation = async (invitationId) => {
  try {
    const invitationDocRef = doc(db, getInvitationsCollectionPath(), invitationId);
    const invitationDoc = await getDoc(invitationDocRef);
    
    if (invitationDoc.exists()) {
      return invitationDoc.data();
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error obteniendo invitación:', error);
    throw error;
  }
};

/**
 * Validar y usar una invitación
 * @param {string} invitationId - ID de la invitación
 * @param {string} userUid - UID del usuario que usa la invitación
 * @returns {Promise<Object>} - Datos de la invitación
 */
export const useInvitation = async (invitationId, userUid) => {
  try {
    const invitation = await getInvitation(invitationId);
    
    if (!invitation) {
      throw new Error('Invitación no encontrada');
    }
    
    if (invitation.used) {
      throw new Error('Esta invitación ya ha sido utilizada');
    }
    
    if (new Date() > invitation.expiresAt.toDate()) {
      throw new Error('Esta invitación ha expirado');
    }
    
    // Marcar invitación como usada
    const invitationDocRef = doc(db, getInvitationsCollectionPath(), invitationId);
    await updateDoc(invitationDocRef, {
      used: true,
      usedAt: serverTimestamp(),
      usedBy: userUid,
      status: 'used'
    });
    
    return invitation;
    
  } catch (error) {
    console.error('❌ Error usando invitación:', error);
    throw error;
  }
};

/**
 * Obtener todas las invitaciones
 * @returns {Promise<Array>} - Lista de invitaciones
 */
export const getAllInvitations = async () => {
  try {
    const invitationsCollectionRef = collection(db, getInvitationsCollectionPath());
    const invitationsSnapshot = await getDocs(invitationsCollectionRef);
    
    const invitations = [];
    invitationsSnapshot.forEach((doc) => {
      invitations.push(doc.data());
    });
    
    return invitations;
  } catch (error) {
    console.error('❌ Error obteniendo invitaciones:', error);
    throw error;
  }
};

/**
 * Eliminar invitación
 * @param {string} invitationId - ID de la invitación
 * @returns {Promise<void>}
 */
export const deleteInvitation = async (invitationId) => {
  try {
    const invitationDocRef = doc(db, getInvitationsCollectionPath(), invitationId);
    await deleteDoc(invitationDocRef);
    
    console.log('✅ Invitación eliminada:', invitationId);
  } catch (error) {
    console.error('❌ Error eliminando invitación:', error);
    throw error;
  }
};

/**
 * Verificar si una invitación es válida
 * @param {string} invitationId - ID de la invitación
 * @returns {Promise<boolean>} - True si es válida
 */
export const isInvitationValid = async (invitationId) => {
  try {
    const invitation = await getInvitation(invitationId);
    
    if (!invitation) return false;
    if (invitation.used) return false;
    if (new Date() > invitation.expiresAt.toDate()) return false;
    
    return true;
  } catch (error) {
    console.error('❌ Error validando invitación:', error);
    return false;
  }
};