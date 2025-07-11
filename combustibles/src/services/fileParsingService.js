/**
 * fileParsingService.js - Servicio universal para parsing de archivos de migración
 * Maneja Excel, CSV y otros formatos con detección automática de estructura
 */

// XLSX se importa dinámicamente cuando se necesita

/**
 * Tipos de archivos soportados
 */
export const SUPPORTED_FILE_TYPES = {
  EXCEL: ['xlsx', 'xls'],
  CSV: ['csv'],
  TEXT: ['txt', 'tsv']
};

/**
 * Resultado estándar del parsing
 */
export const createParsingResult = (success, data = null, error = null, metadata = {}) => ({
  success,
  data,
  error,
  metadata: {
    fileName: '',
    fileSize: 0,
    fileType: '',
    rowCount: 0,
    columnCount: 0,
    sheets: [],
    encoding: 'UTF-8',
    ...metadata
  }
});

/**
 * Detectar tipo de archivo basado en extensión y contenido
 * @param {File} file - Archivo a analizar
 * @returns {string} - Tipo de archivo detectado
 */
export const detectFileType = (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  
  // Verificar extensiones conocidas
  for (const [type, extensions] of Object.entries(SUPPORTED_FILE_TYPES)) {
    if (extensions.includes(extension)) {
      return type;
    }
  }
  
  // Fallback basado en MIME type
  if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
    return 'EXCEL';
  }
  if (file.type.includes('csv') || file.type.includes('text')) {
    return 'CSV';
  }
  
  return 'UNKNOWN';
};

/**
 * Validar si el archivo es soportado
 * @param {File} file - Archivo a validar
 * @returns {object} - Resultado de validación
 */
export const validateFile = (file) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const minSize = 10; // 10 bytes
  
  if (!file) {
    return { valid: false, error: 'No se proporcionó ningún archivo' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'El archivo es demasiado grande (máximo 50MB)' };
  }
  
  if (file.size < minSize) {
    return { valid: false, error: 'El archivo está vacío o es demasiado pequeño' };
  }
  
  const fileType = detectFileType(file);
  if (fileType === 'UNKNOWN') {
    return { 
      valid: false, 
      error: 'Tipo de archivo no soportado. Use Excel (.xlsx, .xls) o CSV (.csv)' 
    };
  }
  
  return { valid: true, fileType };
};

/**
 * Parsear archivo Excel/XLS
 * @param {ArrayBuffer} arrayBuffer - Buffer del archivo
 * @param {object} options - Opciones de parsing
 * @returns {object} - Resultado del parsing
 */
const parseExcelFile = async (arrayBuffer, options = {}) => {
  try {
    // Importar XLSX dinámicamente
    const XLSX = await import('xlsx');
    
    const workbook = XLSX.read(arrayBuffer, { 
      type: 'buffer',
      cellText: false,
      cellDates: true,
      ...options 
    });
    
    const result = {
      sheets: [],
      data: null,
      metadata: {
        sheetNames: workbook.SheetNames,
        sheets: workbook.SheetNames.length
      }
    };
    
    // Procesar todas las hojas
    workbook.SheetNames.forEach((sheetName, index) => {
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir a JSON manteniendo headers originales
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1, // Usar números como headers inicialmente
        defval: '', // Valor por defecto para celdas vacías
        blankrows: false // Omitir filas completamente vacías
      });
      
      if (jsonData.length === 0) {
        return; // Saltar hojas vacías
      }
      
      // La primera fila son los headers
      const headers = jsonData[0] || [];
      const rows = jsonData.slice(1);
      
      // Limpiar headers (remover espacios, caracteres especiales)
      const cleanHeaders = headers.map((header, index) => {
        if (!header || header.toString().trim() === '') {
          return `Columna_${index + 1}`;
        }
        return header.toString().trim();
      });
      
      // Convertir filas a objetos usando headers limpios
      const dataWithHeaders = rows
        .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
        .map(row => {
          const obj = {};
          cleanHeaders.forEach((header, index) => {
            const cellValue = row[index];
            
            // Procesar diferentes tipos de datos
            if (cellValue instanceof Date) {
              obj[header] = cellValue;
            } else if (typeof cellValue === 'number') {
              obj[header] = cellValue;
            } else if (typeof cellValue === 'string') {
              obj[header] = cellValue.trim();
            } else {
              obj[header] = cellValue || '';
            }
          });
          return obj;
        });
      
      const sheetInfo = {
        name: sheetName,
        index: index,
        headers: cleanHeaders,
        rowCount: dataWithHeaders.length,
        columnCount: cleanHeaders.length,
        data: dataWithHeaders,
        range: worksheet['!ref'] || 'A1',
        isEmpty: dataWithHeaders.length === 0
      };
      
      result.sheets.push(sheetInfo);
    });
    
    // Usar la primera hoja no vacía como data principal
    const primarySheet = result.sheets.find(sheet => !sheet.isEmpty) || result.sheets[0];
    if (primarySheet) {
      result.data = primarySheet.data;
      result.metadata.primarySheet = primarySheet.name;
      result.metadata.headers = primarySheet.headers;
      result.metadata.rowCount = primarySheet.rowCount;
      result.metadata.columnCount = primarySheet.columnCount;
    }
    
    return createParsingResult(true, result.data, null, result.metadata);
    
  } catch (error) {
    console.error('❌ Error parsing Excel file:', error);
    return createParsingResult(false, null, `Error procesando archivo Excel: ${error.message}`);
  }
};

/**
 * Parsear archivo CSV
 * @param {string} csvContent - Contenido del CSV como string
 * @param {object} options - Opciones de parsing
 * @returns {object} - Resultado del parsing
 */
const parseCSVFile = (csvContent, options = {}) => {
  try {
    const { 
      delimiter = ',',
      quote = '"',
      escape = '"',
      skipEmptyLines = true,
      trimValues = true
    } = options;
    
    const lines = csvContent.split(/\r?\n/);
    
    if (lines.length === 0) {
      return createParsingResult(false, null, 'El archivo CSV está vacío');
    }
    
    // Función para parsear una línea CSV respetando comillas
    const parseCSVLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      let i = 0;
      
      while (i < line.length) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === quote && !inQuotes) {
          inQuotes = true;
        } else if (char === quote && inQuotes) {
          if (nextChar === quote) {
            current += quote;
            i++; // Saltar el siguiente quote
          } else {
            inQuotes = false;
          }
        } else if (char === delimiter && !inQuotes) {
          result.push(trimValues ? current.trim() : current);
          current = '';
        } else {
          current += char;
        }
        i++;
      }
      
      result.push(trimValues ? current.trim() : current);
      return result;
    };
    
    // Parsear headers
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine).map((header, index) => {
      if (!header || header.trim() === '') {
        return `Columna_${index + 1}`;
      }
      return header.trim();
    });
    
    // Parsear datos
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (skipEmptyLines && line === '') {
        continue;
      }
      
      const values = parseCSVLine(line);
      
      // Verificar que la línea tenga datos válidos
      if (values.every(val => val === '')) {
        continue;
      }
      
      const row = {};
      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        // Intentar convertir números
        if (value !== '' && !isNaN(value) && !isNaN(parseFloat(value))) {
          row[header] = parseFloat(value);
        } else {
          row[header] = value;
        }
      });
      
      data.push(row);
    }
    
    const metadata = {
      headers,
      rowCount: data.length,
      columnCount: headers.length,
      delimiter,
      encoding: 'UTF-8'
    };
    
    return createParsingResult(true, data, null, metadata);
    
  } catch (error) {
    console.error('❌ Error parsing CSV file:', error);
    return createParsingResult(false, null, `Error procesando archivo CSV: ${error.message}`);
  }
};

/**
 * Función principal para parsear cualquier tipo de archivo
 * @param {File} file - Archivo a parsear
 * @param {object} options - Opciones de parsing
 * @returns {Promise<object>} - Resultado del parsing
 */
export const parseFile = async (file, options = {}) => {
  try {
    // Validar archivo
    const validation = validateFile(file);
    if (!validation.valid) {
      return createParsingResult(false, null, validation.error);
    }
    
    const fileType = validation.fileType;
    
    // Leer archivo como ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    const baseMetadata = {
      fileName: file.name,
      fileSize: file.size,
      fileType: fileType,
      lastModified: new Date(file.lastModified)
    };
    
    let result;
    
    switch (fileType) {
      case 'EXCEL':
        result = await parseExcelFile(arrayBuffer, options.excel);
        break;
        
      case 'CSV':
        const textContent = new TextDecoder('utf-8').decode(arrayBuffer);
        result = parseCSVFile(textContent, options.csv);
        break;
        
      default:
        return createParsingResult(
          false, 
          null, 
          `Tipo de archivo no soportado: ${fileType}`
        );
    }
    
    // Agregar metadata base al resultado
    if (result.success) {
      result.metadata = { ...baseMetadata, ...result.metadata };
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Error general parsing file:', error);
    return createParsingResult(
      false, 
      null, 
      `Error inesperado procesando archivo: ${error.message}`
    );
  }
};

/**
 * Función helper para obtener una vista previa de los datos
 * @param {array} data - Datos parseados
 * @param {number} limit - Número máximo de filas en la vista previa
 * @returns {object} - Vista previa y estadísticas
 */
export const getDataPreview = (data, limit = 10) => {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      preview: [],
      total: 0,
      headers: [],
      statistics: {}
    };
  }
  
  const headers = Object.keys(data[0]);
  const preview = data.slice(0, limit);
  
  // Calcular estadísticas básicas
  const statistics = {
    totalRows: data.length,
    totalColumns: headers.length,
    emptyFields: 0,
    dataTypes: {}
  };
  
  // Análisis de tipos de datos por columna
  headers.forEach(header => {
    const columnValues = data.map(row => row[header]).filter(val => val !== '' && val !== null && val !== undefined);
    
    if (columnValues.length === 0) {
      statistics.dataTypes[header] = 'empty';
      return;
    }
    
    const sampleValue = columnValues[0];
    
    if (sampleValue instanceof Date) {
      statistics.dataTypes[header] = 'date';
    } else if (typeof sampleValue === 'number') {
      statistics.dataTypes[header] = 'number';
    } else if (typeof sampleValue === 'boolean') {
      statistics.dataTypes[header] = 'boolean';
    } else {
      statistics.dataTypes[header] = 'text';
    }
  });
  
  return {
    preview,
    total: data.length,
    headers,
    statistics
  };
};

/**
 * Función para detectar posibles mapeos de columnas basado en nombres comunes
 * @param {array} headers - Headers del archivo
 * @returns {object} - Sugerencias de mapeo
 */
export const suggestColumnMapping = (headers) => {
  const mappingRules = {
    // Fecha
    fecha: ['fecha', 'date', 'dia', 'day', 'timestamp', 'created', 'creado'],
    
    // Cantidad
    cantidad: ['cantidad', 'qty', 'quantity', 'galones', 'litros', 'amount', 'volume'],
    
    // Vehículo
    vehiculo: ['vehiculo', 'vehicle', 'maquina', 'machine', 'equipo', 'equipment', 'codigo', 'code', 'id'],
    
    // Producto/Combustible
    producto: ['producto', 'product', 'combustible', 'fuel', 'articulo', 'item', 'tipo'],
    
    // Precio
    precio: ['precio', 'price', 'cost', 'costo', 'valor', 'value'],
    
    // Horómetro
    horometro: ['horometro', 'horas', 'hours', 'hour_meter', 'lectura'],
    
    // Ubicación
    ubicacion: ['ubicacion', 'location', 'lugar', 'place', 'destino', 'destination', 'origen', 'source'],
    
    // Descripción
    descripcion: ['descripcion', 'description', 'notes', 'notas', 'observaciones', 'comments']
  };
  
  const suggestions = {};
  
  // Normalizar headers para comparación
  const normalizedHeaders = headers.map(header => ({
    original: header,
    normalized: header.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')
  }));
  
  Object.entries(mappingRules).forEach(([fieldName, keywords]) => {
    let bestMatch = null;
    let bestScore = 0;
    
    normalizedHeaders.forEach(({ original, normalized }) => {
      keywords.forEach(keyword => {
        const score = calculateSimilarity(normalized, keyword);
        if (score > bestScore && score > 0.6) { // Umbral de similitud
          bestScore = score;
          bestMatch = original;
        }
      });
    });
    
    if (bestMatch) {
      suggestions[fieldName] = bestMatch;
    }
  });
  
  return suggestions;
};

/**
 * Calcular similitud entre dos strings (algoritmo simple)
 * @param {string} str1 - String 1
 * @param {string} str2 - String 2
 * @returns {number} - Score de similitud (0-1)
 */
const calculateSimilarity = (str1, str2) => {
  if (str1 === str2) return 1;
  if (str1.includes(str2) || str2.includes(str1)) return 0.8;
  
  // Algoritmo de distancia de Levenshtein simplificado
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1;
  
  const editDistance = calculateLevenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

/**
 * Calcular distancia de Levenshtein entre dos strings
 * @param {string} str1 - String 1
 * @param {string} str2 - String 2
 * @returns {number} - Distancia de edición
 */
const calculateLevenshteinDistance = (str1, str2) => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

export default {
  parseFile,
  getDataPreview,
  suggestColumnMapping,
  validateFile,
  detectFileType,
  SUPPORTED_FILE_TYPES
};