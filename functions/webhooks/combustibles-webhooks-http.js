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

// Ubicaciones de almacenamiento para destinos de ENTRADA (igual que en la web)
const STORAGE_LOCATIONS = [
  'bodega austria',
  'bodega principal',
  'tanque 1',
  'tanque 2',
  'bodega temporal'
];

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

        case 'cancel':
        case 'logout':
          return await handleTelegramRoute(req, res, payload);
        
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
 * Guardar estado de forma segura evitando undefined en Firestore
 */
function saveStateToFirestore(sessionRef, state) {
  // Limpiar valores undefined que causan errores en Firestore
  const cleanState = JSON.parse(JSON.stringify(state, (key, value) => {
    return value === undefined ? null : value;
  }));
  
  return sessionRef.set(cleanState, { merge: true });
}

/**
 * Verificar si el usuario está logueado
 */
async function checkUserLoginStatus(chatId) {
  try {
    // Buscar usuario vinculado por chatId
    const usersQuery = db.collection('users')
      .where('telegram.chatId', '==', chatId);
    
    const snapshot = await usersQuery.get();
    
    if (snapshot.empty) {
      return { isLoggedIn: false, user: null };
    }
    
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    
    return {
      isLoggedIn: true,
      user: {
        id: userDoc.id,
        name: userData.name || userData.email,
        telegram: userData.telegram
      }
    };
  } catch (error) {
    console.error('❌ Error checking login status:', error);
    return { isLoggedIn: false, user: null };
  }
}

/**
 * Router Telegram - Manejo de sesión y pasos del asistente (Fase 2: Conversacional)
 */
async function handleTelegramRoute(req, res, payload) {
  const { telegramData = {}, session = {}, input = {} } = payload;
  const chatId = telegramData.chatId || session.chatId;
  if (!chatId) {
    return res.status(400).json({ success: false, error: 'chatId requerido' });
  }
  
  // Cargar/crear sesión
  const sessionRef = db.collection('telegram_sessions').doc(String(chatId));
  
  // Cancelar sesión/proceso
  if (payload.action === 'cancel' || payload.action === 'logout' || input.callback === 'nav:cancel') {
    await sessionRef.delete();
    return res.json(buildTelegramMessage(chatId, '👋 Operación cancelada.\n\nUsa /start para ver las opciones principales.'));
  }
  
  // Verificar estado de login
  const loginStatus = await checkUserLoginStatus(chatId);
  
  const snap = await sessionRef.get();
  const now = Date.now();
  let state = snap.exists ? snap.data() : {
    chatId,
    user: telegramData.username || telegramData.userId || 'anon',
    step: null,
    type: null,
    draft: {},
    isLoggedIn: loginStatus.isLoggedIn,
    userInfo: loginStatus.user || null, // Evitar undefined
    createdAt: new Date(now).toISOString(),
  };

  // Manejar acciones principales del menú
  if (payload.action === 'start_wizard' || input.callback === 'action:main_menu') {
    // Mostrar menú principal basado en estado de login
    const updatedLoginStatus = await checkUserLoginStatus(chatId);
    state.isLoggedIn = updatedLoginStatus.isLoggedIn;
    state.userInfo = updatedLoginStatus.user || null; // Evitar undefined
    
    await saveStateToFirestore(sessionRef, state);
    
    return res.json(buildMainMenu(chatId, state.isLoggedIn, state.userInfo?.name));
  }

  // Manejar selección de tipo de movimiento
  if (input.callback && input.callback.startsWith('movement:')) {
    if (!state.isLoggedIn) {
      return res.json(buildTelegramMessage(chatId, '❌ Necesitas estar logueado para registrar movimientos.\n\nUsa el botón "🔗 Vincular Cuenta" primero.'));
    }
    
    const movementType = input.callback.split(':')[1];
    state.selectedMovementType = movementType;
    await saveStateToFirestore(sessionRef, state);
    
    return res.json(buildMovementConfirmation(chatId, movementType));
  }

  // Confirmar tipo de movimiento y comenzar wizard
  if (input.callback && input.callback.startsWith('confirm_movement:')) {
    const movementType = input.callback.split(':')[1];
    state = { ...state, step: 1, type: movementType, draft: {} };
    await saveStateToFirestore(sessionRef, state);
    
    console.log('🚀 [DEBUG] Iniciando wizard confirmado:', { type: movementType, step: 1, chatId });
    const fuelKeyboard = buildFuelKeyboard(chatId);
    console.log('🎹 [DEBUG] Teclado generado:', JSON.stringify(fuelKeyboard, null, 2));
    
    return res.json(fuelKeyboard);
  }

  // Manejar otras acciones
  if (input.callback === 'action:login') {
    return handleLoginInit(req, res, { telegramData });
  }

  if (input.callback === 'action:help') {
    const helpText = state.isLoggedIn 
      ? '🤖 *ForeTech Combustibles Bot - Ayuda*\n\n*Comandos disponibles:*\n• `/start` - Menú principal\n• `/entrada` - Registrar entrada rápida\n• `/salida` - Registrar salida rápida\n• `/cancel` - Cancelar operación actual\n\n*Tipos de movimiento:*\n• *ENTRADA:* De proveedor → ubicación\n• *SALIDA:* De ubicación → vehículo\n\n¿Necesitas ayuda específica?'
      : '🤖 *ForeTech Combustibles Bot - Ayuda*\n\n¡Hola! Este bot te permite registrar movimientos de combustibles.\n\n*Para comenzar:*\n1. Vincula tu cuenta con el botón "🔗 Vincular Cuenta"\n2. Sigue las instrucciones para ingresar el código\n3. ¡Listo! Podrás registrar movimientos\n\n*¿Necesitas más ayuda?* Contacta al administrador.';
    
    return res.json(buildTelegramMessage(chatId, helpText, {
      inline_keyboard: [[{ text: '🔙 Volver al Menú', callback_data: 'action:main_menu' }]]
    }));
  }

  if (input.callback === 'action:logout') {
    await sessionRef.delete();
    return res.json(buildTelegramMessage(chatId, '🔓 Sesión cerrada.\n\nGracias por usar ForeTech Combustibles Bot.\n\nUsa /start para volver al menú principal.'));
  }

  if (input.callback === 'action:cancel') {
    await sessionRef.delete();
    return res.json(buildTelegramMessage(chatId, '❌ Operación cancelada.\n\nUsa /start para volver al menú principal.'));
  }

  // Continuar flujo
  const text = (input.text || '').trim();
  const callback = input.callback || '';
  if (callback.startsWith('fuel:')) {
    const fuel = callback.split(':')[1];
    state.draft.fuelType = fuel;
    // Paso siguiente depende del tipo
    state.step = 2;
    await saveStateToFirestore(sessionRef, state);
    
    // Mostrar confirmación de selección
    const confirmationMessage = `✅ *${fuel} Seleccionado*\n\n📋 *Progreso:* Paso 1/5 completado\n💼 *Tipo:* ${state.type}\n⛽ *Combustible:* ${fuel}\n\n`;
    
    if (state.type === 'ENTRADA') {
      const supplierKeyboard = await buildSupplierKeyboard(chatId, fuel, true);
      // Modificar el mensaje para incluir confirmación
      supplierKeyboard.message = confirmationMessage + supplierKeyboard.message;
      return res.json(supplierKeyboard);
    } else {
      // SALIDA → Fecha efectiva (nuevo paso igual que la web)
      state.step = '2b'; // Paso intermedio para fecha
      await saveStateToFirestore(sessionRef, state);
      
      const dateMessage = `${confirmationMessage}📅 **Fecha del Movimiento**\n\nIngresa la fecha efectiva del movimiento.\n\nFormato: YYYY-MM-DD (ej: 2024-12-15)\nO envía "hoy" para usar la fecha actual:`;
      return res.json(buildTelegramMessage(chatId, dateMessage, { inline_keyboard: [backRow()] }));
    }
  }

  // Fecha efectiva para SALIDA (step 2b) - NUEVA FUNCIONALIDAD
  if (state.step === '2b' && text && state.type === 'SALIDA') {
    let effectiveDate;
    
    if (text.toLowerCase() === 'hoy') {
      effectiveDate = new Date();
    } else {
      // Validar formato de fecha YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(text)) {
        return res.json(buildTelegramMessage(chatId, '❌ Formato de fecha inválido.\n\nUsa el formato YYYY-MM-DD (ej: 2024-12-15) o escribe "hoy":', { inline_keyboard: [backRow()] }));
      }
      
      effectiveDate = new Date(text + 'T00:00:00.000Z');
      if (isNaN(effectiveDate.getTime())) {
        return res.json(buildTelegramMessage(chatId, '❌ Fecha inválida.\n\nVerifica que la fecha sea válida:', { inline_keyboard: [backRow()] }));
      }
    }
    
    state.draft.effectiveDate = effectiveDate.toISOString();
    console.log(`[DEBUG] Fecha efectiva: ${effectiveDate.toLocaleDateString('es-CO')}`);
    
    // Continuar a ubicación origen
    state.step = 3; // Ubicación origen
    await saveStateToFirestore(sessionRef, state);
    
    const confirmationMessage = `✅ Fecha: **${effectiveDate.toLocaleDateString('es-CO')}**\n\n`;
    const locationKeyboard = buildLocationKeyboard(chatId, 'Selecciona la ubicación de origen:', true);
    locationKeyboard.message = confirmationMessage + locationKeyboard.message;
    return res.json(locationKeyboard);
  }

  // Manejar selección de proveedor
  if (callback.startsWith('supplier:')) {
    const parts = callback.split(':');
    if (parts[1] === 'custom') {
      // Usuario quiere escribir proveedor personalizado
      state.draft.waitingForCustomSupplier = true;
      await saveStateToFirestore(sessionRef, state);
      return res.json(buildTelegramMessage(chatId, 'Escribe el nombre del proveedor:', { inline_keyboard: [backRow()] }));
    } else {
      // Usuario seleccionó proveedor existente
      const supplierName = parts.slice(2).join(':'); // En caso de que el nombre tenga ':'
      state.draft.supplierName = supplierName;
      console.log(`[DEBUG] Proveedor seleccionado: ${supplierName}`);
      
      // Para ENTRADA, continuar con selección de destino
      if (state.type === 'ENTRADA') {
        state.step = 'destination';
        await saveStateToFirestore(sessionRef, state);
        const destinationKeyboard = await buildDestinationKeyboard(chatId, true);
        return res.json(destinationKeyboard);
      }
      
      // Para otros tipos, usar lógica original
      state.step = 3;
      await saveStateToFirestore(sessionRef, state);
      return res.json(buildLocationKeyboard(chatId, 'Selecciona la ubicación de destino:', true));
    }
  }

  // Paso 2 ENTRADA: proveedor personalizado
  if (state.type === 'ENTRADA' && state.step === 2 && text && state.draft.waitingForCustomSupplier) {
    state.draft.supplierName = text;
    state.draft.waitingForCustomSupplier = false; // Limpiar flag
    console.log(`[DEBUG] Proveedor personalizado: ${text}`);
    
    // Para ENTRADA, continuar con selección de destino
    state.step = 'destination';
    await saveStateToFirestore(sessionRef, state);
    const destinationKeyboard = await buildDestinationKeyboard(chatId, true);
    return res.json(destinationKeyboard);
  }

  // Manejar selección de ubicación de destino (ENTRADA)
  if (callback.startsWith('destination:')) {
    const destinationLocation = callback.split(':')[1];
    state.draft.destinationLocation = destinationLocation;
    console.log(`[DEBUG] Ubicación de destino seleccionada: ${destinationLocation}`);
    
    // Continuar con siguiente paso (cantidad y precio)
    state.step = 3;
    await saveStateToFirestore(sessionRef, state);
    return res.json(getStepMessage(chatId, 3, state));
  }

  if (callback.startsWith('dest:')) {
    const dest = callback.split(':')[1];
    if (state.type === 'ENTRADA') {
      state.draft.destinationLocation = dest;
      state.step = 4; // cantidad
      await saveStateToFirestore(sessionRef, state);
      return res.json(buildTelegramMessage(chatId, 'Ingresa la cantidad en galones (ej: 500):'));
    } else {
      // SALIDA: dest significa origen
      state.draft.location = dest; // ubicación origen
      state.step = '4a'; // preview inventario
      await saveStateToFirestore(sessionRef, state);
      
      // Obtener preview de inventario real
      const inventory = await fetchInventoryPreview(state.draft.fuelType, dest);
      
      let message;
      if (inventory.found) {
        const lastMov = inventory.lastMovement;
        const lastMovText = lastMov 
          ? `\nÚlt. movimiento: ${lastMov.type}/${lastMov.quantity} gal el ${new Date(lastMov.date.seconds * 1000).toLocaleDateString('es-CO')}`
          : '';
        
        message = `📊 Inventario en ${dest} — ${state.draft.fuelType}\nDisponible: ${inventory.currentStock} gal\nPrecio: $${inventory.pricePerUnit.toLocaleString('es-CO')}/gal${lastMovText}`;
      } else {
        message = `⚠️ No hay inventario disponible para ${state.draft.fuelType} en ${dest}`;
      }
      
      return res.json(buildTelegramMessage(chatId, message, {
        inline_keyboard: [
          [{ text: inventory.found ? 'Continuar' : '⬅️ Cambiar origen', callback_data: inventory.found ? 'inv:ok' : 'nav:back' }],
          backRow()
        ]
      }));
    }
  }

  if (callback === 'inv:ok' && state.type === 'SALIDA') {
    state.step = 5; // seleccionar vehículo
    state.draft.currentVehiclePage = 0; // reset paginación
    await saveStateToFirestore(sessionRef, state);
    return res.json(await buildVehicleKeyboardReal(chatId, state.draft.fuelType, state.draft.location, 0, true));
  }

  // Paginación de vehículos
  if ((callback === 'veh_next' || callback === 'veh_prev') && state.type === 'SALIDA') {
    const currentPage = state.draft.currentVehiclePage || 0;
    const newPage = callback === 'veh_next' ? currentPage + 1 : Math.max(0, currentPage - 1);
    state.draft.currentVehiclePage = newPage;
    await saveStateToFirestore(sessionRef, state);
    return res.json(await buildVehicleKeyboardReal(chatId, state.draft.fuelType, state.draft.location, newPage, true));
  }

  if (callback.startsWith('veh:') && state.type === 'SALIDA') {
    const vehicleId = callback.split(':')[1];
    
    // Obtener detalles del vehículo para verificar si requiere horómetro
    const vehicleResult = await fetchVehicleDetails(vehicleId);
    if (!vehicleResult.success) {
      return res.json(buildTelegramMessage(chatId, '❌ Error al obtener información del vehículo. Inténtalo de nuevo.', { inline_keyboard: [backRow()] }));
    }
    
    const vehicle = vehicleResult.vehicle;
    state.draft.vehicleId = vehicleId;
    state.draft.vehicleInfo = vehicle; // Guardar info completa para uso posterior
    
    // Verificar si requiere horómetro (igual que en la web)
    const requiresHourMeter = checkIfVehicleRequiresHourMeter(vehicle);
    
    if (requiresHourMeter) {
      // Si requiere horómetro, ir al paso de horómetro
      state.step = '5b'; // Nuevo paso intermedio para horómetro
      await saveStateToFirestore(sessionRef, state);
      
      const message = `🕐 **Horómetro Requerido**\n\nEl vehículo **${vehicle.name || vehicleId}** requiere registrar las horas del horómetro.\n\nIngresa las horas actuales (ej: 1250):`;
      return res.json(buildTelegramMessage(chatId, message, { inline_keyboard: [backRow()] }));
    } else {
      // Si no requiere horómetro, continuar directo a cantidad
      state.step = 6; // cantidad
      await saveStateToFirestore(sessionRef, state);
      return res.json(buildTelegramMessage(chatId, 'Ingresa la cantidad a despachar en galones (ej: 120):', { inline_keyboard: [backRow()] }));
    }
  }

  // Horómetro para SALIDA (step 5b) - NUEVA FUNCIONALIDAD
  if (state.step === '5b' && text && state.type === 'SALIDA') {
    const hours = parseFloat(text.replace(/[^\d.\-]/g, ''));
    if (isNaN(hours) || hours < 0) {
      return res.json(buildTelegramMessage(chatId, '❌ Horas inválidas. Ingresa un número válido >= 0 (ej: 1250):', { inline_keyboard: [backRow()] }));
    }
    
    state.draft.currentHours = hours;
    console.log(`[DEBUG] Horómetro registrado: ${hours} horas para vehículo ${state.draft.vehicleId}`);
    
    // Continuar al paso de cantidad
    state.step = 6;
    await saveStateToFirestore(sessionRef, state);
    return res.json(buildTelegramMessage(chatId, 'Ingresa la cantidad a despachar en galones (ej: 120):', { inline_keyboard: [backRow()] }));
  }

  // Cantidad para ENTRADA (step 4) 
  if (state.step === 4 && text && state.type === 'ENTRADA') {
    const q = parseFloat(text.replace(/[^\d.\-]/g, ''));
    if (!q || q <= 0) {
      return res.json(buildTelegramMessage(chatId, 'Cantidad inválida. Ingresa un número > 0:', { inline_keyboard: [backRow()] }));
    }
    state.draft.quantity = q;
    state.step = 5;
    await saveStateToFirestore(sessionRef, state);
    return res.json(buildTelegramMessage(chatId, 'Ingresa el precio unitario (ej: 15000):', { inline_keyboard: [backRow()] }));
  }

  // Cantidad para SALIDA (step 6)
  if (state.step === 6 && text && state.type === 'SALIDA') {
    const q = parseFloat(text.replace(/[^\d.\-]/g, ''));
    if (!q || q <= 0) {
      return res.json(buildTelegramMessage(chatId, 'Cantidad inválida. Ingresa un número > 0:', { inline_keyboard: [backRow()] }));
    }
    
    // Validar stock disponible (igual que en la web)
    console.log(`[DEBUG] Validando stock: ${q} gal de ${state.draft.fuelType} en ${state.draft.location}`);
    const stockResult = await fetchInventoryPreview(state.draft.fuelType, state.draft.location);
    
    if (stockResult.found && stockResult.currentStock !== undefined) {
      if (q > stockResult.currentStock) {
        const message = `❌ **Stock Insuficiente**\n\nCantidad solicitada: **${q} gal**\nStock disponible: **${stockResult.currentStock} gal**\n\nIngresa una cantidad menor o igual al stock:`;
        return res.json(buildTelegramMessage(chatId, message, { inline_keyboard: [backRow()] }));
      }
    } else {
      // Si no se puede verificar el stock, mostrar advertencia pero continuar
      console.warn(`[WARNING] No se pudo verificar stock para ${state.draft.fuelType} en ${state.draft.location}`);
    }
    
    state.draft.quantity = q;
    state.step = 7; // precio para SALIDA
    await saveStateToFirestore(sessionRef, state);
    return res.json(buildTelegramMessage(chatId, 'Ingresa el precio de referencia (ej: 15000):', { inline_keyboard: [backRow()] }));
  }

  // Precio para ENTRADA (step 5)
  if (state.step === 5 && text && state.type === 'ENTRADA') {
    const p = parseFloat(text.replace(/[^\d.\-]/g, ''));
    if (p < 0 || isNaN(p)) {
      return res.json(buildTelegramMessage(chatId, 'Precio inválido. Ingresa un número >= 0:', { inline_keyboard: [backRow()] }));
    }
    state.draft.unitPrice = p;
    state.step = 6;
    await saveStateToFirestore(sessionRef, state);

    // Resumen ENTRADA
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
        ], backRow()]
      })
    );
  }

  // Precio para SALIDA (step 7)
  if (state.step === 7 && text && state.type === 'SALIDA') {
    const p = parseFloat(text.replace(/[^\d.\-]/g, ''));
    if (p < 0 || isNaN(p)) {
      return res.json(buildTelegramMessage(chatId, 'Precio inválido. Ingresa un número >= 0:', { inline_keyboard: [backRow()] }));
    }
    state.draft.unitPrice = p;
    state.step = 8; // resumen SALIDA
    await saveStateToFirestore(sessionRef, state);

    // Resumen SALIDA
    const d = state.draft;
    const total = d.quantity * d.unitPrice;
    const summaryLines = [
      'Revisa y confirma:',
      `• Tipo: SALIDA`,
      `• Combustible: ${d.fuelType}`,
    ];
    
    // Incluir fecha si fue capturada
    if (d.effectiveDate) {
      const dateObj = new Date(d.effectiveDate);
      summaryLines.push(`• Fecha: ${dateObj.toLocaleDateString('es-CO')}`);
    }
    
    summaryLines.push(
      `• Origen: ${d.location}`,
      `• Vehículo: ${d.vehicleInfo?.name || d.vehicleId || 'N/A'}`
    );
    
    // Incluir horómetro si fue capturado
    if (d.currentHours !== undefined) {
      summaryLines.push(`• Horómetro: ${d.currentHours} hrs`);
    }
    
    summaryLines.push(
      `• Cantidad: ${d.quantity} gal`,
      `• Precio ref.: $${p.toLocaleString('es-CO')}`,
      `• Total ref.: $${total.toLocaleString('es-CO')}`
    );
    
    const summary = summaryLines.join('\n');

    return res.json(
      buildTelegramMessage(chatId, summary, {
        inline_keyboard: [[
          { text: '✅ Confirmar', callback_data: 'confirm:yes' },
          { text: '❌ Cancelar', callback_data: 'confirm:no' },
        ], backRow()]
      })
    );
  }

  // Navegación hacia atrás
  if (callback === 'nav:back') {
    // Reglas simples por step y tipo
    if (state.type === 'ENTRADA') {
      if (state.step === 3) state.step = 2; // destino -> proveedor
      else if (state.step === 4) state.step = 3; // cantidad -> destino
      else if (state.step === 5) state.step = 4; // precio -> cantidad
      else if (state.step === 6) state.step = 5; // resumen -> precio
    } else {
      // SALIDA (con nuevo paso de fecha)
      if (state.step === '2b') state.step = 2; // fecha -> combustible
      else if (state.step === 3) state.step = '2b'; // ubicación -> fecha
      else if (state.step === '4a') state.step = 3; // preview -> ubicación
      else if (state.step === 5) state.step = '4a'; // vehículo -> preview
      else if (state.step === '5b') state.step = 5; // horómetro -> vehículo
      else if (state.step === 6) {
        // cantidad -> vehículo o horómetro (dependiendo de si se requirió)
        const requiresHourMeter = state.draft.vehicleInfo && checkIfVehicleRequiresHourMeter(state.draft.vehicleInfo);
        state.step = requiresHourMeter ? '5b' : 5;
      }
      else if (state.step === 7) state.step = 6; // precio -> cantidad
      else if (state.step === 8) state.step = 7; // resumen -> precio
    }
    await saveStateToFirestore(sessionRef, state);

    // Reemitir el teclado correspondiente
    if (state.step === 2 && state.type === 'ENTRADA') return res.json(await buildSupplierKeyboard(chatId, state.draft.fuelType, true));
    if (state.step === '2b' && state.type === 'SALIDA') {
      const dateMessage = `📅 **Fecha del Movimiento**\n\nIngresa la fecha efectiva del movimiento.\n\nFormato: YYYY-MM-DD (ej: 2024-12-15)\nO envía "hoy" para usar la fecha actual:`;
      return res.json(buildTelegramMessage(chatId, dateMessage, { inline_keyboard: [backRow()] }));
    }
    if (state.step === 3 && state.type === 'ENTRADA') return res.json(buildLocationKeyboard(chatId, 'Selecciona la ubicación de destino:', true));
    if (state.step === 4 && state.type === 'ENTRADA') return res.json(buildTelegramMessage(chatId, 'Ingresa la cantidad en galones (ej: 500):', { inline_keyboard: [backRow()] }));
    if (state.step === 5 && state.type === 'ENTRADA') return res.json(buildTelegramMessage(chatId, 'Ingresa el precio unitario (ej: 15000):', { inline_keyboard: [backRow()] }));
    
    // SALIDA navigation
    if (state.step === 2 && state.type === 'SALIDA') return res.json(buildLocationKeyboard(chatId, 'Selecciona la ubicación de origen:', true));
    if (state.step === '4a' && state.type === 'SALIDA') {
      const inventory = await fetchInventoryPreview(state.draft.fuelType, state.draft.location);
      let message;
      if (inventory.found) {
        const lastMov = inventory.lastMovement;
        const lastMovText = lastMov 
          ? `\nÚlt. movimiento: ${lastMov.type}/${lastMov.quantity} gal el ${new Date(lastMov.date.seconds * 1000).toLocaleDateString('es-CO')}`
          : '';
        message = `📊 Inventario en ${state.draft.location} — ${state.draft.fuelType}\nDisponible: ${inventory.currentStock} gal\nPrecio: $${inventory.pricePerUnit.toLocaleString('es-CO')}/gal${lastMovText}`;
      } else {
        message = `⚠️ No hay inventario disponible para ${state.draft.fuelType} en ${state.draft.location}`;
      }
      return res.json(buildTelegramMessage(chatId, message, {
        inline_keyboard: [
          [{ text: inventory.found ? 'Continuar' : '⬅️ Cambiar origen', callback_data: inventory.found ? 'inv:ok' : 'nav:back' }],
          backRow()
        ]
      }));
    }
    if (state.step === 5 && state.type === 'SALIDA') return res.json(await buildVehicleKeyboardReal(chatId, state.draft.fuelType, state.draft.location, state.draft.currentVehiclePage || 0, true));
    if (state.step === '5b' && state.type === 'SALIDA') {
      const vehicle = state.draft.vehicleInfo;
      const message = `🕐 **Horómetro Requerido**\n\nEl vehículo **${vehicle?.name || state.draft.vehicleId}** requiere registrar las horas del horómetro.\n\nIngresa las horas actuales (ej: 1250):`;
      return res.json(buildTelegramMessage(chatId, message, { inline_keyboard: [backRow()] }));
    }
    if (state.step === 6 && state.type === 'SALIDA') return res.json(buildTelegramMessage(chatId, 'Ingresa la cantidad a despachar en galones (ej: 120):', { inline_keyboard: [backRow()] }));
    if (state.step === 7 && state.type === 'SALIDA') return res.json(buildTelegramMessage(chatId, 'Ingresa el precio de referencia (ej: 15000):', { inline_keyboard: [backRow()] }));
    
    return res.json(buildFuelKeyboard(chatId));
  }

  if (callback === 'confirm:no') {
    await sessionRef.delete();
    return res.json(buildTelegramMessage(chatId, 'Operación cancelada. Usa /entrada para iniciar de nuevo.'));
  }

  if (callback === 'confirm:yes') {
    // Validar y crear movimiento vía pipeline existente
    const d = state.draft;
    const movementData = state.type === 'ENTRADA'
      ? {
          type: 'entrada',
          fuelType: d.fuelType,
          quantity: d.quantity,
          unitPrice: d.unitPrice,
          supplierName: d.supplierName,
          destinationLocation: d.destinationLocation,
          description: `Entrada desde Telegram (@${state.user})`,
        }
      : {
          type: 'salida',
          fuelType: d.fuelType,
          quantity: d.quantity,
          unitPrice: d.unitPrice,
          location: d.location,
          vehicleId: d.vehicleId,
          ...(d.currentHours !== undefined && { currentHours: d.currentHours }), // Incluir si existe
          ...(d.effectiveDate && { effectiveDate: new Date(d.effectiveDate) }), // Incluir fecha efectiva
          description: `Salida desde Telegram (@${state.user})`,
        };
    const payloadToCreate = {
      action: 'create_movement',
      movementData,
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

  // Log para debugging
  console.log('🔍 [DEBUG] Estado de sesión no manejado:', {
    step: state.step,
    type: state.type,
    callback,
    text: text.substring(0, 50),
    action: payload.action
  });

  // Entrada no reconocida
  return res.json(buildTelegramMessage(chatId, `No entendí "${text || callback}". Usa /help o /entrada para iniciar.`));
}

/**
 * Generar mensaje Telegram compatible con nodo N8N 'Mensaje'
 */
function buildTelegramMessage(chatId, text, replyMarkup) {
  const body = { chatId, message: text };
  if (replyMarkup) body.reply_markup = replyMarkup;
  const result = { success: true, action: 'send_message', ...body };
  
  // DEBUG: Log para ver qué se está enviando
  console.log('🔍 [ROUTER DEBUG] Enviando mensaje:', {
    chatId,
    text: text.substring(0, 50) + '...',
    hasReplyMarkup: !!replyMarkup,
    replyMarkup: replyMarkup ? JSON.stringify(replyMarkup) : 'N/A'
  });
  
  return result;
}

function backRow() {
  return [
    { text: '⬅️ Atrás', callback_data: 'nav:back' },
    { text: '✖️ Cancelar', callback_data: 'nav:cancel' }
  ];
}

function buildFuelKeyboard(chatId) {
  return buildTelegramMessage(chatId, 'Selecciona el combustible:', {
    inline_keyboard: [
      [
        { text: 'DIESEL', callback_data: 'fuel:DIESEL' },
        { text: 'GASOLINA', callback_data: 'fuel:GASOLINA' },
      ],
      [
        { text: 'EXTRA', callback_data: 'fuel:EXTRA' },
        { text: 'CORRIENTE', callback_data: 'fuel:CORRIENTE' },
      ],
    ],
  });
}

function buildLocationKeyboard(chatId, title, withBack = false) {
  const kb = {
    inline_keyboard: [
      [
        { text: 'principal', callback_data: 'dest:principal' },
        { text: 'austria', callback_data: 'dest:austria' },
      ],
      [
        { text: 'ilusion', callback_data: 'dest:ilusion' },
        { text: 'deposito', callback_data: 'dest:deposito' },
      ],
    ],
  };
  if (withBack) kb.inline_keyboard.push(backRow());
  return buildTelegramMessage(chatId, title || 'Selecciona ubicación:', kb);
}

function buildMainMenu(chatId, isLoggedIn, userName = null) {
  if (!isLoggedIn) {
    // Usuario no logueado - mostrar opciones básicas
    return buildTelegramMessage(chatId, '🤖 *ForeTech Combustibles Bot*\n\n¡Hola! Para usar el bot necesitas vincular tu cuenta.\n\n¿Qué quieres hacer?', {
      inline_keyboard: [
        [{ text: '🔗 Vincular Cuenta', callback_data: 'action:login' }],
        [{ text: '❓ Ayuda', callback_data: 'action:help' }]
      ]
    });
  } else {
    // Usuario logueado - mostrar menú principal
    const greeting = userName ? `¡Hola *${userName}*! 👋` : '¡Hola! 👋';
    return buildTelegramMessage(chatId, `🤖 *ForeTech Combustibles Bot*\n\n${greeting}\n\n*Estado:* ✅ Logueado\n\n¿Qué tipo de movimiento quieres registrar?`, {
      inline_keyboard: [
        [
          { text: '📥 ENTRADA', callback_data: 'movement:ENTRADA' },
          { text: '📤 SALIDA', callback_data: 'movement:SALIDA' }
        ],
        [{ text: '❓ Ayuda', callback_data: 'action:help' }],
        [{ text: '🔓 Cerrar Sesión', callback_data: 'action:logout' }]
      ]
    });
  }
}

function buildMovementConfirmation(chatId, movementType) {
  const emoji = movementType === 'ENTRADA' ? '📥' : '📤';
  const description = movementType === 'ENTRADA' 
    ? 'Registrar combustible que *entra* al inventario (de proveedor a ubicación)'
    : 'Registrar combustible que *sale* del inventario (de ubicación a vehículo)';
    
  return buildTelegramMessage(chatId, `${emoji} *${movementType} Seleccionada*\n\n${description}\n\n¿Continuar con este tipo de movimiento?`, {
    inline_keyboard: [
      [{ text: '✅ Continuar', callback_data: `confirm_movement:${movementType}` }],
      [{ text: '🔄 Cambiar Tipo', callback_data: 'action:main_menu' }],
      [{ text: '❌ Cancelar', callback_data: 'action:cancel' }]
    ]
  });
}

function buildVehicleKeyboard(chatId, page, withBack = false) {
  // Mock simple de paginación de vehículos (IDs ejemplo) - MANTENER para compatibilidad
  const vehicles = ['TRK-001', 'HILUX-02', 'RANGER-03', 'NPR-01'];
  const rows = vehicles.map((v) => [{ text: v, callback_data: `veh:${v}` }]);
  const kb = { inline_keyboard: [...rows] };
  if (withBack) kb.inline_keyboard.push(backRow());
  return buildTelegramMessage(chatId, 'Selecciona vehículo:', kb);
}

async function buildDestinationKeyboard(chatId, withBack = false) {
  try {
    const message = `🎯 **¿A qué ubicación llegará el combustible?**\n\nSelecciona la ubicación de destino:`;
    
    // Construir botones de ubicaciones (2 por fila para optimizar espacio)
    const locationRows = [];
    for (let i = 0; i < STORAGE_LOCATIONS.length; i += 2) {
      const row = [];
      row.push({ 
        text: `📍 ${STORAGE_LOCATIONS[i]}`, 
        callback_data: `destination:${STORAGE_LOCATIONS[i]}`
      });
      
      if (i + 1 < STORAGE_LOCATIONS.length) {
        row.push({ 
          text: `📍 ${STORAGE_LOCATIONS[i + 1]}`, 
          callback_data: `destination:${STORAGE_LOCATIONS[i + 1]}`
        });
      }
      locationRows.push(row);
    }
    
    const kb = { inline_keyboard: [...locationRows] };
    if (withBack) kb.inline_keyboard.push(backRow());
    
    return buildTelegramMessage(chatId, message, kb);
    
  } catch (error) {
    console.error('❌ Error building destination keyboard:', error);
    return buildTelegramMessage(chatId, '❌ Error al cargar ubicaciones. Escribe el nombre de la ubicación:', {
      inline_keyboard: withBack ? [backRow()] : []
    });
  }
}

async function buildSupplierKeyboard(chatId, fuelType, withBack = false) {
  try {
    // Obtener TODOS los proveedores activos (igual que en la web)
    const suppliersData = await fetchAllActiveSuppliers();
    const { suppliers } = suppliersData;
    
    if (suppliers.length === 0) {
      const message = `⚠️ No hay proveedores registrados en el sistema.\n\nPuedes escribir el nombre del proveedor manualmente:`;
      return buildTelegramMessage(chatId, message, {
        inline_keyboard: withBack ? [backRow()] : []
      });
    }
    
    // Construir botones de proveedores (1 por fila para mostrar nombres completos)
    const supplierRows = [];
    suppliers.forEach(supplier => {
      const displayName = supplier.name.length > 30 
        ? supplier.name.substring(0, 30) + '...' 
        : supplier.name;
      
      // Agregar información adicional como en la web
      let buttonText = `🏪 ${displayName}`;
      if (supplier.rating && supplier.rating > 0) {
        buttonText += ` ⭐${supplier.rating}`;
      }
      if (supplier.location) {
        buttonText += ` 📍`;
      }
      
      supplierRows.push([{ 
        text: buttonText, 
        callback_data: `supplier:${supplier.id}:${supplier.name}`
      }]);
    });
    
    // Opción para escribir proveedor personalizado
    supplierRows.push([{ 
      text: '✏️ Escribir otro proveedor', 
      callback_data: 'supplier:custom' 
    }]);
    
    const kb = { inline_keyboard: [...supplierRows] };
    if (withBack) kb.inline_keyboard.push(backRow());
    
    const message = `🏪 **Proveedores disponibles:**\n\nSelecciona un proveedor de la lista o escribe uno personalizado:`;
    return buildTelegramMessage(chatId, message, kb);
    
  } catch (error) {
    console.error('❌ Error building supplier keyboard:', error);
    return buildTelegramMessage(chatId, '❌ Error al cargar proveedores. Escribe el nombre del proveedor:', {
      inline_keyboard: withBack ? [backRow()] : []
    });
  }
}

async function buildVehicleKeyboardReal(chatId, fuelType, location, page = 0, withBack = false) {
  try {
    const vehicleData = await fetchVehiclesPage({ fuelType, location, page, pageSize: 8 });
    const { vehicles, pagination } = vehicleData;
    
    if (vehicles.length === 0) {
      const message = `⚠️ No hay vehículos ${fuelType} disponibles en ${location}`;
      return buildTelegramMessage(chatId, message, {
        inline_keyboard: withBack ? [backRow()] : []
      });
    }
    
    // Construir botones de vehículos (2 por fila)
    const vehicleRows = [];
    for (let i = 0; i < vehicles.length; i += 2) {
      const row = [];
      const v1 = vehicles[i];
      row.push({ text: v1.vehicleId, callback_data: `veh:${v1.vehicleId}` });
      
      if (i + 1 < vehicles.length) {
        const v2 = vehicles[i + 1];
        row.push({ text: v2.vehicleId, callback_data: `veh:${v2.vehicleId}` });
      }
      vehicleRows.push(row);
    }
    
    // Botones de paginación
    const paginationRow = [];
    if (pagination.hasPrevious) {
      paginationRow.push({ text: '« Anterior', callback_data: 'veh_prev' });
    }
    if (pagination.hasNext) {
      paginationRow.push({ text: 'Siguiente »', callback_data: 'veh_next' });
    }
    
    const kb = { inline_keyboard: [...vehicleRows] };
    if (paginationRow.length > 0) kb.inline_keyboard.push(paginationRow);
    if (withBack) kb.inline_keyboard.push(backRow());
    
    const pageInfo = pagination.total > 8 ? ` (${page + 1}/${Math.ceil(pagination.total / 8)})` : '';
    return buildTelegramMessage(chatId, `Selecciona vehículo${pageInfo}:`, kb);
    
  } catch (error) {
    console.error('❌ Error building vehicle keyboard:', error);
    return buildTelegramMessage(chatId, '❌ Error al cargar vehículos. Inténtalo de nuevo.', {
      inline_keyboard: withBack ? [backRow()] : []
    });
  }
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
  
  // Campos requeridos básicos
  const baseRequiredFields = ['type', 'fuelType', 'quantity', 'unitPrice'];
  
  for (const field of baseRequiredFields) {
    if (!data || !data[field]) {
      errors.push(`Campo requerido faltante: ${field}`);
    }
  }

  // Validaciones específicas por tipo
  if (data.type) {
    const type = data.type.toLowerCase();
    if (type === 'entrada') {
      if (!data.supplierName) errors.push('Campo requerido faltante: supplierName');
      if (!data.destinationLocation) errors.push('Campo requerido faltante: destinationLocation');
    } else if (type === 'salida') {
      if (!data.location) errors.push('Campo requerido faltante: location');
      if (!data.vehicleId) errors.push('Campo requerido faltante: vehicleId');
    } else {
      errors.push(`Tipo de movimiento inválido: ${data.type}. Permitidos: entrada, salida`);
    }
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
  if (data.location && !allowedLocations.includes(data.location.toLowerCase())) {
    errors.push(`Ubicación inválida. Permitidas: ${allowedLocations.join(', ')}`);
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
  
  const baseData = {
    // Campos principales
    type: data.type.toLowerCase(),
    fuelType: data.fuelType.toUpperCase(),
    quantity: parseFloat(data.quantity),
    unitPrice: parseFloat(data.unitPrice),
    totalValue: parseFloat(data.quantity) * parseFloat(data.unitPrice),
    
    // Fechas
    effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : now,
    createdAt: now,
    updatedAt: now,
    approvedAt: now,
    
    // Estado
    status: 'completado',
    
    // Campos opcionales
    description: data.description || `${data.type} desde ${source}`,
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

  // Campos específicos según tipo
  if (data.type.toLowerCase() === 'entrada') {
    return {
      ...baseData,
      supplierName: data.supplierName,
      destinationLocation: data.destinationLocation.toLowerCase(),
    };
  } else if (data.type.toLowerCase() === 'salida') {
    return {
      ...baseData,
      location: data.location.toLowerCase(),
      vehicleId: data.vehicleId,
    };
  }

  return baseData;
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
 * Obtener preview del inventario real
 */
async function fetchInventoryPreview(fuelType, location) {
  try {
    const inventoryQuery = db.collection('combustibles_inventory')
      .where('fuelType', '==', fuelType.toUpperCase())
      .where('location', '==', location.toLowerCase())
      .where('status', '==', 'active');
    
    const snapshot = await inventoryQuery.get();
    
    if (snapshot.empty) {
      return {
        found: false,
        currentStock: 0,
        pricePerUnit: 0,
        lastMovement: null
      };
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return {
      found: true,
      currentStock: data.currentStock || 0,
      pricePerUnit: data.pricePerUnit || 0,
      lastMovement: data.lastMovement || null
    };
  } catch (error) {
    console.error('❌ Error fetching inventory preview:', error);
    return {
      found: false,
      currentStock: 0,
      pricePerUnit: 0,
      lastMovement: null,
      error: error.message
    };
  }
}

/**
 * Verificar si un vehículo requiere horómetro (lógica igual que en la web)
 */
function checkIfVehicleRequiresHourMeter(vehicle) {
  if (!vehicle) return false;
  
  // Verificar primero si el vehículo tiene el campo hasHourMeter explícito
  if (vehicle.hasHourMeter !== undefined) {
    return vehicle.hasHourMeter;
  }
  
  // Fallback: detectar por tipo de combustible (igual que la web)
  const fuelType = (vehicle.fuelType || '').toUpperCase();
  return fuelType === 'DIESEL';
}

/**
 * Obtener información detallada de un vehículo desde Firestore
 */
async function fetchVehicleDetails(vehicleId) {
  try {
    const vehicleDoc = await db.collection('combustibles_vehicles').doc(vehicleId).get();
    if (!vehicleDoc.exists) {
      return { success: false, error: 'Vehículo no encontrado' };
    }
    
    const vehicleData = vehicleDoc.data();
    return {
      success: true,
      vehicle: {
        vehicleId: vehicleDoc.id,
        name: vehicleData.name,
        plateNumber: vehicleData.plateNumber,
        fuelType: vehicleData.fuelType,
        hasHourMeter: vehicleData.hasHourMeter,
        category: vehicleData.category,
        type: vehicleData.type,
        status: vehicleData.status
      }
    };
  } catch (error) {
    console.error('[ERROR] Error fetching vehicle details:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener TODOS los proveedores activos (igual que en la web)
 */
async function fetchAllActiveSuppliers() {
  try {
    const suppliersQuery = db.collection('combustibles_suppliers')
      .where('status', '==', 'active')
      .orderBy('name', 'asc'); // Ordenar por nombre como en la web
    
    const snapshot = await suppliersQuery.get();
    const suppliers = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      suppliers.push({
        id: doc.id,
        name: data.name,
        rating: data.rating || 0,
        fuelTypes: data.fuelTypes || [],
        location: data.location || '',
        contact: data.contactPerson || data.phone || ''
      });
    });

    console.log(`[DEBUG] Proveedores activos encontrados:`, suppliers.length);
    return { 
      success: true,
      suppliers, 
      count: suppliers.length 
    };
  } catch (error) {
    console.error('[ERROR] Error obteniendo proveedores:', error);
    return { 
      success: false,
      suppliers: [], 
      count: 0,
      error: error.message
    };
  }
}

/**
 * DEPRECATED: Obtener proveedores por tipo de combustible
 * Mantenido por compatibilidad, pero ya no se usa en ENTRADA
 */
async function fetchSuppliersByFuelType(fuelType) {
  try {
    const suppliersQuery = db.collection('combustibles_suppliers')
      .where('fuelTypes', 'array-contains', fuelType.toUpperCase())
      .where('status', '==', 'active')
      .orderBy('rating', 'desc')
      .limit(10); // Limitar a 10 para no sobrecargar
    
    const snapshot = await suppliersQuery.get();
    const suppliers = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      suppliers.push({
        id: doc.id,
        name: data.name,
        rating: data.rating || 0,
        fuelTypes: data.fuelTypes || []
      });
    });
    
    return {
      success: true,
      suppliers
    };
  } catch (error) {
    console.error('❌ Error fetching suppliers by fuel type:', error);
    return {
      success: false,
      suppliers: [],
      error: error.message
    };
  }
}

/**
 * Obtener página de vehículos con paginación
 */
async function fetchVehiclesPage({ fuelType, location, page = 0, pageSize = 8 }) {
  try {
    // Construir query con filtros
    let query = db.collection('combustibles_vehicles')
      .where('status', '==', 'active');
    
    // Filtro por ubicación actual (vehículos en la ubicación de origen)
    if (location) {
      query = query.where('currentLocation', '==', location.toLowerCase());
    }
    
    // Filtro de compatibilidad de combustible
    // DIESEL → solo vehículos diesel, otros tipos → cualquier vehículo excepto diesel
    if (fuelType === 'DIESEL') {
      query = query.where('fuelType', '==', 'DIESEL');
    } else {
      query = query.where('fuelType', 'in', ['GASOLINA', 'EXTRA', 'CORRIENTE']);
    }
    
    // Ordenar y paginar
    query = query.orderBy('vehicleId').offset(page * pageSize).limit(pageSize);
    
    const snapshot = await query.get();
    const vehicles = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      vehicles.push({
        id: doc.id,
        vehicleId: data.vehicleId,
        brand: data.brand || 'N/A',
        model: data.model || 'N/A',
        fuelType: data.fuelType,
        currentLocation: data.currentLocation,
        status: data.status
      });
    });
    
    // Contar total para saber si hay más páginas
    let totalQuery = db.collection('combustibles_vehicles')
      .where('status', '==', 'active');
    
    if (location) {
      totalQuery = totalQuery.where('currentLocation', '==', location.toLowerCase());
    }
    
    if (fuelType === 'DIESEL') {
      totalQuery = totalQuery.where('fuelType', '==', 'DIESEL');
    } else {
      totalQuery = totalQuery.where('fuelType', 'in', ['GASOLINA', 'EXTRA', 'CORRIENTE']);
    }
    
    const totalSnapshot = await totalQuery.get();
    const total = totalSnapshot.size;
    
    return {
      vehicles,
      pagination: {
        currentPage: page,
        pageSize,
        total,
        hasNext: (page + 1) * pageSize < total,
        hasPrevious: page > 0
      }
    };
  } catch (error) {
    console.error('❌ Error fetching vehicles page:', error);
    return {
      vehicles: [],
      pagination: {
        currentPage: page,
        pageSize,
        total: 0,
        hasNext: false,
        hasPrevious: false
      },
      error: error.message
    };
  }
}

/**
 * Actualizar inventario desde movimiento (ENTRADA y SALIDA)
 */
async function updateInventoryFromMovement(transaction, movement, movementId) {
  const targetLocation = movement.type === 'entrada' 
    ? movement.destinationLocation 
    : movement.location;
  
  // Buscar inventario existente
  const inventoryQuery = db.collection('combustibles_inventory')
    .where('fuelType', '==', movement.fuelType)
    .where('location', '==', targetLocation)
    .where('status', '==', 'active');
    
  const inventorySnapshot = await inventoryQuery.get();
  
  if (inventorySnapshot.empty) {
    if (movement.type === 'entrada') {
      // Crear nuevo inventario solo para entradas
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
      throw new Error(`No hay inventario disponible para ${movement.fuelType} en ${targetLocation}`);
    }
  } else {
    // Actualizar inventario existente
    const inventoryDoc = inventorySnapshot.docs[0];
    const currentData = inventoryDoc.data();
    const currentStock = parseFloat(currentData.currentStock) || 0;
    
    let newStock;
    if (movement.type === 'entrada') {
      newStock = currentStock + movement.quantity;
    } else {
      // Validar stock suficiente para salida
      if (currentStock < movement.quantity) {
        throw new Error(`Stock insuficiente. Disponible: ${currentStock}, Solicitado: ${movement.quantity}`);
      }
      newStock = currentStock - movement.quantity;
    }
    
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
    console.log(`📦 [WEBHOOK] Inventario actualizado: ${currentStock} ${movement.type === 'entrada' ? '+' : '-'} ${movement.quantity} = ${newStock}`);
  }
}
