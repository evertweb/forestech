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
import { validateInvitationCode } from '../../firebase/invitationService';
import SEOContent from '../SEO/SEOContent';

const AuthVisualEnhanced = () => {
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
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

  // Verificar soporte WebAuthn
  useEffect(() => {
    const supported = typeof window !== 'undefined' &&
                      'credentials' in navigator &&
                      'create' in navigator.credentials;
    setPasskeySupported(supported);
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      setError('Funcionalidad en desarrollo - Usa email/contraseña');
    } catch (_error) {
      setError('Error con passkey. Intenta con email y contraseña.');
    } finally {
      setPasskeyLoading(false);
    }
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
      const result = await validateInvitationCode(inviteCode);
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

  // Estilos inline simples
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #065f46 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    padding: '32px',
    width: '100%',
    maxWidth: '400px'
  };

  const logoStyle = {
    width: '64px',
    height: '64px',
    backgroundColor: '#059669',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    margin: '0 auto 16px auto'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '24px'
  };

  const buttonStyle = {
    width: '100%',
    height: '48px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '12px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2563eb',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db'
  };

  const inputStyle = {
    width: '100%',
    height: '40px',
    padding: '0 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '16px',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px'
  };

  const errorStyle = {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '16px'
  };

  const successStyle = {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#16a34a',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '16px'
  };

  const separatorStyle = {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
    fontSize: '14px',
    color: '#6b7280'
  };

  const lineStyle = {
    flex: 1,
    height: '1px',
    backgroundColor: '#d1d5db'
  };

  // Renderizar mensajes
  const renderMessages = () => (
    <div>
      {success && (
        <div style={successStyle}>
          ✅ {success}
        </div>
      )}
      
      {error && (
        <div style={errorStyle}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );

  // Vista principal de login
  const renderLoginView = () => (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={logoStyle}>
          🌲
        </div>
        <h1 style={titleStyle}>
          Forestech Combustibles
        </h1>
        <p style={subtitleStyle}>
          Sistema de gestión forestal
        </p>
      </div>

      {renderMessages()}

      {/* Botón Passkey */}
      {passkeySupported && (
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={handlePasskeyLogin}
            disabled={passkeyLoading || loading}
            style={{
              ...primaryButtonStyle,
              opacity: (passkeyLoading || loading) ? 0.6 : 1
            }}
          >
            {passkeyLoading ? (
              <>
                <span>🔄</span>
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <span>🔐</span>
                <span>Acceder con Passkey</span>
              </>
            )}
          </button>
          <p style={{ fontSize: '12px', textAlign: 'center', color: '#6b7280', margin: '8px 0' }}>
            Touch ID • Face ID • Windows Hello
          </p>
        </div>
      )}

      {/* Separador */}
      <div style={separatorStyle}>
        <div style={lineStyle}></div>
        <span style={{ margin: '0 12px' }}>O</span>
        <div style={lineStyle}></div>
      </div>

      {/* Toggle formulario email */}
      {!showEmailForm ? (
        <button
          onClick={() => setShowEmailForm(true)}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            padding: '8px',
            marginBottom: '16px'
          }}
        >
          Acceder con email y contraseña
        </button>
      ) : (
        <div style={{ marginBottom: '16px' }}>
          <form onSubmit={handleEmailLogin}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="tu@ejemplo.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Tu contraseña"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...secondaryButtonStyle,
                backgroundColor: '#4b5563',
                color: 'white',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? (
                <>
                  <span>🔄</span>
                  <span>Iniciando...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </form>

          <button
            onClick={() => setShowEmailForm(false)}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '4px',
              marginTop: '8px'
            }}
          >
            Ocultar formulario
          </button>
        </div>
      )}

      {/* Separador */}
      <div style={separatorStyle}>
        <div style={lineStyle}></div>
        <span style={{ margin: '0 12px' }}>O continúa con</span>
        <div style={lineStyle}></div>
      </div>
      
      {/* Botón Google */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          ...secondaryButtonStyle,
          opacity: loading ? 0.6 : 1
        }}
      >
        <span>🌐</span>
        <span>Google</span>
      </button>

      {/* Link invitación */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => {
            resetForm();
            setView('invite');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
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

  return (
    <div style={containerStyle}>
      <SEOContent 
        title="Forestech Combustibles - Login"
        description="Sistema de gestión de combustible forestal. Acceso con passkeys o credenciales tradicionales."
      />
      
      <div style={cardStyle}>
        {view === 'login' && renderLoginView()}
        {view === 'invite' && renderInviteView()}
        {view === 'register' && renderRegisterView()}
      </div>
    </div>
  );
};

export default AuthVisualEnhanced;