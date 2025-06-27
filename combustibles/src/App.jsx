// ⛽ [COMBUSTIBLES] - App principal de gestión de combustibles
import React from 'react';
import { CombustiblesProvider, useCombustibles } from './contexts/CombustiblesContext';
import Dashboard from './components/Dashboard/Dashboard';
import Auth from './components/Auth/Auth';
import './App.css';

// Componente principal envuelto con CombustiblesProvider
function App() {
  return (
    <CombustiblesProvider>
      <AppContent />
    </CombustiblesProvider>
  );
}

// Contenido principal de la aplicación con acceso al contexto
function AppContent() {
  const { user, loading } = useCombustibles();

  // Mostrar loader mientras se carga la información del usuario
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {!user && <Auth />}
      {user && <Dashboard />}
    </div>
  );
}

export default App;
