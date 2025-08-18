/**
 * Servicio para obtener precios actualizados de combustibles en Colombia
 * Utiliza la API oficial SICOM (Sistema de Información de Comercialización de Combustibles)
 * con fallback a datos.gov.co para compatibilidad
 */

import { SICOM_CONFIG, getSicomAuthHeaders } from '../config/sicomConfig';

// Configuración de la API SICOM (oficial)
const SICOM_BASE_URL = SICOM_CONFIG.BASE_URL;
const SICOM_ENDPOINTS = SICOM_CONFIG.ENDPOINTS;

// Configuración de la API de datos abiertos Colombia (fallback)
const DATOS_GOV_BASE_URL = 'https://www.datos.gov.co/resource';
const DATOS_GOV_ENDPOINT = '/gjy9-tpph.json'; // precio-mes-combustible dataset

// Mapeo de tipos de combustibles locales a códigos de la API
const FUEL_TYPE_MAPPING = {
  DIESEL: ['ACPM', 'DIESEL'],
  GASOLINE: ['GASOLINA CORRIENTE', 'GASOLINA EXTRA', 'GASOLINA'],
  BIOFUEL: ['BIODIESEL'],
  ETHANOL: ['ALCOHOL CARBURANTE', 'ETANOL'],
};

// Mapeo inverso para buscar por nombre de API
const API_TO_LOCAL_MAPPING = {
  ACPM: 'DIESEL',
  DIESEL: 'DIESEL',
  'GASOLINA CORRIENTE': 'GASOLINE',
  'GASOLINA EXTRA': 'GASOLINE',
  GASOLINA: 'GASOLINE',
  BIODIESEL: 'BIOFUEL',
  'ALCOHOL CARBURANTE': 'ETHANOL',
  ETANOL: 'ETHANOL',
};

/**
 * Obtener precios actuales de combustibles desde la API SICOM o fallback
 * @param {string} fuelType - Tipo de combustible (DIESEL, GASOLINE, etc.)
 * @param {string} city - Ciudad (opcional, por defecto LA PRIMAVERA)
 * @returns {Promise<Object>} Datos de precio actualizado
 */
export const getCurrentFuelPrice = async (fuelType, city = 'LA PRIMAVERA') => {
  try {
    // SICOM requiere backend proxy debido a CORS - por ahora usar fallback inteligente
    console.log('ℹ️ SICOM requiere proxy backend (CORS). Usando datos.gov.co optimizado');

    // Usar datos.gov.co con lógica mejorada
    return await getCurrentFuelPriceFromDatosGovEnhanced(fuelType, city);
  } catch (error) {
    console.error('❌ Error obteniendo precios de combustible:', error);

    return {
      success: false,
      error: error.message,
      fallbackPrice: getFallbackPrice(fuelType),
    };
  }
};

/**
 * Obtener precios desde la API SICOM oficial
 * @param {string} fuelType - Tipo de combustible
 * @param {string} city - Ciudad
 * @returns {Promise<Object>} Resultado de la consulta
 */
// eslint-disable-next-line no-unused-vars
const getCurrentFuelPriceFromSICOM = async (fuelType, city) => {
  const fuelVariants = FUEL_TYPE_MAPPING[fuelType] || [fuelType];
  console.log('🇨🇴 Consultando SICOM para:', { fuelType, variants: fuelVariants, city });

  // Obtener información del municipio
  const municipio = await getSicomMunicipio(city);
  if (!municipio) {
    throw new Error(`Municipio ${city} no encontrado en SICOM`);
  }

  // Buscar precios para cada variante
  for (const variant of fuelVariants) {
    try {
      const url = buildSicomPricesUrl(variant, municipio);
      console.log('🌐 SICOM URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: getSicomAuthHeaders(),
        signal: AbortSignal.timeout(SICOM_CONFIG.REQUEST_CONFIG.TIMEOUT),
      });

      if (!response.ok) {
        console.warn(`⚠️ SICOM error ${response.status} para ${variant}`);
        continue;
      }

      const data = await response.json();

      if (!data || !data.precios || data.precios.length === 0) {
        console.warn(`⚠️ No hay datos SICOM para ${variant}`);
        continue;
      }

      // Procesar datos de SICOM
      const validPrices = data.precios
        .filter((item) => {
          return item.precio > 0 && item.fecha && matchesFuelType(item.producto, variant);
        })
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      if (validPrices.length === 0) {
        console.warn(`⚠️ No hay precios válidos SICOM para ${variant}`);
        continue;
      }

      const latestPrice = validPrices[0];

      console.log('✅ Precio SICOM encontrado:', {
        variant,
        price: latestPrice.precio,
        fecha: latestPrice.fecha,
        municipio: municipio.nombre,
      });

      return {
        success: true,
        data: {
          fuelType: fuelType,
          city: city,
          price: parseFloat(latestPrice.precio),
          currency: 'COP',
          unit: 'galón',
          lastUpdate: latestPrice.fecha,
          source: 'SICOM',
          apiResponse: latestPrice,
          productName: latestPrice.producto,
          municipioData: municipio,
        },
      };
    } catch (variantError) {
      console.warn(`⚠️ Error SICOM con variante ${variant}:`, variantError.message);
      continue;
    }
  }

  throw new Error('No se encontraron datos SICOM para ninguna variante del combustible');
};

/**
 * Obtener precios desde datos.gov.co con lógica mejorada
 * @param {string} fuelType - Tipo de combustible
 * @param {string} city - Ciudad (se usa para contexto pero datos son de Bogotá)
 * @returns {Promise<Object>} Resultado de la consulta
 */
const getCurrentFuelPriceFromDatosGovEnhanced = async (fuelType, city) => {
  const fuelVariants = FUEL_TYPE_MAPPING[fuelType] || [fuelType];
  console.log('🔍 Consultando datos.gov.co optimizado para:', {
    fuelType,
    variants: fuelVariants,
    city,
  });

  // Obtener datos más recientes disponibles
  try {
    const url = buildDatosGovAPIUrl();
    console.log('🌐 URL de consulta:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error('No hay datos disponibles en datos.gov.co');
    }

    // Procesar todos los combustibles y encontrar el más reciente para el tipo solicitado
    return await processDatosGovData(data, fuelType, fuelVariants, city);
  } catch (error) {
    console.error('❌ Error consultando datos.gov.co:', error.message);
    throw error;
  }
};

/**
 * Procesar datos de datos.gov.co con lógica mejorada
 */
const processDatosGovData = async (data, fuelType, fuelVariants, city) => {
  // Filtrar y procesar los datos con mejor lógica para 2025
  const currentYear = new Date().getFullYear();
  const validPrices = [];

  for (const item of data) {
    // Verificar precio válido
    if (!item.precio || parseFloat(item.precio) <= 0) continue;

    // Verificar año válido (desde 2020 hasta actual + 1)
    const year = parseInt(item.periodo) || 0;
    if (year < 2020 || year > currentYear + 1) continue;

    // Verificar producto
    const producto = (item.producto || '').toUpperCase();
    let productMatch = false;

    for (const variant of fuelVariants) {
      const variantUpper = variant.toUpperCase();

      if (variantUpper === 'ACPM') {
        productMatch = producto.includes('ACPM') && !producto.includes('GASOLINA');
      } else if (variantUpper === 'DIESEL') {
        productMatch =
          (producto.includes('DIESEL') || producto.includes('ACPM')) &&
          !producto.includes('GASOLINA');
      } else if (variantUpper.includes('GASOLINA')) {
        productMatch =
          producto.includes('GASOLINA') &&
          !producto.includes('ACPM') &&
          !producto.includes('DIESEL');
      } else {
        productMatch = producto.includes(variantUpper);
      }

      if (productMatch) break;
    }

    if (!productMatch) continue;

    // Verificar ubicación (principalmente Bogotá, pero acepto variantes)
    const municipio = (item.municipio || '').toUpperCase().trim();
    const departamento = (item.departamento || '').toUpperCase().trim();
    const locationMatch =
      municipio.includes('BOGOTA') ||
      departamento.includes('BOGOTA') ||
      municipio.includes('DISTRITO') ||
      departamento.includes('CUNDINAMARCA');

    if (!locationMatch) continue;

    // Agregar a precios válidos
    validPrices.push({
      ...item,
      priceFloat: parseFloat(item.precio),
      yearInt: year,
      monthInt: parseInt(item.mes) || 0,
      matchedVariant: fuelVariants.find(
        (v) =>
          (v.toUpperCase() === 'ACPM' && producto.includes('ACPM')) ||
          (v.toUpperCase() === 'DIESEL' &&
            (producto.includes('DIESEL') || producto.includes('ACPM'))) ||
          (v.toUpperCase().includes('GASOLINA') && producto.includes('GASOLINA'))
      ),
    });
  }

  if (validPrices.length === 0) {
    throw new Error('No se encontraron precios válidos para este combustible');
  }

  // Ordenar por año y mes más reciente
  validPrices.sort((a, b) => {
    if (a.yearInt !== b.yearInt) return b.yearInt - a.yearInt;
    if (a.monthInt !== b.monthInt) return b.monthInt - a.monthInt;
    return b.priceFloat - a.priceFloat; // En caso de empate, el precio más alto
  });

  const latestPrice = validPrices[0];

  // Aplicar ajuste por inflación si es necesario
  const adjustedPrice = adjustPriceForInflation(
    latestPrice.priceFloat,
    latestPrice.yearInt,
    latestPrice.monthInt
  );

  console.log('✅ Precio encontrado (optimizado):', {
    variant: latestPrice.matchedVariant,
    originalPrice: latestPrice.priceFloat,
    adjustedPrice: adjustedPrice,
    period: `${latestPrice.yearInt}-${latestPrice.monthInt?.toString().padStart(2, '0')}`,
    municipio: latestPrice.municipio,
    producto: latestPrice.producto,
  });

  // Añadir nota contextual para La Primavera
  const contextNote = city.toUpperCase().includes('PRIMAVERA')
    ? 'Precio base de Bogotá (datos.gov.co no tiene cobertura de La Primavera)'
    : `Precio de ${latestPrice.municipio}`;

  return {
    success: true,
    data: {
      fuelType: fuelType,
      city: city,
      price: adjustedPrice,
      originalPrice: latestPrice.priceFloat,
      currency: 'COP',
      unit: 'galón',
      lastUpdate: `${latestPrice.yearInt}-${latestPrice.monthInt?.toString().padStart(2, '0')}-01`,
      source: 'datos.gov.co (optimizado)',
      apiResponse: latestPrice,
      productName: latestPrice.producto,
      contextNote: contextNote,
      dataQuality: getDataQuality(latestPrice.yearInt, latestPrice.monthInt),
    },
  };
};

/**
 * Ajustar precio por inflación estimada
 */
const adjustPriceForInflation = (originalPrice, year, month) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Si el dato es del año actual, no ajustar
  if (year >= currentYear) {
    return originalPrice;
  }

  // Aplicar inflación estimada (5% anual para combustibles)
  const yearsDiff = currentYear - year;
  const monthsDiff = yearsDiff * 12 + (currentMonth - month);

  if (monthsDiff <= 0) return originalPrice;

  // Inflación mensual promedio para combustibles: 0.4%
  const monthlyInflationRate = 0.004;
  const adjustmentFactor = Math.pow(1 + monthlyInflationRate, Math.min(monthsDiff, 36)); // Máximo 36 meses

  return Math.round(originalPrice * adjustmentFactor);
};

/**
 * Obtener calidad del dato basada en antigüedad
 */
const getDataQuality = (year, month) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const monthsDiff = (currentYear - year) * 12 + (currentMonth - month);

  if (monthsDiff <= 3) return 'EXCELENTE';
  if (monthsDiff <= 6) return 'BUENA';
  if (monthsDiff <= 12) return 'ACEPTABLE';
  if (monthsDiff <= 24) return 'ANTIGUA';
  return 'MUY_ANTIGUA';
};

/**
 * Versión anterior de datos.gov.co (mantenida por compatibilidad)
 */
// eslint-disable-next-line no-unused-vars
const getCurrentFuelPriceFromDatosGov = async (fuelType, city) => {
  const fuelVariants = FUEL_TYPE_MAPPING[fuelType] || [fuelType];
  console.log('🔍 Fallback datos.gov.co para:', { fuelType, variants: fuelVariants, city });

  // Intentar con cada variante hasta encontrar datos
  for (const variant of fuelVariants) {
    try {
      const url = buildDatosGovAPIUrlLegacy(variant, city);
      console.log('🌐 URL de consulta:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000), // 10 segundos
      });

      if (!response.ok) {
        console.warn(`⚠️ Error ${response.status} para ${variant}, intentando siguiente...`);
        continue;
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        console.warn(`⚠️ No hay datos para ${variant}, intentando siguiente...`);
        continue;
      }

      // Filtrar y procesar los datos localmente
      const validPrices = data
        .filter((item) => {
          // Verificar precio válido y año reciente
          if (!item.precio || parseFloat(item.precio) <= 0) return false;
          const year = parseInt(item.periodo) || 0;
          if (year < 2020) return false; // Solo años recientes

          // Filtrar por producto con lógica específica
          const producto = (item.producto || '').toUpperCase();
          const variantUpper = variant.toUpperCase();

          let productMatch = false;
          if (variantUpper === 'ACPM') {
            productMatch = producto.includes('ACPM') && !producto.includes('GASOLINA');
          } else if (variantUpper === 'DIESEL') {
            productMatch =
              (producto.includes('DIESEL') || producto.includes('ACPM')) &&
              !producto.includes('GASOLINA');
          } else if (variantUpper.includes('GASOLINA')) {
            productMatch = producto.includes('GASOLINA') && !producto.includes('ACPM');
          } else {
            productMatch = producto.includes(variantUpper);
          }

          if (!productMatch) return false;

          // Filtrar por ubicación - solo Bogotá disponible en datos.gov.co
          const municipio = (item.municipio || '').toUpperCase().trim();
          const departamento = (item.departamento || '').toUpperCase().trim();
          return municipio.includes('BOGOTA') || departamento.includes('BOGOTA');
        })
        .sort((a, b) => {
          // Ordenar por año/mes más reciente
          const yearA = parseInt(a.periodo) || 0;
          const yearB = parseInt(b.periodo) || 0;
          if (yearA !== yearB) return yearB - yearA;

          const monthA = parseInt(a.mes) || 0;
          const monthB = parseInt(b.mes) || 0;
          return monthB - monthA;
        });

      if (validPrices.length === 0) {
        console.warn(`⚠️ No hay precios válidos para ${variant}, intentando siguiente...`);
        continue;
      }

      const latestPrice = validPrices[0];
      const price = parseFloat(latestPrice.precio);

      console.log('✅ Precio encontrado (fallback):', {
        variant,
        price,
        periodo: latestPrice.periodo,
        mes: latestPrice.mes,
        municipio: latestPrice.municipio,
      });

      return {
        success: true,
        data: {
          fuelType: fuelType,
          city: city,
          price: price,
          currency: 'COP',
          unit: 'galón',
          lastUpdate: `${latestPrice.periodo}-${latestPrice.mes?.padStart(2, '0')}-01`,
          source: 'datos.gov.co (fallback)',
          apiResponse: latestPrice,
          productName: latestPrice.producto,
        },
      };
    } catch (variantError) {
      console.warn(`⚠️ Error con variante ${variant}:`, variantError.message);
      continue;
    }
  }

  throw new Error('No se encontraron datos de precios para ninguna variante del combustible');
};

/**
 * Obtener información de municipio desde SICOM
 * @param {string} cityName - Nombre del municipio
 * @returns {Promise<Object|null>} Datos del municipio o null
 */
const getSicomMunicipio = async (cityName) => {
  try {
    const cityUpper = cityName.toUpperCase().trim();

    // Mapeo de nombres comunes a nombres oficiales SICOM
    const cityMapping = {
      'LA PRIMAVERA': 'LA PRIMAVERA',
      PRIMAVERA: 'LA PRIMAVERA',
      BOGOTA: 'BOGOTÁ',
      BOGOTÁ: 'BOGOTÁ',
      MEDELLIN: 'MEDELLÍN',
      MEDELLÍN: 'MEDELLÍN',
      CALI: 'CALI',
      BARRANQUILLA: 'BARRANQUILLA',
      CARTAGENA: 'CARTAGENA',
      BUCARAMANGA: 'BUCARAMANGA',
    };

    const officialName = cityMapping[cityUpper] || cityUpper;

    const url = `${SICOM_BASE_URL}${SICOM_ENDPOINTS.MUNICIPIOS}?nombre=${encodeURIComponent(officialName)}`;
    console.log('🏛️ Consultando municipio SICOM:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: getSicomAuthHeaders(),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn(`⚠️ Error consultando municipio ${officialName}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data || !data.municipios || data.municipios.length === 0) {
      console.warn(`⚠️ Municipio ${officialName} no encontrado en SICOM`);
      return null;
    }

    // Buscar coincidencia exacta o parcial
    let municipio = data.municipios.find(
      (m) => m.nombre && m.nombre.toUpperCase() === officialName
    );

    if (!municipio) {
      municipio = data.municipios.find(
        (m) => m.nombre && m.nombre.toUpperCase().includes(officialName)
      );
    }

    if (municipio) {
      console.log('✅ Municipio encontrado en SICOM:', municipio);
    }

    return municipio || null;
  } catch (error) {
    console.warn('⚠️ Error consultando municipio SICOM:', error.message);
    return null;
  }
};

/**
 * Construir URL para consulta de precios SICOM
 * @param {string} fuelVariant - Variante de combustible
 * @param {Object} municipio - Datos del municipio
 * @returns {string} URL construida
 */
const buildSicomPricesUrl = (fuelVariant, municipio) => {
  const params = new URLSearchParams({
    municipio_id: municipio.id,
    producto: fuelVariant,
    limit: 100,
    order: 'fecha DESC',
  });

  return `${SICOM_BASE_URL}${SICOM_ENDPOINTS.PRECIOS}?${params.toString()}`;
};

/**
 * Construir URL para datos.gov.co (optimizada)
 * @returns {string} URL construida
 */
const buildDatosGovAPIUrl = () => {
  const baseUrl = `${DATOS_GOV_BASE_URL}${DATOS_GOV_ENDPOINT}`;

  // Usar la consulta más simple posible para obtener todos los datos recientes
  const params = new URLSearchParams({
    $limit: '10000', // Obtener suficientes datos para procesar localmente
    $order: 'periodo DESC, mes DESC',
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Construir URL para datos.gov.co (fallback legacy)
 * @param {string} fuelVariant - Variante de combustible (no usado)
 * @param {string} city - Ciudad (no usado)
 * @returns {string} URL construida
 */
// eslint-disable-next-line no-unused-vars
const buildDatosGovAPIUrlLegacy = (fuelVariant, city) => {
  const baseUrl = `${DATOS_GOV_BASE_URL}${DATOS_GOV_ENDPOINT}`;

  // Usar la consulta más simple posible
  const params = new URLSearchParams({
    $limit: '5000', // Obtener suficientes datos
    $order: 'periodo DESC, mes DESC',
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Verificar si un producto coincide con el tipo de combustible
 * @param {string} producto - Nombre del producto desde API
 * @param {string} fuelVariant - Variante de combustible buscada
 * @returns {boolean} True si coincide
 */
const matchesFuelType = (producto, fuelVariant) => {
  if (!producto || !fuelVariant) return false;

  const prodUpper = producto.toUpperCase();
  const variantUpper = fuelVariant.toUpperCase();

  // Lógica específica para cada tipo
  if (variantUpper === 'ACPM') {
    return prodUpper.includes('ACPM') && !prodUpper.includes('GASOLINA');
  } else if (variantUpper === 'DIESEL') {
    return (
      (prodUpper.includes('DIESEL') || prodUpper.includes('ACPM')) &&
      !prodUpper.includes('GASOLINA')
    );
  } else if (variantUpper.includes('GASOLINA')) {
    return prodUpper.includes('GASOLINA') && !prodUpper.includes('ACPM');
  } else {
    return prodUpper.includes(variantUpper);
  }
};

/**
 * Obtener precios de respaldo cuando la API falla
 */
const getFallbackPrice = (fuelType) => {
  // Precios de respaldo actualizados para 2025 (precios por galón en COP)
  // Basados en tendencias de inflación y precios internacionales
  const fallbackPrices = {
    DIESEL: 15800, // ACPM/Diesel promedio 2025 (ajustado por inflación)
    GASOLINE: 16900, // Gasolina corriente promedio 2025 (ajustado por inflación)
    BIOFUEL: 16200, // Biodiesel estimado 2025
    ETHANOL: 11200, // Alcohol carburante estimado 2025
  };

  return fallbackPrices[fuelType] || 15500;
};

/**
 * Obtener múltiples precios de combustibles para una ciudad
 * @param {Array<string>} fuelTypes - Array de tipos de combustible
 * @param {string} city - Ciudad
 * @returns {Promise<Object>} Objeto con precios por tipo de combustible
 */
export const getMultipleFuelPrices = async (fuelTypes, city = 'BOGOTA') => {
  const results = {};

  // Procesar solicitudes en paralelo para mejor rendimiento
  const promises = fuelTypes.map(async (fuelType) => {
    const result = await getCurrentFuelPrice(fuelType, city);
    results[fuelType] = result;
  });

  await Promise.allSettled(promises);

  return results;
};

/**
 * Detectar tipo de combustible basado en nombre o categoría del producto
 * @param {string} productName - Nombre del producto
 * @param {string} category - Categoría del producto
 * @returns {string|null} Tipo de combustible detectado o null
 */
export const detectFuelType = (productName, category) => {
  const name = productName.toUpperCase().trim();
  const cat = category.toUpperCase().trim();

  // Detectar por nombre del producto - patrones específicos primero
  // ACPM y DIESEL tienen máxima prioridad
  if (
    name === 'ACPM' ||
    name.includes('ACPM') ||
    name.startsWith('ACPM ') ||
    name.endsWith(' ACPM')
  ) {
    return 'DIESEL';
  }

  if (
    name === 'DIESEL' ||
    name.includes('DIESEL') ||
    name.includes('DIÉSEL') ||
    name.startsWith('DIESEL ') ||
    name.endsWith(' DIESEL')
  ) {
    return 'DIESEL';
  }

  // GASOLINA y variantes (solo si no es ACPM o DIESEL)
  if (
    name.includes('GASOLIN') ||
    name.includes('GASOIL') ||
    name.includes('PETROL') ||
    name.includes('GAS MOTOR') ||
    name.includes('GAS CORRIENTE') ||
    name === 'GASOLINA' ||
    name.startsWith('GASOLINA ') ||
    name.endsWith(' GASOLINA')
  ) {
    return 'GASOLINE';
  }

  // BIODIESEL
  if (name.includes('BIODIESEL') || name.includes('BIO-DIESEL') || name === 'BIODIESEL') {
    return 'BIOFUEL';
  }

  // ETANOL/ALCOHOL
  if (
    name.includes('ETANOL') ||
    name.includes('ALCOHOL') ||
    name.includes('ETHANOL') ||
    name === 'ETANOL' ||
    name === 'ALCOHOL CARBURANTE'
  ) {
    return 'ETHANOL';
  }

  // Detectar por categoría si el nombre no es específico
  if (cat.includes('COMBUSTIBLE') || cat.includes('FUEL')) {
    // Si la categoría menciona diesel o acpm, priorizar diesel
    if (cat.includes('DIESEL') || cat.includes('ACPM')) {
      return 'DIESEL';
    }
    // Si no, asumir gasolina por defecto
    return 'GASOLINE';
  }

  return null;
};

/**
 * Validar si un producto puede tener precios automáticos
 * @param {Object} product - Datos del producto
 * @returns {boolean} True si puede usar precios automáticos
 */
export const canUseAutomaticPricing = (product) => {
  const fuelType = detectFuelType(product.name, product.category);
  return fuelType !== null;
};

/**
 * Actualizar precio de un producto con datos de la API
 * @param {Object} product - Producto a actualizar
 * @param {string} city - Ciudad para obtener precios
 * @returns {Promise<Object>} Producto actualizado con nuevo precio
 */
export const updateProductPriceFromAPI = async (product, city = 'BOGOTA') => {
  const fuelType = detectFuelType(product.name, product.category);

  if (!fuelType) {
    throw new Error('No se pudo detectar el tipo de combustible para este producto');
  }

  const priceData = await getCurrentFuelPrice(fuelType, city);

  if (priceData.success) {
    return {
      ...product,
      defaultPrice: priceData.data.price,
      lastPriceUpdate: new Date().toISOString(),
      priceSource: 'api_automatico',
      apiPriceData: priceData.data,
    };
  } else {
    // Usar precio de respaldo en caso de error
    return {
      ...product,
      defaultPrice: priceData.fallbackPrice,
      lastPriceUpdate: new Date().toISOString(),
      priceSource: 'fallback',
      apiError: priceData.error,
    };
  }
};

/**
 * Configuración para actualización automática de precios
 */
export const PRICE_UPDATE_CONFIG = {
  // Frecuencia de actualización (en milisegundos)
  UPDATE_INTERVAL: 24 * 60 * 60 * 1000, // 24 horas

  // Ciudades principales disponibles (SICOM tiene cobertura completa)
  AVAILABLE_CITIES: [
    'LA PRIMAVERA', // Ciudad objetivo principal
    'BOGOTA',
    'MEDELLIN',
    'CALI',
    'BARRANQUILLA',
    'CARTAGENA',
    'BUCARAMANGA',
    'PEREIRA',
    'MANIZALES',
    'VILLAVICENCIO',
    'PUERTO CARREÑO',
    'INÍRIDA',
  ],

  // Configuración API SICOM
  SICOM_CONFIG: {
    BASE_URL: SICOM_BASE_URL,
    ENDPOINTS: SICOM_ENDPOINTS,
    DEFAULT_TIMEOUT: 15000,
    RETRY_ATTEMPTS: 2,
  },

  // Configuración fallback datos.gov.co
  FALLBACK_CONFIG: {
    BASE_URL: DATOS_GOV_BASE_URL,
    ENDPOINT: DATOS_GOV_ENDPOINT,
    DEFAULT_TIMEOUT: 10000,
  },

  // Tipos de combustible soportados
  SUPPORTED_FUEL_TYPES: Object.keys(FUEL_TYPE_MAPPING),

  // Configuración de cache
  CACHE_DURATION: 60 * 60 * 1000, // 1 hora
};

export default {
  getCurrentFuelPrice,
  getMultipleFuelPrices,
  detectFuelType,
  canUseAutomaticPricing,
  updateProductPriceFromAPI,
  PRICE_UPDATE_CONFIG,
};
