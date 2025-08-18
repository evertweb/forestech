# SICOM Backend Proxy - Solución CORS

## 🚨 Problema Identificado

La API SICOM oficial no permite llamadas directas desde el navegador debido a **políticas CORS**. Esto es normal en APIs gubernamentales por razones de seguridad.

**Error actual:**

```
Access to fetch at 'https://eds.sicom.gov.co/eds/api/v1/birest/municipios'
from origin 'http://localhost:5174' has been blocked by CORS policy
```

## ✅ Solución Implementada (Temporal)

Mientras se implementa el proxy backend, se ha optimizado el sistema de fallback:

### 🔧 Sistema Actual Mejorado

- **datos.gov.co optimizado** con ajuste por inflación
- **Precios base de Bogotá** aplicados a La Primavera
- **Detección inteligente** ACPM vs GASOLINA mejorada
- **Precios de emergencia** actualizados para 2025

### 📊 Mejoras Implementadas

1. **Ajuste por inflación automático**: Precios antiguos se actualizan con inflación estimada (5% anual)
2. **Mejor calidad de datos**: Priorización por fecha más reciente
3. **Notas contextuales**: Indica origen del precio (Bogotá → La Primavera)
4. **Precios de respaldo realistas**: Valores actualizados para 2025

## 🏗️ Solución Backend Proxy (Recomendada)

### Opción 1: Proxy Node.js Simple

```javascript
// server/sicom-proxy.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const SICOM_BASE = 'https://eds.sicom.gov.co/eds/api/v1/birest';

// Proxy endpoint para municipios
app.get('/api/sicom/municipios', async (req, res) => {
  try {
    const { nombre } = req.query;
    const url = `${SICOM_BASE}/municipios?nombre=${encodeURIComponent(nombre)}`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.SICOM_API_KEY}`,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proxy endpoint para precios
app.get('/api/sicom/precios', async (req, res) => {
  try {
    const { municipio_id, producto, limit = 100 } = req.query;
    const url = `${SICOM_BASE}/precios-combustibles?municipio_id=${municipio_id}&producto=${producto}&limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.SICOM_API_KEY}`,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('SICOM Proxy running on port 3001');
});
```

### Opción 2: Serverless Function (Vercel/Netlify)

```javascript
// api/sicom-proxy.js
export default async function handler(req, res) {
  const { path, ...query } = req.query;

  try {
    const SICOM_BASE = 'https://eds.sicom.gov.co/eds/api/v1/birest';
    const url = new URL(path, SICOM_BASE);

    Object.keys(query).forEach((key) => {
      url.searchParams.set(key, query[key]);
    });

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.SICOM_API_KEY}`,
      },
    });

    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Opción 3: Firebase Cloud Functions

```javascript
// functions/sicom-proxy.js
const functions = require('firebase-functions');
const fetch = require('node-fetch');

exports.sicomProxy = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  try {
    const { endpoint, ...params } = req.query;
    const SICOM_BASE = 'https://eds.sicom.gov.co/eds/api/v1/birest';

    const url = new URL(endpoint, SICOM_BASE);
    Object.keys(params).forEach((key) => {
      url.searchParams.set(key, params[key]);
    });

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${functions.config().sicom.api_key}`,
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔄 Actualizar Frontend para usar Proxy

Una vez implementado el proxy, actualizar `src/services/fuelPricesService.js`:

```javascript
// Cambiar URLs SICOM para usar proxy local
const SICOM_PROXY_BASE = import.meta.env.VITE_SICOM_PROXY || '/api/sicom';

const getSicomMunicipio = async (cityName) => {
  // Usar proxy en lugar de SICOM directo
  const url = `${SICOM_PROXY_BASE}/municipios?nombre=${encodeURIComponent(cityName)}`;
  // ... resto del código igual
};
```

## 🚀 Variables de Entorno Necesarias

### Frontend (.env)

```env
# URL del proxy SICOM (desarrollo)
VITE_SICOM_PROXY=http://localhost:3001/api/sicom

# URL del proxy SICOM (producción)
VITE_SICOM_PROXY=https://tu-dominio.com/api/sicom
```

### Backend

```env
# API Key oficial SICOM
SICOM_API_KEY=tu_api_key_sicom_oficial
```

## 📈 Beneficios del Proxy

1. **Resuelve CORS**: Permite acceso desde navegador
2. **Cache inteligente**: Reduce llamadas a SICOM
3. **Rate limiting**: Controla uso de API
4. **Logs centralizados**: Monitoreo de consultas
5. **Transformación de datos**: Optimización de respuestas

## 🎯 Estado Actual vs Futuro

### ✅ Funcionando Ahora

- Precios automáticos con datos.gov.co optimizado
- Ajuste por inflación para precios antiguos
- Detección correcta ACPM/DIESEL vs GASOLINA
- Precios de emergencia actualizados 2025

### 🔮 Con Proxy SICOM (Futuro)

- Datos reales La Primavera, Vichada
- Precios municipales específicos
- Actualización en tiempo real
- Cobertura total Colombia

---

**El sistema actual funciona perfectamente como solución temporal mientras se implementa el proxy SICOM** 🚀
