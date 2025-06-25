/**
 * Servicio de Invitaciones para Forestech
 * Gestiona códigos de invitación para crear nuevos usuarios de forma segura
 * Soluciona el problema de crear usuarios sin cuentas Firebase Auth
 */

import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  getDocs,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import { ROLES, getDefaultPermissions } from '../constants/roles';
import { getUserProfile } from './userService';
import { analyticsEvents } from './analytics';

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
    if (!adminProfile.success || adminProfile.profile.role !== ROLES.ADMIN) {
      return { 
        success: false, 
        message: 'Solo los administradores pueden crear invitaciones' 
      };
    }

    const { email, displayName, role } = invitationData;

    // Validar datos requeridos
    if (!email || !displayName || !role) {
      return {
        success: false,
        message: 'Todos los campos son requeridos (email, nombre, rol)'
      };
    }

    // Validar que el rol es válido
    if (!Object.values(ROLES).includes(role)) {
      return {
        success: false,
        message: 'Rol no válido'
      };
    }

    // No permitir crear invitaciones para admin
    if (role === ROLES.ADMIN) {
      return {
        success: false,
        message: 'No se pueden crear invitaciones para administradores'
      };
    }

    // Verificar que no exista ya una invitación activa para este email
    const existingInvitation = await getInvitationByEmail(email);
    if (existingInvitation.success && existingInvitation.invitation?.status === 'pending') {
      return {
        success: false,
        message: 'Ya existe una invitación activa para este email'
      };
    }

    // Generar código único
    let invitationCode;
    let codeExists = true;
    let attempts = 0;
    
    while (codeExists && attempts < 10) {
      invitationCode = generateInvitationCode();
      const existingCode = await getInvitationByCode(invitationCode);
      codeExists = existingCode.success;
      attempts++;
    }

    if (codeExists) {
      return {
        success: false,
        message: 'Error generando código único. Inténtalo de nuevo.'
      };
    }

    // Crear la invitación
    const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const invitation = {
      id: invitationId,
      code: invitationCode,
      email: email.toLowerCase(),
      displayName: displayName,
      role: role,
      permissions: getDefaultPermissions(role),
      status: 'pending', // pending, used, expired
      createdAt: serverTimestamp(),
      createdBy: adminUserId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      usedAt: null,
      usedBy: null
    };

    const invitationRef = doc(db, `${getInvitationsPath()}/${invitationId}`);
    await setDoc(invitationRef, invitation);

    analyticsEvents.custom('invitation_created', {
      target_role: role,
      created_by: 'admin',
      code_length: invitationCode.length
    });

    return { 
      success: true, 
      message: 'Invitación creada exitosamente',
      invitation: {
        code: invitationCode,
        email: email,
        displayName: displayName,
        role: role,
        expiresAt: invitation.expiresAt
      }
    };
    
  } catch (error) {
    console.error('❌ Error creando invitación:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene una invitación por código
 * @param {string} code - Código de invitación
 * @returns {Promise<Object>} - Invitación o null
 */
export const getInvitationByCode = async (code) => {
  try {
    const invitationsRef = collection(db, getInvitationsPath());
    const q = query(invitationsRef, where('code', '==', code.toUpperCase()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, invitation: null };
    }
    
    const doc = querySnapshot.docs[0];
    const invitation = { id: doc.id, ...doc.data() };
    
    return { success: true, invitation };
    
  } catch (error) {
    console.error('❌ Error obteniendo invitación por código:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene una invitación por email
 * @param {string} email - Email del invitado
 * @returns {Promise<Object>} - Invitación o null
 */
export const getInvitationByEmail = async (email) => {
  try {
    const invitationsRef = collection(db, getInvitationsPath());
    const q = query(invitationsRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, invitation: null };
    }
    
    const doc = querySnapshot.docs[0];
    const invitation = { id: doc.id, ...doc.data() };
    
    return { success: true, invitation };
    
  } catch (error) {
    console.error('❌ Error obteniendo invitación por email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Valida y usa una invitación durante el registro
 * @param {string} code - Código de invitación
 * @param {string} userEmail - Email del usuario que se registra
 * @param {string} userId - UID del usuario registrado
 * @returns {Promise<Object>} - Resultado de la validación
 */
export const useInvitation = async (code, userEmail, userId) => {
  try {
    const invitationResult = await getInvitationByCode(code);
    
    if (!invitationResult.success || !invitationResult.invitation) {
      return {
        success: false,
        message: 'Código de invitación no válido'
      };
    }
    
    const invitation = invitationResult.invitation;
    
    // Verificar que la invitación esté pendiente
    if (invitation.status !== 'pending') {
      return {
        success: false,
        message: 'Esta invitación ya ha sido utilizada o ha expirado'
      };
    }
    
    // Verificar que no haya expirado
    const now = new Date();
    const expiresAt = invitation.expiresAt.toDate ? invitation.expiresAt.toDate() : new Date(invitation.expiresAt);
    
    if (now > expiresAt) {
      return {
        success: false,
        message: 'Esta invitación ha expirado'
      };
    }
    
    // Verificar que el email coincida
    if (invitation.email !== userEmail.toLowerCase()) {
      return {
        success: false,
        message: 'Esta invitación no corresponde a tu email'
      };
    }
    
    // Marcar la invitación como usada
    const invitationRef = doc(db, `${getInvitationsPath()}/${invitation.id}`);
    await updateDoc(invitationRef, {
      status: 'used',
      usedAt: serverTimestamp(),
      usedBy: userId
    });
    
    analyticsEvents.custom('invitation_used', {
      target_role: invitation.role,
      code_length: code.length
    });
    
    return {
      success: true,
      role: invitation.role,
      permissions: invitation.permissions,
      displayName: invitation.displayName
    };
    
  } catch (error) {
    console.error('❌ Error usando invitación:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene todas las invitaciones (solo para admins)
 * @param {string} adminUserId - UID del admin
 * @returns {Promise<Object>} - Lista de invitaciones
 */
export const getAllInvitations = async (adminUserId) => {
  try {
    // Verificar permisos de admin
    const adminProfile = await getUserProfile(adminUserId);
    if (!adminProfile.success || adminProfile.profile.role !== ROLES.ADMIN) {
      return { success: false, message: 'Acceso denegado' };
    }
    
    const invitationsRef = collection(db, getInvitationsPath());
    const querySnapshot = await getDocs(invitationsRef);
    
    const invitations = [];
    querySnapshot.forEach((doc) => {
      invitations.push({ id: doc.id, ...doc.data() });
    });
    
    // Ordenar por fecha de creación (más recientes primero)
    invitations.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB - dateA;
    });
    
    return { success: true, invitations };
    
  } catch (error) {
    console.error('❌ Error obteniendo invitaciones:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Cancela una invitación (solo admins)
 * @param {string} invitationId - ID de la invitación
 * @param {string} adminUserId - UID del admin
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const cancelInvitation = async (invitationId, adminUserId) => {
  try {
    // Verificar permisos de admin
    const adminProfile = await getUserProfile(adminUserId);
    if (!adminProfile.success || adminProfile.profile.role !== ROLES.ADMIN) {
      return { success: false, message: 'Acceso denegado' };
    }
    
    const invitationRef = doc(db, `${getInvitationsPath()}/${invitationId}`);
    await updateDoc(invitationRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      cancelledBy: adminUserId
    });
    
    analyticsEvents.custom('invitation_cancelled', {
      cancelled_by: 'admin'
    });
    
    return { success: true, message: 'Invitación cancelada exitosamente' };
    
  } catch (error) {
    console.error('❌ Error cancelando invitación:', error);
    return { success: false, error: error.message };
  }
};