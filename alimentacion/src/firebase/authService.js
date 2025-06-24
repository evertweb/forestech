// src/firebase/authService.js
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "./config";
import { analyticsEvents } from "./analytics";

// Configurar el provider de Google
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Función para login con email y contraseña
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    analyticsEvents.login('email');
    return { 
      success: true, 
      user: userCredential.user,
      message: 'Inicio de sesión exitoso' 
    };
  } catch (error) {
    analyticsEvents.error('login_email_error', error.message);
    return { 
      success: false, 
      error: error.code,
      message: getErrorMessage(error.code) 
    };
  }
};

// Función para login con Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Verificar si es la primera vez que se registra
    const isNewUser = result._tokenResponse?.isNewUser || false;
    
    if (isNewUser) {
      analyticsEvents.signup('google');
    } else {
      analyticsEvents.login('google');
    }
    
    return { 
      success: true, 
      user: user,
      isNewUser: isNewUser,
      message: isNewUser ? 'Cuenta creada exitosamente con Google' : 'Inicio de sesión exitoso con Google' 
    };
  } catch (error) {
    analyticsEvents.error('login_google_error', error.message);
    return { 
      success: false, 
      error: error.code,
      message: getErrorMessage(error.code) 
    };
  }
};

// Función para registro con email y contraseña
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Enviar verificación de email automáticamente
    await sendEmailVerification(user);
    
    analyticsEvents.signup('email');
    return { 
      success: true, 
      user: user,
      message: 'Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta.' 
    };
  } catch (error) {
    analyticsEvents.error('register_email_error', error.message);
    return { 
      success: false, 
      error: error.code,
      message: getErrorMessage(error.code) 
    };
  }
};

// Función para reenviar verificación de email
export const resendEmailVerification = async () => {
  try {
    if (!auth.currentUser) {
      return { 
        success: false, 
        message: 'No hay usuario autenticado' 
      };
    }
    
    await sendEmailVerification(auth.currentUser);
    return { 
      success: true, 
      message: 'Email de verificación enviado' 
    };
  } catch (error) {
    analyticsEvents.error('resend_verification_error', error.message);
    return { 
      success: false, 
      error: error.code,
      message: getErrorMessage(error.code) 
    };
  }
};

// Función para resetear contraseña
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { 
      success: true, 
      message: 'Email para resetear contraseña enviado' 
    };
  } catch (error) {
    analyticsEvents.error('password_reset_error', error.message);
    return { 
      success: false, 
      error: error.code,
      message: getErrorMessage(error.code) 
    };
  }
};

// Función para obtener mensajes de error en español
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/user-not-found': 'No se encontró una cuenta con este email',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'Ya existe una cuenta con este email',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/invalid-email': 'El email no es válido',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    'auth/popup-closed-by-user': 'Inicio de sesión cancelado',
    'auth/popup-blocked': 'El popup fue bloqueado por el navegador',
    'auth/cancelled-popup-request': 'Solo una ventana de login puede estar abierta a la vez',
    'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este email usando un método diferente',
    'auth/invalid-credential': 'Credenciales inválidas',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/invalid-verification-code': 'Código de verificación inválido',
    'auth/invalid-verification-id': 'ID de verificación inválido'
  };
  
  return errorMessages[errorCode] || 'Ocurrió un error inesperado. Intenta nuevamente.';
};