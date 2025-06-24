// src/components/Auth.jsx
import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInAnonymously } from "firebase/auth";
import { 
    loginWithEmail, 
    loginWithGoogle, 
    registerWithEmail,
    resendEmailVerification 
} from '../firebase/authService';
import { analyticsEvents } from '../firebase/analytics';

// La función Auth se declara UNA SOLA VEZ aquí.
function Auth() {
    const [view, setView] = useState('welcome');
    const [authMessage, setAuthMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const showEmailAuth = () => { setView('email'); setAuthMessage(''); };
    const showWelcomeScreen = () => { setView('welcome'); setAuthMessage(''); };

    const handleAuthError = (error) => {
        console.error("Error de autenticación:", error.code, error.message);
        let errorMessage = "Ocurrió un error. Inténtalo de nuevo.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "El email ya está en uso. Intenta iniciar sesión.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "El formato del email es inválido.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "La contraseña es muy débil (mínimo 6 caracteres).";
        } else if (error.code === 'auth/invalid-credential') {
            errorMessage = "Email o contraseña incorrectos.";
        }
        setAuthMessage(errorMessage);
    };

    const signInAsGuest = async () => {
        setLoading(true);
        setAuthMessage('Iniciando como invitado...');
        try {
            await signInAnonymously(auth);
            analyticsEvents.login('anonymous');
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setAuthMessage('Iniciando sesión con Google...');
        try {
            const result = await loginWithGoogle();
            if (result.success) {
                setAuthMessage(result.message);
            } else {
                setAuthMessage(result.message);
            }
        } catch (error) {
            setAuthMessage('Error al iniciar sesión con Google');
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async () => {
        if (!email || !password) { 
            setAuthMessage("Por favor, introduce email y contraseña."); 
            return; 
        }
        setLoading(true);
        setAuthMessage('Iniciando sesión...');
        
        const result = await loginWithEmail(email, password);
        if (result.success) {
            setAuthMessage(result.message);
        } else {
            setAuthMessage(result.message);
        }
        setLoading(false);
    };

    const registerUser = async () => {
        if (!email || !password || password.length < 6) { 
            setAuthMessage("Verifica los datos (contraseña de 6+ caracteres)."); 
            return; 
        }
        setLoading(true);
        setAuthMessage('Registrando...');
        
        const result = await registerWithEmail(email, password);
        if (result.success) {
            setAuthMessage(result.message);
        } else {
            setAuthMessage(result.message);
        }
        setLoading(false);
    };

    // El return con todo el JSX.
    return (
        <div>
            {view === 'welcome' && (
                <div className="welcome-screen">
                    <h2>¡Bienvenido a Liquidación de Comidas!</h2>
                    <p>Elige cómo quieres acceder a la aplicación.</p>
                    <div className="welcome-buttons">
                        <button className="google-auth-btn" onClick={handleGoogleSignIn} disabled={loading}>
                            {loading ? 'Cargando...' : '🔑 Continuar con Google'}
                        </button>
                        <button className="email-auth-btn" onClick={showEmailAuth} disabled={loading}>
                            {loading ? 'Cargando...' : '📧 Email y Contraseña'}
                        </button>
                        <button className="guest-auth-btn" onClick={signInAsGuest} disabled={loading}>
                            {loading ? 'Cargando...' : '👤 Continuar como Invitado'}
                        </button>
                    </div>
                    <p className="auth-message">{authMessage}</p>
                </div>
            )}
            {view === 'email' && (
                <div className="auth-section">
                    <h3>Acceso con Email y Contraseña</h3>
                    <p>Inicia sesión o regístrate para guardar tus datos en la nube.</p>
                    <div className="input-group">
                        <label htmlFor="authEmail">Email:</label>
                        <input type="email" id="authEmail" placeholder="tu@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="authPassword">Contraseña:</label>
                        <input type="password" id="authPassword" placeholder="min. 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="auth-buttons">
                        <button className="login" onClick={loginUser} disabled={loading}>{loading ? 'Verificando...' : 'Iniciar Sesión'}</button>
                        <button className="register" onClick={registerUser} disabled={loading}>{loading ? 'Registrando...' : 'Registrarse'}</button>
                    </div>
                    <button className="secondary-button" onClick={showWelcomeScreen} disabled={loading} style={{ width: 'auto', marginTop: '15px' }}>⬅️ Volver</button>
                    <p className="auth-message">{authMessage}</p>
                </div>
            )}
        </div>
    );
}

export default Auth;