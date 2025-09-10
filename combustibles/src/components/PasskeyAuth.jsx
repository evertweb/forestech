/**
 * PasskeyAuth.jsx - Componente React para autenticación con passkeys
 * Integra Firebase Web Authn Extension con UI amigable
 */

import React, { useState, useEffect } from 'react';
import {
  createUserWithWebAuthn,
  signInWithWebAuthn,
  linkPasskeyToUser,
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

  useEffect(() => {
    // Escuchar cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Verificar capacidades del dispositivo
    checkDeviceCapabilities();

    return () => unsubscribe();
  }, []);

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

  const handleCreateUser = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await createUserWithWebAuthn('Usuario Combustibles');

      if (result.success) {
        setMessage(result.message);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Error inesperado al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await signInWithWebAuthn();

      if (result.success) {
        setMessage(result.message);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkPasskey = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await linkPasskeyToUser('Passkey Secundaria');

      if (result.success) {
        setMessage(result.message);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error linking passkey:', err);
      setError('Error inesperado al vincular passkey');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkPasskey = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await unlinkPasskeyFromUser();

      if (result.success) {
        setMessage(result.message);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error unlinking passkey:', err);
      setError('Error inesperado al desvincular passkey');
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
          🔐 Autenticación con Passkeys
        </h2>
        <p className="text-gray-600 text-sm">
          Inicia sesión de forma segura usando Touch ID, Face ID o Windows Hello
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

      {/* Botones de acción */}
      <div className="space-y-3">
        {!user ? (
          <>
            <button
              onClick={handleCreateUser}
              disabled={loading || !readiness.ready}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creando usuario...' : '🆕 Crear cuenta con passkey'}
            </button>

            <button
              onClick={handleSignIn}
              disabled={loading || !readiness.ready}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Iniciando sesión...' : '🔑 Iniciar sesión con passkey'}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleLinkPasskey}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Vinculando...' : '🔗 Agregar passkey adicional'}
            </button>

            <button
              onClick={handleUnlinkPasskey}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Desvinculando...' : '🗑️ Eliminar passkey'}
            </button>

            <button
              onClick={() => auth.signOut()}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              🚪 Cerrar sesión
            </button>
          </>
        )}
      </div>

      {/* Información técnica (modo debug) */}
      {capabilities && (
        <details className="mt-6">
          <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
            Ver información técnica del dispositivo
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-600">
            <pre>{JSON.stringify(capabilities, null, 2)}</pre>
          </div>
        </details>
      )}
    </div>
  );
};

export default PasskeyAuth;
