# 🚀 Guía Configuración N8N - Versión GRATUITA - Bot Telegram ForeTech

## 📋 Resumen

Esta guía está especialmente diseñada para la **versión gratuita de N8N**, sin requerir variables de entorno ni características de pago. Todo está configurado directamente en el JSON del workflow.

## ⚡ Configuración Rápida (Solo Versión Gratuita)

### ✅ **Lo que SÍ puedes usar en versión gratuita:**

- ✅ Importar workflows completos
- ✅ Credenciales de servicios (Telegram API)
- ✅ Todos los nodos básicos
- ✅ Funciones JavaScript personalizadas
- ✅ HTTP Requests con headers fijos

### ❌ **Lo que NO está disponible en versión gratuita:**

- ❌ Variables de entorno (`$vars`)
- ❌ Workflows programados avanzados
- ❌ Algunos nodos premium

## 🔧 Configuración Paso a Paso - Versión Gratuita

### Paso 1: Crear Bot de Telegram

1. **Abrir Telegram** y buscar `@BotFather`
2. **Enviar comando:** `/newbot`
3. **Nombrar el bot:** `ForeTech Combustibles Bot`
4. **Elegir username:** `@forestech_combustibles_bot` (o similar disponible)
5. **Copiar el token** proporcionado (formato: `123456789:ABC123def456ghi789jkl`)

6. **Configurar comandos del bot:**
   ```
   /setcommands
   entrada - Registrar entrada de combustible
   help - Mostrar ayuda
   ```

### Paso 2: Crear Credencial de Telegram en N8N

1. **Ir a N8N** → `Credentials` (en el menú lateral)
2. **Hacer clic:** `Add first credential` o `+`
3. **Buscar:** `Telegram API`
4. **Configurar:**
   - **Credential name:** `ForeTech Combustibles Bot`
   - **Access Token:** `[PEGAR_TOKEN_DE_BOTFATHER_AQUÍ]`
5. **Hacer clic:** `Save`

### Paso 3: Importar Workflow (Versión Gratuita)

1. **En N8N**, hacer clic en `+` para crear nuevo workflow
2. **Hacer clic en el menú** (3 puntos) → `Import from URL or file`
3. **Pegar el JSON completo** del archivo `N8N_WORKFLOW_FREE_VERSION.json` (ver abajo)
4. **Hacer clic:** `Import`

### Paso 4: Asignar Credenciales

Una vez importado el workflow, verás algunos nodos en rojo (sin credenciales):

1. **Hacer clic en "Telegram Trigger"**
   - En `Credential to connect with`, seleccionar: `ForeTech Combustibles Bot`

2. **Hacer clic en "Enviar Respuesta Exitosa"**
   - En `Credential to connect with`, seleccionar: `ForeTech Combustibles Bot`

3. **Hacer clic en "Enviar Mensaje Directo"**
   - En `Credential to connect with`, seleccionar: `ForeTech Combustibles Bot`

### Paso 5: Activar Workflow

1. **En la parte superior del workflow**, activar el switch (debe volverse verde)
2. **Verificar** que dice "Active"
3. ¡Ya está listo para recibir mensajes!

## 📱 **JSON Completo - Versión Gratuita**

```json
{
  "name": "Bot Telegram - Combustibles ForeTech (FREE)",
  "nodes": [
    {
      "parameters": {
        "updates": ["message"]
      },
      "name": "Telegram Trigger",
      "type": "n8n-nodes-base.telegramTrigger",
      "typeVersion": 1,
      "position": [240, 300],
      "credentials": {
        "telegramApi": "ForeTech Combustibles Bot"
      }
    },
    {
      "parameters": {
        "functionCode": "// FUNCIÓN COMPLETA PARA PROCESAR COMANDOS TELEGRAM\n// Versión optimizada para N8N gratuito\n\nconst message = $json.message;\nconst text = message.text || '';\nconst userId = message.from.id;\nconst username = message.from.username || message.from.first_name;\nconst chatId = message.chat.id;\n\nconsole.log('📨 Mensaje recibido:', text);\nconsole.log('👤 Usuario:', username, 'ID:', userId);\n\n// COMANDOS SOPORTADOS\nconst commands = {\n  '/entrada': 'create_entry',\n  '/help': 'show_help',\n  '/start': 'show_help'\n};\n\n// ANALIZAR COMANDO\nlet command = null;\nlet params = [];\n\nif (text.startsWith('/')) {\n  const parts = text.trim().split(' ');\n  command = parts[0].toLowerCase();\n  params = parts.slice(1);\n} else if (text.toLowerCase().includes('entrada')) {\n  command = '/entrada';\n  params = text.split(' ');\n}\n\n// VALIDAR COMANDO\nif (!commands[command]) {\n  return [{\n    json: {\n      action: 'send_message',\n      chatId: chatId,\n      message: `❌ Comando no reconocido: ${command || text}\\n\\n🤖 **Comandos disponibles:**\\n\\n/entrada - Registrar entrada de combustible\\n/help - Mostrar ayuda\\n\\n📝 **Ejemplo:**\\n/entrada DIESEL 500 15000 Proveedor principal`\n    }\n  }];\n}\n\n// PROCESAR COMANDO /entrada\nif (commands[command] === 'create_entry') {\n  let fuelType, quantity, unitPrice, supplier, location;\n  \n  if (params.length >= 4) {\n    // FORMATO: /entrada DIESEL 500 15000 Proveedor [ubicacion]\n    fuelType = params[0].toUpperCase();\n    quantity = parseFloat(params[1]);\n    unitPrice = parseFloat(params[2]);\n    supplier = params[3];\n    location = params[4] || 'principal';\n    \n  } else {\n    // PARSING INTELIGENTE PARA FORMATO NATURAL\n    const textLower = text.toLowerCase();\n    \n    // Extraer cantidad\n    const quantityMatch = textLower.match(/(\\d+(?:\\.\\d+)?)\\s*(?:galones?|gal)/);\n    quantity = quantityMatch ? parseFloat(quantityMatch[1]) : null;\n    \n    // Extraer precio\n    const priceMatch = textLower.match(/(?:a|precio|costo)\\s*(\\d+(?:\\.\\d+)?)/);\n    unitPrice = priceMatch ? parseFloat(priceMatch[1]) : null;\n    \n    // Extraer combustible\n    if (textLower.includes('diesel')) fuelType = 'DIESEL';\n    else if (textLower.includes('gasolina')) fuelType = 'GASOLINA';\n    else if (textLower.includes('extra')) fuelType = 'EXTRA';\n    else if (textLower.includes('corriente')) fuelType = 'CORRIENTE';\n    \n    // Extraer proveedor\n    const supplierMatch = textLower.match(/proveedor\\s+([a-záéíóúñ\\s]+)/);\n    supplier = supplierMatch ? supplierMatch[1].trim() : 'Proveedor Telegram';\n    \n    // Extraer ubicación\n    if (textLower.includes('austria')) location = 'austria';\n    else if (textLower.includes('ilusion')) location = 'ilusion';\n    else if (textLower.includes('deposito')) location = 'deposito';\n    else location = 'principal';\n  }\n  \n  // VALIDAR DATOS\n  if (!fuelType || !quantity || !unitPrice || quantity <= 0 || unitPrice < 0) {\n    return [{\n      json: {\n        action: 'send_message',\n        chatId: chatId,\n        message: `❌ **Datos incompletos**\\n\\n📝 **Formato correcto:**\\n/entrada DIESEL 500 15000 Proveedor principal\\n\\n**Parámetros:**\\n• Combustible: DIESEL, GASOLINA, EXTRA, CORRIENTE\\n• Cantidad: galones (número positivo)\\n• Precio: precio por galón\\n• Proveedor: nombre del proveedor\\n• Ubicación: principal, austria, ilusion, deposito (opcional)`\n      }\n    }];\n  }\n  \n  // LÍMITES DE SEGURIDAD\n  if (quantity > 5000) {\n    return [{\n      json: {\n        action: 'send_message',\n        chatId: chatId,\n        message: `⚠️ **Cantidad excesiva**\\n\\nLa cantidad máxima permitida desde Telegram es 5,000 galones.\\nCantidad solicitada: ${quantity} galones`\n      }\n    }];\n  }\n  \n  const totalValue = quantity * unitPrice;\n  if (totalValue > 50000000) {\n    return [{\n      json: {\n        action: 'send_message', \n        chatId: chatId,\n        message: `⚠️ **Valor excesivo**\\n\\nEl valor máximo permitido desde Telegram es $50,000,000 COP.\\nValor calculado: $${totalValue.toLocaleString('es-CO')}`\n      }\n    }];\n  }\n  \n  // DATOS PARA CREAR MOVIMIENTO\n  return [{\n    json: {\n      action: 'create_movement',\n      movementData: {\n        fuelType: fuelType,\n        quantity: quantity,\n        unitPrice: unitPrice,\n        supplier: supplier,\n        location: location,\n        date: new Date().toISOString()\n      },\n      telegramData: {\n        userId: userId,\n        username: username,\n        chatId: chatId,\n        originalMessage: text\n      }\n    }\n  }];\n}\n\n// COMANDO DE AYUDA\nif (commands[command] === 'show_help') {\n  return [{\n    json: {\n      action: 'send_message',\n      chatId: chatId,\n      message: `🤖 **Bot ForeTech Combustibles**\\n\\n📋 **Comandos:**\\n\\n/entrada - Registrar entrada de combustible\\n/help - Mostrar esta ayuda\\n\\n📝 **Ejemplos:**\\n\\n**Formato simple:**\\n/entrada DIESEL 500 15000 Proveedor principal\\n\\n**Formato detallado:**\\n/entrada GASOLINA 1000 12500 \\\"Shell Colombia\\\" austria\\n\\n**Parámetros:**\\n• Combustible: DIESEL, GASOLINA, EXTRA, CORRIENTE\\n• Cantidad: en galones (máx 5,000)\\n• Precio: por galón en pesos\\n• Proveedor: nombre\\n• Ubicación: principal, austria, ilusion, deposito\\n\\n📞 **Soporte:** Contacta al administrador`\n    }\n  }];\n}"
      },
      "name": "Procesar Comando",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "id": "create_movement",
              "leftValue": "={{ $json.action }}",
              "rightValue": "create_movement",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            },
            {
              "id": "send_message",
              "leftValue": "={{ $json.action }}",
              "rightValue": "send_message",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ]
        }
      },
      "name": "Switch Acción",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [680, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://us-central1-forestech-01.cloudfunctions.net/combustiblesWebhookReceiver",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Authorization",
              "value": "Bearer forestech_webhook_2024"
            },
            {
              "name": "User-Agent",
              "value": "N8N-Telegram-Bot/1.0"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"action\": \"create_movement\",\n  \"movementData\": {\n    \"type\": \"entrada\",\n    \"fuelType\": \"{{ $json.movementData.fuelType }}\",\n    \"quantity\": {{ $json.movementData.quantity }},\n    \"unitPrice\": {{ $json.movementData.unitPrice }},\n    \"supplierName\": \"{{ $json.movementData.supplier }}\",\n    \"destinationLocation\": \"{{ $json.movementData.location }}\",\n    \"effectiveDate\": \"{{ $json.movementData.date }}\",\n    \"description\": \"Entrada desde Telegram por {{ $json.telegramData.username }}\",\n    \"telegramUserId\": \"{{ $json.telegramData.userId }}\",\n    \"telegramUsername\": \"{{ $json.telegramData.username }}\"\n  },\n  \"source\": \"telegram\",\n  \"n8nExecutionId\": \"{{ $execution.id }}\",\n  \"timestamp\": \"{{ $now }}\"\n}"
      },
      "name": "Crear en Firebase",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [900, 200]
    },
    {
      "parameters": {
        "functionCode": "// PROCESAR RESPUESTA DE FIREBASE\nconst response = $input.first().json;\nconst telegramData = $('Procesar Comando').first().json.telegramData;\n\nif (response.success) {\n  const movement = response.data;\n  const totalValue = movement.quantity * movement.unitPrice;\n  \n  const message = `✅ **Entrada registrada**\\n\\n` +\n    `📥 **ID:** ${response.movementId.substring(0, 8)}...\\n` +\n    `⛽ **Combustible:** ${movement.fuelType}\\n` +\n    `📊 **Cantidad:** ${movement.quantity} galones\\n` +\n    `💰 **Precio:** $${movement.unitPrice.toLocaleString('es-CO')} /gal\\n` +\n    `🏪 **Proveedor:** ${movement.supplierName}\\n` +\n    `📍 **Destino:** ${movement.destinationLocation}\\n` +\n    `💵 **Total:** $${totalValue.toLocaleString('es-CO')}\\n\\n` +\n    `🕐 ${new Date().toLocaleString('es-CO')}`;\n  \n  return [{\n    json: {\n      action: 'send_message',\n      chatId: telegramData.chatId,\n      message: message\n    }\n  }];\n} else {\n  const errorMessage = `❌ **Error al registrar**\\n\\n` +\n    `🔍 ${response.error}\\n\\n` +\n    `💡 Verifica el formato y reintenta.\\n\\n` +\n    `📝 Ejemplo: /entrada DIESEL 500 15000 Proveedor principal`;\n  \n  return [{\n    json: {\n      action: 'send_message',\n      chatId: telegramData.chatId,\n      message: errorMessage\n    }\n  }];\n}"
      },
      "name": "Procesar Respuesta",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [1120, 200]
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "sendMessage",
        "chatId": "={{ $json.chatId }}",
        "text": "={{ $json.message }}",
        "additionalFields": {
          "parse_mode": "Markdown"
        }
      },
      "name": "Enviar Respuesta",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.1,
      "position": [1340, 200],
      "credentials": {
        "telegramApi": "ForeTech Combustibles Bot"
      }
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "sendMessage",
        "chatId": "={{ $json.chatId }}",
        "text": "={{ $json.message }}",
        "additionalFields": {
          "parse_mode": "Markdown"
        }
      },
      "name": "Enviar Mensaje",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.1,
      "position": [900, 400],
      "credentials": {
        "telegramApi": "ForeTech Combustibles Bot"
      }
    }
  ],
  "connections": {
    "Telegram Trigger": {
      "main": [
        [
          {
            "node": "Procesar Comando",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Procesar Comando": {
      "main": [
        [
          {
            "node": "Switch Acción",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Switch Acción": {
      "main": [
        [
          {
            "node": "Crear en Firebase",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Enviar Mensaje",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Crear en Firebase": {
      "main": [
        [
          {
            "node": "Procesar Respuesta",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Procesar Respuesta": {
      "main": [
        [
          {
            "node": "Enviar Respuesta",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "tags": [],
  "triggerCount": 1,
  "versionId": "1"
}
```

## 🧪 **Testing del Bot**

### Test 1: Ayuda

```
Enviar: /help
Esperado: Mensaje con comandos disponibles
```

### Test 2: Entrada Simple

```
Enviar: /entrada DIESEL 500 15000 Proveedor principal
Esperado: Confirmación de entrada registrada
```

### Test 3: Entrada con Ubicación

```
Enviar: /entrada GASOLINA 800 12500 Shell austria
Esperado: Confirmación con ubicación austria
```

### Test 4: Error de Formato

```
Enviar: /entrada datos incorrectos
Esperado: Mensaje de error con formato correcto
```

## 🔧 **Diferencias vs Versión de Pago**

### ✅ **Funciona Igual:**

- Todos los comandos de Telegram
- Creación de movimientos en Firebase
- Validaciones completas
- Manejo de errores
- Respuestas formateadas

### 🔄 **Adaptaciones Hechas:**

- Token de autenticación fijo en lugar de variable
- URLs hardcodeadas en el JSON
- Sin variables de entorno
- Configuración directa en nodos

## 📞 **Soporte Versión Gratuita**

Si tienes problemas:

1. **Verificar credencial de Telegram** - Debe estar asignada a todos los nodos de Telegram
2. **Revisar logs** - En `Executions` puedes ver cada ejecución
3. **Probar paso a paso** - Ejecutar workflow manualmente para debugging

## ✅ **Checklist Versión Gratuita**

- [ ] Bot creado en @BotFather ✅
- [ ] Token copiado ✅
- [ ] Credencial creada en N8N ✅
- [ ] JSON importado ✅
- [ ] Credenciales asignadas a nodos ✅
- [ ] Workflow activado ✅
- [ ] Test con /help exitoso ✅
- [ ] Test de entrada exitoso ✅

**¡Listo! Tu bot funcionará perfectamente con la versión gratuita de N8N! 🎉**

---

_Versión optimizada para N8N Free - Enero 2025_
