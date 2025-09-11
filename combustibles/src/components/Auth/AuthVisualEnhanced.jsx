/**
 * AuthVisualEnhanced - Login con mejoras visuales avanzadas
 * Incluye: Logo animado, partículas, micro-interacciones, hero section
 */

import React, { useState, useEffect, useRef } from 'react';
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
  getBackgroundImageUrl,
  preloadBackgroundImage,
} from '../../services/backgroundImageService';
import { COMMUNICATION_URLS, UI_ACTIONS, UI_FORM_LABELS, UI_MESSAGES } from '../../constants';
import SEOContent from '../SEO/SEOContent';

import './AuthVisualEnhanced.css';

// Componente de logo animado con efectos de energía
const AnimatedLogo = ({ size = 80 }) => {
  return (
    <div className="animated-logo" style={{ width: size, height: size }}>
      <div className="logo-container">
        <div className="fuel-drop"></div>
        <div className="energy-ring"></div>
        <div className="energy-pulse"></div>
        <div className="logo-icon">⛽</div>
      </div>
    </div>
  );
};

// Componente de partículas flotantes
const FloatingParticles = ({ count = 15 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="floating-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Loader moderno: puntos saltando
const DotsLoader = () => (
  <div className="dots-loader">
    <span className="dot" />
    <span className="dot" />
    <span className="dot" />
  </div>
);

// Loader líquido clásico (comentado, puedes volver a activarlo si prefieres)
/*
const LiquidLoader = () => {
  return (
    <div className="liquid-loader">
      <div className="liquid-container">
        <div className="liquid-wave"></div>
        <div className="liquid-text">Cargando...</div>
      </div>
    </div>
  );
};
*/

const AuthVisualEnhanced = () => {
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estado para la imagen de fondo
  const [backgroundImage, setBackgroundImage] = useState('');
  const [imageLoading, setImageLoading] = useState(true);

  // Estado para UI progresivo
  const [isExpanded, setIsExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    invitationCode: '',
  });

  // Invitation validation state
  const [inviteCode, setInviteCode] = useState('');
  const [validatedInvite, setValidatedInvite] = useState(null);

  // Refs para animaciones
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  // Estado para footer scroll
  const [showScrollFooter, setShowScrollFooter] = useState(false);

  // Cargar imagen de fondo al montar el componente
  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const imageUrl = await getBackgroundImageUrl();

        const loaded = await preloadBackgroundImage(imageUrl);

        if (loaded) {
          const cssUrl = imageUrl.replace(/'/g, "\\'").replace(/"/g, '\\"');
          setBackgroundImage(`url("${cssUrl}")`);
        }
      } catch (error) {
        console.warn('Error cargando imagen de fondo:', error);
      } finally {
        setImageLoading(false);
      }
    };

    loadBackgroundImage();
  }, []);

  // Efecto de mousemove para interactividad
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPos = (clientX / innerWidth - 0.5) * 20;
      const yPos = (clientY / innerHeight - 0.5) * 20;

      containerRef.current.style.setProperty('--mouse-x', `${xPos}px`);
      containerRef.current.style.setProperty('--mouse-y', `${yPos}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Efecto de scroll para mostrar footer flotante
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = containerRef.current.scrollTop;
      const scrollHeight = containerRef.current.scrollHeight;
      const clientHeight = containerRef.current.clientHeight;

      // Mostrar footer cuando se haga scroll hacia abajo (más de 100px desde arriba)
      // O cuando esté cerca del final (dentro de los últimos 200px)
      const shouldShow = scrollTop > 100 || scrollHeight - scrollTop - clientHeight < 200;

      setShowScrollFooter(shouldShow);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Verificar estado inicial
      handleScroll();

      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [isExpanded]);

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
      invitationCode: '',
    });
  };

  const handleExpandLogin = () => {
    setIsExpanded(true);
    setTimeout(() => {
      setShowForm(true);
    }, 400);
  };

  const renderContent = () => {
    switch (view) {
      case 'login':
        if (!isExpanded) {
          return (
            <div className="hero-section">
              <div className="hero-content">
                <AnimatedLogo size={120} />
                <div className="hero-text">
                  <h1>Sistema de Combustibles</h1>
                  <h2>Forestech Colombia</h2>
                  <p>Gestión inteligente de recursos energéticos</p>
                </div>
                <button
                  onClick={handleExpandLogin}
                  className="hero-cta-button"
                  disabled={loading}
                  aria-busy={imageLoading ? 'true' : 'false'}
                  aria-describedby={imageLoading ? 'bg-loading-hint' : undefined}
                >
                  <span className="button-content">
                    <span className="button-icon">🚀</span>
                    <span className="button-text">Ingresar al Sistema</span>
                  </span>
                  <div className="button-shine"></div>
                </button>
                {imageLoading && (
                  <div id="bg-loading-hint" className="loading-hint">
                    Cargando fondo... puedes continuar sin esperar
                  </div>
                )}
              </div>
            </div>
          );
        }

        return (
          <div className={`expanded-form ${showForm ? 'show' : ''}`}>
            <div className="form-header">
              <AnimatedLogo size={60} />
              <h3>Iniciar Sesión</h3>
            </div>

            <form onSubmit={handleEmailLogin} className="enhanced-form">
              <div className="form-group enhanced">
                <label htmlFor="email">Email:</label>
                <div className="input-container">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="tu-email@ejemplo.com"
                    className="enhanced-input"
                  />
                  <div className="input-glow"></div>
                </div>
              </div>

              <div className="form-group enhanced">
                <label htmlFor="password">Contraseña:</label>
                <div className="input-container">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Tu contraseña"
                    className="enhanced-input"
                  />
                  <div className="input-glow"></div>
                </div>
              </div>

              <button type="submit" className="enhanced-button primary" disabled={loading}>
                <span className="button-content">
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </span>
                <div className="button-ripple"></div>
              </button>
            </form>

            <div className="auth-divider enhanced">
              <span>o continúa con</span>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="enhanced-button google-icon-only"
              disabled={loading}
              title="Continuar con Google"
            >
              <span className="button-content">
                <svg className="google-icon" viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </span>
              <div className="button-ripple"></div>
            </button>

            <div className="auth-actions enhanced">
              <button
                className="link-button enhanced"
                onClick={() => {
                  resetForm();
                  setView('invite');
                }}
              >
                ¿Tienes un código de invitación? Regístrate aquí
              </button>

              {/* REMOVIDO: Enlace para crear cuenta con passkey - ahora solo en administración */}
            </div>
          </div>
        );

      case 'invite':
        return (
          <div className="invite-form enhanced">
            <div className="form-header">
              <AnimatedLogo size={60} />
              <h3>Código de Invitación</h3>
            </div>

            <form onSubmit={handleValidateInvitation}>
              <div className="form-group enhanced">
                <label htmlFor="inviteCode">Código de invitación:</label>
                <div className="input-container">
                  <input
                    id="inviteCode"
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    required
                    disabled={loading}
                    placeholder="XXXXXXXX"
                    maxLength={8}
                    className="enhanced-input code-input"
                  />
                  <div className="input-glow"></div>
                </div>
                <small>Ingresa el código de 8 caracteres que recibiste</small>
              </div>

              <button type="submit" className="enhanced-button primary" disabled={loading}>
                <span className="button-content">
                  {loading ? 'Validando...' : 'Validar Código'}
                </span>
                <div className="button-ripple"></div>
              </button>
            </form>

            <div className="auth-actions enhanced">
              <button
                className="link-button enhanced"
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
          <div className="register-form enhanced">
            <div className="form-header">
              <AnimatedLogo size={60} />
              <h3>Crear Cuenta</h3>
            </div>

            {validatedInvite && (
              <div className="invitation-info enhanced">
                <div className="success-message enhanced">
                  ✅ Código válido para: {validatedInvite?.targetEmail}
                </div>
              </div>
            )}

            <form onSubmit={handleRegisterWithInvitation} className="enhanced-form">
              <div className="form-group enhanced">
                <label htmlFor="registerEmail">Email:</label>
                <div className="input-container">
                  <input
                    id="registerEmail"
                    type="email"
                    value={registerData.email}
                    disabled
                    className="enhanced-input disabled"
                  />
                  <div className="input-glow"></div>
                </div>
              </div>

              <div className="form-group enhanced">
                <label htmlFor="registerPassword">Contraseña:</label>
                <div className="input-container">
                  <input
                    id="registerPassword"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    className="enhanced-input"
                  />
                  <div className="input-glow"></div>
                </div>
              </div>

              <div className="form-group enhanced">
                <label htmlFor="confirmPassword">Confirmar contraseña:</label>
                <div className="input-container">
                  <input
                    id="confirmPassword"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, confirmPassword: e.target.value })
                    }
                    required
                    disabled={loading}
                    placeholder="Repite tu contraseña"
                    className="enhanced-input"
                  />
                  <div className="input-glow"></div>
                </div>
              </div>

              <button type="submit" className="enhanced-button primary" disabled={loading}>
                <span className="button-content">
                  {loading ? 'Registrando...' : 'Crear Cuenta'}
                </span>
                <div className="button-ripple"></div>
              </button>
            </form>

            <div className="auth-divider enhanced">
              <span>o</span>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="enhanced-button google"
              disabled={loading}
            >
              <span className="button-content">
                <span className="google-icon">🔗</span>
                Registrarse con Google
              </span>
              <div className="button-ripple"></div>
            </button>

            <div className="auth-actions enhanced">
              <button
                className="link-button enhanced"
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
    <div
      ref={containerRef}
      className="auth-container-enhanced"
      style={{
        backgroundImage: backgroundImage
          ? `linear-gradient(135deg, rgba(27, 67, 50, 0.2) 0%, rgba(45, 80, 22, 0.1) 50%, rgba(27, 67, 50, 0.2) 100%), ${backgroundImage}`
          : `radial-gradient(ellipse at top, rgba(82, 165, 113, 0.3) 0%, transparent 60%),
           radial-gradient(ellipse at bottom, rgba(101, 200, 120, 0.3) 0%, transparent 60%),
           linear-gradient(135deg, #0f2027 0%, #203a43 25%, #2c5364 50%, #203a43 75%, #0f2027 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <FloatingParticles count={20} />

      {/* Contenido SEO para indexación */}
      <SEOContent />

      {/* Loader de carga: usa DotsLoader, puedes cambiar a LiquidLoader si prefieres */}
      {imageLoading && <DotsLoader />}
      {/* {imageLoading && <LiquidLoader />} */}

      <div ref={cardRef} className={`auth-card-enhanced ${isExpanded ? 'expanded' : 'minimal'}`}>
        {error && (
          <div className="error-message enhanced">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message enhanced">
            <span className="success-icon">✅</span>
            {success}
          </div>
        )}

        {renderContent()}
      </div>

      {/* Footer flotante para WhatsApp */}
      {isExpanded && (
        <div className={`scroll-footer ${showScrollFooter ? 'visible' : 'hidden'}`}>
          <a
            href={COMMUNICATION_URLS.WHATSAPP_SUPPORT}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float-button"
          >
            <span className="whatsapp-icon">📱</span>
            <span className="whatsapp-text">¿Necesitas ayuda?</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default AuthVisualEnhanced;
