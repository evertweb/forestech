/**
 * useFacialAuth - Hook personalizado para autenticación facial
 * Centraliza la lógica y proporciona una API limpia
 */

import { useState, useCallback } from 'react';
import { registerFace, loginWithFace, checkFacialSupport } from '../services/firebaseFacialService';

export const useFacialAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Verificar soporte
  const isSupported = checkFacialSupport();

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  // Registro facial
  const registerUserFace = useCallback(async (imageBlob) => {
    setLoading(true);
    clearMessages();

    try {
      console.log('🔄 Iniciando registro facial...');
      
      const result = await registerFace(imageBlob);
      
      if (result.success) {
        setSuccess('¡Rostro registrado exitosamente! Ya puedes usar reconocimiento facial para iniciar sesión.');
        console.log('✅ Registro facial exitoso:', result);
        return { success: true, data: result };
      } else {
        setError(result.error || 'Error durante el registro facial');
        console.error('❌ Error en registro:', result);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Error durante el registro facial. Intenta nuevamente.';
      setError(errorMessage);
      console.error('❌ Error en registerUserFace:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  // Login facial
  const loginWithUserFace = useCallback(async (imageBlob) => {
    setLoading(true);
    clearMessages();

    try {
      console.log('🔄 Iniciando autenticación facial...');
      
      const result = await loginWithFace(imageBlob);
      
      if (result.success) {
        setSuccess(`¡Autenticación facial exitosa! Bienvenido de vuelta.`);
        console.log('✅ Login facial exitoso:', result);
        return { success: true, user: result.user, similarity: result.similarity };
      } else {
        setError(result.error || 'Rostro no reconocido. Intenta nuevamente o usa otro método de acceso.');
        console.log('❌ Login facial fallido:', result);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Error durante la autenticación facial. Verifica tu conexión e intenta nuevamente.';
      setError(errorMessage);
      console.error('❌ Error en loginWithUserFace:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  // Validar imagen antes de procesar
  const validateImage = useCallback((imageBlob) => {
    if (!imageBlob) {
      setError('No se pudo capturar la imagen. Intenta nuevamente.');
      return false;
    }

    if (imageBlob.size === 0) {
      setError('La imagen capturada está vacía. Intenta nuevamente.');
      return false;
    }

    if (imageBlob.size > 5 * 1024 * 1024) { // 5MB máximo
      setError('La imagen es demasiado grande. Intenta con mejor iluminación.');
      return false;
    }

    return true;
  }, []);

  return {
    // Estados
    loading,
    error,
    success,
    isSupported,
    
    // Acciones
    registerUserFace,
    loginWithUserFace,
    validateImage,
    clearMessages,
    
    // Utilidades
    setError,
    setSuccess
  };
};

export default useFacialAuth;