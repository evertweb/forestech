/**
 * aliasService.js - Servicio para gestión de alias y mapeos dinámicos
 * Maneja la persistencia de mapeos entre nombres descriptivos y códigos del sistema
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc,
  updateDoc,
  // query, 
  // where,
  // orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'combustibles_migration_aliases';

/**
 * Tipos de alias soportados
 */
export const ALIAS_TYPES = {
  VEHICLE: 'vehicle',
  PRODUCT: 'product',
  LOCATION: 'location',
  SUPPLIER: 'supplier'
};

/**
 * Estructura de un documento de alias
 */
export const createAliasDocument = (type, mappings = {}, metadata = {}) => ({
  type,
  mappings,
  metadata: {
    totalMappings: Object.keys(mappings).length,
    lastUsed: null,
    usageCount: 0,
    ...metadata
  },
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
});

/**
 * Obtener todos los alias de un tipo específico
 * @param {string} aliasType - Tipo de alias (vehicle, product, etc.)
 * @returns {Promise<object>} - Documento de alias o null
 */
export const getAliasesByType = async (aliasType) => {
  try {
    if (!Object.values(ALIAS_TYPES).includes(aliasType)) {
      throw new Error(`Tipo de alias inválido: ${aliasType}`);
    }

    const aliasDocId = `${aliasType}_aliases`;
    const docRef = doc(db, COLLECTION_NAME, aliasDocId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate?.() || docSnap.data().createdAt,
        updatedAt: docSnap.data().updatedAt?.toDate?.() || docSnap.data().updatedAt,
        lastUsed: docSnap.data().metadata?.lastUsed?.toDate?.() || docSnap.data().metadata?.lastUsed
      };
    }

    return null;

  } catch (error) {
    console.error('❌ Error obteniendo alias:', error);
    throw new Error(`Error al obtener alias: ${error.message}`);
  }
};

/**
 * Crear o actualizar alias para un tipo específico
 * @param {string} aliasType - Tipo de alias
 * @param {object} newMappings - Nuevos mapeos a agregar/actualizar
 * @param {boolean} merge - Si debe fusionar con mapeos existentes (default: true)
 * @returns {Promise<void>}
 */
export const saveAliases = async (aliasType, newMappings, merge = true) => {
  try {
    if (!Object.values(ALIAS_TYPES).includes(aliasType)) {
      throw new Error(`Tipo de alias inválido: ${aliasType}`);
    }

    if (!newMappings || typeof newMappings !== 'object') {
      throw new Error('Los mapeos deben ser un objeto válido');
    }

    const aliasDocId = `${aliasType}_aliases`;
    const docRef = doc(db, COLLECTION_NAME, aliasDocId);

    if (merge) {
      // Obtener alias existentes
      const existingAliases = await getAliasesByType(aliasType);
      
      const finalMappings = existingAliases 
        ? { ...existingAliases.mappings, ...newMappings }
        : newMappings;

      const aliasDoc = createAliasDocument(aliasType, finalMappings, {
        totalMappings: Object.keys(finalMappings).length,
        lastUpdated: serverTimestamp(),
        usageCount: (existingAliases?.metadata?.usageCount || 0) + 1
      });

      await setDoc(docRef, aliasDoc, { merge: true });
    } else {
      // Sobrescribir completamente
      const aliasDoc = createAliasDocument(aliasType, newMappings);
      await setDoc(docRef, aliasDoc);
    }

    console.log(`✅ Alias ${aliasType} guardados exitosamente:`, Object.keys(newMappings).length, 'mapeos');

  } catch (error) {
    console.error('❌ Error guardando alias:', error);
    throw new Error(`Error al guardar alias: ${error.message}`);
  }
};

/**
 * Resolver un nombre usando alias existentes
 * @param {string} aliasType - Tipo de alias
 * @param {string} inputName - Nombre a resolver
 * @returns {Promise<string|null>} - Nombre resuelto o null si no se encuentra
 */
export const resolveAlias = async (aliasType, inputName) => {
  try {
    if (!inputName || typeof inputName !== 'string') {
      return null;
    }

    const aliases = await getAliasesByType(aliasType);
    if (!aliases || !aliases.mappings) {
      return null;
    }

    // Búsqueda exacta
    const exactMatch = aliases.mappings[inputName];
    if (exactMatch) {
      return exactMatch;
    }

    // Búsqueda case-insensitive
    const lowerInput = inputName.toLowerCase().trim();
    for (const [key, value] of Object.entries(aliases.mappings)) {
      if (key.toLowerCase().trim() === lowerInput) {
        return value;
      }
    }

    // Búsqueda fuzzy (contiene)
    for (const [key, value] of Object.entries(aliases.mappings)) {
      const lowerKey = key.toLowerCase().trim();
      if (lowerKey.includes(lowerInput) || lowerInput.includes(lowerKey)) {
        return value;
      }
    }

    return null;

  } catch (error) {
    console.error('❌ Error resolviendo alias:', error);
    return null;
  }
};

/**
 * Obtener sugerencias de mapeo basadas en datos existentes en el sistema
 * @param {string} aliasType - Tipo de alias
 * @param {array} inputNames - Nombres del archivo a mapear
 * @returns {Promise<object>} - Sugerencias de mapeo
 */
export const getSuggestedMappings = async (aliasType, inputNames) => {
  try {
    const suggestions = {};
    const existingData = await getExistingDataByType(aliasType);
    const _aliases = await getAliasesByType(aliasType);

    for (const inputName of inputNames) {
      // 1. Verificar si ya existe un alias
      const existingAlias = await resolveAlias(aliasType, inputName);
      if (existingAlias) {
        suggestions[inputName] = {
          suggested: existingAlias,
          confidence: 1.0,
          source: 'alias',
          alternatives: []
        };
        continue;
      }

      // 2. Buscar coincidencias directas en datos existentes
      const directMatch = findDirectMatch(inputName, existingData);
      if (directMatch) {
        suggestions[inputName] = {
          suggested: directMatch.id,
          confidence: directMatch.confidence,
          source: 'direct',
          alternatives: []
        };
        continue;
      }

      // 3. Buscar coincidencias aproximadas
      const fuzzyMatches = findFuzzyMatches(inputName, existingData, 3);
      if (fuzzyMatches.length > 0) {
        suggestions[inputName] = {
          suggested: fuzzyMatches[0].id,
          confidence: fuzzyMatches[0].confidence,
          source: 'fuzzy',
          alternatives: fuzzyMatches.slice(1)
        };
        continue;
      }

      // 4. No se encontró coincidencia
      suggestions[inputName] = {
        suggested: null,
        confidence: 0,
        source: 'none',
        alternatives: [],
        requiresManualMapping: true
      };
    }

    return suggestions;

  } catch (error) {
    console.error('❌ Error obteniendo sugerencias:', error);
    throw new Error(`Error al obtener sugerencias: ${error.message}`);
  }
};

/**
 * Registrar uso de alias (actualizar metadata)
 * @param {string} aliasType - Tipo de alias
 * @returns {Promise<void>}
 */
export const recordAliasUsage = async (aliasType) => {
  try {
    const aliasDocId = `${aliasType}_aliases`;
    const docRef = doc(db, COLLECTION_NAME, aliasDocId);

    await updateDoc(docRef, {
      'metadata.lastUsed': serverTimestamp(),
      'metadata.usageCount': (await getDoc(docRef)).data()?.metadata?.usageCount + 1 || 1,
      updatedAt: serverTimestamp()
    });

  } catch (error) {
    console.error('❌ Error registrando uso de alias:', error);
    // No lanzar error ya que es solo metadata
  }
};

/**
 * Limpiar alias no utilizados
 * @param {string} aliasType - Tipo de alias
 * @param {number} daysUnused - Días sin uso para considerar limpieza
 * @returns {Promise<number>} - Número de alias eliminados
 */
export const cleanupUnusedAliases = async (aliasType, _daysUnused = 90) => {
  try {
    const aliases = await getAliasesByType(aliasType);
    if (!aliases || !aliases.mappings) {
      return 0;
    }

    const existingData = await getExistingDataByType(aliasType);
    const existingIds = new Set(existingData.map(item => item.id));

    let cleanedCount = 0;
    const cleanedMappings = {};

    for (const [key, value] of Object.entries(aliases.mappings)) {
      // Mantener alias que apuntan a datos existentes
      if (existingIds.has(value)) {
        cleanedMappings[key] = value;
      } else {
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      await saveAliases(aliasType, cleanedMappings, false);
      console.log(`🧹 Limpieza completada: ${cleanedCount} alias eliminados para ${aliasType}`);
    }

    return cleanedCount;

  } catch (error) {
    console.error('❌ Error en limpieza de alias:', error);
    return 0;
  }
};

/**
 * Exportar alias para backup
 * @param {string} aliasType - Tipo de alias (opcional, si no se especifica exporta todos)
 * @returns {Promise<object>} - Datos de alias para backup
 */
export const exportAliases = async (aliasType = null) => {
  try {
    const exportData = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      aliases: {}
    };

    const typesToExport = aliasType ? [aliasType] : Object.values(ALIAS_TYPES);

    for (const type of typesToExport) {
      const aliases = await getAliasesByType(type);
      if (aliases) {
        exportData.aliases[type] = aliases;
      }
    }

    return exportData;

  } catch (error) {
    console.error('❌ Error exportando alias:', error);
    throw new Error(`Error al exportar alias: ${error.message}`);
  }
};

/**
 * Importar alias desde backup
 * @param {object} backupData - Datos de backup
 * @param {boolean} merge - Si debe fusionar con datos existentes
 * @returns {Promise<number>} - Número de tipos de alias importados
 */
export const importAliases = async (backupData, merge = true) => {
  try {
    if (!backupData || !backupData.aliases) {
      throw new Error('Formato de backup inválido');
    }

    let importedCount = 0;

    for (const [type, aliasData] of Object.entries(backupData.aliases)) {
      if (Object.values(ALIAS_TYPES).includes(type) && aliasData.mappings) {
        await saveAliases(type, aliasData.mappings, merge);
        importedCount++;
      }
    }

    console.log(`📥 Importación completada: ${importedCount} tipos de alias importados`);
    return importedCount;

  } catch (error) {
    console.error('❌ Error importando alias:', error);
    throw new Error(`Error al importar alias: ${error.message}`);
  }
};

// ============ FUNCIONES AUXILIARES ============

/**
 * Obtener datos existentes del sistema por tipo
 * @param {string} aliasType - Tipo de alias
 * @returns {Promise<array>} - Array de datos existentes
 */
const getExistingDataByType = async (aliasType) => {
  try {
    let collectionName;
    let fieldsToGet = ['id'];

    switch (aliasType) {
      case ALIAS_TYPES.VEHICLE:
        collectionName = 'combustibles_vehicles';
        fieldsToGet = ['vehicleId', 'name'];
        break;
      case ALIAS_TYPES.PRODUCT:
        collectionName = 'combustibles_products';
        fieldsToGet = ['name', 'displayName'];
        break;
      case ALIAS_TYPES.LOCATION:
        // Las ubicaciones están definidas en constantes, no en Firestore
        return [
          { id: 'principal', name: 'Principal' },
          { id: 'bodega_austria', name: 'Bodega Austria' },
          { id: 'bodega_ilusion', name: 'Bodega Ilusión' },
          { id: 'campo_operativo', name: 'Campo Operativo' },
          { id: 'estacion_movil', name: 'Estación Móvil' }
        ];
      case ALIAS_TYPES.SUPPLIER:
        collectionName = 'combustibles_suppliers';
        fieldsToGet = ['name', 'displayName'];
        break;
      default:
        return [];
    }

    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const item = { id: doc.id };

      fieldsToGet.forEach(field => {
        if (docData[field]) {
          item[field] = docData[field];
        }
      });

      // Para vehículos, usar vehicleId como identificador principal
      if (aliasType === ALIAS_TYPES.VEHICLE && docData.vehicleId) {
        item.id = docData.vehicleId;
        item.displayName = `${docData.vehicleId} - ${docData.name || 'Sin nombre'}`;
      }

      data.push(item);
    });

    return data;

  } catch (error) {
    console.error('❌ Error obteniendo datos existentes:', error);
    return [];
  }
};

/**
 * Buscar coincidencia directa
 * @param {string} inputName - Nombre a buscar
 * @param {array} existingData - Datos existentes
 * @returns {object|null} - Coincidencia directa o null
 */
const findDirectMatch = (inputName, existingData) => {
  const lowerInput = inputName.toLowerCase().trim();

  for (const item of existingData) {
    // Verificar coincidencia exacta con ID
    if (item.id.toLowerCase() === lowerInput) {
      return { id: item.id, confidence: 1.0 };
    }

    // Verificar coincidencia exacta con nombre
    if (item.name && item.name.toLowerCase().trim() === lowerInput) {
      return { id: item.id, confidence: 0.95 };
    }

    // Verificar coincidencia exacta con displayName
    if (item.displayName && item.displayName.toLowerCase().trim() === lowerInput) {
      return { id: item.id, confidence: 0.95 };
    }
  }

  return null;
};

/**
 * Buscar coincidencias aproximadas (fuzzy matching)
 * @param {string} inputName - Nombre a buscar
 * @param {array} existingData - Datos existentes
 * @param {number} maxResults - Máximo número de resultados
 * @returns {array} - Array de coincidencias ordenadas por confianza
 */
const findFuzzyMatches = (inputName, existingData, maxResults = 5) => {
  const matches = [];
  const lowerInput = inputName.toLowerCase().trim();

  for (const item of existingData) {
    const fieldsToCheck = [item.id, item.name, item.displayName].filter(Boolean);

    for (const field of fieldsToCheck) {
      const lowerField = field.toLowerCase().trim();
      
      // Contiene la palabra
      if (lowerField.includes(lowerInput) || lowerInput.includes(lowerField)) {
        const confidence = Math.max(
          lowerInput.length / lowerField.length,
          lowerField.length / lowerInput.length
        ) * 0.8;

        matches.push({ id: item.id, confidence, matchedField: field });
        break; // Solo agregar una vez por item
      }
    }
  }

  return matches
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, maxResults);
};

export default {
  getAliasesByType,
  saveAliases,
  resolveAlias,
  getSuggestedMappings,
  recordAliasUsage,
  cleanupUnusedAliases,
  exportAliases,
  importAliases,
  ALIAS_TYPES
};