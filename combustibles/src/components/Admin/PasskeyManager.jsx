/**
 * PasskeyManager.jsx - Gestión de Passkeys para usuarios autenticados
 * Permite agregar/eliminar passkeys después del login
 */

import React, { useState, useEffect } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import {
  linkPasskeyToUser,
  unlinkPasskeyFromUser,
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
} from '../../firebase/firebaseWebAuthnService-native';
import './PasskeyManager.css';

const PasskeyManager = () => {
  const { user } = useCombustibles();
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [passkeyAvailable, setPasskeyAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hasPasskey, setHasPasskey] = useState(false);

  useEffect(() => {
    const checkPasskeySupport = async () => {
      try {
        const supported = isWebAuthnSupported();
        setPasskeySupported(supported);

        if (supported) {
          const available = await isPlatformAuthenticatorAvailable();
          setPasskeyAvailable(available);
        }
      } catch (error) {
        console.warn('Error verificando soporte de passkeys:', error);
        setPasskeySupported(false);
        setPasskeyAvailable(false);
      }
    };

    checkPasskeySupport();
  }, []);

  useEffect(() => {
    // TODO: Verificar si el usuario ya tiene passkey registrada
    // Por ahora asumimos que no tiene
    setHasPasskey(false);
  }, [user]);

  const handleAddPasskey = async () => {
    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const displayName = user.displayName || user.email || 'Usuario Forestech';
      const result = await linkPasskeyToUser(displayName);

      if (result.success) {
        setMessage(
          '✅ Passkey agregada exitosamente. Ahora puedes iniciar sesión usando Touch ID, Face ID o Windows Hello.'
        );
        setHasPasskey(true);
      } else {
        setError(result.error || 'Error al agregar passkey');
      }
    } catch (err) {
      console.error('Error agregando passkey:', err);
      setError(
        'Error inesperado al agregar passkey. Verifica que tu dispositivo soporte autenticación biométrica.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePasskey = async () => {
    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await unlinkPasskeyFromUser();

      if (result.success) {
        setMessage('✅ Passkey eliminada exitosamente.');
        setHasPasskey(false);
      } else {
        setError(result.error || 'Error al eliminar passkey');
      }
    } catch (err) {
      console.error('Error eliminando passkey:', err);
      setError('Error inesperado al eliminar passkey.');
    } finally {
      setLoading(false);
    }
  };

  if (!passkeySupported) {
    return (
      <div className="passkey-manager">
        <div className="passkey-status not-supported">
          <div className="status-icon">❌</div>
          <h3>Passkeys no disponibles</h3>
          <p>Tu navegador o dispositivo no soporta autenticación con passkeys.</p>
          <div className="compatibility-info">
            <h4>Dispositivos compatibles:</h4>
            <ul>
              <li>iPhone/iPad con Touch ID o Face ID (Safari)</li>
              <li>Mac con Touch ID (Safari/Chrome)</li>
              <li>Android con huella dactilar (Chrome)</li>
              <li>Windows con Windows Hello (Edge/Chrome)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!passkeyAvailable) {
    return (
      <div className="passkey-manager">
        <div className="passkey-status not-available">
          <div className="status-icon">⚠️</div>
          <h3>Autenticación biométrica no disponible</h3>
          <p>
            Tu dispositivo soporta passkeys pero no tiene configurada la autenticación biométrica.
          </p>
          <div className="setup-instructions">
            <h4>Para habilitar passkeys:</h4>
            <ul>
              <li>
                <strong>iPhone/iPad:</strong> Configura Touch ID o Face ID en Ajustes
              </li>
              <li>
                <strong>Mac:</strong> Configura Touch ID en Preferencias del Sistema
              </li>
              <li>
                <strong>Android:</strong> Configura huella dactilar en Configuración
              </li>
              <li>
                <strong>Windows:</strong> Configura Windows Hello en Configuración
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="passkey-manager">
      <div className="passkey-header">
        <h2>🔐 Gestión de Passkeys</h2>
        <p>
          Configura el acceso rápido y seguro usando tu huella dactilar, Face ID o Windows Hello
        </p>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="message error">
          <span className="message-icon">❌</span>
          {error}
        </div>
      )}

      {message && (
        <div className="message success">
          <span className="message-icon">✅</span>
          {message}
        </div>
      )}

      {/* Estado actual */}
      <div className="passkey-status">
        <div className="status-card">
          <div className="status-icon">{hasPasskey ? '🔐' : '🔓'}</div>
          <div className="status-info">
            <h3>{hasPasskey ? 'Passkey configurada' : 'Sin passkey'}</h3>
            <p>
              {hasPasskey
                ? 'Puedes iniciar sesión usando autenticación biométrica'
                : 'Agrega una passkey para acceso rápido y seguro'}
            </p>
          </div>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="user-info">
        <h4>👤 Cuenta actual</h4>
        <div className="user-details">
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Nombre:</strong> {user?.displayName || 'Sin nombre'}
          </p>
          <p>
            <strong>Verificado:</strong> {user?.emailVerified ? '✅ Sí' : '❌ No'}
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="passkey-actions">
        {!hasPasskey ? (
          <button onClick={handleAddPasskey} disabled={loading} className="passkey-button add">
            <span className="button-icon">🔐</span>
            <span className="button-text">
              {loading ? 'Configurando passkey...' : 'Agregar Passkey'}
            </span>
          </button>
        ) : (
          <button
            onClick={handleRemovePasskey}
            disabled={loading}
            className="passkey-button remove"
          >
            <span className="button-icon">🗑️</span>
            <span className="button-text">
              {loading ? 'Eliminando passkey...' : 'Eliminar Passkey'}
            </span>
          </button>
        )}
      </div>

      {/* Información adicional */}
      <div className="passkey-info">
        <h4>ℹ️ Acerca de las Passkeys</h4>
        <div className="info-content">
          <div className="benefit">
            <span className="benefit-icon">🚀</span>
            <span>Acceso instantáneo sin contraseñas</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🛡️</span>
            <span>Más seguro que contraseñas tradicionales</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🔒</span>
            <span>Protección contra phishing</span>
          </div>
          <div className="benefit">
            <span className="benefit-icon">📱</span>
            <span>Funciona en todos tus dispositivos</span>
          </div>
        </div>

        <div className="security-note">
          <p>
            <strong>Nota de seguridad:</strong> Las passkeys se almacenan de forma segura en tu
            dispositivo y están protegidas por tu autenticación biométrica. Nunca se comparten con
            terceros.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasskeyManager;
