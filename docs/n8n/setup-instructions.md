# 🚀 **CONFIGURACIÓN N8N - ALERTAS SSR FORESTECH**

## ✅ **ESTADO ACTUAL**

- ✅ n8n ejecutándose en: `https://n8n.forestechdecolombia.com.co`
- ✅ VM: `servern-n8n-forestech` en Google Cloud
- ✅ Workflow JSON creado: `workflow-ssr-alerts.json`
- ✅ Configuración JS creada: `ssr-webhook-config.js`

## 🎯 **PASOS MANUALES PARA COMPLETAR CONFIGURACIÓN**

### 1️⃣ **ACCEDER A N8N**

```
🌐 URL: https://n8n.forestechdecolombia.com.co
👤 Usuario: [tu usuario de n8n]
🔑 Contraseña: [tu contraseña de n8n]
```

### 2️⃣ **HABILITAR API (SI NO ESTÁ HABILITADA)**

1. En n8n, ir a: **Settings → API Keys**
2. Crear nuevo API Key: `forestech-ssr-alerts`
3. Guardar el token generado

### 3️⃣ **IMPORTAR WORKFLOW**

**Opción A - Via Interfaz Web:**

1. En n8n: **File → Import from file**
2. Seleccionar: `/home/hp/Documents/forestech/docs/n8n/workflow-ssr-alerts.json`
3. Confirmar importación

**Opción B - Via Copy/Paste:**

1. Abrir archivo local: `workflow-ssr-alerts.json`
2. Copiar todo el contenido JSON
3. En n8n: **File → Import from clipboard**
4. Pegar y confirmar

### 4️⃣ **CONFIGURAR CREDENCIALES**

#### 📧 **Gmail (Para emails de alertas)**

1. En n8n: **Settings → Credentials → Add credential**
2. Tipo: **Gmail OAuth2 API**
3. Configurar con cuenta: `cardenasever072@gmail.com`
4. Autorizar acceso

#### 📱 **WhatsApp Business API**

1. Credencial tipo: **HTTP Header Auth**
2. Name: `whatsapp-business`
3. Header Name: `Authorization`
4. Header Value: `Bearer [tu-token-whatsapp]`

#### 💬 **Slack Webhook**

1. Crear webhook en Slack workspace
2. En workflow, actualizar URL de Slack:
   ```json
   "url": "https://hooks.slack.com/services/TU_WEBHOOK_URL"
   ```

### 5️⃣ **ACTIVAR WEBHOOK Y OBTENER URL**

1. En workflow importado, click en nodo **"SSR Alerts Webhook"**
2. Copiar **Production URL** (algo como):
   ```
   https://n8n.forestechdecolombia.com.co/webhook/ssr-alerts
   ```
3. ✅ **ACTIVAR EL WORKFLOW** (botón toggle en la esquina superior)

### 6️⃣ **INTEGRAR CON TU SISTEMA SSR**

En tu endpoint `/ssr-alerts`, agregar esta función:

```javascript
// En tu sistema de alertas SSR
const sendToN8N = async (alertData) => {
  const webhookUrl = 'https://n8n.forestechdecolombia.com.co/webhook/ssr-alerts';

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alert_type: alertData.type, // ERROR_SPIKE, SLOW_RESPONSE, HIGH_MEMORY
        severity: alertData.severity, // high, critical
        timestamp: new Date().toISOString(),
        description: alertData.description,
        response_time: alertData.metrics.responseTime,
        memory_usage: alertData.metrics.memoryUsage,
        cpu_usage: alertData.metrics.cpuUsage,
        error_rate: alertData.metrics.errorRate,
      }),
    });

    console.log('✅ Alerta enviada a n8n:', response.status);
  } catch (error) {
    console.error('❌ Error enviando alerta a n8n:', error);
  }
};

// Ejemplo de uso
if (errorRate > 25) {
  sendToN8N({
    type: 'ERROR_SPIKE',
    severity: 'critical',
    description: `Pico de errores detectado: ${errorRate} errores/min`,
    metrics: {
      responseTime: currentResponseTime,
      memoryUsage: currentMemoryUsage,
      cpuUsage: currentCpuUsage,
      errorRate: errorRate,
    },
  });
}
```

## 🧪 **PROBAR EL WORKFLOW**

### Test Payload (usar en n8n o Postman):

```json
{
  "alert_type": "ERROR_SPIKE",
  "severity": "critical",
  "timestamp": "2025-08-19T13:15:00.000Z",
  "description": "Pico crítico de errores detectado en sistema SSR",
  "response_time": 3500,
  "memory_usage": 850,
  "cpu_usage": 95,
  "error_rate": 28
}
```

### Enviar a:

```
POST https://n8n.forestechdecolombia.com.co/webhook/ssr-alerts
Content-Type: application/json
```

## 📊 **RESULTADOS ESPERADOS**

- ✅ **Email crítico** → `cardenasever072@gmail.com`
- ✅ **WhatsApp crítico** → Tu número configurado
- ✅ **Slack notification** → Canal #forestech-alerts
- ✅ **Response confirmación** → JSON con status success

## 🔧 **TROUBLESHOOTING**

- **Error 404 webhook**: Verificar que workflow esté ACTIVADO
- **Error credenciales**: Revisar configuración Gmail/WhatsApp/Slack
- **No llegan emails**: Verificar bandeja spam y OAuth2 configurado
- **Timeout**: Revisar que n8n esté ejecutándose correctamente

---

**🚀 LISTO PARA FASE 1.1 - ALERTAS AUTOMÁTICAS SSR → NOTIFICACIONES**
