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
        
        default:
          return res.status(400).json({
            success: false,
            error: `Acción no reconocida: ${payload.action}`,
            availableActions: ['create_movement', 'test_connection']
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
