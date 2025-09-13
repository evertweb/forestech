/**
 * SimplePasskeyAuth - Componente simplificado para probar passkeys
 * Versión básica sin integración con Firebase Auth
 */

import React, { useState, useEffect } from 'react';
import {
  checkWebAuthnSupport,
  registerPasskey,
  authenticateWithPasskey,
  getRegisteredPasskeys,
  clearAllPasskeys,
} from '../services/simpleWebAuthnService';

const SimplePasskeyAuth = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('Usuario Demo');
  const [passkeys, setPasskeys] = useState([]);
  const [webAuthnSupported, setWebAuthnSupported] = useState(false);

  useEffect(() => {
    // Verificar soporte al cargar
    const supported = checkWebAuthnSupport();
    setWebAuthnSupported(supported);

    if (supported) {
      loadPasskeys();
    } else {
      setError('WebAuthn no es soportado en este navegador');
    }
  }, []);

  const loadPasskeys = () => {
    const stored = getRegisteredPasskeys();
    setPasskeys(stored);
  };

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  const handleRegister = async () => {
    clearMessages();
    setLoading(true);

    try {
      const result = await registerPasskey(userName);

      if (result.success) {
        setMessage(result.message);
        loadPasskeys(); // Recargar lista
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticate = async () => {
    clearMessages();
    setLoading(true);

    try {
      const result = await authenticateWithPasskey();

      if (result.success) {
        setMessage(`${result.message} Bienvenido, ${result.userName}!`);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    clearMessages();
    const result = clearAllPasskeys();
    setMessage(result.message);
    setPasskeys([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔐 Passkeys Sencillas
        </h2>
        <p className="text-gray-600 text-sm">
          Versión simplificada usando solo WebAuthn nativo
        </p>
      </div>

      {/* Estado de soporte */}
      <div className="mb-6">
        <div className={`p-4 rounded-lg border ${
          webAuthnSupported
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <h3 className={`font-semibold mb-2 ${
            webAuthnSupported ? 'text-green-900' : 'text-red-900'
          }`}>
            {webAuthnSupported ? '✅ WebAuthn Soportado' : '❌ WebAuthn No Soportado'}
          </h3>
          <p className={`text-sm ${
            webAuthnSupported ? 'text-green-700' : 'text-red-700'
          }`}>
            {webAuthnSupported
              ? 'Tu dispositivo soporta passkeys (Touch ID, Face ID, Windows Hello)'
              : 'Este navegador no soporta WebAuthn'
            }
          </p>
        </div>
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

      {/* Input para nombre de usuario */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de usuario
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tu nombre"
        />
      </div>

      {/* Estado de passkeys */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Passkeys Registradas</h3>
        {passkeys.length === 0 ? (
          <p className="text-sm text-gray-500">No hay passkeys registradas</p>
        ) : (
          <div className="space-y-2">
            {passkeys.map((passkey, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded border">
                <p className="text-sm font-medium">{passkey.userName}</p>
                <p className="text-xs text-gray-500">
                  Creada: {new Date(passkey.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  Usos: {passkey.counter || 0}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="space-y-3">
        <button
          onClick={handleRegister}
          disabled={loading || !webAuthnSupported}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {loading ? 'Registrando...' : '➕ Registrar Passkey'}
        </button>

        <button
          onClick={handleAuthenticate}
          disabled={loading || !webAuthnSupported || passkeys.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {loading ? 'Autenticando...' : '✅ Probar Autenticación'}
        </button>

        <button
          onClick={handleClearAll}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {loading ? 'Limpiando...' : '🗑️ Limpiar Todas'}
        </button>
      </div>

      {/* Instrucciones */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">📋 Cómo usar</h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Ingresa tu nombre</li>
          <li>2. Haz clic en "Registrar Passkey"</li>
          <li>3. Usa Touch ID/Face ID/Windows Hello</li>
          <li>4. ¡Prueba la autenticación!</li>
        </ol>
      </div>
    </div>
  );
};

export default SimplePasskeyAuth;