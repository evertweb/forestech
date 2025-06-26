// ⛽ [COMBUSTIBLES] - App principal de gestión de combustibles
import React from 'react';
import { CombustiblesProvider } from './contexts/CombustiblesContext';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <CombustiblesProvider>
      <div className="App">
        <Dashboard />
      </div>
    </CombustiblesProvider>
  );
}

export default App;
