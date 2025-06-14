// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

import { auth } from './firebase/config';
import { onAuthStateChanged, signOut } from "firebase/auth";

import Header from './components/Header';
import Auth from './components/Auth';
import MainApp from './components/MainApp';
import Loader from './components/Loader';
// 1. Importamos el ResultsModal aquí, porque App lo va a renderizar
import ResultsModal from './components/ResultsModal';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [theme, setTheme] = useState('light');

    // 2. Traemos el estado del modal y los resultados para acá.
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [results, setResults] = useState(null);

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

    if (!isAuthReady) {
        return <Loader />;
    }

    return (
        // 3. Esta línea ahora funciona porque 'isModalOpen' existe aquí.
        <div className={`container ${isModalOpen ? 'modal-open' : ''}`}>
            <Header
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                onToggleTheme={toggleTheme}
            />

            {!isAuthenticated && <Auth />}

            {/* 4. Pasamos las funciones para actualizar el estado al hijo */}
            {isAuthenticated && <MainApp setResults={setResults} setIsModalOpen={setIsModalOpen} />}

            {/* 5. App ahora es responsable de mostrar el modal cuando sea necesario */}
            {isModalOpen && (
                <ResultsModal results={results} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
}

export default App;