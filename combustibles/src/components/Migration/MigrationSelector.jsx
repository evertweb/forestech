/**
 * MigrationSelector - Selector mejorado con sistema de migración guiada
 * Elimina opciones inseguras y agrega nueva migración con validación
 */

import React, { useState } from 'react';
import HistoricalDataMigration from './HistoricalDataMigration';
import GuidedMigrationPanel from './GuidedMigrationPanel';
import './Migration.css';

const MigrationSelector = () => {
  const [selectedMigration, setSelectedMigration] = useState(null);

  if (selectedMigration === 'guided') {
    return (
      <div className="migration-container">
        <GuidedMigrationPanel />
        <div className="migration-nav">
          <button 
            className="btn-back"
            onClick={() => setSelectedMigration(null)}
          >
            ← Volver al Selector
          </button>
        </div>
      </div>
    );
  }

  if (selectedMigration === 'manual') {
    return (
      <div className="migration-container">
        <HistoricalDataMigration />
        <div className="migration-nav">
          <button 
            className="btn-back"
            onClick={() => setSelectedMigration(null)}
          >
            ← Volver al Selector
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="migration-selector">
      <div className="selector-header">
        <h1>🔄 Migración de Datos Históricos</h1>
        <p className="selector-description">
          Elige la estrategia de migración más segura para tus necesidades
        </p>
      </div>

      <div className="migration-options">
        {/* Opción NUEVA: Migración Guiada - RECOMENDADA */}
        <div className="migration-option recommended">
          <div className="option-badge">✨ RECOMENDADA</div>
          <div className="option-header">
            <span className="option-icon">🎯</span>
            <h3>Migración Guiada</h3>
          </div>
          
          <div className="option-description">
            <p><strong>Sistema paso a paso con validación automática</strong></p>
            <ul className="option-features">
              <li>✅ Guía didáctica completa del formato requerido</li>
              <li>✅ Validación exhaustiva antes de migrar</li>
              <li>✅ Autorización y seguridad implementadas</li>
              <li>✅ Descarga de archivo de ejemplo</li>
              <li>✅ Interfaz intuitiva paso a paso</li>
              <li>✅ Rollback automático en caso de error</li>
            </ul>
          </div>

          <div className="option-details">
            <h4>📊 Características:</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-icon">📋</span>
                <span>Formato Excel/CSV claramente especificado</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🔍</span>
                <span>Validación de estructura y contenido</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🛡️</span>
                <span>Sistema de permisos y autorización</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📥</span>
                <span>Carga desde archivos locales (PC)</span>
              </div>
            </div>
          </div>

          <div className="security-notice">
            <h4>🛡️ Seguridad:</h4>
            <ul>
              <li>✅ Requiere autenticación y permisos específicos</li>
              <li>✅ Validación completa antes de cualquier cambio</li>
              <li>✅ Log completo de todas las operaciones</li>
              <li>✅ No modifica reglas de seguridad de Firebase</li>
            </ul>
          </div>

          <button 
            className="btn-select-migration primary"
            onClick={() => setSelectedMigration('guided')}
          >
            🎯 Iniciar Migración Guiada
          </button>
        </div>

        {/* Opción Manual - Para usuarios avanzados */}
        <div className="migration-option">
          <div className="option-header">
            <span className="option-icon">📁</span>
            <h3>Migración Manual (Avanzada)</h3>
          </div>
          
          <div className="option-description">
            <p><strong>Para usuarios avanzados con configuración personalizada</strong></p>
            <ul className="option-features">
              <li>📁 Procesamiento de archivos Excel complejos</li>
              <li>🎛️ Control granular del proceso de mapeo</li>
              <li>👁️ Vista previa detallada antes de migrar</li>
              <li>📊 Configuración manual de alias y mapeos</li>
              <li>⚠️ Requiere conocimiento técnico</li>
            </ul>
          </div>

          <div className="option-details">
            <h4>📋 Ideal para:</h4>
            <div className="details-list">
              <div className="detail-item">
                <span className="detail-icon">📊</span>
                <span>Archivos con estructura no estándar</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🔧</span>
                <span>Necesidad de mapeo personalizado</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">👨‍💻</span>
                <span>Usuarios con experiencia técnica</span>
              </div>
            </div>
          </div>

          <div className="warning-notice">
            <h4>⚠️ Consideraciones:</h4>
            <ul>
              <li>Requiere más tiempo de configuración</li>
              <li>Necesita comprensión del sistema de mapeo</li>
              <li>Validación manual de cada paso</li>
            </ul>
          </div>

          <button 
            className="btn-select-migration secondary"
            onClick={() => setSelectedMigration('manual')}
          >
            📁 Migración Manual Avanzada
          </button>
        </div>
      </div>

      <div className="selector-footer">
        <div className="recommendation">
          <h4>💡 Recomendación:</h4>
          <p>
            Para la mayoría de casos, la <strong>Migración Guiada</strong> es la mejor opción.
            Es más segura, fácil de usar y proporciona validación automática completa.
            Solo usa la migración manual si tienes necesidades específicas de configuración.
          </p>
        </div>

        <div className="security-info">
          <h4>🛡️ Seguridad Mejorada:</h4>
          <p>
            Ambas opciones ahora incluyen verificación de permisos, validación exhaustiva
            y logging completo. Se eliminó la opción de "migración directa" que comprometía la seguridad.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MigrationSelector;