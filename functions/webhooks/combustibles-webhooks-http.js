/**
 * Webhook HTTP para recibir movimientos desde N8N/Telegram
 * Permite crear movimientos tipo ENTRADA desde fuentes externas
 */

import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Inicializar Firebase Admin (solo si no está ya inicializado)
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();
const auth = getAuth();

// Configuración del webhook
const WEBHOOK_CONFIG = {
  allowedOrigins: [
    'https://n8n.forestechdecolombia.com.co',
    'https://forestechdecolombia.com.co'
  ],
  secretToken: process.env.WEBHOOK_SECRET_TOKEN || 'forestech_webhook_2024',
  maxBodySize: 10 * 1024 * 1024, // 10MB
};

/**
 * Endpoint principal para recibir movimientos desde N8N
 */
export const combustiblesWebhookReceiver = onRequest(
  {
    region: 'us-central1',
    timeoutSeconds: 60,
    memory: '512MiB',
    maxInstances: 5,
    cors: true,
  },
  async (req, res) => {
    console.log('🚀 [WEBHOOK] Recibiendo request:', req.method, req.url);
    
    try {
      // Validar método HTTP
      if (req.method !== 'POST') {
        return res.status(405).json({
          success: false,
          error: 'Método no permitido. Solo POST es aceptado.',
          allowedMethods: ['POST']
        });
      }

      // Validar Content-Type
      if (!req.headers['content-type']?.includes('application/json')) {
        return res.status(400).json({
          success: false,
          error: 'Content-Type debe ser application/json'
        });
      }

      // Validar autenticación por token
      const authToken = req.headers['authorization'] || req.headers['x-webhook-token'];
      if (!authToken || authToken !== `Bearer ${WEBHOOK_CONFIG.secretToken}`) {
        console.warn('🔒 [WEBHOOK] Token de autenticación inválido');
        return res.status(401).json({
          success: false,
          error: 'Token de autenticación requerido o inválido'
        });
      }

      // Procesar el cuerpo de la petición
      const payload = req.body;
      console.log('📦 [WEBHOOK] Payload recibido:', JSON.stringify(payload, null, 2));

      // Validar estructura básica del payload
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Payload inválido. Se esperaba un objeto JSON.'
        });
      }

      // Procesar según el tipo de acción
      switch (payload.action) {
        case 'create_movement':
          return await handleCreateMovement(req, res, payload);
        
        case 'test_connection':
          return await handleTestConnection(req, res, payload);
        
        // Telegram Router - Fase 1
        case 'start_wizard':
        case 'continue':
          return await handleTelegramRoute(req, res, payload);
        
        case 'login_init':
          return await handleLoginInit(req, res, payload);
        
        default:
          return res.status(400).json({
            success: false,
            error: `Acción no reconocida: ${payload.action}`,
            availableActions: ['create_movement', 'test_connection', 'start_wizard', 'continue', 'login_init']
          });
      }

    } catch (error) {
      console.error('❌ [WEBHOOK] Error general:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * Router Telegram - Manejo de sesión y pasos del asistente (Fase 1: ENTRADA)
 */
async function handleTelegramRoute(req, res, payload) {
  const { telegramData = {}, session = {}, input = {} } = payload;
  const chatId = telegramData.chatId || session.chatId;
  if (!chatId) {
    return res.status(400).json({ success: false, error: 'chatId requerido' });
  }

  // Cargar/crear sesión
  const sessionRef = db.collection('telegram_sessions').doc(String(chatId));
  const snap = await sessionRef.get();
  const now = Date.now();
  let state = snap.exists ? snap.data() : {
    chatId,
    user: telegramData.username || telegramData.userId || 'anon',
    step: null,
    type: null,
    draft: {},
    createdAt: new Date(now).toISOString(),
  };

  // Inicializar wizard
  if (payload.action === 'start_wizard') {
    // Fase 1: solo ENTRADA
    state = { ...state, step: 1, type: 'ENTRADA', draft: {} };
    await sessionRef.set(state, { merge: true });
    return res.json(
      buildTelegramMessage(chatId, 'Selecciona el combustible:', {
        inline_keyboard: [[
          { text: 'DIESEL', callback_data: 'fuel:DIESEL' },
          { text: 'GASOLINA', callback_data: 'fuel:GASOLINA' },
        ], [
          { text: 'EXTRA', callback_data: 'fuel:EXTRA' },
          { text: 'CORRIENTE', callback_data: 'fuel:CORRIENTE' },
        ]]
      })
    );
  }

  // Continuar flujo
  const text = (input.text || '').trim();
  const callback = input.callback || '';
  if (callback.startsWith('fuel:')) {
    const fuel = callback.split(':')[1];
    state.draft.fuelType = fuel;
    state.step = 2;
    await sessionRef.set(state, { merge: true });
    return res.json(
      buildTelegramMessage(chatId, 'Ingresa el proveedor (ej: Shell Colombia):')
    );
  }

  // Paso 2: proveedor
  if (state.step === 2 && text) {
    state.draft.supplierName = text;
    state.step = 3;
    await sessionRef.set(state, { merge: true });
    return res.json(
      buildTelegramMessage(chatId, 'Selecciona la ubicación de destino:', {
        inline_keyboard: [[
          { text: 'principal', callback_data: 'dest:principal' },
          { text: 'austria', callback_data: 'dest:austria' },
        ], [
          { text: 'ilusion', callback_data: 'dest:ilusion' },
          { text: 'deposito', callback_data: 'dest:deposito' },
        ]]
      })
    );
  }

  if (callback.startsWith('dest:')) {
    const dest = callback.split(':')[1];
    state.draft.destinationLocation = dest;
    state.step = 4;
    await sessionRef.set(state, { merge: true });
    return res.json(buildTelegramMessage(chatId, 'Ingresa la cantidad en galones (ej: 500):'));
  }

  if (state.step === 4 && text) {
    const q = parseFloat(text.replace(/[^\d.\-]/g, ''));
    if (!q || q <= 0) {
      return res.json(buildTelegramMessage(chatId, 'Cantidad inválida. Ingresa un número > 0:'));
    }
    state.draft.quantity = q;
    state.step = 5;
    await sessionRef.set(state, { merge: true });
    return res.json(buildTelegramMessage(chatId, 'Ingresa el precio unitario (ej: 15000):'));
  }

  if (state.step === 5 && text) {
    const p = parseFloat(text.replace(/[^\d.\-]/g, ''));
    if (p < 0 || isNaN(p)) {
      return res.json(buildTelegramMessage(chatId, 'Precio inválido. Ingresa un número >= 0:'));
    }
    state.draft.unitPrice = p;
    state.step = 6;
    await sessionRef.set(state, { merge: true });

    // Resumen + confirmar
    const d = state.draft;
    const total = d.quantity * d.unitPrice;
    const summary = [
      'Revisa y confirma:',
      `• Tipo: ENTRADA`,
      `• Combustible: ${d.fuelType}`,
      `• Proveedor: ${d.supplierName}`,
      `• Destino: ${d.destinationLocation}`,
      `• Cantidad: ${d.quantity} gal`,
      `• Precio: $${p.toLocaleString('es-CO')}`,
      `• Total: $${total.toLocaleString('es-CO')}`,
    ].join('\n');

    return res.json(
      buildTelegramMessage(chatId, summary, {
        inline_keyboard: [[
          { text: '✅ Confirmar', callback_data: 'confirm:yes' },
          { text: '❌ Cancelar', callback_data: 'confirm:no' },
        ]]
      })
    );
  }

  if (callback === 'confirm:no') {
    await sessionRef.delete();
    return res.json(buildTelegramMessage(chatId, 'Operación cancelada. Usa /entrada para iniciar de nuevo.'));
  }

  if (callback === 'confirm:yes') {
    // Validar y crear movimiento vía pipeline existente
    const d = state.draft;
    const payloadToCreate = {
      action: 'create_movement',
      movementData: {
        type: 'entrada',
        fuelType: d.fuelType,
        quantity: d.quantity,
        unitPrice: d.unitPrice,
        supplierName: d.supplierName,
        destinationLocation: d.destinationLocation,
        description: `Entrada desde Telegram (@${state.user})`,
      },
      source: 'telegram',
      telegramUserId: telegramData.userId,
      telegramUsername: telegramData.username,
      telegramChatId: chatId,
    };

    // Reutilizar validación y creación locales
    const validation = validateMovementData(payloadToCreate.movementData);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, error: 'Datos inválidos', details: validation.errors });
    }

    const movementId = await createMovementWithTransaction(
      prepareMovementData(payloadToCreate.movementData, 'telegram')
    );

    await sessionRef.delete();

    return res.json(
      buildTelegramMessage(
        chatId,
        `✅ Movimiento creado: ${movementId.substring(0, 8)}...\nGracias. Usa /help para más opciones.`
      )
    );
  }

  // Entrada no reconocida
  return res.json(buildTelegramMessage(chatId, 'No entendí. Usa /help o /entrada para iniciar.'));
}

/**
 * Generar mensaje Telegram compatible con nodo N8N 'Mensaje'
 */
function buildTelegramMessage(chatId, text, replyMarkup) {
  const body = { chatId, message: text };
  if (replyMarkup) body.reply_markup = replyMarkup;
  return { success: true, action: 'send_message', ...body };
}

/**
 * Inicio de login: genera un one-time-code para vincular Telegram ↔ usuario
 */
async function handleLoginInit(req, res, payload) {
  const { telegramData = {} } = payload;
  const chatId = telegramData.chatId;
  if (!chatId) return res.status(400).json({ success: false, error: 'chatId requerido' });

  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  const docRef = db.collection('telegram_link_codes').doc(code);
  await docRef.set({
    chatId,
    telegram: telegramData,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    used: false,
  });

  const instructions = [
    '🔐 Vinculación de cuenta',
    '1) Ve a la web y entra con tu usuario',
    '2) Abre "Vincular Telegram"',
    `3) Ingresa este código: ${code}`,
    'El código expira en 10 minutos.'
  ].join('\n');

  return res.json(buildTelegramMessage(chatId, instructions));
}

/**
 * Manejar creación de movimientos
 */
async function handleCreateMovement(req, res, payload) {
  try {
    console.log('🔧 [WEBHOOK] Procesando creación de movimiento...');

    // Validar datos del movimiento
    const validationResult = validateMovementData(payload.movementData);
    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Datos de movimiento inválidos',
        details: validationResult.errors,
        receivedData: payload.movementData
      });
    }

    // Preparar datos del movimiento para Firestore
    const movementData = prepareMovementData(payload.movementData, payload.source);
    
    // Crear el movimiento usando transacción
    const movementId = await createMovementWithTransaction(movementData);

    console.log('✅ [WEBHOOK] Movimiento creado exitosamente:', movementId);

    // Respuesta exitosa
    return res.status(201).json({
      success: true,
      movementId,
      message: 'Movimiento creado exitosamente',
      data: {
        type: movementData.type,
        fuelType: movementData.fuelType,
        quantity: movementData.quantity,
        supplierName: movementData.supplierName,
        destinationLocation: movementData.destinationLocation,
        totalValue: movementData.totalValue
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [WEBHOOK] Error al crear movimiento:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al crear el movimiento',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Manejar test de conexión
 */
async function handleTestConnection(req, res, payload) {
  console.log('🧪 [WEBHOOK] Test de conexión recibido');
  
  return res.status(200).json({
    success: true,
    message: 'Conexión exitosa con webhook de combustibles',
    timestamp: new Date().toISOString(),
    source: payload.source || 'unknown',
    version: '1.0.0'
  });
}

/**
 * Validar datos del movimiento
 */
function validateMovementData(data) {
  const errors = [];
  
  // Campos requeridos para ENTRADA
  const requiredFields = [
    'type',
    'fuelType', 
    'quantity',
    'unitPrice',
    'supplierName',
    'destinationLocation'
  ];

  for (const field of requiredFields) {
    if (!data || !data[field]) {
      errors.push(`Campo requerido faltante: ${field}`);
    }
  }

  // Validaciones específicas
  if (data.type && data.type !== 'entrada') {
    errors.push('Solo se permiten movimientos tipo "entrada" desde webhook');
  }

  if (data.quantity && (isNaN(data.quantity) || parseFloat(data.quantity) <= 0)) {
    errors.push('La cantidad debe ser un número mayor a 0');
  }

  if (data.unitPrice && (isNaN(data.unitPrice) || parseFloat(data.unitPrice) < 0)) {
    errors.push('El precio unitario debe ser un número no negativo');
  }

  // Validar tipos de combustible permitidos
  const allowedFuelTypes = ['DIESEL', 'GASOLINA', 'EXTRA', 'CORRIENTE'];
  if (data.fuelType && !allowedFuelTypes.includes(data.fuelType.toUpperCase())) {
    errors.push(`Tipo de combustible inválido. Permitidos: ${allowedFuelTypes.join(', ')}`);
  }

  // Validar ubicaciones permitidas (ubicaciones operacionales conocidas)
  const allowedLocations = ['principal', 'austria', 'ilusion', 'deposito'];
  if (data.destinationLocation && !allowedLocations.includes(data.destinationLocation.toLowerCase())) {
    errors.push(`Ubicación destino inválida. Permitidas: ${allowedLocations.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Preparar datos del movimiento para Firestore
 */
function prepareMovementData(data, source = 'webhook') {
  const now = new Date();
  
  return {
    // Campos principales
    type: 'entrada',
    fuelType: data.fuelType.toUpperCase(),
    quantity: parseFloat(data.quantity),
    unitPrice: parseFloat(data.unitPrice),
    totalValue: parseFloat(data.quantity) * parseFloat(data.unitPrice),
    
    // Ubicaciones
    supplierName: data.supplierName,
    destinationLocation: data.destinationLocation.toLowerCase(),
    
    // Fechas
    effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : now,
    createdAt: now,
    updatedAt: now,
    approvedAt: now,
    
    // Estado
    status: 'completado',
    
    // Campos opcionales
    description: data.description || `Entrada desde ${source}`,
    reference: data.reference || null,
    additionalComments: data.additionalComments || null,
    
    // Metadatos de origen
    source: source,
    sourceDetails: {
      origin: source,
      telegramUserId: data.telegramUserId || null,
      telegramUsername: data.telegramUsername || null,
      n8nExecutionId: data.n8nExecutionId || null,
      createdVia: 'webhook'
    }
  };
}

/**
 * Crear movimiento con transacción (incluye actualización de inventario)
 */
async function createMovementWithTransaction(movementData) {
  return await db.runTransaction(async (transaction) => {
    // 1. Crear el documento del movimiento
    const movementRef = db.collection('combustibles_movements').doc();
    transaction.set(movementRef, movementData);
    
    // 2. Actualizar inventario
    await updateInventoryFromMovement(transaction, movementData, movementRef.id);
    
    return movementRef.id;
  });
}

/**
 * Actualizar inventario desde movimiento (solo ENTRADA)
 */
async function updateInventoryFromMovement(transaction, movement, movementId) {
  const targetLocation = movement.destinationLocation;
  
  // Buscar inventario existente
  const inventoryQuery = db.collection('combustibles_inventory')
    .where('fuelType', '==', movement.fuelType)
    .where('location', '==', targetLocation)
    .where('status', '==', 'active');
    
  const inventorySnapshot = await inventoryQuery.get();
  
  if (inventorySnapshot.empty) {
    // Crear nuevo inventario
    const inventoryRef = db.collection('combustibles_inventory').doc();
    const newInventoryData = {
      fuelType: movement.fuelType,
      location: targetLocation,
      name: movement.fuelType,
      maxCapacity: 1000,
      currentStock: movement.quantity,
      minThreshold: 150,
      pricePerUnit: movement.unitPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      lastMovement: {
        movementId,
        type: movement.type,
        quantity: movement.quantity,
        date: new Date(),
      },
    };
    
    transaction.set(inventoryRef, newInventoryData);
    console.log(`📦 [WEBHOOK] Inventario creado para ${movement.fuelType} en ${targetLocation}`);
  } else {
    // Actualizar inventario existente
    const inventoryDoc = inventorySnapshot.docs[0];
    const currentData = inventoryDoc.data();
    const currentStock = parseFloat(currentData.currentStock) || 0;
    const newStock = currentStock + movement.quantity;
    
    const updateData = {
      currentStock: Math.round(newStock * 100) / 100, // Redondear a 2 decimales
      pricePerUnit: movement.unitPrice,
      updatedAt: new Date(),
      lastMovement: {
        movementId,
        type: movement.type,
        quantity: movement.quantity,
        date: new Date(),
      },
    };
    
    transaction.update(inventoryDoc.ref, updateData);
    console.log(`📦 [WEBHOOK] Inventario actualizado: ${currentStock} + ${movement.quantity} = ${newStock}`);
  }
}
