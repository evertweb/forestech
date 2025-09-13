/**
 * PasskeyManager - Componente para gestionar passkeys del usuario
 * Permite registrar, ver y eliminar passkeys
 */

import React, { useState, useEffect } from 'react';
import {
  registerPasskeyForUser,
  removeUserPasskeys,
  getUserPasskeyInfo,
  isWebAuthnSupported
} from '../services/firebasePasskeyService';

const PasskeyManager = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passkeyInfo, setPasskeyInfo] = useState(null);
  const [webAuthnSupported, setWebAuthnSupported] = useState(false);

  useEffect(() => {
    // Verificar soporte
    const supported = isWebAuthnSupported();
    setWebAuthnSupported(supported);

    // Cargar información de passkeys
    loadPasskeyInfo();
  }, []);

  const loadPasskeyInfo = async () => {
    try {
      const info = await getUserPasskeyInfo();
      setPasskeyInfo(info);
    } catch (error) {
      console.error('Error cargando info de passkeys:', error);
    }
  };

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  const handleRegisterPasskey = async () => {
    clearMessages();
    setLoading(true);

    try {
      const result = await registerPasskeyForUser();

      if (result.success) {
        setMessage(result.message);
        await loadPasskeyInfo(); // Recargar información
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePasskeys = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar todas tus passkeys? Esta acción no se puede deshacer.')) {
      return;
    }

    clearMessages();
    setLoading(true);

    try {
      const result = await removeUserPasskeys();

      if (result.success) {
        setMessage(result.message);
        await loadPasskeyInfo(); // Recargar información
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await loadPasskeyInfo();
    setLoading(false);
  };

  if (!webAuthnSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          ❌ WebAuthn No Soportado
        </h3>
        <p className="text-red-700">
          Tu navegador no soporta passkeys. Necesitas un navegador moderno como 
          Chrome, Safari, Edge o Firefox con soporte para WebAuthn.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🔐 Gestión de Passkeys
        </h3>
        <p className="text-gray-600 text-sm">
          Las passkeys te permiten acceder usando Touch ID, Face ID o Windows Hello
        </p>
      </div>

      <div className="p-6">
        {/* Estado actual */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Estado Actual</h4>
          {passkeyInfo ? (
            <div className={`p-4 rounded-lg border ${
              passkeyInfo.hasPasskeys 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${
                    passkeyInfo.hasPasskeys ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {passkeyInfo.hasPasskeys ? '✅ Passkeys Activas' : '❌ Sin Passkeys'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {passkeyInfo.hasPasskeys 
                      ? `Tienes ${passkeyInfo.credentials?.length || 0} passkey(s) registrada(s)`
                      : 'No tienes passkeys registradas'
                    }
                  </p>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                >
                  🔄 Actualizar
                </button>
              </div>

              {/* Información detallada */}
              {passkeyInfo.hasPasskeys && passkeyInfo.userData && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-xs text-green-700">
                    <strong>Creada:</strong> {new Date(passkeyInfo.userData.passkeyCreatedAt).toLocaleDateString()}
                  </p>
                  {passkeyInfo.userData.lastLogin && (
                    <p className="text-xs text-green-700">
                      <strong>Último uso:</strong> {new Date(passkeyInfo.userData.lastLogin).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">Cargando información...</p>
            </div>
          )}
        </div>

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

        {/* Acciones */}
        <div className="space-y-3">
          {!passkeyInfo?.hasPasskeys ? (
            <button
              onClick={handleRegisterPasskey}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">🔄</span>
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <span>🔐</span>
                  <span>Registrar Passkey</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleRegisterPasskey}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">🔄</span>
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <span>➕</span>
                    <span>Agregar Passkey Adicional</span>
                  </>
                )}
              </button>

              <button
                onClick={handleRemovePasskeys}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">🔄</span>
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <span>🗑️</span>
                    <span>Eliminar Todas las Passkeys</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">📋 Cómo usar passkeys</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Las passkeys funcionan con Touch ID, Face ID o Windows Hello</li>
            <li>• Son más seguras que las contraseñas tradicionales</li>
            <li>• Puedes tener múltiples passkeys para diferentes dispositivos</li>
            <li>• Una vez registrada, úsala en la página de login</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasskeyManager;