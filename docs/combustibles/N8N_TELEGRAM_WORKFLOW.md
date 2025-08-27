# 🤖 Workflow N8N para Bot de Telegram - Movimientos de Combustibles

## 📋 Descripción General

Este documento describe la configuración completa del workflow N8N que permite crear movimientos tipo ENTRADA en la aplicación de combustibles mediante un bot de Telegram.

## 🏗️ Arquitectura del Workflow

```
Telegram → N8N → Firebase Cloud Functions → Firestore → Webhook Respuesta → Telegram
```

## 🔧 Nodos Requeridos y Configuración

### 1. **Nodo: Telegram Trigger**

- **Tipo:** `Telegram Trigger`
- **Nombre:** `Telegram Bot Webhook`

#### Configuración:

```json
{
  "botToken": "TU_TELEGRAM_BOT_TOKEN",
  "webhookUrl": "https://n8n.forestechdecolombia.com.co/webhook/telegram-combustibles",
  "updates": ["message"],
  "parseMode": "Markdown"
}
```

#### Variables de Entorno:

- `TELEGRAM_BOT_TOKEN`: Token del bot de Telegram

---

### 2. **Nodo: Function - Procesar Comando**

- **Tipo:** `Function`
- **Nombre:** `Procesar Comando Telegram`

#### Código JavaScript:

```javascript
// Obtener datos del mensaje de Telegram
const message = $input.first().json.message;
const text = message.text || '';
const userId = message.from.id;
const username = message.from.username || message.from.first_name;
const chatId = message.chat.id;

// Log para debugging
console.log('Mensaje recibido:', text);
console.log('Usuario:', username, 'ID:', userId);

// Comandos soportados
const commands = {
  '/entrada': 'create_entry',
  '/stock': 'check_stock',
  '/help': 'show_help',
  '/start': 'show_help',
};

// Analizar comando
let command = null;
let params = [];

if (text.startsWith('/')) {
  const parts = text.trim().split(' ');
  command = parts[0];
  params = parts.slice(1);
} else if (text.toLowerCase().includes('entrada')) {
  command = '/entrada';
  params = text.split(' ');
}

// Validar comando
if (!commands[command]) {
  return [
    {
      json: {
        action: 'send_message',
        chatId: chatId,
        message: `❌ Comando no reconocido: ${command}\n\nComandos disponibles:\n/entrada - Registrar entrada de combustible\n/stock - Consultar inventario\n/help - Mostrar ayuda`,
      },
    },
  ];
}

// Procesar comando /entrada
if (commands[command] === 'create_entry') {
  // Formato esperado: /entrada DIESEL 500 15000 "Proveedor XYZ" austria
  // O formato natural: entrada de 500 galones de diesel a 15000 del proveedor xyz en austria

  let fuelType, quantity, unitPrice, supplier, location;

  if (params.length >= 5) {
    // Formato estructurado
    fuelType = params[0];
    quantity = parseFloat(params[1]);
    unitPrice = parseFloat(params[2]);
    supplier = params[3].replace(/"/g, '');
    location = params[4];
  } else {
    // Formato natural - parsing inteligente
    const textLower = text.toLowerCase();

    // Extraer cantidad
    const quantityMatch = textLower.match(/(\d+(?:\.\d+)?)\s*(?:galones?|litros?|gal|l)/);
    quantity = quantityMatch ? parseFloat(quantityMatch[1]) : null;

    // Extraer precio
    const priceMatch = textLower.match(/(?:a|precio|costo|vale)\s*(\d+(?:\.\d+)?)/);
    unitPrice = priceMatch ? parseFloat(priceMatch[1]) : null;

    // Extraer tipo de combustible
    if (textLower.includes('diesel') || textLower.includes('acpm')) {
      fuelType = 'DIESEL';
    } else if (textLower.includes('gasolina') || textLower.includes('gas')) {
      fuelType = 'GASOLINA';
    } else if (textLower.includes('extra') || textLower.includes('premium')) {
      fuelType = 'EXTRA';
    } else if (textLower.includes('corriente')) {
      fuelType = 'CORRIENTE';
    }

    // Extraer proveedor
    const supplierMatch = textLower.match(/proveedor\s+([^,\s]+(?:\s+[^,\s]+)*)/);
    supplier = supplierMatch ? supplierMatch[1] : 'Proveedor desde Telegram';

    // Extraer ubicación
    if (textLower.includes('austria')) {
      location = 'austria';
    } else if (textLower.includes('ilusion') || textLower.includes('ilusión')) {
      location = 'ilusion';
    } else if (textLower.includes('deposito') || textLower.includes('depósito')) {
      location = 'deposito';
    } else {
      location = 'principal';
    }
  }

  // Validar datos extraídos
  if (!fuelType || !quantity || !unitPrice) {
    return [
      {
        json: {
          action: 'send_message',
          chatId: chatId,
          message: `❌ Datos incompletos para registrar entrada.\n\n📝 **Formato correcto:**\n\`/entrada DIESEL 500 15000 "Proveedor XYZ" austria\`\n\n📝 **O formato natural:**\n\`entrada de 500 galones de diesel a 15000 del proveedor xyz en austria\`\n\n**Parámetros:**\n• Combustible: DIESEL, GASOLINA, EXTRA, CORRIENTE\n• Cantidad: número en galones\n• Precio: precio por galón\n• Proveedor: nombre del proveedor\n• Ubicación: principal, austria, ilusion, deposito`,
        },
      },
    ];
  }

  // Retornar datos para crear movimiento
  return [
    {
      json: {
        action: 'create_movement',
        movementData: {
          fuelType: fuelType,
          quantity: quantity,
          unitPrice: unitPrice,
          supplier: supplier || 'Proveedor desde Telegram',
          location: location || 'principal',
          date: new Date().toISOString(),
        },
        telegramData: {
          userId: userId,
          username: username,
          chatId: chatId,
          originalMessage: text,
        },
      },
    },
  ];
}

// Comando de ayuda
if (commands[command] === 'show_help') {
  return [
    {
      json: {
        action: 'send_message',
        chatId: chatId,
        message: `🤖 **Bot de Combustibles ForeTech**\n\n📋 **Comandos disponibles:**\n\n🔹 \`/entrada\` - Registrar entrada de combustible\n🔹 \`/stock\` - Consultar inventario actual\n🔹 \`/help\` - Mostrar esta ayuda\n\n📝 **Ejemplo de entrada:**\n\`/entrada DIESEL 500 15000 "Proveedor XYZ" austria\`\n\nO en formato natural:\n\`entrada de 500 galones de diesel a 15000 del proveedor xyz en austria\`\n\n📞 **Soporte:** Contacta al administrador del sistema`,
      },
    },
  ];
}

// Consulta de stock (por implementar)
if (commands[command] === 'check_stock') {
  return [
    {
      json: {
        action: 'send_message',
        chatId: chatId,
        message: `📊 **Consulta de Inventario**\n\n🔧 Esta funcionalidad estará disponible próximamente.\n\nPor ahora, puedes consultar el inventario directamente en la aplicación web.`,
      },
    },
  ];
}
```

---

### 3. **Nodo: Switch - Determinar Acción**

- **Tipo:** `Switch`
- **Nombre:** `Determinar Acción`

#### Configuración:

```json
{
  "mode": "expression",
  "rules": [
    {
      "output": 0,
      "expression": "{{ $json.action === 'create_movement' }}"
    },
    {
      "output": 1,
      "expression": "{{ $json.action === 'send_message' }}"
    }
  ]
}
```

---

### 4. **Nodo: HTTP Request - Crear Movimiento**

- **Tipo:** `HTTP Request`
- **Nombre:** `Crear Movimiento en Firebase`

#### Configuración:

```json
{
  "method": "POST",
  "url": "https://us-central1-forestech-01.cloudfunctions.net/combustiblesWebhookReceiver",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer {{ $vars.WEBHOOK_SECRET_TOKEN }}",
    "User-Agent": "N8N-Telegram-Bot/1.0"
  },
  "body": {
    "action": "create_movement",
    "movementData": {
      "type": "entrada",
      "fuelType": "{{ $json.movementData.fuelType }}",
      "quantity": "{{ $json.movementData.quantity }}",
      "unitPrice": "{{ $json.movementData.unitPrice }}",
      "supplierName": "{{ $json.movementData.supplier }}",
      "destinationLocation": "{{ $json.movementData.location }}",
      "effectiveDate": "{{ $json.movementData.date }}",
      "description": "Entrada registrada desde Telegram por {{ $json.telegramData.username }}",
      "telegramUserId": "{{ $json.telegramData.userId }}",
      "telegramUsername": "{{ $json.telegramData.username }}"
    },
    "source": "telegram",
    "n8nExecutionId": "{{ $execution.id }}",
    "timestamp": "{{ $now }}"
  }
}
```

#### Variables de Entorno:

- `WEBHOOK_SECRET_TOKEN`: `forestech_webhook_2024`

---

### 5. **Nodo: Function - Procesar Respuesta**

- **Tipo:** `Function`
- **Nombre:** `Procesar Respuesta Firebase`

#### Código JavaScript:

```javascript
const response = $input.first().json;
const telegramData = $('Procesar Comando Telegram').first().json.telegramData;

if (response.success) {
  const movement = response.data;
  const totalValue = movement.quantity * movement.unitPrice;

  const message =
    `✅ **Entrada registrada exitosamente**\n\n` +
    `📥 **ID:** ${response.movementId.substring(0, 8)}...\n` +
    `⛽ **Combustible:** ${movement.fuelType}\n` +
    `📊 **Cantidad:** ${movement.quantity} galones\n` +
    `💰 **Precio:** $${movement.unitPrice.toLocaleString('es-CO')} por galón\n` +
    `🏪 **Proveedor:** ${movement.supplierName}\n` +
    `📍 **Destino:** ${movement.destinationLocation}\n` +
    `💵 **Valor Total:** $${totalValue.toLocaleString('es-CO')}\n\n` +
    `🕐 **Registrado:** ${new Date().toLocaleString('es-CO')}`;

  return [
    {
      json: {
        action: 'send_message',
        chatId: telegramData.chatId,
        message: message,
        parseMode: 'Markdown',
      },
    },
  ];
} else {
  const errorMessage =
    `❌ **Error al registrar entrada**\n\n` +
    `🔍 **Detalles:** ${response.error}\n\n` +
    `💡 **Sugerencia:** Verifica el formato y vuelve a intentar.\n\n` +
    `📝 **Formato correcto:**\n\`/entrada DIESEL 500 15000 "Proveedor XYZ" austria\``;

  return [
    {
      json: {
        action: 'send_message',
        chatId: telegramData.chatId,
        message: errorMessage,
        parseMode: 'Markdown',
      },
    },
  ];
}
```

---

### 6. **Nodo: Telegram - Enviar Respuesta**

- **Tipo:** `Telegram`
- **Nombre:** `Enviar Respuesta a Usuario`

#### Configuración:

```json
{
  "resource": "message",
  "operation": "sendMessage",
  "chatId": "={{ $json.chatId }}",
  "text": "={{ $json.message }}",
  "parseMode": "Markdown",
  "disableNotification": false
}
```

---

## 🌊 Flujo del Workflow

1. **Telegram Trigger** recibe mensaje del usuario
2. **Function** procesa el comando y extrae parámetros
3. **Switch** determina qué acción tomar
4. **HTTP Request** envía datos a Firebase (si es movimiento)
5. **Function** procesa la respuesta de Firebase
6. **Telegram** envía respuesta al usuario

## 🔐 Variables de Entorno Requeridas

```bash
# N8N Environment Variables
TELEGRAM_BOT_TOKEN=tu_bot_token_aqui
WEBHOOK_SECRET_TOKEN=forestech_webhook_2024
FIREBASE_PROJECT_ID=forestech-01
```

## 🎯 Comandos de Telegram Soportados

### `/entrada` - Registrar entrada de combustible

**Formato estructurado:**

```
/entrada DIESEL 500 15000 "Proveedor XYZ" austria
```

**Formato natural:**

```
entrada de 500 galones de diesel a 15000 del proveedor xyz en austria
```

**Parámetros:**

- **Combustible:** `DIESEL`, `GASOLINA`, `EXTRA`, `CORRIENTE`
- **Cantidad:** Número en galones
- **Precio:** Precio por galón en pesos colombianos
- **Proveedor:** Nombre del proveedor (entre comillas si tiene espacios)
- **Ubicación:** `principal`, `austria`, `ilusion`, `deposito`

### `/help` - Mostrar ayuda

Muestra información sobre comandos disponibles y ejemplos de uso.

### `/stock` - Consultar inventario

_(Funcionalidad futura)_

## 📝 Ejemplos de Uso

```bash
# Entrada de diesel
/entrada DIESEL 1000 14500 "Petrolios SA" austria

# Entrada de gasolina formato natural
entrada de 800 galones de gasolina a 12500 del proveedor shell en principal

# Solicitar ayuda
/help

# Consultar inventario (futuro)
/stock
```

## 🚨 Validaciones Implementadas

### En N8N:

- Validación de formato de comando
- Extracción inteligente de parámetros
- Validación de datos requeridos

### En Firebase:

- Autenticación por token
- Validación de estructura de datos
- Límites de cantidad y valor
- Validación de tipos de combustible y ubicaciones
- Validación de origen (solo ENTRADA desde externos)

## 🔍 Monitoreo y Logs

### N8N:

- Logs de ejecución en dashboard N8N
- Métricas de éxito/error por workflow

### Firebase:

- Console logs en Cloud Functions
- Métricas en Firebase Console
- Notificaciones automáticas a webhook existente

## 🛠️ Troubleshooting

### Error: "Token de autenticación inválido"

- Verificar variable `WEBHOOK_SECRET_TOKEN` en N8N
- Confirmar que coincide con valor en Firebase

### Error: "Datos incompletos"

- Verificar formato del comando
- Usar formato estructurado si el natural falla

### Error: "Combustible no válido"

- Usar solo: `DIESEL`, `GASOLINA`, `EXTRA`, `CORRIENTE`

### Error: "Ubicación no válida"

- Usar solo: `principal`, `austria`, `ilusion`, `deposito`

## 📞 Soporte

Para soporte técnico:

1. Revisar logs en N8N dashboard
2. Verificar logs en Firebase Console
3. Contactar administrador del sistema

---

_Documentación actualizada: Enero 2025_
_Versión: 1.0_
