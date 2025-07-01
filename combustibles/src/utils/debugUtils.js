/**
 * Utilidades de depuración para el sistema de combustibles
 * Ayuda a identificar y resolver problemas comunes de datos
 */

/**
 * Inspecciona y normaliza el objeto de inventario para asegurar consistencia
 * @param {Object} item - Item de inventario a inspeccionar
 * @returns {Object} Item normalizado
 */
export const normalizeInventoryItem = (item) => {
  if (!item) return {};

  // Asegurar que los campos críticos estén presentes y normalizados
  const normalized = { ...item };

  // Convertir explícitamente a números para evitar problemas de tipo
  normalized.currentStock = parseFloat(item.currentStock) || 0;
  normalized.pricePerUnit = parseFloat(item.pricePerUnit || item.unitPrice) || 0;
  normalized.maxCapacity = parseFloat(item.maxCapacity || item.capacity) || 0;
  normalized.minThreshold = parseFloat(item.minThreshold || item.minStock) || 0;

  // ✅ NORMALIZAR CAMPO DE ESTADO: isActive vs status
  if (item.isActive !== undefined && !item.status) {
    normalized.status = item.isActive ? 'active' : 'inactive';
    console.warn(`⚠️ Migrando campo obsoleto: isActive=${item.isActive} → status=${normalized.status} para ${item.fuelType || 'item'}`);
  }

  // Eliminar campos ambiguos si existen los correctos
  if (normalized.pricePerUnit && normalized.unitPrice && normalized.pricePerUnit !== normalized.unitPrice) {
    console.warn(`❌ Inconsistencia en precios: ${normalized.pricePerUnit} vs ${normalized.unitPrice} para ${item.fuelType || 'item'}`);
  }

  if (normalized.maxCapacity && normalized.capacity && normalized.maxCapacity !== normalized.capacity) {
    console.warn(`❌ Inconsistencia en capacidad: ${normalized.maxCapacity} vs ${normalized.capacity} para ${item.fuelType || 'item'}`);
  }

  // ✅ VALIDAR ESTADO FINAL
  if (!normalized.status) {
    normalized.status = 'active'; // Default seguro
    console.warn(`⚠️ Campo status faltante, asignando 'active' por defecto para ${item.fuelType || 'item'}`);
  }

  return normalized;
};

/**
 * Log detallado del estado actual del inventario
 * @param {Array} inventoryItems - Items del inventario
 */
export const logInventoryState = (inventoryItems = []) => {
  if (!Array.isArray(inventoryItems) || inventoryItems.length === 0) {
    console.warn('📋 Inventario vacío o no válido');
    return;
  }

  console.group('📋 Estado Actual del Inventario');
  console.log(`Total de items: ${inventoryItems.length}`);

  const totalStock = inventoryItems.reduce((sum, item) => sum + (parseFloat(item.currentStock) || 0), 0);
  console.log(`Stock total: ${totalStock.toFixed(2)} galones`);

  const itemsConProblemas = inventoryItems.filter(item => {
    return typeof item.currentStock === 'undefined' || 
           isNaN(parseFloat(item.currentStock)) ||
           (item.currentStock !== item.quantity && typeof item.quantity !== 'undefined');
  });

  if (itemsConProblemas.length > 0) {
    console.warn(`⚠️ ${itemsConProblemas.length} items con posibles problemas de datos:`);
    itemsConProblemas.forEach(item => {
      console.warn(`- ${item.fuelType || item.name || 'Item sin nombre'}: currentStock=${item.currentStock}, quantity=${item.quantity}`);
    });
  }

  // Agrupar por tipo de combustible
  const porTipo = {};
  inventoryItems.forEach(item => {
    const tipo = item.fuelType || 'Desconocido';
    if (!porTipo[tipo]) porTipo[tipo] = 0;
    porTipo[tipo] += parseFloat(item.currentStock) || 0;
  });

  console.log('Stock por tipo de combustible:');
  Object.entries(porTipo).forEach(([tipo, cantidad]) => {
    console.log(`- ${tipo}: ${cantidad.toFixed(2)} gal`);
  });

  console.groupEnd();
};

/**
 * Verifica si hay duplicaciones en el inventario
 * @param {Array} inventoryItems - Items de inventario
 * @returns {Array} Items potencialmente duplicados
 */
export const findDuplicateItems = (inventoryItems = []) => {
  if (!Array.isArray(inventoryItems) || inventoryItems.length === 0) {
    return [];
  }

  // Buscar items con el mismo tipo y ubicación
  const tipoUbicacionMap = {};
  const duplicados = [];

  inventoryItems.forEach(item => {
    const key = `${item.fuelType || ''}:${item.location || ''}`;
    if (!tipoUbicacionMap[key]) {
      tipoUbicacionMap[key] = [item];
    } else {
      tipoUbicacionMap[key].push(item);
      // Si ya hay más de uno, todos son potenciales duplicados
      if (tipoUbicacionMap[key].length === 2) {
        duplicados.push(...tipoUbicacionMap[key]);
      } else if (tipoUbicacionMap[key].length > 2) {
        duplicados.push(item);
      }
    }
  });

  return duplicados;
};

/**
 * Exportar todas las funciones
 */
export default {
  normalizeInventoryItem,
  logInventoryState,
  findDuplicateItems
};
