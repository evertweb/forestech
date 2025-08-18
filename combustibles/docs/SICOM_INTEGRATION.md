# Integración API SICOM - Precios de Combustibles

## 📋 Resumen

Se ha implementado la integración con la API oficial **SICOM** (Sistema de Información de Comercialización de Combustibles) del gobierno colombiano para obtener precios actualizados de combustibles con cobertura completa en Colombia, incluyendo **La Primavera, Vichada**.

## 🎯 Características Implementadas

### ✅ API SICOM Principal

- **Fuente oficial**: Sistema gubernamental completo
- **Cobertura total**: Todos los municipios de Colombia
- **Datos actualizados**: Precios en tiempo real
- **Soporte La Primavera**: Municipio solicitado incluido

### 🔄 Fallback Inteligente

- **Datos.gov.co como respaldo**: Si SICOM no está disponible
- **Precios estimados**: Sistema de precios de emergencia
- **Sin interrupciones**: El sistema siempre devuelve un precio

### 🏙️ Municipios Soportados

- **La Primavera** (Vichada) - Municipio objetivo principal
- **Bogotá** - Capital
- **Medellín** - Antioquia
- **Cali** - Valle del Cauca
- **Barranquilla** - Atlántico
- **Cartagena** - Bolívar
- **Bucaramanga** - Santander
- **Todos los demás municipios** vía SICOM

## 🔧 Configuración API Key

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# API Key oficial SICOM (opcional pero recomendada)
VITE_SICOM_API_KEY=tu_api_key_aqui
```

### Obtener API Key SICOM

1. Visitar: https://eds.sicom.gov.co/
2. Registrarse como desarrollador
3. Solicitar API key para aplicación comercial
4. Configurar en variable de entorno

**Nota**: Sin API key, el sistema funciona con acceso público limitado y fallback a datos.gov.co.

**Variable correcta para Vite**: `VITE_SICOM_API_KEY` (no `REACT_APP_*`)

## 🚀 Funcionalidades

### Precios Automáticos

- **Detección inteligente**: ACPM/DIESEL tiene máxima prioridad
- **Sincronización automática**: Al crear productos de combustible
- **Actualización manual**: Botón "Sincronizar" en formularios
- **Cache inteligente**: Evita consultas excesivas

### Tipos de Combustible Soportados

- **DIESEL/ACPM**: Combustible diésel y ACPM
- **GASOLINA**: Gasolina corriente y extra
- **BIODIESEL**: Combustibles bio
- **ETANOL**: Alcohol carburante

### Ubicación por Defecto

- **LA PRIMAVERA** configurado como municipio principal
- **Cambio dinámico**: Se puede cambiar por código si es necesario

## 📁 Archivos Modificados

### Servicios Principales

- `src/services/fuelPricesService.js` - Lógica principal SICOM + fallback
- `src/config/sicomConfig.js` - Configuración API y autenticación
- `src/utils/testSicomIntegration.js` - Herramientas de prueba

### Componentes Actualizados

- `src/components/Products/ProductWizard.jsx` - Usa LA PRIMAVERA por defecto
- `src/components/Services/` - Servicios de actualización automática

## 🧪 Pruebas

### Test de Conectividad

```javascript
import { quickConnectivityTest } from '../utils/testSicomIntegration';

// Ejecutar prueba rápida
const isConnected = await quickConnectivityTest();
console.log('SICOM disponible:', isConnected);
```

### Test Completo

```javascript
import { runSicomIntegrationTests } from '../utils/testSicomIntegration';

// Ejecutar todas las pruebas
const results = await runSicomIntegrationTests();
```

## 🔄 Flujo de Funcionamiento

1. **Usuario crea producto DIESEL/ACPM**
2. **Sistema detecta tipo de combustible**
3. **Consulta automática a SICOM API** (La Primavera)
4. **Si SICOM falla** → Fallback a datos.gov.co (Bogotá)
5. **Si ambos fallan** → Precio estimado predefinido
6. **Precio se actualiza automáticamente** en el formulario

## 📊 Monitoreo y Logs

### Console Logs Informativos

- `🇨🇴 Consultando SICOM para: ...` - Inicio consulta SICOM
- `✅ Precio SICOM encontrado: ...` - Éxito SICOM
- `⚠️ SICOM no disponible, usando fallback` - Cambio a fallback
- `🔄 Usando datos.gov.co como fallback` - Uso alternativo

### Estados de Respuesta

```javascript
{
  success: true/false,
  data: {
    fuelType: 'DIESEL',
    city: 'LA PRIMAVERA',
    price: 12500,
    currency: 'COP',
    unit: 'galón',
    source: 'SICOM', // o 'datos.gov.co (fallback)' o 'fallback'
    lastUpdate: '2025-01-15T10:30:00Z'
  },
  error: 'mensaje de error si aplica',
  fallbackPrice: 12500 // si APIs fallan
}
```

## 🎯 Beneficios para La Primavera

1. **Precios locales reales** - Datos específicos del municipio
2. **Actualización automática** - Sin intervención manual
3. **Disponibilidad 24/7** - Sistema de fallbacks garantiza funcionamiento
4. **Datos oficiales** - Fuente gubernamental confiable
5. **Cobertura completa** - Todos los tipos de combustible

## 🚨 Solución de Problemas

### API Key No Configurada

- **Síntoma**: Warning en consola sobre API key
- **Solución**: Configurar `VITE_SICOM_API_KEY` en `.env`
- **Impacto**: Funciona con acceso limitado

### SICOM No Responde

- **Síntoma**: Logs de fallback a datos.gov.co
- **Solución**: Normal, el sistema está diseñado para esto
- **Impacto**: Usa datos de Bogotá en su lugar

### Precios No Se Actualizan

- **Síntoma**: Precio se mantiene en 0 o valor anterior
- **Solución**: Verificar conectividad de red
- **Alternativa**: Usar botón "Sincronizar" manual

### Municipio No Encontrado

- **Síntoma**: Error "Municipio no encontrado en SICOM"
- **Solución**: Verificar nombre exacto del municipio
- **Fallback**: Automáticamente usa datos de Bogotá

## 📞 Soporte

Para problemas específicos:

1. Revisar logs en consola del navegador
2. Verificar configuración de variables de entorno
3. Probar conectividad con test scripts
4. Verificar funcionamiento de fallbacks

---

✅ **La integración SICOM está lista para La Primavera, Vichada** 🇨🇴
