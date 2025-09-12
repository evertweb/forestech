/**
 * PasskeyAuth.jsx - Componente React para autenticación con passkeys
 * Integra Firebase Web Authn Extension con UI amigable
 */

import React, { useState, useEffect } from 'react';
import {
  // ✅ NUEVAS FUNCIONES CORREGIDAS
  linkPasskeyToCurrentUser,
  signInCurrentUserWithPasskey,
  checkUserHasPasskeys,
  unlinkPasskeyFromUser,
  checkWebAuthnReadiness,
  getWebAuthnCapabilities
} from '../firebase/firebaseWebAuthnService-native';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const PasskeyAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [capabilities, setCapabilities] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  // ✅ NUEVO: Estado para verificar si el usuario tiene passkeys
  const [userHasPasskeys, setUserHasPasskeys] = useState(false);
  const [checkingPasskeys, setCheckingPasskeys] = useState(true);

  useEffect(() => {
    // Escuchar cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // ✅ NUEVO: Verificar si el usuario actual tiene passkeys
        await checkUserPasskeys();
      } else {
        setUserHasPasskeys(false);
        setCheckingPasskeys(false);
      }
    });

    // Verificar capacidades del dispositivo
    checkDeviceCapabilities();

    return () => unsubscribe();
  }, []);

  // ✅ NUEVA FUNCIÓN: Verificar passkeys del usuario actual
  const checkUserPasskeys = async () => {
    setCheckingPasskeys(true);
    try {
      const result = await checkUserHasPasskeys();
      setUserHasPasskeys(result.hasPasskeys);
      console.log('🔐 Estado passkeys usuario:', result);

      if (result.hasPasskeys) {
        setMessage('✅ Usuario tiene passkeys registradas');
      } else {
        setMessage('ℹ️ Usuario no tiene passkeys registradas');
      }
    } catch (error) {
      console.error('Error verificando passkeys:', error);
      setUserHasPasskeys(false);
    } finally {
      setCheckingPasskeys(false);
    }
  };

  const checkDeviceCapabilities = async () => {
    try {
      const caps = await getWebAuthnCapabilities();
      const ready = await checkWebAuthnReadiness();
      setCapabilities(caps);
      setReadiness(ready);
    } catch (error) {
      console.error('Error verificando capacidades:', error);
    }
  };

  // ✅ NUEVA FUNCIÓN: Crear passkey para usuario actual (no crear usuario nuevo)
  const handleCreatePasskey = async () => {
    if (!user) {
      setError('Debes iniciar sesión primero para crear una passkey');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await linkPasskeyToCurrentUser('Passkey Usuario Combustibles');

      if (result.success) {
        setMessage(result.message);
        // Actualizar estado para mostrar que ahora tiene passkeys
        await checkUserPasskeys();
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error creating passkey:', err);
      setError('Error inesperado al crear passkey');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN ACTUALIZADA: Login con passkey para usuario actual
  const handleSignIn = async () => {
    if (!user) {
      setError('Debes iniciar sesión primero para usar passkey');
      return;
    }

    if (!userHasPasskeys) {
      setError('No tienes passkeys registradas. Crea una primero.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await signInCurrentUserWithPasskey();

      if (result.success) {
        setMessage(result.message);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Error inesperado al usar passkey');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN ACTUALIZADA: Eliminar passkey del usuario actual
  const handleUnlinkPasskey = async () => {
    if (!user) {
      setError('Debes iniciar sesión para eliminar passkeys');
      return;
    }

    if (!userHasPasskeys) {
      setError('No tienes passkeys para eliminar');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await unlinkPasskeyFromUser();

      if (result.success) {
        setMessage(result.message);
        // Actualizar estado
        await checkUserPasskeys();
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error unlinking passkey:', err);
      setError('Error inesperado al eliminar passkey');
    } finally {
      setLoading(false);
    }
  };

  if (!readiness) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Verificando capacidades del dispositivo...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔐 Gestión de Passkeys
        </h2>
        <p className="text-gray-600 text-sm">
          Gestiona tus passkeys para autenticación segura
        </p>
      </div>

      {/* Estado de preparación */}
      <div className="mb-6 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Estado del Dispositivo</h3>
        <p className={`text-sm ${readiness.ready ? 'text-green-600' : 'text-red-600'}`}>
          {readiness.summary}
        </p>

        {!readiness.ready && (
          <div className="mt-2">
            <p className="text-sm font-semibold text-gray-700">Recomendaciones:</p>
            <ul className="text-xs text-gray-600 mt-1">
              {readiness.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start mt-1">
                  <span className="text-blue-500 mr-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ✅ NUEVO: Estado de passkeys del usuario */}
      {user && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Estado de tus Passkeys</h3>
          {checkingPasskeys ? (
            <p className="text-sm text-blue-700">Verificando passkeys...</p>
          ) : (
            <div>
              <p className={`text-sm font-semibold ${userHasPasskeys ? 'text-green-700' : 'text-gray-700'}`}>
                {userHasPasskeys ? '✅ Tienes passkeys registradas' : '❌ No tienes passkeys registradas'}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Usuario: {user.email}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Información del usuario */}
      {user && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">✅ Usuario Autenticado</h3>
          <p className="text-sm text-green-700">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-sm text-green-700">
            <strong>UID:</strong> {user.uid}
          </p>
        </div>
      )}

      {/* Mensajes */}
      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ✅ BOTONES ACTUALIZADOS */}
      <div className="space-y-3">
        {!user ? (
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-700">
              ℹ️ Debes iniciar sesión primero para gestionar passkeys
            </p>
          </div>
        ) : (
          <>
            {/* Crear Passkey */}
            {!userHasPasskeys && (
              <button
                onClick={handleCreatePasskey}
                disabled={loading || !readiness.ready}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                {loading ? 'Creando...' : '🔐 Crear Passkey'}
              </button>
            )}

            {/* Usar Passkey */}
            {userHasPasskeys && (
              <button
                onClick={handleSignIn}
                disabled={loading || !readiness.ready}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                {loading ? 'Autenticando...' : '✅ Probar Passkey'}
              </button>
            )}

            {/* Eliminar Passkey */}
            {userHasPasskeys && (
              <button
                onClick={handleUnlinkPasskey}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                {loading ? 'Eliminando...' : '🗑️ Eliminar Passkey'}
              </button>
            )}

            {/* Actualizar Estado */}
            <button
              onClick={checkUserPasskeys}
              disabled={loading || checkingPasskeys}
              className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              {checkingPasskeys ? 'Verificando...' : '🔄 Actualizar Estado'}
            </button>
          </>
        )}
      </div>

      {/* ✅ NUEVO: Instrucciones claras */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">📋 Instrucciones</h4>
        <ol className="text-sm text-gray-700 space-y-1">
          <li>1. Inicia sesión con email/contraseña</li>
          <li>2. Haz clic en "Crear Passkey"</li>
          <li>3. Usa Touch ID/Face ID/Windows Hello</li>
          <li>4. ¡Ya puedes usar passkeys en el login principal!</li>
        </ol>
      </div>
    </div>
  );
};

export default PasskeyAuth;
