/**
 * Step1_FileUpload.jsx - Componente para carga y preview de archivos
 * Primer paso del wizard de migración con drag & drop
 */

import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  File, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X,
  Info,
  Eye,
  Settings
} from 'lucide-react';
// import fileParsingService from '../../../services/fileParsingService';

/**
 * Componente de carga de archivos
 */
const Step1_FileUpload = ({ 
  onFileProcessed, 
  currentFile = null, 
  isLoading = false,
  error = null 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [parsingOptions, setParsingOptions] = useState({
    excel: {
      cellText: false,
      cellDates: true
    },
    csv: {
      delimiter: ',',
      quote: '"',
      skipEmptyLines: true,
      trimValues: true
    }
  });

  const fileInputRef = useRef(null);

  /**
   * Manejar archivos seleccionados
   */
  const handleFileSelection = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;

    setUploadProgress(0);

    try {
      // Simular progreso de carga
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Procesar archivo
      await onFileProcessed(file, parsingOptions);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

    } catch (error) {
      console.error('Error procesando archivo:', error);
    }
  }, [onFileProcessed, parsingOptions]);

  /**
   * Manejar drag & drop
   */
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  }, [handleFileSelection]);

  /**
   * Abrir selector de archivos
   */
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Limpiar archivo seleccionado
   */
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadProgress(0);
    onFileProcessed(null);
  };

  /**
   * Formatear tamaño de archivo
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  /**
   * Obtener icono según tipo de archivo
   */
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'xlsx':
      case 'xls':
        return <File className="text-green-600" size={24} />;
      case 'csv':
        return <FileText className="text-blue-600" size={24} />;
      default:
        return <File className="text-gray-600" size={24} />;
    }
  };

  return (
    <div className="file-upload-step">
      {/* Información del paso */}
      <div className="step-info-card">
        <Info size={20} className="text-blue-500" />
        <div>
          <h4>Formatos soportados</h4>
          <p>Excel (.xlsx, .xls) y CSV (.csv) con datos históricos de combustibles</p>
        </div>
      </div>

      {/* Area de carga */}
      {!currentFile?.success ? (
        <div 
          className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${isLoading ? 'loading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <div className="upload-content">
            {isLoading ? (
              <>
                <div className="upload-spinner">
                  <div className="spinner"></div>
                </div>
                <h3>Procesando archivo...</h3>
                <p>Analizando estructura y validando formato</p>
                
                {/* Barra de progreso */}
                {uploadProgress > 0 && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{uploadProgress}%</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <Upload size={48} className="upload-icon" />
                <h3>Arrastra tu archivo aquí</h3>
                <p>o haz clic para seleccionar desde tu computadora</p>
                
                <div className="supported-formats">
                  <span className="format-tag excel">Excel (.xlsx, .xls)</span>
                  <span className="format-tag csv">CSV (.csv)</span>
                </div>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => handleFileSelection(Array.from(e.target.files))}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        /* Preview del archivo cargado */
        <div className="file-preview-card">
          <div className="file-header">
            <div className="file-info">
              {getFileIcon(currentFile.metadata.fileName)}
              <div className="file-details">
                <h4>{currentFile.metadata.fileName}</h4>
                <div className="file-meta">
                  <span>{formatFileSize(currentFile.metadata.fileSize)}</span>
                  <span>•</span>
                  <span>{currentFile.metadata.fileType}</span>
                  <span>•</span>
                  <span>{currentFile.metadata.rowCount} filas</span>
                  <span>•</span>
                  <span>{currentFile.metadata.columnCount} columnas</span>
                </div>
              </div>
            </div>
            
            <div className="file-actions">
              <button 
                className="btn-icon" 
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                title="Opciones avanzadas"
              >
                <Settings size={16} />
              </button>
              <button 
                className="btn-icon danger" 
                onClick={handleClearFile}
                title="Remover archivo"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Estado del procesamiento */}
          <div className="processing-status success">
            <CheckCircle size={16} />
            <span>Archivo procesado exitosamente</span>
          </div>

          {/* Preview de datos */}
          {currentFile.preview && currentFile.preview.headers.length > 0 && (
            <div className="data-preview">
              <div className="preview-header">
                <Eye size={16} />
                <span>Vista previa de datos ({currentFile.preview.total} filas total)</span>
              </div>
              
              <div className="preview-table-container">
                <table className="preview-table">
                  <thead>
                    <tr>
                      {currentFile.preview.headers.map((header, index) => (
                        <th key={index} title={header}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentFile.preview.preview.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {currentFile.preview.headers.map((header, colIndex) => (
                          <td key={colIndex} title={row[header]}>
                            {row[header]?.toString() || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Estadísticas */}
              <div className="preview-stats">
                <div className="stat-item">
                  <span className="stat-label">Filas encontradas:</span>
                  <span className="stat-value">{currentFile.preview.statistics.totalRows}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Columnas detectadas:</span>
                  <span className="stat-value">{currentFile.preview.statistics.totalColumns}</span>
                </div>
              </div>
            </div>
          )}

          {/* Mapeos sugeridos */}
          {currentFile.columnSuggestions && Object.keys(currentFile.columnSuggestions).length > 0 && (
            <div className="suggestions-preview">
              <h5>Mapeos sugeridos automáticamente:</h5>
              <div className="suggestions-grid">
                {Object.entries(currentFile.columnSuggestions).map(([field, column]) => (
                  <div key={field} className="suggestion-item">
                    <span className="field-name">{field}</span>
                    <span className="arrow">→</span>
                    <span className="column-name">{column}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Opciones avanzadas */}
      {showAdvancedOptions && (
        <div className="advanced-options">
          <h4>Opciones de procesamiento</h4>
          
          {/* Opciones Excel */}
          <div className="option-group">
            <h5>Opciones Excel</h5>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={parsingOptions.excel.cellDates}
                onChange={(e) => setParsingOptions(prev => ({
                  ...prev,
                  excel: { ...prev.excel, cellDates: e.target.checked }
                }))}
              />
              <span>Convertir fechas automáticamente</span>
            </label>
          </div>

          {/* Opciones CSV */}
          <div className="option-group">
            <h5>Opciones CSV</h5>
            <div className="form-row">
              <label>
                Delimitador:
                <select
                  value={parsingOptions.csv.delimiter}
                  onChange={(e) => setParsingOptions(prev => ({
                    ...prev,
                    csv: { ...prev.csv, delimiter: e.target.value }
                  }))}
                >
                  <option value=",">Coma (,)</option>
                  <option value=";">Punto y coma (;)</option>
                  <option value="\t">Tabulación</option>
                </select>
              </label>
              
              <label>
                Comillas:
                <select
                  value={parsingOptions.csv.quote}
                  onChange={(e) => setParsingOptions(prev => ({
                    ...prev,
                    csv: { ...prev.csv, quote: e.target.value }
                  }))}
                >
                  <option value='"'>Comillas dobles (")</option>
                  <option value="'">Comillas simples (')</option>
                </select>
              </label>
            </div>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={parsingOptions.csv.skipEmptyLines}
                onChange={(e) => setParsingOptions(prev => ({
                  ...prev,
                  csv: { ...prev.csv, skipEmptyLines: e.target.checked }
                }))}
              />
              <span>Omitir líneas vacías</span>
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={parsingOptions.csv.trimValues}
                onChange={(e) => setParsingOptions(prev => ({
                  ...prev,
                  csv: { ...prev.csv, trimValues: e.target.checked }
                }))}
              />
              <span>Limpiar espacios en valores</span>
            </label>
          </div>
        </div>
      )}

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

export default Step1_FileUpload;