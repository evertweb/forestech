import React from 'react';
import './Migration.css';

function MigrationPageSimple() {
  return (
    <div className="migration-page">
      <div className="page-header">
        <h1>Migración de Datos</h1>
        <p>Importa datos históricos de combustibles de forma segura y validada</p>
      </div>
      
      <div className="migration-content">
        <div className="test-content">
          <h2>Página de Migración Funcionando</h2>
          <p>Esta es una prueba para verificar que la página se renderiza correctamente.</p>
          <div className="wizard-simulation">
            <div className="step-indicator">
              <div className="step active">1. Cargar Archivo</div>
              <div className="step">2. Mapear Columnas</div>
              <div className="step">3. Mapear Valores</div>
              <div className="step">4. Validar Datos</div>
              <div className="step">5. Ejecutar Migración</div>
            </div>
            <div className="step-content">
              <h3>Paso 1: Cargar Archivo</h3>
              <p>Selecciona y carga tu archivo Excel o CSV con los datos de combustibles.</p>
              <button className="btn-primary">Seleccionar Archivo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MigrationPageSimple;