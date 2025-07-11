/**
 * MigrationSelector - Selector entre migración manual y migración directa
 * Permite elegir la estrategia de migración más adecuada
 */

import React, { useState } from 'react';
import HistoricalDataMigration from './HistoricalDataMigration';
import DirectMigrationPanel from './DirectMigrationPanel';
import './Migration.css';

const MigrationSelector = () => {
  const [selectedMigration, setSelectedMigration] = useState(null);

  if (selectedMigration === 'direct') {
    return (
      <div className="migration-container">
        <DirectMigrationPanel />
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
          Elige la estrategia de migración que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="migration-options">
        {/* Opción de Migración Directa - RECOMENDADA */}
        <div className="migration-option recommended">
          <div className="option-badge">✨ RECOMENDADA</div>
          <div className="option-header">
            <span className="option-icon">🚀</span>
            <h3>Migración Directa</h3>
          </div>
          
          <div className="option-description">
            <p><strong>Solución automática sin problemas de permisos</strong></p>
            <ul className="option-features">
              <li>✅ Resuelve automáticamente errores de permisos</li>
              <li>✅ Migración rápida y confiable</li>
              <li>✅ No requiere archivos Excel</li>
              <li>✅ Datos históricos integrados</li>
              <li>✅ Horómetros actualizados automáticamente</li>
            </ul>
          </div>

          <div className="option-details">
            <h4>📊 Incluye:</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-icon">🚜</span>
                <span>Vehículos: TR-1, TR-2, TR-3, VOLQUETA, etc.</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🔄</span>
                <span>1,446+ movimientos históricos</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">⏱️</span>
                <span>Horómetros reales actualizados</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">⚡</span>
                <span>Migración en minutos</span>
              </div>
            </div>
          </div>

          <button 
            className="btn-select-migration primary"
            onClick={() => setSelectedMigration('direct')}
          >
            🚀 Migración Directa
          </button>
        </div>

        {/* Opción de Migración Manual */}
        <div className="migration-option">
          <div className="option-header">
            <span className="option-icon">📁</span>
            <h3>Migración Manual</h3>
          </div>
          
          <div className="option-description">
            <p><strong>Migración tradicional con archivos Excel</strong></p>
            <ul className="option-features">
              <li>📁 Carga desde archivos Excel</li>
              <li>👁️ Vista previa antes de migrar</li>
              <li>🎛️ Control granular del proceso</li>
              <li>📊 Mapeo manual de datos</li>
              <li>⚠️ Requiere resolver permisos manualmente</li>
            </ul>
          </div>

          <div className="option-details">
            <h4>📋 Requiere:</h4>
            <div className="details-list">
              <div className="detail-item">
                <span className="detail-icon">📊</span>
                <span>Archivo Excel con movimientos</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🔧</span>
                <span>Configuración manual de permisos</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">⏰</span>
                <span>Más tiempo de configuración</span>
              </div>
            </div>
          </div>

          <button 
            className="btn-select-migration secondary"
            onClick={() => setSelectedMigration('manual')}
          >
            📁 Migración Manual
          </button>
        </div>
      </div>

      <div className="selector-footer">
        <div className="recommendation">
          <h4>💡 Recomendación:</h4>
          <p>
            Para la mayoría de casos, la <strong>Migración Directa</strong> es la mejor opción.
            Es más rápida, confiable y resuelve automáticamente los problemas de permisos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MigrationSelector;