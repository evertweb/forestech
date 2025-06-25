// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './firebase/config';
import { signOut } from "firebase/auth";
import { updateSettlementPayment } from './firebase/firestoreService';
import { analyticsEvents, setupErrorTracking, trackPageView } from './firebase/analytics';
import { UserProvider, useUser } from './contexts/UserContext';
import { initializeNotifications } from './firebase/notificationService';

import Header from './components/Header';
import Auth from './components/Auth';
import MainApp from './components/MainApp';
import Loader from './components/Loader';
import ResultsModal from './components/ResultsModal';
import PaymentModal from './components/PaymentModal';
import EmailVerificationBanner from './components/EmailVerificationBanner';

// Componente principal envuelto con UserProvider
function App() {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
}

// Contenido principal de la aplicación con acceso al contexto de usuario
function AppContent() {
    const { user, userProfile, loading } = useUser();
    
    const [theme, setTheme] = useState('light');
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [results, setResults] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [settlementToUpdateId, setSettlementToUpdateId] = useState(null);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        analyticsEvents.temaChanged(newTheme);
    };

    useEffect(() => {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(`${theme}-mode`);
    }, [theme]);

    // Setup inicial de Analytics
    useEffect(() => {
        setupErrorTracking();
        trackPageView('Forestech App');
    }, []);

    // Inicializar notificaciones FCM para usuarios autenticados
    useEffect(() => {
        if (user && userProfile) {
            initializeNotifications(user.uid)
                .then(result => {
                    if (result.success) {
                        console.log('✅ Notificaciones FCM inicializadas');
                    }
                })
                .catch(err => console.warn('⚠️ FCM no disponible:', err));
        }
    }, [user, userProfile]);

    const handleLogout = async () => {
        analyticsEvents.logout();
        await signOut(auth);
    };

    const handleOpenPaymentModal = (settlementId) => {
        setSettlementToUpdateId(settlementId);
        setIsPaymentModalOpen(true);
    };

    const handleClosePaymentModal = () => {
        setSettlementToUpdateId(null);
        setIsPaymentModalOpen(false);
    };

    const handleUpdatePayment = async (settlementId, receiptBase64) => {
        try {
            await updateSettlementPayment(settlementId, receiptBase64);
        } catch (error) {
            console.error("Error al actualizar el pago:", error);
            alert("Error al actualizar el pago.");
        }
    };

    // Mostrar loader mientras se carga la información del usuario
    if (loading) {
        return <Loader />;
    }

    return (
        <div className={`container ${(isResultsModalOpen || isPaymentModalOpen) ? 'modal-open' : ''}`}>
            <Header
                isAuthenticated={!!user}
                onLogout={handleLogout}
                onToggleTheme={toggleTheme}
                userProfile={userProfile} // Pasar perfil para mostrar rol en header
            />

            {!user && <Auth />}

            {user && (
                <>
                    <EmailVerificationBanner user={user} />
                    <MainApp
                        setResults={setResults}
                        setIsModalOpen={setIsResultsModalOpen}
                        onOpenPaymentModal={handleOpenPaymentModal}
                    />
                </>
            )}

            {isResultsModalOpen && (
                <ResultsModal results={results} onClose={() => setIsResultsModalOpen(false)} />
            )}

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={handleClosePaymentModal}
                settlementId={settlementToUpdateId}
                onUpdate={handleUpdatePayment}
            />
        </div>
    );
}

export default App;