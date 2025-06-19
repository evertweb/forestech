// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './firebase/config';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { updateSettlementPayment } from './firebase/firestoreService';

import Header from './components/Header';
import Auth from './components/Auth';
import MainApp from './components/MainApp';
import Loader from './components/Loader';
import ResultsModal from './components/ResultsModal';
import PaymentModal from './components/PaymentModal';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [theme, setTheme] = useState('light');
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [results, setResults] = useState(null);

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [settlementToUpdateId, setSettlementToUpdateId] = useState(null);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(`${theme}-mode`);
    }, [theme]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
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

            {isAuthenticated && <MainApp
                setResults={setResults}
                setIsModalOpen={setIsResultsModalOpen}
                onOpenPaymentModal={handleOpenPaymentModal}
            />}

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