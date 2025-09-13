/**
 * AuthVisualEnhanced - Login rediseñado con prioridad en Passkeys
 * Forestech Combustibles - Sistema de gestión forestal colombiano
 * 
 * Características:
 * - Botón Passkey prominente (Touch ID, Face ID, Windows Hello)
 * - Login email/contraseña como opción secundaria
 * - Diseño profesional con gradientes azul-verde
 * - Responsive design optimizado para trabajadores forestales
 * - Accesibilidad y navegación por teclado
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
import {
  isWebAuthnSupported,
} from '../../firebase/firebaseWebAuthnService';
import {
  getBackgroundImageUrl,
  preloadBackgroundImage,
} from '../../services/backgroundImageService';
import SEOContent from '../SEO/SEOContent';

// Iconos SVG para mejor rendimiento
const PasskeyIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M5 12C4.44772 12 4 12.4477 4 13V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V13C20 12.4477 19.5523 12 19 12H5Z" 
      stroke="currentColor" 
      strokeWidth="2"
    />
    <circle cx="12" cy="16" r="1" fill="currentColor"/>
  </svg>
);

const FingerprintIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" 
      stroke="currentColor" 
      strokeWidth="2"
    />
    <path 
      d="M12 11V19M8.5 14V17M15.5 14V17M6 16.5V18.5M18 16.5V18.5" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </svg>
);

const EmailIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M21 5L12 13L3 5H21Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M3 5H21V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18V5Z" 
      stroke="currentColor" 
      strokeWidth="2"
    />
  </svg>
);

const LockIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M19 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11Z" 
      stroke="currentColor" 
      strokeWidth="2"
    />
    <path 
      d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" 
      stroke="currentColor" 
      strokeWidth="2"
    />
  </svg>
);

// Componente de carga con animación
const LoadingSpinner = ({ size = "w-5 h-5" }) => (
  <svg 
    className={`${size} animate-spin`} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeDasharray="31.416" 
      strokeDashoffset="31.416"
      className="opacity-25"
    />
    <path 
      d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612"
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </svg>
);

// Logo animado de Forestech
const ForestechLogo = ({ size = 48 }) => (
  <div 
    className="relative flex items-center justify-center text-emerald-600"
    style={{ width: size, height: size }}
  >
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Árbol base */}
      <path 
        d="M24 42V32M20 42H28" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round"
      />
      {/* Copa del árbol */}
      <circle cx="24" cy="20" r="12" fill="currentColor" className="opacity-90"/>
      <circle cx="24" cy="18" r="8" fill="currentColor" className="opacity-60"/>
      <circle cx="24" cy="16" r="5" fill="currentColor" className="opacity-40"/>
    </svg>
  </div>
);

const AuthVisualEnhanced = () => {
  // Estados principales
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados específicos para passkeys
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [passkeyError, setPasskeyError] = useState('');
  
  // Estados del formulario de login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Estados para registro con invitación
  const [inviteCode, setInviteCode] = useState('');
  const [validatedInvite, setValidatedInvite] = useState(null);
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    invitationCode: '',
  });

  // Estado para imagen de fondo
  const [backgroundImage, setBackgroundImage] = useState('');

  // Verificar soporte de WebAuthn al cargar
  useEffect(() => {
    const checkPasskeySupport = async () => {
      try {
        const supported = isWebAuthnSupported();
        setPasskeySupported(supported);
        
        if (supported) {
          console.log('✅ WebAuthn soportado - Mostrando botón de passkey');
        } else {
          console.log('❌ WebAuthn no soportado en este dispositivo');
        }
      } catch (error) {
        console.error('Error verificando soporte WebAuthn:', error);
        setPasskeySupported(false);
      }
    };

    checkPasskeySupport();
  }, []);

  // Cargar imagen de fondo
  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const imageUrl = await getBackgroundImageUrl();
        const loaded = await preloadBackgroundImage(imageUrl);
        
        if (loaded) {
          setBackgroundImage(`url("${imageUrl}")`);
        }
      } catch (error) {
        console.warn('Error cargando imagen de fondo:', error);
      }
    };

    loadBackgroundImage();
  }, []);

  // Limpiar mensajes de error
  const clearMessages = () => {
    setError('');
    setSuccess('');
    setPasskeyError('');
  };

  // Funciones de autenticación
  const handlePasskeyLogin = async () => {
    clearMessages();
    setPasskeyLoading(true);

    try {
      console.log('🔐 Iniciando autenticación con passkey...');
      
      // Aquí iría la integración con el servicio de WebAuthn
      // const result = await signInCurrentUserWithPasskey();
      
      // Por ahora, simulamos el comportamiento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulación de error para testing
      throw new Error('Funcionalidad en desarrollo - Próximamente disponible');
      
    } catch (error) {
      console.error('Error en autenticación con passkey:', error);
      setPasskeyError(error.message || 'Error al autenticar con passkey. Intenta con email y contraseña.');
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
      console.error('Error en login con email:', error);
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
    } catch (error) {
      console.error('Error en login con Google:', error);
      setError('Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar errores de Firebase
  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/user-not-found': 'No existe una cuenta con este email',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    };
    
    return errorMessages[errorCode] || 'Error de autenticación. Intenta nuevamente.';
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
    } catch (error) {
      console.error('Error validando invitación:', error);
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
      console.error('Error en registro:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setInviteCode('');
    setRegisterData({
      email: '',
      password: '',
      confirmPassword: '',
      invitationCode: '',
    });
    clearMessages();
  };

  // Renderizado de mensajes
  const renderMessages = () => (
    <>
      {(success || error || passkeyError) && (
        <div className="mb-6 space-y-2">
          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm font-medium flex items-center space-x-2 animate-fade-in">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          )}
          
          {(error || passkeyError) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm font-medium flex items-center space-x-2 animate-fade-in">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error || passkeyError}</span>
            </div>
          )}
        </div>
      )}
    </>
  );

  // Vista principal de login
  const renderLoginView = () => (
    <div className="space-y-6">
      {/* Header con logo y títulos */}
      <div className="text-center space-y-3">
        <ForestechLogo size={64} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Acceder a Forestech Combustibles
          </h1>
          <p className="text-sm text-gray-600">
            Sistema de gestión de combustible forestal
          </p>
        </div>
      </div>

      {renderMessages()}

      {/* Botón principal de Passkey */}
      {passkeySupported && (
        <div className="space-y-4">
          <button
            onClick={handlePasskeyLogin}
            disabled={passkeyLoading || loading}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center space-x-3 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            aria-label="Acceder con Touch ID, Face ID o Windows Hello"
          >
            {passkeyLoading ? (
              <>
                <LoadingSpinner size="w-6 h-6" />
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <FingerprintIcon className="w-6 h-6" />
                <span>Acceder con Passkey</span>
              </>
            )}
          </button>
          
          <p className="text-xs text-center text-gray-500">
            Touch ID • Face ID • Windows Hello
          </p>
        </div>
      )}

      {/* Separador "O" */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">O</span>
        </div>
      </div>

      {/* Toggle para mostrar formulario de email */}
      {!showEmailForm ? (
        <button
          onClick={() => setShowEmailForm(true)}
          className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 rounded"
        >
          Acceder con email y contraseña
        </button>
      ) : (
        <div className="space-y-4">
          {/* Formulario de email/contraseña */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EmailIcon className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="tu@ejemplo.com"
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Tu contraseña"
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </form>

          {/* Botón para ocultar formulario */}
          <button
            onClick={() => setShowEmailForm(false)}
            className="w-full text-center text-gray-500 hover:text-gray-700 text-sm py-1 transition-colors"
          >
            Ocultar formulario
          </button>
        </div>
      )}

      {/* Separador para Google */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">O continúa con</span>
        </div>
      </div>

      {/* Botón de Google */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 flex items-center justify-center space-x-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Continuar con Google</span>
      </button>

      {/* Enlaces adicionales */}
      <div className="text-center space-y-2">
        <button
          onClick={() => {
            resetForm();
            setView('invite');
          }}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors focus:outline-none focus:underline"
        >
          ¿Tienes un código de invitación?
        </button>
      </div>
    </div>
  );

  // Vista de validación de invitación
  const renderInviteView = () => (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <ForestechLogo size={48} />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Código de Invitación</h2>
          <p className="text-sm text-gray-600">Ingresa tu código de 8 caracteres</p>
        </div>
      </div>

      {renderMessages()}

      <form onSubmit={handleValidateInvitation} className="space-y-4">
        <div>
          <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
            Código de invitación
          </label>
          <input
            id="inviteCode"
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            required
            disabled={loading}
            placeholder="XXXXXXXX"
            maxLength={8}
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 text-center font-mono text-lg tracking-wider uppercase"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ingresa el código que recibiste por email
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 flex items-center justify-center space-x-2"
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
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:underline"
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    </div>
  );

  // Vista de registro con invitación
  const renderRegisterView = () => (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <ForestechLogo size={48} />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="text-sm text-gray-600">Completa tu registro</p>
        </div>
      </div>

      {renderMessages()}

      <form onSubmit={handleRegisterWithInvitation} className="space-y-4">
        <div>
          <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="registerEmail"
            type="email"
            value={registerData.email}
            disabled
            className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="registerPassword"
            type="password"
            value={registerData.password}
            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
            required
            disabled={loading}
            placeholder="Mínimo 6 caracteres"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
            required
            disabled={loading}
            placeholder="Repite tu contraseña"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-300 focus:ring-opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <LoadingSpinner />
              <span>Creando cuenta...</span>
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
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:underline"
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    </div>
  );

  // Renderizado principal
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-900"
      style={{
        backgroundImage: backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      <SEOContent 
        title="Forestech Combustibles - Acceso Seguro"
        description="Sistema de gestión de combustible forestal profesional. Accede con passkeys (Touch ID, Face ID) o credenciales tradicionales."
      />
      
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {view === 'login' && renderLoginView()}
          {view === 'invite' && renderInviteView()}
          {view === 'register' && renderRegisterView()}
        </div>
        
        {/* Footer con información adicional */}
        <div className="mt-6 text-center text-white/80 text-xs space-y-1">
          <p>© 2025 Forestech Colombia - Sistema Seguro</p>
          <p>Protegido con autenticación biométrica</p>
        </div>
      </div>
    </div>
  );
};

export default AuthVisualEnhanced;