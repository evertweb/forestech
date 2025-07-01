/**
 * Step1_MovementType - Primer paso del wizard: Selección del tipo de movimiento
 * Permite al usuario elegir entre entrada, salida, transferencia o ajuste
 */

import React from 'react';
import { MOVEMENT_TYPES } from '../../../services/movementsService';

const Step1_MovementType = ({ formData, updateFormData, setError }) => {
  
  const movementOptions = [
    {
      type: MOVEMENT_TYPES.ENTRADA,
      icon: '📥',
      title: 'Entrada',
      description: 'Compra o reabastecimiento de combustible',
      color: 'entrada',
      details: 'Registra combustible que llega desde proveedores'
    },
    {
      type: MOVEMENT_TYPES.SALIDA,
      icon: '📤', 
      title: 'Salida',
      description: 'Consumo de combustible por vehículos',
      color: 'salida',
      details: 'Asigna combustible a vehículos y equipos'
    },
    {
      type: MOVEMENT_TYPES.TRANSFERENCIA,
      icon: '🔄',
      title: 'Transferencia', 
      description: 'Movimiento entre ubicaciones',
      color: 'transferencia',
      details: 'Traslada combustible entre tanques o sitios'
    },
    {
      type: MOVEMENT_TYPES.AJUSTE,
      icon: '⚖️',
      title: 'Ajuste',
      description: 'Corrección de inventario',
      color: 'ajuste', 
      details: 'Ajusta stock por mermas, pérdidas o calibraciones'
    }
  ];

  const handleSelection = (type) => {
    updateFormData('type', type);
    setError('');
  };

  return (
    <div className="wizard-step step-movement-type">
      <div className="step-content">
        <div className="step-question">
          <h3>🍀 ¿Qué tipo de operación realizarás?</h3>
          <p>Selecciona el tipo de movimiento que necesitas registrar:</p>
        </div>

        <div className="movement-options">
          {movementOptions.map((option) => (
            <div
              key={option.type}
              className={`movement-option ${formData.type === option.type ? 'selected' : ''} ${option.color}`}
              onClick={() => handleSelection(option.type)}
            >
              <div className="option-icon">
                {option.icon}
              </div>
              <div className="option-content">
                <h4>{option.title}</h4>
                <p className="option-description">{option.description}</p>
                <small className="option-details">{option.details}</small>
              </div>
              <div className="option-selector">
                {formData.type === option.type && <span className="check-icon">✅</span>}
              </div>
            </div>
          ))}
        </div>

        {formData.type && (
          <div className="selection-confirmation">
            <div className="confirmation-card">
              <span className="confirmation-icon">
                {movementOptions.find(opt => opt.type === formData.type)?.icon}
              </span>
              <div className="confirmation-text">
                <strong>Seleccionado:</strong> {movementOptions.find(opt => opt.type === formData.type)?.title}
                <br />
                <small>{movementOptions.find(opt => opt.type === formData.type)?.description}</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1_MovementType;