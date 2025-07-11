/**
 * GuidedMigrationPanel - Panel de migración con guía didáctica completa
 * Reemplaza el sistema anterior con validación exhaustiva y formato claro
 */

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertTriangle, Info, Download, FileText, Loader, XCircle } from 'lucide-react';
import fileParsingService from '../../services/fileParsingService';
import { validateMigrationFile } from '../../services/migrationValidator';
import { executeFileDataMigration } from '../../services/realDataMigrationService';
import './Migration.css';

const REQUIRED_FORMAT = {
  name: 'Formato Requerido para Migración',
  description: 'Especificaciones exactas que debe cumplir tu archivo Excel o CSV',
  sheets: {
    movements: {
      name: 'Movimientos (Obligatorio)',
      description: 'Hoja principal con todos los movimientos de combustible',
      columns: [
        { 
          name: 'fecha', 
          type: 'Fecha', 
          required: true, 
          format: 'DD/MM/YYYY',
          description: 'Fecha del movimiento de combustible',
          examples: ['15/01/2024', '03/12/2023', '28/06/2024'],
          errors: ['31/13/2024 ❌', '2024-01-15 ❌', 'Enero 15 ❌']
        },
        { 
          name: 'codigo', 
          type: 'Texto', 
          required: true,
          description: 'Código del producto según tabla de referencia',
          examples: ['A', 'G', 'AO', 'AM4T'],
          note: 'A=ACPM/Diesel, G=Gasolina, AO=Aceite Hidráulico'
        },
        { 
          name: 'articulo', 
          type: 'Texto', 
          required: true,
          description: 'Nombre completo del producto',
          examples: ['GASOLINA', 'ACPM', 'Aceite Motor 20w50'],
          note: 'Debe coincidir con el código'
        },
        { 
          name: 'usuario', 
          type: 'Texto', 
          required: true,
          description: 'Vehículo, equipo o destino del combustible',
          examples: ['TR-1', 'Camioneta Amarilla', 'VOLQUETA', 'Moto XTZ Negra'],
          note: 'Será mapeado automáticamente a códigos del sistema'
        },
        { 
          name: 'cantidad', 
          type: 'Número', 
          required: true,
          description: 'Cantidad en galones (usar punto decimal)',
          examples: ['15.5', '30', '2.75', '100'],
          errors: ['15,5 ❌', 'quince ❌', '-5 ❌']
        },
        { 
          name: 'horometro', 
          type: 'Número', 
          required: false,
          description: 'Lectura del horómetro para tractores (opcional)',
          examples: ['1234', '5678.5', ''],
          note: 'Solo para vehículos con horómetro'
        },
        { 
          name: 'descripcion', 
          type: 'Texto', 
          required: false,
          description: 'Notas adicionales (opcional)',
          examples: ['Tanque lleno', 'Mantenimiento programado', ''],
          note: 'Campo libre para observaciones'
        }
      ]
    }
  },
  rules: [
    '📋 Los nombres de las columnas deben ser EXACTAMENTE como se especifica',
    '📅 Las fechas deben estar en formato DD/MM/YYYY (día/mes/año)',
    '🔢 Los números deben usar punto (.) como separador decimal, no coma',
    '📊 No debe haber filas vacías entre los datos',
    '📝 La primera fila debe contener los nombres de las columnas',
    '✅ Mínimo debe tener la hoja "Movimientos" con datos',
    '🚫 No incluir fórmulas, solo valores'
  ]
};

const PRODUCT_CODES = {
  'A': { name: 'ACPM (Diesel)', category: 'Combustible Principal' },
  'G': { name: 'GASOLINA', category: 'Combustible Principal' },
  'AO': { name: 'Aceite Hidráulico', category: 'Lubricante' },
  'AM4T': { name: 'Aceite Motor 20w50', category: 'Lubricante' },
  'GA': { name: 'GRASA', category: 'Lubricante' },
  'VA': { name: 'Valbulina', category: 'Lubricante' },
  'LO': { name: 'Líquido para Frenos', category: 'Fluido' },
  'MA': { name: 'Mistura 2T', category: 'Combustible Especial' },
  '15W40': { name: 'ACEITE 15W40', category: 'Lubricante' }
};

const GuidedMigrationPanel = () => {
  const [currentStep, setCurrentStep] = useState('guide');
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [validation, setValidation] = useState(null);
  const [migrationResult, setMigrationResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFormatGuide, setShowFormatGuide] = useState(true);
  const [processingStep, setProcessingStep] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCurrentStep('upload');
      // Auto-procesar archivo
      await processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile) => {
    setIsProcessing(true);
    setProcessingStep('Leyendo archivo...');

    try {
      // 1. Parsear archivo
      const parseResult = await fileParsingService.parseFile(selectedFile);

      if (!parseResult.success) {
        throw new Error(parseResult.error);
      }

      setProcessingStep('Validando estructura...');

      // 2. Preparar datos para validación
      const processedData = {
        movements: parseResult.data || [],
        vehicles: null // Por ahora solo movimientos
      };

      // 3. Validar contenido
      setProcessingStep('Validando contenido...');
      const validationResult = validateMigrationFile(processedData);

      setFileData(processedData);
      setValidation(validationResult);
      setCurrentStep('validate');

    } catch (error) {
      console.error('Error procesando archivo:', error);
      setValidation({
        isValid: false,
        errors: [`Error procesando archivo: ${error.message}`],
        warnings: [],
        stats: { totalRows: 0, validRows: 0, invalidRows: 0, duplicates: 0 }
      });
      setCurrentStep('validate');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const executeDataMigration = async () => {
    if (!validation?.isValid || !fileData) return;

    setIsProcessing(true);
    setCurrentStep('migrate');

    try {
      const result = await executeFileDataMigration(fileData, (progress) => {
        setProcessingStep(progress.step || `Progreso: ${progress.progress}%`);
      });

      setMigrationResult(result);
      setProcessingStep('¡Migración completada exitosamente!');

    } catch (error) {
      console.error('Error en migración:', error);
      setMigrationResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetProcess = () => {
    setCurrentStep('guide');
    setFile(null);
    setFileData(null);
    setValidation(null);
    setMigrationResult(null);
    setIsProcessing(false);
    setProcessingStep('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateExampleFile = () => {
    const exampleData = [
      ['fecha', 'codigo', 'articulo', 'usuario', 'cantidad', 'horometro', 'descripcion'],
      ['15/01/2024', 'G', 'GASOLINA', 'Camioneta Amarilla', '9', '', 'Tanque lleno'],
      ['16/01/2024', 'A', 'ACPM', 'TR-1', '15', '1234', 'Trabajo en campo'],
      ['17/01/2024', 'G', 'GASOLINA', 'Moto XTZ Negra', '2', '', 'Recorrido rutinario'],
      ['18/01/2024', 'A', 'ACPM', 'VOLQUETA', '30', '', 'Transporte de troncos'],
      ['19/01/2024', 'AO', 'Aceite Hidraulico', 'TR-2', '2.5', '2456', 'Cambio de aceite hidráulico'],
      ['20/01/2024', 'G', 'GASOLINA', 'Camioneta Burbuja', '12', '', 'Ruta a campamento'],
      ['21/01/2024', 'AM4T', 'Aceite Motor 20w50', 'TR-3', '5', '789', 'Mantenimiento programado']
    ];

    const csvContent = exampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ejemplo_migracion_combustibles.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="guided-migration-panel">
      {/* Header */}
      <div className="migration-header-guided">
        <h2>🎯 Migración Guiada de Datos</h2>
        <p>Sistema paso a paso con validación automática y guía didáctica</p>
      </div>

      {/* Progress Steps */}
      <div className="migration-steps">
        <div className={`step ${currentStep === 'guide' ? 'active' : 'completed'}`}>
          <div className="step-number">1</div>
          <span>Preparar Archivo</span>
        </div>
        <div className={`step ${currentStep === 'upload' ? 'active' : currentStep === 'validate' || currentStep === 'migrate' ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <span>Cargar y Validar</span>
        </div>
        <div className={`step ${currentStep === 'validate' ? 'active' : currentStep === 'migrate' ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <span>Revisar Datos</span>
        </div>
        <div className={`step ${currentStep === 'migrate' ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <span>Ejecutar Migración</span>
        </div>
      </div>

      {/* Step 1: Format Guide */}
      {currentStep === 'guide' && (
        <div className="format-guide-section">
          <div className="guide-header">
            <h3>📋 Paso 1: Preparar tu Archivo</h3>
            <p>Antes de cargar el archivo, asegúrate de que cumple con el formato exacto requerido</p>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="btn-download-example" onClick={generateExampleFile}>
              <Download size={20} />
              Descargar Archivo de Ejemplo
            </button>
            <button 
              className="btn-format-toggle"
              onClick={() => setShowFormatGuide(!showFormatGuide)}
            >
              <FileText size={20} />
              {showFormatGuide ? 'Ocultar' : 'Mostrar'} Guía de Formato
            </button>
          </div>

          {/* Detailed Format Guide */}
          {showFormatGuide && (
            <div className="format-specification">
              <div className="format-header">
                <h4>📊 Especificación Completa del Formato</h4>
                <p>Tu archivo Excel o CSV debe cumplir estas especificaciones exactas:</p>
              </div>

              {/* Required Sheet: Movements */}
              <div className="sheet-spec">
                <h5>🔴 Hoja Obligatoria: "Movimientos"</h5>
                <div className="columns-grid">
                  {REQUIRED_FORMAT.sheets.movements.columns.map((col, index) => (
                    <div key={index} className={`column-spec ${col.required ? 'required' : 'optional'}`}>
                      <div className="column-header">
                        <span className="column-name">{col.name}</span>
                        <span className={`column-type ${col.required ? 'required' : 'optional'}`}>
                          {col.type} {col.required ? '(Obligatorio)' : '(Opcional)'}
                        </span>
                      </div>
                      <div className="column-description">{col.description}</div>
                      {col.format && (
                        <div className="column-format">
                          <strong>Formato:</strong> {col.format}
                        </div>
                      )}
                      {col.examples && (
                        <div className="column-examples">
                          <strong>✅ Ejemplos correctos:</strong>
                          <div className="examples-list">
                            {col.examples.map((example, i) => (
                              <span key={i} className="example correct">{example}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {col.errors && (
                        <div className="column-errors">
                          <strong>❌ Ejemplos incorrectos:</strong>
                          <div className="examples-list">
                            {col.errors.map((error, i) => (
                              <span key={i} className="example incorrect">{error}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {col.note && (
                        <div className="column-note">
                          <Info size={14} />
                          {col.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Codes Reference */}
              <div className="product-codes-reference">
                <h5>🏷️ Códigos de Productos Válidos</h5>
                <div className="codes-grid">
                  {Object.entries(PRODUCT_CODES).map(([code, info]) => (
                    <div key={code} className="product-code">
                      <span className="code">{code}</span>
                      <div className="code-info">
                        <div className="product-name">{info.name}</div>
                        <div className="product-category">{info.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validation Rules */}
              <div className="validation-rules">
                <h5>⚠️ Reglas de Validación Importantes</h5>
                <ul className="rules-list">
                  {REQUIRED_FORMAT.rules.map((rule, index) => (
                    <li key={index} className="rule-item">{rule}</li>
                  ))}
                </ul>
              </div>

              {/* File Structure Example */}
              <div className="file-structure-example">
                <h5>📋 Ejemplo de Estructura del Archivo</h5>
                <div className="table-example">
                  <table className="example-table">
                    <thead>
                      <tr>
                        <th>fecha</th>
                        <th>codigo</th>
                        <th>articulo</th>
                        <th>usuario</th>
                        <th>cantidad</th>
                        <th>horometro</th>
                        <th>descripcion</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>15/01/2024</td>
                        <td>G</td>
                        <td>GASOLINA</td>
                        <td>Camioneta Amarilla</td>
                        <td>9</td>
                        <td></td>
                        <td>Tanque lleno</td>
                      </tr>
                      <tr>
                        <td>16/01/2024</td>
                        <td>A</td>
                        <td>ACPM</td>
                        <td>TR-1</td>
                        <td>15</td>
                        <td>1234</td>
                        <td>Trabajo en campo</td>
                      </tr>
                      <tr>
                        <td>17/01/2024</td>
                        <td>G</td>
                        <td>GASOLINA</td>
                        <td>Moto XTZ</td>
                        <td>2.5</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tips and Best Practices */}
              <div className="tips-section">
                <h5>💡 Consejos y Mejores Prácticas</h5>
                <div className="tips-grid">
                  <div className="tip-card">
                    <div className="tip-icon">📅</div>
                    <div className="tip-content">
                      <strong>Fechas:</strong> Usa siempre DD/MM/YYYY. Excel a veces cambia el formato automáticamente, revisa antes de guardar.
                    </div>
                  </div>
                  <div className="tip-card">
                    <div className="tip-icon">🔢</div>
                    <div className="tip-content">
                      <strong>Números:</strong> Usa punto (.) para decimales. Evita comas, espacios o texto en campos numéricos.
                    </div>
                  </div>
                  <div className="tip-card">
                    <div className="tip-icon">📝</div>
                    <div className="tip-content">
                      <strong>Códigos:</strong> Revisa la tabla de códigos válidos. Un código incorrecto invalidará toda la fila.
                    </div>
                  </div>
                  <div className="tip-card">
                    <div className="tip-icon">🚚</div>
                    <div className="tip-content">
                      <strong>Vehículos:</strong> Usa nombres descriptivos. El sistema mapeará automáticamente a los códigos internos.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <div className="step-actions">
            <button 
              className="btn-continue-primary"
              onClick={() => setCurrentStep('upload')}
            >
              Mi Archivo Está Listo - Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 2: File Upload */}
      {currentStep === 'upload' && (
        <div className="upload-section">
          <div className="upload-header">
            <h3>📤 Paso 2: Cargar tu Archivo</h3>
            <p>Selecciona tu archivo Excel (.xlsx) o CSV (.csv) preparado según la guía</p>
          </div>

          <div className="upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            {!file ? (
              <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
                <Upload size={48} />
                <h4>Hacer clic para seleccionar archivo</h4>
                <p>Archivos soportados: Excel (.xlsx, .xls) y CSV (.csv)</p>
                <p>Tamaño máximo: 50 MB</p>
              </div>
            ) : (
              <div className="file-selected">
                <CheckCircle size={32} color="#27ae60" />
                <div className="file-info">
                  <h4>{file.name}</h4>
                  <p>Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p>Tipo: {file.type}</p>
                </div>
                <button 
                  className="btn-change-file"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Cambiar Archivo
                </button>
              </div>
            )}
          </div>

          {file && (
            <div className="upload-actions">
              <button 
                className="btn-back"
                onClick={() => setCurrentStep('guide')}
              >
                ← Volver a la Guía
              </button>
              <button 
                className="btn-validate"
                onClick={() => setCurrentStep('validate')}
                disabled={isProcessing}
              >
                {isProcessing ? 'Validando...' : 'Validar Archivo →'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: File Processing */}
      {currentStep === 'upload' && (
        <div className="upload-processing-section">
          <div className="processing-header">
            <h3>📤 Paso 2: Procesando Archivo</h3>
            <p>Analizando y validando la estructura de tu archivo...</p>
          </div>

          {isProcessing && (
            <div className="processing-status">
              <div className="loading-spinner">
                <Loader className="spinner" size={24} />
              </div>
              <div className="processing-text">
                <strong>{processingStep}</strong>
                <p>Por favor espera mientras verificamos tu archivo...</p>
              </div>
            </div>
          )}

          {file && (
            <div className="file-info">
              <h4>📄 Archivo Seleccionado</h4>
              <div className="file-details">
                <div className="file-detail">
                  <strong>Nombre:</strong> {file.name}
                </div>
                <div className="file-detail">
                  <strong>Tamaño:</strong> {(file.size / 1024).toFixed(2)} KB
                </div>
                <div className="file-detail">
                  <strong>Tipo:</strong> {file.type || 'No detectado'}
                </div>
                <div className="file-detail">
                  <strong>Última modificación:</strong> {new Date(file.lastModified).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Validation Results */}
      {currentStep === 'validate' && validation && (
        <div className="validation-section">
          <div className="validation-header">
            <h3>🔍 Paso 3: Resultados de Validación</h3>
            <p>Revisión completa de la estructura y contenido de tu archivo</p>
          </div>

          {/* Validation Summary */}
          <div className={`validation-summary ${validation.isValid ? 'valid' : 'invalid'}`}>
            <div className="summary-icon">
              {validation.isValid ? (
                <CheckCircle size={32} className="success-icon" />
              ) : (
                <XCircle size={32} className="error-icon" />
              )}
            </div>
            <div className="summary-content">
              <h4>
                {validation.isValid ? '✅ Archivo Válido' : '❌ Archivo con Errores'}
              </h4>
              <p>
                {validation.isValid
                  ? 'Tu archivo cumple con todos los requisitos y está listo para migrar.'
                  : 'Se encontraron errores que deben corregirse antes de continuar.'
                }
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="validation-stats">
            <h4>📊 Estadísticas del Archivo</h4>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{validation.stats.totalRows}</div>
                <div className="stat-label">Total de Filas</div>
              </div>
              <div className="stat-card valid">
                <div className="stat-number">{validation.stats.validRows}</div>
                <div className="stat-label">Filas Válidas</div>
              </div>
              <div className="stat-card invalid">
                <div className="stat-number">{validation.stats.invalidRows}</div>
                <div className="stat-label">Filas con Errores</div>
              </div>
              <div className="stat-card warning">
                <div className="stat-number">{validation.stats.duplicates}</div>
                <div className="stat-label">Duplicados</div>
              </div>
            </div>
          </div>

          {/* Errors */}
          {validation.errors.length > 0 && (
            <div className="validation-errors">
              <h4>❌ Errores Encontrados</h4>
              <div className="errors-list">
                {validation.errors.map((error, index) => (
                  <div key={index} className="error-item">
                    <XCircle size={16} className="error-icon" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {validation.warnings.length > 0 && (
            <div className="validation-warnings">
              <h4>⚠️ Advertencias</h4>
              <div className="warnings-list">
                {validation.warnings.map((warning, index) => (
                  <div key={index} className="warning-item">
                    <AlertTriangle size={16} className="warning-icon" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Preview */}
          {fileData && fileData.movements && fileData.movements.length > 0 && (
            <div className="data-preview">
              <h4>👁️ Vista Previa de Datos</h4>
              <p>Primeras 5 filas de tu archivo procesado:</p>
              <div className="preview-table-container">
                <table className="preview-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Código</th>
                      <th>Artículo</th>
                      <th>Usuario</th>
                      <th>Cantidad</th>
                      <th>Horómetro</th>
                      <th>Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileData.movements.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        <td>{row.fecha}</td>
                        <td>{row.codigo}</td>
                        <td>{row.articulo}</td>
                        <td>{row.usuario}</td>
                        <td>{row.cantidad}</td>
                        <td>{row.horometro || '-'}</td>
                        <td>{row.descripcion || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {fileData.movements.length > 5 && (
                <p className="preview-note">
                  ... y {fileData.movements.length - 5} filas más
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="validation-actions">
            {validation.isValid ? (
              <button
                className="btn-proceed-migration"
                onClick={executeDataMigration}
                disabled={isProcessing}
              >
                <CheckCircle size={20} />
                Proceder con la Migración
              </button>
            ) : (
              <div className="error-actions">
                <p className="error-message">
                  ⚠️ Corrige los errores en tu archivo y vuelve a cargarlo
                </p>
                <button
                  className="btn-try-again"
                  onClick={resetProcess}
                >
                  ���� Intentar con Otro Archivo
                </button>
              </div>
            )}
            <button
              className="btn-back-to-guide"
              onClick={() => setCurrentStep('guide')}
            >
              ��� Volver a la Guía
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Migration Execution */}
      {currentStep === 'migrate' && (
        <div className="migration-execution-section">
          <div className="migration-header">
            <h3>🚀 Paso 4: Ejecutando Migración</h3>
            <p>Transfiriendo datos a la base de datos del sistema</p>
          </div>

          {isProcessing && (
            <div className="migration-progress">
              <div className="progress-content">
                <Loader className="spinner large" size={32} />
                <div className="progress-text">
                  <strong>{processingStep}</strong>
                  <p>La migración está en progreso, por favor no cierres esta ventana...</p>
                </div>
              </div>
            </div>
          )}

          {migrationResult && (
            <div className={`migration-result ${migrationResult.success ? 'success' : 'error'}`}>
              <div className="result-header">
                {migrationResult.success ? (
                  <>
                    <CheckCircle size={32} className="success-icon" />
                    <h4>✅ Migración Completada Exitosamente</h4>
                  </>
                ) : (
                  <>
                    <XCircle size={32} className="error-icon" />
                    <h4>❌ Error en la Migración</h4>
                  </>
                )}
              </div>

              {migrationResult.success ? (
                <div className="success-details">
                  <p>Todos los datos han sido transferidos correctamente al sistema.</p>
                  {migrationResult.stats && (
                    <div className="migration-stats">
                      <div className="stat">
                        <strong>Registros procesados:</strong> {migrationResult.stats.processed}
                      </div>
                      <div className="stat">
                        <strong>Registros insertados:</strong> {migrationResult.stats.inserted}
                      </div>
                      <div className="stat">
                        <strong>Tiempo de proceso:</strong> {migrationResult.stats.duration}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="error-details">
                  <p>Ocurrió un error durante la migración:</p>
                  <div className="error-message">{migrationResult.error}</div>
                </div>
              )}

              <div className="result-actions">
                <button
                  className="btn-start-new-migration"
                  onClick={resetProcess}
                >
                  🔄 Nueva Migración
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidedMigrationPanel;
