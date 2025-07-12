/**
 * Step3_ValueMapping.jsx - Componente para mapeo dinámico de valores
 * Tercer paso del wizard: mapear nombres descriptivos a códigos del sistema usando alias
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw, 
  Info,
  Eye,
  Zap,
  Plus,
  Search,
  Edit3,
  Save,
  X,
  ExternalLink,
  Target,
  Database,
  Users
} from 'lucide-react';
import aliasService, { ALIAS_TYPES } from '../../../services/aliasService';

/**
 * Componente para mapeo dinámico de valores
 */
const Step3_ValueMapping = ({ 
  mappedData = [],
  columnMapping = {},
  onValueMappingChange,
  currentValueMapping = {},
  _isLoading = false,
  error = null 
}) => {
  const [valueMappings, setValueMappings] = useState(currentValueMapping);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('vehicle');
  const [searchFilters, setSearchFilters] = useState({});
  const [editingAlias, setEditingAlias] = useState(null);
  const [newAliasValue, setNewAliasValue] = useState('');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [aliasStats, setAliasStats] = useState({});

  /**
   * Detectar campos que necesitan mapeo de valores
   */
  const fieldsToMap = useMemo(() => {
    const fields = [];
    
    // Detectar campos que corresponden a entidades mapeables
    Object.entries(columnMapping).forEach(([systemField, fileColumn]) => {
      if (systemField.toLowerCase().includes('vehicle') || systemField === 'vehicleId') {
        fields.push({
          systemField,
          fileColumn,
          aliasType: ALIAS_TYPES.VEHICLE,
          displayName: 'Vehículos',
          icon: '🚛',
          description: 'Mapear nombres de vehículos a códigos del sistema'
        });
      } else if (systemField.toLowerCase().includes('product') || systemField === 'productName') {
        fields.push({
          systemField,
          fileColumn,
          aliasType: ALIAS_TYPES.PRODUCT,
          displayName: 'Productos',
          icon: '⛽',
          description: 'Mapear nombres de combustibles a códigos del sistema'
        });
      } else if (systemField.toLowerCase().includes('location') || systemField === 'location') {
        fields.push({
          systemField,
          fileColumn,
          aliasType: ALIAS_TYPES.LOCATION,
          displayName: 'Ubicaciones',
          icon: '📍',
          description: 'Mapear nombres de ubicaciones a códigos del sistema'
        });
      } else if (systemField.toLowerCase().includes('supplier') || systemField === 'supplierName') {
        fields.push({
          systemField,
          fileColumn,
          aliasType: ALIAS_TYPES.SUPPLIER,
          displayName: 'Proveedores',
          icon: '🏢',
          description: 'Mapear nombres de proveedores a códigos del sistema'
        });
      }
    });

    return fields;
  }, [columnMapping]);

  /**
   * Extraer valores únicos del archivo para cada campo
   */
  const uniqueValues = useMemo(() => {
    const values = {};
    
    fieldsToMap.forEach(field => {
      const columnValues = mappedData
        .map(row => row[field.fileColumn])
        .filter(value => value && value.toString().trim())
        .map(value => value.toString().trim());
      
      values[field.aliasType] = [...new Set(columnValues)].sort();
    });

    return values;
  }, [mappedData, fieldsToMap]);

  /**
   * Cargar sugerencias automáticas al inicializar
   */
  useEffect(() => {
    const loadInitialSuggestions = async () => {
      if (Object.keys(currentValueMapping).length > 0) {
        setValueMappings(currentValueMapping);
        return;
      }

      setLoadingSuggestions(true);
      const suggestions = {};

      try {
        for (const field of fieldsToMap) {
          const values = uniqueValues[field.aliasType] || [];
          if (values.length > 0) {
            const fieldSuggestions = await aliasService.getSuggestedMappings(field.aliasType, values);
            suggestions[field.aliasType] = fieldSuggestions;
          }
        }

        setValueMappings(suggestions);
        onValueMappingChange(suggestions);
      } catch (error) {
        console.error('Error cargando sugerencias:', error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    loadInitialSuggestions();
  }, [fieldsToMap, uniqueValues, currentValueMapping, onValueMappingChange]);

  /**
   * Cargar estadísticas de alias
   */
  useEffect(() => {
    const loadAliasStats = async () => {
      const stats = {};
      
      for (const aliasType of Object.values(ALIAS_TYPES)) {
        try {
          const aliases = await aliasService.getAliasesByType(aliasType);
          stats[aliasType] = {
            totalAliases: aliases?.metadata?.totalMappings || 0,
            lastUsed: aliases?.metadata?.lastUsed || null,
            usageCount: aliases?.metadata?.usageCount || 0
          };
        } catch {
          stats[aliasType] = { totalAliases: 0, lastUsed: null, usageCount: 0 };
        }
      }
      
      setAliasStats(stats);
    };

    loadAliasStats();
  }, []);

  /**
   * Validar mapeos de valores
   */
  const validation = useMemo(() => {
    const results = {};
    let totalMapped = 0;
    let totalUnmapped = 0;

    fieldsToMap.forEach(field => {
      const values = uniqueValues[field.aliasType] || [];
      const mappings = valueMappings[field.aliasType] || {};
      
      const mapped = values.filter(value => 
        mappings[value]?.suggested && mappings[value].suggested !== null
      );
      const unmapped = values.filter(value => 
        !mappings[value]?.suggested || mappings[value].suggested === null
      );

      results[field.aliasType] = {
        total: values.length,
        mapped: mapped.length,
        unmapped: unmapped.length,
        mappedValues: mapped,
        unmappedValues: unmapped,
        percentage: values.length > 0 ? (mapped.length / values.length) * 100 : 100
      };

      totalMapped += mapped.length;
      totalUnmapped += unmapped.length;
    });

    return {
      byType: results,
      overall: {
        totalMapped,
        totalUnmapped,
        percentage: (totalMapped + totalUnmapped) > 0 ? (totalMapped / (totalMapped + totalUnmapped)) * 100 : 100
      }
    };
  }, [fieldsToMap, uniqueValues, valueMappings]);

  /**
   * Manejar cambio de mapeo manual
   */
  const handleManualMapping = useCallback(async (aliasType, inputValue, targetValue) => {
    const newMappings = { ...valueMappings };
    
    if (!newMappings[aliasType]) {
      newMappings[aliasType] = {};
    }

    newMappings[aliasType][inputValue] = {
      suggested: targetValue,
      confidence: 1.0,
      source: 'manual',
      alternatives: []
    };

    setValueMappings(newMappings);
    onValueMappingChange(newMappings);

    // Guardar alias para futuros usos
    if (targetValue) {
      try {
        await aliasService.saveAliases(aliasType, { [inputValue]: targetValue });
      } catch (error) {
        console.error('Error guardando alias:', error);
      }
    }
  }, [valueMappings, onValueMappingChange]);

  /**
   * Aplicar sugerencias automáticas
   */
  const handleApplySuggestions = async () => {
    setLoadingSuggestions(true);
    
    try {
      const newSuggestions = {};
      
      for (const field of fieldsToMap) {
        const values = uniqueValues[field.aliasType] || [];
        if (values.length > 0) {
          const suggestions = await aliasService.getSuggestedMappings(field.aliasType, values);
          newSuggestions[field.aliasType] = suggestions;
        }
      }

      setValueMappings(newSuggestions);
      onValueMappingChange(newSuggestions);
    } catch (error) {
      console.error('Error aplicando sugerencias:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  /**
   * Limpiar todos los mapeos
   */
  const handleClearMappings = () => {
    setValueMappings({});
    onValueMappingChange({});
  };

  /**
   * Guardar alias editado
   */
  const handleSaveAlias = async () => {
    if (!editingAlias || !newAliasValue.trim()) return;

    try {
      await handleManualMapping(
        editingAlias.aliasType, 
        editingAlias.inputValue, 
        newAliasValue.trim()
      );
      
      setEditingAlias(null);
      setNewAliasValue('');
    } catch (error) {
      console.error('Error guardando alias:', error);
    }
  };

  /**
   * Filtrar valores por búsqueda
   */
  const getFilteredValues = (aliasType) => {
    const values = uniqueValues[aliasType] || [];
    const searchTerm = searchFilters[aliasType] || '';
    
    if (!searchTerm.trim()) return values;
    
    return values.filter(value => 
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  /**
   * Renderizar preview de mapeo
   */
  const renderMappingPreview = () => {
    if (!showPreview || mappedData.length === 0) return null;

    const previewData = mappedData.slice(0, 5).map(row => {
      const mappedRow = { ...row };
      
      fieldsToMap.forEach(field => {
        const originalValue = row[field.fileColumn];
        const mapping = valueMappings[field.aliasType]?.[originalValue];
        if (mapping?.suggested) {
          mappedRow[`${field.fileColumn}_mapped`] = mapping.suggested;
        }
      });

      return mappedRow;
    });

    return (
      <div className="mapping-preview">
        <div className="preview-header">
          <Eye size={16} />
          <span>Vista previa del mapeo de valores ({mappedData.length} filas total)</span>
        </div>
        
        <div className="preview-table-container">
          <table className="preview-table">
            <thead>
              <tr>
                {fieldsToMap.map(field => (
                  <React.Fragment key={field.aliasType}>
                    <th className="original-column">{field.fileColumn} (Original)</th>
                    <th className="mapped-column">{field.fileColumn} (Mapeado)</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, index) => (
                <tr key={index}>
                  {fieldsToMap.map(field => (
                    <React.Fragment key={field.aliasType}>
                      <td className="original-value">{row[field.fileColumn] || '—'}</td>
                      <td className="mapped-value">
                        <span className={`mapped-result ${row[`${field.fileColumn}_mapped`] ? 'success' : 'pending'}`}>
                          {row[`${field.fileColumn}_mapped`] || 'Sin mapear'}
                        </span>
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (fieldsToMap.length === 0) {
    return (
      <div className="value-mapping-step">
        <div className="step-info-card">
          <Info size={20} className="text-blue-500" />
          <div>
            <h4>No se requiere mapeo de valores</h4>
            <p>Los campos mapeados no requieren conversión de valores. Puedes continuar al siguiente paso.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="value-mapping-step">
      {/* Información del paso */}
      <div className="step-info-card">
        <Info size={20} className="text-blue-500" />
        <div>
          <h4>Mapeo de valores</h4>
          <p>Convierte nombres descriptivos del archivo a códigos específicos del sistema. Los alias se guardan para reutilizar en futuras migraciones.</p>
        </div>
      </div>

      {/* Estado general del mapeo */}
      <div className="mapping-status">
        <div className="status-overview">
          <div className="status-item">
            <span className="status-label">Progreso total:</span>
            <div className="status-progress">
              <div 
                className="progress-bar"
                style={{ width: `${validation.overall.percentage}%` }}
              ></div>
              <span className="progress-text">
                {validation.overall.totalMapped} / {validation.overall.totalMapped + validation.overall.totalUnmapped} 
                ({Math.round(validation.overall.percentage)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Botones de acción globales */}
        <div className="mapping-actions">
          <button 
            className="btn-secondary"
            onClick={handleApplySuggestions}
            disabled={loadingSuggestions}
          >
            <Zap size={16} />
            {loadingSuggestions ? 'Cargando...' : 'Recargar sugerencias'}
          </button>
          <button 
            className="btn-secondary"
            onClick={handleClearMappings}
            disabled={Object.keys(valueMappings).length === 0}
          >
            <RotateCcw size={16} />
            Limpiar todo
          </button>
          <button 
            className="btn-secondary"
            onClick={() => setShowPreview(!showPreview)}
            disabled={Object.keys(valueMappings).length === 0}
          >
            <Eye size={16} />
            {showPreview ? 'Ocultar' : 'Ver'} preview
          </button>
        </div>
      </div>

      {/* Tabs por tipo de entidad */}
      <div className="mapping-tabs">
        <div className="tab-buttons">
          {fieldsToMap.map(field => (
            <button
              key={field.aliasType}
              className={`tab-button ${activeTab === field.aliasType ? 'active' : ''}`}
              onClick={() => setActiveTab(field.aliasType)}
            >
              <span className="tab-icon">{field.icon}</span>
              <span className="tab-text">{field.displayName}</span>
              <span className="tab-badge">
                {validation.byType[field.aliasType]?.mapped || 0} / {validation.byType[field.aliasType]?.total || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Contenido del tab activo */}
        {fieldsToMap.map(field => {
          if (field.aliasType !== activeTab) return null;

          const fieldValidation = validation.byType[field.aliasType];
          const fieldValues = getFilteredValues(field.aliasType);
          const fieldMappings = valueMappings[field.aliasType] || {};

          return (
            <div key={field.aliasType} className="tab-content">
              {/* Header del tab */}
              <div className="tab-header">
                <div className="tab-info">
                  <h3>{field.icon} {field.displayName}</h3>
                  <p>{field.description}</p>
                </div>
                
                <div className="tab-stats">
                  <div className="stat-item">
                    <Target size={16} />
                    <span>Progreso: {Math.round(fieldValidation?.percentage || 0)}%</span>
                  </div>
                  <div className="stat-item">
                    <Database size={16} />
                    <span>Alias guardados: {aliasStats[field.aliasType]?.totalAliases || 0}</span>
                  </div>
                </div>
              </div>

              {/* Barra de búsqueda */}
              <div className="search-bar">
                <Search size={16} />
                <input
                  type="text"
                  placeholder={`Buscar en ${fieldValues.length} valores de ${field.displayName.toLowerCase()}...`}
                  value={searchFilters[field.aliasType] || ''}
                  onChange={(e) => setSearchFilters(prev => ({
                    ...prev,
                    [field.aliasType]: e.target.value
                  }))}
                />
              </div>

              {/* Lista de valores para mapear */}
              <div className="values-mapping-list">
                {fieldValues.length === 0 ? (
                  <div className="empty-state">
                    <span>No se encontraron valores para mapear</span>
                  </div>
                ) : (
                  fieldValues.map(value => {
                    const mapping = fieldMappings[value];
                    const isMapped = mapping?.suggested && mapping.suggested !== null;
                    
                    return (
                      <div key={value} className={`value-mapping-item ${isMapped ? 'mapped' : 'unmapped'}`}>
                        <div className="value-info">
                          <div className="original-value">
                            <span className="value-text">{value}</span>
                            <span className="value-count">
                              {mappedData.filter(row => row[field.fileColumn] === value).length} registros
                            </span>
                          </div>
                          
                          {isMapped && (
                            <div className="mapped-result">
                              <ArrowRight size={14} />
                              <span className="mapped-value">{mapping.suggested}</span>
                              <span className={`confidence ${mapping.confidence >= 0.8 ? 'high' : mapping.confidence >= 0.5 ? 'medium' : 'low'}`}>
                                {Math.round(mapping.confidence * 100)}%
                              </span>
                              <span className="source">{mapping.source}</span>
                            </div>
                          )}
                        </div>

                        <div className="value-actions">
                          {mapping?.alternatives && mapping.alternatives.length > 0 && (
                            <select
                              className="alternatives-select"
                              value={mapping.suggested || ''}
                              onChange={(e) => handleManualMapping(field.aliasType, value, e.target.value)}
                            >
                              <option value={mapping.suggested}>{mapping.suggested} (Sugerido)</option>
                              {mapping.alternatives.map(alt => (
                                <option key={alt.id} value={alt.id}>
                                  {alt.id} ({Math.round(alt.confidence * 100)}%)
                                </option>
                              ))}
                            </select>
                          )}
                          
                          <button
                            className="btn-icon"
                            onClick={() => {
                              setEditingAlias({ aliasType: field.aliasType, inputValue: value });
                              setNewAliasValue(mapping?.suggested || '');
                            }}
                            title="Editar mapeo"
                          >
                            <Edit3 size={14} />
                          </button>
                          
                          {isMapped && (
                            <button
                              className="btn-icon danger"
                              onClick={() => handleManualMapping(field.aliasType, value, null)}
                              title="Eliminar mapeo"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de edición de alias */}
      {editingAlias && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Editar mapeo</h4>
              <button 
                className="btn-icon"
                onClick={() => {
                  setEditingAlias(null);
                  setNewAliasValue('');
                }}
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Valor original:</label>
                <input type="text" value={editingAlias.inputValue} disabled />
              </div>
              
              <div className="form-group">
                <label>Mapear a:</label>
                <input
                  type="text"
                  value={newAliasValue}
                  onChange={(e) => setNewAliasValue(e.target.value)}
                  placeholder="Código del sistema (ej: V-001, DIESEL, etc.)"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setEditingAlias(null);
                  setNewAliasValue('');
                }}
              >
                Cancelar
              </button>
              <button 
                className="btn-primary"
                onClick={handleSaveAlias}
                disabled={!newAliasValue.trim()}
              >
                <Save size={16} />
                Guardar alias
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Step3_ValueMapping;