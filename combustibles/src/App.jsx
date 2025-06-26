// ⛽ [COMBUSTIBLES] - App principal de gestión de combustibles
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>⛽ Forestech - Gestión de Combustibles</h1>
        <p>Sistema de control de inventario y stock de combustibles</p>
        <div className="app-info">
          <p>🚧 <strong>Estado:</strong> En desarrollo - MVP Fase 1</p>
          <p>🔧 <strong>Stack:</strong> React + Firebase</p>
          <p>🌐 <strong>URL:</strong> forestechdecolombia.com.co/combustibles/</p>
        </div>
      </header>
      
      <main className="app-main">
        <section className="features-preview">
          <h2>📋 Funcionalidades Planificadas</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🛢️ Inventario</h3>
              <p>Control de stock por tipo y ubicación</p>
              <ul>
                <li>Diésel, Gasolina, ACPM</li>
                <li>Alertas stock mínimo</li>
                <li>Control de calidad</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <h3>📊 Movimientos</h3>
              <p>Registro completo de entradas y salidas</p>
              <ul>
                <li>Compras y reabastecimientos</li>
                <li>Consumo por vehículo</li>
                <li>Transferencias entre ubicaciones</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <h3>🚜 Vehículos</h3>
              <p>Gestión de maquinaria forestal</p>
              <ul>
                <li>Registro de equipos</li>
                <li>Consumo histórico</li>
                <li>Rendimiento por galón</li>
              </ul>
            </div>
            
            <div className="feature-card">
              <h3>📈 Reportes</h3>
              <p>Analytics y dashboard ejecutivo</p>
              <ul>
                <li>Consumo por período</li>
                <li>Costos operativos</li>
                <li>Proyecciones automáticas</li>
              </ul>
            </div>
          </div>
        </section>
        
        <section className="development-status">
          <h2>🚀 Progreso de Desarrollo</h2>
          <div className="timeline">
            <div className="timeline-item current">
              <strong>Semana 1-2:</strong> Setup inicial y estructura ✅
            </div>
            <div className="timeline-item">
              <strong>Semana 3-4:</strong> Componentes core (inventario, movimientos)
            </div>
            <div className="timeline-item">
              <strong>Semana 5-6:</strong> Reportes y dashboard
            </div>
            <div className="timeline-item">
              <strong>Mes 2-3:</strong> Migración a Java + Spring Boot
            </div>
          </div>
        </section>
      </main>
      
      <footer className="app-footer">
        <p>🌲 Forestech Colombia - Sistema integral de gestión forestal</p>
      </footer>
    </div>
  );
}

export default App;
