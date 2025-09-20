/**
 * AuthVisualEnhanced - Login ULTRA SIMPLE para Forestech
 * Versión de emergencia sin CSS complejo
 */

import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { createUserProfileWithInvitation, createUserProfile } from '../../firebase/userService';
import { isInvitationValid } from '../../firebase/invitationService';
// ✅ NUEVO: Importar servicios de passkeys con Firebase
import {
  authenticateWithPasskey,
  isWebAuthnSupported
} from '../../services/firebasePasskeyService';
// ✅ NUEVO: Importar servicios de reconocimiento facial
import { loginWithFace, captureImageFromVideo } from '../../services/firebaseFacialService';
import { COMMUNICATION_URLS, UI_ACTIONS, UI_FORM_LABELS, UI_MESSAGES } from '../../constants';
import SEOContent from '../SEO/SEOContent';

const AuthVisualEnhanced = () => {
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [passkeyAvailable, setPasskeyAvailable] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  // ✅ NUEVO: Estados para reconocimiento facial
  const [facialSupported, setFacialSupported] = useState(false);
  const [facialLoading, setFacialLoading] = useState(false);
  const [showFacialCapture, setShowFacialCapture] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [validatedInvite, setValidatedInvite] = useState(null);
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    invitationCode: '',
  });

  // Definiciones de estilos
  const logoStyle = {
    backgroundColor: '#059669',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    margin: '0 auto'
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px'
  };

  const inputStyle = {
    width: '100%',
    height: '40px',
    padding: '0 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px'
  };

  const primaryButtonStyle = {
    width: '100%',
    height: '40px',
    backgroundColor: '#059669',
    color: 'white',
    fontWeight: '500',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  };

  const buttonStyle = {
    width: '100%',
    height: '40px',
    backgroundColor: '#059669',
    color: 'white',
    fontWeight: '500',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  };

  // Verificar soporte WebAuthn y disponibilidad de passkeys
  useEffect(() => {
    const checkPasskeyAvailability = async () => {
      try {
        // Verificar soporte básico
        const supported = isWebAuthnSupported();
        setPasskeySupported(supported);

        if (!supported) {
          setPasskeyAvailable(false);
          return;
        }

        // TODO: Verificar si hay passkeys disponibles globalmente
        // Por ahora, mostrar el botón si está soportado
        setPasskeyAvailable(true);

      } catch (error) {
        console.error('Error verificando passkeys:', error);
        setPasskeySupported(false);
        setPasskeyAvailable(false);
      }
    };

    // ✅ NUEVO: Verificar soporte para reconocimiento facial
    const checkFacialSupport = () => {
      try {
        const facialSupported = typeof window !== 'undefined' &&
                               typeof navigator !== 'undefined' &&
                               !!navigator.mediaDevices &&
                               typeof navigator.mediaDevices.getUserMedia === 'function';
        setFacialSupported(facialSupported);
        
        console.log('🔍 Soporte biométrico:', { 
          passkeySupported: isWebAuthnSupported(), 
          facialSupported,
          mediaDevices: !!navigator.mediaDevices,
          getUserMedia: typeof navigator.mediaDevices?.getUserMedia,
          isSecure: window.isSecureContext
        });
      } catch (error) {
        console.log('Error verificando soporte facial:', error);
        setFacialSupported(false);
      }
    };

    checkPasskeyAvailability();
    checkFacialSupport();
  }, []);

  // Limpiar mensajes
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Funciones de autenticación
  const handlePasskeyLogin = async () => {
    setPasskeyLoading(true);
    clearMessages();
    
    try {
      console.log('🔐 Iniciando autenticación con passkey...');
      
      const result = await authenticateWithPasskey();
      
      if (result.success) {
        if (result.requiresEmailLogin && result.email) {
          // Si necesita login con email después de verificar passkey
          setSuccess('¡Passkey verificada! Completando autenticación...');
          
          // Aquí podríamos implementar autenticación silenciosa o mostrar un mensaje
          // Por ahora, mostrar mensaje de éxito
          setSuccess(`¡Passkey verificada para ${result.email}! La autenticación completa se implementará próximamente.`);
        } else {
          setSuccess(result.message);
        }
      } else {
        setError(result.error || 'Error al autenticar con passkey');
      }
    } catch (error) {
      console.error('❌ Error inesperado con passkey:', error);
      setError('Error al usar passkey. Si no tienes passkeys registradas, inicia sesión con email y contraseña primero.');
    } finally {
      setPasskeyLoading(false);
    }
  };

  // ✅ NUEVO: Funciones de reconocimiento facial
  const handleFacialLogin = async () => {
    setFacialLoading(true);
    clearMessages();
    
    try {
      // Solicitar acceso a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' // Cámara frontal
        } 
      });
      
      setVideoStream(stream);
      setShowFacialCapture(true);
    } catch (error) {
      console.error('Error accediendo a la cámara:', error);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    } finally {
      setFacialLoading(false);
    }
  };

  const handleCaptureAndLogin = async () => {
    if (!videoStream) return;
    
    setFacialLoading(true);
    clearMessages();
    
    try {
      // Crear elementos canvas temporales
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      
      video.srcObject = videoStream;
      await video.play();
      
      // Capturar imagen
      const imageBlob = await captureImageFromVideo(video, canvas);
      
      // Detener el stream
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
      setShowFacialCapture(false);
      
      // Intentar login facial
      const result = await loginWithFace(imageBlob);
      
      if (result.success) {
        setSuccess('¡Inicio de sesión facial exitoso!');
      } else {
        setError(result.error || 'Rostro no reconocido');
      }
    } catch (error) {
      console.error('Error en login facial:', error);
      setError('Error en reconocimiento facial. Intenta nuevamente.');
    } finally {
      setFacialLoading(false);
    }
  };

  const cancelFacialCapture = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setShowFacialCapture(false);
    setFacialLoading(false);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('¡Inicio de sesión exitoso!');
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    clearMessages();
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (validatedInvite) {
        await createUserProfileWithInvitation(result.user, validatedInvite.code);
      } else {
        await createUserProfile(result.user);
      }
      
      setSuccess('¡Inicio de sesión con Google exitoso!');
    } catch (_error) {
      setError('Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateInvitation = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const result = await isInvitationValid(inviteCode);
      if (result.success) {
        setValidatedInvite(result.invitation);
        setSuccess(`Invitación válida para: ${result.invitation.targetEmail}`);
        setView('register');
        setRegisterData({
          ...registerData,
          email: result.invitation.targetEmail,
          invitationCode: inviteCode,
        });
      } else {
        setError(result.error);
      }
    } catch (_error) {
      setError('Error validando código de invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterWithInvitation = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

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
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/user-not-found': 'No existe una cuenta con este email',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
    };
    return errorMessages[errorCode] || 'Error de autenticación. Intenta nuevamente.';
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setInviteCode('');
    setValidatedInvite(null);
    setRegisterData({
      email: '',
      password: '',
      confirmPassword: '',
      invitationCode: '',
    });
    setShowEmailForm(false);
    clearMessages();
  };

  // Estilos Apple - usando CSS classes

  // Renderizar mensajes Apple
  const renderMessages = () => (
    <div>
      {success && (
        <div className="apple-auth-message success">
          ✅ {success}
        </div>
      )}
      
      {error && (
        <div className="apple-auth-message error">
          ⚠️ {error}
        </div>
      )}
    </div>
  );

  // Vista principal de login Apple
  const renderLoginView = () => (
    <div>
      {/* Header Apple */}
      <div className="apple-auth-header">
        <div className="apple-auth-logo">
          🌲
        </div>
        <h1 className="apple-auth-title">
          Forestech Combustibles
        </h1>
        <p className="apple-auth-subtitle">
          Sistema de gestión forestal
        </p>
      </div>

      {renderMessages()}

      {/* Botón Passkey Apple */}
      {passkeySupported && passkeyAvailable && (
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <button
            onClick={handlePasskeyLogin}
            disabled={passkeyLoading || loading}
            className="apple-auth-button apple-auth-button-primary"
          >
            {passkeyLoading ? (
              <div className="apple-auth-loading">
                <span className="apple-auth-spinner"></span>
                <span>Verificando...</span>
              </div>
            ) : (
              <>
                <span>🔐</span>
                <span>Acceder con Passkey</span>
              </>
            )}
          </button>
          <div className="apple-auth-features">
            <span className="apple-auth-feature">Touch ID</span>
            <span>•</span>
            <span className="apple-auth-feature">Face ID</span>
            <span>•</span>
            <span className="apple-auth-feature">Windows Hello</span>
          </div>
        </div>
      )}

      {/* Botón Reconocimiento Facial Apple */}
      {facialSupported && (
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <button
            onClick={handleFacialLogin}
            disabled={facialLoading || loading}
            className="apple-auth-button apple-auth-button-success"
          >
            {facialLoading ? (
              <div className="apple-auth-loading">
                <span className="apple-auth-spinner"></span>
                <span>Accediendo a cámara...</span>
              </div>
            ) : (
              <>
                <span>📷</span>
                <span>Acceder con Rostro</span>
              </>
            )}
          </button>
          <p className="apple-auth-hint">
            Reconocimiento facial con IA
          </p>
        </div>
      )}

      {/* Separador Apple */}
      <div className="apple-auth-separator">
        <div className="apple-auth-separator-line"></div>
        <span className="apple-auth-separator-text">O</span>
        <div className="apple-auth-separator-line"></div>
      </div>

      {/* Toggle formulario email */}
      {!showEmailForm ? (
        <button
          onClick={() => setShowEmailForm(true)}
          className="apple-auth-button apple-auth-button-text"
        >
          Acceder con email y contraseña
        </button>
      ) : (
        <div className="apple-auth-form">
          <form onSubmit={handleEmailLogin}>
            <div className="apple-auth-form-group">
              <label className="apple-auth-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="tu@ejemplo.com"
                className="apple-auth-input"
              />
            </div>

            <div className="apple-auth-form-group">
              <label className="apple-auth-label">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Tu contraseña"
                className="apple-auth-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="apple-auth-button apple-auth-button-secondary"
              style={{ backgroundColor: 'var(--apple-gray-700)', color: 'var(--apple-white)' }}
            >
              {loading ? (
                <div className="apple-auth-loading">
                  <span className="apple-auth-spinner"></span>
                  <span>Iniciando...</span>
                </div>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </form>

          <button
            onClick={() => setShowEmailForm(false)}
            className="apple-auth-link apple-auth-back-link"
            style={{ width: '100%', textAlign: 'center', marginTop: 'var(--spacing-2)' }}
          >
            Ocultar formulario
          </button>
        </div>
      )}

      {/* Separador Apple */}
      <div className="apple-auth-separator">
        <div className="apple-auth-separator-line"></div>
        <span className="apple-auth-separator-text">O continúa con</span>
        <div className="apple-auth-separator-line"></div>
      </div>
      
      {/* Botón Google Apple */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="apple-auth-button apple-auth-button-secondary"
      >
        <span>🌐</span>
        <span>Google</span>
      </button>

      {/* Link invitación Apple */}
      <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
        <button
          onClick={() => {
            resetForm();
            setView('invite');
          }}
          className="apple-auth-link"
        >
          ¿Tienes código de invitación?
        </button>
      </div>
    </div>
  );

  // Vista invitación
  const renderInviteView = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          ...logoStyle,
          width: '48px',
          height: '48px',
          fontSize: '20px'
        }}>
          🌲
        </div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '8px'
        }}>Código de Invitación</h2>
        <p style={subtitleStyle}>Ingresa tu código de 8 caracteres</p>
      </div>

      {renderMessages()}

      <form onSubmit={handleValidateInvitation}>
        <div>
          <label style={labelStyle}>Código de invitación</label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            required
            disabled={loading}
            placeholder="XXXXXXXX"
            maxLength={8}
            style={{
              ...inputStyle,
              textAlign: 'center',
              fontFamily: 'monospace',
              fontSize: '18px',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...primaryButtonStyle,
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? (
            <>
              <span>🔄</span>
              <span>Validando...</span>
            </>
          ) : (
            <span>Validar Código</span>
          )}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          onClick={() => {
            resetForm();
            setView('login');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          ← Volver al login
        </button>
      </div>
    </div>
  );

  // Vista registro
  const renderRegisterView = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          ...logoStyle,
          width: '48px',
          height: '48px',
          fontSize: '20px'
        }}>
          🌲
        </div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '8px'
        }}>Crear Cuenta</h2>
        <p style={subtitleStyle}>Completa tu registro</p>
      </div>

      {renderMessages()}

      <form onSubmit={handleRegisterWithInvitation}>
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={registerData.email}
            disabled
            style={{
              ...inputStyle,
              backgroundColor: '#f9fafb',
              color: '#6b7280'
            }}
          />
        </div>

        <div>
          <label style={labelStyle}>Contraseña</label>
          <input
            type="password"
            value={registerData.password}
            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
            required
            disabled={loading}
            placeholder="Mínimo 6 caracteres"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Confirmar contraseña</label>
          <input
            type="password"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
            required
            disabled={loading}
            placeholder="Repite tu contraseña"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            backgroundColor: '#059669',
            color: 'white',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? (
            <>
              <span>🔄</span>
              <span>Creando...</span>
            </>
          ) : (
            <span>Crear Cuenta</span>
          )}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          onClick={() => {
            resetForm();
            setView('login');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          ← Volver al login
        </button>
      </div>
    </div>
  );

  // ✅ NUEVO: Vista de captura facial
  const renderFacialCaptureView = () => (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#059669',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          margin: '0 auto 16px'
        }}>
          📷
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px' }}>
          Reconocimiento Facial
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
          Colócate frente a la cámara
        </p>
      </div>

      {renderMessages()}

      {/* Video preview */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          position: 'relative',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          overflow: 'hidden',
          height: '300px',
          marginBottom: '16px'
        }}>
          {videoStream ? (
            <video
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              ref={(video) => {
                if (video && videoStream) {
                  video.srcObject = videoStream;
                }
              }}
            />
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#6b7280'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px' }}>📷</div>
                <p style={{ marginTop: '8px' }}>Cámara no disponible</p>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleCaptureAndLogin}
            disabled={facialLoading || !videoStream}
            style={{
              flex: 1,
              height: '48px',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: (facialLoading || !videoStream) ? 0.6 : 1
            }}
          >
            {facialLoading ? (
              <>
                <span>🔄</span>
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <span>📷</span>
                <span>Capturar y Verificar</span>
              </>
            )}
          </button>

          <button
            onClick={cancelFacialCapture}
            style={{
              padding: '0 16px',
              height: '48px',
              backgroundColor: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => {
            cancelFacialCapture();
            setView('login');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          ← Volver al login
        </button>
      </div>
    </div>
  );

  return (
    <div className="apple-auth-container">
      <SEOContent
        title="Forestech Combustibles - Login"
        description="Sistema de gestión de combustible forestal. Acceso con passkeys o credenciales tradicionales."
      />
      
      <div className="apple-auth-card">
        {showFacialCapture ? renderFacialCaptureView() : (
          <>
            {view === 'login' && renderLoginView()}
            {view === 'invite' && renderInviteView()}
            {view === 'register' && renderRegisterView()}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthVisualEnhanced;