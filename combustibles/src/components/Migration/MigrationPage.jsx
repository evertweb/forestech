import React from 'react';
import MigrationWizard from '../MigrationWizard/MigrationWizard';
import './Migration.css';

function MigrationPage() {
  return (
    <div className="migration-page-wrapper">
      <div className="page-header">
        <h1>Migración de Datos</h1>
        <p>Importa datos históricos de combustibles de forma segura y validada</p>
      </div>
      
      <div className="migration-content">
        <MigrationWizard 
          isOpen={true}
          isFullPage={true}
          onClose={() => {
            // En una página completa, cerrar podría navegar a otra sección
            // Placeholder for future navigation logic
          }}
          onComplete={() => {
            // Handle migration completion
            // Future: Show success notification or redirect
          }}
        />
      </div>
    </div>
  );
}

export default MigrationPage;
