/**
 * VehicleWizardDemo - Componente demo para probar el nuevo wizard de vehículos
 * Solo para desarrollo y testing
 */

import React, { useState } from 'react';
import VehicleWizard from './VehicleWizard';

const VehicleWizardDemo = () => {
  const [showWizard, setShowWizard] = useState(false);

  const handleSuccess = (vehicleData) => {
    console.log('✅ Vehículo creado exitosamente:', vehicleData);
    alert(`✅ Vehículo "${vehicleData.name}" creado exitosamente!`);
    setShowWizard(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🚗 Demo - Wizard de Vehículos</h1>
      <p>Prueba el nuevo formulario wizard estilo Typeform para crear vehículos.</p>
      
      <button 
        onClick={() => setShowWizard(true)}
        style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        🚀 Abrir Wizard de Vehículo
      </button>

      {showWizard && (
        <VehicleWizard
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default VehicleWizardDemo;
