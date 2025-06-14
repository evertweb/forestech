// src/components/Header.jsx
import React from 'react';

// 1. Recibimos 'onToggleTheme' como un nuevo prop.
function Header({ isAuthenticated, onLogout, onToggleTheme }) {

    return (
        <div className="header">
            {/* 2. Usamos la función recibida en el onClick */}
            <div className="theme-switcher" onClick={onToggleTheme}>
                <span className="light-icon">☀️</span>
                <span className="dark-icon">🌙</span>
            </div>

            <div style={{ position: 'absolute', top: '15px', left: '20px' }}>
                {/* Aquí podríamos mostrar el email del usuario en el futuro */}
            </div>

            {isAuthenticated && (
                <div style={{ position: 'absolute', top: '15px', right: '80px' }}>
                    <button className="logout" onClick={onLogout} style={{padding: '8px 12px', borderRadius: '8px'}}>Cerrar Sesión</button>
                </div>
            )}

            <h1 id="appTitle">🍽️ Liquidación de Comidas Multi-Cliente 💰</h1>
            <p id="headerSubtitle">Sistema interactivo para facturación a múltiples clientes</p>
        </div>
    );
}

export default Header;