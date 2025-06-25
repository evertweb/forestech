// src/components/EmailVerificationBanner.jsx
import React, { useState } from 'react';
import { resendEmailVerification } from '../firebase/authService';

function EmailVerificationBanner({ user }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // No mostrar banner si el email ya está verificado o es un usuario anónimo
    if (!user || user.emailVerified || user.isAnonymous) {
        return null;
    }

    // No mostrar para usuarios de Google (ya vienen verificados automáticamente)
    if (user.providerData?.some(provider => provider.providerId === 'google.com')) {
        return null;
    }

    const handleResendVerification = async () => {
        setLoading(true);
        setMessage('');
        
        const result = await resendEmailVerification();
        setMessage(result.message);
        setLoading(false);
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setMessage(''), 5000);
    };

    const handleRefresh = () => {
        // Recargar la página para verificar el estado del email
        window.location.reload();
    };

    return (
        <div className="email-verification-banner">
            <div className="verification-content">
                <h4>📧 Verificación de Email Pendiente</h4>
                <p>
                    Hemos enviado un email de verificación a <strong>{user.email}</strong>. 
                    Por favor revisa tu bandeja de entrada y spam.
                </p>
                <div className="verification-actions">
                    <button 
                        className="resend-btn" 
                        onClick={handleResendVerification}
                        disabled={loading}
                    >
                        {loading ? 'Enviando...' : 'Reenviar Email'}
                    </button>
                    <button 
                        className="refresh-btn" 
                        onClick={handleRefresh}
                    >
                        Ya Verifiqué
                    </button>
                </div>
                {message && (
                    <p className={`verification-message ${message.includes('Error') ? 'error' : 'success'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default EmailVerificationBanner;