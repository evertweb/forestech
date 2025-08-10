/**
 * DataReset - Panel de administrador para reset de datos
 * Permite eliminar datos específicos o reset completo con confirmaciones múltiples
 */

import React, { useState, useEffect } from 'react';
import {
  getDataStatistics,
  deleteSpecificCollections,
  resetAllData,
  createBackup,
  canPerformReset,
  getAvailableBackups,
} from '../../services/dataResetService';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import './DataReset.css';

const DataReset = () => {
  const { userProfile } = useCombustibles();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [progress, setProgress] = useState('');
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(0);
  const [confirmationText, setConfirmationText] = useState('');
  const [resetType, setResetType] = useState(''); // 'selected' | 'complete'
  const [backupBeforeReset, setBackupBeforeReset] = useState(true);
  const [backups, setBackups] = useState([]);
  const [showBackups, setShowBackups] = useState(false);

  // Verificar permisos
  const hasPermission = canPerformReset(userProfile);

  useEffect(() => {
    if (hasPermission) {
      loadStats();
      loadBackups();
    }
  }, [hasPermission]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statistics = await getDataStatistics();
      setStats(statistics);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBackups = () => {
    const availableBackups = getAvailableBackups();
    setBackups(availableBackups);
  };

  const handleCollectionToggle = (collectionKey) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionKey)
        ? prev.filter((key) => key !== collectionKey)
        : [...prev, collectionKey]
    );
  };

  const handleSelectAll = () => {
    const allKeys = Object.keys(stats).filter((key) => stats[key].count > 0);
    setSelectedCollections((prev) => (prev.length === allKeys.length ? [] : allKeys));
  };

  const startReset = (type) => {
    if (type === 'selected' && selectedCollections.length === 0) {
      alert('Selecciona al menos una colección para eliminar');
      return;
    }

    setResetType(type);
    setShowConfirmation(true);
    setConfirmationStep(0);
    setConfirmationText('');
  };

  const handleConfirmationNext = () => {
    if (confirmationStep === 0) {
      setConfirmationStep(1);
    } else if (confirmationStep === 1) {
      const expectedText = resetType === 'complete' ? 'RESET COMPLETO' : 'ELIMINAR SELECCIONADOS';
      if (confirmationText === expectedText) {
        setConfirmationStep(2);
      } else {
        alert(`Debes escribir exactamente: ${expectedText}`);
      }
    } else if (confirmationStep === 2) {
      executeReset();
    }
  };

  const executeReset = async () => {
    try {
      setResetting(true);
      setShowConfirmation(false);
      setProgress('Iniciando proceso de eliminación...');

      // Crear backup si está habilitado
      if (backupBeforeReset) {
        setProgress('Creando backup de seguridad...');
        const collectionsToBackup =
          resetType === 'complete' ? null : selectedCollections.map((key) => stats[key].name);

        await createBackup(collectionsToBackup);
        setProgress('Backup creado exitosamente');
      }

      let results;

      if (resetType === 'complete') {
        results = await resetAllData((message) => {
          setProgress(message);
        });
      } else {
        const collectionsToDelete = selectedCollections.map((key) => stats[key].name);
        results = await deleteSpecificCollections(collectionsToDelete, (collection, count) => {
          setProgress(`${collection}: ${count} elementos eliminados`);
        });
      }

      // Mostrar resultados
      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;
      const totalDeleted = results.reduce((sum, r) => sum + (r.deletedCount || 0), 0);

      setProgress(
        `✅ Proceso completado: ${successful} exitosos, ${failed} fallidos. Total eliminados: ${totalDeleted}`
      );

      // Recargar estadísticas
      setTimeout(() => {
        loadStats();
        loadBackups();
        setSelectedCollections([]);
        setProgress('');
      }, 3000);
    } catch (error) {
      console.error('Error during reset:', error);
      setProgress(`❌ Error: ${error.message}`);
    } finally {
      setResetting(false);
    }
  };

  const cancelReset = () => {
    setShowConfirmation(false);
    setConfirmationStep(0);
    setConfirmationText('');
    setResetType('');
  };

  const getTotalDocuments = () => {
    return Object.values(stats).reduce((sum, stat) => sum + (stat.count || 0), 0);
  };

  const getSelectedDocuments = () => {
    return selectedCollections.reduce((sum, key) => sum + (stats[key]?.count || 0), 0);
  };

  if (!hasPermission) {
    return (
      <div className="data-reset sap-theme">
        <div className="permission-denied sap-theme">
          <h2>🚫 Acceso Denegado</h2>
          <p>Solo los administradores pueden acceder a la función de reset de datos.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="data-reset sap-theme">
        <div className="loading sap-theme">
          <div className="spinner sap-theme"></div>
          <p>Cargando estadísticas de datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-reset sap-theme">
      <div className="reset-header sap-theme">
        <h2>🔥 Reset de Datos</h2>
        <p>
          Administra y elimina datos de la aplicación. <strong>¡Usa con precaución!</strong>
        </p>
      </div>

      {/* Progreso */}
      {(resetting || progress) && (
        <div className="progress-section sap-theme">
          <div className="progress-bar sap-theme">
            {resetting && <div className="progress-spinner sap-theme"></div>}
            <span>{progress}</span>
          </div>
        </div>
      )}

      {/* Estadísticas generales */}
      <div className="stats-summary sap-theme">
        <div className="summary-card sap-theme">
          <h3>📊 Resumen de Datos</h3>
          <div className="summary-stats sap-theme">
            <div className="stat sap-theme">
              <span className="stat-number sap-theme">{Object.keys(stats).length}</span>
              <span className="stat-label sap-theme">Colecciones</span>
            </div>
            <div className="stat sap-theme">
              <span className="stat-number sap-theme">{getTotalDocuments()}</span>
              <span className="stat-label sap-theme">Documentos Totales</span>
            </div>
            <div className="stat sap-theme">
              <span className="stat-number sap-theme">{selectedCollections.length}</span>
              <span className="stat-label sap-theme">Seleccionadas</span>
            </div>
          </div>
        </div>

        <div className="summary-card sap-theme">
          <h3>💾 Opciones de Backup</h3>
          <div className="backup-options sap-theme">
            <label className="backup-toggle sap-theme">
              <input
                type="checkbox"
                checked={backupBeforeReset}
                onChange={(e) => setBackupBeforeReset(e.target.checked)}
              />
              <span>Crear backup antes del reset</span>
            </label>
            <button
              className="btn-secondary sap-theme"
              onClick={() => setShowBackups(!showBackups)}
            >
              📋 Ver Backups ({backups.length})
            </button>
          </div>
        </div>
      </div>

      {/* Lista de backups */}
      {showBackups && (
        <div className="backups-section sap-theme">
          <h3>💾 Backups Disponibles</h3>
          {backups.length === 0 ? (
            <p>No hay backups disponibles</p>
          ) : (
            <div className="backups-list sap-theme">
              {backups.map((backup) => (
                <div key={backup.key} className="backup-item sap-theme">
                  <div className="backup-info sap-theme">
                    <span className="backup-date sap-theme">
                      {new Date(backup.timestamp).toLocaleString()}
                    </span>
                    <span className="backup-collections sap-theme">
                      {backup.collections} colecciones
                    </span>
                  </div>
                  <button
                    className="btn-danger btn-small sap-theme"
                    onClick={() => {
                      if (window.confirm('¿Eliminar este backup?')) {
                        localStorage.removeItem(backup.key);
                        loadBackups();
                      }
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Colecciones */}
      <div className="collections-section sap-theme">
        <div className="collections-header sap-theme">
          <h3>📋 Colecciones de Datos</h3>
          <div className="collection-actions sap-theme">
            <button
              className="btn-secondary sap-theme"
              onClick={handleSelectAll}
              disabled={resetting}
            >
              {selectedCollections.length ===
              Object.keys(stats).filter((key) => stats[key].count > 0).length
                ? 'Deseleccionar Todo'
                : 'Seleccionar Todo'}
            </button>
          </div>
        </div>

        <div className="collections-grid sap-theme">
          {Object.entries(stats).map(([key, stat]) => (
            <div
              key={key}
              className={`collection-card ${selectedCollections.includes(key) ? 'selected' : ''}`}
            >
              <div className="collection-header sap-theme">
                <div className="collection-icon sap-theme">{stat.icon}</div>
                <div className="collection-info sap-theme">
                  <h4>{stat.displayName}</h4>
                  <p className="collection-name sap-theme">{stat.name}</p>
                </div>
                <label className="collection-checkbox sap-theme">
                  <input
                    type="checkbox"
                    checked={selectedCollections.includes(key)}
                    onChange={() => handleCollectionToggle(key)}
                    disabled={resetting || stat.count === 0}
                  />
                </label>
              </div>

              <div className="collection-stats sap-theme">
                <div className="stat-item sap-theme">
                  <span className="stat-number sap-theme">{stat.count}</span>
                  <span className="stat-label sap-theme">Documentos</span>
                </div>
                {stat.error && <div className="stat-error sap-theme">⚠️ {stat.error}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acciones principales */}
      <div className="reset-actions sap-theme">
        <button
          className="btn-warning sap-theme"
          onClick={() => startReset('selected')}
          disabled={resetting || selectedCollections.length === 0}
        >
          🗑️ Eliminar Seleccionadas ({getSelectedDocuments()} docs)
        </button>

        <button
          className="btn-danger sap-theme"
          onClick={() => startReset('complete')}
          disabled={resetting || getTotalDocuments() === 0}
        >
          🔥 Reset Completo ({getTotalDocuments()} docs)
        </button>
      </div>

      {/* Modal de confirmación */}
      {showConfirmation && (
        <div className="confirmation-modal sap-theme">
          <div className="modal-content sap-theme">
            <div className="modal-header sap-theme">
              <h3>
                {confirmationStep === 0 && '⚠️ Confirmación Requerida'}
                {confirmationStep === 1 && '✍️ Confirmación por Texto'}
                {confirmationStep === 2 && '🔥 Confirmación Final'}
              </h3>
            </div>

            <div className="modal-body sap-theme">
              {confirmationStep === 0 && (
                <div className="confirmation-step sap-theme">
                  <p>
                    <strong>ADVERTENCIA:</strong> Esta acción{' '}
                    {resetType === 'complete'
                      ? 'eliminará TODOS los datos'
                      : 'eliminará las colecciones seleccionadas'}{' '}
                    de la aplicación.
                  </p>
                  <ul>
                    {resetType === 'complete' ? (
                      <li>
                        Se eliminarán {getTotalDocuments()} documentos de todas las colecciones
                      </li>
                    ) : (
                      <>
                        <li>Se eliminarán {getSelectedDocuments()} documentos</li>
                        <li>
                          Colecciones afectadas:{' '}
                          {selectedCollections.map((key) => stats[key].displayName).join(', ')}
                        </li>
                      </>
                    )}
                    <li>Esta acción NO se puede deshacer</li>
                    {backupBeforeReset && <li>Se creará un backup antes de proceder</li>}
                  </ul>
                </div>
              )}

              {confirmationStep === 1 && (
                <div className="confirmation-step sap-theme">
                  <p>Para continuar, escribe exactamente el siguiente texto:</p>
                  <div className="confirmation-text-required sap-theme">
                    {resetType === 'complete' ? 'RESET COMPLETO' : 'ELIMINAR SELECCIONADOS'}
                  </div>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Escribe el texto aquí"
                    className="confirmation-input sap-theme"
                  />
                </div>
              )}

              {confirmationStep === 2 && (
                <div className="confirmation-step sap-theme">
                  <p className="final-warning sap-theme">
                    <strong>ÚLTIMA CONFIRMACIÓN:</strong> ¿Estás completamente seguro de que quieres
                    proceder?
                  </p>
                  <p>Esta es tu última oportunidad para cancelar.</p>
                </div>
              )}
            </div>

            <div className="modal-actions sap-theme">
              <button className="btn-secondary sap-theme" onClick={cancelReset}>
                Cancelar
              </button>
              <button
                className="btn-danger sap-theme"
                onClick={handleConfirmationNext}
                disabled={confirmationStep === 1 && !confirmationText}
              >
                {confirmationStep === 2 ? 'Proceder con Eliminación' : 'Continuar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataReset;
