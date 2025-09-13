/**
 * AuthVisualEnhanced - Login SIMPLIFICADO para Forestech
 * Versión limpia sin CSS complejo que causa overflow
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

// ✅ ICONOS SIMPLES Y CONTROLADOS
const FingerprintIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 11c1.656 0 3-1.344 3-3s-1.344-3-3-3-3 1.344-3 3 1.344 3 3 3z"/>
    <path d="M12 11v8M8.5 14v3M15.5 14v3M6 16.5v2M18 16.5v2"/>
  </svg>
);

const LoadingSpinner = () => (
  <svg width="16" height="16" className="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" strokeDasharray="31.416" strokeDashoffset="31.416" opacity="0.25"/>
    <path d="M12 2c5.523 0 10 4.477 10 10" strokeLinecap="round"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

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

  // Renderizar mensajes
  const renderMessages = () => (
    <div className="space-y-3">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          ✅ {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );

  // Vista principal de login
  const renderLoginView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mx-auto">
          🌲
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Forestech Combustibles
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Sistema de gestión forestal
          </p>
        </div>
      </div>

      {renderMessages()}

      {/* Botón Passkey */}
      {passkeySupported && (
        <div className="space-y-3">
          <button
            onClick={handlePasskeyLogin}
            disabled={passkeyLoading || loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {passkeyLoading ? (
              <>
                <LoadingSpinner />
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <FingerprintIcon />
                <span>Acceder con Passkey</span>
              </>
            )}
          </button>
          <p className="text-xs text-center text-gray-500">
            Touch ID • Face ID • Windows Hello
          </p>
        </div>
      )}

      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-500">O</span>
        </div>
      </div>

      {/* Toggle formulario email */}
      {!showEmailForm ? (
        <button
          onClick={() => setShowEmailForm(true)}
          className="w-full text-center text-blue-600 hover:text-blue-700 font-medium py-2"
        >
          Acceder con email y contraseña
        </button>
      ) : (
        <div className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="tu@ejemplo.com"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Tu contraseña"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span>Iniciando...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </form>

          <button
            onClick={() => setShowEmailForm(false)}
            className="w-full text-center text-gray-500 text-sm py-1"
          >
            Ocultar formulario
          </button>
        </div>
      )}

      {/* Botón Google */}
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500">O continúa con</span>
          </div>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-10 border-2 border-gray-300 hover:border-gray-400 rounded-lg font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2"
        >
          <GoogleIcon />
          <span>Google</span>
        </button>
      </div>

      {/* Link invitación */}
      <div className="text-center">
        <button
          onClick={() => {
            resetForm();
            setView('invite');
          }}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          ¿Tienes código de invitación?
        </button>
      </div>
    </div>
  );

  // Vista invitación
  const renderInviteView = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mx-auto">
          🌲
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Código de Invitación</h2>
          <p className="text-sm text-gray-600">Ingresa tu código de 8 caracteres</p>
        </div>
      </div>

      {renderMessages()}

      <form onSubmit={handleValidateInvitation} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de invitación
          </label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            required
            disabled={loading}
            placeholder="XXXXXXXX"
            maxLength={8}
            className="w-full h-12 px-4 border border-gray-300 rounded-lg text-center font-mono text-lg tracking-wider uppercase"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <LoadingSpinner />
              <span>Validando...</span>
            </>
          ) : (
            <span>Validar Código</span>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => {
            resetForm();
            setView('login');
          }}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Volver al login
        </button>
      </div>
    </div>
  );

  // Vista registro
  const renderRegisterView = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mx-auto">
          🌲
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="text-sm text-gray-600">Completa tu registro</p>
        </div>
      </div>

      {renderMessages()}

      <form onSubmit={handleRegisterWithInvitation} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={registerData.email}
            disabled
            className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            value={registerData.password}
            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
            required
            disabled={loading}
            placeholder="Mínimo 6 caracteres"
            className="w-full h-10 px-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
          <input
            type="password"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
            required
            disabled={loading}
            placeholder="Repite tu contraseña"
            className="w-full h-10 px-3 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <LoadingSpinner />
              <span>Creando...</span>
            </>
          ) : (
            <span>Crear Cuenta</span>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => {
            resetForm();
            setView('login');
          }}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Volver al login
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-900 flex items-center justify-center p-4">
      <SEOContent 
        title="Forestech Combustibles - Login"
        description="Sistema de gestión de combustible forestal. Acceso con passkeys o credenciales tradicionales."
      />
      
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {view === 'login' && renderLoginView()}
          {view === 'invite' && renderInviteView()}
          {view === 'register' && renderRegisterView()}
        </div>
        
        <div className="mt-4 text-center text-white/80 text-xs">
          <p>© 2025 Forestech Colombia</p>
        </div>
      </div>
    </div>
  );
};

export default AuthVisualEnhanced;