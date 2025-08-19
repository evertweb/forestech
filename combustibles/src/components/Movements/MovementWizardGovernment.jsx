/**
 * MovementWizardGovernment - Prototipo de interfaz gubernamental
 * Ejemplo de cómo se vería el formulario con estilo oficial
 */

import React, { useState } from 'react';
import './WizardSteps-Government.css';

const MovementWizardGovernment = ({ isOpen, onClose }) => {
  // eslint-disable-line no-unused-vars
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // eslint-disable-line no-unused-vars
    movementType: '',
    date: '',
    fuelType: '',
    quantity: '',
    vehicleId: '',
    location: '',
    description: '',
  });

  const totalSteps = 8;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Generar códigos oficiales
  const generateDocumentCode = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0');
    return `FORESTECH-MOV-${year}${month}${day}-${random}`;
  };

  const generateStepCode = (step) => {
    return `PASO-${step.toString().padStart(2, '0')}`;
  };

  const getCurrentTimestamp = () => {
    return new Date().toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="movement-wizard-government">
        {/* Encabezado Oficial */}
        <div className="government-header">
          <div className="government-reference">{generateDocumentCode()}</div>
          <div className="government-logo">FC</div>
          <h1 className="government-title">Forestech de Colombia S.A.S.</h1>
          <h2 className="government-subtitle">
            Sistema Integrado de Gestión de Combustibles
            <br />
            Formulario Oficial de Registro de Movimientos
          </h2>
        </div>

        {/* Indicador de Progreso Oficial */}
        <div className="government-progress">
          <div className="progress-bar-government">
            <div
              className="progress-fill-government"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="progress-info">
            <span className="progress-step">
              Paso {currentStep} de {totalSteps}
            </span>
            <span className="progress-timestamp">{getCurrentTimestamp()}</span>
          </div>
        </div>

        {/* Información del Documento - FIJO */}
        <div className="government-document-static-header">
          <div className="document-official-banner">
            📜 DOCUMENTO OFICIAL - DESPLÁCESE PARA VER MÁS CONTENIDO
          </div>
        </div>

        {/* Contenido del documento - SCROLLEABLE */}
        <div className="government-step-content">
          <div className="government-document-info">
            <div className="document-classification">OFICIAL</div>
            <div className="document-header">
              <div className="document-code">DOC: {generateDocumentCode()}</div>
              <div className="document-timestamp">FECHA: {getCurrentTimestamp()}</div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gov-medium-gray)' }}>
              Este documento constituye un registro oficial del Sistema Integrado de Gestión de
              Combustibles de Forestech de Colombia S.A.S. Su llenado es obligatorio para el control
              y trazabilidad de los movimientos de combustibles según las normas internas de la
              compañía.
            </div>
          </div>

          {/* Header del Paso */}
          <div className="step-header-government">
            <div className="step-reference">REF: {generateStepCode(currentStep)}</div>
            <div className="step-number">{currentStep}</div>
            <h3 className="step-title">
              {currentStep === 1 && 'Tipo de Movimiento'}
              {currentStep === 2 && 'Fecha y Tipo de Combustible'}
              {currentStep === 3 && 'Ubicación y Verificación'}
              {currentStep === 4 && 'Cantidad y Especificaciones'}
              {currentStep === 5 && 'Vehículo Asignado'}
              {currentStep === 6 && 'Destino y Autorización'}
              {currentStep === 7 && 'Detalles Adicionales'}
              {currentStep === 8 && 'Resumen y Confirmación'}
            </h3>
            <p className="step-description">
              {currentStep === 1 && 'Seleccione el tipo de operación a registrar en el sistema'}
              {currentStep === 2 && 'Especifique la fecha y el tipo de combustible involucrado'}
              {currentStep === 3 && 'Confirme la ubicación y verifique el inventario disponible'}
              {currentStep === 4 && 'Indique la cantidad exacta y las especificaciones técnicas'}
              {currentStep === 5 && 'Asigne el vehículo correspondiente al movimiento'}
              {currentStep === 6 && 'Determine el destino final y las autorizaciones requeridas'}
              {currentStep === 7 && 'Complete la información adicional y observaciones'}
              {currentStep === 8 && 'Revise todos los datos antes de la confirmación final'}
            </p>
          </div>

          {/* Contenido del Paso */}
          <div className="government-form-section">
            <h4 className="form-section-title">Información Requerida - Paso {currentStep}</h4>

            {currentStep === 1 && (
              <div className="government-field-group">
                <div className="government-field">
                  <div className="field-code">MOV-TYPE</div>
                  <label className="government-label">
                    Tipo de Movimiento <span className="required">*</span>
                  </label>
                  <select className="government-select" value={formData.movementType}>
                    <option value="">Seleccione una opción</option>
                    <option value="entry">ENTRADA - Recepción de Combustible</option>
                    <option value="exit">SALIDA - Consumo de Combustible</option>
                    <option value="transfer">TRANSFERENCIA - Movimiento Interno</option>
                    <option value="adjustment">AJUSTE - Corrección de Inventario</option>
                  </select>
                  <div className="field-help">
                    Seleccione el tipo de operación según el código de procedimientos interno
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="government-field-group">
                <div className="government-field">
                  <div className="field-code">MOV-DATE</div>
                  <label className="government-label">
                    Fecha del Movimiento <span className="required">*</span>
                  </label>
                  <input type="datetime-local" className="government-input" value={formData.date} />
                  <div className="field-help">
                    Fecha y hora exacta del movimiento (formato: DD/MM/AAAA HH:MM)
                  </div>
                </div>
                <div className="government-field">
                  <div className="field-code">FUEL-TYPE</div>
                  <label className="government-label">
                    Tipo de Combustible <span className="required">*</span>
                  </label>
                  <select className="government-select" value={formData.fuelType}>
                    <option value="">Seleccione el combustible</option>
                    <option value="ACPM">ACPM - Aceite Combustible Para Motor</option>
                    <option value="GASOLINA_CORRIENTE">Gasolina Corriente - RON 87</option>
                    <option value="GASOLINA_EXTRA">Gasolina Extra - RON 95</option>
                    <option value="JET_A1">JET A-1 - Combustible de Aviación</option>
                  </select>
                  <div className="field-help">Tipo de combustible según clasificación técnica</div>
                </div>
              </div>
            )}

            {/* Alertas Oficiales */}
            <div className="government-alert government-alert-info">
              <div className="alert-title">Información Importante</div>
              <p>
                {currentStep === 1 &&
                  'Todos los movimientos quedan registrados en el sistema de trazabilidad. Verifique la información antes de continuar.'}
                {currentStep === 2 &&
                  'La fecha del movimiento debe corresponder con la fecha real de la operación. No se permiten registros retroactivos sin autorización.'}
                {currentStep >= 3 &&
                  'Los datos ingresados son validados automáticamente contra el inventario actual del sistema.'}
              </p>
            </div>
          </div>

          {/* Tabla de Datos (Ejemplo para pasos avanzados) */}
          {currentStep >= 3 && (
            <div className="government-form-section">
              <h4 className="form-section-title">Datos del Sistema</h4>
              <table className="government-data-table">
                <thead>
                  <tr>
                    <th>Campo</th>
                    <th>Valor Actual</th>
                    <th>Estado</th>
                    <th>Código</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Inventario Disponible</td>
                    <td>1,250.5 galones</td>
                    <td>✅ Suficiente</td>
                    <td>INV-001</td>
                  </tr>
                  <tr>
                    <td>Última Actualización</td>
                    <td>{getCurrentTimestamp()}</td>
                    <td>✅ Sincronizado</td>
                    <td>SYNC-001</td>
                  </tr>
                  <tr>
                    <td>Usuario Autorizado</td>
                    <td>Sistema Activo</td>
                    <td>✅ Verificado</td>
                    <td>AUTH-001</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Acciones Oficiales */}
        <div className="government-actions">
          <button
            className="government-btn government-btn-secondary"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <span className="btn-icon">◀</span>
            Anterior
          </button>

          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--gov-medium-gray)',
              fontFamily: 'var(--gov-font-family-mono)',
            }}
          >
            FORMULARIO: {generateDocumentCode()}
          </div>

          <button
            className="government-btn government-btn-primary"
            onClick={() => {
              if (currentStep < totalSteps) {
                setCurrentStep(currentStep + 1);
              } else {
                // Finalizar
                console.log('Formulario completado');
              }
            }}
          >
            {currentStep === totalSteps ? 'Confirmar' : 'Siguiente'}
            <span className="btn-icon">▶</span>
          </button>
        </div>

        {/* Sección de Firmas (Solo en paso final) */}
        {currentStep === totalSteps && (
          <div className="government-signature-section">
            <h4
              style={{
                textAlign: 'center',
                color: 'var(--gov-primary-blue)',
                textTransform: 'uppercase',
                marginBottom: 'var(--gov-spacing-lg)',
              }}
            >
              Autorizaciones y Firmas
            </h4>
            <div className="signature-grid">
              <div className="signature-box">
                <div className="signature-line">[Firma Digital]</div>
                <div className="signature-title">Operador Responsable</div>
              </div>
              <div className="signature-box">
                <div className="signature-line">[Sello Digital]</div>
                <div className="signature-title">Sistema Forestech</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovementWizardGovernment;
