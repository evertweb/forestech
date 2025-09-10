// combustibles/src/components/Auth/Auth.jsx
// Componente de autenticación con soporte de invitaciones y detección WebAuthn directa
import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { createUserProfileWithInvitation, createUserProfile } from '../../firebase/userService';
import { validateInvitationCode } from '../../firebase/invitationService';
import { getBackgroundImageUrl, preloadBackgroundImage } from '../../services/backgroundImageService';
import './Auth.css';

const Auth = () => {
  // Vista actual: 'login' | 'invite' | 'register'
  const [view, setView] = useState('login');

  // Estado general
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fondo
  const [backgroundImage, setBackgroundImage] = useState('');
  const [imageLoading, setImageLoading] = useState(true);

  // Animación UI
  const [isExpanded, setIsExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Registro por invitación
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    invitationCode: '',
  });

  // Invitación
  const [inviteCode, setInviteCode] = useState('');
  const [validatedInvite, setValidatedInvite] = useState(null);

  // WebAuthn (detección)
  const [webAuthnSupported, setWebAuthnSupported] = useState(false);
  const [platformAuthenticatorAvailable, setPlatformAuthenticatorAvailable] = useState(false);

  // Cargar imagen de fondo
  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const imageUrl = await getBackgroundImageUrl();
        const loaded = await preloadBackgroundImage(imageUrl);
        if (loaded) {
          const cssUrl = imageUrl.replace(/'/g, "\\'").replace(/"/g, '\\"');
          setBackgroundImage(`url("${cssUrl}")`);
        }
      } catch (err) {
        console.warn('Error cargando imagen de fondo:', err);
      } finally {
        setImageLoading(false);
      }
    };
    loadBackgroundImage();
  }, []);

  // Verificar capacidades WebAuthn (sin dependencias externas)
  useEffect(() => {
    const checkWebAuthnCapabilities = async () => {
      try {
        const basicSupport = typeof window !== 'undefined' &&
                             'credentials' in navigator &&
                             'create' in navigator.credentials;
        if (!basicSupport) {
          setWebAuthnSupported(false);
          setPlatformAuthenticatorAvailable(false);
          return;
        }

        let platformAvailable = false;
        if (window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable) {
          try {
            platformAvailable = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          } catch (e) {
            console.warn('Error verificando autenticador de plataforma:', e);
          }
        }
        setWebAuthnSupported(true);
        setPlatformAuthenticatorAvailable(!!platformAvailable);
      } catch (e) {
        console.warn('Error comprobando WebAuthn:', e);
        setWebAuthnSupported(false);
        setPlatformAuthenticatorAvailable(false);
      }
    };

    checkWebAuthnCapabilities();
  }, []);

  // Handlers
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error('Error en login:', err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (validatedInvite) {
        await createUserProfileWithInvitation(result.user, validatedInvite.code);
      } else {
        await createUserProfile(result.user);
      }
    } catch (err) {
      console.error('Error en login con Google:', err);
      setError('Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!webAuthnSupported) throw new Error('WebAuthn no está soportado en este dispositivo');
      if (!platformAuthenticatorAvailable) throw new Error('No hay autenticadores de plataforma disponibles');
      setSuccess('Funcionalidad de passkeys detectada correctamente');
      setError('Sistema de passkeys listo. Se requiere backend para completar el flujo.');
    } catch (err) {
      setError('Error al usar passkey: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUserWithPasskey = async () => {
    if (!validatedInvite) {
      setError('Necesitas un código de invitación válido para crear cuenta con passkey');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!webAuthnSupported) throw new Error('WebAuthn no está soportado en este dispositivo');
      if (!platformAuthenticatorAvailable) throw new Error('No hay autenticadores de plataforma disponibles');
      setSuccess('Detección de passkey correcta. El registro con passkey requiere endpoints backend.');
      setError('Implementa la Fase 2 (registro) para completar este flujo.');
    } catch (err) {
      setError('Error al crear cuenta con passkey: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateInvitation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await validateInvitationCode(inviteCode);
      if (result.success) {
        setValidatedInvite(result.invitation);
        setSuccess(`Invitación válida para: ${result.invitation.targetEmail}`);
        setView('register');
        setRegisterData((prev) => ({
          ...prev,
          email: result.invitation.targetEmail,
          invitationCode: inviteCode,
        }));
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error validando invitación:', err);
      setError('Error validando código de invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterWithInvitation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    if (registerData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        registerData.email,
        registerData.password
      );

      const profileResult = await createUserProfileWithInvitation(
        result.user,
        registerData.invitationCode
      );

      if (profileResult.success) {
        setSuccess('¡Registro exitoso! Bienvenido al sistema.');
      } else {
        setError(profileResult.error);
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Utilidades
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'El formato del email es inválido';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/invalid-credential':
        return 'Email o contraseña incorrectos';
      case 'auth/email-already-in-use':
        return 'Este email ya está registrado';
      case 'auth/weak-password':
        return 'La contraseña es muy débil';
      default:
        return 'Error de autenticación. Inténtalo de nuevo.';
    }
  };

  const resetForm = () => {
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setInviteCode('');
    setValidatedInvite(null);
    setRegisterData({ email: '', password: '', confirmPassword: '', invitationCode: '' });
  };

  const handleExpandLogin = () => {
    setIsExpanded(true);
    setTimeout(() => setShowForm(true), 300);
  };

  const renderContent = () => {
    switch (view) {
      case 'login':
        if (!isExpanded) {
          return (
            <div className="minimal-login-container">
              <button
                onClick={handleExpandLogin}
                className="auth-button minimal-login-btn"
                disabled={loading}
                aria-busy={imageLoading ? 'true' : 'false'}
                aria-describedby={imageLoading ? 'bg-loading-hint' : undefined}
              >
                ⛽ Ingresar al Sistema
              </button>
              {imageLoading && (
                <div id="bg-loading-hint" className="loading-hint">
                  Cargando fondo... puedes continuar sin esperar
                </div>
              )}
            </div>
          );
        }

        return (
          <div className={`expanded-form ${showForm ? 'show' : ''}`}>
            <form onSubmit={handleEmailLogin}>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="tu-email@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña:</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Tu contraseña"
                />
              </div>

              <button type="submit" className="auth-button primary" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="auth-divider">
              <span>o</span>
            </div>

            <button onClick={handleGoogleLogin} className="auth-button google" disabled={loading}>
              <span>🔗</span>
              Continuar con Google
            </button>

            {webAuthnSupported && (
              <button
                onClick={handlePasskeyLogin}
                className="auth-button passkey"
                disabled={loading || !platformAuthenticatorAvailable}
                title={platformAuthenticatorAvailable ? 'Iniciar sesión con passkey' : 'No hay autenticadores disponibles'}
              >
                <span>🔐</span>
                {loading ? 'Verificando...' : 'Iniciar con Passkey'}
              </button>
            )}

            {webAuthnSupported && !platformAuthenticatorAvailable && (
              <small className="passkey-hint">
                💡 Las passkeys requieren un dispositivo con autenticación biométrica o PIN
              </small>
            )}

            <div className="auth-actions">
              <button
                className="link-button"
                onClick={() => {
                  resetForm();
                  setView('invite');
                }}
              >
                ¿Tienes un código de invitación? Regístrate aquí
              </button>
            </div>
          </div>
        );

      case 'invite':
        return (
          <>
            <form onSubmit={handleValidateInvitation}>
              <div className="form-group">
                <label htmlFor="inviteCode">Código de invitación:</label>
                <input
                  id="inviteCode"
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  required
                  disabled={loading}
                  placeholder="XXXXXXXX"
                  maxLength={8}
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
                />
                <small>Ingresa el código de 8 caracteres que recibiste</small>
              </div>

              <button type="submit" className="auth-button primary" disabled={loading}>
                {loading ? 'Validando...' : 'Validar Código'}
              </button>
            </form>

            {webAuthnSupported && (
              <>
                <div className="auth-divider">
                  <span>o</span>
                </div>

                <button
                  onClick={handlePasskeyLogin}
                  className="auth-button passkey"
                  disabled={loading || !platformAuthenticatorAvailable}
                  title={platformAuthenticatorAvailable ? 'Iniciar sesión con passkey' : 'No hay autenticadores disponibles'}
                >
                  <span>🔐</span>
                  {loading ? 'Verificando...' : 'Continuar con Passkey'}
                </button>

                {!platformAuthenticatorAvailable && (
                  <small className="passkey-hint">
                    💡 Las passkeys requieren un dispositivo con autenticación biométrica o PIN
                  </small>
                )}
              </>
            )}

            <div className="auth-actions">
              <button
                className="link-button"
                onClick={() => {
                  resetForm();
                  setView('login');
                }}
              >
                Volver al inicio de sesión
              </button>
            </div>
          </>
        );

      case 'register':
        return (
          <>
            <div className="invitation-info">
              <div className="success-message">✅ Código válido para: {validatedInvite?.targetEmail}</div>
            </div>

            <form onSubmit={handleRegisterWithInvitation}>
              <div className="form-group">
                <label htmlFor="registerEmail">Email:</label>
                <input id="registerEmail" type="email" value={registerData.email} disabled className="disabled-input" />
              </div>

              <div className="form-group">
                <label htmlFor="registerPassword">Contraseña:</label>
                <input
                  id="registerPassword"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                  disabled={loading}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña:</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                  disabled={loading}
                  placeholder="Repite tu contraseña"
                />
              </div>

              <button type="submit" className="auth-button primary" disabled={loading}>
                {loading ? 'Registrando...' : 'Crear Cuenta'}
              </button>
            </form>

            <div className="auth-divider">
              <span>o</span>
            </div>

            <button onClick={handleGoogleLogin} className="auth-button google" disabled={loading}>
              <span>🔗</span>
              Registrarse con Google
            </button>

            {webAuthnSupported && validatedInvite && (
              <button
                onClick={handleCreateUserWithPasskey}
                className="auth-button passkey"
                disabled={loading || !platformAuthenticatorAvailable}
                title={platformAuthenticatorAvailable ? 'Crear cuenta con passkey' : 'No hay autenticadores disponibles'}
              >
                <span>🔐</span>
                {loading ? 'Creando...' : 'Crear Cuenta con Passkey'}
              </button>
            )}

            <div className="auth-actions">
              <button
                className="link-button"
                onClick={() => {
                  resetForm();
                  setView('invite');
                }}
              >
                Usar otro código de invitación
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: backgroundImage
          ? `linear-gradient(135deg, rgba(27, 67, 50, 0.3) 0%, rgba(45, 80, 22, 0.2) 50%, rgba(27, 67, 50, 0.3) 100%), ${backgroundImage}`
          : `radial-gradient(circle at 20% 20%, rgba(82, 165, 113, 0.4) 0%, transparent 50%),
             radial-gradient(circle at 80% 80%, rgba(101, 200, 120, 0.4) 0%, transparent 50%),
             radial-gradient(circle at 40% 60%, rgba(64, 130, 109, 0.4) 0%, transparent 50%),
             linear-gradient(135deg, #1b4332 0%, #2d5016 25%, #40826d 50%, #2d5016 75%, #1b4332 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {imageLoading && (
        <div className="image-loading-overlay">
          <div className="image-loading-spinner">
            <div className="spinner"></div>
            <p>Cargando...</p>
          </div>
        </div>
      )}

      <div className={`auth-card ${isExpanded ? 'expanded' : 'minimal'}`}>
        {isExpanded && (
          <div className="auth-header">
            <h1>⛽ Combustibles</h1>
            <h2>Forestech Colombia</h2>
            <p>
              {view === 'login' && 'Sistema de gestión de combustibles'}
              {view === 'invite' && 'Validar código de invitación'}
              {view === 'register' && 'Crear nueva cuenta'}
            </p>
          </div>
        )}

        <div className="auth-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          {renderContent()}
          {isExpanded && (
            <div className="auth-footer">
              <p>
                <small>
                  Solo usuarios autorizados pueden acceder al sistema.
                  <br />
                  {view === 'login'
                    ? 'Contacta al administrador para obtener un c��digo de invitación.'
                    : 'Si no tienes código, contacta al administrador.'}
                </small>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
