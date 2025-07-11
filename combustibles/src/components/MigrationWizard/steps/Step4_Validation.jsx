/**
 * Step4_Validation.jsx - Componente para validación final y preview antes de migración
 * Cuarto paso del wizard: validar datos transformados y mostrar estadísticas detalladas
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  FileText,
  TrendingUp,
  Calendar,
  Database,
  Users,
  Package,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  Search,
  Download
} from 'lucide-react';
import migrationManager from '../../../services/migrationManager';

/**
 * Componente para validación final y preview
 */
const Step4_Validation = ({ 
  fileData = [],
  columnMapping = {},
  valueMapping = {},
  onValidationComplete,
  currentValidation = null,
  isValidating = false,
  error = null 
}) => {
  const [validationResult, setValidationResult] = useState(currentValidation);
  const [showDetailedPreview, setShowDetailedPreview] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterType, setFilterType] = useState('all'); // all, valid, invalid, warnings
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [expandedRows, setExpandedRows] = useState(new Set());

  /**
   * Ejecutar validación automáticamente al cargar
   */
  useEffect(() => {
    const runValidation = async () => {
      if (!currentValidation && fileData.length > 0 && Object.keys(columnMapping).length > 0) {
        try {
          const result = await migrationManager.validateData(fileData, columnMapping, valueMapping);
          if (result.success) {
            setValidationResult(result.validationResult);
            onValidationComplete(result.validationResult);
          }
        } catch (error) {
          console.error('Error en validación automática:', error);
        }
      } else if (currentValidation) {
        setValidationResult(currentValidation);
      }
    };

    runValidation();
  }, [fileData, columnMapping, valueMapping, currentValidation, onValidationComplete]);

  /**
   * Ejecutar nueva validación manual
   */
  const handleRunValidation = async () => {
    try {
      const result = await migrationManager.validateData(fileData, columnMapping, valueMapping);
      if (result.success) {
        setValidationResult(result.validationResult);
        onValidationComplete(result.validationResult);
      }
    } catch (error) {
      console.error('Error ejecutando validación:', error);
    }
  };

  /**
   * Filtrar filas para preview
   */
  const filteredRows = useMemo(() => {
    if (!validationResult?.processedData) return [];

    let filtered = validationResult.processedData;

    // Filtrar por tipo
    switch (filterType) {
      case 'valid':
        filtered = filtered.filter(row => row.errors.length === 0);
        break;
      case 'invalid':
        filtered = filtered.filter(row => row.errors.length > 0);
        break;
      case 'warnings':
        filtered = filtered.filter(row => row.warnings.length > 0);
        break;
      default: // 'all'
        break;
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(row => {
        const originalValues = Object.values(row.original).join(' ').toLowerCase();
        const mappedValues = Object.values(row.mapped).join(' ').toLowerCase();
        return originalValues.includes(term) || mappedValues.includes(term);
      });
    }

    return filtered;
  }, [validationResult, filterType, searchTerm]);

  /**
   * Obtener filas para la página actual
   */
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  /**
   * Calcular estadísticas de la validación
   */
  const validationStats = useMemo(() => {
    if (!validationResult) return null;

    const stats = validationResult.statistics;
    const successRate = stats.totalRows > 0 ? (stats.validRows / stats.totalRows) * 100 : 0;
    
    return {
      ...stats,
      successRate: successRate,
      hasErrors: validationResult.errors.length > 0,
      hasWarnings: validationResult.warnings.length > 0,
      totalPages: Math.ceil(filteredRows.length / pageSize)
    };
  }, [validationResult, filteredRows.length, pageSize]);

  /**
   * Alternar expansión de fila
   */
  const toggleRowExpansion = (rowNumber) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowNumber)) {
      newExpanded.delete(rowNumber);
    } else {
      newExpanded.add(rowNumber);
    }
    setExpandedRows(newExpanded);
  };

  /**
   * Exportar resultados de validación
   */
  const handleExportValidation = () => {
    if (!validationResult) return;

    const exportData = {
      summary: validationStats,
      dateRange: validationResult.statistics.dateRange,
      newEntities: {
        vehicles: validationResult.statistics.newVehicles,
        products: validationResult.statistics.newProducts
      },
      errors: validationResult.errors,
      warnings: validationResult.warnings,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validacion_migracion_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Renderizar estadísticas principales
   */
  const renderOverviewStats = () => {
    if (!validationStats) return null;

    return (
      <div className="validation-overview">
        {/* Resumen principal */}
        <div className="main-stats-grid">
          <div className="stat-card success">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>{validationStats.validRows}</h3>
              <p>Filas válidas</p>
              <span className="stat-percentage">{Math.round(validationStats.successRate)}%</span>
            </div>
          </div>

          <div className="stat-card error">
            <div className="stat-icon">
              <AlertCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>{validationStats.invalidRows}</h3>
              <p>Filas con errores</p>
              <span className="stat-percentage">{Math.round(100 - validationStats.successRate)}%</span>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <h3>{validationResult.warnings.length}</h3>
              <p>Advertencias</p>
              <span className="stat-note">No bloquean migración</span>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <Database size={24} />
            </div>
            <div className="stat-content">
              <h3>{validationStats.totalRows}</h3>
              <p>Total de filas</p>
              <span className="stat-note">Archivo procesado</span>
            </div>
          </div>
        </div>

        {/* Estadísticas detalladas */}
        <div className="detailed-stats-grid">
          <div className="stat-group">
            <h4><Calendar size={16} /> Rango de fechas</h4>
            <div className="stat-values">
              <span>Desde: {validationStats.dateRange.min?.toLocaleDateString('es-CO') || 'N/A'}</span>
              <span>Hasta: {validationStats.dateRange.max?.toLocaleDateString('es-CO') || 'N/A'}</span>
            </div>
          </div>

          <div className="stat-group">
            <h4><Users size={16} /> Nuevos vehículos</h4>
            <div className="stat-values">
              <span className="stat-number">{validationStats.newVehicles.length}</span>
              <span className="stat-detail">Se crearán automáticamente</span>
            </div>
          </div>

          <div className="stat-group">
            <h4><Package size={16} /> Nuevos productos</h4>
            <div className="stat-values">
              <span className="stat-number">{validationStats.newProducts.length}</span>
              <span className="stat-detail">Se crearán automáticamente</span>
            </div>
          </div>

          <div className="stat-group">
            <h4><TrendingUp size={16} /> Estimación</h4>
            <div className="stat-values">
              <span>{validationStats.validRows} movimientos</span>
              <span className="stat-detail">Listos para migrar</span>
            </div>
          </div>
        </div>

        {/* Barra de progreso general */}
        <div className="validation-progress">
          <div className="progress-header">
            <span>Estado de validación</span>
            <span>{validationStats.validRows}/{validationStats.totalRows} filas válidas</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill success" 
              style={{ width: `${validationStats.successRate}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renderizar lista de errores y advertencias
   */
  const renderErrorsAndWarnings = () => {
    const errors = validationResult?.errors || [];
    const warnings = validationResult?.warnings || [];

    return (
      <div className="errors-warnings-section">
        {/* Errores */}
        {errors.length > 0 && (
          <div className="message-group errors">
            <h4>
              <AlertCircle size={16} />
              Errores ({errors.length})
            </h4>
            <div className="messages-list">
              {errors.slice(0, 20).map((error, index) => (
                <div key={index} className="message-item error">
                  <span className="message-text">{error}</span>
                </div>
              ))}
              {errors.length > 20 && (
                <div className="message-item info">
                  <span>... y {errors.length - 20} errores más</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Advertencias */}
        {warnings.length > 0 && (
          <div className="message-group warnings">
            <h4>
              <AlertTriangle size={16} />
              Advertencias ({warnings.length})
            </h4>
            <div className="messages-list">
              {warnings.slice(0, 20).map((warning, index) => (
                <div key={index} className="message-item warning">
                  <span className="message-text">{warning}</span>
                </div>
              ))}
              {warnings.length > 20 && (
                <div className="message-item info">
                  <span>... y {warnings.length - 20} advertencias más</span>
                </div>
              )}
            </div>
          </div>
        )}

        {errors.length === 0 && warnings.length === 0 && (
          <div className="no-issues">
            <CheckCircle size={48} />
            <h3>¡Todo perfecto!</h3>
            <p>No se encontraron errores ni advertencias en los datos.</p>
          </div>
        )}
      </div>
    );
  };

  /**
   * Renderizar preview detallado de datos
   */
  const renderDataPreview = () => {
    if (!showDetailedPreview || paginatedRows.length === 0) return null;

    return (
      <div className="data-preview-section">
        {/* Controles de filtrado */}
        <div className="preview-controls">
          <div className="filter-controls">
            <div className="filter-group">
              <Filter size={16} />
              <select 
                value={filterType} 
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Todas las filas ({validationResult.processedData.length})</option>
                <option value="valid">Solo válidas ({validationStats.validRows})</option>
                <option value="invalid">Con errores ({validationStats.invalidRows})</option>
                <option value="warnings">Con advertencias ({validationResult.warnings.length})</option>
              </select>
            </div>

            <div className="search-group">
              <Search size={16} />
              <input
                type="text"
                placeholder="Buscar en datos..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <button 
              className="btn-secondary"
              onClick={() => setShowDetailedPreview(!showDetailedPreview)}
            >
              {showDetailedPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              {showDetailedPreview ? 'Ocultar' : 'Mostrar'} preview
            </button>
          </div>

          {/* Paginación */}
          <div className="pagination-controls">
            <button 
              className="btn-icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="pagination-info">
              Página {currentPage} de {validationStats.totalPages} 
              ({filteredRows.length} filas)
            </span>
            <button 
              className="btn-icon"
              onClick={() => setCurrentPage(Math.min(validationStats.totalPages, currentPage + 1))}
              disabled={currentPage === validationStats.totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Tabla de preview */}
        <div className="preview-table-container">
          <table className="validation-preview-table">
            <thead>
              <tr>
                <th className="row-number">#</th>
                <th className="status-column">Estado</th>
                <th>Fecha</th>
                <th>Vehículo</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Horómetro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row) => (
                <React.Fragment key={row.rowNumber}>
                  <tr className={`preview-row ${row.errors.length > 0 ? 'has-errors' : row.warnings.length > 0 ? 'has-warnings' : 'valid'}`}>
                    <td className="row-number">{row.rowNumber}</td>
                    <td className="status-column">
                      {row.errors.length > 0 ? (
                        <span className="status error">
                          <AlertCircle size={14} /> Error
                        </span>
                      ) : row.warnings.length > 0 ? (
                        <span className="status warning">
                          <AlertTriangle size={14} /> Advertencia
                        </span>
                      ) : (
                        <span className="status success">
                          <CheckCircle size={14} /> Válido
                        </span>
                      )}
                    </td>
                    <td>{row.mapped.fecha?.toLocaleDateString('es-CO') || '—'}</td>
                    <td>
                      <div className="vehicle-cell">
                        <span className="original">{row.original[columnMapping.vehiculo] || '—'}</span>
                        {row.mapped.vehiculoId && (
                          <span className="mapped">→ {row.mapped.vehiculoId}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="product-cell">
                        <span className="original">{row.original[columnMapping.producto] || '—'}</span>
                        {row.mapped.productoId && (
                          <span className="mapped">→ {row.mapped.productoId}</span>
                        )}
                      </div>
                    </td>
                    <td className="quantity-cell">{row.mapped.cantidad || '—'}</td>
                    <td className="hours-cell">{row.mapped.horometro || '—'}</td>
                    <td className="actions-cell">
                      <button 
                        className="btn-icon"
                        onClick={() => toggleRowExpansion(row.rowNumber)}
                        title="Ver detalles"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>

                  {/* Fila expandida con detalles */}
                  {expandedRows.has(row.rowNumber) && (
                    <tr className="expanded-row">
                      <td colSpan="8">
                        <div className="row-details">
                          {/* Errores */}
                          {row.errors.length > 0 && (
                            <div className="row-issues errors">
                              <h5><AlertCircle size={14} /> Errores</h5>
                              <ul>
                                {row.errors.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Advertencias */}
                          {row.warnings.length > 0 && (
                            <div className="row-issues warnings">
                              <h5><AlertTriangle size={14} /> Advertencias</h5>
                              <ul>
                                {row.warnings.map((warning, index) => (
                                  <li key={index}>{warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Datos mapeados */}
                          <div className="mapped-data">
                            <h5><Database size={14} /> Datos mapeados</h5>
                            <div className="mapped-fields">
                              {Object.entries(row.mapped).map(([field, value]) => (
                                <div key={field} className="mapped-field">
                                  <span className="field-name">{field}:</span>
                                  <span className="field-value">{
                                    value instanceof Date ? value.toLocaleDateString('es-CO') : 
                                    value?.toString() || 'N/A'
                                  }</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (!validationResult && !isValidating) {
    return (
      <div className="validation-step">
        <div className="step-info-card">
          <Info size={20} className="text-blue-500" />
          <div>
            <h4>Validación de datos</h4>
            <p>Ejecuta la validación para verificar que los datos están listos para migrar.</p>
          </div>
        </div>

        <div className="validation-prompt">
          <div className="prompt-content">
            <FileText size={48} />
            <h3>¿Listo para validar?</h3>
            <p>Los datos se verificarán antes de la migración final. Esto incluye:</p>
            <ul>
              <li>Validación de campos obligatorios</li>
              <li>Verificación de formatos de fecha y números</li>
              <li>Resolución de alias de vehículos y productos</li>
              <li>Detección de datos que requieren creación automática</li>
            </ul>
            
            <button 
              className="btn-primary"
              onClick={handleRunValidation}
              disabled={isValidating}
            >
              <Play size={16} />
              {isValidating ? 'Validando...' : 'Ejecutar validación'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isValidating) {
    return (
      <div className="validation-step">
        <div className="validation-loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <h3>Validando datos...</h3>
          <p>Verificando {fileData.length} filas de datos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="validation-step">
      {/* Información del paso */}
      <div className="step-info-card">
        <Info size={20} className="text-blue-500" />
        <div>
          <h4>Validación completada</h4>
          <p>Revisa los resultados de la validación antes de proceder con la migración final.</p>
        </div>
      </div>

      {/* Estado general de validación */}
      <div className="validation-status">
        <div className="status-header">
          <div className="status-icon">
            {validationResult.isValid ? (
              <CheckCircle size={24} className="success" />
            ) : (
              <AlertCircle size={24} className="error" />
            )}
          </div>
          <div className="status-content">
            <h3>
              {validationResult.isValid ? 
                '✅ Datos listos para migrar' : 
                '❌ Se encontraron errores que deben corregirse'
              }
            </h3>
            <p>
              {validationStats.validRows} de {validationStats.totalRows} filas son válidas 
              ({Math.round(validationStats.successRate)}% de éxito)
            </p>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="validation-actions">
          <button 
            className="btn-secondary"
            onClick={handleRunValidation}
            disabled={isValidating}
          >
            <RotateCcw size={16} />
            Re-validar
          </button>
          <button 
            className="btn-secondary"
            onClick={handleExportValidation}
          >
            <Download size={16} />
            Exportar reporte
          </button>
        </div>
      </div>

      {/* Tabs de contenido */}
      <div className="validation-tabs">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={16} />
            Resumen
          </button>
          <button
            className={`tab-button ${activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            <AlertTriangle size={16} />
            Errores y Advertencias
            {(validationResult.errors.length + validationResult.warnings.length) > 0 && (
              <span className="tab-badge">
                {validationResult.errors.length + validationResult.warnings.length}
              </span>
            )}
          </button>
          <button
            className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={16} />
            Preview de Datos
          </button>
        </div>

        {/* Contenido de tabs */}
        <div className="tab-content">
          {activeTab === 'overview' && renderOverviewStats()}
          {activeTab === 'issues' && renderErrorsAndWarnings()}
          {activeTab === 'preview' && renderDataPreview()}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Step4_Validation;