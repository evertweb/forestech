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
            console.log('Wizard cerrado');
          }}
          onComplete={(result) => {
            console.log('Migración completada:', result);
          }}
        />
      </div>
    </div>
  );
}

export default MigrationPage;
