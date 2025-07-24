/**
 * AuthModern - Componente de autenticación modernizado con Untitled UI
 * Mantiene toda la funcionalidad existente con diseño profesional
 */

import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider 
} from "firebase/auth";
import { Button } from 'react-aria-components';
import { cn } from '../../utils/cn';
import { auth } from '../../firebase/config';
import { createUserProfileWithInvitation, createUserProfile } from '../../firebase/userService';
import { validateInvitationCode } from '../../firebase/invitationService';

// Iconos Untitled UI como SVG inline
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <circle cx="12" cy="16" r="1"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const AuthModern = () => {
  const [view, setView] = useState('login'); // 'login', 'register', 'invite'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    invitationCode: ''
  });

  // Invitation validation state
  const [inviteCode, setInviteCode] = useState('');
  const [validatedInvite, setValidatedInvite] = useState(null);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error en login:', error);
      setError(getErrorMessage(error.code));
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
      
      // Si hay un código de invitación validado, crear perfil con invitación
      if (validatedInvite) {
        await createUserProfileWithInvitation(result.user, validatedInvite.code);
      } else {
        await createUserProfile(result.user);
      }
    } catch (error) {
      console.error('Error en login con Google:', error);
      setError('Error al iniciar sesión con Google');
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
        setRegisterData({
          ...registerData,
          email: result.invitation.targetEmail,
          invitationCode: inviteCode
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
    setLoading(true);
    setError('');

    // Validaciones
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
      // Crear usuario en Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, registerData.email, registerData.password);
      
      // Crear perfil con invitación
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
    setRegisterData({
      email: '',
      password: '',
      confirmPassword: '',
      invitationCode: ''
    });
  };

  const renderContent = () => {
    switch (view) {
      case 'login':
        return (
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Dirección de email
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="tu-email@ejemplo.com"
                  className={cn(
                    "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm",
                    "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-forestech-600 focus:border-forestech-600",
                    "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
                    "sm:text-sm"
                  )}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Contraseña
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="Tu contraseña"
                  className={cn(
                    "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm",
                    "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-forestech-600 focus:border-forestech-600",
                    "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
                    "sm:text-sm"
                  )}
                />
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                isDisabled={loading}
                className={cn(
                  "group relative w-full flex justify-center py-2.5 px-4 border border-transparent",
                  "text-sm font-medium rounded-md text-white",
                  "bg-forestech-600 hover:bg-forestech-700",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forestech-500",
                  "disabled:bg-gray-300 disabled:cursor-not-allowed",
                  "transition-colors duration-200"
                )}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O continúa con</span>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  onPress={handleGoogleLogin}
                  isDisabled={loading}
                  className={cn(
                    "w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm",
                    "bg-white text-sm font-medium text-gray-500",
                    "hover:bg-gray-50 hover:border-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forestech-500",
                    "disabled:cursor-not-allowed disabled:bg-gray-50",
                    "transition-colors duration-200"
                  )}
                >
                  <GoogleIcon />
                  <span className="ml-2">Continuar con Google</span>
                </Button>
              </div>
            </div>

            <div className="text-center">
              <button 
                type="button"
                className="text-sm text-forestech-600 hover:text-forestech-500 font-medium"
                onClick={() => {
                  resetForm();
                  setView('invite');
                }}
              >
                ¿Tienes un código de invitación? Regístrate aquí
              </button>
            </div>
          </form>
        );

      case 'invite':
        return (
          <div className="space-y-6">
            <form onSubmit={handleValidateInvitation} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="inviteCode" className="text-sm font-medium text-gray-700">
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
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-forestech-600 focus:border-transparent",
                    "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
                    "placeholder:text-gray-400 font-mono text-center text-lg tracking-wider uppercase"
                  )}
                />
                <p className="text-xs text-gray-500">
                  Ingresa el código de 8 caracteres que recibiste
                </p>
              </div>

              <Button 
                type="submit" 
                isDisabled={loading}
                className={cn(
                  "w-full py-2.5 px-4 rounded-lg font-medium text-white",
                  "bg-gradient-to-r from-forestech-600 to-forestech-700",
                  "hover:from-forestech-700 hover:to-forestech-800",
                  "focus:outline-none focus:ring-2 focus:ring-forestech-500 focus:ring-offset-2",
                  "disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed",
                  "transition-all duration-200 transform hover:scale-[1.02]"
                )}
              >
                {loading ? 'Validando...' : 'Validar Código'}
              </Button>
            </form>

            <div className="text-center">
              <button 
                type="button"
                className="text-forestech-600 hover:text-forestech-700 text-sm font-medium underline"
                onClick={() => {
                  resetForm();
                  setView('login');
                }}
              >
                Volver al inicio de sesión
              </button>
            </div>
          </div>
        );

      case 'register':
        return (
          <div className="space-y-6">
            {validatedInvite && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Código válido para: {validatedInvite.targetEmail}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleRegisterWithInvitation} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="registerEmail" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="registerEmail"
                  type="email"
                  value={registerData.email}
                  disabled
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm",
                    "bg-gray-50 text-gray-500 cursor-not-allowed"
                  )}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="registerPassword" className="text-sm font-medium text-gray-700">
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
                  minLength={6}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-forestech-600 focus:border-transparent",
                    "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
                    "placeholder:text-gray-400"
                  )}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
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
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-forestech-600 focus:border-transparent",
                    "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
                    "placeholder:text-gray-400"
                  )}
                />
              </div>

              <Button 
                type="submit" 
                isDisabled={loading}
                className={cn(
                  "w-full py-2.5 px-4 rounded-lg font-medium text-white",
                  "bg-gradient-to-r from-forestech-600 to-forestech-700",
                  "hover:from-forestech-700 hover:to-forestech-800",
                  "focus:outline-none focus:ring-2 focus:ring-forestech-500 focus:ring-offset-2",
                  "disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed",
                  "transition-all duration-200 transform hover:scale-[1.02]"
                )}
              >
                {loading ? 'Registrando...' : 'Crear Cuenta'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o</span>
              </div>
            </div>

            <Button 
              onPress={handleGoogleLogin}
              isDisabled={loading}
              className={cn(
                "w-full py-2.5 px-4 rounded-lg font-medium",
                "border-2 border-gray-300 text-gray-700 bg-white",
                "hover:bg-gray-50 hover:border-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
                "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
                "transition-all duration-200 flex items-center justify-center gap-2"
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Registrarse con Google
            </Button>

            <div className="text-center">
              <button 
                type="button"
                className="text-forestech-600 hover:text-forestech-700 text-sm font-medium underline"
                onClick={() => {
                  resetForm();
                  setView('invite');
                }}
              >
                Usar otro código de invitación
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo y Header */}
        <div className="mx-auto h-16 w-16 flex items-center justify-center bg-forestech-600 rounded-xl mb-6">
          <div className="text-2xl text-white">⛽</div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {view === 'login' && 'Inicia sesión en tu cuenta'}
          {view === 'invite' && 'Validar invitación'}
          {view === 'register' && 'Crear nueva cuenta'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Forestech Colombia - Sistema de Combustibles
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircleIcon />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-6 rounded-md bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckIcon />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    {success}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {renderContent()}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500 leading-relaxed">
          Solo usuarios autorizados pueden acceder al sistema.
          <br />
          <span className="font-medium text-forestech-600">
            {view === 'login' 
              ? 'Contacta al administrador para obtener un código de invitación.'
              : 'Si no tienes código, contacta al administrador.'
            }
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModern;