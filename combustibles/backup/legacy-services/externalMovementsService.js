/**
 * ExternalMovementsService - Servicio para manejar movimientos desde fuentes externas
 * Específicamente diseñado para integración con N8N/Telegram
 */

import { createMovement, MOVEMENT_TYPES } from './movementsService.js';

// Configuración del servicio externo
const EXTERNAL_CONFIG = {
  allowedSources: ['telegram', 'n8n', 'webhook', 'api'],
  telegramBotConfig: {
    allowedCommands: ['/entrada', '/stock', '/help'],
    maxQuantity: 5000, // Máximo galones por movimiento
    maxValue: 50000000, // Máximo valor en pesos colombianos
  },
  supportedLocations: [
    { key: 'principal', aliases: ['principal', 'main', 'sede'] },
    { key: 'austria', aliases: ['austria', 'at'] },
    { key: 'ilusion', aliases: ['ilusion', 'il'] },
    { key: 'deposito', aliases: ['deposito', 'dep', 'bodega'] },
  ],
  supportedFuelTypes: [
    { key: 'DIESEL', aliases: ['diesel', 'dsl', 'acpm'] },
    { key: 'GASOLINA', aliases: ['gasolina', 'gas', 'corriente'] },
    { key: 'EXTRA', aliases: ['extra', 'premium'] },
    { key: 'CORRIENTE', aliases: ['corriente', 'regular'] },
  ],
};

/**
 * Crear movimiento de entrada desde Telegram/N8N
 * @param {Object} externalData - Datos recibidos desde fuente externa
 * @param {Object} metadata - Metadatos de la fuente (usuario Telegram, etc.)
 * @returns {Promise<string>} - ID del movimiento creado
 */
export const createExternalMovement = async (externalData, metadata = {}) => {
  try {
    console.log('🤖 [EXTERNAL] Procesando movimiento externo:', externalData);
    console.log('🤖 [EXTERNAL] Metadata:', metadata);

    // Validar y normalizar datos
    const normalizedData = normalizeExternalData(externalData);

    // Validaciones específicas para fuentes externas
    validateExternalMovement(normalizedData, metadata);

    // Preparar datos para el servicio principal
    const movementData = prepareMovementDataForService(normalizedData, metadata);

    // Crear el movimiento usando el servicio principal
    const movementId = await createMovement(movementData);

    console.log('✅ [EXTERNAL] Movimiento externo creado exitosamente:', movementId);

    return movementId;
  } catch (error) {
    console.error('❌ [EXTERNAL] Error al crear movimiento externo:', error);
    throw new Error(`Error al procesar movimiento externo: ${error.message}`);
  }
};

/**
 * Normalizar datos recibidos desde fuentes externas
 */
export const normalizeExternalData = (data) => {
  console.log('🔧 [EXTERNAL] Normalizando datos externos...');

  const normalized = {
    // Tipo de movimiento (solo ENTRADA permitida desde externos)
    type: MOVEMENT_TYPES.ENTRADA,

    // Tipo de combustible normalizado
    fuelType: normalizeFuelType(data.fuelType || data.fuel || data.combustible),

    // Cantidad
    quantity: normalizeQuantity(data.quantity || data.cantidad || data.litros || data.galones),

    // Precio unitario
    unitPrice: normalizePrice(data.unitPrice || data.precio || data.precioUnitario),

    // Proveedor
    supplierName: normalizeSupplier(data.supplier || data.proveedor || data.supplierName),

    // Ubicación destino
    destinationLocation: normalizeLocation(data.location || data.destino || data.ubicacion),

    // Fecha efectiva
    effectiveDate: normalizeDate(data.date || data.fecha || data.effectiveDate),

    // Campos opcionales
    description: data.description || data.descripcion || null,
    reference: data.reference || data.referencia || data.factura || null,
    additionalComments: data.comments || data.comentarios || null,
  };

  console.log('✅ [EXTERNAL] Datos normalizados:', normalized);
  return normalized;
};

/**
 * Validar movimiento externo con reglas específicas
 */
export const validateExternalMovement = (data, metadata) => {
  console.log('🔍 [EXTERNAL] Validando movimiento externo...');

  const errors = [];

  // Validar fuente
  if (!metadata.source || !EXTERNAL_CONFIG.allowedSources.includes(metadata.source)) {
    errors.push(`Fuente no permitida: ${metadata.source}`);
  }

  // Validar límites de Telegram
  if (metadata.source === 'telegram') {
    if (data.quantity > EXTERNAL_CONFIG.telegramBotConfig.maxQuantity) {
      errors.push(
        `Cantidad excede el límite para Telegram: ${EXTERNAL_CONFIG.telegramBotConfig.maxQuantity} galones`
      );
    }

    const totalValue = data.quantity * data.unitPrice;
    if (totalValue > EXTERNAL_CONFIG.telegramBotConfig.maxValue) {
      errors.push(
        `Valor total excede el límite para Telegram: $${EXTERNAL_CONFIG.telegramBotConfig.maxValue}`
      );
    }
  }

  // Validar datos requeridos
  if (!data.fuelType) errors.push('Tipo de combustible requerido');
  if (!data.quantity || data.quantity <= 0) errors.push('Cantidad debe ser mayor a 0');
  if (!data.unitPrice || data.unitPrice < 0) errors.push('Precio unitario debe ser no negativo');
  if (!data.supplierName) errors.push('Proveedor requerido');
  if (!data.destinationLocation) errors.push('Ubicación destino requerida');

  if (errors.length > 0) {
    throw new Error(`Validación fallida: ${errors.join(', ')}`);
  }

  console.log('✅ [EXTERNAL] Validación exitosa');
};

/**
 * Preparar datos para el servicio principal de movimientos
 */
export const prepareMovementDataForService = (normalizedData, metadata) => {
  return {
    ...normalizedData,

    // Agregar metadatos de origen externo
    source: metadata.source || 'external',
    sourceDetails: {
      origin: metadata.source || 'external',
      telegramUserId: metadata.telegramUserId || null,
      telegramUsername: metadata.telegramUsername || null,
      telegramChatId: metadata.telegramChatId || null,
      n8nExecutionId: metadata.n8nExecutionId || null,
      webhookTimestamp: metadata.timestamp || new Date().toISOString(),
      createdVia: 'external_api',
    },

    // Descripción automática si no existe
    description:
      normalizedData.description ||
      `Entrada desde ${metadata.source || 'fuente externa'} - ${normalizedData.fuelType} (${normalizedData.quantity} gal)`,

    // Marcar como completado inmediatamente
    status: 'completado',
  };
};

/**
 * Normalizar tipo de combustible
 */
function normalizeFuelType(input) {
  if (!input) return null;

  const inputLower = input.toString().toLowerCase().trim();

  for (const fuelType of EXTERNAL_CONFIG.supportedFuelTypes) {
    if (fuelType.aliases.includes(inputLower)) {
      return fuelType.key;
    }
  }

  // Si no se encuentra, intentar normalización directa
  return input.toString().toUpperCase();
}

/**
 * Normalizar cantidad
 */
function normalizeQuantity(input) {
  if (!input) return null;

  const quantity = parseFloat(input.toString().replace(/[^\d.-]/g, ''));
  return isNaN(quantity) ? null : quantity;
}

/**
 * Normalizar precio
 */
function normalizePrice(input) {
  if (!input) return null;

  const price = parseFloat(input.toString().replace(/[^\d.-]/g, ''));
  return isNaN(price) ? null : price;
}

/**
 * Normalizar proveedor
 */
function normalizeSupplier(input) {
  if (!input) return null;

  return input.toString().trim();
}

/**
 * Normalizar ubicación
 */
function normalizeLocation(input) {
  if (!input) return 'principal'; // Default

  const inputLower = input.toString().toLowerCase().trim();

  for (const location of EXTERNAL_CONFIG.supportedLocations) {
    if (location.aliases.includes(inputLower)) {
      return location.key;
    }
  }

  return inputLower;
}

/**
 * Normalizar fecha
 */
function normalizeDate(input) {
  if (!input) return new Date();

  try {
    return new Date(input);
  } catch {
    return new Date();
  }
}

/**
 * Generar respuesta amigable para Telegram
 */
export const generateTelegramResponse = (movementId, movementData) => {
  const value = movementData.quantity * movementData.unitPrice;

  return {
    success: true,
    message: `✅ Entrada registrada exitosamente`,
    details: [
      `📥 **Movimiento:** ${movementId.substring(0, 8)}...`,
      `⛽ **Combustible:** ${movementData.fuelType}`,
      `📊 **Cantidad:** ${movementData.quantity} galones`,
      `💰 **Precio:** $${movementData.unitPrice.toLocaleString('es-CO')} por galón`,
      `🏪 **Proveedor:** ${movementData.supplierName}`,
      `📍 **Destino:** ${movementData.destinationLocation}`,
      `💵 **Valor Total:** $${value.toLocaleString('es-CO')}`,
    ].join('\n'),
    movementId,
    totalValue: value,
  };
};

/**
 * Obtener estadísticas de movimientos externos (para reportes)
 */
export const getExternalMovementsStats = async (timeframe = '24h') => {
  // Esta función podría implementarse para generar estadísticas
  // Por ahora retorna datos mock para el desarrollo
  return {
    timeframe,
    totalMovements: 0,
    totalValue: 0,
    bySource: {
      telegram: 0,
      n8n: 0,
      webhook: 0,
    },
    lastUpdated: new Date().toISOString(),
  };
};

export default {
  createExternalMovement,
  normalizeExternalData,
  validateExternalMovement,
  generateTelegramResponse,
  getExternalMovementsStats,
  EXTERNAL_CONFIG,
};
