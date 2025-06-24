// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './firebase/config';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { updateSettlementPayment } from './firebase/firestoreService';
import { analyticsEvents, setupErrorTracking, trackPageView } from './firebase/analytics';

import Header from './components/Header';
import Auth from './components/Auth';
import MainApp from './components/MainApp';
import Loader from './components/Loader';
import ResultsModal from './components/ResultsModal';
import PaymentModal from './components/PaymentModal';
import EmailVerificationBanner from './components/EmailVerificationBanner';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
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

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && !isAuthenticated) {
                analyticsEvents.login('email');
            }
            setIsAuthenticated(!!user);
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, [isAuthenticated]);

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

    if (!isAuthReady) {
        return <Loader />;
    }

    return (
        <div className={`container ${(isResultsModalOpen || isPaymentModalOpen) ? 'modal-open' : ''}`}>
            <Header
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                onToggleTheme={toggleTheme}
            />

            {!isAuthenticated && <Auth />}

            {isAuthenticated && (
                <>
                    <EmailVerificationBanner user={auth.currentUser} />
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