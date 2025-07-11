/**
 * Step2_ColumnMapping.jsx - Componente para mapeo inteligente de columnas
 * Segundo paso del wizard: relacionar columnas del archivo con campos del sistema
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw, 
  Info,
  Eye,
  Columns,
  Zap
} from 'lucide-react';
import { REQUIRED_FIELDS, OPTIONAL_FIELDS } from '../../../services/migrationManager';

/**
 * Componente para mapeo de columnas
 */
const Step2_ColumnMapping = ({ 
  fileHeaders = [],
  currentMapping = {},
  columnSuggestions = {},
  onMappingChange,
  previewData = [],
  isLoading = false,
  error = null 
}) => {
  const [mappings, setMappings] = useState(currentMapping);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);

  /**
   * Sincronizar mappings cuando cambie currentMapping
   */
  useEffect(() => {
    if (Object.keys(currentMapping).length > 0) {
      setMappings(currentMapping);
    } else if (Object.keys(columnSuggestions).length > 0) {
      // Aplicar sugerencias automáticas inicialmente
      setMappings(columnSuggestions);
    }
  }, [currentMapping, columnSuggestions]);

  /**
   * Validar mapeos actuales
   */
  const validation = useMemo(() => {
    const missingRequired = Object.keys(REQUIRED_FIELDS).filter(
      field => !mappings[field]
    );
    
    const mappedColumns = Object.values(mappings);
    const unmappedColumns = fileHeaders.filter(
      header => !mappedColumns.includes(header)
    );

    const duplicateColumns = mappedColumns.filter(
      (column, index) => mappedColumns.indexOf(column) !== index
    );

    return {
      isValid: missingRequired.length === 0 && duplicateColumns.length === 0,
      missingRequired,
      unmappedColumns,
      duplicateColumns,
      totalMapped: Object.keys(mappings).length,
      requiredMapped: Object.keys(REQUIRED_FIELDS).filter(field => mappings[field]).length
    };
  }, [mappings, fileHeaders]);

  /**
   * Manejar cambio de mapeo
   */
  const handleMappingChange = useCallback((systemField, fileColumn) => {
    const newMappings = { ...mappings };
    
    if (fileColumn) {
      // Limpiar mapeo anterior de esta columna
      Object.keys(newMappings).forEach(field => {
        if (newMappings[field] === fileColumn) {
          delete newMappings[field];
        }
      });
      
      newMappings[systemField] = fileColumn;
    } else {
      delete newMappings[systemField];
    }
    
    setMappings(newMappings);
    onMappingChange(newMappings);
  }, [mappings, onMappingChange]);

  /**
   * Aplicar sugerencias automáticas
   */
  const handleApplySuggestions = () => {
    setMappings({ ...columnSuggestions });
    onMappingChange(columnSuggestions);
  };

  /**
   * Limpiar todos los mapeos
   */
  const handleClearMappings = () => {
    setMappings({});
    onMappingChange({});
  };

  /**
   * Manejar drag & drop
   */
  const handleDragStart = (e, column) => {
    setDraggedColumn(column);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, systemField) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredField(systemField);
  };

  const handleDragLeave = () => {
    setHoveredField(null);
  };

  const handleDrop = (e, systemField) => {
    e.preventDefault();
    if (draggedColumn) {
      handleMappingChange(systemField, draggedColumn);
    }
    setDraggedColumn(null);
    setHoveredField(null);
  };

  /**
   * Obtener tipo de campo (required/optional)
   */
  const getFieldType = (fieldName) => {
    return REQUIRED_FIELDS[fieldName] ? 'required' : 'optional';
  };

  /**
   * Obtener descripción del campo
   */
  const getFieldDescription = (fieldName) => {
    return REQUIRED_FIELDS[fieldName]?.description || 
           OPTIONAL_FIELDS[fieldName]?.description || 
           'Campo del sistema';
  };

  /**
   * Renderizar preview de mapeo
   */
  const renderMappingPreview = () => {
    if (!showPreview || previewData.length === 0) return null;

    const mappedData = previewData.slice(0, 3).map(row => {
      const mappedRow = {};
      Object.entries(mappings).forEach(([field, column]) => {
        mappedRow[field] = row[column];
      });
      return mappedRow;
    });

    return (
      <div className="mapping-preview">
        <div className="preview-header">
          <Eye size={16} />
          <span>Vista previa del mapeo</span>
        </div>
        
        <div className="preview-table-container">
          <table className="preview-table">
            <thead>
              <tr>
                {Object.keys(mappings).map(field => (
                  <th key={field}>
                    {field}
                    <span className={`field-type ${getFieldType(field)}`}>
                      {getFieldType(field) === 'required' ? 'REQ' : 'OPT'}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mappedData.map((row, index) => (
                <tr key={index}>
                  {Object.keys(mappings).map(field => (
                    <td key={field}>
                      {row[field]?.toString() || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="column-mapping-step">
      {/* Información del paso */}
      <div className="step-info-card">
        <Info size={20} className="text-blue-500" />
        <div>
          <h4>Mapeo de columnas</h4>
          <p>Relaciona las columnas de tu archivo con los campos del sistema. Los campos marcados como REQ son obligatorios.</p>
        </div>
      </div>

      {/* Estado del mapeo */}
      <div className="mapping-status">
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">Campos mapeados:</span>
            <span className="status-value">{validation.totalMapped}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Obligatorios:</span>
            <span className={`status-value ${validation.requiredMapped === Object.keys(REQUIRED_FIELDS).length ? 'success' : 'warning'}`}>
              {validation.requiredMapped}/{Object.keys(REQUIRED_FIELDS).length}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Sin mapear:</span>
            <span className="status-value">{validation.unmappedColumns.length}</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mapping-actions">
          <button 
            className="btn-secondary"
            onClick={handleApplySuggestions}
            disabled={Object.keys(columnSuggestions).length === 0}
          >
            <Zap size={16} />
            Aplicar sugerencias
          </button>
          <button 
            className="btn-secondary"
            onClick={handleClearMappings}
            disabled={Object.keys(mappings).length === 0}
          >
            <RotateCcw size={16} />
            Limpiar todo
          </button>
          <button 
            className="btn-secondary"
            onClick={() => setShowPreview(!showPreview)}
            disabled={Object.keys(mappings).length === 0}
          >
            <Eye size={16} />
            {showPreview ? 'Ocultar' : 'Ver'} preview
          </button>
        </div>
      </div>

      {/* Validación */}
      {!validation.isValid && (
        <div className="validation-messages">
          {validation.missingRequired.length > 0 && (
            <div className="validation-error">
              <AlertCircle size={16} />
              <span>Campos obligatorios sin mapear: {validation.missingRequired.join(', ')}</span>
            </div>
          )}
          
          {validation.duplicateColumns.length > 0 && (
            <div className="validation-error">
              <AlertCircle size={16} />
              <span>Columnas duplicadas: {validation.duplicateColumns.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Área principal de mapeo */}
      <div className="mapping-container">
        {/* Columnas del archivo */}
        <div className="file-columns">
          <h3>
            <Columns size={20} />
            Columnas del archivo ({fileHeaders.length})
          </h3>
          
          <div className="columns-list">
            {fileHeaders.map((header, index) => (
              <div
                key={index}
                className={`column-item ${
                  Object.values(mappings).includes(header) ? 'mapped' : 'unmapped'
                } ${draggedColumn === header ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, header)}
              >
                <span className="column-name">{header}</span>
                {Object.values(mappings).includes(header) && (
                  <CheckCircle size={14} className="mapped-icon" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Arrow connector */}
        <div className="mapping-arrow">
          <ArrowRight size={24} />
        </div>

        {/* Campos del sistema */}
        <div className="system-fields">
          <h3>
            <Columns size={20} />
            Campos del sistema
          </h3>

          {/* Campos obligatorios */}
          <div className="field-group">
            <h4>Campos obligatorios</h4>
            <div className="fields-list">
              {Object.entries(REQUIRED_FIELDS).map(([fieldName, fieldConfig]) => (
                <div
                  key={fieldName}
                  className={`field-item required ${
                    mappings[fieldName] ? 'mapped' : 'unmapped'
                  } ${hoveredField === fieldName ? 'hovered' : ''}`}
                  onDragOver={(e) => handleDragOver(e, fieldName)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, fieldName)}
                >
                  <div className="field-header">
                    <span className="field-name">{fieldName}</span>
                    <span className="field-type required">REQ</span>
                  </div>
                  <p className="field-description">{fieldConfig.description}</p>
                  
                  {mappings[fieldName] ? (
                    <div className="mapped-column">
                      <span className="mapped-to">→ {mappings[fieldName]}</span>
                      <button 
                        className="unmap-btn"
                        onClick={() => handleMappingChange(fieldName, null)}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="unmapped-field">
                      <select
                        value=""
                        onChange={(e) => handleMappingChange(fieldName, e.target.value)}
                        className="column-select"
                      >
                        <option value="">Seleccionar columna...</option>
                        {fileHeaders
                          .filter(header => !Object.values(mappings).includes(header))
                          .map(header => (
                            <option key={header} value={header}>{header}</option>
                          ))
                        }
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Campos opcionales */}
          <div className="field-group">
            <h4>Campos opcionales</h4>
            <div className="fields-list">
              {Object.entries(OPTIONAL_FIELDS).map(([fieldName, fieldConfig]) => (
                <div
                  key={fieldName}
                  className={`field-item optional ${
                    mappings[fieldName] ? 'mapped' : 'unmapped'
                  } ${hoveredField === fieldName ? 'hovered' : ''}`}
                  onDragOver={(e) => handleDragOver(e, fieldName)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, fieldName)}
                >
                  <div className="field-header">
                    <span className="field-name">{fieldName}</span>
                    <span className="field-type optional">OPT</span>
                  </div>
                  <p className="field-description">{fieldConfig.description}</p>
                  
                  {mappings[fieldName] ? (
                    <div className="mapped-column">
                      <span className="mapped-to">→ {mappings[fieldName]}</span>
                      <button 
                        className="unmap-btn"
                        onClick={() => handleMappingChange(fieldName, null)}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="unmapped-field">
                      <select
                        value=""
                        onChange={(e) => handleMappingChange(fieldName, e.target.value)}
                        className="column-select"
                      >
                        <option value="">Seleccionar columna...</option>
                        {fileHeaders
                          .filter(header => !Object.values(mappings).includes(header))
                          .map(header => (
                            <option key={header} value={header}>{header}</option>
                          ))
                        }
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview del mapeo */}
      {renderMappingPreview()}

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

export default Step2_ColumnMapping;